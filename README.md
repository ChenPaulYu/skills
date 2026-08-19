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
| Study an unfamiliar repository into a mental model（帶我理解陌生 repo） | `/fathom:guide` |
| Compile a study into its artifacts（把讀過的 repo 編成儀表板與地圖） | `/fathom:compile` |
| Take or pass the session cursor before/after stepping away（交接記事本） | `/shape:baton` |
| Report progress to a counterpart over relay | `/relay:report` |

## What's in here

| Plugin | What it covers |
|---|---|
| [`nav`](plugins/nav/) | **Keep code healthy** — audit shape, refactor with discipline, sync file-top headers and the bilingual codebase map (two cadences, one door), ground a spec into a plan, compose docs as deep modules. Built on Ousterhout's deep-module principles. |
| [`fathom`](plugins/fathom/) | **Study an unfamiliar repository** — five verbs over one shared study state: `index` (anchor the pin, land a file:line index, deliver a measured trust verdict), `guide` (the teaching climb Repository → Runtime → System → Behavior → Code — calibrate, teach with knowledge-matched forms, dwell, gate on the learner's own narration), `quiz` (spaced retention checking), `dive` (follow one topic as deep as they want, advancing nothing), `atlas` (compile the study into a guided multi-scale code map). Files, not call order, connect them — so the flow is free. |
| [`shape`](plugins/shape/) | **Push work forward** — converge a decision (a grounded grill, a rendered interactive artifact, or a minimal experiment), record it as a dated `thoughts/` doc that is born durable, keep the `blueprints/` board honest against the code, and hand the ephemeral session cursor (`baton`) between sessions. Seven verbs; the build itself is handed to `nav`. |
| [`frame`](plugins/frame/) | **Apply an explicit frame** — to a problem (for your own understanding) or to an answer you already have (for the user's). Four reasoning-and-delivery verbs. Three lenses: `first-principles` (decompose down — strip to axioms, rebuild, surface divergence), `orthogonal` (decompose sideways — factor a tangle into mutually-independent axes), `dialectic` (put a claim on trial — steelman both sides, name the experiment that would decide it); plus two that face the audience: `analogize` (a stress-tested analogy) and `draw` (render it, form chosen by the kind of knowledge — the grammar `fathom` borrows). Lenses feed `shape`; the outward pair doesn't. Renamed from `think`. |
| [`relay`](plugins/relay/) | **Coordinate with a counterpart through GitHub, following the Accord memory model** — `report` routes independent follow-ups into linked Issues; `digest` separates obligations from native lifecycle findings and stage age; `reply` hands off the current baton without moving settlement authority; `settle` closes the object and commits exact settled memory directly. GitHub owns state; Relay owns semantics and verification. Independent. |

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

- `/fathom:index` — index a repo you don’t know: anchor the pin (plus its distance from the latest release), judge how deep the ladder needs to be, land a growing `index.md` `file:line` anchor index, and deliver a measured **trust verdict** (maintenance, test investment, doc staleness, churn) closing with a read-it-like-this instruction; grounds, never teaches
- `/fathom:guide` — climb the five gated levels (Repository → Runtime → System → Behavior → Code): calibrate on the learner's background (gloss list · contrast anchor · chapter compression), teach with knowledge-matched forms (guided interactive mockup at Repository; terminal-first mid-ladder), dwell for their questions, gate on their own narration, and keep a cursor + learner model on disk so the climb resumes across sessions
- `/fathom:quiz` — check what actually stuck: read `understanding.md`, probe what is most likely to have decayed (corrected entries first), ask for narration rather than recall, and write back what the answers revealed; advances no level
- `/fathom:dive` — follow one topic as deep as the learner wants, answered against pinned `file:line` evidence, without moving the ladder; residue lands in `index.md` + `understanding.md` and the breadcrumb restores position
- `/fathom:compile` — turn the study into its artifacts: horizon (repo-level dashboard), tides (system/state board), atlas (behavior/code map) — each a semantic fixture rendered by a fixture-driven shell; the gate decides what may exist, and a re-compile enriches as the study deepens; needs an existing study, does not teach

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
- `/frame:draw` — render something you already understand so it lands for someone else, with the form chosen by the KIND of knowledge (ownership → spatial map · process → playback · state over time → stepper · delta from what they know → claim expansion · taxonomy → grouped map · structure → weighted graph · lifecycle → canonical-run diagram); terminal-first, escalating to an interactive artifact only when interaction changes visible state. Owns the form grammar that `/fathom:guide` borrows. Distinct from `/shape:mockup`, which renders candidates so a decision can be PICKED — here the artifact IS the explanation

**`relay` — coordinate with a counterpart through GitHub, following the Accord memory model** (four daily model-invoked skills; standalone; `report`/`reply`/`settle` show outbound object text verbatim and ask "Is this what you mean?" before posting, ADR-095/100/120):

- `/relay:report` — resolve the workspace and a verified recipient before author sign-off; route Issue-default, and fork any independently completable follow-up into a linked child Issue while stating whether the parent may settle independently; exact-diff review remains an optional PR path
- `/relay:digest` — show real GitHub obligations separately from native lifecycle findings: conflicting stages, staged work without an assignee, multiple staged owners, unknown stage age, and policy-driven overdue stages; stage age comes from native label/assignment events, never prose or `updatedAt`; read-only and deterministic
- `/relay:reply` — answer or clarify in place, hand off ordinary/`needs-input` work with a native label-and-assignment transition, or route an independent follow-up to `report`; settlement authority stays stable, and protected acceptance/recording stages cannot be escaped by a generic handoff
- `/relay:settle` — verify settlement authority, apply the settlement block, close an Issue/Discussion, or merge/abandon a PR; a promoted Decision/Brief/Core delta whose exact wording is already settled is committed and pushed directly with remote read-back, while unsettled wording may use a PR

## Install

One source tree, three channels, five agents. `plugins/` is the single source of truth everywhere:

| Agent | Reads | Skill names |
|---|---|---|
| **Claude Code** | `plugins/` natively | `/nav:audit` |
| **Antigravity (`agy`)** | `plugins/` via `agy plugin install` (preferred); or project `.agents/skills/` | `/nav:audit` · or flat `nav-audit` |
| **Codex** · **opencode** | generated `.agents/skills/` | `nav-audit` |
| **Cursor** | generated `platforms/cursor/<plugin>/` (ADR-118 — **not** the Codex mirror) | `nav-audit` inside each plugin |

After any skill edit, regenerate **all** derived surfaces, then validate:

```bash
node scripts/build-manifests.mjs && node scripts/build-codex.mjs && node scripts/build-cursor.mjs
node scripts/validate-codex-skills.mjs
```

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
agy plugin install plugins/fathom
agy plugin install plugins/shape
agy plugin install plugins/frame
agy plugin install plugins/relay
```

Verify with `agy plugin list` — each plugin shows up with source `claude-code`, and its skills are available in every project under the usual namespaced names (`/nav:audit`, `/fathom:compile`, `/shape:mockup`, …).

AGY-only automation (hooks, MCP) stays in `~/.gemini/config/` on the machine — never commit it here, so Claude / Codex / Cursor stay untouched.

**Project-level auto-detection.** `agy` also reads `.agents/skills/` in the project you open it from — the same flat, generated mirror Codex uses (see [Codex compatibility](#codex-compatibility) below). Inside this repo that mirror is already committed, so opening `agy` here loads all skills under their flat names (`nav-audit`, `shape-mockup`, …) with no install step. To reuse them in another project, copy the skill dirs you want into that project's `.agents/skills/`.

Prefer the global install: it keeps the namespace, tracks the plugin source, and doesn't depend on the generated mirror.

### Codex · opencode (flat mirror)

Both auto-discover `.agents/skills/` — so **inside a clone of this repo there is nothing to install**; the committed mirror loads automatically. For **global use alongside Cursor**, install Codex into its own root so flat names do not collide:

```bash
git clone https://github.com/ChenPaulYu/skills.git && cd skills
node scripts/build-codex.mjs --sync-global --profile build --global-root codex
```

That installs the `build` profile's compiled flat skills into `~/.codex/skills/`, runtime artifacts into `~/.codex/`, and prunes this marketplace from `~/.agents/skills/`. Default `--global-root agents` still targets `~/.agents/skills/` when Cursor is not in play. Use another named profile when needed; reserve `all` for a machine that truly needs every skill globally. Skills surface under flat names (`nav-audit`, `shape-mockup`, …). Verify: Codex — `/skills`; opencode — `opencode debug skill`.

### Cursor (native plugins)

Cursor is not a Codex consumer. A generated Cursor Plugin tree lives under `platforms/cursor/<plugin>/` (flattened skill names — `nav-audit` — because Cursor does not namespace plugin skills). Install:

```bash
git clone https://github.com/ChenPaulYu/skills.git && cd skills
node scripts/build-cursor.mjs --sync-local
```

That symlinks the generated plugins into `~/.cursor/plugins/local/`. Reload Cursor (**Developer: Reload Window**), then type `/` in Agent chat and search `nav-audit`. Do **not** symlink `plugins/nav` — that directory is the Claude source (bare names collide; Claude-host tool names leak). Full translation contract: [Cursor compatibility](docs/cursor-compatibility.md).

**Dual-global:** Codex `--global-root codex` + Cursor `--sync-local`, then turn **OFF** Cursor’s “Include third-party Plugins, Skills, and other configs” so Cursor does not also scan `~/.codex/skills`. See [Cursor compatibility](docs/cursor-compatibility.md).

Cursor's public `/add-plugin` marketplace is a separate, review-gated publishing channel — not this repo's release path. The generated `.cursor-plugin/marketplace.json` is for a Team Marketplace import of this GitHub repo.

### npx (skills.sh CLI)

The [skills.sh](https://skills.sh/) CLI wraps the same clone-and-copy in an npm-like UX, and tracks installs in a `skills-lock.json` so `npx skills update` can refresh them later:

```bash
# Interactive — pick skills and target agents from a list:
npx skills add ChenPaulYu/skills

# Non-interactive — values are space-separated; '*' selects all:
npx skills add ChenPaulYu/skills -s nav-audit shape-elicit -a cursor opencode -y
```

Add `-g` for a global (user-level) install; omit it to install into the current project. The picker shows each skill twice (flat mirror `nav-audit` + plugin source `audit`): **pick the prefixed set**; the unprefixed names (`plan`, `align`, `do`, …) are generic and collision-prone.

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
node scripts/build-cursor.mjs      # re-run after editing any SKILL.md (Cursor plugins)
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

Codex discovers `.agents/skills/` automatically when you open this repo (or copy a skill dir into your own project's `.agents/skills/`, or `~/.agents/skills/` for all projects). Invoke with `/skills` or a `$skill-name` mention; Codex also picks one implicitly when a task matches its `description`. The same mirror serves **opencode**, which scans the identical project + global directories. **Cursor is a separate channel** — native Cursor Plugins generated by `scripts/build-cursor.mjs`, not this Codex lowering (see [Cursor compatibility](#cursor-compatibility)). Antigravity CLI (`agy`) reads `.agents/skills/` in project-level mode — though for `agy` the [global plugin install](#antigravity-cli-agy) above is preferred, since it keeps the plugin namespace. **Don't hand-edit `.agents/skills/` or `AGENTS.md`** — edit the plugin skill, regenerate, and validate.

Keep only one active copy of each Codex skill. For dual-global with Cursor, use `--global-root codex`; otherwise `--global-root agents` (default). The install always prunes this marketplace from the other global root:

```bash
node scripts/build-codex.mjs --sync-global --profile build --global-root codex
```

Hook-driven updates preserve the profile recorded by the last install instead of widening it back to
`all`. On a fresh machine they start at `minimal`; switch the persistent selection with
`sh scripts/sync-installed.sh --codex-profile <name>`.

## Cursor compatibility

Cursor loads **Cursor Plugins**, not the Codex `.agents/skills/` lowering. `plugins/` stays the source of truth; `scripts/build-cursor.mjs` emits installable plugins under `platforms/cursor/<plugin>/` with flattened skill names (`nav-audit`) and Cursor-native tool names (`AskQuestion`, `Task`). The adapter has its own release line in `platforms/cursor/manifest.json`. Full translation/install contract: [`docs/cursor-compatibility.md`](docs/cursor-compatibility.md).

```bash
node scripts/build-cursor.mjs --sync-local
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
