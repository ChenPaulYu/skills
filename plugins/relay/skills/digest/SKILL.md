---
name: digest
model: sonnet
description: "Show the current viewer's real Relay obligations from GitHub — including requesting a reviewer for your own unreviewed PR — plus a separate non-binding notices tier for prose mentions. Use for 'what needs me?' or a reliable actionable view. Read-only: excludes FYI, completed rounds, and ordinary notifications from obligations."
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
- a Q&A Discussion the viewer authored: `DECIDE/ACT accept-answer-or-follow-up` while open, unanswered, and someone else has commented; `SETTLE close-answered-question` once GitHub's native `isAnswered` is true and the Discussion is still open;
- a requested PR verdict on the current revision;
- a current-revision `Request changes` addressed back to the PR author until a new revision is pushed;
- re-review when a changed revision invalidated approval or requires a new request;
- the viewer's own open, non-draft PR where nobody has a live claim on review — no active review request, no current-revision verdict that either satisfies required approval or comes from a historically-designated reviewer, and no historically-designated reviewer (active or withdrawn request) has a verdict on any *other* revision (their stale verdict routes THEM a re-review obligation instead, never suppressing this one silently): `DECIDE/ACT request-reviewer` for the author. A `COMMENTED` review never counts as a claim, from anyone, and neither does a never-requested volunteer's current-revision approval when required approval is not actually satisfied (a protected repo's aggregate `REVIEW_REQUIRED` doesn't recognize that approval as sufficient, so Relay must not either);
- an authorized final resolution waiting for `/relay:settle`;
- an approved current-revision ordinary PR waiting for its author, or its single assignee when one names the merger, to merge (`merge-pull-request` when mergeable now, `resolve-conflicts-then-merge` when conflicting, `prepare-branch-then-merge` for any other non-mergeable state — behind, blocked, unstable, or still being computed);
- an approved current-revision Core PR only when required review, stale-approval dismissal, and bypass enforcement are verified (`merge-core` when mergeable now, otherwise the same `resolve-conflicts-then-merge`/`prepare-branch-then-merge` split as an ordinary PR).

**Ratified invariant:** an open, non-draft PR is never obligation-free. At every moment, either a reviewer owes a verdict, the author owes changes, the settlement owner owes a merge, the author owes a reviewer request, or a `settlement-owner-cannot-merge` blocker is visible (below). Four carve-outs are named, not silently swallowed:

- an `fyi`-labeled PR is a deliberate opt-out — the whole obligation block is skipped for it, same as any other FYI object;
- a ghost/deleted author has no native owner to route to, so a PR in that state sits outside the invariant — a rare edge, not a bug;
- per-viewer data cannot reveal another account's merge authority. When the viewer *is* the settlement owner and approval is satisfied but they personally lack merge authority (`viewerCanSettle` is false), that closes the author side honestly as a **blocker** (`settlement-owner-cannot-merge`), not a silent zero — see Blockers below. Some other account may still be able to merge it; this run cannot see that;
- a review requested from a **team**, not an individual, is outside v1: the reducer matches a requested reviewer against individual viewer logins, so a team-only request never resolves to a REVIEW obligation for any member, and no request-reviewer obligation fires for the author either (an active request already exists, just not to a person) — the PR is invisible to everyone's digest until an individual reviewer is added. `/relay:report` is the place this is prevented, not here.

Exclude:

- pure FYI and ordinary notifications;
- prose mentions without assignment, review request, or explicit ACK — these surface as a **notice** (below), never as an obligation;
- ACK completed by the designated account;
- Comment-only PR rounds presented as verdict completion;
- closed/resolved items and obligations completed on the current revision;
- an unanswered Q&A Discussion where the viewer is only mentioned, not the author — that is also a notice, not an obligation.

If an otherwise-ready Core PR lacks verified enforcement, report it as blocked, not `SETTLE`. Policy-only review history is evidence but not a platform gate. Similarly, when the viewer owns settlement with satisfied approval but lacks merge authority (`viewerCanSettle` false), report it as blocked (`settlement-owner-cannot-merge`), not silent — see the invariant carve-out above.

