# ADR-005 — Nav sync scope

Status: accepted · 2026-11-18

## Decision

`nav:sync` is the single door for keeping file headers and reader documents (README,
setup, usage, API, architecture) accurate against code. Cadence lives inside the
skill: headers continuously, documents on request, complete batches with every file
accounted for. There is no standing HTML map. Record lifecycle belongs to
`shape:tidy`; authoring belongs to `nav:compose`.

## Evidence and alternatives

- A separate map skill was rejected after zero direct fires over months.
- A third documentation-check skill or a `shape-sync` was rejected as a split of the
  same factual-freshness job.
- A commit-time documentation gate was rejected for now; revisit if documents are
  routinely forgotten.
- Automatic full sweeps after every edit were rejected as cost without demand.
