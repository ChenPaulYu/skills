<!-- GENERATED from plugins/shape/references/workspace-records.md by scripts/build-manifests.mjs; do not hand-edit. -->

# Workspace records — opt-in pilot

## Retention before format

Apply `references/saving.md` before creating a record. The detailed convention below
applies only after there is a reason to save. Keep existing records readable in place.


Use linked Markdown records as a project's working memory. A task owns its progress,
verification, blockers, reasons, and next action. A project supplies context and curated
priorities; its current state is read from those tasks, not copied into a second board.

## Locate before reading or writing

Use an explicit workspace/project path from the user or repository instructions. A
home repo holds `workspace/<project>/project.md` as the sole entry and work in typed
folders: `ideas/`, `thoughts/`, `tasks/`, `mockups/`, and `probes/`. An idea asks
whether to do something; a thought holds how to see something (a position that may
still be a draft, and acts as a decision once adopted). The `plans/` type is retired:
read a leftover plan as legacy evidence and fold its live content into the owning task.
Do not assume the code checkout contains its records. Resolve code repositories from
the project's explicit mappings; report missing/unavailable mappings, never substitute
the home repo's HEAD. Machine-local paths are locators, not portable identity.

Resolve the existing home before choosing any project-record or artifact destination:
use the user's explicit selection, then the local connection registry. Its config is
`WORKSPACE_CONFIG` or `~/.config/agent-workspace/config.json`; `default_home` selects
an alias in `homes`. The bundled `scripts/workspace connection resolve <checkout>`
returns the matching Home/project and repository alias. Exact local bindings and Git
worktree identity select a project; a remote or basename alone does not select a clone.
For shared checkouts, supply `--project PROJECT` and, when needed, `--repo ALIAS`
from the user's topic or existing task. An ambiguous checkout has no implicit project.
Use a selected Home's existing adapter or legacy pointer only when no generic registry
is configured. An invalid configured selection never falls back. Read the home's
instructions, storage policy and project entry.
A configured but unavailable home is a reported blocker for saving there, not permission
to silently create another store in the code repo or scratch directory. Without an
existing mapping, report that tier and follow the established legacy convention;
ordinary saves do not register or migrate a project.

For a connected project, its selected home workspace owns both working records and
their retained mockups, probe results and supporting artifacts. Keep artifacts beside
the owning mockup/probe card; code and product runtime fixtures remain in the code
repository. Apply `references/development-artifacts.md` for retention, dependencies
and recovery. External reference materials may stay at their source; an external
locator alone does not preserve an agent-created artifact the user asked to save.

Report the evidence tier: **standard records**, **non-standard readable records**, or
**absent**. Consume readable prose without silently rewriting it into the pilot schema.
Without a workspace mapping, read existing blueprints/plan/TODO/handoff documents and
Git as fallback; report that fallback. Ask for a destination only when an authorized
write needs one that cannot be inferred. Reading status does not scaffold a workspace.

## Task-owned delivery

For new workspace work, one task owns the goal, scope, deliverables with acceptance
checks, progress, verification, blockers and next action. Shape-add authors that
record. Nav-do grounds implementation in code and updates the same record as it
verifies deliverables. Shape-add saves progress to the same owner. Established
engineering notes and embedded plans remain readable evidence.

Create or reuse a task when asked to record decided work or implement work that
needs durable tracking. Search existing tasks and linked ideas, thoughts and mockups
before creating another owner. Use `planned` until authorized execution begins.
A saved idea, positive mockup reaction or read-only status request alone creates
no task. A one-off fix can proceed without a new tracking document.

A leftover plan keeps its ID, path, status and links until it is folded into its
task. Folding is separately scoped work: verify unique content, inbound links and
recovery before moving or retiring anything.
Without a connected workspace, follow the project's existing planning convention.

## First-time connection

Explicit project-workspace registration belongs to `shape-tend`. It resolves the
selected home and code repository, reuses existing identity, creates only a needed
project.md and machine-local binding, then verifies with the shared reader.
Ordinary status reads and record saves do not silently enroll or migrate projects.
Legacy migration remains a separate, explicitly scoped operation.

## Small record convention

For the common frontmatter, dates, visible Relations projection, and opening/detail
layout, read `references/record-interface.md` when creating, updating or presenting
work records. This file owns workspace location, type/status and lifecycle; that
reference owns the shared document interface. Existing readable records remain valid.

