# ADR 034 — `think` plugin: named reasoning lenses as a first-class skill family

**Status**: accepted
**Date**: 2026-06-10
**Relates to**: [ADR-013](docs/adr/013-diagnosis-folds-into-elicit.md) (same-engine → don't fork razor), [ADR-018](docs/adr/018-promotion-gate-is-evidence-not-session-count.md) (evidence promotion gate), [ADR-021](docs/adr/021-retire-nav-doctor.md) (retire a skill that's ceremony over a thin sequence), [ADR-027](docs/adr/027-research-plugin.md) (a cognition toolkit as its own plugin)

## Context

The recurring need: hard problems where the model's *default* reasoning runs on analogy and convention ("competitors do X, so do X") and silently inherits assumptions that may not hold. The ask — "reason this from first principles", "challenge the assumptions", "is this convention or necessity" — wants an explicit, disciplined reasoning *frame* applied to the problem, producing a structure the default skips.

Two questions, as with `research` (ADR-027):

1. **Is this distinct from existing skills — specifically `/shape:elicit`?** Yes. The defining line is *who holds the answer*. elicit is **maieutic** (`react-not-author`): the user holds the answer, elicit draws it out by a grounded grill. A reasoning lens is **generative**: the answer is *derived* from the problem's base truths by the agent applying a frame. elicit extracts; a lens derives. Folding a lens into elicit would break elicit's react-not-author core. So it is not an elicit mode.

2. **One skill with a lens argument, or a family of lens-skills?** A family. The decisive argument (the user's): a *plugin* is justified only by a *family*; if it were one skill with a swapped frame, there'd be no reason for a new plugin — it would just live in `shape`. And the lenses pass the same razor `research` used (distinct *procedure* + distinct *output shape* = a separate door): first-principles **decomposes down** to axioms and rebuilds up (output: assumptions · axioms · rebuilt · divergence); `invert` **negates** the goal (output: failure modes / what to avoid); `second-order` **projects forward** (output: consequence chains). These are different operations producing different artifacts — not one engine with a frame parameter.

## Decision

| Aspect | Choice |
|---|---|
| Plugin name | `think` |
| First skill | `first-principles` (strip a question to axioms, rebuild, surface the divergence from convention) |
| Skill naming | **canonical lens names** (`first-principles`, `invert`, `second-order`) — not coerced bare verbs; the names are well-known mental models, discoverability wins (diverges from `research`'s bare-verb convention, deliberately) |
| Plugin dependency | None — `think` is standalone; feeds `shape` one-way (insight → `elicit`/`mockup`/`nav:plan`), never invokes it (ADR-015) |
| Output | A fixed-shape `thinking/<date>-<topic>.md` artifact per lens; read-only by default (offer where to save) |

## The value-guardrail (why this isn't ceremony)

The danger is that "think" degrades into "think harder" — which the model does by default, earning nothing (the failure that retired `nav`'s `doctor`, ADR-021). The charter's hard gate: **a lens is a skill only if it forces a structure the default omits.** first-principles MUST emit the discarded assumptions + the irreducible axioms, not just a polished conclusion — that explicit, challengeable structure is the value. Any proposed lens that can't name what it forces beyond default reasoning is rejected, not shipped.

## Why a new plugin, not folding into `shape`

- `shape` is *forward motion toward built code* (intent → form → verified code). Pure reasoning about a problem isn't inherently toward-build; its artifact is useful independent of any one product decision.
- One lens *could* live in shape — but the family (a growing library of reasoning operations) is a distinct domain, like `research` (reading external sources) sits beside `nav`/`shape` rather than inside them (ADR-027). Four families, cleanly separated: nav (maintain code) · shape (push product forward) · research (read the world) · **think (reason about a problem)**.
- ADR-005 establishes plugins as topical families with no count limit.

## Planned family (not committed — promote per ADR-018)

| Lens | Status | Operation / forced output |
|---|---|---|
| `first-principles` | ✓ shipped (v0.1.0) | decompose to axioms → rebuild → divergence |
| `invert` | seed (planned) | negate the goal → failure modes / what to avoid |
| `second-order` | seed (planned) | trace consequences forward → consequence chains |
| `systems` | candidate | feedback loops / stocks / leverage points |

`invert` / `second-order` ship when a dense session friction-tests each to the principle level (ADR-018), and only if each clears the value-guardrail above. Thin candidates (`steelman`, `analogize`) stay parked until they prove a distinct forced structure.

## Consequences

- New plugin directory `plugins/think/` with `plugin.json`, `CLAUDE.md`, `skills/first-principles/SKILL.md`.
- `marketplace.json` gains a `think` entry; `README.md` gains a `think` section.
- `docs/site/index.html` gains: DOMAINS/header entry, a CB_NODES `think` plugin node + edge, a THINK anatomy section (THINK_NODES/THINK_EDGES) + command card + bilingual i18n, and a changelog rev. (Site update is gating per the plugin charters.)
- `.agents/` codex mirror auto-discovers the new plugin (build-codex scans `plugins/*/` for `CLAUDE.md` + `skills/`); validator must stay green.
- `first-principles` is invoked as `/think:first-principles` (or `/first-principles` shorthand where the harness allows).
- ADR count 33 → 34.
