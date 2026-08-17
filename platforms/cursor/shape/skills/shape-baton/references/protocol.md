# baton protocol — the machinery behind the two directions

> Loaded when actually running a baton pass. The SKILL.md body carries the stance and the gates;
> everything here is procedure, moved **verbatim** from the pre-merge `/reflect:catchup` and
> `/reflect:park` (ADR-113). Where the old text said `HANDOFF.md` at the project root, the
> artifact is now `blueprints/baton.md` when a blueprints tree exists, root `HANDOFF.md` only as
> the no-tree fallback — the tolerant-reader rule in the body governs which.

---

## TAKE — rebuild the picture (was `catchup`)


## Step 1 — Rebuild from durable state, then enrich from live context

**Consumption priority — check for a parked cursor first.** Before falling back to git/diff reconstruction, look for the cursor: `blueprints/baton.md` (root `HANDOFF.md` on a no-tree project).

- **`HANDOFF.md` present** → compare its recorded SHA against the current `git rev-parse HEAD`. **Matching SHA**: read it as the primary source for goal/done/now/open/next — it carries the *why* durable state alone can't. **Mismatched SHA**: code moved since park; downgrade it to **"possibly stale"** — still worth reading for the why, but revalidate the what-shipped/now against fresh `git status`/`diff` rather than trusting it at face value.
- **No `HANDOFF.md`** → fall back to family artifacts (`blueprints/plan.md`, `blueprints/thoughts/`, `docs/plans/`, a `TODO`/`TASKS` file — see below), then pure git/file reconstruction if none of those exist either.
- **Report which tier the picture came from** — HANDOFF.md (current) / HANDOFF.md (possibly stale) / a plan artifact / pure git-and-files — so the user knows how much to trust it.

Ground in the **current project** (cwd), starting from git and files:

```bash
git -C . rev-parse --abbrev-ref HEAD 2>/dev/null   # current branch
git -C . status --short 2>/dev/null                # uncommitted / untracked
git -C . log --oneline -10 2>/dev/null             # recent commits
git -C . diff --stat 2>/dev/null                   # changed-but-uncommitted
```

**Then read the actual on-disk layout — the filesystem is durable state too, not just git.** List the folder structure and reconcile it against `git status`:

```bash
ls -F .                                            # the shape on disk right now — what folders/files exist
find . -maxdepth 2 -type d -not -path '*/.*' 2>/dev/null | head -40   # subprojects / where work lives
```

