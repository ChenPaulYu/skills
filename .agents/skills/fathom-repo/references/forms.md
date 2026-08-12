# Visual forms — matched to the level, not the mood

Form follows ladder level. The default medium is a terminal diagram; HTML is an escalation with a
strict condition (below).

| Level | Form | Job | Readable test |
| --- | --- | --- | --- |
| Repository / Runtime | **Map** | The whole system and its major ownership boundaries in one frame. | Understandable in ~30 seconds, zero clicks. |
| System | **Path** | One canonical run followed through time. | One event or transfer revealed at a time. |
| Behavior | **Branch** | The important ways the path diverges, contrasted. | Two variants comparable side by side. |
| Code | **Code Tour** | Mental model connected to files, symbols, evidence. | Source shown on demand, never as the spine. |

## Map form

Broad but shallow: most load-bearing primitive families, each with a plain-language job; concrete
classes grouped into conceptual neighborhoods, never a listing of exports. Adjacent runtime
families may appear as labeled neighbors without unfolding.

## Path form (canonical-run grammar)

Separate what stays fixed from what changes:

- a **fixed spine** shows the stages every run crosses;
- **one selected outcome** shows the branch currently being explained;
- a dedicated **return rail** makes loop continuation explicit;
- a **terminal state** replaces the return rail when the run finishes or pauses.

Use this form when time and control transfer are the concepts to hold. Static ownership and
composition questions still want a Map or grouped cards.

## Terminal diagram dialects

- Simple lifecycle → ASCII flow (`->` chains, one branch per line).
- Timed component interaction → sequence diagram.
- Object lifetime → state diagram.
- Transformation chain → data-flow diagram.

## HTML escalation — the paid lesson

Produce an HTML artifact **only when interaction changes visible state** (selecting a branch
re-lights the path; stepping an event moves real data), or the learner explicitly asks. Two
lessons already paid for in the lab, verbatim:

> Making every box clickable did not make the model easier to understand: each click merely
> replaced one block of prose with another.

> A mechanically correct interaction can still be pedagogically empty when the visible system
> itself does not change.

When an HTML artifact is earned: keep visual consistency with the study's earlier artifacts
(canvas, palette, typography, diagram grammar) — consistency is part of navigation. Save it under
the study's `tour/`; responsive layouts rearrange stages rather than shrinking the whole diagram.
