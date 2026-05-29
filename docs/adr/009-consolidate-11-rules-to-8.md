# ADR 009 — Consolidate the deep-module rules from 11 to 8

**Status**: accepted
**Date**: 2026-05-29
**Refines**: the rule set first enumerated in [ADR-001](docs/adr/001-plugin-shape-and-naming.md) and scoped language-agnostic in [ADR-004](docs/adr/004-language-agnostic-scope.md)

## Context

The eleven rules grew by accretion and, on review, mixed three different *kinds* of statement under one flat list:

- **Design principles** (what good structure looks like): old ①②③④⑤⑥⑦⑩
- **Process discipline** (how to change code safely): old ⑧⑨
- **A measurement/meta-rule** (how to detect shallowness): old ⑪

Two further problems:

1. **The root principle was never stated.** Ousterhout's actual thesis — a *deep module* (a simple interface hiding significant complexity) — was implicit. Old ① ("good interfaces") captured only the *interface* half; a shallow module with a clean interface satisfied it while being exactly what the book warns against.
2. **Several rules were the same idea at different scales, or a declared balance pair.** Old ② (progressive disclosure) + ⑩ (one door) + the interface half of ① are "interface-first" at module / subsystem / whole-codebase scale. Old ⑤ (no giants) ↔ ⑥ (no needless abstraction) were already labelled a deliberate balance. Old ④ (future-ready foundation) edged into speculative generality — in tension with ⑥ and with YAGNI.

## Decision

Consolidate to **8 rules**, grouped by kind, with **deep modules** made the explicit root:

**Shape ①–⑤** · **Discipline ⑥–⑦** · **Test ⑧**

1. **Deep modules** — simple interface hiding significant complexity; usable without reading the body; prefer general-purpose foundations over premature special-casing. *(absorbs old ① + the de-risked kernel of old ④)*
2. **Interface-first at every scale** — one door, surfaced progressively: module interface → subsystem barrel/facade → whole-codebase index/map. *(merges old ② + ⑩)*
3. **Explicit dependencies** — deterministic; deps in the signature, not ambient. *(old ③)*
4. **Right grain — neither giant nor fragmented** — no mega-module/function (a 700-line render counts), **and** no needless abstraction. *(merges old ⑤ + ⑥; the giant↔fragment balance is now internal)*
5. **Fit the framework** — idiomatic; pass store/hook objects, not 20 loose props. *(old ⑦)*
6. **Rearrange, don't rewrite** — refactor = verbatim move + rewire; behaviour identical; test-gate each step. *(old ⑧)*
7. **Below 90% confidence → ask** — unsure about scope/boundaries/intent: stop and clarify. *(old ⑨)*
8. **Agent-navigability is the audit** — struggle-to-describe IS the deep-module failure signal. *(old ⑪)*

Old ④ (future-ready foundation) is **dropped as a standalone**: its defensible kernel (general-purpose over special-purpose; design it twice) folds into ①; its risky "build for unshipped features" phrasing is retired as conflicting with rule ④'s "no needless abstraction".

## Remap key (old → new)

| old | new | | old | new |
|---|---|---|---|---|
| ① | **①** | | ⑦ | **⑤** |
| ② | **②** | | ⑧ | **⑥** |
| ③ | **③** | | ⑨ | **⑦** |
| ④ | **→ folded into ①** | | ⑩ | **②** |
| ⑤ | **④** | | ⑪ | **⑧** |
| ⑥ | **④** | | | |

This table is the translation key for any old rule-number that survives in **dated records** (see below).

## Scope of the change — live surfaces only

Per the marketplace's ADR discipline (*"Never delete an ADR. Supersede."*), historical records are immutable point-in-time snapshots and were **not** renumbered:

- **Remapped (live, read as current truth):** the canonical list in `plugins/nav/CLAUDE.md`; all 6 SKILL.md restatements + by-number references; `README.md`; `docs/site/index.html` (the `RULES` cards array + references); `skills/map/references/visual-spec.md`.
- **Left unchanged (dated history):** all prior ADRs (001–008) and `docs/observations/*`. They keep their original numbers and "11 rules" wording, which were accurate as of their dates. Use the remap key above to translate.

## Why not just renumber everything

- ADRs are decisions-as-of-a-date; rewriting old ADR-001's "11 rules" to "8" would falsify what was decided then. The discipline is to *supersede with a new ADR* (this one), not edit history.
- The live surfaces are what users and agents actually read as the current rule set — making *those* self-consistent is what matters. This ADR is the bridge for the rest.

## Consequences

- The rule set is now 8, explicitly anchored on **deep modules** and grouped Shape/Discipline/Test.
- Every live SKILL.md / CLAUDE.md / README / site-map reference uses ①–⑧ on the new scheme.
- `docs/site/index.html`: rev 7 with a FIXED entry; `RULES` array rewritten to 8 cards; ADR count 8→9.
- Old rule-numbers in ADRs 001–008 and the observation remain on the 11-scheme by design; the remap key translates them.

## Notes

- The new grain isn't more permissive — it's the same content with the redundancy and the missing root resolved. No principle was weakened; old ④'s speculative phrasing was the only deliberate retirement.
- A future reader hitting "rule ⑨" or "rule ⑪" in an older ADR should reach for the remap key here, not assume drift.
