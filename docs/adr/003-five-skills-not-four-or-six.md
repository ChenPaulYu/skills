# ADR 003 — Five skills, not four or six

**Status**: accepted — post [ADR-005](docs/adr/005-marketplace-plus-plugin-restructure.md) skills are bare verbs (`audit` / `refactor` / `headers` / `map` / `doctor`); substance unchanged.
**Date**: 2026-05-28

## Context

After 4 skills (audit / refactor / map / headers) were drafted, two more candidates surfaced: `fit` (feasibility against a spec) and `doctor` (full health-pass orchestrator). Decision: which are fundamental, which are parameterizations?

## Decision

5 skills, one verb each:

| Skill | Verb | Notes |
|---|---|---|
| `audit` | assess | Two modes: unconditional health (no args) OR feasibility (against a spec). Same machinery, parameterized input. |
| `refactor` | transform | Verbatim-move + test-gate discipline. |
| `headers` | describe (file level) | Per-file JSDoc-style headers. |
| `map` | describe (project level) | Generate `docs/codebase-map/index.html`. |
| `doctor` | orchestrate | Meta-skill: audit → plan → headers + map. Hands off refactors. |

## Why

### `fit` folded into `audit` (not a separate skill)

Mechanically identical: detect stack → inventory domains → run checks → report. Only **scope** (whole repo vs spec-touched domains) and **framing** (by rule vs gap-vs-target) differ.

Same pattern as `git diff` (no args = all) vs `git diff <branch>` — one tool, optional positional arg flips framing. Folding wins rule ⑥ + broadens trigger phrasings + kills "is this fit or audit?" ambiguity.

### `doctor` NOT merged with `refactor`

Different **entry knowledge state**:
- `refactor`: "I know what to move" (specific change)
- `doctor`: "I don't know what's wrong" (discovery)

Cf. `git commit` (know what) vs `git status` (don't know) — both modify-adjacent, not merged.

Merging would force one of: giant SKILL.md (rule ⑤), skill-call coupling (violates ADR-001 #3), or refactor absorbs audit-first mode (loses precision for "I just want to extract this hook").

### `headers` NOT merged with `map`

| Axis | `headers` | `map` |
|---|---|---|
| Write surface | N source files in-place | 1 new file (`docs/codebase-map/`) |
| PR shape | Scattered | Concentrated |
| Frequency | Per code change | Per major restructure |
| Entry intent | "I added files" | "Regenerate the HTML" |

Bonus: headers' output **feeds** map's input. Map can `head -12` each file (cheap, accurate); without persistent headers, map re-derives each run (expensive, error-prone). Separation enforces metadata persistence.

### `doctor` IS its own skill (not just README prose)

Considered: 4 atomic skills + a README sequence. Rejected:
- Full-pass workflow is recurring in Paul's work
- Manual orchestration loses the "review at each gate" structure
- A meta-skill encodes the right pauses; README prose doesn't

## Consequences

- 5 skills. `fit` lives as Mode 2 inside `audit/SKILL.md`. `doctor` references sibling protocols, doesn't re-implement.
- **Future addition rule**: new skill = new verb. Parameterization → fold (precedent: `audit`'s two modes). Composition → meta-skill (precedent: `doctor`). *(Updated by ADR-005: new family = new plugin under the marketplace.)*

## Notes

**Lesson**: first-principles consolidation pays off. Without this pass, would have shipped 6 skills (redundant `fit`) or one giant swiss-army `treat`. Ask of any new skill: new verb, or parameterization/composition? Fold or orchestrate before proliferating.
