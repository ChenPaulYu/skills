<!-- GENERATED from plugins/shape/references/record-interface.md by scripts/build-manifests.mjs; do not hand-edit. -->

# Work-record interface — metadata, conclusion, relations, detail

Use the same reading interface for idea, thought, mockup, probe and task, plus
legacy plan records when reading or updating them.
Keep the record's established location, type/status vocabulary, and language.
This is a writing convention, not permission to retrofit a legacy project.
When an explicit project workspace is selected, read `references/workspace-records.md`
for its typed locations and colocated artifacts; otherwise use the existing project convention.

## Before drafting or updating: choose the owner

Apply this check on the first write and every substantive update, not only during tidy.
Decide what the record must help the next reader understand or do, then reuse the owner
for that purpose. A reusable settled conclusion belongs in its decision thought; link
it from the idea/mockup rather than burying it in an accumulated exploration log. Save
within the user's existing scope; a conclusion creates no automatic task or document.

Keep a thought focused on its current decision/question, operative reasons and alternatives
that still explain the choice. An artifact-by-artifact retirement catalog is cleanup history,
not a reason to enlarge a live thought. Keep operative principles in their decision owner
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

When a linked thought already owns the accepted decision, the mockup card points
to that decision instead of maintaining a parallel canonical explanation. It still
owns comparison-specific candidates, open choices and artifact locators.

The title may be rendered from frontmatter. A short conclusion is prose owned by
the record, not a second project-wide progress board. A mockup needs its question,
pick/open choice, artifacts and retirement conditions; a task needs progress,
verification/limits and next action; its optional implementation plan contains
approach and checks. Legacy plans keep their established interface. An idea can
remain just a spark and why it was saved. Do not require six documents for one item.

A Mockup may carry an optional `preview_url` for its directly openable HTTP(S) view.
The reader exposes that link separately from selecting the record; absent or unsupported
URLs do not produce an open action. Keep the original artifact locator and preservation
information in the card. A localhost preview is a disposable session locator, not a
permanent media backup or a change to the Mockup’s lifecycle status.

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
a probe tests a claim, a task implements a decision, a legacy plan implements a task, or a
record is supported by evidence. Read the relation as a sentence from source to
target and verify its direction. Use a generic reference only when that is the real
connection, rather than substituting it for a known purpose. Put a short explanation
in the record when the reason is not apparent from its opening and the linked item.
Store each fact once; derive the reverse lookup instead of adding a mirror edge.

The visible Relations table is a **derived projection**, marked as such. Resolve
target titles and relative Markdown paths from their actual records. When writing
or changing a record, refresh the projection from `links`; edit the canonical edges,
not the table independently. Use an available renderer when provided, otherwise
derive it with ordinary file tools. This protocol does not install a formatter or
claim automatic drift detection. If the two disagree, report the discrepancy and
use frontmatter as the edge source; a read-only request does not silently repair it.

```markdown
---
id: example-task
type: task
title: Implement the selected approach
status: planned
created: 2026-11-13
updated: 2026-11-13
links:
  - relation: implements
    target: example-thought
---
# Implement the selected approach

> Ground the selected approach in the codebase. Verification is still pending.
> Next: run the scoped acceptance workflow.

## Relations
<!-- relations: derived from frontmatter.links -->
| Relation | Record |
|---|---|
| implements | `example-thought` — resolve its actual title/path |
<!-- /relations -->

## Goal and completion criteria
State the intended outcome and how completion will be checked.

## Implementation plan
Include grounded approach and checks only when planning is needed.

## Progress and next action
Keep current evidence, limits and the next executable step here.
```

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
