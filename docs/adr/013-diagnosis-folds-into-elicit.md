# ADR 013 — Diagnosis folds into `elicit` (no separate `diagnose` skill)

**Status**: accepted
**Date**: 2026-05-29
**Plugin**: `shape`
**Relates to**: `elicit` (introduced in [ADR-010](docs/adr/010-shape-blueprints-workflow.md), built in the elicit batch).

## Context

The user wanted help when they hit an obvious logic flaw in an implementation — a skill to **root-cause it collaboratively** ("clarify what's wrong, together"), not an agent that silently rewrites the code. Initial framing considered a new skill (`diagnose` / `trace`), and a home question (nav, since the object is existing code, vs shape, since the stance is collaborative convergence).

A real transcript settled it — the "drag to derive didn't work" diagnosis (see `docs/observations/2026-05-29-how-diagnosis-converges.md`). The diagnostic rhythm is **identical** to the thought-mode rhythm that grounds `elicit`: react-not-author, the user pierces, drill to root, reframe, compress to one line, hand off. Same convergence engine; the only difference is the **object** (backward "why is X wrong" vs forward "what should X be").

## Decision

**Do not build a separate diagnosis skill. Widen `elicit` to cover root-causing** — one engine, two objects (forward decision / backward root-cause) — with a short **diagnostic-mode** section for the flaw-specific front-end.

The decisive reason is a deep-module one: a separate `diagnose` skill would be a **parallel copy of elicit's convergence engine** — the exact N+1 / "don't ship the copy, reuse the primitive" anti-pattern this marketplace polices. Diagnosis is the *second consumer* of that engine → reuse, don't duplicate.

Diagnostic mode specializes three of elicit's six moves:
1. **Ground the symptom against what's actually built** (not the spec's words) — the cause is usually the gap between the user's mental model and the real implementation.
2. **Forks are candidate causes traced against the code**, narrowed by grounded elimination; the user often supplies the pierce, the agent ground-confirms it.
3. **Drill until a local bug reframes into a structural cause** — the reframe is the diagnosis.

It then flows like forward elicit: one-line cause + fix-direction → `/shape:mockup` (if the fix is visual) → `/shape:build` or a sub-agent (the rebuild). **Read-only** — elicit converges the cause and the fix-direction; it does not edit code in place.

## Why this resolves the open questions

- **New skill?** No — it'd be a parallel impl. Widen elicit.
- **Home (nav vs shape)?** Moot — it's elicit, which is shape. No nav-widening to "correctness" is needed; diagnostic mode only *soft-uses* nav (`/nav:headers`, `/nav:map`) to trace cheaply, consistent with the soft `nav → shape` / `shape → nav` rule (ADR-012).
- **Boundary vs `/nav:audit`:** audit is a broad, unconditional smell-scan it runs *for* you; diagnostic-mode elicit is a *targeted* root-cause of a *specific* flaw you point at, *with* it. No fire-stealing.

## Consequences

- `plugins/shape/skills/elicit/SKILL.md`: frontmatter triggers gain the diagnosis phrasings; a "diagnostic mode" section + two anti-patterns + a `/shape:build` companion added. No new skill files; shape stays at 5 skills.
- `docs/observations/2026-05-29-how-diagnosis-converges.md`: the grounding transcript.
- `docs/site/index.html` (gating): elicit's blurb/role note that it covers forward decisions *and* backward root-cause; ADR count 12 → 13.
- No version bump (elicit's scope widened, no new skill).

## Notes

- This is the second time the family resisted premature fragmentation: build stayed in shape rather than spawning a plugin (ADR-011); diagnosis stayed in elicit rather than spawning a skill. The through-line: reuse the existing engine/home until a genuinely new shape forces a split.
