# ADR-118 — Cursor gets native plugins, not the Codex mirror

**Status**: accepted
**Date**: 2026-08-15
**Relates**: [ADR-022](docs/adr/022-codex-compat-generator.md) (one-way generated mirror), [ADR-083](docs/adr/083-codex-adapter-independent-release.md) (adapter releases independently)

## Context

The marketplace already claimed Cursor support by piggybacking on the Codex flat mirror (`.agents/skills/`, `nav-audit`). Cursor does discover that directory, so skills appeared. They were the wrong lowering.

Cursor is closer to Claude than Codex is: it supports `disable-model-invocation` natively, its chooser is `AskQuestion`, its worker is `Task`, and it loads **Cursor Plugins** from a `.cursor-plugin/plugin.json` plus a `skills/` directory. The Codex compiler strips the invocation flag, rewrites the chooser to a Codex-specific contract, and rewrites workers into Codex role vocabulary. Feeding Cursor that output is a capability loss, not compatibility.

A second, already-documented path — symlink `plugins/<name>` into `~/.cursor/plugins/local/` — was also wrong. Cursor does not namespace plugin skills (`/nav:audit`); the slash name is the skill folder. Bare verbs (`audit`, `plan`, `do`) collide across plugins and with other skills. On the author's machine those symlinks had additionally drifted to a retired checkout and retired plugin names (`think`, `research`).

## Decision

**Keep `plugins/` as the frozen Claude owner. Give Cursor its own generated plugin tree and its own adapter release, the same shape as Codex, with a thinner compiler because the gap is smaller.**

1. `scripts/build-cursor.mjs` emits installable Cursor Plugins under `platforms/cursor/<plugin>/`. Skill folders are flattened (`skills/nav-audit/`) so slash names stay unique. Bundled `references/` / `assets/` / `scripts/` and plugin-level `agents/` travel with the plugin.
2. A repo-root `.cursor-plugin/marketplace.json` (generated) lists those plugins with `pluginRoot: platforms/cursor`, so a Cursor Team Marketplace can import this repository. The public review-gated `/add-plugin` marketplace is not this repo's release channel.
3. Cursor-specific lowering lives in `scripts/lib/cursor-compat.mjs`: keep `disable-model-invocation`; drop `model: sonnet` (unsupported frontmatter) and inject a mechanical-tier note; rewrite `/nav:audit` → `nav-audit`; rewrite `AskUserQuestion` → `AskQuestion`; rewrite `Agent` / `subagent_type=Explore|general-purpose` → `Task`; keep `browser-verifier` as a plugin agent dispatched via `Task`. Do not inject Codex worker/custom-agent contracts.
4. The adapter has an independent release line in `platforms/cursor/manifest.json` (`adapter_release` + `schema_version`). Claude plugin versions do not bump for adapter-only work.
5. Supported install: `node scripts/build-cursor.mjs --sync-local` symlinks the generated plugins into `~/.cursor/plugins/local/`, records a receipt, and prunes only this marketplace's previous/legacy names (`think`, `research`). Do not symlink `plugins/<name>`.
6. `scripts/validate-codex-skills.mjs` gates Cursor drift the same way it gates the Codex mirror.

## Why not the alternatives

- **Keep Cursor on `.agents/skills/`.** Rejected: that tree is Codex-lowered. Cursor would keep losing invocation flags and calling tools that do not exist.
- **Symlink `plugins/<name>` as a Cursor plugin.** Rejected: bare skill names collide; Claude-host prose (`AskUserQuestion`, `Agent`) leaks; the author's existing symlinks already drifted.
- **Install flattened skills into `~/.cursor/skills/`.** Rejected as the primary path: this marketplace's identity is plugin families. Cursor Plugins preserve that grouping in Customize. Flattened names still live *inside* each generated plugin, which is the collision workaround Cursor currently needs.
- **Hand-port a second skill tree.** Rejected for the same reason as ADR-022: two maintained trees drift.

## Consequences

- Codex, opencode, and agy-project-level continue to consume `.agents/skills/`. Cursor does not.
- `~/.agents/skills` still overlaps Cursor's discovery list. Duplicate flattened names (`nav-audit` in both places) can hide a skill from the slash menu. Dual-global recipe: Codex `--sync-global --global-root codex` (marketplace lives under `~/.codex/skills/`, pruned from `~/.agents/skills`) + Cursor `--sync-local`, with Cursor's “Include third-party Plugins, Skills, and other configs” turned **off** so Cursor does not also scan `~/.codex/skills`.
- Working *inside this repo* still loads the committed `.agents/skills/` mirror, so this authoring checkout can show both copies. That is an authoring-repo limitation, not the install path for other projects.
- `plugins/<name>/.cursor-plugin/plugin.json` remains the four-field metadata projection (gate #1). It is not the installable plugin; `platforms/cursor/<name>/` is.
- README, INSTALL.md, and the site map install copy name Cursor as a native-plugin channel, not a Codex consumer.
