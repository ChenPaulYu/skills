/**
 * cursor-compat.mjs — the Cursor compiler: Claude-specific frontmatter/body lowering.
 *
 * `scripts/build-cursor.mjs` owns filesystem discovery/copy/walk; every Cursor-specific
 * text transform lives here. Cursor is closer to Claude than Codex is, so this lowerer
 * is thinner: keep `disable-model-invocation`, map AskUserQuestion → AskQuestion, map
 * Agent/subagent_type → Task, keep the browser-verifier as a plugin agent rather than
 * a Codex custom-agent toml.
 */
const FRONTMATTER_RE = /^(---\n)([\s\S]*?)(\n---\n)/;
const MODEL_SONNET_LINE_RE = /^model:\s*sonnet\s*$/m;

const EXECUTION_TIER_NOTE =
  "> **Mechanical-tier skill.** The work here is mechanical (a sweep, format, scan, or render from an already-structured source) rather than open-ended judgment. Dispatch it via `Task` on a cheap model when a worker is available; otherwise run it inline and note the degradation in your report.";

export const CURSOR_INTERACTIVE_CHOICE_CONTRACT = `> **Interactive choice contract (Cursor).** Build the choices from the source-owned option labels and consequences in the offer section below; do not invent generic replacements. Present them with the \`AskQuestion\` tool as mutually exclusive options and label a recommendation only when that section does. Preserve its save/done/later opt-out.
>
> After calling \`AskQuestion\`, end the turn immediately. Execute nothing downstream until the user makes an explicit choice. This offer is one-shot: after a choice, decline, or opt-out, do not re-offer it. Selecting a continuation whose generated skill is marked \`disable-model-invocation: true\` counts as that continuation's explicit invocation.`;

export const CURSOR_BROWSER_VERIFY_CONTRACT = `> **Browser-verify contract (Cursor).** When this plugin's \`agents/browser-verifier.md\` is loaded, dispatch the pass via \`Task\` with \`subagent_type: "browser-verifier"\`. Otherwise execute the identical pass directly in the current session. In either mode, first check for a project browser-verify override; absent one, use \`agent-browser\`, and verify the chosen helper is present before driving anything.
>
> Missing selected helper/override → return \`MISSING-TOOL\` immediately and never install anything from inside this pass. Preserve the verifier verdict schema exactly: \`PASS | DRIFT | BLOCKED | MISSING-TOOL\`, plus \`reason\`, \`screenshots\`, \`console\`, and \`notes\`. Screenshot evidence is reported by filesystem path only — never inline base64 or image bytes. If the helper was opened, close it on every exit path before returning.`;

const INTERACTIVE_CHOICE_CONSUMERS = {
  "nav-do": "3. **Verify gate \u2014 the verification is unconditional; only its *auto-execution* is gated (ADR-114).**",
  "nav-plan": "### Stage 4 — Offer next action (don't make the user type the next command)",
  "nav-refactor": "### Step 8 — Offer next action (don't make the user type the next command)",
  "shape-elicit": "## Offer the next step (don't auto-run)",
  "shape-mockup": "## After the pick — offer the next step: track it · build it (don't auto-run)",
  "shape-dogfood": "## After the session — offer to route the findings (don't fix in place, don't auto-run)",
  "frame-first-principles": "## After the analysis — offer to route it (don't decide, don't auto-run)",
  "frame-dialectic": "## After the trial — offer to route it (don't decide, don't auto-run)",
};

const BROWSER_VERIFY_ANCHORS = {
  "shape-mockup": "## The render step is per-project — the browser-verify slot",
  "shape-dogfood": "## The session — use it for real, capture as you go (dogfood's own front)",
};

