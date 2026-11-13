# ADR-138 — Frame becomes the understanding family (`unfold`, `tinker`)

> 2026-11-13 · Status: accepted · Builds on ADR-111 and ADR-126 (retired predecessors); follows ADR-137's roster change. Plan: `blueprints/plans/2026-11-13-frame-understanding-family.md`.

## Context

The owner repeatedly asks, in one phrasing, to be guided through an unfamiliar subject by
progressive disclosure (a repository, a library, later a book chapter by chapter), and once
corrected the model for answering step by step instead. Today that demand is typed by hand:
the method lives in a private note that is not installed as a triggerable skill. A second
recurring need is to *operate* an explanation (change a condition, watch what moves).

## Decision

1. **Add `frame:unfold`** — the entry. It holds a stable rhythm for any subject: skeleton
   first, one layer per turn, each term glossed at first use, claims marked recorded /
   inferred / unknown, the learner's questions setting route and depth, a checkpoint naming
   what is open, and a per-layer form choice (text, analogy, picture, object, or a cited
   quote), the form named in a short phrase. Subject grounding sits in
   `references/repository.md` and `references/document.md`.
2. **Add `frame:tinker`** — a form: an object to think with (Papert). One primary control, a
   visible before/after, details revealed on request, the object persisting across turns, an
   honest note where it simplifies the source. Output is an interactive HTML artifact,
   activated and handed over as a URL.
3. **Recast `frame`** as the understanding family: lenses (see it), forms (present it),
   entry (walk through it). The plugin keeps its name; six members, minor version bump.
4. **Composition by protocol.** Each form's discipline has one owner file; the shared-reference
   builder bundles generated copies into `unfold` (analogize's protocol, draw's `forms.md`,
   tinker's protocol). Mockup's activation text, now a second consumer, moves verbatim to the
   shared owner `plugins/shape/references/artifact-activation.md` and is bundled into mockup,
   tinker, and unfold. Shape takes a patch bump.
5. **Two considered-and-dropped items.** A standalone `eli5` was dropped: ELI5 sets *depth*,
   which the standing plain-language rule and unfold's skeleton layer already own, so a skill
   would add too little behavior for its resident description (ADR-109); `analogize` keeps its
   ELI5 trigger and gains one line (reduce to one prerequisite-free idea first). The name
   `analogize` was kept after a naming round: it names the assimilation act, not a depth.

## Why this is not `tour` or `fathom` again

Retirement test and retained lessons (ADR-126 table; ADR-111's "layers need a defined question"):

| Retained, now in `unfold` | Retired, not reintroduced |
|---|---|
| Check the source before explaining | Fixed level count and exit gates |
| Recorded reason vs inference vs unknown | Trust/index ceremony before a task |
| Connect unfamiliar mechanisms to what the learner knows (analogize form) | Mandatory calibration and learner-state files |
| Repair the exposed misunderstanding, do not replay everything | Restoration to a curriculum after a free dive |
| A picture when it makes a relationship understandable (draw form) | Artifact availability governed by course progress |
| Each layer answers a defined question (ADR-111) | One altitude then a correction loop |

`unfold` has no level count, no gate, no state file, and no route back to a plan. Its rhythm
is the only fixed part.

## Why composition by protocol respects the no-skill-calls rule

`docs/out-of-scope/skills-dont-invoke-each-other.md` bars one skill calling another and silent
auto-running at decision points. Choosing an explanation form mid-walkthrough is not a
decision point, and `unfold` runs no sibling skill: it applies bundled copies of the
disciplines inside its own turn, as `shape:probe` already restates its frame chain inline.
Each form stays its own standalone entrance ("用比喻解釋" goes straight to `analogize`).

## Consequences

- Frame goes from four skills to six; resident description cost rises by two descriptions.
- Three bundled form copies in `unfold` are generated and validated for drift; changing a
  form owner refreshes `unfold` automatically.
- Forward test pending: one `unfold` session on an unfamiliar public repository and one on a
  paper chapter, then the next monthly `scripts/skill-usage.mjs` snapshot.
- Outside this repo, after ship: the owner's private walkthrough note is superseded by `/frame:unfold`.
