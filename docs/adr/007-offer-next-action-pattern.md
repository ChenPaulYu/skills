# ADR 007 — Offer next-action via `AskUserQuestion` (with sub-agent option) in meta-skills

**Status**: accepted
**Date**: 2026-05-28
**Refines**: [ADR-006](docs/adr/006-nav-plan-skill.md) (sibling pattern to "reuse-via-transcript")
**Touches**: `/nav:plan`, `/nav:refactor`, `/nav:doctor`

## Context

After a meta-skill finishes (`plan` writes a plan; `refactor` finishes the moves; `doctor` delivers its report), the natural next action is usually obvious — execute step 1, commit the changes, kick off the first recommended refactor. Today every SKILL.md ends by **suggesting in chat text** which command to type next:

> *"Suggested next session: execute step 1 with `/nav:refactor` against `<file>`"*

Lived feedback (the conversation that produced this ADR) showed two problems with chat-text suggestions:

1. **Discoverability friction** — the user has to read the suggestion, remember the slash command, and type it. For a power-user this is fine; for anyone less fluent with the marketplace it's a wall.
2. **Context decision left implicit** — should the next step run *in this session* (carrying everything from planning) or *in a fresh session* (clean context)? The SKILL.md said "separate session" as discipline (per ADR-006 / rule ⑨), but didn't give the user a one-click way to actually achieve that separation.

Meanwhile, the `AskUserQuestion` tool + the `Agent` tool (with `subagent_type`) together make a one-click offer trivially expressible:

- `AskUserQuestion` → user picks an option vs. having to type
- `Agent` (sub-agent) → spawns an isolated context = enforces "separate session" at the architecture level, not just by convention

## Decision

1. **Meta-skills (`plan`, `refactor`, `doctor`) end with an `AskUserQuestion` step**, listing 2-4 concrete next actions. The "save / commit only — I'll handle from here" option is always present so the user can opt out without typing.

2. **The sub-agent option is the default-recommended choice** when a self-contained next step exists (e.g., "execute step 1" / "run the first recommended `/nav:refactor`"). The sub-agent runs the next step with `Agent` + `subagent_type=general-purpose` (or a specialised type if installed) — clean context, reports back when done.

3. **In-session execution stays as an option** for users who want to watch each move.

4. **Skills MUST NOT auto-execute.** `AskUserQuestion` is the gate. If the user picks "save only" or doesn't pick anything, the skill ends.

5. **The pattern is one-shot per skill invocation.** If the user picks "save only" / "done", don't re-offer later in the same session. No nagging.

6. **Atomic skills don't get this pattern.** `audit`, `headers`, `map` are end-states (a report / a header / an HTML file). There's no natural single next-action to offer. Anti-pattern: offering "run /nav:refactor next?" from `audit` — audit produces N findings, the next step is the user's call, not a one-click choice.

## Why this doesn't break the "Don't execute" discipline (ADR-006, rule ⑨)

ADR-006 / `plan`'s discipline: *"Don't execute. Plan = blueprint. Execution = separate session(s). Conflating them breaks rule ⑨'s discipline and turns the plan into a runaway agent."*

The new pattern preserves this:

| Concern | Mitigation |
|---|---|
| "Skill auto-executes plan" | No — `AskUserQuestion` requires affirmative user pick. |
| "Same session = same context = no review gate" | Sub-agent option enforces fresh context. In-session is opt-in, not default. |
| "Pattern teaches agent to be eager" | One-shot per invocation; "save only" always present; never re-offer after a decline. |
| "User feels pressured to pick execute" | Option labels are neutral; the "save only" option is listed by name, not as "Cancel / Nothing". |

The discipline was about preventing **unsupervised** execution. `AskUserQuestion` *is* supervision — the user clicks. So the discipline is satisfied; only the *friction of expressing the supervision* changes (one click vs. one typed command).

## What the offer looks like in each meta-skill

### `/nav:plan` (Stage 4 — after Stage 3 writes the plan)

