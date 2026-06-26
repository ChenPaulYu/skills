---
date: 2026-06-26
status: raw
---

# `/manage:observe`'s own-learning bar is too low — it admits the user's own in-session insights and the agent's session-recap, so a skill-feedback-less session degenerates into handing the user back their own thoughts

> Source: a project session that ran observe at the end. It surfaced 5 "own-learning" candidates; the user rejected **all 5** with — "observe isn't for improving skills, it's just listing which pitfalls *you (the agent)* stepped in." Every candidate was either (a) the user's OWN in-session insight (already recorded in the project's `thoughts/`/`decisions.md`) or (b) the agent's reasoning-recap. The session produced ~zero real skill-feedback. Ironically the user's *critique* was the one genuine skill-feedback — this note.

## What prompted it

observe is sold as the first step of the repo-evolution loop (lived experience → observation → ADR → skill change) — its load-bearing value is **skill-feedback**. But in a session where the user drove all the design insight themselves, the agent's Step-2 scan produced only own-learnings, and the own-learning selector ("*a real, likely-recurring lesson*") was weak enough to admit two false positives:

- **the user's own just-made calls** (e.g. a design reframe they proposed, a "do we even need X?" they asked) — already captured in the project's `thoughts/`/`decisions.md`/`plan.md`, so writing them into the KB is *redundant*, not a learning; and
- **the agent's narration of what it figured out** ("here's the principle I applied / the bug I hit") — which is `/manage:summarize`'s job, not a durable KB note.

The skill *does* warn "don't manufacture a candidate", yet the agent manufactured 5 — because the selector gave it no grounds to **reject** these two classes. "Durable + reusable" is true of both classes, so durability alone can't filter them.

## The signal — the bind

- **S**: `/manage:observe`
- **P**: Step 2's **own-learning selector** (the "durability" test, the SKILL's line ~46)
- **D**: raise the bar from *durable* to **durable AND news to the USER**. Explicitly reject (a) the user's own in-session insight already in the project's `thoughts/decisions/plan`, and (b) the agent's session-reasoning recap (→ `/manage:summarize`). When the only own-learning candidates fail this **and** no skill-feedback bind emerged, the honest output is **"nothing keepable"**, not a padded list of the user's own thoughts handed back. The scan should bias hard toward skill-feedback (observe's actual purpose); own-learnings are the exception that must clear the news-to-the-user bar.

The deeper failure mode: **"the agent's reasoning during the session" ≠ "a learning for the user."** A reusable principle the agent *applied* is recap; a non-obvious thing the user would otherwise *re-derive* is an observation. The selector must test for the latter.

## Evidence so far

- **Only case (2026-06-26, a generative-audio project session)**: 5 own-learning candidates surfaced, all rejected by the user as "my own thoughts / your recap"; the user's meta-critique was the lone genuine skill-feedback. Fix shipped same day to the Step-2 selector + the "nothing keepable" reminder.

(One case → stays `raw`. Trip-wire: a second session where observe pads an own-learning list the user dismisses as redundant-with-their-own-docs or agent-recap → promote, and the selector fix earns an ADR.)

Likely feeds a future ADR on **observe's two-kind selector** (the own-learning test is the under-specified half; the skill-feedback bind is already sharp).
