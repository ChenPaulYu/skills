# skills

> Paul's personal Claude marketplace.
> A growing collection of focused, single-purpose Claude plugins.

## What's in here

| Plugin | What it covers |
|---|---|
| [`nav`](plugins/nav/) | Keep any codebase navigable as it grows — audit shape, refactor with discipline, add file-top headers, render a bilingual codebase map, run the full health pass. Built on Ousterhout's deep-module principles. |

More plugins land here over time. Each lives in its own folder under `plugins/`, gets its own `plugin.json`, and registers via the marketplace's `marketplace.json`.

## Invocation

Once installed (see below), each plugin's skills appear as `/<plugin>:<skill>`. For `nav`:

- `/nav:audit` — assess codebase shape (or read-only quick-check against a target spec)
- `/nav:refactor` — execute a structural refactor with verbatim-move + test-gate discipline
- `/nav:headers` — add or standardize skill-style file-top headers
- `/nav:map` — generate the bilingual `docs/codebase-map/index.html`
- `/nav:doctor` — full health pass (audit → headers → map, with review gates)
- `/nav:plan` — ground a spec against the code, clarify ambiguity, write a plan artifact

## Install

In Claude Code:

```bash
/plugin marketplace add ChenPaulYu/skills
/plugin install nav@skills
```

That's it — `/nav:audit`, `/nav:refactor`, `/nav:headers`, `/nav:map`, `/nav:doctor`, `/nav:plan` become available.

### Local development (Paul only)

For iterating on this marketplace itself, use a local path instead of the GitHub handle:

```bash
/plugin marketplace add <absolute-path-to-this-repo>
/plugin install nav@skills
```

After editing any `SKILL.md`, run `/reload-plugins` — Claude Code re-reads the local path in place (no reinstall).

## Philosophy (the through-line)

Deep modules — narrow interfaces over hidden complexity. Code you can navigate top-down, without reading every body to understand the surface. Refactors that move things around but never lie about what changed. Documentation grounded in code, never invented.

When in doubt: rule ⑦. Ask.

## Map

[`docs/site/index.html`](docs/site/index.html) is a self-contained bilingual interactive map of this marketplace — every plugin, every skill, the 8 rules, conventions, plus the nav-plugin anatomy graph. Open it directly in a browser.

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
