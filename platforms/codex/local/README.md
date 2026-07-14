# platforms/codex/local/ — personal/project model mapping (NOT portable)

This directory holds **Paul's own** Codex model-role mapping for this workspace. It is
committed as *documentation of a personal choice*, not as marketplace policy — nothing
under `platforms/codex/agents/` or any generated skill in `.agents/skills/` reads or
references it. See [ADR-068](/home/worzpro/Desktop/dev/skills/docs/adr/068-codex-freeze-scoped-to-workstream.md)
and the plan's resolved-questions table
(`blueprints/plans/2026-07-13-codex-compatibility.md`) for why the split exists: the
public marketplace stays model-neutral (roles only — supervisor / executor / explorer /
reviewer), because a different Codex user's entitlements and model choices are their own.
See `docs/adr/068-codex-freeze-scoped-to-workstream.md`.

## What lives here

- `agents.example.toml` — an example of the personal mapping: which model plays which
  role on this machine, layered **on top of** the portable role templates in
  `platforms/codex/agents/*.toml` (which never set `model`).
- and see `blueprints/plans/2026-07-13-codex-compatibility.md` for the plan that scoped
  this split.

## How the mapping works

The portable templates (`platforms/codex/agents/executor.toml`,
`explorer.toml`, `reviewer.toml`) define role behavior — the developer instructions,
the sandbox posture, the return-contract expectations — with `model` deliberately
omitted. Codex custom-agent files support a `model` field per the official docs
(`https://developers.openai.com/codex/subagents`); a personal or project install
overrides it there, not in the portable template.

Paul's current mapping for this workspace (per the plan's resolved-questions table):

| Role | Model | Why |
|---|---|---|
| Root session (supervisor) | GPT-5.6 | Planning, arbitration, and independent verification stay on the strongest available reasoner — same principle as this repo's own dispatch-tier rule (root `CLAUDE.md`'s "Dispatch tiers": judgment stays on the session model). |
| `executor` | GPT-5.4 | Scoped code writes under a work packet — mechanical/disciplined execution, not open-ended judgment. |
| `explorer` | GPT-5.4 | Read-only reconnaissance/exploration — same tier as executor; cheap and parallelizable. |
| `reviewer` | GPT-5.4 (escalate to GPT-5.6 on a low-confidence verdict) | Independent verification is usually mechanical (rerun the commands, diff the scope); escalate only when the verdict itself is a judgment call the cheap tier can't settle. |

## To install this mapping

1. Copy the portable templates from `platforms/codex/agents/*.toml` into your Codex
   agent directory (`.codex/agents/` for project-scoped, `~/.codex/agents/` for
   personal — see each template's header comment for the verified install-location
   source).
2. Copy `agents.example.toml` alongside them (or merge its `model` lines into your
   copies) to apply this machine's role→model mapping. Rename/adjust as needed — this
   is a starting point, not a contract.
3. Nothing in the generated Codex skill mirror (`.agents/skills/**`) or `AGENTS.md`
   needs to change or know about this mapping — the skills describe roles
   (supervisor/executor/explorer/reviewer), never model names.

## Gitignore note

If you fork this repo and want your OWN personal mapping kept out of version control
entirely (rather than committed as an example, the way this one is), add a real
`platforms/codex/local/agents.toml` (unprefixed, no `.example.`) and gitignore that
specific filename — the `.example.toml` here stays committed as documentation of the
pattern; a real, private mapping file should not.
