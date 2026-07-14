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
 *   detectUnsupported()           — scans compiled text for any remaining denylisted Claude-only
 *                                  token, sharing the manifest-driven rule list with
 *                                  scripts/lib/codex-compat-audit.mjs (no duplicated rule list).
 *
 * Capability table this module implements (see blueprints/plans/2026-07-13-codex-compatibility.md):
 *   explicit_invocation_only, mechanical_model_tier  → lowerFrontmatter + lowerWorkerProse
 *   worker_dispatch (Agent/subagent_type/sub-agent)  → lowerWorkerProse
 *   project_guidance (CLAUDE.md→AGENTS.md, /init)    → createProjectGuidanceLowerer
 * Deliberately NOT lowered here (later phases): interactive_choice (AskUserQuestion, Phase 3),
 * browser_verify (Phase 4), session_open_awareness (Phase 4).
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
  // Full skills-root reference paths → repo-root-relative `references/…` (they travel with the dir).
  const REF_PATH = new RegExp(`plugins/(?:${pluginPattern})/skills/[^/]+/references/`, "g");
  const PLUGIN_CLAUDE = new RegExp(`plugins/(?:${pluginPattern})/CLAUDE\\.md`, "g");

  /** Rewrites shared by both profiles: namespace flatten + plugin-CLAUDE.md → AGENTS.md path. */
  function rewriteCommon(text) {
    return text.replace(NS, "$1-$2").replace(PLUGIN_CLAUDE, "AGENTS.md");
  }

  /** Skill/reference profile: also re-root bundled reference paths + generic "CLAUDE.md" → "AGENTS.md",
   * then soften the /init assumption. */
  function lowerSkillGuidance(text) {
    const rewritten = rewriteCommon(text).replace(REF_PATH, "references/").replace(/CLAUDE\.md/g, "AGENTS.md");
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
// detectUnsupported — reuses the manifest-driven denylist rule list, never duplicates it.
// ---------------------------------------------------------------------------

/** Given a compiled Codex file's text, returns any remaining denylisted Claude-only tokens
 * (e.g. still-unlowered browser_verify / ask_user_question / session_open_awareness categories
 * that later phases own). `root` locates platforms/codex/manifest.json, the rules' single owner. */
export function detectUnsupported(root, file, text) {
  return scanTextForDenylist(root, file, text);
}
