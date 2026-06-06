# nav — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained.

## What this plugin is

A focused collection of skills for **keeping code navigable** — auditing, refactoring, mapping, documenting, and planning against the code so it stays navigable as it grows. Inspired by Ousterhout's *A Philosophy of Software Design*; calibrated against real refactors (e.g., decomposing a 1718-line component into a 16-file subsystem with a single barrel).

Six skills today: `audit` (assess) · `refactor` (transform — behaviour-preserving) · `sync` (describe — file-top headers, per-file navigability) · `map` (describe — the repo codebase map, per-repo navigability) · `plan` (ground + clarify + plan artifact, for spec-grounded work) · `do` (execute — a small behaviour-*changing* change, disciplined, no artifact). See [ADR-003](docs/adr/003-five-skills-not-four-or-six.md) for the original consolidation logic, [ADR-006](docs/adr/006-nav-plan-skill.md) for why plan landed, [ADR-019](docs/adr/019-sync-collapses-headers-and-map.md) for why the former `headers` + `map` skills first collapsed into one `sync` door — and [ADR-029](docs/adr/029-resplit-sync-and-map-by-cadence.md) for why they re-split into `sync` + `map` by cadence (continuous per-change headers vs periodic batched map), [ADR-021](docs/adr/021-retire-nav-doctor.md) for why `doctor` was retired (a 2-step orchestrator `audit → sync` too thin to earn a skill — its full-pass entry folded into `audit`'s onward hand-off), and [ADR-023](docs/adr/023-nav-do-execution-verb.md) for why `do` landed (nav's execution verb — the inject↔check sub-agent discipline promoted to a standalone, plan-less door).

**Language-agnostic by design.** The 8 rules transfer to any stack; specific checks have universal-core + per-stack heuristics.

This plugin lives inside the `skills` marketplace (`ChenPaulYu/skills`). The marketplace is the personal-collection container; this plugin is the navigability family. Future families (`spec`, `craft`, …) become sibling plugins under the same marketplace — they don't pile up inside this one. See [ADR-005](docs/adr/005-marketplace-plus-plugin-restructure.md).

## The 8 rules (the through-line of every skill)

Every skill in this plugin assumes — and re-states inside its own `SKILL.md` — these eight rules. They're one idea — **deep modules** — applied at every scale, plus the discipline to get there safely and the test to know you have. **Grouped: Shape ①–⑤ · Discipline ⑥–⑦ · Test ⑧.**

1. **Deep modules through information hiding** — a simple interface hiding significant complexity; usable without reading the body. The *technique* is **information hiding** (Parnas): encapsulate each design decision — data structures, algorithms, formats, assumptions — inside one module so it never surfaces in the interface. Its inverse is the red flag **information leakage** (the same knowledge baked into ≥2 modules, so one change touches them all), often caused by **temporal decomposition** (module boundaries following execution order — read/modify/write — instead of knowledge). Maximize hidden complexity per unit of interface; prefer general-purpose foundations over premature special-casing.
2. **Interface-first at every scale** — expose through one door, surfaced progressively: a module's interface, a subsystem's barrel/facade (`index.ts`), the whole codebase's index/map. Drill into bodies only as needed.
3. **Explicit dependencies** — functions deterministic; deps explicit in the signature, not ambient/hidden.
4. **Right grain — neither giant nor fragmented** — no mega-module or mega-function (a 700-line render counts); equally, no needless abstraction (don't modularise what needn't be). The giant↔fragment tension is the balance you manage.
5. **Fit the framework** — idiomatic patterns (React: custom hooks; pass a store/hook object as one prop, not 20 loose props); don't fight the ecosystem.
6. **Rearrange, don't rewrite** — refactor = verbatim move + rewire; behaviour stays identical; test-gate each step.
7. **Below 90% confidence → ask** — when unsure about scope, boundaries, intent: stop and clarify.
8. **Agent-navigability is the audit** — when an agent regenerates a codebase map, struggle-to-describe IS the deep-module test. Failure cues: must enumerate, must footnote, must guess, must list > 6 imports.

