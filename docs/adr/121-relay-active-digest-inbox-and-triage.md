# ADR 121 — Relay digest becomes an inbox preflight

**Status**: accepted
**Date**: 2026-08-20
**Refines**: ADR-120

## Context

Relay's reducer already reconstructs current obligations from native GitHub state, and the
workspace can deliver overdue comments on a cadence. That still leaves a usability gap: a
standing FYI report is easy to miss, and a manually written roll-up can become stale or omit a
new Issue. A reminder can arrive without the next agent session treating the open work as its
first responsibility.

The workspace also needs one generated triage Issue when repeated reminders have not produced a
native state change. If that wrapper is treated as an ordinary assigned Issue, the digest counts
the wrapper and all of its linked source Issues, duplicating the same responsibility and making
the inbox look larger each time it escalates.

## Decision

### Digest starts with an inbox preflight

When a Relay workspace is present, a new agent session runs `relay:digest` before unrelated
work. The presentation leads with:

- open source obligation count;
- overdue source obligation count;
- the oldest overdue source Issue;
- the first native action to take;
- the number of generated triage wrappers.

"Seen" is not a completion event. The first action must be a source-native reply, close,
handoff, or explicit blocker.

### Generated triage wrappers are a separate native tier

An open Issue carrying the native `relay-triage` label is a generated wrapper, not a source
obligation. The reducer returns an assigned wrapper in `triage` with action
`process-linked-obligations`, excludes it from `obligations`, and excludes it from notice scans.
The wrapper's body is workspace delivery data; the reducer never parses it to recover source
responsibility. Linked source Issues remain ordinary obligations and remain authoritative.

### Schema 6 is additive

Schema 6 adds `inbox` and `triage` while preserving `findings`, `obligations`, `notices`,
blockers, and entry-level lifecycle fields. Blocked and unresolved-viewer results carry empty
`inbox` and `triage` fields so consumers do not need a second shape for degraded runs.

### Delivery stays outside the reducer

The reducer remains mechanical and read-only. A workspace scheduler may use overdue findings,
the inbox summary, and triage entries to post source reminders or create/update one generated
wrapper. It may not auto-close or reassign source Issues, and it may not infer completion from
comments or the wrapper body.

## Consequences

- A new session sees the actionable queue before starting fresh work.
- The canonical report can remain FYI without pretending to be a receipt.
- A generated wrapper can escalate a neglected queue without recursively inflating it.
- Workspace delivery owns cadence and mutation; digest owns only deterministic current state.
- Consumers must accept schema 6, including `inbox` and `triage`, while preserving older source
  obligation semantics.
