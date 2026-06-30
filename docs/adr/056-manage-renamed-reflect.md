# ADR 056 — `manage` renamed to `reflect` (and `retro` accepted as a planned member)

**Status**: accepted — implemented 2026-06-30 (reflect `0.2.0`)
**Date**: 2026-06-30
**Supersedes**: refines [ADR-044](docs/adr/044-manage-plugin.md) (the plugin's birth + object distinction — name only; the family stays as defined there)

## Context

The plugin's name **mis-colours its own family**. `manage`'s dominant sense is *administer / maintain* — so a reader (twice, in the session that produced this ADR) takes it for "maintain the repo," which is actually `nav`'s job. The family is not maintenance: its object is **your own working session** (the meta-lane, ADR-044), and its three members — `catchup` / `summarize` / `observe` — are all **reflexive** acts (turn attention back on the work-in-progress). A family name should fit its members; run the fit-test and `manage` fits **0 of 3** (you don't "manage" a catchup, a summary, or an observation), while `reflect` fits all three.

## Decision

| Part | Decision |
|---|---|
| **Rename** | plugin `manage` → **`reflect`**. Members unchanged: `reflect:catchup` · `reflect:summarize` · `reflect:observe`. |
| **Version** | `0.1.0 → 0.2.0` (the version owner: `plugins/reflect/.claude-plugin/plugin.json`). |
| **Positioning** (the identity the rename ratifies) | **The one reflexive, cross-cutting family** — its object is *the working session itself*, not an artifact out in the world (code/decisions/docs/problem). It sits *across* the object-families, not parallel to them: you reflect before/after any of them. Internally, three time-stances on the same session — `catchup` (now + next) · `summarize` (whole, neutral) · `observe` (the keeper). |
| **`retro` — accepted in principle, not built here** | A 4th member fills the one open slot: **whole-session, *evaluative* on process** (where the work went in circles / wrong turns → what to change). `summarize` refuses to judge; `observe` keeps only a positive keeper — nobody owns the evaluative-process diagnosis. Its boundary vs `observe` must be drawn by a follow-up `/shape:elicit` **before** it is scaffolded. |

## Why

- **Fit-test: `manage` fits 0/3 members, `reflect` fits 3/3.** The family name is a shelf label; it must describe what's on the shelf (three mirrors: orient / recap / distill), not mis-promise "maintenance."
- **`reflect` filters by reflexivity, not tense — so it admits `catchup`.** `retro` was floated as the name; it fails because it is *time-directional* (past-only) and `catchup` is forward (now + next). `reflect` (Latin *reflectere*, "bend back") is **attention-directional, tense-neutral** — a mirror shows you *now* — so "reflect on where I stand / on what to do next" both parse. That same breadth is why `reflect` is the **genus** and `retro` a **species** under it.
- **`retro` is the wrong *level* for a family name.** Promoting it to the umbrella would exclude `catchup` and collide with itself (`retro:retro`). It belongs *inside* the family as the evaluative-whole member — which is exactly the open slot.
- **Distinct from `think` (the easy confusion).** Both turn inward, but `think` operates on the *problem's content* (first-principles, dialectic); `reflect` operates on the *work container* (where am I, what did I do, what did I learn). think pushes on the question; reflect looks back at the one solving it.

## Consequences

- **Rename touches ~15 files across owner / generated / human-surface / cross-ref layers** — enumerated in the rename impact list (this ADR's companion). Owner manifest + marketplace `name`/`source` are hand-edited; cursor projection + `.agents/` mirror + `AGENTS.md` + marketplace `version` are **regenerated** (`build-manifests` + `build-codex`); README + `docs/site/index.html` are gated human surfaces (gate #3); the ADR index gains this row.
- **History is not rewritten; live cross-refs are.** Dated records (ADRs 044/045/049/050, the three `observations/`) keep `manage:*` untouched — it was accurate when written, and the user's call was to leave history fully alone rather than open the rewrite-history door even for a single now-dead path token (`plugins/manage/skills/observe/SKILL.md` in one observation stays as-is; this ADR is the bridge). Only **live** descriptions of the *current* system update to `reflect:*`: `plugins/relay/CLAUDE.md`, `docs/design/relay.md`, `plugins/nav/skills/compose/SKILL.md`.
- **One green validator, staged commits.** Regenerate, run `node scripts/validate-codex-skills.mjs` to green, commit the rename as one coherent change; the new ADR + impact list land with it.

## Out of scope

- **Building `retro`** — only *accepted in principle* here. Its forced structure (friction timeline → root-cause → process change) is sketched, but the line against `observe` is undrawn; a `/shape:elicit` pass + its own ADR precede any scaffold.
- **Re-scoping the family** — ADR-044's object definition and the three seed members stand; this ADR changes only the *name* (and adds a planned 4th).
