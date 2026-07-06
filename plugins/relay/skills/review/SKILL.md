---
name: review
description: "Respond to a relay thought addressed to you — acknowledge it, comment, or ask for a change — by writing your own thought that references its id. With 1-2 people there's no consensus protocol: your response is the resolution, and an agreeing review is what /relay:settle later pins as a decision. Use when the user asks to \"review in relay\", \"respond to the report\", \"ack this\", \"approve / agree with it\", \"ask for a change\", or \"relay review\". Content verb; the open side is /relay:report, the read side is /relay:digest. Writes one append-only thought, gated by a diff."
---

# review — respond to a thought (ack / comment / change)

Answer a thought pointing at you. A review is **the same shape as a `report`** — an append-only thought — that **references the thought it answers** (by id). Your response *is* the resolution; an agreeing review is what `/relay:settle` later pins as a decision. No @-set, no graduation ceremony — that's the point of a 1–2 person relay.

## Scope

Operates on the **content repo** — a *separate* coordination repo located via `$RELAY_REPO`, else a cached prior resolution, else the current dir if it has `relay.yml`, else **ask the user** and cache the answer (never assume cwd; see CLAUDE.md). Writes **one append-only thought** (`thoughts/<date>-<handle>-<slug>.md`); shows a diff and is gated.

## Process

### Step 1 — Resolve + pull + find what's @me
- **Resolve who's running** (git author email → `git:` in `relay.yml` → your handle), **pull**, then find thoughts addressed to you (`@<your-handle>`) you haven't answered — `/relay:digest` lists them.

### Step 2 — Respond by id
Write `thoughts/<date>-<handle>-<slug>.md`:
```markdown
---
date: <ISO>
by: <handle>
subject: "re: <what you're answering>"     # quote it — the "re:" colon breaks unquoted YAML
thread: "<link to the discussion's opening thought>"   # REQUIRED, quote it (a markdown link starts with [ = a YAML sequence) — the grouping anchor (the root); digest groups by it
re: "<link to the exact thought you answer>"           # quote it — the immediate parent; omit when it == thread (a direct reply to the root)
relate:                                                 # optional — cross-discussion "see also" links; may be several
  - "<link to a related thought>"
---
## Review
- re [<id>]: **agree** — <why / any caveat>      # you accept it; settle may pin this as a decision
- re [<id>]: comment — <your take>                # a note / question; keeps the thread open
- re [<id>]: change — <what to change & why>      # asks for a revision before you agree
```

- **agree / comment / change** — say which, and why. With two people your `agree` settles it; a `change` sends it back; a `comment` with a real question keeps it open.
- **An alignment thought** (a framing) gets the same: `agree` = "I'm on board with this framing", `comment` = a take, `change` = "reframe X".
- **A review can be a closer — say so.** An `agree`, or a `comment` that only *informs* (an execution note, a heads-up), is **self-closing**: the counterpart owes you nothing back. Make it unmistakable in-line — *"FYI, no reply needed unless you disagree"* — so the thread terminates instead of bouncing courtesy acks forever. Only a `change` or a genuine open question keeps it alive. (Termination contract: `relay/CLAUDE.md` → *Resolution & decisions*.)

### Step 3 — Gate + commit
**Show the diff. Wait for OK**, then commit + push.

## Discipline
- **Set `thread` (always) + `re` (the exact thought)** in frontmatter — `thread` links the discussion's opening thought (the grouping anchor; `digest` groups by it in O(1), robust to a missing mid-thread `re`); `re` links the immediate thought you answer (omit if it *is* the root). These edges let `digest`/a dashboard **group + compute "settled"** (an answered ask = settled) without parsing prose; an inline `re [<id>]` in the body is *not* enough.
- **Explicit response** — `agree` is an affirmative act; silence ≠ agreement.
- **Append-only** — write your OWN thought; never edit the one you're answering.
- **Decisions are pinned by settle, not graduated here** — an `agree` is what settle harvests; review never writes `decisions/`.
- **Pull before, push after; gate before commit.**

## Anti-patterns (refuse these)
| Temptation | Why to refuse |
|---|---|
| Infer "they seem fine with it" as agreement | Explicit `agree` only; silence ≠ consent |
| Edit the original thought to mark it reviewed | Append-only; your review is your own thought |
| Write a `decisions/` file here | Decisions are pinned by `/relay:settle` from agreeing reviews; review just responds |

## Companion skills
- **`/relay:report`** — opens the thoughts you review.
- **`/relay:digest`** — shows what's `@you` and waiting for your review.
- **`/relay:settle`** — later pins your agreements as decisions and snapshots the state.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
