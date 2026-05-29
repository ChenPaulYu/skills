---
name: mockup
description: Converge a visual / UI decision by building a real, disposable, interactive candidate at true size — never an ASCII sketch, an option list, or a prose description. Use whenever the user wants to "mock up X", "explore design options for Y", "see what this would look like", "try a few layouts/variants", or faces any look-and-feel decision before building. Produces a single self-contained interactive HTML candidate (undecided points as live toggles); escalates to multiple variants + a decision note only for big decisions. Language- and framework-agnostic; the render/screenshot step flexes per project.
---

# Render-to-decide mockup

Converge a visual decision by confronting the user with a **real, disposable, interactive candidate rendered at true size in real context** — not a description of it. You manufacture the candidate; the user points.

## Why this skill exists

You can't judge a look-and-feel decision from a description. An ASCII sketch, an option list, or prose all *float* — they read fine and decide nothing. A candidate rendered at real size, in real context, with real interaction is **decidable**: the user looks, flips a toggle, and picks. This skill's whole job is to make that real candidate cheap enough to throw away, so the user judges the thing instead of a paragraph about the thing.

## Spine

> **Converge by a real, disposable instance — never a description.**

Two non-negotiables hang off it:

- **Weight-adaptive.** Only render a candidate for a *load-bearing* visual decision. A trivial tweak → just make the change, no mockup.
- **Exit on the pick.** You're done when the user points or reframes — **not** when you've produced every possible artifact. Never run a fixed multi-stage ceremony.

## Default protocol — light (this is the norm)

1. **Ground.** Read the real surface the thing will live in: the real palette / tokens, real proportions, the surrounding layout. Don't mock in a vacuum — a candidate that floats free of real size + context is not decidable.
2. **Build ONE self-contained interactive candidate.** A single standalone HTML file: inline styles, vanilla JS, **deterministic fake data generated client-side**, zero build step, no external assets. Rebuild the look as a **faithful replica** using the real palette + real size — do **not** import the app's real components, do **not** chase pixel-perfection. Put every *undecided point* on a **live toggle** so the user flips variants in place. One file with toggles beats N separate option files.
3. **Render + show.** Open it at real size and capture what the user sees. (The render/screenshot mechanics are a **per-project verify helper** — see below.)
4. **Let the user point — and watch for the reframe.** They flip toggles and pick. Stay alert: a real candidate often reveals the *question itself was wrong* — the element shouldn't exist, text beats the icon, the surrounding form already encodes the meaning. Surface that; don't just answer the surface ask.
5. **Residue.** Record the pick. Optionally declare a **visual-lock**: the chosen file becomes the canonical visual reference (note it in the project's CLAUDE.md). No write-up by default.

## Escalate — heavy (only when the decision is big)

When the decision is load-bearing, has many variants, or needs a durable comparison record, escalate to: **multiple variant files + screenshots + a decision note** capturing — the shared scene (same data across variants) · what each variant is · a build-cost estimate · what's explicitly NOT in scope · the fake-data note. Mark it explicitly as the exception; the light form is the default.

## Faithful-replica discipline (what makes a candidate trustworthy)

- Real palette / tokens · real proportions · real size · real surrounding context.
- Deterministic fake data (a tiny generator) · no external assets · no build · a single self-contained file.
- A faithful hand-built replica — not the real components, not pixel-perfect. The point is *cheap + disposable*, real enough to decide on.
- If a candidate isn't at real size in real context, re-ground it before asking for a decision.

## The verify step is per-project

Step 3's "render + capture" uses whatever browser-automation the project has (open the file or the running app, locate the target, screenshot / interact). Those mechanics — and their known quirks — live **with the project**, not in this skill. Keep this skill's core environment-agnostic; treat the verify helper as a pluggable slot.

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| Offer ASCII / an option list / prose to decide from | A description isn't decidable. Render the real candidate. |
| An isolated, not-real-size candidate | It floats; the judgment will be wrong. Put it in real context at real size. |
| N option files + screenshots for a small decision | That's the heavy form. Default is one file with toggles. |
| Import the real framework components / chase pixel-perfect | Overkill. A disposable replica is the point. |
| Decide for the user | You manufacture; the user flips toggles and points. |
| Answer only the surface ask ("give a nicer icon") | Watch for the reframe — the element may not need to exist. |
| Keep iterating after the user has picked | Exit on the pick. More candidates = wasted motion. |

## Output

- One self-contained interactive HTML candidate (default), or multiple variants + a decision note (escalated).
- A recorded pick, optionally a declared visual-lock.
- No prose spec/doc unless the heavy form was explicitly warranted.
