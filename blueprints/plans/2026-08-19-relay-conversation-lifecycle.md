# Relay conversation lifecycle — implementation plan

> Generated: 2026-08-19 · Spec source: Relay/Accord workflow review · Status: complete — Relay 2.5.1 released after delivery-contract hardening and the target workspace adopted

## Outcome

Relay should remain a GitHub-native coordination layer with four verbs, but gain one missing capability: **when a conversation changes shape, Relay must either preserve the current scope, transfer the current baton, or fork a new owned object before responsibility becomes ambiguous.**

The rollout is deliberately asymmetric. Relay-authored writes gain prevention: the skill must classify the transition before writing. All GitHub traffic, including direct human comments, gains native-state age and reminder coverage. Semantic scope drift in organic comments remains detectable only by a later advisory experiment; v1 does not pretend that a deterministic reducer can understand arbitrary prose.

The release is complete when:

1. `report` and `reply` apply one shared two-axis continuation boundary;
2. same-scope handoffs change native stage and assignment together;
3. independently completable follow-ups become linked child Issues instead of extending the parent indefinitely;
4. `digest` reports deterministic native-field defects separately from real obligations;
5. the Accord workspace runs the reducer on a schedule and re-reminds the current owner at an explicit cadence, measured from stage age rather than Issue age;
6. `settle` makes an explicit Resolution / Decision / durable-synthesis disposition and directly commits then pushes any exact repository change already covered by that settlement;
7. all existing Relay behavior and tests remain green unless this plan deliberately changes the contract.

This is a new capability, not a small wording fix. It changes the shared Relay contract, all four surviving verbs, the digest schema, the workspace conformance boundary, and the documented Accord lifecycle. Implementation therefore follows this plan and a new ADR; it does not begin as an isolated skill edit.

## First-principles model

GitHub provides durable objects and native responsibility fields. It does not understand the meaning of a new comment. Relay's job is not to reproduce a chat transcript; it is to keep four facts recoverable after every meaningful turn:

| Fact | Plain meaning | Owner |
|---|---|---|
| Scope | What one object is allowed to finish | Issue title/body and `Done when` |
| Baton | Who owes the next externally visible action | Native assignee plus stage label |
| Settlement seat | Who may accept, dispose, or close this scope | Stable object authority; never inferred from the current assignee |
| Memory disposition | Whether closure is enough, or the settled conclusion should be committed into formal memory | Settlement block and pushed repository artifact |

Three principles follow:

1. **One object has one independently closable scope.** A thread may contain many comments, but only one completion condition and one current baton.
2. **A comment is evidence, not workflow state.** A message that creates or transfers responsibility must be reflected in native GitHub fields or a new owned object.
3. **Detection and mutation stay separate.** The reducer and scheduled sweep report drift; only an authorized writing verb or human applies assignment, labels, links, closure, or commits.

The continuation boundary has two independent axes:

1. **Object boundary — does the new matter have its own stateable completion condition?**
   - **No**: it is clarification, evidence, or conversation required by the existing `Done when`; keep it as comments on the current object.
   - **Yes**: it is independently trackable; open a linked follow-up Issue with its own owner and `Done when`.
   - **Unclear**: do not assign speculative work. Ask for the missing completion condition or route the emerging topic to a Discussion.
2. **Parent disposition — can the parent truthfully close while that independently trackable matter remains open?**
   - **Yes**: settle the parent and list the child in `Follow-ups:`.
   - **No**: keep the parent open for its own unmet `Done when`, while the child tracks the independently completable dependency.

Owner, topic similarity, chronology, and dependency are supporting signals, not the object boundary. A related or dependent matter can still deserve a child when it has its own completion condition; a different actor can still own the next step inside one unchanged scope.

## Current gaps, merged

### 1. Scope can drift after correct creation

`report` currently says that content belonging to an existing object should be commented there (`plugins/relay/skills/report/SKILL.md:14`). That protects against duplicate Issues but gives no test for when a comment creates a second settlement unit. A report can therefore accumulate a receipt, a question, a feature request, and implementation work while retaining one stale `Done when`.

### 2. Conversation responsibility and native responsibility can diverge

