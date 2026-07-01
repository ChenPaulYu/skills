---
name: align
description: "Align on what to build next — read the current decisions (blueprints/thoughts/) and the actual state of work, decide with the user what is In progress / Next / Future, then write a lean plan.md and regenerate a human-facing overview.html status board. Fires on \"align on what's next\", \"what should we work on\", \"update the plan\", \"refresh the plan / overview\", \"where are we\", \"sync the blueprints\", \"re-do plan.md\", or hands over notes asking \"so what now\". NOT /nav:plan (this triages forward; that grounds a spec into code). Scaffolds blueprints/ on first run."
---

# Align — decide what's next, render it

Recurring, lightweight alignment on **what to build next**. Read the converged decisions and the real state of the work, decide *with the user* what's now / next / later, and land it as two views of one reality: a lean `plan.md` (the agent reads this) and an `overview.html` status board (the human reads this). Not a grand up-front roadmap — a quick, repeatable "where are we, what's next".

## Why this skill exists

A plan written as prose floats — you re-read it and decide nothing. And a plan that lives only in chat evaporates by the next session. `align` makes the plan a **real, current artifact you point at**: a one-layer status board the human scans and clicks, backed by a lean index the agent executes against. Because the human view and the agent view are two renders of the *same* present state, they can't quietly drift into two different stories.

It is the pre-build mirror of `/nav:map`'s codebase map: where the map projects the *existing code*, align projects the *planned work*.

## The shape spine (restated — this skill is self-contained)

> **Converge by a real, disposable instance — never a description.** A standing plan obeys the same law: the plan is a real board you point at, not a paragraph you re-read.

And the blueprints pipeline this skill maintains:

> **One current state, two renders.** An agent reads markdown (`plan.md`); a human reads an interactive HTML projection (`overview.html`). Both are views of the *same* present reality, with dependencies pointing downstream only (overview ← plan ← thoughts) — never two sources that can drift.
>
> **The human render is consumption-gated.** The two-render split earns its upkeep only while *both* renders have a reader. `overview.html` is a cache of `plan.md`+`decisions.md` rendered for a human — and caching beats derive-on-demand only when reads are frequent (amortize the upkeep) AND regen is expensive. A solo / never-opened board is the opposite (reads ≈ 0, regen ≈ seconds) → **derive-on-demand wins**: keep `plan.md` as the *sole maintained* board (it's already human-readable), and generate the visual human view **fresh on demand** when actually wanted — never stored, so it cannot go stale. A maintained projection nobody reads is pure upkeep + a stale-render risk; **dropping the unread render *removes* the drift problem rather than creating it** (no second stored story to diverge). Don't maintain a render that has no reader.

Corollaries that govern every step below:
- **Decide *with* the user.** align triages; the user picks. Surface the candidate now/next/later split and let them move things — don't silently author the priorities.
- **Weight-adaptive.** File count is the weight knob. A one-decision effort may skip `overview.html` until a board is worth it; a sprawling one accretes many thoughts + a full board. Don't force the whole tree on a tiny task.
- **Downstream-only.** Regenerating `overview.html` is never where new decisions are born — those belong in a `thoughts/` doc (produced by `/shape:elicit` or `/shape:mockup`).

## What it produces — the blueprints tree

See [`references/blueprints-spec.md`](plugins/shape/skills/align/references/blueprints-spec.md) for the full convention. In short:

```
blueprints/
  thoughts/      ← committed design decisions (agent-facing; align reads, rarely writes)
  decisions.md   ← committed durable *why* (reconcile owns; align reads to project the 🧭 layer)
  mockups/       ← git-ignored disposable HTML (owned by /shape:mockup)
  plan.md        ← align writes: lean status index (agent-facing)
  overview.html  ← align writes: human projection of plan.md (status) + decisions.md (why)
```

## Protocol

### Step 1 — Locate or scaffold the tree (no separate init)

Find `blueprints/` (commonly `docs/blueprints/`). A project **born via `/shape:setup`** already has the tree + the `CLAUDE.md` priming block — skip to Step 2. Otherwise you're **adopting an existing repo** into the workflow, and this first run scaffolds it (there is deliberately no `shape:init`):
- Ask **once** where it should live, then create `blueprints/thoughts/` + `blueprints/mockups/` + `blueprints/plans/`, and seed `plan.md` + `overview.html` from the template. **Commit `mockups/`** (it carries Pick logs + ratified samples that thoughts link into — per `blueprints-spec.md`); only a *root-level* scratch `/mockups/` is gitignored, never the blueprints one.
- **Also install the priming layer the project lacks** (the reason adoption felt un-smooth): ensure the `## Dev workflow` block from [`references/dev-workflow-stub.md`](plugins/shape/skills/align/references/dev-workflow-stub.md) exists in the repo's `CLAUDE.md` (sentinel-delimited, idempotent) — workflow-verb table + standing pointers + communication directive.
- If it exists, skip creation — only fill what's missing (idempotent).

### Step 2 — Ground in current reality

Two inputs, both required — never plan in a vacuum:
- **The decisions** — read `thoughts/*.md` (in-flight) **and `decisions.md`** (the durable why, for the 🧭 layer). What has been decided?
- **The actual state — verify against the code; don't trust the plan's own claims.** What's already built? Grep the codebase for the features the thoughts describe; lean on `head -12` file headers (`/nav:sync`) + `git log` to read implementation status cheaply.

**Sync-confirm done-ness — align is a status *sync*, not a read-only re-render.** For every item the *current* `plan.md` lists as In progress / Next — **especially any marked "待驗 / TBD / not-sure-if-done / 待驗是否已做"** — go *confirm it against the code*, don't carry the unresolved claim forward. If grounding shows it shipped, **move it to ✅ Shipped** in the triage (Step 3). A plan that still says "TBD: is X done?" *after* an align run is an align failure — the whole point is that the board reflects verified present reality. (This is item-*status* reconciliation, which is align's job; pruning a stale *thought doc* is still `/shape:reconcile`'s — don't conflate the two.)

