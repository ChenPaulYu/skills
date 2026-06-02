# ADR 024 — Information hiding folded into rule ① (not a 9th rule)

**Status**: accepted
**Date**: 2026-06-02
**Refines**: [ADR-009](docs/adr/009-consolidate-11-rules-to-8.md) (the 8-rule set this deepens, without changing the count)

## Context

The 8 rules' rule ① was **"Deep modules — a simple interface hiding significant complexity."** True, but it stated the *goal* (a deep module) without naming the *technique* that produces one. Ousterhout (*A Philosophy of Software Design*, ch. 5) is explicit: **"the most important technique for achieving deep modules is information hiding"** (Parnas) — encapsulate each design decision (data structures, algorithms, formats, assumptions) inside one module so it never appears in the interface. Its inverse, **information leakage** (the same knowledge reflected in ≥2 modules), is called out as *"one of the most important red flags in software design"*, and its common cause is **temporal decomposition** (module boundaries following execution order rather than knowledge).

The rule set named the destination but not the road or its potholes. The audit could find *wide interfaces* (a symptom) but had no named check for *leakage* (the cause).

## Decision

**Fold information hiding into rule ① — keep the count at eight.** Rule ① becomes **"Deep modules through information hiding"**: it now names the technique (encapsulate each design decision so it never surfaces in the interface) and the two red flags (**information leakage**; **temporal decomposition**).

The two red flags are also added as **named universal checks in `/nav:audit`** (every stack, rule ①), so the principle is *detectable*, not just stated.

## Why fold, not add a 9th rule

- **Faithful to the source.** Ousterhout frames information hiding as the *means to* deep modules, not a peer principle. Rule ① is "deep modules"; information hiding belongs *inside* it as its mechanism. A 9th peer rule would misrepresent the relationship.
- **Consistent with this repo's DNA.** The whole rule-set history is *anti-proliferation*: ADR-009 consolidated 11 → 8; rule ④ (right grain) and ADR-021 (retiring `doctor`) both say "don't spawn structure that can be deepened in place." Deepening rule ① rather than adding rule ⑨ is rule ④ applied to the rules themselves.
- **No renumber cascade.** A 9th rule (or inserting it as a new ②) would break the "8 rules" framing and its grouping (Shape ①–⑤ · Discipline ⑥–⑦ · Test ⑧) and force remapping every by-number reference (`refactor` = rule ⑥, the N+1 = ④+②, etc.) across all skills, the site map, and the ADRs. Folding touches only rule ①'s prose.

The alternative of a lightweight **corollary** (like the N+1 trigger hangs off ④+②) was considered but rejected for the *core* statement: information hiding isn't a corollary of deep modules, it's *how you get one* — it belongs in the rule's own definition. (The red-flag *checks* in audit do play the corollary/operational-trip-wire role.)

## Consequences

- **Rule ① reworded in every place it is restated** (same change): `plugins/nav/CLAUDE.md` (canonical, fullest form) + all five skill `SKILL.md` files (`audit`, `refactor`, `sync`, `plan`, `do` — compact form, each preserving its local tail note). Per the "changing the 8 rules affects every skill, update each in the same commit" convention.
- **`/nav:audit`** gains two universal-check rows (information leakage · temporal decomposition) under rule ①.
- **Site map**: `RULES` card ① name + bilingual desc updated; audit block bumped.
- **Count unchanged**: still **8 rules**, still grouped Shape ①–⑤ · Discipline ⑥–⑦ · Test ⑧. No by-number reference moves.
- **`AGENTS.md`** (the Codex mirror's synthesised conventions) regenerates from the updated `CLAUDE.md` via `scripts/build-codex.mjs`.

## Out of scope

- The operator's private global `CLAUDE.md` "deep-module sense" list — adding the two red flags there is the operator's call (it's outside this repo and stack-calibrated); recommended as a separate, optional follow-up.
