---
name: summarize
description: "Produce a complete, objective recap of what THIS session did — what was attempted, done, decided, and changed (files / commits), in order, neutrally and exhaustively (not a selective TL;DR). Read-only; summoned; the raw input /reflect:observe distills. Fires on \"summarize this session\", \"what did we do\", \"recap everything\", \"full summary of this session\", \"write up what happened\", \"give me the rundown\". Distinct from /reflect:catchup (where the work stands NOW plus next — summarize is the complete log of what HAPPENED) and from /reflect:observe (which selectively distills the one durable learning and writes it; summarize is the objective whole that feeds it)."
disable-model-invocation: true
---

# summarize — a complete, objective recap of the session

Give a **complete and objective** account of what this session *did* — the full record, in order, neutral in tone. This is the **recap** move of the meta-lane: not "where are we" (`/reflect:catchup`) and not "the one keeper insight" (`/reflect:observe`), but **everything that happened**, faithfully. It is often the raw input you then hand to `/reflect:observe` to distill.

Optional focus from the user: **$ARGUMENTS** (scope to an area if given; else the whole session).

**Read-only.** Do not edit, write, or commit. summarize only reports.

## The discipline — complete AND objective (this is the forced structure)

A default summary is *selective* and *editorializing*; summarize is deliberately the opposite — that's why it's a skill and not just "summarize it":

- **Complete** — cover the whole session's work, not the highlights. Omissions are the failure mode.
- **Objective** — report what happened, not whether it was good/clever/right. No praise, no spin. Decisions are recorded as decisions (with the option chosen), not re-argued.
- **Grounded** — corroborate against durable state (git log / diff / changed files), not just chat memory, so the recap is accurate even if context was compacted.

## Step 1 — Gather the whole

```bash
git -C . log --oneline -20 2>/dev/null     # what landed
git -C . status --short 2>/dev/null         # what's uncommitted
git -C . diff --stat 2>/dev/null            # scope of pending change
```

Reconstruct the session's arc from the conversation **and** these signals. If they disagree, note it.

## Step 2 — Report the recap (fixed shape)

- **Goal of the session** — what it set out to do (may be several threads; list them).
- **What was done** — the actions, in order: changes made, files/areas touched, commands run, things built or fixed.
- **Decisions made** — each as `decision → option chosen → one-line why`, neutrally (no re-litigating).
- **What changed** — concrete artifacts: commits (hashes + messages), files added/modified, uncommitted work on the branch.
- **Open / unresolved** — anything left undecided, deferred, or failing (stated as fact, not judgement).

Keep it exhaustive but scannable (tables / lists). Lead each section with its point.

## Step 3 — Offer the distill (don't auto-run)

End by noting that the natural next step is **`/reflect:observe`** — distill the one durable learning worth keeping from this recap into the knowledge base. Offer it; don't run it. (Summarize is objective + complete; observe is selective + durable — the recap feeds the keeper.)

## Companion skills

- **`/reflect:observe`** — distills the one durable, reusable learning from the session and writes it (summarize is the complete objective whole that feeds it).
- **`/reflect:catchup`** — where the work stands *now* + the next step (summarize is what *happened*; catchup is where you *are*).
