/**
 * codex-compat.mjs — the Codex compiler: Claude-specific frontmatter/body lowering.
 *
 * `scripts/build-codex.mjs` owns filesystem discovery/copy/walk only; every Codex-specific
 * text transform lives here as a named, independently-fixturable function:
 *
 *   lowerFrontmatter()          — strips `model: sonnet` / `disable-model-invocation` from
 *                                  frontmatter, injects the equivalent Codex-side body instruction
 *                                  so the intent isn't silently dropped.
 *   createProjectGuidanceLowerer() — the namespace-flatten / reference-reroot / CLAUDE.md→AGENTS.md
 *                                  rewrites (moved from build-codex.mjs), plus /init-assumption
 *                                  softening for project_guidance (no Claude-only command claims).
 *   lowerWorkerProse()           — replaces EXACT Claude worker-dispatch constructs (`Agent` calls,
 *                                  `subagent_type=...`, "sub-agent(s)") with Codex worker vocabulary,
 *                                  plus the remaining prose mentions of the two frontmatter fields
 *                                  lowerFrontmatter already stripped structurally. Never a blind
 *                                  global replace — every rule is a precise (pattern, replacement)
 *                                  pair; generic prose ("agent-navigability", "coding agent") is
 *                                  untouched because none of these patterns can match it.
 *   lowerInteractiveChoiceProse() — replaces exact `AskUserQuestion` constructs with host-neutral
 *                                  Codex interactive-chooser terminology in every compiled profile.
 *   injectInteractiveChoiceContract() — Phase 3: injects one executable chooser/fallback contract
 *                                  before each of the nine source-owned offer sections.
 *   lowerBrowserVerifyProse()     — Phase 4: replaces exact Claude runtime/browser-agent ownership
 *                                  claims with Codex custom-agent / project-artifact wording,
 *                                  without touching generic browser-helper prose.
 *   injectBrowserVerifyContract()  — Phase 4: injects one executable browser-verify contract
 *                                  before each browser-verify consumer section, using the source
 *                                  heading verbatim as the exact unique anchor.
 *   injectWorkerDispatchPointer() — Phase 2: for the dispatch-heavy skills only, inserts a
 *                                  short conditional pointer to the bundled Codex worker-dispatch
 *                                  reference. The heavy contract stays out of the always-read skill
 *                                  body until the agent is actually dispatching workers.
 *   detectUnsupported()           — scans compiled text for any remaining denylisted Claude-only
 *                                  token, sharing the manifest-driven rule list with
 *                                  scripts/lib/codex-compat-audit.mjs (no duplicated rule list).
 *
 * Capability table this module implements (see blueprints/plans/2026-07-13-codex-compatibility.md):
 *   explicit_invocation_only, mechanical_model_tier  → lowerFrontmatter + lowerWorkerProse
 *   worker_dispatch (Agent/subagent_type/sub-agent)  → lowerWorkerProse + injectWorkerDispatchPointer
 *   interactive_choice (AskUserQuestion)             → lowerInteractiveChoiceProse +
 *                                                       injectInteractiveChoiceContract
 *   browser_verify                                   → injectBrowserVerifyContract
 *   project_guidance (CLAUDE.md→AGENTS.md, /init)    → createProjectGuidanceLowerer
 */
import { scanTextForDenylist } from "./codex-compat-audit.mjs";

// ---------------------------------------------------------------------------
// lowerFrontmatter — explicit_invocation_only + mechanical_model_tier (structural)
// ---------------------------------------------------------------------------

const INVOCATION_POLICY_NOTE =
  "> **Explicitly invoked only.** Run this skill when the user names it directly (its slug, or a clear direct request) — do not self-trigger it from inferred intent.";

const EXECUTION_TIER_NOTE =
  "> **Mechanical-tier skill.** The work here is mechanical (a sweep, format, scan, or render from an already-structured source) rather than open-ended judgment. Delegate it to the configured executor role where a delegated worker is available; otherwise run it inline on the current session and note the degradation in your report.";

const FRONTMATTER_RE = /^(---\n)([\s\S]*?)(\n---\n)/;
const DISABLE_INVOCATION_LINE_RE = /^disable-model-invocation:\s*true\s*$/m;
const MODEL_SONNET_LINE_RE = /^model:\s*sonnet\s*$/m;

