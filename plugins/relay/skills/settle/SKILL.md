---
name: settle
description: "Settle a relay project's thought-stream into the decision ledger — distil each thought that got an agreeing review into a self-contained ruling, APPEND it to decisions/log.md (append-only), and regenerate decisions/active.md (current in-force). Thoughts are NEVER moved or deleted — they stay in thoughts/ (the immutable log); open-vs-settled is digest's computed view. The crystallization verb: settle turns agreed thoughts into the durable ledger. Use when the user asks to \"settle the relay\", \"crystallize the project\", \"pin / log the decisions\", or \"relay settle\". Content verb; appends to the ledger + regenerates active, gated by a diff. (ADR-054)"
---

# settle — crystallize agreed thoughts into the decision ledger

A thought-stream (`/relay:report` + `/relay:review`) is a running log of **disposable drafts** — it grows and nobody wants to re-read it. **settle is the periodic「沉澱」pass**: take the thoughts that got an agreeing review, distil each into a **self-contained ruling** and **append** it to the decision ledger. **Thoughts are never moved or deleted** — they stay in `thoughts/` (the immutable log); open-vs-settled is `digest`'s computed view. Read the ledger to orient without reading every thought.

## Scope

Operates on the **content repo** — a *separate* coordination repo located via `$RELAY_REPO`, else the current dir if it has `relay.yml`, else **ask the user** (never assume cwd; see CLAUDE.md) — one project. **Appends** to `decisions/log.md` and **regenerates** `decisions/active.md` — that is all it writes; it **never moves or deletes a thought** (they stay in `thoughts/`, the immutable log). Shows a diff and is gated. By convention the project **owner** runs it (one writer keeps the ledger appends + `active.md` regeneration conflict-free); non-critical and re-runnable. Both "where things stand" (progress) **and** "open vs settled" are **not** stored — `digest` computes them live.

## Process

### Step 1 — Resolve + pull
- **Resolve who's running** (git author email → `git:` in `relay.yml`). **Pull.** (Owner by convention; see Scope.)

### Step 2 — Harvest the agreed decisions
Read `thoughts/` and find every thought a `review` **agreed** to (a decision = *a thought that got an agreeing review*; no separate consensus protocol). For each, distil a **self-contained ruling**: the decision + a one-line why + provenance, written so the ledger reads on its own (the thought stays in `thoughts/` as the raw source). If it overrides an earlier decision, note `supersedes <id>`. Progress-only thoughts (no decision) just stay in `thoughts/` — nothing to log; `digest` stops surfacing them once they're done.

### Step 3 — Append to the ledger, regenerate active
1. **Append** each ruling to `decisions/log.md` (create it if absent) — **append-only, never rewrite** existing lines:
   ```markdown
   - [<id>] <decision + one-line why> — agreed <date> by <who>, from <thought-link>[, supersedes <id>]
   ```
   `<thought-link>` is a markdown link whose text is the source thought's id and whose target is the thought file — from `decisions/` that target is `../thoughts/<date>-<thought-id>.md`. Cite the proposal + the agreeing review; stable since thoughts never move, so the link is the drill-in and the prose stays self-contained.
2. **Regenerate** `decisions/active.md` from `log.md` — the in-force subset (drop any entry a later one `supersedes`):
   ```markdown
   # <project> — decisions in force (regenerated @ <date>)
   - [<id>] <decision> — agreed <date>
   ```
**Thoughts stay put** — relay **never moves or deletes a thought**; `thoughts/` is the immutable log, and `digest` computes which are still open. settle writes only the ledger (steps 1–2), nothing else.

**Show the diff. Wait for OK**, then commit + push.

## Discipline
- **Settle, don't re-decide** — log what review already agreed; never change a decision here (a changed decision is a new `report` + `review`, appended later with `supersedes`).
- **Append, never rewrite `log.md`** — old entries (including superseded ones) stay forever; you only add lines. `active.md` is the one you regenerate.
- **Self-contained rulings** — `log.md` is the primary read, so each line must stand on its own (the thought in `thoughts/` is the raw source, not the ledger). Distil, don't bare-pointer.
- **Never move or delete a thought** — `thoughts/` is the immutable log; settle only writes the ledger. "Open vs settled" is `digest`'s computed view, not a folder location.
- **Re-runnable** — `active.md` is derived from `log.md`; on a conflict, regenerate, don't hand-merge.
- **Pull before, push after; gate before commit.**

## Anti-patterns (refuse these)
| Temptation | Why to refuse |
|---|---|
| Re-litigate a decision while settling | settle records what review agreed; re-deciding is a new report + review |
| Rewrite / reorder `log.md` to "tidy" | It's append-only history — superseded entries stay; only `active.md` is regenerated |
| Write a bare pointer (`[id] see thought`) instead of distilling | `log.md` is the primary read — distil the ruling + why; the thought in `thoughts/` is the raw source, not the ledger |
| Move or delete a settled thought | relay never relocates a thought — `thoughts/` is the immutable log; "open vs settled" is `digest`'s computed view |
| Store a "where things stand" snapshot | Progress is `digest`'s live job — settle only touches the decision ledger |

## Companion skills
- **`/relay:report`** / **`/relay:review`** — the stream settle crystallizes.
- **`/relay:digest`** — the live "what needs me" view; settle is its periodic durable complement.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