const WORKER_DISPATCH_RULES = [
  {
    find: "Invoke `Agent` with `subagent_type=general-purpose`.",
    replace: 'Dispatch a `Task` with `subagent_type: "generalPurpose"`.',
  },
  {
    find: "one message, multiple `Agent` calls; `subagent_type=Explore` — read-only is the point",
    replace:
      'one message, multiple read-only `Task` calls with `subagent_type: "generalPurpose"` — read-only is the point',
  },
];

const INTERACTIVE_CHOICE_PROSE_RULES = [
  { find: "a real `AskUserQuestion`", replace: "a real `AskQuestion`" },
  { find: "one `AskUserQuestion` confirmation", replace: "one `AskQuestion` confirmation" },
  { find: "one real `AskUserQuestion` for the whole batch", replace: "one real `AskQuestion` for the whole batch" },
  { find: "`AskUserQuestion`-style ask", replace: "`AskQuestion`-style ask" },
  { find: "`AskUserQuestion` listing", replace: "`AskQuestion` listing" },
  { find: "via `AskUserQuestion`", replace: "via `AskQuestion`" },
  { find: "an `AskUserQuestion` with", replace: "an `AskQuestion` with" },
  { find: "An `AskUserQuestion` next-action offer", replace: "An `AskQuestion` next-action offer" },
  { find: "an `AskUserQuestion`; one click", replace: "an `AskQuestion`; one click" },
  { find: "options via `AskUserQuestion`", replace: "options via `AskQuestion`" },
];

const BROWSER_VERIFY_PROSE_RULES = [
  {
    find: "dispatch the plugin's `browser-verifier` agent (model: sonnet)",
    replace: 'dispatch this plugin\'s `browser-verifier` agent via `Task` with `subagent_type: "browser-verifier"`',
  },
  {
    find: "dispatch the plugin's `browser-verifier` agent (mechanical-tier executor)",
    replace: 'dispatch this plugin\'s `browser-verifier` agent via `Task` with `subagent_type: "browser-verifier"`',
  },
  {
    find: "dispatch the plugin's `browser-verifier` agent (mechanical-tier executor role)",
    replace: 'dispatch this plugin\'s `browser-verifier` agent via `Task` with `subagent_type: "browser-verifier"`',
  },
  {
    find: "The slot's default *executor* is the plugin's [`agents/browser-verifier.md`](plugins/shape/agents/browser-verifier.md) (mechanical-tier executor).",
    replace:
      "The slot's default *executor* is this plugin's [`agents/browser-verifier.md`](../../agents/browser-verifier.md). Dispatch it via `Task` with `subagent_type: \"browser-verifier\"`.",
  },
];

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function injectBeforeUniqueAnchor(text, flat, anchor, contract, label) {
  if (!anchor) return text;
  const first = text.indexOf(anchor);
  const second = first === -1 ? -1 : text.indexOf(anchor, first + anchor.length);
  if (first === -1 || second !== -1) {
    const state = first === -1 ? "missing" : "not unique";
    throw new Error(`${label} anchor ${state} for ${flat}: ${JSON.stringify(anchor)}`);
  }
  return `${text.slice(0, first)}${contract}\n\n${text.slice(first)}`;
}

/**
 * Strips `model: sonnet` (Cursor skill frontmatter has no model field) and injects
 * the mechanical-tier note. Leaves `disable-model-invocation` in place — Cursor
 * supports it natively.
 */
export function lowerCursorFrontmatter(text) {
  const match = text.match(FRONTMATTER_RE);
  if (!match) return text;

  const [whole, open, rawFrontmatter, close] = match;
  const hadModelSonnet = MODEL_SONNET_LINE_RE.test(rawFrontmatter);
  const frontmatter = rawFrontmatter
    .split("\n")
    .filter((line) => !MODEL_SONNET_LINE_RE.test(line))
    .join("\n");

  const rest = text.slice(whole.length);
  const injected = hadModelSonnet ? `\n${EXECUTION_TIER_NOTE}\n` : "";
  return `${open}${frontmatter}${close}${injected}${rest}`;
}

