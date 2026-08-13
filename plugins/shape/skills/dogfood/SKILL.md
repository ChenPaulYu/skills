---
name: dogfood
description: "Dogfood a built feature that feels unsmooth: use it like a real user (browser or curl/CLI) against a list of intents, capturing evidence as you go. Fires on \"I finished X but it feels off\" / \"dogfood 一下\" / \"用起來怪怪的\", or \"what usage are we missing\". Reports friction (clunky but working → UX idea) and coverage gaps (missing intents → design hole), routed to /shape:elicit/mockup or /nav:plan (+ /nav:do/refactor)."
---

# Dogfood — use the built feature for real, surface where it's unsmooth

Take a feature you've built (or roughed out) that **feels off to use but you can't say why**, and **dogfood it** — use your own feature the way a user would, *before* your users do. dogfood drives the built thing firsthand — clicks through it in a browser, hits the endpoint with `curl` — **captures what it sees** (a screen recording, screenshots, the real responses), feels where it snags, and reports the friction back as concrete improvement ideas with the evidence attached. The places you have no smooth path *also* expose the design-logic the feature never covered — so a usability pass doubles as a coverage check.

## Stance

> **Core: use the built feature against a list of user intents — drive the REAL interface (agent-browser / `curl` / CLI), never the design doc — and capture the run. Report two kinds of finding: _friction_ (it works but is clunky → a UX idea) and _coverage gap_ (an intent with no path → a logic hole). The evidence is the captured session — a screen recording, screenshots, the actual responses — never a synthesized mockup, and never an unbacked claim.**

- **Experience-first; logic-coverage is the byproduct.** The design-logic holes aren't found by a separate top-down sweep — they fall out of the session: you try to do something real and there's no coherent path.
- **Intent-driven, not aimless clicking.** Drive from a short list of *what users are trying to do* — this is what lets hands-on use catch an *absence* (a whole intent with no surface). Enumerate human purposes, not every `state × action` cell.
- **Every finding is shown, not asserted.** A friction claim carries its screenshot or clip; a backend finding quotes the real response. "Trust me, it's clunky" floats.
- **Caveat — discount the harness's own artifacts.** The capture rig is not the user's conditions: a headless browser's default viewport is often unusually short/narrow, synthetic fixtures are sparser than real data, a scripted pointer lacks momentum. So a finding can be an artifact of the harness, not the feature. Before routing a finding to a fix, **re-confirm it at realistic conditions** (resize to a normal viewport, use representative data); tag the ones you couldn't reproduce as *suspected-harness-artifact* rather than shipping a fix for a non-problem.
- **Caveat — a live-LLM-cost signal.** If the feature under dogfood itself calls a live paid LLM (especially a fan-out/multi-agent path), driving every intent at full cost multiplies fast. Flag it once up front — name the call path and its rough cost knobs (model, turn/fan-out count) — then drive most of the intent list at the feature's own cheapest sufficient setting, reserving one full-cost pass for the final "does it feel right" check.
- **Render is demoted to an optional hand-off, not the output.** The default deliverable is the evidence-rich friction report; only when a friction idea is big enough to be a *redesign* does it get handed to `/shape:mockup`.
- **Surface and route; never fix in place.** dogfood does not redesign or implement — offer the next step per finding kind, guarded + one-shot, always with a "just leave the report, I'll route later" opt-out.
- **Lands in a project-local, git-ignored `dogfood/<date>-<feature>/`** — add `dogfood/` to `.gitignore` on first run if missing (mirrors mockup's `mockups/` convention).

Full session steps, the report shape, the three boundaries (vs `/verify`, `/shape:mockup`, `/shape:elicit`), storage format, a worked example, and the anti-pattern table: `references/dogfood-protocol.md`.

## The session — use it for real, capture as you go (dogfood's own front)

This is what dogfood adds. It does **not** synthesize a mockup to walk; it uses the **real build** and records it.

0. **Get one `AskUserQuestion` confirmation before driving anything (ADR-114).** dogfood is computer-use automation by construction, so it sits squarely in the ask-first class. Once the intent list exists, present the run's shape as a real structured choice — roughly how many interactions, whether any intent touches a live-LLM path, and a scoped-down option (drive the top N intents, not all) alongside the full run. Scoping down is a normal answer, not a refusal. **Declined outright → the intent list itself is the deliverable**, and say plainly that nothing was driven, so an unrun session is never mistaken for a clean one.

1. **List the user intents (the test script).** What is someone *trying to achieve*? — "keep a private copy", "find it again later", "undo without losing context". Include the intents the feature implies but you never designed for; this list is the floor that keeps the session bounded.
2. **Drive the real interface to attempt each intent, capturing the evidence.** Frontend → Driving the frontend uses shape's shared **browser-verify slot** (named default `agent-browser`; detect + fail-helpfully + per-project override): actually click the flow; **screenshot at each friction point and dead-end** — the moments that become findings — not every routine step, and **record video only when the user explicitly asks for it** (verify economy, ADR-058: a capture is evidence, not a progress note; captures go to disk and are referenced by path, never pasted into the chat). Backend / CLI → `curl` the endpoint or run the command and **save the actual request/response**. **Don't reason from the doc or from memory** — a belief about how your own feature behaves is often false; confirm it by doing it.
3. **Mark friction + gaps against the captures.** Friction = the path *exists* but is clunky (too many steps, unclear feedback, awkward order, a missing affordance) — tie each to its screenshot / clip timestamp. Gap = an intent with *no coherent path* (dead-ends, contradicts, nothing to start with).
4. **Classify each gap by layer** — missing intent (direction) vs dead-end scenario (incomplete) — so the report shows them distinctly and the hand-off is pre-sorted.

> **Caveat — discount the harness's own artifacts.** The capture rig is not the user's conditions: a headless browser's default viewport is often unusually short/narrow, synthetic fixtures are sparser than real data, a scripted pointer lacks momentum. So a finding can be an **artifact of the harness, not the feature** (field case: "the primary action is below the fold" was true only at the rig's 569px height; at a normal 900px it was fully visible — only the *other* two findings were real). Before routing a finding to a fix, **re-confirm it at realistic conditions** (resize to a normal viewport, use representative data); tag the ones you couldn't reproduce as *suspected-harness-artifact* rather than shipping a fix for a non-problem.

