# Codex compatibility without changing Claude Code — plan

> Generated: 2026-07-13 · Spec source: this conversation + `blueprints/plans/2026-07-13-session-changelog.md` · Stage 1: fresh, grounded by a GPT-5.4 read-only full-roster scan
>
> **Decision:** Treat the existing Claude Code marketplace as a frozen input contract. Add Codex behavior compatibility entirely in a Codex adapter/compiler and Codex-only artifacts. Do not edit `plugins/**`, root `CLAUDE.md`, `.claude-plugin/**`, or `.cursor-plugin/**`; do not bump Claude plugin versions.

> **Progress — 2026-07-14:** Phases 1-5 are complete. The Codex compiler boundary, invocation/tier lowering, worker contracts, interactive-choice lowering, browser-runtime lowering, generated `.codex` runtime artifacts, lifecycle-awareness lowering, and full-roster compatibility hardening are in place and validator-backed. Phase 6 remains open.

## Context

The repository already produces a Codex mirror, but the mirror is format-compatible rather than behavior-compatible. `scripts/build-codex.mjs` flattens names (`nav:plan` → `nav-plan`), rewrites `CLAUDE.md` references to `AGENTS.md`, re-roots bundled references, and normalizes frontmatter descriptions. It does not currently lower Claude-only runtime semantics such as `AskUserQuestion`, `Agent` / `subagent_type`, `disable-model-invocation`, `model: sonnet`, bundled custom agents, or session-open behavior.

That distinction matters most in orchestration-heavy skills. `nav-plan` and `nav-refactor` use an interactive choice as a supervision gate; `nav-audit` and `research-dissect` depend on worker dispatch contracts; `shape-build` depends on supervisor/worker execution plus a browser-verification subagent; `shape-setup` assumes Claude-specific project priming and `/init`; `relay-digest` describes session-open awareness. The current validator proves that generated files are in sync, but not that those behaviors have a working Codex equivalent.

The change therefore needs a compiler boundary, not a second hand-maintained skill set. Claude source remains byte-for-byte unchanged. A Codex-specific adapter reads that source, converts known platform contracts into Codex equivalents, emits required custom-agent artifacts, and rejects any unsupported Claude-only semantics that would otherwise leak into `.agents/skills/` unnoticed.

Intent: **Codex should preserve each skill's gates and workflow semantics while the Claude Code distribution and versions remain untouched.** When Codex has no exact equivalent, the generated skill must state an explicit fallback or stop condition; it must never silently pretend the capability exists.

## Resolved questions

| Question | Decision |
|---|---|
| What must remain unchanged? | Claude-owned source and distribution: `plugins/**`, root `CLAUDE.md`, `.claude-plugin/**`, `.cursor-plugin/**`, and all Claude plugin versions. |
| What level of compatibility is targeted? | Behavioral compatibility for supervision gates, worker dispatch, verification, and explicit degradation—not merely install/discovery compatibility. |
| How are models represented publicly? | Marketplace semantics use roles (`supervisor`, `executor`, `mechanical`, `reviewer`), not personal model names. |
| What is Paul's local Codex model mapping? | GPT-5.6 root supervisor; GPT-5.4 executor for code reading, exploration, implementation, and mechanical checks. This mapping belongs in Codex-only local/project agent config, not Claude files. |
| May the plan change generated Codex artifacts? | Yes, through the generator only. Never hand-edit `.agents/skills/` or generated `AGENTS.md`. |

## Frozen contract

Before implementation, capture the following as the immutable Claude-side contract:

```text
CLAUDE.md
.claude-plugin/**
plugins/**
plugins/*/.cursor-plugin/**
```

Every implementation phase must prove these paths have no diff. The adapter may **read** them but may not write them. The existing `.agents/skills/**` and root `AGENTS.md` remain generated Codex outputs and may change only through `scripts/build-codex.mjs`.

