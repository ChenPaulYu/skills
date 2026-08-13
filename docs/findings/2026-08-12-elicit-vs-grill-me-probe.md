# Finding — elicit vs grill-me, blind opening-volley probe

**Date**: 2026-08-12 · **Method**: `/shape:probe` shape #2 (blind judgment test) · **n = 1 trial, opening turn only**
**Context**: ADR-109 designated the compressed `elicit` as the probe validating the deep-module rewrite, with the standing question: does elicit's machinery beyond mattpocock's 14-line grill-me earn its lines?

## Design (pre-registered before generation)

- **Claim under test**: elicit's extra stance (repo grounding · friction · principle-drilling) produces an opening volley the user more wants to answer than grill-me's bare interview engine.
- **Arms**: two same-tier agents, same real question (the repo-identity fork: daily-leverage tool vs design dojo), same length cap, same known facts; one carrying grill-me's instructions verbatim, one carrying elicit's body (skill names neutralized to keep the blind clean).
- **Verdict rule, fixed in advance**: the user picks blind — "哪一份你比較想回?" — plus one sentence why. elicit loses or tie → keep compressing toward grill-me.
- **Labels**: assigned by completion order (甲 = elicit, 乙 = grill-me), identity revealed only after the pick.

## Result

**grill-me won.** The user's reason: 「比較沒有直接做結論」.

The diagnostic detail: **both arms carried a recommended answer** — the difference was its target. grill-me recommended on the *first branch* (are the two roles mutually exclusive, or a division of labor? — a premise question), walking the tree from the root. elicit recommended on the *destination* (「我的猜測是前者」 — the answer to the whole question) before any branch had been walked, then dressed the verdict as friction (「但想聽你反駁」). The stance bullets "every question carries your recommended answer" + "friction, not agreement" composed, in this sample, into verdict-first opening — exactly the behavior the user declined to engage.

## What changed (same day)

`plugins/shape/skills/elicit/SKILL.md`, two stance bullets amended:

1. **A recommendation is an offer, never a preset** — Paul's own ratification of the lesson, broader than the branch/verdict split I first wrote: 「你不能直接幫別人預設答案,可以提出建議,但不能過度引導」. Concretely: no verdict-first openings, no loaded framing that makes one option the only sane pick, no re-pushing a vetoed preference; a veto must cost the user nothing.
2. Friction aims at **their last move, not the endpoint** — a pre-announced conclusion = you've stopped asking.

## Honest limits

- n = 1, opening turn only; full-session convergence and bail rates remain unmeasured — the live checkpoint over the coming weeks is still the real verdict on elicit's remaining ~16 lines.
- Both arms ran on the executor tier, not the session model, and **neither arm actually read the repo** (0 tool calls each) — elicit's grounding mandate did not fire in simulation, so this trial says nothing about the grounding bullet's value.
- One trial cannot separate "grill-me's tree-walking is better" from "this particular elicit sample was bad"; the amendment targets the specific observed failure, not the whole stance.
