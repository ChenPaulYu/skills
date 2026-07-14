# research — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained.

## What this plugin is

A collection of skills for **rigorous reading and auditing of argument documents** — understanding what arguments claim, what evidence they produce, and what remains open. "research" here means rigorous inquiry, not academia: the object is any document that carries a claim-evidence structure — a paper, an RFC, a design proposal, an ADR, a whitepaper, a technical blog post. A paper is the most common *instance* of that object, not its definition — the same way a car is a common instance of "vehicle," not the definition of the category. The through-line is **argument anatomy**: every document making a claim can be dissected into Gap / Claim / Mechanism / Evidence / Conclusion, and every dissection can be compared against your own claim to locate prior art and open ground.

Four skills today: `dissect` (single or batch argument anatomy — one note per document; forensic mode also audits how the user already cites the document), `untangle` (the relational structure across N documents — lineage / clusters / contradictions / contested ground, with optional claim-framed positioning), `critique` (adversarial assessment of one argument document into a referee report — claim↔evidence audit + self-attack), and `provenance` (self-audit of the user's own documents — trace every load-bearing citation back to a verified source, classify first-hand / second-hand / orphan, emit a quarantine list). The verbs sit on one spine: `dissect` gives the **nodes** (one argument's anatomy), `untangle` gives the **edges** (how arguments relate), `critique` **assesses** whether one argument's evidence holds, `provenance` **audits your use** of all of them — the reflexive corner (critique's mirror: their claims vs their evidence ↔ your citations vs your sources). `untangle`, `critique`, and `provenance` all consume `dissect` (untangle reuses skeletons to find edges; critique grounds deeper on attack surfaces; provenance dispatches forensic dissects as its repair arm). Candidate skill pending: `feedback` (extract design implications from competitor empirical results). See `docs/adr/027-research-plugin.md` for the family charter; `030` (critique), `031` (the map→untangle rename + relational reframe), `042` (provenance — the self-audit verb), and `080` (the object generalized from "paper" to "argument document").

**Domain-agnostic by design.** The Gap→Claim→Mechanism→Evidence framework applies to academic papers, RFCs, design proposals, ADRs, whitepapers, technical blog posts, and competitor analyses. The `dissect` skill's output is always the same skeleton — making cross-document comparison possible regardless of source type.

**Downstream seams (ADR-080).** research reads; three verbs elsewhere pick up what it produces, each an *offer*, never a call (skills don't invoke each other):
- `untangle`'s positioning view (where your claim sits, the gap it fills) feeds `/shape:position` (ratifying it as canon) and `/shape:elicit` (converging where your claim fits, mid-grill).
- `critique`'s missing-evidence verdicts — a weakness the paper trail can't settle by more reading — can hand to `/shape:probe` (design and run the experiment that would decide it), the mirror of `frame:dialectic`'s own probe offer.
- `/shape:survey` offers `deep-research` for a decision-space gap that's external-world knowledge, not something a `dissect`/`untangle` pass over documents already on hand can answer.

This plugin lives inside the `skills` marketplace (`ChenPaulYu/skills`). It is **independent** — no dependency on `nav` or `shape`. The seams above are soft, guarded offers (ADR-007/015 pattern), not hard dependencies — research runs standalone with or without `shape` installed.

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
- **★ Capability first — artifact locations are conventions, not contracts (ADR-071/080)**: the deliverable of every research verb is the **in-chat analysis** (the skeleton, the referee report, the relational map); a saved file is an *offer* at the end, never a requirement. `notes/` (analysis notes) and `sources/` (fetched originals — a URL/PDF downloaded during intake) are the **suggested defaults**, but any location the user names works, and declining to save is a valid outcome. Cross-verb reuse (untangle/critique finding a prior dissect note) is a **tolerant three-state lookup** (ADR-071): ① produced in this conversation → use directly; ② user points at a location → read there; ③ neither → check the conventional `notes/` then fall back to deriving from the document itself — and self-report which tier was used. Reuse is best-effort, never a hard dependency on a folder shape.
- **Output format is the artifact**: a dissection note is a structured markdown file comparable across documents. The format is fixed so multiple notes can be laid side by side.
- **Claim injection is optional but recommended**: if the user's own claim is available, inject it so the skill can produce an "Implications for [your claim]" section. Without it, the skill still produces the structural skeleton; the implications section is blank.

## Where things live

```
.claude-plugin/plugin.json   → research's manifest (the version + metadata owner)
CLAUDE.md                    → ← you are here (research-specific)
skills/<name>/SKILL.md       → individual skills, each self-contained
```

Repo-wide layout + ADRs live in the repo-root [`CLAUDE.md`](CLAUDE.md), which also holds all editing rules (new-skill → ADR, the ★ authoring checks, renaming + versioning, the site-map gate). research adds nothing beyond the marketplace defaults.