Relay already performs a native baton flip for the explicit `needs-input -> awaiting-acceptance` path (`plugins/relay/skills/reply/SKILL.md:25`). Ordinary comments that introduce a new owned question or handoff have no equivalent transition. Digest then correctly reports the stale assignee while humans believe the baton moved in prose.

### 3. Receipt, answer, acceptance, and settlement are distinct events

Acknowledging a tell proves awareness only. Supplying requested information proves an answer only. Accepting that answer disposes the current round. Settling closes the object's whole scope. Relay states parts of this distinction today, but the continuation router does not consistently preserve it once a thread mixes intents.

### 4. Current actor and settlement authority are different roles

The assignee should answer only “who owes the next action.” The object author or explicit acceptor remains the stable settlement seat. Recorder and PR reviewer are action-specific roles. Treating assignment as a catch-all authority field causes unnecessary churn and makes closure authority require prose archaeology.

### 5. Conformance sees malformed fields, not semantic drift

The schema-4 reducer derives Issue obligations from three mutually exclusive stage labels and flags conflicting labels (`plugins/relay/skills/digest/scripts/compute-state.mjs:279`). It does not expose stage age, native-transition age, linked follow-up health, multiple action owners, or a separate findings tier. Existing conformance can prove format health but cannot prove that the latest conversation still matches the object scope.

### 6. Summoned digest cannot provide reliable reminders

ADR-115 explicitly leaves reminders unresolved and places the fix on a daily schedule (`docs/adr/115-relay-condenses-to-four.md:55`). Stronger digest auto-invocation is necessary for delivery, but cannot repair ambiguous scope by itself. A scheduled run should surface state; it must not silently reinterpret or mutate the conversation.

### 7. Noncompliant human traffic is an expected input

Skill-authored traffic can follow the protocol, while direct GitHub comments can bypass it. This is not solved by blaming the author or by making every comment formal. The system needs a recovery path: deterministic defects become findings; possible semantic drift becomes advisory review; only explicit authority can repair native state.

### 8. Closure does not reliably graduate learning into the repository

`settle` already owns the promotion test and Decision recording chain, while the current contract routes Brief/Core work to follow-up PRs (`plugins/relay/skills/settle/SKILL.md:18`). That PR default is too heavy for a two-person workspace after the exact change is already settled. The missing behavior is making the full disposition unavoidable and then recording it without a duplicate review round: resolution-only, or direct commit -> push for a settled Decision/Brief/Core change. “Issue closed” must not be mistaken for “shared knowledge graduated.”

### 9. Notification identity is not the same as GitHub identity

The GitHub account remains the canonical action identity. A Git author email or external notification address is a separate routing concern and may be private. It must not become a second owner of responsibility state or be committed to a public roster by default.

## Resolved design decisions

| Question | Decision |
|---|---|
| Add another Relay verb? | No. Preserve the four-door model ratified by ADR-115: `report`, `digest`, `reply`, `settle`. |
| Where does the new transition live? | `reply` owns continuation, answer, and same-scope handoff; `report` owns a newly forked Issue; `settle` owns whole-scope disposition. |
| When does a follow-up stay only in comments? | When it has no independent completion condition and exists only to clarify or supply evidence for the current `Done when`. |
| When is a new Issue mandatory? | When the new matter has its own stateable completion condition, whether or not the parent depends on it. The child gets its own `Done when`, assignee, lifecycle, and origin link. |
| What if the next actor changes but the scope does not? | Keep the Issue; atomically update the stage label and the single current assignee. Settlement authority remains stable. |
| Should a parent/context Issue keep changing assignee? | No. Long-running open context belongs in a Discussion. Bounded work belongs in child Issues; the parent/origin may close with `Follow-ups:` links. |
| Should PR reviewer assignment be reused for later follow-ups? | No. When a PR is actually needed, its review request belongs to one concrete diff/revision. A later reviewed diff gets its own request; direct settled commits have no reviewer assignment. |
| Does a repository change that is already settled need a PR? | No. When the settlement authority has accepted the exact delta, `settle` previews it, then commits and pushes directly. A PR remains optional only when the diff itself is not yet settled, explicit diff review is requested, or branch protection requires it. |
| Is agreement on intent enough to push an implementation? | No. “Settled” must cover the exact change being recorded. If wording or code still introduces unreviewed choices, continue the Issue/Discussion until that delta is accepted. |
| Can digest infer and apply owner changes from prose? | No. It may report a finding; it never mutates labels, assignments, links, or closure. |
| Should the reducer or `digest` use an LLM to detect drift? | No. Schema output stays reproducible and `digest` stays mechanical-tier. Any semantic advisory is a separate summoned analysis or workspace job, never an obligation source. |
| What should reminders mutate? | One workspace-owned report surface for state, plus a fresh mention-bearing comment only for new or cadence-due rows. They do not auto-close, auto-reassign, or comment on source objects. |
| What is the initial notification channel? | GitHub-native delivery only. Email routing is a later private configuration layer after reminder quality is proven. |
| How does knowledge graduate? | Every settlement chooses Resolution-only or an exact formal-memory delta. Once accepted, `settle` directly commits and pushes the Decision/Brief/Core change, links the commit, then closes. |

