---
name: digest
description: "Show the live 'what's waiting for my review' from a relay coordination repo — read the thought-stream and surface every thought that @-mentions YOU and you haven't responded to yet. Read-only (writes nothing). Use when the user asks to \"digest the relay\", \"what needs me\", \"what's waiting for my review\", \"catch me up on the relay\", or \"relay digest\". Also the awareness entry — an agent runs it on open. Content verb; the write side is /relay:report, the response side is /relay:review."
---

# digest — what's waiting for my review

Compute "what's waiting on **you**" from the thought-stream, right now. The read side of relay — and its **awareness** mechanism: an agent auto-runs this on open so nothing rots unseen.

## Scope

Operates on the **content repo** — a *separate* coordination repo located via `$RELAY_REPO`, else the current dir if it has `relay.yml`, else **ask the user** (never assume cwd; see CLAUDE.md) — one project (or all). **Read-only — writes nothing.** The durable output of `/relay:settle` is the decision ledger (`decisions/log.md` + `active.md`); `digest` is the **live** view of *progress* — what needs you now — computed from the thoughts. Progress has no stored snapshot; `digest` is its only home.

## Process

### Step 1 — Resolve + pull
- **Resolve who's running** (git author email → `git:` in `relay.yml` → your handle), then **pull** to get the latest.

### Step 2 — Compute from the thought-stream
- Read recent `thoughts/`, **group discussions by the `thread` anchor** (and use `re` for the precise reply chain within a group), and read each thought's `subject`. This is how "settled" is **computed**: a discussion whose latest reply is an `agree`/FYI-closer is settled; an ask with no answering `agree` is open — there is no stored status field.
- **Every run, sweep for the `@<you>` flag.** Scan *every* thought for the `@<your-handle>` tag. A thought that `@`-flags you **and you haven't answered yet** (no `/relay:review` from you on that id) = waiting for your review. The `@`-flag is the *ask* signal — no `@<you>` tag where someone flagged you is ever missed.
- **But "names you" ≠ "needs you" — FYI is not waiting.** The `@`-flag distinguishes an **ask** from an **FYI**. A thought that merely *mentions you in prose* (no `@`-flag), or whose latest state is a **closer** — an `agree`, or a review that says it needs no reply — is **self-closed**: it belongs in **Recent (FYI)**, never in "Waiting." Don't surface an already-agreed or FYI thread as parked on anyone. (The termination contract is owned by `relay/CLAUDE.md` → *Resolution & decisions*.)
- **Also compute what *you're* waiting on.** Your own thoughts that `@`-flagged someone and have **no review back yet** = waiting on them. This is the asker's lens — so you can see (and chase) your own open asks. An ask that came back as an `agree`/FYI is **answered**, not still-waiting — drop it.

### Step 3 — Present, filtered for the viewer
```
relay · <project> · for @<you> (live, <date>)

Waiting for your review (n)        # thoughts @you you haven't answered
  • [<id>] <one line — what's wanted (a look / a call / unblock)> — @<by>, from “<subject>” → /relay:review
Waiting on others (n)              # YOUR @-asks with no review back yet
  • [<id>] <what you asked> — @<who>, “<subject>” (since <date>)
Recent (FYI)                       # latest thoughts, brief — flow you don't need to act on
  • “<subject>” — @<by>, <date>
```
- **"Waiting for your review"** = every thought that **`@`-flags you** and you haven't answered — a progress note wanting a look, or an alignment wanting your agreement / pushback. **Excludes** FYI (no `@`-flag) and already-closed threads (an `agree`/no-reply-needed closer). Sorted first; this is the whole point.
- **"Waiting on others"** = your own thoughts that `@`-ed someone and have no review back — so a stalled ask is visible to *you*, the asker, not silently rotting (the asker-liveness lens).
- **"Recent"** = the latest thoughts by subject, brief — so you see what's flowing even when it doesn't need you.
- Two-person: the same computation, the other lens — filter by `@<you>`.

## Discipline
- **Read-only** — never write a file (the ledger is `settle`'s job). No churn, no conflict.
- **Recompute from source** — read the thoughts every run; `digest` is the authoritative live view of what needs you.
- **Pull first** — a digest of stale data misroutes attention.
- **Lead with what needs them** — the whole point is 3-second triage.

## Anti-patterns (refuse these)
| Temptation | Why to refuse |
|---|---|
| Write / refresh a stored snapshot here | `digest` is read-only + computed; the durable ledger is `settle`'s job |
| Miss the `@you` flag | The `@<you>` tag is the ask signal — sweep every thought, every run; never drop a real ask |
| Nag about an FYI / already-agreed thread | "Names you" ≠ "needs you"; a prose mention, an `agree`, or a no-reply-needed closer is **Recent**, not "Waiting" |
| Dump the full body of a long thought | Surface its subject + the one-line ask as a pointer; the body is read on open, not triaged |

## Companion skills
- **`/relay:report`** / **`/relay:review`** — the write + response sides whose thoughts `digest` reads.
- **`/relay:settle`** — appends agreed decisions to the ledger (`decisions/log.md` + `active.md`); `digest` is its live, progress-side complement.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
