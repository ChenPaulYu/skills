# Choosing a medium — what carries the form

Form and medium are two decisions, and conflating them is the usual reason a good picture fails.
A map is a map whether it is six lines of ASCII or an interactive canvas; what changes is the cost
to build, the cost to consume, and where it survives.

**Cheapest medium that carries the form wins.** Every step down this file costs the audience a
context switch and costs you a verification pass.

## Terminal ASCII

**When**: small, needed now, consumed inside the conversation. No file, no artifact, no reload.

Best for: a flow of under ~8 steps · a small map of 3–5 regions · a short pipeline · anything the
audience will read once and act on immediately.

Grammar that survives plain text:
- Use `│ ├ └ ─ ▼ →` rather than ASCII art boxes; alignment breaks in proportional fonts, and box
  drawing that must line up is the first thing to rot when someone edits a line.
- One concept per line. If a line needs a sub-clause, it needs its own line.
- Mark the loop-back explicitly (`↺ 回到 …`) — loops are what prose loses and what readers miss.
- Anchor the whole thing to one worked example, not to abstract placeholders.

Fails at: anything with more than one dimension of grouping, or where position must be remembered
across several drawings.

## Markdown table or list

**When**: the form is a matrix, a comparison, or a set of independent items.

This is the most under-used medium. People draw diagrams when the audience needs a table they can
scan down one column. If the audience must *choose*, they need a table; put the deciding dimension
in the first column and keep every cell to one line.

A list beats a diagram whenever the items have no relationships worth asserting.

## Mermaid

**When**: a flow, sequence, or state diagram must **live in a document** rather than in a
conversation — a README, an ADR, a wiki page.

Why it wins there: it is text, so it versions and diffs like code; it renders in GitHub, most wikis
and many editors; and it survives being copied into a doc that outlives the conversation.

Keep to the three types it does well — `flowchart`, `sequenceDiagram`, `stateDiagram` — and keep
node labels short. Mermaid degrades badly past roughly a dozen nodes: at that size, either split
the diagram or move to an interactive medium.

Fails at: fixed spatial layout (it lays out for you, so positions cannot be made permanent),
weighted edges, and anything needing interaction.

**Pick Mermaid over D2 when the diagram must live in a README that someone else reads on GitHub** —
that inline rendering is the only thing Mermaid has that D2 doesn't, and it is decisive when you
don't own the viewer.

## D2

**When**: a flow, sequence, state or containment diagram is worth keeping **and you control where
it renders**. Same idea as Mermaid — text in, diagram out — with far better defaults.

Why it wins where it wins: a node is a line, an edge is `a -> b`, styles go in braces, and roughly
thirty lines produce what would be several hundred lines of hand-written HTML. `sketch: true` gives
a hand-drawn look that reads as a diagram rather than as a slide. SVG is native output; PDF, PPTX
and GIF fall out of the same source, and multi-board sources can render as an animated SVG — a
cheap stepper without writing one.

Grammar notes worth knowing before the first render:
- **Set `theme-id: 0`** unless you want a specific look. The terminal themes uppercase Latin text,
  which mangles identifiers (`top_k` → `TOP_K`).
- Some shapes (`page`) render badly under `sketch: true`. Check before shipping.
- `top` and other layout words are reserved and cannot be node names.

Two limits decide when it loses:
- **The layout is the engine's, not yours.** It re-lays out on every render, so it cannot carry a
  **map** — the one form whose whole payoff is that positions stay permanent across drawings. Use
  D2 for flows, never for territory.
- **Its ASCII export mis-measures double-width characters.** Latin-only output is clean; CJK output
  has its box drawing shifted and is unusable. In a CJK context the terminal medium stays
  hand-written.

Cost: an install (`brew install d2`) plus a render step, and it does not appear inline on GitHub.

## diagram-design plugin

The polished-static lane between D2 and the interactive artifact: the `diagram-design`
marketplace plugin (installed 2026-08-14) renders 27 editorial diagram types as self-contained
HTML/SVG, skinnable to the project's tokens via its `style-guide.md`. Reach for it when the
diagram is a deliverable someone will keep and quality is part of the message; skip it for
quick in-conversation sketches (ASCII/mermaid are cheaper) and for anything stateful (the
interactive artifact owns state). Its own SKILL.md carries the full grammar — connector rules,
complexity budgets, taste gate — follow those, not a summary here. First validated on the
fathom family diagram (`etudes/atlas/docs/fathom-family.html`).

## Annotated real output

**When**: the thing already exists and is already legible — a log, a JSON response, a stack trace,
a directory listing, a test run.

**Reach for this before drawing anything.** Pointing at the real artifact with arrows and margin
notes is cheaper than redrawing it, and it carries a credibility that a redrawing loses: the
audience can go and produce the same output themselves.

Grammar: show the real thing verbatim, then annotate — numbered callouts beside the lines that
matter, and one sentence per callout. Do not tidy the output; the mess is part of what they will
actually see.

## Interactive artifact

**When**: **interaction changes visible state** — stepping through time, switching a variant and
watching a path re-light, selecting a node and seeing its neighbourhood dim — or the audience
explicitly asks for one.

Borrow `shape-mockup`'s build protocol for this medium: a real, self-contained HTML page, no
external requests, verified in a browser before delivery.

Two lessons already paid for, verbatim:

> Making every box clickable did not make the model easier to understand: each click merely
> replaced one block of prose with another.

> A mechanically correct interaction can still be pedagogically empty when the visible system
> itself does not change.

The test that separates a real interaction from decoration: **name what changes on screen when the
audience acts.** If the answer is "one block of text swaps for another", it is a link, not an
interaction, and the medium is one step too expensive.

## Composition and hand-off

Several forms may live in one container — chapters, one takeaway each, each picking its own form
and possibly its own medium. **The container is not a form**; it is the curriculum.

Keep one visual language across a set (canvas, palette, typography, diagram grammar). Five
artifacts that look like one thing are easier to hold than five that don't.

## Delivery discipline (any medium above the first two)

- **Verify before delivering**: exercise every interaction, console clean, no horizontal overflow.
- **Say "reload"** when you revise a page the audience already has open — a local file does not
  refresh itself, and a stale tab has been mistaken for a broken build.
- **Labels render in the audience's language.** The names in these files are roles, not strings.
- **Self-contained**: no external requests; inline everything.
- **Responsive**: rearrange stages rather than shrinking the whole drawing.
- **CSS trap**: an author `display:` rule beats the UA `[hidden]` rule — pair any
  `display:flex/grid` class with `.cls[hidden]{display:none}` when toggling visibility by attribute.
- **Delegating the build?** Copy the skill's gates into the brief. A sub-agent sees only the brief.
