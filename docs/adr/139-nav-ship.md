# ADR-139 — `nav:ship`: land finished work and leave the repo clean

> 2026-11-13 · Status: accepted · Builds on ADR-126 (scope-aware continuation) and ADR-109 (three-layer law). Historical plan: [implementation record](https://github.com/ChenPaulYu/skills/blob/e60bf6980718c2ecc67c914407f256b44ed2bcbb/blueprints/plans/2026-11-13-nav-ship.md) (working copy is local-only).

## Context

The owner's typed prompts show one request retyped by hand across projects: commit, push,
merge into the main branch, then delete branches and worktrees that are no longer used.
Evidence from the owner's prompt histories (2026-07 to 2026-11):

- One machine: about 577 prompts in 189 sessions across 37 projects, steady at 100+ a month,
  phrased as "commit -> merge to main, then delete the unused branches" or "remove unused
  worktrees and branches".
- A second machine, five weeks: about 35 short ship prompts whose tails differ per project
  (rebuild and refresh an alias, push and sync, rebuild an app bundle, push to a dev remote
  and open a PR).

The front half is the same in every repo; only the tail (version bump, rebuild, alias,
deploy) varies, and it belongs to the project.

## Decision

1. **Add `nav:ship`** — the verb after `/nav:do` (plan -> do -> ship). It reads state first,
   commits only this task's changes, pushes, integrates into the main branch, removes merged
   branches and clean worktrees, runs the project's tail, and reports with a verification line.
2. **Place it in `nav`** for lifecycle fit (plan and do already live there) and because the
   marketplace sync installs nav on every machine, so the flow stops being retyped per machine.
3. **Project tail convention.** The tail is read from a `## Ship` section in the project's
   CLAUDE.md or AGENTS.md (or an existing release section). When the owner keeps asking for the
   same undocumented tail, the skill offers once to record it there. No tail documented and none
   requested: no tail runs.
4. **Safety gates** (the behavior-changing body of the skill):
   - Read `git status`, branch, worktrees, and remote before acting; stage this task's files
     only, never `git add -A` over unrelated work.
   - Never bypass hooks, never force-push the main branch.
   - Integrate by the project's rule: merge when allowed; open a PR when main is protected,
     the remote is a fork of someone else's repository, the project says so, or the user asks.
   - Delete only branches merged into main or marked `[gone]`, and only worktrees that are
     clean; list and keep anything unmerged or dirty.
   - Run only the documented or requested tail; publishing, deploying, or a PR on someone
     else's repository needs explicit authority.
   - Report commits, merge or PR link, removed and kept branches and worktrees, tail results,
     and what was or was not verified.

## Overlap with the third-party `commit-commands` plugin

`commit-commands` covers commit, commit-push-PR, and deleting `[gone]` branches with their
worktrees. It does not merge into main, does not clean branches merged locally (not only
`[gone]`) in one pass with their worktrees, and has no per-project tail. `ship` fires on the
owner's merge-then-clean phrasing and "收尾"; a request that is only "commit" or only "open a
PR" is still served by `commit-commands`. `ship` does not call it (skills do not invoke each
other, docs/out-of-scope/skills-dont-invoke-each-other.md).

## Consequences

- Nav goes from six to seven skills; resident description cost rises by one description.
- Projects gain a lightweight convention (`## Ship`); it is a convention, not a contract:
  absent or ad-hoc forms are tolerated and the skill states which it read from (ADR-071).
- Boundary kept: writing the change is `/nav:do`; restructuring is `/nav:refactor`.

## Verification plan

1. Gates: build-manifests, build-codex, build-cursor, validate-codex-skills, unit tests,
   blueprint validation.
2. Behavior cases `ship-natural` (owner phrasing, dry-run form) and `ship-not-for-small-change`
   (a "just add X" request must route to `nav:do`).
3. Forward test in a fresh headless session on a throwaway repo with a bare remote: a feature
   branch plus worktree, an already-merged branch, an unmerged branch, and a `## Ship` tail.
   Pass when only task files are committed, main fast-forwards and is pushed, the merged
   branch and its worktree are removed, the unmerged branch is kept and reported, the tail
   runs, and the report carries a verification line. Then the next monthly
   `scripts/skill-usage.mjs` snapshot.
