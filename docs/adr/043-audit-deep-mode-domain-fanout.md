# ADR 043 — `nav:audit` gains Mode 3 (deep sweep) — domain fan-out for legacy codebases

**Status**: accepted
**Date**: 2026-06-15
**Refines**: [ADR-021](021-retire-nav-doctor.md) (audit absorbed the "full sweep / do the works" entry — Mode 3 is the engine that entry now drives on a large repo)
**Builds on**: [ADR-008](008-inject-check-at-handoff.md) (inject↔check — Mode 3 is that bracket fanned out across read-only domain auditors)

## Context

`audit`'s Mode 1 (health) and Mode 2 (feasibility) are both **single-agent, single-context, single-pass**: one agent detects the stack, inventories domains, runs the mechanical + self-eval checks, and reports — all inside one context window.

That model is fine for a codebase grown *with* nav (headers + barrels present, domains small and labelled). It breaks on a **legacy codebase** — organic, no file-top headers, no barrels, many large domains:

- **A single context can't hold the whole repo**, so the agent **satisfices**: it samples a few domains, runs the checks there, feels "that's enough", and reports. The unscanned domains never get flagged — silently.
- **The deepest signal (rule ⑧ self-eval) only fires on the leaders the agent happened to pick.** Legacy files have no header, so the agent can't cheaply tell which files are load-bearing — it picks fewer, and self-evals fewer.
- **The output is a flat list, not the few root causes.** Even when findings surface, Mode 1/2 categorize-by-rule (Step 5) without collapsing the list into "these 3 broken abstractions explain most of the noise".

User-reported symptom: *"audit on an old project doesn't find everything in one pass — it needs more rounds to surface the core problems."* That's the satisficing-on-one-context failure, exactly.

## Decision

Add **Mode 3 — deep sweep**: a *depth strategy* (defaults to Mode 1's health scope) that replaces the single-pass with a **domain fan-out**.

1. **Fan-out via the Agent tool** (not Workflow). One **read-only** sub-agent per domain runs Step 3 mechanical checks + Step 4 self-eval on *its* slice only. Domains run in parallel, so total coverage is bounded by the largest single domain, not by one context trying to hold all of them.
2. **inject↔check ([ADR-008](008-inject-check-at-handoff.md))**. Each domain dispatch **injects** what the fresh sub-agent can't re-derive: the domain's file scope, the 8 rules, the universal + stack-specific checks, and a fixed finding schema. The **check arm** is a **completeness critic** pass — "which domain wasn't covered, which leader wasn't self-evaled, which finding wasn't cited?" — feeding a **loop-until-dry**: re-dispatch on under-covered domains until a round adds nothing new.
3. **Synthesis adds root-cause clustering.** The main agent merges + dedups all domain findings, then collapses them into the **few core broken abstractions** that generate the most surface noise — surfaced *above* the per-rule list. This answers the "find the core problems" half, which a flat list can't.
4. **Triggers: explicit + auto-suggest.** Explicit phrasings (`deep audit`, `徹底掃描`, `full sweep`, `find all the issues at once`, `legacy sweep`) enter Mode 3 directly. Otherwise Mode 1 runs normally but, **on detecting a large/legacy shape** (many domains · many files · no headers · no barrels), finishes its pass and *offers* the deep upgrade. It never auto-runs Mode 3 — the fan-out costs N× a normal audit, so the spend is the user's call.

## Why not Workflow, why not a new skill

- **Not Workflow.** Workflow gives deterministic resume + a cleaner loop, but it's heavier, needs explicit user opt-in, and would make `audit` *depend* on it. Agent fan-out keeps audit **self-contained** and matches the plugin's existing sub-agent discipline (`refactor` Step 8, `plan` Stage 4 already dispatch via the Agent tool with inject↔check). If a one-shot whole-repo sweep with deterministic resume is ever genuinely needed, that's a future revisit, not a reason to reach for Workflow now.
- **Not a new skill.** Deep is the **same job (audit) at a different depth**, not a different job. A separate `/nav:sweep` would compete with `audit` for trigger fire and repeat the `doctor` mistake ([ADR-021](021-retire-nav-doctor.md)) — ceremony over an engine that already lives in audit. A **mode**, parallel to Mode 1/2, is the right grain (rule ④).

## Consequences

- **nav roster unchanged** — still 6 skills. `audit` SKILL.md grows ~+90 lines (deep process + Mode 3 framing + auto-suggest hook); still well under the ~500-line split threshold.
- **Cost is real and visible.** Mode 3 spends N domains × sub-agent + critic rounds. Mitigated two ways: (a) auto-suggest-not-auto-run, so the user opts into the spend; (b) **no-silent-caps honesty** — if loop-until-dry stops at a round cap or a domain is sampled rather than fully scanned, the report `log`s what was bounded. A deep sweep that silently truncates would read as "covered everything" when it didn't.
- **Mode 2 reuse.** The fan-out strategy is scope-orthogonal — a large Mode-2 feasibility check can borrow the same per-domain fan-out. Mode 3 is framed health-first for the common case; the SKILL.md notes the reuse rather than forking a fourth mode.
- **nav version 0.5.0 → 0.6.0** (user-facing feature add).
- **Gating site map updated**: audit node desc "two modes" → "three modes"; ADR count 42 → 43; rev bumped with a FIXED entry.
