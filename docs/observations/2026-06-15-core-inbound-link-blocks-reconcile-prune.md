---
date: 2026-06-15
status: raw
---

# A shipped thought linked from `core/` can't be pruned by reconcile — the door blocks it

## What happened

TrackMate full-tree `/shape:reconcile` sweep (56 docs). Several 06-11/06-12 thoughts were
fully shipped + their durable why already in `decisions.md` — textbook prune candidates. But
the inbound-link check (run before every prune, as the skill says) surfaced a harder fact than
"resolve the links first":

- `dock-structure-viewer`, `dual-grip-single-timeline` ← linked from **position.md AND design.md**
- `fork-tab-mechanism`, `human-propose`, `timeline-working-reviewer`, `right-pane-core` ← linked from **design.md**
- `timeline-stuck-point` ← linked only from `plan.md`

The ones linked from `core/` **cannot be pruned by reconcile at all** — not "resolve the link
then prune", but *structurally blocked*: resolving a core inbound link means editing core, and
editing core is `/shape:position`'s door (ADR-041, single-writer + freeze-gated). reconcile has
no write permission to core. So those 6 thoughts → forced **KEEP** (they're the derivation
trails core points to via `[[...]]` magnifier links; design.md even says "完整推導鏈見 thoughts").
Only `timeline-stuck-point` (plan-only inbound) was cleanly prunable.

The same wall hit graduation: Paul wanted `right-pane-core` + `dock-timeline-true-daw` graduated
into `decisions.md` (which means prune the thought). `dock-timeline-true-daw` had NO core link →
clean graduate+prune. `right-pane-core` was design.md-linked → graduate the why into decisions.md,
prune the thought, but the design.md link now dangles → had to **queue an amendment in
`docs/core/amendments.md`** for the next `/shape:position` to re-point it. reconcile executes the
graduate; the core re-point waits at the door.

## Why it matters

The current `shape:reconcile` skill says "inbound links resolved" (mechanical, listed as evidence)
and has a `mockups/` tier with a "canon-pinned → keep" clause. But it has **no equivalent rule for
the `thoughts/` tier**: a thought cited from core is exactly as un-prunable as a canon-pinned
mockup, for the same reason (the citation lives behind a door reconcile can't open). Without the
rule stated, an agent either (a) dangles a core link by pruning anyway, or (b) re-derives the
"oh, I can't write core" realization live every sweep (I did — it visibly reshaped the whole
prune tier mid-run). It's a repeatable, ADR-041-grounded constraint, not a judgment call.

There's a sharp asymmetry worth naming: **core-inbound = prune-blocked (KEEP as derivation trail);
sibling-doc-inbound = re-pointable (update the link, then prune).** Same as the mockup tier's
"only canon can pin." The thought tier needs the identical clause.

## What it could become

A clause in `shape:reconcile`'s currency-sweep table (the `thoughts/` row, mirroring the
`mockups/` canon-pinned row):

> A shipped thought **cited from `core/`** is KEEP — pruning needs resolving the core inbound
> link, which is a core write = `/shape:position`'s door (ADR-041). It stays as the derivation
> trail core points to. To graduate it anyway: land the why in `decisions.md`, prune the thought,
> and **queue the core re-point in `amendments.md`** — never dangle a core link, never write core.
> Sibling-doc (thoughts/plans) inbound links don't block: re-point them to `decisions.md`/git-pointer
> and prune.

Pairs with the existing "canon-grade → recommend /shape:position" routing — this is the
*mechanical* counterpart (link integrity), where that one is the *altitude* counterpart.

## Evidence so far

- This session: 6 thoughts force-KEPT by core links; 1 (plan-only) cleanly pruned; 1 graduate
  (`right-pane-core`) needed an `amendments.md` queue for the design.md re-point; 1 graduate
  (`dock-timeline-true-daw`, no core link) was clean.
- Related: [[2026-06-11-core-write-protocol]] (ADR-041, the door this observation leans on),
  [[2026-06-11-mockup-prune-razor-canon-pinned-or-inflight-or-parked]] (the mockup tier's
  parallel "canon-pinned → keep" clause this would mirror one tier up),
  [[2026-06-03-reconcile-needs-graduate-and-a-decisions-tier]] (where graduate+decisions.md came from).
