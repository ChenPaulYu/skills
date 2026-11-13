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
| Land finished work: commit, push, merge, clean up branches（收尾）| `/nav:ship` |
| Mock up / compare a few options visually（想看選項長什麼樣） | `/shape:mockup` |
| Think a decision through — I haven't decided yet | `/shape:elicit` |
| Verify the board and decide what comes next（排優先順序） | `/shape:status` |
| Clean stale thoughts, completed plans, and mockups（整理設計紀錄） | `/shape:tidy` |
| Update README and/or docs as one batch, or refresh source headers（同步說明） | `/nav:sync` |
| Recover current tasks and next actions（回來接續） | `/shape:status` |
| Save progress into original tasks（存回原工作） | `/shape:wrap` |

## What's in here

<!-- BEGIN GENERATED catalog-plugins -->
Catalog: 3 plugins · 21 skills.

| Plugin | Version | Skills | What it covers |
|---|---:|---:|---|
| [`nav`](plugins/nav/) | 0.26.0 | 7 | **Keep code healthy** — audit structure, refactor with discipline, sync source headers and reader documents against implementation, ground plans, execute small changes, ship finished work, and compose prose as deep modules. |
| [`shape`](plugins/shape/) | 0.34.0 | 8 | **Give work its form** — capture ideas, converge decisions, test claims, recover progress and save it into original task records. Status/wrap replace the old board/handoff entrances; graph exports derive from the same records (ADR-146). |
| [`frame`](plugins/frame/) | 0.17.1 | 6 | **The understanding family** — help someone understand something. Two lenses to see a problem: `first-principles` (decompose down — strip to axioms, rebuild, surface divergence) and `orthogonal` (decompose sideways — factor a tangle into mutually-independent axes). Three forms to present an answer you already have: `analogize` (a checked analogy; also the ELI5 door), `draw` (the picture and its medium), `tinker` (an object to poke). One entry, `unfold`, walks a repository, paper, book, or concept through one layer per turn, choosing a form per layer. Lenses feed `shape` only when continuation is already authorized or the user asks; forms and entry don't. Renamed from `think`. |
<!-- END GENERATED catalog-plugins -->

`nav` and `shape` split the code lifecycle: **shape** pushes work forward (converge → plan → build), **nav** keeps the result healthy (audit → refactor → sync) and lands it (plan → do → ship). **frame** (the understanding family: lenses to see a problem, forms to present an answer, and `unfold` to walk through a subject one layer at a time) is an independent toolkit that feeds the work without depending on it. shape depends on nav one-way (`shape → nav`); each plugin installs and runs alone.

More plugins land here over time. Each lives in its own folder under `plugins/`, gets its own `plugin.json`, and registers via the marketplace's `marketplace.json`.

## Invocation

Once installed (see below), each plugin's skills appear as `/<plugin>:<skill>`.

Skills come in two invocation categories ([ADR-072](docs/adr/072-invocation-direction-law-inventory.md)): **model-invoked** — the agent fires them off your phrasing — and **user-invoked** — summoned only by typing the command, never auto-fired. Each plugin's list below buckets them.

Ask `/nav:ship` to land finished work ("幫我 commit -> push -> merge，然後把沒在用的 branch 刪一刪"); it merges into main by default, opens a PR only when the project requires one, deletes only merged branches, and runs the tail documented in the project's `## Ship` section (ADR-139). Ask `/frame:unfold` for a layered walkthrough ("用 progressive disclosure 帶我認識 X", "walk me through X") and `/frame:tinker` for an object you can poke; a single explanation or ELI5 stays with `/frame:analogize`. Frame and shape no longer end by forcing a next-action menu. If your request already authorizes the next scoped step, the agent continues in the ordinary workflow; if you asked only for analysis or a mockup, that does not grant build authority. When a consequential choice or missing run authority remains, the agent asks a concise question instead of presenting a generic menu (ADR-128).

<!-- BEGIN GENERATED catalog-skills -->
Catalog skills: 21 active skills.

### `nav`

*Model-invoked:*