## Target lifecycle

### Transition vocabulary

The writing verbs use five human-readable transitions. These are behavior names, not five new labels or reducer inputs:

| Transition | Scope | Native effect | Owning verb |
|---|---|---|---|
| `clarify` | unchanged | comment only; current baton remains | `reply` |
| `answer` | unchanged | for `needs-input`, post answer, apply `awaiting-acceptance`, reassign acceptor | `reply` |
| `handoff` | unchanged | post next-action summary, set the appropriate stage, replace the single assignee | `reply` |
| `fork` | new independently closable scope | create linked Issue with its own owner and `Done when`; parent state remains honest | `report` |
| `settle` | current scope ends | settlement block, promotion path, closure or `awaiting-record` | `settle` |

The verbs show the selected transition and exact native mutations in the existing author-signoff preview. A compact transition line may be included for human legibility, but no reducer finding or obligation depends on parsing it; partial mutation is guarded by the writing verb's immediate native-state read-back.

### Legal handoff matrix

A same-scope handoff is authorized only when performed by the current assignee or the stable settlement seat. It may change the assignee while the Issue is in the plain `act` state or `needs-input`; it may not bypass a protected disposition chain.

| Current state | Generic handoff allowed? | Legal exit |
|---|---|---|
| plain assigned `act` | yes | replace the single assignee; keep plain stage unless requested input is now the explicit next action |
| `needs-input` | yes, within the same scope | reassign who must provide the requested input, or deliver the answer and use the existing answer transition |
| `awaiting-acceptance` | no | only the acceptor may accept, dispose, or send back to `needs-input` |
| `awaiting-record` | no | only the completed Decision recording chain may remove the stage |

The same response that provides input never accepts itself, and a generic handoff never erases a pending acceptance or recording duty.

### Role model

| Role | Stability | Representation |
|---|---|---|
| Current action owner | changes when the baton moves | exactly one native assignee on an action-bearing Issue |
| Acceptor / settlement seat | stable for the Issue scope | object authority from the creation contract; shown in structured prose when not the author |
| Recorder | temporary only when a Decision is required | `awaiting-record` plus reassignment |
| Reviewer | bound to an exact diff and review round | native requested reviewer on the PR |
| Notification route | delivery-only, never authority | GitHub login initially; optional private alias later |

`fyi` objects have no action owner. Discussion hosts provide context and settle the Discussion; bounded action is forked into Issues rather than assigned to the Discussion itself.

## Implementation approach

### Step 1 — ratify the conversation lifecycle as one shared contract

1. Add `docs/adr/120-relay-conversation-lifecycle.md` to record:
   - one independently closable scope per object;
   - the two-axis test for comment versus follow-up Issue and parent-open versus parent-settled;
   - the five transition names;
   - current assignee versus stable settlement authority, including the legal handoff matrix;
   - native-only reducer findings versus workspace conformance and semantic advisories;
   - scheduled reminder delivery as workspace machinery, not a fifth verb;
   - the three-way memory disposition at settlement;
   - the channel asymmetry: prevention for Relay-authored writes, native-state monitoring for all traffic, and no claim of semantic understanding for organic comments;
   - the additive 2.5.0 schema judgment and the two-release rollout.
