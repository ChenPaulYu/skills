# ADR 018 — The promotion gate is evidence sufficiency, not session count; a single rich session can crystallize

**Status**: accepted
**Date**: 2026-05-29
**Refines**: the promotion ladder + "don't pre-skill" discipline in [`docs/observations/README.md`](docs/observations/README.md).

## Context

The marketplace's capture-before-crystallize discipline reads literally as a *session-count* gate: `raw` → `repeated` (same pattern in ≥2 contexts) → `maturing` → `promoted`, with "don't write a SKILL.md after one observation". Taken at face value, this session looked like a violation — it shipped four ADRs (014–017) each crystallized from a *single* conversation rather than from ≥2 independent sightings.

On review, the literal reading is wrong. "5×" / "≥2 contexts" was never the actual requirement — it's a **proxy for evidence sufficiency**. Independent recurrence matters because it filters out in-the-moment enthusiasm: different contexts, framings, and moods confirming the same shape is evidence the shape is real, not a mood. But recurrence is the *cheap* way to get that confidence, not the *only* way.

## Decision

**Two paths to promotion, gated on the same thing — sufficient evidence, not a session count:**

1. **Recurrence path (the default).** A pattern seen across ≥2 independent contexts → promote. Cheap, time-filtered; the existing ladder.
2. **Dense-session path.** A *single* session may crystallize a skill/behavior/ADR **when it carries the substitutes for independent recurrence** — all three, not one:
   - **Grounded** — anchored in real artifacts / code, not just internal reasoning. (External grounding stands in for one independent confirmation.)
   - **Friction-tested** — the conclusion survived real pushback and reframing; it was not the first idea. (Adversarial pressure stands in for repeat sightings.)
   - **Principle-level** — it converged to a generalizing principle, not a one-off feature. (Generality is what makes it worth freezing.)

A single session that merely *felt* thorough — clean reasoning, no code grounding, no friction, a feature not a principle — is **enthusiasm**: park it (`raw`), don't promote. "It was a lot of information" is not the test; the three substitutes are.

## Why

- **Evidence, not ritual.** The point of the ladder was always confidence that a shape is real. A dense, grounded, friction-tested session can clear that bar in one sitting; forcing it to wait for an artificial second sighting is ceremony, not safety.
- **It removes a silent inconsistency.** The marketplace held real product code (Crate) to don't-pre-skill while quietly letting itself crystallize fast. This names the exemption and gives it a *test*, so "fast" stays disciplined rather than becoming a rubber stamp.
- **It passes its own gate.** This refinement is grounded (the 17 prior ADRs + this session's four), friction-tested (raised as a critique, pushed back on, reframed), and principle-level — so recording it now is not itself pre-skilling.

## Consequences

- `docs/observations/README.md`: the status ladder notes the dense-session path + the three substitutes, pointing here.
- Applying the test retroactively: ADRs 014–017 qualify (each grounded in real reconcile/align/nav-plan surfaces, friction-tested with the user, principle-level). They were not pre-skilling.
- `docs/site/index.html` (gating): ADR count 17 → 18.
- No new skill; this governs how skills/ADRs are allowed to be born.

## Notes

- The failure mode to watch: "dense session" self-judged in the moment always feels sufficient. The three substitutes are deliberately *external* checks (real artifacts, real pushback, a stated principle) precisely so the judgment isn't "did it feel like enough".
