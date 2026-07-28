# ADR 106 — core grows by ratification, not provenance

**Status**: accepted
**Date**: 2026-07-28
**Refines**: [ADR-104](104-position-birth-covers-the-founding-set.md) (birth as a first-class
entrance), [ADR-041](041-core-write-protocol-door-times-timing.md) (door × timing unchanged; the
*labels* on timing's channels change)

## Context

`shape:position`'s growth model privileged one provenance: "core grows by graduation" — a thought
passes the freeze test and becomes canon. The per-item freeze order ("lock this into canon",
timing gate ②) was labeled "the escape hatch, not the default". ADR-104 had already widened birth;
graduation remained the named growth channel for everything after.

Field evidence, same day as ADR-104's first consumer, says the labels are backwards:

- **audion, day one of its canon:** three positioning-level rulings (taste-is-a-parameter,
  configured-divergence-is-the-feature, accuracy-by-subtraction plus its best-practice completion)
  landed within hours of birth — **all three from live conversation via per-item freezes, zero
  from graduated thoughts**. Each followed the same shape: a discussion touched core, the wording
  was sharpened in-conversation, the user said lock, canon was updated with an Evolution entry.
- **tactus, the only mature canon in the family:** one graduation in four core files, with 49
  thoughts available to graduate.

The pattern: **when the user is engaged, canon-touching understanding converges in conversation,
and routing it through a thought first adds a lap without adding scrutiny** — the gates that
actually protect canon (user ratification, principle altitude, the single-writer door) are
provenance-independent. The "escape hatch" was doing primary-channel work under an apologetic
label, which pressures agents to either manufacture a thought for form's sake or treat legitimate
conversational rulings as exceptions.

## Decision

**Entrances and gates separate. One gate set, many equal entrances.**

- **The gates (unchanged, provenance-independent):** authority — the user explicitly ratified
  this exact content (*ruling ≠ ratification* stands: a passing remark never writes canon; an
  explicit lock does) · altitude — principle-level, per the altitude instrument · the door —
  only a summoned `/shape:position` writes, at a freeze moment, with an Evolution entry.
- **The entrances (equal, none privileged):** founding **birth** (ADR-104) · a **graduated
  thought** (the entrance whose material is a thought — the freeze test is just the authority
  gate applied to older material) · a **core-touching conversational ruling** (discussion touches
  core → converge → user locks → update; formerly "the escape hatch") · the **amendments ledger**
  (other verbs' queued debt, adjudicated at each summons).

A core-touching discussion is a legitimate *small* position moment — the campaign framing
(multi-day feedings) describes the founding-scale case, not a minimum. Position's re-summonability
already said this; the growth kernel now agrees.

## Rejected alternatives

- **Keep graduation as the named channel and treat conversation as the exception.** The field
  ratio is 3:0 against, on the very first day of the amended skill's use; a model that mislabels
  the majority case trains agents to apologize for the normal path.
- **Drop the thought layer's role entirely.** No — thoughts remain where *unratified* and
  *in-flight* design lives, and graduation remains the right entrance for material that matured
  there. What dies is only the privilege, not the path.
- **Let core-touching discussion write canon without an explicit lock.** That collapses ruling
  into ratification and reopens the altitude-drift failure ADR-041 exists to prevent. The lock
  stays load-bearing.

## Consequences

- `shape:position` SKILL.md: the description line and kernel 4 reframe from "birth and
  graduation, two doors" to "one gate set, many entrances"; the everyday-chat anti-pattern
  narrows to guard *ratification*, not *occasion*. `references/write-protocol.md` timing gate ②
  loses the "escape hatch, not the default" label.
- shape releases as 0.13.0.
- First consumers, retroactively legitimized rather than exceptional: audion's three same-day
  posture rulings and its re-audit restructure.
