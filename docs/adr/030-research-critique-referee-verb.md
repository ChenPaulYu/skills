# ADR 030 — `research:critique`: the adversarial-assessment verb

**Status**: accepted
**Date**: 2026-06-06
**Origin**: [`docs/observations/2026-06-06-adversarial-paper-critique-self-attack-is-the-kernel.md`](docs/observations/2026-06-06-adversarial-paper-critique-self-attack-is-the-kernel.md) (crystallised from a single dense session — writing an ISMIR referee report end-to-end — per ADR-018's single-session promotion gate: grounded ∧ friction-tested ∧ principle-level; the session was a sustained dogfood of the exact loop)
**Prior observations**:
- [`docs/observations/2026-06-06-grounding-is-intent-relative.md`](docs/observations/2026-06-06-grounding-is-intent-relative.md) — grounding has no intent of its own; its grain is set by the verb that drives it (resolves where the deep mechanism grounding lives: inside `critique`, not `dissect`)
- [`docs/observations/2026-06-03-paper-analysis-gap-claim-mechanism-evidence.md`](docs/observations/2026-06-03-paper-analysis-gap-claim-mechanism-evidence.md) — the `dissect` skeleton this verb consumes

## Context

ADR-027 established the `research` plugin around **argument anatomy** and chose `dissect` as the first verb — explicitly noting that `dissect` "carries no false connotation of *opposing* the argument (unlike `critique`)." That parenthetical reserved `critique` for the case where opposing *is* the intent.

A long session writing a conference referee report surfaced that case. The work was not "understand this paper" (`dissect`) nor "where does my claim sit" (`map`) — it was **assess whether the evidence holds, and produce a defensible review**. The same handful of analytical moves recurred on every claim and every experiment, and one discipline — *attacking each criticism before shipping it* — was what made the review credible. That discipline is exactly the thing an LLM skips by default (sharp criticisms are cheap; recomputing is the work).

Two questions:
1. Is "review a paper" a distinct verb, or just `dissect` with an attitude?
2. Where does the deep mechanism grounding it required belong — `dissect` or `critique`?

On (1): distinct. `dissect` grounds an argument to *restate* it; `critique` grounds it to *attack* it, and adds two things `dissect` has no reason to do — a **claim↔evidence audit** (validated ≠ claimed) and **self-adversarial verification** (refute each finding, cut non-survivors, keep a cut-log). Producing a referee report with a conditional rating is a different artifact from a dissection skeleton.

On (2): `critique` — resolved by the *grounding-is-intent-relative* observation. Grounding's depth and target are set by the verb that drives it; the attack-grade grounding (exact metric formulas, ablation arms, what is fine-tuned, what each knob does) exists only because `critique` will strike there. So it lives in `critique`, which *reuses* `dissect`'s descriptive skeleton and grounds deeper only on the attack surfaces.

## Decision

| Aspect | Choice |
|---|---|
| Skill verb | `critique` (the verb ADR-027 reserved — here opposing/adversarial assessment *is* the intent) |
| Plugin | `research` (third skill; spine: `dissect` understands · `map` positions · `critique` assesses) |
| Relationship to `dissect` | consumes it — reuse the skeleton, then ground deeper on attack surfaces (same one-way reuse pattern as `map → dissect`) |
| Two coupled cores | **Ground** (intent-scoped, to recompute-depth) → **Self-attack** (refute each finding before it ships) |
| Non-negotiable feature | every finding ships with a "survived (evidence) / cut (reason)" stamp; a **cut-log** records the kills |
| Verdict ownership | the **reviewer** sets the rating — the skill surfaces, drafts, recommends; it never assigns the verdict (a hard checkpoint) |
| Output | two-layer: full-evidence analysis note ↔ lean review draft (conditional rating) that points back; plus the cut-log |
| Scope | best on empirical papers with tables/ablations; degrades gracefully on theory/qualitative (drop number-recompute scans, keep claim↔evidence + self-attack) |

## Why `critique` over alternatives

- **`review`**: too broad — also means "look over", and collides with code-review connotations in a skills marketplace.
- **`referee`**: accurate for the conference case but narrow — the verb also applies to critically reading any argument, not only formal peer review.
- **`critique`**: names the adversarial intent precisely, and is exactly the connotation ADR-027 *avoided* for `dissect` and reserved for here. The two now sit cleanly opposed: `dissect` = decompose without opposing; `critique` = oppose and stress-test.

## Why this is one skill, not several

The session also produced a front-end (deep grounding via Q&A + interactive renders) and a back-end (draft in the reviewer's voice → iteratively tighten). Neither earns its own skill:
- The grounding front-end is `critique`'s grounding phase — intent-scoped, not a standalone "understand" skill (grounding-is-intent-relative observation).
- "Iterative tightening" is the self-attack applied at the prose level; "draft in the reviewer's voice" is generic voice-matching from examples — a cross-cutting convention, not a verb.

So the verb count stays at one new skill, with grounding and self-attack as its two coupled cores.

## Consequences

- `research` is now three verbs on one spine; `plugin.json` → 0.3.0.
- `critique` is the first `research` skill to *consume* another (`dissect`) and to default to a multi-file output (analysis note + review draft + cut-log).
- The verdict-ownership checkpoint is a new constraint not present in `dissect`/`map` (both are read-and-surface); `critique` deliberately stops short of the rating.
- Promotion is from a single session, justified under ADR-018 by sustained dogfooding (the whole referee report was produced through the exact Ground→Self-attack loop, including five criticisms killed by the self-attack).
