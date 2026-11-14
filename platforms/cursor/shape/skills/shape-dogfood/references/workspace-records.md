<!-- GENERATED from ../../references/workspace-records.md by scripts/build-manifests.mjs; do not hand-edit. -->

# Workspace records — opt-in pilot

Use linked Markdown records as a project's working memory. A task owns its progress,
verification, blockers, reasons, and next action. A project supplies context and curated
priorities; its current state is read from those tasks, not copied into a second board.

## Locate before reading or writing

Use an explicit workspace/project path from the user or repository instructions. A
home repo holds `workspace/<project>/project.md` as the sole entry and work in typed
folders: `ideas/`, `thoughts/`, `tasks/`, `plans/`, `mockups/`, and `probes/`.
Do not assume the code checkout contains its records. Resolve code repositories from
the project's explicit mappings; report missing/unavailable mappings, never substitute
the home repo's HEAD. Machine-local paths are locators, not portable identity.

Report the evidence tier: **standard records**, **non-standard readable records**, or
**absent**. Consume readable prose without silently rewriting it into the pilot schema.
Without a workspace mapping, read existing blueprints/plan/TODO/handoff documents and
Git as fallback; report that fallback. Ask for a destination only when an authorized
write needs one that cannot be inferred. Reading status does not scaffold a workspace.

## First-time connection

Explicit project-workspace registration belongs to `shape-setup`. It resolves the
selected home and code repository, reuses existing identity, creates only a needed
project.md and portable code-side pointer, then verifies with the shared reader.
Ordinary status reads and record saves do not silently enroll or migrate projects.
Legacy migration remains a separate, explicitly scoped operation.

## Small record convention

For the common frontmatter, dates, visible Relations projection, and opening/detail
layout, read `references/record-interface.md` when creating, updating or presenting
work records. This file owns workspace location, type/status and lifecycle; that
reference owns the shared document interface. Existing readable records remain valid.

`project.md` has YAML frontmatter `id`, `title`, optional `repositories` (alias → path),
and optional `priorities` (record IDs in user-chosen order). Its prose owns project
purpose, constraints, context, and navigation to existing work folders. Keep per-task
progress out of it. Do not add a competing `index.md` or `state.md`; render current
state from the original work records and actual Git context when requested.

Each independently reusable item has YAML frontmatter. Store simple records as
`ideas/<topic>.md`, `thoughts/<topic>.md`, `tasks/<topic>.md`, or `plans/<topic>.md`.
A mockup decision lives in `mockups/<topic>/mockup.md` beside its HTML variants;
a probe lives in `probes/<topic>/probe.md` beside results and supporting evidence.
Do not mistake a supporting README, results.md, HTML or CSV for another record.
Create only the folders actually needed. No extra `records/` or `artifacts/`
container or promotion/move ceremony is required. Worthwhile references can stay
at their original location and be linked directly.

The former flat `records/*.md` layout remains a readable legacy shape; a reader
may consume both layouts during an authorized transition, reporting conflicting
IDs or folder/type mismatches instead of silently normalizing them. A physical
move preserves IDs, status and substantive dates and repairs relative links.

Example frontmatter:

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

All record types additionally accept `unverified` during legacy import when current
state has not been established. Preserve the source status claim separately and
label its provenance; unverified is neither completion nor a new implementation
commitment. Such an import is not promoted into active work merely by being saved.

These are pilot conventions, not a requirement to normalize existing documents. An
unknown status is something to report, not permission to discard the record. Keep a
small piece of work together; split only when a part needs independent reuse, comparison,
or execution. Do not manufacture six documents to satisfy the six types.

## Observations during ongoing work

Keep multiple debugging symptoms in the original task's `## Observations` section.
Separate what was observed, a cause hypothesis, evidence, and the next check in prose;
an observation is not a verified cause. Consolidate symptoms when evidence supports
one cause. Split a task only when ownership, next action or completion needs to be
independent; a deferred possibility can remain an idea. No additional record kind or
mandatory observation schema is required.

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

When a task closes, inspect its outgoing links and backlinks to relevant
mockup/probe/plan records. For each affected record, state whether it remains live,
meets its own completion criteria, is superseded by an identified successor, or is
a retirement candidate, and why. Apply only status/relation updates supported by
evidence and the authorized scope; do not mark every neighbor complete. An adopted
decision may remain live and an inconclusive probe remains inconclusive. If intent
cannot be established, retain the item and ask the user. Completion is a review
signal, not an automatic delete: preserve pending choices, reasons and recovery
before a separately authorized tidy. Do not require another skill invocation to
mark a task done.

Follow the selected storage repo's policy. A private home repo may explicitly commit
text working records while a public code repo excludes them. Media locators do not
back up media bytes. No bulk migration, original deletion, or new binary retention
policy follows from enabling the pilot.

## Optional read-only helper

Each bundled consumer carries `scripts/workspace`; resolve it inside the loaded skill
package, independent of the working directory. It requires `uv`, Python 3.12 and PyYAML
(the launcher selects these). Pass the home repository root containing workspace/ explicitly:

```sh
sh "<loaded-skill>/scripts/workspace" --root "<home-repo>" projects
sh "<loaded-skill>/scripts/workspace" --root "<home-repo>" status <project>
sh "<loaded-skill>/scripts/workspace" --root "<home-repo>" show <project> <record-id>
sh "<loaded-skill>/scripts/workspace" --root "<home-repo>" graph <project>
sh "<loaded-skill>/scripts/workspace" --root "<home-repo>" review <project>
sh "<loaded-skill>/scripts/workspace" --root "<home-repo>" check
sh "<loaded-skill>/scripts/workspace" --root "<home-repo>" view <project> --output <fresh-html-outside-home>
```

The helper returns JSON records, relations/backlinks, diagnostics and mapped Git context.
It does not write records, choose priorities or establish semantic completion. Only
explicit view export writes a new offline interactive HTML snapshot outside the home
repo. It refuses existing output paths; serve private views on localhost. Export includes
only the selected project by default; `--all-projects` explicitly includes other projects
and their bodies in the same file. The snapshot
embeds selected record bodies and is private wherever those sources are private.
If execution or dependencies are unavailable, read the records manually and report that
fallback; the script is optional. Do not silently switch home roots. Shape status owns
the implementation; other skill bundles are generated, not separately maintained.

`review` supplies the same advisory facts used by the human view: unverified imports,
work without canonical relations, and superseded records. These are review signals,
not expiration or deletion verdicts. A standalone idea is valid; do not invent parent
records to clear a warning. Dates alone never establish staleness. Inspect current
reality, retained reasons, inbound links and recoverability before authorized tidy.
The view starts with current tasks; search, relations, full text and source metadata
are progressively disclosed. It neither edits records nor creates a second board.
