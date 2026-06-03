---
date: 2026-06-03
status: maturing
---

# A freshly-crystallized skill is under-specified; dogfooding it on a real project is where the design actually converges — not the design conversation

## What happened (concrete)

Same session as [`2026-06-03-reconcile-needs-graduate-and-a-decisions-tier.md`](2026-06-03-reconcile-needs-graduate-and-a-decisions-tier.md). We designed `reconcile:graduate` + a decisions tier, friction-tested it through four reframes, and crystallized it into **ADR-026 + edits to 5 skill files** — it cleared ADR-018's dense-session gate (grounded · friction-tested · principle-level). By the marketplace's own rules it was "done".

Then we **dogfooded the whole flow on a real project** (Crate: ran the graduate on its `thoughts/`, rendered the human view, used it). The dogfood produced **~6 concrete reversals the design phase missed** — each one needed a *real instance* to surface, none were reachable by more reasoning:

| design said (ADR-026 v1) | dogfood reversed it to | what surfaced it |
|---|---|---|
| `decisions/` **folder**, file-per-decision | **one `decisions.md`**, feature-sections | only obvious once 5 real sections needed organizing — a folder fragments what wants to merge |
| distil "the why + rejected alternatives" | the **call · how it shows up · what was rejected** 3-part format | the first distillation was a compressed rule-dump; reading it *as a human* revealed it was cryptic, not lean |
| (didn't specify altitude) | **high-level + manifestation**, not sub-rules | the right altitude only emerged from the user reacting to a real rendered card |
| 2-col grid for the cards | **single column** | the grid-row-height coupling bug (expand one → its row-mate's box stretches) only appears with >1 card expanded |
| (didn't specify) | **Shipped = recent ~5 + "+N" pill** | the board's clutter only showed with the real 28-item history |
| graduate only when "no live content" | guard = "is the **call** settled?" (a *deferred* branch is fine) | only got precise when 5 real docs had to be triaged — most held a settled call + a parked branch |

## The signal

**Crystallizing a skill from design reasoning — even a grounded, friction-tested, principle-level session — produces a v1 that's several refinements short of right. The convergence happens in the *first real dogfood*, not in the design conversation.** Every refinement above needed a concrete instance (a real doc to graduate, a real card to *read*, a real grid to *expand*, a real 28-item history to clutter the board). None were reachable by thinking harder.

This is the shape spine — *converge by a real, disposable instance, never a description* — **applied to the skill itself**. A skill is an artifact; its "real instance" is **a real project run**, not a design discussion. So a skill converges the same way a feature does: by being used on something real and disposable, then refined from what the use exposed.

## What it could become (the discipline)

**Treat the first dogfood as part of the design loop, not as validation after it.** When you crystallize a new skill / convention:
1. Crystallize the v1 (ADR + skill edits) — fine.
2. **Immediately dogfood it on a real project**, end to end, rendering + using the output — *before* calling it done.
3. Fold what the dogfood exposes back into the v1 (here: amended ADR-026 + re-edited 5 files).

It's a sharpening of **ADR-018**: the dense-session gate (grounded/friction/principle) is enough to *crystallize* a skill, but for a skill/convention it should carry a **"dogfooded on a real project" follow-up** before "accepted" really means settled — because a skill's grounding artifact is a *run*, and design reasoning systematically under-specifies the run.

## Evidence so far

- This session, one strong instance: ADR-026 v1 (design-reasoned, ADR-018-gated) → dogfood on Crate → 6 reversals → ADR-026 refined + 5 files re-edited + this note.
- Prior rhyme: the shape blueprints workflow (ADR-010) itself was crystallized *from* a real pre-build reorg on a sibling project, not from pure design — same pattern, named here as a discipline.
- Watch for: the next new skill/convention. If its first real dogfood produces ≥1 reversal the design missed, that's the second sighting → promote this to a CLAUDE.md guideline ("crystallize → dogfood on a real project → refine, before "done"").
