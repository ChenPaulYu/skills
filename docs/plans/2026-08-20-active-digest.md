# Active Relay Digest Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `relay:digest` produce a session-ready inbox summary and recognize generated `relay-triage` Issues as wrappers rather than duplicate source obligations.

**Architecture:** Keep the reducer deterministic and read-only. Add an additive schema-6 `inbox` summary for the current viewer and a `triage` array for open generated wrappers; source Issues remain the authoritative obligations, while wrapper Issues are surfaced separately and never counted as source work. Update the skill contract, Relay plugin contract, ADR, generated mirrors, and release surfaces together.

**Tech Stack:** Node.js ESM, Node built-in test runner, GitHub GraphQL fixtures, Markdown skill contracts, generated Codex/Cursor mirrors and manifests.

---

### Task 1: Specify the active digest contract

**Files:**
- Create: `docs/adr/121-relay-active-digest-inbox-and-triage.md`
- Modify: `plugins/relay/skills/digest/SKILL.md`
- Modify: `plugins/relay/skills/digest/references/presentation-and-schema.md`
- Modify: `plugins/relay/CLAUDE.md`

**Steps:**

1. Write ADR-121: session-start preflight, source obligations versus generated triage wrappers, escalation ownership, and the read-only boundary.
2. Update the digest skill to require an inbox-first presentation: open obligation count, overdue count, oldest overdue item, and first native action. State that “seen” is not completion.
3. Document `schemaVersion: 6`, `inbox`, and `triage` fields, including the fact that triage wrappers are not included in `obligations`.
4. Update Relay’s lifecycle/reminder contract to point to the new reducer output and preserve the workspace delivery boundary.

### Task 2: Add reducer tests for triage wrappers and inbox summary

**Files:**
- Modify: `plugins/relay/skills/digest/scripts/compute-state.test.mjs`

**Steps:**

1. Add a failing test proving an open `relay-triage` Issue assigned to the viewer appears in `triage`, not `obligations`.
2. Add a failing test proving ordinary assigned Issues remain obligations beside a triage wrapper.
3. Add a failing test for the inbox summary: counts, oldest overdue source Issue, and first action sorted by overdue age before ordinary work.
4. Run `node --test plugins/relay/skills/digest/scripts/compute-state.test.mjs` and confirm the new tests fail before implementation.

### Task 3: Implement schema-6 reducer behavior

**Files:**
- Modify: `plugins/relay/skills/digest/scripts/compute-state.mjs`

**Steps:**

1. Bump `SCHEMA_VERSION` to 6 and add an `isRelayTriageObject` helper based only on the native `relay-triage` label.
2. Collect assigned open triage wrappers into `triage`, skip their ordinary obligation and notice paths, and leave source Issues untouched.
3. Sort source obligations with overdue assigned Issues first, then the existing kind/url ordering.
4. Emit `inbox` with `openObligationCount`, `overdueCount`, `oldestOverdue`, `firstAction`, and `triageCount`; all values derive from the reduced native state.
5. Keep blocked and unresolved-viewer results schema-complete with empty `inbox` and `triage` fields.
6. Run the focused test file and confirm all tests pass.

### Task 4: Regenerate release surfaces and validate

**Files:**
- Modify: `plugins/relay/.claude-plugin/plugin.json`
- Generate: manifests, Codex mirrors, Cursor mirrors, `AGENTS.md`, and marketplace projections
- Modify: `README.md`
- Modify: `docs/site/index.html`

**Steps:**

1. Bump Relay from `2.5.1` to `2.5.2` because the skill contract and reducer schema changed.
2. Run `node scripts/build-manifests.mjs` and `node scripts/build-codex.mjs`.
3. Update the README and bilingual site map with schema 6, inbox-first digest behavior, ADR-121, and the new version; regenerate Cursor projections with `node scripts/build-cursor.mjs` if required by the validator.
4. Run `node plugins/relay/skills/digest/scripts/compute-state.test.mjs` and `node scripts/validate-codex-skills.mjs`.
5. Run `git diff --check`, inspect the complete diff, and verify no unrelated files changed.
6. Commit all source, generated, documentation, and release-surface changes together.
