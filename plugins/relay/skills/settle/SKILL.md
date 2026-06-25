---
name: settle
description: "Settle a relay project's thought-stream into the decision ledger — distil each thought that got an agreeing review into a self-contained ruling, APPEND it to decisions/log.md (append-only), regenerate decisions/active.md (current in-force), then HARD-DELETE the settled thoughts (git is the deep archive). The crystallization verb: thoughts are disposable drafts, settle turns the agreed ones into the durable record. Use when the user asks to \"settle the relay\", \"crystallize the project\", \"pin / log the decisions\", \"clean up settled thoughts\", or \"relay settle\". Content verb; appends to the ledger + prunes, gated by a diff. (ADR-054)"
---

# settle — crystallize agreed thoughts into the decision ledger

A thought-stream (`/relay:report` + `/relay:review`) is a running log of **disposable drafts** — it grows and nobody wants to re-read it. **settle is the periodic「沉澱」pass**: take the thoughts that got an agreeing review, distil each into a **self-contained ruling**, **append** it to the decision ledger, then **hard-delete** the settled drafts (git keeps the original). Read the ledger to orient without reading every thought.

## Scope

Operates on the **content repo** — a *separate* coordination repo located via `$RELAY_REPO`, else the current dir if it has `relay.yml`, else **ask the user** (never assume cwd; see CLAUDE.md) — one project. **Appends** to `decisions/log.md`, **regenerates** `decisions/active.md`, and **hard-deletes** settled thoughts (no `archive/`); shows a diff and is gated. By convention the project **owner** runs it (one writer keeps the ledger appends + `active.md` regeneration conflict-free); non-critical and re-runnable. "Where things stand" (progress) is **not** settle's job — `digest` computes it live.

## Process

### Step 1 — Resolve + pull
- **Resolve who's running** (git author email → `git:` in `relay.yml`). **Pull.** (Owner by convention; see Scope.)

### Step 2 — Harvest the agreed decisions
Read `thoughts/` and find every thought a `review` **agreed** to (a decision = *a thought that got an agreeing review*; no separate consensus protocol). For each, distil a **self-contained ruling**: the decision + a one-line why + provenance, written so it reads **without** the thought (which is about to be deleted). If it overrides an earlier decision, note `supersedes <id>`. Progress-only thoughts (no decision) are settled too — they just get hard-deleted, nothing to log.

### Step 3 — Append to the ledger, regenerate active, prune
1. **Append** each ruling to `decisions/log.md` (create it if absent) — **append-only, never rewrite** existing lines:
   ```markdown
   - [<id>] <decision + one-line why> — agreed <date> (by <who>)[, supersedes <id>]
   ```
2. **Regenerate** `decisions/active.md` from `log.md` — the in-force subset (drop any entry a later one `supersedes`):
   ```markdown
   # <project> — decisions in force (regenerated @ <date>)
   - [<id>] <decision> — agreed <date>
   ```
3. **Hard-delete** the settled thoughts from `thoughts/` (`git rm`) — **no `archive/`**; the full deliberation survives in git history. Keep only still-open thoughts.

**Show the diff. Wait for OK**, then commit + push.

## Discipline
- **Settle, don't re-decide** — log what review already agreed; never change a decision here (a changed decision is a new `report` + `review`, appended later with `supersedes`).
- **Append, never rewrite `log.md`** — old entries (including superseded ones) stay forever; you only add lines. `active.md` is the one you regenerate.
- **Self-contained rulings** — the thought is about to be hard-deleted, so each `log.md` line must read on its own. Distil, don't bare-pointer.
- **Re-runnable** — `active.md` is derived from `log.md`; on a conflict, regenerate, don't hand-merge.
- **Pull before, push after; gate before commit.**

## Anti-patterns (refuse these)
| Temptation | Why to refuse |
|---|---|
| Re-litigate a decision while settling | settle records what review agreed; re-deciding is a new report + review |
| Rewrite / reorder `log.md` to "tidy" | It's append-only history — superseded entries stay; only `active.md` is regenerated |
| Write a bare pointer (`[id] see thought`) to a thought you're deleting | The thought is hard-deleted — the ledger line must stand alone; distil the ruling + why |
| Move settled thoughts to `archive/` | There is no `archive/` — settled thoughts are hard-deleted; git is the deep archive |
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