2. Update `plugins/relay/CLAUDE.md`, the single owner of the Relay family contract, with the boundary and role model. Preserve the three-tier metadata law: native fields own responsibility, structured prose explains semantics, conformance reports health.
3. Update `docs/design/relay.md` with the target state diagram and changelog. Avoid copying procedural details owned by individual skills.
4. Explicitly refine, rather than supersede, ADR-100 and ADR-115. ADR-100's GitHub-native memory model and ADR-115's four-verb boundary remain intact.

Verification: a reader can independently decide object boundary, parent disposition, and legal baton transition without reading all four skills, and no new object type or parallel state store is introduced.

### Step 2 — release A: add the minimum deterministic lifecycle facts to digest

1. Extend live collection with the minimum native facts required for lifecycle health:
   - `createdAt` and current `updatedAt` for display only;
   - label and assignment timeline events with actor and timestamp;
   - native parent/sub-issue relationship only as optional enrichment when available;
   - stable URLs and existing comment truncation disclosure.
2. Pin `stageEnteredAt` mechanically:
   - for a currently staged Issue, take the later of the latest `LABELED` event for that present stage and the latest `ASSIGNED` event for the current assignee;
   - for a plain assigned Issue, use the latest `ASSIGNED` event for the current assignee;
   - never use generic `updatedAt`; comments and reminders do not reset age;
   - if the relevant timeline is truncated or incomplete, return `stageEnteredAt: null` and a non-blocking `stage-age-unknown` finding for that object rather than blocking the whole run.
3. Bump the reducer schema from 4 to 5 and add a top-level `findings` array, separate from `obligations`, `blockers`, and `notices`.
4. Keep the v1 finding set deliberately native-only:
   - `conflicting-stage-labels` (existing malformed state, promoted into findings while preserving backward-compatible entry metadata);
   - `stage-without-assignee`;
   - `multiple-action-owners` only for staged Issues, where Relay promises one baton;
   - `overdue-stage` only when an explicit policy input accompanies the reducer input;
   - optional native sub-issue asymmetry only if the live API proves that both directions are reliably available.
5. Emit `stageEnteredAt` and age as facts even without policy. Thresholds remain owned by the workspace; no policy input means no `overdue-stage` finding.
6. Keep prose/file health out of the reducer. Missing canonical Decision files, `Follow-ups:` parsing, and reciprocal-link conformance stay in the Accord sweep. Do not implement `handoff-native-state-incomplete` or `decision-recording-path-incomplete` in the reducer.
7. Keep `digest` permanently mechanical-tier. A semantic advisory never runs inside its door; a future separately summoned analysis or workspace job may produce advisories with evidence and confidence, but never obligations.
8. Update `presentation-and-schema.md` and tests for schema 5, non-blocking timeline truncation, optional relationship enrichment, stage age, explicit policy input, every finding, and preservation of all schema-4 obligation behavior and entry-level `malformed` metadata.
9. Build this additive unit first inside Relay 2.5.0 so workspace reminders have a stable reducer before the write-skill changes in the same release.

Verification: identical primitives plus identical policy produce identical JSON; no policy still exposes age but never invents overdue status; a new comment does not reset age; one long timeline cannot brick the run; findings never create an obligation for a person who lacks a native responsibility signal.

### Step 3 — adopt scheduled reminders in the Accord workspace

This is a separate adoption unit in the target workspace, not hidden inside the marketplace release.

1. Add a scheduled GitHub Actions job that runs the schema-5 reducer daily and on manual dispatch. Reuse the workspace's existing conformance entry point rather than create another independent bot.
2. Define stage-aware thresholds in the workspace policy/configuration layer. Start with one conservative default per action class; tune only from observed false-positive data. Age is measured from `stageEnteredAt`.
3. Publish one pinned coordination Issue whose body is rewritten idempotently as the current state, grouped as:
   - overdue obligations;
   - lifecycle findings requiring repair;
   - advisory candidates, if that later experiment is enabled.
4. Separate state from delivery. Use stable row fingerprints in the body, then post one fresh mention-bearing comment only when a row is new or its workspace-configured re-ping interval has elapsed. The comment includes current owner, source URL, action, age, and suggested repair.
5. Record the last-ping time per fingerprint on the report surface or other workspace-owned delivery metadata; it is notification history, not responsibility state. Editing the body alone is never counted as a reminder.
6. Do not auto-close, auto-reassign, or rewrite source objects. A human or an authorized Relay writing verb repairs them.
7. Launch in report-only/manual mode, review every row, then observe at least two reminder cycles before enabling the schedule or any non-GitHub channel.

