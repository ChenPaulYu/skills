<!-- GENERATED from plugins/shape/references/record-interface.md by scripts/build-manifests.mjs; do not hand-edit. -->

# Work-record interface — metadata, conclusion, relations, detail

## Retention before format

Apply `references/saving.md` before creating a record. The detailed convention below
applies only after there is a reason to save. Keep existing records readable in place.


Use the same reading interface for idea, thought, doc, mockup, probe and task; read a
leftover retired plan the same way.
Keep the record's established location, type/status vocabulary, and language.
This is a writing convention, not permission to retrofit a legacy project.
When an explicit project workspace is selected, read `references/workspace-records.md`
for its typed locations and colocated artifacts; otherwise use the existing project convention.

## Before drafting or updating: choose the owner

Apply this check on the first write and every substantive update, not only during tidy.
Decide what the record must help the next reader understand or do, then reuse the owner
for that purpose. Retained project knowledge and reusable settled conclusions belong
in an existing/new doc; a thought holds the working exploration. Link the durable owner
from the idea/mockup rather than burying it in an accumulated exploration log. Save
within the user's existing scope; a conclusion creates no automatic task or document.

Keep a working thought focused on its question, alternatives, evidence and exit condition.
Keep a doc focused on its retained explanation, operative reasons, limitations and sources;
it owns knowledge rather than a task's progress or acceptance checklist.
An artifact-by-artifact retirement catalog is cleanup history,
not a reason to enlarge a doc. Keep operative principles in their durable owner
and deferred work in an appropriate existing idea/task or retained comparison; do not turn
a deferral into a rejection or an implementation commitment.

Document-count preferences guide consolidation, but do not justify mixing unrelated
decisions, work and cleanup logs into one record. Before finishing the write, check that
each section serves this record's purpose; route unrelated substance to its actual owner
and link it rather than adding another catch-all section. Historical-content removal
still follows the preservation checks below; this writing check is not deletion authority.

## One glance, then deeper

1. **Frontmatter:** stable `id`, `type`, `title`, `status`, `created`, `updated`,
   and canonical `links`. A list view derives title/status/updated and relevant
   work from these fields; do not maintain a separate hand-copied inventory.
2. **Opening conclusion:** a title and up to three short lines explaining what
   this item is for, its current conclusion/open question, and the next action
   when one exists. Do not make a reader traverse evidence to find the point.
3. **Visible `## Relations`:** show actual typed links before long detail. Then
   disclose reasons, candidates, implementation detail, artifact links, and evidence
   only as needed for this record type. Omit empty ceremonial sections.

When a linked doc (or an unmigrated legacy thought) owns the accepted decision, the mockup card points
to that decision instead of maintaining a parallel canonical explanation. It still
owns comparison-specific candidates, open choices and artifact locators.

The title may be rendered from frontmatter. A short conclusion is prose owned by
the record, not a second project-wide progress board. A mockup needs its question,
pick/open choice, artifacts and retirement conditions; a task needs progress,
deliverables paired with acceptance checks, verification/limits and next action.
Existing engineering notes keep their established interface. An idea can be a short
description of the spark and why it was saved. Do not require six documents for one item.

When creating a work card, write one checkable condition for when it can leave
active use and what happens then (close, consolidate, supersede, or retire the
comparison). Use an existing acceptance, decision, revisit, or retirement sentence
when it already answers both questions. For a task, verified required outcomes close
the task. For an idea, name the observation or decision that resolves whether to
pursue it. A mockup's retirement depends on its role:

- A selection-only comparison may retire once its decision and rationale have a
  durable owner and its original materials are no longer needed.
- An implementation reference stays with its owning task until the relevant
  implementation has been verified against it. This is the default for selected UI
  appearance and interaction designs: choosing the design does not finish the
  mockup's job as a reference.

Apply `references/development-artifacts.md` and the user's retention choices to
the actual artifacts. A probe can conclude when the agreed check yields a recorded
verdict, including an inconclusive one. A doc stays retained when its task completes
or its status changes; update or supersede its content when knowledge changes.
Legacy adopted thoughts keep their existing protection until explicitly migrated.
Use prose in the existing format. Keep older cards readable when this condition is
absent; during cleanup, establish their disposition from evidence and preserve
reasons, links, and recovery.