/**
 * Strips `model: sonnet` and `disable-model-invocation: true` out of a skill's frontmatter
 * block and, when either was present, injects the matching Codex-side instruction immediately
 * after the frontmatter (before the generated banner build-codex.mjs adds next) so the removed
 * field's *intent* survives even though the metadata does not.
 */
export function lowerFrontmatter(text) {
  const match = text.match(FRONTMATTER_RE);
  if (!match) return { text, hadDisableInvocation: false, hadModelSonnet: false };

  const [whole, open, rawFrontmatter, close] = match;
  const hadDisableInvocation = DISABLE_INVOCATION_LINE_RE.test(rawFrontmatter);
  const hadModelSonnet = MODEL_SONNET_LINE_RE.test(rawFrontmatter);

  const frontmatter = rawFrontmatter
    .split("\n")
    .filter((line) => !DISABLE_INVOCATION_LINE_RE.test(line) && !MODEL_SONNET_LINE_RE.test(line))
    .join("\n");

  const notes = [];
  if (hadDisableInvocation) notes.push(INVOCATION_POLICY_NOTE);
  if (hadModelSonnet) notes.push(EXECUTION_TIER_NOTE);

  const rest = text.slice(whole.length);
  const injected = notes.length ? `\n${notes.join("\n\n")}\n` : "";

  return {
    text: `${open}${frontmatter}${close}${injected}${rest}`,
    hadDisableInvocation,
    hadModelSonnet,
  };
}

// ---------------------------------------------------------------------------
// lowerWorkerProse — worker_dispatch (exact constructs) + prose mentions of the
// two frontmatter fields lowerFrontmatter already removed structurally.
// ---------------------------------------------------------------------------

/**
 * Exact-construct rules: each is a literal substring found (and verified, see
 * scripts/fixtures/codex/transforms/) in the current Claude source. Adding a new one requires
 * confirming the literal string exists in source — this is intentionally NOT a regex sweep.
 */
const WORKER_DISPATCH_RULES = [
  {
    find: "Invoke `Agent` with `subagent_type=general-purpose`.",
    replace: "Dispatch a scoped executor worker.",
  },
  {
    find: "one message, multiple `Agent` calls; `subagent_type=Explore` — read-only is the point",
    replace: "one message, multiple read-only explorer worker dispatches — read-only is the point",
  },
];

/** `sub-agent(s)` → `worker(s)`, case-preserved. Hyphenated only — "subagent" (no hyphen) is a
 * different, non-denylisted token and is left untouched (e.g. shape's "browser-verifier subagent"). */
function lowerSubAgentTerm(text) {
  return text
    .replace(/\bSub-agents\b/g, "Workers")
    .replace(/\bsub-agents\b/g, "workers")
    .replace(/\bSub-agent\b/g, "Worker")
    .replace(/\bsub-agent\b/g, "worker");
}

/** Remaining prose mentions of `model: sonnet` (lowerFrontmatter already removed the frontmatter
 * field itself) — explanatory sentences that reference the removed field by name. */
function lowerModelSonnetProse(text) {
  return text
    .replace(/`model:\s*sonnet`/gi, "the mechanical-tier executor role")
    .replace(/\(model:\s*sonnet\)/gi, "(mechanical-tier executor)")
    .replace(/model:\s*sonnet/gi, "mechanical-tier executor role");
}

/** Remaining prose mentions of `disable-model-invocation` (frontmatter field already removed). */
function lowerDisableInvocationProse(text) {
  return text
    .replace(/`disable-model-invocation:\s*true`/g, "`explicit-invocation-only: true`")
    .replace(/disable-model-invocation:\s*true/g, "explicit-invocation-only: true")
    .replace(/`disable-model-invocation`/g, "`explicit-invocation-only`")
    .replace(/disable-model-invocation/g, "explicit-invocation-only");
}

export function lowerWorkerProse(text) {
  let out = text;
  for (const rule of WORKER_DISPATCH_RULES) out = out.split(rule.find).join(rule.replace);
  out = lowerSubAgentTerm(out);
  out = lowerModelSonnetProse(out);
  out = lowerDisableInvocationProse(out);
  return out;
}

// ---------------------------------------------------------------------------
// lowerInteractiveChoiceProse — interactive_choice terminology (all profiles)
// ---------------------------------------------------------------------------

