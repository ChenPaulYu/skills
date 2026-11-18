# ADR-009 — Retirement policy

Status: accepted · 2026-11-18

## Decision

A model-invoked skill with zero fires across three months of the monthly
`docs/usage/` ledger is demoted to summon-only. Deletion also needs the three-causes
check: never reachable, mis-triggered, or genuinely unclaimed; zero use alone is not
enough. An owner-attested misfit also qualifies, and a capability claimed by a
surviving skill needs no usage proof. A skill must force a check the default model
omits; one that only restates default behavior fails. Re-entry restores from Git
history rather than rebuilding.

## Evidence and alternatives

- Keeping an unused skill summon-only instead of deleting it was rejected when its
  job was claimed elsewhere.
- Relocating an unused skill next to another unused one was rejected as moving the
  problem.
- Rebuilding a retired plugin from scratch on re-entry was rejected; Git keeps it.
- Claiming that demotion removes a description from runtime context was rejected
  until measured.
