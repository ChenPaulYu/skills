# Core write protocol — door × timing, with a visible-debt ledger

> **TL;DR:** Core (canon) gets written only through two stacked orthogonal gates — **door** (only an explicitly-summoned `/shape:position`; zero exceptions for any other verb or ambient chat) × **timing** (only at freeze-grade moments; mid-campaign rulings land in a campaign log, never write-through). Other verbs that hit a canon-should-update fact record a **pending amendment** (`docs/core/amendments.md` — co-located so the staleness warning sits where canon is read); position opens every summon by batch-reviewing that ledger; reconcile sweeps the ledger for its exit. Root cause: the old rule gated *content only* ("only Paul-confirmed direction enters") — it never gated *who* or *when*, so ruling got conflated with ratification.
>
> Status: converged 2026-06-11 (elicit session, Paul + agent; field evidence from the trackmate dogfood session — a `/nav:do` run legally hand-edited core, and a parallel session overwrote `plan.md`). Not yet implemented — lands as an ADR + position/reconcile SKILL.md changes. Consolidates the trackmate session's parallel record of the same convergence (merged 2026-06-11 — itself a live demo of the multi-writer hazard this protocol addresses).

## Symptom → root cause

Paul's felt symptom: core gets modified at a frequency and order that feels wrong, **during position campaigns**. Grounded root cause — an asymmetry in position's own canon: core file *creation* is freeze-gated (graduation: a thought passes the freeze test), but core *modification* is **write-through** (per-feeding surgical edits after an in-conversation ruling). The missing distinction: **ruling ≠ ratification** — a mid-campaign ruling is a hypothesis with authority; ratification is a ruling that survived the campaign's churn. The churn alarm's own existence (same-decision flips happen) is the evidence that in-conversation rulings are not freeze-grade.

A second structural gap surfaced en route: two durable layers exist — `docs/core/` (position's) and `blueprints/decisions.md` (reconcile's) — with **no altitude routing between them**, and reconcile doesn't know core exists.

## The protocol (the decided rules)

### 1. Door × timing — two orthogonal gates, both must pass

- **Door (who):** only an explicitly-summoned `/shape:position` writes core. Every other verb (`nav:do`, `align`, `build`, …) and all ambient conversation: never — zero exceptions. This collapses the "is this ratified?" judgment, previously scattered across every would-be writer, into one owner. (Field case that motivated it: a `nav:do` run legally synced core 30s after a ruling — safe only because the decision was fresh and Paul present; the same move by a sub-agent or in an absent-user session is pure drift.)
- **Timing (when):** inside the door, core is writable only at freeze-grade moments:
  1. **Campaign close** — after the re-audit (altitude test + first-principles self-audit), the campaign log's surviving rulings batch-diff into core. Every position summon **opens by batch-reviewing the pending-amendments ledger** (it is the first feeding).
  2. **Explicit per-item freeze order** mid-campaign ("lock this into canon") — that item graduates on the spot; the default for everything else is the log.
  3. **Root doc birth** — the campaign's founding landing is a freeze moment by definition (authority + altitude gates still run).

  Outside these, core is read-only — **including for position's own mid-campaign rulings**, which write-through to the **campaign log** (a dated, thoughts/-class doc; campaigns span days and conversations evaporate, so the working surface must be durable). Delta reports compute against core + log union. Graduation thereby loosens correctly: it is the most common *form* of freeze, not the only one.

### 2. Pending amendments — the visible-debt ledger

The door creates a lying window (ship a change → core's entry is stale until the next position summon). Fix: any verb hitting a canon-should-update fact writes **one ledger line** (what changed · evidence pointer) to **`docs/core/amendments.md`** — never core itself. The board may surface "canon behind by N". Staleness turns from a silent lie into visible debt.

- **Co-location is load-bearing**: the warning must sit where canon is *read* — a core reader sees the debt; a ledger buried in `blueprints/` is invisible to exactly the person who needs it (and `blueprints/` may not exist in every project that has core).
- **Nature**: a pending amendment is a *queued feeding* with provenance pre-tagged (reality/shipped-code grade, not user-ruling grade); position's ingest-assess consumes it like any other material — guard included.
- **Exit (mandatory)**: reconcile's sweep covers the ledger — absorbed entries → prune; reality-reversed entries → prune/amend. A grow-only layer is the ADR-026 bug; this family has now hit it in `thoughts/` (ADR-026), `plans/` (ADR-017), and `mockups/` (ADR-037) — the ledger does not get to be the fourth.

### 3. Reconcile reminds, position writes — altitude routing between the two durable layers

reconcile's sweep gains one look through the altitude instrument: a thought judged **settled + axiom/principle-grade** (defines what the thing IS, not why it's built this way) gets the verdict **`canon-grade → recommend /shape:position graduation`** — a reminder, never a write (same pattern as its existing decision-change → recommend `/shape:elicit` hand-off). Routing rule: **approach / bet / feature-why → `decisions.md`** (reconcile graduates it itself); **axiom / principle → core** (reminder; position does the writing). Without this, a canon-grade thought's best outcome at sweep time is demotion into decisions.md.

