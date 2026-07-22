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

- **receipt-default (ADR-097):** on any open, non-`fyi`, non-Q&A Discussion — an `[ACK]`-titled or `ack-required`-labeled one, or (now the default reading) any such Discussion whose title/body names at least one `@mention` — EVERY named account owes its own awareness receipt until that account adds `👀`; this is an awareness obligation, never a verdict or evidence that an external task ran. Naming three people creates three separate, independently-clearing receipts, not one shared obligation — `add-eyes-reaction` for each;
- once every named recipient on such a Discussion has left their own `👀`, its author owes `SETTLE close-announcement` (reason `receipts-collected`) — a close-nudge, symmetric with Q&A's answered → close, so the author never has to manually poll the reaction list. A `@handle` that names a nonexistent account, a typo, or an org/team that never reacts blocks this close-nudge silently, with no self-report — the reducer cannot tell a real-but-inactive account from a name that will never react, so an author who wants the close-nudge to fire must name real, reachable individual accounts (a `@org/team-name` path is recognized and skipped entirely, never counted as a recipient — see below — but a *bare* `@org` mention is not distinguishable from a user login and IS counted, silently blocking the close-nudge if it never reacts);
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

- `fyi`-labeled Discussions — the explicit broadcast opt-out (ADR-097): every mentioned account there gets a notice, never a receipt obligation, and the object stays obligation-free the same way any other FYI does;
- the announcement's own author, when they mention themselves in their own title/body ("questions? ping @me") — no receipt for the author, and their own reaction (or lack of one) never blocks the close-nudge, which only ever waits on *other* named recipients (fable B1);
- a GitHub team/org path (`@org/team-name`) — never a receipt recipient, since a team can't react `👀` and counting one would deadlock the close-nudge forever (fable B1); a bare `@org` mention with no trailing `/` is indistinguishable from a user login and IS still counted — see the close-nudge bullet above;
- ordinary notifications;
- a comment-borne mention on a Discussion with no title/body mention of its own — that never triggers receipt-default; it surfaces as a **notice** (below), never as an obligation — see the wild-traffic scoping note there;
- a receipt already completed by the account it belongs to;
- Comment-only PR rounds presented as verdict completion;
- closed/resolved items and obligations completed on the current revision;
- an unanswered Q&A Discussion where the viewer is only mentioned, not the author — that is also a notice, not an obligation.

If an otherwise-ready Core PR lacks verified enforcement, report it as blocked, not `SETTLE`. Policy-only review history is evidence but not a platform gate. Similarly, when the viewer owns settlement with satisfied approval but lacks merge authority (`viewerCanSettle` false), report it as blocked (`settlement-owner-cannot-merge`), not silent — see the invariant carve-out above.

## Notices — awareness, never work owed

`notices` is a separate array from `obligations`. A notice means something is worth the viewer's attention; it never means work is owed, and it must never be presented, sorted, or counted alongside an obligation. One kind today:

- `mentioned-in-prose` — the viewer's login is `@mentioned` anywhere in the title, body, or a comment of an open Discussion, Issue, or PR, with no formal obligation signal (no ACK, assignment, or review request). This is the safety net for a prose “@person please respond” that never became a native obligation.

