# Relay GitHub-native redesign and legacy-repo migration — plan

> Generated: 2026-07-21 · Spec source: `blueprints/mockups/2026-07-21-relay-github-workflow/index.html` plus the ratified conversation · Stage 1: fresh

## Context

Relay currently owns a complete file-based coordination protocol. Its operative contract is concentrated in `plugins/relay/CLAUDE.md:7`, including a separate content repo, `relay.yml`, per-project `thoughts/`, an append-only decision ledger, and a custom awareness loop. The six current skill doors implement that protocol: `launch`, `report`, `review`, `digest`, `settle`, and `format`. `digest/scripts/compute-state.mjs` mechanically reconstructs thread state, while Codex-specific build and compatibility code installs a SessionStart hook that discovers a Relay content repo and runs that helper.

The accepted replacement is deliberately thinner: GitHub owns collaboration objects and their state; Relay owns only the semantics GitHub does not provide reliably. One Relay workspace is one GitHub repository. The daily interface is six verbs — `launch`, `report`, `digest`, `reply`, `brief`, and `settle` — plus an explicit-only `migrate` compatibility bridge for old Relay repositories. Raw evidence stays in GitHub Discussions, Issues, pull requests, comments, reviews, reactions, and timelines. `briefs/` holds small cited current syntheses; `core/` holds only binding truth that is effective now.

This is a strategy reversal, not a copy edit. ADR-061 currently requires Relay to remain git-native and treats GitHub-native Relay only as a shelved competitive bar. A new ADR must explicitly supersede that ruling and explain why the product and substrate assumptions changed. Earlier ADRs remain historical evidence; live descriptions and contracts move to the new model.

Grounding against the private legacy coordination repo found a single active legacy project with a mixture of settled decisions, closed/FYI threads, and unresolved obligations. The current helper also produces at least one false waiting item from FYI-shaped traffic. Migration therefore cannot be a blind one-record-to-one-object conversion. The safe rule is: preserve all legacy evidence in immutable git history, promote only current reusable knowledge, and create GitHub objects only for obligations that are still alive.

Intent in one sentence: **replace Relay's parallel coordination database with a compact GitHub-native semantic layer, then migrate the legacy repo without losing provenance or carrying obsolete protocol state forward.**

## Resolved questions

| Question | Decision |
|---|---|
| What is the v1 workspace boundary? | One Relay workspace equals one GitHub repository; cross-repo aggregation is out of scope. |
| What are the daily skills? | `launch`, `report`, `digest`, `reply`, `brief`, and `settle`. |
| What happens to `review`? | Rename and reshape it to `reply`; formal PR review is one GitHub action selected by the broader human intent. |
| Is `brief` independent? | Yes. It owns currentness, source citations, `briefs/README.md`, safe reorganization, and retirement; it never closes an object or changes Core. |
| What happens to `format`? | Rename it to explicit-only `migrate`. It is a v0-to-v1 compatibility bridge, not a seventh daily verb. |
| Does v1 keep a custom state store? | No database, Relay frontmatter, `relay.yml`, `thoughts/`, or decision ledger. GitHub state is authoritative. |
| Does Codex keep the SessionStart digest hook? | No. GitHub notifications provide ambient awareness; `digest` is explicitly invoked for the reliable actionable view. |
| How is legacy raw evidence preserved? | Create an immutable baseline tag/commit permalink, then remove the obsolete protocol tree from the default branch after migration. Do not duplicate every old thought into GitHub. |
| What must future agents receive? | Repository guidance that explains the six skills, the object router, the Raw/brief/Core authority model, and the ACK rule. |
| How does the counterpart confirm the new rules? | A named `[ACK]` Announcement Discussion remains actionable until the designated person adds a `👀` reaction after reading the new guidance. |

## Approach

### Track A — rebuild the Relay plugin

#### Phase A0 — protect the working base and freeze the accepted design

1. Re-run `git fetch origin && git log --oneline HEAD..origin/main` immediately before the first implementation edit.
2. Preserve unrelated worktree changes; do not touch generated `.agents/skills/nav-do/` or its source counterpart.
3. Treat `blueprints/mockups/2026-07-21-relay-github-workflow/index.html` as the accepted behavioral source for event routing, skill boundaries, storage layers, and compactness decisions.
4. Implement the marketplace redesign as one atomic Relay release change. Because every plugin-content commit requires a version bump and synchronized public surfaces, do not commit half-migrated skill prose between phases A1-A5.

