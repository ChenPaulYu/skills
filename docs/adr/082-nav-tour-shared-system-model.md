# ADR 082 — `nav:tour`: a guided walkthrough that lands a corrected shared system model

**Status**: accepted
**Date**: 2026-07-14
**Source**: `blueprints/plans/2026-07-14-nav-tour.md` · re-evaluates the generic-`teach` ruling in `blueprints/thoughts/2026-07-14-elicit-ecosystem-four-quadrants.md`

## Context

The prior ruling in the elicit-ecosystem four-quadrants thought rejected a generic `teach` skill: "inject context" alone is a thin wrapper around default explanation, `frame:analogize`, or external research — not enough to earn its own door (the same next-doctor razor that killed `nav:doctor`, ADR-021). That ruling stands.

But a narrower job kept resurfacing that the rejection didn't actually cover: a person wants to be walked through **what a specific, real codebase already does** — its capabilities, how the parts cooperate, and why it has the shape it has — and have the agent's resulting mental model checked against theirs before it's trusted. `nav:map` is the closest existing door; its frontmatter already fires on onboarding language and it calls itself a teaching projection. But its mandatory deliverable is a durable HTML render (`docs/codebase-map/index.html`) on a periodic, mechanical-tier, write-producing cadence (ADR-029, ADR-059). A conversational walkthrough has a different cadence entirely: summoned, judgment-heavy, read-only, and — the load-bearing difference — complete only after a correction loop, not after a render.

## Decision

