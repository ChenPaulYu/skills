# ADR-016 — Task-owned planning and direct execution

Status: trial · 2026-11-18

## Decision

`shape:task` records decided work: each deliverable carries its observable acceptance
check, and the same task carries evidence and the next action. Recording a task
leaves execution pending. `nav:do` accepts decided multi-item work, finds the owning
work item before its first edit, grounds ownership, ordering, compatibility and
verification in code, and records verified progress in that task. A bounded fix with
no matching task can proceed directly. `nav:plan` answers requests to see or choose
an engineering approach, in chat by default. Experience decided in elicit or mockup
is carried into the task and traced by the implementer; an unresolved user-owned
choice returns to shape. Existing engineering sections and legacy plans stay
readable.

## Evidence and alternatives

- A mandatory engineering plan for every substantial change was rejected. In a paired
  trial, direct implementation passed the shared acceptance checks; the planned path
  flagged two real risks but missed an older persisted representation. One trial
  supports the default for decided work, not that written proposals are worthless.
- Retiring `nav:plan` immediately was rejected; the explicit engineering-review entry
  stays until more cases are tested.
- A new handoff skill or extra mandatory step between shape and nav was rejected.
- A new record type or formatter for plans was rejected.