#### Phase A1 — replace the protocol owner and supersede the old strategy

1. Add `docs/adr/090-relay-github-native.md`.
   - Explicitly supersede ADR-061 and the live portions of ADR-050/053/054/055/078 that define the old substrate, roster, thought stream, ledger, and format sweep.
   - Preserve those older ADRs unchanged as history.
   - Record the compact boundary: GitHub owns objects/state; Relay owns routing, obligation semantics, authority checks, read-after-write verification, synthesis policy, and settlement.
   - Record six daily verbs plus the explicit-only migration bridge.
   - Explain removal of the Codex startup hook and the one-repository v1 limit.
2. Rewrite the live design in `docs/design/relay.md`; keep its dated historical changelog intact, but make the current architecture lead.
3. Replace `plugins/relay/CLAUDE.md` with the new operative contract. It must own, once:
   - the Discussion/Issue/PR router;
   - FYI versus explicit ACK;
   - assignment, decision-owner, requested-reviewer, and authority semantics;
   - `reply` versus `settle`;
   - Raw GitHub versus `briefs/` versus `core/`;
   - accepted versus effective timing;
   - one required approver in v1;
   - partial-failure recovery by existing URL;
   - the migration compatibility boundary.
4. Remove every live claim that Relay requires a separate content repo, `$RELAY_REPO`, cached paths, `relay.yml`, `project.yml`, thought frontmatter, or an append-only decision ledger.

#### Phase A2 — reshape the seven installed doors into six daily verbs plus one bridge

1. Rewrite `plugins/relay/skills/launch/SKILL.md` as setup/audit for the current GitHub repository.
   - Verify Discussions/categories, authenticated identity, permissions, CODEOWNERS, rulesets, required review, stale-approval dismissal, and unauthorized bypass.
   - Configure only after showing the intended mutations and receiving approval.
   - Read the settings back; silent assignment/reviewer failures block completion.
2. Rewrite `plugins/relay/skills/report/SKILL.md` around human intent and the three-question router.
   - Discussion when completion/ownership is still open.
   - Issue when completion and one accountable owner/decider are clear.
   - PR when an exact reviewable diff exists.
   - Split independently completable asks into linked objects.
   - Set assignee or requested reviewer where appropriate, then read back the actual state.
   - If a later mutation fails, return the created URL plus missing steps; retries resume that object and never create a duplicate.
3. Rewrite `plugins/relay/skills/digest/SKILL.md` as a read-only actionable view over GitHub.
   - Include missing explicit ACKs, assigned decision items, outstanding PR verdicts on the current revision, re-review needs, and items waiting for `settle`.
   - Exclude FYI, prose mentions, completed rounds, and ordinary notifications.
   - State the three consumption tiers: helper available, readable GitHub state without helper, and unavailable/auth-blocked with a precise degradation report.
4. Rename `plugins/relay/skills/review/` to `plugins/relay/skills/reply/` with `git mv`, then rewrite its `SKILL.md`.
   - Map intent to `👀`, Discussion answer, Discussion/Issue comment, PR Comment, Approve, or Request changes.
   - Keep formal verdicts bound to the current PR revision.
   - Completion means the selected response exists on the correct object/revision; it never implies the whole object is finished.
5. Add `plugins/relay/skills/brief/SKILL.md`.
   - Trigger only when one or more Raw objects contain understanding that must stay current across future contexts and no single object's final resolution is a sufficient home.
   - Create, update, or retire one brief; maintain citations and `briefs/README.md`; reorganize only under the accepted stable-topic rules.
   - Use a normal branch/PR and git history; do not invent brief metadata, status files, time buckets, or an archive directory.
6. Rewrite `plugins/relay/skills/settle/SKILL.md` as authorized closure/effectivity.
   - Write a self-contained final resolution with outcome, decision, effective point, and follow-up link where needed.
   - Close Discussions/Issues only after validating the decision authority.
   - Merge a Core PR only when the current revision has the required valid approval and repository rules make that approval meaningful.
   - Never author a brief, substitute for approval, or re-decide the issue while settling.
