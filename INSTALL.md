# INSTALL — agent-driven setup

> You are an AI coding agent asked to install the **skills** marketplace
> (<https://github.com/ChenPaulYu/skills>). Identify which harness you are
> running in, follow **that section only**, then run its verify step.
> Everything under `plugins/` is the single source of truth; `.agents/skills/`
> is a generated flat mirror — never hand-edit either on the user's behalf.

There are three channels (five agents):

| Channel | Harnesses | Skill names |
|---|---|---|
| Native plugin import | Claude Code · Antigravity CLI (`agy`) | namespaced — `/nav:audit`, `/fathom:compile` |
| Flat mirror `.agents/skills/` | Codex · opencode · (agy project-level fallback) | flat — `nav-audit`, `fathom-compile` |
| Native Cursor Plugins (`platforms/cursor/`) | Cursor — **not** the Codex mirror (ADR-118) | flat inside plugins — `nav-audit`, `fathom-compile` |

Edit only `plugins/`. After a skill change, regenerate with
`node scripts/build-manifests.mjs && node scripts/build-codex.mjs && node scripts/build-cursor.mjs`,
then `node scripts/validate-codex-skills.mjs`.

## Claude Code

```
/plugin marketplace add ChenPaulYu/skills
/plugin install nav@skills
/plugin install fathom@skills
/plugin install shape@skills
/plugin install frame@skills
/plugin install relay@skills
```

**Verify:** `/plugin` lists the five plugins; skills surface as `/nav:audit`, `/shape:align`, etc.

## Antigravity CLI (`agy`)

```bash
git clone https://github.com/ChenPaulYu/skills.git
cd skills
agy plugin install plugins/nav
agy plugin install plugins/fathom
agy plugin install plugins/shape
agy plugin install plugins/frame
agy plugin install plugins/relay
```

**Verify:** `agy plugin list` shows all five with source `claude-code`
(including `/fathom:compile` after fathom ≥ 0.13.0).

Note: prefer `agy plugin install` (namespaced under `~/.gemini/config/plugins/`). If a flat materialize into `~/.agents/skills/` appears, it collides with Cursor's scan of that directory — use Codex `--global-root codex` and keep marketplace flat copies out of `~/.agents/skills`. AGY hooks / MCP belong in `~/.gemini/config/` (machine-local), not in this repo.

## Codex / opencode

Both auto-discover `.agents/skills/` (project) and Codex also reads `~/.codex/skills/` (legacy global). Pick the scope:

- **Inside a clone of this repo** — nothing to do; the committed mirror loads automatically.
- **Global (all projects), Cursor-safe** — prefer this when Cursor plugins are also installed:

  ```bash
  git clone https://github.com/ChenPaulYu/skills.git /tmp/skills-install
  cd /tmp/skills-install
  node scripts/build-codex.mjs --sync-global --profile all --global-root codex
  ```

  Skills land in `~/.codex/skills/` and this marketplace is pruned from `~/.agents/skills/`, so Cursor’s flat-name scan of `~/.agents/skills` does not collide. If `~/.codex/agents/*.toml` are already customized, append `--skills-only` so the install does not touch runtime agents.

- **Global into `~/.agents/skills/`** (default; collides with Cursor if both are global):

  ```bash
  node scripts/build-codex.mjs --sync-global --profile all --global-root agents
  ```

- **One project only:** copy the skill dirs you want from `.agents/skills/` into that project's `.agents/skills/`.

**Verify:**

- Codex — `/skills` lists `nav-audit`, `fathom-index`, `shape-elicit`, …
- opencode — `opencode debug skill` lists them (project `.agents/skills/` and/or global agents root).

## Cursor

Cursor installs **native Cursor Plugins**, not the Codex mirror.

```bash
git clone https://github.com/ChenPaulYu/skills.git /tmp/skills-install
cd /tmp/skills-install
node scripts/build-cursor.mjs --sync-local
```

Then **Developer: Reload Window**. Type `/` in Agent chat and search `nav-audit`.

Do not symlink `plugins/<name>` into `~/.cursor/plugins/local/`. For **both Cursor and Codex global without name collisions**, use Codex `--global-root codex` (above), then in Cursor Settings → Rules, Skills, Subagents turn **OFF** “Include third-party Plugins, Skills, and other configs” so Cursor does not also load `~/.codex/skills`.

**Verify:** `/nav-audit` (or `/` then search `nav-audit`) loads the deep-module audit.

## After installing

Ask the agent to run `nav-audit` (or `/nav:audit`) on any codebase — if it loads
and starts a shape audit, the install works. Skill docs: each plugin's
`CLAUDE.md` under `plugins/<name>/`, marketplace map at `docs/site/index.html`.
