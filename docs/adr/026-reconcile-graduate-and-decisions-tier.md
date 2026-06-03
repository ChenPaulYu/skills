# ADR 026 — `reconcile:graduate` + a `decisions/` tier: the exit ramp for shipped docs that still hold rationale

**Status**: accepted
**Date**: 2026-06-03
**Builds on**: [ADR-010](docs/adr/010-shape-blueprints-workflow.md) (the blueprints tree + reconcile), [ADR-014](docs/adr/014-reconcile-amend-and-elicit-boundary.md) (amend syncs facts, never re-decides)
**Mirrors**: [ADR-003](docs/adr/003-five-skills-not-four-or-six.md) / [ADR-013](docs/adr/013-diagnosis-folds-into-elicit.md) (resist skill proliferation — fold into the verb whose mandate fits)
**Origin**: [`docs/observations/2026-06-03-reconcile-needs-graduate-and-a-decisions-tier.md`](docs/observations/2026-06-03-reconcile-needs-graduate-and-a-decisions-tier.md) (a real Crate doc-hygiene session, friction-tested through four reframes)

## Context

reconcile retires a `thoughts/` doc two ways: **prune** (→ gone) or **consolidate** (thought → another thought). Neither retires a doc that is **shipped yet still holds durable rationale** — the *why this shape* and especially the *rejected alternatives*. Pruning loses the rationale; consolidate has no in-flight thought to merge *into* (decision-history isn't active design). So reconcile's only legal move is **amend (sync status) + keep** — and the doc stays forever.

→ Every shipped feature leaves a doc that can't leave. `thoughts/` grows monotonically. (Surfaced on Crate at 10 docs, ~half "shipped-but-kept"; the trajectory is the bug, not the count.)

The root cause is structural: the blueprints tree (ADR-010 — `thoughts/` · `mockups/` · `plan.md` · `overview.html`) has **no durable decisions tier**. reconcile has the right mandate ("retire once reality absorbs it") but nowhere to retire durable residue *to*. The marketplace has `docs/adr/` for itself; projects using shape had no equivalent.

The unlocking reframe: **a thought is a mix of three lifecycles**, and bloat is the failure to route them — status (→ `plan.md`, align owns it), how-it-works (→ `codebase-map`, nav:sync owns it), and **why / rejected-alternatives** (immutable decision residue → *no home*). The naive fix ("promote thought → *feature* doc") is wrong twice: how-it-works already lives in nav's map (a parallel feature tier would drift against it), and a feature doc sheds the rejected-alternatives — the one thing that made the doc un-prunable.

## Decision

**1. The blueprints convention gains a 4th committed dir: `decisions/`.** The project-level analog of this repo's `docs/adr/`. Durable, addressable-per-decision, holds *why this shape* + *what was rejected and why*. It is **not** a feature-doc tier — "how it works now" stays in nav's `codebase-map`; `decisions/` is only the *why*.

**2. reconcile gains a `graduate` action.** When evidence shows *shipped + holds durable residue + no active design left*: distill the residue into a `decisions/` record → **prune** the emptied thought. This is reconcile's missing exit ramp — "retire **with** a forwarding address" instead of "retire to trash". It **folds into reconcile, not a new skill** (ADR-003/013), and respects the ADR-014 amend boundary: graduate *relocates* an existing decision's record, it never authors a new one (faithful distillation, same evidence-driven character as amend).

**3. `decisions/` stays clean: fold-forward + prune, not a keep-with-status graveyard.** When a later decision reverses an old one, **fold the tombstone forward** into the successor (`Supersedes: X — because Z`); if X is abandoned with no successor, write a standalone live `Rejected: X — because Z` decision. Then **prune the old file**. Every `decisions/` entry is thus *currently operative*; the anti-re-litigation guard lives in a *live* decision, not a corpse; **git is the deep archive** for the full original argument. This reuses reconcile's existing **consolidate** (merge → verify → remove) — no new "mark-superseded" mode.

**4. reconcile runs a two-tier currency sweep.** `thoughts/` predicate = "implemented yet?" (→ graduate / prune / amend). `decisions/` predicate = "**still operative, or superseded?**" (→ consolidate-forward + prune). The sweep also adds a genuinely new dimension: **"do any two live decisions contradict each other?"** — separately-converged decisions can quietly conflict, which per-doc currency won't catch. Detection is push-primary (a reversing decision authored in `elicit` declares `Supersedes: X` at birth) + pull-safety-net (reconcile's sweep catches what elicit missed).

**5. No "confirm-consensus" skill.** Consensus is a *property*, not a verb: converge verbs (elicit/mockup) produce it, reconcile maintains it. It lives at three already-owned time-points — birth (elicit: converging *with the user* IS consensus), graduation (the graduate write-gate + ADR-018's evidence test), over-time (reconcile's decisions/ sweep). A consensus skill = structure-theatre that double-counts. (If shape ever serves a *multi-person* team needing formal sign-off, a `ratify` verb could earn its place; for solo it's YAGNI.)

**Naming**: the action is **`graduate`**, not `promote` — "promotion" is already ADR-018's observation→skill/ADR ladder.

## Why

- **Routes by lifecycle, not by relabel.** Naive "thought → feature doc" just moves the bloat (50 thoughts → 50 feature docs) and sheds rejected-alternatives. Sending each part of a shipped thought to the artifact whose lifecycle matches (status→plan, how→map, why→decisions) is what actually shrinks the hot working set.
- **Clean beats graveyard — and is the smaller change.** Fold-forward+prune keeps `decisions/` all-live, reuses `consolidate`, and needs no new "mark-superseded" mode. It matches the consuming project's own ontology (Crate's *citation not corpus* / *live reference not copy*): distilled essence forwards, dead corpus dropped, git holds history.
- **Deliberate divergence from our own `docs/adr/`.** This repo keeps superseded ADRs with a `Status` flag (low-volume *meta-history*, cheap and valuable to keep). A project's `decisions/` is operational and wants to stay clean. Different contexts, different rule — named so it stays a choice, not an accident.
- **The gap was an exit ramp, not a broken verb.** reconcile already meant "retire once absorbed"; it just lacked a destination. Adding `decisions/` completes the loop without a new skill.

## Consequences

- `plugins/shape/skills/align/references/blueprints-spec.md`: add `decisions/` to the Layout + the layers table (now four), and note it's the *why* tier (how-it-works stays in nav's `codebase-map`).
- `plugins/shape/skills/reconcile/SKILL.md`: add the `graduate` verdict + action, the two-tier currency sweep (incl. cross-decision contradiction), and the fold-forward+prune supersession discipline. Frontmatter description + triggers updated.
- `docs/site/index.html`: ADR count 25 → 26.
- Roster unchanged: **no new skill** (graduate folds into reconcile; no consensus skill) — ADR-003 stands, not amended.
- Seam preserved: `decisions/` holds *why*; nav's `codebase-map` holds *how* — the two must not both claim "current truth" (drift risk).

## Notes

- Self-applying: this ADR was graduated from a `maturing` observation that cleared ADR-018's dense-session gate (grounded · friction-tested through four reframes · principle-level). If a future session reverses it, ADR-026 gets `Status: superseded` and the body stays as "we decided this, here's why we changed" — the very protocol it defines, one level up.
