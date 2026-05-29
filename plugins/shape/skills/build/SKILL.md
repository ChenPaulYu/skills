---
name: build
description: Drive the plan's In-progress column to done — autonomously, one item at a time, but stopping to ask the moment scope/boundary/intent drops below 90%. For each In-progress item it grounds the item into a code plan via /nav:plan, implements it with /nav:refactor discipline + the inject↔check hand-off, verifies it (a browser screenshot compared against the item's mockup for visual items; a test-gate for behavioral ones), moves it to Shipped, and regenerates the board via /shape:align. Fires when the user asks to "build the In-progress", "implement the plan", "do the next items", "run the plan to done", "ship the current batch", "just make it" against a blueprints/ plan. Also invokable as /shape:build. A meta-skill: it orchestrates sibling protocols (reuse-via-transcript), never re-implements them, and never calls another skill directly. Language- and framework-agnostic; visual verification uses a per-project browser-verify slot (default: agent-browser).
---

# Build — drive the In-progress column to done

The forward-motion terminus of shape: take the plan's **In-progress** items and make them real — autonomously, one at a time, each grounded into a code plan, implemented under discipline, and **verified against its mockup** — pausing to ask whenever confidence drops. Where `mockup` and `elicit` and `align` converge *decisions*, `build` turns the converged plan into running, verified code.

## Why this skill exists

A blueprint that never gets built is just a description — and shape's whole spine is "converge by a real instance, not a description." `build` is where the convergence becomes **the most real instance there is: the running system**, checked against the mockup that captured the intent. It exists so the loop closes: elicit/mockup decide → align plans → **build makes it real** → nav keeps it navigable.

It is a **meta-skill**, like `/nav:doctor`: it sequences other skills' protocols rather than re-implementing them.

## The shape spine (restated — this skill is self-contained)

> **Converge by a real, disposable instance — never a description.** build is the spine's terminus: the disposable instances (mockups) converged the decision; build produces the **durable real thing** and verifies it against that mockup. The "two renders" (plan.md / overview.html) gain a third: the running system (a screenshot).

> **Below 90% → ask (core principle, shared with `nav` rule ⑦).** This is build's leash. It runs autonomously **only while confidence holds**; the instant scope/boundary/intent on the current item drops below 90%, it stops and asks rather than plowing ahead.

## Core — confidence-gated autonomy

> **Run to done, but stop on doubt.** build is not "review every item" (too slow) nor "blast through to the end" (dangerous). It drives item after item on its own, and the cadence is governed by confidence: a clear item flows; an ambiguous one (unclear scope, a boundary it can't infer, intent it can't read) **halts and asks**. A red test halts. A blocked item surfaces — it never thrashes.

## The per-item loop

For each item in `plan.md`'s **In progress** column (each references a `thoughts/` doc):

