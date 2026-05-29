# ADR 008 — Inject↔check at the sub-agent hand-off in meta-skills

**Status**: accepted
**Date**: 2026-05-29
**Refines**: [ADR-007](docs/adr/007-offer-next-action-pattern.md) (adds discipline to the sub-agent option it introduced)
**Touches**: `/nav:plan` (Stage 4), `/nav:refactor` (Step 8), `/nav:doctor` (Step 7), `plugins/nav/CLAUDE.md`
**Origin**: [`docs/observations/2026-05-29-parent-integration-audit-is-the-missing-lever.md`](docs/observations/2026-05-29-parent-integration-audit-is-the-missing-lever.md)

## Context

ADR-007 gave the three meta-skills a one-click way to hand the next step to a sub-agent (clean context = "separate session" at the architecture level). But it left two halves of the hand-off thin:

- **Dispatch (→)**: the `Agent` prompt passed only the *task* ("step 1's scope", "the refactor target") — not the **grounding the skill had already done in-session**. The meta-skill had just read the domain (plan's Stage-1 gap analysis; doctor's fresh audit + map), yet none of that was pushed down. A fresh sub-agent therefore starts blind to the codebase-wide picture.
- **Return (←)**: the sub-agent "reports back when done" and that was the end of it. There was **no defined check on what came back** — "done" was accepted on the sub-agent's word.

The cost of those two gaps is documented in the origin observation. A Phase-3 sub-agent, briefed only to "build the MomentPreview component", re-implemented a `fillPath()` that already existed (with important `BUCKET_PX` bucketing) in the same audio domain's `svg.tsx`. Tests passed 109/109, the parent accepted "done", and the parallel impl shipped — caught a session later **by the user, not the parent**. The observation's lever analysis scored the fix:

- **Sub-agent carries the deep-module discipline** (★★★) — necessary but bounded: a tactical agent can't see what it wasn't shown.
- **Parent integration audit on the returned diff** (★★★★) — the real lever, because it catches *emergent* integration problems, not just anticipated ones.

