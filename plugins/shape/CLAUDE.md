# shape — plugin-level CLAUDE.md

> Editing this plugin. To run a skill, read its `SKILL.md` (self-contained).

## What it is

**Forward motion: give intent its form, all the way to running, verified code.** Sibling to `nav` — the two split the lifecycle cleanly: **shape pushes the work forward** (converge → plan → build), **nav keeps the result healthy** (audit → refactor → map). Domain = the loop **converge a decision → record it legibly → keep it current → build it real**.

> Identity note (ADR-011): shape was originally scoped "pre-build". Adding `build` deliberately widened it to forward-motion-through-execution — the natural terminus of the spine (a real instance), not scope-creep. nav stays the maintenance half.

## Spine (through-line)

**Converge by a real, disposable instance — never a description.** The instance's *form* varies: a verbal grounded fork (elicit), or a rendered interactive artifact (mockup). Its standing form is the blueprints board — **one current state, two renders** (agent reads markdown, human reads an HTML projection; deps point downstream only). Its **terminus** is `build` — the disposable instances converge the decision; build makes it the durable real thing and verifies it against the mockup (the running system is the third render).

**Progressive disclosure runs through both renders.** Every artifact leads with its interface and drills in only as needed — the agent's render of that is markdown structure (a `head -12`-able header + TL;DR, sections that lead with their point), the human's is the click-to-reveal board. Same interface-first principle as `nav`'s file headers; two media.

**Below 90% → ask (core principle, shared with `nav` rule ⑦).** When unsure about scope, boundaries, or intent, stop and ask — never guess. This is the spine of the whole family, not a per-skill add-on: `elicit` *is* this rule as a workflow (it converges by asking, not answering); `mockup` lets the user point; `align` decides *with* the user; `reconcile` gates every destructive step per-file. Any autonomous driver built on top runs **only while confidence holds** — the moment scope/boundary/intent drops below 90% it stops and asks rather than plowing ahead. The cost of pausing to clarify is far smaller than unwinding a wrong guess.

## Members

Grouped by verb (mirrors `nav`'s family shape):

- **converge** — turn an open question into a decision:
  - `mockup` — render-to-decide: a real interactive HTML (UI mockup, or diagram for backend/agent/data/flow). *(built)*
  - `elicit` — draw the decision out by a grounded fork (react-not-author, drill-to-principle, compress-to-one-line; weight-adaptive exit — stop on the snap; summoned, not auto) → a `thoughts/` doc. *(built)*
- **project** — render the current plan:
  - `align` — read `thoughts/` + real state → decide now/next/later *with the user* → write `plan.md` (agent) + regenerate `overview.html` (human). The pre-build mirror of `/nav:map`. *(built)*
- **reconcile** — keep the archive honest:
  - `reconcile` — judge which `thoughts/` docs are stale (code/headers · self-declaration · date) → prune/consolidate *with the user*, write-gated. The pre-build mirror of `/nav:audit` + careful `/nav:refactor`. *(built)*
- **build** — make it real:
  - `build` — drive the plan's In-progress column to done: per item, ground via `/nav:plan` → implement with `/nav:refactor` discipline + inject↔check → verify (browser screenshot vs the item's mockup; or test-gate) → move to Shipped → `/shape:align`. Autonomous but **confidence-gated** (stop below 90%). A meta-skill (orchestrates siblings, never re-implements/calls them). The cross-plugin orchestrator. *(built)*
- **`blueprints/` = convention**, not a skill — the artifact container the verbs read/write. Layout + `plan.md` shape + `overview.html` contract + the two-renders pipeline live in [`skills/align/references/blueprints-spec.md`](plugins/shape/skills/align/references/blueprints-spec.md).
- **`doctor` = deferred** — an orchestrator (elicit → align → reconcile) crystallizes once ≥3 skills are proven, like `/nav:doctor` landed last.

There is deliberately **no `init` skill** — scaffolding the `blueprints/` tree folds into `align`'s first run (ask location once, create idempotently). A skill for `mkdir -p` would be structure-theatre.

## The seams with `nav` (shape depends on nav, never the reverse)

shape is the forward-motion half; `nav` is the maintenance half. nav stays **independent** (it must not reference shape); shape calls nav. Record the seams; don't blur them:

1. **`blueprints/` is the hand-off artifact to `/nav:plan`.** shape converges intent into blueprints; `nav:plan` grounds a thought/spec into a code-level implementation plan. `align` triages forward; `nav:plan` grounds one item down — adjacent verbs, not overlapping.
2. **`reconcile` consumes `/nav:headers`.** `head -12` file headers make "is this implemented?" answerable cheaply — the strongest staleness signal.
3. **`build` is the concentrated seam.** It *controls* the loop (lives in shape, forward-motion) while *calling* nav's code-side protocols per item: `/nav:plan` (ground) → `/nav:refactor` discipline (implement) → `/nav:headers` (cheap grounding for inject), then writes back via `/shape:align`. Direction stays one-way: shape → nav.

## Conventions for skills inside this plugin

These follow the marketplace conventions (see `plugins/nav/CLAUDE.md` for the full list); the load-bearing ones:

- **Naming**: bare verbs — `mockup`, `elicit`, `align`, `reconcile`. The `shape:` namespace gives the topic; no `shape-` prefix.
- **Self-contained `SKILL.md`**: each restates the spine verbatim, so a triggered agent doesn't depend on this file. Bulky references (the blueprints spec, the overview template) live in `references/`, loaded on demand.
- **★ Stack-neutral, standalone-legible examples**: never leak an origin project's domain nouns. The blueprints template + spec use generic placeholders — a reader who never saw the origin project still gets it.
- **★ Skills-root-relative paths**: all paths written as if `skills/` (the marketplace root) is root — **no `./` or `../`** in doc links or example code.
- **★ Progressive disclosure in every produced artifact** (so an agent scans fast, not just the human): a `thoughts/` doc opens with `# <title> — <one-line role>` + a ≤3-line TL;DR/status blockquote (`head -12` yields the gist without reading the body), sections lead with their point, enumerations go in tables, key terms bolded; a `mockup` artifact opens with a top-comment stating what it is · the candidates · the pick. This is `nav`'s interface-first (rule ②) applied to shape's outputs. Every skill that emits a doc/artifact (`elicit`, `mockup`, `align`) enforces it.
- **Write-gated**: `align` and `reconcile` write files — show what will be written (or a diff) before committing. `reconcile`'s destructive ops follow the safety rules in its `SKILL.md` (check tracked/untracked, never `mv`-then-`rm`, diff before delete).
- **Skills don't invoke each other**: they reference sibling protocols by name (e.g. reconcile → "run `/shape:align`"), never re-implement or call them.
- **Each new skill / family change → an ADR** in `docs/adr/` (marketplace-level). The blueprints family landed in [`docs/adr/010-shape-blueprints-workflow.md`](docs/adr/010-shape-blueprints-workflow.md).
- **Site-map is a gating update**: any change to a `SKILL.md`, manifest, or ADR requires the same change-set to update [`docs/site/index.html`](docs/site/index.html). Stale map lies to every future reader.

## browser-verify — a shared per-project capability slot

Three skills need to *see* the running thing — `mockup` (render the artifact), `align` (open the board), `build` (verify each item against its mockup). They share **one** pluggable capability, not three copies (N+1 trigger):

- **Default implementation: `agent-browser`** (vercel-labs/agent-browser) — a browser-automation CLI. Detect: `which agent-browser`. Usage: `agent-browser open <url>` → `agent-browser screenshot <file>.png`; `snapshot -i` / `click @e` / `fill @e "..."` to interact.
- **Don't hardcode the tool — name the capability.** A skill describes the contract ("open the running feature → screenshot → compare to mockup"); `agent-browser` is the named **default**, not the contract.
- **If missing, fail helpfully — never silently skip.** Surface a 3-way confidence-gate choice: **(a) install** [recommended] — `npm install -g agent-browser` (or `brew`/`cargo install agent-browser`) then `agent-browser install`; or as a skill `npx skills add vercel-labs/agent-browser`. **(b)** proceed without visual verify this run (flag items to eyeball). **(c)** skip verify for this item. Report what was skipped (no silent caps).
- **Per-project override:** a project may bind a different helper (Playwright, puppeteer) in its own CLAUDE.md; the agent reads that. Absent an override, the default is agent-browser.
- **Skills don't call skills:** name the capability + describe the contract; the executing agent invokes the tool (CLI shell-out, or triggers the agent-browser skill in its own turn).

## Status

Five skills built (`mockup`, `elicit`, `align`, `reconcile`, `build`); `doctor` (orchestrator) deferred until the family proves out. `elicit`'s behavioral spec comes from `docs/observations/2026-05-29-thought-mode-how-paul-converges.md`; `build` + the browser-verify slot land in ADR-011. History: `docs/observations/2026-05-29-shape-plugin.md`.
