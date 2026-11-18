# frame — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained.

## What this plugin is

The **understanding family**: skills that help someone understand something, in three roles. Each applies an explicit, named discipline that the model's default reasoning (or default explaining) skips.

- **Lenses — see it.** Apply a frame to a **problem**, for the agent's own understanding: `first-principles` strips it to axioms, `orthogonal` factors it into independent axes.
- **Forms — present it.** Apply a frame to an **answer you already have**, for the *user's* understanding: `analogize` (a checked analogy), `draw` (the picture and its medium), `tinker` (an object to poke).
- **Entry — walk through it.** `unfold` holds the rhythm for a whole subject: skeleton first, one layer per turn, a form chosen per layer.

The lenses derive insight; the forms and the entry deliver it. The checks earn the skill, not the number of headings.

> **Naming note (this plugin was `think` — renamed, see the rename ADR).** `think` mis-scoped the family to reasoning-about-a-problem only. `frame` covers seeing and presenting alike: applying a frame is the shared act, whether it lands on a problem or an answer. ADR-010 recasts the identity as the understanding family.

Six members today:

- `first-principles` — decompose **down**: strip a question to its irreducible axioms, rebuild the answer from those alone, surface where that diverges from convention.
- `orthogonal` — decompose **sideways**: factor a tangled phenomenon into mutually-independent axes, verify the independence (move one, the others stay put), and name what was conflated or falsely-coupled.
- `analogize` — **form, by assimilation**: build a deliberately stress-tested analogy for a concept already understood — candidates from the reader's own models (Papert), mapping checked, breakage named. On an ELI5 request it also reduces the target to one prerequisite-free idea.
- `draw` — **form, by picture**: choose a useful visual form and medium for something already understood; no fixed presentation format.
- `tinker` — **form, by object**: build one small interactive object the learner can poke (one primary control, a visible before/after, details revealed on request, persistent across turns, an honest simplification note). Adds over the default: the learner causes the change instead of reading about it. The artifact is an interactive HTML page, activated per the shared owner `plugins/shape/references/artifact-activation.md`.
- `unfold` — **entry**: a layered walkthrough of a repository, paper, book, or concept. Adds over the default (a one-shot summary or a step-by-step list): a stable rhythm of skeleton, one layer per turn, term glossed at first use, claims marked recorded/inferred/unknown, learner-led depth, a named checkpoint, and a per-layer form choice. Successor of a private walkthrough method, generalized; carries the retained lessons of ADR-009/006 and none of the retired machinery.

Future members are added **by evidence** (ADR-010), not pre-listed — each must clear the value-guardrail (a substantive reasoning check the default skips) AND show real recurring use. (The originally-speculated `invert` / `second-order` seed was dropped for having no usage evidence — see `docs/adr/010-frame-family-charter.md`; charter in `docs/adr/010-frame-family-charter.md`.) The same bar cuts the other way too: `graft` — borrow-a-mature-model, once the fourth lens — was retired as the weakest member of the set (1 inbound reference, never invoked in 11 months of transcripts); see [ADR-009](docs/adr/009-retirement-policy.md). `dialectic` (put a claim on trial) was retired as genuinely unclaimed — see [ADR-009](docs/adr/009-retirement-policy.md). `unfold` and `tinker` are new and unproven in the same sense (forward test pending, see `blueprints/plans/2026-11-13-frame-understanding-family.md`). `analogize` itself is provisional in this same sense — its trigger phrasing below is a first cut, expected to sharpen once real use shows which phrasings actually preceded wanting it.

This plugin lives inside the `skills` marketplace (`ChenPaulYu/skills`). It is **independent** — no dependency on `nav` or `shape`. It **feeds shape one-way** (a reasoning artifact → an `elicit` thought / a `mockup` / a `nav:plan`), a guarded, one-way pattern; it never invokes another plugin's skill (ADR-006). The forms and the entry do **not** feed shape — an explanation has nothing further to converge or build. `unfold` applies the forms **by protocol**: generated copies of the form disciplines are bundled into it from their owner files (`scripts/lib/shared-skill-references.mjs`), so it never calls a sibling skill and each form stays its own standalone entrance (ADR-010; `docs/out-of-scope/skills-dont-invoke-each-other.md`).

## The frame through-line

The unit is a named frame applied explicitly. Each skill preserves its substantive reasoning checks while scaling presentation to the question (ADR-010).

What unifies the members is not a shared template (their procedures genuinely differ — decompose-down vs factor-sideways vs build-and-stress-test-an-analogy) but a shared **discipline**:

