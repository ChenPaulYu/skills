# ADR-006 — Skill hand-offs and authorized scope

Status: accepted · 2026-11-18

## Decision

Skills never call each other; the session routes and reuses outputs
(`docs/out-of-scope/skills-dont-invoke-each-other.md`). The verb is the only door for
its deliverable: fire it instead of hand-rolling the artifact. Continuation follows
the user's authorization: analysis and review are read-only, a plan-only request
stops at the plan, and authorized work proceeds without a generic confirmation menu.
Ask only for a consequential unresolved choice, missing authority, material cost or
an external or destructive effect. Publishing and speaking for the user always need
explicit authorization.

## Evidence and alternatives

- Auto-launching the next skill or a sub-agent without asking was rejected.
- Fixed next-action menus and numeric confidence gates were rejected: they add a
  turn without changing the outcome.
- A hook phrase-matching build language after a choice was rejected as brittle across
  Chinese and English.
- Direct skill-to-skill calls were rejected; see the out-of-scope entry.
