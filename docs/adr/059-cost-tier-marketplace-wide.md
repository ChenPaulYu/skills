# ADR 059 — the cost tier goes marketplace-wide: which verbs run on `model: sonnet`, and which deliberately don't

**Status**: accepted — implemented 2026-07-02 (nav `0.8.0` · relay `0.5.0` · reflect `0.3.0`; shape's additions fold into its uncommitted `0.7.0`)
**Extends**: [ADR-058](docs/adr/058-shape-cost-tiers.md) (which introduced the tier for shape: `reconcile` + the `browser-verifier` subagent)

## Context

ADR-058 established that a mechanical verb can declare `model: sonnet` in its SKILL.md frontmatter (a turn-level override — the session model resumes on the user's next prompt) and applied it to one verb. The user then asked for the tier to cover *all* the mechanical verbs, marketplace-wide. That forces two things ADR-058 didn't need: a **single owner for the criterion** (it now spans four plugins — restating it per plugin is rule ① leakage), and an explicit **line for the borderline cases** (which verbs look mechanical but are actually judgment work).

## Decision

1. **The criterion moves to the repo-root `CLAUDE.md`** (Authoring conventions): *mechanical sweep / format / scan / render-from-structured-source → `model: sonnet` frontmatter; open-ended judgment → session model; every gate (diff, write-gate, confidence-gate) unchanged by the tier.* Each plugin's `CLAUDE.md` lists only **its own instances** — criterion one owner, instances one owner each.
2. **Tiered verbs** (each carries the frontmatter + a one-line in-body note):
   - **nav `map`** — renders the codebase map from headers `sync` already maintains; derived, high-volume.
   - **shape `reconcile`** (ADR-058) + **shape `align`** — align's bulk is mechanical (scan the tree, rewrite `plan.md`, re-render `overview.html`); the now/next/later triage stays *with the user*, so the tier changes the model, not the collaboration.
   - **relay `format`** — syntactic frontmatter conformance sweep.
   - **relay `digest`** — read-only stream scan; runs on every open, so the saving recurs.
   - **reflect `summarize`** — neutral, exhaustive recap from durable state; objectivity is the spec, selection is explicitly refused.
3. **Deliberately NOT tiered — the instructive borderline: nav `sync`.** It pattern-matches "sweep + formulaic output," but it *authors the source of truth* every navigability consumer reads (map renders from it, reconcile's staleness signal reads it, build's inject step greps it) — and nav's rule ⑧ makes composing a header double as a *diagnosis* (struggle-to-describe is the deep-module test). A shallow header is a lie every future session inherits. The author/renderer split is the memorable form: **`sync` writes the negatives on the session model; `map` prints them on sonnet.** Also left untiered: `reflect:catchup` (judges "now + next"), `relay:launch`/`register` (too small to save anything; launch frames a project), `shape:setup` (debugs a live verification chain), and all analysis/converge verbs.

## Consequences

- **Registration** — criterion bullet added to repo-root `CLAUDE.md`; instance lists added to `plugins/{nav,relay,reflect}/CLAUDE.md`; shape's ADR-058 bullet trimmed to point at the root owner (leakage removed) and extended with `align`. relay:format's self-referential version string updated to `(relay 0.5.0)`. Manifests + codex regenerated; validator green; site map rev bumped.
- **Reversal is one line** — a tier that proves wrong for a verb is removed by deleting its frontmatter line + note and amending this ADR; no protocol changes ride on it.
- **The tier is invisible to gates** — diff gates, write gates, and the below-90% ask rule read identically on either model; a sonnet turn that hits genuine ambiguity still stops and asks.

## Out of scope

- Auto-detecting "mechanical" — the list is hand-curated per plugin; a new verb decides its tier in its own ADR.
- Per-turn effort tuning (`effort` frontmatter) — a separate dial, untouched here.
