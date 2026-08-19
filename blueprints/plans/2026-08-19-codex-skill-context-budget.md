# Codex skill context budget — plan

> Generated: 2026-08-19 · Spec source: current session diagnostic · Stage 1: fresh

## Context

Codex currently renders 126 skill entries in this repository, but only 98 names are unique.
The committed `.agents/skills/` mirror overlaps the globally installed marketplace copy, adding
27 duplicate entries, while globally installed specialist packs add most of the remaining metadata.
The original descriptions total roughly 32,000 characters, so Codex shortens them before each turn.

The repository already owns the needed mechanisms: named install profiles in
`platforms/codex/manifest.json`, profile selection and receipts in `scripts/build-codex.mjs`, a
metadata budget gate, and native Codex per-skill enablement. The missing connection is
`scripts/sync-installed.sh`: it omits `--profile`, so every hook-driven refresh silently falls back
to `all` and reverses a user's narrower selection.

The intent is to preserve the user's chosen global marketplace profile, start fresh installs lean,
and use Codex's native path/name enablement for machine-specific specialist and duplicate entries.

## Resolved questions

| Question | Resolution |
|---|---|
| Should skills be deleted to reduce context? | No. Keep them installed and use Codex's native enable/disable state. |
| Should the marketplace descriptions be shortened again? | No. They already satisfy the 7,000-character sidecar gate; scope and duplication are the larger levers. |
| What should a fresh hook-managed install choose? | `minimal`; an explicit selection is persisted in the install receipt. |
| What should happen to an existing selection? | Preserve the receipt's profile unless the user passes an explicit override. |

## Approach

1. Make `scripts/sync-installed.sh` accept `--codex-profile <name>`, reuse the active receipt's
   profile by default, and use `minimal` only when no prior selection exists.
2. Update the install documentation so hook behavior and the manual profile switch are explicit.
3. Add a shell smoke that proves an explicit profile persists across a second implicit sync in an
   isolated HOME.
4. On this machine, disable the full 24-skill Three.js specialist pack and the 27 repo-local
   duplicate paths through `skills/config/write`. Remove six separately installed, zero-use skills
   after explicit user review; keep first-party Codex artifact plugins enabled.
5. Re-render the model-visible prompt and verify the skill count drops below the truncation point.

## Critical files

| File | Why it matters | Touched in step |
|---|---|---|
| `scripts/sync-installed.sh` | Sole owner of installed-copy refresh behavior | 1, 3 |
| `scripts/build-codex.mjs` | Existing profile selector and receipt writer; reused unchanged if possible | 1, 3 |
| `platforms/codex/manifest.json` | Existing profile definitions | 1, 3 |
| `docs/codex-compatibility.md` | Detailed Codex install and budget contract | 2 |
| `README.md` | Human-facing install path | 2 |
| `CLAUDE.md` | Repo-wide hook/update ritual; source for generated `AGENTS.md` | 2 |

## Single-source-of-truth owners

| Decision | Owner |
|---|---|
| Active global marketplace profile | `.skills-marketplace-codex.json` receipt beside the selected global root |
| Available profile membership | `platforms/codex/manifest.json` |
| Machine-specific skill enablement | Codex user config written by `skills/config/write` |

## Verification

1. Explicit profile selection → sync under an isolated HOME, assert receipt profile and skill set.
2. Implicit follow-up sync → assert the same receipt profile and skill set remain unchanged.
3. Repository consistency → run `node scripts/validate-codex-skills.mjs` and
   `node scripts/validate-blueprints.mjs`.
4. Local runtime → run `codex debug prompt-input`, count model-visible skill entries and duplicate
   names, and confirm the shortening warning no longer appears in a fresh session rendering.

End-to-end: a hook refresh no longer expands a narrow install back to `all`, while disabled
specialist skills remain installed and can be re-enabled from `/skills`.

## Out of scope

- Changing Codex's internal context-budget limit.
- Adding more marketplace skills or changing any skill's behavior.
