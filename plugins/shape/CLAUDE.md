# shape — plugin guide

> For editing this plugin. To run a skill, read its `SKILL.md`; each is self-contained.
> Repo-wide rules live in the root [`CLAUDE.md`](CLAUDE.md).

Shape turns intent into findable decisions, evidence and task-owned work. Nav owns
implementation, code health and landing.

## Ten entrances ([ADR-015](docs/adr/015-shape-entrance-roster.md))

- `setup` connects a code repository to its workspace; no environment scaffolding or migration.
- `idea` saves a spark without authorizing implementation.
- `elicit` clarifies an undecided question by asking.
- `mockup` converges a choice by showing an interactive artifact.
- `probe` tests an undecided claim by measuring.
- `dogfood` uses built behavior to find reproducible friction.
- `task` turns decided work into deliverables with acceptance checks.
- `status` reconstructs live work; sets priorities only on explicit request.
- `wrap` saves progress, reasons and next actions into the original tasks.
- `tidy` retires stale or redundant records while keeping useful reasons and recovery.

Retired entrances (align, park, catchup, init, migrate, build, doctor) stay out of live
instructions; their history is in the ADRs.

## Record ownership ([ADR-014](docs/adr/014-workspace-records.md))

- `references/workspace-records.md` owns location, typed layout and lifecycle;
  `references/record-interface.md` owns metadata, dates, Relations and the opening
  conclusion. The shared-resource builder bundles both into every consumer.
- `project.md` owns context, repository mappings and priorities; the original task owns goals,
  deliverables, acceptance, progress, verification and next action. No duplicate board,
  `index.md`, `state.md` or handoff.
- The status scripts own the reader, graph export and view. Views are read-only snapshots;
  `review` candidates (unverified, unlinked, superseded) are signals, never deletion verdicts.
- Legacy boards and handoffs are read tolerantly with the evidence tier reported; no ordinary
  read or save migrates or discards old data. `tidy` owns the manual migration ledger.
- The home repo keeps records and retained artifacts together; product code and runtime
  fixtures stay in code repos (`references/development-artifacts.md`).

## Seams

Shape converges intent and defines verifiable tasks; `nav:do` implements and refactors, and also
answers approach-first requests
([ADR-016](docs/adr/016-task-owned-planning-and-direct-execution.md)). `wrap` saves the touched
task and `status` resumes the next round. No skill calls another; Shape has no whole-turn
`model: sonnet` override. Probe and dogfood still name live-provider cost before spending it.

Artifacts lead with a short conclusion and visible Relations. Read the user's UI preferences
and project design canon before UI work; use real data, activate artifacts with a URL, and
never fake a graph, completion percentage or selected variant.

## browser-verify slot ([ADR-008](docs/adr/008-verification-and-spend-gates.md))

A shared, pluggable capability, opt-in for `mockup` (only when there is a concrete reason to
distrust a render) and used by `dogfood`.

- Name the capability and its contract (open → act → capture at decision points → compare →
  **close**), not a tool. Defaults: `agent-browser` for web, `agent-desktop` for native apps; a
  project may bind another helper in its own guide. If none is available, report the check as
  unverified.
- Delegate the pass to [`agents/browser-verifier.md`](plugins/shape/agents/browser-verifier.md)
  (sonnet) so screenshots stay out of the main context; it returns
  `PASS | DRIFT | BLOCKED | MISSING-TOOL` with paths. Its last step is always `close`.
- Screenshots are evidence on disk, referenced by path, never per-step progress notes.
- Traps (session isolation, state-over-text asserts, audio, canvas, React+Vite, teardown):
  [`references/browser-verify-gotchas.md`](plugins/shape/references/browser-verify-gotchas.md).
