# ADR 063 — blueprints drops the standing `overview.html`; a human view renders on demand via `/shape:mockup`

**Status**: accepted — implemented 2026-07-13 (shape `0.7.1 → 0.7.2`)
**Supersedes**: the "one current state, two renders" framing introduced with `align`/`setup` (blueprints-spec.md's original layout) and refined by the consumption-gate rule added the same day this ADR lands (a same-day reversal — see Context).

## Context

blueprints originally shipped with a standing, maintained `overview.html` — a click-to-reveal HTML projection of `plan.md` + `decisions.md` that `align` regenerated on every run and `build`/`reconcile` kept in sync. Earlier the same day, a consumption-gate rule was added (default to skipping the render for solo/unread projects, generate "on demand" instead) after the pattern's first real-world use (a solo-maintained repo, `madmom-infer`) surfaced that the file was never opened.

The user's follow-up, direct: **"I'm certain I'll never use it again."** The consumption-gate compromise (still ask, still keep the machinery on standby per-project) didn't match that — it kept a whole maintained-file mechanism (a template contract, a regenerate step, a browser-verify pass, a retire-if-unread cleanup path in `reconcile`) alive across every skill in the family for a capability that had zero real usage. The user's own refinement, mid-conversation: rather than deleting the render capability outright, repoint it through `/shape:mockup` — the family's existing "render a real, disposable, interactive HTML artifact on request" verb — so the capability survives, but only as an on-demand render, never a standing file anything auto-maintains.

## Decision

1. **`overview.html` is no longer a blueprints artifact.** The committed tree is `thoughts/`, `decisions.md`, `plans/`, `mockups/`, `plan.md` — nothing else. `plan.md` is the single maintained board, agent- and human-readable (it already was plain markdown; there was never a reason the human copy needed to be a second file).
2. **A visual view, when wanted, is a `/shape:mockup` request.** `mockup` gained a new trigger ("show me the board" / "what's the status, visually") and a board-snapshot contract: copy `overview-template.html`, fill it from the current `plan.md` + `decisions.md`, activate and hand over the URL — same as any other mockup artifact. **Always disposable** — never written back as a standing `overview.html`.
3. **`align` drops two protocol steps** (regenerate the HTML, verify+activate via browser) and the corresponding "two renders" spine restatement. Its job now ends at writing `plan.md`.
4. **`reconcile` drops the render-retirement logic** (the "is `overview.html` unread → retire it" check from earlier the same day) — there's nothing to retire going forward; it keeps a one-line migration note for any project still carrying a leftover standing file from before this ADR.
5. **`build` keeps its screenshot-as-evidence step**, but the screenshot is referenced by path from the Shipped entry in `plan.md`, not embedded via an `overview.html` regenerate.
6. **`setup`'s birth-time blueprints scaffold** drops the weight-adaptive/consumption-gate decision entirely (product vs. solo, multi-reader vs. not) — every project gets the same lean tree at birth, `plan.md` only, no per-project judgment call to make.
7. **The shared browser-verify slot** (`plugins/shape/CLAUDE.md`) drops `align` as a consumer — it's shared by `mockup` and `build` only now.

## Consequences

- **Net simpler, not net-zero.** This removes an entire per-skill decision axis (consumption-gating) that existed for less than a day and was already proving to add a question ("do you want the board rendered?") the user had to answer per project. The replacement has no decision to make: the render is always on-demand, always via one door (`/shape:mockup`), never maintained.
- **Nothing is actually lost.** `overview-template.html` and its full rendering contract (one layer by status, click-to-reveal, the 🧭 Decisions layer, bilingual, self-contained) survive verbatim — they just moved from "align's standing-file contract" to "mockup's on-demand-render contract," in the same file, at the same path.
- **One door, not two.** This is consistent with the family's own ADR-038 rule ("the verb is the only door for its deliverable") — rendering an interactive HTML artifact was already `/shape:mockup`'s job everywhere else in the family; blueprints' standing `overview.html` was the one exception that hand-rolled its own render/verify/retire lifecycle instead of going through that door. Folding it in removes the exception.
- **Six files touched in one commit** (the "changing a shared rule every skill restates" gate): `plugins/shape/CLAUDE.md`, `align/SKILL.md`, `align/references/blueprints-spec.md`, `align/references/dev-workflow-stub.md`, `reconcile/SKILL.md`, `build/SKILL.md`, `setup/SKILL.md`, `setup/references/stack-principles.md`, `mockup/SKILL.md`. `overview-template.html` itself is untouched — same template, new owner.
- **Reversal** would mean re-adding the regenerate/verify/retire steps to `align`/`reconcile` and re-introducing the consumption-gate question — a real revert, not a one-line change, since this ADR removes machinery rather than just flipping a default.

## Out of scope

- Any change to `/shape:mockup`'s own core protocol (disposal discipline, visual-lock rules, the render/activate mechanics) — the board snapshot is a new *trigger* into the existing protocol, not a new mode.
- Retroactively cleaning up `overview.html` files already committed in projects scaffolded before this ADR — `reconcile` flags and offers to retire them on its next run per-project; nothing auto-runs.
