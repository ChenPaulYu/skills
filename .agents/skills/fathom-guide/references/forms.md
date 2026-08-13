# Visual forms — form follows the knowledge, inside one guided container

Two rules:

1. **Level default**: the Repository level defaults to an **interactive guided mockup** — a
   high-level picture is precisely where interaction earns its cost. Mid-ladder levels stay
   terminal-first, escalating only when interaction changes visible state. The Code level's form
   (a behavior→code drill-down graph) is not yet settled.
2. **Within an artifact, form follows the KIND of knowledge each section carries.** The guided
   story is the container; each chapter picks its organ.

| Knowledge kind | Form | Spec |
| --- | --- | --- |
| Ownership / boundary | **Spatial map** | Three-party split (caller / the thing itself / outside world) as cards. Positions are permanent — a later structure chapter reuses the SAME layout one zoom deeper, so the learner's spatial memory keeps paying. |
| Temporal process | **Run playback** | The micro-example stepped line by line in a console; an actor legend lights per line; an annotation beneath carries the *why* of that line; a variant switch replays the same task the other way. Preferred over a static outcome-branch diagram at Repository level: **watching one run beats mapping all runs** when the learner has no model to hang branches on yet. |
| Delta from known | **Claim expansion** | Not a two-column table. Each row is one of the learner's own sentences from the calibration probe, plus a verdict chip (right · partly right · doesn't hold · didn't consider) that acts as the *door*; clicking unfolds a fixed three-beat body: **mechanism → the trade-off behind it → what it costs you in practice**. **Correct claims expand too** — a right answer is where the next layer is cheapest to add. Grading alone teaches nothing; the beats are the chapter. |
| Taxonomy | **Classification tree** | Root = the promise, branches = families, leaves = one-line jobs; lead families visually weighted. Draw the *grouping*, not a literal tree: root as a slim top bar (a root floating beside a tall column leaks dead space), leaves in a strict N-column grid (free-wrapping leaves produce orphan full-width cards). |
| Structure / dependency | **Node-edge graph** | Arrows = who uses whom; **edge weights** mark the one-canonical-run spine; every node's detail ends with clickable *next-step* hints (hand-written reasons for core nodes, adjacency as fallback). A graph without weights and a suggested walk is an inventory, not a tour. |
| Lifecycle / outcome classes | **Canonical-run outcome diagram** | Fixed spine → outcome pills → a branch card dropping from the spine → a terminal strip (dashed loop-back vs solid done) → control-flow chips. Home level: **System** — Repository teaches what one run feels like; System teaches every path a run can take. |

## The guided container

Chapters with one takeaway each; sidebar navigation; a final chapter of seams (the next zoom's
choices) plus the gate preview. Every takeaway names **what was deliberately folded and which
level owns it**. Aim: each chapter readable in ~30 seconds before any interaction.

## The micro-example thread

One tiny task threads the artifact — small enough to be boring, rich enough to need two distinct
actions (e.g. "look something up, then compute on it"; "state a fact, then ask something that
needs it"). It **starts in the chapter that first exercises it**, with one line of why-this-task;
mentioning it earlier is noise, not foreshadowing. Under a two-variant system, replay the SAME
task per variant so the difference demonstrates itself.

## The gloss layer

Dotted click-terms with plain-language popovers. The list comes from the calibration probe — skip
what the learner owns — plus the net the probe always misses: **architecture-description words**
(embedded, service, runtime, layer, mechanism). Those are not glossed but *rewritten*: name a
thing by what the learner does with it (see SKILL.md's build step).

## Delivery discipline

- Visual consistency with the study's earlier artifacts (canvas, palette, typography, diagram
  grammar) — consistency is part of navigation.
- **Browser-verify before delivering**; then tell the learner to reload if you revised a page they
  already had open.
- Artifacts are disposable; prune the losing variant of a form comparison at level close, never
  silently.
- Responsive layouts rearrange stages rather than shrinking the whole diagram.
- Labels the artifact shows (verdict chips, beat headings, hint rows) render in the learner's
  language; the English names in this file are the *roles*, not the strings.
- CSS trap worth knowing: an author `display:` rule beats the UA `[hidden]` rule — pair any
  `display:flex/grid` class with `.cls[hidden]{display:none}` if you toggle visibility by attribute.

## Terminal dialects (mid-ladder default)

Simple lifecycle → ASCII flow · timed interaction → sequence diagram · object lifetime → state
diagram · transformation chain → data-flow diagram.

## The paid lessons (verbatim, still binding)

> Making every box clickable did not make the model easier to understand: each click merely
> replaced one block of prose with another.

> A mechanically correct interaction can still be pedagogically empty when the visible system
> itself does not change.