7. Rename `plugins/relay/skills/format/` to `plugins/relay/skills/migrate/` with `git mv` and replace its contents.
   - Mark `explicit-invocation-only: true`; this bridge must never auto-trigger on ordinary Relay use.
   - Inventory a legacy Relay repo, classify each source into preserve-only / brief / Core candidate / live Discussion / live Issue / live PR, and present the mapping before mutation.
   - Preserve legacy sources by immutable git reference, use GitHub permalinks for provenance, and make execution idempotent.
   - Remove the old frontmatter linter; migration is semantic and gated, not a format sweep.

#### Phase A3 — keep one deterministic helper: GitHub obligation computation

1. Replace `plugins/relay/skills/digest/scripts/compute-state.mjs`; do not add a second state engine.
2. Give the helper one narrow interface: resolve repository/viewer, collect GitHub primitives through authenticated `gh` commands, reduce them to normalized obligations, and emit JSON for `digest`.
3. Keep collection and reduction separable inside the same module so fixture input can test semantics without network access.
4. Cover exactly the correctness-critical cases:
   - `[ACK]` recipient without that person's `👀` reaction;
   - assignment that genuinely belongs to the viewer;
   - requested review that disappeared after Comment but still lacks a verdict;
   - stale approval/current-revision mismatch and re-request need;
   - Decision Issue lacking an authorized final resolution;
   - duplicate signals collapsing to one obligation;
   - mention-only and FYI traffic producing no obligation.
5. Add a small synthetic test fixture and `compute-state.test.mjs`. Use placeholders only; no private repo names, handles, titles, or source text.
6. If `gh`, authentication, permission, or a required API surface is missing, exit with a machine-readable blocked reason; never guess from notification prose.

#### Phase A4 — retire the host-specific SessionStart awareness layer

1. Remove the owned Relay hook templates under `platforms/codex/hooks/` and their generated `.codex/hooks*` destinations when no other owned hook remains.
2. Remove the Relay-specific session-open lowering/injection path from `scripts/lib/codex-compat.mjs` and `scripts/build-codex.mjs`.
3. Remove the session-hook validation and exact-file drift assumptions from `scripts/lib/codex-compat-audit.mjs` and `scripts/validate-codex-skills.mjs`.
4. Delete or rewrite the SessionStart canaries, negative fixtures, hook smokes, preservation expectations, and release-smoke expectations that exist only for the retired hook.
5. Update `platforms/codex/manifest.json` so it no longer promises or freezes the hook artifacts. Preserve unrelated Codex agent/runtime contracts.
6. Verify the generator no longer creates, deletes, or rewrites user-owned hook configuration merely because Relay is installed.

#### Phase A5 — release surfaces, registrations, and generated projections

1. Bump Relay `0.8.1 -> 1.0.0` in `plugins/relay/.claude-plugin/plugin.json`; this is an intentional breaking protocol release.
2. Update the manifest description to name the six daily verbs and the explicit migration bridge without describing obsolete file formats.
3. Update the hand-owned Relay marketplace description in `.claude-plugin/marketplace.json`, then run `node scripts/build-manifests.mjs` for derived versions and Cursor projection.
4. Update `platforms/codex/descriptions.json`: remove `relay-review`/`relay-format`, add `relay-reply`/`relay-brief`/`relay-migrate`, and keep each trigger boundary lean.
5. Update both mandatory human surfaces in the same commit:
   - `README.md`: plugin summary, skill roster, invocation category, counts, and examples;
   - `docs/site/index.html`: bilingual Relay card/nodes/edges, six-daily-plus-bridge distinction, version, skill counts, audit date/revision, ADR count, and a FIXED entry.
6. Run `node scripts/build-codex.mjs`; confirm generated `.agents/skills/relay-*`, root `AGENTS.md`, and other owned projections match the source skills.
7. Run the full validator before the single release commit. Its output must be green with no stale `relay-review`, `relay-format`, hook, or old-protocol registrations.

#### Phase A6 — forward-test the new plugin before touching legacy data

1. Use a disposable GitHub sandbox repository; never probe against the legacy coordination repo first.
2. Exercise the accepted scenarios end to end:
   - pure FYI;
   - explicit ACK and sender-visible completion;
   - Q&A answer;
   - Decision Issue with authorized disposition;
   - PR Comment that does not falsely complete review;
   - Approve/Request changes on the current revision;
   - stale approval followed by re-request;
   - Core merge as effective time;
   - partial mutation failure resumed from the existing URL;
   - create/update/retire a brief without changing Core.
3. Run `digest` after every transition and compare its obligations with the expected set. Zero false completion and zero mention-created obligation are release gates.
4. Forward-test `migrate` against an anonymized fixture copy, not the private source repo, before using it live.