### Step 3 — Triage *with the user* into now / next / later

Propose a split: **🚧 In progress** (the current batch's tail) · **▶ Next** (what to pick up) · **⏸ Future** (decided but deferred, with the blocker/why) · **✅ Shipped** (current baseline). Surface it and let the user move items, add, cut. This is the alignment — don't skip the dialog. If the grounding surfaced a thought that looks already-implemented or stale, **flag it but don't clean it here** — that's `/shape:reconcile`'s job.

### Step 4 — Write `plan.md` (the agent index)

Lean, one layer, grouped by status. Each entry = **what to do + which thought to read** — no prose essays. Shape per the spec's `plan.md` template.

### Step 5 — Regenerate `overview.html` (the human projection)

**First — is the human render consumed? (consumption gate)** If the project is solo / the user signals they never open `overview.html`, **skip this step**: `plan.md` is the sole *maintained* board, and the visual human board is generated **on-demand** from it when actually wanted (never stored). Record the deviation in `plan.md`'s header so the next align run doesn't recreate the standing file. Retire an existing-but-unread `overview.html` (delete it; git holds it). Only maintain `overview.html` below when it has a real reader — see the consumption-gated corollary above.

Copy [`references/overview-template.html`](plugins/shape/skills/align/references/overview-template.html) and fill its data arrays from `plan.md` **and `decisions.md`**:
- One layer, three status columns + a Shipped strip (status, from `plan.md`).
- Each card **click-to-reveal**: title + one-liner visible; a **plain-language** detail (distilled from the thought, *not* the raw md) expands on click — so the human never needs to open `thoughts/*.md`.
- **A `🧭 Decisions` layer** projected from `decisions.md` — one card per feature-section, **single-column** (expanding one must not stretch a row-mate), click-to-reveal; the detail = the call · how it shows up · what was rejected (plain language). align *renders* this layer but **never edits `decisions.md`** (that's reconcile's — a decision surfacing here is out of scope, → `/shape:elicit`).
- **Shipped shows the most recent ~5** + a `… +N earlier — see plan.md / git log` pill; the board is a highlight, not the changelog.
- **Bilingual** (EN + zh-Hant); never monolingual without opt-out.
- **Match the project's visual language** if a sibling artifact establishes one (codebase-map, design tokens, prior mockups); the template tokens are only a start.

### Step 6 — Verify + activate

Open `overview.html` via shape's shared **browser-verify slot** (`plugins/shape/CLAUDE.md`; default `agent-browser`); confirm the lang toggle flips, cards expand, footer links resolve, zero console errors. **Hand over a clickable URL in the reply** so the user can open the board straight from chat — a `file://<absolute-path>` link by default; a throwaway `http://localhost:<port>` static server only if `file://` blocks something (rare for this self-contained file). Tell them what changed and offer to adjust density/tone of the detail panels.

## The seam with `nav` — don't blur it

align is **pre-build** (intent side). It ends at "decided + recorded in blueprints". `/nav:plan` is **build-side**: it takes a thought/spec and grounds it into a *codebase-level implementation plan*. `blueprints/` is the hand-off artifact. They are adjacent verbs, not overlapping — align triages forward into a status board; nav:plan grounds one item down into code. Never produce a code-implementation plan here.

## Discipline (do not skip)

- **Decide with the user, don't author priorities silently.** Surface the split; let them move things.
- **Two renders, one state.** `overview.html` always derives from `plan.md` (status) + `decisions.md` (why); never let them tell different stories. The *why* is a layer **inside** the one overview, not a separate `decisions.html`. Both reflect *current* reality — a stale board is a lie (same rule as a stale codebase map).
- **Plain language in the detail panels.** The human-facing detail is distilled, not the dense thought pasted in.
- **Don't clean here.** Stale/implemented thoughts get *flagged*; pruning is `/shape:reconcile` (write-gated).
- **Write-gated.** Show what you'll write (or a diff for an existing tree) before committing files.
- **No new decisions during render.** A decision that surfaces while aligning belongs in a `thoughts/` doc, via `/shape:elicit` or `/shape:mockup`.

## Output

- `blueprints/plan.md` — lean, status-grouped index (created or refreshed).
- `blueprints/overview.html` — bilingual, click-to-reveal status board reflecting current reality.
- (First run) the scaffolded `blueprints/` tree + `.gitignore` entry for `mockups/`.
- A chat summary: what moved between now/next/later, anything flagged as possibly-stale (→ reconcile), "open it with `open <path>/overview.html`".

## Companion skills

- **`/shape:elicit`** — converge a *conceptual* decision into a new `thoughts/` doc (the WHAT align reads).
- **`/shape:mockup`** — converge a *visual / structural* decision into a disposable interactive artifact (lands in `mockups/`).
- **`/shape:reconcile`** — check `thoughts/` against current reality and clean out what's stale (the cleanup align defers to).
- **`/nav:plan`** — the build-side sibling: ground one blueprint item into a code-level implementation plan.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
