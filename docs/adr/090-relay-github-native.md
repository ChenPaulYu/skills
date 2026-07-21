# ADR 090 — Relay becomes GitHub-native

**Status**: accepted
**Date**: 2026-07-21
**Supersedes**: [ADR-061](docs/adr/061-relay-stays-git-native.md), plus the live protocol portions of [ADR-050](docs/adr/050-relay-plugin.md), [ADR-053](docs/adr/053-relay-thought-stream.md), [ADR-054](docs/adr/054-relay-decision-ledger.md), [ADR-055](docs/adr/055-relay-format-verb.md), and [ADR-078](docs/adr/078-relay-register-merged-into-launch.md)

## Context

Relay duplicated collaboration state that GitHub already stores: threads, assignments, reactions, review verdicts, closure, and revision history. The parallel file protocol added its own roster, thought graph, ledger, formatter, repository locator, and startup awareness hook. Dogfooding found false actionable items and a maintenance burden whose value depended on treating Relay as a separate platform.

That product assumption has changed. Relay is now a compact semantic layer for GitHub repositories, not an independent coordination database. Typed repository files still matter for reusable understanding and binding truth, but live collaboration state belongs on the host that enforces it.

## Decision

One Relay workspace equals one GitHub repository in v1.

GitHub owns Discussions, Issues, pull requests, comments, answers, reactions, assignments, review requests, verdicts, branch protection, and timelines. Relay owns:

- routing human intent to the right object;
- distinguishing FYI, explicit ACK, assignment, decision authority, and review obligations;
- verifying mutations by reading state back;
- maintaining cited reusable briefs;
- validating authority before closure or effectivity;
- resuming partial failures from an existing object URL.

The daily verbs are `launch`, `report`, `digest`, `reply`, `brief`, and `settle`. `migrate` is an explicit-only compatibility bridge for legacy Relay repositories, not a daily verb.

Raw evidence is GitHub itself. `briefs/` contains ordinary Markdown syntheses with citations and a README-owned organization policy. `core/` contains only binding truth effective now, changed through a protected pull request. A brief is neither consensus nor a prerequisite for Core; a Core change may cite a Decision Issue directly.

The custom SessionStart digest hook is retired. GitHub notifications provide ambient awareness; `digest` is invoked when a reliable actionable view is needed. Cross-repository aggregation is out of scope for v1.

## Why this reverses ADR-061

ADR-061 correctly found the GitHub-native design feasible but rejected it to protect a then-standing platform bet and substrate thesis. Both load-bearing premises have changed: Relay is no longer being developed as an independent platform, and the target workflow already depends on authenticated GitHub for collaboration and enforcement. Keeping a second state model would now preserve duplication rather than strategic independence.

The older ADRs remain unchanged as historical evidence. This ADR replaces only their live substrate, roster, thought-stream, ledger, format-sweep, and startup-awareness rulings.

## Consequences

- There is no parallel database, Relay status frontmatter, thought stream, decision ledger, or separate content repository in v1.
- Formal PR verdicts remain bound to the current revision; a Comment is not approval.
- One required approver is supported in v1. Multiple simultaneous required approvers need a later design.
- A failed multi-step write reports the created URL and missing mutations. Retry repairs that object instead of creating another.
- Legacy evidence is preserved through immutable git references and GitHub permalinks; migration promotes only current reusable knowledge and live obligations.
- Plugin release surfaces, generated adapters, the reducer, and hook retirement land in later phases of the implementation plan.

## Out of scope

- Cross-repository workspaces or GitHub Projects aggregation.
- A GitHub App, custom check, consensus matrix, or parallel Relay state store.
- Copying every legacy thought into a new GitHub object.
- Scheduled digests or replacement startup hooks.
