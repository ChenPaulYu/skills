---
name: digest
description: "Show the live, per-viewer 'what needs you' from a relay coordination repo — read all entries + decisions, compute the current threads, and surface the items waiting on YOU first. Read-only (writes nothing). Use when the user asks to \"digest the relay\", \"what needs me\", \"catch me up on the relay\", \"show waiting items\", \"who's blocked on me\", or \"relay digest\". This is also the awareness entry — an agent runs it on open. Content verb; the write sides are /relay:report and /relay:reply."
---

# digest — the live, per-viewer view

Compute "what's waiting on **you**" from the shared repo, right now. The read side of relay — and its **awareness** mechanism: an agent auto-runs this on open so nothing rots unseen.

## Scope

Operates on the **content repo** — a *separate* coordination repo located via `$RELAY_REPO`, else the current dir if it has `relay.yml`, else **ask the user** (never assume cwd; see CLAUDE.md) — one project (or all). **Read-only — writes nothing.** The shared committed snapshot is `index.md` (maintained by `/relay:settle`); `digest` is the *live* view and is authoritative even when `index.md` lags.

## Process

### Step 1 — Resolve + pull
- **Resolve who's running** (git author email → `git:` in `relay.yml` → your handle), then **pull** to get everyone's latest.

### Step 2 — Compute the threads (don't trust `index.md`)
- Read `thoughts/` (hot entries) + `decisions/`, and **stitch each thread by id**: an item raised in one entry, discussed/accepted in others. Recompute from source — `index.md` is only a snapshot and may lag.
- **Read each entry's `kind`** (`converge`/`sync`/`discuss`) and `subject` (frontmatter) — the kind decides how to present it (triage a converge, point at a sync, invite input on a discuss); the subject is the one-line theme carried through.
- **Every run, sweep for `@<you>`.** Scan *every* entry, decision, and reply for any mention of your handle — not only the structured `[D]` approver-sets and blockers. A bare `@you` anywhere (a Done line, a reply, a counter) must be caught, so no tag where someone named you is ever missed.

### Step 3 — Present, filtered for the viewer
Surface, sorted **what-needs-you first**:
```
relay · <project> · for @<you> (live, <date>)

Needs your decision/ack (n)   # converge [D] + sync acks @you, unaccepted
  • [<id>] <one line> — <proposer> leans … → reply accept / reject / counter
Waiting on you (n)            # blockers @you
  • [<id>] <what>
Open for your input (n)       # discuss entries inviting your take
  • [<id>] <the question> — from “<subject>”
Mentions you (n)              # any OTHER @you — replies, counters, Done lines
  • [<id or entry>] <one line> — from “<subject>”
Briefings for you (n)         # sync entries — pointer only, NOT triaged
  • “<subject>” — @<by>, <date> → open the file to read
(FYI)                         # broadcast / done, brief
  • “<subject>” — @<by>, <date>
```
- "Needs your decision/ack" = open `converge` `[D]` (or a `sync` ack) whose `@`-set includes you and you haven't accepted. "Waiting on you" = open blockers `@you`.
- **"Open for your input"** = `discuss` entries whose angles `@you` — they want your *take*, not a vote; don't rubber-stamp them.
- **"Mentions you"** = every other place the Step-2 sweep found `@you` (a reply, a counter, a Done line) not already surfaced above — so a tag never falls through the cracks. Each carries its entry's `subject` for context.
- **"Briefings for you" = `sync` entries shown as a pointer (subject + link), NOT exploded into triage.** A sync's body is for reading, not 3-second sorting; surfacing only its subject keeps a long briefing from drowning the triage. (Its optional ack still appears under "Needs your decision/ack".)
- Multi-person: the SAME computation, a different lens per viewer — filter by `@<you>`.

## Discipline
- **Read-only** — never write a file (not even `index.md`; that's `settle`'s job). No churn, no conflict.
- **Recompute from source** — don't rely on `index.md` (it may be stale); `digest` is the authoritative live view.
- **Pull first** — a digest of stale data misroutes attention.
- **Lead with what needs them** — the whole point is 3-second triage.

## Anti-patterns (refuse these)
| Temptation | Why to refuse |
|---|---|
| Write / refresh `index.md` here | That's `settle` (owner-only, deliberate); `digest` writing it = churn + conflicts |
| Trust `index.md` as current | It's a lagging snapshot; recompute from `thoughts/` + `decisions/` |
| Show everything equally | Sort "needs you" first; FYI stays brief — it's triage, not a dump |
| Only scan the `[D]` `@`-set | A bare `@you` in a reply / Done line gets missed — sweep every entry, every run |
| Explode a `sync` briefing into the triage list | A sync is read, not sorted — show its subject as a pointer; triaging its body drowns the 3-second view |

## Companion skills
- **`/relay:report`** / **`/relay:reply`** — the write sides whose entries `digest` reads.
- **`/relay:settle`** — writes the shared `index.md` snapshot `digest` complements.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
