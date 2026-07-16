---
name: catchup
description: "Orient on where the current work stands — rebuilt from durable state (git, diff, files, plan) so it survives /clear or a break, then enriched from live context for the why. Read-only except for clearing a consumed/stale HANDOFF.md after reporting; summoned. Distinct from a plain session recap (what the session DID — just ask for it) and /shape:align (DECIDES next and writes a plan — catchup only reports)."
disable-model-invocation: true
---

# catchup — where are we, in plain language

Tell the user **where the current work stands**, in simple, direct language. The value is **grounding**: rebuild the picture from **durable state** (git, the diff, changed files, any plan/todo) so it still works after `/clear`, after context was compacted, or when returning after a break. Durable state is the **floor** — it guarantees catchup works even with an empty context — **not a blinder**: when the conversation IS still in the context window, *use it fully too*. It often holds what git can't — the **why**, decisions made but not yet committed, the nuance behind a change. The differentiator from "just summarize the chat" isn't *ignore* the chat; it's *don't depend on* it (ground in durable state so it survives memory loss, while still exploiting the live context when it's there).

Optional focus from the user: **$ARGUMENTS** (if given, scope the catchup to that area; else cover the whole current work).

**Read-only, with one deliberate exception: clearing a consumed cursor (Step 3).** Do not edit or write anything else — catchup otherwise only reports.

## Step 1 — Rebuild from durable state, then enrich from live context

**Consumption priority — check for a parked cursor first.** Before falling back to git/diff reconstruction, look for a written cursor at the project root: `ls HANDOFF.md` (written by `/reflect:park`).

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
- **The why is first-class.** Mine it from durable sources that actually carry it — commit-message **bodies**, `decisions.md`, `plan.md`, thoughts docs. If the why isn't recorded anywhere durable, say so / mark it inferred — don't invent one.
- **Grounded, not guessed** — every line traces to a real signal (a commit body, a changed file, a status entry, a plan item). Ambiguous, or git vs. memory disagree → mark **uncertain**, don't smooth over.
- If `$ARGUMENTS` was given, keep the five sections but scope them to that area.

## Step 3 — Clear the consumed cursor, then stop

**A read cursor is a used cursor — throw it away directly, no confirmation needed** (like a note on the fridge: once read, it comes down; park's own discipline already names a stale cursor left lying around as Sediment). After delivering the report, delete `HANDOFF.md` when either:

- **Done** — the work it describes verifiably shipped (its Next items are in git history / the current report's Done), or
- **Stale-and-absorbed** — its SHA mismatched and whatever residual *why* it carried has been folded into this report or superseded by newer durable artifacts (a fresher plan.md, thoughts docs).

Just `rm HANDOFF.md` and say so in one line of the report — no write-gate; the file is one `/reflect:park` call away from regeneration, and this is a deletion of consumed state, not an overwrite of live content. If the file is git-tracked, leave the deletion for the project's next normal commit (catchup still never commits). The one case to leave it: you're genuinely unsure its why has been captured anywhere — then say that instead of deleting.

Beyond that, no artifact, no write, no commit. End after the report. (To capture a durable learning from the session, that's `/reflect:observe`; for a full recap of what happened, just ask for one directly.)

## Companion skills

- **`/reflect:park`** — the write side; before stepping away, it writes the `HANDOFF.md` this skill checks first.
- **`/reflect:observe`** — distill a durable learning from the session into the knowledge base.
- **`/shape:align`** — when you want to *decide* next and write it into a plan (catchup only reports; align decides + writes).