/** Exact source constructs only. The source sections continue to own their option labels and
 * routing meaning; these rules replace only the Claude-specific chooser name around them. */
const INTERACTIVE_CHOICE_PROSE_RULES = [
  { find: "a real `AskUserQuestion`", replace: "a real Codex interactive-chooser call" },
  { find: "one `AskUserQuestion` confirmation", replace: "one Codex interactive-chooser confirmation" },
  { find: "one real `AskUserQuestion` for the whole batch", replace: "one real Codex interactive-chooser call for the whole batch" },
  { find: "`AskUserQuestion`-style ask", replace: "host-structured interactive-choice ask" },
  { find: "`AskUserQuestion` listing", replace: "the Codex interactive chooser listing" },
  { find: "via `AskUserQuestion`", replace: "via the Codex interactive chooser" },
  { find: "an `AskUserQuestion` with", replace: "the Codex interactive chooser with" },
  { find: "An `AskUserQuestion` next-action offer", replace: "A Codex interactive-chooser next-action offer" },
  { find: "an `AskUserQuestion`; one click", replace: "the Codex interactive chooser; one click" },
  { find: "options via `AskUserQuestion`", replace: "options via the Codex interactive chooser" },
];

export function lowerInteractiveChoiceProse(text) {
  let out = text;
  for (const rule of INTERACTIVE_CHOICE_PROSE_RULES) out = out.split(rule.find).join(rule.replace);
  return out;
}

// ---------------------------------------------------------------------------
// injectInteractiveChoiceContract — Phase 3 executable chooser/fallback contract
// ---------------------------------------------------------------------------

/** The ONE Codex-side execution contract for missing user choice/authority. */
export const CODEX_INTERACTIVE_CHOICE_CONTRACT = `> **Interactive choice contract (Codex).** Do not force an end-of-turn next-action menu. If the user already authorized a scoped action, continue within that scope without asking them to choose again.
>
> Ask only when a consequential choice or missing authorization blocks the next action. Use the applicable source-owned options when they exist, but do not invent a generic menu or opt-out. Use \`request_user_input\` only when a structured chooser is available and allowed for that question; Codex permission requests stay in plain chat. If scope or authority is still unknown, stop after the concise question and do not perform downstream effects.`;

/** Exact pre-run section starts in compiled text. Insertion happens before the source-owned section,
 * so the compiler adds behavior without copying any choice content. Missing or duplicate anchors
 * are hard generation failures: source drift must never silently remove a supervision gate. */
const INTERACTIVE_CHOICE_CONSUMERS = {
  "shape-dogfood": "## The session — use it for real, capture as you go (dogfood's own front)",
};

export function injectInteractiveChoiceContract(text, flat) {
  const anchor = INTERACTIVE_CHOICE_CONSUMERS[flat];
  if (!anchor) return text;

  const first = text.indexOf(anchor);
  const second = first === -1 ? -1 : text.indexOf(anchor, first + anchor.length);
  if (first === -1 || second !== -1) {
    const state = first === -1 ? "missing" : "not unique";
    throw new Error(`interactive-choice anchor ${state} for ${flat}: ${JSON.stringify(anchor)}`);
  }

  return `${text.slice(0, first)}${CODEX_INTERACTIVE_CHOICE_CONTRACT}\n\n${text.slice(first)}`;
}

// ---------------------------------------------------------------------------
// lowerBrowserVerifyProse — browser_verify runtime ownership/path lowering
// ---------------------------------------------------------------------------

