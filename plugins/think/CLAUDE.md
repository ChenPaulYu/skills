# think — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained.

## What this plugin is

A collection of skills for **reasoning about a problem through a named lens** — applying an explicit, disciplined reasoning frame that forces a structured analysis the model's default "think about it" won't produce. The object is **your own reasoning about a problem** (a belief, a decision, a design), not an external document (that's `research`) and not existing code (that's `nav`).

Four lenses today — **two take a problem apart, one puts a claim on trial, one grafts a mature model**:

- `first-principles` — decompose **down**: strip a question to its irreducible axioms, rebuild the answer from those alone, surface where that diverges from convention.
- `orthogonal` — decompose **sideways**: factor a tangled phenomenon into mutually-independent axes, verify the independence (move one, the others stay put), and name what was conflated or falsely-coupled.
- `dialectic` — put a claim **on trial**: build its strongest case (steelman) AND its strongest attack (devil's advocate — also steelmanned, never a strawman), surface the deepest load-bearing assumption, name the experiment that would decide it. Verdict is three-way (refuted / unsettled-owned-bet / supported), not pass/fail — for a frontier claim "no evidence yet" is an *owned bet*, not a refutation. Built for paradigm-class questions with no standard answer. (The parked `steelman` candidate from ADR-034/046 graduates here, but two-sided + adjudicating — hence `dialectic`, not the one-sided `steelman` — `docs/adr/047-think-dialectic-lens.md`.)
- `graft` — borrow a mature model and **adapt** it: pick a donor whose *structure* rhymes (states/transitions/history…), map **every** primitive onto the target, read each as fit / break / adapt. The payload is the **adapt** list — where the borrowed structure had to reshape for the domain is the design's identity; reporting only fits is reskinning. Nearly `first-principles`' inverse (borrow-all vs strip-all); the disciplined middle between inventing from axioms and lazy analogy. `docs/adr/048-think-graft-lens.md`.

Future lenses are added **by evidence** (ADR-018), not pre-listed — each must clear the value-guardrail (a forced structure the default skips) AND show real recurring use. (The originally-speculated `invert` / `second-order` seed was dropped for having no usage evidence — see `docs/adr/046-think-orthogonal-lens-drop-speculative-seed.md`; charter in `docs/adr/034-think-plugin.md`.)

This plugin lives inside the `skills` marketplace (`ChenPaulYu/skills`). It is **independent** — no dependency on `nav` or `shape`. It **feeds shape one-way** (a reasoning artifact → an `elicit` thought / a `mockup` / a `nav:plan`), the same guarded, one-way pattern as `research → shape`; it never invokes another plugin's skill (ADR-015).

## The think through-line

The unit is a **reasoning move on a problem**, and each skill is **one named move with a forced structure + a fixed output shape**.

What unifies the lenses is not a shared template (their procedures genuinely differ — decompose-down vs factor-sideways vs put-a-claim-on-trial) but a shared **discipline**:

1. **A named frame, applied explicitly** — not "reason carefully" but "run *this* operation on the problem." The frame's steps are mandatory, in order.
2. **A forced structure the default won't produce** — the value-guardrail. "Think harder about X" is what the model does anyway; a `think` skill earns its existence ONLY by forcing an output the default reasoning skips (e.g. first-principles MUST list the discarded assumptions + the irreducible axioms, not just present a conclusion). If a proposed lens can't name a structure the default omits, it is **not** a skill — it's ceremony (the caution that retired `nav`'s `doctor`, ADR-021).
3. **Grounded, not asserted** — a claim the lens leans on (an axiom said to be "physical fact", a consequence said to be "inevitable") is checked against reality where checkable, and marked *uncertain* otherwise. Reasoning is not licence to fabricate premises to reach a wanted conclusion.
4. **Analysis, not decision** — the lens produces an *artifact* (the structured reasoning), then **hands off**: to converge it into a decision *with the user* is `/shape:elicit`; to render it is `/shape:mockup`; to ground it into code is `/nav:plan`. think reasons; it doesn't decide or build.

## think vs its neighbours (the boundaries that keep it distinct)

- **vs `/shape:elicit`** — the sharpest line, by *who holds the answer*. elicit is **maieutic**: the *user* holds the answer and elicit draws it out by a grounded grill (`react-not-author`). think is **generative**: the answer is *derived from the problem's own structure* by the agent applying a frame. elicit extracts; think derives. They pair — a think analysis is a strong *input* to an elicit grill (or elicit may summon a lens as a move) — but the engines are distinct, which is why think is its own plugin and not an elicit mode.
- **vs `/research:*`** — research anatomizes an *external document's* argument (Gap/Claim/Mechanism/Evidence). think reasons about *a problem from scratch* — there's no source document, the structure comes from the lens, not the text.
- **vs the default** — see the value-guardrail above. Always ask: *what structure does this lens force that the model wouldn't have produced anyway?* If the answer is "none", don't ship it.

## Conventions for skills inside this plugin

> Repo-wide **authoring + maintenance** rules (skills-root-relative paths, stack-neutral examples, frontmatter `description`, ADR-on-new-skill, the site-map gate, versioning) live in the repo-root [`CLAUDE.md`](CLAUDE.md). think-specific:

- **Naming**: skills use the **canonical lens name** — `first-principles`, `orthogonal`, `dialectic` — not a coerced bare verb. The names are well-known reasoning concepts; discoverability beats verb-purity here. (This is the documented divergence from the marketplace bare-verb default, ADR-027 — different family, different idiom.)
- **★ Forced-structure output**: every skill emits a fixed-shape output (the structure IS the value). State the shape in the SKILL.md `Output` section so it's graspable at a glance.
- **Lightweight, in-chat by default**: a lens surfaces its analysis in the conversation and writes **no file** — think is the lightest plugin (pure reasoning). Persistence happens by routing to shape (`/shape:elicit` → `thoughts/`, `/shape:mockup`, `/nav:plan`), never a think-owned artifact. It never writes source or makes a decision.
- **Feeds shape, never invokes it**: end with a guarded, one-shot *offer* (ADR-007/015) to route the insight — `/shape:elicit` to converge it, `/shape:mockup` to render it, `/nav:plan` to ground it. An offer, not a call.

## Where things live

```
.claude-plugin/plugin.json   → think's manifest (the version + metadata owner)
CLAUDE.md                    → ← you are here (think-specific)
skills/<lens>/SKILL.md       → individual lenses, each self-contained
```

Repo-wide layout + ADRs live in the repo-root [`CLAUDE.md`](CLAUDE.md).

## When editing this plugin

Repo-wide editing rules (new-skill → ADR, the ★ authoring checks, renaming + versioning, the site-map gate, stale-`SKILL.md`) live in the repo-root [`CLAUDE.md`](CLAUDE.md). think-specific:

- **New lens — first check the value-guardrail**: name the structure this lens forces that the default omits. If you can't, it's not a skill (the caution that retired nav's `doctor`, ADR-021).
