<!-- GENERATED from ../frame-tinker/references/protocol.md by scripts/build-manifests.mjs; do not hand-edit. -->

# tinker — choosing the control, a worked example, failure modes

## Why an object, not a picture

A picture shows a relationship; an object lets the learner cause it. Use it when the
learner's question is "what if?" or "why does it behave like that?", and the answer is a
dependence between a few quantities. A static relationship with nothing to vary belongs
to a picture (`frame-draw`); choosing between candidate designs belongs to `seek-mockup`.

## Choosing the one control

- Pick the variable whose effect is least intuitive, not the first one in the source.
- It should have a small range with a visible, immediate effect (a slider, a toggle, a
  step button). If two variables matter, the second one is a revealed detail.
- Show the result on the learner's side of the screen: a number, a shape, a trace. Keep
  the baseline as a faint ghost so the difference is the thing the eye sees.
- Precompute nothing the learner could have caused: run the real rule on every change.

## Layered reveal

Start with the control and the result only. Each follow-up question adds one thing to the
same object: a second control, a formula behind the result, the edge case where the rule
breaks. Never rebuild from scratch; the learner's earlier settings should survive.

## Worked example (generic)

*Subject:* a retry policy that waits longer after each failure ("exponential backoff").
*Question:* why does the total wait grow so fast?
*Object:* a strip of attempts along a timeline. One slider sets the number of failures; the
bars for each wait double as it moves, and a faint ghost strip shows the same count with a
fixed wait. A folded "why" note appears when asked: each wait is the previous times two.
*Later turn:* "what if there is a cap?" adds a second control, the cap, to the same strip.
*Simplification line:* "ignores random jitter that real clients add to the waits."

## Failure modes

| Failure | Tell |
|---|---|
| Many controls at once | the learner cannot say which one caused the change |
| Result changes but not visibly | a number updates in a corner while the shape stays still |
| A decorative animation | motion that does not depend on the control |
| Quietly wrong model | the rule in the object differs from the source and nothing says so |
| Rebuilt every turn | earlier settings reset when a follow-up arrives |
| Candidates side by side | that is a mockup to decide between options, not an object to understand one |

Output is one self-contained HTML file; activate it and hand over a URL per
`references/artifact-activation.md`.
