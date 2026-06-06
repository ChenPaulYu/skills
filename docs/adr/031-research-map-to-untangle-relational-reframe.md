# ADR 031 — `research:map` → `research:untangle`: rename + relational reframe

**Status**: accepted
**Date**: 2026-06-06
**Supersedes**: the `map` naming + scope from ADR-027 (the skill, its claim-required contract, and its "related-work landscape" framing)
**Origin**: a session questioning why `research:map` had never been used and felt vague — converged with [[docs/observations/2026-06-06-grounding-is-intent-relative.md]] (intent sets the grain of what you build)

## Context

`map` (from ADR-027) was framed as "a claim-framed landscape across N sources → related-work priority order," and it **required** a claim. Two problems surfaced in use:

1. **It felt vague and went unused.** Its output — "a synthesized landscape note" — named a *deliverable* (a related-work artifact), not the thing the user actually wanted. The valuable asset is **seeing how the papers relate**; the related-work section is just one rendering of that.
2. **The claim-required contract was too strict.** ADR-027's bet was "no claim → shallow topic survey," so it forced a claim. But that conflated *claimless* with *shallow*. A genuine **relational structure** — who builds on whom, who contradicts whom, what is contested — is deep and valuable *without* a claim (onboarding to a field, finding open ground).
3. **Name collision.** `nav:map` (codebase map) and `research:map` already required a documented disambiguation note ("Distinct from /research:map").

The reframe: the core of this skill is the **relational structure across arguments** — the *edges*, where `dissect` gives the *nodes*. Related-work / gap / positioning are derived views; the claim is an optional positioning overlay.

## Decision

| Aspect | Before (`map`) | After (`untangle`) |
|---|---|---|
| Core output | a claim-framed related-work landscape | the **relational structure**: lineage · clusters · contradictions · contested ground (the *edges*) |
| The claim | **required** (precondition) | **optional** (a positioning overlay on the structure) |
| Related-work / gap / priority | the point | **derived views** of the structure |
| Spine framing | dissect understands · map positions · critique assesses | **dissect = nodes · untangle = edges · critique = assess one** |
| Name | `map` (collides with `nav:map`; generic) | `untangle` (unique; signals comprehension-of-relationships, not an artifact) |

### Why `untangle` over the alternatives

- **map / chart**: frame the output as an *artifact* (a map you produce) — the exact framing the reframe escapes; and `map` collides with `nav:map`.
- **connect / relate**: lean *affinity* ("things that go together") — they underplay **contradiction** and **contested ground**, which are the highest-value edges (where a gap lives). `relate` is also ambiguous (narrate / empathise) and awkward as a command.
- **lineage**: evocative but **one edge type** — names only descent, dropping clusters/contradictions/contested. Too narrow for the whole structure.
- **untangle**: names the *starting state* (a knotted pile), the *act* (reveal pre-existing relationships, not invent links), is *neutral on tension* (untangling exposes conflicts too), and the *output is clarity* — "see clearly how these relate." The name's slight "separate" lean is corrected in the doc by foregrounding the four edge types (name evokes, doc specifies — same as `dissect`).

## Why the claim becomes optional (not removed)

ADR-027's anti-shallow concern was right, but the guard was wrong. Instead of *requiring a claim* to avoid a shallow survey, the skill now *requires relational structure* directly (the four edge types) — and refuses to emit a flat topic list, claim or no claim. The claim returns as what it always was: a **positioning lens**, valuable when present, not a gate.

## Consequences

- `research` stays three verbs; `plugin.json` → 0.4.0.
- Both `untangle` and `critique` now *consume* `dissect` (reuse the nodes; do their own edge-finding / attack-grounding).
- The `nav:map` ↔ `research:map` disambiguation note is removed — the collision is gone.
- ADR-027's `map` decision is superseded here for the skill's name, contract, and framing; ADR-027 remains the plugin's founding charter.
- Generalises a marketplace pattern (cf. the grounding-is-intent-relative observation): a skill's *output framing* should name the **comprehension/asset**, not a downstream deliverable — "landscape note" hid the value; "relational structure" surfaces it.
