# manage — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained. Repo-wide authoring + maintenance rules live in the repo-root [`CLAUDE.md`](CLAUDE.md).

## What this plugin is

Skills for **reflecting on your own working session** — the **meta-lane**. The object is the *work process itself* (the current session and its durable traces in git/files), as opposed to the objects the other plugins own: `nav` = existing code · `shape` = a product's decisions / forward-motion · `research` = external documents · `think` = your reasoning about a problem. `manage` is the verb-set for "operate on the work session you're in" — a cross-cutting concern none of the object-families owns, which is exactly why it's its own family rather than folded into one of them.

Three seed skills — a triad **orient → recap → distill**:

- **`catchup`** — *orient*: where does the work stand **now**? Rebuilt from durable state (git / diff / changed files / any plan), NOT chat memory, so it survives `/clear`, context compaction, or returning after a break. Fixed shape (goal · done · now · open · next), plain language, read-only.
- **`summarize`** — *recap*: what did this session **do**? A complete, **objective** account of the work (attempted → done → decided → changed), neutral and exhaustive — not a selective TL;DR. Read-only; it is the raw input `observe` distills.
- **`observe`** — *distill*: what is the one durable **learning**? Selective — extracts the reusable mechanism/insight as a claim and **writes** it into a knowledge base (`docs/observations/`), feeding the repo-evolution loop (lived experience → observation → ADR → skill).

The pipeline is **`summarize` → `observe`** (complete objective recap → the one keeper); `catchup` is orthogonal (state-now, forward-oriented). See [ADR-044](docs/adr/044-manage-plugin.md).

**Cross-project + language-agnostic.** `catchup` / `summarize` read the *current* project's state; `observe` writes to `$SKILLS_REPO/docs/observations/` (a central knowledge base) when the env var is set, else the current project's `docs/observations/`.

## Conventions for skills inside this plugin

> Repo-wide authoring + maintenance rules live once in the repo-root [`CLAUDE.md`](CLAUDE.md). manage-specific:

- **Read-only by default, one writer**: `catchup` + `summarize` never write (they report to chat); only `observe` writes, and only the single observation file (show it before/after). No skill edits code, manifests, or the site map.
- **Summoned, not automatic**: all three fire on explicit call — being auto-summarized / auto-observed every turn is the anti-feature (same stance as `/shape:elicit`).
- **Grounded, not from memory**: `catchup` / `summarize` rebuild from durable state (git / diff / files) so they survive a wiped context — that grounding *is* the value, not chat paraphrase.

## The value-guardrail (why these three, and what's excluded)

Each skill must force a structure the default would skip (the same gate as `think`, [ADR-034](docs/adr/034-think-plugin.md)). `catchup` / `summarize` earn it via **grounding-from-durable-state + a fixed shape** (a default summary paraphrases chat and editorializes; these reconstruct from git and stay objective). `observe` earns it via the **distill-to-one-durable-artifact** protocol. Deliberately **excluded**: `easy-explain` ("say it simpler") — that's a *style* already mandated by the global CLAUDE.md, with no forced structure, and its object is *communication to a reader*, not the work session. A new seed member must clear this bar (name the forced structure, or it's not a skill).

## Where things live + when editing

```
.claude-plugin/plugin.json   → manage's manifest (the version + metadata owner)
CLAUDE.md                    → ← you are here (manage-specific)
skills/<name>/SKILL.md       → catchup · summarize · observe, each self-contained
```

Repo-wide layout + all editing rules (new-skill → ADR, the ★ authoring checks, renaming + versioning, the site-map gate, stale-`SKILL.md`) live in the repo-root [`CLAUDE.md`](CLAUDE.md).
