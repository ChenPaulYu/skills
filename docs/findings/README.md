# Findings

Build-side notes from editing this marketplace. The kind of mechanical knowledge — "Claude Code's plugin discovery actually works like this", "this naming pattern bites if you're not careful" — that future-you will want to look up before stepping on the same nail twice.

## Why this exists

Sibling to [`observations/`](docs/observations/), but pointing inward instead of outward:

| Folder | Audience | Promotion target |
|---|---|---|
| [`observations/`](docs/observations/) | future users of the skills (including future-you) | `plugins/*/skills/*/SKILL.md` |
| `findings/` (this folder) | future-you (or anyone) editing this marketplace | marketplace `CLAUDE.md` addition · `docs/adr/` · plugin `CLAUDE.md` · convention note |

ADRs record **decisions** ("we chose X over Y"). Findings record **mechanisms** ("here's how the thing actually behaves"). Different shape, different lifecycle.

## Scope

Anything you learned the hard way while editing this marketplace. Examples:
- How Claude Code's plugin discovery / registration / reload actually works
- How `marketplace.json` vs `plugin.json` slot together
- Naming patterns that look fine in isolation but read badly once invoked
- File-layout choices that affect distribution vs local-only tooling

**Not for**: usage techniques (those are [`observations/`](docs/observations/)) or formal design decisions (those are [`docs/adr/`](docs/adr/)).

## File shape

One file per finding. Name: `YYYY-MM-DD-<short-kebab-slug>.md`.

```markdown
---
date: 2026-05-28
status: raw
---

# <One-line takeaway in plain language>

<Free-form body. Useful prompts to answer if relevant:
- What I tried (concrete steps + commands)
- What happened (what didn't work, the symptom)
- Root cause (the underlying mechanism)
- How I fixed it (concrete steps + commands)
- Future-self note: how to recognize this situation next time, or
  the one-line generalizable principle>
```

Lean by design — same as [`observations/`](docs/observations/). Extra frontmatter fields earn their keep only after 5+ findings show they'd be useful.

## Status lifecycle

| Status | Meaning | Action |
|---|---|---|
| `raw` | First time encountered | Write it down before the details fade |
| `confirmed` | Reproducible; root cause understood | Update the body with the verified mechanism |
| `promoted` | Folded into `CLAUDE.md`, an ADR, or a convention note | Add a top-line link to where it landed; keep the finding as history |
| `superseded` | Underlying tooling / convention changed; finding no longer applies | Keep file with a one-line "superseded by X" header (negative results have value) |

(No `repeated` / `maturing` like `observations/` — findings are either confirmed or not; they don't gestate into bigger things, they get folded into the right place.)

## Promotion targets

When a finding matures:

- **`CLAUDE.md` addition** (marketplace or plugin level) — a one-paragraph "by the way, X works like this" that everyone editing here should know.
- **ADR** (`docs/adr/<n>-<topic>.md`) — only if the finding led to a **decision** about how this marketplace is shaped. A mere "how the tool works" stays as a finding.
- **Convention note inside a SKILL.md / plugin** — if the finding is internal to one plugin's mechanism.
- **Stay as a finding forever** — totally fine if it's reference material rather than something to bake into instructions.

## Discipline (for the finder)

- **Concrete > abstract.** Cite the actual command, the actual error, the actual file path. Generalities are hard to apply later.
- **Future-self framing.** End with "how would I recognize this situation next time?" — that's what makes a finding useful, not the war story.
- **Don't duplicate ADRs.** If a finding directly led to a decision, the decision belongs in `docs/adr/`. Link from the finding to the ADR; don't restate.
- **Negative results count.** "Tried X, it doesn't work because Y" is a real finding — mark it `superseded` or keep it `confirmed` with the limitation, don't delete.
- **One file per finding.** Same reason as observations — granularity helps promotion later.
