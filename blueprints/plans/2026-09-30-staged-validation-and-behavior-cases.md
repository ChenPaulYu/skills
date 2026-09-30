# Staged validation and behavioral cases — plan

> Generated: 2026-09-30 · Source: owner-approved follow-up review · Grounding: `e0236b8`, clean worktree and unchanged upstream

Status: implemented and verified. Evidence: `docs/findings/2026-09-30-behavior-cases.md`.

Verification: 123 offline tests passed; normal marketplace and blueprint checks passed;
the actual staged candidate passed both validators in its temporary snapshot. Four fresh
task runs met their core criteria, with two reporting defects retained in the findings.

## Context

The root guide still calls retired Relay thought frontmatter an enforced contract. Shape's
browser fallback still prescribes a fixed chooser even when another available tool can do
the work. Pre-commit validates the worktree, so unstaged repairs can hide a broken staged
snapshot. Skill instruction canaries protect translation but do not demonstrate that an
agent completes a real document batch or respects the requested write boundary.

## Resolved questions

- Keep all 24 skill entrances and existing external-action/recoverability boundaries.
- Validate the complete Git index snapshot, not a partial-stage prohibition. Unrelated
  unstaged and untracked work must remain untouched and must not affect the verdict.
- Reuse the existing marketplace and blueprint validators inside the snapshot.
- Four isolated, explicitly selected skill trials cover a full docs batch, reconcile,
  check-only docs, and an authorized edit. Each trial has a fresh executor context with
  no expected answers; the session model reviews artifacts and reports evidence limits.
- Keep model runs opt-in and separate from ordinary pre-commit/offline tests. This is
  completion regression evidence, not an automatic-routing or before/after study.

## Approach

1. Correct the root contract list and the obsolete browser chooser. Preserve explicit
   permission for installation and honest reporting when verification cannot run.
2. Add one staged-validation module plus a thin CLI. Freeze the index as a Git tree,
   materialize its blobs in a temporary directory without export-ignore or checkout
   filters, and run the staged validator scripts there. Preserve file modes and safe
   internal symlinks; reject unresolved merges, unavailable submodule content, and
   escaping or unresolved symlinks explicitly. Clear inherited Git hook environment for child checks.
   Recheck the index tree before success and always remove the temporary snapshot.
3. Replace the hook's direct worktree checks with that CLI. Test partial staging in both
   directions, missing/untracked inputs, alternate indexes, path handling, and cleanup.
4. Add four reusable fixture cases with a prepare/check command. Store expectations outside
   the trial workspace, record baseline file hashes, and run deterministic output checks
   separately from a human/session-model rubric. Untested runs must not be called passes.
5. Execute four fresh task runs in isolated workspaces, review their changes and commands,
   record outcomes, and correct only demonstrated in-scope failures if needed.
6. Update ADR-133, documentation, versions, generated artifacts, and installation copies.
   Run targeted tests, normal marketplace validation, blueprint and whitespace checks,
   and exercise the staged gate on the actual staged change before committing locally.

## Critical files

| File | Role and change |
|---|---|
| `CLAUDE.md`, `plugins/shape/CLAUDE.md` | Current contracts and scope-aware browser fallback |
| `scripts/hooks/pre-commit` | One caller of staged validation |
| `scripts/validate-staged.mjs`, `scripts/lib/staged-validation.mjs` | Exact index snapshot and validator execution |
| `scripts/lib/staged-validation.test.mjs` | Real temporary Git repositories exercising staging behavior |
| `scripts/skill-behavior.mjs`, `scripts/fixtures/behavior/` | Reproducible trial setup and observable outcome checks |
| `docs/findings/2026-09-30-behavior-cases.md` | Actual task-run evidence and limitations |

## Verification

The same staged bytes must decide success regardless of unstaged edits; failed checks must
leave the index and worktree unchanged. A broken staged generated file must fail even if the
working copy was repaired. Exercise the real hook as well as the snapshot module.

Behavior cases check complete document coverage, preserved historical/accepted decisions,
unchanged files for a check-only request, and successful implementation/test changes under
existing authority. Review final response and actual artifacts, not worker claims alone.
Record executor identity, independent contexts, selected skill, and one-sample limits.

## Out of scope

New skills, a workflow router, broad source refactors, scheduled paid evaluation, publishing,
remote push, Git history cleanup, or deciding the separate private/public repository policy.
