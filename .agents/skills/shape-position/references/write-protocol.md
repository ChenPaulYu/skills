# The core write protocol — door × timing, with the amendments ledger (ADR-041)

> Core (canon) is **single-writer and freeze-gated**: only an explicitly-summoned `shape-position` ever writes it (door), and even position writes only at freeze moments (timing) — everything else, including position's own mid-campaign rulings, lands elsewhere. This reference holds the full protocol; `SKILL.md` carries the kernel. Origin: `docs/observations/2026-06-11-core-write-protocol.md`.

## Root cause this fixes

The old protection was **content-only** ("core admits only user-confirmed direction") — it never gated *who* or *when*. So any verb in any session could self-judge "this counts as confirmed" and write, producing three chronic risks (all field-witnessed 2026-06-11): altitude drift (each writer "just syncs facts" plus a few explaining sentences; ten writes later the constitution is a wiki), scattered judgment (no single owner of "is it ratified?"), and multi-writer collisions (the same day, a parallel session double-clobbered a `plan.md`). The missing distinction: **ruling ≠ ratification** — a mid-campaign ruling is a hypothesis with authority; ratification is a ruling that survived the campaign's churn (the churn alarm's existence is the proof such flips happen).

## Gate 1 — the door (who)

**Only an explicitly-summoned `shape-position` writes core. Zero exceptions** — not `nav-do`, not `build`, not `align`, not ambient conversation, and not sub-agents (doubly excluded: they inherit no canon authority from their parent). This is information hiding applied to canon authority: the "does this belong in core?" judgment lives in exactly one verb, so no other verb can get it wrong. It is ADR-038's clause at the canon layer — the verb is the only door for its deliverable.

**Orthogonality** (field-proved): a ship whose content the user ratified 30 seconds earlier passes *timing* but fails *door* when written by `nav-do` — one case, two gates, two verdicts; the axes measure different things.

## Gate 2 — timing (when)

Inside the door, core is writable **only at freeze moments**:

1. **Campaign close** — after the re-audit (altitude test + `frame-first-principles` self-audit), the campaign log's surviving rulings **batch-diff** into core.
2. **Explicit per-item freeze order** — the user says "lock this into canon" mid-campaign; that item graduates on the spot (authority + altitude gates still run). The escape hatch, not the default.
3. **Root-doc birth** — the campaign's founding landing is a freeze moment by definition.

Outside these, core is **read-only — including for position's own mid-campaign rulings**, which land in the campaign log. Graduation thereby loosens correctly: it is the most common *form* of freeze, not the only one.

## The campaign log

A dated, `thoughts/`-class doc — the campaign's durable working surface. Campaigns span days and conversations evaporate, so rulings must land somewhere durable that isn't core. Mid-campaign surgical edits target **the log, not core** (the surgical discipline is unchanged; the object under the knife changed). Delta reports compute against the **core + log union**. Side benefit: core's evolution log stops recording mid-campaign oscillation and records only **diffs between frozen versions** — a version history of canon, not meeting minutes; the churn alarm sharpens for the same reason (flips now visibly pile up in the log).

## The pending-amendments ledger — `docs/core/amendments.md`

The door creates a lying window: a ship changes a canon fact, and core is stale until the next summon. The fix turns the silent lie into **visible debt**:

- **Any other verb** hitting a canon-should-update fact appends **one ledger line** — never touches core:
  ```
  - [ ] 2026-06-11 <what fact changed> — evidence: <path / commit / mockup> (by nav-do)
  ```
- **Co-location is load-bearing**: the ledger lives next to what it amends, so a core *reader* sees the debt ("canon behind by N"). A ledger buried in `blueprints/` is invisible to exactly the person who needs it — and `blueprints/` may not exist in every project that has core. (Board-rendering the count is deferred until the debt proves easy to miss — don't scaffold upfront.)
- **Position consumes it as each summon's FIRST feeding**: a queued feeding with provenance pre-tagged (reality/shipped-code grade, not user-ruling grade) — ingest-assess runs as usual, guard included; absorb or reject per item, check off / remove the line.
- **Exit — reconcile sweeps the ledger**: absorbed entries → prune; reality-reversed entries → prune/amend. A grow-only layer is the ADR-026 bug; this family hit it in `thoughts/` (ADR-026), `plans/` (ADR-017), and `mockups/` (ADR-037) — the ledger doesn't get to be the fourth.

## The freshness-law carve-out

The freshness law ("stale header = lie, fix in the same commit") actively *pushed* the field incident — the agent felt same-commit pressure to sync canon. The carve-out, stated wherever the freshness law is:

> **Stale header = fix in the same commit. Stale canon = log a ledger line (tracked debt) — never a direct core edit.**

## Routing between the two durable layers (reconcile's side)

`docs/core/` (position's) and `blueprints/decisions.md` (reconcile's) are both durable; route by altitude: **approach / bet / feature-why → `decisions.md`** (reconcile graduates it itself); **settled axiom / principle → core** (reconcile *recommends* `shape-position` graduation — a reminder, never a write; same hand-off pattern as its decision-change → `shape-elicit`). Without this, a canon-grade thought's best sweep outcome is demotion into decisions.md.
