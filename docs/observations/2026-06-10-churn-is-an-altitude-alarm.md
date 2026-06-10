---
date: 2026-06-10
status: raw
---

# Churn is an altitude alarm — a decision that keeps flipping is being debated at the wrong layer

> Source: TrackMate design session (2026-06-10). The same structure appeared twice in one day, once at product level and once at UI level.

## The two cases

1. **Paradigm churn (morning):** the product's main-screen paradigm flipped four times across feedings (Artifact Feed → chat-first → workbench → Cursor-frame). It only stopped when a first-principles pass erected the principle tree (axiom → first principle → four derived principles) — after which each paradigm question became a lookup, not a debate.
2. **Placement churn (afternoon):** the pool/tool entry point flipped four times (right-rail handle → left dock → corner pill → summonable toolstrip). A `/think:first-principles` self-audit then surfaced the rule underneath — **entrance hierarchy: composer > keyboard > visual affordance** — and the churn stopped instantly. The *positions* were form; the *hierarchy* was the rule. Form churns; rules don't.

## The move

When a decision gets re-litigated a second time, stop arranging furniture and ask: **"what is the one-layer-up rule that would make this a lookup?"** Then converge that rule (elicit / first-principles), and let the form fall out. The agent's failure mode (committed in case 2, admitted in the self-audit): happily iterating the form alongside the user for four rounds instead of lifting the question after round two.

## Test to apply

- Form layer: "where should X sit / what should X look like" — expect churn, cheap to redo, lives in mockups/thoughts.
- Rule layer: "what decides where X sits" — one ruling, stable, lives in core.
- The alarm threshold: **second flip on the same decision → lift one layer.**

## Where it could land

- A guard inside `shape:mockup` / the future `shape:position` ("two flips → offer to elicit the governing rule before rendering a third variant").
- Possibly a `think` lens sibling (altitude-check), or simply a line in elicit's diagnostic mode.

## Related

- `2026-06-10-position-verb-canon-campaign.md` — the altitude test this alarm feeds (原則/作法/賭注).
- `2026-06-05-drilling-to-the-atom-two-failure-modes.md` — adjacent drilling failures.