The root cause is structural, not a smarter sub-agent: a sub-agent is **tactical** (it sees only its assigned slice, so it won't grep the domain for an existing home) and it **reads project rules literally** (a facade "don't import X" rule gets over-read into "don't reuse *anything* in this domain"). The fix has to live at the hand-off boundary the parent controls — exactly the seam ADR-007 created.

## Decision

The sub-agent option in each meta-skill's offer-next-action step **brackets the dispatch with two steps**:

1. **Inject (→), at dispatch.** Beyond the task scope, push down the grounding the meta-skill already produced in-session and the fresh sub-agent can't re-derive:
   - critical files + their roles, and any existing impl/seam the work should *reuse rather than re-add*;
   - the *intent* behind any seam/facade rule, not just its text;
   - the **N+1 trigger** (second consumer of an inline util = extract a primitive, don't copy).

2. **Check (←), before accepting "done".** Run a deep-module integration pass on the returned diff — STOP if any fails:
   - same-domain grep for a parallel implementation (second consumer → extract, don't ship the copy);
   - seam/facade rules read at *intent*, not over-read into a *wall*;
   - header hygiene (new load-bearing file has a header; a changed role/imports updated in the same diff).

3. **The N+1 trigger becomes a named plugin convention** (corollary of rules ⑥ + ⑩) in `plugins/nav/CLAUDE.md`, so "no needless abstraction" stops being a pure judgment call and gains an operational trip-wire.

## Why this is *not* pre-skilling

The origin observation is `raw` (one case), and the marketplace's own discipline is *don't write a SKILL.md after one observation*. This ADR honours that:

- **No new skill, no new trigger.** Nothing here is independently invocable. It *enriches the existing ADR-007 hand-off* with the discipline that hand-off was always missing — closer to fixing an incomplete pattern than to crystallising a speculative one.
- **The discipline is already universal.** The 11 rules + N+1 are stated once and apply everywhere; this just wires them into the one place a meta-skill spawns a sub-agent.
- A standalone `/nav:integrate` skill (audit a diff against the rest of the codebase) was explicitly **deferred** — revisit only if the pattern repeats outside the hand-off context. Until then the check rides inside the skills that already do the dispatching.

## What it looks like in each meta-skill

| Skill | Hand-off | Inject payload (the in-session grounding) |
|---|---|---|
| `/nav:plan` | Stage 4, option 1 (execute step 1) | Stage-1 gap analysis: critical files + roles, reusable impls/seams |
| `/nav:refactor` | Step 8, option 2 (improve session) | the extracted module's seam — what it exposes, who consumes it, deferred simplifications |
| `/nav:doctor` | Step 7, option 1 (first refactor) | the relevant slice of the fresh audit + the map just built (roles, seams, existing impls) |

The return-check is identical across all three (same-domain parallel impl · seam/facade intent · header hygiene); only the inject payload differs by what each skill happens to know.

## Relationship to ADR-007 and ADR-006

ADR-006 = "scan transcript first" (look backward: was upstream already run?). ADR-007 = "offer next-action" (look forward: is downstream the obvious next step?). ADR-008 = **make the forward hand-off itself robust** — what crosses the boundary going out (grounding) and what's verified coming back (integration). All three stay in SKILL.md prose; no skill-calls-skill coupling (ADR-001 #3 preserved). The check is stated inline in each SKILL.md so the skill stays self-contained — it does not depend on any user-level CLAUDE.md being loaded.

## Consequences

- `plan/SKILL.md`: Stage 4 option 1 row gains the inject payload + return-check; a discipline bullet added.
- `refactor/SKILL.md`: Step 8 option 2 row gains the seam-inject + return-check; a discipline bullet added.
- `doctor/SKILL.md`: Step 7 option 1 row gains the audit/map-inject + return-check; a discipline bullet added.
- `plugins/nav/CLAUDE.md`: new "inject↔check at the sub-agent hand-off" convention + a named "N+1 trigger" convention.
- `docs/site/index.html`: audit-block bumped to rev 5 with a FIXED entry; new `CONV` entry for inject↔check. No `NAV_NODES` / `NAV_EDGES` change — this is behaviour inside existing skills, not new structure (same as ADR-007).
- `README.md`: no change (skill list unchanged).
- The origin observation stays `raw`; this ADR is referenced from it as the partial-promotion target (lever C+D wired into the hand-off; standalone `/nav:integrate` still deferred).

## Out of scope (deferred)

- **`/nav:integrate` as a standalone skill** — "audit this diff against the rest of the codebase." Deferred until the pattern recurs outside the meta-skill hand-off. **And if it ever is promoted, prefer a third *diff-integration* mode of `/nav:audit` over a new skill** — the check (same-domain parallel impl = rule ⑥) is conceptually already audit's job, just pointed at a diff instead of the whole tree, structurally a near-sibling of audit's Mode 2 (feasibility). A new skill cuts against ADR-003's "resist proliferation" and would steal trigger fire from `/nav:audit` and the built-in `/code-review`. Revisit only when the pattern recurs **where neither gate (skill hand-off · operator CLAUDE.md) can reach** AND manual on-demand review is a real need (e.g. reviewing a teammate's diff) — note that a check you must *remember to invoke* is a weak fix for a *forgetting* problem, which is why the two automatic gates, not a manual skill, are the primary coverage.
- **Enforcing the check when the parent dispatches a sub-agent *ad hoc*** (outside a nav skill). That belongs in the operator's own CLAUDE.md, not in a marketplace skill — out of scope for the plugin.
- **Auto-running the integration check** without the parent reading the diff. The parent reading the diff *is* the discipline (mirrors ADR-007's "AskUserQuestion is the supervisor").

## Notes

- The check presumes the parent actually reads the returned diff. If a runtime ever auto-accepts a sub-agent's "done", this discipline collapses — same failure mode ADR-007 flags for auto-picking option 1.
- Injection is only as good as what the meta-skill knows. `plan` and `doctor` are strong here (they ground before dispatching); `refactor`'s improve hand-off knows the module but not always its full consumer set — hence the inline check remains the backstop, not the inject.
