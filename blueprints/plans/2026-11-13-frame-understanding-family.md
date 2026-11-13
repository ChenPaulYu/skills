# Frame as the understanding family — unfold and tinker

> **Status:** proposed (2026-11-13) · owner approved direction and names in conversation; implementation not yet started.
> **TL;DR:** Recast `frame` as the family that helps someone understand something: lenses to see it
> (`first-principles`, `orthogonal`), forms to present it (`analogize`, `draw`, new `tinker`), and
> one rhythm-holding entry (`unfold`) that walks a learner through any subject by progressive
> disclosure, choosing a form per layer. `dialectic` retired separately (ADR-137). A separate
> `eli5` was considered and dropped (see Roster).

## Context

**Recurring demand, manual today.** Codex history shows the owner repeatedly typing a guided-reading
request in one phrasing: "用 progressive disclosure 帶我認識 X" — six times in 2026-09-21..23 alone
(a video framework, an HTML-video SDK, a browser editor, an audio library), plus one correction:
"你好像沒有用 progressive disclosure 的方式再帶我理解，而是 step by step". 2026-08-10 he spelled out the
method: skeleton first (what would make someone understand in five minutes), minimal gloss for
each term at first use, detail only after the structure lands. Later sessions extend it beyond
repositories: a book chapter by chapter (2026-11-09) and "progressive disclosure can be used to
understand anything: table of contents → chapter → paragraph → sentence" (2026-11-08).

**Two failed predecessors, one surviving method.**

| Predecessor | Why it retired | Lesson kept |
|---|---|---|
| `nav:tour` (ADR-111) | one altitude, then a correction loop; layers had no coordinates | layers need a defined question each |
| `fathom` (ADR-126) | fixed five-level curriculum with gates and state files | the learner's questions set route and depth |

The owner's private wiki then grew `codebase-walkthrough` (v0.2.0), which already encodes the
ADR-126 lessons: a stable rhythm, not a syllabus; smallest useful mental model first; one
conceptual layer at a time; claims grounded in source; stop at a checkpoint. It is
repository-only and not installed as a triggerable skill, so the demand above never reaches it.

**The composition model comes from a sibling product design.** A reading-app session
(2026-11-12) converged three layers for explanation: *teaching method* (how to lead someone to
understanding), *presentation* (text, drawing, infographic), *interaction* (what the reader can
do — change a condition, step, replay). Progressive disclosure runs through all three. An
"object to think with" (Papert) is the interaction layer: a small manipulable thing the reader
can poke to see what changes.

## Approach

### Roster after this change