Verification: identical runs do not comment before the re-ping interval; unchanged overdue debt does receive a fresh notification when cadence is due; an unrelated source comment does not reset age or cadence; resolving native state removes the row on the next run.

### Step 4 — prevent drift on Relay-authored writes

#### `report`

1. Replace “existing object -> comment there” with the two-axis preflight:
   - no independent completion condition -> route to `reply` on the current object;
   - stateable independent completion condition -> preview a linked follow-up Issue;
   - unclear condition -> ask for it or route to a Discussion;
   - separately determine whether the parent remains open or settles with the child in `Follow-ups:`.
2. For a fork, require `Origin: <URL>`, one `Done when`, one verified assignee, and reciprocal links. Reciprocal links are the v1 contract; consume native sub-issues as tolerant enrichment when available, never as a hard requirement.
3. Keep the origin assignment and stage unchanged unless an independently authorized transition also changes them. Creating a child never silently settles the parent.

#### `reply`

1. Add transition selection before drafting a response: `clarify`, `answer`, `handoff`, or `fork`.
2. Keep `clarify` comment-only and state explicitly that no responsibility moved.
3. Preserve the existing `needs-input -> awaiting-acceptance` answer path.
4. Add generic same-scope handoff under the shared authority/matrix: performer is the current assignee or settlement seat; plain `act` and `needs-input` may transfer; `awaiting-acceptance` and `awaiting-record` may not be bypassed.
5. The preview shows next action, target stage, new assignee, stable acceptor, and exact mutations. Apply comment + label + assignment as a recoverable sequence, then read native state back immediately; partial mutation is reported, never reconstructed later from prose.
6. Delegate `fork` to `report` so object creation keeps one owner.
7. If a user only says “received,” classify it as receipt; do not dispose a pending question, feature request, or settlement round.
8. Add a shared `references/` protocol for the transition table and mechanics if the body would otherwise duplicate machinery; keep behavior-changing gates resident.

Verification covers clarification, answer, authorized/unauthorized handoff, both protected stages, dependent and independent child Issues, mixed receipt + question, reciprocal links, and partial mutation read-back.

### Step 5 — strengthen settlement and make settled changes commit directly

1. Keep the current promotion test but require `settle` to answer two independent questions in its preview:
   - Does this establish or change a durable agreement? If yes, use `awaiting-record` and the existing Decision chain.
   - Did this accumulate reusable understanding that should update a Brief/Core view? If yes, identify the exact derived-file delta covered by the settlement.
2. Keep `Decision required:` and `Follow-ups:` rather than invent a second memory schema. Make the valid outcomes explicit: Resolution-only; direct Decision commit before close; or direct Decision/Brief/Core commit when the exact synthesis is already accepted.
3. Require every still-open child to appear in `Follow-ups:`. A parent may settle while children remain open because each child owns its own completion condition.
4. Define the direct commit -> push gate:
   - the designated settlement authority has explicitly accepted the disposition;
   - the exact file delta is a faithful recording of that settlement and introduces no unresolved choice;
   - the recorder is authorized to push the target branch;
   - `settle` shows the exact diff to the executing author before writing, fetches/reconciles concurrent changes, commits with the canonical author identity, pushes, and reads the remote commit back;
   - if branch protection rejects the push, stop and report the repository constraint rather than silently opening a PR or bypassing protection.
5. A separate PR is not part of the normal graduation path. Use one only when the exact diff still needs review, the user explicitly asks for one, or repository protection makes it mandatory. Conceptual agreement alone does not make an unreviewed implementation delta settled.
6. Put prose/file checks in the Accord conformance sweep: reciprocal origin/follow-up links, a resolvable canonical record for `Decision required: Yes`, and every claimed Brief/Core update resolving to a pushed commit.
7. Land Steps 4–5 in the same Relay 2.5.0 release as schema 5; one version bump refreshes installed plugin snapshots after the complete lifecycle is green.

Verification: closure cannot claim repository graduation without a real pushed commit linked in both directions; an exact settled change needs no duplicate PR; a merely conceptual agreement cannot smuggle new wording or implementation choices into a direct push.

