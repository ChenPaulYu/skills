---
name: report
description: "Write a thought into a relay coordination repo — a progress update or a concept/framing alignment — so a counterpart's agent can grasp where things stand or how you're now thinking. One flexible shape (subject + body): short for progress, longer for alignment; the counterpart responds with /relay:review. Use when the user asks to \"report in relay\", \"write my relay update\", \"post progress\", \"sync X on the new framing\", or \"relay report\". Content verb; the read-side is /relay:digest, the response side is /relay:review. Writes one append-only thought, gated by a diff."
---

# report — write a thought (progress or alignment)

Post a **thought** the counterpart's agent can pick up: where the work stands (**progress** — the common case), or how you're now framing something (**alignment** — occasional, heavier). One shape, flexible length.

> report and `/relay:review` write the **same thing** — an append-only thought. report opens; review responds (referencing a thought's id). The two tones (progress / alignment) are *how you write it*, not a frontmatter flag.

## Scope

Operates on the **content repo** — a *separate* coordination repo located via `$RELAY_REPO`, else the current dir if it has `relay.yml`, else **ask the user** (never assume cwd; see CLAUDE.md) — one project at a time. Writes **one append-only thought** (`thoughts/<date>-<handle>-<slug>.md`, one per file); shows a diff and is gated. Authored to `/nav:compose` discipline (lead with the point; head-able top).

## Process

### Step 1 — Resolve + pull + read current state
- **Resolve who's running**: match the git author email to a person's `git:` field in `relay.yml` → your handle.
- **Pull** (get the latest), then **read the current state** — recent `thoughts/` — so you *continue* threads (reference existing ids) rather than restart them.

### Step 2 — Write the thought
Write `thoughts/<date>-<handle>-<slug>.md` (`<slug>` from the subject):
```markdown
---
date: <ISO>
by: <handle>
subject: <one line — the headline; the reader and /relay:digest read it first>
---
<body — lead with the point, head-able; flex the depth to the job>
```

Two natural tones (same format, different depth):
- **Progress** (common, short): what's **done** · what's **in progress** · what's **next** · and **flag anything that needs the reviewer**. One line per item; not a changelog.
- **Alignment** (occasional, longer): a briefing that brings someone's mental model up to date on a concept / framing / decision — lead with a TL;DR, group by knowledge, end with a concrete example. Length is fine *when it's for understanding*, never as a chronological dump (that lives in the project repo; link to it).

Mark anything needing the counterpart with **`@<handle>`** + what you want back (a look / a call / unblock). That's what `/relay:digest` surfaces to them and what `/relay:review` answers.

### Step 3 — Gate + commit
**Show the diff. Wait for OK** (or "just post"), then commit + push.

## Discipline
- **One thought per file, append-only** — write only *your* dated file; never edit someone else's.
- **Continue, don't restart** — reference an open id; only mint a new one for genuinely new items.
- **Lead with the point** (`/nav:compose`); group by knowledge, not chronology; the subject is the headline.
- **Flex length to the job** — progress is short; alignment may run long *for understanding*, never as a raw work-log.
- **Pull before, push after; gate before commit.**

## Anti-patterns (refuse these)
| Temptation | Why to refuse |
|---|---|
| Dump a chronological changelog | Group by knowledge — a raw work-log lives in the project repo; a thought carries distilled state + a link |
| Pad an alignment thought to look thorough | Length is for understanding; ramble is the smell, not length |
| Re-raise an open item with a new id | Continue the existing thread — reference its id |
| Edit a teammate's thought to "tidy" | Append-only; never touch others' files |

## Companion skills
- **`/relay:digest`** — the read side ("what's waiting on me").
- **`/relay:review`** — how the counterpart responds (ack / comment / change).
- **`/relay:settle`** — periodically settles the thought-stream into a current-state snapshot + pinned decisions.
- **`/nav:compose`** — the prose discipline the thought is written to.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
