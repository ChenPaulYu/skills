---
date: 2026-06-26
status: raw
---

# shape:setup preflight must distinguish a DANGLING SYMLINK from a truly-missing tool — `command -v` reports both as "missing", but they need opposite fixes

> Source: 2026-06-26, scaffolding a new repo (lutherie) via /shape:setup; preflight said `pnpm` missing, but it was actually a broken symlink, sending the user into an `npm i -g` EEXIST loop.

## What prompted it

setup's preflight (step 3) checked the toolchain with the documented `command -v <tool>` pattern. It reported `pnpm` **missing**. The user then ran `sudo npm i -g pnpm` and hit `npm error EEXIST: file already exists /usr/local/bin/pnpm` — confusing, because preflight had just said it *didn't* exist. The truth: `/usr/local/bin/pnpm` was a **dangling symlink** → `../lib/node_modules/corepack/dist/pnpm.js`, and corepack had been removed. So the file existed (blocking install) but the binary didn't run (so `command -v` resolved the symlink, found no target, and reported missing).

## The signal

**`command -v` / `which` collapse two distinct states into one "missing":** (a) nothing at the path, fix = install; (b) a broken symlink at the path, fix = `--force` reinstall or `rm` first. A plain "install it" instruction is *wrong* for (b) — it fails EEXIST and stalls the user.

The skill-feedback bind (S · P · D):
- **S** = `shape:setup`
- **P** = the preflight tool-presence check (step 3)
- **D** = when a tool resolves as missing, also probe the expected bin path for a *broken symlink* (`ls -l $(command -v … || echo /usr/local/bin/<tool>)`; `test -e` the resolved target). If found, surface "broken symlink — reinstall with `--force` (or `rm` first)", not the bare "install it". The fail-helpfully 3-way already exists; this just makes its diagnosis correct for the dangling-symlink case.

Generalizes beyond pnpm: any tool installed via a manager that leaves a symlink behind (corepack, nvm shims, brew unlinks) can rot into this state. The dangling-symlink probe is one extra `ls -l` and turns a 10-minute detour into a one-line fix.

## Evidence so far

- **Only case (2026-06-26, lutherie setup)**: preflight `command -v pnpm` → "missing"; real state = dangling symlink from removed corepack; user's `npm i -g pnpm` failed EEXIST; fix was `npm i -g pnpm --force`. Cost: one confused round-trip.

(One case → stays `raw`. Promote if a second setup run hits the same "missing-but-actually-broken-symlink" diagnosis gap, or if it recurs with a different tool — that's the trip-wire to bake the symlink probe into the preflight text / `fullstack-web` gotchas.)

## Links

- Feeds `plugins/shape/skills/setup/SKILL.md` preflight step + `references/archetypes/fullstack-web.md` gotchas (candidate gotcha #6: "a tool can report missing while a dangling symlink blocks reinstall").
- Candidate for a future ADR only if it generalizes into a stack-principles preflight convention.
