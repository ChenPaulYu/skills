# Questioning — choosing the probe, and escalating when it misses

Two instruments, one seam: the **selector** picks which kind of question fits the learner's
current state; the **repair ladder** governs what happens when the answer comes back wrong.
Both are adapted from learn-codebase's Socratic library (ktaletsk/learn-codebase), re-grounded
on fathom's rules: flow governs, narration gates, evidence pins.

**A selector, not a questionnaire.** The mapping below chooses *the one check* the loop already
budgets (one per chunk, roughly three per level) — it never adds checks. If a fixed sequence of
question types starts running every time, the selector has become a script and has failed.

## The selector — what state they're in decides what you ask

| The learner's state | Probe kind | Its shape |
| --- | --- | --- |
| Hasn't formed a hypothesis yet | **Prediction** | "before I show you — what do you expect this to do / return / cost?" |
| Stated a judgment with no ground | **Evidence** | "what did you see that makes you think that?" |
| Smuggled in an unconfirmed premise | **Assumption** | "you're treating X as given — is it documented, or inferred?" |
| Two concepts blurring together | **Clarification / Comparison** | "when you say 'handles', which of these three things do you mean?" · "how would behavior differ if it were Y?" |
| Asking why it's designed this way | **Design reasoning** | "what would the alternative cost?" — and if unknowable from the code, say so rather than inventing intent |
| Wondering what a change would do | **Implication / Error prediction** | "if this fails mid-run, does the caller stop, retry, or continue?" |
| A stretch of learning just ended | **Narration (meta)** | "say the whole thing back in your own words" — the gate form |

Worked shape (abstract): the learner says *"this component is responsible for X."* Don't supplement
— descend: **Clarification** ("responsible meaning it checks, it stores, or it rejects?") →
**Evidence** ("which call shows it owning that?") → **Implication** ("if it's briefly down, what
does the caller experience?"). Stop the moment one of the three exposes the gap; the sequence is a
search order, not a routine.

**Prediction has a precondition**: something not yet revealed. It is the highest-value probe and
the easiest to destroy — once the behavior has been shown, the prediction question is theater.
Decide *before* revealing whether this chunk deserves a prediction, and if so, ask first.

## The repair ladder — when the answer is wrong

Fathom's rule is *repair only the exposed gap*; this is the gap-finding procedure when the wrong
answer hasn't yet located it. Escalate at most twice before explaining — each level cedes a little
more ground, and each is one message, not a stage:

1. **Conceptual reorientation.** Name the relevant distinction without the answer in it: "who owns
   the decision to continue — the caller, or the thing holding the state?" Preserves the most
   learner reasoning; try it first.
2. **Narrowed options.** Two or three candidates, **all plausible** — an option set with one
   obvious survivor is the leak the gate rules ban. Point at where the discriminating evidence
   lives ("the return value decides it"), not at the answer.
3. **Point at the evidence / fill the blank.** "Read what `run()` returns on that branch — the
   owner is ___." This is a *diagnostic*, never a gate: it confirms where the model broke, at the
   cost of the learner no longer deriving it.
4. **Explain directly** — plainly, without ceremony about the misses.

Then, **regardless of which level resolved it, verify the repair took**: re-ask the same
distinction in a case not yet discussed (the transfer probe in the per-level loop, step 7). A
repair that ends at "I see" was heard, not held.

**Hint depth is a flow signal.** Reaching level 3 on consecutive checks means the chunks are too
big — shrink them (the same dial as two-instant-corrects meaning they're too small). Track it in
the head, not in a ledger.

## Banned check phrasings

"Does that make sense?" · "any questions?" · "do you understand?" — in any language. Each invites
a yes that verifies nothing. Replacements: *say it back in your own words* · *apply it to this new
case* · *what's still fuzzy?*

## Where the siblings borrow this

- **`/fathom:quiz`** — the selector's narration-first rule is quiz's own stance; the structured
  rows serve as its diagnostic fallbacks, and the repair ladder applies when a probe exposes decay.
- **`/fathom:dive`** — a dive question that presumes something false is met with the Assumption or
  Evidence probe before the answer, not after it.