> **Arbitration — 2026-07-13 ([ADR-068](docs/adr/068-codex-freeze-scoped-to-workstream.md)):** the freeze is **this workstream's own discipline, not a repo-wide freeze** — same-day it collided with the ADR-065/066/067 batch (normal marketplace evolution under `plugins/**` + root `CLAUDE.md`) and Paul ruled to re-scope. The worktree-freeze check now runs only under `--codex-compat` (and the full `--compat-audit` door); this workstream and its CI must use those flags. The temp-build purity check and the token ratchet stay in the default validator; legitimate Claude-side token growth is recorded per-entry in `compat-baseline.json`'s `ratchet_ledger` and is expected to ratchet back down when Phases 1–5 lower those semantics in the generator.

The plan deliberately does not rename the canonical plugin tree or introduce a second editable copy of every `SKILL.md`. Claude remains the content owner; the Codex layer owns only the translation from Claude affordances to Codex affordances.

## Compatibility model

### Four classes

| Class | Meaning | Examples | Treatment |
|---|---|---|---|
| A — portable core | Method and output shape already work on either host | most frame reasoning, research analysis, relay file formats, nav deep-module rules | Copy through with existing namespace/path rewrites. |
| B — mechanical syntax | Same behavior, different naming or metadata grammar | `nav:plan` → `nav-plan`, `CLAUDE.md` → `AGENTS.md`, description quoting/limit | Generic compiler transform. |
| C — host capability | Behavior exists on both hosts but the invocation differs | interactive choices, worker dispatch, model tier, browser verification | Lower through a named Codex capability adapter. |
| D — unsupported or absent | No verified Codex equivalent or no emitted artifact | Claude invocation-disable metadata, session-open auto-run, missing custom agent bundle | Explicit fallback/stop, or add a Codex-only artifact; validator forbids silent leakage. |

### Platform-neutral capability vocabulary

The adapter owns this vocabulary once. Skills do not gain new source annotations in this project because the Claude source is frozen.

| Capability | Claude source signals currently seen | Codex lowering |
|---|---|---|
| `interactive_choice` | `AskUserQuestion`, offer-next-action sections | Use Codex interactive input when available; otherwise ask directly in the final response and stop until answered. Preserve mutually-exclusive options, recommendation, and opt-out. |
| `worker_dispatch` | `Agent`, `subagent_type=Explore`, `subagent_type=general-purpose`, “sub-agent” protocols | Map read-only exploration to `explorer`; scoped execution to `worker` / project custom executor; preserve inject → return-contract → supervisor-check. |
| `explicit_invocation_only` | `disable-model-invocation: true` | Remove unsupported frontmatter from the Codex render and inject an explicit body-level invocation policy. Add a validator rule proving the policy exists. |
| `mechanical_model_tier` | `model: sonnet` plus cost-tier prose | Remove Claude model metadata; route to the configured Codex executor role where delegation is possible, otherwise inherit the session model and report the degradation. |
| `browser_verify` | `browser-verifier`, `agent-browser`, browser-verify slot | Emit a Codex custom agent or use a verified direct-tool contract; keep PASS/DRIFT/BLOCKED/MISSING-TOOL and mandatory close behavior. |
| `project_guidance` | birth `CLAUDE.md`, Claude `/init` comparison | Render Codex guidance as `AGENTS.md`; describe architecture-enrichment generically unless a documented Codex command exists. |
| `session_open_awareness` | relay digest “runs on open” | Do not claim automatic behavior without a Codex hook/config artifact. Emit an opt-in hook only if supported; otherwise mark digest as on-demand. |
| `supervisor_escalation` | advisor-style low-confidence reasoning, parent check loops | Use the GPT-5.6 root supervisor for planning, arbitration, and independent verification; workers return evidence rather than self-approve. |

## Approach

### Phase 0 — Freeze Claude and turn false compatibility into visible failures

1. Add a Codex adapter manifest at `platforms/codex/manifest.json`.
   - Own the adapter schema version, supported capabilities, generated destinations, and denylisted unresolved tokens.
   - Do not duplicate plugin versions; Claude manifests remain their only owner.
