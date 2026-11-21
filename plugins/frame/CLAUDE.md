# frame — plugin guide

> For editing this plugin. To run a skill, read its `SKILL.md`; each is self-contained.
> Repo-wide rules live in the root [`CLAUDE.md`](CLAUDE.md).

## What frame is ([ADR-010](docs/adr/010-frame-family-charter.md))

The understanding family. Each member applies a named discipline the model's default
reasoning or explaining skips.

- **Lenses — see a problem:** `first-principles` (decompose down to verified constraints and
  rebuild), `orthogonal` (factor into independent axes and test the independence).
- **Forms — present an answer you already have:** `analogize` (candidate analogies, mapping
  checked, breakage named; also the ELI5 door), `draw` (the right picture and medium),
  `tinker` (one small interactive object the learner can poke).
- **Entry — walk through a subject:** `unfold` (skeleton first, one layer per turn, a form per
  layer, claims marked recorded/inferred/unknown).

Frame is independent of nav and shape. Lens findings may feed shape when the user asks or
continuation is already authorized; forms and the entry do not. `unfold` applies the forms
through generated copies of their disciplines, never by calling a sibling skill.

## The through-line

1. **A named operation** — keep the checks that distinguish the frame.
2. **A reasoning difference, not a worksheet** — headings, tables and candidate counts are not
   evidence of quality.
3. **Grounded, not asserted** — check what can be checked; mark the rest uncertain or name
   where an analogy breaks.
4. **Scope-aware continuation** — analysis ends with the finding; no route menu or automatic
   skill call.

## Boundaries

- **vs `/seek:elicit`:** elicit draws out an answer the user holds; lenses derive one from
  the problem's structure; forms deliver an answer the agent already holds.
- **vs reviewing a document:** frame has no referee skill; `unfold` guides a learner through a
  source without judging it.
- **vs the default:** every member must name what it adds over plain reasoning or a plain
  explanation with a metaphor. If nothing, it is not a skill.

## Conventions

- **Naming:** lenses keep their canonical concept names (`first-principles`, `orthogonal`) for
  discoverability; the others are bare verbs.
- **Proportional output:** short answers for small questions; structure only when it helps.
- **In chat, no files** — except `tinker`'s disposable HTML in session scratch space. A member
  never writes source or makes a decision; persistence routes to shape.
- **Plain language without performance:** technical terms are fine with a brief gloss;
  analogies are optional outside `analogize`; no banned-word list or compulsory closing
  metaphor.

## When editing frame

- **New member:** name the check it adds over the default and show recurring use. Retired
  members (`graft`, `dialectic`, the speculative `invert`/`second-order`) failed one of the two.
- **Provisional members:** `analogize`, `unfold` and `tinker` are still proving their triggers;
  refine their descriptions in place from real invocations. `analogize` and `draw` are on the
  retirement watch list ([ADR-009](docs/adr/009-retirement-policy.md)).
