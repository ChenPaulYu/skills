# ADR 016 — `align` is a status *sync*, not a read-only re-render; the align↔reconcile boundary

**Status**: accepted
**Date**: 2026-05-29
**Plugin**: `shape`
**Relates to**: `align` (ADR-010); pairs with [ADR-014](docs/adr/014-reconcile-amend-and-elicit-boundary.md) (which drew reconcile's fact-vs-decision line — this draws the adjacent item-status-vs-doc-currency line).

## Context

`align`'s Step 2 ("ground in current reality") read as a soft instruction — read `thoughts/` + grep what's built. In practice a board kept drifting: items stayed marked `待驗 / TBD / 待驗是否已做` ("not sure if this shipped") across align runs, because align re-rendered the *plan's own claims* instead of verifying them against the code. A board that still says "TBD: is X done?" after an align run defeats align's whole purpose — the board is supposed to reflect *verified present reality*, the same invariant as a non-lying codebase map.

This surfaced live: a real plan had Derive A sitting in In-progress marked "待驗是否已做" while the code showed it shipped — align should have moved it to Shipped, not carried the question forward.

## Decision

**1. `align` verifies done-ness against the code — it does not trust the plan's own claims.** Step 2 grounds "actual state" via grep + `head -12` headers + `git log`. For every In-progress / Next item — *especially any marked 待驗 / TBD / not-sure-if-done* — align confirms it against the code and, if shipped, **moves it to ✅ Shipped** in the Step 3 triage. A `TBD: is X done?` surviving an align run is an **align failure**.

**2. Draw the align↔reconcile boundary explicitly** (it pairs with ADR-014's reconcile boundaries):
- **`align` = item-*status* reconciliation** — is this *plan item* done / in-progress / not-started? It moves items between columns. This is align's job.
- **`reconcile` = *doc-currency* reconciliation** — is this *thought doc* still live, or stale/superseded (amend / prune / consolidate)? That stays reconcile's job.
- Don't conflate: align never prunes a thought doc; reconcile never re-triages plan columns.

## Why

- It makes align's "two renders, one *present* state" promise real: the board can't quietly preserve stale status.
- It costs almost nothing — align already greps the code in Step 2; this just forbids carrying an unverified claim forward.
- The explicit boundary keeps the two maintenance verbs from overlapping now that both touch "make the record match reality" (align on item status, reconcile on doc currency).

## Consequences

- `plugins/shape/skills/align/SKILL.md`: Step 2 reworded ("verify against the code; don't trust the plan's own claims"; adds `git log`) + a "Sync-confirm done-ness" paragraph with the boundary note.
- `docs/site/index.html` (gating): align node / module-map desc note "verifies done-ness against code; moves shipped items to Shipped". ADR count 15 → 16.
- No version bump (align's existing charter sharpened; no new skill).

## Notes

- Together ADR-014 + 016 fully partition shape's "match reality" surface: reconcile syncs *doc facts* (amend) and retires *dead docs* (prune/consolidate); align syncs *item status* (move to Shipped). Each writes only its own layer.
