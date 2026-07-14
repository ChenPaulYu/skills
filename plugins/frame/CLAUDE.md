# frame — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained.

## What this plugin is

A collection of skills that each apply an explicit, named **frame** — a disciplined structure the model's default reasoning (or default explaining) skips. A frame can point in either of two directions on the same object — **a problem**, or **an answer you already have**:

- **Reasoning lenses (down/sideways/trial/graft)** — apply a frame to a **problem**, for the agent's own understanding: strip it to axioms, factor it into independent axes, put a claim on trial, or graft a mature model onto it.
- **`analogize` (deliver)** — apply a frame to an **answer**, for the *user's* understanding: build and stress-test an analogy so an already-settled concept lands in plain language.

Same discipline (name the frame, force the structure, don't take the default's shortcut), opposite direction of transfer: the lenses derive insight *for the agent*; `analogize` delivers insight *to the user*. Neither is an external document (that's `research`) or existing code (that's `nav`).

> **Naming note (this plugin was `think` — renamed, see the rename ADR).** `think` mis-scoped the family to reasoning-about-a-problem only, which had no room for `analogize` (a fundamentally different direction — explaining, not deriving) without either stretching `think` past its name or force-fitting `analogize` somewhere it didn't belong. `frame` covers both: applying a frame is the shared act, regardless of whether the frame lands on a problem or an answer.

Five members today — **two take a problem apart, one puts a claim on trial, one grafts a mature model, one delivers an answer**:

- `first-principles` — decompose **down**: strip a question to its irreducible axioms, rebuild the answer from those alone, surface where that diverges from convention.
- `orthogonal` — decompose **sideways**: factor a tangled phenomenon into mutually-independent axes, verify the independence (move one, the others stay put), and name what was conflated or falsely-coupled.
- `dialectic` — put a claim **on trial**: build its strongest case (steelman) AND its strongest attack (devil's advocate — also steelmanned, never a strawman), surface the deepest load-bearing assumption, name the experiment that would decide it. Verdict is three-way (refuted / unsettled-owned-bet / supported), not pass/fail — for a frontier claim "no evidence yet" is an *owned bet*, not a refutation. Built for paradigm-class questions with no standard answer. (The parked `steelman` candidate from ADR-034/046 graduates here, but two-sided + adjudicating — hence `dialectic`, not the one-sided `steelman` — `docs/adr/047-think-dialectic-lens.md`.) Its closing offer now includes a guarded `/shape:probe` — run the Killer Experiment this skill only names, a frame→shape soft offer that degrades gracefully if `shape` isn't installed (ADR-012 pattern, `docs/adr/075-shape-probe-ask-reality.md`).
- `graft` — borrow a mature model and **adapt** it: pick a donor whose *structure* rhymes (states/transitions/history…), map **every** primitive onto the target, read each as fit / break / adapt. The payload is the **adapt** list — where the borrowed structure had to reshape for the domain is the design's identity; reporting only fits is reskinning. Nearly `first-principles`' inverse (borrow-all vs strip-all); the disciplined middle between inventing from axioms and lazy analogy. `docs/adr/048-think-graft-lens.md`.
- `analogize` — **deliver**: take a concept the agent already understands and build a deliberately stress-tested analogy for it — generate multiple candidates, check the mapping against the real structure, pick on fit, and name where the winner still breaks. The one member that faces the user rather than the problem. New — see the rename ADR.

Future members are added **by evidence** (ADR-018), not pre-listed — each must clear the value-guardrail (a forced structure the default skips) AND show real recurring use. (The originally-speculated `invert` / `second-order` seed was dropped for having no usage evidence — see `docs/adr/046-think-orthogonal-lens-drop-speculative-seed.md`; charter in `docs/adr/034-think-plugin.md`.) `analogize` itself is provisional in this same sense — its trigger phrasing below is a first cut, expected to sharpen once real use shows which phrasings actually preceded wanting it.

This plugin lives inside the `skills` marketplace (`ChenPaulYu/skills`). It is **independent** — no dependency on `nav` or `shape`. It **feeds shape one-way** (a reasoning artifact → an `elicit` thought / a `mockup` / a `nav:plan`), the same guarded, one-way pattern as `research → shape`; it never invokes another plugin's skill (ADR-015). `analogize` is the one member that does **not** feed shape — an explanation has nothing further to converge or build (see its own SKILL.md).

## The frame through-line

The unit is a **named frame applied explicitly**, and each skill is **one named move with a forced structure + a fixed output shape**.

What unifies the members is not a shared template (their procedures genuinely differ — decompose-down vs factor-sideways vs put-a-claim-on-trial vs build-and-stress-test-an-analogy) but a shared **discipline**:

1. **A named frame, applied explicitly** — not "reason carefully" / "explain simply" but "run *this* operation." The frame's steps are mandatory, in order.
2. **A forced structure the default won't produce** — the value-guardrail. "Think harder about X" / "say it more simply" is what the model does anyway; a `frame` skill earns its existence ONLY by forcing an output the default skips (e.g. first-principles MUST list the discarded assumptions + the irreducible axioms; analogize MUST compare candidates and name where the winner breaks). If a proposed member can't name a structure the default omits, it is **not** a skill — it's ceremony (the caution that retired `nav`'s `doctor`, ADR-021).
3. **Grounded, not asserted** — a claim the frame leans on (an axiom said to be "physical fact", an analogy said to map cleanly) is checked against reality where checkable, and marked *uncertain* (or the breakage named) otherwise. A frame is not licence to fabricate premises, or ship a mapping that only resembles on vibes.
4. **Analysis or delivery, never decision** — the reasoning lenses produce an *artifact* (the structured reasoning), then **hand off**: to converge it into a decision *with the user* is `/shape:elicit`; to render it is `/shape:mockup`; to ground it into code is `/nav:plan`. `analogize` produces a *delivered explanation* with nowhere further to hand off — its object is already settled, only its legibility was in question. Either way: a `frame` skill reasons or explains; it doesn't decide or build.

