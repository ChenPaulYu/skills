# ADR 114 — Cost gates: verification and dispatch ask first when they're expensive, run when they're cheap

**Status**: accepted
**Date**: 2026-08-13
**Source**: ratified by Paul 2026-08-13 — 「verify, dogfood 現在有時候會直接接著做完直接開始測，但在我 token 不足的時候這樣其實很浪費」…「如果是直接後端測試或者跑 test 這個可以直接跑（除非他要耗掉大量 LLM token）…前端或者一些 computer use 自動化可以先問…很難測，那一定要問…開 web browser 測一下大概 5 輪以內會結束可以直接測，其他中間的都要問」…「用 AskUserQuestion tool 來詢問」…「default 是用小模型」.
**Precedent**: [ADR-062](docs/adr/062-live-llm-cost-signal.md) (the live-LLM-cost signal this generalizes) · [ADR-067](docs/adr/067-dispatch-tiers-consultant-seat.md) / [ADR-081](docs/adr/081-dispatch-proposal-gate-and-self-report.md) / [ADR-088](docs/adr/088-task-tier-taxonomy.md) (dispatch) · [ADR-040](docs/adr/040-parallel-dispatch-proposal-gate.md) (one ask per batch).

## Context

Two complaints, one shape.

**Verification auto-ran.** `nav:do`'s check gate was literally titled *"Verify gate (unconditional)"*, with an anti-pattern row forbidding a skip. Correct as a safety law, but it made the *spend* unconditional too: a change lands, and a browser session or a live-LLM run starts without anyone deciding it was affordable.

**Dispatch fired unpredictably.** Two rules governed it and disagreed. The repo (ADR-081, 2026-07-14) said propose the batch first; Paul's standing global rule (2026-07-16, later) said dispatch automatically without asking. Whichever an agent read first won — which is why the trigger looked arbitrary. Grounding the dates showed the newer ruling had already superseded the older text; ADR-081's own **downgrade valve** ("don't ask again for this line of work") had simply been pulled globally and never written down. Not a conflict of laws — **an exercised valve with no record**.

The unifying defect: **both made a spending decision *standing* when it should scale with the cost.** A gate that fires on every dispatch becomes noise and stops being read — which is exactly why the 2026-07-16 rule exists.

One capability changed what is now possible: **spend is measurable, not estimated.** Every turn's usage sits in the local session logs, so a day's real token cost is a computation, not a guess. ("Expensive" stops being a feeling.) What remains unknowable is the *remaining* quota — the plan limit is invisible until it is hit — so the threshold has to be a number the user supplies, not one the agent infers.

## Decision

**Cost-scale both gates. The action stays unconditional; only its auto-execution is gated.**

### 1. The verify gate

Run **without asking** — cheap and machine-graded:
- typecheck · lint · the test suite · a backend/integration run · a CLI install-path check
- **a browser pass statable up front as ≤5 interactions** (open → walk the one changed path → screenshot → confirm)

**Ask first — a real `AskUserQuestion`, one for the whole verification batch, never a sentence buried in prose:**
- anything spending **live LLM tokens** (un-mocked SDK client, fan-out, raised turn/researcher budget) — ADR-062's existing signal, unchanged, now one case of a general rule
- **frontend / computer-use automation** beyond that short pass
- anything **hard to verify** — *if you cannot state the check up front, you cannot budget it, so it is not yours to start*
- **everything in between: the default is ask.** Auto is the carve-out, not the rule.

**A declined verification is recorded, never silently skipped**: the report says *"shipped unverified at your call: \<what wasn't checked\>"*. This is the clause that keeps the original safety law intact — behaviour-changing work with no verification is still guessing, and that stays true whoever decided to skip. Saving tokens must not cost you the memory of which things were never checked; that debt is more expensive than the tokens.

`shape:dogfood` is computer-use automation by construction, so it gains a **step 0**: after the intent list exists, present the run's shape as a structured choice — interaction count, whether any intent touches a live-LLM path, and a scoped-down option (top N intents) beside the full run. **Declined outright → the intent list is the deliverable**, said plainly, so an unrun session is never mistaken for a clean one.

### 2. The dispatch gate

**Cheap → dispatch, report after**: read-only reconnaissance, ≤2 agents, no browser/computer-use, no live-LLM fan-out.

**Expensive → one real `AskUserQuestion` for the whole batch first** (ADR-040's pattern — never per-agent), listing the work items, the target tier, and what stays with the judgment seat. **Expensive** means: **any agent that writes files**, or **≥3 agents**, or **browser / computer-use driving**, or **a live-LLM fan-out**.

**The cheap hand stays the standing default tier** and is pre-selected in that question — ADR-067's tiering is unchanged; this ADR governs *when you are asked*, not *who executes*.

ADR-088's three criteria still govern whether a task is dispatchable at all. This gate sits downstream of them: first *may* it be handed down, then *should the user see it first*.

Calibrated against a real day (2026-08-13, ~15 dispatches): two read-only transcript miners would have run automatically; the file-writing batches would have produced about five asks, one per batch. Roughly five questions across a day of heavy work — visible, not noisy, and landing on exactly the batches worth seeing first.

## What is honestly lost

- **Uninterrupted flow on expensive work.** Some batches will now wait on a question that would have been answered "yes" anyway. Accepted deliberately: the alternative is a user who cannot predict what their agent is about to spend, which is the complaint that produced this ADR.
- **The comfort of "always verified".** The old unconditional gate meant a shipped change had *always* been exercised. Now it may carry a recorded verification debt instead. The debt is visible, which is the trade — but a visible debt is still a debt, and a project that accumulates them is less verified than one that could not skip.
- **A judgment call remains in the "hard to verify" branch.** It is a judgment, so it can drift — mitigated only by its phrasing (state the check up front or ask), not eliminated.

## Consequences

- `plugins/nav/skills/do/SKILL.md` — check gate #3 rewritten to the classify-then-act form with the declined-is-recorded clause.
- `plugins/nav/skills/refactor/SKILL.md` — Step 6's browser pass gains the same ≤5-interaction carve-out and debt-reporting rule.
- `plugins/shape/skills/dogfood/SKILL.md` — gains step 0, the pre-drive `AskUserQuestion`.
- Repo-root `CLAUDE.md` — the ★ Dispatch tiers bullet's proposal gate becomes cost-scaled, with the expensive/cheap definitions and the measured-not-estimated note; the 2026-07-16 standing rule is recorded as what it always was, a globally-pulled downgrade valve.
- Version bumps: `nav`, `shape`; surfaces and mirrors regenerated; validator green.
