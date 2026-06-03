# blueprints — the pre-build artifact convention

The container where converged pre-build decisions land and stay legible to **both** a human and an agent. `shape:align` writes into it; `shape:reconcile` keeps it honest; `shape:mockup` and `shape:elicit` feed it. Read this before generating or editing a blueprints tree.

## The one idea

> **One current state, two renders.** An agent reads markdown; a human reads an interactive HTML projection. Both are views of the *same* present reality — never two sources that can drift.

A description floats; a real artifact is decidable. blueprints is the standing version of shape's spine: the plan isn't a paragraph you re-read, it's a real board you point at.

## Layout

```
blueprints/
  thoughts/          ← committed. one .md per converged design decision (agent-facing, may be dense). the HOT working set — only in-flight design.
  decisions/         ← committed. durable *why* residue graduated from a shipped thought (rejected alternatives + why-this-shape). the project-level analog of docs/adr/.
  plans/             ← committed. one .md per grounded code-level plan from nav:plan (the build-side render of a thought).
  mockups/           ← git-ignored. disposable interactive HTML from shape:mockup.
  plan.md            ← committed. the lean status index (agent-facing).
  overview.html      ← committed. the human-facing projection of plan.md (click-to-reveal, bilingual).
```

> **`plan.md` (singular) vs `plans/` (plural)** are different things, deliberately: `plan.md` is align's lean *status index* (now/next/later); `plans/` holds nav:plan's *grounded implementation plans* (one per item, Context · Approach · Critical files · Verification). Intent → status → grounded-how.

- **`thoughts/`** — the design layer. Each file = one decision, dated, `YYYY-MM-DD-<topic>.md`. Written for the agent that will build it; density is allowed. The human normally does **not** read these — they read `overview.html`, whose detail panels distil the thoughts into plain language. This is the **hot working set**: it should hold only *in-flight* design — a thought that ships is `graduate`d (its *why* residue → `decisions/`) or pruned, so the set doesn't grow monotonically. (ADR-026)
- **`decisions/`** — the durable *why* layer (owned by `shape:reconcile`'s `graduate` action). Each file = the decision residue distilled from a shipped thought: *why this shape* + *what was rejected and why*, the part not recoverable from code. **Stays clean**: every entry is *currently operative* — a reversed decision is folded forward into its successor (`Supersedes: X — because Z`) or recorded as a live `Rejected: X — because Z`, then the old file is pruned (git is the deep archive). It is **not** a how-it-works/feature tier — that lives in nav's `codebase-map`; `decisions/` carries only the *why*, so the two never both claim "current truth". (ADR-026)
- **`plans/`** — the grounding layer (owned by `nav:plan`). Each file = one item grounded into a code-level implementation plan, dated `YYYY-MM-DD-<slug>.md`. It's the build-side render of a thought; lives here so the whole arc (decision → status → grounded-how) stays in one tree. `shape:reconcile` keeps these current alongside `thoughts/` (a plan whose steps all shipped is stale, same as an implemented thought).
- **`mockups/`** — disposable visual-decision scaffold (owned by `shape:mockup`). git-ignored: artifacts are decision-scaffold, not source. A committed thought may *reference* a mockup path as its visual record.
- **`plan.md`** — what to do, grouped by status. The agent's index. Lean: only "what + which thought", no prose essays.
- **`overview.html`** — the same plan, rendered for a human to scan and click. Generated from the template; reflects current reality.

Where `blueprints/` itself lives is per-project (commonly `docs/blueprints/`). Ask once on first scaffold; remember it thereafter.

## Thought-doc shape — progressive disclosure (agent-scannable)

A `thoughts/` doc is agent-facing and may be dense — but **dense is not unstructured**. It must lead with its interface so an agent grasps it from the top without reading the body (the same interface-first principle as a `nav` file header; the markdown render of the click-to-reveal board the human gets):

```markdown
# <title> — <one-line role>

> <date> · <status: in-scope / future / superseded-by …> · <≤3-line TL;DR: what it decides, why>

## <section> — <leads with its point, not a build-up>
- <short bullet> · enumerations → tables · **key terms** bolded
```

Rules: `head -12` yields the gist (title + TL;DR + first sections). Each `##` states its conclusion first. Prefer tables for any enumeration, short bullets over paragraphs, bold for the load-bearing terms. A wall-of-prose thought is a rule-broken thought — fix the structure, don't ship the wall. (`/shape:elicit` produces docs in this shape; `/shape:align` distils their tops into the overview's detail panels.)

## Three layers, one-way dependencies

| layer | artifact | audience | answers |
|---|---|---|---|
| WHAT (in-flight design) | `thoughts/*.md` | agent | what's being decided now, and why |
| WHY (durable residue) | `decisions/*.md` | agent | why a shipped thing is shaped this way · what was rejected (graduated from thoughts/) |
| HOW/NOW (status) | `plan.md` | agent | what we're doing now / next / later |
| STATE (projection) | `overview.html` | human | the same, scannable + click-to-reveal |

Dependencies point **downstream only**: `overview.html` derives from `plan.md`, which references `thoughts/`. Never the reverse. Regenerating `overview.html` must never become a place where new decisions are born — those belong in a thought.

## `plan.md` shape

One layer, grouped by status. Each entry = **what to do + which thought to read** — nothing more.

```markdown
# <project> — plan

> <date> · status index (one layer, by status). Only "what to do + which doc".
> design in `thoughts/`, visual in `overview.html` + `mockups/`.

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

## `overview.html` contract

Generate by copying [`overview-template.html`](overview-template.html) and filling its data arrays. Hard rules (in the template's top comment too):

- **One layer, grouped by status**: In progress · Next · Future, plus a Shipped strip. No nested IA.
- **Click-to-reveal**: each card shows title + one-liner; a **plain-language** detail expands on click. The human must not need to open a raw `thoughts/*.md`. Distil the thought into the detail panel.
- **Bilingual** (EN + zh-Hant) via the `T` dict + toggle. Never ship monolingual without explicit opt-out.
- **Self-contained**: inline CSS+JS, no build, no external assets.
- **Match the project's visual language**: if a sibling artifact (a codebase-map, a design-token file, prior mockups) sets a palette/font, reuse it. The neutral template tokens are only a starting point.
- **Footer** links the `thoughts/` docs (the agent-facing notes).

## Weight-adaptive

The number of files is the weight knob. A tiny effort may have a single `thoughts/` doc and skip `overview.html` until the plan is worth a board. A large one accretes many thoughts + mockups. Don't force the full tree on a one-decision task; don't under-build a sprawling one. Same instinct as not forcing structure where there's none.

## The two seams with `nav`

blueprints is pre-build (intent side); `nav` is build / post-build (code side). They meet at two points — record both, don't blur them:

1. **`blueprints/` is the hand-off artifact to `nav:plan` — both directions.** *In:* `nav:plan` consumes a thought/spec and grounds it. *Out:* when a `blueprints/` tree is present, `nav:plan` writes its grounded plan **back into `blueprints/plans/`** (soft `nav → shape` preference, ADR-017), so the whole arc stays co-located. shape ends at "decided + recorded"; nav begins at "now build it against the code" — and the grounded plan lands back in the same tree.
2. **`shape:reconcile` consumes the file headers `nav:sync` maintains, and maintains `plans/` too.** Deciding whether a thought *or a grounded plan* is already implemented is far cheaper when load-bearing files carry `head -12` headers — exactly the signal reconcile reads to judge "shipped → stale". reconcile walks `thoughts/` **and** `plans/`; a plan whose steps all shipped is retired/amended like an implemented thought.