### Track B — renovate the legacy coordination repo

#### Phase B0 — preflight and preservation

1. Run the new `launch` read-only audit against the repository and resolve every missing permission/category/ruleset prerequisite before migration.
2. Confirm the counterpart can receive an ACK, act as the one decision owner/required approver, and leave a review that counts under the repository rules.
3. Record the exact pre-migration commit and create an immutable baseline tag such as `relay-v0-final`; push it before removing any legacy path from the default branch.
4. Produce permanent GitHub permalinks to that baseline for every legacy source that a new brief/Core document will cite.

#### Phase B1 — inventory and mapping gate

1. Invoke explicit `migrate` in audit-only mode.
2. Classify every legacy thread, ledger entry, Core file, and asset without mutating either git or GitHub:

   | Legacy item | Default v1 action |
   |---|---|
   | Settled/FYI history with no current reuse | Preserve at baseline only |
   | Reusable current understanding | Create/update one cited brief |
   | Binding truth that is effective now | Propose an exact Core PR |
   | Open exploration/question | Create a Discussion |
   | Open item with one owner and completion condition | Create an Issue |
   | Exact implementation/doc change | Create a PR |
   | Obsolete or superseded decision | Preserve in history; exclude from current Core |
   | Legacy asset | Preserve at baseline; copy only when a current brief/Core document truly needs it |

3. Treat the old decision that Relay must remain its own platform as superseded by ADR-090; do not silently carry it into new Core.
4. Show the complete proposed mapping, destination titles, citations, assignees/reviewers, and deletion set. Wait for explicit approval before the first live mutation.

#### Phase B2 — establish the new small document surface

1. Create root `core/` with only current binding truths that people and agents may act on now. Do not migrate the whole old decision ledger.
2. Create `briefs/README.md` as the sole owner of brief navigation and organization rules, then create only the briefs justified by the B1 mapping.
3. Keep `briefs/` flat initially. The accepted agent self-organization rule may create topic folders later only when at least three stable, usually co-read briefs justify it; moves use `git mv` and update every link in one PR.
4. Put the document bootstrap into a protected PR with the required reviewer. Link each load-bearing claim to an immutable legacy permalink or a new GitHub object.
5. Merge only after the current revision has a valid approval; the merged `core/` becomes effective immediately.

#### Phase B3 — recreate only live collaboration state

1. Create GitHub Discussions for still-open exploration or questions; use Q&A only when an accepted answer is the real completion condition.
2. Create Decision Issues only where one named decision owner and a completion condition exist. Use one assignee as the v1 decision owner; do not overload assignee with multiple roles.
3. Create PRs only for exact diffs. Request the single required reviewer and verify the request was accepted by GitHub.
4. Put legacy provenance links in each new object. Never use `Closes` from a partial/cross-cutting child object that could end the parent too early.
5. Record each created URL in the migration mapping. A retry repairs that URL; it never creates a second object.

#### Phase B4 — teach future agents and require human acknowledgment

1. Rewrite the repository's agent guidance and README in its existing language. Future agents must see, near the top:
   - `launch`: setup/audit the repository;
   - `report`: route a new intent to Discussion/Issue/PR and establish responsibility;
   - `digest`: show only real obligations;
   - `reply`: respond with ACK/answer/comment/formal PR verdict;
   - `brief`: maintain reusable cited understanding;
   - `settle`: close with authority or make an approved Core change effective;
   - `migrate`: explicit compatibility work only, not daily use.
2. Include the object router, `mention != obligation`, `comment != approval`, `closed != decided`, and `Core = true now` rules.
3. Point agents to `briefs/README.md` for brief organization and to `core/` for binding truth. Make clear that Raw is GitHub itself; there is no new `raw/` folder.
4. Through `report`, create one `[ACK]` Announcement Discussion addressed to the counterpart. It must link the new guidance and ask for a `👀` reaction only after the rules have been read.
5. Verify with `digest` that the ACK is pending before the reaction and disappears only after the designated account reacts. A mention, notification read-state, or comment from another account does not complete it.
6. Leave the ACK object open/pending if the counterpart has not responded by handoff; pending human acknowledgment is an explicit migration result, not a reason to fake completion.

#### Phase B5 — remove the obsolete active-tree protocol and hand off