2. Add a read-only Claude-contract snapshot check to the validator.
   - Record the paths the Codex build is allowed to write.
   - Run the Codex generator in a temporary copy.
   - Fail if any frozen Claude path changes.
3. Add a compatibility audit mode before enforcing zero violations.
   - Report every occurrence of `AskUserQuestion`, exact `Agent` calls, `subagent_type=`, `disable-model-invocation`, `model: sonnet`, `Claude Code's built-in`, unresolved custom-agent references, and session-open claims in the generated Codex tree.
   - Check in the initial inventory as the migration baseline; subsequent phases ratchet counts downward.
4. Add golden fixtures for five canary skills:
   - `nav-plan`
   - `nav-audit`
   - `research-dissect`
   - `shape-build`
   - `shape-setup`

**Gate:** validator can identify current semantic gaps while `git diff -- CLAUDE.md .claude-plugin plugins` remains empty.

### Phase 1 — Extract a real Codex compiler from `build-codex.mjs`

1. Move Codex-specific lowering into `scripts/lib/codex-compat.mjs`.
   - Keep filesystem discovery/copying in `build-codex.mjs`.
   - Give each transform a named function and a fixture: frontmatter lowering, interactive-choice lowering, worker terminology, project-guidance lowering, and unsupported-token detection.
2. Lower frontmatter deliberately.
   - Preserve `name` and normalized `description`.
   - Remove `model: sonnet` and `disable-model-invocation` from Codex outputs.
   - Convert their behavior into generated Codex instructions rather than silently dropping intent.
3. Replace tool-shaped prose with capability-shaped Codex prose.
   - Do not use a blind global replacement for the word “Agent”; transform exact constructs and known sections.
   - Keep generic uses such as “agent-navigability” untouched.
4. Fix `--sync-global` so both prefixed and unprefixed global skills are copied from the compiled Codex output, never the raw Claude source.

**Gate:** the five fixtures are deterministic; global sync contains no raw Claude-only frontmatter; frozen Claude paths still have no diff.

### Phase 2 — Make supervision and worker dispatch behaviorally equivalent

1. Define the Codex work-packet contract once in the adapter:

```text
goal
scope and owned files
inputs and source of truth
constraints and forbidden actions
done_when
verification commands
base SHA
return schema
```

2. Define the worker return contract:

```text
status: done | partial | blocked
files changed
diff summary
commands and results
assumptions
unresolved risks
current SHA
```

3. Lower the existing inject → worker → check protocols:
   - `nav-audit`: parallel read-only `explorer` workers by domain, followed by root synthesis and coverage critic.
   - `nav-plan` / `nav-refactor`: scoped `worker` executor, then root diff inspection and independent verification.
   - `research-dissect`: sequential document workers with a strict markdown return contract.
   - `shape-build`: sequential write workers by default; parallel only for disjoint, approved tails.
4. Add Codex-only custom agent templates under `platforms/codex/agents/`.
   - `executor.toml`: execution-focused; model omitted in the portable template.
   - `explorer.toml`: read-only exploration.
   - `reviewer.toml`: independent verification and risk review.
5. Add a Codex-only personal/project mapping layer for this workspace:
   - root session: GPT-5.6 supervisor.
   - executor/explorer implementation: GPT-5.4 according to Paul's preference.
   - Keep this mapping out of Claude source and out of portable marketplace semantics.

**Gate:** a canary task proves the supervisor reads the returned diff and reruns verification; a worker's unsupported “done” is rejected.

### Phase 3 — Port interactive supervision gates

#### Grounded starting state

