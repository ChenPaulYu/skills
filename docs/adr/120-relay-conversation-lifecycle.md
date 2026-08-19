# ADR 120 — Relay makes conversation transitions explicit

**Status**: accepted
**Date**: 2026-08-19
**Refines**: ADR-100 and ADR-115
**Partially supersedes**: ADR-100 section 5's mandatory-PR path for Brief and Core recording

## Context

Relay reliably routes a bounded intent into a GitHub object and reliably settles a single-path
round. It does not yet govern what happens when a later comment changes the shape of that object.
A thread can acquire a second question, a new feature, or a different action owner while its
original completion rule and native assignee remain unchanged. Digest then reports the stale
native owner correctly even though the people in the thread believe they already handed the work
over.

The live workflow has a second gap: digest is summoned, so it cannot remind an owner who never
invokes it. ADR-115 deliberately left that job to a daily workspace schedule. The same workflow
also showed that requiring a second pull-request review after two participants already settled an
exact formal-memory change duplicates the consent that GitHub has already recorded.

## Decision

### One object, one independently trackable completion condition

Every new matter is routed on two independent axes:

1. **Object boundary** — if the matter has its own stateable completion condition, it becomes a
   linked follow-up Issue with its own current owner. If it has none, it remains clarification or
   evidence on the current object. If no completion condition can yet be stated, it remains in or
   moves to a Discussion.
2. **Parent disposition** — a parent may settle with an open child when its own completion rule no
   longer depends on that child; otherwise the parent stays open for its own unmet rule. Dependency
   does not erase the child's independent lifecycle.

`reply` owns in-object transitions (`clarify`, `answer`, and same-scope `handoff`). `report` owns
creation of a forked Issue. `settle` owns whole-object disposition. No fifth verb is added.

### The assignee is the current baton, not settlement authority

An action-bearing Issue has one current assignee. The stable settlement seat is the Issue's
acceptor or Discussion host; recorder and PR reviewer are temporary action-specific roles. A
same-scope handoff may be performed only by the current assignee or settlement seat.

| Current stage | Generic handoff | Only legal exit when protected |
|---|---|---|
| plain assigned work | allowed | replace the current assignee |
| `needs-input` | allowed within the same scope | reassign the input owner, or answer normally |
| `awaiting-acceptance` | forbidden | the acceptor disposes or sends back to `needs-input` |
| `awaiting-record` | forbidden | the completed recording chain removes the stage |

Receipt, answer, acceptance, and settlement remain distinct events. The response that supplies
input never accepts itself.

### Digest stays deterministic; the workspace delivers reminders

Reducer schema 5 adds native lifecycle facts and a separate `findings` tier. `stageEnteredAt` is
derived from label and assignment timeline events, never generic object update time. A truncated
timeline degrades that object's age to unknown instead of blocking the whole run.

V1 findings are limited to defects provable from native GitHub fields: conflicting stage labels,
a stage without an assignee, multiple assignees on a staged Issue, policy-gated overdue stages,
and native relationship asymmetry when GitHub exposes both sides reliably. Prose/file health stays
in workspace conformance. Arbitrary comment interpretation never creates an obligation, and no
semantic model runs inside mechanical-tier `digest`.

Reminder thresholds are workspace policy, not reducer fact. A scheduled workspace job supplies
that policy, rewrites one pinned report Issue as current state, and posts a fresh mention-bearing
comment only for a new assigned `overdue-stage` row or when that row's re-ping interval elapses. It never auto-reassigns,
auto-closes, or rewrites a source object.

### An exact settled repository change commits and pushes directly

Settlement is the review gate. When the designated settlement authority has accepted the exact
file delta, `settle` previews that delta to the executing author, reconciles concurrent changes,
commits, pushes, reads the remote commit back, links it to the source object, then closes. This
applies to a Decision and to an exact Brief/Core update already covered by the settlement.

A PR is not a second mandatory gate. It remains available only when the exact diff is not settled,
someone explicitly requests diff review, or repository protection requires it. Agreement on a
direction does not authorize unreviewed wording or implementation choices. A rejected protected-
branch push is reported as a constraint; Relay neither bypasses protection nor silently opens a PR.

## Why

- A separate completion condition is the smallest test that prevents a thread from becoming a
  multi-owner chat room without splitting every comment.
- Native assignment and stage fields survive missed notifications and agent downtime; prose does
  not provide a safe responsibility source.
- A scheduled delivery layer reaches both skill-authored and direct human traffic, while skill
  transition gates prevent drift only on the traffic that actually passes through them.
- Direct commit after exact settlement keeps a two-person workflow light without weakening
  consent: the consent happened before recording, and the pushed commit is its durable evidence.
- The four existing verbs already own creation, response, reading, and settlement; another skill
  would add a door without adding an unclaimed moment.

## Consequences

- Relay ships the lifecycle as one 2.5.0 marketplace release: schema-5 lifecycle facts/findings,
  report/reply transitions, and direct commit-then-push settlement land together. The internal
  implementation order still builds deterministic visibility before write-time prevention.
- Schema 5 is additive: schema-4 obligations, notices, blockers, and entry-level `malformed`
  metadata remain available.
- Reciprocal links are the first follow-up contract. Native sub-issues are optional enrichment
  under tolerant-reader rules until their API availability is verified.
- Direct human comments receive native-state aging and reminders in v1, but their semantic scope
  drift remains advisory future work. Relay does not claim to understand arbitrary prose.
- ADR-100's four objects, two memories, promotion test, and three-tier metadata law remain in
  force. Only its unconditional Brief/Core PR requirement is replaced by the exact-settlement gate.
