# ADR 041 — canon is single-writer and freeze-gated: the core write protocol (door × timing + the amendments ledger)

**Status**: accepted
**Date**: 2026-06-11
**Plugin**: marketplace-level convention (lands in both `nav/CLAUDE.md` and `shape/CLAUDE.md`; protocol home is `shape:position`)
**Refines**: [ADR-035](docs/adr/035-position-canon-authoring-verb.md) (position's per-feeding surgical edits now target the campaign log, not core) · [ADR-038](docs/adr/038-verb-is-the-only-door-for-its-deliverable.md) (the door gate is its clause applied at the canon layer)
**Origin**: [`docs/observations/2026-06-11-core-write-protocol.md`](docs/observations/2026-06-11-core-write-protocol.md) — converged in an elicit session (Paul + agent), with live field evidence from the trackmate dogfood session, consolidated from two parallel records (itself a multi-writer demo).

## Context

The protection on a project's canon docs (`docs/core/*`-class — its constitution) was **content-only**: "core admits only user-confirmed direction". It gated neither *who* writes nor *when*, so any verb in any session could self-judge "this counts as confirmed" and write. Field evidence (trackmate, 2026-06-11): a `/nav:do` run legally hand-synced two core docs 30 seconds after a ratified pick — actively *pushed* by the freshness law's same-commit pressure — and the same day a parallel session double-clobbered a `plan.md` (if the status board suffers write races, the constitution cannot stay multi-writer). Inside position itself, the symptom Paul reported was core churning during campaigns: per-feeding surgical edits wrote core on in-conversation rulings. The missing distinction: **ruling ≠ ratification** — a mid-campaign ruling is a hypothesis with authority; ratification is a ruling that survived the campaign's churn (the churn alarm's existence proves such flips happen). A second gap: the family's two durable layers — `docs/core/` (position's) and `blueprints/decisions.md` (reconcile's) — had no altitude routing, and reconcile didn't know core existed: a canon-grade thought's best sweep outcome was demotion into decisions.md.

## Decision

**Core writes pass two orthogonal gates, and staleness becomes a visible debt:**

1. **Door (who)** — only an explicitly-summoned `/shape:position` writes core; every other verb, ambient conversation, and sub-agents (no inherited authority): never. The "does this belong in core?" judgment gets exactly one owner — information hiding applied to canon authority. Orthogonality is field-proved: the trackmate write passed timing (user-ratified content) but failed door (writer was `nav:do`) — one case, two gates, two verdicts.
2. **Timing (when)** — inside the door, core is writable only at **freeze moments**: ① campaign close (post-re-audit batch-diff of the campaign log's surviving rulings) · ② an explicit per-item freeze order ("lock this into canon") · ③ root-doc birth. Outside these, core is read-only **including for position's own rulings**, which land in a **campaign log** (a dated, `thoughts/`-class durable working surface; delta reports compute against core + log union). Graduation loosens correctly: the most common *form* of freeze, not the only one.
3. **The pending-amendments ledger — `docs/core/amendments.md`** — closes the lying window the door opens: any other verb hitting a canon-should-update fact appends one line (`- [ ] <date> <what changed> — evidence: <pointer> (by <verb>)`), never touches core. **Co-located with core** so the staleness warning sits where canon is *read* (a `blueprints/` home would hide it from exactly the reader who needs it, and blueprints may not exist where core does). Position consumes the ledger as **each summon's first feeding** (provenance pre-tagged: reality-grade); **reconcile sweeps its leftovers** — the mandatory exit, so the ledger doesn't become the fourth grow-only layer (ADR-026 `thoughts/` · ADR-017 `plans/` · ADR-037 `mockups/`).
4. **Freshness-law carve-out** (landed in both plugin CLAUDE.md files): stale header = fix in the same commit; **stale canon = ledger entry (tracked debt), never a direct edit**. Without this, the same-commit pressure that caused the field incident keeps firing.
5. **Altitude routing between the durable layers** (reconcile's side): approach / bet / feature-why → `decisions.md` (reconcile graduates itself); settled axiom / principle → core via a new **canon-grade** verdict — *recommend* `/shape:position`, never write (the decision-change → `/shape:elicit` hand-off pattern).

## Defaults ruled at implementation (reversible)

- Ledger line format: one-line markdown checklist entry (above).
- "Canon behind by N" stays a core-folder concern — no `align`/overview render until the debt proves easy to miss (no upfront scaffolding).
- nav's clause is shape-independent: the ledger is a file convention, working with or without the shape plugin installed.

## Consequences

- position: surgical discipline unchanged, the object under the knife changed (log, not core); core's evolution log becomes a version history of frozen diffs, not meeting minutes; the churn alarm sharpens (flips pile up visibly in the log).
- `nav:do` check gate 1 and `build`'s land step carry the carve-out inline; `reconcile` gains the ledger row + canon-grade verdict.
- The protocol's full text lives in `plugins/shape/skills/position/references/write-protocol.md`; SKILL.mds carry kernels only.
