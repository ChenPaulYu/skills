---
name: settle
description: "Owner-only periodic tidy of a relay project — archive closed threads, prune noise, and refresh the shared index.md snapshot, keeping the hot set small. Non-critical: decisions already graduated at accept, so a lagging settle is harmless. Use when the user asks to \"settle the relay\", \"tidy the project\", \"archive resolved items\", \"refresh the snapshot / index\", \"clean up the relay\", or \"relay settle\". Content verb; owner-only. Writes (archives/prunes/refreshes), gated by a diff."
---

# settle — owner-only periodic hygiene

Keep a project's hot set small and its snapshot fresh. **Non-critical by design**: graduation already happened at accept-time (`/relay:reply`), so settle never blocks consensus — if it lags, the project just gets larger and `index.md` gets older, nothing breaks.

## Scope

Operates on the **content repo** — a *separate* coordination repo located via `$RELAY_REPO`, else the current dir if it has `relay.yml`, else **ask the user** (never assume cwd; see CLAUDE.md) — one project. **Owner-only** (the running user must be `owner` in `project.yml`) — one responsible party keeps concurrency low. Writes (moves to `archive/`, prunes, refreshes `index.md`); shows a diff and is gated.

## Process

### Step 1 — Resolve + check owner + pull
- **Resolve who's running** (git author email → `git:` in `relay.yml`). **Refuse** unless you are `owner` of this project in `project.yml`. **Pull.**

### Step 2 — Archive closed threads
- A thread is closed when: its `[D]` has graduated (a `decisions/<id>.md` exists), or its blocker was cleared, or it was rejected. **Move the originating entries' resolved items to `archive/`** (out of the hot path). Keep open threads in `thoughts/`.

### Step 3 — Prune + refresh the snapshot
- Prune pure noise (stale FYI already seen). Rewrite the shared **`index.md`** snapshot:
```markdown
# <project> — current state (snapshot @ <date>, settle by <handle>)
## Open
- [<id>] <one line> — @<who>
## Recent decisions
- [<id>] <decision> — accepted by <who> (<date>)
```
**Show the diff. Wait for OK**, then commit + push.

## Discipline
- **Owner-only** — refuse if you're not the project owner (keeps the destructive moves single-writer).
- **Never un-graduate** — settle archives a decided thread; it does not write/alter `decisions/` (that happened at accept).
- **Idempotent-ish + re-runnable** — if two settles race and conflict on a move, re-run (the moves are recomputable from "what's resolved").
- **Pull before, push after; gate before commit.** Conflicts on shared files → regenerate, don't hand-merge.

## Anti-patterns (refuse these)
| Temptation | Why to refuse |
|---|---|
| Let anyone run settle | Owner-only — its archive/prune moves aren't conflict-free; one writer keeps it safe |
| Graduate decisions here | Graduation is event-driven at accept (`/relay:reply`); settle only tidies |
| Hand-merge a conflict on `index.md` | It's regenerable — re-run settle instead |
| Archive an open thread to "clean up" | Only closed (graduated / cleared / rejected) threads move |

## Companion skills
- **`/relay:reply`** — graduates decisions (settle only archives their threads afterward).
- **`/relay:digest`** — the live view; settle refreshes the complementary committed `index.md`.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
