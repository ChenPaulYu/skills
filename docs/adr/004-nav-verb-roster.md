# ADR-004 — Nav verb roster and boundaries

Status: accepted · 2026-11-18

## Decision

Nav has one verb per job: `audit` (health, feasibility, or deep per-domain fan-out),
`refactor` (behavior-preserving restructure, syncing affected headers in the same
change), `sync` (headers and reader documents), `plan` (a requested engineering
approach), `do` (implement decided behavior and verify it), `compose` (author or
restructure prose) and `ship` (commit, push, merge, clean up). Audit's deep mode uses
read-only sub-agents per domain plus a completeness critic; it is suggested, never
auto-run.

## Evidence and alternatives

- A separate `spec` plugin for planning was rejected; planning stays a nav verb.
- No implementation verb (leaning on global instructions) was rejected: the
  inject-and-check discipline kept being skipped until it had a door.
- A `doctor` orchestrator and a standalone integration verb were rejected; their
  checks live in audit modes.
- The Workflow tool for audit fan-out was rejected in favor of plain sub-agents.
- Leaving header updates to a later command was rejected; refactor syncs them inline.
