# ADR 011 — `shape:build` (forward-motion terminus) + the browser-verify capability slot

**Status**: accepted
**Date**: 2026-05-29
**Plugin**: `shape`
**Builds on**: [ADR-010](docs/adr/010-shape-blueprints-workflow.md) (the blueprints workflow). Extends the shape identity set there.

## Context

shape (after ADR-010) could converge decisions (`mockup`, `elicit`), project a plan (`align`), and keep the archive honest (`reconcile`) — but it stopped at "decided + recorded". The plan never got *executed*. The user wanted a skill that "keeps implementing until the In-progress column is done", with two strong requirements:

1. Each item must be **verified visually** — an `agent-browser` screenshot, compared against the item's mockup — not just "tests pass".
2. It must use **`/nav:plan`** to ground each item before implementing.

Three design questions had to resolve first: **where it lives** (new plugin vs an existing one), **how autonomous** it is, and **how it depends on `agent-browser`** without brittle coupling.

## Decision

Add **`shape:build`** — a meta-skill that drives the plan's In-progress column to done — and define a shared **browser-verify capability slot**.

### `build` lives in `shape` (not a new plugin, not nav)

shape's identity is **widened from "pre-build" to "forward motion: intent → running, verified code"**. nav stays the maintenance half. The two now split the lifecycle cleanly: **shape pushes work forward** (converge → plan → build); **nav keeps the result healthy** (audit → refactor → map).

Why not a new `build` plugin: a one-skill plugin is premature crystallization (the discipline this marketplace follows). Why not nav: build's *purpose* is delivering the user's intent (shape's domain); it merely *calls* nav's code-side protocols. Why it fits shape: it's the **terminus of the spine** — the disposable instances (mockups) converge the decision; build produces the durable real thing and verifies it against that mockup. The running system becomes a third render, after `plan.md` and `overview.html`.

### `build` is a meta-skill — the cross-plugin orchestrator

Per item in In-progress: **ground** (`/nav:plan`) → **summarize** (render an interactive diagram of the plan via the mockup protocol) → **implement** (`/nav:refactor` discipline + inject↔check, sequential subagent-per-item) → **verify** (browser screenshot vs mockup; or test-gate for non-visual) → **land** (move to Shipped, `/shape:align`) → loop → exit when empty. The summarize step is a checkpoint, and the verify target when the item has no mockup.

It orchestrates (reuse-via-transcript) and **never calls another skill directly** (skills-don't-call-skills). It is the most concentrated point of shape↔nav communication, and the direction stays one-way: **shape → nav** (nav must never reference shape).

### Autonomy = confidence-gated (the leash)

build runs autonomously but is governed by **"below 90% → ask"** (nav rule ⑦, now elevated to a shape core principle): a clear item flows; an item with unclear scope/boundary/intent **halts and asks**; a red test halts; a blocked item surfaces (never thrash). Not "review every item" (too slow), not "blast to the end" (dangerous).

### browser-verify = a named-default capability slot

build/mockup/align all need to see the running thing (N+1 → extract one shared slot, defined in `shape/CLAUDE.md`):

- **Don't hardcode the tool — name the capability** ("open the running feature → screenshot → compare to mockup"). `agent-browser` (vercel-labs/agent-browser) is the **named default**, so the agent knows what to reach for (just as `/nav:map` already names it). Detect via `which agent-browser`.
- **Fail helpfully, never silently skip.** If absent, a 3-way confidence-gate: (a) install — `npm install -g agent-browser` (or `brew`/`cargo install agent-browser`) then `agent-browser install`, or as a skill `npx skills add vercel-labs/agent-browser`; (b) proceed test-only this run; (c) skip this item. Report what was skipped (no silent caps).
- **Per-project override** in the project's own CLAUDE.md (Playwright, etc.); absent that, the default holds.

## Why these calls

- **The visual verify requirement is right** because a green test doesn't tell you the UI matches the intent — a screenshot vs the mockup does. build is also where the running-system *behavioral* check happens (the caveat `/nav:plan` already records: "a mockup settles the look, not the behaviour").
- **The summarize-after-plan step** (the user's request) is placed in build, not in `/nav:plan`: a literal "nav:plan auto-fires mockup" would make nav depend on shape and break skills-don't-call-skills. In build's loop, "after nav:plan → summarize via the mockup protocol" is the orchestrator sequencing its own steps — same outcome, clean layering.
- **The identity widening is deliberate, not creep** — recorded here and reflected on every shape surface (CLAUDE.md, site) in the same change-set, rather than letting "pre-build" silently rot.

## Consequences

- shape: 4 → 5 built skills; `plugin.json` + `marketplace.json` `0.1.0 → 0.2.0`; identity restated to forward-motion across CLAUDE.md + site.
- `docs/site/index.html` (gating) registers `build` in the shape anatomy + module map + the reframed blurbs.
- `nav` is untouched and stays shape-independent.
- `doctor` (orchestrator) remains deferred. Note: `build` is itself an orchestrator, which weakens the case for a separate shape:doctor — revisit whether doctor is still needed once build is exercised.

## Notes

- `build` is the highest-risk skill in the marketplace (it writes feature code in a loop). Its safety is the confidence-gate + per-step test-gate + inject↔check + sequential execution + honest reporting — these are first-class, not garnish.
- Open follow-up (deliberately not decided here): whether a standalone `/nav:plan` (run outside build) should *offer* a visual summary. It would introduce a nav→shape reference, so it's left out pending a decision.
