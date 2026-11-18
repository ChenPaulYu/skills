# ADR-155 — Shape defines tasks and Nav implements them

Status: Accepted as a trial · 2026-11-18

## Decision

Add shape-task for requests to record or revise decided work. Reuse the original
task. Each deliverable carries
its observable acceptance check, and the same record carries evidence and next
action. Keep the existing frontmatter, relationships and status vocabulary.
Idea capture, unresolved product choices and saving session progress stay with
shape-idea, shape-elicit and shape-wrap respectively.

Nav-do accepts decided multi-item work. It grounds ownership, reuse, ordering,
compatibility and verification in existing code before editing affected paths.
It verifies and advances authorized ready items and records evidence in the
owning task. Nav-plan remains available for requests to see or choose an
engineering approach. Its output defaults to chat. A request to record a task
or review an engineering approach alone leaves execution pending.

Route requests by the deliverable. “Write a task for this” selects shape-task.
“Implement this” selects nav-do, which looks for the owning work item before
editing. When the user asks for both, Shape records the agreed outcome first
and Nav executes under the existing authorization. A matched task owns the
writeback; a bounded fix without a match can proceed directly.

This revises ADR-152's default treatment of engineering notes and ADR-153's
routing by planning depth. It keeps their single task owner, proportional
engineering reasoning and evidence requirements. ADR-154's experience boundary
still applies. Existing engineering sections and legacy plan records remain
readable. The trial requires no record migration or reader schema change.

## Evidence and alternatives

In a paired implementation trial, both paths handled the same feature with
multiple entry points and persisted data. Direct implementation passed all
initial shared acceptance checks. The planned path called out two genuine risks,
but missed an older persisted representation that the shared acceptance surfaced.
Both passed after correction. One trial supports changing the default for decided
work. It does not establish that written engineering proposals have no value.

A required engineering plan for every substantial change adds a separate decision
step even when the executor can resolve the code facts. Retiring nav-plan immediately
would remove the user's explicit engineering-review entry before testing the new
workflow on more cases.
