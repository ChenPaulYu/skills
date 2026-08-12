# ADR 107 — Retirement round: `frame:graft`, `shape:setup`, `research:provenance`, `reflect:observe`

**Status**: accepted
**Date**: 2026-08-12
**Source**: ratified by Paul 2026-08-12, off a transcript audit he commissioned ("my skills feel harder to use — track my conversation history and list the problems").
**Precedent cited**: [ADR-021](docs/adr/021-retire-nav-doctor.md) (the razor: a verb survives only if it forces a structure the default would skip) · [ADR-079](docs/adr/079-retire-reflect-summarize.md) (its first application to a non-orchestrator).

## Context

The marketplace went from 11 skills to 39 between 2026-06 and 2026-08. The felt symptom was not "a skill is wrong" but "the whole thing is harder to use." An audit of 944 session logs (156 top-level Claude Code sessions, 628 sub-agent sessions, 160 Codex rollouts; 2025-09-19 → 2026-08-12) measured what actually fires, using the host's own skill-load markers rather than self-reports.

**The distribution is the finding.** 146 skill-loads landed on **19 distinct skills**; nine of them account for 80%. **Nineteen skills never loaded once.**

A raw usage count is not a retirement criterion, and this ADR does not treat it as one. Three separate reasons explain a zero, and only one of them is a verdict on the verb:

1. **Never reachable.** Eight skills (`nav:tour`, `reflect:park`, `reflect:retrace`, `relay:brief`, `relay:migrate`, `shape:migrate`, `shape:probe`, `shape:survey`) were absent from the installed plugin cache entirely. A zero here measures the distribution pipeline, not the skill.
2. **Wanted but not firing.** `nav:map` (9 inbound references, 7 ADRs, named by the user 10 times) and `shape:build` (6 inbound references, 4 ADRs, named by the agent 32 times) are demanded in conversation and never fire. That is a trigger-description defect; deleting them would delete the wrong thing.
3. **Genuinely unclaimed.** Reachable in the cache, old enough to have had a fair run, low inbound reference count, and no observed demand. Four skills sit here. They are the subject of this ADR.

`relay`'s seven skills are all unused and all survive: the family is 22–50 days old and was rewritten to v2.2.0 days before the audit. Unused-because-new is not unused-because-unwanted.

## Decision

**Retire four verbs.** The marketplace goes from 39 skills to **35**.

### `frame:graft` — the weakest lens

40 days old, one inbound reference, never invoked. `frame`'s charter requires each lens to force a structure the default would skip. `graft`'s structure — pick a donor whose shape rhymes, map every primitive, read each as fit / break / adapt — is real, but it is the one lens whose payload a competent default already approximates when asked "what's this like, and where does the resemblance break?" Its siblings hold up better under that test: `first-principles` and `orthogonal` force decompositions in specific directions, and `dialectic` forces a three-way verdict a default answer will not volunteer. frame goes to three lenses + `analogize`.

### `shape:setup` — a door no one opened

63 days old, one inbound reference, never invoked. Its payload was archetype determination + standing stack principles + an enforced verification chain. The chain is genuinely more than `mkdir` theatre — but scaffolding a new project is a once-per-project act, and in 11 months the door was never the thing reached for. shape goes to ten skills.

### `research:provenance` — zero inbound, zero uptake

61 days old, **zero** inbound references from sibling skills, never invoked. It was framed as `critique`'s mirror (their claims vs their evidence ↔ your citations vs your sources). The mirror was conceptually clean and empirically inert. research goes to three skills, and its spine simplifies: `dissect` gives the nodes, `untangle` the edges, `critique` assesses one argument's evidence.

### `reflect:observe` — the expensive one

This one is retired for a different and sharper reason, and it is the reason the audit was commissioned.

`observe` **never loaded once in 11 months** — and it carried the **longest description in the entire marketplace, 770 characters**, as a model-invoked skill. A model-invoked description is resident in every turn of every session whether or not the skill fires. It was, by a clear margin, the largest standing context cost in the marketplace, in exchange for zero invocations.

The failure mode underneath is worth naming, because it generalizes past this verb. Under a nod-gated exception adopted 2026-07-24, `observe`'s description carried an **ambient clause**: an instruction to proactively offer, in one line, to capture a learning. That clause sat in the *description*, which is always loaded — so **the offer fired from the description text alone, while the skill body it advertised never ran**. The user's report ("it mis-fires constantly, and I don't actually need it") describes exactly this: the nag arrived, the machinery never did. The description was not describing a behaviour; it *was* the behaviour.

Making it summon-only was considered and rejected by the user in favour of deletion. Two of the three surviving reflect skills already sit closer to the durable-learning slot than `observe` did in practice, and asking plainly for a learning to be written down produces the artifact without a door.

