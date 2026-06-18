---
date: 2026-06-18
status: raw
---

# Browser-smoking from a git worktree must isolate ports AND data first — fixed shared dev ports silently cross-wire to a parallel session, and `free_port`-style launchers kill it

> Source: this session — building an audio-layer refactor in a Crate git worktree, browser-smoking each slice while the main checkout's dev server was also running.

## What prompted it

I was verifying a refactor in a **git worktree** (branch isolated from `main`), running the app via the project's `./dev.sh` and driving it with `agent-browser`. The project uses **deliberately fixed dev ports** (frontend 5417 / backend 8417, chosen to avoid sibling projects). The **main checkout** already had its own dev server running on those same ports. Two failures compounded:

1. **I smoked against the wrong database.** `./dev.sh` (default ports) ran `free_port` on 8417, which killed the main backend's worker — but its `uvicorn --reload` parent respawned it. Net result: my worktree **frontend** (my code, port 5417) ended up proxying to **whichever backend held 8417** — the *other session's* backend + DB. My waveforms/playback rendered fine (correct code over the other session's data), so nothing looked wrong. The only tell was an API response listing a record (`ZZ-layerA-smoke`) that did **not exist in the DB I had copied into the worktree**. A UI drag during that smoke could have mutated the other session's real records.

2. **My isolation attempt killed the other session a second time.** I tried `FRONTEND_PORT=5418 BACKEND_PORT=8418 ./dev.sh`. That env override works in a **foreground** shell — but under **`run_in_background`** the inline `VAR=x cmd` prefix did **not** reach the launched process, so `dev.sh` fell back to 5417/8417 and `free_port` killed the main backend *again*, while I was actively trying to be careful.

## The signal

**A worktree is isolated in git, not in runtime.** Shared fixed ports + a shared host mean a parallel session's servers are right there to collide with. Before any worktree/parallel-session dev-run or smoke:

- **Isolate ports AND data.** Override to unused ports (this project: `FRONTEND_PORT`/`BACKEND_PORT`; the vite proxy reads `BACKEND_PORT`) and point at a copied DB. Never let a `free_port`/kill-the-listener launcher run against a port a *parallel session* owns — that's destructive to that session, not just to a stale process. If another session owns the shared port, **move yourself onto new ports; don't evict it.**
- **Pass env into a backgrounded launch via a wrapper script**, not an inline prefix. `printf 'export FRONTEND_PORT=5418 BACKEND_PORT=8418\nexec ./dev.sh\n' > run.sh` then background `bash run.sh`. Inline `VAR=x cmd` is not guaranteed to survive the background wrapper.
- **Verify which store you're actually hitting before trusting the smoke.** Query a record id that exists *only* in the worktree's copied DB. If the backend returns records you didn't put there, you're cross-wired — stop.

This sits one layer **below** the "use throwaway data, never mutate real records" rule: that rule assumes you know which store you're hitting. Here the isolation premise itself was false, so "I'm only touching my throwaway copy" was already wrong before any mutation.

## Evidence so far

- **Only case (2026-06-18, Crate audio-layer worktree)**: killed the main session's backend twice (once by default-port `free_port`, once because inline env didn't survive `run_in_background`); smoked Slice 1 against the other session's DB without noticing until an unexpected crate id surfaced in the API.

(One case → stays `raw`. Promote if a second parallel-session collision recurs, or fold into [[browser-verify-audio-canvas-app-gotchas]] / `references/browser-verify-gotchas.md` as the "isolate the runtime, not just the branch" gotcha — it belongs to the same browser-verify-environment family as [[browser-verify-teardown-is-the-skipped-half]].)
