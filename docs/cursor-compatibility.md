# Cursor compatibility translation guide

> Claude Code plugin files are the frozen source contract. Cursor compatibility is a generated Cursor Plugin tree owned by `platforms/cursor/` and `scripts/build-cursor.mjs`.

The Cursor adapter releases independently from the Claude marketplace. Its release metadata lives in `platforms/cursor/manifest.json`; the ratified contract is [ADR-118](docs/adr/118-cursor-native-plugin-adapter.md).

## The rule

Never solve Cursor compatibility by weakening or forking the Claude skill, and never feed Cursor the Codex mirror. Keep `plugins/**`, `CLAUDE.md`, and `.claude-plugin/**` unchanged. Translate host-specific syntax while preserving the skill's behavioral gates.

```text
Claude owner                          Cursor projection
plugins/*/skills/*/SKILL.md  ───────▶ platforms/cursor/<plugin>/skills/<plugin>-<skill>/
                                      generated, never hand-edit
               platforms/cursor/manifest.json ───▶ adapter release
               .cursor-plugin/marketplace.json ───▶ generated marketplace
```

One source owns the method; the adapter owns only the host translation. Sibling consumers of the same owner: Claude Code and Antigravity (`agy plugin install plugins/<name>`) read `plugins/` directly; Codex / opencode read the separate Codex lowering under `.agents/skills/`. Do not conflate those paths with this Cursor adapter.

## Why this is not the Codex mirror

Cursor discovers `.agents/skills/`, but that directory is compiled for Codex: `disable-model-invocation` is stripped, `AskUserQuestion` becomes a Codex chooser, `Agent` becomes a Codex worker. Cursor supports the first natively and has different tools for the other two. Piggybacking is a capability loss.

## Translation table

| Claude source signal | Cursor projection rule | Required invariant |
|---|---|---|
| `plugin:skill` / `/plugin:skill` | Flatten to `plugin-skill` (folder + frontmatter `name`) | Slash names stay unique; Cursor does not namespace plugins. |
| `disable-model-invocation` | Keep in frontmatter | Summon-only skills stay summon-only. |
| `model: sonnet` | Strip from frontmatter; inject a mechanical-tier note | Cost-tier intent survives without illegal metadata. |
| `AskUserQuestion` | `AskQuestion` + the Cursor interactive-choice contract | No execution before the user's choice. |
| `Agent` / `subagent_type=Explore\|general-purpose` | `Task` with `generalPurpose` | Read-only reconnaissance stays read-only. |
| `browser-verifier` subagent | Plugin `agents/browser-verifier.md` via `Task` | Image tokens stay out of the caller. |
| `references/`, `scripts/`, `assets/` | Copy with path rewriting | Bundled resources remain reachable from the generated skill. |

## Install

Generate, then symlink into Cursor's local plugin root:

```bash
node scripts/build-cursor.mjs --sync-local
```

Reload Cursor (**Developer: Reload Window**). Skills surface under flattened names (`nav-audit`, `shape-elicit`). Verify: type `/` in Agent chat and search `nav-audit`.

Do not symlink `plugins/<name>` into `~/.cursor/plugins/local/`. That directory is the Claude source (bare skill names, Claude-host prose).

### Dual-global without name collisions

Cursor loads **both** `~/.cursor/plugins/local/` and (by default) `~/.agents/skills/`. Flat names like `nav-audit` collide if Codex also lives there.

**Recipe — both harnesses global, no shared names:**

```bash
node scripts/build-codex.mjs --sync-global --profile all --global-root codex
# If ~/.codex/agents/*.toml are user-owned and differ from this repo, append --skills-only
node scripts/build-cursor.mjs --sync-local
```

| Harness | Global home | Why |
|---|---|---|
| Cursor | `~/.cursor/plugins/local/` | native plugins (this adapter) |
| Codex | `~/.codex/skills/` | `--global-root codex` — keeps `~/.agents/skills` clear of this marketplace |

Then in Cursor **Settings → Rules, Skills, Subagents**, turn **OFF** “Include third-party Plugins, Skills, and other configs” so Cursor does not also scan `~/.codex/skills`.

Inside a clone of this authoring repo, committed `.agents/skills/` still sits next to Cursor plugins — that project-local overlap is an authoring-repo caveat, not the global dual install.

## What this adapter does not do

- Submit to Cursor's public review-gated marketplace.
- Rewrite Claude plugin versions. Adapter-only work bumps `platforms/cursor/manifest.json`'s `adapter_release`.
- Share lowering code with the Codex compiler. The two hosts diverge on purpose; a shared flatten of `/nav:audit` → `nav-audit` is the only overlap, duplicated rather than coupled.
