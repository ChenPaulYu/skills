# blueprints — the pre-build artifact convention

The container where converged pre-build decisions land and stay legible to **both** a human and an agent. `shape:align` writes into it; `shape:reconcile` keeps it honest; `shape:mockup` and `shape:elicit` feed it. Read this before generating or editing a blueprints tree.

## The one idea

> **One current state, one maintained render.** `plan.md` (+ `precedents/index.md`) is the only standing artifact — already plain, readable markdown, so there's no second file to keep in sync. A human wanting a visual view renders one **on demand via `/shape:mockup`**, disposable, never stored.

A description floats; a real artifact is decidable. blueprints is the standing version of shape's spine: the plan isn't a paragraph you re-read, it's a real board you point at — and when a visual is actually wanted, `/shape:mockup` renders it fresh rather than align maintaining a second copy.

## Layout

```
blueprints/
  thoughts/          ← committed. one .md per converged design decision (agent-facing, may be dense). the HOT working set — only in-flight design.
  precedents/        ← committed. the durable tier of what currently BINDS — one precedent per dated file (the call · how it shows up · what was rejected · evidence), index.md as the one-line-per-precedent standing table, overruled.md as the overturn record. graduated from shipped thoughts. (v1 legacy form: a single decisions.md — see Convention versions.)
  plans/             ← committed. one .md per grounded code-level plan from nav:plan (the build-side render of a thought).
  mockups/           ← committed. interactive HTML decision artifacts from shape:mockup (Pick logs + ratified samples) — plus, on request, a disposable board snapshot rendering plan.md + precedents/index.md for a human to browse.
  plan.md            ← committed. the lean status index — agent AND human read this directly.
```

> **`plan.md` (singular) vs `plans/` (plural)** are different things, deliberately: `plan.md` is align's lean *status index* (now/next/later); `plans/` holds nav:plan's *grounded implementation plans* (one per item, Context · Approach · Critical files · Verification). Intent → status → grounded-how.

- **`thoughts/`** — the design layer. Each file = one decision, dated, `YYYY-MM-DD-<topic>.md`. Written for the agent that will build it; density is allowed. The human normally does **not** read these directly — a board snapshot (rendered on demand by `/shape:mockup`, see below) distils them into plain language when wanted. This is the **hot working set**: it should hold only *in-flight* design — a thought that ships is `graduate`d (its *why* residue → `precedents/`) or pruned, so the set doesn't grow monotonically. (ADR-026/105)
- **`precedents/`** — the durable tier of **what currently binds** (owned by `shape:reconcile`'s `graduate` action; ADR-105). Named for its semantics: most entries were never *decided* — they were established by something that happened (an experiment, a shipped reality), they constrain what comes next, and a later case can overturn them. One precedent per dated file (`YYYY-MM-DD-<slug>.md`): a Status line (`in force` / `in force, not yet enforced in code` / `overruled`), the 3-part body — **the call** · **how it shows up in the system** · **what was rejected / deferred** — and an **`Evidence.`** pointer (a precedent whose evidence cannot be named is a belief). `index.md` is the standing table — one line per precedent, restoring the two-minute read the v1 single file had and lost to scale. `overruled.md` keeps dead claims in the books with **what survives** per claim, because a retracted claim that reads as live is worse than no claim at all — **overturning is an entry, never a deletion**. graduate lands a shipped thought's residue as a new dated file + an index row (or extends an existing precedent's dated amendment section). **Curation criterion — keep what git makes *expensive* to recover (a live call's *why* + rejected-alternatives), drop what it makes *cheap*:** retrieval cost is the test. High-level, plain language — *not* implementation (that's nav's `codebase-map`). A human view, when wanted, is a layer inside an **on-demand `/shape:mockup` board snapshot**. (ADR-026 → ADR-105)
- **`plans/`** — the grounding layer (owned by `nav:plan`). Each file = one item grounded into a code-level implementation plan, dated `YYYY-MM-DD-<slug>.md`. It's the build-side render of a thought; lives here so the whole arc (decision → status → grounded-how) stays in one tree. `shape:reconcile` keeps these current alongside `thoughts/` (a plan whose steps all shipped is stale, same as an implemented thought).
- **`mockups/`** — visual-decision artifacts (owned by `shape:mockup`), **committed**: they carry Pick logs and ratified samples, and thoughts/canon link into them — untracked means a single-disk record and dead links on clone. Individual artifacts remain *disposable in spirit* (most are superseded and never reopened), but the record stays in git. Root-level scratch may be ignored via a root-scoped `/mockups/`.
- **`plan.md`** — what to do, grouped by status. The agent's index — and, since it's plain markdown, directly human-readable too. Lean: only "what + which thought", no prose essays.

Where `blueprints/` itself lives is per-project (commonly `docs/blueprints/`). Ask once on first scaffold; remember it thereafter.

## Thought-doc shape — progressive disclosure (agent-scannable)

A `thoughts/` doc is agent-facing and may be dense — but **dense is not unstructured**. It must lead with its interface so an agent grasps it from the top without reading the body (the same interface-first principle as a `nav` file header; the markdown render of the click-to-reveal board the human gets):

```markdown
# <title> — <one-line role>

> <date> · <status: in-scope / future / superseded-by …> · <≤3-line TL;DR: what it decides, why>

## <section> — <leads with its point, not a build-up>
- <short bullet> · enumerations → tables · **key terms** bolded
```

Rules: `head -12` yields the gist (title + TL;DR + first sections). Each `##` states its conclusion first. Prefer tables for any enumeration, short bullets over paragraphs, bold for the load-bearing terms. A wall-of-prose thought is a rule-broken thought — fix the structure, don't ship the wall. (`/shape:elicit` produces docs in this shape; `/shape:mockup` distils their tops into a board snapshot's detail panels, on demand.)