**`reflect` goes to three skills, and ambient self-firing is now forbidden family-wide** — not merely gated. That prohibition is the durable half of this decision.

## What is honestly lost

- **`graft`** — the *adapt list* (where a borrowed structure had to reshape for the target domain) was a genuinely sharp artifact, and a default analogy answer will usually report fits and skip breaks. The loss is real for deliberate design-by-donor work; it is small because that work is rare and the lens can be requested in prose.
- **`setup`** — the verification chain ("done = chain green, not files written") is a discipline default scaffolding genuinely skips, and nothing else in `shape` now enforces it. If new-project scaffolding becomes routine rather than occasional, this is the first thing to miss.
- **`provenance`** — the classification (first-hand verified / second-hand / orphan) is a structure a default citation check does not produce. Losing it means an unverified citation is now caught only if someone thinks to look.
- **`observe`** — the candidate-first protocol (surface 2–5 candidates, classify by two different selectors, never auto-write) was well designed. What it lacked was not quality but a reason to be a door: in 11 months nobody opened it. The repo-evolution loop (lived experience → observation → ADR → skill) survives — this very ADR is an instance of it, produced without the skill.

## Re-entry conditions

None of these is a permanent door-closing. Each returns on **observed** need, not hypothesized need:

- **`graft`** — if design-by-donor becomes a recurring move rather than an occasional one, and prose requests demonstrably produce fit-only reskinning.
- **`setup`** — if new-project scaffolding becomes routine, or a verified-baseline chain is wanted by someone other than its author.
- **`provenance`** — if a citation error actually ships, or a document set grows past the size where ad-hoc checking is credible.
- **`observe`** — only with the ambient clause permanently absent and `disable-model-invocation: true` from birth. The verb's protocol was never the problem; its always-resident, self-firing description was.

## The general lesson this round encodes

**A skill's description is not documentation — it is running code.** For a model-invoked skill, the description executes on every turn whether the body ever loads or not. `observe` proves both halves of the cost: the tax is paid continuously, and behaviour can be induced by the description alone, with the machinery it promises never entering the picture. A verb whose description does work its body never gets to do is not a cheap skill; it is the most expensive kind.

Corollary, and the reason three of these four retirements are modest while one is pointed: **retire on unclaimed-ness, never on a raw zero.** A zero can mean never-reachable, wanted-but-mis-triggered, or genuinely unclaimed. Only the third is a verdict. Nineteen skills showed a zero in this audit; four are retired here.

## Consequences

- `plugins/frame/skills/graft/`, `plugins/shape/skills/setup/`, `plugins/research/skills/provenance/`, `plugins/reflect/skills/observe/`: **deleted** (`git rm -r`).
- Sibling cross-references zeroed: `plugins/frame/skills/analogize/SKILL.md` (lens list), `plugins/shape/skills/align/SKILL.md` (born-via-setup path), `plugins/nav/skills/compose/SKILL.md` (upstream + consumers lists), `plugins/reflect/skills/catchup/SKILL.md` and `plugins/reflect/skills/park/SKILL.md` (companion lists + the history-belongs-to line).
- `plugins/*/CLAUDE.md`: rosters, counts, value-guardrail entries, and per-lens framings updated for all four families; reflect's "summoned, not automatic" convention hardened from *one nod-gated exception* to **no exceptions**.
- `plugins/<p>/.claude-plugin/plugin.json`: `frame` 0.6.1 → 0.7.0 · `reflect` 0.7.0 → 0.8.0 · `research` 0.6.0 → 0.7.0 · `shape` 0.13.0 → 0.14.0; each description and keyword list rewritten to name only surviving skills.
- `.claude-plugin/marketplace.json`: the four hand-owned blurbs corrected; `version` fields re-derived by `scripts/build-manifests.mjs`.
- `README.md`: the `/research:provenance` verb-table row removed; the `frame` / `reflect` / `research` / `shape` plugin rows and the Invocation buckets updated.
- `docs/site/index.html`: four nodes and their edges removed, per-plugin counts and prose blocks corrected in both languages, four version tokens bumped, rev 99 → 100 dated 2026-08-12, ADR count → 108.
- `.agents/skills/` + `AGENTS.md`: regenerated via `scripts/build-codex.mjs` (never hand-edited).
- **Distribution, not just source.** This round ships alongside a cleanup of the copy sprawl the same audit exposed: five independent homes held the same skills, with **zero** of 73 copies byte-matching the repo, and two skills already retired long ago (`reflect:summarize`, `relay:register`) were still installed and loadable. Retiring a verb in `plugins/` does not retire it on disk — see [`docs/observations/2026-08-12-skill-copies-outlive-their-source.md`](docs/observations/2026-08-12-skill-copies-outlive-their-source.md).
