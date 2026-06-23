---
date: 2026-06-23
status: raw
type: skill-feedback
---

# A selector belongs only to the verb that selects on that axis — so observe gets the new filter, summarize/catchup do not

> Source: a /think:first-principles + /shape:elicit pair after noticing /manage:observe "just catalogues pitfalls" instead of producing skill-improving insight.

## The decided principle (one line)
**Skill-improving feedback = a counterfactual bind: prescriptive + locatable + general** — it names a skill, a decision-point in it, and the changed behaviour that would fire there. "True + durable" is necessary but is *not* the selector. A selector belongs only to the verb whose job is to select on that axis.

## What changes, what doesn't
- **observe** — fix its selector. Its job *is* to select keepers, and it currently filters skill-feedback by **durability** (so it passes real-but-unbindable pitfalls = cataloguing). It should instead run each candidate through the counterfactual bind: *"if skill S did D at point P, this wouldn't recur — and D is a general rule."* Passes → keeper (foreground it, route to ADR/skill change). Fails → a personal-KB note, demoted. (own-learning keeps the durability test; **skill-feedback uses the bind test, not durability**.)
- **summarize** — **no change.** Its core is *complete + objective, no editorialising*. The moment it tags "this is skill-bindable" it is selecting → it breaks its own non-negotiable. It must stay anti-selective.
- **catchup** — **no change.** It selects on a *different axis* — "where are we now / next step", not "worth keeping forever". observe's selector is off-axis for it.
- **the lane doesn't propagate** — summarize already emits `decisions (decision→option→why)` + `what changed`, which is exactly the raw material observe's bind test chews on. Fix observe locally; don't push the filter upstream/downstream.

## Why (the axiom)
Improving a skill = changing what the agent *does* on future runs, which happens only via a concrete, general delta to the skill's text that fires at a deciding moment (knowledge ≠ trigger). A descriptive "we hit pitfall X" has no skill, no point, no delta — raw material, not feedback.

## Evidence so far
- **Only case (2026-06-23)**: this session's observe round surfaced A/B/C/D — all true, durable, reusable *pitfalls* (fallback paths ship broken · `**kwargs` swallows args · relative editable paths break on move · breaking-release blast radius) — none binding to a skill. Earlier the same session, `grounding-on-living-repos` and `born-primed` *did* bind (to setup) and *did* drive skill changes. The bind test cleanly separates the two batches.

(One case → `raw`. Trip-wire to promote → ADR: a second observe run where the bind test changes which candidate gets foregrounded. Feeds a change to `plugins/manage/skills/observe/SKILL.md` Step 2/3.)