## Notices — awareness, never work owed

`notices` is a separate array from `obligations`. A notice means something is worth the viewer's attention; it never means work is owed, and it must never be presented, sorted, or counted alongside an obligation. One kind today:

- `mentioned-in-prose` — the viewer's login is `@mentioned` anywhere in the title, body, or a comment of an open Discussion, Issue, or PR, with no formal obligation signal (no ACK, assignment, or review request). This is the safety net for a prose “@person please respond” that never became a native obligation.

A mention notice is suppressed in three cases, so it never becomes standing noise:

- the object already carries an **obligation** for the viewer — the obligation supersedes the weaker signal;
- the object already carries a **blocker** for the viewer (e.g. `settlement-owner-cannot-merge`, `core-enforcement-unverified`) — same reasoning, a blocker is more informative than a bare mention;
- the object carries a **formal signal** for the viewer regardless of completion state — the viewer is the designated ACK recipient, is or was a requested reviewer (active or withdrawn history), or is an assignee. A *completed* round (eyes already added, verdict already given) must not resurface as a standing mention notice forever just because the object still names the viewer in its text — that reopens the exact noise problem ADR-090 retired the old startup-digest hook to fix.

A mention is also never counted from text the viewer authored themselves — a comment naming yourself is not someone pinging you. Attribution: title/body → the object's author; a comment → that comment's author. A source with no resolvable author is never treated as self-authored (it still counts).

An unreviewed own PR is **not** a notice — see `request-reviewer` in the obligation contract above. Anything that needs review is captured as an obligation, never demoted to awareness.

Present notices in their own section, clearly labeled as non-binding awareness, after obligations.

## Comment-scan cap

The mention scan and the Q&A comment check read up to the most recent 50 comments per object. A comment with no resolvable author (deleted/ghost account) never counts as a "stranger" for the Q&A `accept-answer-or-follow-up` check — only a real, different login does. When an object's comment count exceeds the cap, the run does not fail — GitHub-collection failures stay reserved for the harder page caps on discussions/issues/PRs themselves, reactions, files, and review-request history, all of which the client still fails hard on. Instead the result carries a top-level `commentScanTruncated` array (object refs) naming every **open** object whose comment scan may have missed an older mention or answer — a closed object is excluded, since its undetected comments no longer matter to anyone's digest. Self-report this list rather than silently trusting emptiness beyond the cap.

## Present

Group obligations by `ACK`, `DECIDE/ACT`, `REVIEW`, and `SETTLE`. For each item show object type, title, URL, why it needs the viewer, and the native action that completes this round. Describe `👀` as awareness attestation, not exact-content review or task verification; any linked PR or Issue remains a separate obligation. A current `Request changes` belongs to the PR author; pushing a new revision hands the round back to the reviewer. Collapse duplicate signals to one item. Then present notices, separately labeled. Then, if present, self-report `commentScanTruncated`.

## Discipline

- Read-only; never react, comment, assign, close, or merge.
- Current revision matters: stale approval is not a valid verdict.
- GitHub notifications are ambient awareness, not the authoritative digest.
- Lead with blockers/degradation, then obligations, then notices, then an explicit `nothing needs you` when both obligations and notices are empty.
- A `needs-input` label on an assigned Issue means the assignee is awaiting someone else's input before they can act — it does not create a second obligation. The assignment is already the obligation; the label is context for the assignee's `DECIDE/ACT` entry, not a new one.

## Schema

`schemaVersion: 3`. Top-level shape: `{ schemaVersion, source, repository, viewer, blocked, blockers, obligations, notices, commentScanTruncated?, caveat?, authenticatedViewer? }`. `commentScanTruncated`, `caveat`, and `authenticatedViewer` are present only when they apply. `notices` is always present (possibly empty) and is never merged into `obligations`.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead with the result; put technical details after it.