- The 2026-07-14 compatibility audit finds 14 unresolved `AskUserQuestion` tokens in 10 generated files: the nine skill consumers below plus two shared-guidance mentions in `AGENTS.md`. The source remains frozen; every change belongs to the compiler, Codex metadata/tests, generated mirror, or this plan.
- `scripts/lib/codex-compat.mjs` is already the single owner for Codex lowering. `scripts/build-codex.mjs` only sequences transforms and writes files; Phase 3 must preserve that boundary.
- The existing source sections already own each skill's actual option labels and routing meaning. The compiler must not copy or reconstruct those choices in a second table. It supplies only the host-level execution contract around them.
- Current canaries cover `nav-plan` and `nav-refactor`, but only `nav-plan` positively expects the still-unlowered token. Seven choice consumers have no generated canary yet. The Phase 3 packet closes that proof gap rather than relying on a repository-wide grep alone.

#### Single-owner design

| Decision | Owner |
|---|---|
| Codex interactive-choice behavior and fallback semantics | `scripts/lib/codex-compat.mjs` — one exported contract plus named lowering/injection functions |
| Which generated skills consume the contract, and each insertion anchor | `scripts/lib/codex-compat.mjs` — one consumer map keyed by flat skill name |
| Each skill's option labels, recommendation, routing meaning, and opt-out wording | Frozen source `plugins/*/skills/*/SKILL.md`; compiler preserves rather than duplicates it |
| Capability status and unresolved-token detection | `platforms/codex/manifest.json` |
| Per-consumer behavioral evidence | `scripts/fixtures/codex/canaries/*.json` |
| Remaining tolerated counts and ratchet history | `scripts/fixtures/codex/compat-baseline.json` |

#### Implementation packet

1. **Add a named interactive-choice lowering seam.**
   - Add `lowerInteractiveChoiceProse(text)` for every compiled text profile. It removes the Claude-only token from skills, bundled text, and `AGENTS.md` using exact known constructs, replacing it with host-neutral Codex chooser language rather than a blind semantic rewrite.
   - Add `injectInteractiveChoiceContract(text, flat)` for skill bodies only. It injects one canonical Codex contract at the configured offer section of each consumer; non-consumers are exact no-ops.
   - Wire the prose lowering into skill, reference, and shared-guidance compilation, and wire contract injection into `compileSkillMarkdown`. Keep discovery/filesystem work out of the compiler.

2. **Make the generated behavior executable, not merely renamed.** The canonical contract must tell the Codex agent to:
   - use the host's structured user-input chooser when it is callable (currently `request_user_input`), otherwise ask one concise direct question in chat and end the turn;
   - execute nothing downstream until the user makes an explicit choice;
   - present mutually exclusive choices, label one recommendation when the source does, preserve the source's save/done/later opt-out, and accept a free-form alternative where the host supplies one;
   - treat the offer as one-shot and not re-offer after decline/opt-out;
   - treat selecting an explicitly-invoked-only continuation as an explicit invocation, preserving ADR-072's invocation-direction decision;
   - carry forward the source section's actual labels and consequences instead of inventing generic replacements.

3. **Cover the complete current consumer roster.** Configure exact, drift-detectable anchors for:
   - `nav-plan`, `nav-refactor`
   - `shape-elicit`, `shape-mockup`, `shape-dogfood`, `shape-reconcile`
   - `frame-first-principles`, `frame-dialectic`, `frame-graft`

   Anchor drift must fail validation or a canary; it must not silently return unchanged generated behavior. `AGENTS.md` receives only the host-neutral terminology rewrite because it describes the convention rather than executing a choice.

4. **Turn all nine consumers into behavioral canaries.**
   - Update `nav-plan.json` and `nav-refactor.json`; add canaries for the seven uncovered consumers.
   - Every consumer rejects `ask_user_question`, expects the canonical contract, expects at least one source-owned option/routing phrase, and expects the stop-before-choice plus fallback/end-turn language.
   - At least one canary proves recommendation preservation, one proves save/done/later opt-out preservation, one proves one-shot behavior, and one proves the explicitly-invoked-only selection rule. Collectively the nine fixtures cover every invariant; no single fixture stands in for roster-wide proof.

