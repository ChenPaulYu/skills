# ADR 048 — `think` gains `graft`: borrow a mature model's structure, then adapt it (map every primitive → fit / break / adapt)

**Status**: accepted
**Date**: 2026-06-16
**Amends**: [ADR-034](034-think-plugin.md) (the think charter — its roster gains a fourth lens)
**Builds on**: [ADR-018](018-promotion-gate-is-evidence-not-session-count.md) (promote by evidence) · [ADR-045](045-think-is-lightweight-in-chat.md) (lenses reason in-chat) · [ADR-047](047-think-dialectic-lens.md) (prior lens addition, same shape)

## Context

A recurring, evidenced design move: when building a **novel system that structurally rhymes with a mature one**, the user borrows the mature model wholesale and walks it end-to-end — *"reason this whole thing through git logic"* turned a piecemeal, several-turn version-model design into a single resolving pass (it surfaced a naming inversion, a genuine self-contradiction between two earlier decisions, and the domain-specific divergences that became the design's identity). The user reports reaching for this move **heavily** across projects — the standing ADR-018 bar (real recurring use, not a famous-model guess). The observation that seeded it: `docs/observations/2026-06-16-graft-borrow-a-mature-model-then-adapt-it.md`.

Two questions, per the think charter:

1. **Does it clear the value-guardrail** (forces a structure the default skips)? **Yes.** The default "reason by analogy" stops at the *fits* ("it's basically git") — the reskinning trap — and considers only the primitives it happens to reach for. graft forces three things the default omits: (a) **an EXHAUSTIVE primitive map** of the donor onto the target (completeness is the forcing function — the skipped primitives are where the surprises hide); (b) a **three-way reading per mapping** — fit (adopt unchanged) / break (no image → design fresh) / **adapt** (borrow the structure but reshape it for the domain); (c) the **payload is the ADAPT list, ranked above fits** — where the borrowed structure had to change is the design's identity. Without these it's lazy analogy; with them it's a structure the model won't produce unprompted.

2. **Is it distinct from existing lenses** — especially `/think:first-principles`? **Yes, and sharply: it is nearly fp's inverse.** See the boundary table.

## Decision

1. **Add `graft` as the fourth built lens.** Forced structure: **Target → Donor + why-it-rhymes → the full primitive map → fit/break/adapt reading → the adapted result (payload = adapt list + breaks)**. In-chat, no artifact ([ADR-045](045-think-is-lightweight-in-chat.md)).
2. **`adapt` is the payload, not `fit`** — the design's load-bearing decision. A `fit` (adopt unchanged) carries no design identity; an `adapt` (structure survives but the domain reshaped it) is where the design becomes the target's rather than the donor's. An output that is mostly fits is a **reskin**, not a graft — the lens must say so plainly (the donor was wrong, or the rhyme is shallow → it's a `first-principles` problem instead).
3. **The anti-leak discipline is the line between graft and lazy analogy.** Where the analogy **breaks**, the donor offers no valid answer; the break must be decided on **the target's own terms**, never by reflex-copying the donor. The donor surfaced the question; the domain answers it. (This is exactly the assumption-inheritance that `first-principles` exists to fight — graft uses a convention as a *checklist/probe*, then forces departure from it.)
4. **Name it `graft`, not `transplant` / `scaffold`.** The metaphor must center **adaptation**: *transplant* implies keeping the organ raw (no adapt); *scaffold* implies discarding the frame (no adapt) — and collides with `/shape:setup`'s project-scaffolding. **Graft** (a scion adapts to the rootstock and heals into a new organism) is adaptation by nature, and keeps a sharp event (graft takes = adapt; graft fails = break).

## `graft` vs its neighbours

| | `graft` | `/think:first-principles` | `/think:orthogonal` |
|---|---|---|---|
| borrowed structure | **all** — imports a whole mature model | **none** — strips convention to axioms | none — factors the target's own tangle |
| object | a novel system + a donor model | a question / belief | one tangled phenomenon |
| move | map donor → target, read fit/break/adapt | reduce → rebuild | factor into independent axes |
| output | Target · Donor · map · fit/break/adapt · adapt-list payload | assumptions · axioms · rebuilt · divergence | tangle · axes · independence check · DOF · payload |

The family framing: `first-principles` (down) and `orthogonal` (sideways) take a problem *apart*; `dialectic` puts a *claim* on trial; `graft` **builds a design by transplant-and-adapt**. first-principles and graft are the two ends of one spectrum — **borrow-none ↔ borrow-all** — with lazy analogy as the failure mode off graft's end (borrow-all, *don't* adapt). Same family (a named frame forcing a structure the default skips, in-chat, feeds shape one-way), distinct operation.

## Consequences

- `think` roster: **4 built lenses** (`first-principles` · `orthogonal` · `dialectic` · `graft`); no "planned" members listed. `think` v0.3.0 → **0.4.0**.
- `graft` is invoked as `/think:graft`. New `plugins/think/skills/graft/SKILL.md`; `plugin.json` (×2: claude + cursor) + `CLAUDE.md` roster reframed (two-take-apart + one-on-trial + one-graft).
- Generated artifacts: Codex mirror gains `think-graft`; `AGENTS.md` + cursor projection + marketplace version regenerated by `build-codex.mjs` / `build-manifests.mjs`; validator must stay green.
- Gating surfaces (repo-root CLAUDE.md roster gate): `README.md` (plugin table + think skills list) + `docs/site/index.html` (think node/blurb 3 → 4 lenses, a `/think:graft` command card, rev bump) both updated in this commit. ADR count 47 → 48.
- The seeding observation stays `raw` but its trip-wire is now met (heavy recurring use, per the user); it can be marked promoted-to-skill on next observation sweep.