1. **Ground — via `/nav:plan`.** Turn the item/thought into a code-level plan (Context · Approach · Critical files · Verification). Reuse-via-transcript: if `/nav:plan` (or `/nav:audit` Mode 2) already ran for this item this session, reuse its output instead of re-running.
2. **Summarize — a visual checkpoint (mockup protocol).** Right after grounding, render a quick **interactive diagram summarizing the plan** — what changes, the approach, the affected files — following the `/shape:mockup` protocol (an interactive diagram, *not* a prose description). Two payoffs: a **decidable checkpoint** to glance at before any code is written (confidence-gate — if the summary reveals the plan is wrong, stop and re-ground rather than build the wrong thing), and for an item that has **no existing mockup**, this summary *becomes* the verify target in step 4. (build *sequences* this — it does not call the mockup skill; the agent renders per the mockup protocol, into `mockups/`.)
3. **Implement — `/nav:refactor` discipline + inject↔check.** Move verbatim where refactoring; **test-gate after every step**. Do the work as a **sequential subagent-per-item** (one at a time — concurrent code edits collide). Bracket the hand-off: **inject** the grounding the sub-agent can't see (critical files + roles, existing impls/seams to reuse, the **N+1 trigger**); **check** the returned diff (same-domain parallel impl · seam/facade read at intent · header hygiene) before accepting "done".
4. **Verify — visual-first, against the mockup.** Use the **browser-verify slot** (see below): open the running feature → screenshot → place it **side-by-side with the item's mockup** (its own, or the step-2 summary if it had none) and check for drift. Non-visual items (backend / logic / data) → test-gate / behavioral check; do **not** force a screenshot where there's nothing to see (that's structure-theatre). The screenshot (+ mockup comparison) is the item's **Shipped evidence**.
5. **Land.** Move the item to **Shipped** in `plan.md`; run **`/shape:align`** to regenerate `overview.html` (with the screenshot as evidence). Then the next item.
6. **Exit.** In-progress empty → stop and report (per-item: what shipped, the screenshot/mockup comparison, anything flagged).

## browser-verify slot (the dependency, handled as a capability)

build does **not** hardcode a browser tool — it uses shape's shared **browser-verify capability slot** (defined once in `plugins/shape/CLAUDE.md`; shared with `mockup` + `align` per the N+1 trigger):

- **Default implementation: `agent-browser`** (vercel-labs/agent-browser). Detect with `which agent-browser`. Usage: `agent-browser open <url>` → `agent-browser screenshot <file>.png`; `snapshot -i` / `click @e` / `fill @e "..."` to interact.
- **If missing, fail helpfully — never silently skip.** Surface a 3-way choice (a confidence-gate stop): **(a) install** [recommended — visual verify is build's headline]: CLI `npm install -g agent-browser` (or `brew`/`cargo install agent-browser`) then `agent-browser install`; or as a skill `npx skills add vercel-labs/agent-browser`. **(b)** proceed test-only this run (flag items to eyeball). **(c)** skip verify for this item. Report what was skipped (no silent caps).
- **Per-project override:** a project may bind a different helper (Playwright, etc.) in its own CLAUDE.md; absent that, the default is agent-browser.

## The three seams (build is the cross-plugin orchestrator)

- **← reads shape:** `plan.md` (the work-list) + `mockups/` (the verification target).
- **↓ calls nav:** `/nav:plan` (ground each item) · `/nav:refactor` discipline (implement) · `/nav:headers` (cheap grounding for the inject step).
- **→ writes shape:** `/shape:align` (re-render the board after each item).

This is the most concentrated point of shape↔nav communication — build *controls* the loop (it lives in shape, forward-motion) while *calling* nav's code-side protocols.

## Meta-skill discipline (do not skip)

- **Skills don't call skills.** build names the sibling protocols and describes the sequence; the executing agent runs them (reuse-via-transcript; for the browser slot, the agent invokes the tool/skill itself).
- **Reuse-via-transcript.** Before grounding an item, scan recent turns — if `/nav:plan`/`/nav:audit` ran for it, reuse.
- **Confidence-gate every item.** Below 90% on scope/boundary/intent → stop and ask. This is the core, not an option.
- **Sequential, not parallel.** One item's implementation at a time — concurrent code edits collide.
- **Test-gate + inject↔check every step.** A red test halts the loop; a sub-agent's "done" is checked against the diff before it counts.
- **No silent caps.** If visual verify was skipped (no helper) or an item was deferred, say so in the report.

## Output

- Items moved In-progress → Shipped, each with evidence (screenshot + mockup comparison, or the test/behavioral result).
- A regenerated `overview.html` reflecting the new Shipped baseline.
- A run report: what shipped · what was flagged/asked · what's blocked · what verification was degraded (if any).

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| Blast through all items without stopping | Confidence-gate is the core — stop on doubt, not just at the end. |
| Re-implement nav:plan / nav:refactor inline | It's a meta-skill — sequence the protocols, don't duplicate them. |
| Call another skill directly | Skills don't call skills — name the protocol, the agent runs it. |
| Implement items in parallel | Concurrent code edits collide — sequential per item. |
| Force a screenshot on a pure-logic item | Structure-theatre — visual verify only where there's something to see. |
| Silently skip visual verify when the helper's missing | Fail helpfully: offer install / test-only / skip, and report it. |
| Mark Shipped on a red test or unverified diff | Test-gate + inject↔check gate every item. |
| Plow past a blocked item | Surface it and ask — never thrash. |

## Companion skills

- **`/shape:align`** — produces the In-progress list build consumes, and re-renders the board after each ship.
- **`/shape:mockup`** — produces the `mockups/` artifacts build verifies against.
- **`/nav:plan`** — grounds each item into a code-level plan (build's step 1).
- **`/nav:refactor`** — the implementation discipline build applies (verbatim move + test gates).
- **`/nav:headers`** — cheap grounding for the inject step.
