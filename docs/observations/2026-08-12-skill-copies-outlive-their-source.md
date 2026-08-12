# Skill copies outlive their source — and a stale copy is a live skill

**Date**: 2026-08-12
**Evidence**: audit of 944 session logs (156 top-level Claude Code sessions, 628 sub-agent sessions, 160 Codex rollouts; 2.8 GB; window 2025-09-19 → 2026-08-12) plus a byte-comparison of every `SKILL.md` on disk.
**Fed into**: [ADR-107](docs/adr/107-retirement-round-four-verbs.md).

## The observation

Editing `plugins/` does not change what runs. A skill authored once had propagated into **five independent homes**, and **not one copy matched the repo** — 73 comparisons, zero byte-identical:

| Home | Entries | What it is |
|---|---|---|
| `plugins/<p>/skills/<s>/` | 39 | the source of truth |
| `.agents/skills/<p>-<s>/` | 39 | generated mirror (regenerable) |
| `$HOME/.agents/skills/` | 90 | real directories, most-read at runtime |
| `$HOME/.claude/skills/` | 75 | symlinks into the above |
| `$HOME/.codex/skills/` | 46 | a second host's own copy |
| plugin cache (`<plugin>/<version>/`) | 6 plugins | version-pinned install snapshots |

Two independent failures compound here, and they are worth separating.

**Failure 1 — the copies drift silently.** Every home outside the repo was frozen at 2026-07-13. Every improvement landed after that date reached zero sessions. Installed plugins are *version-pinned cache snapshots*, so without a version bump plus an explicit update, `claude plugin update` no-ops and each machine keeps serving the old snapshot. All six plugins were behind; one by two major versions.

**Failure 2 — deletion doesn't propagate, so retired skills stay loadable.** `reflect:summarize` (retired 2026-07-14, ADR-079) and `relay:register` were still present in the installed cache a month later — not as dead files, but as **installable, loadable skills**. The repo had no such verb; sessions did.

The second failure is the sharper one. Drift makes a skill *old*. Un-propagated deletion makes a skill *nonexistent-but-live* — behaviour with no source to read, no owner to fix, and no way to reason about it from the repo.

## Why it happened

The repo already had a mechanical gate for exactly this class of bug: a pre-commit validator that re-derives every generated artifact and fails on drift. It covers `.agents/` and the manifests — the copies **inside** the repo. It has no reach over copies **outside** it, and those are the ones sessions actually load.

The same asymmetry explains the recurrence. A 2026-07-17 incident recorded all six plugins running month-old caches; the fix was written down as a rule ("after landing an edit, bump the version, regenerate, then `claude plugin update` on each machine"). By 2026-08-12 every cache was stale again. **The rule was correct and it still failed, because it was a rule and not a gate.** A step that must be remembered on every machine after every edit is a step that will be skipped.

## The transferable lesson

**A generated-artifact gate must cover the artifacts that actually execute, not just the ones in the repo.** Single-owner discipline inside a repo is necessary and not sufficient: the moment a copy is installed, cached, or mirrored outside the tree, the repo's validator stops being the enforcement point, and correctness degrades to memory.

Two practical corollaries:

- **Retirement has two halves.** Deleting `plugins/<p>/skills/<s>/` retires the *source*. Until the caches and home copies are refreshed, the *verb* is still live. An ADR that records only the first half describes a state that does not exist yet.
- **Prefer one real home plus pointers.** Of the five homes, four held real copies of the same content. Symlinks — which one home already used — turn drift into an impossibility rather than a thing to check for. Where symlinks aren't available (a version-pinned cache), the refresh belongs in a hook, not in a habit.

## The diagnostic that found it

Worth keeping, because self-reports were useless here and the disk was decisive:

- Count skill fires from the host's own **skill-load markers** in session logs, never from the agent's or the user's recollection. The measured distribution (146 loads across 19 skills; nine skills = 80%) contradicted every impression held before the audit.
- Then **byte-compare the copies**. Usage data explains what fires; only the disk explains *which version* fired. The most consequential finding — retired skills still installed — was invisible in the logs and obvious in one `cmp` sweep.
