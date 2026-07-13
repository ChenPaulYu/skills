---
name: build
description: "Drive the plan's In-progress column to done autonomously and serial by default, stopping to ask if confidence drops below 90%. For each item, it plans via /nav:plan, implements with /nav:refactor discipline and inject-check hand-off, verifies (via browser verify or tests), marks Shipped, and updates the board via /shape:align. Can propose a parallel schedule for independent items. Fires on \"build the In-progress\", \"implement the plan\", \"do the next items\", \"run the plan to done\", \"ship the current batch\", \"just make it\" against a blueprints/ plan."
disable-model-invocation: true
---

# Build — drive the In-progress column to done

The forward-motion terminus of shape: take the plan's **In-progress** items and make them real — autonomously, serial by default (parallel only by an approved schedule — see Scheduling), each grounded into a code plan, implemented under discipline, and **verified against its mockup** — pausing to ask whenever confidence drops. Where `mockup` and `elicit` and `align` converge *decisions*, `build` turns the converged plan into running, verified code.

## Why this skill exists

A blueprint that never gets built is just a description — and shape's whole spine is "converge by a real instance, not a description." `build` is where the convergence becomes **the most real instance there is: the running system**, checked against the mockup that captured the intent. It exists so the loop closes: elicit/mockup decide → align plans → **build makes it real** → nav keeps it navigable.

It is a **meta-skill**, like `/nav:plan`: it sequences other skills' protocols rather than re-implementing them.

## The shape spine (restated — this skill is self-contained)

> **Converge by a real, disposable instance — never a description.** build is the spine's terminus: the disposable instances (mockups) converged the decision; build produces the **durable real thing** and verifies it against that mockup. `plan.md`'s status gains a companion: the running system (a screenshot), referenced from the Shipped entry.

> **Below 90% → ask (core principle, shared with `nav` rule ⑦).** This is build's leash. It runs autonomously **only while confidence holds**; the instant scope/boundary/intent on the current item drops below 90%, it stops and asks rather than plowing ahead.

## Core — confidence-gated autonomy

> **Run to done, but stop on doubt.** build is not "review every item" (too slow) nor "blast through to the end" (dangerous). It drives item after item on its own, and the cadence is governed by confidence: a clear item flows; an ambiguous one (unclear scope, a boundary it can't infer, intent it can't read) **halts and asks**. A red test halts. A blocked item surfaces — it never thrashes.

When a halt stops the run mid-batch (not just "ask and continue" but a real stopping point where the session might end here), it's fine to mention `/reflect:park` can save the cursor — offered, never auto-run; if the environment's harness (e.g. Claude Code) provides its own compaction/handoff mechanism, that satisfies the same need and `park` is redundant.

## The per-item loop

If `plan.md` doesn't exist yet, there's no board to drive — report that and point at `/shape:align` to create one first, rather than guessing at items (tolerant-reader degrade path, ADR-071).

For each item in `plan.md`'s **In progress** column (each references a `thoughts/` doc):

