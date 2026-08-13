---
name: quiz
description: "Check what the learner still holds about a repository they have been studying: read the learner model, pick what is most likely to have decayed or regressed, probe by asking them to narrate rather than fill blanks, then update the model with what their answers actually showed. Fires on 'quiz me', '考我', 'how much do I still remember about X?', or when returning to a study after a gap. Distinct from /fathom:guide's per-level gate — that is a level's exit; this is spaced retention checking that advances nothing."
---

# quiz — find out what actually stuck

Probe the learner's live model of a repository and write back what the probing revealed. This
verb **advances nothing**: no level is passed, no artifact is built. Its only product is a truer
`understanding.md`.

## Stance

- **Ask for narration, not recall.** "Tell me in your own words how X works" beats "what is the
  function called". A term the learner can name but not use is not knowledge.
- **Probe the shape, not the trivia.** Wrong *shape* (two operations collapsed into one, an owner
  misassigned) is worth ten forgotten identifiers.
- **A wrong answer is the point.** It buys a repair; a session where everything is answered
  correctly probed too shallow.
- **Never quiz what was never taught** — that is an exam, not a check. `understanding.md`'s
  *Never tested* bucket names what was merely shown; those are legitimate targets, framed as
  "we covered this in passing — what stuck?".
- **Two or three probes, then stop.** This is a check, not an ordeal.

## 1. Read the model

Load `understanding.md` from the study home (tolerate an absent or non-standard file — reconstruct
what you can from the cursor and the conversation, and say which tier you read from). Rank
candidates by decay risk:

| Priority | Why |
| --- | --- |
| **Corrected entries** | Highest — a repaired misconception regresses toward its original shape, especially one that needed teaching twice |
| **Aged Confirmed entries** | Confirmed has a shelf life; the older the date, the more it is a claim about the past |
| **Open items the learner flagged** | Was the answer they were given actually absorbed? |
| **Never tested** | Shown but never probed — cheap to convert into real evidence |

## 2. Probe

Pick two or three. For each: ask the learner to narrate; if the narration is too vague to locate
a gap, *then* reach for a structured probe as a diagnostic — a prediction ("given this input,
what happens?"), a contrast ("how does this differ from X?"), or an ownership assignment ("who
holds that state?"). Never lead with the structured form: a template makes them complete your
sentence; a narration exposes their model.

## 3. Grade the model, not the answer

For each probe, classify and write back to `understanding.md`:

- **Held** — restate their words, refresh the date, lower its re-probe priority.
- **Decayed** — they had it, they lost it: move back to *Corrected* with today's date and a raised
  regression risk. Repair on the spot, briefly.
- **Never actually landed** — it was taught but the answer shows it never took. Record *how* it was
  taught, because that is evidence about the teaching, not just the learner (e.g. a correction
  hidden behind an interaction they never performed).
- **Newly exposed gap** — something neither of you knew was missing; add it to *Never tested* or
  *Open*.

Repair only what the probe exposed. Do not replay a lesson.

## 4. Report

A short verdict: what held, what slipped, what to re-teach. If several items in one area slipped
together, say so — that is a signal the *level* needs revisiting, not the items. Offer once to
resume with `/fathom:guide` (or to open `/fathom:dive` on a shaky topic); never start teaching
uninvited.

## Companion skills

- **`/fathom:guide`** — the teaching climb; its per-level gate is an exit exam, this is spaced
  retention checking, and both write `understanding.md`.
- **`/fathom:dive`** — where a shaky answer should go when the learner wants to chase it rather
  than be re-taught.
- **`/fathom:index`** — re-ground when an answer cannot be judged because the facts themselves are
  unclear at the pin.

## Communication style

Explain in the user's language with simple, direct wording. Lead with one plain sentence. Ask one
question at a time and wait — a batch of probes is an exam, not a conversation.
