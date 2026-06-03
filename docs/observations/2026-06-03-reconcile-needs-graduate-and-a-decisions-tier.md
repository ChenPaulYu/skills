---
date: 2026-06-03
status: maturing
---

# reconcile can't retire a shipped doc that still holds rationale → thoughts/ grows monotonically; it needs a `graduate` action + a durable `decisions/` tier

## What happened (concrete)

Doing doc hygiene on Crate (`rytho-ai/crate`), Paul asked twice "can I delete this thought doc?" about `2026-05-29-baseline-cards-cite-derive.md` and `2026-05-29-media-card-ontology.md`. Both are **shipped** (the feature exists in code) yet **un-prunable**: they hold decision rationale — the citation grammar, the referential-integrity invariant, and especially the *rejected alternatives* ("we tried one-primitive media/track, reversed it because video media ⊋ track"). reconcile's existing actions can't retire them:

- **prune** would lose the rationale,
- **consolidate** has no in-flight thought to merge *into* (the residue is decision-history, not active design),
- so reconcile's only legal move is **amend (sync status) + keep**.

→ Every shipped feature leaves a doc that can't leave. `thoughts/` grows monotonically. Crate is at 10 docs, ~half "shipped-but-kept" — mild now, but the trajectory is the bug.

## The diagnosis (the signal)

reconcile isn't failing — it's **missing an exit ramp**. Its content-movement is only `thought → trash` (prune) or `thought → thought` (consolidate). A shipped doc's durable residue has **no durable destination**, because the blueprints tree (ADR-010: `thoughts/` · `mockups/` · `plan.md` · `overview.html`) has **no decisions tier**. The marketplace has `docs/adr/` for *itself*; projects using shape have no equivalent.

Root reframe that unlocked it: **a thought is a mix of three things with three different lifecycles**, and bloat is the failure to route them:

| component | lifecycle | home | already owned by |
|---|---|---|---|
| status (open/next/shipped) | ephemeral | `plan.md` + `overview.html` | align |
| how-it-works | living, code-derived | `codebase-map` | nav:sync |
| **why this shape / what was rejected** | **immutable decision residue** | **`decisions/` (missing)** | **— (the gap)** |

Key correction to the naive instinct ("promote thought → *feature* doc"): the destination is **decision records, not feature docs**. "How it works" already lives in nav's `codebase-map`; a parallel feature-doc tier would fight the map and drift. shape only needs to add the **why** home. (Naive "thought → feature doc" also silently sheds the rejected-alternatives — the one thing that made the doc un-prunable.)

## What it should become (the resolution — implementing this session)

1. **Blueprints convention gains a 4th dir: `decisions/`** — the project-level analog of `docs/adr/`. Durable, addressable-per-decision, holds the why + rejected alternatives.
2. **reconcile gains a `graduate` action** — when evidence shows *shipped + holds durable residue + no active design left*: distill the residue into a `decisions/` record → prune the emptied thought. This is reconcile's missing exit ramp ("retire **with** a forwarding address" vs retire to trash). Folds into reconcile, **not a new skill** (ADR-003 resist-proliferation, ADR-013 fold-into-existing-verb precedent). Respects ADR-014's amend boundary: graduating *relocates* an existing decision's record, it doesn't author a new one.

**Naming trap:** do **not** call it `promote` — "promotion" is already taken by ADR-018 (observation → skill/ADR crystallization). Use **`graduate`**.

## The two refinements that came out of friction

**(a) Paul wanted `decisions/` to stay *clean*.** My first cut (keep superseded records, just flip a `Status` flag — like the marketplace's own ADRs) builds a graveyard → not clean. The clean resolution, which is *also a smaller change to reconcile*: when a later decision reverses an old one, **fold the tombstone forward** into the successor (`supersedes X because Z`) — or, if X is abandoned with no successor, write a standalone live `Rejected: X because Z` decision — then **prune the old file**. Every `decisions/` entry is then *currently operative*; the re-litigation guard lives in a *live* decision, not a corpse; **git is the deep archive** for the full original argument. This reuses reconcile's existing **consolidate** (merge → verify → remove) — no new "mark-superseded" mode needed. It's the same philosophy as Crate's own ontology (*citation not corpus*, *clip = live reference not copy*): distilled essence forwards, dead corpus dropped, git holds history. Deliberately **diverges** from the marketplace's own `docs/adr/` (keep-with-status) — meta low-volume history vs operational clean set.

**(b) "Do contradicting decisions need checking too?"** Yes — `decisions/` is not check-exempt, the check is a *different predicate*. Two-tier currency in reconcile:
- `thoughts/` → "implemented yet?" → graduate / prune / amend
- `decisions/` → "**still operative, or superseded?**" → consolidate-forward + prune
Detection is push-primary + pull-safety-net: a reversing decision is authored in **elicit** and declares `Supersedes: X` at birth (the author knows what they're overturning); **reconcile's sweep** catches what elicit missed — including the genuinely new predicate **"do any two live decisions contradict each other?"** (separately-converged decisions can quietly conflict; per-doc currency won't catch it). That cross-decision-coherence check is a *dimension inside reconcile's read-only phase*, still not a new skill.

## What it is NOT (a rejected sub-idea, kept per "negative results count")

**Not a dedicated "confirm-consensus" skill.** Consensus is a **property**, not a verb — converge verbs (elicit/mockup) *produce* it, reconcile *maintains* it. It lives at three time-points all already owned: birth → elicit (converging *with the user* IS consensus, the shape spine); graduation → the graduate write-gate + ADR-018's evidence test ("settled enough to go durable?"); over-time → reconcile's decisions/ sweep. A consensus skill = structure-theatre (nav rule ④) that double-counts. **The line:** if shape ever serves a *multi-person* team needing formal sign-off/ratification, a `ratify` verb could earn its place — for solo it's YAGNI.

## Evidence / why promotable now (ADR-018 dense-session gate)

- **Grounded** — anchored in Crate's real `thoughts/` (10 docs, the two specific un-prunable ones, nav's existing `codebase-map`, ADRs 003/010/013/014/018).
- **Friction-tested** — survived four reframes in one session: naive promote → routed-by-lifecycle; feature-doc → decisions-not-features; keep-with-status graveyard → clean fold-forward+prune; consensus-skill → property-not-verb.
- **Principle-level** — *every* shape project hits monotonic `thoughts/` growth; the routing-by-lifecycle + retire-with-forwarding-address generalizes.

## Promotion targets (doing this session)

- **convention**: add `decisions/` to `plugins/shape/skills/align/references/blueprints-spec.md` (the blueprints tree, ADR-010).
- **skill**: add the `graduate` action + two-tier currency + supersession to `plugins/shape/skills/reconcile/`.
- **ADR**: ADR-026 records the decision (decisions/ tier · graduate-folds-into-reconcile · clean fold-forward over keep-with-status · no consensus skill).
