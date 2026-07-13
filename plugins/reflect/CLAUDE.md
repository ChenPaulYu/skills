# reflect — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained. Repo-wide authoring + maintenance rules live in the repo-root [`CLAUDE.md`](CLAUDE.md).

## What this plugin is

Skills for **reflecting on your own working session** — the **one reflexive, cross-cutting family**. Every other family faces *outward* at an artifact in the world: `nav` = existing code · `shape` = a product's decisions / forward-motion · `research` = external documents · `think` = your reasoning about a problem. `reflect` alone turns attention **back on the work itself** — the current session and its durable traces in git/files. Because that concern cuts *across* every other family (you reflect before/after `nav` work, `shape` work, research), it can't be folded into any one of them; it sits across them, not parallel — which is exactly why it's its own family.

> **Why the name is `reflect`, not `manage` or `retro` (ADR-056).** `manage` mis-coloured the family as *maintenance* (which is `nav`'s job) — it fit 0 of the 3 members. `reflect` filters by **reflexivity, not tense** (Latin *reflectere*, "bend back" — a mirror shows you *now*), so it admits `catchup`'s forward "now + next" where `retro` (past-only) cannot. `reflect` is the **genus**; `retro` (see the value-guardrail) is a *species* under it. Distinct from `think`: think operates on the *problem's content*; reflect operates on the *work container* (where am I · what did I do · what did I learn).

Four skills, **two read/write pairs** — not a flat list. `catchup` / `summarize` / `observe` are the original triad **orient → recap → distill**; `park` is `catchup`'s write-side mirror, added once the read-only triad turned out to have no way to *hand the cursor forward*:

- **`catchup`** — *orient* (read): where does the work stand **now**? Rebuilt from durable state (git / diff / changed files / any plan) — checking a parked `HANDOFF.md` first when one exists — NOT chat memory, so it survives `/clear`, context compaction, or returning after a break. Fixed shape (goal · done · now · open · next), plain language, read-only.
- **`park`** — *orient* (write): the mirror of `catchup` — before stepping away, write the same five-shape cursor + the current git SHA into the project's `HANDOFF.md`, overwriting any prior one. Summoned only; the supply side of `catchup`'s grounding.
- **`summarize`** — *recap* (read): what did this session **do**? A complete, **objective** account of the work (attempted → done → decided → changed), neutral and exhaustive — not a selective TL;DR. Read-only; it is the raw input `observe` distills.
- **`observe`** — *distill* (write): what is the one durable **learning**? Selective — extracts the reusable mechanism/insight as a claim and **writes** it into a knowledge base (`docs/observations/`), feeding the repo-evolution loop (lived experience → observation → ADR → skill).

**Read/write symmetry**: `catchup`/`park` work the **cursor** (where the session is, and why); `summarize`/`observe` work the **knowledge** (what happened, and what's worth keeping). The `summarize` → `observe` pipeline (complete objective recap → the one keeper) is unchanged; `park` is `catchup`'s counterpart, not a third pipeline. See [ADR-044](docs/adr/044-manage-plugin.md) (family birth), [ADR-056](docs/adr/056-manage-renamed-reflect.md) (the `manage → reflect` rename + the planned `retro` member), and [ADR-070](docs/adr/070-reflect-park-write-side-of-cursor.md) (`park`, and reflect's move from one writer to two).

**Cross-project + language-agnostic.** `catchup` / `summarize` read the *current* project's state; `observe` writes to `$SKILLS_REPO/docs/observations/` (a central knowledge base) when the env var is set, else the current project's `docs/observations/`.

## Conventions for skills inside this plugin

> Repo-wide authoring + maintenance rules live once in the repo-root [`CLAUDE.md`](CLAUDE.md). reflect-specific:

- **Read-only by default, two writers**: `catchup` + `summarize` never write (they report to chat); `park` and `observe` are the two writers — `park` overwrites the single `HANDOFF.md` cursor file, `observe` writes the single observation file — each shows its write before/after. No skill edits code, manifests, or the site map. (Was "one writer" before [ADR-070](docs/adr/070-reflect-park-write-side-of-cursor.md) added `park`.)
- **Summoned, not automatic**: all four fire on explicit call — being auto-summarized / auto-observed / auto-parked every turn is the anti-feature (same stance as `/shape:elicit`).
- **Grounded, not from memory**: `catchup` / `summarize` rebuild from durable state (git / diff / files) so they survive a wiped context — that grounding *is* the value, not chat paraphrase.
- **Cost tier (ADR-059)**: the criterion (mechanical verbs declare `model: sonnet` in frontmatter, turn-level) is owned by the repo-root [`CLAUDE.md`](CLAUDE.md). reflect's tiered verb: **`summarize`** (a neutral, exhaustive recap from durable state). `catchup` (judges "now + next"), `park` (judges what's worth writing into the cursor), and `observe` (selects the one durable learning) stay on the session model.

## The value-guardrail (why these four, and what's excluded)

Each skill must force a structure the default would skip (the same gate as `think`, [ADR-034](docs/adr/034-think-plugin.md)). `catchup` / `summarize` earn it via **grounding-from-durable-state + a fixed shape** (a default summary paraphrases chat and editorializes; these reconstruct from git and stay objective). `observe` earns it via the **distill-to-one-durable-artifact** protocol. `park` earns it via the **mirrored fixed-shape + overwrite-with-SHA-check protocol** — a default "leave a note" would append a dated file or paraphrase loosely; `park` forces the same five questions `catchup` asks, plus a SHA that lets the *next* `catchup` detect drift. Deliberately **excluded**: `easy-explain` ("say it simpler") — that's a *style* already mandated by the global CLAUDE.md, with no forced structure, and its object is *communication to a reader*, not the work session. A new member must clear this bar (name the forced structure, or it's not a skill).

**Family-fit check for `park`** (2026-07-13, Paul pushed back, resolved before scaffolding): the judge is *object*, not tense — `park` writes about the work container itself (reflexivity), the same test `catchup`'s forward-looking "now + next" already passed under ADR-056. Full walk-through + the reversal-line ("the day every use needs its own justification is the day the name stops fitting") lives in `blueprints/thoughts/2026-07-13-reflect-park-writes-the-handoff.md`.

**Planned 5th member — `retro` (ADR-056, accepted in principle, not yet built).** The open slot is **whole-session, *evaluative* on process**: where the work went in circles / took wrong turns → what to change. `summarize` refuses to judge (neutral by design); `observe` keeps only a *positive* keeper — so nobody owns the evaluative-process diagnosis. Its forced structure: **friction timeline (grounded in git churn / reverts / abandoned branches) → root-cause per item → one concrete process change**. The bar it must still clear before scaffolding is the **line against `observe`** (a process-friction lesson can look like an observe candidate); that line gets drawn by a `/shape:elicit` pass + its own ADR first. Sibling framing: `summarize` and `retro` are the two whole-session readings — one neutral, one evaluative — and both can feed `observe`.

## Where things live + when editing

```
.claude-plugin/plugin.json   → reflect's manifest (the version + metadata owner)
CLAUDE.md                    → ← you are here (reflect-specific)
skills/<name>/SKILL.md       → catchup · park · summarize · observe, each self-contained
```

Repo-wide layout + all editing rules (new-skill → ADR, the ★ authoring checks, renaming + versioning, the site-map gate, stale-`SKILL.md`) live in the repo-root [`CLAUDE.md`](CLAUDE.md).
