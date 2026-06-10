# think — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained.

## What this plugin is

A collection of skills for **reasoning about a problem through a named lens** — applying an explicit, disciplined reasoning frame that forces a structured analysis the model's default "think about it" won't produce. The object is **your own reasoning about a problem** (a belief, a decision, a design), not an external document (that's `research`) and not existing code (that's `nav`).

First skill today: `first-principles` (strip a question to its irreducible axioms, rebuild the answer from those alone, surface where that diverges from convention). The seed family — `invert` (negate the goal → failure modes / what to avoid) and `second-order` (trace consequences forward, layer by layer) — is **planned, not committed**: each lens earns its own door only when its *procedure and output shape genuinely diverge* (the same razor `research` used — dissect=nodes, untangle=edges, critique=assess — and `shape` used in ADR-013). Promote per ADR-018's evidence gate. See `docs/adr/034-think-plugin.md` for the family charter.

This plugin lives inside the `skills` marketplace (`ChenPaulYu/skills`). It is **independent** — no dependency on `nav` or `shape`. It **feeds shape one-way** (a reasoning artifact → an `elicit` thought / a `mockup` / a `nav:plan`), the same guarded, one-way pattern as `research → shape`; it never invokes another plugin's skill (ADR-015).

## The think through-line

The unit is a **reasoning move on a problem**, and each skill is **one named move with a forced structure + a fixed output shape**.

What unifies the lenses is not a shared template (their procedures genuinely differ — decompose-down vs negate vs project-forward) but a shared **discipline**:

1. **A named frame, applied explicitly** — not "reason carefully" but "run *this* operation on the problem." The frame's steps are mandatory, in order.
2. **A forced structure the default won't produce** — the value-guardrail. "Think harder about X" is what the model does anyway; a `think` skill earns its existence ONLY by forcing an output the default reasoning skips (e.g. first-principles MUST list the discarded assumptions + the irreducible axioms, not just present a conclusion). If a proposed lens can't name a structure the default omits, it is **not** a skill — it's ceremony (the caution that retired `nav`'s `doctor`, ADR-021).
3. **Grounded, not asserted** — a claim the lens leans on (an axiom said to be "physical fact", a consequence said to be "inevitable") is checked against reality where checkable, and marked *uncertain* otherwise. Reasoning is not licence to fabricate premises to reach a wanted conclusion.
4. **Analysis, not decision** — the lens produces an *artifact* (the structured reasoning), then **hands off**: to converge it into a decision *with the user* is `/shape:elicit`; to render it is `/shape:mockup`; to ground it into code is `/nav:plan`. think reasons; it doesn't decide or build.

## think vs its neighbours (the boundaries that keep it distinct)

- **vs `/shape:elicit`** — the sharpest line, by *who holds the answer*. elicit is **maieutic**: the *user* holds the answer and elicit draws it out by a grounded grill (`react-not-author`). think is **generative**: the answer is *derived from the problem's own structure* by the agent applying a frame. elicit extracts; think derives. They pair — a think analysis is a strong *input* to an elicit grill (or elicit may summon a lens as a move) — but the engines are distinct, which is why think is its own plugin and not an elicit mode.
- **vs `/research:*`** — research anatomizes an *external document's* argument (Gap/Claim/Mechanism/Evidence). think reasons about *a problem from scratch* — there's no source document, the structure comes from the lens, not the text.
- **vs the default** — see the value-guardrail above. Always ask: *what structure does this lens force that the model wouldn't have produced anyway?* If the answer is "none", don't ship it.

## Conventions for skills inside this plugin

- **Naming**: skills use the **canonical lens name** — `first-principles`, `invert`, `second-order` — not a coerced bare verb. The names are well-known mental models; discoverability beats verb-purity here. (This deliberately diverges from `research`'s bare-verb convention, ADR-027 — different family, different idiom.)
- **Self-contained**: every `SKILL.md` carries the through-line + the value-guardrail + the elicit boundary verbatim, so an agent triggered into the skill doesn't depend on this CLAUDE.md being loaded.
- **★ Forced-structure output**: every skill emits a fixed-shape artifact (the structure IS the value). State the shape in the SKILL.md and in the `Output` section; an agent must be able to grasp the artifact from its `head`.
- **★ Stack- and domain-neutral examples**: examples must be legible without the origin project. Use generic problems (pricing, a launch, an architecture choice), never project-specific nouns.
- **★ Skills-root-relative paths**: all paths are written as if `skills/` is root. No `./` or `../` prefixes.
- **Read-only by default**: a lens surfaces its analysis and asks where to save (default `thinking/<date>-<topic>.md`). It never writes source or makes a decision without explicit user confirmation.
- **Feeds shape, never invokes it**: end with a guarded, one-shot *offer* (ADR-007/015) to route the insight — `/shape:elicit` to converge it, `/shape:mockup` to render it, `/nav:plan` to ground it. An offer, not a call.

## Where things live

```
.claude-plugin/plugin.json   → manifest (name=think, version, repo)
CLAUDE.md                    → ← you are here (developer-facing)
skills/<lens>/SKILL.md       → individual lenses, each self-contained
../../README.md              → marketplace-level overview
../../docs/adr/              → ADRs (marketplace-level — shared across plugins)
```

## When editing this plugin

- New lens: scaffold `skills/<lens>/SKILL.md`, write the frontmatter description carefully (it determines triggering accuracy), write an ADR. **First check the value-guardrail**: name the structure this lens forces that the default omits. If you can't, it's not a skill.
- Before adding or changing any skill, check the three ★ core principles above.
- Renaming a lens: bump version in `plugin.json`; document the rename in an ADR.
- Stale `SKILL.md` is worse than missing `SKILL.md`.
- **Site-map update is gating**: any change to a `SKILL.md`, a plugin manifest, or an ADR requires updating `docs/site/index.html` in the same commit. Run `git status docs/site/index.html` before committing.
