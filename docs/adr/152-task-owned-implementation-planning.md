# ADR 152 — Keep implementation planning in the owning task

**Status**: accepted
**Date**: 2026-11-16

[ADR-155](docs/adr/155-shape-task-and-direct-execution.md) revises where new
engineering proposals go by default. Nav-plan presents them in chat and saves
them in the owning task when requested. The single-owner rule still applies.

## Context

The connected-workspace pilot separated task progress from implementation plans.
That split required two files for one work item, while the planning skill defaulted
to creating the second file without clearly owning task creation. The user chose
one work record instead of another skill entrance or a task/plan naming ceremony.

## Decision

For new connected-workspace work, Task owns the goal, scope, completion criteria,
optional implementation plan, progress, verification and next action. `nav-plan`
keeps its verb name and grounds the implementation section in that task. Ordinary
execution and wrap update the same work owner. An explicit request to record work
can create a planned task without generating a speculative implementation plan;
a planning-only request does not authorize building. Ideas and mockup approval do
not silently become execution commitments. Small one-off fixes need no ceremony.

The shared workspace reference owns creation, location and lifecycle; the record
interface owns document presentation. Nav's planning protocol supplies a task-body
planning example. Status reads embedded plans; tidy treats consolidation as scoped
cleanup, not automatic expiration. Existing typed/flat plans retain IDs, paths,
statuses and relations, and live legacy work can be resumed in place. Unconnected
repositories retain their own planning convention. This decision does not migrate
existing files or change the reader's JSON contract.

## Consequences

- No new skill or renamed command; document type and planning action stay distinct.
- New work has one progress owner; shared references, consumers and public catalog
  copy must agree about where planning is written.
- The reader keeps legacy plan support and labels those records as old plans in
  the relation view, without hiding their content or invalidating their statuses.
- Consolidation later must preserve unique content, useful links and recovery;
  adopting this convention alone authorizes no bulk cleanup.

## Verification

Regenerate the Nav/Shape manifests and Codex/Cursor bundles. Run the marketplace
validator and workspace reader tests, including a task with embedded planning beside
a still-readable legacy plan. Verify actual connected-home reads and update that
home's layout/policy without moving historical records. This tests the data/read
path; it does not claim a fresh agent has followed the new prose correctly.
