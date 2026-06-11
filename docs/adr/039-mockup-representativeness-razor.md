# ADR 039 — the mockup representativeness razor: keep iff canon-pinned ∨ in-flight ∨ parked

**Status**: accepted
**Date**: 2026-06-11
**Plugin**: shape (reconcile — sharpens the ADR-037 mockups tier)
**Origin**: [`docs/observations/2026-06-11-mockup-prune-razor-canon-pinned-or-inflight-or-parked.md`](../observations/2026-06-11-mockup-prune-razor-canon-pinned-or-inflight-or-parked.md) — first field run of the mockups tier (TrackMate, 16 folders, four gated rounds). Promoted on the user's explicit request (ADR-038 precedent).

## Context

ADR-037's keep-set worked but its citation clause ("③ hits a *load-bearing* citation") didn't say **who can grant load-bearing status** — every thoughts-cited derivation-archaeology folder became a judgment call, stretching one sweep into three gated rounds. The user converged the rule his picks had been following, then compressed it to a first principle that reproduced all 16 verdicts retroactively.

## Decision

> **A mockup exists to represent what the running system cannot yet represent; once code absorbs it, representation transfers and it exits.** Keep iff: **canon-pinned** (cited from core docs — the part code can never absorb, e.g. texture sampling) ∨ **in-flight** (not yet absorbed) ∨ **parked** (won't absorb for now). Everything else → prune as the **default proposal** (per-file gate stands).

Sharpening vs ADR-037: **only canon can pin.** Citations from sibling blueprints docs (thoughts/plans) are re-pointable (salvage → `git log --follow` pointer) and never block retirement.

## Notes

- **Source material is out of the razor's jurisdiction** (a user original that thoughts *extract from* is an input-to-decisions, not a decision-render). Its absorption-lifecycle clause (prune only by *asking* the author) stays raw in the observation — one sample; second sighting promotes it.
- Landed in `reconcile/SKILL.md` as three surgical edits (principle sentence · canon-pinned row · default-direction line), net +6/−4 lines — skill-text budget respected.
