# Ship — protocol detail

Loaded on demand. The SKILL.md body carries the gates; this file carries the commands and
edge cases. Prefer commands that refuse to destroy work (`merge --ff-only`, `branch -d`,
`worktree remove` without `--force`) and treat their refusal as information, not an obstacle.

## 1. Read the state

```bash
git status --short
git branch --show-current
git worktree list
git remote -v
git fetch --prune origin
git symbolic-ref --short refs/remotes/origin/HEAD   # e.g. origin/main; fall back to main/master
```

Find where the main branch is checked out (`git worktree list` shows it). Read the project's
ship rules in this order: a `## Ship` / release section in CLAUDE.md or AGENTS.md,
CONTRIBUTING, then what the user said in this conversation. Signals that the project wants a
PR instead of a direct merge: the rules say so, `origin` is a fork with an `upstream` remote
the user does not own, or a push to main is rejected as protected.

## 2. Commit only this task's work

```bash
git add <files this task changed>
git status --short          # anything still listed is not part of this commit — mention it
git commit -m "<type>(<scope>): <summary>" -m "<why, and how it was verified>"
```

Use the stated `## Git` convention from the user's or project's instructions; the project's
wins. Without one, use Conventional Commits types (`feat`, `fix`, `refactor`, `docs`, `test`,
`chore`, `revert`) and check `git log --oneline -10` for the repo's scopes. If a hook fails,
fix the cause or report it; do not bypass the hook.

## 3. Integrate

**Bring the branch up to date.** If the branch has never been pushed or only this user works
on it, `git rebase origin/<main>`; otherwise `git merge origin/<main>`. Re-run the project's
quick checks after a non-trivial update.

**Merge into main.**

```bash
# main is checked out in another worktree:
git -C <main-worktree> pull --ff-only
git -C <main-worktree> merge --ff-only <branch>    # falls back to: merge --no-ff <branch>
git -C <main-worktree> push origin <main>

# main is not checked out anywhere (fast-forward only):
git fetch . <branch>:<main> && git push origin <main>
```

If `merge --ff-only` refuses, the branch is behind main again — update it and retry, or use
`--no-ff` when the project allows merge commits. A push rejected as non-fast-forward means
someone pushed first: fetch, integrate, push again. Never `--force` main.

**Open a PR instead** when the rules or the user say so:

```bash
git push -u origin <branch>
gh pr create --base <main> --head <branch> --title "..." --body "..."
# fork → upstream:
gh pr create --repo <upstream-owner>/<repo> --base <main> --head <your-user>:<branch> ...
```

A PR into someone else's repository is an external action: confirm the target and content
first unless the user already named them.

## 4. Clean up

```bash
git branch --merged <main>          # candidates: exclude <main> and the current branch
git branch -vv | grep ': gone]'     # remote deleted
git worktree list
```

For each candidate:

1. If it has a worktree: `git worktree remove <path>` (no `--force`). If it refuses because
   of uncommitted or untracked changes, keep the worktree and branch and report them.
2. `git branch -d <branch>`. A refusal means it is not merged — keep it and report it.
3. A `[gone]` branch that `-d` refuses usually came from a squash-merged PR; check with
   `gh pr list --state merged --head <branch>` and delete with `-D` only after that check or
   the user's word.
4. Delete the remote copy (`git push origin --delete <branch>`) only for a branch this ship
   just merged and that the user owns.

Finish with `git worktree prune`. Never touch the main worktree or a worktree another
session is actively using (recent uncommitted changes are the signal — ask).

## 5. The project tail

A project documents its tail once, so it does not have to be retyped:

```markdown
## Ship

After merging to main:
1. Bump the patch version in package.json and tag `v<version>`.
2. `pnpm build && pnpm package`
3. Copy the built app to the user's Applications folder; refresh the desktop alias.
4. Publish: only when the user says "release".
```

Run the steps in order and stop at the first failure with its output. Steps that publish,
deploy, or notify other people need the user's explicit go-ahead unless the user already
named them in this request.

If there is no `## Ship` section and the user asked for the same extra steps before, offer
once: "Add these steps as a `## Ship` section in CLAUDE.md / AGENTS.md?" Write it only on yes.

## 6. Report

```
Landed: 3 commits on main (a1b2c3d..e4f5a6b), pushed to origin/main.
Cleaned: feat/sidebar (+ worktree ../app-sidebar); fix/typo.
Kept: spike/audio — not merged; ../app-spike has uncommitted changes.
Tail: version 1.4.2 → 1.4.3, build ✓, alias refreshed.
Verified: test suite passed on main after the merge (42/42); app launches from the alias.
```

## Failure handling

| Situation | Do |
|---|---|
| Work not verified yet | Say what is unverified; ship only on the user's word |
| Unrelated dirty files | Leave them unstaged; list them |
| Hook fails | Fix the cause or report; no `--no-verify` |
| Conflict needing a product decision | Stop, show the hunks, ask |
| Push to main rejected as protected | Switch to the PR path and say so |
| Tail step fails | Stop there; report the output; nothing after it runs |
