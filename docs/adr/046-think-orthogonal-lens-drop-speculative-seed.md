# ADR 046 — `think` gains `orthogonal`; the speculative `invert`/`second-order` seed is dropped

**Status**: accepted
**Date**: 2026-06-15
**Amends**: [ADR-034](034-think-plugin.md) (the think charter — its roster + "seed family": `invert`/`second-order` are removed, `orthogonal` is added as the second built lens)
**Builds on**: [ADR-018](018-promotion-gate-is-evidence-not-session-count.md) (promote by evidence), [ADR-045](045-think-is-lightweight-in-chat.md) (lenses reason in-chat)

## Context

ADR-034 named **`invert` + `second-order` as the think "seed family"** — *planned, promoted per evidence*. But that billing was **speculative**: they were picked because they're famous mental models, not because there was evidence the user reaches for them. An evidence audit of `docs/observations/` settles it:

- **`first-principles`** — evidenced (e.g. `2026-06-10-first-principles-as-post-design-self-audit`, `2026-06-05-drilling-to-the-atom`). Built, correctly.
- **`orthogonal`** — the user's **frequently-used** lens (stated lived evidence): factor a tangled phenomenon into independent axes. Stronger standing than the seed pair.
- **`invert` / `second-order`** — **zero** observation evidence. Every grep hit for "invert" is the everyday verb ("the hierarchy was inverted", "descend, not invert"); "second-order" appears in no observation at all. They have no more standing than the parked `steelman` / `analogize`.

By the project's own gate ([ADR-018](018-promotion-gate-is-evidence-not-session-count.md)), "seed family = invert + second-order" was not honest — it elevated unevidenced speculation to a roadmap.

## Decision

1. **Add `orthogonal` as a built lens.** Factor a phenomenon into **mutually-independent (orthogonal) primitives**; the forced structure is the **independence check** (move one axis, the others must not move) → the true degrees of freedom + what was conflated/falsely-coupled. In-chat, no artifact ([ADR-045](045-think-is-lightweight-in-chat.md)).
2. **Remove `invert` / `second-order` from the roster** — drop them from `plugin.json`, `CLAUDE.md`, `README.md`, the site map, and `first-principles`'s cross-references. Don't list unevidenced speculation; a future lens earns a mention by evidence, not by being a well-known model. ([ADR-034](034-think-plugin.md) is left intact as history.)
3. **Reframe the family as two decomposition lenses**, not a seed list: `first-principles` decomposes **down** (reduce to axioms, rebuild, surface divergence); `orthogonal` decomposes **sideways** (factor into independent axes, surface conflation). Different direction, different payload, different output shape — two distinct doors by the same razor ADR-034 used.

## `orthogonal` vs `first-principles`

| | `first-principles` | `orthogonal` |
|---|---|---|
| direction | **down** to irreducible axioms | **sideways** into independent axes |
| move | reduce → rebuild | factor → verify independence |
| payload | divergence from convention | what was conflated / falsely-coupled |
| output | assumptions · axioms · rebuilt · divergence | tangle · candidate axes · independence check · degrees of freedom · payload |

Each runs without the other. They're the two halves of "take the problem apart."

## Consequences

- `think` roster: **2 built lenses** (`first-principles` + `orthogonal`); no "planned" members listed. `think` v0.1.0 → **0.2.0**.
- Removed all `invert` / `second-order` references from the live surfaces; ADR-034 unchanged (records the original speculative seed).
- Generated artifacts: Codex mirror gains `think-orthogonal` (22 → 23 skills); `AGENTS.md` + cursor projection + marketplace version regenerated; validator green.
- Gating surfaces (per the repo-root CLAUDE.md roster gate): `README.md` + `docs/site/index.html` both updated (think 1 → 2 skills, node/blurb reframed); ADR count → 46; site rev bump + FIXED.
