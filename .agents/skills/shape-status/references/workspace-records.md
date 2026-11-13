<!-- GENERATED from plugins/shape/references/workspace-records.md by scripts/build-manifests.mjs; do not hand-edit. -->

# Workspace records — opt-in pilot

Use linked Markdown records as a project's working memory. A task owns its progress,
verification, blockers, reasons, and next action. A project supplies context and curated
priorities; its current state is read from those tasks, not copied into a second board.

## Locate before reading or writing

Use an explicit workspace/project path from the user or repository instructions. A
home repo can hold `workspace/<project>/project.md`, `records/`, and optional `artifacts/`.
Do not assume the code checkout contains its records. Resolve code repositories from
the project's explicit mappings; report missing/unavailable mappings, never substitute
the home repo's HEAD. Machine-local paths are locators, not portable identity.

Report the evidence tier: **standard records**, **non-standard readable records**, or
**absent**. Consume readable prose without silently rewriting it into the pilot schema.
Without a workspace mapping, read existing blueprints/plan/TODO/handoff documents and
Git as fallback; report that fallback. Ask for a destination only when an authorized
write needs one that cannot be inferred. Reading status does not scaffold a workspace.

## Small record convention

For the common frontmatter, dates, visible Relations projection, and opening/detail
layout, read `references/record-interface.md` when creating, updating or presenting
work records. This file owns workspace location, type/status and lifecycle; that
reference owns the shared document interface. Existing readable records remain valid.

`project.md` has YAML frontmatter `id`, `title`, optional `repositories` (alias → path),
and optional `priorities` (record IDs in user-chosen order). Its prose owns project
purpose, constraints, and context. Keep per-task progress out of it.

Each independently reusable item in `records/` has YAML frontmatter:

```yaml
---
id: example-task
type: task
title: Implement the selected approach
status: paused
repo: app
links:
  - relation: implements
    target: example-thought
---
```

IDs are stable within a project; links target IDs, never filename positions. Relations
describe the actual connection (`extends`, `tests`, `implements`, `supported_by`,
`supersedes`, `blocked_by`), without imposing a mandatory pipeline. Backlinks, graphs,
and active views derive from these records; no separate authoritative graph file.
Use readable titles and filenames so an idea can be found by project, topic, or reason.
Search body text as well as titles before creating another record.

| Type | Pilot statuses | Body carries |
|---|---|---|
| idea | saved, exploring, closed | Original spark, why saved, conditions for revisiting |
| thought | draft, adopted, shelved, superseded | Decision/question, reasons, alternatives |
| mockup | draft, selected, shelved, superseded | What was compared, pick/reason, artifact locator |
| probe | planned, active, concluded | Claim, method, evidence, verdict including inconclusive |
| task | planned, active, paused, blocked, done, cancelled | Goal, progress, verification, blockers/reasons, next action |
| plan | draft, active, completed, superseded | Implementation approach, critical files, checks |

These are pilot conventions, not a requirement to normalize existing documents. An
unknown status is something to report, not permission to discard the record. Keep a
small piece of work together; split only when a part needs independent reuse, comparison,
or execution. Do not manufacture six documents to satisfy the six types.

## Updating and closing

Re-read the original before editing, preserve unrelated tasks and live reasons, and
show the intended delta. Existing save/implementation authority covers its record
update. Conflicting evidence stays visible until resolved. A task is done only when
its completion criteria are met; distinguish implementation from verified behavior.

Completing a task may complete its plan, but does not expire an adopted thought.
A concluded probe may remain inconclusive and authorize no task. A saved idea does
not imply approved work. Keep deferred and rejected distinct. Superseded decisions
link their successors; preserve useful rejected alternatives and evidence locators.
Tidy owns consolidation/retirement; status and wrap do not delete history or
move files into archives. Closed items disappear from active views through status.

When a task closes, inspect its linked mockup/probe/plan records and state which
artifacts remain live or are retirement candidates. Completion is a review signal,
not an automatic delete: preserve pending choices, reasons and recovery before a
separately authorized tidy. Do not require another skill invocation to mark a task done.

Follow the selected storage repo's policy. A private home repo may explicitly commit
text working records while a public code repo excludes them. Media locators do not
back up media bytes. No bulk migration, original deletion, or new binary retention
policy follows from enabling the pilot.