These rules **also apply to this plugin's own code** — meta-discipline. If a skill grows past ~500 lines or starts enumerating many distinct responsibilities, split it.

## Conventions for skills inside this plugin

- **Naming**: skills use **bare verbs** — `audit`, `refactor`, `sync`, `map`, `plan`. The plugin namespace (`nav:`) provides the topic context, so no `nav-` prefix on the skill name itself. See [ADR-005](docs/adr/005-marketplace-plus-plugin-restructure.md).
- **Self-contained**: every `SKILL.md` includes the 8 rules verbatim, so an agent triggered into the skill doesn't depend on this CLAUDE.md being loaded. Bulky reference docs (e.g. `skills/map/references/visual-spec.md`, plus the engine protocols `sync`'s `header-render.md` and `map`'s `map-render.md`) live in each skill's `references/` and are loaded only when actually rendering.
- **★ Stack-neutral, standalone-legible examples (core principle)**: every example in a `SKILL.md` must be understandable from that skill *alone* — never leak a past project's domain nouns (specific component names, hooks, filenames, app concepts like a particular product's "TrackCard" or "annotation store"). Use generic, neutral placeholders (`UserList`, `useSelection`, `core/user`, `Editor.tsx`) so a reader who has never seen the origin project still gets it. A skill that only makes sense if you know Project X is a leaky skill — fix the example, don't ship the leak.
- **★ Skills-root-relative paths (core principle)**: all paths — doc cross-references **and** example code — are written as if `skills/` (the marketplace root) is the root. **No `./` or `../` prefixes.** Doc links: `docs/adr/008-inject-check-at-handoff.md`, never `../../docs/…`. Example imports: alias form (`@/core/user`) or bare module names; a `Reads:` header line lists dep names without path prefixes (`core/user · app/useUsers`), never `../../core/…`. Relative-path noise ties a skill to a directory depth it has no business assuming.
- **Frontmatter `description`**: written **broad** (matches multiple trigger phrasings) but **honest** about scope. No "pushy" cross-domain claims.
- **Cross-references between skills**: spell them as `/nav:audit`, `/nav:refactor`, etc. — the form the user actually types. Bare names like `audit` are ambiguous out of context.
- **Scope**: skills are **language-agnostic** with a universal core + per-stack heuristics (see [ADR-004](docs/adr/004-language-agnostic-scope.md)). Don't bail on unknown stacks — degrade gracefully to universal checks + flag what was skipped.
- **Read-only by default**: skills that modify files (`sync`, `map`, `refactor`, `plan`) must show a diff first or only modify on explicit user confirmation.
- **Skills don't invoke each other**. The meta-skill (`plan`) describes a sequence for the agent to follow — it references sibling protocols rather than re-implementing them. Atomic skills stay standalone-callable (see [ADR-003](docs/adr/003-five-skills-not-four-or-six.md)).
- **Reuse-via-transcript pattern**: when a skill inlines another skill's protocol, Stage 1 should include a "scan recent turns; if `<other-skill>` already ran against the same input, reuse its output" preamble. Deterministic + zero coupling. Current users: `sync` (audit, as its grounding pass), `map` (audit or `sync`, as its grounding pass), `plan` (audit). See [ADR-006](docs/adr/006-nav-plan-skill.md).
- **Offer-next-action pattern**: meta-skills end with `AskUserQuestion` listing 2-4 concrete next actions (sub-agent · in-session · save/done). Sub-agent is the recommended default when a self-contained next step exists — it enforces clean context = "separate session" at the architecture level. Atomic skills don't get this pattern (no single obvious next step). Always include a "save / done" option so the user can opt out without typing; one-shot per invocation (no re-offering after decline). Current users: **nav** — `plan` (Stage 4), `refactor` (Step 8); **shape** — `elicit` (offers `/shape:mockup` when render-decidable, `/shape:align` to track, or the execution route `/nav:do`·`/nav:plan` when the thought is a concrete build), `mockup` (offers `/shape:align` to track + the execution route — `/nav:do` small · `/nav:plan` bigger · `/shape:build` multi-item — ADR-028, so a just-converged pick routes to the build verb's check instead of flowing past it on ambient discipline), `rehearse` (routes the holes by layer → `/shape:elicit` / `/shape:mockup` / `/nav:plan`), `reconcile` (offers `/shape:align` to re-sync the board). See [`docs/adr/007-offer-next-action-pattern.md`](docs/adr/007-offer-next-action-pattern.md).
- **Inject↔check at the sub-agent hand-off**: when a meta-skill's offer-next-action launches a sub-agent, it brackets the dispatch. **Inject (→)** the in-session grounding the fresh sub-agent can't re-derive — critical files + roles, existing impls/seams to reuse, the **N+1 trigger**. **Check (←)** the returned diff with a deep-module integration pass — same-domain parallel impl · seam/facade read at intent · header hygiene — *before* accepting "done". A sub-agent is tactical (sees only its slice, reads rules literally); the feature is its job, clean integration is the parent's. Current users: the nav offer-next-action hand-offs (`plan`, `refactor`), and **`do`** — which *is* this inject↔check bracket promoted to a standalone, directly-invocable verb (ADR-023); `plan` Stage 4 / `refactor` Step 8 now reference `do`'s discipline when they dispatch a sub-agent to execute. See [`docs/adr/008-inject-check-at-handoff.md`](docs/adr/008-inject-check-at-handoff.md).
- **N+1 trigger** (corollary of rules ④ + ②): first consumer of an inline util = inline is fine; **second consumer = extract a primitive** (don't copy-paste, don't shove a mode-flag into a facade). This is the operational trip-wire that turns "no needless abstraction" from a judgment call into a rule. Fires in the `refactor`/`plan` hand-offs above and in any integration check.
- **Each new skill**: write an ADR in `docs/adr/` (marketplace-level) explaining why it exists, what overlaps it has with siblings, and how the trigger description avoids stealing fire from them.