A Mockup may carry an optional `preview_url` for its directly openable HTTP(S) view.
The reader exposes that link separately from selecting the record; absent or unsupported
URLs do not produce an open action. Keep the original artifact locator and preservation
information in the card. A localhost preview is a disposable session locator, not a
permanent media backup or a change to the Mockup’s lifecycle status.

## Consolidate a working thought into retained knowledge

During authorized completion/tidy, inspect the original thought and its incoming and
outgoing links. Account for each useful conclusion, operative reason, rejected
alternative that still matters, evidence locator, uncertainty and open action.
Reuse/update the matching doc for independently useful knowledge; keep task-only
context and progress in the owning task. Reading a doc or saving a conclusion does
not authorize implementation or turn a source claim into a verified fact.

For a whole-record move into docs, preserve its ID and source dates, change type/status
to the document convention without inventing acceptance, and repair relative links.
For consolidation into an existing doc, repair inbound frontmatter targets, visible
Relations, Markdown links and project entry links to that owner. Keep a useful source
locator in the destination. Check `show`/backlinks, graph and `check`, and re-read the
destination to verify actual content coverage; a clean graph alone proves no semantic
coverage. Reopen supporting artifacts when their original state is required.

Retire the thought only when the selected content and unresolved work have named
owners, incoming references resolve and recovery is verified, within existing deletion
authority. Leave anything not yet covered in place and report the gap. Draft/closed
status, elapsed time or task completion alone never authorizes removal. Ordinary
cleanup excludes docs; deleting/consolidating a doc requires explicit scope for it.
Legacy thoughts require separately selected migration scope before applying this flow.

## Carry a decision into the next step

Choose the next step from what the current result establishes:

- **Open.** Name the missing judgment or observation. Use Elicit for a choice
  the user can settle, Mockup for a choice that needs to be seen or tried, Probe
  for an empirical question, or Dogfood to inspect friction in a built feature.
  Keep inconclusive results with their evidence and continue only if another
  useful check is warranted. A saved idea can wait for its revisit condition.
- **Decided.** Put independently retained knowledge or rationale in its Doc, or a decided
  change with observable completion in its Task. Reuse the existing owner; keep
  rationale that serves only one task in that task. Send authorized execution to
  Nav with the agreed outcome and acceptance checks.
- **Implemented or checked.** Write observed results, verification limits, and
  the next executable action into the original Task. Wrap leaves it ready for
  Status to resume. When required checks pass, close the Task and review linked
  cards against their own exit conditions. Tidy handles retirement and Ship handles
  landing or publishing within their authorized scope.

Carry the result, the evidence that affects the next check, and the next action
in the existing record or the reply. Link evidence that governs downstream work
in the owning card's Relations, such as the selected mockup that defines acceptance.
Continue already-authorized work. Otherwise suggest one concrete next action when
it adds value. A small answer can stay in chat. Reuse the current scope and record
without requiring a fixed sequence, a chooser, or a separate handoff document.

## Honest dates

- New records use `created` and `updated` in `YYYY-MM-DD`, based on the actual
  creation/edit date. Preserve `created` on subsequent edits.
- Advance `updated` for substantive content, status, relation or decision changes;
  refreshing a derived view or formatting alone does not make the work newer.
- For imported material, use a verified original date or `null` when unknown.
  Label filename-derived dates as inferred in the provenance prose. Do not use
  filesystem mtime or today's import date as a fabricated creation date. An optional
  `imported` date describes the import separately.
- Dates help navigation and freshness checks. Age alone proves neither completion
  nor permission to retire an artifact.

## Relations have one owner

`links` in frontmatter owns edges. Each entry has `relation` and `target`.
Use stable record IDs in an established workspace; in a legacy project without IDs,
use the existing document paths and identify that fallback. Record only actual
connections; an idea need not have a task, and a mockup need not have both a thought
and task. No parents yet means `links: []` and a visible "No relations recorded yet."
Do not create fake parents or infer implementation authority to fill this section.

Before creating a record, search the selected project's existing titles, bodies and
relations for the same question or work. Reuse the same thread; create a separate
record only when it has independent value. On a substantive update, inspect the
record's outgoing links and available backlinks for affected decisions or evidence.
Add or correct only connections supported by that work; an independent idea may
remain unlinked. Missing evidence is not a reason to invent a parent or task.

Choose a relation that states what the connection means: a mockup explores an idea,
a probe tests a claim, a task implements a decision, or a
record is supported by evidence. Read the relation as a sentence from source to
target and verify its direction. Use a generic reference only when that is the real
connection, rather than substituting it for a known purpose. Put a short explanation
in the record when the reason is not apparent from its opening and the linked item.
Store each fact once; derive the reverse lookup instead of adding a mirror edge.