`project.md` has YAML frontmatter `id`, `title`, optional stable `uuid`,
optional `repositories` (alias → `{remote: credential-free-hosted-remote}` for new
hosted connections, `{local_uuid: UUID, anchor: EXISTING_COMMIT}` for an explicitly
local-only Git repository, or a legacy path relative to Home),
and optional `priorities` (record IDs in user-chosen order). Its prose owns project
purpose, constraints, context, and navigation to existing work folders. Keep per-task
progress out of it. Do not add a competing `index.md` or `state.md`; render current
state from the original work records and actual Git context when requested.

## Development startup

Before editing code or resuming implementation, sync the selected Home and check the
actual code checkout against its remote, relevant GitHub PRs and CI. Use the bundled
`scripts/workspace connection start <checkout>` for registered workspace-v1 projects.
It fetches the Home's configured upstream, fast-forwards it only when safe, then reads
the current project/tasks. It fetches code without moving its branch, reports upstream
ahead/behind, and queries GitHub for open PRs and CI at both the current revision and
the default branch revision. Output is evidence, not permission to ship or proof CI passed.

Inspect the reported SHAs, dirty changes, related PR and run conclusions before choosing
the work. A behind code branch needs an explicit safe update or a grounded reason to
work from that revision. Preserve local edits; never automatically stash, reset, merge
divergent histories, rebase or force-push. Missing upstream, unavailable GitHub access,
divergence and unpublished Home commits are reported blockers for relying on freshness.
Resolve the affected requirement before dependent edits. CI failure/pending/absence
must be stated distinctly, including when no run exists at the current SHA. The query
returns at most 100 open PRs and 20 runs per SHA; narrow it separately if truncated.
An explicitly registered local-only repository has no remote/CI freshness claim;
startup still synchronizes Home and reads its mapped local Git state.

For existing registrations without UUIDs, another Home layout, or an unconnected repo,
perform the same checks directly: sync the selected Home by fast-forward only, fetch the
correct code remote, inspect the current branch/upstream and check relevant GitHub PR/CI
revisions. Read updated work records afterward. Read-only status requests do not fetch,
pull or create configuration. Registration, migration and publication remain separate.

Each independently reusable item has YAML frontmatter. Store simple records as
`ideas/<topic>.md`, `thoughts/<topic>.md`, or `tasks/<topic>.md`. A task that keeps
evidence or artifacts puts them in a sibling folder `tasks/<topic>/` and links them
from the task.
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
| idea | saved, exploring, closed | Whether to do something: original spark, why saved, conditions for revisiting |
| thought | draft, adopted, shelved, superseded | How to see something: position or question, reasons, alternatives |
| mockup | draft, selected, shelved, superseded | What was compared, pick/reason, artifact locator |
| probe | planned, active, concluded | Claim, method, evidence, verdict including inconclusive |
| task | planned, active, paused, blocked, done, cancelled | Goal, scope, deliverables paired with acceptance checks, progress, verification, blockers/reasons, next action |
| plan (retired, read only) | draft, active, completed, superseded | Leftover implementation approach; fold live content into its task, then remove |

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

## Records in a retired shape

When the reader's `check` lists `migrations`, or a rule change leaves existing records
in an old shape, list the affected records and what migrating each would do, then ask
the user whether to migrate now. Migrate only on a yes, in the same round, and re-run
`check`; otherwise report what remains. Never migrate as a side effect of a read or save.

## Updating and closing

Re-read the original before editing, preserve unrelated tasks and live reasons, and
show the intended delta. Existing save/implementation authority covers its record
update. Conflicting evidence stays visible until resolved. A task is done only when
its completion criteria are met; distinguish implementation from verified behavior.

A task closes when its required outcomes are verified. For an experience or design
outcome, use the relevant human's firsthand judgment of whether it solves the
problem, and record the exact scope accepted. Automated checks establish whether
the agreed observable behavior was delivered and continues to work. Track those
checks separately from the human verdict.
When a check fails or has not run, name the concrete product problem it shows or the
agreed acceptance or release gate it affects. If the connection is unclear, record
the engineering uncertainty without reopening the accepted issue or making the user
repeat acceptance. Closing work does not expire an adopted thought.
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
