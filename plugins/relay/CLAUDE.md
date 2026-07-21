# relay — GitHub-native coordination semantics

> This file owns Relay's operative contract. Design rationale lives in [ADR-090](docs/adr/090-relay-github-native.md), [ADR-091](docs/adr/091-relay-awareness-review-task-evidence.md), [ADR-092](docs/adr/092-relay-native-lifecycle-completion.md), [ADR-093](docs/adr/093-relay-obligations-vs-notices.md), [ADR-094](docs/adr/094-relay-entry-templates.md), [ADR-095](docs/adr/095-relay-author-signoff-outbound-prose.md), and [the design](docs/design/relay.md). Each skill restates the rules it needs.

## What Relay is

Relay is a thin semantic layer over one GitHub repository. GitHub owns collaboration objects and state; Relay supplies routing, obligation semantics, authority checks, read-after-write verification, reusable synthesis policy, and authorized settlement. It does not maintain a parallel coordination database.

Six daily verbs form the interface:

| Verb | Owns |
|---|---|
| `launch` | Audit or configure repository prerequisites, protection, and entry-point templates. |
| `report` | Route a new human intent to a Discussion, Issue, or pull request. |
| `digest` | Show only real obligations for the current viewer. |
| `reply` | Leave the viewer's response on an existing object. |
| `brief` | Keep reusable cited understanding current across contexts. |
| `settle` | Use authority to declare an object finished or make approved Core effective. |

`migrate` is an explicit-only v0-to-v1 compatibility bridge, not a seventh daily verb.

## Workspace and object router

One Relay workspace equals the current GitHub repository in v1. Cross-repository aggregation is out of scope.

Route a new intent with three questions:

1. Is there a clear completion condition? If no, use a Discussion.
2. Is one person accountable for advancing or deciding it? If no, use a Discussion.
3. Is there an exact reviewable diff? If yes, use a pull request; otherwise use an Issue.

Use Announcement Discussions for FYI and explicit ACK traffic, Q&A Discussions when an accepted answer is the completion condition, assigned Issues for verifiable work, Decision Issues when one named person must decide, and pull requests for exact changes. Split independently completable asks into linked objects.

Router discipline governs only traffic created through `report`. Organic traffic — a human opening an Issue or Discussion directly on GitHub — is nudged toward the same explicit-recipient rule by entry-point templates (`.github/ISSUE_TEMPLATE/`, `.github/DISCUSSION_TEMPLATE/`, PR template) that `/relay:launch` installs and audits. Templates are a convention, not a contract: `digest`'s reducer never reads their fields, and a repository without them still works. See ADR-094.

An ACK is only the named recipient's awareness attestation: “I saw this notice.” It cannot prove comprehension, acceptance, installation, execution, restart, test output, or any other external state. When exact material must be read and judged, put that material in a pull request and request a current-revision verdict. When external work must happen, use an assigned Issue with evidence-based completion criteria. Split mixed requests into linked objects.

An authoritative external source update is its own FYI event: record the source URL plus an immutable revision, commit, or content hash in an Announcement. Updating a reusable brief is a separate exact-diff PR that cites that source event. Do not copy the raw source into Relay or let the brief PR substitute for announcing which revision became current.

## Lifecycle matrix

| Event | Owner | Native completion | Closure or effect |
|---|---|---|---|
| FYI / source event | None | Announcement exists with provenance | No closure obligation |
| Awareness ACK | One recipient | That account adds `👀` | Round complete; closure is optional housekeeping |
| Open question | Discussion author accepts an answer | GitHub accepted answer | Answered; `/relay:settle` closes once accepted (SETTLE `close-answered-question`); until an answer is accepted with a stranger's comment present, the author owes DECIDE/ACT `accept-answer-or-follow-up` |
| Verifiable task | Single Issue assignee | Stated evidence meets the completion criteria | Assignee records the result; `/relay:settle` closes |
| Decision | Single Issue assignee as decision owner | Authorized `Outcome:` + `Decision:` | `/relay:settle` closes |
| Exact change | Requested reviewer, then PR author or single PR assignee as named merger | Current-revision verdict | `Request changes` returns ACT to author; new revision returns REVIEW; approval permits merge; author may explicitly abandon |
| Core change | Configured approver and settlement authority | Current approval plus verified enforcement | Merge makes Core binding |
| Legacy migration | Requested reviewer, then PR author or named merger | Current approval plus verified destination mapping | Migration/cleanup PR merge followed by destination read-back makes migration complete |

A state transition in one row never completes another row. In particular, `👀` does not complete a linked Issue or PR, an Issue comment is not a review verdict, and approval without merge does not apply a change.

Migration has intermediate states, not alternate definitions of done: inventory and mapping make it *planned*; created destination objects and an open PR make it *staged*; only merge into the default branch plus successful destination read-back make it *complete*.

## Obligations and authority

