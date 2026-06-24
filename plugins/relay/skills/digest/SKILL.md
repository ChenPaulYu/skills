---
name: digest
description: "Show the live 'what's waiting for my review' from a relay coordination repo — read the thought-stream and surface every thought that @-mentions YOU and you haven't responded to yet. Read-only (writes nothing). Use when the user asks to \"digest the relay\", \"what needs me\", \"what's waiting for my review\", \"catch me up on the relay\", or \"relay digest\". Also the awareness entry — an agent runs it on open. Content verb; the write side is /relay:report, the response side is /relay:review."
---

# digest — what's waiting for my review

Compute "what's waiting on **you**" from the thought-stream, right now. The read side of relay — and its **awareness** mechanism: an agent auto-runs this on open so nothing rots unseen.

## Scope

Operates on the **content repo** — a *separate* coordination repo located via `$RELAY_REPO`, else the current dir if it has `relay.yml`, else **ask the user** (never assume cwd; see CLAUDE.md) — one project (or all). **Read-only — writes nothing.** A settled current-state snapshot may exist in `index.md` (written by `/relay:settle`); `digest` is the *live* view, computed from the thoughts, and is authoritative even when `index.md` lags.

## Process

### Step 1 — Resolve + pull
- **Resolve who's running** (git author email → `git:` in `relay.yml` → your handle), then **pull** to get the latest.

### Step 2 — Compute from the thought-stream
- Read recent `thoughts/`, **stitch threads by id** (a thought and the reviews that reference it), and read each thought's `subject`.
- **Every run, sweep for `@<you>`.** Scan *every* thought for any mention of your handle. A thought that names you **and you haven't responded to yet** (no `/relay:review` from you on that id) = waiting for your review. A bare `@you` anywhere must be caught — no tag where someone named you is missed.

### Step 3 — Present, filtered for the viewer
```
relay · <project> · for @<you> (live, <date>)

Waiting for your review (n)        # thoughts @you you haven't answered
  • [<id>] <one line — what's wanted (a look / a call / unblock)> — @<by>, from “<subject>” → /relay:review
Recent (FYI)                       # latest thoughts, brief — flow you don't need to act on
  • “<subject>” — @<by>, <date>
```
- **"Waiting for your review"** = every thought that `@`-mentions you and you haven't responded to — a progress note wanting a look, or an alignment wanting your agreement / pushback. Sorted first; this is the whole point.
- **"Recent"** = the latest thoughts by subject, brief — so you see what's flowing even when it doesn't need you.
- Two-person: the same computation, the other lens — filter by `@<you>`.

## Discipline
- **Read-only** — never write a file (the snapshot is `settle`'s job). No churn, no conflict.
- **Recompute from source** — don't rely on `index.md`; `digest` is the authoritative live view.
- **Pull first** — a digest of stale data misroutes attention.
- **Lead with what needs them** — the whole point is 3-second triage.

## Anti-patterns (refuse these)
| Temptation | Why to refuse |
|---|---|
| Write / refresh `index.md` here | That's `settle`; `digest` writing it = churn + conflicts |
| Only scan for explicit asks | A bare `@you` in any thought is "waiting for you" — sweep every thought, every run |
| Dump the full body of a long thought | Surface its subject + the one-line ask as a pointer; the body is read on open, not triaged |

## Companion skills
- **`/relay:report`** / **`/relay:review`** — the write + response sides whose thoughts `digest` reads.
- **`/relay:settle`** — settles the stream into a current-state snapshot + pinned decisions; `digest` is its live complement.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
