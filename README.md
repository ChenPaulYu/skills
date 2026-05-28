# skills

> Personal Claude skills for code I want to live with.
> Built on Ousterhout's deep-module principles + the discipline learned from refactoring the hard way.

## What's in here

| Skill | What it does |
|---|---|
| [`deep-module-audit`](./skills/deep-module-audit/) | Honestly assess a codebase against the 11 deep-module rules. Read-only. |
| `deep-module-refactor` | Execute a refactor with the rule ⑧ discipline: verbatim move + test gate after each step + browser-verified at the end. |
| `deep-module-map` | Generate / update `docs/codebase-map/index.html` — an interactive, bilingual codebase map with anatomies, click-to-reveal graphs, screenshots, and an embedded grounding-audit block. |
| `deep-module-headers` | Add or standardize skill-style JSDoc headers on load-bearing files, so an agent can `head -12` to retrieve a file's role without reading its body. |

All four lean on the **same 11 rules** — see [`CLAUDE.md`](./CLAUDE.md) for the philosophy.

## Philosophy (the through-line)

Deep modules — narrow interfaces over hidden complexity. Code you can navigate top-down, without having to read every body to understand the surface. Refactors that move things around but never lie about what changed. Documentation grounded in code, never invented.

When in doubt: rule ⑨. Ask.

## Architecture notes

Design decisions live as ADRs in [`docs/adr/`](./docs/adr/) — when this plugin grows, future-me (and other readers) need to know why it was shaped this way.

## Install

For local development (this directory):
```bash
ln -s ~/Desktop/Github/01-project/skills ~/.claude/plugins/marketplaces/skills
```

For others (once pushed to GitHub): add `ChenPaulYu/skills` as a Claude Code marketplace.

## License

MIT
