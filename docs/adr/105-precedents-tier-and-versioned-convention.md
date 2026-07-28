# ADR 105 — the precedents tier, a versioned convention, and the migrate verb

**Status**: accepted
**Date**: 2026-07-28
**Refines**: [ADR-026](026-reconcile-graduate-and-decisions-tier.md) (the decisions tier — its
single-file form becomes the legacy version), [ADR-041](041-core-write-protocol-door-times-timing.md)
(routing between the durable layers — unchanged in substance, renamed target)

## Context

ADR-026 gave the blueprints tree a durable-why tier: `decisions.md`, ONE curated file of
feature-sections. Field use in audion found two things wrong with it — one about the name, one
about the shape:

- **The name overstates agency.** Of the content that accumulated, only a minority was ever
  *decided*. Most entries were forced by experiments and then had to be accepted: "sub-7B ears are
  presumed fed-disqualified" was measured, not chosen; rules of evidence were "bought with
  retractions, not reasoned into existence" (the file's own words); a retracted-claims section
  existed precisely because the tier's real semantics are *binding-until-overturned*. That is the
  shape of **precedent** — established by something that happened, constraining what comes next,
  overturnable by a later case — and the file was already speaking legal vocabulary
  ("admissible", "what survives") under the wrong sign.
- **The single file has a scale ceiling.** Its one virtue is the two-minute read of the whole
  standing; past a dozen entries that virtue dies of length. audion hit ~280 lines across four
  content classes in six days of active work.

audion migrated live on 2026-07-28: `blueprints/precedents/` — **one precedent per dated file**
(`YYYY-MM-DD-<slug>.md`, each carrying a Status line, the 3-part body, and an `**Evidence.**`
pointer), **`index.md`** (a one-line-per-precedent table that restores the two-minute read), and
**`overruled.md`** (dead claims kept in the books with *what survives* per claim, because a
retracted claim that reads as live is worse than no claim at all). Laws that had accreted inside an
operational register migrated in; the register kept verdicts and pointed at the laws.

That rename orphaned the convention's readers: seven skill files across `shape` and `reflect`
resolve `decisions.md` by name, and three sibling projects still use the v1 single file. The
generalizable lesson is not "rename the file" — it is that **the artifact convention is itself a
versioned interface with living instances**, and this family had no mechanism for evolving it: no
version awareness in readers, no writer discipline for old trees, and no migration path. The next
convention change would orphan everything again.

## Decision

Three parts, one commit discipline.

**1. The durable-why tier is `blueprints/precedents/` (convention v2).** One precedent per dated
file · `index.md` as the standing table · `overruled.md` as the overturn record (overturning is an
entry, never a deletion). The 3-part section body (the call · how it shows up · what was
rejected), the retrieval-cost curation criterion, and the fold-forward discipline all carry over
from ADR-026 — fold-forward's target is now an `overruled.md` entry instead of a dropped section.
`decisions.md` (v1) remains a recognized **legacy** form.

**2. Readers are version-tolerant; writers write in-kind.** Every skill that reads the tier
accepts either form (prefer `precedents/` when present, else `decisions.md`). Every skill that
*writes* the tier (reconcile's graduate, elicit's Supersedes push) writes **in the tree's own
dialect** — a v1 tree gets a v1 section, never a half-migrated hybrid — and may mention
`/shape:migrate` once. Upgrading is exclusively migrate's job.

**3. `shape:migrate` is the convention's upgrade verb, and a convention change is not complete
until its migration entry exists.** The skill carries an append-only migration ledger
(M1: `decisions.md` → `precedents/`); any future ADR that changes the blueprints/core convention
must land its `M<n>` entry in the same commit — the spec change and its migration ship together.
Migrate is a **verbatim reorganizer**: it moves recorded content and repairs references; it never
judges staleness (reconcile's job) and never authors or re-decides content (elicit/position's
job).

## Rejected alternatives

- **Keep `decisions.md` and grow it with subsections.** The two-minute-read virtue dies of length
  anyway, and the name's agency problem remains. The field instance had already outgrown it.
- **Migrate all sibling projects in the same change.** Forcing a fleet migration couples one
  project's ratified rename to three projects nobody has audited. Version-tolerant readers make
  coexistence safe; each project migrates when summoned.
- **A version marker file in each tree.** Structure is self-describing (`precedents/index.md`
  present = v2; `decisions.md` present = v1), and a marker would be one more thing to drift.
  Detection by structure, with migrate as the only writer that changes which structure exists.
- **Fold migration into reconcile.** Reconcile judges *currency* with per-file gates; migration is
  a *structural* transform whose unit is the whole tree. Different verb, different safety shape —
  and reconcile's charter explicitly refuses decision-acts, while a migration is a ratified
  convention-act.

## Consequences

- `shape` gains the `migrate` skill and releases as 0.12.0; the blueprints spec
  (`align/references/blueprints-spec.md`) documents v2 as current, v1 as legacy, and the
  ship-with-migration rule.
- Seven referencing skill files go version-tolerant: reconcile (graduate's destination and the
  currency-sweep table), position's write-protocol (durable-layer routing), align (spec + board
  reads), mockup (board-snapshot data source), catchup and observe (durable-source lists).
- First live instance: audion (migrated by hand 2026-07-28, the shape M1 formalizes); gamut,
  tactus, and phonon remain v1 and valid until summoned.