const BROWSER_VERIFY_PROSE_RULES = [
  {
    find: "browser-verify slot's `browser-verifier` subagent",
    replace: "browser-verify slot's `browser-verifier` custom agent",
  },
  {
    find: "Delegate the pass to the `browser-verifier` subagent",
    replace: "Delegate the pass to the `browser-verifier` custom agent",
  },
  {
    find: "The slot's default *executor* is the plugin's [`agents/browser-verifier.md`](plugins/shape/agents/browser-verifier.md) (mechanical-tier executor).",
    replace:
      "The slot's default *executor* is the generated project custom agent [`.codex/agents/browser-verifier.toml`](.codex/agents/browser-verifier.toml) (mechanical-tier executor).",
  },
  {
    find: "dispatch the plugin's `browser-verifier` agent (mechanical-tier executor)",
    replace:
      "dispatch the generated `.codex/agents/browser-verifier.toml` custom agent (mechanical-tier executor)",
  },
  {
    find: "dispatch the plugin's `browser-verifier` agent (mechanical-tier executor role)",
    replace:
      "dispatch the generated `.codex/agents/browser-verifier.toml` custom agent (mechanical-tier executor)",
  },
  {
    find: "Agent-side capture runs in the `browser-verifier` subagent",
    replace: "Agent-side capture runs in the `browser-verifier` custom agent",
  },
  {
    find: "its **image tokens stay in the subagent's context**",
    replace: "its **image tokens stay in the custom agent's context**",
  },
  {
    find: "The screenshots' image tokens stay in the subagent; build's context holds only \"PASS/DRIFT + reason\".",
    replace:
      "The screenshots' image tokens stay in the custom agent's context; build's context holds only \"PASS/DRIFT + reason\".",
  },
  {
    find: "Ships with the plugin, so it works on any machine that installed shape.",
    replace:
      "It is a generated project artifact: re-run `node scripts/build-codex.mjs` to refresh `.codex/agents/browser-verifier.toml`; if that file is absent, or if custom-agent runtime is unavailable, run the identical pass inline instead. Return `MISSING-TOOL` only when the selected browser helper/override is missing.",
  },
];

export function lowerBrowserVerifyProse(text) {
  let out = text;
  for (const rule of BROWSER_VERIFY_PROSE_RULES) out = out.split(rule.find).join(rule.replace);
  return out;
}

// ---------------------------------------------------------------------------
// injectBrowserVerifyContract — Phase 4 executable browser-verify contract
// ---------------------------------------------------------------------------

export const CODEX_BROWSER_VERIFY_CONTRACT = `> **Browser-verify contract (Codex).** When custom-agent runtime is available **and** \`.codex/agents/browser-verifier.toml\` exists, dispatch the pass to that custom agent. Otherwise execute the identical pass directly in the current session. In either mode, first check for a project browser-verify override; absent one, use \`agent-browser\`, and verify the chosen helper is present before driving anything.
>
> Missing custom-agent runtime or artifact is an inline fallback, **not** \`MISSING-TOOL\`. Missing selected helper/override → return \`MISSING-TOOL\` immediately and never install anything from inside this pass. Preserve the verifier verdict schema exactly: \`PASS | DRIFT | BLOCKED | MISSING-TOOL\`, plus \`reason\`, \`screenshots\`, \`console\`, and \`notes\`. Screenshot evidence is reported by filesystem path only — never inline base64 or image bytes. If the helper was opened, close it on every exit path before returning.`;

const BROWSER_VERIFY_ANCHORS = {
  "shape-mockup": "## The browser-verify slot is opt-in, not automatic (ADR-124)",
  "shape-dogfood": "## The session — use it for real, capture as you go (dogfood's own front)",
};

function countExact(text, needle) {
  let count = 0;
  let index = text.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = text.indexOf(needle, index + needle.length);
  }
  return count;
}

export function injectBrowserVerifyContract(text, flat) {
  const anchor = BROWSER_VERIFY_ANCHORS[flat];
  if (!anchor) return text;

  const first = text.indexOf(anchor);
  const second = text.indexOf(anchor, first + anchor.length);
  if (first === -1 || second !== -1) {
    const state = first === -1 ? "missing" : "not unique";
    throw new Error(`browser-verify anchor ${state} for ${flat}: ${JSON.stringify(anchor)}`);
  }

  return `${text.slice(0, first)}${CODEX_BROWSER_VERIFY_CONTRACT}\n\n${text.slice(first)}`;
}

// ---------------------------------------------------------------------------
// createProjectGuidanceLowerer — the NS/REF_PATH/CLAUDE.md rewrites (moved from
// build-codex.mjs) + project_guidance's /init-assumption softening.
// ---------------------------------------------------------------------------

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Exact-phrase rules softening Claude's `/init` assumption into host-neutral phrasing. Each
 * pattern is the verbatim substring found in the current Claude source (shape:setup + its
 * dev-workflow-stub reference) — precise, not a blind sweep. */
