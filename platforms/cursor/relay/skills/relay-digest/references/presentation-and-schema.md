# Presentation format and schema — full detail

Full detail for `digest`'s presentation step and output shape. See `SKILL.md`'s Presentation & schema section for the one-line summary.

## Present

Lead with blockers and degraded collection. Then show the `inbox` summary and any `triage` wrappers before grouping source obligations by `DECIDE/ACT`, `REVIEW`, and `SETTLE`. For each source item show object type, title, URL, why it needs the viewer, the native action that completes this round, and `stageEnteredAt` when known. Any linked PR or Issue remains a separate source obligation. Collapse duplicate signals to one item; self-report a `malformed` entry rather than presenting it as ordinary. Then present lifecycle findings with their code and repair target, then notices separately. Self-report `commentScanTruncated`; a lifecycle timeline cap appears as `stage-age-unknown` for its object instead of blocking the run.

## Schema

`schemaVersion: 6`. Top-level shape: `{ schemaVersion, source, repository, viewer, collectedAt?, blocked, blockers, findings, obligations, notices, triage, inbox, commentScanTruncated?, caveat?, authenticatedViewer? }`.

- `findings` is always present and never merged into `obligations`. Each entry carries `id`, `kind: 'FINDING'`, `code`, and the standard object reference. Depending on `code`, it may also carry `stage`, `assignee`/`assignees`, `stageEnteredAt`, `ageDays`, and `thresholdDays`.
- An Issue obligation may carry `stageEnteredAt: <ISO timestamp> | null`; legacy/offline primitives that did not collect lifecycle events omit it. It may still carry schema-4's `malformed: ['conflicting-stage-labels']` for compatibility.
- `overdue-stage` is emitted only when the input includes `collectedAt` and an explicit policy object shaped as `{ overdueAfterDays: { default?: number, '<stage>': number } }`. `--policy FILE` supplies that object to CLI runs.
- `triage` contains open Issues carrying the native `relay-triage` label that are assigned to the viewer. Each entry has the standard object reference, `kind: 'TRIAGE'`, `action: 'process-linked-obligations'`, and `reasons: ['relay-triage-wrapper']`. Triage entries are not duplicated in `obligations` or `notices`.
- `inbox` is always present with `{ openObligationCount, overdueCount, oldestOverdue, firstAction, triageCount }`. Counts include source obligations only. `oldestOverdue` is the viewer's oldest policy-overdue source Issue, or `null`; `firstAction` is the highest-priority source obligation, with overdue assigned Issues first, or `null`.
- `commentScanTruncated`, `caveat`, and `authenticatedViewer` are present only when they apply. `notices` is always present and remains non-binding. Blocked and unresolved-viewer results still carry empty `triage` and `inbox` fields.
