# relay — GitHub-native coordination semantics

> This file owns Relay's operative contract. Design rationale lives in [ADR-090](docs/adr/090-relay-github-native.md), [ADR-091](docs/adr/091-relay-awareness-review-task-evidence.md), [ADR-092](docs/adr/092-relay-native-lifecycle-completion.md), [ADR-093](docs/adr/093-relay-obligations-vs-notices.md), [ADR-094](docs/adr/094-relay-entry-templates.md), [ADR-095](docs/adr/095-relay-author-signoff-outbound-prose.md), [ADR-096](docs/adr/096-relay-closure-semantics.md), [ADR-097](docs/adr/097-relay-receipt-default.md), [ADR-098](docs/adr/098-relay-upstream-nursery-routing.md), [ADR-099](docs/adr/099-relay-decision-reversal-consent.md), and [the design](docs/design/relay.md). Each skill restates the rules it needs.

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

**Upstream nursery (ADR-098).** Questions 1 and 2 above collapse to one practical boundary: can you state an owner and a completion rule yet? Not yet routes to a Discussion — Ideas for open-ended exploration, Q&A for a specific question — where nobody owing work is a feature, matching GitHub's own stated purpose for Discussions as the place ideas develop before an Issue exists. Once an owner and a completion rule can be stated, open the Issue and link back to the originating Discussion (GitHub's create-issue-from-discussion preserves lineage natively). An ask born crisp may open the Issue directly — the two-stage path is never mandatory ceremony. The smell this kills: an Issue where nobody can say what "done" looks like.

Use Announcement Discussions for named-recipient traffic — receipt-default by construction (ADR-097) unless explicitly labeled `fyi` for a pure broadcast — Q&A Discussions when an accepted answer is the completion condition, assigned Issues for verifiable work, Decision Issues when one named person must decide, and pull requests for exact changes. Split independently completable asks into linked objects.

Router discipline governs only traffic created through `report`. Organic traffic — a human opening an Issue or Discussion directly on GitHub — is nudged toward the same explicit-recipient rule by entry-point templates (`.github/ISSUE_TEMPLATE/`, `.github/DISCUSSION_TEMPLATE/`, PR template) that `/relay:launch` installs and audits. Templates are a convention, not a contract: `digest`'s reducer never reads their fields, and a repository without them still works. See ADR-094.

An ACK is only its owning recipient's awareness attestation: “I saw this notice.” Receipt-default (ADR-097) means naming several recipients gives each of them their own separate attestation, not one shared signal. It cannot prove comprehension, acceptance, installation, execution, restart, test output, or any other external state. When exact material must be read and judged, put that material in a pull request and request a current-revision verdict. When external work must happen, use an assigned Issue with evidence-based completion criteria. Split mixed requests into linked objects.

An authoritative external source update is its own FYI event: record the source URL plus an immutable revision, commit, or content hash in an Announcement. Updating a reusable brief is a separate exact-diff PR that cites that source event. Do not copy the raw source into Relay or let the brief PR substitute for announcing which revision became current.

## Lifecycle matrix

