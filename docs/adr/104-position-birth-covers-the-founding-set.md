# ADR 104 — `shape:position` birth covers the founding set, not one root doc

**Status**: accepted
**Date**: 2026-07-28
**Refines**: [ADR-041](041-core-write-protocol-door-times-timing.md) (door × timing unchanged; the *scope* of the birth freeze moment widens)

## Context

`shape:position`'s graduation kernel read: "position guarantees ONE core file (the root positioning
doc). Every further core doc is **graduated**." The write protocol's timing gate listed "root-doc
birth" as a freeze moment, singular. The intended failure this prevented is real — pre-opened empty
core files, canon scaffolded before anything is ratified — but the one-file quota over-corrected,
and two field cases now show the actual grain of a founding:

- **tactus** birthed three of its four core docs directly on the project's *second day* (commit:
  "birth tactus canon" — `architecture.md`, `primitives.md`, `version-model.md`), and graduated
  exactly one (`recipe.md`, three weeks later) despite having 49 thoughts available to graduate.
  Under the one-root-then-graduate model this ratio should have been inverted. The born three and
  the graduated one are structurally indistinguishable in the canon — same header, same evolution
  log, same self-containment — only the 譜系 (lineage) line differs. Birth and graduation produce
  the same artifact; the quota was a process rule with no product behind it.
- **audion** followed the model as written and stalled: its `docs/core/` sat as a 262-byte
  placeholder for six days *past its met graduation gate*, while its founding definition (the
  `refoundation` thought, written on day one) was already canon-grade — a working definition
  mislabeled as a hypothesis because only the graduation door was open. The placeholder README
  itself legislated the lock: "claims belong in `thoughts/` until they are tested, implemented,
  and graduated." The board queued "graduate via `/shape:position`" and the summons never fired —
  a met gate with no trigger produces an indefinitely empty canon.

The root observation: **a project's founding understanding routinely spans more than one knowledge
domain on day one** (tactus: architecture / content kernel / version mechanism; audion: definition /
architecture / trust model). Forcing all but one domain through graduation delays canon precisely
at the moment the founding picture is clearest and the ratifier is most engaged.

## Decision

The birth freeze moment covers the **founding set**: at a founding summons, position may author one
core file **per knowledge domain the founding understanding already spans** — sized by the same
authority and altitude gates that govern every write, not by a file quota. Graduation remains the
growth channel for everything after birth.

Concretely:

- Kernel 4 reframes from "ONE core file, everything else graduates" to "**birth and graduation are
  both doors; freeze takes effect at birth.**" The anti-scaffolding rule stays verbatim — birth
  writes *ratified founding content*; it never pre-opens an empty file. The tell that separates
  them: scaffolding creates a file waiting for content; birth lands content that already passed
  the gates.
- The write protocol's timing gate ③ widens from "root-doc birth" to "founding landing — the
  founding set, one file per knowledge domain the founding understanding spans."
- A new anti-pattern lands beside "scaffold core files upfront": **a prescriptive placeholder in an
  empty `core/`**. A README that legislates "graduation only" becomes the lock that keeps canon
  empty (the audion case). An empty `core/` needs no README; the project board's Next item carries
  the intent.

## Rejected alternatives

- **Keep one-root-then-graduate and treat tactus as a violation.** The violation shipped the
  healthiest canon in the family; the rule, followed faithfully, shipped an empty directory. When
  the exception outperforms the rule twice, the rule is mis-scoped.
- **Drop graduation and make birth the norm forever.** Graduation is the correct channel once canon
  exists — it re-runs the gates against material that has survived churn, and it is how canon grows
  without a standing rewrite privilege. Only the *founding* moment was mis-modeled.
- **Auto-fire position when a graduation gate is met.** Tempting given the six-day stall, but the
  door gate (explicit summons only) is ADR-041's load-bearing half and stays. The stall is
  mitigated instead by the board carrying birth as an executable Next item rather than a ritual
  awaiting an unspecified trigger.

## Consequences

- `shape:position` SKILL.md: description line ("grown only by graduation" → born at founding,
  grown by graduation), kernel 4, and the anti-pattern table change; `references/write-protocol.md`
  timing ③ widens. No change to the door gate, the campaign loop, ingest-assess, altitude, or the
  amendments ledger.
- First consumer: audion's core birth (three files — `positioning.md` / `architecture.md` /
  `trust-model.md` — specified on its board 2026-07-28), which becomes the first birth run under
  the amended model rather than a rule-bend.
- Downstream projects with an empty `core/` and a met gate should check whether a prescriptive
  placeholder is holding the door shut.