- A prose mention is notification, not obligation.
- `[ACK]` plus a designated recipient creates an awareness obligation completed only by that account's `👀` reaction. It records who attested that they saw the notice, not proof of comprehension, acceptance, or external work. Read/unread state and another person's reaction do not count.
- Assignment creates an obligation. On a Decision Issue, the single assignee is the v1 decision owner.
- A requested reviewer owes a current-revision verdict. PR Comment is feedback, not Approve or Request changes.
- An open, non-draft PR obligates its author to request a reviewer whenever nobody has a live claim on review: no active request, no current-revision verdict that either satisfies required approval or comes from a designated reviewer, and no historically-designated reviewer's verdict on any other revision (that reviewer owes a re-review instead). A `COMMENTED` review from an undesignated party is not a claim, and neither is a never-requested volunteer's current-revision approval on a protected repo where required approval isn't actually satisfied. Carve-outs: an `fyi`-labeled PR opts out entirely; a ghost/deleted author has no native owner to route to; when the viewer owns settlement with satisfied approval but personally lacks merge authority, that surfaces as a `settlement-owner-cannot-merge` blocker rather than silence — per-viewer data can't reveal whether some other account could merge it.
- The PR author owns settlement by default. One PR assignee explicitly transfers that merge obligation; multiple assignees do not.
- V1 supports one required approver. Required-review rules and stale-approval dismissal must be active, and unauthorized bypass must not make the gate ceremonial.
- `reply` leaves my response. `settle` uses authority to declare the whole object finished or effective.

An accepted decision is not automatically effective. A Discussion answer or Decision Issue resolution records an accepted conclusion; binding repository truth changes only when its protected Core PR merges.

**Obligations versus notices.** `digest` returns two separate tiers. Obligations are work owed with a named owner and a native completion signal — the bullets above. Notices are awareness only: a prose `@mention` with no formal signal. A notice is never presented as, sorted with, or counted toward an obligation, and it is suppressed on an object that already carries an obligation *or a blocker* for the viewer, or that carries a formal signal for the viewer regardless of completion state (designated ACK recipient, requested reviewer active-or-history, or assignee) — a completed round must never resurface as standing notice noise for exactly the person who completed it. A mention is also never counted from text the viewer authored themselves. The notices tier exists because organic GitHub traffic — someone typing "@person please respond" straight into a thread — bypasses `report`'s router entirely; router discipline alone cannot catch what never went through the router. Anything needing review stays an obligation, never a notice: an open non-draft PR is never obligation-free (ratified invariant, with named carve-outs for FYI-labeled PRs, ghost authors, and undetectable third-party merge authority — see `digest/SKILL.md`). Every created object, FYI included, names at least one explicit `@recipient`; for FYI, the notices tier is what guarantees a tagged mention still reaches that person even though FYI itself carries no obligation. See ADR-093.

## Raw, briefs, and Core

- **Raw GitHub** is the complete evidence layer: Discussions, Issues, pull requests, comments, answers, reactions, reviews, and timelines. Do not create `raw/`, `thoughts/`, or `logs/` mirrors.
- **`briefs/`** contains ordinary Markdown syntheses for understanding that must stay current across future contexts and does not fit in one object's final resolution. Each important claim cites stable GitHub URLs. `briefs/README.md` owns navigation and organization. Keep it flat unless at least three stable, usually co-read briefs form a domain-based group; never group by time/status or create one-file/empty folders. Moves use `git mv` and update README and links in the same PR. If value is unclear, stay flat.
- **`core/`** contains the minimum binding truth people and agents may rely on now. Change it only through an exact protected PR with a valid current-revision approval; merge is the effective point.

A brief never closes an object, represents consensus, or changes Core. It is not a Core prerequisite; a Core PR may cite a Decision Issue directly.

## Mutation and recovery contract

Every writing verb presents the intended mutation or diff before applying it. After writing, read the resulting GitHub or git state back. A silent assignment, reviewer, reaction, verdict, close, or merge failure blocks completion.

If an early step creates an object and a later mutation fails, return the existing URL and the exact missing steps. Retry from that URL; never create a duplicate to obtain a clean run.

## Author sign-off (outbound prose)

Every writing verb that posts prose into a GitHub object in the user's voice — `report`'s object body, `reply`'s answer/comment/verdict text, `settle`'s final resolution, `brief`'s synthesis — shows the user the exact text that will be posted, verbatim, and asks: "Is this what you mean?" Post only after they confirm; a rewrite goes through the same gate. Mechanical mutations with no authored text — labels, assignment, reactions, read-backs — follow the normal write-gate above, not this one. Correctness is checkable by the agent; whether the text is what the user meant to say, in the voice they want, only the user can judge — and a posted GitHub object is seen immediately, with edits leaving history. See ADR-095.

## Minimal implementation

Use GitHub primitives directly through authenticated `gh`/API operations and ordinary branches/PRs. There is no Relay database, status frontmatter, roster file, project file, thought stream, or decision ledger. A brief is Markdown plus citations plus git history. GitHub URLs are recovery handles.

The deterministic GitHub obligation reducer belongs to `digest`. It collects native GitHub primitives, reduces them without inventing state, and returns a machine-readable blocker when collection is incomplete. `migrate` performs semantic inventory directly; the legacy frontmatter linter is retired.

## Cost and invocation

`digest` is the mechanical-tier read-only scan. The other daily verbs require judgment. `migrate` is explicit-only because legacy conversion is exceptional, destructive-adjacent compatibility work.

## When editing

Change this owner and every affected self-contained skill together. New or renamed skills require the marketplace release gates, regenerated projections, and both human-facing surfaces in the same commit.
