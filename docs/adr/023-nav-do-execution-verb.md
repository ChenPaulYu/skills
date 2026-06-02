# ADR 023 — `nav:do`, the execution verb (the inject↔check sub-agent discipline, promoted to a standalone door)

**Status**: accepted
**Date**: 2026-06-02
**Refines**: [ADR-008](docs/adr/008-inject-check-at-handoff.md) (the inject↔check hand-off `do` extracts), [ADR-007](docs/adr/007-offer-next-action-pattern.md) (where that discipline lived)
**Amends**: [ADR-003](docs/adr/003-five-skills-not-four-or-six.md) (nav roster — now five)
**Origin**: [`docs/observations/2026-06-02-nav-needs-an-execution-verb.md`](docs/observations/2026-06-02-nav-needs-an-execution-verb.md) (a `/shape:elicit` convergence)

## Context

nav had a hole. What each verb does to *code*: `audit` is read-only; `sync` writes docs (headers + map); `plan` writes a `plan.md` artifact; `refactor` executes — but **behaviour-preserving** only (verbatim move + rewire, tests stay identical, rule ⑥). **Nothing executed a behaviour-*changing* change.**

So for a feature too small to deserve `plan.md`'s full ground-clarify-artifact ceremony, the user was stuck between two bad options: run the heavy plan path anyway, or drop all deep-module discipline and wing it. The need: *"a small, already-decided change — just do it, but stay deep-module/header-aware as I write."*

That discipline already existed — but only as a **sub-step**, not a door. When `/nav:plan` (Stage 4) or `/nav:refactor` (Step 8) dispatches a sub-agent to execute, ADR-008's **inject↔check** brackets it: inject the grounding the tactical agent can't re-derive (reusable impls, seams, the N+1 trigger), check the returned diff (parallel-impl grep, seam-intent, header hygiene). You just couldn't *summon* it for a one-off change without first producing a plan.

## Decision

**Add `nav:do` — nav's execution verb: the inject↔check execution discipline promoted to a standalone, plan-less, directly-invocable door.** nav goes from four skills to **five**: `audit` · `refactor` · `sync` · `plan` · `do`.

Its kernel is two halves (converged in the origin thought):
- **乙 — continuous awareness.** Deep-module sense + the header convention + the N+1 trigger + LOC thresholds ride along the whole time you write.
- **甲 — an enforced thin bracket, no artifact.** `inject` (`head -12` the target file + grep the domain for a reusable existing impl) → `execute` → `check` (new load-bearing file carries a header · second consumer triggers an N+1 extract · an **unconditional verify gate**).

**Symmetry (the second half of the decision).** Because `do` *is* the discipline the post-plan sub-agent dispatch was always meant to carry, the two entry points are kept in lock-step: `plan` Stage 4 and `refactor` Step 8 now **reference `do`'s discipline** when they dispatch a behaviour-changing execution, and their gate was upgraded — the verify/test gate, previously conditional ("only if the step is a refactor"), is now **unconditional** for a behaviour-changing change. Audit gap found and closed in the same change.

## Why this is a new verb, not `refactor` widened (the N+1 / right-grain defence)

This repo's razor (rule ④ + the N+1 trigger; the exact blade that retired `doctor`, [ADR-021](docs/adr/021-retire-nav-doctor.md)) demands a justification for any new skill that sits near an existing one. `do` clears it on two grounds:

1. **It crosses `refactor`'s defining seam.** `refactor`'s whole identity is rule ⑥ — *rearrange, don't rewrite; behaviour stays identical, proven by an unchanged test suite.* `do` **changes behaviour** (tests change). Folding behaviour-changing work into `refactor` would dissolve the one invariant that makes refactor safe. They are twins across a real seam (preserve vs change), not one skill with a flag.
2. **It is itself an N+1 extraction.** The execution discipline was an *inline* thing duplicated in `plan` Stage 4 and `refactor` Step 8. A standalone change with no plan was the **second-plus consumer** of that discipline with nowhere to invoke it. Per the N+1 trigger, the right move is to *extract the primitive* — which is exactly what `do` is. Far from proliferation, `do` **reduces** duplication: `plan`/`refactor` now reference it instead of restating the bracket.

## Alternatives weighed

- **No skill — lean on the operator's `CLAUDE.md` "code-shape awareness."** Rejected: that file is operator-global and stack-calibrated (TS/React thresholds); it isn't portable, language-agnostic, or a triggerable verb. And "awareness, always on" can't be *summoned* for a specific change the way a named door can. `do` carries the same discipline into any repo/stack as an explicit mode.
- **Widen `refactor`.** Rejected — see the seam argument above.
- **A heavier skill that grounds + writes a mini-plan.** Rejected: that *is* `plan`, and reintroduces the exact ceremony `do` exists to avoid. Keeping `do` artifact-less (no `plan.md`) is load-bearing.

## Consequences

- **nav roster: five skills.** ADR-003 amended. `do`'s description is scoped to *small, decided, behaviour-changing* changes and explicitly disclaims `refactor`'s (move/preserve) and `plan`'s (artifact) fire, to avoid stealing triggers.
- **`plan` Stage 4 / `refactor` Step 8** updated to reference `do`'s discipline + an unconditional verify gate (the symmetry patch). `plugins/nav/CLAUDE.md`'s inject↔check convention now names `do` as the standalone form.
- **Site map**: new `do` node in `NAV_NODES` + a `plan → do` edge; nav anatomy lede/heading/counts go four → five; audit block bumped.
- **Codex mirror**: `node scripts/build-codex.mjs` regenerates `.agents/skills/nav-do/`.
- **`do` is atomic, not meta** — it executes; it does not get the offer-next-action pattern (no single obvious next step). It ends with a report + the standing "don't commit unless asked" discipline.

## Out of scope

- **An offer-next-action / auto-commit step on `do`.** Deferred — `do` is atomic; if a recurring "do then commit" pattern emerges, revisit. For now it reports and stops.
- **`do` making the decision.** Out of scope by definition — `do` executes a *decided* change. Undecided → `/shape:elicit` or `/shape:mockup` first.