### Step 6 — project, verify, and dogfood the release

1. Bump `plugins/relay/.claude-plugin/plugin.json` to 2.5.0, update `plugins/relay/CLAUDE.md`, `README.md`, and bilingual `docs/site/index.html`, bump the site audit revision, and add a FIXED entry.
2. Run all generators from source owners; never edit `.agents/skills/`, root `AGENTS.md`, Cursor projections, or derived manifest versions directly.
3. Run validators after each release unit. Dogfood against anonymized fixtures for a clean single-scope thread, a same-scope handoff, a dependent child, an independent follow-up, stale native state, and truthful memory graduation.
4. Keep live Accord mutations as a separate repository commit. The marketplace release and workspace adoption remain independently reviewable and reversible even when completed in one execution session.

## Critical files

| File | Purpose | Step |
|---|---|---|
| `docs/adr/120-relay-conversation-lifecycle.md` | Ratifies the lifecycle boundary and why four verbs remain enough | 1 |
| `plugins/relay/CLAUDE.md` | Single owner of Relay-wide scope, role, metadata, and transition law | 1 |
| `docs/design/relay.md` | Human-facing architecture and lifecycle diagram | 1, 6 |
| `plugins/relay/skills/report/SKILL.md` | Owns fork routing and new child creation | 4 |
| `plugins/relay/skills/reply/SKILL.md` | Owns clarify, answer, and same-scope handoff | 4 |
| `plugins/relay/skills/digest/SKILL.md` | Read-only native findings presentation contract | 2 |
| `plugins/relay/skills/digest/scripts/compute-state.mjs` | Deterministic collection and schema-5 reducer | 2 |
| `plugins/relay/skills/digest/scripts/compute-state.test.mjs` | Regression and lifecycle-state fixtures | 2–5 |
| `plugins/relay/skills/digest/references/presentation-and-schema.md` | Schema and output field documentation | 2 |
| `plugins/relay/skills/settle/SKILL.md` | Owns settlement authority and graduation questions | 5 |
| `plugins/relay/skills/settle/references/templates.md` | Settlement and Decision templates | 5 |
| `plugins/relay/.claude-plugin/plugin.json` | Version and plugin-description owner | 6 |
| `README.md` | Public skill summary and invocation surface | 6 |
| `docs/site/index.html` | Bilingual public map and release history | 6 |
| target Accord workflow and conformance files | Own scheduled delivery, thresholds, and prose/file health | 3 and 5, separate repo |

## Single-source-of-truth owners

| Decision | Owner |
|---|---|
| Scope boundary, role meanings, and transition vocabulary | `plugins/relay/CLAUDE.md` |
| Rationale and compatibility consequences | `docs/adr/120-relay-conversation-lifecycle.md` |
| Fork/new-object operation | `plugins/relay/skills/report/SKILL.md` |
| Existing-object transition operation | `plugins/relay/skills/reply/SKILL.md` |
| Deterministic obligation/finding schema | `plugins/relay/skills/digest/scripts/compute-state.mjs` |
| Human presentation of reducer output | `plugins/relay/skills/digest/SKILL.md` and its schema reference |
| Settlement and formal-memory disposition | `plugins/relay/skills/settle/SKILL.md` |
| Reminder thresholds and delivery destination | Accord workspace configuration/workflow |
| Action identity | GitHub native account/assignment |
| Optional external notification route | future private deployment configuration, never the public roster by default |

## Verification

### Automated

1. `node --test plugins/relay/skills/digest/scripts/*.test.mjs`
2. `node scripts/build-manifests.mjs`
3. `node scripts/build-codex.mjs`
4. `node scripts/build-cursor.mjs`
5. `node scripts/validate-codex-skills.mjs`
6. `git status docs/site/index.html README.md` — both surfaces must reflect the material behavior change.

### Contract scenarios