const INIT_ASSUMPTION_RULES = [
  {
    find: "the codebase-architecture doc `/init` later produces",
    replace: "the codebase-architecture pass a later architecture-enrichment command produces",
  },
  {
    find: "- **vs Claude Code's built-in `/init`** — `/init` documents an *existing codebase*",
    replace:
      "- **vs a host's built-in architecture-enrichment command** — that kind of command documents an *existing codebase*",
  },
  {
    find: "The two compose: setup primes at birth, `/init` enriches with architecture once code exists.",
    replace: "The two compose: setup primes at birth, architecture enrichment adds detail once code exists.",
  },
  {
    find: "Sentinel-delimited so it's idempotent and survives a later `/init` regeneration",
    replace: "Sentinel-delimited so it's idempotent and survives a later architecture-enrichment regeneration",
  },
];

function lowerInitAssumption(text) {
  let out = text;
  for (const rule of INIT_ASSUMPTION_RULES) out = out.split(rule.find).join(rule.replace);
  return out;
}

/**
 * Builds the namespace-flatten (`nav:audit` → `nav-audit`) + reference-reroot + CLAUDE.md→AGENTS.md
 * rewrites, scoped to the current plugin/skill roster (so the regexes only match real names).
 */
export function createProjectGuidanceLowerer({ plugins, skills }) {
  const pluginPattern = plugins.map(escapeRegExp).join("|");
  const skillPattern = skills.map(escapeRegExp).join("|");
  // `/nav:audit`, `nav:audit`, `/shape:mockup` → `nav-audit` / `shape-mockup`. Requires a real
  // verb after the colon, so bare-namespace prose ("the `nav:` namespace") is left untouched.
  const NS = new RegExp(`/?\\b(${pluginPattern}):(${skillPattern})\\b`, "g");
  // Full skills-root reference paths → the owning generated skill's bundled references directory.
  const REF_PATH = new RegExp(`plugins/(${pluginPattern})/skills/(${skillPattern})/references/`, "g");
  const PLUGIN_CLAUDE = new RegExp(`plugins/(?:${pluginPattern})/CLAUDE\\.md`, "g");

  /** Rewrites shared by both profiles: namespace flatten + plugin-CLAUDE.md → AGENTS.md path. */
  function rewriteCommon(text) {
    return text.replace(NS, "$1-$2").replace(PLUGIN_CLAUDE, "AGENTS.md");
  }

  /** Skill/reference profile: also re-root bundled reference paths + generic "CLAUDE.md" → "AGENTS.md",
   * then soften the /init assumption. */
  function lowerSkillGuidance(text) {
    const rewritten = rewriteCommon(text)
      .replace(
        /plugins\/nav\/skills\/sync\/references\/visual-spec\.md/g,
        "references/visual-spec.md",
      )
      .replace(REF_PATH, ".agents/skills/$1-$2/references/")
      .replace(/CLAUDE\.md/g, "AGENTS.md");
    return lowerInitAssumption(rewritten);
  }

  /** AGENTS.md-preamble profile (root CLAUDE.md + each plugin CLAUDE.md's own text): namespace
   * flatten + plugin-CLAUDE.md path rewrite (no generic CLAUDE.md→AGENTS.md rename — the caller
   * already retitles the section heading), then soften the /init assumption. */
  function lowerSharedGuidance(text) {
    return lowerInitAssumption(rewriteCommon(text));
  }

  return { rewriteCommon, lowerSkillGuidance, lowerSharedGuidance };
}

// ---------------------------------------------------------------------------
// injectWorkerDispatchPointer — Phase 2: short conditional pointer in the skill body,
// with the full work-packet + worker-return contracts bundled as an on-demand reference.
// ---------------------------------------------------------------------------

/**
 * The Codex work-packet contract (blueprints/plans/2026-07-13-codex-compatibility.md Phase 2,
 * deliverable A). This is the ONE canonical text for "what the dispatching agent must put in a
 * worker's brief" — every skill below references it instead of restating its own version.
 */
export const CODEX_WORK_PACKET_CONTRACT = `- **Goal** — the one-sentence outcome this worker must achieve.
- **Scope and owned files** — exactly which files/paths it may touch; everything outside that scope is out of bounds.
- **Inputs and source of truth** — what to read before acting, and which document or state wins if sources disagree.
- **Constraints and forbidden actions** — house rules it must not break (read-only, no scope creep, no mid-batch tests, etc.).
- **done_when** — the concrete condition that makes "done" true, not a feeling.
- **Verification commands** — the exact command(s) it must run and report the result of.
- **Base SHA** — the commit/state it started from, so the returned diff has something to diff against.
- **Return schema** — a pointer to the worker return contract below; its final message must follow it exactly.`;

