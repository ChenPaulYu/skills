# Relay — GitHub-native coordination design

> **Current as of 2026-08-19 (relay 2.5.0, ADR-120).** Relay is a compact semantic layer over one GitHub repository, following the Accord memory model. [ADR-090](docs/adr/090-relay-github-native.md) owns the GitHub-native strategy reversal; [ADR-100](docs/adr/100-relay-adopts-the-accord-memory-model.md) owns the memory-model adoption; [ADR-120](docs/adr/120-relay-conversation-lifecycle.md) owns mid-conversation transitions and exact-settlement recording; `plugins/relay/CLAUDE.md` owns the operative contract.

## The design in one view

GitHub stores the events and enforced state (collaboration memory); `decisions/`, `briefs/`, and `core/` store what can be relied on now (formal memory). Relay teaches agents how to choose the right object, distinguish notification from obligation, verify writes, promote a settled Resolution into a cited Decision, maintain reusable understanding derived from those Decisions, and close work only with authority.

The daily path is four verbs: `report · digest · reply · settle`. Workspace setup/conformance, Brief maintenance, and legacy adoption live with the repository rather than behind standing verbs (ADR-115).

## The four objects and two memories

| Object | What it is | Boundary test |
|---|---|---|
| Discussion | Think together — no clear owner or completion rule yet | Once you can state both → open a linked Issue |
| Issue | Get one thing finished — one accountable owner, a checkable completion rule | "Please take note of X" counts too — the assignee's confirmation completes it |
| Pull request | Optionally review a concrete, verbatim diff that is not yet settled | Proposed, never in force until merged |
| Commit (main) | What is currently established | A direct formal-memory commit requires exact settlement and remote read-back |

**There is no Announcement object.** A tell that needs a receipt is an Issue (assignee confirms, then closes). A fact that needs no receipt gets no object at all — a passing heads-up is a plain `@mention`, caught only by the notices tier. Discussions also serve as Relay's upstream nursery (ADR-098, unchanged, absorbed into this model): while an ask still lacks a nameable owner and completion rule, it stays a Discussion and graduates to a linked Issue once both can be stated, with a born-crisp ask free to open the Issue directly. Q&A Discussions keep their native accepted-answer obligation path.

**Collaboration memory** (GitHub itself) is complete, append-only, preserves *how things happened*. **Formal memory** (`decisions/`/`briefs/`/`core/`) is curated and versioned, preserves *what can be relied on now*, and is what agents load first. A Decision (`decisions/D-0xx-<slug>.md`) records one settled conclusion with stable frontmatter (`id · status: active|superseded · superseded-by · source · settled-by · date`); a Brief cites active Decisions (`[D-0xx]`) without restating their wording; Core is the smallest cross-topic projection. An exact settled delta enters by direct commit and push; a PR is reserved for a diff that still needs review or repository enforcement.

## Object routing (Issue-default)

| Condition | Object |
|---|---|
| No independent completion condition; only clarifies the current object | Comment there through `reply` |
| Has its own stateable completion condition | Linked Issue through `report`, even when the parent depends on it |
| A standalone tell needing a receipt | Issue (assignee confirms) |
| A review request over an exact diff | Pull request |
| A review of anything else (a report, an artifact, a result) | Issue |
| A question with a nameable owner | `needs-input` Issue (Question / Done when / After reply) |
| Genuinely open, not-yet-converging shared topic | Discussion (Ideas or Q&A) |
| An exact memory delta already covered by settlement | Direct commit and push through `settle` |
| An exact diff that still needs review | Pull request |

A `fyi` label works as a general opt-out on any object type — a durable, linkable record that obligates nobody. Reversing or materially amending an already-agreed Decision routes exactly like making one: an Issue assigned to the counterpart whose disposition is the consent record (ADR-099, unchanged principle). See [ADR-091](docs/adr/091-relay-awareness-review-task-evidence.md) for the historical awareness/review/task-evidence split this router's Issue/PR distinction descends from.