> **Caveat — a live-LLM-cost signal.** If the feature under dogfood itself calls a live paid LLM (especially a fan-out/multi-agent path), driving every intent at full cost multiplies fast. Flag it once up front — name the call path and its rough cost knobs (model, turn/fan-out count) — then drive most of the intent list at the feature's own cheapest sufficient setting (a mock, or its lowest effort/turn knob), reserving one full-cost pass for the final "does it feel right" check.

## After the session — offer to route the findings (don't fix in place, don't auto-run)

dogfood surfaces and reports; it does **not** redesign or implement. Once the report is up, *offer* — never auto-call — the next step **per each finding's kind**, via `AskUserQuestion` (offer-next-action, ADR-007/015):

- **A friction idea the user wants to pursue** → a *tweak* → `/nav:plan` (ground it) + `/nav:do`/`/nav:refactor`; a *redesign* → `/shape:mockup` (render the new shape) or `/shape:elicit` (if the premise is in question).
- **A direction-level gap (missing intent)** → `/shape:elicit` (is the premise wrong? — a *new decision*, out of scope) and/or `/shape:mockup`.
- **An incomplete gap (dead-end path)** → `/nav:plan` to ground the missing path, then `/nav:do`/`/nav:refactor`.

**Guarded + one-shot:** compose the options from what was actually found, always include a **"just leave the report, I'll route later"** opt-out, and don't re-offer after the pick. Offers, not calls — skills don't invoke each other.

## Companion skills

- **`/verify` · `/run`** — dogfood borrows their drive-the-real-app method, but asks a design-quality question, not a correctness one.
- **`/shape:mockup`** — renders a *synthetic* candidate to decide look/structure before building; dogfood uses the *built* result. They pair across time.
- **`/shape:elicit`** — judges an ambiguous coverage gap (direction-wrong vs incomplete) in diagnostic mode.
- **`/nav:plan`** — grounds an incomplete gap or a friction tweak into a code-level plan to finish.
- **`/nav:do` · `/nav:refactor`** — implement the planned paths.
- **`/shape:align`** — triages a trackable dogfood finding into `plan.md`.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.
