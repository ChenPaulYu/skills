# research — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained.

## What this plugin is

A collection of skills for **reading external sources with intent** — understanding what arguments claim, what evidence they produce, and what remains open. The through-line is **argument anatomy**: every document making a claim can be dissected into Gap / Claim / Mechanism / Evidence / Conclusion, and every dissection can be compared against your own claim to locate prior art and open ground.

Four skills today: `dissect` (single or batch argument anatomy — one note per document; forensic mode also audits how the user already cites the document), `untangle` (the relational structure across N sources — lineage / clusters / contradictions / contested ground, with optional claim-framed positioning), `critique` (adversarial assessment of one paper into a referee report — claim↔evidence audit + self-attack), and `provenance` (self-audit of the user's own documents — trace every load-bearing citation back to a verified source, classify first-hand / second-hand / orphan, emit a quarantine list). The verbs sit on one spine: `dissect` gives the **nodes** (one argument's anatomy), `untangle` gives the **edges** (how arguments relate), `critique` **assesses** whether one argument's evidence holds, `provenance` **audits your use** of all of them — the reflexive corner (critique's mirror: their claims vs their evidence ↔ your citations vs your sources). `untangle`, `critique`, and `provenance` all consume `dissect` (untangle reuses skeletons to find edges; critique grounds deeper on attack surfaces; provenance dispatches forensic dissects as its repair arm). Candidate skill pending: `feedback` (extract design implications from competitor empirical results). See `docs/adr/027-research-plugin.md` for the family charter; `030` (critique), `031` (the map→untangle rename + relational reframe), and `042` (provenance — the self-audit verb).

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

> Repo-wide **authoring + maintenance** rules (naming, skills-root-relative paths, stack-neutral examples, frontmatter `description`, ADR-on-new-skill, the site-map gate, versioning) live in the repo-root [`CLAUDE.md`](CLAUDE.md). research-specific:

- **Read-only by default**: `dissect` surfaces a dissection note and asks where to save it. It never writes without explicit user confirmation.
- **Output format is the artifact**: a dissection note is a structured markdown file comparable across documents. The format is fixed so multiple notes can be laid side by side.
- **Claim injection is optional but recommended**: if the user's own claim is available, inject it so the skill can produce an "Implications for [your claim]" section. Without it, the skill still produces the structural skeleton; the implications section is blank.

## Where things live

```
.claude-plugin/plugin.json   → research's manifest (the version + metadata owner)
CLAUDE.md                    → ← you are here (research-specific)
skills/<name>/SKILL.md       → individual skills, each self-contained
```

Repo-wide layout + ADRs live in the repo-root [`CLAUDE.md`](CLAUDE.md), which also holds all editing rules (new-skill → ADR, the ★ authoring checks, renaming + versioning, the site-map gate). research adds nothing beyond the marketplace defaults.
