---
date: 2026-06-30
status: raw
---

# shape:align shouldn't unconditionally maintain a human render (overview.html) that has no reader — verify the human render is consumed, else degrade to plan.md-only + an on-demand human view

> Source: 2026-06-30, re-syncing a project's blueprints board via /shape:align after a reconcile; the user said "I never actually look at overview.html — do we really need to maintain it?" — and they were right.

## What prompted it

align's Step 5 regenerates `overview.html` (the human-facing board) on every run, and the skill frames the two-render split ("one current state, two renders" — `plan.md` for the agent, `overview.html` for the human) as load-bearing: both must stay current or one "lies". But on this project the human render had **zero readers** — the user never opened it. So every align run regenerated it and every reconcile fixed its dead links, all for an artifact no one consumed. The two-render machinery is justified only when *both* renders have a consumer; here the human one didn't.

## The signal

**A maintained projection only earns its upkeep if it has a verified consumer — and `overview.html` is a cache of `plan.md`+`decisions.md` rendered for a human. Caching beats derive-on-demand only when reads are frequent (amortize the upkeep) AND regeneration is expensive. A solo project where the human never opens the board is the opposite: reads ≈ 0, regen ≈ seconds → derive-on-demand wins.** Maintaining it is then pure overhead plus a stale-render risk, and — counterintuitively — *dropping* the unread render *removes* the two-render drift problem rather than creating it (there's no second stored story to diverge).

The two-render principle also quietly bakes in a multi-reader assumption (a human reads one render, an agent the other). For a solo/local-first project the "human reader" is the same person who reads `plan.md` fine — so the second render serves no one.

The skill-feedback bind (S · P · D):
- **S** = `shape:align`
- **P** = Step 5 ("Regenerate overview.html") + the "two renders, one state" principle that frames it as mandatory
- **D** = before maintaining the human render, **check whether it has a consumer** (solo project / user signals they never read it). When it doesn't, support an **on-demand mode**: `plan.md` is the sole *maintained* board (agent + human read it), and the visual human board is **generated fresh from it only when actually wanted** — never stored, so it can't go stale. Record the deviation where the next align run sees it (e.g. the plan.md header) so align doesn't recreate the standing file.

Why it matters: "a stale board is a lie" is the skill's own rule — but the cheapest way to never lie is to not maintain a render nobody reads. The skill should make the human render *consumption-gated*, not unconditional.

## Evidence so far

- **Only case (2026-06-30, a solo local-first project's blueprints)**: align maintained `overview.html` across many sessions; the user revealed they never read it; we retired it, made `plan.md` the single maintained board, and moved the human view to on-demand generation. The same session's reconcile had just spent effort fixing `overview.html`'s dead links — upkeep on an unread file.

(One case → stays `raw`. Promote if a second project independently retires its human render as unread — that's the trip-wire to make the consumption-check + on-demand mode a documented branch in align's Step 5, not a per-project deviation.)

## Links

- Feeds `plugins/shape/skills/align/SKILL.md` → Step 5 (regenerate overview.html) + the "two renders, one state" spine; and `references/blueprints-spec.md` (the overview.html convention).
- Relates to the general "a maintained projection needs a verified consumer" principle that also touches `/nav:map`'s codebase map (agent-consumed, so its upkeep IS justified — the contrast sharpens the rule).
- Candidate for a shape ADR if a second project confirms it: "human renders are consumption-gated; derive-on-demand when unread."
- **Applied 2026-06-30** (maintainer ran observe → skill change directly, skipping the ADR step). The fix landed in the **single owner of the overview.html convention** (`align/references/blueprints-spec.md` § Weight-adaptive — the consumption-gate paragraph), with the two consumers deferring to it: `align/SKILL.md` (spine corollary + Step 5 gate) and `setup/SKILL.md` (don't pre-scaffold an unread render at birth). Putting it only in align would have leaked the same rule the shared spec contradicted — the user caught that ("這樣 setup 也要改?"). Stays `raw` as the single grounding case; a second project would graduate it to an ADR.