1. After B2-B4 objects and docs exist, open a final cleanup PR that removes `relay.yml`, project membership files, `thoughts/`, the decision ledger, and obsolete legacy-only guidance from the default branch.
2. Do not create `legacy/`, `raw/`, `archive/`, monthly, quarterly, or yearly directories. The baseline tag and normal git history are the archive.
3. Before merge, prove every retained citation resolves to either a live GitHub object or the immutable legacy baseline.
4. Merge the cleanup PR under the same Core review protection.
5. Run the six daily skills once against the renovated repository and record the final state: current Core, current briefs, unresolved obligations, and pending/completed rules ACK.

## Critical files

| File | Why it matters | Touched in phase |
|---|---|---|
| `blueprints/mockups/2026-07-21-relay-github-workflow/index.html:4` | Accepted behavior and compactness decisions | Reference only |
| `docs/adr/061-relay-stays-git-native.md:1` | Current strategy that must be explicitly superseded | A1 |
| `docs/adr/090-relay-github-native.md` | New strategy, rename/addition rationale, hook retirement, migration contract | A1 |
| `docs/design/relay.md` | Human-readable current design and historical rationale | A1 |
| `plugins/relay/CLAUDE.md:7` | Single owner of the live Relay protocol | A1 |
| `plugins/relay/skills/launch/SKILL.md:6` | Repository setup/audit door | A2 |
| `plugins/relay/skills/report/SKILL.md:6` | New-intent router and verified responsibility creation | A2 |
| `plugins/relay/skills/digest/SKILL.md:7` | Actionable read model | A2-A3 |
| `plugins/relay/skills/digest/scripts/compute-state.mjs` | Sole deterministic obligation reducer | A3 |
| `plugins/relay/skills/review/` -> `plugins/relay/skills/reply/` | Breaking response-door rename | A2 |
| `plugins/relay/skills/brief/SKILL.md` | New reusable-knowledge lifecycle owner | A2 |
| `plugins/relay/skills/settle/SKILL.md:6` | Authorized closure/effectivity | A2 |
| `plugins/relay/skills/format/` -> `plugins/relay/skills/migrate/` | Explicit-only v0-to-v1 compatibility bridge | A2 |
| `scripts/lib/codex-compat.mjs:315` | Relay-specific SessionStart prose lowering/injection | A4 |
| `scripts/build-codex.mjs:56` | Generated hook ownership and mirror build path | A4-A5 |
| `scripts/lib/codex-compat-audit.mjs:23` | Hook-specific compatibility contract and fixtures | A4 |
| `scripts/validate-codex-skills.mjs:410` | Exact generated-hook drift gate | A4 |
| `platforms/codex/manifest.json:270` | Public Codex lifecycle capability promise | A4-A5 |
| `platforms/codex/descriptions.json:23` | Codex trigger metadata for renamed/new/retired skills | A5 |
| `plugins/relay/.claude-plugin/plugin.json:2` | Relay version and plugin-description owner | A5 |
| `.claude-plugin/marketplace.json` | Hand-owned marketplace blurb; version is generated | A5 |
| `README.md:98` | Required human-facing Relay roster | A5 |
| `docs/site/index.html:104` | Required bilingual map, counts, version, audit history | A5 |
| `<legacy-relay-repo>/CLAUDE.md` | Future-agent operating instructions | B4-B5 |
| `<legacy-relay-repo>/README.md` | Human onboarding and repository purpose | B4-B5 |
| `<legacy-relay-repo>/core/` | Current binding truth | B2 |
| `<legacy-relay-repo>/briefs/README.md` | Brief navigation and organization-rule owner | B2 |
| `<legacy-relay-repo>/relay.yml` and `projects/` | Legacy protocol removed from the default branch only after preservation/migration | B0-B5 |

## Single-source-of-truth owners

| Decision (changes as one unit) | Owner |
|---|---|
| Relay's GitHub-native protocol and skill boundaries | `plugins/relay/CLAUDE.md` |
| Why the substrate strategy changed | `docs/adr/090-relay-github-native.md` |
| Live collaboration objects and obligation state | GitHub Discussions, Issues, PRs, reactions, reviews, and timelines |
| Mechanical obligation reduction | `plugins/relay/skills/digest/scripts/compute-state.mjs` |
| Brief organization in each Relay repository | that repository's `briefs/README.md` |
| Binding truth effective now | that repository's `core/` merged through protected PRs |
| Legacy v0 evidence | immutable pre-migration git tag/commit |
| Relay plugin version/description/author | `plugins/relay/.claude-plugin/plugin.json` |
| Codex trigger-description budget | `platforms/codex/descriptions.json` |