## Why the old rule leaked (for the record)

The pre-existing protection was content-only ("core admits only Paul-confirmed direction"), so any verb in any session could self-judge "this counts as confirmed" and write — three chronic risks, all field-witnessed or near-witnessed on 2026-06-11: altitude drift (each writer "just syncs facts" plus a few explaining sentences; ten writes later the constitution is a wiki), scattered judgment (no single owner of "is it ratified"), and multi-writer collisions.

The trackmate field evidence, in full (concrete, 2026-06-11):

1. **A non-position verb wrote core, legally.** Landing the new Mate Board logomark via `/nav:do`, the agent updated `docs/core/design.md` (Icon entry) and `docs/core/position.md` (視覺定調 clause) in the same change — legal under the content-only rule, since Paul had picked E2 in a mockup thirty seconds earlier. Note the active pressure: the freshness law ("stale header = lie, fix same-commit"), applied to canon, *pushed* the agent to write. Safe this once because the decision was fresh and Paul present; the same maneuver by a sub-agent "just syncing" or an ambient conversation deciding "this probably counts" is exactly the drift the rule exists to prevent.
2. **Multi-writer hazard, same day.** `blueprints/plan.md` + `overview.html` were overwritten twice by a concurrent session running reconcile/align from stale context, clobbering a just-written shipped entry. If the *status board* suffers write races, the *constitution* cannot be left multi-writer.

**Orthogonality proof from the live case:** the logomark write passes timing (Paul ratified the pick) but fails door (writer was `nav:do`) — one case, two gates, two different verdicts, so the axes measure different things. The door is information hiding applied to canon authority: the "does this belong in core?" judgment lives in exactly one verb (sub-agents doubly excluded — they inherit no canon authority from their parent).

## Side benefit

The churn alarm sharpens: same-decision flips now happen in the campaign log, so core's evolution log stops recording mid-campaign oscillation and records only **diffs between frozen versions** — a version history of canon, not meeting minutes.

## Pointers

- Implementation: ADR + `position` SKILL.md (timing gates, campaign log, ledger ingestion), `reconcile` SKILL.md (ledger sweep + canon-grade reminder), shape `CLAUDE.md` (door rule is family-level), site-map sync — same change-set.
- Open (small): exact ledger line format; whether "canon behind by N" lands on the board or stays a core-folder concern; **whether the freshness law needs an explicit carve-out** — "stale canon = tracked debt (ledger entry)" vs "stale header = fix in same commit" — so agents stop feeling the same-commit pressure that caused field sighting #1.
- Related: ADR-038 (the verb is the only door for its deliverable — the door gate is its core-layer instance) · ADR-026/017/037 (the grow-only-layer lineage behind the ledger's mandatory exit).
- Lineage: [`2026-06-10-position-verb-canon-campaign.md`](2026-06-10-position-verb-canon-campaign.md) (the verb this gate attaches to, ADR-035) · [`2026-06-03-ambient-discipline-suppresses-firing-the-verb.md`](2026-06-03-ambient-discipline-suppresses-firing-the-verb.md) + [`2026-06-11-suppression-moves-up-ambient-converge-bypasses-the-wired-seam.md`](2026-06-11-suppression-moves-up-ambient-converge-bypasses-the-wired-seam.md) (same family: ambient flow bypassing a wired seam — this is the canon-write instance, and the door is its structural fix: ambient *can't* bypass what it has no authority to write) · [`2026-06-10-churn-is-an-altitude-alarm.md`](2026-06-10-churn-is-an-altitude-alarm.md) (the accretion/altitude failure the door guards against).
- Evidence: trackmate `docs/core/design.md` Icon entry (Mate Board, 2026-06-11) + that session's `plan.md` double-clobber.
