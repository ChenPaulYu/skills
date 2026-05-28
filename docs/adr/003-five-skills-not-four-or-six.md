# ADR 003 — Five skills, not four or six

**Status**: accepted
**Date**: 2026-05-28
**Context**: After the initial 4 skills (audit / refactor / map / headers) were drafted, discussion surfaced two more candidates: `nav-fit` (feasibility against a target spec) and `nav-doctor` (full health-pass orchestrator). Spent a session debating what's truly fundamental vs what's a parameterization of something else.

## Decision

**Five skills:**

| Skill | Verb | Notes |
|---|---|---|
| `nav-audit` | assess | Two modes: unconditional health (no args) OR feasibility (against a spec arg). Same machinery, parameterized. |
| `nav-refactor` | transform | Execute a known refactor with verbatim-move + test-gate discipline. |
| `nav-headers` | describe (file level) | Add or standardize per-file JSDoc-style headers. |
| `nav-map` | describe (project level) | Generate `docs/codebase-map/index.html`. |
| `nav-doctor` | orchestrate | Meta-skill: audit → propose plan → execute light fixes (headers + map). Hands off refactors. |

## Why these five (and not more, not fewer)

### Why `nav-fit` was folded into `nav-audit`, not a separate skill

Surface-level intuition said feasibility is a different thing — "can my codebase carry feature X?" feels different from "is my codebase healthy?".

But mechanically, they're identical. Both:
1. Detect stack
2. Inventory domains
3. Run mechanical + heuristic checks
4. Report findings

The only difference is **scope** (whole repo vs domains touched by the target spec) and **framing** (categorize by rule vs categorize as gap-vs-target). Same machinery, different optional input.

This is the same pattern as `git diff` (no args = all) vs `git diff <branch>` (with arg = comparison). One tool, optional positional argument changes output framing.

Folding fit into audit:
- Saves one skill (rule ⑥ wins)
- Lets the agent fire on broader trigger phrasings (feasibility AND general audit)
- Avoids the "is this fit or audit?" trigger ambiguity

### Why `nav-doctor` is NOT merged with `nav-refactor`

They look similar (both "fix code"), but the **user's knowledge state at entry** differs:

- `nav-refactor` entry: "I know what to move" (specific change in mind)
- `nav-doctor` entry: "I don't know what's wrong" (discovery mode)

Different entry conditions ⇒ different skills. Cf. `git commit` (you know what to commit) vs `git status` (you don't know current state) — both modify-adjacent, but not merged.

Plus: merging would force one of:
- Doctor SKILL.md absorbs refactor's protocol → giant skill (rule ⑤ at the skill level)
- Doctor calls into refactor as skill-call → violates self-contained convention (ADR-001 #3)
- Refactor absorbs audit-first mode → loses precision for "I just want to extract this hook"

Keep them separate. Doctor RECOMMENDS specific `nav-refactor` invocations in its final report; user runs them in fresh sessions.

### Why `nav-headers` and `nav-map` are NOT merged

Both are "describe code metadata" — surface similarity. But they differ on three real axes:

| Axis | nav-headers | nav-map |
|---|---|---|
| Write surface | N source files (in-place) | 1 new file (docs/codebase-map/) |
| PR diff shape | Scattered across codebase | Concentrated in one folder |
| Update frequency | Per code change (high) | Per major restructure / onboarding (low) |
| Entry intent | "I added files, descibe them" | "Regenerate the navigation HTML" |

Merging would mean "I just want to add headers" accidentally touches `docs/codebase-map/`. And "I just want to regenerate the map" accidentally touches 19 source files. Either is a bad PR shape.

Bonus reason for separation: **headers' output becomes map's input.** When map runs after headers, it can `head -12` each file and use the existing description (cheap, accurate). Without persistent headers, map has to re-derive descriptions each run (expensive, error-prone). Separation enforces metadata persistence — which serves multiple consumers (map, future agents, human readers).

### Why `nav-doctor` IS its own skill (not just README orchestration)

Considered: keep 4 atomic skills + document the "full pass" sequence in README; let users invoke manually.

Rejected because:
- Use case 5 (full refactor flow) is explicit and recurring in Paul's workflow
- Manual orchestration loses the "pause for review at each gate" structure
- A meta-skill encodes the right pauses — README prose doesn't

So doctor IS a real skill, but it doesn't duplicate atomic skills' protocols — it references them.

## Consequences

- Plugin has 5 skills (no version bump — still pre-publication, all changes ride 0.1.0).
- `nav-fit` is not a separate folder/file — it lives as Mode 2 inside `nav-audit/SKILL.md`.
- `nav-doctor` exists as its own folder/file; its SKILL.md references the sibling protocols rather than re-implementing them.
- Future addition rule: a new skill needs to add a fundamentally new verb. If it's a parameterization, fold into an existing skill (`nav-audit`'s two-modes is the precedent). If it's a composition, write a meta-skill that references siblings (`nav-doctor` is the precedent).
- The 5 verbs (assess / transform / describe-file / describe-project / orchestrate) form a complete basis for the workflows discussed. New families (`spec-*`, `craft-*`) get their own verb sets.

## Lesson recorded

**First-principles consolidation pays off.** Without this pass, the plugin would have shipped with 6 skills (including a redundant `nav-fit`) or had a giant `nav-treat` swiss-army knife. Five focused skills + one meta is the minimum that covers all 6 use cases without redundancy.

When tempted to add a new skill, ask: is this a new verb, or a parameterization / composition of existing verbs? If the latter — fold or orchestrate, don't proliferate.
