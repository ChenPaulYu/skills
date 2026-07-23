# relay — GitHub-native coordination semantics

> This file owns Relay's operative contract. Design rationale lives in [ADR-090](docs/adr/090-relay-github-native.md), [ADR-091](docs/adr/091-relay-awareness-review-task-evidence.md), [ADR-092](docs/adr/092-relay-native-lifecycle-completion.md), [ADR-093](docs/adr/093-relay-obligations-vs-notices.md), [ADR-094](docs/adr/094-relay-entry-templates.md), [ADR-095](docs/adr/095-relay-author-signoff-outbound-prose.md), [ADR-096](docs/adr/096-relay-closure-semantics.md), [ADR-097](docs/adr/097-relay-receipt-default.md), [ADR-098](docs/adr/098-relay-upstream-nursery-routing.md), [ADR-099](docs/adr/099-relay-decision-reversal-consent.md), [ADR-100](docs/adr/100-relay-adopts-the-accord-memory-model.md), [ADR-101](docs/adr/101-relay-attested-reference-roster.md), [ADR-102](docs/adr/102-relay-migrate-generalizes.md), [the design](docs/design/relay.md), and the design record itself: [`blueprints/plans/2026-07-22-accord-memory-model.md`](blueprints/plans/2026-07-22-accord-memory-model.md) (the "blueprint"). Each skill restates the rules it needs.

## Governing principle: progressive disclosure

Every layer of this model answers one question: *what is the least a reader must see before deciding whether to read more?* The memory stack discloses progressively — Core (what we must remember if we forget everything) → Brief (how to understand a topic now) → Decision (what one round established) → GitHub itself (the full process). So does the digest (obligations → notices), and the file system (index row → header → body). This is the same law as navigable code: lead with the point, drill down only on demand.

## What Relay is

Relay is a thin semantic layer over one GitHub repository. GitHub owns collaboration objects and state; Relay supplies routing, obligation semantics, authority checks, read-after-write verification, reusable synthesis policy, and authorized settlement/recording. It does not maintain a parallel coordination database.

Six daily verbs form the interface:

| Verb | Owns |
|---|---|
| `launch` | Audit or configure repository prerequisites, protection, entry-point templates, labels, and the `decisions/` scaffold. |
| `report` | Route a new human intent to a Discussion, Issue, or pull request — Issue-default. |
| `digest` | Show only real obligations for the current viewer. |
| `reply` | Leave the viewer's response on an existing object, flipping native baton labels where applicable. |
| `brief` | Keep reusable cited understanding current across contexts, integrating only active Decisions. |
| `settle` | Use authority to declare an object finished, carry the native promotion signal chain, and record Decisions. |

`migrate` is an explicit-only bridge that brings a repository's pre-model coordination state into this memory model, not a seventh daily verb (ADR-102).

## Locating the Relay workspace and its people

A Relay workspace is one GitHub repository, but it is not necessarily the repository in the current working directory. A product repository may report into a central Accord repository. Any verb that creates a new object resolves the target workspace in this order and validates every candidate with `gh repo view` before use:

1. an object URL or `OWNER/REPO` explicitly supplied for this action;
2. `$RELAY_REPO`, when set to `OWNER/REPO`;
3. the one-line local default at `~/.config/relay/repo`, when present;
4. the current repository only when repository-owned Relay markers (`relay.yml`, `decisions/`, `briefs/`, or `core/`) prove it is itself a Relay workspace;
5. otherwise ask the user for `OWNER/REPO` and offer to save the verified answer as the local default.

A stale or inaccessible environment/config candidate falls through with a visible warning; it never turns cwd into an implicit fallback. `~/.config/relay/repo` is routing configuration, not collaboration state: it stores only a verified default `OWNER/REPO`, may be deleted safely, and is written only after the exact local mutation is previewed and approved. `$RELAY_REPO` is an explicit per-process override and is never overwritten.

`relay.yml` at the workspace root is the attested identity roster. Its canonical shape is:

```yaml
people:
  <legacy_handle>:
    name: <human-facing name>       # required
    github: <GitHub account>        # required
    title: <role or title>          # required
    git: <commit author email>      # optional; not used for routing
```