| # | Option | Action |
|---|---|---|
| 1 | Launch sub-agent to execute step 1 (Recommended) | `Agent` call with the plan path + step 1's scope + verification expectations |
| 2 | Execute step 1 in this session | Inline — user reviews each move |
| 3 | Save plan only — I'll come back later | Skill ends |

If step 1 is structurally a `/nav:refactor` move, the sub-agent prompt should reference `/nav:refactor`'s discipline.

### `/nav:refactor` (after Step 7 — Report)

| # | Option | Action |
|---|---|---|
| 1 | Commit on a new branch and open a draft PR | Stage commit + `gh pr create --draft`; needs explicit confirmation per project's git discipline |
| 2 | Launch sub-agent for a follow-up "improve" session | Now that the move landed, run improvements on the extracted module in fresh context |
| 3 | Done — I'll handle from here | Skill ends |

The "improve" sub-agent option formalises refactor's own rule: *"Improve (a separate session, after the move lands and is verified)"*. The sub-agent literally enforces that separation.

### `/nav:doctor` (after Step 6 — Final Report)

| # | Option | Action |
|---|---|---|
| 1 | Launch sub-agent for the first `/nav:refactor` recommendation (Recommended if list non-empty) | `Agent` call invoking `/nav:refactor` against the first item in Structural recommendations |
| 2 | Commit the headers + map changes | Stage + commit; respects project git discipline |
| 3 | Done — I'll handle from here | Skill ends |

If Structural recommendations is empty, option 1 is dropped and the remaining two are presented.

## Why this is sibling to ADR-006's reuse-via-transcript pattern

ADR-006 introduced "scan transcript first" as a deterministic, in-prose idiom for meta-skills that *consume* an earlier skill's output. ADR-007 introduces "offer next-action via `AskUserQuestion`" as a deterministic, in-prose idiom for meta-skills that *hand off to* the next step. Same shape:

- Lives in SKILL.md prose (no skill-calls-skill — ADR-001 #3 preserved)
- Deterministic (LLMs reliably follow explicit instructions; they don't reliably remember to ask)
- Reuses runtime primitives that are already there (`AskUserQuestion`, `Agent`)

Together: reuse-via-transcript looks backward (was upstream just run?), offer-next-action looks forward (is downstream the obvious next step?). Both keep meta-skills useful without coupling them.

## Consequences

- `plan/SKILL.md`: new **Stage 4 — Offer next action**, added after Stage 3. Discipline section gains: *"Offer next action via `AskUserQuestion`, never auto-execute."*
- `refactor/SKILL.md`: new **Step 8 — Offer next action**, added after Step 7.
- `doctor/SKILL.md`: new **Step 7 — Offer next action**, added after Step 6.
- `plugins/nav/CLAUDE.md`: new "offer-next-action pattern" paragraph alongside the existing "reuse-via-transcript" one.
- `docs/site/index.html`: audit-block bumped to rev 4 with a FIXED entry; no NAV_NODES / NAV_EDGES change (this is behaviour inside existing skills, not new structure).
- `README.md`: no change needed (skill list unchanged).

## Out of scope (deferred)

- **Auto-launching the sub-agent without `AskUserQuestion`.** Considered for the case where the user has set a preference. Rejected for now — the offer is the discipline. If a preference layer arrives later (e.g., a per-project `claude.skills.json`), revisit.
- **Multi-step sub-agent (execute steps 1-3 autonomously).** Out of scope; today's sub-agent prompt is per-step. Multi-step autonomous execution is a bigger discipline question (when does the agent stop?) and deserves its own ADR.
- **Generalising to atomic skills.** Explicitly rejected (decision #6). If a future atomic skill *does* have a single obvious next action, revisit per-skill.

## Notes

- The pattern presumes `AskUserQuestion` is the supervisor — if a runtime variant ever auto-picks option 1, the discipline collapses. Should that change, this ADR needs revisiting.
- The "(Recommended)" suffix on the sub-agent option follows the `AskUserQuestion` tool's documented convention.
- The "save only / done" option exists not just as opt-out but as **the explicit way to stop** — without it, the user is implicitly pushed toward executing. Always include it.