Why this matters: git **misreads a move**. A reorg (files relocated, a dir renamed, a subtree pulled under a new container) shows up as a mass of `D` (deleted) + `??` (untracked) entries — but the files aren't gone, they **moved**. Only cross-checking the tree reveals that, so you report "the work was relocated under `X/`" instead of the false "the work was deleted." The directory layout also shows the project's **current shape** (which subprojects exist, where the cursor's work actually lives) that a commit log alone won't surface. When `git status` shows lots of delete+untracked, **assume a move until the tree proves otherwise.**

Then look for an explicit plan/todo if one exists (don't require it): a `blueprints/plan.md` / `blueprints/thoughts/` tree, `docs/plans/`, a `TODO`/`TASKS` file, or an in-session task list.

**Then enrich from the live context window — when it's there, mine it as a first-class source, not a leftover.** It carries what durable state often can't: the **why** behind a change, decisions reached but not yet committed, what was just tried/rejected, the open question being chewed on. Read git/files *first* (the floor — so catchup still works after `/clear`/compaction), but a present conversation is the richest seam for the *why* and the *in-flight* — don't down-rank it to "secondary," fold it in. (Where durable state and the conversation disagree, durable state wins for *what shipped*; the conversation wins for *why / intent*.)

If there's almost no signal (clean tree, no plan, no session history), say so plainly rather than inventing progress.

## Step 2 — Report in a fixed shape: convey the core, not a skim

Always answer these five. Each item must carry enough to actually **re-enter** the work — the **what · why · how-far**, not a one-line label echoed from a commit title:

- **🎯 Goal / 目標** — what we're trying to do **and why** (the thread's point, not just its name).
- **✅ Done / 已完成** — what shipped **+ why it was done that way** (the decision behind it, one plain clause).
- **📍 Now / 現在** — what's in progress **+ how far it got** + what's uncommitted; enough that you know exactly where the cursor is.
- **⚠️ Open / 卡住·開著** — what's unresolved / undecided / failing / deferred **+ why it's open** (the blocker or the unanswered question).
- **➡️ Next / 下一步** — the most concrete next action + why it's next.

Rules:
- **Information density, not word count — this is the whole point.** The failure mode is a thin skim that conveys nothing; the fix is *signal per line*, not length. Plain, concise language (剪裁過的白話) — say each thing透徹 enough to re-enter, then stop. Not a 15-second skim, not a full report: as much as the **core** needs, zero padding. Optimize for information *transferred*, not characters written.
- **Core, not detail — no code.** Convey the *why · what · how-far* at the **decision level**. **No code-level detail** — no file lists, diffs, or function names; that's noise for re-entering, not signal.
- **The why is first-class.** Mine it from durable sources that actually carry it — commit-message **bodies**, `blueprints/thoughts/` (dated decision docs with a `Status:` line), `plan.md`. If the why isn't recorded anywhere durable, say so / mark it inferred — don't invent one.
- **Grounded, not guessed** — every line traces to a real signal (a commit body, a changed file, a status entry, a plan item). Ambiguous, or git vs. memory disagree → mark **uncertain**, don't smooth over.
- If `$ARGUMENTS` was given, keep the five sections but scope them to that area.

## Step 3 — Clear the consumed cursor, then stop

**A read cursor is a used cursor — throw it away directly, no confirmation needed** (like a note on the fridge: once read, it comes down; park's own discipline already names a stale cursor left lying around as Sediment). After delivering the report, delete `HANDOFF.md` when either:

- **Done** — the work it describes verifiably shipped (its Next items are in git history / the current report's Done), or
- **Stale-and-absorbed** — its SHA mismatched and whatever residual *why* it carried has been folded into this report or superseded by newer durable artifacts (a fresher plan.md, thoughts docs).

Just remove the cursor file and say so in one line of the report — no write-gate; the file is one pass-the-baton call away from regeneration, and this is a deletion of consumed state, not an overwrite of live content. If the file is git-tracked, leave the deletion for the project's next normal commit (catchup still never commits). The one case to leave it: you're genuinely unsure its why has been captured anywhere — then say that instead of deleting.

Beyond that, no artifact, no write, no commit. End after the report. (For a durable learning or a full recap of what happened, just ask for one directly.)


---

## PASS — write the cursor (was `park`)


## What park writes

One file, always the same path, always **overwritten**: **`HANDOFF.md` at the current project's root** — not `.claude/` or any hidden folder; the point is that it's the first thing anyone sees on `ls`. Five sections, the exact mirror of `catchup`'s Step 2 questions, plus one metadata line:

```markdown
# HANDOFF

> git SHA at park time: <full or short SHA> · parked <ISO date>

## 🎯 Goal
<what we're trying to do and why>

## ✅ Done
<what shipped + why it was done that way>

## 📍 Now
<what's in progress, how far it got, what's uncommitted>

## ⚠️ Open
<what's unresolved / undecided / blocked, and why>

## ➡️ Next
<the most concrete next action, and why it's next>
```

Get the SHA fresh, never guess it:

```bash
git -C . rev-parse HEAD 2>/dev/null || echo "no git repo — SHA omitted, note it in the file"
date +%F
```

## Step 1 — Fill the five sections from the live session

Same five questions `catchup` reports, but written from the *session that's ending*, not reconstructed from git afterward — that's the whole value: the why is available right now, in context, in a form git will never carry once the window closes. Mine the conversation for the same density `catchup` demands of its own report: **what · why · how-far**, not a one-line label. If a section is genuinely empty (nothing open, e.g.), say so plainly rather than padding it.

**Name rejected paths explicitly, not just what's next.** The measured evidence behind this skill (`docs/findings/2026-07-13-park-ab-experiment.md`) found that a reader's single biggest source of error wasn't a missing next-step — it was mistaking an **already-abandoned approach** for live unfinished work, because nothing on disk said "don't." Naming a dead end explicitly (e.g. under **Open** or folded into **Done**'s "why it was done that way") eliminated that error class entirely in the test; leaving it as an unstated implication did not. When a path was tried and dropped this session, say so by name — don't rely on its absence from **Next** to communicate that it's closed.

## Step 2 — Show the content before writing (write-gate)

Print the exact `HANDOFF.md` content about to be written (or the diff against the existing file, if one is present) and confirm before overwriting. `park` **always overwrites** — one cursor, not a dated chain (see Anti-patterns) — so the previous `HANDOFF.md`'s content is gone once the new one lands. That makes this the one step in `reflect` where a silent write would actually be lossy.

## Step 3 — Write, then stop

Write the cursor (`blueprints/baton.md`, or root `HANDOFF.md` with no tree). No further action — `park` doesn't commit, doesn't clear context, doesn't chain to another skill. Whether to `git add`/commit the cursor is the user's call: local-only cursor by default, committed only for cross-machine work.

## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| Append a new dated handoff file instead of overwriting | Overwrite `HANDOFF.md` in place — a dated chain is Sediment waiting to happen. Tell: about to write a filename with today's date sitting next to yesterday's still on disk. |
| Auto-park at some context-percentage threshold | Stay summoned — a statusline is the cue, the user's own call is the trigger. Tell: reaching for `park` without the user having said the word. |
| Skip the write-gate because "it's just a cursor" | Show the content (or diff) and confirm — the overwrite is lossy, unlike every other reflect write. Tell: about to call the write tool before the user has seen what it contains. |
| Stuff code-level detail (diffs, file lists) into a section | Keep it decision-level, like `catchup`'s report — that's what re-entering the work actually needs. Tell: a section reads like `git diff --stat`, not a plain-language paragraph. |
| Guess or reuse a stale SHA | Re-run `git rev-parse HEAD` at write time. Tell: the SHA in the file wasn't produced by a command just run. |
