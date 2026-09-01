# ADR 125 — `nav:sync` gains a third, on-demand `docs` leg

**Status**: accepted
**Date**: 2026-09-01
**Source**: Paul asked directly — he keeps hand-asking an agent to check whether his docs (README first) are current, and wants that folded into a skill instead of repeated ad hoc. Confirmed scope in-session: this marketplace only (not a cross-project claim), landing on `nav:sync` (recommended over a standalone skill), on-demand trigger only (not a commit-time gate).
**Precedent cited**: [ADR-108](docs/adr/108-retire-research-fold-map-into-sync.md) (sync's two-leg, one-door shape) · [ADR-071](docs/adr/071-contracts-vs-conventions-tolerant-reader.md) (tolerant reader: standard / non-standard / absent, self-reported) · root [`CLAUDE.md`](CLAUDE.md) gate #3 (the manual precedent this ADR generalizes).

## Context

This repo's own root `CLAUDE.md` already carries a hard, hand-maintained gate (gate #3): a skill/roster change must update both `docs/site/index.html` and `README.md` in the same commit, because nothing mechanically enforces most of that content. The build-time validator (`scripts/validate-codex-skills.mjs`) closes a narrow slice — it fails if a skill's invocation slug is unregistered, and it checks that the site map names each plugin's *current version*. It cannot check whether README's plugin table, per-plugin skills list, or install commands still describe reality; that gap is explicitly named in `CLAUDE.md`'s own text as "still on you."

Paul's ask surfaces the cost of that gap directly: he repeatedly asks an agent, by hand, "is the README still current?" — the exact check gate #3 already specifies but no skill executes. The fix is to teach an existing skill to run that check on request, rather than adding a new always-resident door for a need that's already served by an existing one's shape.

## Decision

`/nav:sync` gains a third leg, **docs**, alongside its existing headers (per-file, continuous) and map (per-repo, periodic) legs. Cadence: **on-demand** — the user asks ("is the README up to date?", "README 有沒有到最新"); it never runs as a background sweep or a commit-time gate.

**Design constraint carried through from nav's own authoring rules**: `nav:sync` ships as a reusable skill across other repos (its cache is installed elsewhere; the Codex/Cursor mirrors carry it out of this marketplace entirely). Hardcoding "compare `plugins/*/plugin.json` against README's plugin table" would violate the repo's own stack-neutral / standalone-legible rule — a skill that only makes sense inside this one repo is a leaky skill. So the leg is generalized as a two-tier check:

- **Tier 1 — the repo declares its own gate.** If a repo's CLAUDE.md (or equivalent) already names specific docs, specific facts, and specific sources — as this repo's gate #3 does — follow that verbatim. Tolerant-reader logic (ADR-071): standard shape (a gate exists) → consume directly.
- **Tier 2 — universal fallback.** No declared gate → check the common claim kinds any README makes (version mentions, roster/feature lists, install commands, dead links) against their obvious ground truth (manifest, directory listing, code). Self-report which tier was used.

Applied to this repo today, Tier 1 fires: the leg walks gate #3's own checklist (README's plugin table + per-plugin skills list + install commands vs. `plugins/*/.claude-plugin/plugin.json` + `plugins/*/skills/*/SKILL.md`).

Same discipline as the headers leg: **ground every claim against a real source (never another doc), diff-gated, never auto-applied.** New `plugins/nav/skills/sync/references/docs-render.md` carries the full procedure, the 8-rules restatement, and the anti-pattern table — same shape as `header-render.md` / `map-render.md`.

## What was considered and rejected

- **A standalone new skill.** Rejected — the need (keep a hand-maintained surface honest against ground truth) is the same shape as sync's existing map leg (render a projection, keep it from lying), just a different cadence and a different projection target. A third door would repeat ADR-108's own lesson: cadence is a scheduling fact the body handles, not an interface fact worth a second always-resident description.
- **A commit-time / pre-commit gate.** Rejected for now — Paul explicitly chose on-demand. Gate #3 already exists as a manual discipline in `CLAUDE.md`; this ADR gives it an executable form without also making it a blocking mechanism. Revisit if on-demand checks are consistently forgotten.
- **Hardcoding this repo's specific roster shape into the skill.** Rejected per the stack-neutral / standalone-legible authoring rule — see Decision above.

## Consequences

- `plugins/nav/skills/sync/SKILL.md`: frontmatter description, opening prose, Stance (+4 bullets), Process (new step 4), Companion skills (+1 line) updated to name the docs leg.
- `plugins/nav/skills/sync/references/docs-render.md`: new file — the docs-leg procedure (two-tier check, 8-rules restatement, anti-pattern table).
- `plugins/nav/.claude-plugin/plugin.json`: 0.17.0 → 0.18.0; description updated.
- `plugins/nav/CLAUDE.md`: skill roster line updated to name the docs leg + this ADR.
- `README.md`: nav plugin-table row + `/nav:sync` invocation line updated (three cadences, not two).
- `docs/site/index.html` (rev 129): `DOMAINS.nav` blurb (version bump + docs-leg mention) + its `/nav:sync` files-row description; `NAV_NODES` `sync` node's role/desc (EN + zh-Hant); audit block's "nav skills" line + a new FIXED entry.
- Manifests regenerated (`scripts/build-manifests.mjs`) and mirrors regenerated (`scripts/build-codex.mjs`, `scripts/build-cursor.mjs`); `scripts/validate-codex-skills.mjs` green before commit.
