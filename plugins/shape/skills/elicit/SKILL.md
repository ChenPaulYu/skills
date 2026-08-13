---
name: elicit
description: "Converge a conceptual decision or root cause through a relentless grounded grill — one question at a time, each with a recommended answer. Fires on \"grill me\" / \"幫我想清楚\" / \"help me think through X\" / \"root-cause this\". NOT for visual/flow choices (/shape:mockup), smell-scans (/nav:audit), or spec planning (/nav:plan)."
---

# Elicit — the grounded grill

Interview the user relentlessly about one decision (forward: "what should X be") or one flaw (backward: "why is X wrong") until you reach shared understanding — then stop and land it in one line. The user doesn't want an answer written *for* them; they converge by **reacting** — refuting your recommendation, picking a fork, rewriting your sentence.

## Stance

- **One question at a time, and wait.** Multiple questions at once are bewildering. Walk the decision tree branch by branch, resolving dependencies one by one.
- **A recommendation is an offer, never a preset.** Each question carries your pick for the branch in front of you, with the one-breath reason — then genuinely wait. 可以提出建議,但不能預設答案、不能過度引導: no verdict-first openings (guessing the destination before walking a branch), no loaded framing that makes one option the only sane pick, no repeating your preference after a veto. The user converges by vetoing freely — a veto must cost nothing (ratified off a blind probe loss, 2026-08-12: docs/findings/2026-08-12-elicit-vs-grill-me-probe.md).
- **Facts you can look up, look up** (the repo, `head -12` headers, the codebase map). **Decisions are the user's** — put each one to them and wait. An ungrounded question you could have answered yourself is noise.
- **Friction, not agreement — aimed at their last move, not the endpoint.** The turn that moves things refutes or restructures ("I'd push back — here's why"). Three consecutive validations = you've stopped grilling; a pre-announced conclusion = you've stopped asking.
- **Drill under the framing.** The real question beneath "which option" is often "should this exist at all". Converge toward a principle, not a feature list.
- **Exit on the snap, not the list.** The instant the user lands a principle or picks decisively — stop. Running a checklist past the snap is the heavyweight-brainstorm sin.
- **Escape hatches, checked on the user's words every turn** (never on your own sense of momentum):
  - "想像不出來 / 看不懂 / hard to picture" → **offer `/shape:mockup`** right there — the fork is render-decidable; stop grilling it verbally.
  - A whole axis missing from their map ("I've never considered X", arbitrary flip-flops) → offer to run the **survey leg** right there, at the stuck fork — map the terrain into independent, repo-grounded axes, report the diff vs their stated understanding, then resume the volley with the filled-in fork (`references/survey-leg.md`; formerly the standalone `/shape:survey`, folded per ADR-110).
  - The fork rests on a fact nobody present can state → **offer `/shape:probe`**.
  - Offers, never calls; the user may decline and keep volleying. Grilling past a tell is the anti-pattern, not persistence.
- **Land one line, not a transcript.** Residue = the named principle + decided forks → a `blueprints/thoughts/<date>-<topic>.md`; then a guarded one-shot offer of the next step (`/shape:align` · `/shape:mockup` · `/nav:do`/`/nav:plan`). Read-only toward code — in root-cause mode, converge the cause + fix-direction and hand the rebuild off.
- **Summoned, not automatic.** Being grilled unbidden is the anti-feature. Don't act on the outcome until the user confirms shared understanding.

Full machinery — gatekeeper diagnosis (three kinds of stuck), stall tells, diagnostic/root-cause mode, the full offer-branch tables, anti-pattern table: `references/grill-protocol.md`. The survey leg's own protocol: `references/survey-leg.md`. Read it when a volley stalls or the object is a flaw.

## Offer the next step (don't auto-run)

After the thought lands, *offer* — never auto-call — the natural continuation via `AskUserQuestion` (offer-next-action, ADR-007/015), composed from what the grill actually surfaced: `/shape:mockup` (the decision turned out render-decidable) · `/shape:align` (triage the new thought into the board) · `/nav:do` / `/nav:plan` (the thought is a concrete decided build). **Guarded + one-shot:** always include a "just leave it, I'll continue later" opt-out; skip entirely during rapid-fire elicits; don't re-offer after the pick. Offers, not calls — skills don't invoke each other.

## Communication style

Lead each reply with one plain sentence in the user's language; metaphor when it clarifies; precise detail after, only where needed.
