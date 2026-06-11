# INSTALL — agent-driven setup

> You are an AI coding agent asked to install the **skills** marketplace
> (<https://github.com/ChenPaulYu/skills>). Identify which harness you are
> running in, follow **that section only**, then run its verify step.
> Everything under `plugins/` is the single source of truth; `.agents/skills/`
> is a generated flat mirror — never hand-edit either on the user's behalf.

There are two channels:

| Channel | Harnesses | Skill names |
|---|---|---|
| Native plugin import | Claude Code · Antigravity CLI (`agy`) | namespaced — `/nav:audit`, `/shape:build` |
| Flat mirror `.agents/skills/` | Codex · opencode · Cursor | flat — `nav-audit`, `shape-build` |

## Claude Code

```
/plugin marketplace add ChenPaulYu/skills
/plugin install nav@skills
/plugin install shape@skills
/plugin install research@skills
/plugin install think@skills
```

**Verify:** `/plugin` lists the four plugins; skills surface as `/nav:audit`, `/shape:align`, etc.

## Antigravity CLI (`agy`)

```bash
git clone https://github.com/ChenPaulYu/skills.git
cd skills
agy plugin install plugins/nav
agy plugin install plugins/shape
agy plugin install plugins/research
agy plugin install plugins/think
```

**Verify:** `agy plugin list` shows all four with source `claude-code`.

Note: agy's global import also materializes the skills into `~/.agents/skills/`,
which opencode and Cursor read — so this single install may already cover them globally.

## Codex / opencode / Cursor

All three auto-discover `.agents/skills/`. Pick the scope:

- **Inside a clone of this repo** — nothing to do; the committed mirror loads automatically.
- **Global (all projects):**

  ```bash
  git clone https://github.com/ChenPaulYu/skills.git /tmp/skills-install
  mkdir -p ~/.agents/skills
  cp -r /tmp/skills-install/.agents/skills/* ~/.agents/skills/
  rm -rf /tmp/skills-install
  ```

- **One project only:** copy the skill dirs you want from `.agents/skills/` into that project's `.agents/skills/`.

**Verify:**

- Codex — `/skills` lists `nav-audit`, `shape-build`, …
- opencode — `opencode debug skill` lists them.
- Cursor — type `/` in Agent chat and search for `nav-audit`.

Cursor alternative — native plugin form (each plugin carries a `.cursor-plugin/plugin.json`):

```bash
ln -s "<repo>/plugins/nav" ~/.cursor/plugins/local/nav   # repeat per plugin; restart Cursor
```

## After installing

Ask the agent to run `nav-audit` (or `/nav:audit`) on any codebase — if it loads
and starts a shape audit, the install works. Skill docs: each plugin's
`CLAUDE.md` under `plugins/<name>/`, marketplace map at `docs/site/index.html`.
