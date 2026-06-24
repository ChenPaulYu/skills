---
date: 2026-06-24
status: raw
---

# "progressive disclosure" conflates two orthogonal axes — navigation (gist→detail) and grounding (claim→evidence→example); `/nav:compose` owns only the navigation axis

> **TL;DR**: A natural way to describe a good doc is the spine *title → outline → argument → evidence → example*. But that spine glues two **independent** axes: a **navigation axis** (how a reader drills from gist to detail) and a **grounding axis** (how a claim is backed and made concrete). `/nav:compose` *is* the navigation axis abstracted (lead-with-point, headings-as-interface, head-able top, group-by-knowledge — rules ②/④/⑧), and it deliberately stops there, delegating the grounding axis to "the genre's idiom" (rule ⑤). So a consumer asking compose for an evidence/example structure asks the wrong owner — that shape is theirs to define per genre.

## What prompted it

Designing the body format for relay's `sync` kind, the user proposed the title→outline→argument→evidence→example spine and asked whether `/nav:compose` already follows it.

## The signal

Map the spine onto compose and it cleaves cleanly:

- **title → outline → argument** = navigation. compose isn't *close* to this — it *is* this, abstracted (rule ② "headings are the interface, drill as needed, head-able"; rule ⑧ the mandatory one-line lead).
- **argument → evidence → example** = grounding. compose has no evidence or example layer — by design. Rule ⑤ hands genre-specific content roles to "the genre's idiom."

The two axes are independently variable (the proof of orthogonality): you can have perfect progressive disclosure with no evidence/example (a status board), or a well-grounded argument that buries its thesis (bad navigation). They **meet only at "argument"** — the deepest navigation layer and the top of the grounding chain.

Consequence for any consumer (relay sync, shape's core, an ADR): "follow `/nav:compose`" buys the navigation axis only; the grounding idiom (evidence→example) is the consumer's own to spec on top. Worth making explicit in compose so consumers don't expect a shape it deliberately withholds.

## Evidence so far

- **Only case (2026-06-24, relay sync body design)**: the spine had to be split to see that compose covers its first half and intentionally not its second.

(One case → stays `raw`. Promote if a second consumer mistakes compose's silence on evidence/example for an omission rather than a scope boundary.)

## Links

- Sharpens [ADR-049](docs/adr/049-nav-compose-verb.md) (compose's scope). Related: [[skill-reuse-is-reference-not-import]].
