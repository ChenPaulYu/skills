# ADR 109 — Deep-module skills: the three-layer re-homing

**Status**: accepted
**Date**: 2026-08-12
**Source**: ratified by Paul 2026-08-12 (「接下一步是把整個 skill deep module 化」), off the fable strategic review that followed the ADR-107 audit. The criterion was saved to the owner's agent memory the same day; this ADR makes it repo law.
**Precedent**: [ADR-065](docs/adr/065-description-lean-but-honest-pilot-frame.md)/[073](docs/adr/073-description-lean-rollout-marketplace-wide.md) (lean descriptions — this ADR's rule 1 is their sharpened form) · [ADR-107](docs/adr/107-retirement-round-four-verbs.md) ("a description is running code") · [ADR-108](docs/adr/108-retire-research-fold-map-into-sync.md) (sync's rewrite, the proof-of-shape).

## The law

Apply the marketplace's own deep-module doctrine to skills themselves. A skill has three layers, and each fact lives in the lowest layer that still fires it:

| Layer | Loaded | Carries |
|---|---|---|
| **description** (frontmatter) | every turn, every session | when-to-summon + one NOT-boundary. ≤3 sentences. |
| **body** (SKILL.md) | on fire | **stance + behavior-changing gates** — the things that alter what the model does while performing |
| **references/** | on demand | protocol detail, tables, procedures, rule restatements, edge-case machinery |

**Skill depth = behavior delta ÷ always-resident tokens.** The failure modes, from the repo's own history: a description over behavior the model does natively (`summarize`, ADR-079 — all interface, no depth); a description that *executes* while the body never loads (`observe`, ADR-107 — interface with side effects); a body so wide the decisive stance drowns in protocol (`elicit` pre-compression, 137 lines — the model's behavioral budget diluted; fable review 2026-08-12).

Three enforcement rules:

1. **Description = signature.** When-to-summon (including the user's real vernacular — measured, not guessed: 92% of fire-preceding turns are Chinese/mixed, and "grill me" ran 14× across 6 projects while appearing in no description) + one NOT-for boundary. More than ~3 sentences = wide interface.
2. **Body = delete-test survivors only.** For each paragraph: would the model behave differently without it *while running the skill*? No → sink to `references/` (verbatim — rule ⑥, move don't rewrite) or delete (Sediment).
3. **Depth test at authoring time.** Run the prompt with and without the skill; diff ≈ 0 → don't build it. The ADR-021/079/107 retirement razor, promoted to a day-one authoring standard.

## What this amends

The repo-root CLAUDE.md's ★ **Self-contained `SKILL.md`** convention said each skill "restates its own through-line / rules / framework **verbatim**" in the body. The *self-containment* survives unchanged — a skill still depends on no CLAUDE.md being loaded — but its unit is corrected: **self-contained means within the skill's directory**, not within the body. `references/` ship with the skill and load on demand; a rules restatement sitting in the body taxes every fire whether or not that fire needs it. The convention text is amended in the same commit as this ADR.

Two things this law does NOT change:

- **Interactive vs autonomous calibration.** Skills that run unwatched (`refactor`'s test-gates, `build`'s scheduling policy, `position`'s freeze protocol) keep their gates in the body — gates are behavior-changing by definition. The compression pressure falls on *narration around* gates, never on gates.
- **The write-gates, cost tiers, and invocation axes** (`model:` frontmatter, `disable-model-invocation`) — orthogonal to layering, all preserved verbatim.

## The probe and the evidence bar

`shape:elicit` is the designated probe (fable review): 137 → 30 body lines; machinery sunk verbatim to `references/grill-protocol.md`; two behavior changes added while compressing — **every question now carries a recommended answer** (adopted from mattpocock's grill-me: vetoing a default is cheaper than choosing among open options) and a **mid-grill render escape hatch** ("想像不出來" → offer `/shape:mockup`, the fix for 3-of-10 grills bailing to mockup in the transcript data). If post-compression grills still bail at the same rate, the grill-me hypothesis was novelty and the shape rolls back — the probe is reversible by design.

`nav:sync` (ADR-108, 97 → 41 lines while absorbing a second skill) is the proof the shape survives contact with a gate-heavy skill.

## The retirement rhythm (codified with this ADR)

Retirement becomes a rhythm, not an event: **a model-invoked skill with zero fires across 3 months of transcripts is demoted to `disable-model-invocation: true`** (summon-only — context tax zero, capability intact, no debate needed; a raw zero is never deletion grounds by itself — ADR-107's three-causes discipline still applies before any *deletion*). Demotion reverses the moment real demand shows. The rule lands in the repo-root CLAUDE.md maintenance section in the same commit. The current watch-list (`build`, `survey`, `probe`, `tour`, `retrace`, `migrate`) got its fair-run clock on 2026-08-12, when distribution was first fixed.

## Consequences

- Every non-relay `SKILL.md` re-homed to the three layers (relay excluded by standing instruction). Sunk text moves **verbatim**; gates stay in bodies; `model:` tiers and invocation flags untouched.
- Descriptions re-cut to signature form; measured vernacular triggers added where the transcript data showed them (`elicit`: grill me / 幫我想清楚 · `compose`: 整理 — 34 asks across 13 projects with no door found).
- Version bumps: nav 0.14.0 · shape 0.15.0 · reflect 0.9.0 · frame 0.8.0. Site map rev + version tokens, README where descriptions surface, Codex mirrors regenerated, validator green.
- Repo-root CLAUDE.md: ★ Self-contained convention amended; retirement rhythm added.
