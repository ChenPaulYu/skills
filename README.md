# skills

> Paul's personal Claude marketplace.
> A growing collection of focused, single-purpose Claude plugins.

## What's in here

| Plugin | What it covers |
|---|---|
| [`nav`](plugins/nav/) | **Keep code healthy** — audit shape, refactor with discipline, sync the navigation layer (file-top headers + bilingual codebase map), ground a spec into a plan. Built on Ousterhout's deep-module principles. |
| [`shape`](plugins/shape/) | **Push work forward** — converge a decision (a grounded grill, or a rendered interactive artifact), record it in a legible `blueprints/` board, keep it current, and build it into running, verified code. The forward-motion half to `nav`'s maintenance half. |

The two split the lifecycle: **shape** pushes work forward (converge → plan → build), **nav** keeps the result healthy (audit → refactor → map). shape depends on nav one-way (`shape → nav`); each still installs and runs alone.

More plugins land here over time. Each lives in its own folder under `plugins/`, gets its own `plugin.json`, and registers via the marketplace's `marketplace.json`.

## Invocation

Once installed (see below), each plugin's skills appear as `/<plugin>:<skill>`.

**`nav` — keep code healthy:**

- `/nav:audit` — assess codebase shape (or read-only quick-check against a target spec)
- `/nav:refactor` — execute a structural refactor with verbatim-move + test-gate discipline
- `/nav:sync` — re-sync the navigation layer to the code: file-top headers + the bilingual `docs/codebase-map/index.html`, one grounding pass, two phases
- `/nav:plan` — ground a spec against the code, clarify ambiguity, write a plan artifact (lands in `blueprints/plans/` when present)

**`shape` — push work forward** (skills grouped by verb around a `blueprints/` convention):

- `/shape:elicit` — converge a conceptual decision by a grounded grill — or root-cause a logic flaw (diagnostic mode)
- `/shape:mockup` — converge a look / structure decision by a real, disposable, interactive artifact
- `/shape:rehearse` — pressure-test a feature's logic — walk its usage (intent → scenario), render the holes as a mockup
- `/shape:align` — decide now/next/later *with you* → a `blueprints/` status board (`plan.md` + bilingual `overview.html`)
- `/shape:reconcile` — keep the blueprints honest — amend stale facts, prune/consolidate stale `thoughts/` + `plans/`
- `/shape:build` — drive the plan's In-progress column to done, autonomously but confidence-gated (stop below 90%)

## Install

In Claude Code:

```bash
/plugin marketplace add ChenPaulYu/skills
/plugin install nav@skills
/plugin install shape@skills
```

That's it — the `/nav:*` and `/shape:*` skills become available. (Install only `nav` if you just want the maintenance half; `shape` depends on `nav`, so install both to use the forward-motion half.)

### Local development (Paul only)

For iterating on this marketplace itself, use a local path instead of the GitHub handle:

```bash
/plugin marketplace add <absolute-path-to-this-repo>
/plugin install nav@skills
/plugin install shape@skills
```

After editing any `SKILL.md`, run `/reload-plugins` — Claude Code re-reads the local path in place (no reinstall).

## Philosophy (the through-line)

Deep modules — narrow interfaces over hidden complexity. Code you can navigate top-down, without reading every body to understand the surface. Refactors that move things around but never lie about what changed. Documentation grounded in code, never invented.

And the forward-motion counterpart (`shape`): **converge by a real, disposable instance — never a description.** Push a decision into a form you can point at (a grounded fork, a rendered artifact, a blueprints board), keep it current, and build it into running, verified code.

When in doubt: rule ⑦. Ask.

## Map

[`docs/site/index.html`](docs/site/index.html) is a self-contained bilingual interactive map of this marketplace — every plugin, every skill, the 8 rules, conventions, plus the `nav` and `shape` anatomy graphs. Open it directly in a browser.

**Living document — stale = lie.** When you add / rename / remove a skill, plugin, or ADR, update the map + its audit block in the same commit. The audit block at the top of the HTML lists what was last verified; treat drift as a lie until corrected.

## Docs layout

| Folder | What |
|---|---|
| [`docs/adr/`](docs/adr/) | Architecture Decision Records — decisions with alternatives weighed |
| [`docs/findings/`](docs/findings/) | Build-side mechanisms learned while editing this marketplace |
| [`docs/observations/`](docs/observations/) | Usage techniques observed while working with coding agents (→ future skills) |
| [`docs/site/`](docs/site/) | The interactive marketplace map (living document) |

Plugin-level conventions live in each plugin's own `CLAUDE.md` (e.g. [`plugins/nav/CLAUDE.md`](plugins/nav/CLAUDE.md)).

## License

MIT
