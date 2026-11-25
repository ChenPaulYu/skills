# ADR-014 — Workspace records

Status: trial · 2026-11-18 (opt-in pilot on `experiment/workspace-graph`)

## Decision

Project working records live in an explicitly located home repo, never assumed to be
the code checkout. `project.md` is the only project entry: context, repository
locators and user-chosen priorities. Tasks own progress, verification, blockers and
the next action. Typed links connect idea, thought, mockup, probe, task and legacy
plan, with no mandatory pipeline. Records live in `ideas/`, `thoughts/`, `tasks/`,
`mockups/<topic>/` and `probes/<topic>/`; legacy `plans/` stay readable. The shared
interface (`plugins/shape/references/record-interface.md` and
`workspace-records.md`) owns frontmatter, statuses, the opening conclusion and the
derived Relations table. Search for an existing owner before creating one; resolve
the home mapping before every write; keep retained artifacts with their records.
Thoughts hold the current choice and its reasons, not cleanup history. Legacy imports
are `unverified` until checked.

The shared `development-artifacts.md` owns how to select a minimal useful artifact set
and verify preservation. The selected home's policy owns allowed formats, storage and
local exceptions; consumers follow both without duplicating the selection procedure.

`shape:status` owns a read-only reader bundled into consumers; its HTML view and
offline graph export consume the same result and never edit records.

## Evidence and alternatives

- A second `index.md`, `state.md` or handoff file was rejected: it competes with the
  task as progress owner and drifts.
- Flat `records/` plus `artifacts/` folders were rejected for typed folders.
- A relation skill, folder or second graph store was rejected; links live in
  frontmatter.
- Silently substituting another store when the home is unavailable was rejected; it
  is a reported blocker.
- A second parser or cleanup policy in the view was rejected.
- Repeating artifact-selection procedures in each home's storage policy was rejected:
  shared methods own the judgment steps, while home policies constrain where and how to save.
- Treating imported legacy records as completed work was rejected.
- Pilot limits: cross-machine daily handoff and Claude Code execution are not yet
  verified.
