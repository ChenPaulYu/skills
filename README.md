# skills

> Paul's personal agent-skills marketplace.
> A growing collection of focused, single-purpose plugins — one source tree, installable in **Claude Code**, **Antigravity CLI (`agy`)**, **Codex**, **opencode**, and **Cursor**.

## Which verb do I want?

A quick lookup for the highest-frequency intents — full plugin tables and per-skill detail follow below.

| I want to… | Run |
|---|---|
| Audit my codebase's architecture / find smells | `/nav:audit` |
| Queue decided deliverables and define how to accept them | `/shape:task` |
| Implement a decided fix or feature, or see its engineering approach first | `/nav:do` |
| Land finished work: commit, push, merge, clean up branches（收尾）| `/nav:ship` |
| Mock up / compare a few options visually（想看選項長什麼樣） | `/shape:mockup` |
| Think a decision through — I haven't decided yet | `/shape:elicit` |
| Verify the board and decide what comes next（排優先順序） | `/shape:status` |
| Tidy tasks, legacy plans, thoughts, and mockups（整理設計紀錄） | `/shape:tidy` |
| Update README and/or docs as one batch, or refresh source headers（同步說明） | `/nav:sync` |
| Recover current tasks and next actions（回來接續） | `/shape:status` |
| Save progress into original tasks（存回原工作） | `/shape:wrap` |

## What's in here

<!-- BEGIN GENERATED catalog-plugins -->
Catalog: 3 plugins · 22 skills.

| Plugin | Version | Skills | What it covers |
|---|---:|---:|---|
| [`nav`](plugins/nav/) | 0.28.2 | 6 | **Keep code healthy** — audit, refactor, sync source and docs, implement decided behavior, ship, and compose clear prose. |
| [`shape`](plugins/shape/) | 0.35.14 | 10 | **Give work its form** — connect projects, capture ideas, converge decisions, test claims, define tasks with acceptance checks, recover progress and tidy records. |
| [`frame`](plugins/frame/) | 0.17.3 | 6 | **The understanding family** — help someone understand something. Two lenses to see a problem: `first-principles` (decompose down — strip to axioms, rebuild, surface divergence) and `orthogonal` (decompose sideways — factor a tangle into mutually-independent axes). Three forms to present an answer you already have: `analogize` (a checked analogy; also the ELI5 door), `draw` (the picture and its medium), `tinker` (an object to poke). One entry, `unfold`, walks a repository, paper, book, or concept through one layer per turn, choosing a form per layer. Lenses feed `shape` only when continuation is already authorized or the user asks; forms and entry don't. Renamed from `think`. |
<!-- END GENERATED catalog-plugins -->

**Shape** converges decisions and defines verifiable tasks. **Nav** implements and lands decided work (do → ship) and keeps it healthy (audit → refactor → sync). Ask nav-do for the approach first when you want to review it before building. **frame** (the understanding family: lenses to see a problem, forms to present an answer, and `unfold` to walk through a subject one layer at a time) is an independent toolkit that feeds the work without depending on it. shape depends on nav one-way (`shape → nav`); each plugin installs and runs alone.

More plugins land here over time. Each lives in its own folder under `plugins/`, gets its own `plugin.json`, and registers via the marketplace's `marketplace.json`.

## Invocation

Once installed (see below), each plugin's skills appear as `/<plugin>:<skill>`.

Skills come in two invocation categories ([ADR-002](docs/adr/002-skill-three-layer-law.md)): **model-invoked** — the agent fires them off your phrasing — and **user-invoked** — summoned only by typing the command, never auto-fired. Each plugin's list below buckets them.

Use `/shape:setup` once to connect a code repository to its selected home workspace: reuse an existing registration, add only the needed project entry and portable instruction pointer, then verify the real read path. It does not scaffold an environment or migrate legacy records (ADR-015). Ordinary status reads and record saves do not enroll projects automatically.

Ask `/nav:ship` to land finished work ("幫我 commit -> push -> merge，然後把沒在用的 branch 刪一刪"); it merges into main by default, opens a PR only when the project requires one, deletes only merged branches, and runs the tail documented in the project's `## Ship` section (ADR-004). Ask `/frame:unfold` for a layered walkthrough ("用 progressive disclosure 帶我認識 X", "walk me through X") and `/frame:tinker` for an object you can poke; a single explanation or ELI5 stays with `/frame:analogize`. Frame and shape no longer end by forcing a next-action menu. If your request already authorizes the next scoped step, the agent continues in the ordinary workflow; if you asked only for analysis or a mockup, that does not grant build authority. When a consequential choice or missing run authority remains, the agent asks a concise question instead of presenting a generic menu (ADR-010).

<!-- BEGIN GENERATED catalog-skills -->
Catalog skills: 22 active skills.

### `nav`

*Model-invoked:*

- `/nav:audit` — assess codebase shape (or read-only quick-check against a target spec)
- `/nav:refactor` — execute a behavior-preserving structural refactor with risk-proportional verification
- `/nav:sync` — check or update source headers, README, setup, usage, API, and architecture documents against current code; catch stale claims and missing reader workflows. Supports complete README/docs batches, with every file accounted for; no standing HTML map (ADR-005)
- `/nav:do` — find the owning task and Git baseline before editing, implement authorized changes, and record verified progress in the original task
- `/nav:compose` — author or restructure a document: lead with the point, group by concern, and preserve claims and sources; preview the structure or diff and complete authorized edits without another generic approval
- `/nav:ship` — land finished work: commit only this task's changes, push, merge into the main branch (or open a PR when the project requires one), remove merged branches and clean worktrees, then run the project's documented `## Ship` tail; the verb after `/nav:do` (ADR-004)