1. **`tour` is a new `nav` skill whose deliverable is a corrected shared system model, not an explanation.** The tour is not done when the agent finishes describing the codebase — it's done when the agent's model has been exposed as falsifiable claims, the user has corrected it, and the delta has been classified and returned. This mandatory correction loop is what keeps `tour` from re-collapsing into the rejected generic `teach`: drop the loop and it's just a nicely-worded lecture, which the prior ruling already found too thin to earn a door.
2. **Every rationale claim is provenance-labeled: Recorded / Inferred / Unknown.** Code proves what exists and often how it works; code alone never proves why a decision was made. A tour that says "we chose X because Y" with no ADR/commit-body/user-statement behind it is inventing history — `tour` refuses that by construction, the same discipline `research:provenance` applies to citations, applied here to a codebase's own self-narrative.
3. **`tour` belongs in `nav`, not `shape`.** Its object is the already-existing codebase; it reads decision artifacts owned elsewhere but never authors or changes one. `shape` continues to own convergence about what *should* be built (`elicit`, `mockup`, `align`); `tour` explains what exists and what recorded choices shaped it. If a tour surfaces an intent/code divergence, it reports and offers `/shape:elicit` — it never adjudicates.
4. **`tour` consumes `nav:map` by protocol, never by invocation** (skills in this marketplace don't call each other — ADR-003/008). When the durable map is present and current, it's the cheapest first-tier evidence; when absent or stale, `tour` degrades to headers, then to a source-and-git fallback, and self-reports which tier it used (the same tolerant-reader three-state pattern as `reflect:catchup`, ADR-070/071).
5. **`nav:map`'s frontmatter narrows to remove conversational onboarding as a trigger**, keeping only requests to create/refresh/open the durable HTML render. This is a genuine trigger collision, not a hypothetical one — `map`'s description already said "onboard me to this codebase" before this change. Its render workflow, write contract, and cost tier are unchanged; only the boundary sentence and one companion-skill line move.
6. **Cost tier: session model, not mechanical.** Unlike `map` (ADR-059's tiered renderer — rendering from already-maintained headers is derived, mechanical work), synthesizing capabilities, flow, provenance-labeled rationale, and a user's correction into a revised shared model is judgment work end to end. `tour` is not tiered.
7. **Retirement/merge condition, stated now so it's checkable later:** if real use shows people only ever consume the first-pass guided model and never engage the correction loop (Step 4/5), that's evidence the loop isn't earning its keep and `tour` should either merge into `map`'s onboarding path or fold its provenance discipline into `reflect:catchup`. This mirrors ADR-021's doctor-retirement precedent — a verb this repo is willing to retire if its differentiator turns out unused, not a decision made permanent by inertia.

## Why

- **The correction loop is the actual differentiator, not the explanation quality.** Anyone can write a decent-sounding architecture summary; the four-quadrant ruling already rejected that as the whole product. What no existing skill does is put the agent's *own* model on the table as falsifiable claims and require the user to falsify it before the tour counts as complete — that's the non-No-Op test this skill has to keep passing.
- **Provenance labeling prevents a specific, real failure mode: confident invented history.** An agent describing a codebase it just read is structurally prone to narrating "why" as if it were fact when it's really a plausible-sounding guess from code shape. Naming three explicit buckets (Recorded/Inferred/Unknown) makes that guess visible instead of laundering it into prose.
- **`map` vs `tour` is a cadence-and-medium split, the same shape as ADR-029's `sync`/`map` re-split.** `map` is periodic + heavy + mechanical + write-producing; `tour` is summoned + conversational + judgment-heavy + read-only. Binding them to one door would force one to be the wrong size, exactly as ADR-029 found for `sync`/`map`.
- **Staying in `nav`, not `shape`, keeps the plugin boundary honest.** `nav` skills describe/audit/change the codebase that exists; `shape` skills converge decisions about what should exist. `tour` only ever describes and, at most, *surfaces* a divergence — adjudicating it is explicitly out of scope and routed to `shape:elicit`.

## Overlap / boundary analysis — six neighbors

- **vs `nav:map`** — `map` writes/refreshes the durable bilingual repo projection; `tour` consumes available evidence and conducts an in-chat correction loop, writing nothing. Map answers "where is everything?"; tour answers "what model should we now share?"
- **vs `reflect:catchup`** — `catchup` reconstructs current *work* state: goal/done/now/open/next, grounded in git/diff/plan artifacts, and decays fast. `tour` explains the relatively stable *product/system* model, not where today's task stopped.
- **vs `shape:survey`** — `survey` maps missing axes in a *decision space* before the user decides something, and reports the diff between stated and full understanding of that space. `tour` explains a *system that already exists* and checks factual/shared understanding of it — different object (a decision's terrain vs a shipped system), same "expose the gap" shape, which is why both share a falsifiable-diff mechanic without competing for the same trigger.
- **vs `shape:elicit`** — `elicit` converges a *new* principle or decision by drawing it out of the user. `tour` may expose an intent/code divergence during Step 5 but never adjudicates it — it offers `/shape:elicit` as the next door instead.
- **vs `frame:analogize`** — `analogize` builds and stress-tests a dedicated analogy for one already-understood concept, with a breakdown point named explicitly. `tour` permits at most one deliberately chosen analogy for its hardest structural point as *style*, never runs `analogize`'s full engine, and never compares multiple candidate analogies.
- **vs `nav:audit`** — `audit` assesses architectural health (smells, feasibility, legacy sweep) and reports findings for action. `tour` teaches the current system without grading or fixing it; a smell noticed incidentally is marked, not investigated into an audit.

Trigger-collision risk is concentrated entirely on the `map` boundary (both used "onboarding" language before this change) and is closed by decision 5 above. The other five neighbors differ in core question sharply enough that the boundary sentences in `tour`'s own frontmatter and companion-skills section are sufficient without further routing changes.

## Consequences

- `plugins/nav/skills/tour/SKILL.md`: new file, self-contained per repo convention.
- `plugins/nav/skills/map/SKILL.md`: frontmatter narrowed to drop conversational onboarding as a trigger; one companion-skill line added pointing to `tour`.
- `plugins/nav/.claude-plugin/plugin.json`: version `0.8.4` → `0.9.0` (minor bump, new skill).
- `plugins/nav/CLAUDE.md`: roster count seven → eight; `tour` added as the conversational describe/alignment member; `map → tour` recorded as consumption, not invocation; `tour` kept off the mechanical-tier list.
- `platforms/codex/descriptions.json`: `nav-tour` added with a lean trigger-first description; `nav-map`'s existing entry rechecked and narrowed to match the same boundary.
- `README.md`, `docs/site/index.html`: registration gate (#3) — `/nav:tour` named in both; nav's DOMAINS-card blurb and graph-node blurb updated to mention `tour` and `v0.9.0` (English and Chinese independently); audit-block rev bumped with a FIXED entry; a `tour` node + `map → tour` edge added to the nav graph.
- No changes to `shape:elicit`'s gatekeeper logic, `reflect:catchup`'s protocol, or any other plugin's roster — this ADR is scoped to `nav` alone.
- **Not decided here**: whether a future need for durable, user-specific onboarding notes justifies persisting the shared model past one session — out of scope per the source plan, would need its own ownership analysis if it comes up.