Adoption is explicit: A2 rewires every live skill onto the A1 protocol; A3 makes `digest` call the one reducer; A4 removes all callers and validators of the retired hook; A5 regenerates every projection. B2-B5 then consume the new skills in the real migration rather than leaving the new owners unused.

## Verification

1. **A1 contract** -> verify: `rg -n 'RELAY_REPO|relay.yml|project.yml|thoughts/|decisions/log.md' plugins/relay/CLAUDE.md docs/design/relay.md` has no live-protocol hits; ADR-090 explicitly says it supersedes ADR-061.
2. **A2 roster** -> verify: source directories are exactly `brief digest launch migrate reply report settle`; six are identified as daily verbs and only `migrate` is explicit-only. Search all live surfaces for stale `/relay:review`, `/relay:format`, old thought/ledger behavior, and unintended seven-daily-skill claims.
3. **A3 reducer** -> verify: `node --test plugins/relay/skills/digest/scripts/compute-state.test.mjs` passes all ACK/mention/review-round/authority/dedup fixtures; blocked auth input returns a blocked reason rather than obligations.
4. **A4 hook retirement** -> verify: generation and compatibility audits contain no owned Relay SessionStart command/artifact; building Codex projections leaves unrelated user hook entries/files untouched.
5. **A5 release** -> verify:
   - `node scripts/build-manifests.mjs`
   - `node scripts/build-codex.mjs`
   - `node scripts/validate-codex-skills.mjs --compat-audit`
   - `node scripts/validate-codex-skills.mjs --codex-compat`
   - `node scripts/validate-codex-skills.mjs`
   - `git status --short docs/site/index.html README.md` shows both required public surfaces changed.
6. **A6 sandbox** -> verify every scenario against the actual GitHub UI/API and record object URLs plus expected/actual digest sets. A Comment must not complete a required verdict; a changed revision must invalidate/re-request review; a mention-only FYI must never enter actionable digest.
7. **B0 preservation** -> verify the immutable baseline tag exists on the remote and can render every cited legacy file before default-branch cleanup begins.
8. **B1 mapping** -> verify every legacy source has exactly one disposition and every planned live mutation has a destination, owner/reviewer where needed, and stable provenance URL. No private details enter this public plan or fixtures.
9. **B2 documents** -> verify Core contains only effective-now rules; every brief is short, current, cited, indexed from `briefs/README.md`, and non-binding; all links resolve after the PR merge.
10. **B3 objects** -> verify only unresolved obligations became new objects, every created URL is recorded once, and retries resume rather than duplicate.
11. **B4 onboarding/ACK** -> verify a fresh agent can route one FYI, one question, one decision, one PR verdict, and one brief request from repository guidance alone. The `[ACK]` rules Discussion remains in `digest` until the designated account adds `👀`, then disappears exactly once.
12. **B5 cleanup** -> verify the default branch contains `core/`, `briefs/`, and updated guidance but no `relay.yml`, `projects/`, `thoughts/`, decision ledger, `raw/`, or `archive/`; the immutable baseline still exposes the entire old record.

End-to-end: install Relay 1.0.0 in a clean environment, launch a disposable repository, run all six daily scenarios plus one fixture migration, then use the same released skills to renovate the private legacy repo. Completion requires green marketplace gates, a clean protected migration PR chain, preserved legacy provenance, correct live GitHub obligations, future-agent guidance, and a sender-visible counterpart rules ACK (pending is allowed only when explicitly handed off as pending).

## Out of scope

- Cross-repository Relay workspaces or GitHub Projects aggregation.
- Multiple simultaneously required approvers, custom consensus matrices, or a GitHub App/custom check.
- Copying every legacy thought/comment into GitHub objects.
- Scheduled digest jobs, email delivery receipts, or replacement SessionStart hooks.
- A parallel Relay database, status frontmatter, monthly/quarterly/yearly archives, or a `raw/` directory.
- Automatic brief folder creation before the accepted stable-topic threshold is met.
- Rewriting historical ADRs to pretend the old strategy was never accepted.
- Waiting indefinitely for the counterpart's ACK before handing off; the pending obligation must remain truthful and visible instead.