5. **Ratchet and document the capability.**
   - Update `platforms/codex/manifest.json` so `interactive_choice` points to the named compiler owner and states the structured-input/direct-question degradation honestly.
   - Ratchet every `ask_user_question` baseline entry to zero and append a dated Phase 3 ledger entry. Do not delete the denylist rule: a future Claude-only choice construct must still fail until lowered.
   - Regenerate `.agents/skills/**` and `AGENTS.md` only through `node scripts/build-codex.mjs`; never hand-edit generated artifacts.

6. **Independently verify the returned implementation.** The judgment seat, not the executor, owns acceptance:
   - inspect the full diff against the worker's Base SHA and reject edits under `plugins/**`, root `CLAUDE.md`, `.claude-plugin/**`, or `.cursor-plugin/**`;
   - run `node scripts/build-codex.mjs` twice and prove the second run has zero diff;
   - run `node scripts/validate-codex-skills.mjs --compat-audit` and require `interactive_choice / AskUserQuestion: 0 hit(s)` with all canaries and negative fixtures green;
   - run `node scripts/validate-codex-skills.mjs --codex-compat` and the normal `node scripts/validate-codex-skills.mjs` gate;
   - search generated output for `AskUserQuestion` and verify zero matches, then inspect representative generated flows from nav, shape, and frame to confirm the choice contents and stop boundary read coherently in context;
   - confirm the worktree contains no unrelated or frozen-source edits before commit.

#### Completion criterion

Phase 3 is complete only when all nine consumers carry an executable Codex choice contract, generated output and `AGENTS.md` contain zero `AskUserQuestion` tokens, every invariant above has positive fixture evidence, the baseline is ratcheted to zero without removing future regression detection, two-run generation is deterministic, all three validator doors are green, and the frozen Claude contract is unchanged.

#### Out of scope for this phase

- Browser-verifier generation, `agent-browser` runtime behavior, and `relay-digest` session-open degradation remain Phase 4.
- Full-roster adapter coverage reporting and converting the compatibility audit into a universal hard gate remain Phase 5.
- Changing the Claude-side offer wording, plugin versions, marketplace surfaces, or ADR semantics is forbidden by this workstream's frozen-input contract.

### Phase 4 — Port bundled runtime capabilities

1. Add custom-agent generation for `plugins/*/agents/` without changing those source files.
   - Translate `plugins/shape/agents/browser-verifier.md` into a Codex agent TOML/artifact.
   - Preserve its tool detection, verdict schema, screenshot paths, and mandatory browser close.
2. Resolve how Codex plugins/install flows discover bundled agent definitions using current official Codex docs and a local installation smoke test.
   - If bundled agent installation is supported, emit to that location.
   - If not, install the agent through an explicit Codex-only setup command; never claim it is automatically available.
3. Lower `shape-build`, `shape-mockup`, and `shape-dogfood` to the emitted browser capability.
4. Handle session-open awareness separately.
   - Generate a Codex hook/config only if the current client supports the required lifecycle.
   - Otherwise rewrite the Codex `relay-digest` render to “on-demand / explicitly invoked” and report that degradation.

**Gate:** every runtime artifact referenced by a generated Codex skill exists; `shape-build` returns a real browser-verifier verdict or an explicit MISSING-TOOL/unsupported result.

> **Phase 4 completion note — 2026-07-14:** Verified reality is now: the browser verifier is generated as the owned runtime artifact `.codex/agents/browser-verifier.toml`; the three browser consumers (`shape-build`, `shape-mockup`, `shape-dogfood`) fall back inline when custom-agent runtime or that artifact is absent; `agent-browser` is optional and only yields `MISSING-TOOL` when the selected helper/override itself is missing. Lifecycle awareness lowers to a trusted `SessionStart` startup/resume hook plus an explicit on-demand `relay-digest` fallback, owned by `.codex/hooks.json` and `.codex/hooks/relay-digest-session-start.mjs`. Rebuild preservation is smoke-validated: unrelated `.codex/agents/*`, unrelated hook files, and non-owned hook entries survive rebuild while the owned SessionStart command is refreshed in place. Evidence is fixture/smoke validation, not a claimed live browser run: 20/20 canaries, 9/9 negatives, 3/3 lifecycle smokes, 1/1 preservation smoke, all three validator doors green (`--compat-audit`, `--codex-compat`, default), and frozen Claude paths clean.