## Conversation lifecycle

A later comment is routed on two axes. First, does the new matter have its own stateable completion
condition? If yes, it becomes a linked Issue; if no, it remains clarification/evidence on the
current object. Second, can the parent truthfully settle while that child remains open? If yes, the
parent closes with the child in `Follow-ups:`; if no, the parent stays open for its own unmet rule.

`reply` owns clarification, answers, and same-scope handoff. `report` owns the forked Issue.
`settle` owns whole-object disposition. The assignee is the current baton, while the acceptor/host
is stable settlement authority. Plain work and `needs-input` may hand off; `awaiting-acceptance`
exits only through the acceptor, and `awaiting-record` exits only through completed recording.
Receipt, answer, acceptance, and settlement never collapse into one event.

## Four boundaries

| Verb | Starts from | Done when | Does not own |
|---|---|---|---|
| `report` | A new human intent | Object and responsibility exist and verify | Response, closure, or recording |
| `digest` | "What needs me?" | Every real obligation appears once | Mutation |
| `reply` | An existing object | My selected native response exists, baton labels flip correctly | Whole-object completion |
| `settle` | Authorized whole-object disposition | Resolution, direct settled commit/push, close, or explicitly reviewed PR merge reads back | Inventing semantics not covered by settlement |

## Authority model

Mention is not obligation; Comment is not approval; task claims need evidence; Closed is not decided; a pushed file is not settled unless the exact delta was accepted; a Decision is not automatically a Brief/Core update. Assignment, stage labels, and requested review are the obligation signals — all native, typo-proof fields. Formal PR verdicts bind to the current revision, and stale approval dismissal prevents a changed diff from inheriting old consent.

## Issue obligation actions (native stage labels)

An OPEN Issue assigned to the viewer yields exactly one obligation, derived from its stage label: none → `DECIDE/ACT act` (unchanged default); `needs-input` → `DECIDE/ACT provide-requested-input`; `awaiting-acceptance` → `DECIDE/ACT accept-or-dispose`; `awaiting-record` → `SETTLE record-decision`. Labels are stages, not stacking claims — conflicting labels present at once are malformed, resolved deterministically to the latest stage in that order and flagged `malformed: ['conflicting-stage-labels']`; a stage label with no assignee produces no obligation for anyone.

`reply`'s **baton flip** performs the `needs-input` → `awaiting-acceptance` transition natively (label swap plus reassignment to the acceptor) when requested input is delivered. `settle`'s **promotion signal chain** applies `awaiting-record` plus reassigns to the recorder when a closing Resolution promotes to a Decision — the object stays open until the Decision is recorded, linked back, and the label removed. Both chains are native fields, deliberately never an `@mention`, so `digest` computes who-owes-what without parsing prose.

## Digest: obligations, findings, and notices

`digest` returns real `obligations`, native-state `findings`, and separate non-binding `notices`.
Findings diagnose malformed or overdue lifecycle state without inventing a new owner. Notices are
awareness only — a prose `@mention` with no formal signal — and are never counted as obligations.
Stage age comes from native label/assignment timeline events, never generic `updatedAt`; overdue
classification appears only when the workspace supplies thresholds. Arbitrary comment semantics
remain outside mechanical-tier digest.

## Entry-point templates

Router discipline governs traffic created *through* `report`. Organic GitHub traffic is nudged by
the workspace's own Issue/Discussion forms and audited by its scheduled conformance CI; the retired
`launch` verb no longer owns this setup (ADR-115). Templates remain conventions, never reducer
dependencies. Direct human comments receive native-state age/reminder coverage, but semantic scope
drift remains advisory future work.

## Lifecycle, end to end

```
Discussion (talked out) ─┐
                         ├→ Resolution  ── promotion test ──┐
Issue (worked out) ──────┘                                  │
                       no  → closing comment is the record → close
                       yes → settle applies awaiting-record, reassigns recorder
                              → exact Decision/Brief/Core delta previewed
                              → recorder commits + pushes → remote read-back + source link
                              → label removed → close
                       exact delta not settled → continue review or use an explicit/required PR
```