## Three layers, one-way dependencies

| layer | artifact | audience | answers |
|---|---|---|---|
| WHAT (in-flight design) | `thoughts/*.md` | agent | what's being decided now, and why |
| WHY (what binds) | `precedents/*.md` (+ `index.md`) | agent | what currently binds and why · what was rejected · what was overturned (graduated from thoughts/) |
| HOW/NOW (status) | `plan.md` | agent + human | what we're doing now / next / later — the single maintained board |
| STATE (on-demand view) | a `/shape:mockup` board snapshot | human | rendered fresh when wanted from `plan.md` (status) **and** `precedents/index.md` (why), click-to-reveal — never stored |

Dependencies point **downstream only**: a board snapshot, when rendered, derives from `plan.md` + `precedents/`; each references `thoughts/`. Never the reverse. Rendering a snapshot must never become a place where new decisions are born — those belong in a thought. (One human surface: the *why* is a layer **inside** the snapshot, not a separate `decisions.html`.)

## `plan.md` shape

One layer, grouped by status. Each entry = **what to do + which thought to read** — nothing more.

```markdown
# <project> — plan

> <date> · status index (one layer, by status). Only "what to do + which doc".
> design in `thoughts/`; a visual view renders on demand via `/shape:mockup`.

## 🚧 In progress —— <one-line focus>
> design `thoughts/<file>.md`
- **<task>** — <one-line status / what's left>

## ▶ Next —— 接下來 / up next
- <task> (<terse note>)

## ⏸ Future —— deferred
> <common reason to defer>
- **<item>** — `thoughts/<file>.md` §<section> · blocked-by <id>

## ✅ Shipped
<comma-separated list of done things>。(detail in git log)
```

## Board-snapshot contract (rendered on demand by `/shape:mockup`)

When a human wants a visual view of the board, `/shape:mockup` generates it fresh by copying [`overview-template.html`](overview-template.html) and filling its data arrays from the current `plan.md` + `precedents/index.md` — **disposable, not committed as a standing file**, same disposal discipline as any other mockup artifact (see mockup's `SKILL.md`). Hard rules (in the template's top comment too):

