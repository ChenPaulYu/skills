# ADR-119 — `/fathom:compile` compiles the study into its artifacts

> 2026-08-15 · Status: accepted · fathom 0.12.1 → 0.13.0 · marketplace 26 → 27 skills

The door shipped as `compile` (one compiler, three artifacts). `atlas` is the graduated
Behavior/Code map — the product that earned the fifth verb — not the verb's name.

## Context

Four verbs (ADR-116) cover the study itself: `index` grounds, `guide` teaches, `quiz` checks
retention, `dive` follows one thread. None of them owns the moment "show me the map of what we
have understood so far" — a compile that fires after a dive, on returning to a stale study, or
from another session's one-line request. Folding that compile into `guide` would trap it inside
a teaching climb; folding it into `index` would make grounding also a rendering job.

The form was converged in the method lab (two frozen posters, a purely semantic fixture, a
two-pass create→verify compile, honest fog for un-studied territory) and validated across four
studies before this door was proposed. ADR-116's own bar still applies: a fifth verb lands only
when no existing door can carry the moment.

Binding each artifact to its birth gate inside `index`/`guide` was tried and rejected: that
conflates *when an artifact may first exist* (data) with *when someone wants it compiled* (any
time).

## Decision

**A fifth verb, `/fathom:compile`**, owns the compile. Study state in; fixture-driven shells
out. Re-runnable at any time: each run is a full re-render of current understanding with stable
identity, so the artifacts enrich as the study deepens rather than snapshotting a milestone.

Each study level births its own artifact — different products, never one mega-fixture:

| Artifact | Birth altitude | Status |
|---|---|---|
| **horizon** | Repository | lab-side until fixture-ization pilots pass |
| **tides** | System / State | lab-side until fixture-ization pilots pass |
| **atlas** | Behavior / Code | graduated |

All three are compiled by this one door, which reads the study's recorded gate to decide what
may exist. `index`/`guide` keep a one-line offer pointing here; they own no compiler machinery.

Boundaries that keep the split paying:

- **Not `guide`.** Guide teaches; compile re-creates teaching *artifacts* from what the study
  already recorded. Export is a separate post-study pass (教學是再創作), not a byproduct of a
  level gate.
- **Not `index`.** Index grounds (pin, collapse, trust verdict, file:line index). Compile
  renders what later verbs wrote down. It needs an existing `studies/<name>/` with a pinned clone.
- **Not `/nav:sync`'s map.** Sync maps a repo you maintain, as durable headers plus a periodic
  codebase map. Compile's atlas maps a *study* — progressive, fog-honest, learner-facing 繁中
  narration — and is one-way: the map reads the study, the study never depends on the map.

Compiler machinery (shell, schema, scanner, two-pass loop, birth gates) lives in
`plugins/fathom/skills/compile/` — first consumer owns. When horizon/tides graduate, N+1 lifts
the shared law to plugin `assets/shells/` + `references/compile/`. Until then they stay
hand-built per study.

## Consequences

- Marketplace 26 → 27 skills; fathom 0.12.1 → 0.13.0.
- Registration surfaces updated in the same commit (README rows + per-plugin list, site map
  DOMAINS/CB node, Codex sidecar) per gate #3.
- Risk accepted: five doors where four stood. The ADR-109 retirement rhythm applies — a door
  drawing zero fires across three months is demoted to summon-only before deletion is argued.
  `compile` is a watch candidate alongside `quiz` and `dive`.
- Method changes still originate in the etudes lab (fathom CLAUDE.md's existing rule); this
  ADR ships the door that survived, not the lab's instruments.
