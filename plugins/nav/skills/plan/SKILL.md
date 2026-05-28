---
name: plan
description: Turn a spec / feature description into a codebase-grounded plan. Three stages — (1) GROUND by auditing the spec-touched domains (reusing prior /nav:audit output if it ran earlier in this session); (2) CLARIFY ambiguity with the user via 3-5 targeted questions; (3) write a structured plan ARTIFACT (Context · Approach · Critical files · Verification). Use whenever the user has a spec, feature description, or change intent and asks "plan how to build X", "make a plan for this spec", "what's the approach for Y", "scope this feature against the codebase", or hands over a spec file. Read-mostly — only writes the final plan file, with the user's location consent. Companion to /nav:audit (Mode 2 is the read-only quick check; this skill is the full workflow).
---

# Plan

Turn a spec into a codebase-grounded plan. Audit the affected domains, clarify the ambiguities a spec always has, then write a plan the user (or a future agent) can execute against. The output is an artifact — a markdown file the user keeps — not a chat report.

## Why this skill exists

Specs land at varying levels of completeness. A complete spec is rare; usually you start from "the user wants X" + some sketches + several unstated assumptions. The work between "spec arrives" and "code can be written" is **grounding** (does the current code support this?) and **clarification** (what does the user really mean here?). This skill captures both, then writes them down so the plan doesn't evaporate into the next conversation.

It's the full version of what `/nav:audit <spec>` (Mode 2) starts. Audit Mode 2 stops at the gap-analysis report; plan continues past it into dialog and an artifact.

## Scope

**Language-agnostic.** Same as the rest of nav — universal core + per-stack heuristics. Detect stack at the top, calibrate accordingly. Plan inherits audit's discipline for Stage 1.

**Read-mostly.** Stages 1-2 read code + read conversation; only Stage 3 writes one file (the plan). Always confirm the output location before writing.

## The 11 rules

1. **Good interfaces** — low-level modules expose an interface you can use without reading the body.
2. **Progressive disclosure** — an index/doc surfaces the interface; you drill in only as needed.
3. **No hidden params** — functions deterministic; deps explicit, not ambient.
4. **Future-ready foundation** — the base supports planned features before they ship.
5. **No giants** — no single mega-module or mega-function.
6. **No needless abstraction** — if it needn't be modular, don't modularise it.
7. **Fit the framework** — idiomatic patterns; pass store/hook objects, not 20 loose props.
8. **Rearrange, don't rewrite** — refactor = move code verbatim + rewire.
9. **Below 90% confidence → ask** — *this skill is rule ⑨ as a workflow.* Stage 2 exists because spec ambiguity is the most common < 90% confidence trigger.
10. **Group + expose via one door** — subsystems exposed through a barrel/facade.
11. **Agent-navigability is the audit** — struggle-to-describe IS the deep-module failure signal.

## Three-stage protocol

### Stage 1 — Ground (audit-equivalent on spec-touched domains)

**Before running grep/inventory commands, scan the recent conversation:**

