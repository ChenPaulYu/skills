---
name: report
description: "Write a structured update into a relay coordination repo so a counterpart's agent can grasp in seconds what needs them. An entry is one of three kinds — converge (a framed decision → consensus, in Needs-decision · Blocked-on · Done buckets), sync (a briefing that brings someone up to speed), or discuss (an open question, before a decision is framed) — each id'd and @-routed, continuing open threads rather than restarting. Use when the user asks to \"report in relay\", \"write my relay update\", \"send a status report to X\", \"post an update\", \"sync X on Y\", or \"relay report\". Content verb; the read-side is /relay:digest, the response side is /relay:reply. Writes one append-only entry, gated by a diff."
---

# report — a standup-shaped update

Turn your recent work into a structured entry the other side's agent can triage at a glance. Not a changelog — the value is the **forced shape** that makes "what needs you" jump out.

## Scope

Operates on the **content repo** — a *separate* coordination repo located via `$RELAY_REPO`, else the current dir if it has `relay.yml`, else **ask the user** (never assume cwd; see CLAUDE.md) — one project at a time. Writes **one append-only entry** (`thoughts/<date>-<handle>-<slug>.md`, one entry per file); shows a diff and is gated. Authored to `/nav:compose` discipline (lead with the point; converge stays terse, sync may run long).

## Process

### Step 1 — Resolve + pull + read current state
- **Resolve who's running**: match the git author email to a person's `git:` field in `relay.yml` → your handle.
- **Pull** (get everyone's latest), then **read the current state** — open items in `thoughts/` + `decisions/` — so you *continue* threads (reference existing ids), not restart them.

### Step 2 — Pick the kind, write the entry
An entry is one of three **kinds** — distinct coordination verbs, each with its own shape and length discipline. They form a lifecycle: **discuss → converge → sync** (think together → ratify a framed decision → broadcast the result). **One entry = one kind** (no hybrids); a second kind the same day is a second file.

Write `thoughts/<date>-<handle>-<slug>.md` (one entry per file; `<slug>` from the subject):
```markdown
---
date: <ISO>
by: <handle>
kind: converge | sync | discuss
subject: <one line — what this entry is about; the reader and /relay:digest read it FIRST, before the body>
---
```
Then the body for your kind:

**converge** — drive a framed decision to consensus. Terse; top layer only (the point), depth by link.
```markdown
## Needs-decision
- [<handle>-<slug>] @<who> [@<who2>…] — <one line; lead with the point; say your lean>
## Blocked-on
- [<handle>-<slug>] @<who> — <what's blocking, since when>
## Done
- <visibility only — no id needed>
```

**sync** — bring someone's mental model up to date. A briefing; **length is allowed** because its job is understanding-transfer, not triage.
```markdown
## TL;DR
<1–3 lines: the whole thing compressed — `head -12` yields the gist>
## <explanation section, each leading with its point>
## Example
<a concrete instance that makes it click>
## Needs-ack          # optional, light
- [<handle>-<slug>] @<who> — confirm you've absorbed this / pushback?
```
Its **navigation** (lead-with-point · headings-as-interface · head-able top) follows `/nav:compose`; the **grounding** idiom (TL;DR → explanation → evidence → example) is sync's own to define. **Not a chronological work-log** — the raw log lives in the project repo (`progress.md`/`CHANGELOG`); a sync carries *distilled state* + a link.

**discuss** — think together *before* a decision is framed. An open question, not a vote.
```markdown
## Question
<the open question + why it matters>
## Angles
- <candidate direction / consideration> — @<who> for their take
```
Responses are takes (counters), not accept/reject; when it crystallizes into a decision, someone opens a **converge** `[D]` referencing it.

Notes:
- **`subject`** (every kind) = the headline the reader and `/relay:digest` read first.
- **id = `<handle>-<slug>`** — author-namespaced, collision-free; **type comes from the bucket, never the id**; the id is permanent.
- **`@<who>` = the people whose call/action it is.** For a `[D]` (or a sync ack), the `@`-set is its approver set — all must accept to graduate; `@` few for a fast call, many for broad buy-in.

### Step 3 — Gate + commit
**Show the diff. Wait for OK** (or "just post"), then commit + push.

## Discipline
- **One entry, one kind** — converge / sync / discuss don't mix in a file; a second kind is a second entry.
- **Brevity is converge's rule, not sync's** — a converge item is one line (depth by link); a sync briefing may be as long as understanding needs (but knowledge-organized, never a chronological log).
- **Continue, don't restart** — reference open ids; only mint a new id for genuinely new items.
- **Append-only** — write only *your* dated file; never edit anyone else's entry.
- **Lead with the point** (`/nav:compose`); group by knowledge, not by chronology.
- **Pull before, push after; gate before commit.**

## Anti-patterns (refuse these)
| Temptation | Why to refuse |
|---|---|
| Dump a chronological changelog (any kind) | Group by knowledge, not "what I did when" — a work-log lives in the project repo; a sync carries distilled state + a link |
| Make a sync long by padding rather than explaining | Length is for understanding; ramble is the sync anti-pattern, not length itself |
| Mix kinds in one entry | One entry = one kind; a second kind is a second file |
| Put the type in the id (`D1`/`B1`) | Type is the bucket; the id is `<handle>-<slug>` only |
| Re-raise an open item with a new id | Continue the existing thread — reference its id |
| Edit a teammate's entry to "tidy" | Append-only; never touch others' files |

## Companion skills
- **`/relay:digest`** — the read side (the counterpart sees your update filtered for them).
- **`/relay:reply`** — how the counterpart responds (accept / clear / counter).
- **`/nav:compose`** — the prose discipline each item is written to.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
