# ADR 084 — Add `reflect:retrace` for evidence-backed causal development alignment

**Status**: accepted
**Date**: 2026-07-15
**Source**: [`blueprints/thoughts/2026-07-15-reflect-retrace.md`](blueprints/thoughts/2026-07-15-reflect-retrace.md) · [`docs/observations/2026-07-15-chronology-does-not-restore-alignment-without-causal-bridges.md`](docs/observations/2026-07-15-chronology-does-not-restore-alignment-without-causal-bridges.md) · ratified by Paul 2026-07-15

## Context

A long development arc left the user unable to reconstruct why one implementation stage led to the next. A chronological outline named the stages correctly but did not restore alignment; it became useful only after each transition named the unresolved pressure from the prior stage and exposed concrete evidence such as real data shapes, commands, metrics, and audio.

No current skill owns that job. `reflect:catchup` reports present state, `nav:tour` builds a corrected model of the current codebase, and `reflect:observe` distills one durable learning. ADR-079 retired `reflect:summarize` because a chronological recap added no machinery beyond a default response, so any new historical skill must clear that same No-Op bar.

## Decision

1. **Add a summoned `reflect:retrace` skill.** Its object is the development path itself: how the work arrived at the current state and what pressure forced each turn.
2. **Make the causal stage the fixed unit.** Every stage contains prior state, pressure, evidence, decision, implementation/validation status, and next pressure. A missing next pressure is labeled as a gap rather than replaced with a decorative transition.
3. **Provenance-label rationale.** Use Recorded for an explicit decision source or user statement, Inferred for a bounded reconstruction, and Unknown when the sources do not support the claim. Separately label status as discussed, decided, implemented, verified, committed, or deferred.
4. **Require an outline correction gate.** First present the causal outline in chat; render only after the user accepts or corrects stage boundaries, decisions, and bridges. The user owns intent that durable files may not contain, while git/files own what actually shipped.
5. **Make the final deliverable a dated interactive HTML artifact.** Each abstract stage exposes at least one inspectable concrete witness when evidence exists: a real data shape, command/result, diff, metric, state comparison, image, or playable media. The artifact is browser-verified before a reachable URL is handed over.
6. **Default storage to `docs/retraces/<date>-<topic>/index.html`.** Tolerate and prefer an established project artifact location when one exists. Stamp the artifact with date, scope, git SHA when available, and evidence basis; do not silently refresh an old snapshot.
7. **Keep retrace judgment-heavy and user-invoked.** It stays on the session model and never auto-fires merely because a session is long. It writes only its retrace artifact and never edits code, plans, decisions, or canon.

## Why

- **The bridge is real machinery.** A chronological list says what followed what; the six-field stage explains what unresolved pressure made the next turn necessary.
- **The correction gate prevents polished false history.** Git proves shipped state, but only recorded decisions or the user can confirm intent; Recorded/Inferred/Unknown keeps those sources honest.
- **Concrete witnesses transfer understanding.** The motivating case became legible only when abstract claims were paired with actual fields, edit behavior, restore values, probe metrics, and audio.
- **The object keeps the family boundary clean.** `nav:tour` explains the present system; `reflect:retrace` explains the path of work. Combining spatial and temporal models would make one door the wrong grain.
- **The artifact makes the recurring alignment move inspectable and reusable.** A plain response cannot supply the same corrected, linked, media-bearing, browser-verified report by default.

## Boundaries

| Neighbor | Boundary |
|---|---|
| Plain recap / retired `reflect:summarize` | A recap is chronological and requires no skill. Retrace exists only for causal stages, provenance, correction, concrete witnesses, and a verified artifact. |
| `reflect:catchup` | Catchup answers where the cursor is now and what comes next. Retrace reconstructs the full pressure-bearing path. |
| `nav:tour` | Tour builds a corrected model of the current codebase. Retrace explains why work changed across time, including probes and decisions not represented by current code. |
| `reflect:observe` | Observe selects one durable learning. Retrace preserves the complete causal context needed for human re-entry. |
| Planned `reflect:retro` | Retro evaluates process friction and prescribes one process change. Retrace is explanatory and neutral. |
| `shape:mockup` | Mockup renders disposable candidates to decide a future shape. Retrace renders a durable evidence-backed account of an already-lived arc. |
| `shape:align` / `shape:elicit` | Retrace reports the current boundary and unresolved questions; it does not choose priorities or adjudicate a new product decision. |

## Consequences

- `reflect` moves from three to four active skills: `catchup`, `park`, `observe`, `retrace`; planned `retro` becomes a possible fifth member.
- `reflect` moves from two writers to three: `park` writes the cursor, `observe` writes selected learnings, and `retrace` writes a dated alignment artifact.
- The reflect plugin version moves from `0.5.0` to `0.6.0`; README, site map, Codex projection, manifests, and generated mirrors update in the same change.
- The originating observation remains `raw`: one accepted skill does not fabricate a second independent use case.
- `retrace` ships without a fixed visual skin. It adapts to the project's established artifact style and may gain a reusable template only after repeated outputs reveal a stable shared skeleton.

## Retirement condition

Retire `retrace` or fold it back into a plain request if real use shows that removing the causal-stage schema, provenance labels, outline correction gate, concrete witnesses, or interactive artifact does not reduce alignment. A nicer chronological summary is not enough to keep the door.
