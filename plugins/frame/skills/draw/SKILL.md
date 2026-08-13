---
name: draw
description: "Decide how to picture something you already understand so it lands for someone else: which FORM the question asks for (in what order? who talks to whom? where does it live? which should I pick?) and which MEDIUM carries it (terminal ASCII · a markdown table · mermaid in a doc · an interactive artifact). Fires on 'draw this out', '這個畫出來比較好懂', 'visualise this architecture', 'help me explain this to the team'. It owns the strategy, not one output format — /shape:mockup is the interactive-HTML executor it reaches for when that medium wins."
---

# draw — choose the picture, then choose what carries it

Make something already settled land for someone else. Sibling of `/frame:analogize`: same
direction (delivered outward, not derived for yourself), same premise (the thing is understood;
only its legibility is in question), different medium.

**This skill owns the strategy — two decisions, in this order.** It is deliberately not tied to
one output format: the same map may be six lines of ASCII in a terminal, a mermaid block in a
README, or an interactive artifact, and picking wrong is the usual reason a good picture fails.

## Decision 1 — which form?

**Ask what question the audience will put to the picture, then draw that.** Full vocabulary and
what each form earns: `references/forms.md`.

| Their question | Form |
| --- | --- |
| In what order does it happen? | flow chart |
| Who talks to whom, and when? | sequence diagram |
| What state is it in, and what changes it? | state diagram |
| Where does each thing live? | map with fixed positions |
| What uses what? | node-edge graph, canonical path weighted |
| What kinds are there? | grouped map (not a literal tree) |
| Which should I pick? | matrix — not a diagram |
| What accumulates, what expires? | stepper over time |
| How is this different from what I know? | side-by-side diff |

## Decision 2 — which medium?

Cheapest medium that carries the form wins. Selection rules and per-medium grammar:
`references/media.md`.

| Medium | Reach for it when |
| --- | --- |
| **Terminal ASCII** | it is small, needed *now*, and consumed in the conversation. No artifact, no file. |
| **Markdown table / list** | the form is a matrix or a list. Tables need no drawing. |
| **Mermaid** | a flow, sequence or state diagram must **live in a document** — versionable as text, renders in most viewers. |
| **Annotated real output** | the thing already exists and is legible (a log, a response, a tree) — point at it rather than redrawing it. |
| **Interactive artifact** | **interaction changes visible state** (stepping time, switching a variant, re-lighting a path), or the audience asks. Borrow `/shape:mockup`'s build protocol for this one. |

**"It would look nicer" is not a reason to escalate.** Every step up this list costs the audience
a context switch and costs you verification.

## Gates

- **Don't draw what isn't relational.** A set of independent items is a list; a diagram asserts
  relationships, and drawing one where none exist teaches a falsehood.
- **The payload is never behind the interaction.** Anything that overturns what the audience
  believes must be legible without clicking. Fold detail, never the headline.
- **Name things by what they do with them** — an install line, an import, a call, a path — never
  by architectural category (*embedded · service · layer · runtime · abstraction*, in any
  language). Those explain a shape to someone who already owns the taxonomy.
- **One example threads the whole thing**, entering where it is first needed: small enough to be
  boring, rich enough to require the mechanism.
- **Verify before delivering**, and say "reload" if you revised a page they already had open.

## Not this

| If… | Then |
| --- | --- |
| something is still **being chosen** | `/shape:mockup` on its own — it renders disposable candidates to decide between. Mockup draws what *might be*; this draws what *is*. When `draw` picks the interactive medium it borrows mockup's protocol, so the two compose rather than compete. |
| the difficulty is **conceptual, not structural** | `/frame:analogize` — a stress-tested comparison lands better than a box diagram. |
| you are **teaching a repository level by level** | `/fathom:guide` — it borrows this grammar and adds its own pedagogy on top. |

## Communication style

Explain in the audience's language, plainly. Lead with one sentence; precision after, only where
needed; keep code, identifiers and paths in their original form.
