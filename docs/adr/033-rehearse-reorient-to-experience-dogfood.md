# ADR 033 — reorient + rename `shape:rehearse` → `shape:dogfood` (logic-walk → experience-first dogfood)

**Status**: accepted
**Date**: 2026-06-10
**Supersedes**: [ADR-020](docs/adr/020-rehearse-feature-logic-walk.md) (the top-down logic-walk framing + always-render-a-mockup output)
**Relates to**: [ADR-007](docs/adr/007-offer-next-action-pattern.md) (offer-next-action), [ADR-011](docs/adr/011-shape-build-and-browser-verify-slot.md) (browser-verify slot)

## Context

rehearse as shipped (ADR-020) was almost never reached for. Diagnosis: its **summon didn't match the natural moment.** ADR-020 fired on *"walk / pressure-test a feature's logic"* — a structured, top-down coverage request. But the moment a user actually has is: **"I finished X, it feels unsmooth to use, I can't say why — go try it and give me ideas."** That is a *UX-friction* request, pre-verbal, experiential. Structural reasons rehearse stayed unused:

- **Trigger mismatch.** When a feature feels off, the natural reach is `/shape:elicit` (verbal) or just describing the bug — almost no one frames it as "walk the usage logic."
- **Heavy output for the moment.** ADR-020 *always* rendered a mockup; the felt-unsmooth moment wants lightweight ideas, not a synthesized artifact — so the ceremony exceeded the need and elicit absorbed the demand.
- **The lens was wrong.** "Does the design have a coherent *answer* for every path" (binary logic-coverage) isn't what the user feels — they feel *graded friction* ("it works, but it's clunky"). A passing logic-walk can still feel awful to use.

The real recurring need is a **usability critique driven by actually using the built thing** — experience-first, with logic-coverage as a welcome byproduct.

## Decision

**Reorient the skill, and rename `rehearse` → `dogfood` to match — keep the slot.** The engine inverts:

> **Dogfood the built feature against a list of user intents — drive the REAL interface (`agent-browser` / `curl` / CLI), never the design doc — and report two kinds of finding: _friction_ (it works but is clunky → a UX idea) and _coverage gap_ (an intent with no path → a logic hole). Evidence is the real session (screenshots / responses), not a synthesized mockup.**

Three things define it now:

1. **Experience-first; logic-coverage is the byproduct.** Using the feature and feeling the friction is the engine; design-logic holes *fall out of the session* ("I tried to do G and there was no path") rather than being found by a separate top-down sweep. UX is the primary lens; coverage is what the lens also catches.
2. **Intent-driven dogfooding, not aimless clicking.** The intent list **survives from ADR-020, but demoted from output-skeleton to _test script_** — it's what lets hands-on use catch an *absence* (a missing surface won't snag you unless you arrive trying to do something). Still human-purpose, not `state × action` (kept ADR-020's floor).
3. **Output is a friction report, not a mandatory mockup.** Each finding = *where it snagged · what it felt like · an improvement idea*, backed by session evidence. Render is **demoted to an optional hand-off** — only when a finding is a *redesign* worth `/shape:mockup`.

**What survives ADR-020:** the human-purpose floor (intents, not the QA grid) and **layer-is-the-diagnosis** (missing intent = direction → redesign; dead-end scenario = incomplete → finish) — now used to route the coverage gaps the dogfood session surfaces.

**Method borrowed flips:** from `/shape:mockup`'s *render* path to `/verify`·`/run`'s *drive-the-real-app* capability. This adds a boundary: **vs `/verify`** — both drive the real app, but verify asks *"is it correct"* and dogfood asks *"is it smooth, and what's missing"* (design quality, not correctness).

## Why reorient, not a new skill (the razor)

The same razor as ADR-013/020 (*same engine → don't fork; N+1*) — but applied the other way. rehearse was underused **precisely because it was aimed at logic-walk**; standing up a new "dogfood-UX" skill beside it would leave the dead verb in place and split one niche across two doors. The niche is the same — *post-build, "this feels off," find what's wrong* — only the aim was off. So we re-aim the existing slot rather than add a seventh skill.

## Consequences

- **`shape` stays 6 skills** (no count change; a reorientation + rename, not an addition).
- **Why rename, not just reorient.** Part of the underuse was a *name/trigger mismatch*: "rehearse" connotes a *pre-release* run-through and carries no UX/experience scent, so the user who feels "this built thing is clunky — go try it" never reached for it. `dogfood` names the new engine exactly (use your own product as a user would), is a verb (fits the family), and generalizes across front/back (you can *dogfood* an API; "playtest an API" is odd). Renaming while the reorientation already touches every rehearse site is cheap; deferring it would mean a second cascade.
- **Identity shifts**: "logic彩排 (render holes as a mockup)" → "**體驗彩排 (`dogfood` the real feature)**". The output is now an **evidence-rich report** — a session recording, screenshots at each friction point, the real responses — not a synthesized mockup. mockup is no longer its render twin: they pair *across time* (mockup the flow pre-build → build → dogfood the built result), and dogfood hands a redesign-level finding *back* to mockup.
- **Updated in the same change**: this ADR + ADR-020 marked superseded; `rehearse/` → `dogfood/` (`git mv`) + `SKILL.md` rewritten (`name:` + body); `plugins/shape/CLAUDE.md` family-map + history; `plugins/nav/CLAUDE.md` offer-pattern roster; cross-refs in `elicit/SKILL.md` + `mockup/SKILL.md`; manifests (`plugin.json` skills array + description, `marketplace.json`) + `README.md`; `.agents/` codex mirror regenerated (stale `shape-rehearse` auto-dropped). `docs/site/index.html` (human-facing render) refreshed as a separate render pass, not hand-amended inline.
- **The arc is unchanged downstream**: dogfood still surfaces + routes (never redesigns/implements in place) — friction tweak → `/nav:plan` + `/shape:build`; direction gap → `/shape:elicit`/`/shape:mockup`; incomplete gap → `/nav:plan` + `/shape:build`; ambiguous gap → `/shape:elicit`'s diagnostic fork (dogfood's layer-tag is its first input — that hand-off survives).
