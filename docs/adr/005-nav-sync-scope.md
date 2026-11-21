# ADR-005 — Nav sync scope

Status: accepted for pilot · 2026-11-21

## Decision

Do owns standalone checks and updates of source headers and reader docs against code.
For changed file roles, update the headers with the implementation or refactor. Ship checks
affected reader guidance in the actual release snapshot before committing. A full README/docs
batch requires the user or repo to request that scope and accounts for every file. Both skills
use the same [docs procedure](../../plugins/nav/references/docs-render.md). Record lifecycle
belongs to Shape Tidy. Ordinary prose authoring proceeds directly.

## Evidence and alternatives

- A separate map skill was rejected after zero direct fires over months.
- A third documentation-check skill or a `shape-sync` was rejected as a split of the
  same factual-freshness job.
- A commit-time documentation gate was rejected for now; revisit if documents are
  routinely forgotten.
- Automatic full sweeps after every edit were rejected as cost without demand.
