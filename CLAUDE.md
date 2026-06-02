# skills — repo-level context

> Marketplace-root instructions for an agent working in this repo. Plugin-level conventions live in each plugin's own `CLAUDE.md` ([`plugins/nav/CLAUDE.md`](plugins/nav/CLAUDE.md) · [`plugins/shape/CLAUDE.md`](plugins/shape/CLAUDE.md)); the marketplace map is [`docs/site/index.html`](docs/site/index.html); decisions are in [`docs/adr/`](docs/adr/).

## Language

Converse in **Traditional Chinese (繁體中文)** by default — explanations, questions, summaries, the back-and-forth. Keep all written **artifacts in English**: skill content (`SKILL.md`), `CLAUDE.md` files, ADRs, docs, commit messages, PR descriptions, code, config. The Chinese is for discussion; the deliverables stay English so the marketplace reads consistently and ships clean. Follow the user's lead if they switch to English mid-conversation.

## Editing this repo

- **Source of truth = the Claude plugins** under `plugins/<plugin>/skills/<skill>/SKILL.md`. The Codex mirror in `.agents/skills/` and the root `AGENTS.md` are **generated** by `scripts/build-codex.mjs` — edit the plugin skills, then re-run the generator; never hand-edit `.agents/skills/` or `AGENTS.md`. (Note: this file is NOT read by the generator, so repo-only instructions like the language preference above stay out of the shipped `AGENTS.md`.)
- **Gating**: any change to a `SKILL.md`, a plugin manifest, or an ADR requires the same change-set to update [`docs/site/index.html`](docs/site/index.html) (data arrays + audit-block rev + a FIXED entry). See the plugin `CLAUDE.md` files for the full discipline.
- **Each new skill / rule / family change → an ADR** in `docs/adr/`.
