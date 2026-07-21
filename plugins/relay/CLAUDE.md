# relay — GitHub-native coordination semantics

> This file owns Relay's operative contract. Design rationale lives in [ADR-090](docs/adr/090-relay-github-native.md) and [the design](docs/design/relay.md). Each skill restates the rules it needs.

## What Relay is

Relay is a thin semantic layer over one GitHub repository. GitHub owns collaboration objects and state; Relay supplies routing, obligation semantics, authority checks, read-after-write verification, reusable synthesis policy, and authorized settlement. It does not maintain a parallel coordination database.

Six daily verbs form the interface:

| Verb | Owns |
|---|---|
| `launch` | Audit or configure repository prerequisites and protection. |
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

Use Announcement Discussions for FYI and explicit ACK traffic, Q&A Discussions when an accepted answer is the completion condition, Decision Issues when one named person must decide, and pull requests for exact changes. Split independently completable asks into linked objects.

## Obligations and authority

- A prose mention is notification, not obligation.
- `[ACK]` plus a designated recipient creates an obligation completed only by that account's `👀` reaction. Read/unread state and another person's reaction do not count.
- Assignment creates an obligation. On a Decision Issue, the single assignee is the v1 decision owner.
- A requested reviewer owes a current-revision verdict. PR Comment is feedback, not Approve or Request changes.
- V1 supports one required approver. Required-review rules and stale-approval dismissal must be active, and unauthorized bypass must not make the gate ceremonial.
- `reply` leaves my response. `settle` uses authority to declare the whole object finished or effective.

An accepted decision is not automatically effective. A Discussion answer or Decision Issue resolution records an accepted conclusion; binding repository truth changes only when its protected Core PR merges.

## Raw, briefs, and Core

- **Raw GitHub** is the complete evidence layer: Discussions, Issues, pull requests, comments, answers, reactions, reviews, and timelines. Do not create `raw/`, `thoughts/`, or `logs/` mirrors.
- **`briefs/`** contains ordinary Markdown syntheses for understanding that must stay current across future contexts and does not fit in one object's final resolution. Each important claim cites stable GitHub URLs. `briefs/README.md` owns navigation and organization. Keep it flat unless at least three stable, usually co-read briefs form a domain-based group; never group by time/status or create one-file/empty folders. Moves use `git mv` and update README and links in the same PR. If value is unclear, stay flat.
- **`core/`** contains the minimum binding truth people and agents may rely on now. Change it only through an exact protected PR with a valid current-revision approval; merge is the effective point.

A brief never closes an object, represents consensus, or changes Core. It is not a Core prerequisite; a Core PR may cite a Decision Issue directly.

## Mutation and recovery contract

Every writing verb presents the intended mutation or diff before applying it. After writing, read the resulting GitHub or git state back. A silent assignment, reviewer, reaction, verdict, close, or merge failure blocks completion.

If an early step creates an object and a later mutation fails, return the existing URL and the exact missing steps. Retry from that URL; never create a duplicate to obtain a clean run.

## Minimal implementation

Use GitHub primitives directly through authenticated `gh`/API operations and ordinary branches/PRs. There is no Relay database, status frontmatter, roster file, project file, thought stream, or decision ledger. A brief is Markdown plus citations plus git history. GitHub URLs are recovery handles.

The deterministic GitHub obligation reducer belongs to `digest`. It collects native GitHub primitives, reduces them without inventing state, and returns a machine-readable blocker when collection is incomplete. `migrate` performs semantic inventory directly; the legacy frontmatter linter is retired.

## Cost and invocation

`digest` is the mechanical-tier read-only scan. The other daily verbs require judgment. `migrate` is explicit-only because legacy conversion is exceptional, destructive-adjacent compatibility work.

## When editing

Change this owner and every affected self-contained skill together. New or renamed skills require the marketplace release gates, regenerated projections, and both human-facing surfaces in the same commit.
