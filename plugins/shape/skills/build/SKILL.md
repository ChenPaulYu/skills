---
name: build
description: "Drive a blueprints plan's In-progress items to verified completion, serial by default: ground each via /nav:plan, implement with /nav:refactor discipline, verify by browser check or tests, then update the board via /shape:align. Stops to ask whenever confidence drops below 90%; a parallel schedule for independent items needs the user's approval first."
disable-model-invocation: true
---

# Build — drive the In-progress column to done

The forward-motion terminus of shape: take the plan's **In-progress** items and make them real — autonomously, serial by default — a sequential subagent-per-item loop (parallel only by an approved schedule), each grounded into a code plan, implemented under discipline, and **verified against its mockup** — pausing to ask whenever confidence drops. It is a **meta-skill** (like `/nav:plan`): it sequences other skills' protocols rather than re-implementing them, and the loop closes shape's spine — elicit/mockup decide, align plans, build makes it real, nav keeps it navigable.

## Stance

- **Below 90% → ask. This is build's leash.** It runs autonomously **only while confidence holds**; the instant scope/boundary/intent on the current item drops below 90%, it stops and asks rather than plowing ahead. A red test halts. A blocked item surfaces — it never thrashes.
- **Run to done, but stop on doubt** — not "review every item" (too slow), not "blast through to the end" (dangerous). A clear item flows; an ambiguous one halts and asks.
- **If `plan.md` doesn't exist**, there's no board to drive — report that and point at `/shape:align` to create one first, rather than guessing at items.
- **Per item: ground (`/nav:plan`) → summarize as a mockup-protocol diagram (a decidable checkpoint before code is written) → implement (`/nav:refactor` discipline + inject↔check, test-gated every step) → verify visual-first against the mockup (non-visual items get a test/behavioral check, never a forced screenshot) → land (move to Shipped, evidence referenced, re-run `/shape:align`) → next.** Sequential subagent-per-item by default — concurrent edits in one shared tree collide.
- **Parallel dispatch is a policy, never a mode (ADR-040) — workflow is build's muscle, never its brain.** Execution parallelizes; adjudication (the schedule, the confidence halts, the join gate, the check brackets) never does. Kernel: ground ALL items upfront (read-only fan-out) → evaluate disjoint footprint + ≥90% decided + no shared-primitive risk → propose a serial-prefix + parallel-tail split → **the user's nod starts the batch** → in-batch agents write, don't test (mid-batch test signal is contaminated) → join on ONE authoritative gate, then check brackets serially per item. Full protocol: `references/parallel-scheduling.md`.
- **Dispatch tier.** Dispatched item agents (serial or the parallel tail) default to cheap tier (`model: sonnet`); a judgment-dense single item can be escalated on the spot (see root CLAUDE.md's Dispatch tiers).
- **Mark Shipped only on a green test + a checked diff.** A sub-agent's "done" is checked (same-domain parallel impl · seam/facade read at intent · header hygiene) before it counts.
- **No silent caps.** If visual verify was skipped (no browser-verify helper) or an item was deferred, say so in the report.
- **Skills don't call skills.** build names the sibling protocols (`/nav:plan`, `/nav:refactor`, `/shape:align`, the browser-verify slot) and describes the sequence; the executing agent runs them. Reuse-via-transcript: if `/nav:plan`/`/nav:audit` already ran for an item this session, reuse its output.

Full per-item loop (all six steps, with citation detail), the browser-verify slot mechanics (delegate to the `browser-verifier` subagent, ADR-058), the three cross-plugin seams, and the anti-pattern table: `references/per-item-loop.md`. Parallel-dispatch full protocol: `references/parallel-scheduling.md`.

## browser-verify slot (the dependency, handled as a capability)

build does **not** hardcode a browser tool — it uses shape's shared **browser-verify capability slot** (defined once in `plugins/shape/CLAUDE.md`; shared with `mockup` + `align` per the N+1 trigger):

- **Default implementation: `agent-browser`** (vercel-labs/agent-browser). Detect with `which agent-browser`. Usage: `agent-browser open <url>` → `agent-browser screenshot <file>.png`; `snapshot -i` / `click @e` / `fill @e "..."` to interact.
- **Delegate the pass to the `browser-verifier` subagent (cost tier, ADR-058).** Don't drive the browser in build's own context: dispatch the plugin's `browser-verifier` agent (model: sonnet) with URL · screenshot destination · the item's mockup path, and take back the compact verdict + paths. The screenshots' image tokens stay in the subagent; build's context holds only "PASS/DRIFT + reason". Drive inline only when walking the user through the page live.
- **Capture once per item, at land (verify economy).** Mid-item verification is the test gate; the screenshot is the item's Shipped-evidence, taken once when the item lands — never a per-step progress note.
- **If missing, fail helpfully — never silently skip.** Surface a 3-way choice (a confidence-gate stop): **(a) install** [recommended — visual verify is build's headline]: CLI `npm install -g agent-browser` (or `brew`/`cargo install agent-browser`) then `agent-browser install`; or as a skill `npx skills add vercel-labs/agent-browser`. **(b)** proceed test-only this run (flag items to eyeball). **(c)** skip verify for this item. Report what was skipped (no silent caps).
- **Per-project override:** a project may bind a different helper (Playwright, etc.) in its own CLAUDE.md; absent that, the default is agent-browser.

## Companion skills

- **`/shape:align`** — produces the In-progress list build consumes, and re-renders the board after each ship.
- **`/shape:mockup`** — produces the `mockups/` artifacts build verifies against.
- **`/nav:plan`** — grounds each item into a code-level plan (build's step 1).
- **`/nav:refactor`** — the implementation discipline build applies (verbatim move + test gates).
- **`/nav:sync`** — cheap header grounding for the inject step.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.
