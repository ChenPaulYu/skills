# Parallel build scheduling — execution parallelizes, adjudication never does

> **TL;DR:** Parallelism enters `shape:build` as a *scheduling policy*, not an execution mode: ground ALL items first (read-only, fan-out) → the evaluation emits a schedule proposal — "conflicting serial prefix + disjoint parallel tail" — the user's nod starts it (and doubles as the multi-agent opt-in) → shared tree, in-batch agents write-only, ONE authoritative gate at join. User-silent phases go to a workflow; every adjudication stays in the main loop.
>
> Status: converged 2026-06-11 (elicit session, Paul + agent). Not yet implemented — lands as an ADR + `build` SKILL.md extension when built.

## The one-line principle

**Workflow is build's muscle, never its brain** — parallel dispatch is a scheduling policy inside `build`, fed by the one queue, proposed to the user, integrated serially.

## The decided forks

| Fork | Ruling | Why |
|---|---|---|
| Where parallelism lands | **Inside `build`** — no new verb, no new entrance | Scheduling is the orchestrator's job; build already is the orchestrator meta-skill (ADR-011). |
| Build's entrance | **A: board is the contract** — the In-progress column stays the *only* queue; any other source (a thoughts/ doc, a dogfood report, a spec) enters via `/shape:align` first | Board stays the single truth — reconcile's whole premise; nothing ships that the board never saw. The "express triage" lane in align stays unbuilt until the ceremony tax actually bites (no-init razor). |
| Worktree isolation | **No worktree** — shared tree, conflict-aware scheduling instead | Merge handling costs more than it saves here. The compensating rule (below) covers what isolation bought. |
| Batch approval | **Schedule-as-proposal** — build presents "these items can run parallel: N+M+K, because…" and the user's nod starts the batch | Scheduling is adjudication (align-natured: decided *with* the user); execution inside an approved batch is autonomous (build-natured: confidence-gated). The nod also satisfies the harness's explicit multi-agent opt-in. |
| Workflow tool fit | **Only the user-silent phases** — full grounding fan-out + the parallel write tail. Proposal, serial prefix, and join stay in the main loop | Workflow agents cannot stop to ask; the in-main phases are exactly where <90% halts and check-bracket judgment live. |

## The schedule shape

1. **Ground ALL items upfront** (change from today's just-in-time per-item grounding). Read-only → itself parallelizable (workflow fan-out). Each item's `/nav:plan` artifact already carries the two fields scheduling needs: **Critical files** (footprint) and **Verification** (test scope) — no new schema.
2. **Evaluate** each item on three criteria: (a) disjoint footprint — files AND test-import paths, not files alone; (b) fully decided (≥90%, no ambiguity an agent would have to guess through); (c) no shared-primitive risk (two items plausibly needing the same new util → pre-extract the primitive serially, then parallelize).
3. **Schedule**: items that touch others form the **serial prefix** (run first, full per-step discipline, main loop — serialize the hub); the truly disjoint remainder forms the **parallel tail** (workflow pipeline — parallelize the leaves).
4. **Propose** the schedule; user nods.
5. **Run the tail** in the shared tree: in-batch agents **write, don't test** (footprint-scoped tests are advisory at best — disjoint files ≠ disjoint import graphs); each returns a diff summary + `done|blocked`. Ambiguity → `blocked`, drops to the interactive track — never guesses.
6. **Join**: ONE authoritative full test gate. Red → bisect by reverting item footprints (disjointness guarantees this works). Then the per-item **check bracket** (read the diff · same-domain grep · seam/header/smell scan) runs serially in the main loop — integration is judgment work and never parallelizes.

## The price, paid knowingly

- Per-step gates degrade to a batch-level gate for the parallel tail — "small revertible steps" traded for "no merge + no worktree tax". Accepted 2026-06-11.
- Criterion (a) is heavier than file-footprint: test **import-path entanglement** must be assessed too. The load-bearing wall of this design is the evaluation, not the execution.
- Parallelism only pays for **chunky** items — dispatch overhead (per-agent inject context ×N) eats the gain on small ones.

## Pointers

- Entrance ruling reaffirms the seam in `plugins/shape/CLAUDE.md` (build ← reads `plan.md` as the work-list; writes back via align).
- Implementation: extend `build` SKILL.md (scheduling policy section + capability-slot naming — "concurrent dispatch facility", workflow as named default) + ADR + site-map sync in the same change-set.