**Every Discussion is closed by its initiator** — one closure-owner class, no split by category. A Discussion opened to converge something requires a summarizing final comment first, folded into its `Resolution:`; Q&A's native accepted-answer/closure signal is the reducer-visible special case of that same rule, not a separate one. See [ADR-096](docs/adr/096-relay-closure-semantics.md) (general form unchanged by this wave).

An unmerged PR closed after review is abandoned, not completed. When a PR is used, policy-only review remains blocked from Relay settlement because history is not enforcement. A migration remains planned or staged until its cleanup lands and every destination reads back.

## Formal memory: indexes and navigability

Formal memory is navigable the way well-kept code is. A Decision's frontmatter IS its header — the first lines answer "what was decided, does it still hold?" Briefs and Core carry a one-line role header (topic · derived-from · last-integrated Decision). Indexes are derived, never hand-edited: `decisions/README.md` (id · title · status · date, newest first) is regenerated from the files' own headers; the conformance sweep regenerates and compares, so drift becomes a bot commit or a report-board line, never a manual chore. "Currently effective Decisions" is a filter (`status: active`), never a separately maintained file.

## Two optional knowledge routes

Raw GitHub may be synthesized into a Brief when understanding must stay current across contexts — but only by citing active Decisions, never by restating their wording or by synthesizing raw GitHub threads directly. Separately, an active Decision may lead to a Core update. Neither route is mandatory, and Brief is not a stage on the way to Core. Once the exact derived delta is settled, `settle` commits and pushes it directly; a PR is only an explicit or repository-required review path.

`briefs/README.md` owns Brief navigation and safe topic-based reorganization. `core/` owns only binding truth effective now. Git history and stable GitHub URLs preserve provenance.

## Failure model

Relay performs read-after-write verification. When creation succeeds and a later assignment, review request, reaction, label, close, merge, or Decision commit fails, the created URL (or commit target) is the durable recovery handle. A retry resumes the object rather than duplicating it.

## Historical changelog

