# skills — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained.

## What this plugin is

A growing personal collection of Claude skills focused on **deep-module discipline** — auditing, refactoring, mapping, and documenting code so it stays navigable as it grows. Inspired by Ousterhout's *A Philosophy of Software Design*; calibrated against real refactors (e.g., decomposing a 1718-line component into a 16-file subsystem with a single barrel).

## The 11 rules (the through-line of every skill)

Every skill in this plugin assumes — and re-states inside its own `SKILL.md` — these eleven rules:

1. **Good interfaces** — low-level modules expose an interface you can use without reading the body.
2. **Progressive disclosure** — an index / doc surfaces the interface; you drill in only as needed.
3. **No hidden params** — functions deterministic; deps explicit, not ambient.
4. **Future-ready foundation** — the base supports planned features before they ship.
5. **No giants** — no single mega-module or mega-function (a 700-line render counts).
6. **No needless abstraction** — if it needn't be modular, don't modularise it. (⑤ ↔ ⑥ are a balance.)
7. **Fit the framework** — idiomatic patterns (React: custom hooks; pass store/hook objects, not 20 loose props).
8. **Rearrange, don't rewrite** — refactor = move code verbatim + rewire; behaviour stays identical.
9. **Below 90% confidence → ask** — when unsure about scope, boundaries, intent: stop and clarify.
10. **Group + expose via one door** — subsystems exposed through a barrel/facade (`index.ts`).
11. **Agent-navigability is the audit** — when an agent regenerates a codebase map, struggle-to-describe IS the deep-module test. Failure cues: must enumerate, must footnote, must guess, must list > 6 imports.

These rules **also apply to this plugin's own code** — meta-discipline. If a skill grows past ~500 lines or starts enumerating many distinct responsibilities, split it.

## Conventions for skills inside this plugin

- **Naming**: `nav-<verb>` for skills in the deep-module family. Other families later get their own prefix (`spec-*`, `refactor-*`, etc.).
- **Self-contained**: every `SKILL.md` includes the 11 rules verbatim, so an agent triggered into the skill doesn't depend on this CLAUDE.md being loaded.
- **Frontmatter `description`**: written **broad** (matches multiple trigger phrasings) but **honest** about scope. No "pushy" cross-domain claims.
- **Scope**: v1 skills are calibrated for **TypeScript / React** codebases. Other stacks are v2 — explicitly bail with a message rather than misfire.
- **Read-only by default**: skills that modify files (`nav-headers`, `nav-refactor`) must show a diff first or only modify on explicit user confirmation.
- **Each new skill**: write an ADR in `docs/adr/` explaining why it exists, what overlaps it has with siblings, and how the trigger description avoids stealing fire from them.

## Where things live

```
.claude-plugin/plugin.json   → manifest (name, version, repo)
README.md                    → public-facing: what's in here
CLAUDE.md                    → ← you are here (developer-facing)
docs/adr/                    → architecture decision records — read these to understand the WHY
skills/<skill-name>/SKILL.md → individual skills, each self-contained
```

## When editing this plugin

- New skill: scaffold `skills/<name>/SKILL.md`, write its frontmatter description carefully (it determines triggering accuracy), test invocations cover the main trigger phrasings, write an ADR.
- Renaming a skill: bump version in `plugin.json`; document the rename in an ADR.
- Changing the 11 rules: this affects every skill — update each `SKILL.md` in the same commit, write an ADR.
- Stale `SKILL.md` is worse than missing `SKILL.md` — same rule as project-level "stale header = lie".