1. **Ground — via `/nav:plan`.** Turn the item/thought into a code-level plan (Context · Approach · Critical files · Verification). Reuse-via-transcript: if `/nav:plan` (or `/nav:audit` Mode 2) already ran for this item this session, reuse its output instead of re-running. (Under an approved parallel schedule, grounding for ALL items runs upfront as a read-only fan-out — see Scheduling below.)
2. **Summarize — a visual checkpoint (mockup protocol).** Right after grounding, render a quick **interactive diagram summarizing the plan** — what changes, the approach, the affected files — following the `/shape:mockup` protocol. An interactive diagram, *not* a prose description. Two payoffs: a **decidable checkpoint** to glance at before any code is written (confidence-gate — if the summary reveals the plan is wrong, stop and re-ground rather than build the wrong thing), and for an item that has **no existing mockup**, this summary *becomes* the verify target in step 4. (build *sequences* this — it does not call the mockup skill; the agent renders per the mockup protocol, into `mockups/`.)
3. **Implement — `/nav:refactor` discipline + inject↔check.** Move verbatim where refactoring; **test-gate after every step**. Do the work as a **sequential subagent-per-item** by default (concurrent edits in one tree collide; the only exception is an approved parallel tail — see Scheduling). Bracket the hand-off: **inject** the grounding the sub-agent can't see (critical files + roles, existing impls/seams to reuse, the **N+1 trigger**); **check** the returned diff (same-domain parallel impl · seam/facade read at intent · header hygiene) before accepting "done".
4. **Verify — visual-first, against the mockup.** Use the **browser-verify slot** (see below): open the running feature → screenshot → place it **side-by-side with the item's mockup** (its own, or the step-2 summary if it had none) and check for drift. Non-visual items (backend / logic / data) → test-gate / behavioral check; do **not** force a screenshot where there's nothing to see (that's structure-theatre). The screenshot (+ mockup comparison) is the item's **Shipped evidence**. If a non-visual item's behavioral check would invoke a live paid LLM path (especially a fan-out/multi-agent one), flag it before running the item's check — same live-LLM-cost signal as `/nav:do` — rather than silently re-running it full-cost per item.
5. **Land.** Move the item to **Shipped** in `plan.md`, referencing the screenshot path as evidence; run **`/shape:align`** to refresh the board. If the ship changed a fact recorded in a canon doc (`docs/core/*`-class), append a one-line pending amendment to `docs/core/amendments.md` — **never edit core** (the door, ADR-041). Then the next item.
6. **Exit.** In-progress empty → stop and report (per-item: what shipped, the screenshot/mockup comparison, anything flagged).

## Scheduling — parallel dispatch is a policy, not a mode (ADR-040)

> **Workflow is build's muscle, never its brain.** Execution parallelizes; adjudication (the schedule, the <90% halts, the join gate, the check brackets) never does.

Serial is the default and always correct. With **several chunky In-progress items**, build may instead *propose* a schedule — full protocol in [`references/parallel-scheduling.md`](references/parallel-scheduling.md); the kernel:

1. **Ground ALL items upfront** (read-only — itself a concurrent fan-out). Each plan's **Critical files** + **Verification** are the scheduling inputs — no new schema.
2. **Evaluate** three criteria: (a) disjoint footprint — files AND test-import paths; (b) fully decided ≥90% (a dispatched agent can't stop to ask); (c) no shared-primitive risk (pre-extract the shared util serially first — the N+1 trigger, cross-agent edition).
3. **Schedule + propose**: conflicting items → **serial prefix** (full per-item loop); disjoint remainder → **parallel tail**. **The user's nod starts the batch** (scheduling is adjudication; on opt-in harnesses the nod IS the multi-agent opt-in).
4. **Run the tail in the shared tree** (no worktrees — decided trade): in-batch agents **write, don't test** (disjoint files ≠ disjoint import graphs — mid-batch test signal is contaminated); each returns a diff summary + `done|blocked`; ambiguity → `blocked`, back to the serial track.
5. **Join — ONE authoritative gate**: full test gate; red → bisect by reverting item footprints. Then **check brackets serially per item** — integration is judgment work. Then land each item normally.

Dispatched item agents (serial or the parallel tail) default to cheap tier (`model: sonnet`); a judgment-dense single item can be escalated on the spot (see root CLAUDE.md's Dispatch tiers).

The dispatch facility is a **capability slot** (like browser-verify): a workflow/pipeline engine as named default, plain parallel sub-agents otherwise; **no facility → fully sequential. Degrade parallelism, never the gates.**

## browser-verify slot (the dependency, handled as a capability)

build does **not** hardcode a browser tool — it uses shape's shared **browser-verify capability slot** (defined once in `plugins/shape/CLAUDE.md`; shared with `mockup` + `align` per the N+1 trigger):

- **Default implementation: `agent-browser`** (vercel-labs/agent-browser). Detect with `which agent-browser`. Usage: `agent-browser open <url>` → `agent-browser screenshot <file>.png`; `snapshot -i` / `click @e` / `fill @e "..."` to interact.
- **Delegate the pass to the `browser-verifier` subagent (cost tier, ADR-058).** Don't drive the browser in build's own context: dispatch the plugin's `browser-verifier` agent (model: sonnet) with URL · screenshot destination · the item's mockup path, and take back the compact verdict + paths. The screenshots' image tokens stay in the subagent; build's context holds only "PASS/DRIFT + reason". Drive inline only when walking the user through the page live.
- **Capture once per item, at land (verify economy).** Mid-item verification is the test gate; the screenshot is the item's Shipped-evidence, taken once when the item lands — never a per-step progress note.
- **If missing, fail helpfully — never silently skip.** Surface a 3-way choice (a confidence-gate stop): **(a) install** [recommended — visual verify is build's headline]: CLI `npm install -g agent-browser` (or `brew`/`cargo install agent-browser`) then `agent-browser install`; or as a skill `npx skills add vercel-labs/agent-browser`. **(b)** proceed test-only this run (flag items to eyeball). **(c)** skip verify for this item. Report what was skipped (no silent caps).
- **Per-project override:** a project may bind a different helper (Playwright, etc.) in its own CLAUDE.md; absent that, the default is agent-browser.

## The three seams (build is the cross-plugin orchestrator)

- **← reads shape:** `plan.md` (the work-list) + `mockups/` (the verification target).
- **↓ calls nav:** `/nav:plan` (ground each item) · `/nav:refactor` discipline (implement) · `/nav:sync` (cheap header grounding for the inject step).
- **→ writes shape:** `/shape:align` (re-render the board after each item).

This is the most concentrated point of shape↔nav communication — build *controls* the loop (it lives in shape, forward-motion) while *calling* nav's code-side protocols.

## Meta-skill discipline (do not skip)

- **Skills don't call skills.** build names the sibling protocols and describes the sequence; the executing agent runs them (reuse-via-transcript; for the browser slot, the agent invokes the tool/skill itself).
- **Reuse-via-transcript.** Before grounding an item, scan recent turns — if `/nav:plan`/`/nav:audit` ran for it, reuse.
- **Confidence-gate every item.** Below 90% on scope/boundary/intent → stop and ask. This is the core, not an option.
- **Serial by default; parallel only by an approved schedule.** One item's implementation at a time, unless the user approved a parallel tail (see Scheduling) — and even then the join gate + check brackets run serially.
- **Test-gate + inject↔check every step.** A red test halts the loop; a sub-agent's "done" is checked against the diff before it counts.
- **No silent caps.** If visual verify was skipped (no helper) or an item was deferred, say so in the report.

## Output

- Items moved In-progress → Shipped, each with evidence (screenshot + mockup comparison, or the test/behavioral result).
- An updated `plan.md` reflecting the new Shipped baseline, screenshots referenced by path.
- A run report: what shipped · what was flagged/asked · what's blocked · what verification was degraded (if any).

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| Blast through all items without stopping | Confidence-gate is the core — stop on doubt, not just at the end. |
| Re-implement nav:plan / nav:refactor inline | It's a meta-skill — sequence the protocols, don't duplicate them. |
| Call another skill directly | Skills don't call skills — name the protocol, the agent runs it. |
| Implement items in parallel without an approved schedule | Scheduling is adjudication — the criteria evidence + the user's nod come first (ADR-040). |
| Trust an in-batch test run | Disjoint files ≠ disjoint import graphs — mid-batch signal is contaminated; the join gate is the only authoritative one. |
| Force a screenshot on a pure-logic item | Structure-theatre — visual verify only where there's something to see. |
| Silently skip visual verify when the helper's missing | Fail helpfully: offer install / test-only / skip, and report it. |
| Mark Shipped on a red test or unverified diff | Test-gate + inject↔check gate every item. |
| Plow past a blocked item | Surface it and ask — never thrash. |

## Companion skills

- **`/shape:align`** — produces the In-progress list build consumes, and re-renders the board after each ship.
- **`/shape:mockup`** — produces the `mockups/` artifacts build verifies against.
- **`/nav:plan`** — grounds each item into a code-level plan (build's step 1).
- **`/nav:refactor`** — the implementation discipline build applies (verbatim move + test gates).
- **`/nav:sync`** — cheap header grounding for the inject step.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