**Scope after ADR-097.** Receipt-default means a title/body mention on a non-`fyi`, non-Q&A Discussion is now a formal signal (a receipt obligation), not a notice — obligation-supersedes-notice already routes those away automatically, no separate rule needed. What is actually left on the notices tier is genuinely **wild traffic**: a mention buried in a *comment* (never a receipt trigger — see `announcementRecipients` scoping in the obligation contract above), a mention on an object with no receipt semantics at all (an Issue, a PR, a Q&A Discussion where the viewer isn't the author), or a mention on an `fyi`-labeled Announcement (the explicit opt-out). Mechanically this is not a new rule — it is the same suppression logic as before, now simply exercised less often because more of what used to be a bare mention is a formal obligation instead.

A `mentioned-in-prose` notice clears once the object closes — every Discussion, FYI included, closes only through its initiator (ADR-096). It can also clear earlier, on viewer engagement, but the rule differs by **where** the mention lives — this split matters, and getting it wrong silently re-opens the exact hole the notices tier exists to close:

- **Title/body mention — atemporal.** A body/title edit carries no per-mention timestamp, so "the viewer has looked at this object at some point" is the only signal available: any prior engagement suppresses it for good — the viewer authored any comment on the object, or (Discussions only) left an `👀` reaction.
- **Comment-borne mention — temporal.** A mention inside a comment carries that comment's own `createdAt`, so suppression compares timestamps: it is suppressed only when the viewer's own last comment on the object is at-or-after that mention's comment. **A mention that arrives AFTER the viewer's last comment still fires** — the viewer has not seen it yet, even though they once engaged with the same thread. This is deliberate, not a gap: an unbounded "any engagement, ever, suppresses everything after it" reading would silence a later "@person please respond" forever in any thread the person had ever once commented in, which is exactly the founding scenario the notices tier (ADR-093) exists to catch. An `👀` reaction carries no timestamp in the collected data, so it **never** suppresses a comment-borne mention — only a title/body one. A comment mention with no `createdAt` at all (a legacy fixture) is treated as older than everything, so it is suppressed once the viewer has commented on the object at all, regardless of relative order — this keeps old fixtures meaningful rather than silently never-suppressing.

**Deliberate asymmetry (unrelated to the temporal split above):** Issues and PRs carry no reaction query in the current collector, so only comment-engagement ever suppresses their mentions; a Discussion mention can additionally clear via `👀` (title/body only, per above). This is not an oversight — comment-engagement already covers the suppression need for Issues/PRs, so the collector is not extended to fetch reactions there too. On an FYI specifically, `👀` *is* the recipient's whole seen-signal: a comment is welcome when a recipient has something to say, but never required, and the initiator reads the reaction list (not the notice tier) to judge who has seen it before closing. See ADR-096.

A mention notice is suppressed in four cases, so it never becomes standing noise:

- the object already carries an **obligation** for the viewer — the obligation supersedes the weaker signal;
- the object already carries a **blocker** for the viewer (e.g. `settlement-owner-cannot-merge`, `core-enforcement-unverified`) — same reasoning, a blocker is more informative than a bare mention;
- the object carries a **formal signal** for the viewer regardless of completion state, for a TITLE/BODY mention only — the viewer is a named receipt recipient on a receipt-bearing Discussion (ADR-097; the legacy `[ACK]` title/label marker is one way in among several now), is or was a requested reviewer (active or withdrawn history), or is an assignee. A *completed* round (eyes already added, verdict already given) must not resurface as a standing title/body mention notice forever just because the object still names the viewer in its text — that reopens the exact noise problem ADR-090 retired the old startup-digest hook to fix. **This suppression never extends to a comment-borne mention on the same object** (fable I2) — see below;
- the viewer has **engaged** with the object, per the atemporal/temporal split above — again, title/body only: a comment-borne mention is governed *solely* by the temporal rule, independent of any formal signal or completed receipt on the object. A named recipient who already gave their own `👀` is not deaf to a *later* "@them please respond" comment — a completed formal signal answers "did you ever have reason to look," not "have you seen everything anyone will ever say here." An **OPEN** obligation on the object still suppresses everything, comment-borne included (unchanged) — it is specifically the completed/no-obligation case where formal-signal history must not gate a comment mention.

State this plainly, since it is easy to misreport: **a comment-borne mention that arrives after your last engagement with the object DOES fire — even for a viewer who already holds a completed formal signal (a finished receipt, review, or ACK) on that same object; one that arrives before your last engagement does not.** "You once looked at this thread" is never read as "you have seen everything anyone will ever say in it," and "you already completed your receipt" is not read that way either.

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