### Phase 5 — Migrate the full roster and harden validation

1. Apply the A/B/C/D classification to every skill, not only the canaries.
2. Turn the audit baseline into hard gates:
   - Codex frontmatter allowlist.
   - no unresolved Claude-only execution tokens.
   - no references to missing agents/scripts/references.
   - every `explicit_invocation_only` source skill has the generated Codex invocation policy.
   - every source mechanical-tier skill has an explicit Codex execution-tier outcome.
3. Add adapter coverage reporting by skill and capability.
   - A new Claude-only construct must fail validation until a Codex mapping or declared degradation is added.
4. Regenerate `.agents/skills/**` and `AGENTS.md` only through the builder.
5. Run the existing full validator after the new compatibility gates.

**Gate:** zero unexplained compatibility findings across the roster; all generated artifacts deterministic; Claude contract unchanged.

> **Phase 5 completion note — 2026-07-14:** Full-roster coverage is now **36/36** with zero unresolved compatibility categories. Capability rows are `browser_verify=3`, `explicit_invocation_only=6`, `interactive_choice=9`, `mechanical_model_tier=5`, `project_guidance=1`, `session_open_awareness=1`, and `worker_dispatch=5`. Verification is green at all declared Phase 5 gates: **20/20** canaries, **16/16** negatives, frozen contract **OK**, and the generated/runtime coverage audit is clean under `node scripts/validate-codex-skills.mjs --compat-audit`. This closes Phase 5 only; Phase 6 documentation/release work is still pending.

### Phase 6 — Document and release the Codex layer independently

1. Write an ADR explaining:
   - why Claude source is frozen;
   - why the Codex compiler owns platform translation;
   - why roles are portable but model names are local policy;
   - how unsupported capabilities degrade explicitly.
2. Document the Codex install/config flow in README and the site map only where it describes the Codex adapter; do not change Claude plugin descriptions or versions.
3. Give the Codex adapter its own schema/release version in `platforms/codex/manifest.json`.
4. Run the human-facing surface checks required by the repo, even though the skill roster does not change.

**Gate:** a fresh Codex install can discover the skills and required agent roles; a fresh Claude install produces the same files and behavior as before this project.

> **Phase 6 completion note — 2026-07-14:** The Codex layer is now documented and releasable as an **independent adapter** rather than a phase-labeled migration artifact. `platforms/codex/manifest.json` owns adapter `schema_version=2`, `adapter_release=1.0.0`, release-policy metadata, and the manifest-listed fresh-install smoke fixtures; [ADR-083](docs/adr/083-codex-adapter-independent-release.md) ratifies the contract while [`docs/codex-compatibility.md`](docs/codex-compatibility.md) remains the maintained operational guide. README + the bilingual site install card now point fresh users at the supported global adapter path, `node scripts/build-codex.mjs --sync-global --profile <name> --dedupe-global-roots`, which installs only compiled flat skills plus the runtime artifacts that profile actually needs into `~/.codex/`, never raw Claude-source copies. Release acceptance is executable: `node scripts/validate-codex-skills.mjs --release-smoke` passes **2/2** (fresh Codex HOME install + fresh Claude-side manifests/metadata preservation), `--compat-audit` is green at **20/20** canaries, **16/16** negatives, **3/3** hook smokes, **1/1** preservation smokes, **2/2** release smokes, and coverage **36/36**; both `--codex-compat` and the default validator are green; rebuild is deterministic; frozen Claude paths remain unchanged. Evidence is recorded in `docs/findings/2026-07-14-codex-phase6-release-smokes.md`.