### `shape`

*Model-invoked:*

- `/shape:elicit` — clarify a conceptual decision or specific root cause with grounded questions and explanations; no forced disagreement, phrase-based stall diagnosis, or reading quota; a wider survey is optional, and implementation needs existing authority
- `/shape:mockup` — converge a visual / structural decision with interactive HTML and one linked Markdown record: honest dates, visible Relations, pick/open choices and retirement conditions; variants share the record
- `/shape:probe` — design a minimal experiment or assess existing measurements for a pending decision; separate correctness, output quality, and workflow value, and preregister the verdict before new trials
- `/shape:dogfood` — drive the real built interface against a stated tool-evaluation goal; attribute friction and missing intents, disclose known problems during assisted use, and preserve independent-trial boundaries
- `/shape:tidy` — tidy completed tasks, legacy plans, stale thoughts and redundant mockups; preserve useful reasons and live work, and consolidate task/plan files only within requested cleanup scope (ADR-016)
- `/shape:idea` — save a findable spark without creating an implementation commitment; distinct from clarifying a specific choice
- `/shape:status` — recover task-owned progress and fresh code evidence; explicitly requested priorities update the original project entry; export an interactive graph on demand
- `/shape:task` — turn decided work into an original task with deliverables, acceptance checks and next action; recording a task does not authorize implementation

*User-invoked:*

- `/shape:wrap` — save this round into the original tasks, preserving other open work; no separate handoff or checkpoint
- `/shape:setup` — connect a code repository to its selected home workspace, reuse existing identity, add the minimal project/pointer and verify reading; environment scaffolding and legacy migration remain separate

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

In Claude Code:

```bash
/plugin marketplace add ChenPaulYu/skills
/plugin install nav@skills
/plugin install shape@skills
/plugin install frame@skills
```

`shape` depends on `nav`; `frame` is independent. Other agents read the same `plugins/` source
through generated copies:

| Agent | Reads | Skill names |
|---|---|---|
| **Claude Code** | `plugins/` natively | `/nav:audit` |
| **Antigravity (`agy`)** | `agy plugin install plugins/<name>` | `/nav:audit` |
| **Codex** · **opencode** | generated `.agents/skills/` | `nav-audit` |
| **Cursor** | generated `platforms/cursor/<plugin>/` | `nav-audit` |
| **skills.sh** | `npx skills add ChenPaulYu/skills` (add `-g` for global) | per agent |

Per-agent steps, keeping a machine current, and avoiding duplicate global copies:
[`INSTALL.md`](INSTALL.md). Or tell your agent: *Fetch and follow instructions from
`https://raw.githubusercontent.com/ChenPaulYu/skills/main/INSTALL.md`.* Translation contracts:
[Codex](docs/codex-compatibility.md) · [Cursor](docs/cursor-compatibility.md).

## Development

Editing rules, generated files and commit gates live in [`CLAUDE.md`](CLAUDE.md). The short
version: edit `plugins/`, bump the plugin version, regenerate, validate.

```bash
git config core.hooksPath scripts/hooks   # once per clone; validates the staged snapshot
node scripts/build-manifests.mjs && node scripts/build-codex.mjs && node scripts/build-cursor.mjs
node scripts/validate-codex-skills.mjs
node --test scripts/lib/*.test.mjs        # offline regression tests
```

For a local checkout in Claude Code, add the marketplace by absolute path and run
`/reload-plugins` after edits. Opt-in skill-behavior trials (`node scripts/skill-behavior.mjs`)
prepare isolated projects and check observable results without starting a model; their cases
and limits are in [`docs/findings/2026-09-30-behavior-cases.md`](docs/findings/2026-09-30-behavior-cases.md).

## Philosophy (the through-line)

Deep modules — narrow interfaces over hidden complexity. Code you can navigate top-down, without reading every body to understand the surface. Refactors that move things around but never lie about what changed. Documentation grounded in code, never invented.

And the forward-motion counterpart (`shape`): **converge by a real, disposable instance — never a description.** Push a decision into a form you can point at (a grounded fork, a rendered artifact, a task with acceptance checks), record it so it is born durable, and keep it honest against the code — then hand the build to `nav`.

When in doubt: rule ⑦. Ask.

## Map

[`docs/site/index.html`](docs/site/index.html) is a self-contained bilingual interactive map of this marketplace — every plugin, every skill, the 8 rules, conventions, plus the `nav` and `shape` anatomy graphs. Open it directly in a browser.

Its catalog blocks are generated; its explanations are hand-maintained, so update them in the same commit as the behavior they describe.

## Docs layout

| Folder | What |
|---|---|
| [`docs/adr/`](docs/adr/) | Architecture Decision Records — one current decision per topic, with the alternatives it rejected |
| [`docs/findings/`](docs/findings/) | Build-side mechanisms learned while editing this marketplace |
| [`docs/site/`](docs/site/) | The interactive marketplace map (living document) |

Repo-wide rules for editing this marketplace (the hard gates, authoring conventions, maintenance steps) live once in the repo-root [`CLAUDE.md`](CLAUDE.md); plugin-specific conventions live in each plugin's own `CLAUDE.md` (e.g. [`plugins/nav/CLAUDE.md`](plugins/nav/CLAUDE.md)).

## License

MIT