1. **Same scope, same owner:** clarification comment; no native transition.
2. **Same scope, different owner:** handoff comment + label/assignee update; stable acceptor.
3. **New dependent scope:** the matter has its own completion condition, so it gets a linked child; the origin remains open for its own unmet `Done when`.
4. **New independent scope:** linked Issue; origin may settle with the child in `Follow-ups:`.
5. **Mixed receipt and question:** receipt does not complete the owned question.
6. **Malformed native state:** findings report it without inventing a different obligation.
7. **Human bypass:** native assignment/stage age still receives scheduled coverage; semantic drift in an unstructured comment is not mislabeled deterministic and causes no automatic owner mutation.
8. **Reminder age:** stage timeline, not Issue `updatedAt`, controls overdue state.
9. **Graduation:** Resolution-only, Decision, and derived synthesis each produce truthful evidence; settled repository changes end in a remotely readable commit without an unnecessary PR.
10. **Reviewer stability:** follow-up work does not keep rewriting a historical PR review request.

### End-to-end adoption

After Relay 2.5.0 is installed, run the Accord scheduled workflow manually against current state in report-only mode. Review every proposed overdue/finding row with the repository owner, then enable the daily schedule with cadence-controlled comments. Do not enable email routing or automatic repairs in the same rollout.

### Completion evidence

- Relay 2.5.0 is on the marketplace default branch; all 84 reducer tests and the full Claude/Codex/Cursor compatibility validator pass.
- The target workspace adopted a pinned reducer runtime, explicit threshold policy, standing pinned report, cadence state, canonical-commit conformance, and six local delivery/parser tests in a separate pushed commit.
- A live mixed-scope dogfood Issue was split into a linked `needs-input` child with its own assignee and completion condition; the original scope settled independently with `Resolution:` and `Follow-ups:`.
- The scheduled workflow was invoked twice. The first run created and pinned the standing report and delivered the overdue mentions; the immediate second run reported zero reminders and added no duplicate comment.
- GitHub identity remains the notification target; the workspace's separate git-email field remains authorship-only. No email delivery, semantic comment parser, or automatic source-object mutation was enabled.

## Deferred experiments

### Semantic drift advisory

Run only after deterministic findings are useful. Use a strong judgment model on a bounded candidate set, with the whole object and native timeline as evidence. Its output must include confidence, source comment URLs, and one suggested transition (`clarify`, `handoff`, `fork`, `settle`). Measure precision against human review before any scheduled notification. It never becomes an obligation source without a separate ADR.

### External email notification

If GitHub-native reminders are insufficient, add a private mapping from canonical GitHub login to delivery endpoint in repository/environment secrets or an external notifier. Do not reuse `git.email` as notification consent, do not commit personal addresses to the public skills repository, and do not let delivery aliases affect assignment or settlement authority.

## Out of scope

- A fifth Relay skill or a new GitHub object type.
- Parsing arbitrary prose into authoritative obligations.
- Auto-reassignment, auto-closure, or automatic child creation from an advisory guess.
- Treating a Discussion as a permanently assigned task board.
- Building a parallel Relay database; GitHub remains collaboration state and repository artifacts remain formal memory.
- Enabling email/SMS/Slack delivery in the first rollout.
- Editing the live Accord workspace as part of the marketplace implementation without a separate preview and authorization.
- Retroactively rewriting every historical thread. Existing objects are repaired only when they become active or appear in findings.

## Independent review resolution

Claude Code reviewed this plan against the full Relay contract, all four skills, the reducer/tests, ADR-100, ADR-115, and the design document. Its verdict was **approve with amendments** (approximately 0.85 confidence on doctrine and 0.7 on unprobed GitHub API feasibility). The final plan adopts these load-bearing corrections:

1. schema 5 is additive and ships as 2.5.0 while preserving schema-4 fields;
2. the continuation boundary is two axes, not one closure question;
3. handoff authority and protected stage exits are explicit;
4. reducer findings are native-only, threshold policy is an explicit workspace input, and truncated timelines degrade per object;
5. reciprocal links are the v1 fork contract; native sub-issues are tolerant enrichment;
6. reminders use a pinned state Issue plus cadence-controlled fresh comments, because editing a body does not re-notify;
7. deterministic digest/reminders ship before write-skill refinements because organic GitHub traffic is the dominant channel;
8. semantic analysis stays outside mechanical-tier `digest`.

The review explicitly rejected a fifth skill, prose-parsed obligations/findings, automatic repair, mandatory native sub-issues, a major version bump, and a hard error for every plain multi-assignee Issue. Those rejections are reflected above rather than left as open implementation questions.
