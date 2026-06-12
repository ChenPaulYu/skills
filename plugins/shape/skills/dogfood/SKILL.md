---
name: dogfood
description: "Dogfood a built (or roughed-out) feature that feels unsmooth — use it for real the way a user would (drive the frontend in agent-browser, hit the backend with curl / CLI) against a list of user intents, capturing what you see. The deliverable is a report rich with evidence — a screen recording of the run, screenshots at each friction point, the actual responses — surfacing two kinds of finding: friction (it works but is clunky — too many steps, unclear, awkward order → a UX improvement idea) and coverage gap (an intent with no path — a design-logic hole that surfaces *because* you tried to do it). Experience-first; logic-coverage is a byproduct. Fires when the user says \"I finished X but it feels unsmooth / off\", \"this doesn't feel right to use\", \"try it and give me ideas\", \"what's awkward here\", \"show me where it's clunky\", \"dogfood this feature\", \"did we think this through\", \"what usage are we missing\". Borrows /verify·/run's drive-the-real-app method but asks a different question — not \"is it correct\" (that's /verify) but \"is it smooth, and what's missing\". A coverage gap's layer routes it: missing intent → /shape:elicit or /shape:mockup (direction); dead-end path → /nav:plan + /shape:build (incomplete). Also invokable as /shape:dogfood. Language- and framework-agnostic."
---

# Dogfood — use the built feature for real, surface where it's unsmooth

Take a feature you've built (or roughed out) that **feels off to use but you can't say why**, and **dogfood it** — use your own feature the way a user would, *before* your users do. dogfood drives the built thing firsthand — clicks through it in a browser, hits the endpoint with `curl` — **captures what it sees** (a screen recording, screenshots, the real responses), feels where it snags, and reports the friction back as concrete improvement ideas with the evidence attached. The places you have no smooth path *also* expose the design-logic the feature never covered — so a usability pass doubles as a coverage check.

## Why this skill exists

When something you built "feels unsmooth," the friction is real but **pre-verbal** — you can't name it, so you can't fix it. Reasoning about it from the design doc floats (the same reason `/shape:mockup` exists: a description decides nothing — and a *memory* of how your own feature behaves is often wrong). The cheapest way to make the friction nameable is to **use the real thing and record what happens.** dogfood does exactly that: it drives the feature against what users are actually trying to do, captures the run, and turns "this feels off" into "watch this clip — these three spots snag, here's an idea for each, and one of them isn't friction, it's a path you never built."

## Core — everything else derives

> **Core: use the built feature against a list of user intents — drive the REAL interface (agent-browser / `curl` / CLI), never the design doc — and capture the run. Report two kinds of finding: _friction_ (it works but is clunky → a UX idea) and _coverage gap_ (an intent with no path → a logic hole). The evidence is the captured session — a screen recording, screenshots, the actual responses — never a synthesized mockup, and never an unbacked claim.**

Three things derive directly and carry the skill:

- **Experience-first; logic-coverage is the byproduct.** The engine is *using* the feature and feeling the friction. The design-logic holes aren't found by a separate top-down sweep — they **fall out of the session**: you try to do something real and there's no coherent path. UX is the primary lens; coverage is what the lens *also* catches.
- **Intent-driven, not aimless clicking.** You drive from a short list of *what users are trying to do* — this is what lets hands-on use catch an **absence** (a whole intent with no surface won't snag you if you only poke at what exists; it surfaces as "I tried to do G and there was nowhere to"). Enumerate human purposes, NOT every `state × action` cell — the intent list has a floor; the state-grid is a QA matrix that explodes.
- **Every finding is shown, not asserted.** A friction claim carries its screenshot or clip; a backend finding quotes the real response. "Trust me, it's clunky" floats — the captured evidence is the point of dogfooding.

## The session — use it for real, capture as you go (dogfood's own front)

This is what dogfood adds. It does **not** synthesize a mockup to walk; it uses the **real build** and records it.

1. **List the user intents (the test script).** What is someone *trying to achieve*? — "keep a private copy", "find it again later", "undo without losing context". Include the intents the feature implies but you never designed for; this list is the floor that keeps the session bounded.
2. **Drive the real interface to attempt each intent, capturing the run.** Frontend → the project's browser-verify slot (`agent-browser`): actually click the flow; **take a screenshot at each step and friction point, and record the session to video where the slot supports it** (degrade gracefully to screenshots if it doesn't). Backend / CLI → `curl` the endpoint or run the command and **save the actual request/response**. **Don't reason from the doc or from memory** — a belief about how your own feature behaves is often false; confirm it by doing it.
3. **Mark friction + gaps against the captures.** Friction = the path *exists* but is clunky (too many steps, unclear feedback, awkward order, a missing affordance) — tie each to its screenshot / clip timestamp. Gap = an intent with *no coherent path* (dead-ends, contradicts, nothing to start with).
4. **Classify each gap by layer** — missing intent (direction) vs dead-end scenario (incomplete) — so the report shows them distinctly and the hand-off is pre-sorted.

