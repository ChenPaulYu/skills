# ADR 021 — Retire `nav:doctor` (too thin an orchestrator after the sync merge)

**Status**: accepted
**Date**: 2026-06-01
**Amends**: [ADR-003](docs/adr/003-five-skills-not-four-or-six.md) (skill roster — now four), [ADR-019](docs/adr/019-sync-collapses-headers-and-map.md) (the merge that triggered this)

## Context

`nav:doctor` was a meta-skill: a convenience layer that sequenced `audit → headers → map` with user-review gates, plus a 4-bucket categorized plan and a structural-refactor tee-up. It earned its place when it orchestrated **three** atomic steps.

[ADR-019](docs/adr/019-sync-collapses-headers-and-map.md) then collapsed `headers` + `map` into the single `sync` door. After that, doctor orchestrated only **two** steps — `audit → sync` — and `sync` already carries its own internal gate (Phase A header-diff reviewed before Phase B) and already reuses `audit` via the transcript preamble. So doctor's unique residue shrank to: the 4-bucket categorization, the refactor tee-up, and the "do the works / something feels off" single entry.

A telling asymmetry surfaced: shape's own CLAUDE.md defers its `doctor` until "≥3 skills are proven" — yet nav kept a doctor orchestrating just two. By the project's own bar, a 2-step orchestrator is below the line.

## Decision

**Retire `nav:doctor`.** nav goes from five skills to **four**: `audit` · `refactor` · `sync` · `plan`.

What happens to its residue:
- **The "full health pass" entry** (`tune up this repo`, `do a full sweep`, `do the works`, `my codebase feels unhealthy`, `give my code a checkup`) folds into **`audit`'s description** — those phrasings now route to audit, which surfaces findings and hands off.
- **The act-on-it step** is already covered: `audit` is read-only and points onward; `/nav:sync` refreshes headers + map (gated internally); `/nav:refactor` does structural moves. The user runs the two-step sequence themselves — it's short enough not to need a skill wrapping it.
- **The gates** survive inside `sync` (header diff before map) and `refactor` (test-gate each step).

## Why not keep it

Per rule ④ (right grain — neither giant nor fragmented) and the N+1 razor applied to *orchestration*: an orchestrator with little to orchestrate is needless abstraction — ceremony, not convenience. "I felt something's off, run the works" is a real UX, but with only two downstream steps (one of which self-gates), the wrapper costs more (a skill to maintain, a trigger surface that competes with audit's) than it saves.

## Consequences

- nav roster: **four skills**. ADR-003 amended; `audit` absorbs the full-pass trigger phrasings.
- `offer-next-action` (ADR-007) and `inject↔check` (ADR-008) lose a user — they now apply to `plan` + `refactor` (nav) and the shape skills; the patterns are unaffected.
- `sync`'s "engine stays two pieces" rationale no longer cites doctor's between-gate (doctor was one reason); it now rests on `sync`'s own internal gate + `/shape:reconcile` reading only the header artifact + room for a future third renderer.
- **shape's deferred `doctor`** note is reframed: nav:doctor's retirement is a *caution* (don't build an orchestrator until the sequence earns it), not a precedent to follow.
- Historical ADRs (003 aside from the amendment, 006/007/008) left intact — they record the period when doctor existed; supersede forward, don't rewrite history.
- Gating site map updated: NAV_NODES drops the doctor node + its edges, nav anatomy lede + heading + counts updated, audit block bumped.