The visible Relations table is a **derived projection**, marked as such. Resolve
target titles and relative Markdown paths from their actual records. When writing
or changing a record, refresh the projection from `links`; edit the canonical edges,
not the table independently. Use an available renderer when provided, otherwise
derive it with ordinary file tools. The reader checks the supported table projection
without formatting or rewriting files. If the two disagree, report the discrepancy and
use frontmatter as the edge source; a read-only request does not silently repair it.

### Verify a retained write

Before reporting a save, migration or consolidation complete, re-read every card
created or changed and run the bundled reader against those exact Home-relative paths:

```sh
scripts/workspace --root <home> check <project> --records workspace/<project>/docs/<topic>.md
```

Pass every changed card after `--records` (multiple paths are supported). This mode
requires metadata and a visible Relations section whose relation/target rows match
`links`; descriptive link labels are allowed. For empty links, write `No relations
recorded yet.` Explicit selection fails on missing/unrecognized paths rather than
silently checking nothing. Fix findings within the authorized write scope and rerun.
Frozen sources and supporting Markdown are artifacts, not work cards; do not reformat
them or select them as cards. Project entries keep their separate index interface.

Without `--records`, format findings appear under `format.findings` as advisory;
old and ad-hoc records remain readable and unchanged. A clean `diagnostics` list alone
does not establish card-format compliance. Report format verification, source/content
coverage and unverified behavior separately. Re-read classification, decisions and
evidence boundaries yourself: the checker cannot prove factual accuracy or completeness.

```markdown
---
id: example-task
type: task
title: Copy a saved excerpt
status: planned
created: 2026-11-18
updated: 2026-11-18
repo: app
links:
  - relation: implements
    target: example-doc
---
# Copy a saved excerpt

> Let readers reuse a saved excerpt with its source reference.
> Next: verify the copy action on a saved excerpt.

## Relations
<!-- relations: derived from frontmatter.links -->
| Relation | Record |
|---|---|
| implements | `example-doc` — resolve its actual title/path |
<!-- /relations -->

## Goal and scope
Copy saved excerpts with their source. Preserve the existing editing flow.

## Deliverables and acceptance
- [ ] Copy the exact saved passage and its source reference.
  - Accept when copying from a saved excerpt preserves its text and opens
    the correct source from the copied link.
- [ ] Recover from a clipboard failure.
  - Accept when the failure is visible, the saved excerpt stays intact,
    and retry succeeds once the clipboard is available.

## Progress and verification
Record actual checks, results and limits as work proceeds.

## Next action
Exercise the copy action on a saved excerpt.
```

Task status describes the whole record. A checkbox tracks one deliverable and is checked
after its stated acceptance is verified. Omit empty optional sections.

Resolve each real target into a clickable relative Markdown link in the projection;
the example above uses an ID placeholder, not a nonexistent file. Filenames are
not record IDs. Existing
supersession/blocked-by/supporting-evidence links stay typed rather than flattened
into a generic "related" pile. Backlinks and graphs derive from canonical edges.

## History and project state

Do not add a mandatory History/changelog section or copy Git logs into records.
Git supplies textual revisions for committed bytes; Git-managed records need no
routine dated backup copies or parallel history archives. The current record retains
reasons, unresolved questions, rejected alternatives and the concrete next action;
a superseded decision names its successor and why it changed. Preserve unique
reasons before replacing a record, without manufacturing a daily checkpoint chain.
Uncommitted/ignored artifacts still need explicit preservation; Git is not their backup.

Completed cleanup details may
leave the active record after exact committed recovery is verified. Put any necessary
non-Git recovery instructions in the existing preservation owner, not another mandatory
archive or a duplicated retirement list. Preserve a useful rejected alternative when it
still informs the current choice, without retaining every retired variant's chronology.

`project.md` is the sole project entry/index. It owns purpose, constraints, repository
mappings, navigation to existing work folders, and user-chosen priorities.
It can use the same compact metadata/summary discipline, without inventing a single
task status for the whole project. Its current **state** is a read: task-owned progress,
relevant decisions/evidence, and actual mapped Git context. Render that view on demand;
do not maintain a second `state.md`, `plan.md`, dashboard snapshot or handoff as a
competing progress owner. Absent repositories and unknown facts remain explicit.
