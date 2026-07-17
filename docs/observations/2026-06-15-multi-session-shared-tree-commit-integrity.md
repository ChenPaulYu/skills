---
date: 2026-06-15
status: raw
---

# Committing on a shared working tree with a concurrent agent: status-before, verify-HEAD-after, reflog-to-recover

## What happened

Two Claude sessions were working the same TrackMate checkout (`master`) at once — mine running
`/shape:reconcile` + `/shape:align`, another building sketch-edit. My commits got scrambled three
distinct ways by the other session's git ops landing between my steps:

1. **Staged work swept into someone else's commit.** I `git rm`'d the prune targets (staging
   deletions). Before I committed, the other session ran `git commit` — which picked up *my* staged
   deletions into *their* commit. My deletions landed under a stranger's message.
2. **`git reset HEAD~1` scrambled my index mid-commit.** The other session then reset away
   that commit, dumping its changes (incl. my deletions) back into the working tree uncommitted. I
   committed, thinking it captured my reconcile content — but the reset had left the index
   holding only 3 stray files (an intermediate plan.md/overview.html + the other session's new
   thought). My actual reconcile content (decisions.md graduate, amends, deletions, salvage)
   **never reached HEAD**, despite a commit named "reconcile sweep" existing in the log.
3. **The lie was only caught by verifying HEAD content.** `git status` looked plausible; the commit
   "succeeded". The miss surfaced only when I ran `git show HEAD:decisions.md | grep -c <section>`
   → 0, and `git log` showed both prior commits had vanished (history rewritten under me). reflog
   reconstructed the actual sequence; I re-landed the real content in a fresh commit.

## Why it matters

The `multi-session-worktree-hazard` is usually framed as dev-server/port/file-edit collisions. But
the **commit path** is where it does silent damage: a commit can report success while containing
none of your work, because a concurrent `reset`/`commit` mutated the shared index/HEAD between your
`add` and your `commit`. The default agent reflex ("I added, I committed, done") trusts the commit
verb — and on a shared tree that trust is misplaced. The cost is invisible: you report "reconcile
committed ✓" and walk away with an empty commit.

The defensive moves that actually worked, in order:

- **Never `git add -A` on a shared tree.** Stage explicit paths you own; `-A` hoovers the other
  session's uncommitted work into your commit (this is how #1 happened from their side).
- **Re-check `git status` immediately before every commit** (not once at the start) — the tree
  drifts between steps.
- **After committing, verify HEAD actually contains your content** — `git show HEAD:<file> | grep`
  for a sentinel from your change, don't trust the commit succeeded.
- **When the log looks wrong (commits missing), reach for `git reflog`** — it survives history
  rewrites and is the only way to reconstruct "what happened to my work."
- **`git rm` stages immediately** → your deletions are exposed to a concurrent `git commit` the
  instant you run it. Commit deletions promptly, or expect them to ride someone else's commit.

## What it could become

A "shared-tree commit hygiene" guard — either folded into the `commit` skill / commit-commands,
or a short checklist any skill that ends in a commit (reconcile, align, build, position) can carry:
*stage explicit paths (never -A) → re-status → commit → verify HEAD content → reflog if the log
surprises you.* Possibly gated on detecting concurrency (another session's uncommitted churn in
`git status`, or HEAD moving between your own steps).

Lower confidence than the two reconcile observations from the same session — this is git hygiene,
somewhat specific to the multi-agent-one-checkout setup. But it recurred 3× in one session and the
failure mode (green commit, empty content) is nasty enough to be worth a guard.

## Evidence so far

- This session: 3 collisions (sweep-into-others-commit, reset-scrambled-index, content-not-in-HEAD),
  recovered via reflog + re-land. ~4 extra `git status`/`reflog`/`git show HEAD:` round-trips spent
  reconstructing state that a guard would have prevented.
- Related: the existing trackmate memory `multi-session-worktree-hazard` (dev-server/port framing —
  this extends it to the commit path), [[2026-06-11-stale-plugin-cache-invalidates-testbed-measurement]]
  (another "the environment moved under the measurement" class).
