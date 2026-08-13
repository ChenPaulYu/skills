---
name: baton
disable-model-invocation: true
description: "Take or pass the session baton — one overwritten cursor holding goal · done · now · open · next. Take it on arrival (rebuilt from durable state, so it survives /clear); pass it before stepping away (the why git will never carry). Summoned only. NOT /shape:align — that maintains the project's durable record; this is the ephemeral note between sessions."
---

# baton — take it on arrival, pass it before you go

One artifact, two directions. The **baton** is the ephemeral cursor handed from one working session to the next: five sections — **goal · done · now · open · next** — carrying *what · why · how-far* at decision level. **Take** it when you arrive and the picture is gone; **pass** it before you step away, while the why is still in the room.

Its whole reason for existing: durable state proves *what shipped* but never *why this was chosen*. Git will not carry that across `/clear`, compaction, or a night's sleep. The baton does.

## Where it lives

**`blueprints/baton.md`** when the project has a blueprints tree — it is the tree's ephemeral tier, below `plan.md` (current status) and `thoughts/` (permanent decisions). **No tree → root `HANDOFF.md`**, the no-tree fallback; never scaffold a tree just to pass a baton, and **say which location you used**. Tolerant reader, three states, self-reported (ADR-071).

## Stance

- **Summoned, not automatic.** No context-percentage auto-trigger, no auto-pass at turn end. A statusline is the *cue*; the user's call is the *trigger*. Being auto-parked is the anti-feature.
- **Decision level, never code level.** No file lists, diffs, or function names in either direction — that's noise for re-entering, not signal. Density is the point: enough per line to actually re-enter, then stop.
- **Grounded, never invented.** Every line traces to a real signal (a commit body, a changed file, a status entry, a plan item). Where git and memory disagree: durable state wins for *what shipped*, the conversation wins for *why*. Can't source it → mark it inferred or say the why isn't recorded. Don't smooth over.

**Taking it:**

- **Durable state is the floor, not a blinder.** Rebuild from git / diff / files / plan so it works with an empty context — then mine the live conversation too when it's there; it holds the why, the uncommitted decision, the thing just rejected.
- **Trust is tiered and self-reported.** Baton present with a **matching SHA** → primary source. **Mismatched SHA** → downgrade to *possibly stale*: still read it for the why, but revalidate what-shipped against fresh `git status`/`diff`. **Absent** → fall back to `plan.md` / `thoughts/` / a TODO, then pure git reconstruction. **Report which tier the picture came from**, always.
- **A read cursor is a used cursor.** After reporting, delete it when the work it describes verifiably shipped, or when it was stale and its residual why has been folded into the report. No write-gate — this is deleting consumed state, one call away from regeneration. Genuinely unsure the why was captured anywhere? Say so and leave it.
- Read-only apart from that one delete. No commit.

**Passing it:**

- **Show the content before writing (write-gate).** Print the exact file (or a diff against the existing one) and confirm. Passing **always overwrites** — one cursor, never a dated chain — so the previous baton is gone once this lands. This is the one lossy write here.
- **Name rejected paths explicitly.** Measured (`docs/findings/2026-07-13-park-ab-experiment.md`): the reader's biggest error source was not a missing next step — it was mistaking an **already-abandoned approach** for live unfinished work, because nothing on disk said "don't." Naming a dead end by name eliminated that error class; leaving it implied did not.
- **Get the SHA fresh.** Re-run `git rev-parse HEAD` at write time; never carry forward one mentioned earlier in the conversation.
- Write, then stop. No commit, no chaining to another skill.

Full procedure — the durable-state sweep (including the reorg trap where git misreads a move as deletes + untracked), the five-section template, and the anti-pattern table: `references/protocol.md`.

## Companion skills

- **`/shape:align`** — the **durable** counterpart, and the boundary to get right: baton is the *ephemeral* session cursor (where/why right now, one overwritten file); roadmap-level parked work that outlives the session is a ⏸ entry on `plan.md`, not a baton. align also clears a baton nobody came back for, as part of its compaction pass.
- **`/shape:elicit`** — where a decision that surfaces mid-pass belongs (a baton records state; it never authors a decision).
- **`/nav:sync`** — its `head -12` headers are how the durable-state sweep reads implementation status cheaply.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.
