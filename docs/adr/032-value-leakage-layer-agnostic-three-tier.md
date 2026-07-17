# ADR 032 — Value-leakage is layer-agnostic; DETECT it at the aggregate (audit), PREVENT it per-change (do/plan)

**Status**: accepted
**Date**: 2026-06-08

## Context

A Crate session (observations [`the-lone-token-is-the-smell-and-the-template`](docs/observations/2026-06-08-the-lone-token-is-the-smell-and-the-template.md) + [`why-skills-miss-css-value-leakage`](docs/observations/2026-06-08-why-skills-miss-css-value-leakage.md)) surfaced a leakage class the nav skills walked straight past: a brand accent color as raw hex **27 times**, ~50 palette hexes across ~20 files, while one design value (a motion-easing token) was tokenized with a comment about "single owner."

Rule ① already names "magic constant … in ≥2 modules" — **the principle is fine and layer-agnostic** (deep-module is *decisions + owners + a narrow interface*, not "code"; the same session applied it to a **prompt** — HEAD/GROUNDING/TAIL + `build_system_prompt` — and to **CSS** — color tokens). What failed was the **operationalization**:

- The **N+1 trigger** fires on an "inline *util*" (a code unit); audit's **mechanical checks** are the code-module graph (LOC / imports / barrels). Nothing ever looked at repeated *values* or at *non-code layers* (CSS, prompts, config). **Rigor follows the tooling's analytical reach; whatever the tools treat as text escapes.**
- Value-leakage accretes *below* per-change granularity (each raw hex is locally correct) and is only visible at **aggregate** scale — so a per-change gate structurally cannot catch it.

**The crux is over-flagging.** A naive "scan all literals" flags `2` and `'px'` → noise → the check gets ignored. We chose to anchor detection on **asymmetry**: an *already-owned* instance (a token / const) is human-proof that a category is a decision, so its raw siblings are leaks. High-precision / lower-recall — and precision is what a *voluntarily-heeded* check needs (a noisy check gets turned off; the asymmetry also **ratchets** — fixing one category exposes the next). The complementary failure (the parchment case: 15 near-identical off-whites) is *over-creation* — caught by **perceptual proximity clustering** (ΔE): the machine screens *physical* distance, the human judges *semantic* legitimacy (a real level/category, **perceptible** — a sub-JND "category" is drift).

## Decision

Treat value-leakage as a first-class, **layer-agnostic** concern, split across the three skills **by the granularity each can act at** — DETECT at the aggregate, PREVENT per-change:

- **audit — DETECT (the guarantee).** A value-leakage mechanical check across *all* decision-bearing layers (code, CSS/design-tokens, prompt strings, config), from two anchored screens: **canary** (inventory owners → grep raw copies of each owner's value → flag) + **proximity clustering** (cluster near-identical values → flag clusters with no single owner / unjustified near-duplicates). Machine screens duplication/proximity; the human judges semantic legitimacy. Emergent leakage is *only* visible here — audit is its **proper home, not a fallback**.
- **do — PREVENT (cheap, partial).** Generalize the N+1 trigger from "inline util" to **any repeated value, in any layer**: 2nd re-expression → reference/extract an owner. Plus a per-addition reflex: a *new* distinct value must justify distinctness vs the nearest existing one, **JND-vetoable** (sub-JND = drift regardless of stated reason). A 5-second reflex, not an analysis.
- **plan — PREVENT (foresight).** A plan output: the **single-source-of-truth design values + their owners** (token namespaces, const homes) for the *foreseeable* categories — establish the owner before the 2nd value is written.

**Crucially:** do/plan are *cheap, partial prevention* (per-change is structurally blind to emergence); audit is the *guarantee*. Don't rely on do/plan as the defense, and don't push audit's aggregate analysis into do (uncomputable per-change + bureaucratic). The principle is universal; **enforcement is per-layer** — each layer still needs its own machine-visibility (TS: types/lint · CSS: token system + lint-ban raw values · prompts: structured composition) for this to be *mechanism* rather than *judgment*. A skill **detects + recommends** that enforcement; it cannot install it.

## Consequences

- `nav:audit` gains a value-leakage check (canary + proximity) + explicit non-code-layer scope; the audit→refactor handoff now also consolidates values.
- `nav:do`'s N+1 + check gate cover values/layers + the justify-distinctness reflex; `nav:plan` gains an ownership output.
- `plugins/nav/CLAUDE.md`'s N+1 corollary is noted as value- and layer-agnostic.
- **Kept tight on purpose.** The source observations are still `status: raw` (one sighting) — we added the small, general, high-confidence operational hooks, not a new sub-skill or a detection engine. Revisit the weight on a 2nd sighting.
