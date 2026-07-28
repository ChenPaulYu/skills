---
date: 2026-06-15
status: repeated
---

# reconcile's inbound-link discipline exists only in the `mockups/` tier — the `thoughts/` tier has no gate, so prunes either dangle pointers or re-derive the core-door wall live

> Two contexts (2026-06-15 TrackMate · 2026-07-25 tactus) show the two ways the missing gate
> fails: not knowing that a core-linked thought is prune-*blocked*, and not checking at all so
> the prune *dangles* pointers — including pointers that live in code, outside `blueprints/`.

## What happened (case 1, 2026-06-15)

TrackMate full-tree `/shape:reconcile` sweep (56 docs). Several 06-11/06-12 thoughts were
fully shipped + their durable why already in `decisions.md` — textbook prune candidates. But
the inbound-link check (run before every prune, as the skill says) surfaced a harder fact than
"resolve the links first":

- two structural-design thoughts ← linked from **position.md AND design.md**
- four more design thoughts ← linked from **design.md**
- `timeline-stuck-point` ← linked only from `plan.md`

The ones linked from `core/` **cannot be pruned by reconcile at all** — not "resolve the link
then prune", but *structurally blocked*: resolving a core inbound link means editing core, and
editing core is `/shape:position`'s door (ADR-041, single-writer + freeze-gated). reconcile has
no write permission to core. So those 6 thoughts → forced **KEEP** (they're the derivation
trails core points to via `[[...]]` magnifier links; design.md even says "完整推導鏈見 thoughts").
Only `timeline-stuck-point` (plan-only inbound) was cleanly prunable.

The same wall hit graduation: Paul wanted two of them graduated
into `decisions.md` (which means prune the thought). One had NO core link →
clean graduate+prune. The other was design.md-linked → graduate the why into decisions.md,
prune the thought, but the design.md link now dangles → had to **queue an amendment in
`docs/core/amendments.md`** for the next `/shape:position` to re-point it. reconcile executes the
graduate; the core re-point waits at the door.

## What happened (case 2, 2026-07-25 — the same gap, failing the other way)

A full-tree sweep on a Python DAW library (81 docs → 50: 33 thoughts pruned, 7 graduated
`decisions.md` sections, 10 all-shipped plans pruned, 4 mockup entries retired). The `mockups/`
tier's inbound check ran as the skill mandates — and the `thoughts/`/`plans/` prune ran with **no
inbound check at all**, because the skill only mandates one for mockups. Result: ~25 broken
pointers, caught only by an ad-hoc scan *after* the deletions were staged.

Two facts the 06-15 case didn't surface:

1. **The blast radius reaches code, and the mockup tier's scan wouldn't have caught it.** That
   scan is scoped `grep blueprints/ for citations into the folder`. But in a repo whose convention
   is file-top headers citing design docs, the citations that broke were in **`src/**.py` module
   docstrings, a user-facing CLI `--help` string, and `docs/core/` canon** — every one outside
   `blueprints/`. Running the mockup-tier check verbatim on the thoughts tier would still have
   shipped the damage. A code docstring pointing at a deleted doc is the same lie as a stale
   header, and this project's own rules forbid exactly that.
2. **It had already happened once in this repo, undetected for eight days.** An earlier sweep
   (`f82e45f`, "prune 77") left **15** dangling pointers — in code headers, in canon, and in the
   *pending* `amendments.md` queue whose entries still need resolvable evidence for a future
   `/shape:position` summon. Two independent operators, same skill, same omission. That moves this
   from operator error to a missing gate.

A third, smaller trap appeared during the repair: a path absent from *this* repo may be alive in
a **sibling workspace repo** — one citation into a sibling project was mechanically wrapped as
`git history:` (i.e. declared dead) when the doc was fine. Check siblings before declaring a path
dead.

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

Case 2 adds two parts the clause above doesn't cover — **where to scan** and **how to repair**:

> **Scan scope.** The inbound scan for a `thoughts/`/`plans/` prune covers the **whole repo, not
> just `blueprints/`** — code comments/docstrings, CLI help text, `docs/core/` canon, the
> `amendments.md` queue — plus a check of **sibling workspace repos** before declaring any cited
> path dead. Prune-then-scan is too late: the scan is a *precondition*, gated like the mockup
> tier's, and its hits are listed as evidence.
>
> **Repair form.** A surviving citation into a pruned doc is never just deleted: re-point it to
> the `decisions.md` section that absorbed the why, or leave a `git history: <old path>`
> provenance pointer so `git log --follow` still reaches it. Silently dropping the reference
> loses the trail; leaving it bare makes the file lie.

## Evidence so far

- **Case 1 (2026-06-15, TrackMate, 56 docs)**: 6 thoughts force-KEPT by core links; 1 (plan-only)
  cleanly pruned; 1 graduate (design.md-linked) needed an `amendments.md` queue for the design.md
  re-point; 1 graduate (no core link) was clean.
- **Case 2 (2026-07-25, a Python DAW library, 81 docs → 50)**: thoughts/plans pruned with no
  inbound gate → ~25 broken pointers, found by an ad-hoc post-hoc scan; the damage sat in code
  docstrings, a CLI `--help` string, and canon — all outside the `blueprints/` scope the mockup
  tier's scan would have used. Same repo's earlier sweep (`f82e45f`) had left 15 such pointers
  dangling for 8 days, including inside the pending `amendments.md` queue.
- Both cases fixed by hand afterwards; neither was prevented. Two independent contexts → `repeated`.
  **Trip-wire to promote**: this is now prescriptive enough to land as an ADR + a `thoughts/` row
  in reconcile's currency-sweep table; a third case is not needed, only the write-up.
- Related: [[2026-06-11-core-write-protocol]] (ADR-041, the door this observation leans on),
  [[2026-06-11-mockup-prune-razor-canon-pinned-or-inflight-or-parked]] (the mockup tier's
  parallel "canon-pinned → keep" clause this would mirror one tier up),
  [[2026-06-03-reconcile-needs-graduate-and-a-decisions-tier]] (where graduate+decisions.md came from).
