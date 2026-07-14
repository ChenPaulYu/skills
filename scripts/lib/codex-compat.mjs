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
 *   injectWorkerDispatchContract() — Phase 2: for the dispatch-heavy skills only, appends a
 *                                  concrete "Worker dispatch contract" section (the canonical
 *                                  work-packet / worker-return contracts below) right after that
 *                                  skill's own existing inject/check prose — it references that
 *                                  prose by name rather than duplicating it. No-op for every other
 *                                  skill (returns text unchanged when the flat name isn't configured).
 *   detectUnsupported()           — scans compiled text for any remaining denylisted Claude-only
 *                                  token, sharing the manifest-driven rule list with
 *                                  scripts/lib/codex-compat-audit.mjs (no duplicated rule list).
 *
 * Capability table this module implements (see blueprints/plans/2026-07-13-codex-compatibility.md):
 *   explicit_invocation_only, mechanical_model_tier  → lowerFrontmatter + lowerWorkerProse
 *   worker_dispatch (Agent/subagent_type/sub-agent)  → lowerWorkerProse + injectWorkerDispatchContract
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
// injectWorkerDispatchContract — Phase 2: work-packet + worker-return contracts,
// owned once here, injected into the dispatch-heavy skills only.
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

function genericContractBlock(intro) {
  return [
    intro,
    "",
    "**Work packet** (what the dispatching agent injects):",
    "",
    CODEX_WORK_PACKET_CONTRACT,
    "",
    "**Worker return** (what the worker must report back):",
    "",
    CODEX_WORKER_RETURN_CONTRACT,
    "",
    CODEX_DISPATCH_REJECTION_CLOSE,
  ].join("\n");
}

/**
 * Per-skill anchor + body config. `after` is an EXACT substring already present in the compiled
 * text (post lowerWorkerProse) — the section is inserted immediately after it, at the next
 * paragraph boundary. `body` is the section content (without the heading, added by the caller).
 * Every entry references the skill's own inject/check prose by name rather than restating it —
 * see the plan's injection-strategy note (Phase 2, deliverable B).
 */
const WORKER_DISPATCH_SECTIONS = {
  "nav-audit": {
    after:
      "Each worker returns its domain's findings + self-eval. It does **not** write files (read-only audit). Reconnaissance workers default to cheap tier (the mechanical-tier executor role); a domain whose judgment call is unusually dense can be escalated on the spot (see root AGENTS.md's Dispatch tiers).",
    body: genericContractBlock(
      "D2's inject and D3–D5's check above are this contract, lowered to Codex vocabulary: each explorer worker's brief IS the work packet below (Scope = its assigned domain's files only; Constraints = read-only, no writes; Verification = read-only greps/finds, never a mutating command); its findings + self-eval IS the worker return below. D3's merge/dedup and D5's completeness critic are the root agent applying the rejection rule at the end of this section — an under-covered or unsupported domain gets re-dispatched, not accepted.",
    ),
  },
  "nav-plan": {
    after:
      "The dispatched worker defaults to cheap tier (the mechanical-tier executor role); a judgment-dense single step can be escalated on the spot (see root AGENTS.md's Dispatch tiers).",
    body: genericContractBlock(
      "Stage 4 option 1's inject/check bullets above are this contract in practice: the inject list (plan file path, step scope, Verification expectation, Critical files + reusable seams, the N+1 trigger) supplies the work packet below; the check list (diff read, integration pass, header hygiene) is the root agent applying the worker return contract before accepting \"done\".",
    ),
  },
  "nav-refactor": {
    after:
      "See [ADR-007](docs/adr/007-offer-next-action-pattern.md) for the pattern's rationale.",
    body: genericContractBlock(
      "Step 8 option 2's inject/check bullets above are this contract in practice: the inject (extracted file paths, the move-vs-improve discipline, deferred simplifications, the surrounding seam, the N+1 trigger) supplies the work packet below; the check (diff read for a parallel impl, header hygiene, the verify gate) is the root agent applying the worker return contract before accepting \"done\".",
    ),
  },
  "shape-build": {
    after:
      "The dispatch facility is a **capability slot** (like browser-verify): a workflow/pipeline engine as named default, plain parallel workers otherwise; **no facility → fully sequential. Degrade parallelism, never the gates.**",
    body: genericContractBlock(
      "The per-item loop's step 3 inject/check bullets and this Scheduling section's join gate above are this contract in practice — write workers default to sequential (one item's work packet at a time); a parallel tail is only ever a set of disjoint, pre-approved work packets, never overlapping scope. The step-3 \"check the returned diff\" line and the join gate's full test rerun are the root agent applying the worker return contract before any item counts as done.",
    ),
  },
  "research-dissect": {
    after:
      '7. **Return instruction** — tell the worker its final text IS the dissection note (raw markdown). It should return nothing else.',
    body: [
      "This inject → read → check protocol above already IS a work-packet/return-contract pair, specialized for document analysis rather than code (no files changed, no diff, no SHA):",
      "",
      "- **Goal** = the assigned document + the 5-layer framework (items 1–2 above). **Scope** = read this document only, don't wander into others. **Inputs / source of truth** = the document's own content, never the filename. **Constraints** = don't skim; don't invent the Conclusion. **done_when** = all five sections present and every item in the \"check (←)\" list below passes. **Verification** = the \"check (←)\" list, run by the dispatching agent against the returned note, not by the worker on itself. **Return schema** = the Output format template (item 3 above) — the note IS the return, not a separate status field.",
      "- The dispatching agent never accepts a returned note at face value: it runs every \"check (←)\" item before saving, and — the document-analysis equivalent of \"reject an unsupported done\" — asks the worker to revise (never silently rewrites it itself) if any item fails.",
    ].join("\n"),
  },
};

/**
 * Inserts the "Worker dispatch contract" section for the given flat skill name, right after its
 * configured anchor's paragraph. No-op (returns text unchanged) for any flat name not configured
 * above — this only touches the five dispatch-heavy skills the plan names (Phase 2, deliverable B).
 */
export function injectWorkerDispatchContract(text, flat) {
  const config = WORKER_DISPATCH_SECTIONS[flat];
  if (!config) return text;

  const anchorIndex = text.indexOf(config.after);
  if (anchorIndex === -1) return text; // anchor drifted out of source; fail open, not silently wrong

  const insertAt = anchorIndex + config.after.length;
  const section = `\n\n## Worker dispatch contract (Codex)\n\n${config.body}`;
  return `${text.slice(0, insertAt)}${section}${text.slice(insertAt)}`;
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
