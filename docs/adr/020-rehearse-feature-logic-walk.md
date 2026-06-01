# ADR 020 — `shape:rehearse` — walk a feature's usage, render where the logic breaks

**Status**: accepted
**Date**: 2026-06-01
**Relates to**: [ADR-013](docs/adr/013-diagnosis-folds-into-elicit.md) (same-engine → don't fork razor), [ADR-018](docs/adr/018-promotion-gate-is-evidence-not-session-count.md) (promotion gate = evidence sufficiency)

## Context

Recurring pain: you conceive a feature without thinking through every way it gets used, build a rough version, then on contact with reality it's full of cases that don't add up — and you can't tell whether the **direction is wrong** (kill / redesign) or it's just **unfinished** (a path left undefined). There was no skill for *systematically walking a feature's usage to surface those holes*. The existing skills each cover an adjacent slice but not this:

- `/shape:elicit` drills **one** thing verbally to a principle — it doesn't enumerate many usage paths, and its residue is one line, not a coverage pass.
- `/shape:mockup` renders to decide **look / structure** — it doesn't walk *usage logic* for holes.
- `/nav:audit` sweeps **code shape** (Ousterhout) — a different object than *feature logic*.

## Decision

Add `shape:rehearse` — a converge-group skill that **walks a feature's usage top-down (`user intent → usage scenario → check against what's really built`) and renders the holes as an interactive mockup.** Its two load-bearing design choices:

1. **Human-purpose unit, not machine-exhaustive.** It enumerates intents → scenarios, explicitly **rejecting** the `state × action` grid (a QA matrix with no natural floor). The intent→scenario walk has a floor — it stops when each real intent's paths are walked — which is what keeps rehearse light instead of a combinatorial sweep.
2. **The hole's layer IS the diagnosis.** A missing *intent* = **direction** signal (scope/premise gap → redesign); a dead-end *scenario* = **incomplete** (a path left undefined → finish). rehearse pre-sorts every hole by layer; the ambiguous ones hand to `/shape:elicit`'s diagnostic mode to judge + route.

**Output is always a mockup, via `/shape:mockup`'s render path** — rehearse owns the *walk*, reuses mockup's *render* (single self-contained interactive HTML in `mockups/`, activate-and-URL, browser-verify slot). It is mockup's **logic twin**: mockup converges look/structure, rehearse converges logic-coverage; both converge-by-render (the shape spine).

## Why a new skill and not a mode (the razor)

The same razor that folded diagnosis into elicit (ADR-013: *same engine → don't fork, N+1*) was applied here and **passed in favor of a new skill**, because rehearse's engine is genuinely distinct:

- vs **mockup** — shares only the *render* step; the *front* (enumerate intents → unfold scenarios → check built reality) is a different engine, and the residue's question differs (look/structure vs logic-coverage). It reuses mockup's renderer rather than re-implementing it, so it's a sibling, not a duplicate.
- vs **elicit** — drill-one-to-a-principle (residue: one line) vs enumerate-many-and-render (residue: a mockup). A coverage walk is not a grill. They hand off: rehearse's layer-tag is elicit-diagnostic's first input.

A "logic-coverage mode of mockup" was considered and rejected: the walk is a substantial enough independent front to earn its own door, and burying it as a mockup mode would hide it behind the wrong trigger.

## Triggering — don't steal fire from siblings

- rehearse fires on **"walk through / rehearse / pressure-test a feature / does this usage make sense / find the logic holes / direction-wrong or unfinished"** — a *usage-coverage* request.
- mockup keeps **"mock / show / draw / which of these"** — a *look/structure render* request.
- elicit keeps **"help me think through / what should X be / why is X wrong"** — a *verbal drill*. (rehearse hands the ambiguous-hole judgement *to* elicit; it doesn't absorb it.)

## Consequences

- **shape gains a 6th skill** (converge group: mockup · elicit · **rehearse**); shape `0.2.0 → 0.3.0`.
- **The full arc is now covered**: rehearse finds the holes → elicit judges direction-vs-incomplete → mockup/elicit redesign (direction) or nav:plan + build finish (incomplete). Each skill stays narrow; rehearse routes rather than fixes (read-only on the design — it surfaces + renders, never redesigns or implements in place).
- **Promotion gate (ADR-018)**: crystallized from a single dense session, justified by the three substitutes for recurrence — grounded (walked against a real feature's intents/scenarios), friction-tested (unit chosen as intent+scenario over state×action; output constrained to a mockup; new-skill chosen over mockup-mode — each refuted before landing), principle-level (the layer-is-the-diagnosis + human-purpose-floor principles). The originating observations ([[2026-06-01-verify-the-belief-before-acting-on-it]] — the built-reality check; [[2026-05-29-thought-mode-how-paul-converges]] — the co-excavator mode) remain as the evidence base.
- **Cost**: new SKILL.md + this ADR + shape CLAUDE.md, manifests (plugin.json + marketplace.json), README, and the gating site map (`docs/site/index.html`) all updated in the same change.
