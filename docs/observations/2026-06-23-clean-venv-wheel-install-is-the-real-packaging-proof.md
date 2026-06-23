---
date: 2026-06-23
status: raw
---

# The real proof a package ships is "install the built wheel into a clean venv and import from *outside* the repo" — importing against the synced tree only proves the source resolves

> Source: end-to-end verification of youtube-toolkit's flat→src migration, which went a leg beyond `setup`'s `python-lib` verification chain.

## What prompted it

After moving the package under `src/`, the editable test run was green (263 passing) and `python -c "import pkg"` resolved — `setup`'s `python-lib` chain (leg 4 = in-repo import smoke, leg 5 = `uv build`) would have called it done. But every one of those checks runs **in the repo, against the synced/editable install**. None proves that the *built artifact* a user actually installs is correct. The user asked for the stronger proof, so we did it: `uv build` the wheel → fresh `uv venv` → `uv pip install dist/*.whl` → `import` with **cwd outside the repo**. It passed — and the gap it would have caught is real.

## The signal

There are two different questions, and the cheap checks only answer the first:

- **Does the source resolve?** — editable/synced import, in-repo. src layout already makes this catch most layout bugs (the repo dir has no importable package).
- **Does the shipped artifact work?** — only a *clean-room install of the wheel* answers it. This additionally proves: **wheel contents** (a module silently excluded from `[tool.hatch.build.targets.wheel]` passes every in-repo check and only `ImportError`s after `pip install`), and **dependency resolution from the wheel's declared deps** (not from the dev env that already has everything).

Two design details are load-bearing, not incidental:
- **A fresh venv**, not the dev env — the dev env masks missing/under-declared deps because they're already present.
- **cwd outside the repo** — run it from `/tmp`, not the repo root. Otherwise the source tree can shadow the installed package and you're back to answering the first question while believing you answered the second.

## Scope — when it's worth the cost

This leg installs the full dep closure into a throwaway venv (heavy: minutes, network). It earns its keep for a **published** package, where "passes locally, `ImportError` after `pip install`" is a real user-facing failure. For an **internal-only** lib (editable, never built-and-shipped), leg-4 in-repo import is enough — don't pay the clean-room cost for an artifact no one installs. The right home is an **optional, published-only** leg in the verification chain, not an always-on one.

## Evidence so far

- **Only case (2026-06-23, youtube-toolkit)**: clean-venv install + outside-repo import confirmed the wheel ships correctly (resolved to `…/site-packages/youtube_toolkit/`, version + sub-APIs + `extract_video_id` all live). It passed, so it didn't *catch* a bug this time — but it's the only leg that *could have* caught a mis-declared wheel-include, which the green in-repo suite cannot.

(One case → `raw`. Trip-wire: a wheel that passes the in-repo chain but fails the clean-venv install — the failure that converts this from "stronger in principle" to "caught a real ship-blocker." Feeds the `python-lib` archetype's verification chain.)
