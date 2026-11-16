---
name: wrap
disable-model-invocation: true
description: "Save this round's progress and concrete next actions into the original project tasks before stopping. No separate session handoff or checkpoint file."
---

# wrap — leave the work ready to resume

Run when asked to save progress or finish the round. Read
`references/workspace-records.md`, then the project's records and current mapped
repository evidence. Update the original touched tasks, not a new session summary.

Before creating or updating project records or working artifacts, read
`references/workspace-records.md` to resolve the connected home and storage first. Read
`references/record-interface.md` and apply its pre-write ownership check; it also
defines frontmatter, dates, opening conclusions and visible Relations. Keep existing records readable; do not invent parents.

For each touched task, keep the goal and why, actual progress, verification and its limits,
remaining blockers/reasons, rejected approaches and why they were rejected, and one
executable next action. Record a fresh code SHA when useful; label missing intent or
Git evidence rather than fabricating it. Preserve unrelated open
work and unique reasons already there. Store a new decision or deferred idea in its
appropriate record only when it adds independent value; link it to the task.
When the user explicitly puts unfinished work aside for later, mark it `paused`
(or `blocked` when a recorded external dependency prevents progress). Ending the
round does not make a task `done`.

When saving includes a mockup, probe or other working artifact, read
`references/development-artifacts.md` and preserve the actual artifact and required
dependencies in the connected home before reporting it saved.

Show the intended delta and apply the already-authorized save. Re-read before each
write to preserve concurrent work. Label unrecorded reasons and unverified behavior
honestly; avoid calling implementation complete when its acceptance check is pending.
Update a linked plan only when its own criteria are met. An adopted thought remains
valid after the task closes. Report changed records and any unsaved or unresolved
material, then stop without starting another task.

If no task exists, use a readable existing work item; create a minimal task only
when this is actual authorized work. A pure idea belongs in an idea record. Without
a known write destination, request that missing locator instead of inventing a
HANDOFF.md, dated checkpoint chain, or new durable progress board.

## Legacy records

Without mapped task records, read the existing board/work item and any baton/HANDOFF
using `references/session-handoff.md`. Report the readable tier and retain unique live
work/reasons from both notes when they conflict. Save into the original work item or
create one minimal authorized task at the established work-record location; do not
create or overwrite a new session cursor. Preserve legacy notes until verified durable
transfer and recovery allow a separately authorized tidy. Re-read the target and show
the intended delta before writing. Do not migrate the project during an ordinary save.
