# ADR 091 — Relay separates awareness, review, and task evidence

**Status**: accepted
**Date**: 2026-07-21
**Refines**: [ADR-090](docs/adr/090-relay-github-native.md)

## Context

An Accord onboarding request combined three different events in one `[ACK]` Announcement: a counterpart had to notice new coordination rules, read and accept an exact documentation change, and update an agent environment by installing a release, restarting, and checking its skill roster. Relay could verify that the designated GitHub account added `👀`, but that reaction could not prove exact-content review, acceptance, installation, restart, command output, or external state. The object therefore claimed a stronger completion condition than its native signal could establish.

## Decision

Relay routes these events independently:

1. **Awareness** — an `[ACK]` Announcement names one recipient. That account's `👀` means “I saw this notice.” It does not prove comprehension or acceptance.
2. **Exact-content review** — the material lives in a pull request. A requested reviewer owes an `Approve` or `Request changes` verdict on the current revision. An accepted change becomes effective by merge; manually closing an unmerged PR means abandonment, not completion.
3. **External work** — an assigned Issue states observable completion criteria and the evidence the assignee must return. Installation, execution, restart, version, roster, and test-output claims belong here.

When one request contains more than one event, `report` creates linked objects. `reply` uses the matching native response. `digest` keeps ACK, PR review, and Issue assignment as independent obligations, so completing one never hides the others. No new Relay state or skill is introduced.

## Consequences

- Relay no longer implies that a reaction can prove reading, acceptance, or machine state.
- Exact documents use GitHub's revision-bound review semantics instead of an awareness reaction.
- Mechanical work has a completion surface that can carry versions, commands, and output.
- Some onboarding requests create two or three small linked objects instead of one overloaded checklist.
- Existing reducer primitives remain sufficient; a regression fixture proves the independent obligations survive when the ACK is completed.