/**
 * The worker return contract (deliverable A, the other half). Every dispatched worker's final
 * message must report these fields — this is what the dispatching agent's "check" step reads.
 */
export const CODEX_WORKER_RETURN_CONTRACT = `- **status** — \`done\` | \`partial\` | \`blocked\`. Never claim \`done\` without satisfying done_when.
- **Files changed** — the full list, matching the work packet's owned-files scope.
- **Diff summary** — what actually changed, in prose, not just a file list.
- **Commands and results** — every verification command it ran, with the actual output/exit status.
- **Assumptions** — anything it inferred rather than was told.
- **Unresolved risks** — anything left uncertain, deferred, or worth a second look.
- **Current SHA** — the state after its change, so the read-the-diff step is exact.`;

/** Shared closing line proving the Phase 2 gate in prose: the dispatching agent reads the diff,
 * reruns verification, and rejects an unsupported "done" rather than trusting the worker's word. */
const CODEX_DISPATCH_REJECTION_CLOSE =
  'The dispatching agent never accepts `status: done` at face value: it reads the returned diff against Base SHA and reruns the Verification commands itself before treating the item as closed. A worker that reports `done` without a passing verification command is rejected and re-dispatched, not trusted.';

export const CODEX_WORKER_DISPATCH_REFERENCE = [
  "# Codex Worker Dispatch",
  "",
  "Read this only when the current task actually dispatches explorer or executor workers. Tasks that do not dispatch workers do not need this reference.",
  "",
  "## Work Packet",
  "",
  "Every dispatched worker brief must include:",
  "",
  CODEX_WORK_PACKET_CONTRACT,
  "",
  "## Worker Return",
  "",
  "Every dispatched worker's final message must include:",
  "",
  CODEX_WORKER_RETURN_CONTRACT,
  "",
  "## Acceptance Gate",
  "",
  CODEX_DISPATCH_REJECTION_CLOSE,
  "",
].join("\n");

export const CODEX_WORKER_DISPATCH_REFERENCE_FILE = "references/codex-worker-dispatch.md";

const CODEX_WORKER_DISPATCH_POINTER =
  `> **Worker dispatch reference (Codex).** Only when dispatching explorer or executor workers, read \`${CODEX_WORKER_DISPATCH_REFERENCE_FILE}\` before preparing briefs or accepting returns. Tasks that do not dispatch workers do not load that reference.`;

const WORKER_DISPATCH_POINTER_CONSUMERS = new Set(["nav-audit", "nav-plan", "nav-refactor"]);

/**
 * Inserts the conditional worker-dispatch pointer for the given flat skill name immediately after
 * the first H1. No-op for any flat name not configured above. This deliberately does not depend on
 * nav-plan/nav-refactor's old next-action menu text, which is source-owned and can change shape.
 */
export function injectWorkerDispatchPointer(text, flat) {
  if (!WORKER_DISPATCH_POINTER_CONSUMERS.has(flat)) return text;
  if (text.includes(CODEX_WORKER_DISPATCH_POINTER)) return text;

  const headingMatch = text.match(/^# .+$/m);
  if (!headingMatch || headingMatch.index === undefined) {
    throw new Error(`worker-dispatch pointer anchor missing for ${flat}: first H1`);
  }

  const insertAt = headingMatch.index + headingMatch[0].length;
  return `${text.slice(0, insertAt)}\n\n${CODEX_WORKER_DISPATCH_POINTER}${text.slice(insertAt)}`;
}

export function needsWorkerDispatchReference(flat) {
  return WORKER_DISPATCH_POINTER_CONSUMERS.has(flat);
}

// ---------------------------------------------------------------------------
// detectUnsupported — reuses the manifest-driven denylist rule list, never duplicates it.
// ---------------------------------------------------------------------------

/** Given a compiled Codex file's text, returns any remaining denylisted Claude-only tokens.
 * `root` locates platforms/codex/manifest.json, the rules' single owner. */
export function detectUnsupported(root, file, text) {
  return scanTextForDenylist(root, file, text);
}
