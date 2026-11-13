# ADR-141: Rename shape-reconcile to shape-tidy

Status: Accepted
Date: 2026-11-13

## Decision

Rename the project-record cleanup entrance from `reconcile` to `tidy`, chosen by
the owner during the workspace pilot. The work is like tidying a workbench:
identify what is live, correct stale status, consolidate duplicates, and retain
useful reasons. `reconcile` suggests accounting; `recycle` suggests disposal or
reuse rather than maintaining the working record.

This is a name change, not a broader cleanup authority. Evidence requirements,
read-only requests, preservation gates, and priority ownership remain unchanged.
The renamed skill still handles legacy blueprints; this change does not claim
that workspace-native cleanup or the full pilot rollout is complete.

## Consequences

`shape-tidy` / `/shape:tidy` is the current entrance. Update live references,
catalog copy, behavioral-fixture skill targets, and generated platform mirrors.
Do not keep a duplicate alias skill: the pilot is simplifying the roster.
Historical ADRs, revision logs, and fixture case IDs may retain `reconcile` as
historical identity. No extra skill or new invocation boundary is introduced.
