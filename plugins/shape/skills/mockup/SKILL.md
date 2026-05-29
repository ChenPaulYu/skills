---
name: mockup
description: Converge a visual / UI / spatial / interaction decision by generating and rendering real, disposable, interactive candidates at true size — never an ASCII sketch, an option list, or a prose description. Use whenever a look-and-feel decision can't be settled by description: "how should this icon / layout / hover look", "try a few variants", "I don't even know what the options are", or de-risking how a feature will look/move before building it. Renders the candidate space cheaply (a row of generated options and/or live toggles). NOT for conceptual / ontology / data-model decisions ("what IS this thing") — those are verbal clarification, not a mockup. Language- and framework-agnostic; the render step flexes per project.
---

# Render-to-decide mockup

Converge a visual decision by confronting the user with **real, disposable, interactive candidates rendered at true size in real context** — not a description of them. You **generate** the candidate space and render it; the user points.

## Why this skill exists

You can't judge a look-and-feel decision from a description. ASCII, an option list, or prose all *float* — they read fine and decide nothing. Candidates rendered at real size, in real context, with real interaction are **decidable**: the user looks, flips a toggle, picks. This skill makes those candidates cheap enough to throw away, so the user judges the thing instead of a paragraph about it.

Often the user has no options yet — just an open question ("does this need an icon? what would it even look like?"). So **generating a divergent candidate set is half the value**, not a precondition.

## Spine

> **Converge by real, disposable instances — never a description.**

- **Mockup is a probe, not a pipeline stage.** It fires at any altitude and **feeds back upstream**: a rendered candidate often changes not just the visual but the *concept* — because a broad-enough set includes the "don't build this element at all" candidate, and seeing what "don't" looks like reframes the decision (rendering icon options reveals plain text wins; or that the element shouldn't exist).
- **Render when in doubt.** You usually can't tell upfront whether a description would have sufficed — you find out by rendering. Bias toward rendering; the cost is one cheap throwaway file.
- **Weight-adaptive + exit on the pick.** A genuinely trivial tweak → just make it. And you're done the moment the user points or reframes — never run a fixed multi-stage ceremony.

## When NOT to use it (anti-trigger)

A **conceptual / ontology / data-model** decision — "what *is* this thing", "how should these entities relate" — is not a visual decision. Rendering settles nothing there; that's a verbal-clarification job (a grounded fork, not a candidate). Reach for a mockup only when the question is "what does it **look / move** like", not "what **is** it".

## Default protocol — light (this is the norm)

1. **Ground.** Read the real surface the candidates will live in: real palette / tokens, real proportions, surrounding layout. Don't mock in a vacuum — a candidate floating free of real size + context is not decidable.
2. **Generate + render the candidate space — cheaply, in one file.** Two layouts of the *same* light default (often both, in sequence):
   - **(b) Discover** — when the option space is open: render **a row of divergent generated candidates** side-by-side, at real size in real context. Generate *broadly*, and include the "don't do this / nothing here" candidate — that's what lets the decision reframe. (This is the common case; the user rarely brings formed options.)
   - **(a) Refine** — when the direction is known: one candidate with each **undecided sub-point on a live toggle**, so the user flips variants in place.
   Either way it's a single standalone HTML file — inline styles, vanilla JS, **deterministic fake data**, zero build, no external assets, **faithful replica** (real palette + real size; do **not** import real components or chase pixel-perfection).
3. **Render + show.** Open at real size and capture what the user sees. (Render/screenshot mechanics = a **per-project verify helper**, see below.)
4. **Let the user point — and watch for the reframe.** They look / flip / pick. Stay alert for the candidate revealing the *question was wrong* (the element shouldn't exist; text beats the icon; the surrounding form already encodes the meaning). Surface it; don't just answer the surface ask.
5. **Residue + disposal.** Record the pick. **Most mockups are then discarded** — their job (converging the decision) is done. Promote to a visual-lock only per the rule below (rare).

## Escalate — heavy (rare exception)

Only when the decision is load-bearing, spans many variants, or needs a durable comparison record: **multiple variant files + screenshots + a decision note** (shared scene · what each variant is · build-cost estimate · what's NOT in scope · fake-data note). Mark it explicitly as the exception; (a)/(b) above are the default — a row of generated candidates in one file is **not** heavy.

## Visual-lock: retire-on-ship, stamp, don't maintain

A visual-lock (a chosen mockup frozen as a reference) is **rare** and **decays** — discipline by altitude:

- **Detail / component-level** → **retire on ship.** Once the real thing ships, the **running app is the ground truth**; the mockup has done its job. Keeping it as a "north star the app must match" inverts reality → guaranteed drift / lie.
- **Structural / layout-level** (slow-drifting; lives at an altitude code can't easily project) → may persist, **but must carry a freshness / supersession stamp**: "intent as of `<date>`, shipped `<commit>`, details defer to the real app." Without the stamp it's a lie.
- **Unlike a generated codebase map, a mockup can't auto-regenerate from source** — so the discipline is **retire + stamp, never silent refresh.** Most mockups discard; a permanent lock is a rare structural exception.

## Faithful-replica discipline (what makes a candidate trustworthy)

- Real palette / tokens · real proportions · real size · real surrounding context.
- Deterministic fake data · no external assets · no build · single self-contained file.
- A faithful hand-built replica — not real components, not pixel-perfect. The point is *cheap + disposable*, real enough to decide on.
- Not at real size in real context → re-ground before asking for a decision.

## The verify step is per-project

Step 3's "render + capture" uses whatever browser-automation the project has (open the file or the running app, locate the target, screenshot / interact). Those mechanics — and their quirks — live **with the project**, not here. Keep the core environment-agnostic; the verify helper is a pluggable slot.

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| Mockup a conceptual / ontology / data-model question | That's verbal clarification, not a visual decision. Rendering settles nothing there. |
| Offer ASCII / an option list / prose to decide from | A description isn't decidable. Render real candidates. |
| Render only the options the user named | Generating a *divergent* set (incl. the "don't" candidate) is half the value — don't skip it. |
| An isolated, not-real-size candidate | It floats; the judgment will be wrong. Real context, real size. |
| Treat "multiple candidates" as heavy | A row of generated candidates in one file is the *light default*, not the exception. |
| Import real framework components / chase pixel-perfect | Overkill. A disposable replica is the point. |
| Decide for the user | You generate + render; the user points. |
| Keep a visual-lock as a permanent north-star the app must match | Retire on ship; the running app becomes the truth. |
| Keep iterating after the user has picked | Exit on the pick. More candidates = wasted motion. |

## Output

- A rendered candidate space (a row of generated options and/or one candidate with toggles) in one cheap file (default); or multi-file + a decision note (rare escalation).
- A recorded pick; most mockups then discarded.
- A visual-lock only as a rare, stamped exception (structural-level).
