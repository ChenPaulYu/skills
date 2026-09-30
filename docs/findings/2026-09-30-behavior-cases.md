# Skill task cases and staged validation — findings

> 2026-09-30 · ADR-133 · Four isolated task runs; no remote operations.

All four runs met their core task criteria. Two final-response defects remain recorded
below; this is not a claim that every answer was flawless or that skill slimming improved
model quality.

## Method

The fixture catalog is `scripts/fixtures/behavior/cases.json`. Each fresh worker received
only an isolated project, the selected generated skill directory, and the original task.
The parent's discussion, rubric, and expected edits were not supplied. Two workers at most
ran concurrently. They were instructed to stay inside their fixture and make no commit.
The configured executor was unavailable, so the four tasks used `gpt-6-luna` with high
reasoning effort. The session model retained judgment and reviewed the results.

Preparation stored file hashes, the fixture HEAD, and a case-catalog hash outside the
worker directory. After each run, the checker compared all non-Git files, including the
untracked mockup and packaged skill, and verified that HEAD had not changed. The session
model separately read the actual diffs, final responses, and tool-call transcripts. No
generic reapproval request appeared in any run. The check-only transcript contained no
file-writing action or writing generator invocation. Final hashes alone cannot prove that.

## Observed outcomes

| Case | Observable result | Judgment and limits |
|---|---|---|
| `docs-batch` / nav-sync | Updated README, nested usage/API docs, and generated options; preserved history and future plan. All six documents were accounted for. Tool log shows the owner generator, CLI/API examples, and link checks. | Core pass. Opening sentence incorrectly said five files; the list and later count correctly covered six. The generated source was already correct and remained unchanged. |
| `reconcile` / shape-reconcile | Marked retry plan and board shipped after checking source and running its test. Preserved the bounded-retry rationale, rejected unlimited alternative, pending offline work, priority, and untracked unsettled mockup. | Pass for this small project. It neither discarded the active decision nor claimed the whole project was finished. |
| `docs-check-only` / nav-sync | Identified stale defaults, flags, supported formats, and return type in four documents. Distinguished the historical and future notes. All files and HEAD unchanged; actual commands were read-only probes. | Core pass. The report unnecessarily suggested updating the generator's source before regenerating, although the source was already correct. No such edit occurred. |
| `authorized-edit` / nav-do | Changed the false-state label from Pending to Todo in implementation and test; retained Done. Tool log shows the test execution and diff check, with no second approval or commit. | Pass. The session model inspected both assertions and independently reran the tests. |

All four deterministic case checks passed. The retry and status tests also passed when
rerun independently by the session model. The docs worker's PATH Python failed, and it
completed the link check with Node; the final claim rests on that successful check.

The two reporting defects did not justify adding another general rule or immediately
spending on a second model run. They remain candidate regression details for future real
usage. Browser fallback was source-reviewed and checked through generated compatibility,
not tested with a live browser or missing-tool simulation in these four cases.

## Offline checker corrections and coverage

Negative tests found a real false positive in the new checker: an inherited
`NODE_TEST_CONTEXT` changed a nested Node test command's behavior, letting a deliberately
reversed label mapping appear successful. Child commands now clear that inherited context;
the negative test verifies nonzero exit and a failed result. Review also corrected source-root
path normalization so a fixture cannot be prepared inside the source repository.

The staged gate's temporary Git cases cover partial staging in both directions, staged
validator code and deletions, untracked files, alternate indexes, export-ignore, unusual
filenames, binary bytes, executable modes, symlink resolution, unresolved merges, whitespace,
cleanup, index mutation, and actual hook rejection/acceptance. These fixture validators are
deliberately small; committing this change also exercises the real marketplace validators
inside the staged snapshot.

- `node --test scripts/lib/*.test.mjs plugins/relay/skills/digest/scripts/*.test.mjs`:
  **123 passed**, zero failures or skips, on local Node 26.4.0. This includes 12 staged
  Git cases and five behavior-checker cases. CI is configured for Node 20; this local run
  does not claim that the remote CI job has run.
- Normal marketplace validation passed for **24 plugin skills** across Claude, Codex,
  and Cursor. Blueprint convention validation and staged whitespace checking passed.
- `node scripts/validate-staged.mjs` passed against this repository's actual staged
  candidate: both real validator scripts completed inside the snapshot. The index still
  matched at completion. The real-hook fixture separately verified rejection of broken
  staged content despite an unstaged repair, then successful commit after staging it.
- Shape ships as **0.24.3**. Manifests, Codex/ Cursor copies, root AGENTS.md, and public
  catalog were regenerated from their owners. The site change is audit/catalog text;
  no new browser interaction check is claimed.

## Measured worker usage

The four local session logs reported the following cumulative token usage. These are
repeated request inputs, including runtime instructions, not unique prompt sizes or a
money estimate. The failed attempt to select an unavailable executor made no task run.

| Case | Input | Cached input (subset) | Output |
|---|---:|---:|---:|
| docs-batch | 471,248 | 432,896 | 4,991 |
| reconcile | 282,847 | 269,312 | 3,429 |
| docs-check-only | 239,364 | 228,608 | 2,989 |
| authorized-edit | 236,280 | 228,608 | 1,448 |
| Total | 1,229,739 | 1,159,424 | 12,857 |

No session logs or machine paths are copied into this public repository. This single
explicit-invocation sample per task does not measure automatic skill selection, broad
production-repository coverage, comparative quality, or future reliability. The helper
does not automatically dispatch paid work on commit or in CI.
