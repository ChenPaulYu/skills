# skills

> Paul's personal Claude marketplace.
> A growing collection of focused, single-purpose Claude plugins.

## What's in here

| Plugin | What it covers |
|---|---|
| [`nav`](plugins/nav/) | **Keep code healthy** — audit shape, refactor with discipline, sync the navigation layer (file-top headers + bilingual codebase map), ground a spec into a plan. Built on Ousterhout's deep-module principles. |
| [`shape`](plugins/shape/) | **Push work forward** — converge a decision (a grounded grill, or a rendered interactive artifact), record it in a legible `blueprints/` board, keep it current, and build it into running, verified code. The forward-motion half to `nav`'s maintenance half. |
| [`research`](plugins/research/) | **Read with intent** — dissect any argument-carrying document (paper, blog post, competitor analysis, RFC) into its structural skeleton: Gap / Claim / Mechanism / Evidence / Conclusion. Makes cross-document comparison possible; locates where your own claim sits relative to prior art. |

`nav` and `shape` split the code lifecycle: **shape** pushes work forward (converge → plan → build), **nav** keeps the result healthy (audit → refactor → map). **research** is independent — it reads the external world to inform the work, with no dependency on either. shape depends on nav one-way (`shape → nav`); each plugin installs and runs alone.

More plugins land here over time. Each lives in its own folder under `plugins/`, gets its own `plugin.json`, and registers via the marketplace's `marketplace.json`.

## Invocation

Once installed (see below), each plugin's skills appear as `/<plugin>:<skill>`.

**`nav` — keep code healthy:**

- `/nav:audit` — assess codebase shape (or read-only quick-check against a target spec)
- `/nav:refactor` — execute a structural refactor with verbatim-move + test-gate discipline
- `/nav:sync` — re-sync the navigation layer to the code: file-top headers + the bilingual `docs/codebase-map/index.html`, one grounding pass, two phases
- `/nav:plan` — ground a spec against the code, clarify ambiguity, write a plan artifact (lands in `blueprints/plans/` when present)
- `/nav:do` — execute a small, decided, behaviour-*changing* change directly (deep-module/header discipline inline, no plan artifact) — the execution verb, refactor's behaviour-changing twin

**`shape` — push work forward** (skills grouped by verb around a `blueprints/` convention):

- `/shape:elicit` — converge a conceptual decision by a grounded grill — or root-cause a logic flaw (diagnostic mode)
- `/shape:mockup` — converge a look / structure decision by a real, disposable, interactive artifact
- `/shape:rehearse` — pressure-test a feature's logic — walk its usage (intent → scenario), render the holes as a mockup
- `/shape:align` — decide now/next/later *with you* → a `blueprints/` status board (`plan.md` + bilingual `overview.html`)
- `/shape:reconcile` — keep the blueprints honest — amend stale facts, prune/consolidate stale `thoughts/` + `plans/`
- `/shape:build` — drive the plan's In-progress column to done, autonomously but confidence-gated (stop below 90%)

**`research` — read with intent:**

- `/research:dissect` — dissect any argument-carrying document into Gap / Claim / Mechanism / Evidence / Conclusion; optional "Implications for your claim" section; output saved to `notes/`

## Install

In Claude Code:

```bash
/plugin marketplace add ChenPaulYu/skills
/plugin install nav@skills
/plugin install shape@skills
/plugin install research@skills
```

That's it — the `/nav:*`, `/shape:*`, and `/research:*` skills become available. (Install only `nav` if you just want the maintenance half; `shape` depends on `nav`, so install both to use the forward-motion half. `research` is independent — install alone or with the others.)

### Local development (Paul only)

For iterating on this marketplace itself, use a local path instead of the GitHub handle:

```bash
/plugin marketplace add <absolute-path-to-this-repo>
/plugin install nav@skills
/plugin install shape@skills
```

After editing any `SKILL.md`, run `/reload-plugins` — Claude Code re-reads the local path in place (no reinstall).

## Codex compatibility

Codex (OpenAI) uses the same Agent Skills format (`SKILL.md` = `name` + `description` frontmatter + body + optional `references/`), so the plugins above double as Codex skills. The Claude plugins under `plugins/` stay the **single source of truth**; a Codex-discoverable mirror is **generated** into `.agents/skills/` — one flat, unnamespaced skill per plugin skill (`nav:audit` → `nav-audit`, since Codex has no plugin namespace), with cross-references and bundled paths rewritten. A repo-root [`AGENTS.md`](AGENTS.md) is synthesised from the two plugin `CLAUDE.md` files.

```bash
node scripts/build-codex.mjs   # re-run after editing any SKILL.md
```

Codex discovers `.agents/skills/` automatically when you open this repo (or copy a skill dir into your own project's `.agents/skills/`, or `~/.agents/skills/` for all projects). Invoke with `/skills` or a `$skill-name` mention; Codex also picks one implicitly when a task matches its `description`. **Don't hand-edit `.agents/skills/` or `AGENTS.md`** — edit the plugin skill and regenerate.

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