- **One layer, grouped by status**: In progress · Next · Future, plus a Shipped strip. No nested IA.
- **Click-to-reveal**: each card shows title + one-liner; a **plain-language** detail expands on click. The human must not need to open a raw `thoughts/*.md`. Distil the thought into the detail panel.
- **A `🧭 Precedents` layer** (projected from `precedents/index.md`, per-file detail on expand): one card per precedent, **single-column** (so expanding one never stretches a row-mate), click-to-reveal. The expanded detail = **the call · how it shows up in the system · what was rejected** (plain language, high-level — never a sub-rule dump). Reuses the same card/expand mechanics as the status board.
- **Shipped shows only the most recent ~5** + a trailing `… +N earlier — see plan.md / git log` pill — the board is a scannable highlight, not the full changelog (that's `plan.md` + git).
- **Bilingual** (EN + zh-Hant) via the `T` dict + toggle. Never ship monolingual without explicit opt-out.
- **Self-contained**: inline CSS+JS, no build, no external assets.
- **Match the project's visual language**: if a sibling artifact (a codebase-map, a design-token file, prior mockups) sets a palette/font, reuse it. The neutral template tokens are only a starting point.
- **Footer** links the `thoughts/` docs (the agent-facing notes).

## Weight-adaptive

The number of `thoughts/` files is the weight knob for the design layer. A tiny effort may have a single `thoughts/` doc and a two-line `plan.md`; a large one accretes many thoughts + mockups. Don't force the full tree on a one-decision task; don't under-build a sprawling one. Same instinct as not forcing structure where there's none.

**There is no separate human-facing file to weight-adapt.** `plan.md` is always the single maintained board, at every scale — a solo project and a multi-reader product are the same shape here. When a human wants a visual, `/shape:mockup` renders one on demand (see the board-snapshot contract above); nothing is pre-scaffolded or kept in sync speculatively, so there is no drift risk to manage.

## Convention versions (ADR-105)

The tree layout above is **v2** (current, 2026-07-28). The convention is a versioned interface
with living instances; version is detected **by structure, never a marker file**:

| Version | Fingerprint | The durable-why tier |
|---|---|---|
| **v2** (current) | `blueprints/precedents/index.md` exists | `precedents/` folder — dated files + index + overruled |
| **v1** (legacy) | `blueprints/decisions.md`, no `precedents/` | ONE curated `decisions.md` of feature-sections (ADR-026) |

Rules of coexistence: **readers are version-tolerant** (prefer `precedents/` when present, else
read `decisions.md`); **writers write in-kind** (graduating into a v1 tree lands a v1 section —
never a half-migrated hybrid — and may mention `/shape:migrate` once); **upgrading is exclusively
`/shape:migrate`'s job** (its ledger's M1). And the standing rule that keeps the fleet safe:
**a convention change is not complete until its migration entry exists** — the spec change and its
`M<n>` ship in the same commit.

## The two seams with `nav`

blueprints is pre-build (intent side); `nav` is build / post-build (code side). They meet at two points — record both, don't blur them:

1. **`blueprints/` is the hand-off artifact to `nav:plan` — both directions.** *In:* `nav:plan` consumes a thought/spec and grounds it. *Out:* when a `blueprints/` tree is present, `nav:plan` writes its grounded plan **back into `blueprints/plans/`** (soft `nav → shape` preference, ADR-017), so the whole arc stays co-located. shape ends at "decided + recorded"; nav begins at "now build it against the code" — and the grounded plan lands back in the same tree.
2. **`shape:reconcile` consumes the file headers `nav:sync` maintains, and maintains `plans/` too.** Deciding whether a thought *or a grounded plan* is already implemented is far cheaper when load-bearing files carry `head -12` headers — exactly the signal reconcile reads to judge "shipped → stale". reconcile walks `thoughts/` **and** `plans/`; a plan whose steps all shipped is retired/amended like an implemented thought.