## The report — evidence-rich, with ideas (not a mockup)

The output is a **friction report grounded in the captured session** — *not* a rendered mockup of holes. Lead with the evidence; for each finding:

- **Friction** → *where it snagged · what it felt like · one concrete improvement idea*, each **embedding its screenshot** (and a clip timestamp from the recording where there is one).
- **Coverage gap** → the intent that had no path + its layer tag (direction / incomplete), with the screenshot of the dead-end (or the failing response).
- **The session recording** sits at the top of the report so the whole run is watchable end-to-end, not just the stills.

**Render is demoted to an optional hand-off, not the output.** When a friction idea is big enough to be a *redesign* (not a tweak), *then* hand it to `/shape:mockup` to render the new shape — but the default deliverable is the evidence-rich report, because the felt-unsmooth moment wants to *see* the problem and get ideas, not a fresh artifact to evaluate.

## After the session — offer to route the findings (don't fix in place, don't auto-run)

dogfood surfaces and reports; it does **not** redesign or implement. Once the report is up, *offer* — never auto-call — the next step **per each finding's kind**, via `AskUserQuestion` (offer-next-action, ADR-007/015):

- **A friction idea the user wants to pursue** → a *tweak* → `/nav:plan` (ground it) + `/shape:build`; a *redesign* → `/shape:mockup` (render the new shape) or `/shape:elicit` (if the premise is in question).
- **A direction-level gap (missing intent)** → `/shape:elicit` (is the premise wrong? — a *new decision*, out of scope) and/or `/shape:mockup`.
- **An incomplete gap (dead-end path)** → `/nav:plan` to ground the missing path, then `/shape:build`.

**Guarded + one-shot:** compose the options from what was actually found, always include a **"just leave the report, I'll route later"** opt-out, and don't re-offer after the pick. Offers, not calls — skills don't invoke each other.

## When it fires — and the three boundaries

**Summoned on a "it feels off / try it / show me where it's clunky" request** about a *built* feature — not auto-fired because a feature got mentioned. Three neighbors to stay clear of:

