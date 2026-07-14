# skills

> Paul's personal agent-skills marketplace.
> A growing collection of focused, single-purpose plugins — one source tree, installable in **Claude Code**, **Antigravity CLI (`agy`)**, **Codex**, **opencode**, and **Cursor**.

## Which verb do I want?

A quick lookup for the highest-frequency intents — full plugin tables and per-skill detail follow below.

| I want to… | Run |
|---|---|
| Audit my codebase's architecture / find smells | `/nav:audit` |
| Plan a spec or feature against the actual code | `/nav:plan` |
| Make a small, already-decided change | `/nav:do` |
| Mock up / compare a few options visually（想看選項長什麼樣） | `/shape:mockup` |
| Think a decision through — I haven't decided yet | `/shape:elicit` |
| Align on what to work on next | `/shape:align` |
| Catch me up on where this session left off（接手現況） | `/reflect:catchup` |
| Park a cursor before stepping away（收工留單） | `/reflect:park` |
| Dissect / break down a paper's argument | `/research:dissect` |
| Audit my own document's citations | `/research:provenance` |
| Report progress to a counterpart over relay | `/relay:report` |

## What's in here

| Plugin | What it covers |
|---|---|
| [`nav`](plugins/nav/) | **Keep code healthy** — audit shape, refactor with discipline, sync file-top headers, render the bilingual codebase map, ground a spec into a plan, compose docs as deep modules. Built on Ousterhout's deep-module principles. |
| [`shape`](plugins/shape/) | **Push work forward** — converge a decision (a grounded grill, or a rendered interactive artifact), record it in a legible `blueprints/` board, keep it current, and build it into running, verified code. The forward-motion half to `nav`'s maintenance half. |
| [`research`](plugins/research/) | **Read with intent** — dissect any argument-carrying document (paper, blog post, competitor analysis, RFC) into its structural skeleton, untangle how a set of sources relate, critique a paper adversarially into a referee report, or audit your own documents' citation provenance (trace every load-bearing claim back to a verified source). Locates where your own claim sits relative to prior art. |
| [`frame`](plugins/frame/) | **Apply an explicit frame** — to a problem (for your own understanding) or to an answer you already have (for the user's). Four reasoning lenses: `first-principles` (decompose down — strip to axioms, rebuild, surface divergence), `orthogonal` (decompose sideways — factor a tangle into mutually-independent axes), `dialectic` (put a claim on trial — steelman both sides, name the experiment that would decide it), `graft` (borrow a mature model's structure and adapt it to your domain — map every primitive; the adapt list is the payload); plus `analogize` (build a stress-tested analogy so an already-settled concept lands in plain language). Lenses feed `shape`; `analogize` doesn't. Renamed from `think`. |
| [`reflect`](plugins/reflect/) | **Reflect on your session** — the one reflexive, cross-cutting family: `catchup` (where the work stands now + next, rebuilt from git/diff/plan, not chat memory), `park` (write that same cursor + a git SHA into `HANDOFF.md` before stepping away — catchup's write-side mirror), `observe` (distill the one durable learning into a knowledge base). Cross-cutting; independent. |
| [`relay`](plugins/relay/) | **Coordinate with a counterpart** — async, through your agents, over a shared git repo: `launch` sets up the project + people (create a project, or add a person / assign a role); `report`/`review` exchange standup-shaped updates that converge decisions to explicit consensus; `digest` shows the live "what needs you"; `settle` keeps it tidy; `format` keeps the frontmatter conformant. Structured updates, not chat. Independent. |

`nav` and `shape` split the code lifecycle: **shape** pushes work forward (converge → plan → build), **nav** keeps the result healthy (audit → refactor → map). **research** (read the external world), **frame** (apply a frame to a problem or to an answer), **reflect** (turn attention back on your own working session — the reflexive, cross-cutting family), and **relay** (coordinate asynchronously with a counterpart over a shared repo) are independent toolkits that feed the work without depending on it. shape depends on nav one-way (`shape → nav`); each plugin installs and runs alone.

More plugins land here over time. Each lives in its own folder under `plugins/`, gets its own `plugin.json`, and registers via the marketplace's `marketplace.json`.

## Invocation

Once installed (see below), each plugin's skills appear as `/<plugin>:<skill>`.

Skills come in two invocation categories ([ADR-072](docs/adr/072-invocation-direction-law-inventory.md)): **model-invoked** — the agent fires them off your phrasing — and **user-invoked** — summoned only by typing the command, never auto-fired. Each plugin's list below buckets them.

**`nav` — keep code healthy:**

- `/nav:audit` — assess codebase shape (or read-only quick-check against a target spec)
- `/nav:sync` — sync file-top headers to the code (per-file navigability; continuous, per-change), gated diff
- `/nav:map` — render/refresh the bilingual codebase map `docs/codebase-map/index.html` (per-repo navigability; periodic, reads `sync`'s headers)
- `/nav:plan` — ground a spec against the code, clarify ambiguity, write a plan artifact (lands in `blueprints/plans/` when present)
- `/nav:do` — execute a small, decided, behaviour-*changing* change directly (deep-module/header discipline inline, no plan artifact) — the execution verb, refactor's behaviour-changing twin
- `/nav:compose` — author or restructure a prose document as a deep module (lead with the point, one fact one owner, group by concern, head-able top), gated diff — `sync`'s prose-document sibling

*User-invoked:*

- `/nav:refactor` — execute a structural refactor with verbatim-move + test-gate discipline

**`shape` — push work forward** (skills grouped by verb around a `blueprints/` convention):

- `/shape:elicit` — converge a conceptual decision by a grounded grill — or root-cause a logic flaw (diagnostic mode)
- `/shape:survey` — map a decision space into independent axes grounded in the real repo, then report the diff versus what you already know (before deciding in unfamiliar terrain; not a repo map, not external research)
- `/shape:mockup` — converge a look / structure decision by a real, disposable, interactive artifact
- `/shape:probe` — design and run a minimal experiment (A/B, blind judgment test, or behavior probe) when a fork can't be settled by argument — the deciding experiment `/frame:dialectic` names, actually run; verdict feeds back to elicit or the user
- `/shape:dogfood` — dogfood a built feature that feels unsmooth — drive the real interface (browser / `curl` / CLI) against user intents, report the friction + the coverage gaps that fall out
- `/shape:position` — author the canon layer: a gated multi-feeding campaign that lands core (principle-wise) docs — delta-report gating, altitude instrument, graduation-grown `core/`; mirror of `/shape:reconcile`
- `/shape:align` — decide now/next/later *with you* → a `blueprints/` status board (`plan.md` + bilingual `overview.html`)
- `/shape:reconcile` — keep the blueprints honest — amend stale facts, prune/consolidate stale `thoughts/` + `plans/`

*User-invoked:*

- `/shape:setup` — scaffold a new project to a *verified* running baseline: archetype-driven (accumulating `references/archetypes/`), consistent with your standing stack principles, done only when the verification chain is green
- `/shape:build` — drive the plan's In-progress column to done, autonomously but confidence-gated (stop below 90%)

**`research` — read with intent:**

- `/research:dissect` — dissect any argument-carrying document into Gap / Claim / Mechanism / Evidence / Conclusion; optional "Implications for your claim" section; output saved to `notes/`
- `/research:untangle` — untangle how N sources relate (lineage / clusters / contradictions / contested ground), with optional claim-framed positioning
- `/research:critique` — adversarially assess one paper into a referee report (claim↔evidence audit + self-attack)
- `/research:provenance` — audit your own documents' citations: trace every load-bearing number / quote / claim back to a verified source, classify first-hand / second-hand / orphan, emit a quarantine list; repairs via `dissect`'s forensic mode

**`frame` — apply an explicit frame, to a problem or to an answer:**

- `/frame:first-principles` — strip a question to its irreducible axioms, rebuild the answer from them, surface where that diverges from convention; analysis stays in-chat (route to `shape` to persist)
- `/frame:orthogonal` — factor a tangled phenomenon into mutually-independent (orthogonal) axes; verify the independence (move one, the others stay put) and name what was conflated; in-chat
- `/frame:dialectic` — put a claim on trial: steelman its strongest case AND its strongest attack, surface the deepest load-bearing assumption, name the experiment that would decide it (verdict is three-way — refuted / unsettled-owned-bet / supported); in-chat
- `/frame:graft` — design a novel system that rhymes with a mature one by grafting it: map every primitive of a donor model onto your problem, read each as fit / break / adapt; the adapt list (borrowed structure reshaped for your domain) is the payload, not the fits. The disciplined middle between `first-principles` (invent) and lazy analogy (copy); in-chat
- `/frame:analogize` — build a deliberately stress-tested analogy for a concept you already understand: generate multiple candidates, check the mapping against the real structure, pick on fit, name where the winner breaks; delivers to the user rather than deriving for the agent, so it doesn't feed `shape`; in-chat

**`reflect` — reflect on your session** (the reflexive, cross-cutting family; cross-project — *all three are user-invoked*):

- `/reflect:catchup` — re-orient on where the work stands now + next, rebuilt from git/diff/plan (not chat memory); fixed shape goal · done · now · open · next
- `/reflect:park` — write that same five-shape cursor + the current git SHA into the project's `HANDOFF.md` before stepping away, overwriting any prior one (catchup's write-side mirror)
- `/reflect:observe` — surface this session's candidate learnings, you pick which to keep (zero/one/several); writes own-learning to a local KB (`docs/observations/`, `$SKILLS_REPO` when set), and routes a downstream user's skill-feedback to an opt-in, scrubbed upstream PR (`docs/feedback/` inbox) instead of a local note that goes nowhere

**`relay` — coordinate with a counterpart** (async, over a shared git repo; standalone):

- `/relay:launch` — create a project (scaffold its space + frame; bootstraps the repo on first run), or add a person (name · git · github · title) + assign a per-project role
- `/relay:report` — write a thought (progress or alignment; subject + body, `@`-route what needs the counterpart)
- `/relay:review` — respond to a thought — agree / comment / change (your review resolves it; no @-set protocol)
- `/relay:digest` — the live "what's waiting for my review" (read-only; the awareness entry)
- `/relay:settle` — append agreed decisions to the ledger (`decisions/log.md`) + regenerate `active.md`; thoughts never move
- `/relay:format` — sweep one project's thoughts to the current frontmatter spec (lint + fix, gated) — the `/nav:sync` of relay

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
/plugin install frame@skills
/plugin install reflect@skills
/plugin install relay@skills
```

That's it — the `/nav:*`, `/shape:*`, `/research:*`, `/frame:*`, `/reflect:*`, and `/relay:*` skills become available. (Install only `nav` if you just want the maintenance half; `shape` depends on `nav`, so install both to use the forward-motion half. `research`, `frame`, `reflect`, and `relay` are independent — install alone or with the others.)

### Antigravity CLI (`agy`)

Antigravity CLI natively imports Claude Code plugins — same `SKILL.md` format, same `/<plugin>:<skill>` namespace, **no conversion needed**. Two ways to wire this repo up:

**Global install (recommended).** Clone the repo, then import each plugin directory:

```bash
git clone https://github.com/ChenPaulYu/skills.git && cd skills
agy plugin install plugins/nav
agy plugin install plugins/shape
agy plugin install plugins/research
agy plugin install plugins/frame
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

Add `-g` for a global (user-level) install; omit it to install into the current project. The picker shows 64 entries — the same 32 skills twice (flat mirror `nav-audit` + plugin source `audit`): **pick the prefixed set**; the unprefixed names (`plan`, `build`, `do`, …) are generic and collision-prone.

### Local development (Paul only)

For iterating on this marketplace itself, use a local path instead of the GitHub handle:

```bash
/plugin marketplace add <absolute-path-to-this-repo>
/plugin install nav@skills
/plugin install shape@skills
```

After editing any `SKILL.md`, run `/reload-plugins` — Claude Code re-reads the local path in place (no reinstall).

## Codex compatibility

Codex (OpenAI) uses the same Agent Skills format (`SKILL.md` = `name` + `description` frontmatter + body + optional `references/`), so the plugins above double as Codex skills. The Claude plugins under `plugins/` stay the **single source of truth**; a Codex-discoverable mirror is **generated** into `.agents/skills/` — one flat, unnamespaced skill per plugin skill (`nav:audit` → `nav-audit`, since Codex has no plugin namespace), with cross-references and bundled paths rewritten. Codex gets a separate, short, trigger-first metadata projection from `platforms/codex/descriptions.json`; Claude descriptions remain unchanged. A repo-root [`AGENTS.md`](AGENTS.md) is synthesised from all plugin `CLAUDE.md` files. The full translation contract is in [`docs/codex-compatibility.md`](docs/codex-compatibility.md).

```bash
node scripts/build-codex.mjs       # re-run after editing any SKILL.md
node scripts/build-manifests.mjs   # re-run after editing any plugin version/description/author
node scripts/validate-codex-skills.mjs
node scripts/validate-codex-skills.mjs --metadata-audit
```

The validator checks both sides of the contract: Claude Code source skills under `plugins/` must have valid YAML frontmatter, and the Codex mirror under `.agents/skills/` must be regenerated and YAML-safe. It also gates Codex sidecar coverage, the per-skill/total metadata budget, install-profile references, and **manifest drift**. See the repo-root [`CLAUDE.md`](CLAUDE.md) for the full single-owner rule.

Enable the pre-commit hook once per clone so this runs automatically before every commit:

```bash
git config core.hooksPath scripts/hooks
```

Codex discovers `.agents/skills/` automatically when you open this repo (or copy a skill dir into your own project's `.agents/skills/`, or `~/.agents/skills/` for all projects). Invoke with `/skills` or a `$skill-name` mention; Codex also picks one implicitly when a task matches its `description`. The same mirror serves **opencode** and **Cursor**, which scan the identical project + global directories — one generated mirror, three consumers. Antigravity CLI (`agy`) reads the same directory in project-level mode — though for `agy` the [global plugin install](#antigravity-cli-agy) above is preferred, since it keeps the plugin namespace. **Don't hand-edit `.agents/skills/` or `AGENTS.md`** — edit the plugin skill, regenerate, and validate.

Keep only one active copy of each Codex skill. For a global install, sync a focused profile instead of the full roster; `--dedupe-global-roots` removes only older copies carrying this repository's generated banner:

```bash
node scripts/build-codex.mjs --sync-global --profile build --dedupe-global-roots
```

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
