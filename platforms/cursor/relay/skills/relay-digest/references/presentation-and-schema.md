# Presentation format and schema — full detail

Full detail for `digest`'s presentation step and output shape. See `SKILL.md`'s Presentation & schema section for the one-line summary.

## Present

Group obligations by `DECIDE/ACT`, `REVIEW`, and `SETTLE`. For each item show object type, title, URL, why it needs the viewer, and the native action that completes this round. Any linked PR or Issue remains a separate obligation. A current `Request changes` belongs to the PR author; pushing a new revision hands the round back to the reviewer. Collapse duplicate signals to one item; self-report a `malformed` entry rather than presenting it as ordinary. Then present notices, separately labeled. Then, if present, self-report `commentScanTruncated`.

## Schema

`schemaVersion: 4`. Top-level shape: `{ schemaVersion, source, repository, viewer, blocked, blockers, obligations, notices, commentScanTruncated?, caveat?, authenticatedViewer? }`. An obligation entry may additionally carry `malformed: ['conflicting-stage-labels']` when an Issue's stage labels conflict. `commentScanTruncated`, `caveat`, and `authenticatedViewer` are present only when they apply. `notices` is always present (possibly empty) and is never merged into `obligations`.
