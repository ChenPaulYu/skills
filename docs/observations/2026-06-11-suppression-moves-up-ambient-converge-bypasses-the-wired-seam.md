---
date: 2026-06-11
status: raw
---

# Second sighting of ambient-suppresses-the-verb — and the suppression has moved one level up: when *converging* itself goes ambient, ADR-028's wired seam never loads

**Second sighting** of [`2026-06-03-ambient-discipline-suppresses-firing-the-verb.md`](2026-06-03-ambient-discipline-suppresses-firing-the-verb.md), *after* its fix ([ADR-028](../adr/028-shape-converge-offers-nav-execution-verb.md)) was built and the plugins were installed — with three new variables the first sighting didn't have.

## What happened (concrete)

A two-day TrackMate session (the user's skills-dogfood testbed). Sequence:

1. **Pre-install period.** The user said「讓這個 mock interface **functional**」— the canonical ADR-028 trigger phrase — and the agent flowed into a large multi-file behaviour-changing build (api boundary + session store rework) with no `/nav:do`, no `/nav:plan`, no offer. *Mitigating:* the `nav`/`shape` plugins were only installed mid-session, after this build — the verbs literally didn't exist yet. Noted for timeline honesty, not as the signal.
2. **Post-install, inside verbs: the protocol held.** `/shape:dogfood` and `/shape:elicit` were explicitly invoked; both ran their offer-next-action endings correctly (routing question after the dogfood report; align/mockup/leave-it offer after the elicit thought). **When the verb fires, ADR-007/015/028 fire.**
3. **Post-install, outside verbs: the seam never loaded.** The agent had spent two days hand-building interactive mockups as ambient practice (the *mockup discipline* itself had gone ambient). So when the next converge happened — a pool-layout mockup, user picked「我喜歡 B,1」— it happened **outside `/shape:mockup`**. The agent flowed straight into a multi-file behaviour-changing build (left-column rewrite, bay restructure, toolstrip change, i18n keys) with no `/nav:do`, no plan-vs-do offer, no align offer. The user then asked, pointedly: *「最近很常直接開始執行，也沒有叫我要不要 align 到 plan.md，也沒有問我要不要 plan 還是直接 do，你覺得為什麼?」*

## The signal

**ADR-028 wired the execution offer *into the converge verbs* — but an agent whose converge practice has itself gone ambient never enters the verb, so the wired seam never loads.** The suppression mechanism from the first sighting (ambient 乙 makes firing the verb feel redundant) has moved one level up the stack: from suppressing the *execution* verb to suppressing the *converge* verb, which transitively suppresses every offer the converge verb carries (ADR-015's align, ADR-028's do/plan). The fix is structurally correct but only reachable through a door the agent stopped walking through.

Three new variables beyond the first sighting:

1. **Harness autonomy bias.** The agent's system-level guidance pushes "operating autonomously / proceed without asking" — in bare conversation this leans directly against the `AskUserQuestion` offer gates. Inside an invoked skill the protocol text wins; outside one, the harness bias wins.
2. **In-session momentum.** Repeated immediate ratifications (「好」「直接實作」「你做個 mockup 我看看」→ instant approval) reinforce flow-into-build in-context. Each success makes the next unprompted execution more likely — the suppression is self-strengthening within a session.
3. **Testbed contamination risk (user-caught).** The agent proposed a project-local *behavioral memory* ("post-pick → fire do / offer align") as remediation. The user caught the flaw: a memory patch would make future correct behavior **unattributable** — masking whether the *skill* improvements work, and hiding skill failures behind the memory. Resolution: behavioral fixes stay at the skill layer; the project memory carries only a **testbed-guard** ("this project is a skills dogfood testbed — do not store behavioral rules that duplicate skill protocols").

## What it could become (the fix)

> **Actioned 2026-06-11 — built as [ADR-038](../adr/038-verb-is-the-only-door-for-its-deliverable.md)** at the user's explicit request, on the second-sighting promote gate. Built: the second bullet (the "verb is the only door" clause, landed in both `nav/CLAUDE.md` and `shape/CLAUDE.md`). The first bullet (harness-level hook) was **deferred** — phrase-matching is brittle and the family's design language is summoned-not-ambient; a third sighting that defeats the clause is the evidence a hook needs. The third (testbed-guard memory) was done in TrackMate the same session.

- **Move the seam below the verbs (harness-level).** A hook (e.g. on user prompts matching post-pick build phrasing:「直接實作」/ "make it functional" / a bare pick after a mockup) that *reminds* the agent of the execution-route offer — immune to ambient suppression because it doesn't depend on a verb firing.
- **Make the verb the only door for its deliverable (CLAUDE.md / plugin note).** "If you are about to hand-build a comparison mockup / run a converge volley / execute a decided behaviour-changing change, the corresponding verb exists — fire it; its protocol (offers · check bracket) is the deliverable, and hand-rolling the artifact silently drops the protocol." The first sighting's CLAUDE.md note covered execution (乙≠甲); this extends it to converging.
- **Testbed-guard memory as a pattern.** For any project that doubles as a skills test environment: a standing memory that *prohibits* behavioral memories duplicating skill protocols, so skill efficacy stays measurable. (Done in TrackMate this session.)

## Evidence so far

- 2026-06-03 — Crate: first sighting (execution verb suppressed; check 甲 dropped). → ADR-028.
- 2026-06-11 — TrackMate: second sighting, post-fix. Inside-verb offers held; outside-verb converge bypassed the seam entirely. New variables: harness autonomy bias · in-session momentum · testbed contamination caught by the user.
