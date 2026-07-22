# ADR 092 — Relay makes native lifecycle completion explicit

**Status**: accepted. **Amended by [ADR-100](docs/adr/100-relay-adopts-the-accord-memory-model.md)**: the "Awareness ACK completes on the designated account's `👀`" bullet below no longer describes the default model — there is no Announcement object under the Accord memory model. It survives only inside a LEGACY `[ACK]`-titled-Discussion compatibility path. The task-Issue, Q&A, ordinary-PR, Core-PR, and migration bullets are unaffected; Decision Issue completion is superseded by the native `awaiting-record` stage-label chain (see `settle/SKILL.md`).
**Date**: 2026-07-21
**Refines**: [ADR-090](docs/adr/090-relay-github-native.md) and [ADR-091](docs/adr/091-relay-awareness-review-task-evidence.md)

## Context

The awareness/review/task split exposed adjacent lifecycle gaps. Relay named how to open each GitHub object but did not fully name how ordinary task Issues and non-Core pull requests finish. `brief` created a PR and passively said “after merge” while `settle` only owned Core merge. The digest could also treat an approved Core PR as ready without knowing whether required review, stale-approval dismissal, and bypass enforcement actually existed. Separately, a mutable external artifact had become the current product source without a GitHub event pinning its revision.

## Decision

Every Relay event has one owner, native completion signal, and end state:

- FYI and versioned external-source Announcements have no owner or settlement obligation.
- Awareness ACK completes on the designated account's `👀`; closure is optional housekeeping.
- A Q&A Discussion completes when its author accepts an answer.
- A verifiable task Issue is owned by its single assignee, who returns the stated evidence; `settle` verifies the criteria and closes it.
- A Decision Issue is owned by its single decision owner, who records an authorized resolution; `settle` closes it.
- An ordinary exact-change or brief PR is reviewed on its current revision. `Request changes` creates an action for the PR author; pushing a new revision returns review to the requested reviewer; approval hands settlement to the author by default, or to one PR assignee explicitly naming the merger. Multiple assignees do not transfer settlement. Merge applies the change. The author or repository authority may instead settle it as explicitly abandoned; closing unmerged never means successful completion.
- A Core PR follows the same path but is settle-ready only when required review, stale-approval dismissal, and bypass enforcement are verified; merge makes Core binding.
- A legacy migration is not complete at inventory, mapping, object creation, approval, or cleanup proposal. Its migration/cleanup PR must merge into the default branch, then every retained destination and citation must read back successfully. Until then it is in progress or blocked at a named object.

An authoritative external source update is a separate FYI Announcement containing a stable URL and immutable revision, commit, or content hash. A brief update is a linked exact-diff PR and cannot substitute for that source event.

## Consequences

- `settle` owns approved ordinary PR merge as well as Core effectivity.
- `digest` may show approved ordinary PR settlement, but reports otherwise-ready Core as blocked when enforcement is unverified.
- Task evidence and task closure have an explicit owner instead of relying on an unspecified closer.
- External raw material remains with its source owner while GitHub preserves which revision became current.
- Migration has one observable effective point instead of conflating a complete mapping with a completed transition.
- No time buckets, parallel state store, new skill, or new GitHub object type is introduced.