## Critical files

| File | Why it matters | Touched in phase |
|---|---|---|
| `scripts/build-codex.mjs:59` | Existing mechanical rewrite boundary; becomes the caller of the compatibility compiler. | 1, 4, 5 |
| `scripts/build-codex.mjs:186` | Global sync path; must always install compiled Codex output. | 1 |
| `scripts/validate-codex-skills.mjs:138` | Existing Codex mirror validation; gains semantic and frozen-contract gates. | 0, 5 |
| `scripts/lib/codex-compat.mjs` | New single owner for Codex lowering rules. | 1–5 |
| `platforms/codex/manifest.json` | New owner for adapter schema/version, capabilities, denylist, and destinations. | 0, 6 |
| `platforms/codex/agents/*.toml` | Portable Codex role templates and generated custom-agent inputs. | 2, 4 |
| `scripts/fixtures/codex/**` | Golden renders for canary skills and regression coverage. | 0–5 |
| `plugins/nav/skills/plan/SKILL.md:154` | Frozen source example of interactive choice + worker dispatch. Read only. | fixture input only |
| `plugins/nav/skills/audit/SKILL.md:180` | Frozen source example of read-only worker fan-out. Read only. | fixture input only |
| `plugins/research/skills/dissect/SKILL.md:80` | Frozen source example of strict worker injection/return/check. Read only. | fixture input only |
| `plugins/shape/skills/build/SKILL.md:53` | Frozen source example of supervisor/worker and browser capability. Read only. | fixture input only |
| `plugins/shape/agents/browser-verifier.md:1` | Frozen Claude custom-agent source to translate for Codex. Read only. | 4 input only |
| `plugins/shape/skills/setup/SKILL.md:44` | Frozen source containing project-guidance and `/init` assumptions. Read only. | fixture input only |
| `.agents/skills/**` | Generated Codex skill outputs. Never hand-edit. | generated 1–5 |
| `.codex/agents/**` or documented install target | Generated/project Codex agent definitions, subject to official capability verification. | generated 2, 4 |
| `docs/codex-compatibility.md` | Maintained translation procedure for the frozen-source Codex adapter. | 1–6 |

## Single-source-of-truth owners

| Decision | Owner |
|---|---|
| Claude skill content and behavior | Existing `plugins/<plugin>/skills/<skill>/SKILL.md` files; frozen in this project |
| Claude plugin name/version/description/author | Existing `plugins/<plugin>/.claude-plugin/plugin.json`; unchanged |
| Codex compatibility schema and adapter release | `platforms/codex/manifest.json` |
| Codex lowering implementation | `scripts/lib/codex-compat.mjs` |
| Codex role semantics | `platforms/codex/agents/*.toml` templates |
| Paul's personal model mapping (5.6 supervisor / 5.4 executor) | Codex-only local/project configuration, never a Claude file or public skill rule |
| Generated Codex skills | `.agents/skills/**`, derived from Claude source + Codex adapter |
| Compatibility enforcement | `scripts/validate-codex-skills.mjs` |

Creating these owners is not enough: Phase 1 must wire `build-codex.mjs` through `codex-compat.mjs`; Phase 2/4 must make generated skills actually reference emitted agent roles; Phase 5 must prove each declared capability has consumers and no unresolved source construct bypasses the adapter.

## Verification

### Per-phase mechanical checks

1. Frozen Claude contract:

```bash
git diff --exit-code -- CLAUDE.md .claude-plugin plugins
git status --short -- CLAUDE.md .claude-plugin plugins
```

Both must remain empty throughout implementation. `.cursor-plugin` files under `plugins/` are covered by the `plugins` path.

2. Unsupported-token scan over generated Codex output:

```bash
rg -n 'AskUserQuestion|subagent_type=|disable-model-invocation|model:\s*sonnet|Claude Code.s built-in' .agents/skills AGENTS.md
```

Target: zero unresolved hits. Generic prose such as “agent-navigability” is not banned.

