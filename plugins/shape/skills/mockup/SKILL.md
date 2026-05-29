---
name: mockup
description: Converge a decision by generating and rendering a real, disposable, *interactive* artifact — never a prose description, ASCII sketch, or option list. Fires when the user ASKS to see / compare / try / mock / diagram / visualize something: "mock up X", "make a mockup", "show me what X looks like", "try a few variants", "draw the flow", "visualize / diagram this", "which of these", "I don't even know the options". The artifact is a UI mockup for look-and-feel decisions, OR an interactive diagram / chart / graph / state-flow for backend / agent / data / structural ones — anything with no literal screen still gets a rendered, clickable thing. NOT for pure definitional / ontology questions where no render would help ("what IS this concept") — those are verbal clarification. The output is always an interactive HTML. Also invokable explicitly as /shape:mockup. Language- and framework-agnostic; the render step flexes per project.
---

# Render-to-decide — mockup or diagram

Converge a decision by confronting the user with a **real, disposable, interactive artifact** — not a description of it. You **generate** the candidate space and render it; the user points. For look-and-feel decisions the artifact is a **UI mockup**; for backend / agent / data / structural decisions with no literal screen, it's an **interactive diagram / chart / graph / state-flow**. Same skill, same core.

## Why this skill exists

You can't judge from a description. Prose, ASCII, an option list all *float* — they read fine and decide nothing. A real, interactive artifact rendered at the right grain is **decidable**: the user looks, clicks, flips, picks. This skill makes that artifact cheap enough to throw away, so the user judges the thing instead of a paragraph about it. Often the user has no options yet — just an open question — so **generating a divergent candidate set is half the value**, not a precondition.

## Core — everything else derives

> **Core: the unit of judgement is a real, rendered, disposable, *interactive* artifact — never a description.**
>
> **The one non-negotiable: the output is always an *interactive* HTML — you can hover / click / flip / expand it. Never a static image, ASCII, an option list, or prose. Everything else flexes; this does not.**

- **The artifact's FORM follows the decision** — a UI mockup for look-and-feel; an interactive diagram / chart / graph / state-flow for backend / agent / data / structural decisions. No literal screen ≠ no render: you draw the structure/flow and make it clickable.
- **Inherited family principle (the visual form of "reframe to the most fundamental layer"):** generate broad enough to include the **"don't / nothing / merge these"** candidate — so seeing what "don't" looks like reframes the question, not just answers it.

Everything below **derives** from the core — when in doubt, trace back:

- *Probe, not a stage* — the artifact is the unit of judgement, so it fires wherever a judgement is needed and can **feed back upstream** (a rendered candidate can change the *concept*, not just the surface).
- *Render when in doubt* — descriptions float; you can't tell upfront if one would suffice. Bias to rendering (cost = one throwaway file).
- *Weight-adaptive + exit on the pick* — the artifact is disposable and the *user* judges; don't over-produce, stop the moment they point. A genuinely trivial change → just make it.

## When it fires — and the boundary with verbal clarification

**Fires on the user's request to see / compare / render** — "mock this", "make a mockup", "draw / diagram / visualize this", "show me what X looks like", "try a few variants", "which of these", "I don't know the options — render them". It does **not** auto-fire just because a visual or structural element gets mentioned in passing. `/shape:mockup` is the explicit override; otherwise it triggers on the request.

**Boundary (not "visual vs conceptual"):** the line is **"can a rendered interactive artifact make this decidable?"**

- **Yes → this skill.** Including structural / data / flow decisions — an interactive diagram settles "how do these entities relate", "how should this agent branch", "what's the pipeline shape".
- **No → verbal clarification (a grounded fork).** Only pure definitional / ontology questions where no render would help — "what *is* a moment". Don't force a render where none clarifies.

## Default protocol — light (the norm)

1. **Ground.** Read the real thing the artifact represents: for UI, the real palette / proportions / surrounding surface; for a diagram, the real states / entities / data shape / flow. Don't render in a vacuum — an artifact ungrounded from the real thing isn't decidable.
2. **Generate + render the candidate space — cheaply, in one interactive HTML.** Two layouts of the *same* light default (often both, in sequence):
   - **(b) Discover** — option space open: render **a row of divergent generated candidates** side by side, grounded. Generate *broadly* and include the **"don't / merge / nothing"** candidate — that's what lets the decision reframe. (The common case; the user rarely brings formed options.)
   - **(a) Refine** — direction known: one candidate with each **undecided sub-point on a live toggle**, flipped in place.
   Either way: a single standalone HTML file — inline everything, deterministic data, zero build, no external assets.