- `/nav:audit` — assess codebase shape (or read-only quick-check against a target spec)
- `/nav:refactor` — execute a behavior-preserving structural refactor with risk-proportional verification
- `/nav:sync` — check or update source headers, README, setup, usage, API, and architecture documents against current code; catch stale claims and missing reader workflows. Supports complete README/docs batches, with every file accounted for; no standing HTML map (ADR-131)
- `/nav:plan` — ground a spec against the code, resolve consequential ambiguity, and write a plan artifact (lands in `blueprints/plans/` when present); plan-only stops there, while an already-authorized build continues without another next-action menu; process records follow project retention policy (ADR-134)
- `/nav:do` — execute a small, decided, behaviour-*changing* change directly (deep-module/header discipline inline, no plan artifact; closes the tracking `blueprints/plan.md` item in the same change, ADR-086) — the execution verb, refactor's behaviour-changing twin
- `/nav:compose` — author or restructure a document: lead with the point, group by concern, and preserve claims and sources; preview the structure or diff and complete authorized edits without another generic approval
- `/nav:ship` — land finished work: commit only this task's changes, push, merge into the main branch (or open a PR when the project requires one), remove merged branches and clean worktrees, then run the project's documented `## Ship` tail; the verb after `/nav:do` (ADR-139)

### `shape`

*Model-invoked:*

- `/shape:elicit` — clarify a conceptual decision or specific root cause with grounded questions and explanations; no forced disagreement, phrase-based stall diagnosis, or reading quota; a wider survey is optional, and implementation needs existing authority
- `/shape:mockup` — converge a visual / structural decision with interactive HTML and one linked Markdown record: honest dates, visible Relations, pick/open choices and retirement conditions; variants share the record
- `/shape:probe` — design a minimal experiment or assess existing measurements for a pending decision; separate correctness, output quality, and workflow value, and preregister the verdict before new trials
- `/shape:dogfood` — drive the real built interface against a stated tool-evaluation goal; attribute friction and missing intents, disclose known problems during assisted use, and preserve independent-trial boundaries
- `/shape:tidy` — tidy stale thoughts, completed plans, and redundant mockups; preserve useful reasons, verify completion and inbound links, and honor the requested cleanup scope (ADR-131)
- `/shape:idea` — save a findable spark without creating an implementation commitment; distinct from clarifying a specific choice
- `/shape:status` — recover task-owned progress and fresh code evidence; explicitly requested priorities update the original project entry; export an interactive graph on demand

*User-invoked:*

- `/shape:wrap` — save this round into the original tasks, preserving other open work; no separate handoff or checkpoint

### `frame`

*Model-invoked:*

