# research — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained.

## What this plugin is

A collection of skills for **reading external sources with intent** — understanding what arguments claim, what evidence they produce, and what remains open. The through-line is **argument anatomy**: every document making a claim can be dissected into Gap / Claim / Mechanism / Evidence / Conclusion, and every dissection can be compared against your own claim to locate prior art and open ground.

Three skills today: `dissect` (single or batch argument anatomy — one note per document), `untangle` (the relational structure across N sources — lineage / clusters / contradictions / contested ground, with optional claim-framed positioning), and `critique` (adversarial assessment of one paper into a referee report — claim↔evidence audit + self-attack). The verbs sit on one spine: `dissect` gives the **nodes** (one argument's anatomy), `untangle` gives the **edges** (how arguments relate), `critique` **assesses** whether one argument's evidence holds. Both `untangle` and `critique` consume `dissect` (reuse the skeleton, then do their own thing — untangle finds edges across the set; critique grounds deeper on one paper's attack surfaces). Candidate skill pending: `feedback` (extract design implications from competitor empirical results). See `docs/adr/027-research-plugin.md` for the family charter; `030` (critique) and `031` (the map→untangle rename + relational reframe).

**Domain-agnostic by design.** The Gap→Claim→Mechanism→Evidence framework applies to academic papers, technical blog posts, competitor analyses, RFCs, and design proposals. The `dissect` skill's output is always the same skeleton — making cross-document comparison possible regardless of source type.

This plugin lives inside the `skills` marketplace (`ChenPaulYu/skills`). It is **independent** — no dependency on `nav` or `shape`. Future skills that involve file-writing conventions may introduce soft cross-plugin recommendations (one-way, guarded, same pattern as nav → shape).

## The research through-line

The unit of analysis is the **argument**, not the document.

Any well-formed argument can be decomposed into:
1. **Gap** — what is missing or broken in the world? Why is it a problem?
2. **Claim** — what does this work propose to fix it?
3. **Mechanism** — how does it technically work?
4. **Evidence** — what experiments / results support the claim?
5. **Conclusion** — what does the author want the reader to believe?

This decomposition serves two uses simultaneously:
- **Understanding**: what does this work actually argue?
- **Positioning**: what does this work leave open? Where does my claim live relative to theirs?

The second use is what makes literature review productive. You are not cataloguing papers — you are mapping what has been argued and proven so you can locate what hasn't been.

## Conventions for skills inside this plugin

- **Naming**: skills use **bare verbs** — `dissect`, `map`, `feedback`. The plugin namespace (`research:`) provides topic context; no `research-` prefix on the skill name.
- **Self-contained**: every `SKILL.md` includes the through-line and argument anatomy framework verbatim, so an agent triggered into the skill doesn't depend on this CLAUDE.md being loaded.
- **★ Stack-neutral, standalone-legible examples**: every example must be understandable without knowing the origin project. Use generic document titles and claims, never real paper titles or project-specific nouns, unless the skill itself is about a specific well-known paper as a worked example.
- **★ Skills-root-relative paths**: all paths — doc cross-references and example code — are written as if `skills/` is root. No `./` or `../` prefixes.
- **Read-only by default**: `dissect` surfaces a dissection note and asks where to save it. It never writes without explicit user confirmation.
- **Output format is the artifact**: a dissection note is a structured markdown file comparable across documents. The format is fixed so multiple notes can be laid side by side.
- **Claim injection is optional but recommended**: if the user's own claim is available, inject it so the skill can produce an "Implications for [your claim]" section. Without it, the skill still produces the structural skeleton; the implications section is blank.

## Where things live

```
.claude-plugin/plugin.json   → manifest (name=research, version, repo)
CLAUDE.md                    → ← you are here (developer-facing)
skills/<name>/SKILL.md       → individual skills, each self-contained
../../README.md              → marketplace-level overview
../../docs/adr/              → ADRs (marketplace-level — shared across plugins)
```

## When editing this plugin

- New skill: scaffold `skills/<name>/SKILL.md`, write the frontmatter description carefully (it determines triggering accuracy), write an ADR.
- Before adding or changing any skill, check the two ★ core principles above: (1) standalone-legible examples; (2) skills-root-relative paths.
- Renaming a skill: bump version in `plugin.json`; document the rename in an ADR.
- Stale `SKILL.md` is worse than missing `SKILL.md`.
- **Site-map update is gating**: any change to a `SKILL.md`, a plugin manifest, or an ADR requires updating `docs/site/index.html` in the same commit. Run `git status docs/site/index.html` before committing.
