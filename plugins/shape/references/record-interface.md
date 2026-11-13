# Work-record interface — metadata, conclusion, relations, detail

Use the same reading interface for idea, thought, mockup, probe, task, and plan.
Keep the record's established location, type/status vocabulary, and language.
This is a writing convention, not permission to retrofit a legacy project.

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
verification/limits and next action; a plan needs approach and checks. An idea can
remain just a spark and why it was saved. Do not require six documents for one item.

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

The visible Relations table is a **derived projection**, marked as such. Resolve
target titles and relative Markdown paths from their actual records. When writing
or changing a record, refresh the projection from `links`; edit the canonical edges,
not the table independently. Use an available renderer when provided, otherwise
derive it with ordinary file tools. This protocol does not install a formatter or
claim automatic drift detection. If the two disagree, report the discrepancy and
use frontmatter as the edge source; a read-only request does not silently repair it.

```markdown
---
id: example-plan
type: plan
title: Implement the selected approach
status: active
created: 2026-11-13
updated: 2026-11-13
links:
  - relation: implements
    target: example-task
---
# Implement the selected approach

> Ground the selected approach in the codebase. Verification is still pending.
> Next: run the scoped acceptance workflow.

## Relations
<!-- relations: derived from frontmatter.links -->
| Relation | Record |
|---|---|
| implements | `example-task` — resolve its actual title/path |
<!-- /relations -->

## Approach
Implementation details and checks follow the opening interface.
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

`project.md` owns purpose, constraints, repository mappings and user-chosen priorities.
It can use the same compact metadata/summary discipline, without inventing a single
task status for the whole project. Its current **state** is a read: task-owned progress,
relevant decisions/evidence, and actual mapped Git context. Render that view on demand;
do not maintain a second `state.md`, `plan.md`, dashboard snapshot or handoff as a
competing progress owner. Absent repositories and unknown facts remain explicit.
