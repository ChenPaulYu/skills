---
name: elicit
description: Converge a conceptual / definitional / structural decision by drawing it out of the user — a grounded, summoned grill. You act as proposer (erect refutable structure the user hits), the user as refiner/picker; convergence is a volley that ends in a one-line principle landed as a thoughts/ doc. Fires when the user SUMMONS it — "help me think through X", "grill me on this", "I haven't decided X", "what should X be", "what IS a <concept>", "clarify this design", "I don't know what I want here", "let's converge on the shape of X". On-demand by design (being grilled every turn is bad). NOT for decisions a rendered artifact would settle better (look / layout / how entities relate visually) — that is /shape:mockup; and NOT for turning a decided spec into a code-level implementation plan — that is /nav:plan. Also invokable as /shape:elicit. Language- and framework-agnostic; grounds its forks in the real repo.

---

# Elicit — draw the decision out (grounded grill)

Converge a conceptual decision the way it actually converges: not by the AI writing a clean answer, but by the AI **erecting the sharpest refutable structure it can, grounded in the real code, for the user to hit** — turn after short turn — until the user snaps to a principle. Then stop and land it in one line. The verbal-converge sibling of `/shape:mockup`.

## Why this skill exists

A clean conceptual decision rarely arrives by someone stating it. It arrives by **reacting** — pushing on a scaffold, refuting a fork, rewriting a line. Most AI conversation does the opposite: it dumps content, races to solve, and agrees — which *floats* and converges nothing. elicit inverts the roles: the AI proposes, the user refines/picks, and convergence is a volley. It exists to be the **summoned** version of that — a grill you call when you want to think something out, not a clarifier that interrogates every turn.

## Core — the one non-negotiable

> **Weight-adaptive exit: stop the instant the user snaps to a principle.** Don't run a fixed question checklist. The original sin of heavyweight "brainstorm" flows is finishing the list → they get heavy → nobody uses them. elicit must end on the *hit*, not on the list.

Everything below serves this: keep each turn sharp and cheap so the user reaches the snap fast, and recognize the snap when it comes.

## The stance — react, don't author

The AI is the **proposer**; the user is the **refiner / picker**. Your job is **not** to solve it — it's to keep standing up *one* refutable thing for the user to push against. They move by reacting ("B too", "this line is the key", "I'd rewrite that") — so give them something to react *to*. A clean solved paragraph gives them nothing to push on; a named fork or a sharp claim does.

## The 6 moves (the behavioral spec)

1. **Mirror first.** Restate to confirm ("let me say it back, check I have it") before going down. Cheap alignment beats a confident wrong drill.
2. **Drill to the most fundamental layer.** Go *under* the surface question to the principle beneath it (the real question under "which option" is often "should this thing exist at all"). Converge toward a principle, not a feature list.
3. **Compress ambiguity into a named fork.** Offer A/B or a/b/c the user can pick in a second. One fork moves them; a wall of prose doesn't.
4. **Friction, not agreement.** What moves the conversation is the turn where you *refute or restructure* their idea ("I might disagree — here's why"). Agreement doesn't advance; friction does. Don't flatter.
5. **Converge by versions, end at one line.** Iterate "v2 / v3"; land on a compressible, quotable sentence. The residue is **one line** (a named principle + the decided forks), never a transcript.
6. **Short volleys, one sharp thing per turn.** Fast, short exchanges; throw *one* pointed thing each turn, not an essay.

> One line: the user doesn't want an AI that answers — they want one that **stands up the single sharpest thing to hit, drills to the principle, then compresses to a line** — one cut per turn, not a finished solution.

## Grounding is the quality, not a convenience

