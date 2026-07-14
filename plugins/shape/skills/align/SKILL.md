---
name: align
model: sonnet
description: "Align on what to build next: decide with you what's In progress, Next, or Future from current decisions and real work, then write the single maintained plan.md board. Fires on \"where are we\" or \"what should we work on next\". NOT /nav:plan (this triages forward; that grounds a spec into code). NOT a visual render — that's an on-demand /shape:mockup board snapshot."
---

# Align — decide what's next, render it

Recurring, lightweight alignment on **what to build next**. Read the converged decisions and the real state of the work, decide *with the user* what's now / next / later, and land it as `plan.md` — the one real, current artifact you point at, not a paragraph you re-read. Not a grand up-front roadmap — a quick, repeatable "where are we, what's next". Want to *see* it rendered? That's an on-demand `/shape:mockup` board snapshot, not align's job — align never maintains a standing HTML file.

> **Cost tier (ADR-059):** this skill declares `model: sonnet` in its frontmatter — the bulk of the work (scan the tree, rewrite `plan.md`) is mechanical, so it runs on the cheaper model for that turn; the session model resumes on the next prompt. Deciding now/next/later stays *with the user* — the tier changes the model, never the collaboration or the write gate.

## Why this skill exists

A plan written as prose floats — you re-read it and decide nothing. And a plan that lives only in chat evaporates by the next session. `align` makes the plan a **real, current artifact you point at**: `plan.md`, grouped by status, that the agent executes against directly. There's exactly one maintained copy of the truth — no second, HTML-rendered story that can quietly drift out of sync with it.

It is the pre-build mirror of `/nav:map`'s codebase map: where the map projects the *existing code*, align projects the *planned work*.

## The shape spine (restated — this skill is self-contained)

> **Converge by a real, disposable instance — never a description.** A standing plan obeys the same law: the plan is a real board you point at, not a paragraph you re-read.

And the blueprints pipeline this skill maintains:

> **One current state, one maintained render.** `plan.md` is both the agent's index and the human's board — it's already plain, readable markdown, so there is no second file to keep in sync with it. Dependencies point downstream only (`plan.md` ← `decisions.md` ← `thoughts/`) — never the reverse.
>
> **A human who wants a visual view renders one on demand, via `/shape:mockup`.** That render is disposable — generated fresh from the current `plan.md`/`decisions.md` when actually wanted, never stored, so it cannot go stale and there is nothing for align to regenerate.

Corollaries that govern every step below:
- **Decide *with* the user.** align triages; the user picks. Surface the candidate now/next/later split and let them move things — don't silently author the priorities.
- **Weight-adaptive.** File count is the weight knob. A one-decision effort may have a two-line `plan.md`; a sprawling one accretes many thoughts + a fuller board. Don't force structure the task doesn't need.
- **Downstream-only.** Writing `plan.md` is never where new decisions are born — those belong in a `thoughts/` doc (produced by `/shape:elicit` or `/shape:mockup`).

## What it produces — the blueprints tree

See [`references/blueprints-spec.md`](plugins/shape/skills/align/references/blueprints-spec.md) for the full convention. In short:

```
blueprints/
  thoughts/      ← committed design decisions (agent-facing; align reads, rarely writes)
  decisions.md   ← committed durable *why* (reconcile owns; align reads it)
  mockups/       ← committed disposable HTML (owned by /shape:mockup) — including, on request, a board snapshot
  plan.md        ← align writes: lean status index (agent AND human read this directly)
```

## Protocol

### Step 1 — Locate or scaffold the tree (no separate init)

Find `blueprints/` (commonly `docs/blueprints/`). A project **born via `/shape:setup`** already has the tree + the `CLAUDE.md` priming block — skip to Step 2. Otherwise you're **adopting an existing repo** into the workflow, and this first run scaffolds it (there is deliberately no `shape:init`):
- Ask **once** where it should live, then create `blueprints/thoughts/` + `blueprints/mockups/` + `blueprints/plans/`, and seed `plan.md` from the template. **Commit `mockups/`** (it carries Pick logs + ratified samples that thoughts link into — per `blueprints-spec.md`); only a *root-level* scratch `/mockups/` is gitignored, never the blueprints one.
- **Also install the priming layer the project lacks** (the reason adoption felt un-smooth): ensure the `## Dev workflow` block from [`references/dev-workflow-stub.md`](plugins/shape/skills/align/references/dev-workflow-stub.md) exists in the repo's `CLAUDE.md` (sentinel-delimited, idempotent) — workflow-verb table + standing pointers + communication directive.
- If it exists, skip creation — only fill what's missing (idempotent).

