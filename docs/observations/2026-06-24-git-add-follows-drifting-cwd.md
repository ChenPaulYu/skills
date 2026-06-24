---
date: 2026-06-24
status: raw
---

# a bare `git add -A` runs in the shell's cwd — which silently resets between tool calls — so operations on a sibling repo must use `git -C <path>`

> **TL;DR**: When work spans two repos (e.g. a project repo and a separate relay coordination repo), the shell's working directory is not stable across Bash calls — a `cd` early in the session does not persist, and an intervening command can reset cwd. A bare `git add -A` / `git commit` then runs against whatever repo cwd currently points at — the wrong one. Always target a known repo path explicitly with `git -C <repo> …` rather than relying on a prior `cd`.

## What prompted it

A `git add -A` meant for a coordination repo ran in the parent project repo instead (cwd had reset), staged unrelated files, and hit an "embedded git repository" error. The mistake was invisible until the error surfaced.

## The signal

The defensive habit, especially in any multi-repo flow (relay is the canonical case — it operates on a *separate* content repo while cwd is usually another project):

- Use `git -C <repo> add/commit/diff/push …` for every git op against that repo.
- Never assume cwd equals the repo you mean; never rely on a `cd` from an earlier call.

This binds weakly to a skill, too: relay's content verbs all say "operates on a separate repo, never assume cwd" but stop at the principle — they could operationalize it as "run git with explicit `-C <relay-repo>`." Filed as own-learning because the pitfall is general agent-ops, not relay-specific.

## Evidence so far

- **Only case (2026-06-24, relay repo work)**: bare `git add -A` staged the wrong (parent) repo after cwd drift; recovered with `git reset` then `git -C <repo>`.

(One case → stays `raw`. Promote on a second cwd-drift mistake, or fold into a relay git-protocol note if it recurs there.)

## Links

- Weakly relates to [ADR-050](docs/adr/050-relay-plugin.md) (relay's "separate repo, never assume cwd"). General agent-ops, not skill-bound.