3. Runtime-artifact completeness:

```bash
find .agents/skills -type f | sort
find .codex/agents platforms/codex/agents -type f 2>/dev/null | sort
```

Every generated skill reference to a helper, reference, script, or agent must resolve.

4. Deterministic generation and existing repo gates:

```bash
node scripts/build-codex.mjs
node scripts/validate-codex-skills.mjs
git diff --exit-code -- .agents AGENTS.md
```

The final diff check is run after committing/generated-output staging as appropriate; during development, inspect rather than expect empty output.

5. Global-sync smoke in an isolated temporary home:

```bash
HOME=<temporary-home> node scripts/build-codex.mjs --sync-global
rg -n 'AskUserQuestion|subagent_type=|disable-model-invocation|model:\s*sonnet' <temporary-home>/.agents/skills
```

Target: both prefixed and unprefixed skills come from compiled Codex output.

### Behavioral canaries

1. `nav-plan`: reaches the next-action gate, presents choices, and performs no action before selection.
2. `nav-audit`: dispatches read-only domain explorers and the root agent performs the coverage critic.
3. `research-dissect`: worker returns only the requested note; supervisor rejects missing sections/evidence.
4. `shape-build`: GPT-5.6 supervisor delegates a scoped item to GPT-5.4 executor, independently reads the diff, and reruns verification.
5. `shape-setup`: produces Codex `AGENTS.md` priming without claiming Claude `/init` behavior.
6. `relay-digest`: either demonstrates a real Codex open hook or clearly behaves as on-demand—never a false automatic claim.

### End-to-end acceptance

- Claude Code install before vs after: identical plugin sources, manifests, versions, and generated Claude behavior.
- Codex fresh install: skills are discoverable; explicit-only skills do not auto-fire; interactive gates stop correctly; worker roles resolve; missing capabilities fail helpfully.
- Personal Codex run: GPT-5.6 remains root supervisor and GPT-5.4 performs code-reading/executor work, verified from the spawned thread/runtime metadata.
- One full high-risk workflow (`shape-build` or `nav-plan` → executor) completes with evidence-gated review and no Claude-side diff.

## Risks and controls

| Risk | Control |
|---|---|
| Blind string replacement corrupts ordinary prose | Transform exact constructs/sections; golden fixtures; denylist only precise platform tokens. |
| Codex mirror claims a capability that was not installed | Runtime-artifact completeness gate and explicit fallback text. |
| Public marketplace hardcodes Paul's model entitlements | Public roles stay model-neutral; personal Codex config owns 5.6/5.4 mapping. |
| Codex fixes accidentally alter Claude behavior | Frozen-path diff gate after every phase and in final validator. |
| Two hand-maintained skill bodies drift | No second full skill body; adapter rules + narrow fixtures only. |
| Generated custom agents are not portable across Codex surfaces | Verify official install/discovery behavior before selecting the output destination; fail explicitly otherwise. |
| Parallel writing agents collide in one tree | Sequential write workers by default; parallel read-only or disjoint work only. |
| Validator becomes a token grep that passes broken behavior | Pair static gates with five golden renders and six runtime canaries. |

## Out of scope

- Editing or “neutralizing” Claude `SKILL.md` source in `plugins/**`.
- Changing Claude Code settings, advisor configuration, installed Claude version, manifests, or plugin versions.
- Renaming the marketplace or moving canonical sources out of the plugin tree.
- Guaranteeing identical UI across Codex app, CLI, IDE, and Claude Code; the invariant is identical supervision behavior, not identical widgets.
- Building a general multi-provider skill compiler beyond the Codex adapter.
- Automatically installing model-specific personal config for other marketplace users.

## First executable step

Implement Phase 0 only: add the adapter manifest, frozen-contract check, compatibility audit, and canary fixtures. It must expose the current false-positive compatibility surface without changing any generated skill behavior yet. This creates a safe baseline before the compiler begins rewriting semantics.
