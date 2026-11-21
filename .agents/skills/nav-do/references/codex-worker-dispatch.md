# Codex Worker Dispatch

Read this only when the current task actually dispatches explorer or executor workers. Tasks that do not dispatch workers do not need this reference.

## Work Packet

Every dispatched worker brief must include:

- **Goal** — the one-sentence outcome this worker must achieve.
- **Scope and owned files** — exactly which files/paths it may touch; everything outside that scope is out of bounds.
- **Inputs and source of truth** — what to read before acting, and which document or state wins if sources disagree.
- **Constraints and forbidden actions** — house rules it must not break (read-only, no scope creep, no mid-batch tests, etc.).
- **done_when** — the concrete condition that makes "done" true, not a feeling.
- **Verification commands** — the exact command(s) it must run and report the result of.
- **Base SHA** — the commit/state it started from, so the returned diff has something to diff against.
- **Return schema** — a pointer to the worker return contract below; its final message must follow it exactly.

## Worker Return

Every dispatched worker's final message must include:

- **status** — `done` | `partial` | `blocked`. Never claim `done` without satisfying done_when.
- **Files changed** — the full list, matching the work packet's owned-files scope.
- **Diff summary** — what actually changed, in prose, not just a file list.
- **Commands and results** — every verification command it ran, with the actual output/exit status.
- **Assumptions** — anything it inferred rather than was told.
- **Unresolved risks** — anything left uncertain, deferred, or worth a second look.
- **Current SHA** — the state after its change, so the read-the-diff step is exact.

## Acceptance Gate

The dispatching agent never accepts `status: done` at face value: it reads the returned diff against Base SHA and reruns the Verification commands itself before treating the item as closed. A worker that reports `done` without a passing verification command is rejected and re-dispatched, not trusted.
