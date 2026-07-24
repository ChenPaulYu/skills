# reflect — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained. Repo-wide authoring + maintenance rules live in the repo-root [`CLAUDE.md`](CLAUDE.md).

## What this plugin is

Skills for **reflecting on your own working session** — the **one reflexive, cross-cutting family**. Every other family faces *outward* at an artifact in the world: `nav` = existing code · `shape` = a product's decisions / forward-motion · `research` = external documents · `think` = your reasoning about a problem. `reflect` alone turns attention **back on the work itself** — the current session and its durable traces in git/files. Because that concern cuts *across* every other family (you reflect before/after `nav` work, `shape` work, research), it can't be folded into any one of them; it sits across them, not parallel — which is exactly why it's its own family.

> **Why the name is `reflect`, not `manage` or `retro` (ADR-056).** `manage` mis-coloured the family as *maintenance* (which is `nav`'s job) — it fit 0 of the 3 members. `reflect` filters by **reflexivity, not tense** (Latin *reflectere*, "bend back" — a mirror shows you *now*), so it admits `catchup`'s forward "now + next" where `retro` (past-only) cannot. `reflect` is the **genus**; `retro` (see the value-guardrail) is a *species* under it. Distinct from `think`: think operates on the *problem's content*; reflect operates on the *work container* (where am I · what did I do · what did I learn).

Four active skills, **one read/write pair plus two distinct knowledge moves** — not a flat list. `catchup` / `park` are the cursor pair, **orient (read) → orient (write)**; `observe` distills one durable learning; `retrace` reconstructs a whole development arc as corrected causal stages and a concrete alignment artifact. Its chronological predecessor, `summarize`, was retired — [ADR-079](docs/adr/079-retire-reflect-summarize.md) — for failing the No-Op test: a plain "summarize this session" request already does what it did.

- **`catchup`** — *orient* (read): where does the work stand **now**? Rebuilt from durable state (git / diff / changed files / any plan) — checking a parked `HANDOFF.md` first when one exists — NOT chat memory, so it survives `/clear`, context compaction, or returning after a break. Fixed shape (goal · done · now · open · next), plain language, read-only except one bounded delete: after reporting, it clears a consumed cursor (done, or stale-and-absorbed) so `HANDOFF.md` is single-use ([ADR-085](docs/adr/085-reflect-catchup-clears-consumed-cursor.md)).
- **`park`** — *orient* (write): the mirror of `catchup` — before stepping away, write the same five-shape cursor + the current git SHA into the project's `HANDOFF.md`, overwriting any prior one. Summoned only; the supply side of `catchup`'s grounding.
- **`observe`** — *distill* (write): what is the one durable **learning**? Selective — extracts the reusable mechanism/insight as a claim and **writes** it into a knowledge base (`docs/observations/`), feeding the repo-evolution loop (lived experience → observation → ADR → skill).
- **`retrace`** — *causal re-entry* (write): how did the work arrive here? Reconstructs prior state → pressure → evidence → decision → status → next pressure, provenance-labels every bridge, gates on user correction, then writes a dated interactive artifact with concrete witnesses. A recap lists what happened; retrace explains why each turn became necessary ([ADR-084](docs/adr/084-reflect-retrace-causal-development-alignment.md)).

**Read/write symmetry, cursor side only**: `catchup`/`park` work the **cursor** (where the session is, and why) as a matched read/write pair. `observe` and `retrace` both face the **knowledge of the work**, but at different grains: observe keeps one reusable mechanism; retrace restores the complete causal path for human alignment. A plain recap still needs no skill. See [ADR-044](docs/adr/044-manage-plugin.md) (family birth), [ADR-056](docs/adr/056-manage-renamed-reflect.md) (the `manage → reflect` rename + planned `retro`), [ADR-070](docs/adr/070-reflect-park-write-side-of-cursor.md) (`park`), [ADR-079](docs/adr/079-retire-reflect-summarize.md) (`summarize` retired), and [ADR-084](docs/adr/084-reflect-retrace-causal-development-alignment.md) (`retrace`).

**Cross-project + language-agnostic.** `catchup` and `retrace` read the current project's durable state; `observe` writes to `$SKILLS_REPO/docs/observations/` (a central knowledge base) when the env var is set, else the current project's `docs/observations/`; `retrace` writes a dated project-local alignment artifact after the user corrects its causal outline.

## Conventions for skills inside this plugin

> Repo-wide authoring + maintenance rules live once in the repo-root [`CLAUDE.md`](CLAUDE.md). reflect-specific:

- **Read-only by default, three writers with separate owners**: `catchup`'s only write is deleting a consumed `HANDOFF.md` after reporting ([ADR-085](docs/adr/085-reflect-catchup-clears-consumed-cursor.md) — the cursor is single-use: park writes it, the catchup that drains it removes it); `park` overwrites the single `HANDOFF.md` cursor; `observe` writes only user-selected learning files; `retrace` writes only its dated alignment artifact after an outline correction gate. No reflect skill edits code, manifests, plans, decisions, or canon. (One writer before ADR-070, two before [ADR-084](docs/adr/084-reflect-retrace-causal-development-alignment.md); `catchup` gained its delete-only exception in ADR-085.)
- **Summoned, not automatic — with one nod-gated exception (2026-07-24)**: all four fire on explicit call — being auto-observed, auto-parked, or auto-retraced is the anti-feature (same stance as `/shape:elicit`). The one exception, ported from the retired private `tape` skill: `observe` may make a **one-line ambient capture offer** when the agent notices the same correction a second time or a hand-repeated personal ritual — an *offer*, dropped on silence; only a nod runs its single-candidate fast path. The full unbidden harvest stays forbidden.
- **Grounded, not from memory**: `catchup` rebuilds current state from durable evidence; `retrace` reconstructs historical causality from recorded intent + shipped state and labels every unsupported bridge. Live context enriches both but never silently replaces evidence.
- **Cost tier (ADR-059)**: the criterion (mechanical verbs declare `model: sonnet` in frontmatter, turn-level) is owned by the repo-root [`CLAUDE.md`](CLAUDE.md). reflect has no tiered verb. `catchup` judges now + next, `park` judges the cursor, `observe` selects durable learning, and `retrace` synthesizes and provenance-labels causal history; all stay on the session model.

## The value-guardrail (why these three, and what's excluded)

Each skill must force a structure the default would skip (the same gate as `think`, [ADR-034](docs/adr/034-think-plugin.md)). `catchup` earns it via **grounding-from-durable-state + a fixed shape**. `observe` earns it via the **candidate-first distill-to-durable-artifact** protocol. `park` earns it via the **mirrored fixed-shape + overwrite-with-SHA-check** protocol. `retrace` earns it via **six-field causal stages + provenance labels + an outline correction gate + concrete witnesses + a browser-verified artifact**. Deliberately excluded: `easy-explain` (style, no forced structure) and retired `summarize` (a complete neutral chronology is default behavior, [ADR-079](docs/adr/079-retire-reflect-summarize.md)). A new member must name the structure default behavior skips.

**Family-fit check for `park`** (2026-07-13, Paul pushed back, resolved before scaffolding): the judge is *object*, not tense — `park` writes about the work container itself (reflexivity), the same test `catchup`'s forward-looking "now + next" already passed under ADR-056. Full walk-through + the reversal-line ("the day every use needs its own justification is the day the name stops fitting") lives in `blueprints/thoughts/2026-07-13-reflect-park-writes-the-handoff.md`.

**Planned 5th member — `retro` (ADR-056, accepted in principle, not yet built).** Its slot remains **whole-session, evaluative on process**: where the work went in circles / took wrong turns → what to change. `retrace` does not fill that slot: it reconstructs causality neutrally, while retro would judge friction and prescribe one process change. Retro's forced structure remains **friction timeline (git churn / reverts / abandoned branches) → root-cause per item → one concrete process change**; its line against `observe` still requires a `/shape:elicit` pass + its own ADR before scaffolding.

## Where things live + when editing

```
.claude-plugin/plugin.json   → reflect's manifest (the version + metadata owner)
CLAUDE.md                    → ← you are here (reflect-specific)
skills/<name>/SKILL.md       → catchup · park · observe · retrace, each self-contained
```

Repo-wide layout + all editing rules (new-skill → ADR, the ★ authoring checks, renaming + versioning, the site-map gate, stale-`SKILL.md`) live in the repo-root [`CLAUDE.md`](CLAUDE.md).