1. Was `/nav:audit <this same spec>` (Mode 2) run in the last few turns?
2. **If YES** → reuse its gap analysis as Stage 1's output. Note in the plan header: `Stage 1: reused from prior /nav:audit (turn N)`. Skip to Stage 2.
3. **If NO** (new session, different spec, or no prior audit) → run Stage 1 fresh, following audit's Mode 2 protocol:
   - Detect stack
   - Parse the spec → identify the domains it touches
   - Inventory those domains (file count, leader files, LOC distribution)
   - Run mechanical + heuristic checks scoped to those domains (per audit's universal-core + per-stack tables)
   - Frame findings as **gap analysis**: per affected domain → current shape · target needs · gap · suggested prep work

This isn't `/nav:audit` being called — it's plan instructing the agent to apply the same protocol inline. Self-contained per ADR-001 #3.

### Stage 2 — Clarify (interactive dialog with the user)

A spec always has gaps the user knows but didn't write. Ask 3-5 targeted clarifying questions. Choose questions by **impact**:

**High-signal question categories**:
- **Scope boundaries** — "does this include X, or is X out of scope?" (most common; specs underspecify edges)
- **Contract changes** — "is it okay if the public API of Y changes, or must it stay backward-compatible?" (affects refactor strategy)
- **Edge cases** — "what should happen when [edge condition the spec didn't mention]?"
- **Trade-offs the spec was silent on** — "you want X fast vs X correct — which trade-off?" (forces the prioritization)
- **Existing-code coupling** — "the gap analysis shows current code does Y; is changing that part of this scope or a separate session?"

**Avoid low-signal questions**:
- Things you can answer by reading the code yourself
- Pure preference questions where any choice works (just pick one + note it as a decision in the plan)
- Multiple questions about the same thing (consolidate)

Present them as a list, numbered, in the user's preferred language. If the user defers an answer, mark it as an **open question** in the plan output rather than guessing.

If you can answer everything from Stage 1 (rare), skip Stage 2 but say so in the plan: `Stage 2: no clarifying questions — spec was self-contained.`

### Stage 3 — Plan (write the artifact)

**Confirm output location first** — don't write blind. Default location: `docs/plans/<YYYY-MM-DD>-<short-slug>.md`. If the repo has an obvious existing convention (e.g. `docs/specs/`, `docs/superpowers/plans/`), prefer that; ask once if unclear.

**Plan template** (markdown):

```markdown
# <Spec title> — plan

> Generated: <ISO date> · Spec source: <path or reference> · Stage 1: <fresh | reused from turn N>

## Context

<2-4 paragraphs grounding the change against the current codebase. Cite specific files / domains. Pull from Stage 1's gap analysis. End with the spec's intent in 1 sentence.>

## Resolved questions (from Stage 2)

| Question | User's answer |
|---|---|
| <Q1> | <A1> |
| ... | ... |

## Open questions (deferred)

- <Q from Stage 2 user didn't answer> — needs decision before <when>
- ...

## Approach

<The plan itself. Use whatever structure the change needs:>
- For a small feature: numbered steps, each one a self-contained move
- For a complex feature: phases / tiers / milestones with their own steps
- For a refactor: list of /nav:refactor invocations (verbatim moves), each with a clear before/after

Each step should be specific enough that another agent (or future-you) can execute without re-clarifying.

## Critical files

| File | Why it matters | Touched in step |
|---|---|---|
| <path:line> | <one-line role + what changes> | <step N> |
| ... | ... | ... |

## Verification

Concrete checks per step:
1. <Step N> → verify: <test name, command, or observation>
2. ...

End-to-end: <how someone confirms the whole plan landed correctly — e.g., specific user flow + test suite + browser pass>.

## Out of scope (deferred to other sessions)

- <What this plan deliberately doesn't cover>
- ...
```

Adjust sections per situation — Critical files is essential, Open questions only if Stage 2 had unanswered items, Out of scope only if there's real risk of scope creep.

**Write the file, then summarize to chat**: location, line count, key open questions (if any), suggested next session (e.g., "execute step 1 with `/nav:refactor` against `<file>`").

## Output

- A markdown plan file at the agreed location.
- A short chat summary: where the plan landed, headline open questions, suggested next action.
- Do NOT execute the plan. That's a separate session — the user reads the plan first, then decides what to invoke (commonly `/nav:refactor` for structural moves, or just regular coding).

## Discipline (do not skip)

- **Scan transcript first.** Stage 1 starts by checking whether audit just ran. Re-running grep when context already has the answer wastes the user's time and tokens.
- **Ask only high-signal clarifying questions.** A spec dump back at the user is noise; 3-5 surgical questions are signal. Stage 2 is rule ⑨ in workflow form.
- **The plan is an artifact, not a chat.** A plan that lives only in the conversation is gone next session. Write the file.
- **Confirm location before writing.** Repos have conventions; respect them. Ask once, then proceed.
- **Don't execute.** Plan = blueprint. Execution = separate session(s). Conflating them breaks rule ⑨'s discipline and turns the plan into a runaway agent.
- **Honest about uncertainty.** If Stage 1 had to guess at a file's role, say so in the Context. If Stage 2 left a question open, list it. The plan's value is grounded honesty, not false confidence.

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| "I'll skip Stage 2 — I can guess what the user means" | Rule ⑨. Guess = drift between agent and user. Ask the 3 questions |
| "I'll write the plan straight to disk without asking where" | Surprising. The user has a convention; respect it |
| "I'll execute step 1 while I'm here, the plan is obvious" | Plan and execute are different verbs. Conflating loses review gates |
| "I'll fold open questions into 'TBD' inline" | Lies. Open questions go in a labeled section so they're not forgotten |
| "I'll write a generic plan template without grounding" | Defeats the purpose. Stage 1's gap analysis MUST appear in Context |

## When to escalate to the user

- Stage 1 reveals the spec is fundamentally incompatible with the current architecture (not just gaps — actual blockers). Surface this before Stage 2.
- Stage 2's first clarifying question receives an answer that invalidates the spec's premise. Stop the cascade; ask the user whether to revise the spec or proceed with the revised scope.
- The plan you'd write conflicts with a recent ADR or convention. Flag it before writing.

## Companion skills

- **`/nav:audit`** — Mode 2 is the read-only quick check (gap analysis, stop). This skill (`plan`) is the full workflow. Run audit alone when you just want to know "can this be done"; run plan when you've decided to do it.
- **`/nav:refactor`** — typical next step from a plan that includes structural moves. The plan's `Approach` section often lists `/nav:refactor` invocations.
- **`/nav:doctor`** — different intent: doctor is unconditional health (no spec), plan is spec-grounded. They don't compose, but both are meta-skills that inline audit.
