---
name: mockup
description: "Converge a decision by generating and rendering a real, disposable, interactive HTML artifact — never prose, ASCII, or an option list. Fires on \"mock up X\", \"show me what X looks like\", or \"which of these\": a UI mockup for look-and-feel, or an interactive diagram for backend/agent/data/structural decisions. NOT for pure definitional questions (\"what IS this concept\") — that's verbal clarification."
---

# Render-to-decide — mockup or diagram

Converge a decision by confronting the user with a **real, disposable, interactive artifact** — not a description of it. You **generate** the candidate space and render it; the user points. For look-and-feel decisions the artifact is a **UI mockup**; for backend / agent / data / structural decisions with no literal screen, it's an **interactive diagram / chart / graph / state-flow**. Same skill, same core.

## Stance

> **Core: the unit of judgement is a real, rendered, disposable, *interactive* artifact — never a description.** The one non-negotiable: the output is always an *interactive* HTML — hover / click / flip / expand it. Never a static image, ASCII, an option list, or prose. Everything else flexes; this does not.

- **The artifact's FORM follows the decision** — a UI mockup for look-and-feel; an interactive diagram / chart / graph / state-flow for backend / agent / data / structural decisions. No literal screen ≠ no render: draw the structure/flow and make it clickable.
- **Generate broadly enough to include the "don't / nothing / merge these" candidate** — seeing what "don't" looks like reframes the question, not just answers it. Bias to rendering when in doubt (descriptions float; cost = one throwaway file); weight-adaptive, and exit the moment the user points.
- **Fires on a request to see / compare / render** ("mock this", "show me what X looks like", "which of these") — never auto-fires on a passing mention. Also fires on "show me the board" (an on-demand board-snapshot render, never a standing file).
- **Ground in the real thing before rendering** — the real palette/proportions/surrounding surface for UI, the real states/entities/data shape for a diagram; match the project's established visual language; default theme is light unless the project's own artifacts are dark.
- **A handfeel/gesture decision needs the real behaviour to actually run, verified with faithful input** — build only the decision-critical interaction, make its effect observable, and keep chrome (full styling, i18n, extra candidates) out — length is the smell on this kind of decision, not the effort.
- **A written file isn't a decidable artifact until activated** — open it (or serve it on a remote/headless box) and hand over a clickable URL; never hand off just a screenshot.
- **A visual-lock (rare) retires on ship at detail level, or carries a freshness/supersession stamp at structural level** — this skill states the rule; `/shape:reconcile`'s `mockups/` sweep (ADR-037) executes it, since nothing is shipped yet at mockup time.
- **Storage:** the blueprints tree's `mockups/<date>-<topic>/`, committed by default (watch the depth-unanchored `mockups/` gitignore trap).
- **After a pick, offer — never auto-run — the next step**: track it (`/shape:align`) and/or build it (`/nav:do` small · `/nav:plan` bigger), guarded + one-shot, only the branch(es) that apply.

Full protocol — the firing boundary detail (incl. the `/shape:dogfood` sibling distinction), the default (light) and escalate (heavy) render steps, a worked example, the grounded-replica discipline (handfeel + mocked-text-input caveats), activation mechanics, the browser-verify slot + `browser-verifier` subagent dispatch, the post-pick offer mapping, and the anti-pattern table: `references/mockup-protocol.md`.

## The render step is per-project — the browser-verify slot

"Render + capture" uses shape's shared **browser-verify capability slot** (defined once in `plugins/shape/CLAUDE.md`, shared with `align`): a named default (`agent-browser`) + detect + fail-helpfully if missing + per-project override. Open the file / running system, locate the target, screenshot / interact. Keep the core environment-agnostic; don't hardcode a tool — name the capability.

**Agent-side capture runs in the `browser-verifier` subagent (cost tier, ADR-058).** When the capture/verify is mechanical — confirming the artifact renders, checking a behaviour responds — dispatch the plugin's `browser-verifier` agent (model: sonnet) with the file/URL + what to confirm, and take back verdict + screenshot path; the image tokens stay out of the main context. Confirm a render **once**, not per iteration. The user-facing hand-off is unchanged: a live clickable origin, opened for the user — that part stays inline.

## After the pick — offer the next step: track it · build it (don't auto-run)

A pick has two natural next steps, and the offer should name **both** (ADR-028) — an `AskUserQuestion` with a "just record the pick, I'll continue later" opt-out (offer-next-action, ADR-007/015):

- **Track it → `/shape:align`** — triage the decision into `plan.md` (now/next/later). `align` is collaborative, so it runs **in-session** (it needs this conversation's decision), not a clean sub-agent. Offer this branch only when a `blueprints/` board exists (or scaffolding one is wanted).
- **Build it now** — when the pick is a concrete, decided, *behaviour-changing* build, route by scope: small · holdable-in-head → **`/nav:do`** (its check bracket — inject↔execute↔verify — is the point; don't flow into the build on ambient discipline and skip it); bigger / ambiguous / wants a written plan → **`/nav:plan`**; driving multiple `plan.md` items → the manual path (`/nav:plan` per item → `/nav:do`/`/nav:refactor` → `/shape:align`, ADR-110). This is the seam "make it functional" flows through — name the verb so the agent routes to its check instead of winging the build.

**Guarded + one-shot:** don't re-offer / nag across a rapid series of mockups; show only the branch(es) that apply (a disposable visual tweak with nothing to track *and* nothing to build → skip the offer entirely). An offer, **never a call** — skills don't invoke each other.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.
