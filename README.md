# skills

> Personal Claude skills for code I want to live with.
> Built on Ousterhout's deep-module principles + the discipline learned from refactoring the hard way.

## What's in here

| Skill | What it does |
|---|---|
| [`nav-audit`](./skills/nav-audit/) | Honestly assess any codebase against the 11 deep-module rules. Two modes: unconditional health audit, or feasibility audit against a target spec. Read-only. |
| [`nav-refactor`](./skills/nav-refactor/) | Execute a structural refactor with rule ⑧ discipline: verbatim move + test gate after each step + real-app pass at the end. |
| [`nav-headers`](./skills/nav-headers/) | Add or standardize skill-style file-top headers on load-bearing files, so an agent can `head -12` to retrieve the role + key deps. Universal convention; per-language syntax (JSDoc / docstring / `//` / `///`). |
| [`nav-map`](./skills/nav-map/) | Generate `docs/codebase-map/index.html` — an interactive, optionally-bilingual codebase map with anatomy graphs, draggable nodes, click-to-reveal panels, and a grounding-audit block. Visual form spec: `nav-map/references/visual-spec.md`. |
| [`nav-doctor`](./skills/nav-doctor/) | Full health pass — orchestrates audit → plan → headers → map with user-review gates between every step. Hands off structural refactors to `nav-refactor` (does NOT auto-execute them). |

All five share the **same 11 rules** — see [`CLAUDE.md`](./CLAUDE.md) for the philosophy.

## Philosophy (the through-line)

Deep modules — narrow interfaces over hidden complexity. Code you can navigate top-down, without having to read every body to understand the surface. Refactors that move things around but never lie about what changed. Documentation grounded in code, never invented.

When in doubt: rule ⑨. Ask.

## Language support

All five skills are **language-agnostic**. They have a universal core that runs on any codebase, plus stack-specific heuristics that activate when a known stack (TS/React, Python, Go, Rust, Swift, …) is detected. The 11 design principles transfer everywhere; only the thresholds + syntax flex per language.

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
