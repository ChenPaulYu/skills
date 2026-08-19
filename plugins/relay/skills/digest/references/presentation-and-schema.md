# Presentation format and schema — full detail

Full detail for `digest`'s presentation step and output shape. See `SKILL.md`'s Presentation & schema section for the one-line summary.

## Present

Lead with blockers and degraded collection. Group obligations by `DECIDE/ACT`, `REVIEW`, and `SETTLE`. For each item show object type, title, URL, why it needs the viewer, the native action that completes this round, and `stageEnteredAt` when known. Any linked PR or Issue remains a separate obligation. Collapse duplicate signals to one item; self-report a `malformed` entry rather than presenting it as ordinary. Then present lifecycle findings with their code and repair target, then notices separately. Self-report `commentScanTruncated`; a lifecycle timeline cap appears as `stage-age-unknown` for its object instead of blocking the run.

## Schema

`schemaVersion: 5`. Top-level shape: `{ schemaVersion, source, repository, viewer, collectedAt?, blocked, blockers, findings, obligations, notices, commentScanTruncated?, caveat?, authenticatedViewer? }`.

- `findings` is always present and never merged into `obligations`. Each entry carries `id`, `kind: 'FINDING'`, `code`, and the standard object reference. Depending on `code`, it may also carry `stage`, `assignee`/`assignees`, `stageEnteredAt`, `ageDays`, and `thresholdDays`.
- An Issue obligation may carry `stageEnteredAt: <ISO timestamp> | null`; legacy/offline primitives that did not collect lifecycle events omit it. It may still carry schema-4's `malformed: ['conflicting-stage-labels']` for compatibility.
- `overdue-stage` is emitted only when the input includes `collectedAt` and an explicit policy object shaped as `{ overdueAfterDays: { default?: number, '<stage>': number } }`. `--policy FILE` supplies that object to CLI runs.
- `commentScanTruncated`, `caveat`, and `authenticatedViewer` are present only when they apply. `notices` is always present and remains non-binding.