- **vs `/verify`** — both drive the real app, but the *question* differs: verify asks **"is it correct"** (does this change do what it's supposed to); dogfood asks **"is it smooth, and what's missing"** (design quality, not correctness). A passing verify can still feel awful to use — that gap is dogfood's.
- **vs `/shape:mockup`** — mockup renders a *synthetic candidate* to decide **look / structure** *before* building (or for a redesign); dogfood uses the *already-built* thing to critique its **experience**. They pair across time: mockup the flow → build it → dogfood the result. "Which option looks right" is mockup; "this built thing feels wrong" is dogfood.
- **vs `/shape:elicit`** — elicit drills **one** thing verbally to a principle (residue: one line); dogfood uses **many** intents and reports captured friction (residue: an evidence-rich report). A coverage walk is not a grill — but the *judgement* of an ambiguous gap (direction vs incomplete) hands back to elicit's diagnostic mode.

## Storage & format

Lands in a project-local, **git-ignored** `dogfood/` directory by default — the artifacts are disposable evidence, not source, and the recording can be large, so on first run **add `dogfood/` to the project's `.gitignore`** if it isn't already (mirrors mockup's `mockups/` convention). One **dated topic subfolder** per session: `dogfood/<date>-<feature>/`, holding the **friction report** (`report.md`), the **session recording** (`session.mp4` / `.webm` where captured), the **screenshots** (`shots/`), and **saved responses** (`responses/`). (Exact location is a per-project setting; the default is a git-ignored `dogfood/`.) The report's top states **what feature was dogfooded · the intents driven · a link to the recording · the friction found · the coverage gaps (by layer) · what's been routed**, so an agent grasps it from `head`. Driving the frontend uses shape's shared **browser-verify slot** (named default `agent-browser`; detect + fail-helpfully + per-project override — defined once in `plugins/shape/CLAUDE.md`); video capture rides whatever that slot supports, falling back to screenshots.

## Example — the move (stack-neutral)

A feature lets users **archive** items to declutter. It shipped; it feels off. Dogfood it — *use it for real, record it*:

- **Intents (the script):** declutter now · find an archived item again later · restore one.
- **Drive the real app + capture what it hit:**
  - *Archive an item* → works, but it's **3 clicks deep behind a kebab menu and gives no undo toast** — path exists, clunky → **friction** (screenshot of the buried menu; idea: surface archive on hover + a 5s undo toast).
  - *Find an archived item again* → **there's no surface that lists archived items at all** — an intent with no path → **coverage gap · direction** (screenshot of the filter bar with no "archived" option; the feature was scoped one-way).
  - *Restore into a parent since deleted* → the endpoint `curl` returns a 500 → **coverage gap · incomplete** (the saved 500 response; a path left undefined).
- **Report:** a session clip up top, two friction-or-gap entries each with its shot + the saved 500 response, the "find again" gap tagged *direction*, the restore gap tagged *incomplete*.
- **Route:** "find again has no entry" → `/shape:elicit` ("is archive meant to be one-way? then it's the design, not a hole"); the undo-toast idea → `/nav:plan`; the 500 → `/nav:plan` to finish.

The session turns "this feels off" into "watch this — archiving is clunky (here's the fix), and two things you can't actually do — one's a direction question, one's just unfinished."

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| Reason about how the feature behaves from the doc / memory | A belief about your own system is often false. **Use the real build** (browser / `curl`) — that's the whole engine. |
| Report friction without showing it | A friction claim needs its screenshot / clip / response. "Trust me it's clunky" floats — captured evidence is the deliverable. |
| Click around aimlessly | Drive from the **intent list**, or you'll miss the *absent* paths (nothing to stumble on) and only find shallow friction. |
| Enumerate every `state × action` cell | That's a QA matrix — no floor, explodes. Use human intents; they have a floor. |
| Make rendering a mockup the mandatory output | The output is an **evidence-rich report + ideas**. Render only when a finding is a *redesign* worth handing to `/shape:mockup`. |
| Only report friction, ignore the gaps that fall out | The session catches *both* — a clunky path AND an intent with no path. Report and tag both. |
| Redesign or implement the fix in place | dogfood surfaces + routes; redesign is `/shape:elicit`/`/shape:mockup`, the finish is `/nav:plan` + `/shape:build`. |
| Confuse it with `/verify` | verify checks correctness; dogfood critiques experience + coverage. Different question, same real app. |
| Fire on a passing mention of a feature | Summoned on a "try it / it feels off / show me where it's clunky" request, like its mockup sibling. |
| Keep going after the feature feels smooth | Exit when the friction is captured + named + routed (or the user has what they need). |

## Output

- **An evidence-rich friction report** in `dogfood/<date>-<feature>/report.md` — a session recording up top, then each finding = where it snagged · what it felt like · an improvement idea, embedding its screenshot / response.
- **The session captures** — `session.mp4`/`.webm` (where supported), `shots/`, `responses/`.
- **The coverage gaps that fell out**, each tagged by layer (direction vs incomplete) and routed: direction → `/shape:elicit`/`/shape:mockup`; incomplete → `/nav:plan` + `/shape:build`.
- (Optional) a hand-off to `/shape:mockup` for any finding big enough to be a *redesign* — not the default.
- (When the session settles something trackable — e.g. "archive is deliberately one-way") a guarded, one-shot **offer** to run `/shape:align` and triage it in — never an auto-call (ADR-007/015).

## Companion skills

- **`/verify` · `/run`** — dogfood borrows their drive-the-real-app method, but asks a design-quality question, not a correctness one.
- **`/shape:mockup`** — renders a *synthetic* candidate to decide look/structure before building; dogfood uses the *built* result. They pair across time, and dogfood hands a redesign-level finding back to mockup.
- **`/shape:elicit`** — judges an ambiguous coverage gap (direction-wrong vs incomplete) in diagnostic mode; dogfood's layer-tag is its first input.
- **`/nav:plan`** — grounds an incomplete gap or a friction tweak into a code-level plan to finish.
- **`/shape:build`** — implements the planned paths.
- **`/shape:align`** — triages a trackable dogfood finding into `plan.md`.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
