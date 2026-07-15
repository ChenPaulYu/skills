# reflect:retrace — plan

> Generated: 2026-07-15 · Spec source: `docs/observations/2026-07-15-chronology-does-not-restore-alignment-without-causal-bridges.md` · Stage 1: fresh

## Context

The `reflect` family currently owns the work cursor (`catchup`/`park`) and durable learning (`observe`). It deliberately retired `summarize` in ADR-079 because a chronological recap adds no machinery beyond a competent default response. `nav:tour` now owns a different object: the current codebase model, with a conversational correction loop and provenance-labeled rationale.

The observed gap is neither current-state orientation nor codebase explanation. After a long, multi-decision development arc, a person may know the current result but no longer understand why the work moved from one stage to the next. A stage-accurate timeline did not restore alignment; an evidence-backed causal chain did. The proposed skill must therefore earn its door by forcing a structure a plain recap skips: each stage carries the prior belief, friction, evidence, decision, implementation/validation status, and the unresolved tension that forced the next stage. It then turns the corrected outline into a concrete interactive artifact.

The target is a new summoned `reflect:retrace` skill. It remains grounded in durable project evidence plus live context, writes only a dated retrace artifact, and never edits code or decision canon. The generic `skill-creator` initializer is deliberately not used: this marketplace's plugin source tree and generators are the established scaffold and own the Codex projections.

## Resolved questions

| Question | User's answer |
|---|---|
| Skill name | `retrace` in the `reflect` family |
| Core job | Explain how the work arrived here through causal, evidence-backed transitions, not chronological recap |
| Human alignment gate | Present the causal outline first; render only after the user corrects or accepts it |
| Final medium | A plain-language interactive web artifact with concrete examples and available media |
| Family boundary | Separate from codebase `tour`; one explains present system structure, the other explains development causality |
| Durability | Record the observation first, then implement the skill with a thought and ADR |

## Approach

### 1. Preserve the design path

1. Write a thought that owns the motivating case, naming journey, causal-stage model, sibling boundaries, and artifact shape.
2. Write ADR-084 to ratify the new skill, its No-Op defense against retired `summarize`, its boundary with `nav:tour`, its write behavior, and a retirement condition.
3. Link both to the observation rather than duplicating its evidence in every surface.

### 2. Author the skill

1. Create `plugins/reflect/skills/retrace/SKILL.md` with explicit invocation only.
2. Implement a two-pass protocol:
   - reconstruct and provenance-label the causal outline;
   - wait for user correction, then render and activate the interactive artifact.
3. Require every stage to carry six fields: prior state, pressure, evidence, decision, status, next pressure.
4. Require at least one inspectable concrete example per abstract stage when evidence exists; label absence instead of fabricating one.
5. Distinguish Recorded / Inferred / Unknown rationale, and distinguish decided / implemented / verified / committed / deferred status.
6. Default the dated output to `docs/retraces/<date>-<topic>/index.html`, while tolerating an established project artifact location when one exists.
7. Browser-verify interaction, responsive layout, console state, and local media/links before handing over a reachable URL.

### 3. Register the new reflect member

1. Update `plugins/reflect/CLAUDE.md` from three to four active skills and from two to three writers; keep planned `retro` distinct as process evaluation.
2. Bump the reflect manifest from `0.5.0` to `0.6.0`, update its owned description/keywords, and regenerate derived manifests.
3. Add the Codex trigger projection in `platforms/codex/descriptions.json`.
4. Update README and the bilingual site map in the same change: roster, invocation entry, counts, reflect graph/detail, revision, ADR count, and version.
5. Regenerate `.agents/skills/reflect-retrace/` and `AGENTS.md`; never edit generated copies by hand.
6. Update `blueprints/plan.md` only after implementation and checks actually pass.

### 4. Verify the differentiator

1. Probe positive triggers such as “how did we get here?”, “I feel left behind”, and requests for a development journey.
2. Probe boundaries: present cursor → `catchup`; current codebase model → `tour`; ordinary chronological recap → no skill; process mistakes → planned `retro`; roadmap decision → `shape:align`/`shape:elicit`.
3. Check the skill against the motivating artifact and a sparse evidence shape. It must label uncertainty rather than invent a bridge.
4. Run manifest/Codex generators, the repository validator, compatibility audits, and deterministic-regeneration checks.

## Critical files

| File | Why it matters | Touched in step |
|---|---|---|
| `plugins/reflect/skills/retrace/SKILL.md` | New workflow and completion contract | 2 |
| `blueprints/thoughts/2026-07-15-reflect-retrace.md` | Owns the design journey and still-useful rejected framings | 1 |
| `docs/adr/084-reflect-retrace-causal-development-alignment.md` | Ratifies the public door and boundaries | 1 |
| `plugins/reflect/CLAUDE.md` | Reflect family roster, value guardrail, writers, and retro boundary | 3 |
| `plugins/reflect/.claude-plugin/plugin.json` | Version and plugin metadata owner | 3 |
| `platforms/codex/descriptions.json` | Codex trigger projection | 3 |
| `README.md` | Human roster and invocation surface | 3 |
| `docs/site/index.html` | Bilingual marketplace map and counts | 3 |
| `.agents/skills/reflect-retrace/SKILL.md` | Generated Codex mirror | 3 |
| `AGENTS.md` | Generated repo context | 3 |
| `docs/findings/2026-07-15-reflect-retrace-routing-probe.md` | Routing and boundary evidence | 4 |
| `blueprints/plan.md` | Status board, updated only after verified implementation | 3 |

## Single-source-of-truth owners

| Decision | Owner |
|---|---|
| Retrace causal-stage contract | `plugins/reflect/skills/retrace/SKILL.md` |
| Why the skill exists and how it differs from siblings | `docs/adr/084-reflect-retrace-causal-development-alignment.md` |
| Origin case and naming/design journey | `blueprints/thoughts/2026-07-15-reflect-retrace.md` |
| Plugin version and marketplace metadata | `plugins/reflect/.claude-plugin/plugin.json` |
| Per-project retrace output | The dated `docs/retraces/<date>-<topic>/index.html` generated by the skill |

## Verification

1. Skill shape → verify frontmatter, stage schema, provenance labels, status labels, outline gate, output/activation protocol, and completion criterion by inspection and routing probes.
2. Registration → `rg -n '/reflect:retrace' README.md docs/site/index.html` and confirm the generated mirror exists.
3. Generated owners → run `node scripts/build-manifests.mjs`, `node scripts/build-codex.mjs`, and then require a second build to produce no diff.
4. Repository gates → run `node scripts/validate-codex-skills.mjs`, `node scripts/validate-codex-skills.mjs --compat-audit`, and `node scripts/validate-codex-skills.mjs --codex-compat`.
5. Surface gate → `git status --short README.md docs/site/index.html` must show both modified.
6. Hygiene → `git diff --check`; scan the source skill for origin-project nouns and forbidden relative-link styles.

End-to-end: a user asking how a long development arc arrived at its present design receives a provenance-labeled causal outline first; after correction, a browser-verified interactive artifact makes every transition and available concrete proof inspectable without presenting inferred history as fact.

## Out of scope

- Evaluating which development choices were wasteful or prescribing a process improvement; that remains the planned `reflect:retro` job.
- Explaining the current codebase as a stable system model; that remains `nav:tour`.
- Deciding the roadmap or editing product decisions/canon.
- Automatically running on every long session; all reflect skills remain summoned.
- Shipping a fixed visual skin that overrides a project's established artifact style.
