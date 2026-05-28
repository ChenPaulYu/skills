# ADR 006 — Add `/nav:plan` as nav's 6th skill (refines ADR-003 #1 fold/split criteria)

**Status**: accepted
**Date**: 2026-05-28
**Refines**: [ADR-003](docs/adr/003-five-skills-not-four-or-six.md) #1 (the "fit folded into audit" judgment) and #5 (the 5-skills-is-the-minimum lesson)

## Context

ADR-003 #1 folded "feasibility audit" into `/nav:audit` Mode 2, arguing they were "mechanically identical: detect stack → inventory → checks → report." Lived feedback (the conversation that produced this ADR) showed that judgment was incomplete:

- Audit Mode 2 stops at the gap-analysis report (read-only, one-shot).
- The full "I want to build feature X" workflow continues past the report — it needs to **clarify** ambiguity with the user, then produce a durable **plan artifact**.

ADR-003 looked at the first 3 stages (which match) and missed the divergence at stage 4+ (output shape + interaction model).

## Decision

1. **New skill `/nav:plan`** added under the existing `nav` plugin. 6 skills total now.
2. **`/nav:plan` has 1 mode** — always takes a spec/feature input. (Audit's two-mode symmetry doesn't apply: there's no meaningful "plan without a target" — that case is doctor's job.)
3. **Plan is self-contained**: inlines audit-equivalent as Stage 1, then Clarify, then Plan. It does NOT skill-call `/nav:audit` (per ADR-001 #3).
4. **Stage 1 carries a "scan transcript first" preamble**: if `/nav:audit <spec>` was run earlier in this conversation, reuse its findings; otherwise run fresh. This is prose-level instruction for context-aware execution, not skill coupling.
5. **Audit Mode 2 stays** as the quick read-only check. Frontmatter cross-refs `/nav:plan` for users who want the full workflow.

## Why nav (not a new `spec` plugin)

Considered: new plugin `spec` containing `/spec:plan` (and future `/spec:write`, `/spec:review`).

Rejected because:
- Planning against a codebase IS navigability work — you navigate to scope a change. Same topic as nav.
- A new plugin needs > 1 skill to earn its weight; speculative future siblings aren't enough (rule ⑥).
- `/nav:plan` keeps the audit ↔ plan relationship inside one plugin's CLAUDE.md, easier to maintain.

If a real second spec-family verb shows up later (`write`, `review`, …), promote then — rename `/nav:plan` to `/spec:plan` and start the spec plugin properly. Don't speculatively split now.

## Refined fold/split criteria (supersedes ADR-003 #1's rule)

When deciding whether a new capability should fold into an existing skill or split into a new one:

| Criterion | Same skill if… | Different skill if… |
|---|---|---|
| Mechanical steps | Identical | Identical OR divergent |
| Output shape | Same (e.g. both reports) | Different (report vs artifact vs dialog) |
| Interaction model | Same (e.g. both one-shot) | Different (one-shot vs interactive vs persistent) |

**If output OR interaction differs → split**, even if early steps match.

ADR-003 #1 saw step-match and concluded fold; missed the divergence past step 3. ADR-006 fixes the criteria.

## Why audit Mode 2 stays

Two distinct entry intents:

| Intent | Right skill |
|---|---|
| "Can my code carry this spec?" (quick read, stop) | `/nav:audit <spec>` (Mode 2) |
| "Plan how to build this spec" (full workflow) | `/nav:plan <spec>` |

Killing Mode 2 would force the user into the full plan workflow even for a 30-second sanity check. The two share Stage 1 logic (gap analysis); they diverge in what follows.

## The reuse-via-transcript pattern

Worth highlighting as a reusable design idiom: meta-skills (`doctor`, `plan`) that incorporate another skill's protocol should add a "scan transcript first" preamble when the upstream skill might have just run. This:

- Avoids redundant work in long sessions
- Stays inside SKILL.md prose (no skill-calls-skill, ADR-001 #3 preserved)
- Is deterministic — LLMs follow explicit instructions reliably; they don't reliably notice un-prompted reuse opportunities

Doctor and Plan are the current users. Future orchestrators inherit this pattern.

## Consequences

- New folder `plugins/nav/skills/plan/` with `SKILL.md`.
- `/nav:audit` SKILL.md keeps Mode 2; frontmatter directs full-workflow users to `/nav:plan`; Notes section cross-refs.
- `plugins/nav/CLAUDE.md`: verb list grows to 6; mention plan + the reuse-via-transcript pattern.
- `docs/site/index.html`: `NAV_NODES` gains a `plan` node (kind: orchestrator-like, since it inlines audit + adds dialog); `DOMAINS.nav.files` gains the plan row; sidebar may keep as-is; audit block bumped with FIXED entry.
- `README.md` invocation list gains `/nav:plan`.
- ADR-003's "5 skills" framing updated: 6 skills, the consolidation principle stands (each new skill = new verb).

## Notes

**Lesson**: fold judgments need to look at the full workflow, not just opening steps. Early-stage match is necessary but not sufficient for folding — output shape + interaction model decide. ADR-003 #1's "fit folded into audit" was correct given what we then knew; this ADR refines the rule with what the lived workflow taught us.

**Not a new plugin (yet)**: the speculative-siblings argument for `spec` plugin didn't carry — rule ⑥. Promote `/nav:plan` to `/spec:plan` if and when a second spec-family verb actually shows up.

**What this doesn't change**:
- The other 5 nav skills stand (audit, refactor, headers, map, doctor).
- The 11 rules apply to plan too.
- Self-contained SKILL.md (ADR-001 #3), language-agnostic (ADR-004), bare-verb naming (ADR-005) all carry over.