3. **Render + show.** Open at the right grain and capture what the user sees. (Render mechanics = a **per-project verify helper**, see below.)
4. **Let the user point — and watch for the reframe.** They look / click / flip / pick. Stay alert for the artifact revealing the *question was wrong* (the element shouldn't exist; text beats the icon; two stages should be one). Surface it; don't just answer the surface ask.
5. **Residue + disposal.** Record the pick. **Most artifacts are then discarded** — their job (converging the decision) is done. Promote to a visual-lock only per the rule below (rare).

## Example — the move in two shots

**Visual (UI):** a button could use an icon. Instead of listing options in prose, render **one interactive HTML** with a **row of candidates at the real 20px size in the real toolbar** — several icons, **plus a plain-text candidate, plus a "no icon" candidate**. At real size the answer is often "plain text wins" or "it needs nothing" — the real decision wasn't "which icon" but "should it have one at all".

**Non-visual (agent / data / flow):** an agent's branching, or how a few entities relate. Instead of describing it in prose, render **an interactive diagram** — click a node to expand its branch / reveal its edges — grounded in the real states/entities, including a **"merge these two / drop this step"** candidate. Seeing the flow laid out reframes "which branch order" into "these two stages are actually one".

Both carry the whole skill: interactive HTML · grounded in the real thing · a generated space · the **"don't" candidate** · the **reframe**.

## Escalate — heavy (rare exception)

Only when the decision is load-bearing, spans many variants, or needs a durable comparison record: **multiple files + screenshots + a decision note** (shared scene · what each is · build-cost · what's NOT in scope · fake-data note). Mark it the exception; (a)/(b) in one file is the default — a row of candidates is **not** heavy.

## Visual-lock: retire-on-ship, stamp, don't maintain

A lock (a chosen artifact frozen as a reference) is **rare** and **decays** — by altitude:

- **Detail / component-level** → **retire on ship.** Once the real thing ships, the **running system is the ground truth**; the artifact's job is done. Keeping it as a "north star the system must match" inverts reality → drift / lie.
- **Structural / high-level** → may persist, **but must carry a freshness / supersession stamp**: "intent as of `<date>`, shipped `<ref>`, details defer to the real system." Without the stamp it's a lie.
- **It can't auto-regenerate from source** (unlike a generated codebase map) → discipline is **retire + stamp, never silent refresh.** Most discard; a permanent lock is a rare exception.

## Storage & format

- **Where:** a project-local, **git-ignored** `mockups/` directory by default — artifacts are disposable decision-scaffold, not source, so they stay out of version control. One **dated topic subfolder** per decision: `mockups/<date>-<topic>/`. (Exact location is a per-project setting; the default is a git-ignored `mockups/`.)
- **Format:** a **single self-contained interactive HTML file** (the non-negotiable) — inline styles + script, deterministic data, no build, no external assets. Screenshots are transient supplements, never the deliverable.
- **Progressive disclosure (agent-scannable):** open the file with a top `<!-- -->` comment stating **what it is · the candidates rendered · the pick (once decided)**, so an agent grasps the artifact from `head` without parsing the whole DOM. Interface-first applies to the throwaway too — a human points at the rendered thing; an agent reads the header. (Same rule as the blueprints overview template's top comment.)
- **Only thing that leaves the throwaway zone:** a promoted visual-lock (rare) — committed or referenced from the project's CLAUDE.md, always stamped. Everything else is discarded.

## Grounded-replica discipline (what makes an artifact trustworthy)

- Grounded in the **real thing**: UI → true size, real palette, real surrounding context; diagram → real states / entities / data shape / flow (not toy or abstract).
- **Match the project's established visual language.** Before rendering, look for prior artifacts the user already reads — sibling mockups, a codebase-map / docs site, a design-token file — and reuse their palette, fonts, and conventions (e.g. a bilingual toggle, a dark/light theme). A mockup that looks foreign to its siblings reads as "not ours" and the user spends judgement on the skin instead of the decision. The *specific* tokens/conventions are per-project (see the per-project render slot below); the *rule* — conform to what's already there — is universal.
- Deterministic data · no external assets · no build · single self-contained file.
- A faithful, **disposable** replica — not the real components, not pixel-perfect, not production code. Cheap + throwaway, real enough to decide on.
- Not grounded at the right grain → re-ground before asking for a decision.

## Activate it — open + hand over a URL (don't just write the file)

A file written to disk is not yet a decidable artifact — the user has to *see* it. So after writing, **activate it and surface a clickable URL in the chat**, the way a good scaffold does:

- **Open it** with the platform opener (`open <file>` on macOS, `xdg-open` on Linux, `start` on Windows) so it renders immediately.
- **Hand over a URL in the reply** the user can click: a `file://<absolute-path>` link by default. If the artifact needs an HTTP origin (fetches, modules, anything `file://` blocks — rare for a self-contained mockup), start a throwaway static server (`python3 -m http.server` in the artifact's dir) and give the `http://localhost:<port>/<file>` URL instead, noting it's a temporary server.
- Prefer a real origin over a screenshot: the whole point is that the user can hover / click / flip the live thing. A screenshot is a transient supplement, never the hand-off.

## The render step is per-project — the browser-verify slot

"Render + capture" uses shape's shared **browser-verify capability slot** (defined once in `plugins/shape/CLAUDE.md`, shared with `align` + `build`): a named default (`agent-browser`) + detect + fail-helpfully if missing + per-project override. Open the file / running system, locate the target, screenshot / interact. Keep the core environment-agnostic; don't hardcode a tool — name the capability.

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| Force a render on a pure definitional / ontology question | If no render makes it decidable, it's verbal clarification — not this skill. |
| Describe a backend / agent / data flow in prose when a diagram would settle it | A render isn't UI-only. Draw the interactive diagram. |
| Offer ASCII / an option list / prose to decide from | A description isn't decidable. Render real candidates. |
| Render only the options the user named | Generating a *divergent* set (incl. the "don't / merge" candidate) is half the value. |
| An ungrounded / wrong-grain artifact | It floats; the judgement will be wrong. Ground it in the real thing. |
| Treat "multiple candidates" as heavy | A row in one file is the *light default*, not the exception. |
| Use real components / chase pixel-perfect / write production code | Overkill. A disposable replica is the point. |
| Auto-fire on a passing mention, or decide for the user | Fire on the *request*; you generate + render, the user points. |
| Keep a visual-lock as a permanent north-star the system must match | Retire on ship; the running system becomes the truth. |
| Keep iterating after the user has picked | Exit on the pick. |

## Output

- **Always: an interactive HTML file** — the one non-negotiable. A row of generated candidates and/or one candidate with live toggles; UI mockup or interactive diagram, openable and interactive, grounded in the real thing.
- A recorded pick; most artifacts then discarded.
- A visual-lock only as a rare, stamped exception (structural-level).
- (Escalation, rare) multiple files + a decision note.
