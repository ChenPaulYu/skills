---
name: settle
description: "Settle a relay project's thought-stream into a durable snapshot — distil the running thoughts into a clean current-state (where things stand) + pinned decisions (what got agreed in review), then archive the settled thoughts. The crystallization verb: thoughts are the running log, settle turns them into the record you read to orient. Use when the user asks to \"settle the relay\", \"crystallize / snapshot the project\", \"what's the current state\", \"pin the decisions\", \"archive old thoughts\", or \"relay settle\". Content verb; writes the snapshot + archives, gated by a diff."
---

# settle — crystallize the stream into a current-state snapshot

A thought-stream (`/relay:report` + `/relay:review`) is a running log — it grows and nobody wants to re-read it. **settle is the periodic「沉澱」pass**: let the stream settle, separate the clear water (**current state**) from the sediment worth keeping (**decisions**), archive the rest. Read settle's output to orient without reading every thought.

## Scope

Operates on the **content repo** — a *separate* coordination repo located via `$RELAY_REPO`, else the current dir if it has `relay.yml`, else **ask the user** (never assume cwd; see CLAUDE.md) — one project. Writes the **`index.md` snapshot** + moves settled thoughts to `archive/`; shows a diff and is gated. By convention the project **owner** runs it (one writer keeps the archive moves conflict-free); non-critical and re-runnable.

## Process

### Step 1 — Resolve + pull
- **Resolve who's running** (git author email → `git:` in `relay.yml`). **Pull.** (Owner by convention; see Scope.)

### Step 2 — Distil the stream
Read `thoughts/` since the last snapshot and compute two things:
- **Current state** — where things actually stand *now*: roll up the progress thoughts (an item raised then later reported done is *done*, not two lines).
- **Pinned decisions** — anything a `report` proposed and a `review` **agreed** to. A decision is just *a thought that got an agreeing review*; settle pins it. There is **no separate consensus protocol** — settle harvests decisions from the stream.

### Step 3 — Write the snapshot + archive
Rewrite the shared **`index.md`**:
```markdown
# <project> — current state (settled @ <date>, by <handle>)
## Where things stand
- <one line per live item / workstream>
## Decisions (pinned)
- [<id>] <decision> — agreed <date> (by <who>)
```
Then **move the settled thoughts** (rolled-up progress, agreed decisions) to `archive/`, keeping only still-open items in `thoughts/`. **Show the diff. Wait for OK**, then commit + push.

## Discipline
- **Settle, don't re-decide** — pin what review already agreed; never change a decision here (a changed decision is a new `report` + `review`).
- **Roll up, don't list** — current state is the *distilled* now, not a copy of every progress line.
- **Re-runnable** — snapshot + archive moves are recomputable from the stream; on a conflict, regenerate, don't hand-merge.
- **Pull before, push after; gate before commit.**

## Anti-patterns (refuse these)
| Temptation | Why to refuse |
|---|---|
| Re-litigate a decision while settling | settle crystallizes what review agreed; re-deciding is a new report + review |
| Copy every thought into the snapshot | Current state is the rolled-up *now*, not the raw log — that's what `archive/` is for |
| Hand-merge a conflict on `index.md` | It's regenerable — re-run settle |
| Archive a still-open item to "clean up" | Only settled (done / agreed) thoughts move to archive |

## Companion skills
- **`/relay:report`** / **`/relay:review`** — the stream settle crystallizes.
- **`/relay:digest`** — the live "what needs me" view; settle is its periodic durable complement.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