### Step 2 — Ground in current reality

Two inputs, both required — never plan in a vacuum:
- **The decisions** — read `thoughts/*.md` (in-flight) **and `decisions.md`** (the durable why, for the 🧭 layer). What has been decided?
- **The actual state — verify against the code; don't trust the plan's own claims.** What's already built? Grep the codebase for the features the thoughts describe; lean on `head -12` file headers (`/nav:sync`) + `git log` to read implementation status cheaply.

**Sync-confirm done-ness — align is a status *sync*, not a read-only re-render.** For every item the *current* `plan.md` lists as In progress / Next — **especially any marked "待驗 / TBD / not-sure-if-done / 待驗是否已做"** — go *confirm it against the code*, don't carry the unresolved claim forward. If grounding shows it shipped, **move it to ✅ Shipped** in the triage (Step 3). A plan that still says "TBD: is X done?" *after* an align run is an align failure — the whole point is that the board reflects verified present reality. (This is item-*status* reconciliation, which is align's job; pruning a stale *thought doc* is still `/shape:reconcile`'s — don't conflate the two.)

### Step 3 — Triage *with the user* into now / next / later

Propose a split: **🚧 In progress** (the current batch's tail) · **▶ Next** (what to pick up) · **⏸ Future** (decided but deferred, with the blocker/why) · **✅ Shipped** (current baseline). Surface it and let the user move items, add, cut. This is the alignment — don't skip the dialog. If the grounding surfaced a thought that looks already-implemented or stale, **flag it but don't clean it here** — that's `/shape:reconcile`'s job.

### Step 4 — Write `plan.md` (the agent index — and the only maintained artifact)

Lean, one layer, grouped by status. Each entry = **what to do + which thought to read** — no prose essays. Shape per the spec's `plan.md` template.

**If the user wants to *see* the board right now**, that's not this skill's job: point them at (or invoke) `/shape:mockup` to render an on-demand board snapshot from the current `plan.md` + `decisions.md` — see blueprints-spec.md's board-snapshot contract. align stops at writing `plan.md`; it never generates or maintains an HTML file.

## The seam with `nav` — don't blur it

align is **pre-build** (intent side). It ends at "decided + recorded in blueprints". `/nav:plan` is **build-side**: it takes a thought/spec and grounds it into a *codebase-level implementation plan*. `blueprints/` is the hand-off artifact. They are adjacent verbs, not overlapping — align triages forward into a status board; nav:plan grounds one item down into code. Never produce a code-implementation plan here.

## Discipline (do not skip)

- **Decide with the user, don't author priorities silently.** Surface the split; let them move things.
- **One state, one maintained render.** `plan.md` is the single source of truth for status; a visual view is generated on demand by `/shape:mockup`, never a second maintained copy that can drift.
- **Don't clean here.** Stale/implemented thoughts get *flagged*; pruning is `/shape:reconcile` (write-gated).
- **Write-gated.** Show what you'll write (or a diff for an existing tree) before committing files.
- **No new decisions during triage.** A decision that surfaces while aligning belongs in a `thoughts/` doc, via `/shape:elicit` or `/shape:mockup`.

## Output

- `blueprints/plan.md` — lean, status-grouped index (created or refreshed); the single maintained artifact, agent- and human-readable.
- (First run) the scaffolded `blueprints/` tree.
- A chat summary: what moved between now/next/later, anything flagged as possibly-stale (→ reconcile), and — if the user wants a visual view — a pointer to run `/shape:mockup` for an on-demand board snapshot.

## Companion skills

- **`/shape:elicit`** — converge a *conceptual* decision into a new `thoughts/` doc (the WHAT align reads).
- **`/shape:mockup`** — converge a *visual / structural* decision into a disposable interactive artifact (lands in `mockups/`); also renders an on-demand board snapshot from `plan.md` + `decisions.md` when a human wants to see one.
- **`/shape:reconcile`** — check `thoughts/` against current reality and clean out what's stale (the cleanup align defers to).
- **`/nav:plan`** — the build-side sibling: ground one blueprint item into a code-level implementation plan.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
