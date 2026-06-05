# ADR 022 — Codex compatibility via a one-way generator (plugins stay the source of truth)

**Status**: accepted
**Date**: 2026-06-02
**Relates**: [ADR-005](docs/adr/005-marketplace-plus-plugin-restructure.md) (marketplace + plugin namespace — the naming this flattens), [ADR-001](docs/adr/001-plugin-shape-and-naming.md) (bare-verb skill names)

## Context

Codex (OpenAI's CLI) adopted the **same Agent Skills format** Claude Code uses: a skill is a directory with a `SKILL.md` (`name` + `description` frontmatter + markdown body) plus optional `references/` / `scripts/` / `assets/`, and Codex can invoke a skill **implicitly** when a task matches its `description` — the same progressive-disclosure contract these plugins are built on. (Codex's older "custom prompts" — manual slash-command markdown — are deprecated in favour of skills.)

So making this marketplace Codex-compatible is a **mechanical mirror**, not a rewrite. The gaps are small and structural:

- **No plugin namespace.** Codex skills are flat and unnamespaced — there is no `nav:` / `shape:` topic prefix. Bare verbs (`audit`, `sync`) would collide across plugins (and with built-ins).
- **Discovery path.** Codex scans `.agents/skills/` (repo, walking up to the repo root) and `$HOME/.agents/skills/`, not `plugins/<p>/skills/`.
- **`AGENTS.md`, not `CLAUDE.md`.** Codex concatenates `AGENTS.md` from the repo root down for shared context; it has no plugin-level auto-loaded convention file.
- **Cross-references.** Skill bodies cite siblings as `/nav:sync`, `/shape:mockup` and the shared browser-verify slot as `plugins/shape/CLAUDE.md` — neither resolves in Codex.

## Decision

**Keep the Claude plugins under `plugins/` as the single source of truth; generate a Codex mirror from them with a one-way build script** (`scripts/build-codex.mjs`). The script:

1. **Flattens the namespace** — `plugins/nav/skills/audit/` → `.agents/skills/nav-audit/`, bumping the frontmatter `name` to `nav-audit`. The `<plugin>-<skill>` form preserves the topic grouping the namespace used to carry, with no collisions.
2. **Rewrites cross-references** — `/nav:sync` / `nav:sync` → `nav-sync` (requires a real verb after the colon, so bare-namespace prose like "the `nav:` namespace" is untouched); `plugins/*/CLAUDE.md` and generic `CLAUDE.md` → `AGENTS.md`.
3. **Re-roots bundled paths** — full skills-root reference links (`plugins/shape/skills/align/references/…`) → relative `references/…`, so they travel with the flattened skill dir.
4. **Normalises Codex metadata** — generated descriptions are YAML-safe quoted strings and are trimmed below Codex's 1024-character metadata limit. Claude plugin source frontmatter is also kept YAML-safe, but not trimmed.
5. **Synthesises `AGENTS.md`** at the repo root from all plugin `CLAUDE.md` files (same rewrites, agents profile) — the home for the shared rules the skills reference (the 8 rules, shape's browser-verify slot).

Generated output (`.agents/skills/`, `AGENTS.md`) carries a do-not-hand-edit banner and is **committed** so the mirror is shareable and versioned. Re-run after any `SKILL.md` edit: `node scripts/build-codex.mjs`.

## Why not the alternatives

- **Hand-port a second copy.** Rejected: two maintained trees drift. The skills are actively edited (21 ADRs of churn); a divergent Codex copy would silently lie within a session or two — the same failure mode the "stale header = lie" rule exists to prevent, at repo scale.
- **Install only into `~/.agents/skills/`.** Rejected: not versioned, not shareable, machine-local. The marketplace's whole point is distribution.
- **Make Codex the source, generate Claude.** Rejected: Claude Code is primary here, and its plugin layer is richer (marketplace manifest, plugin namespace, `/reload-plugins` dev loop). Generating *down* from the richer format to the flatter one loses nothing; the reverse would.

## Consequences

- **Regenerate-after-edit is manual, not enforced.** `node scripts/build-codex.mjs` is a documented step (README + the generated banners), not a hook. A stale mirror is possible if someone edits a `SKILL.md` and forgets — acceptable for now (the banner + README call it out); a pre-commit hook is a future option if drift bites.
- **Generated files must not be hand-edited** — the banner says so; fixes go into the plugin skill, then regenerate.
- **ADR citations inside skills** (`ADR-019`, etc.) are left as-is — they read fine as provenance and don't resolve to a path in either world; cosmetic, not load-bearing.
- **No structural change to the marketplace** — no skill, plugin, or rule was added/renamed/removed. Codex compatibility is a **distribution layer** over the existing roster. The gating site map's interactive body (nodes / edges / anatomies) is therefore unchanged; only its grounding-audit block is bumped (date, rev, ADR count, a VERIFIED line for the mirror, a FIXED entry).
- **`AGENTS.md` doubles as this repo's own Codex context** — an agent editing the skills in Codex gets the plugin conventions + 8 rules + gating discipline, the direct analog of the plugin `CLAUDE.md` files it's synthesised from.