export function lowerCursorWorkerProse(text) {
  let out = text;
  for (const rule of WORKER_DISPATCH_RULES) out = out.split(rule.find).join(rule.replace);
  return out
    .replace(/`model:\s*sonnet`/gi, "the mechanical-tier executor role")
    .replace(/\(model:\s*sonnet\)/gi, "(mechanical-tier executor)")
    .replace(/model:\s*sonnet/gi, "mechanical-tier executor role");
}

export function lowerCursorInteractiveChoiceProse(text) {
  let out = text;
  for (const rule of INTERACTIVE_CHOICE_PROSE_RULES) out = out.split(rule.find).join(rule.replace);
  return out.replace(/AskUserQuestion/g, "AskQuestion");
}

export function injectCursorInteractiveChoiceContract(text, flat) {
  return injectBeforeUniqueAnchor(
    text,
    flat,
    INTERACTIVE_CHOICE_CONSUMERS[flat],
    CURSOR_INTERACTIVE_CHOICE_CONTRACT,
    "interactive-choice",
  );
}

export function lowerCursorBrowserVerifyProse(text) {
  let out = text;
  for (const rule of BROWSER_VERIFY_PROSE_RULES) out = out.split(rule.find).join(rule.replace);
  return out;
}

export function injectCursorBrowserVerifyContract(text, flat) {
  return injectBeforeUniqueAnchor(
    text,
    flat,
    BROWSER_VERIFY_ANCHORS[flat],
    CURSOR_BROWSER_VERIFY_CONTRACT,
    "browser-verify",
  );
}

/**
 * Namespace flatten (`/nav:audit` → `nav-audit`) + reference re-root for a Cursor plugin
 * tree where each skill lives at `skills/<plugin>-<skill>/`.
 */
export function createCursorGuidanceLowerer({ plugins, skills }) {
  const pluginPattern = plugins.map(escapeRegExp).join("|");
  const skillPattern = skills.map(escapeRegExp).join("|");
  const NS = new RegExp(`/?\\b(${pluginPattern}):(${skillPattern})\\b`, "g");
  const REF_PATH = new RegExp(`plugins/(${pluginPattern})/skills/(${skillPattern})/references/`, "g");
  const PLUGIN_CLAUDE = new RegExp(`plugins/(?:${pluginPattern})/CLAUDE\\.md`, "g");

  function flatten(text) {
    return text.replace(NS, "$1-$2");
  }

  function lowerSkillGuidance(text, { plugin, skill }) {
    const sameRef = new RegExp(`plugins/${escapeRegExp(plugin)}/skills/${escapeRegExp(skill)}/references/`, "g");
    const pluginRefs = new RegExp(`plugins/${escapeRegExp(plugin)}/references/`, "g");
    const pluginAgents = new RegExp(`plugins/${escapeRegExp(plugin)}/agents/`, "g");
    return flatten(text)
      .replace(sameRef, "references/")
      .replace(REF_PATH, (_m, p, s) =>
        p === plugin ? `../${p}-${s}/references/` : `../../../${p}/skills/${p}-${s}/references/`,
      )
      .replace(pluginRefs, "../../references/")
      .replace(pluginAgents, "../../agents/")
      .replace(PLUGIN_CLAUDE, "the plugin conventions");
  }

  function lowerPluginExtraGuidance(text, plugin) {
    const pluginRefs = new RegExp(`plugins/${escapeRegExp(plugin)}/references/`, "g");
    const pluginAgents = new RegExp(`plugins/${escapeRegExp(plugin)}/agents/`, "g");
    return flatten(text)
      .replace(REF_PATH, (_m, p, s) => `../skills/${p}-${s}/references/`)
      .replace(pluginRefs, "")
      .replace(pluginAgents, "../agents/")
      .replace(PLUGIN_CLAUDE, "the plugin conventions");
  }

  return { flatten, lowerSkillGuidance, lowerPluginExtraGuidance };
}
