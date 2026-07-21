---
name: digest
model: sonnet
description: "Show the current viewer's real Relay obligations from GitHub. Use for 'what needs me?' or a reliable actionable view. Read-only: excludes FYI, prose mentions, completed rounds, and ordinary notifications."
---

# digest — show only what genuinely needs this viewer

Compute an actionable view from GitHub state without writing anything.

> **Cost tier:** this is a mechanical read-only scan, so it uses the mechanical-tier model for this turn.

## Consumption tiers

Self-report which tier was used:

1. **Helper available.** Use the bundled reducer only when it exposes the GitHub-native schema/interface. Trust its set logic, then inspect linked objects needed for presentation.

   ```
   node plugins/relay/skills/digest/scripts/compute-state.mjs --repo OWNER/REPO --for LOGIN
   ```

   `--repo` and `--for` are both optional — omitted, they resolve to the authenticated `gh` session's current repository and login. `--input FILE` replaces live collection with a fixture JSON file (`source: 'fixture'` in the output) for offline/deterministic runs. When `--for` names someone other than the authenticated `gh` account, the output carries `"caveat": "permissions-of-authenticated-viewer"` plus `authenticatedViewer` — that run's obligations were computed with the authenticated account's permissions, not the named viewer's; self-report this caveat rather than presenting the digest as that viewer's own. The `--for` login itself is not validated against GitHub — a mistyped handle silently returns a well-formed empty digest carrying that same caveat, so an unexpected empty cross-viewer digest warrants re-checking the handle before trusting the emptiness.
2. **Readable GitHub state without helper.** Query authenticated GitHub primitives directly and apply the semantic contract below. This is valid but slower.
3. **Unavailable or blocked.** If `gh`, authentication, permissions, or a required API surface is unavailable, report the exact blocked surface and what could not be determined. Never infer obligations from notification prose.

## Obligation contract

Include each obligation once:

- `[ACK]` addressed to the viewer until that account adds `👀`; this is an awareness obligation, never a verdict or evidence that an external task ran;
- an Issue assigned to the viewer, including a Decision Issue where the assignee is the v1 decision owner;
- a requested PR verdict on the current revision;
- a current-revision `Request changes` addressed back to the PR author until a new revision is pushed;
- re-review when a changed revision invalidated approval or requires a new request;
- an authorized final resolution waiting for `/relay:settle`;
- an approved current-revision ordinary PR waiting for its author, or its single assignee when one names the merger, to merge (`merge-pull-request` when mergeable now, `resolve-conflicts-then-merge` when conflicting, `prepare-branch-then-merge` for any other non-mergeable state — behind, blocked, unstable, or still being computed);
- an approved current-revision Core PR only when required review, stale-approval dismissal, and bypass enforcement are verified (`merge-core` when mergeable now, otherwise the same `resolve-conflicts-then-merge`/`prepare-branch-then-merge` split as an ordinary PR).

Exclude:

- pure FYI and ordinary notifications;
- prose mentions without assignment, review request, or explicit ACK;
- ACK completed by the designated account;
- Comment-only PR rounds presented as verdict completion;
- closed/resolved items and obligations completed on the current revision.

If an otherwise-ready Core PR lacks verified enforcement, report it as blocked, not `SETTLE`. Policy-only review history is evidence but not a platform gate.

## Present

Group by `ACK`, `DECIDE/ACT`, `REVIEW`, and `SETTLE`. For each item show object type, title, URL, why it needs the viewer, and the native action that completes this round. Describe `👀` as awareness attestation, not exact-content review or task verification; any linked PR or Issue remains a separate obligation. A current `Request changes` belongs to the PR author; pushing a new revision hands the round back to the reviewer. Collapse duplicate signals to one item.

## Discipline

- Read-only; never react, comment, assign, close, or merge.
- Current revision matters: stale approval is not a valid verdict.
- GitHub notifications are ambient awareness, not the authoritative digest.
- Lead with blockers/degradation, then obligations, then an explicit `nothing needs you` when empty.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead with the result; put technical details after it.