- `/frame:first-principles` — strip a question to its irreducible axioms, rebuild from them, and surface where that diverges from convention; analysis stays in-chat unless continuation was already authorized
- `/frame:orthogonal` — factor a tangled phenomenon into mutually-independent (orthogonal) axes; verify the independence (move one, the others stay put) and name what was conflated; in-chat
- `/frame:analogize` — on explicit request, build a checked analogy for a concept you already understand: compare candidates, verify the mapping against the real structure, pick on fit, and name where the winner breaks; in-chat
- `/frame:draw` — render something you already understand so it lands for someone else, with the form chosen by the kind of knowledge; terminal-first, escalating to an interactive artifact only when interaction changes visible state or the user asks. Distinct from `/shape:mockup`, which renders candidates so a decision can be picked — here the artifact is the explanation
- `/frame:unfold` — walk someone through an unfamiliar repository, library, paper, book, or concept by progressive disclosure: skeleton first, one layer per turn, each term glossed at first use, claims marked recorded/inferred/unknown, the learner's questions setting depth, a named checkpoint, and a form chosen per layer. Distinct from `/frame:analogize`, which gives a single explanation
- `/frame:tinker` — build a small interactive object to understand why something behaves as it does: one primary control, a visible before/after, details revealed as asked, persistent across turns, with an honest note where it simplifies. Output is an interactive HTML page handed over as a URL. Distinct from `/shape:mockup` (render to decide) and `/frame:draw` (choose a picture)
<!-- END GENERATED catalog-skills -->

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
/plugin install shape@skills
/plugin install frame@skills
```

That's it — the `/nav:*`, `/shape:*`, and `/frame:*` skills become available. (Install only `nav` if you just want the maintenance half; `shape` depends on `nav`, so install both to use the forward-motion half. `frame` is independent — install alone or with the others.)

### Antigravity CLI (`agy`)

Antigravity CLI natively imports Claude Code plugins — same `SKILL.md` format, same `/<plugin>:<skill>` namespace, **no conversion needed**. Two ways to wire this repo up:

**Global install (recommended).** Clone the repo, then import each plugin directory:

```bash
git clone https://github.com/ChenPaulYu/skills.git && cd skills
agy plugin install plugins/nav
agy plugin install plugins/shape
agy plugin install plugins/frame
```

Verify with `agy plugin list` — each plugin shows up with source `claude-code`, and its skills are available in every project under the usual namespaced names (`/nav:audit`, `/shape:mockup`, `/frame:analogize`, …).

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

Codex (OpenAI) uses the same Agent Skills format (`SKILL.md` = `name` + `description` frontmatter + body + optional `references/`), so the plugins above double as Codex skills. The Claude plugins under `plugins/` stay the **single source of truth**; a Codex-discoverable mirror is **generated** into `.agents/skills/` — one flat, unnamespaced skill per plugin skill (`nav:audit` → `nav-audit`, since Codex has no plugin namespace), with cross-references and bundled paths rewritten. Codex gets a separate, short, trigger-first metadata projection from `platforms/codex/descriptions.json`; Claude descriptions remain unchanged. The generated repo-root [`AGENTS.md`](AGENTS.md) carries shared editing rules and links to family maintainer guides, loaded only when that family is edited. The adapter now has its own release line in `platforms/codex/manifest.json` (`adapter_release` + `schema_version`, independent from Claude plugin versions). The full translation/install contract is in [`docs/codex-compatibility.md`](docs/codex-compatibility.md).

```bash
node scripts/build-manifests.mjs   # manifests, shared references, README/site catalog
node scripts/build-codex.mjs       # re-run after editing any SKILL.md
node scripts/build-cursor.mjs      # re-run after editing any SKILL.md (Cursor plugins)
node scripts/validate-codex-skills.mjs --release-smoke
node scripts/validate-codex-skills.mjs
node scripts/validate-codex-skills.mjs --metadata-audit
```

The validator checks both sides of the contract: Claude Code source skills under `plugins/` must have valid YAML frontmatter, and the Codex mirror under `.agents/skills/` must be regenerated and YAML-safe. It also gates Codex sidecar coverage, the per-skill/total metadata budget, install-profile references, **manifest drift**, and **public catalog drift**. See the repo-root [`CLAUDE.md`](CLAUDE.md) for the full single-owner rule.

The marked README and site catalog blocks are generated, including versions, counts, skill membership, and invocation categories. Edit [`docs/catalog-copy.json`](docs/catalog-copy.json) for editorial prose and layout hints; absent copy falls back to source descriptions. Keep quick lookups and anatomy explanations current by hand. See [ADR-130](docs/adr/130-source-derived-public-catalog.md).

Enable the pre-commit hook once per clone. It validates the complete staged snapshot,
including its validator scripts, while leaving unstaged and untracked work untouched:

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

## Validation

Run offline regression tests with:

```bash
node --test scripts/lib/*.test.mjs
node scripts/validate-staged.mjs   # check the staged commit candidate without committing
```

Real skill-task checks are opt-in. The helper prepares a small isolated Git project and
checks observable results; it never starts a model or paid job:

```bash
node scripts/skill-behavior.mjs list
trial_root="$(mktemp -d)"
node scripts/skill-behavior.mjs prepare docs-batch "$trial_root/docs-batch"
# Give a fresh executor only the returned workspace, skill, and prompt.
# After it finishes:
node scripts/skill-behavior.mjs check "$trial_root/docs-batch"
```

Use a fresh workspace for each case. Keep the adjacent baseline receipt intact and outside
the executor's task scope. A mechanical pass still requires the returned `reviewRequired`
checks: inspect the artifacts, final response, and actual tool actions. Unchanged final
hashes cannot establish that no transient write occurred. Do not supply expected answers
from the case catalog to the executor. See [the first four runs and their limits](docs/findings/2026-09-30-behavior-cases.md).

Four further cases cover local artifact retention, ignored-but-tracked cleanup, probe
evidence limits, and assisted tool evaluation. Their offline positive/negative checker
tests and unrun model trials are documented in
[the evidence checks](docs/findings/2026-09-30-development-artifacts-and-evidence-checks.md).

Four natural-prompt variants extend that catalog. Eight fresh gpt-6-luna executions
(one rejected setup) exposed routing, retention, and reporting defects; the resulting
instruction repairs passed offline checks but have not been rerun through the model.
See [the observed outcomes and limits](docs/findings/2026-09-30-low-cue-skill-trials.md).

One two-turn dogfood case brings the opt-in catalog to 13 cases. The bounded post-repair
follow-up separates a passing existing-measurement sample from failed tree retention,
partial goal continuity, and a corrected capture allowlist. See
[the follow-up evidence and remaining limits](docs/findings/2026-09-30-probe-and-roster-followup.md).

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
