# skills

> Paul's personal Claude marketplace.
> A growing collection of focused, single-purpose Claude plugins.

## What's in here

| Plugin | What it covers |
|---|---|
| [`nav`](./plugins/nav/) | Keep any codebase navigable as it grows — audit shape, refactor with discipline, add file-top headers, render a bilingual codebase map, run the full health pass. Built on Ousterhout's deep-module principles. |

More plugins land here over time. Each lives in its own folder under `plugins/`, gets its own `plugin.json`, and registers via the marketplace's `marketplace.json`.

## Invocation

Once installed (see below), each plugin's skills appear as `/<plugin>:<skill>`. For `nav`:

- `/nav:audit` — assess codebase shape (or check it against a target spec)
- `/nav:refactor` — execute a structural refactor with verbatim-move + test-gate discipline
- `/nav:headers` — add or standardize skill-style file-top headers
- `/nav:map` — generate the bilingual `docs/codebase-map/index.html`
- `/nav:doctor` — full health pass (audit → headers → map, with review gates)

## Install

**Local development** (this directory):

```bash
/plugin marketplace add /Users/bernie/Desktop/Github/01-project/skills
/plugin install nav@skills
```

After editing any `SKILL.md`, run `/reload-plugins` — Claude Code re-reads the local path in place.

**Once pushed to GitHub**: add `ChenPaulYu/skills` as a Claude Code marketplace, then `/plugin install nav@skills`.

## Philosophy (the through-line)

Deep modules — narrow interfaces over hidden complexity. Code you can navigate top-down, without reading every body to understand the surface. Refactors that move things around but never lie about what changed. Documentation grounded in code, never invented.

When in doubt: rule ⑨. Ask.

## Architecture notes

Marketplace-level decisions live as ADRs in [`docs/adr/`](./docs/adr/). Plugin-level conventions live in each plugin's own `CLAUDE.md` (e.g. [`plugins/nav/CLAUDE.md`](./plugins/nav/CLAUDE.md)).

## License

MIT
