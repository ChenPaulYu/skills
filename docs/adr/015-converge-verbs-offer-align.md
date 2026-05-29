# ADR 015 — `elicit` / `mockup` offer `/shape:align` after landing a thought (auto-offer, not auto-call)

**Status**: accepted
**Date**: 2026-05-29
**Plugin**: `shape`
**Extends**: [ADR-007](docs/adr/007-offer-next-action-pattern.md) (offer-next-action via `AskUserQuestion`) from `nav`'s meta-skills to `shape`'s converge verbs.
**Relates to**: the "skills don't invoke each other" + "align decides *with* the user" invariants (shape `CLAUDE.md`).

## Context

A converged decision lands as a `thoughts/` doc (from `elicit`, or a recorded pick from `mockup`). That doc is `align`'s input — the natural next step is to triage it into `plan.md` (now/next/later). Today the user has to remember to run `/shape:align` themselves. The question: should producing a thought **auto-trigger** `align` — and should `/nav:plan` do the same?

Two walls make a literal auto-trigger wrong:
1. **Skills don't invoke each other** (marketplace + shape invariant) — even `build`, the meta-skill, orchestrates via reuse-via-transcript, never a direct call.
2. **`align` decides *with* the user** — auto-running it would author priorities silently, the exact thing align's own discipline forbids.

But the *offer* is already a first-class family pattern (ADR-007): finish → `AskUserQuestion` with the next action + a save-only opt-out, never auto-execute. That's what actually happened in the session that produced this ADR — elicit landed a thought, *offered* align, the user said yes.

## Decision

**1. `elicit` and `mockup` end by *offering* `/shape:align`** (an `AskUserQuestion`, with a "just leave the thought, I'll align later" opt-out), to triage the freshly-landed thought into `plan.md`. **Offer, never auto-call** — consistent with skills-don't-invoke-each-other.

**2. Guarded + one-shot** (the weight-adaptive form): offer only when a `blueprints/` board exists (or scaffolding one is wanted), and don't re-offer across a rapid series of converges — no nagging (ADR-007 §5).

**3. The recommended option runs `align` *in-session*, not in a clean sub-agent** — unlike ADR-007's sub-agent default. `align` is collaborative and needs *this* conversation's just-converged decision + context; a clean-context sub-agent would lose it.

**4. `/nav:plan` does NOT offer `align`.** Direction is wrong: `align` is `nav:plan`'s *upstream* (align triages → nav:plan grounds one item into code). The align that belongs *after* planning is "mark it Shipped once built" — and that already lives in `/shape:build`'s tail. Adding it to nav:plan would mis-place build's responsibility and add a soft nav→shape coupling for no gain.

## Why this fits ADR-007 (not a contradiction of its §6)

ADR-007 §6 withholds the offer from *atomic* skills (`audit`, `headers`, `map`): they end in N findings or a standalone artifact, with **no single natural next-action**. `elicit` / `mockup` are different: each lands **exactly one thought** whose canonical downstream is **exactly one skill** (`align`). A single artifact + a single obvious next step = precisely the shape ADR-007's offer was built for. So this extends the pattern by its own logic rather than breaching the atomic-skill exclusion.

## Consequences

- `plugins/shape/skills/elicit/SKILL.md`: protocol gains Step 6 (offer align, guarded/one-shot, in-session); Output notes the offer.
- `plugins/shape/skills/mockup/SKILL.md`: new "After the pick — offer to align it in" section; Output notes the offer.
- `docs/site/index.html` (gating): elicit + mockup descriptions note the guarded align offer. ADR count 14 → 15.
- No version bump (behavioral addition to existing converge verbs; no new skill).

## Notes

- The through-line with ADR-012/013/014: the family keeps its *hard* couplings one-way and minimal, expressing cross-skill flow as **guarded offers / hand-offs** (nav:plan→mockup, reconcile→elicit, now elicit/mockup→align) rather than direct calls. Offers compose; calls couple.
