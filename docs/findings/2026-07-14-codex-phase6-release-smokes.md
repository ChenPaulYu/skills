# Codex Phase 6 release-smoke evidence — 2026-07-14

## Goal

Record the executable evidence behind Phase 6's release claim: the Codex adapter is independently releasable, a fresh Codex HOME can install the compiled adapter with its required runtime artifacts, and a fresh Claude-side maintenance pass preserves the frozen source contract unchanged.

## Commands run

```bash
node scripts/validate-codex-skills.mjs --release-smoke
node scripts/validate-codex-skills.mjs --compat-audit
node scripts/validate-codex-skills.mjs --codex-compat
node scripts/validate-codex-skills.mjs --metadata-audit
node scripts/validate-codex-skills.mjs --coverage-report
node scripts/validate-codex-skills.mjs
```

## Results

- `--release-smoke`: **2/2 passed**
  - `codex-global-install-all`: a fresh temp HOME ran `node scripts/build-codex.mjs --sync-global --profile all --dedupe-global-roots`, installed **36** compiled flat skills, removed seeded legacy duplicates from `~/.codex/skills/`, and emitted the required runtime artifacts:
    - `~/.codex/agents/executor.toml`
    - `~/.codex/agents/explorer.toml`
    - `~/.codex/agents/reviewer.toml`
    - `~/.codex/agents/browser-verifier.toml`
    - `~/.codex/hooks.json`
    - `~/.codex/hooks/relay-digest-session-start.mjs`
  - Installed sample skills (`nav-plan`, `research-dissect`, `shape-build`, `relay-digest`, `reflect-catchup`) all carried the generated banner and scanned clean for the manifest denylist.
  - Runtime ownership regressions are exercised: a first-install same-name user agent/hook conflict and a post-install user edit both fail before mutation, preserving the files and receipt; the entrypoint also fails when any non-release compatibility check fails, even if the two release fixtures themselves pass.
  - `claude-fresh-build`: a fresh temp copy ran `node scripts/build-manifests.mjs` and `node scripts/validate-codex-skills.mjs --metadata-audit`; monitored frozen/source-manifest paths (`CLAUDE.md`, `.claude-plugin`, `plugins`) had **zero drift** before vs after.
- `--compat-audit`: green
  - `20/20` canaries
  - `16/16` negatives
  - `3/3` lifecycle hook smokes
  - `1/1` preservation smokes
  - `2/2` release smokes
  - coverage `36/36`
  - unresolved denylisted categories: **0**
- `--codex-compat`: green
- default validator: green
- deterministic rebuild: second `node scripts/build-codex.mjs` changed nothing under `.agents/`, `.codex/`, or `AGENTS.md`
- `git diff --check`: clean
- `git diff --name-only -- CLAUDE.md .claude-plugin plugins .cursor-plugin`: empty

## Notes

- The public adapter contract remains role-based (`supervisor` / `executor` / `explorer` / `reviewer`). Paul's GPT-5.6 / GPT-5.4 mapping remains documented only as local Codex policy in `platforms/codex/local/README.md`; it is not claimed as portable runtime enforcement.
