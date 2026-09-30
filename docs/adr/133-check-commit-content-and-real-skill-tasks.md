# ADR 133 — Check commit content and real skill tasks

**Status**: accepted
**Date**: 2026-09-30
**Source**: owner-approved follow-up to ADR-132.
**Amends**: the pre-commit gate, the obsolete ADR-071 contract inventory, and
shape's missing-browser-tool fallback. No skill is added or retired.

## Problem

The pre-commit hook validated the worktree. An unstaged repair could therefore hide a
broken staged mirror, while unfinished local work could block a valid commit. Packaging
canaries also did not establish whether an agent completed a real document batch or
respected a check-only request. Two instructions had become obsolete: Relay's retired
thought-frontmatter contract and shape's mandatory three-way browser-tool chooser.

## Decision

1. Freeze the active Git index with `write-tree`, materialize its raw blobs in a temporary
   directory, and run the staged marketplace and blueprint validators there. The thin
   pre-commit hook invokes `scripts/validate-staged.mjs`; the normal validator remains the
   editing-time check. Preserve executable modes and resolvable internal symlinks. Reject
   unresolved merges, unavailable submodule contents, escaping or unresolved symlinks, and
   index changes during validation. Remove the temporary snapshot on success or failure.
   Honor alternate commit indexes; clear inherited Git and Node test-runner state for
   child validators. Do not stash, reset, or rewrite the user's working files.
2. Keep four opt-in behavior cases: batch docs synchronization, record reconciliation,
   check-only docs, and an already-authorized small edit. `scripts/skill-behavior.mjs`
   prepares isolated Git fixtures and checks observable results; it never invokes a model.
   Baseline receipts and expected outcomes stay outside the task workspace. Fresh workers
   receive the task, project, and selected skill without the expected answer. The session
   model reviews artifacts, actual tool actions, and final responses against the rubric.
3. Keep paid task runs separate from offline tests and hooks. CI runs the snapshot/checker
   regression tests alongside existing catalog, reference, and Relay tests. An unchanged
   final hash or matching string alone never establishes a complete behavioral pass.
4. Identify the generated-artifact contract accurately; Relay's current reducer/schema
   owns its invariants, not the retired thought-file format. When shape's default browser
   tool is missing, use an available project-bound equivalent. Ask only for missing
   authority or a consequential scope decision; report any verification still blocked.

## Alternatives and limits

Rejecting all partial staging would remove a useful workflow. `git archive` honors
`export-ignore`, and checkout helpers may apply filters; neither guarantees the raw staged
bytes. Running working-copy validator code against staged data would still let an unstaged
validator change alter the result, so the snapshot contains the validator code too.

This is a consistency gate, not a sandbox for hostile validators. It checks the candidate
snapshot and verifies that the index still matches at completion; it does not lock out all
external Git processes. A new unsupported repository structure needs an explicit adapter,
not a silent partial check.

The four explicit-invocation samples establish narrow task evidence, not automatic routing,
cross-model reliability, or improvement caused by ADR-132. Findings record reporting defects
separately from core task success. The fixtures remain small; real use should supply future
cases before adding general workflow rules.

## Evidence

See `docs/findings/2026-09-30-behavior-cases.md` for actual task outcomes, tool-log review,
measured execution usage, offline regression checks, and known limits. Reproduction commands
live in README's validation section.
