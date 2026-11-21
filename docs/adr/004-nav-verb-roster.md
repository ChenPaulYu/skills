# ADR-004 — Nav verb roster and boundaries

Status: accepted for pilot · 2026-11-21

## Decision

Nav exposes three verbs. `audit` assesses architecture and feature readiness read-only.
`do` implements decided behavior, handles behavior-preserving refactors, and checks or
updates explanations against code. `ship` verifies the release snapshot and lands authorized
changes. Do loads refactor and explanation procedures only when the request needs them.
Ordinary prose restructuring proceeds directly. Skill authoring guidance stays available in
[the authoring reference](../authoring-failure-modes.md).

Audit's deep mode uses read-only sub-agents per domain. It is suggested and waits for authorization.

## Evidence and alternatives

- A separate `spec` plugin for planning was rejected, and so was a separate `plan` verb
  (removed 2026-11-18): planning happens inside `do` (ADR-016).
- No implementation verb (leaning on global instructions) was rejected: the
  inject-and-check discipline kept being skipped until it had a door.
- A `doctor` orchestrator and a standalone integration verb were rejected; their
  checks live in audit modes.
- The Workflow tool for audit fan-out was rejected in favor of plain sub-agents.
- Leaving header updates to a later command was rejected; update them with the change.

- The [roster experiments](../findings/2026-11-21-nav-roster-ablation.md) support trialing the
  reduced roster. They also showed that the detailed docs procedure protects the check-only
  boundary, and that review of release docs needs an isolated, current release snapshot.