## frame vs its neighbours (the boundaries that keep it distinct)

- **vs `/shape:elicit`** — the sharpest line, by *who holds the answer, and which direction it moves*. elicit is **maieutic**: the *user* holds the answer and elicit draws it out by a grounded grill (`react-not-author`). The reasoning lenses are **generative**: the answer is *derived from the problem's own structure* by the agent applying a frame. `analogize` is **pedagogic**: the agent already holds the answer and delivers it *into* the user. elicit extracts; the lenses derive; analogize delivers. A lens analysis is a strong *input* to an elicit grill; analogize never feeds elicit (nothing left to converge).
- **vs `/research:*`** — research anatomizes an *external document's* argument (Gap/Claim/Mechanism/Evidence). The reasoning lenses reason about *a problem from scratch* — there's no source document, the structure comes from the lens, not the text. `analogize` isn't about a document either — its object is a concept the conversation has already settled.
- **vs the default** — see the value-guardrail above. Always ask: *what structure does this frame force that the model wouldn't have produced (or delivered) anyway?* If the answer is "none", don't ship it. For `analogize` specifically: ambient plain-language-with-a-metaphor is already a standing style default (every reply) — this skill only earns its place by doing something heavier than that default: comparing candidates, checking the mapping, naming the breakage.

## Conventions for skills inside this plugin

> Repo-wide **authoring + maintenance** rules (skills-root-relative paths, stack-neutral examples, frontmatter `description`, ADR-on-new-skill, the site-map gate, versioning) live in the repo-root [`CLAUDE.md`](CLAUDE.md). frame-specific:

- **Naming — two idioms, side by side.** The four reasoning lenses use the **canonical lens name** — `first-principles`, `orthogonal`, `dialectic` — not a coerced bare verb; the names are well-known reasoning concepts and discoverability beats verb-purity here (the documented divergence from the marketplace bare-verb default, ADR-027). `analogize` uses the marketplace's default **bare verb** instead — it names an action (build-and-deliver-an-analogy), not a citable concept the way "first principles" or "dialectic" are. Both idioms coexist deliberately; don't force one onto the other.
- **★ Forced-structure output**: every skill emits a fixed-shape output (the structure IS the value). State the shape in the SKILL.md `Output` section so it's graspable at a glance.
- **Lightweight, in-chat by default**: a member surfaces its result in the conversation and writes **no file** — frame is the lightest plugin (pure reasoning or pure delivery). Persistence happens by routing to shape (`/shape:elicit` → `thoughts/`, `/shape:mockup`, `/nav:plan`), never a frame-owned artifact, and `analogize` doesn't route onward at all (nothing to persist). It never writes source or makes a decision.
- **Feeds shape, never invokes it (reasoning lenses only)**: end with a guarded, one-shot *offer* (ADR-007/015) to route the insight — `/shape:elicit` to converge it, `/shape:mockup` to render it, `/nav:plan` to ground it. An offer, not a call. `analogize` is exempt — see above.

## Where things live

```
.claude-plugin/plugin.json     → frame's manifest (the version + metadata owner)
CLAUDE.md                      → ← you are here (frame-specific)
skills/<member>/SKILL.md       → individual members, each self-contained
```

Repo-wide layout + ADRs live in the repo-root [`CLAUDE.md`](CLAUDE.md).

## When editing this plugin

Repo-wide editing rules (new-skill → ADR, the ★ authoring checks, renaming + versioning, the site-map gate, stale-`SKILL.md`) live in the repo-root [`CLAUDE.md`](CLAUDE.md). frame-specific:

- **New member — first check the value-guardrail**: name the structure this frame forces that the default omits (whether the default is "reason about it" or "explain it simply"). If you can't, it's not a skill (the caution that retired nav's `doctor`, ADR-021).
- **`analogize` is provisional-but-real** — it ships as a working skill, not a stub, but its trigger phrasing is a first cut pending real usage. Refine the `description` frontmatter in place as actual invocations show which phrasings actually preceded wanting it; that's a normal skill edit, not a redesign.