Legacy handles and GitHub accounts are unique. `report` may use a GitHub account explicitly supplied by the user after `gh api users/<handle>` resolves it. Otherwise it matches the requested legacy handle, name, or role against `relay.yml`; exactly one row must match, and that row's `github` value must resolve. No match, multiple matches, a missing roster, or an invalid account means ask before previewing or creating anything. Never infer an account from display-name similarity, an organization name, or a previously seen handle.

## The four objects and their boundaries (blueprint section 1)

| Object | What it is | Boundary test |
|---|---|---|
| **Discussion** — think together | Explore a topic that has no clear answer yet; exchange views until a provisional conclusion forms | You cannot yet state an owner and a completion rule. Once you can → open an Issue, linked back |
| **Issue** — get one thing finished | Track a bounded responsibility: who owes the next step, what counts as done | Exactly one accountable owner + a checkable completion rule. "Please take note of X" is also a bounded responsibility (the assignee's confirmation completes it) |
| **Pull Request** — review a concrete change | A proposed modification to shared memory, reviewed item by item; accept or request changes | There is a diff to review verbatim. A PR is *proposed*, never *in force* |
| **Commit (on main)** — keep what is established | The version future people and agents rely on directly | Branch commits are PR draft material; only main establishes. Core additionally requires an effective review |

**There is no Announcement object (ADR-100).** A tell that needs a receipt is an Issue (assignee confirms, then close). A fact that needs no receipt gets no object — if it matters it lives in a commit/Brief; a passing heads-up is an `@mention` on the relevant object (caught by the notices tier). Discussions are the low-frequency, high-value exception: opening one signals "this needs both of us thinking." Their scarcity is their weight.

One-line version: Discussion handles *how we think*; Issue handles *who does what*; PR handles *whether this change may enter*; Commit preserves *what currently stands*.

## Two memories (blueprint section 2)

- **Collaboration memory** — the GitHub objects themselves (Discussions, Issues, PR conversations, reviews, comments). Complete, contextual, append-only by nature; preserves *how things happened*. Not necessarily still true.
- **Formal memory** — version-controlled repository files: `decisions/`, `briefs/`, `core/`. Curated, reviewed, versioned; preserves *what can be relied on now*. Agents load this first.

GitHub objects store process; repository files store results.

## Decision, Brief, Core (blueprint section 3)

- **Decision** (`decisions/D-0xx-<slug>.md`, source state, append-only): what was formally established about one concrete question, at one point in time — including a decision *not* to act. Direction changes add a new Decision that supersedes the old one; old files are never rewritten, only marked. Frontmatter: `id · status: active|superseded · superseded-by · source · settled-by · date`. **Supersession is mechanical, not editorial** — derived views and agents trust only `status: active`.
- **Brief** (`briefs/`, topic projection, derived): "without rereading history, how should I understand this topic now?" Integrates currently-active Decisions; **cites, never restates** their authoritative wording (`[D-0xx]`) — a second copy of a Decision's text is a fact with two owners, and it will drift. A Brief citing a `superseded` Decision is stale by definition; the conformance sweep flags it.
- **Core** (`core/`, minimal projection, derived): "if we forgot every detail, what must we still remember?" Cross-topic, most stable, every sentence traceable to Decisions.

## Resolution vs Decision — the promotion test (blueprint section 4)

Every Issue and Discussion closes with a `Resolution:`. Only some Resolutions are promoted to a Decision file — settle asks: *after closing this object, is there a new statement that future people or agents should treat as a valid basis for action or belief?* Yes → record a Decision. No (pure execution of an existing Decision, receipt confirmations, duplicates, factual lookups, ideas collected without a choice) → the closing Resolution comment **is** the formal record; no file. Close now means "this object has been translated into long-term memory (or confirmed to need none)."

## Who writes what, and how it enters the repo (blueprint section 5)

| Content | Path into repo | Why |
|---|---|---|
| Decision | The designated **recorder** commits directly to main | Recording an already-settled conclusion, not making a new one |
| Brief | Always a PR | Integration involves choices and interpretation — another person reviews |
| Core | Always a PR, stricter | Highest-weight shared understanding: supporting Decisions listed, counterpart approval, no auto-merge |

The **recorder is not the assignee**: the assignee executes; the recorder is whoever holds settlement authority (a Discussion's host, an Issue's acceptor). Direct-commit Decisions carry five fuses (source explicitly settled · adds no new semantics · links back · the commit does only this — except marking a superseded Decision's frontmatter in the same commit, which is exempted as part of the same recording act, not a second edit · agent-drafted text passes author sign-off) — see `settle/SKILL.md` for the full list and the escapes that force a PR instead (exact wording IS the decision; no clear settlement; synthesizing multiple objects). Standing fuse: the moment recording requires re-judging "what did we actually mean," route it through a PR.

## Object router (blueprint sections 1, 8, 10)

One Relay workspace equals one resolved GitHub repository. Cross-repository aggregation is out of scope, but a project repository may target a separate central workspace through the resolver above.

**Issue-default.** Route a new intent by asking: does this belong to an existing object (comment there)? Is it a standalone tell needing a receipt (Issue, assignee confirms)? Is it a review request (an exact diff → PR; a review of anything else → Issue)? Is it a question you can already name an owner for (a `needs-input` Issue carrying `Question:`/`Done when:`/`After reply:`)? Is it genuinely open, not-yet-converging shared topic (a Discussion)? Is it an already-crisp memory change (straight to a PR)?

**Upstream nursery (ADR-098, unchanged, absorbed here).** The boundary between Issue and Discussion collapses to one practical test: can you state an owner and a completion rule yet? Not yet routes to a Discussion — Ideas for open-ended exploration, Q&A for a specific question — where nobody owing work there is a *feature*, matching GitHub's own stated purpose for Discussions as the place ideas develop before an Issue exists. Once an owner and a completion rule can be stated, open the Issue and link back to the originating Discussion. An ask born crisp may open the Issue directly — the two-stage path is never mandatory ceremony. The smell this kills: an Issue where nobody can say what "done" looks like.

Use these refinements: a standalone tell (`tell.yml` shape) for a receipt owed by one assignee; a `needs-input` Issue when content, not just a receipt, is wanted from a nameable owner; Q&A Discussions when an accepted answer is the completion condition and no single obvious owner exists; assigned Issues for verifiable work; pull requests for exact changes; and a `fyi` label on **any** object type as the explicit opt-out — a durable, linkable object that obligates nobody. Split independently completable asks into linked objects.

Router discipline governs only traffic created through `report`. Organic traffic — a human opening an Issue or Discussion directly on GitHub — is nudged toward the same explicit-owner rule by entry-point templates (`.github/ISSUE_TEMPLATE/`, `.github/DISCUSSION_TEMPLATE/`, PR template) that `/relay:launch` installs and audits. Templates are a convention, not a contract: `digest`'s reducer never reads their fields, and a repository without them still works. See ADR-094.

**Decision reversal or amendment (ADR-099, unchanged principle, absorbed here).** Reversing or materially amending an already-agreed Decision routes exactly like making one: an Issue assigned to the counterpart whose disposition is the consent record. An accompanying tell may inform, but never substitutes — a `👀` reaction or a passive mention is never read as consent, only awareness.

## Lifecycle, end to end (blueprint section 6)

```
Discussion (talked out) ─┐
                         ├→ Resolution  ── promotion test ──┐
Issue (worked out) ──────┘                                  │
                       no  → closing comment is the record → close
                       yes → settle applies awaiting-record, reassigns recorder
                              → recorder commits D-0xx → links back → label removed → close
                              → affects a Brief/Core? → PR (counterpart reviews)
                              → merge → established
```

Typical traffic: execution/research/decisions → Issues; memory changes → PRs; receipted tells → Issues; Discussions only when two heads are genuinely needed.

## Issue obligation actions (native stage labels)

An OPEN Issue assigned to the viewer yields **exactly one** obligation, whose action derives from its stage label — labels are stages, not stacking claims:

| Stage label | Obligation | Meaning |
|---|---|---|
| *(none)* | `DECIDE/ACT act` | Plain assignment — the unchanged default |
| `needs-input` | `DECIDE/ACT provide-requested-input` | Someone is waiting on information only the assignee has |
| `awaiting-acceptance` | `DECIDE/ACT accept-or-dispose` | The assignee (reassigned by `reply`'s baton flip) must accept or dispose of delivered input |
| `awaiting-record` | `SETTLE record-decision` | The assignee (reassigned by `settle`'s promotion signal) is the recorder who owes the Decision commit |

Conflicting labels (more than one present at once) are malformed: the reducer picks the latest stage in the order above and flags the obligation `malformed: ['conflicting-stage-labels']` rather than silently choosing — a conformance-tier concern, not a silent pick. A stage label on an Issue with no assignee produces no obligation for anyone.

**The baton flip** (`reply`, blueprint section 10): delivering requested input on a `needs-input` Issue is a native state transition, not just a comment — `reply` posts the answer, removes `needs-input`, applies `awaiting-acceptance`, and reassigns to the acceptor. Both the label swap and the reassignment are native fields; `digest` computes "who owes what" from them alone, no prose parsing.

**The promotion signal chain** (`settle`, blueprint section 10) is native, deliberately not an `@mention`. On an Issue: `settle` writes the settlement block (tier 2, for humans), applies `awaiting-record` (tier 1: which stage), and reassigns to the recorder (tier 1: who owes) — the object stays open until the Decision is recorded, linked back, and the label removed. On a Discussion (no assignee field): the label carries the stage, and the recorder defaults to the settlement comment's own author, overridden only when the block's `Recorder:` line names someone else.

Q&A Discussions keep their native obligations (GitHub's own `isAnswerable`/`isAnswered`): `DECIDE/ACT accept-answer-or-follow-up` while open and unanswered with a stranger's comment; `SETTLE close-answered-question` once accepted and still open.

PR obligations are entirely unchanged: a requested reviewer owes a current-revision verdict; `Request changes` returns ACT to the author; approval hands merge to the author or a named PR assignee; Core additionally requires verified enforcement.

**Closure semantics: every Discussion is closed by its initiator.** One closure-owner class, no split by category — a Discussion opened to converge something requires a summarizing final comment first (folded into its `Resolution:`); Q&A's accepted-answer signal is the reducer-visible special case of that same rule, not a separate one (ADR-096, general form unchanged).

## LEGACY `[ACK]` Discussions — retired

The LEGACY `[ACK]`-titled-Discussion compatibility path (ADR-100) retired 2026-07-22: migration completed and the live repo carried zero open `[ACK]`/`ack-required` Discussions. An `[ACK]`-titled Discussion is now just a Discussion — a plain `@mention` lands on the notices tier like any other. See ADR-100's Legacy-compatibility section for the retired design.

## Notification is recoverable responsibility, and metadata has three tiers (blueprint section 8)

Notifications are events ("at some point, a ping happened"); Relay needs state ("something is still waiting on you, now"). `digest` therefore never reads notification inboxes — it rescans current GitHub state and recomputes obligations, so a deleted email, a read-away notification, or an agent offline for days loses nothing. Attention signals (mentions, new comments, reactions) may notify but never obligate; obligation signals (assignment, review request, stage labels, approved-awaiting-merge) mean it is someone's turn. **The minimum rule: a message that needs action never rides on an `@mention` alone** — a question with a stateable owner and completion rule graduates into a `needs-input` Issue.

**The three tiers of machine readability:**

1. **Responsibility lives in native fields** — assignment, review request, close state, labels. GitHub enforces them; they cannot be misspelled. `digest` computes who-owes-what from this tier ONLY.
2. **Record semantics live in structured prose, formatted at write time** — the settlement block (`Resolution:`/`Reason:`/`Decision required:`/`Recorder:`/`Follow-ups:`) and Decision frontmatter. The writing verbs (`report`/`reply`/`settle`) emit these by template; `digest` reads them as enrichment under tolerant-reader rules (standard shape → consume; ad-hoc → best effort; absent → degrade and self-report), never as a dependency.
3. **Format health lives in the conformance sweep**, not in digest failure paths — does `Canonical record:` resolve? were `Follow-ups:` opened? does every closed object carry a `Resolution:`? does each Decision's `Source:` resolve? Format drift becomes a report-board line, never silent information loss.

There is no separate formatter verb: formatting is embedded in each writing skill's templates.

## Indexes and navigability (blueprint section 9)

Formal memory is navigable the way well-kept code is: any reader answers "what is this file, is it current?" from the top lines, and "what exists?" from one index, without opening everything. A Decision's frontmatter IS its header. Briefs and Core carry a one-line role header (topic · derived-from · last-integrated Decision), the same spirit as code file-top headers. **Indexes are derived, never hand-edited**: `decisions/README.md` (id · title · status · date, newest first) and the briefs/core index rows are regenerated from the files' own headers — the conformance sweep regenerates and compares; drift becomes a bot commit or a report-board line, never a manual chore. "The currently effective Decisions" is a filter (`status: active`), never a separately maintained file.

## Raw, briefs, and Core

- **Raw GitHub** (collaboration memory) is the complete evidence layer: Discussions, Issues, pull requests, comments, answers, reactions, reviews, and timelines. Do not create `raw/`, `thoughts/`, or `logs/` mirrors.
- **`decisions/`** (formal memory, source state) holds one file per Decision, recorded per the fuses above.
- **`briefs/`** (formal memory, derived) contains ordinary Markdown syntheses for understanding that must stay current across future contexts and does not fit in one Decision's own scope. Each claim cites `[D-0xx]`; `briefs/README.md` owns navigation and organization. Keep it flat unless at least three stable, usually co-read briefs form a domain-based group; never group by time/status or create one-file/empty folders. Moves use `git mv` and update README and links in the same PR. If value is unclear, stay flat.
- **`core/`** (formal memory, derived, highest weight) contains the minimum binding truth people and agents may rely on now. Change it only through an exact protected PR with a valid current-revision approval; merge is the effective point.
- **`relay.yml`** (formal memory, attested reference data, blueprint section 3) is neither deliberated (a Decision) nor derived (a Brief/Core projection): the roster (legacy handle · GitHub account · name · role, plus optional git author email) that historical Decisions' attributions and `report`'s recipient resolution depend on. Every change goes through a PR — the counterpart's approval **is** the attestation, no per-change Decision file, no ceremony. `digest`'s reducer never reads it (obligations stay native-fields-only); `report` reads it only to turn a human identity into a verified native GitHub owner. See ADR-101.

A Brief never closes an object, represents consensus, or changes Core. It is not a Core prerequisite; a Core PR may cite a Decision file directly.

## Mutation and recovery contract

Every writing verb presents the intended mutation or diff before applying it. After writing, read the resulting GitHub or git state back. A silent assignment, reviewer, reaction, label, close, or merge/commit failure blocks completion.

If an early step creates an object and a later mutation fails, return the existing URL and the exact missing steps. Retry from that URL; never create a duplicate to obtain a clean run.

## Author sign-off (outbound prose)

Every writing verb that posts prose into a GitHub object or commits a Decision file in the user's voice — `report`'s object body, `reply`'s answer/comment/verdict text, `settle`'s settlement block/Decision file text, `brief`'s synthesis — shows the user the exact text that will be posted or committed, verbatim, and asks: "Is this what you mean?" Post/commit only after they confirm; a rewrite goes through the same gate. Mechanical mutations with no authored text — labels, assignment, reactions, read-backs — follow the normal write-gate above, not this one. Correctness is checkable by the agent; whether the text is what the user meant to say, in the voice they want, only the user can judge. See ADR-095.

## Minimal implementation

Use GitHub primitives directly through authenticated `gh`/API operations and ordinary branches/PRs, plus direct commits for Decision recording under the five-fuse discipline above. There is no Relay database, status frontmatter, project file, or thought stream beyond the `decisions/`/`briefs/`/`core/` formal-memory files themselves — each of those is itself plain Markdown plus frontmatter/citations plus git history, never a parallel state store. The forbidden thing is a machine-consumed parallel **state** store, not a PR-attested **reference** file (`relay.yml`) or a deletable local **routing preference** (`~/.config/relay/repo`). Neither participates in obligation computation.

The deterministic GitHub obligation reducer belongs to `digest`. It collects native GitHub primitives, reduces them without inventing state, and returns a machine-readable blocker when collection is incomplete. `migrate` performs semantic inventory directly; the legacy frontmatter linter is retired.

## Cost and invocation

`digest` is the mechanical-tier read-only scan. The other daily verbs require judgment. `migrate` is explicit-only because pre-model coordination-state migration is exceptional, destructive-adjacent compatibility work.

## When editing

Change this owner and every affected self-contained skill together. New or renamed skills require the marketplace release gates, regenerated projections, and both human-facing surfaces in the same commit.