- **2026-06-23** — Relay began as a separate git-native coordination repository with roster, projects, reports, replies, and consensus.
- **2026-06-24** — The model collapsed to a 1–2 person thought stream and renamed `reply` to `review`.
- **2026-06-25** — Decisions moved to an append-only ledger; `format` was added for thought-frontmatter conformance.
- **2026-07-06** — ADR-061 retained the git-native substrate after validating a GitHub-native alternative, and added a deterministic state helper plus startup awareness.
- **2026-07-14** — `register` merged into `launch` because the separate structural door was too thin.
- **2026-07-21** — The product assumption reversed. ADR-090 made GitHub authoritative, restored the broader `reply` verb, added independent `brief`, narrowed `settle`, and demoted legacy conversion to explicit-only `migrate`.
- **2026-07-21** — ADR-091 separated awareness ACK, exact-content review, and evidenced assigned work after a real onboarding request exposed that one `👀` could not prove reading, acceptance, installation, restart, or roster state.
- **2026-07-21** — ADR-092 completed the lifecycle matrix: ordinary PR merge and task settlement gained explicit owners, external source changes became separate FYI events, and Core settlement now requires verified enforcement rather than policy-only review.
- **2026-07-21** — ADR-093 added a separate non-binding notices tier to `digest` for prose mentions, alongside native Q&A obligations, after a parity audit found a prose "@person please respond" reached no one's digest and Q&A had no obligation path at all. Two hard rules were ratified in the same pass: every `report`-created object (FYI included) tags an explicit recipient, and an unreviewed own PR is a real `request-reviewer` obligation, not a notice — an open non-draft PR is never obligation-free. Two follow-up fable reviews hardened the implementation: a live query bug (`isAnswerable` requested on the wrong GraphQL type) and an invariant-falsifying gap (COMMENTED/undesignated reviews silently blocking the guard) were fixed with corrected fixture coverage; a second pass closed a completed-round notice-noise regression (F1), named three invariant carve-outs (FYI PRs, ghost authors, undetectable third-party merge authority — the last surfacing as a new `settlement-owner-cannot-merge` blocker), added blocker-based notice suppression, excluded self-authored mentions from self-noticing, and excluded ghost-authored comments from the Q&A stranger check.
- **2026-07-21** — ADR-094 (relay 1.1.0 → 1.2.0) extended recipient-tagging to organic GitHub traffic that never passes through `report`'s router: `launch` now installs and audits GitHub's native Issue Forms and Discussion category forms (task/decision Issue templates, `blank_issues_enabled: false`, Announcement/Q&A Discussion templates, a PR template) as a write-time convention, not a new contract — `digest`'s reducer is untouched.
- **2026-07-21** — ADR-095 (relay 1.2.1 → 1.3.0) added an author sign-off gate: every writing verb that posts prose into a GitHub object in the user's voice (`report`, `reply`, `settle`, `brief`) now shows that text verbatim and asks "Is this what you mean?" before posting; mechanical mutations with no authored text are exempt.
- **2026-07-22** — ADR-096 (relay 1.3.0 → 1.4.0) ratified closure semantics after a downstream conformance-style consumer that treats an object's open/closed state as itself meaningful surfaced that closure had no single agreed meaning for FYI and non-Q&A Discussions. One closure-owner class: every Discussion is closed by its initiator, no split by category. `compute-state.test.mjs`: 59 → 66, all green.
- **2026-07-22** — ADR-097 (relay 1.4.0, reducer-only) flipped the awareness tier from optional to receipt-default: any open, non-`fyi`, non-Q&A Discussion naming one or more `@recipient`s became Announcements-tier by construction — every named account owed its own receipt. A close-nudge machine-answered "has everyone seen this?" once every recipient had reacted. **This entire design retired with ADR-100 below** — see that ADR's Context for why the receipt-bearing-Discussion shape did not survive the fuller memory-model convergence. `compute-state.test.mjs`: 66 → 69 → 76 across the initial pass and a fable hardening follow-up (self-mention/team-path exclusions, comment-borne-mention temporal scoping).
- **2026-07-22** — ADR-098 (relay 1.4.0, routing-guidance only) names Relay's **upstream nursery** boundary after real traffic showed convergence-talk being pulled entirely into Issues, emptying Discussions of their official upstream role: can you state an owner and a completion rule yet? Not yet routes to a Discussion. **Unchanged and absorbed into ADR-100's routing** — this boundary test turned out to be exactly the blueprint's own section-1 test, arrived at independently.
- **2026-07-22** — ADR-099 (relay 1.4.0, routing-guidance only) closes a live gap after a jointly-agreed decision was reversed unilaterally and announced through an ACK Discussion with no consent record. Reversing or materially amending an already-agreed decision now routes through the same owner-and-completion-rule path as making one. **Unchanged principle, absorbed into ADR-100's routing** — its mechanism now expresses through the new model's Issue-and-disposition shape rather than the old "Decision Issue" type specifically.
- **2026-07-22** — A fable review of the full 1.4.0 shipping unit (ADR-096–099) found and fixed two reducer defects (self-mention/team-path over-collection in the receipt-default recipient list; formal-signal suppression wrongly gating comment-borne mentions). Superseded in mechanism by ADR-100 below, but the underlying suppression-scoping principles (title/body atemporal, comment-borne temporal, self-mentions never self-notice) carry forward unchanged into the LEGACY `[ACK]` path.
- **2026-07-22 — ADR-100 (relay 1.4.0 → 2.0.0, semantic break)** adopts the **Accord memory model** as Relay's design basis: four objects with clean boundaries (Discussion/Issue/PR/Commit), two memories (GitHub collaboration memory, `decisions/`/`briefs`/`core/` formal memory), a Decision→Brief→Core disclosure stack with mechanical supersession, and native stage-label obligations (`needs-input`/`awaiting-acceptance`/`awaiting-record`) replacing the entire Announcement/receipt-default apparatus. **There is no Announcement object.** ADR-097 retires in full; ADR-096's Announcement-closure branch retires (its general Discussion-closure principle survives, folded into `settle`); the awareness leg of ADR-091/092 survives only inside a LEGACY `[ACK]`-titled-Discussion compatibility path (original pre-097 single-recipient semantics, no close-nudge, expected to retire after migration); ADR-093's Announcement-specific hard rule retires while its obligations/notices split and the open-PR invariant remain in force; ADR-098 and ADR-099 remain fully in force, absorbed into the new router unchanged. `compute-state.mjs`: `SCHEMA_VERSION` 3 → 4; `authorizedResolution`/`issueType`/`finalResolution` removed; `issueStage` added. `compute-state.test.mjs`: 76 → 81, all green. Every writing SKILL.md (`report`, `reply`, `settle`, `brief`, `launch`) rewritten to the new contracts; `launch`'s template set drops `announcements.yml`, adds `needs-input.yml`/`tell.yml`, and gains label/`decisions/`-scaffold audit findings. Full detail: [ADR-100](docs/adr/100-relay-adopts-the-accord-memory-model.md) and the blueprint it points at.
- **2026-07-22 (relay 2.0.1 → 2.1.0)** retires the LEGACY `[ACK]`-titled-Discussion compatibility path ADR-100 introduced: migration completed and the live repo carried zero open `[ACK]`/`ack-required` Discussions, so `isLegacyAckDiscussion`/`legacyAckRecipient` and the single-recipient ACK obligation branch were removed outright from `compute-state.mjs`; `hasFormalSignal` no longer checks a legacy recipient; the `order` map drops the dead `ACK` kind. An `[ACK]`-titled Discussion is now just a Discussion — its mentions land on the notices tier like any other. `compute-state.test.mjs`: legacy-specific tests removed or rewritten onto plain Discussions/Issues, findAllMentions' team/org-path and bare-`@org` guard coverage preserved without the legacy machinery; 82 → 75, all green (net fewer tests: several legacy-only cases collapsed into one `post-migration: an [ACK]-titled Discussion is just a Discussion` assertion plus rewritten generic coverage). `plugins/relay/CLAUDE.md`'s LEGACY section replaced with a one-line retirement note; `digest/SKILL.md` and `reply/SKILL.md` had every LEGACY `[ACK]`/`👀` mention removed. See ADR-100's Legacy-compatibility section for the retired design.
- **2026-07-22 — ADR-102 (relay stays 2.1.0, skill-scope rewrite only)** generalizes `migrate` from a v0→v1 compatibility bridge (its only named target already migrated) into a general pre-model-coordination-state → memory-model migrator: file-based ledgers/thought streams, overloaded ACK-style Discussions, commit-only or closed-Issue-only decisions, and unowned rosters, classified exactly once via the promotion test (backfill a Decision · Resolution-only close · derived-view/Brief material · attested reference data · discard-with-record) and migrated under the same author-sign-off, five-fuse, and cite-never-restate discipline the daily verbs already use. No reducer/schema change: `compute-state.test.mjs` stays 75/75. Full detail: [ADR-102](docs/adr/102-relay-migrate-generalizes.md).
- **2026-08-13 — ADR-115 (relay 2.4.0)** condenses the interface to four verbs (`report · digest · reply · settle`). Workspace conformance replaces `launch`, repository guidance replaces `brief`, and one-off discipline replaces `migrate`. It explicitly leaves reminders to a daily workspace schedule.
- **2026-08-19 — ADR-120 (relay 2.5.0)** adds the missing conversation lifecycle in one release: a two-axis follow-up boundary, native baton handoffs with protected stages, schema-5 lifecycle findings and stage age, scheduled re-ping delivery, and direct commit -> push when settlement covers the exact repository delta.