## Where things live

```
.claude-plugin/plugin.json   → manifest (name=nav, version, repo)
CLAUDE.md                    → ← you are here (developer-facing)
skills/<name>/SKILL.md       → individual skills, each self-contained
skills/<name>/references/    → bulky reference docs loaded on demand
../../README.md              → marketplace-level overview
../../docs/adr/              → ADRs (marketplace-level — shared across plugins)
```

## When editing this plugin

- New skill: scaffold `skills/<name>/SKILL.md`, write its frontmatter description carefully (it determines triggering accuracy), test invocations cover the main trigger phrasings, write an ADR.
- **Before adding or changing any skill, check the two ★ core principles above**: (1) every example is stack-neutral + standalone-legible — no past-project domain nouns; (2) every path is skills-root-relative — no `./` or `../` in doc links or example code. These are the most common ways a skill silently leaks its origin project or its directory depth; verify both before committing.
- Renaming a skill: bump version in `plugin.json`; document the rename in an ADR.
- Changing the 8 rules: this affects every skill — update each `SKILL.md` in the same commit, write an ADR.
- Stale `SKILL.md` is worse than missing `SKILL.md` — same rule as project-level "stale header = lie".
- **Site-map update is gating, not optional.** Any change to a `SKILL.md`, a plugin manifest, or an ADR REQUIRES the same commit to update [`docs/site/index.html`](docs/site/index.html). Before committing, **always** run:
  ```bash
  git status docs/site/index.html
  ```
  If you changed a skill but the site shows unmodified → **STOP** — you missed it. Update the relevant data array (`DOMAINS`, `NAV_NODES`, `NAV_EDGES`, `CONV`, sidebar links if anatomy structure changed), bump the audit-block date, and add a FIXED entry naming what changed. Skip only for pure typo / internal refactor with zero surface impact. **Stale map lies silently to every future reader** — that's why this is a hard gate, not a soft reminder.