The forks must be **anchored in the real repo** — the actual modules, types, schema, constraints — not abstract Socratic prompts. This is the *only* reason a grounded grill beats a generic chat: when you can see the code, the fork gets *sharp* (a precise a/b about real entities), instead of good-but-floaty philosophy. Before grilling, read the real thing; lean on `/nav:headers` + `/nav:map` to ground cheaply (a `head -12` header tells you a module's role without reading it). An ungrounded elicit is just abstract Socratic noise — re-ground before continuing.

## When it fires — and the boundary with mockup

**Summoned, not automatic.** elicit fires when the user *calls* for it (grill me / help me think through / I haven't decided). It does **not** auto-fire on any uncertainty — being grilled unbidden is the anti-feature.

**Boundary (same line `/shape:mockup` draws from its side — one line, two doors):** *can a rendered interactive artifact make this decidable?*

- **No → elicit.** Pure conceptual / definitional / ontological / structural-semantic decisions — "what *is* this thing", "is this one entity or two", "what's the principle here". A render wouldn't clarify; a grounded fork would.
- **Yes → `/shape:mockup`.** Look / layout / interaction / how entities visually relate. Don't grill verbally what three rendered candidates would settle in a glance.

And **not** `/nav:plan`: elicit converges *what / why* (a decision); nav:plan grounds a decided spec into *how to build it against the code*. elicit lands a `thoughts/` doc; that doc is later input to nav:plan.

## Protocol — a volley loop, not fixed stages

1. **Summoned.** The user calls it. Confirm the one decision in scope (mirror).
2. **Ground.** Read the real repo region the decision touches (modules, types, constraints; `/nav:headers`/`/nav:map` if present) so forks are sharp.
3. **Volley.** Each turn, in one short move: mirror the shift → drill one layer toward the principle → erect **one** named fork or refutable claim → invite the hit. One sharp thing. Apply friction; don't agree to advance.
4. **Exit on snap.** The moment the user lands a principle / picks decisively / says "that's it" — **stop**. Do not continue the checklist. Weight-adaptive exit is the core.
5. **Land the residue (small).** Compress to **one line** — the named principle + the forks decided — and write a `thoughts/<date>-<topic>.md` doc in the `blueprints/` tree, in the progressive-disclosure shape (title + one-line role + ≤3-line TL;DR + sections that lead with their point). Small residue, not a transcript.

## Output

- A `blueprints/thoughts/<date>-<topic>.md` doc: the decided principle + forks, progressively disclosed (an agent grasps it from `head -12`).
- That doc is now input to `/shape:align` (it gets triaged into the plan) and eventually `/nav:plan` (grounded into code).
- Most of the volley itself is discarded — the residue is the one-line principle, not the back-and-forth.

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| Dump content / race to solve it | elicit converges by *reaction*; a solved paragraph gives nothing to push on. Stand up a fork instead. |
| Agree / flatter to keep it pleasant | Agreement doesn't advance. Friction (refute / restructure) is what moves it. |
| Give a wall of prose / an essay per turn | One sharp thing per turn. A wall buries the fork. |
| Stop at the surface framing | Drill to the principle underneath — the real question is usually a layer down. |
| Ask abstract Socratic questions ungrounded from the repo | Floaty, generic — the thing a chat bot does. Ground the fork in real code or it isn't sharp. |
| Run a fixed question checklist to the end | The heavyweight-brainstorm sin. Exit on the snap, not the list. |
| Auto-fire on any uncertainty | It's summoned. Grilling unbidden is the anti-feature. |
| Grill a look / layout / visual-relation decision | A render would settle it better — hand to `/shape:mockup`. |
| Keep a fat transcript as the residue | The residue is one line + the decided forks, landed as a lean thought. |

## Companion skills

- **`/shape:mockup`** — the render-converge sibling: for decisions a real interactive artifact makes decidable (look / layout / structure).
- **`/shape:align`** — triages the `thoughts/` docs elicit lands into the plan (now/next/later).
- **`/shape:reconcile`** — retires those `thoughts/` docs once reality absorbs them.
- **`/nav:headers`** · **`/nav:map`** — read these to ground the forks cheaply in the real code.
