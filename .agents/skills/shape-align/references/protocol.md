# Align — full protocol

Machinery sunk from the SKILL.md body per ADR-109 (three-layer re-homing). The Stance section
in SKILL.md carries the behavior-changing gates (sync-confirm, no-item-vanishes, write-gated);
this file carries the full step sequence, the scaffolding mechanics, and the boundary rationale.

## Why this skill exists

A plan written as prose floats — you re-read it and decide nothing. And a plan that lives only
in chat evaporates by the next session. `align` makes the plan a **real, current artifact you
point at**: `plan.md`, grouped by status, that the agent executes against directly. There's
exactly one maintained copy of the truth — no second, HTML-rendered story that can quietly
drift out of sync with it.

It is the pre-build mirror of `nav-sync`'s codebase map (its map leg): where the map projects
the *existing code*, align projects the *planned work*.

> **Cost tier (ADR-059):** this skill declares the mechanical-tier executor role in its frontmatter — the bulk of
> the work (scan the tree, rewrite `plan.md`) is mechanical, so it runs on the cheaper model for
> that turn; the session model resumes on the next prompt. Deciding now/next/later stays *with
> the user* — the tier changes the model, never the collaboration or the write gate.

## The shape spine (restated)

> **Converge by a real, disposable instance — never a description.** A standing plan obeys the
> same law: the plan is a real board you point at, not a paragraph you re-read.

And the blueprints pipeline this skill maintains:

> **One current state, one maintained render.** `plan.md` is both the agent's index and the
> human's board — it's already plain, readable markdown, so there is no second file to keep in
> sync with it. Dependencies point downstream only (`plan.md` ← `thoughts/`) — never the reverse.
>
> **A human who wants a visual view renders one on demand, via `shape-mockup`.** That render is
> disposable — generated fresh from the current `plan.md` + `thoughts/` (filtered to `Status: in
> force`) when actually wanted, never stored, so it cannot go stale and there is nothing for align
> to regenerate.

Corollaries that govern every step below:
- **Decide *with* the user.** align triages; the user picks. Surface the candidate now/next/later
  split and let them move things — don't silently author the priorities.
- **Weight-adaptive.** File count is the weight knob. A one-decision effort may have a two-line
  `plan.md`; a sprawling one accretes many thoughts + a fuller board. Don't force structure the
  task doesn't need.
- **Downstream-only.** Writing `plan.md` is never where new decisions are born — those belong in
  a `thoughts/` doc (produced by `shape-elicit` or `shape-mockup`).

## What it produces — the blueprints tree

See [`blueprints-spec.md`](.agents/skills/shape-align/references/blueprints-spec.md) for the full convention. In short:

```
blueprints/
  thoughts/      ← committed decisions (agent-facing; dated, Status-tagged — align reads + writes via the compaction pass)
  mockups/       ← committed disposable HTML (owned by shape-mockup) — including, on request, a board snapshot
  plan.md        ← align writes: lean status index (agent AND human read this directly)
```

## Protocol

### Step 1 — Locate or scaffold the tree (no separate init)

Find `blueprints/` (commonly `docs/blueprints/`). A project that already carries the tree + the
`AGENTS.md` priming block — skip to Step 2. Otherwise you're **adopting an existing repo** into
the workflow, and this first run scaffolds it (there is deliberately no `shape:init`):
- Ask **once** where it should live, then create `blueprints/thoughts/` + `blueprints/mockups/` +
  `blueprints/plans/`, and seed `plan.md` from the template. **Commit `mockups/`** (it carries
  Pick logs + ratified samples that thoughts link into — per `blueprints-spec.md`); only a
  *root-level* scratch `/mockups/` is gitignored, never the blueprints one.
- **Also install the priming layer the project lacks** (the reason adoption felt un-smooth):
  ensure the `## Dev workflow` block from [`dev-workflow-stub.md`](.agents/skills/shape-align/references/dev-workflow-stub.md) exists
  in the repo's `AGENTS.md` (sentinel-delimited, idempotent) — workflow-verb table + standing
  pointers + communication directive.
- If it exists, skip creation — only fill what's missing (idempotent).

### Step 2 — Ground in current reality

Two inputs, both required — never plan in a vacuum:
- **What binds** — read `thoughts/*.md` and filter to `Status: in force` (the durable why, for
  the 🧭 layer; legacy trees: the `precedents/` tier or `decisions.md` — see
  `blueprints-spec.md`'s Convention versions). What currently binds?
- **The actual state — verify against the code; don't trust the plan's own claims.** What's
  already built? Grep the codebase for the features the thoughts describe; lean on `head -12`
  file headers (`nav-sync`) + `git log` to read implementation status cheaply.

(The sync-confirm and mechanical-verification gates for this step are stated in full, verbatim,
in the SKILL.md body's Stance section — ADR-086.)

### Step 3 — Triage *with the user* into now / next / later

Propose a split: **🚧 In progress** (the current batch's tail) · **▶ Next** (what to pick up) ·
**⏸ Future** (decided but deferred, with the blocker/why) · **✅ Shipped** (current baseline).
Surface it and let the user move items, add, cut. This is the alignment — don't skip the
dialog. If the grounding surfaced a thought that looks already-implemented or stale, **flag it
for the compaction pass rather than cleaning it inline mid-triage** — the
inventory/gather/present/write sequence in `reconcile-protocol.md` (run within this same
skill).

(The no-item-vanishes gate for this step is stated in full, verbatim, in the SKILL.md body's
Stance section — ADR-086.)

### Step 4 — Write `plan.md` (the agent index — and the only maintained artifact)

Lean, one layer, grouped by status. Each entry = **what to do + which thought to read** — no
prose essays. Shape per the spec's `plan.md` template.

**If the user wants to *see* the board right now**, that's not this skill's job: point them at
(or invoke) `shape-mockup` to render an on-demand board snapshot from the current `plan.md` +
`thoughts/` (filtered to `Status: in force`) — see blueprints-spec.md's board-snapshot contract.
align stops at writing `plan.md`; it never generates or maintains an HTML file.

## The seam with `nav` — don't blur it

align is **pre-build** (intent side). It ends at "decided + recorded in blueprints".
`nav-plan` is **build-side**: it takes a thought/spec and grounds it into a *codebase-level
implementation plan*. `blueprints/` is the hand-off artifact. They are adjacent verbs, not
overlapping — align triages forward into a status board; nav-plan grounds one item down into
code. Never produce a code-implementation plan here.

**Board currency is push-primary, align is the pull safety net (ADR-086).** The board's
staleness problem is structural: work ships through execution verbs that historically never
touched `plan.md`, so the board only healed when align was summoned — and it always lagged. The
fix mirrors the ledger/file-header pattern that demonstrably stays current ("change lands →
same commit updates the record"): `nav-do`'s fourth check gate and `nav-plan`'s board
close-out update the touched item at ship time (push); align's every-item verification (Step 2)
catches whatever bypassed them (pull). Neither side alone suffices — push keeps the board
honest daily, pull keeps it honest against undisciplined writers.

## Output

- `blueprints/plan.md` — lean, status-grouped index (created or refreshed); the single
  maintained artifact, agent- and human-readable.
- (First run) the scaffolded `blueprints/` tree.
- A chat summary: what moved between now/next/later, anything flagged as possibly-stale (→ the
  compaction pass), and — if the user wants a visual view — a pointer to run `shape-mockup` for
  an on-demand board snapshot.