| Event | Owner | Native completion | Closure or effect |
|---|---|---|---|
| Announcement (receipt-default, ADR-097) — `[ACK]` title / `ack-required` label still valid, no longer required to trigger it | Each named recipient, its own receipt | That account's own `👀`, cleared per-recipient, not all-at-once | No obligation until named; once every named recipient has reacted, the author owes `SETTLE close-announcement` (reason `receipts-collected`) — a close-nudge, symmetric with Q&A's answered → close. Closed by the Discussion initiator, same closure-owner class as every other Discussion |
| FYI (Announcement labeled `fyi`) | None — the explicit broadcast opt-out | Announcement exists with provenance | No obligation, ever. Each recipient's seen-signal is 👀 if given (a comment is welcome, never required) — never owed, mentioned accounts get a notice instead. Closed by the Discussion initiator, same closure-owner class as every other Discussion — checks the reaction list, then closes as ordinary housekeeping whenever they judge it done |
| Open question (Q&A) | Discussion author accepts an answer | GitHub accepted answer | Answered; `/relay:settle` closes once accepted (SETTLE `close-answered-question`); until an answer is accepted with a stranger's comment present, the author owes DECIDE/ACT `accept-answer-or-follow-up` |
| Discussion needing a conclusion (non-Q&A: Ideas, any thread opened to converge something — Relay's upstream nursery, ADR-098) | Discussion initiator | Initiator judges it converged, OR an owner + completion rule can now be stated | Initiator writes a summarizing final comment, then closes — same rule as Q&A generalized past the native accepted-answer signal. If it converged into trackable work instead, graduate: open the Issue and link back to this Discussion |
| Verifiable task | Single Issue assignee | Stated evidence meets the completion criteria | Assignee records the result; `/relay:settle` closes |
| Decision | Single Issue assignee as decision owner | Authorized `Outcome:` + `Decision:` | `/relay:settle` closes |
| Exact change | Requested reviewer, then PR author or single PR assignee as named merger | Current-revision verdict | `Request changes` returns ACT to author; new revision returns REVIEW; approval permits merge; author may explicitly abandon |
| Core change | Configured approver and settlement authority | Current approval plus verified enforcement | Merge makes Core binding |
| Legacy migration | Requested reviewer, then PR author or named merger | Current approval plus verified destination mapping | Migration/cleanup PR merge followed by destination read-back makes migration complete |

A state transition in one row never completes another row. In particular, `👀` does not complete a linked Issue or PR, an Issue comment is not a review verdict, and approval without merge does not apply a change.

**Closure semantics: every Discussion is closed by its initiator.** One closure-owner class, no split by category. FYI recipients signal with `👀` — the same primitive ACK and Q&A engagement already use — and a comment is welcome when a recipient has something to say, but is never required; the initiator checks who has reacted, then closes the FYI as ordinary housekeeping, no resolution comment needed. A Discussion opened to converge something (Ideas, or any thread without Q&A's native affordance) works the same way at the ownership level — the initiator decides when it is concluded — but requires a summarizing final comment before closing; Q&A's accepted-answer signal is the reducer-visible special case of that same rule, not a separate one. See ADR-096.

Migration has intermediate states, not alternate definitions of done: inventory and mapping make it *planned*; created destination objects and an open PR make it *staged*; only merge into the default branch plus successful destination read-back make it *complete*.

## Obligations and authority

- A prose mention is notification, not obligation.
- A non-`fyi`, non-Q&A Discussion naming one or more `@recipient`s is receipt-default (ADR-097): every named account owes its own awareness obligation, completed only by that account's own `👀` reaction — the `[ACK]` title prefix or `ack-required` label still work as an explicit trigger but neither is required any more. Each obligation records only that its owner attested seeing the notice, not proof of comprehension, acceptance, or external work; read/unread state and another named recipient's reaction do not count toward anyone else's. Once every named recipient has reacted, the author owes closing the Announcement (`SETTLE close-announcement`). `fyi`-labeled is the explicit opt-out: no obligation for anyone, mentioned accounts get a notice instead.
- Assignment creates an obligation. On a Decision Issue, the single assignee is the v1 decision owner.
- A requested reviewer owes a current-revision verdict. PR Comment is feedback, not Approve or Request changes.
- An open, non-draft PR obligates its author to request a reviewer whenever nobody has a live claim on review: no active request, no current-revision verdict that either satisfies required approval or comes from a designated reviewer, and no historically-designated reviewer's verdict on any other revision (that reviewer owes a re-review instead). A `COMMENTED` review from an undesignated party is not a claim, and neither is a never-requested volunteer's current-revision approval on a protected repo where required approval isn't actually satisfied. Carve-outs: an `fyi`-labeled PR opts out entirely; a ghost/deleted author has no native owner to route to; when the viewer owns settlement with satisfied approval but personally lacks merge authority, that surfaces as a `settlement-owner-cannot-merge` blocker rather than silence — per-viewer data can't reveal whether some other account could merge it.
- The PR author owns settlement by default. One PR assignee explicitly transfers that merge obligation; multiple assignees do not.
- V1 supports one required approver. Required-review rules and stale-approval dismissal must be active, and unauthorized bypass must not make the gate ceremonial.
- `reply` leaves my response. `settle` uses authority to declare the whole object finished or effective.

An accepted decision is not automatically effective. A Discussion answer or Decision Issue resolution records an accepted conclusion; binding repository truth changes only when its protected Core PR merges.

**Reversing or materially amending an already-agreed decision (ADR-099)** routes exactly the way making one does: a Decision Issue assigned to the counterpart, whose authored `Outcome:` is the consent record. An accompanying Announcement may inform, but never substitutes — its `👀`, if any, still only ever attests that the notice was seen (ADR-091), never that its content was agreed to; reading silence plus a reaction as tacit consent is the overloaded-ACK fallacy ADR-091 already named, in a new guise.

**Obligations versus notices.** `digest` returns two separate tiers. Obligations are work owed with a named owner and a native completion signal — the bullets above. Notices are awareness only: a prose `@mention` with no formal signal. A notice is never presented as, sorted with, or counted toward an obligation, and it is suppressed on an object that already carries an **open** obligation *or a blocker* for the viewer — that gate is blanket, covering every mention source, so nobody gets a duplicate nag on an object they already owe work on. Below that gate, suppression splits by where the mention lives (fable I2 — a formal-signal claim that ignored this split once shipped as a bug): a **title/body** mention is additionally suppressed by a formal signal regardless of completion state (a named receipt recipient on a receipt-bearing Discussion — ADR-097; excluding the announcement's own self-mentioning author and any `@org/team-name` path, fable B1 — requested reviewer active-or-history, or assignee) or by any prior engagement at all (a comment, or on a Discussion an `👀`, since neither carries a per-mention timestamp) — a completed round must never resurface as standing title/body notice noise for exactly the person who completed it. A **comment-borne** mention is governed *solely* by the temporal rule, regardless of any formal signal or completed receipt: suppressed only up to the viewer's own last comment on the object, one that arrives *after* still fires — so a later "@person please respond" is never silenced just because that person once, long ago, touched the same thread, even if they already hold a completed receipt or ACK there. A mention is also never counted from text the viewer authored themselves. `👀` never covers a comment-borne mention (it carries no timestamp); Issues/PRs additionally carry no reaction query at all today, so comment-engagement alone covers suppression for those two types — a deliberate asymmetry, not an oversight (ADR-096). The notices tier exists because organic GitHub traffic — someone typing "@person please respond" straight into a thread — bypasses `report`'s router entirely; router discipline alone cannot catch what never went through the router. Anything needing review stays an obligation, never a notice: an open non-draft PR is never obligation-free (ratified invariant, with named carve-outs for FYI-labeled PRs, ghost authors, and undetectable third-party merge authority — see `digest/SKILL.md`). Every created object, FYI included, names at least one explicit `@recipient`; for FYI specifically, the notices tier is what guarantees a tagged mention still reaches that person even though FYI itself carries no obligation. For every OTHER Announcement, receipt-default (ADR-097) means the same tagged mention no longer needs the notices tier's help at all — it is a formal obligation directly, and the notices tier only ever sees the wild traffic that receipt-default doesn't reach (a comment-borne mention, or a mention on an object with no receipt semantics). See ADR-093, ADR-097.

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
