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
| See where we are, compact drift, decide what's next（重新整理） | `/shape:align` |
| Study an unfamiliar repository into a mental model（帶我理解陌生 repo） | `/fathom:repo` |
| Take or pass the session cursor before/after stepping away（交接記事本） | `/shape:baton` |
| Report progress to a counterpart over relay | `/relay:report` |

## What's in here

| Plugin | What it covers |
|---|---|
| [`nav`](plugins/nav/) | **Keep code healthy** — audit shape, refactor with discipline, sync file-top headers and the bilingual codebase map (two cadences, one door), ground a spec into a plan, compose docs as deep modules. Built on Ousterhout's deep-module principles. |
| [`fathom`](plugins/fathom/) | **Study an unfamiliar repository** — one skill (`repo`) climbs a five-level comprehension ladder (Repository → Runtime → System → Behavior → Code): a growing `soundings.md` anchor index, a calibration probe on the learner's background, knowledge-matched visual forms (guided interactive mockup at Repository; playback / diff / tree / weighted graph per knowledge kind), dwell rounds, verbalization gates, and a persistent study cursor that resumes across sessions. The learner's predictive mental model is the deliverable. |
| [`shape`](plugins/shape/) | **Push work forward** — converge a decision (a grounded grill, a rendered interactive artifact, or a minimal experiment), record it as a dated `thoughts/` doc that is born durable, keep the `blueprints/` board honest against the code, and hand the ephemeral session cursor (`baton`) between sessions. Seven verbs; the build itself is handed to `nav`. |
| [`frame`](plugins/frame/) | **Apply an explicit frame** — to a problem (for your own understanding) or to an answer you already have (for the user's). Three reasoning lenses: `first-principles` (decompose down — strip to axioms, rebuild, surface divergence), `orthogonal` (decompose sideways — factor a tangle into mutually-independent axes), `dialectic` (put a claim on trial — steelman both sides, name the experiment that would decide it); plus `analogize` (build a stress-tested analogy so an already-settled concept lands in plain language). Lenses feed `shape`; `analogize` doesn't. Renamed from `think`. |
| [`relay`](plugins/relay/) | **Coordinate with a counterpart through GitHub, following the Accord memory model** — `launch` verifies and remembers the default workspace, audits repository readiness, and initializes its PR-attested identity roster; `report` resolves destination and recipient before routing intent Issue-default into Discussions, Issues, or pull requests; `digest` shows real obligations; `reply` records native responses; `brief` preserves cited understanding; `settle` closes with authority. GitHub owns state; Relay owns semantics and verification. Independent. |

`nav` and `shape` split the code lifecycle: **shape** pushes work forward (converge → plan → build), **nav** keeps the result healthy (audit → refactor → sync). **fathom** (study a repository you don't yet hold a model of — a persistent, cross-session learning campaign), **frame** (apply a frame to a problem or to an answer), and **relay** (coordinate asynchronously with a counterpart over a shared repo) are independent toolkits that feed the work without depending on it. shape depends on nav one-way (`shape → nav`); each plugin installs and runs alone.

More plugins land here over time. Each lives in its own folder under `plugins/`, gets its own `plugin.json`, and registers via the marketplace's `marketplace.json`.

## Invocation

Once installed (see below), each plugin's skills appear as `/<plugin>:<skill>`.

Skills come in two invocation categories ([ADR-072](docs/adr/072-invocation-direction-law-inventory.md)): **model-invoked** — the agent fires them off your phrasing — and **user-invoked** — summoned only by typing the command, never auto-fired. Each plugin's list below buckets them.

**`nav` — keep code healthy:**

- `/nav:audit` — assess codebase shape (or read-only quick-check against a target spec)
- `/nav:refactor` — execute a structural refactor with verbatim-move + test-gate discipline
- `/nav:sync` — keep a codebase navigable at both scales: sync file-top headers to the code (per-file navigability; continuous, per-change, gated diff) or render/refresh the bilingual codebase map `docs/codebase-map/index.html` (per-repo navigability; periodic, reads the maintained headers) — two cadences, one door (ADR-108)
- `/nav:plan` — ground a spec against the code, clarify ambiguity, write a plan artifact (lands in `blueprints/plans/` when present)
- `/nav:do` — execute a small, decided, behaviour-*changing* change directly (deep-module/header discipline inline, no plan artifact; closes the tracking `blueprints/plan.md` item in the same change, ADR-086) — the execution verb, refactor's behaviour-changing twin
- `/nav:compose` — author or restructure a prose document as a deep module (lead with the point, one fact one owner, group by concern, head-able top), gated diff — `sync`'s prose-document sibling

**`fathom` — study an unfamiliar repository:**

- `/fathom:repo` — climb a repository you don't know through five gated levels (Repository → Runtime → System → Behavior → Code): anchor the commit (plus its distance from the latest release), judge which levels collapse, land a growing `soundings.md` anchor index, deliver a measured **trust verdict** (how much to believe what you read here — maintenance, test investment, doc staleness, churn — closing with a read-it-like-this instruction), calibrate on the learner's background (gloss list · contrast anchor · chapter compression), teach with knowledge-matched forms (guided interactive mockup at Repository; terminal-first mid-ladder), dwell for the learner's questions, gate by verbalization, and keep a study cursor on disk so the climb resumes across sessions

**`shape` — push work forward** (skills grouped by verb around a `blueprints/` convention):

- `/shape:elicit` — converge a conceptual decision by a grounded grill — or root-cause a logic flaw (diagnostic mode)
- `/shape:mockup` — converge a look / structure decision by a real, disposable, interactive artifact
- `/shape:probe` — design and run a minimal experiment (A/B, blind judgment test, or behavior probe) when a fork can't be settled by argument — the deciding experiment `/frame:dialectic` names, actually run; verdict feeds back to elicit or the user
- `/shape:dogfood` — dogfood a built feature that feels unsmooth — drive the real interface (browser / `curl` / CLI) against user intents, report the friction + the coverage gaps that fall out
- `/shape:align` — one pass, on compaction pressure: verify every carried item against the code, compact what drifted (amend stale facts, prune/consolidate stale `thoughts/` + `plans/`), then decide now/next/later *with you* → the single maintained `blueprints/plan.md` status board (no silent drops — ADR-086; a visual view renders on demand via `/shape:mockup`)

*User-invoked:*

- `/shape:baton` — take or pass the session baton — one overwritten cursor holding goal · done · now · open · next; take it on arrival, pass it before stepping away; lives at `blueprints/baton.md` (no-tree fallback: root `HANDOFF.md`)
- `/shape:migrate` — bring a blueprints/core tree to the current convention version — verbatim, gated, reference-safe structural transforms from an append-only migration ledger (ADR-105)

**`frame` — apply an explicit frame, to a problem or to an answer:**

- `/frame:first-principles` — strip a question to its irreducible axioms, rebuild the answer from them, surface where that diverges from convention; analysis stays in-chat (route to `shape` to persist)
- `/frame:orthogonal` — factor a tangled phenomenon into mutually-independent (orthogonal) axes; verify the independence (move one, the others stay put) and name what was conflated; in-chat
- `/frame:dialectic` — put a claim on trial: steelman its strongest case AND its strongest attack, surface the deepest load-bearing assumption, name the experiment that would decide it (verdict is three-way — refuted / unsettled-owned-bet / supported); in-chat
- `/frame:analogize` — build a deliberately stress-tested analogy for a concept you already understand: generate multiple candidates, check the mapping against the real structure, pick on fit, name where the winner breaks; delivers to the user rather than deriving for the agent, so it doesn't feed `shape`; in-chat

**`relay` — coordinate with a counterpart through GitHub, following the Accord memory model** (six daily model-invoked skills; standalone; `report`/`reply`/`settle`/`brief` show any outbound object text verbatim and ask "Is this what you mean?" before posting, ADR-095; ADR-100):

- `/relay:launch` — resolve and audit the intended Relay workspace; optionally save its verified `OWNER/REPO` to `~/.config/relay/repo`; configure Discussions, permissions, CODEOWNERS, merge protection, labels, `decisions/`, and entry-point templates; initialize or update `relay.yml` only through a previewed PR with a named counterpart reviewer
- `/relay:report` — resolve the workspace (`explicit → RELAY_REPO → local default → proven Relay cwd → ask`) and a verified recipient (explicit GitHub account or one unambiguous `relay.yml` row) before author sign-off; then route Issue-default: receipted tell → assigned Issue, exact-diff review → PR, other review/owned question → Issue, genuinely open topic → Discussion, crisp memory change → PR; never guess destination or username
- `/relay:digest` — show real GitHub obligations: Issue obligations derived from native stage labels (`needs-input`→provide-requested-input, `awaiting-acceptance`→accept-or-dispose, `awaiting-record`→record-decision, none→the unchanged default act; conflicting labels flagged malformed), native Q&A obligations, current-revision review rounds, author action after Request changes, a request-reviewer obligation for your own unreviewed non-draft PR, authorized PR merge, and lifecycle blockers — plus a separate, non-binding notices tier (now the default landing spot for almost every plain mention); an open non-draft PR is never obligation-free; read-only
- `/relay:reply` — leave the native response on an existing object: deliver requested input via the native baton flip (`needs-input`⇄`awaiting-acceptance`, label swap plus reassignment to the acceptor), comment, PR Comment, Approve, or Request changes; records a response without pretending it proves review, work, or consent
- `/relay:brief` — create, update, or retire one Brief that integrates only *active* Decision files, citing `[D-0xx]` and never restating their wording, when understanding from GitHub must stay current across contexts; always a pull request; never consensus or Core
- `/relay:settle` — apply the settlement block (Resolution / Reason / Decision required / Recorder / Follow-ups), close a Discussion or Issue, or merge an approved current-revision PR / close an explicitly abandoned PR with a reason; when a closure promotes to a Decision, carries the native promotion signal chain (`awaiting-record` label + reassign to recorder) through to a recorded, linked-back Decision file under five direct-commit fuses; Core additionally requires verified enforcement

*User-invoked:*

- `/relay:migrate` — inventory a repository's pre-model coordination state (file-based ledgers, overloaded ACK-style Discussions, commit-only decisions, ad-hoc rosters) and migrate it into the memory model while preserving immutable provenance; completion requires the migration's changes to merge and every destination to read back

## Install

One source tree, two channels, five agents: **Claude Code** and **Antigravity CLI (`agy`)** import the plugins natively (namespace preserved — `/nav:audit`); **Codex**, **opencode**, and **Cursor** auto-discover the generated flat mirror `.agents/skills/` (flat names — `nav-audit`; see [Codex compatibility](#codex-compatibility)). The plugins under `plugins/` are the single source of truth everywhere.

Shortcut for any harness — tell your agent:

> Fetch and follow instructions from `https://raw.githubusercontent.com/ChenPaulYu/skills/main/INSTALL.md`

Or by hand. In Claude Code:

```bash
/plugin marketplace add ChenPaulYu/skills
/plugin install nav@skills
/plugin install fathom@skills
/plugin install shape@skills
/plugin install frame@skills
/plugin install relay@skills
```

That's it — the `/nav:*`, `/fathom:*`, `/shape:*`, `/frame:*`, and `/relay:*` skills become available. (Install only `nav` if you just want the maintenance half; `shape` depends on `nav`, so install both to use the forward-motion half. `fathom`, `frame`, and `relay` are independent — install alone or with the others.)

### Antigravity CLI (`agy`)

Antigravity CLI natively imports Claude Code plugins — same `SKILL.md` format, same `/<plugin>:<skill>` namespace, **no conversion needed**. Two ways to wire this repo up:

**Global install (recommended).** Clone the repo, then import each plugin directory:

```bash
git clone https://github.com/ChenPaulYu/skills.git && cd skills
agy plugin install plugins/nav
agy plugin install plugins/shape
agy plugin install plugins/frame
```

Verify with `agy plugin list` — each plugin shows up with source `claude-code`, and its skills are available in every project under the usual namespaced names (`/nav:audit`, `/shape:mockup`, …).

**Project-level auto-detection.** `agy` also reads `.agents/skills/` in the project you open it from — the same flat, generated mirror Codex uses (see [Codex compatibility](#codex-compatibility) below). Inside this repo that mirror is already committed, so opening `agy` here loads all skills under their flat names (`nav-audit`, `shape-mockup`, …) with no install step. To reuse them in another project, copy the skill dirs you want into that project's `.agents/skills/`.

Prefer the global install: it keeps the namespace, tracks the plugin source, and doesn't depend on the generated mirror.

### Codex · opencode · Cursor (flat mirror)

All three auto-discover `.agents/skills/` — so **inside a clone of this repo there is nothing to install**; the committed mirror loads automatically. For global use (all projects), run the supported adapter install:

```bash
git clone https://github.com/ChenPaulYu/skills.git && cd skills
node scripts/build-codex.mjs --sync-global --profile build --dedupe-global-roots
```

This installs compiled flat skills into `~/.agents/skills/`, the matching runtime artifacts those skills need into `~/.codex/`, and prunes only this generator's older duplicates from `~/.codex/skills/` when `--dedupe-global-roots` is set. Skills surface under flat names (`nav-audit`, `shape-mockup`, …). Verify per agent: Codex — `/skills`; opencode — `opencode debug skill`; Cursor — type `/` in Agent chat and search `nav-audit`. (Note: agy's global install above already materializes the same skills into `~/.agents/skills/`, so if you ran it, opencode and Cursor are covered.)

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

Add `-g` for a global (user-level) install; omit it to install into the current project. The picker shows 50 entries — the same 25 skills twice (flat mirror `nav-audit` + plugin source `audit`): **pick the prefixed set**; the unprefixed names (`plan`, `align`, `do`, …) are generic and collision-prone.

### Local development (Paul only)

For iterating on this marketplace itself, use a local path instead of the GitHub handle:

```bash
/plugin marketplace add <absolute-path-to-this-repo>
/plugin install nav@skills
/plugin install shape@skills
```

After editing any `SKILL.md`, run `/reload-plugins` — Claude Code re-reads the local path in place (no reinstall).

## Codex compatibility

Codex (OpenAI) uses the same Agent Skills format (`SKILL.md` = `name` + `description` frontmatter + body + optional `references/`), so the plugins above double as Codex skills. The Claude plugins under `plugins/` stay the **single source of truth**; a Codex-discoverable mirror is **generated** into `.agents/skills/` — one flat, unnamespaced skill per plugin skill (`nav:audit` → `nav-audit`, since Codex has no plugin namespace), with cross-references and bundled paths rewritten. Codex gets a separate, short, trigger-first metadata projection from `platforms/codex/descriptions.json`; Claude descriptions remain unchanged. A repo-root [`AGENTS.md`](AGENTS.md) is synthesised from all plugin `CLAUDE.md` files. The adapter now has its own release line in `platforms/codex/manifest.json` (`adapter_release` + `schema_version`, independent from Claude plugin versions). The full translation/install contract is in [`docs/codex-compatibility.md`](docs/codex-compatibility.md).

```bash
node scripts/build-codex.mjs       # re-run after editing any SKILL.md
node scripts/build-manifests.mjs   # re-run after editing any plugin version/description/author
node scripts/validate-codex-skills.mjs --release-smoke
node scripts/validate-codex-skills.mjs
node scripts/validate-codex-skills.mjs --metadata-audit
```

The validator checks both sides of the contract: Claude Code source skills under `plugins/` must have valid YAML frontmatter, and the Codex mirror under `.agents/skills/` must be regenerated and YAML-safe. It also gates Codex sidecar coverage, the per-skill/total metadata budget, install-profile references, and **manifest drift**. See the repo-root [`CLAUDE.md`](CLAUDE.md) for the full single-owner rule.

Enable the pre-commit hook once per clone so this runs automatically before every commit:

```bash
git config core.hooksPath scripts/hooks
```

Codex discovers `.agents/skills/` automatically when you open this repo (or copy a skill dir into your own project's `.agents/skills/`, or `~/.agents/skills/` for all projects). Invoke with `/skills` or a `$skill-name` mention; Codex also picks one implicitly when a task matches its `description`. The same mirror serves **opencode** and **Cursor**, which scan the identical project + global directories — one generated mirror, three consumers. Antigravity CLI (`agy`) reads the same directory in project-level mode — though for `agy` the [global plugin install](#antigravity-cli-agy) above is preferred, since it keeps the plugin namespace. **Don't hand-edit `.agents/skills/` or `AGENTS.md`** — edit the plugin skill, regenerate, and validate.

Keep only one active copy of each Codex skill. For a global install, sync a focused profile instead of the full roster; `--dedupe-global-roots` removes only older copies carrying this repository's generated banner, and the same install writes only the runtime artifacts the selected profile needs:

```bash
node scripts/build-codex.mjs --sync-global --profile build --dedupe-global-roots
```

## Philosophy (the through-line)

Deep modules — narrow interfaces over hidden complexity. Code you can navigate top-down, without reading every body to understand the surface. Refactors that move things around but never lie about what changed. Documentation grounded in code, never invented.

And the forward-motion counterpart (`shape`): **converge by a real, disposable instance — never a description.** Push a decision into a form you can point at (a grounded fork, a rendered artifact, a blueprints board), record it so it is born durable, and keep it honest against the code — then hand the build to `nav`.

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
