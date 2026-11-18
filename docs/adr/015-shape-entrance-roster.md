# ADR-015 — Shape entrance roster

Status: accepted · 2026-11-18

## Decision

Shape has ten entrances: `setup`, `idea`, `elicit`, `mockup`, `probe`, `dogfood`,
`task`, `status`, `wrap` and `tidy`. Converging splits by medium: elicit by asking,
mockup by showing, probe by measuring. `setup` only connects a project to its
workspace. `status` reconstructs live work from original records and fresh code
evidence, verifying done-ness against code and Git rather than a board's claims; a
plain status read is read-only and changes priorities only on explicit request.
`wrap` saves progress into the original tasks. `tidy` cleans records.

## Evidence and alternatives

- An environment-scaffolding `setup` was retired; setup returned with a
  workspace-only role.
- `align`, `park` and `catchup` were retired; status and wrap absorbed their jobs.
  Aliases or an automatic session cursor for them were rejected.
- Trusting a plan board's own done claims was rejected: boards drift from code.
- Keeping low-use verbs once they crowded the roster was rejected.
