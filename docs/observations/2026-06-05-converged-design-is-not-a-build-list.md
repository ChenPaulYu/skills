---
date: 2026-06-05
status: raw
---

# Converged design ≠ build-all — slice the build by risk (tracer-first, gated), and volunteer "is this worth building" before grounding it

> Grounding for a **possible verb / discipline in the `align ↔ nav:plan` seam** — today no step takes ONE converged feature and slices it into risk-ordered build phases. Source: one long Crate session designing step-2 AI integration (elicit-style dialogue → mockup v1→v3 → a thought doc → `/shape:align`). **Not yet promoted**: `raw`, one project, one session (ADR-018 gate — needs to recur + friction-test elsewhere before it's a skill/ADR). See also [[2026-06-02-workflow-seams-re-pay-grounding]] (the seam idea), [[2026-05-29-thought-mode-how-paul-converges]] (the convergence half this sits downstream of), [[2026-06-02-first-principles-positioning-check]].

## The case (kept real — Crate's AI integration)

A long session converged a whole step-2 feature: **"AI on the graph" = one right-click launcher, three interactions (chat / dispatch / quick) along a memory×blocking axis.** It produced a polished, fully-playable mockup (iterated v1→v3) + a committed thought doc. The design was *done*.

Then the user said **「不該一次做完」** — and the session's most useful output turned out to be not the design but the **build slicing**:

- The mockup is a **north-star spec, not a build list.** (Distinct from `mockup`'s existing "retire-on-ship / don't make a *shipped* lock a north-star the system must match" — that's about a shipped detail inverting reality; *this* is about not building the whole *un-built* converged thing at once.)
- Slice the build by **risk**: a **tracer-bullet first** = the smallest end-to-end that tests the riskiest, most-product-*unique*, most-*unproven* assumption (here: *"does AI output landing as a gated primitive — not a chat message — feel right, and will anyone reach for it?"*). Reverse-complexity order fell out for free: quick-verb tracer → AI note → dispatch (heaviest, last). The tracer also happened to build the shared `ProposedDiff` spine — **the cheapest test was also the architecturally-foundational slice.**
- **Gates between slices**: "did the prior slice *earn* the next?" — not a fixed schedule. If the tracer flops you spent one slice, not the whole machine.

A paired move surfaced earlier in the same session: when the user asked "你覺得?" / "is this better than Heptabase?", the useful answer **volunteered the honest direction-risk** — it may be heavier than the alternative (just typing a note); it's designed ahead of demand (zero users, step-1 not dogfooded to pain); a polished mockup's smoothness is half-scripted because the proposer wrote *both* the questions and the answers. The user built on those rather than bristling.

## The principle

> **A converged design tempts you to build it whole. Don't. Slice the build by the riskiest unproven assumption — smallest tracer first, gates between — and before grounding any of it, volunteer whether it's worth building at all.**

Two halves:
1. **Slice by risk, not by feature-completeness.** The first slice's job is to *learn* (does the bet hold? does anyone reach for it?), not to deliver a coherent sub-feature. The cheapest learning-slice is often the foundational one.
2. **Volunteer the worth-it question.** A fully-rendered design *feels* validated; it isn't. The honest "is this worth building / what's the demand risk" is the proposer's to raise, not only the user's to discover.

## The seam it falls in

The shape→nav pipeline is `elicit`/`mockup` (converge the design) → thought → `align` (triage features now/next/later) → `nav:plan` (ground ONE item into code) → `build` (execute).

- `align` prioritizes **across** features (which feature next).
- `nav:plan` grounds **one** item into a code plan.
- **Neither slices ONE converged feature into risk-ordered tracer phases** — that step is missing, and it's exactly where "不該一次做完" lives. `build`'s incrementality is *execution cadence* (one plan item at a time, stop-below-90%), not *risk-slicing a design before a plan exists*.
- `rehearse` (ADR-020) is adjacent — it walks a feature's usage to find holes (direction-wrong vs unfinished) — but answers a different question than "what's the smallest slice that tests the bet."

Candidate homes if it matures: a discipline bullet on `nav:plan` ("before grounding, slice by riskiest assumption; tracer-first; gate slices"), or a thin verb between align and nav:plan.

## Why not promoted

One session, one project. ADR-018's gate = evidence + friction-tested-through-reframes + principle-level, **not** session-count — and this was grounded + friction-tested *once*. If "converged-but-don't-build-all → slice by risk + volunteer worth-it" recurs in another project, it's a strong promotion candidate. Until then: raw.
