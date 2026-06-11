# ADR 040 — parallel dispatch is a scheduling policy inside `build`: execution parallelizes, adjudication never does

**Status**: accepted
**Date**: 2026-06-11
**Plugin**: shape (`build`)
**Refines**: [ADR-011](docs/adr/011-shape-build-and-browser-verify-slot.md) (build as the forward-motion terminus; its "sequential, not parallel" discipline becomes "serial by default, parallel only by an approved schedule")
**Origin**: [`docs/observations/2026-06-11-parallel-build-scheduling.md`](docs/observations/2026-06-11-parallel-build-scheduling.md) — converged in an elicit session (Paul + agent), five forks ruled.

## Context

`build` drove In-progress items strictly one at a time ("concurrent code edits collide"). For a plan with several chunky, independent items, that serializes wall-clock that could be parallel — but naive parallelization breaks the family's three load-bearing disciplines: the per-step test gate (a shared tree during a batch contaminates every agent's test signal — disjoint *files* don't give disjoint *import graphs*), the inject↔check bracket (integration is judgment work; reading N diffs against an evolving base is inherently serial), and the <90%-ask rule (a dispatched agent cannot stop to ask the user).

The elicit run also surfaced an entrance question — "is the In-progress drain just one entrance among many?" — whose ruling bounds this design: **the board stays build's only queue** (any other source — a thoughts/ doc, a dogfood report, a spec — enters via `/shape:align` first). So parallelism cannot be a new door; it can only be a policy on the one queue.

## Decision

**Parallelism enters `build` as a scheduling policy with a proposal gate — never an execution mode.** The principle, one line:

> **Workflow is build's muscle, never its brain.** Execution parallelizes; adjudication (the schedule, the <90% halts, the join gate, the check brackets) never does.

The protocol (full text in `plugins/shape/skills/build/references/parallel-scheduling.md`): ground ALL items upfront (read-only fan-out; each `/nav:plan` artifact already carries the two scheduling inputs — Critical files + Verification — no new schema) → evaluate three criteria (disjoint footprint incl. test-import paths · fully decided ≥90% · no shared-primitive risk) → schedule a **conflicting serial prefix + disjoint parallel tail** (serialize the hub, parallelize the leaves) → **propose; the user's nod starts the batch** (on opt-in harnesses the nod IS the multi-agent opt-in) → run the tail in the **shared tree** (no worktrees), in-batch agents **write, don't test**, returning `done|blocked` (ambiguity → `blocked`, back to the serial track — never guess) → **join on ONE authoritative test gate** (red → bisect by reverting item footprints), then **check brackets serially per item**.

The dispatch facility is a **capability slot** (the browser-verify pattern): a workflow/pipeline engine as named default, plain parallel sub-agents otherwise; no facility → fully sequential. **Degrade parallelism, never the gates.**

## The price, paid knowingly

- Per-step gates degrade to a batch-level gate for the tail — small-revertible-steps traded against no-merge + no-worktree-tax. Worktree isolation was considered and declined (merge handling + per-tree dependency installs outweigh the insurance at this scale); revisit on evidence (a join-red rate worth recording).
- Criterion (a) is heavier than file footprints — test import-path entanglement must be assessed. **The load-bearing wall of this policy is the evaluation, not the execution.**
- Parallelism only pays for chunky items; dispatch overhead eats small ones.

## Notes

- The phase-split criterion compresses to one line: **does the phase ever need to talk to the user?** User-silent phases (ground fan-out, write tail) may dispatch; adjudicating phases (proposal, serial prefix, join) stay in the main loop. This is the same boundary as elicit's "summoned, not ambient" — the user's voice cannot be delegated.
- The schedule-as-proposal ruling reuses the family's division: scheduling is align-natured (decided *with* the user), execution is build-natured (confidence-gated autonomy).
