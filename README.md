# skills

> Paul's personal agent-skills marketplace.
> A growing collection of focused, single-purpose plugins — one source tree, installable in **Claude Code**, **Antigravity CLI (`agy`)**, **Codex**, **opencode**, and **Cursor**.

## What's in here

| Plugin | What it covers |
|---|---|
| [`nav`](plugins/nav/) | **Keep code healthy** — audit shape, refactor with discipline, sync file-top headers, render the bilingual codebase map, ground a spec into a plan. Built on Ousterhout's deep-module principles. |
| [`shape`](plugins/shape/) | **Push work forward** — converge a decision (a grounded grill, or a rendered interactive artifact), record it in a legible `blueprints/` board, keep it current, and build it into running, verified code. The forward-motion half to `nav`'s maintenance half. |
| [`research`](plugins/research/) | **Read with intent** — dissect any argument-carrying document (paper, blog post, competitor analysis, RFC) into its structural skeleton, untangle how a set of sources relate, critique a paper adversarially into a referee report, or audit your own documents' citation provenance (trace every load-bearing claim back to a verified source). Locates where your own claim sits relative to prior art. |
| [`think`](plugins/think/) | **Reason about a problem** — apply a named reasoning lens that forces a structure the default "think harder" skips. `first-principles`: strip a question to its axioms, rebuild from them, surface where that diverges from convention. Feeds `shape`. |
| [`manage`](plugins/manage/) | **Reflect on your session** — the meta-lane: `catchup` (where the work stands now, rebuilt from git/diff/plan, not chat memory), `summarize` (a complete objective recap of what the session did), `observe` (distill the one durable learning into a knowledge base). Cross-cutting; independent. |

`nav` and `shape` split the code lifecycle: **shape** pushes work forward (converge → plan → build), **nav** keeps the result healthy (audit → refactor → map). **research** (read the external world), **think** (reason about a problem), and **manage** (reflect on your own working session — the meta-lane) are independent toolkits that feed the work without depending on it. shape depends on nav one-way (`shape → nav`); each plugin installs and runs alone.

More plugins land here over time. Each lives in its own folder under `plugins/`, gets its own `plugin.json`, and registers via the marketplace's `marketplace.json`.

## Invocation

Once installed (see below), each plugin's skills appear as `/<plugin>:<skill>`.

**`nav` — keep code healthy:**