1. **A named operation** — preserve the checks that distinguish the frame; use established context rather than restart a completed derivation.
2. **A reasoning difference, not a worksheet** — first-principles separates facts from inherited assumptions; orthogonal tests independence; analogize tests structural fit and limitations. Tables, headings, fixed order, and candidate counts are not evidence of quality.
3. **Grounded, not asserted** — a claim the frame leans on (an axiom said to be "physical fact", an analogy said to map cleanly) is checked against reality where checkable, and marked *uncertain* (or the breakage named) otherwise. A frame is not licence to fabricate premises, or ship a mapping that only resembles on vibes.
4. **Scope-aware continuation** — analysis-only requests end with the finding. A larger explicitly authorized workflow may continue after analysis, using its execution checks. No compulsory route menu, new authority, or automatic skill invocation follows from a finding.

## frame vs its neighbours (the boundaries that keep it distinct)

- **vs `/shape:elicit`** — the sharpest line, by *who holds the answer, and which direction it moves*. elicit is **maieutic**: the *user* holds the answer and elicit draws it out by a grounded grill (`react-not-author`). The reasoning lenses are **generative**: the answer is *derived from the problem's own structure* by the agent applying a frame. `analogize` is **pedagogic**: the agent already holds the answer and delivers it *into* the user. elicit extracts; the lenses derive; analogize delivers. A lens analysis is a strong *input* to an elicit grill; analogize never feeds elicit (nothing left to converge).
- **vs auditing an external document** — that's a referee-style review (just ask for one), not a dedicated skill in this marketplace. The reasoning lenses reason about *a problem from scratch* — there's no source document, the structure comes from the lens, not the text. `analogize` isn't about a document either — its object is a concept the conversation has already settled. `unfold` does take a source document as its subject, but it guides a learner through it rather than reviewing it: no verdict on the document's quality or evidence.
- **vs the default** — see the value-guardrail above. Always ask: *what reasoning check (or delivery discipline) does this frame add that the model wouldn't have produced (or delivered) anyway?* If the answer is "none", don't ship it. For `analogize` specifically: ambient plain-language-with-a-metaphor is already a standing style default (every reply) — this skill only earns its place by doing something heavier than that default: comparing candidates, checking the mapping, naming the breakage.

## Conventions for skills inside this plugin

> Repo-wide **authoring + maintenance** rules (skills-root-relative paths, stack-neutral examples, frontmatter `description`, ADR-on-new-skill, the site-map gate, versioning) live in the repo-root [`CLAUDE.md`](CLAUDE.md). frame-specific:

- **Naming — two idioms, side by side.** The two reasoning lenses use the **canonical lens name** — `first-principles`, `orthogonal` — not a coerced bare verb; the names are well-known reasoning concepts and discoverability beats verb-purity here (the documented divergence from the marketplace bare-verb default, ADR-009). `analogize`, `draw`, `unfold`, and `tinker` use the marketplace's default **bare verb** — each names an action, not a citable concept. Both idioms coexist deliberately; don't force one onto the other.
- **Proportional output** — a small question can receive a short answer with the material reasoning and uncertainty visible; use fuller structure only when it helps inspection. Worked examples are illustrations, not required forms.
- **Lightweight, in-chat by default**: a member surfaces its result in the conversation and writes **no file** — with one exception. `tinker`'s output is an interactive HTML artifact, disposable and written to session scratch space, outside the project's tracked tree; it does **not** bundle `development-artifacts.md` (as `mockup` does) because it is not a project process record. If the learner asks to keep one, treat it as a local, Git-ignored process artifact per `plugins/shape/references/development-artifacts.md`. Persistence otherwise happens by routing to shape (`/shape:elicit` → `thoughts/`, `/shape:mockup`, `/nav:plan`), never a frame-owned record. A member never writes source or makes a decision.
- **Optional continuation** — suggest a useful next step only when needed and not already settled; ask a specific question when a consequential choice or authority is missing. Do not turn an already-authorized continuation into another chooser.
- **Plain language without a performance** — use technical terms when useful, explaining unfamiliar ones briefly. Analogies are optional aids outside analogize; no banned-word list or compulsory closing metaphor (ADR-010 supersedes ADR-010's presentation gates).

## Where things live

```
.claude-plugin/plugin.json     → frame's manifest (the version + metadata owner)
CLAUDE.md                      → ← you are here (frame-specific)
skills/<member>/SKILL.md       → individual members, each self-contained
```

Repo-wide layout + ADRs live in the repo-root [`CLAUDE.md`](CLAUDE.md).

## When editing this plugin

Repo-wide editing rules (new-skill → ADR, the ★ authoring checks, renaming + versioning, the site-map gate, stale-`SKILL.md`) live in the repo-root [`CLAUDE.md`](CLAUDE.md). frame-specific:

- **New member — first check the value-guardrail**: name the reasoning check this frame adds that the default omits (whether the default is "reason about it" or "explain it simply"). If you can't, it's not a skill (the caution that retired nav's `doctor`, ADR-009).
- **`analogize` is provisional-but-real** — it ships as a working skill, not a stub, but its trigger phrasing is a first cut pending real usage. Refine the `description` frontmatter in place as actual invocations show which phrasings actually preceded wanting it; that's a normal skill edit, not a redesign.