| Member | Role | Status |
|---|---|---|
| `unfold` | **entry** — holds the rhythm: skeleton → one layer at a time → checkpoint; tracks what the learner has, follows their questions; picks a form per layer | new (successor of the wiki's `codebase-walkthrough`, generalized) |
| `first-principles` · `orthogonal` | **lenses** — see a problem's structure | unchanged |
| `analogize` | **form** — connect to what the learner already knows (assimilation) | keeps its "ELI5" trigger; adds one line: on an ELI5 request, also reduce to one core idea with no assumed prerequisites |
| `draw` | **form** — choose the picture and its medium | unchanged (a polished infographic is one medium it can pick; not renamed — the skill also covers terminal ASCII, tables, mermaid) |
| `tinker` | **form** — build a manipulable object to think with: one primary control, visible difference, layered reveal | new |

**Why no `eli5` member.** ELI5 sets *depth* (one idea, no prerequisites), while analogize
sets the *vehicle* (borrow a familiar domain). The depth knob is already owned twice: the
standing plain-language reply rule for single explanations, and `unfold`'s skeleton layer for
walkthroughs. A separate skill would add too little behavior for its resident description
cost (ADR-109). The installed third-party `eli5` plugin is left to the owner's discretion.

`frame` keeps its name: "applying a frame" already covers both seeing and presenting; the
plugin's identity text changes from "explicit reasoning frames" to "understanding — see it,
present it, walk through it".

### How `unfold` uses the forms without calling skills

The marketplace rule "skills don't invoke each other" (docs/out-of-scope/skills-dont-invoke-each-other.md)
exists to keep silent automation away from decision points and to keep skills self-contained.
Choosing an explanation form mid-walkthrough is not a decision point, and there is precedent for
borrowing a sibling's discipline **by protocol** (`shape:probe` restates its frame chain inline).

Mechanism: each form's core discipline gets one owner file, and
`scripts/lib/shared-skill-references.mjs` bundles generated copies into `unfold` (the same
owner→consumer machinery shape uses for session-handoff). Each form remains its own
standalone entrance ("用比喻解釋" goes straight to `analogize`). `unfold` never auto-runs a
separate skill; it applies the bundled discipline inside its own turn.

**Choosing a form per layer.** `unfold` picks the form the current layer's question asks for,
defaulting to plain text; the learner can override at any time ("用圖講", "讓我試試").

| The layer's question | Form |
|---|---|
| What is it, in one breath? (the skeleton) | plain text at ELI5 depth, optionally one analogy |
| What is this unfamiliar abstraction like? | `analogize` discipline |
| How do the parts relate / flow / sit? | `draw` discipline |
| What changes if I change X? / why does it behave this way? | `tinker` discipline |
| Exactly what does the source say? | quote and cite the source; no form |

Each layer names the form it used in one short phrase, so the choice is visible and
correctable (a lesson from the reading-app design: a hidden auto-choice gives the reader no
handle to ask for another). No form is mandatory; at most one non-text form per layer.

Open design point for implementation: whether the owner file for each form is the member's
existing `references/protocol.md` (analogize, draw's `forms.md`) or a new compact
`references/core.md` per member. Prefer the smallest file that carries the behavior-changing
part (ADR-109 three-layer law).

### `unfold` — behavior to carry over and generalize

From `codebase-walkthrough`, kept: question + boundary first; smallest useful mental model;
one layer per turn; source-grounded claims with recorded-reason vs inference vs unknown;
running "understood / open / next layer" state held in conversation; stop at a checkpoint
instead of dumping.

Generalized: the subject can be a repository, a library, a paper or book, or a concept.
Subject-specific grounding moves to `references/` loaded only for that subject type
(`references/repository.md` from the wiki skill's "Before explaining" section;
`references/document.md` for papers/books: outline → section → paragraph, never trading
information for brevity).

Guardrails (ADR-126): no fixed level count, no exit gates, no mandatory learner-state file,
no restoration to a curriculum after a free dive.

### Boundaries to state in descriptions (one NOT-boundary each)

- `unfold` vs `analogize`: multi-layer walkthrough vs a single explanation (including ELI5).
- `tinker` vs `/shape:mockup`: render to *understand* (one object, poked) vs render to *decide*
  (candidates compared). Both produce interactive HTML; activation/serving mechanics are a
  second consumer of mockup's activation text → extract a shared owner rather than copy (N+1).
- `tinker` vs `draw`: `draw` chooses a picture; `tinker` makes a thing the learner operates.

## Critical files

- `plugins/frame/skills/{unfold,tinker}/SKILL.md` + `references/` — new.
- `plugins/frame/skills/analogize/SKILL.md` — one added line for ELI5 depth; trigger unchanged.
- `plugins/frame/CLAUDE.md` — identity, roster, naming-idiom note (bare verbs for the new
  members, canonical names for the two lenses).
- `plugins/frame/.claude-plugin/plugin.json` — description + minor version bump.
- `scripts/lib/shared-skill-references.mjs` — map form owners → `unfold`; tinker ↔ mockup
  activation owner.
- `plugins/shape/skills/mockup/references/mockup-protocol.md` — activation text becomes a shared
  owner if extracted.
- `docs/catalog-copy.json`, `docs/site/index.html` (anatomy), `README.md` hand-owned parts,
  `platforms/codex/descriptions.json`.
- `docs/adr/138-frame-understanding-family.md` — new skills (repo rule: ADR per new skill),
  supersession of the wiki method, why this is not fathom again.
- Outside this repo, after ship: mark the wiki's `codebase-walkthrough` superseded by
  `/frame:unfold`.

## Verification

1. **Gates:** build-manifests → build-codex → build-cursor → `validate-codex-skills.mjs` ok;
   `node --test scripts/lib/*.test.mjs`.
2. **Routing probe** using the owner's real phrasings: the eleven recorded "progressive
   disclosure 帶我認識/導讀" prompts route to `unfold`; "用比喻解釋" and "ELI5 X" to `analogize`;
   "讓我改改看 / 換個條件會怎樣" to `tinker`; "mockup 一下 / 哪個好" still to `shape:mockup`.
3. **Forward test (real use, not a fixture):** one `unfold` session on an unfamiliar public
   repository and one on a paper chapter. Pass criteria: opens with the skeleton in ≤ one
   screen; introduces one layer per turn; glosses each new term at first use; stops at a
   checkpoint with the open questions named; picks at least one non-text form where the
   layer is relational, and names the form it chose; honors a mid-walkthrough override. Failure mode to watch: the 2026-09-21 correction ("step by step"
   instead of progressive disclosure).
4. **Ledger:** next monthly `scripts/skill-usage.mjs` snapshot shows `unfold` fires; the
   ADR-109 watch list re-evaluates `analogize`/`draw` once they are reachable through `unfold`.

## Out of scope

- An Elephant-Goldfish–style design review (deferred; would sit on the planning path and
  requires revisiting ADR-123).
- Merging the wiki's `paper-review` draft — revisit after `unfold`'s document leg has use.
