---
date: 2026-06-05
status: raw
---

# Measured paints, intent decides — a display/behaviour gate on a drifting quantity is the bug

> Grounding for a future **`nav:audit` TS/React heuristic** (the per-stack family, alongside hook-counts / JSX-span). Source: one Crate session shipping the Track overview minimap (F2) + its dogfooding fixes — **three independent-looking UI bugs that turned out to share one root cause**, each fixed by the same move. Not yet promoted into the audit: it's `raw` (one project, one session) and half of it is a review heuristic, not a grep. See also [[2026-06-01-browser-verify-audio-canvas-app-gotchas]] (same app, the verification side).

## The case (kept real — Crate's track card component)

Three bugs, reported separately by the user over the session, each looking unrelated:

| Symptom (what the user saw) | Root cause | Fix |
|---|---|---|
| Zoom the **whole canvas** out → a track's minimap vanishes | the show/hide gate used live `viewportW`, which drifts: a card's width is capped at `0.7 × canvasViewportW`, so canvas zoom widens the card → grows `viewportW` past the threshold | gate on `maxContentW > restingCardW` — both from the track's own `pps` / persisted `card.w`, **orthogonal to canvas zoom** |
| Press **fit** repeatedly → the card creeps smaller, never fills | `maxContentW` undercounted the chrome (splitter + padding + border) → the resize cap drifted a few px each press | count the full chrome → fit lands flush + is idempotent |
| Resize a track → **note lanes vanish** | `card.h ?? default` — a persisted `0` (from an old collapse) is a valid value to `??`, so it stuck at height 0 forever | treat `≤ 0` as unset → fall back to default |

The trap each time: **a decision ("show the minimap?", "how wide is the card?", "how tall are the lanes?") was made off a quantity that some *unrelated* thing could move** — canvas zoom, a px-counting slip, a legacy `0`. The unrelated thing moves, the decision flips, and it reads as "X randomly breaks when I do Y."

## The principle

> **Measured values paint; intent values decide.**

A *measured* value (`clientWidth`, `getBoundingClientRect`, anything read back off the rendered DOM) describes "what it currently looks like" — and is therefore contaminated by parent transforms, sibling state, resize, zoom. It is the right input for **drawing** (the bracket width *should* reflect the actual visible slice). It is the wrong input for a **gate / decision**, because the decision then silently couples to every axis that perturbs the rendering.

An *intent* value (the user-set `card.w`, the track's own `pps`, a persisted setting) is what you actually meant — stable under unrelated state.

Crate's minimap fix is the principle in one diff: `viewportW` (measured) kept feeding the bracket it draws; the *gate* moved to `maxContentW` vs `restingCardW` (intent).

## How to spot it

1. **`??` with a value that can legitimately be `0` / `''` / `false`** — grep-able. `??` only guards `null`/`undefined`; a stored `0` passes through as "valid" and shadows the default. (The note-lane bug.) Review every `?? default` for "can a real falsy value reach here?"
2. **A live DOM measurement flowing into a *gate* (a conditional / show-hide), not just into a style** — review heuristic, not a grep. When a measured value decides *whether* something shows, ask: *"what unrelated things change this number?"* If the answer includes anything the decision shouldn't know about → wrong quantity.

## How to avoid it

When you write a gate, pick the input that is **(a) intrinsic to the thing being decided and (b) orthogonal to the other axes**. Usually that's an intent/persisted value, not a render-time measurement. If you must use a measurement, confine it to drawing.

## Why it belongs near deep-module

It's a flavour of **information leakage** (rule ①): the gate "knows" about an axis it shouldn't (the minimap decision knew about canvas zoom, via the shared `viewportW`). Leakage usually shows as the same *fact* in two modules; this is the same idea one level down — a *decision* coupled to an unrelated *state* through a shared measured quantity. Same cure: cut the coupling (decide off an orthogonal value).

## One line

> If "X breaks when I do an unrelated Y", X is gating on a quantity Y contaminates — measured values should paint, not decide; move the gate onto an intent value orthogonal to Y.

## Evidence / status

- `raw` — **one project, one session, but three independent sightings** of the identical root cause + identical cure (Crate F2: canvas-zoom-flips-minimap, fit-not-idempotent, note-lanes-vanish). The same-session triple is strong for `raw` but not yet cross-project.
- **Promote path**: a second project showing "gate on a drifting measured value" → `repeated` → graduate the grep-able half (`??`-on-falsy) into `nav:audit`'s mechanical checks and the heuristic half into its TS/React per-stack notes.