- `/nav:audit` — assess codebase shape (or read-only quick-check against a target spec)
- `/nav:refactor` — execute a structural refactor with verbatim-move + test-gate discipline
- `/nav:sync` — sync file-top headers to the code (per-file navigability; continuous, per-change), gated diff
- `/nav:map` — render/refresh the bilingual codebase map `docs/codebase-map/index.html` (per-repo navigability; periodic, reads `sync`'s headers)
- `/nav:plan` — ground a spec against the code, clarify ambiguity, write a plan artifact (lands in `blueprints/plans/` when present)
- `/nav:do` — execute a small, decided, behaviour-*changing* change directly (deep-module/header discipline inline, no plan artifact) — the execution verb, refactor's behaviour-changing twin

**`shape` — push work forward** (skills grouped by verb around a `blueprints/` convention):

- `/shape:elicit` — converge a conceptual decision by a grounded grill — or root-cause a logic flaw (diagnostic mode)
- `/shape:mockup` — converge a look / structure decision by a real, disposable, interactive artifact
- `/shape:dogfood` — dogfood a built feature that feels unsmooth — drive the real interface (browser / `curl` / CLI) against user intents, report the friction + the coverage gaps that fall out
- `/shape:position` — author the canon layer: a gated multi-feeding campaign that lands core (principle-wise) docs — delta-report gating, altitude instrument, graduation-grown `core/`; mirror of `/shape:reconcile`
- `/shape:setup` — scaffold a new project to a *verified* running baseline: archetype-driven (accumulating `references/archetypes/`), consistent with your standing stack principles, done only when the verification chain is green
- `/shape:align` — decide now/next/later *with you* → a `blueprints/` status board (`plan.md` + bilingual `overview.html`)
- `/shape:reconcile` — keep the blueprints honest — amend stale facts, prune/consolidate stale `thoughts/` + `plans/`
- `/shape:build` — drive the plan's In-progress column to done, autonomously but confidence-gated (stop below 90%)

**`research` — read with intent:**

- `/research:dissect` — dissect any argument-carrying document into Gap / Claim / Mechanism / Evidence / Conclusion; optional "Implications for your claim" section; output saved to `notes/`
- `/research:untangle` — untangle how N sources relate (lineage / clusters / contradictions / contested ground), with optional claim-framed positioning
- `/research:critique` — adversarially assess one paper into a referee report (claim↔evidence audit + self-attack)
- `/research:provenance` — audit your own documents' citations: trace every load-bearing number / quote / claim back to a verified source, classify first-hand / second-hand / orphan, emit a quarantine list; repairs via `dissect`'s forensic mode

**`think` — reason about a problem:**

- `/think:first-principles` — strip a question to its irreducible axioms, rebuild the answer from them, surface where that diverges from convention; analysis stays in-chat (route to `shape` to persist)

**`manage` — reflect on your session** (the meta-lane; cross-project):

- `/manage:catchup` — re-orient on where the work stands now, rebuilt from git/diff/plan (not chat memory); fixed shape goal · done · now · open · next
- `/manage:summarize` — a complete, objective recap of what the session did (the raw input `observe` distills)
- `/manage:observe` — distill the one durable learning into a knowledge base (`docs/observations/`); writes to `$SKILLS_REPO` when set, else the current project

## Install

One source tree, two channels, five agents: **Claude Code** and **Antigravity CLI (`agy`)** import the plugins natively (namespace preserved — `/nav:audit`); **Codex**, **opencode**, and **Cursor** auto-discover the generated flat mirror `.agents/skills/` (flat names — `nav-audit`; see [Codex compatibility](#codex-compatibility)). The plugins under `plugins/` are the single source of truth everywhere.

Shortcut for any harness — tell your agent:

> Fetch and follow instructions from `https://raw.githubusercontent.com/ChenPaulYu/skills/main/INSTALL.md`

Or by hand. In Claude Code:

```bash
/plugin marketplace add ChenPaulYu/skills
/plugin install nav@skills
/plugin install shape@skills
/plugin install research@skills
/plugin install think@skills
/plugin install manage@skills
```

That's it — the `/nav:*`, `/shape:*`, `/research:*`, `/think:*`, and `/manage:*` skills become available. (Install only `nav` if you just want the maintenance half; `shape` depends on `nav`, so install both to use the forward-motion half. `research`, `think`, and `manage` are independent — install alone or with the others.)

### Antigravity CLI (`agy`)

Antigravity CLI natively imports Claude Code plugins — same `SKILL.md` format, same `/<plugin>:<skill>` namespace, **no conversion needed**. Two ways to wire this repo up:

**Global install (recommended).** Clone the repo, then import each plugin directory:

```bash
git clone https://github.com/ChenPaulYu/skills.git && cd skills
agy plugin install plugins/nav
agy plugin install plugins/shape
agy plugin install plugins/research
agy plugin install plugins/think
```

Verify with `agy plugin list` — each plugin shows up with source `claude-code`, and its skills are available in every project under the usual namespaced names (`/nav:audit`, `/shape:build`, …).

**Project-level auto-detection.** `agy` also reads `.agents/skills/` in the project you open it from — the same flat, generated mirror Codex uses (see [Codex compatibility](#codex-compatibility) below). Inside this repo that mirror is already committed, so opening `agy` here loads all skills under their flat names (`nav-audit`, `shape-build`, …) with no install step. To reuse them in another project, copy the skill dirs you want into that project's `.agents/skills/`.

Prefer the global install: it keeps the namespace, tracks the plugin source, and doesn't depend on the generated mirror.

### Codex · opencode · Cursor (flat mirror)

All three auto-discover `.agents/skills/` — so **inside a clone of this repo there is nothing to install**; the committed mirror loads automatically. For global use (all projects), copy the mirror into `~/.agents/skills/`:

```bash
git clone https://github.com/ChenPaulYu/skills.git && cd skills
mkdir -p ~/.agents/skills && cp -r .agents/skills/* ~/.agents/skills/
```

Skills surface under flat names (`nav-audit`, `shape-build`, …). Verify per agent: Codex — `/skills`; opencode — `opencode debug skill`; Cursor — type `/` in Agent chat and search `nav-audit`. (Note: agy's global install above already materializes the same skills into `~/.agents/skills/`, so if you ran it, opencode and Cursor are covered.)

Cursor alternative — native plugin form: each plugin also carries a `.cursor-plugin/plugin.json` (Cursor's plugin layout matches Claude Code's, so the same directory serves both), which makes a cloned plugin installable as a local Cursor plugin:

```bash
ln -s "$(pwd)/plugins/nav" ~/.cursor/plugins/local/nav   # repeat per plugin; restart Cursor
```

Cursor's `/add-plugin` marketplace is a separate, review-gated publishing channel — not needed for any of this.

### npx (skills.sh CLI)

The [skills.sh](https://skills.sh/) CLI wraps the same clone-and-copy in an npm-like UX, and tracks installs in a `skills-lock.json` so `npx skills update` can refresh them later:

```bash
# Interactive — pick skills and target agents from a list:
npx skills add ChenPaulYu/skills

# Non-interactive — values are space-separated; '*' selects all:
npx skills add ChenPaulYu/skills -s nav-audit shape-elicit -a cursor opencode -y
```

Add `-g` for a global (user-level) install; omit it to install into the current project. The picker shows 38 entries — the same 19 skills twice (flat mirror `nav-audit` + plugin source `audit`): **pick the prefixed set**; the unprefixed names (`plan`, `build`, `do`, …) are generic and collision-prone.

### Local development (Paul only)

For iterating on this marketplace itself, use a local path instead of the GitHub handle:

```bash
/plugin marketplace add <absolute-path-to-this-repo>
/plugin install nav@skills
/plugin install shape@skills
```

After editing any `SKILL.md`, run `/reload-plugins` — Claude Code re-reads the local path in place (no reinstall).

## Codex compatibility

Codex (OpenAI) uses the same Agent Skills format (`SKILL.md` = `name` + `description` frontmatter + body + optional `references/`), so the plugins above double as Codex skills. The Claude plugins under `plugins/` stay the **single source of truth**; a Codex-discoverable mirror is **generated** into `.agents/skills/` — one flat, unnamespaced skill per plugin skill (`nav:audit` → `nav-audit`, since Codex has no plugin namespace), with cross-references and bundled paths rewritten. Codex metadata is normalised during generation so descriptions are YAML-safe and within Codex's length limit. A repo-root [`AGENTS.md`](AGENTS.md) is synthesised from all plugin `CLAUDE.md` files.

```bash
node scripts/build-codex.mjs       # re-run after editing any SKILL.md
node scripts/build-manifests.mjs   # re-run after editing any plugin version/description/author
node scripts/validate-codex-skills.mjs
```

The validator checks both sides of the contract: Claude Code source skills under `plugins/` must have valid YAML frontmatter, and the Codex mirror under `.agents/skills/` must be regenerated, YAML-safe, and within Codex's metadata limit. It also gates **manifest drift** — each plugin's `.claude-plugin/plugin.json` is the single owner of its version/description/author, and the derived `.cursor-plugin/plugin.json` + `marketplace.json` versions (regenerated by `build-manifests.mjs`) must match. See the repo-root [`CLAUDE.md`](CLAUDE.md) for the full single-owner rule.

Enable the pre-commit hook once per clone so this runs automatically before every commit:

```bash
git config core.hooksPath scripts/hooks
```

Codex discovers `.agents/skills/` automatically when you open this repo (or copy a skill dir into your own project's `.agents/skills/`, or `~/.agents/skills/` for all projects). Invoke with `/skills` or a `$skill-name` mention; Codex also picks one implicitly when a task matches its `description`. The same mirror serves **opencode** and **Cursor**, which scan the identical project + global directories — one generated mirror, three consumers. Antigravity CLI (`agy`) reads the same directory in project-level mode — though for `agy` the [global plugin install](#antigravity-cli-agy) above is preferred, since it keeps the plugin namespace. **Don't hand-edit `.agents/skills/` or `AGENTS.md`** — edit the plugin skill, regenerate, and validate.

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

Repo-wide rules for editing this marketplace (the hard gates, authoring conventions, maintenance steps) live once in the repo-root [`CLAUDE.md`](CLAUDE.md); plugin-specific conventions live in each plugin's own `CLAUDE.md` (e.g. [`plugins/nav/CLAUDE.md`](plugins/nav/CLAUDE.md)).

## License

MIT
