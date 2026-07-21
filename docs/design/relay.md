# Relay — GitHub-native coordination design

> **Current as of 2026-07-21.** Relay is a compact semantic layer over one GitHub repository. [ADR-090](docs/adr/090-relay-github-native.md) owns the strategy reversal; `plugins/relay/CLAUDE.md` owns the operative contract.

## The design in one view

GitHub stores the events and enforced state. Relay teaches agents how to choose the right object, distinguish notification from obligation, verify writes, maintain reusable understanding, and close work only with authority.

The daily path is six verbs: `launch · report · digest · reply · brief · settle`. An explicit-only `migrate` bridge converts legacy repositories.

## Object routing

| Condition | Object |
|---|---|
| Completion or ownership is still open | Discussion |
| Completion and one accountable owner/decider are clear | Issue |
| An exact reviewable diff exists | Pull request |

FYI is an Announcement with no obligation. Explicit ACK is an `[ACK]` Announcement naming one recipient and completes only on that person's `👀`; it means “I saw this notice.” Exact material that must be read and judged uses a pull request with a requested current-revision verdict. Verifiable external work uses an assigned Issue with observable evidence. When a request contains more than one, Relay creates linked objects rather than letting ACK, review, and execution impersonate one another. Q&A uses the accepted-answer affordance. A Decision Issue uses one assignee as decision owner. A Core change uses a protected PR and one required approver. See [ADR-091](docs/adr/091-relay-awareness-review-task-evidence.md).

## Six boundaries

| Verb | Starts from | Done when | Does not own |
|---|---|---|---|
| `launch` | Repository adoption or drift concern | Required settings read back correctly | Daily objects |
| `report` | A new human intent | Object and responsibility exist and verify | Response or closure |
| `digest` | “What needs me?” | Every real obligation appears once | Mutation |
| `reply` | An existing object | My selected native response exists | Whole-object completion |
| `brief` | Reusable understanding from one or more Raw objects | Merged cited Markdown and index read back correctly | Consensus, closure, Core |
| `settle` | Authorized conclusion or approved current-revision PR | Resolution/close/merge and effective point verify | Brief authoring or approval substitution |

## Authority model

Mention is not obligation; ACK is awareness, not review; Comment is not approval; task claims need evidence; Closed is not decided; Core is true only after merge. Assignment, explicit ACK, and requested review are the v1 obligation signals. Formal verdicts bind to the current PR revision, and stale approval dismissal prevents a changed diff from inheriting old consent.

## Lifecycle matrix

| Event | Native completion | What happens next |
|---|---|---|
| FYI or versioned external-source event | Announcement exists | Nothing to settle |
| Awareness ACK | Designated account adds `👀` | Obligation ends; closure optional |
| Open question | Author accepts an answer | Discussion is answered |
| Verifiable task | Assignee returns the stated evidence | Authorized result closes the Issue |
| Decision | Decision owner records `Outcome:` and `Decision:` | Authorized settlement closes the Issue |
| Exact change or brief | Requested reviewer gives a current-revision verdict | `Request changes` returns ACT to author; a new revision returns REVIEW; approval hands merge to the author or one named PR assignee |
| Core change | Current approval plus verified enforcement | Merge makes the rule binding |
| Legacy migration | Current approval of the migration/cleanup PR | Merge into the default branch, then read back every retained destination |

An unmerged PR closed after review is abandoned, not completed. An otherwise-ready Core PR with policy-only review remains blocked from Relay settlement because history is not enforcement. A migration remains planned or staged until its reviewed cleanup lands and every destination reads back. ADR-092 records the lifecycle sweep that made these end states explicit.

## Two optional knowledge routes

Raw GitHub may be synthesized into a brief when understanding must stay current across contexts. Separately, a Decision Issue or exact diff may lead to a protected Core PR. Neither route is mandatory, and brief is not a stage on the way to Core.

`briefs/README.md` owns brief navigation and safe topic-based reorganization. `core/` owns only binding truth effective now. Git history and stable GitHub URLs preserve provenance.

## Failure model

Relay performs read-after-write verification. When creation succeeds and a later assignment, review request, reaction, close, or merge fails, the created URL is the durable recovery handle. A retry resumes the object rather than duplicating it.

## Historical changelog

- **2026-06-23** — Relay began as a separate git-native coordination repository with roster, projects, reports, replies, and consensus.
- **2026-06-24** — The model collapsed to a 1–2 person thought stream and renamed `reply` to `review`.
- **2026-06-25** — Decisions moved to an append-only ledger; `format` was added for thought-frontmatter conformance.
- **2026-07-06** — ADR-061 retained the git-native substrate after validating a GitHub-native alternative, and added a deterministic state helper plus startup awareness.
- **2026-07-14** — `register` merged into `launch` because the separate structural door was too thin.
- **2026-07-21** — The product assumption reversed. ADR-090 made GitHub authoritative, restored the broader `reply` verb, added independent `brief`, narrowed `settle`, and demoted legacy conversion to explicit-only `migrate`.
- **2026-07-21** — ADR-091 separated awareness ACK, exact-content review, and evidenced assigned work after a real onboarding request exposed that one `👀` could not prove reading, acceptance, installation, restart, or roster state.
- **2026-07-21** — ADR-092 completed the lifecycle matrix: ordinary PR merge and task settlement gained explicit owners, external source changes became separate FYI events, and Core settlement now requires verified enforcement rather than policy-only review.
