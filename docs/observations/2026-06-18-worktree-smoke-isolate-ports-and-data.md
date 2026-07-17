---
date: 2026-06-18
status: raw
---

# Browser-smoking from a git worktree must isolate ports AND data first — fixed shared dev ports silently cross-wire to a parallel session, and `free_port`-style launchers kill it

> Source: this session — building an audio-layer refactor in a Crate git worktree, browser-smoking each slice while the main checkout's dev server was also running.

## What prompted it

I was verifying a refactor in a **git worktree** (branch isolated from `main`), running the app via the project's `./dev.sh` and driving it with `agent-browser`. The project uses **deliberately fixed dev ports** (one pair for frontend/backend, chosen to avoid sibling projects). The **main checkout** already had its own dev server running on those same ports. Two failures compounded:

1. **I smoked against the wrong database.** `./dev.sh` (default ports) ran `free_port` on the backend port, which killed the main backend's worker — but its `uvicorn --reload` parent respawned it. Net result: my worktree **frontend** (my code, its own fixed port) ended up proxying to **whichever backend held the shared port** — the *other session's* backend + DB. My waveforms/playback rendered fine (correct code over the other session's data), so nothing looked wrong. The only tell was an API response listing a smoke-test record that did **not exist in the DB I had copied into the worktree**. A UI drag during that smoke could have mutated the other session's real records.

2. **My isolation attempt killed the other session twice more — the documented port override silently doesn't work.** I tried overriding both port env vars, then a wrapper script that exported the vars before launching. Both still ran on the default ports and `free_port`-killed the main backend again. Root cause: `dev.sh` does `set -a; source dev.config; set +a` near the top, and the **tracked** `dev.config` hardcodes the same default ports — so the source **clobbers any env override**, even an exported one. The file's own comment documenting the override as a working escape hatch is therefore a lie: a sourced config with `set -a` wins over the environment. My first diagnosis (that `run_in_background` ate the inline env) was wrong; the override never had a chance regardless of how I passed it.

## The signal

**A worktree is isolated in git, not in runtime.** Shared fixed ports + a shared host mean a parallel session's servers are right there to collide with. Before any worktree/parallel-session dev-run or smoke:

- **Isolate ports AND data.** Override to unused ports (this project: `FRONTEND_PORT`/`BACKEND_PORT`; the vite proxy reads `BACKEND_PORT`) and point at a copied DB. Never let a `free_port`/kill-the-listener launcher run against a port a *parallel session* owns — that's destructive to that session, not just to a stale process. If another session owns the shared port, **move yourself onto new ports; don't evict it.**
- **Don't trust a project launcher's documented env override — verify it actually took.** A launcher that `source`s a config with `set -a` (a tracked `dev.config` here) will clobber your `FRONTEND_PORT=…` env, so the override silently no-ops. Read the launcher's own startup line ("Backend: …:PORT") and confirm the port before trusting it. When in doubt, **bypass the launcher entirely**: start the servers directly with explicit flags on a fresh, unused port pair — no `source`, no `free_port`, nothing that can touch the shared ports.
- **Verify which store you're actually hitting before trusting the smoke.** Query a record id that exists *only* in the worktree's copied DB. If the backend returns records you didn't put there, you're cross-wired — stop.
- **Verify which CODE you're running too, not just which data.** The collision cuts both ways: a sibling worktree can own the **frontend** port while you own the backend, so you're smoking *their* UI against *your* API. Check the port owner's working directory — `lsof -a -p "$(lsof -ti tcp:<port> -sTCP:LISTEN)" -d cwd` — and confirm the cwd is YOUR worktree, not a sibling's. A sibling frontend over your backend makes a unit-green feature *look broken* in the browser (missing menu items, a new component that never renders, a blank page) with **no error and no failing test** — the most expensive failure mode, because nothing points at the real cause.

This sits one layer **below** the "use throwaway data, never mutate real records" rule: that rule assumes you know which store you're hitting. Here the isolation premise itself was false, so "I'm only touching my throwaway copy" was already wrong before any mutation.

## Evidence so far

- **First case (2026-06-18, Crate audio-layer worktree)**: killed the main session's backend **three times** — once by default-port `free_port`, then twice more because the documented port-override env vars are clobbered by `dev.sh`'s `set -a; source dev.config` (tracked, hardcoding the shared default ports). Smoked a work-in-progress slice against the other session's DB without noticing until an unexpected record id surfaced in the API. The fix that finally held: bypass `dev.sh`, launch uvicorn/vite directly on a fresh, unused port pair.
- **Second case (2026-06-18, a sibling Crate worktree for a different in-flight slice — the OTHER side of the same collision, independently)**: the *inverse* failure mode. I restarted the backend from my worktree so I owned the backend port, but the running **frontend** on the shared frontend port was still the *sibling* worktree's — so I was smoking *their* UI against *my* API: a code mismatch, not a data one. A typecheck-green, fully-unit-green feature looked **broken** in the browser — a right-click menu was missing a new item, a new UI element never rendered, and once the page went fully blank — none of it a real bug, all of it the sibling's older frontend. Burned a long stretch debugging my own (correct) code before `lsof -a -p "$(lsof -ti tcp:<port> -sTCP:LISTEN)" -d cwd` revealed the frontend port was owned by the sibling worktree's directory. (Also re-confirmed the launcher trap: my port-override env vars no-op'd and `free_port`-killed the sibling's servers again — same `dev.config` clobber as case 1.) The moment the running frontend AND backend were both my worktree, the feature worked first try.

(Two independent cases now — the trip-wire fired. Strong candidate to graduate: fold into [[browser-verify-audio-canvas-app-gotchas]] / `references/browser-verify-gotchas.md` as the "isolate the runtime — verify which code AND which data, not just which branch" gotcha, same browser-verify-environment family as [[browser-verify-teardown-is-the-skipped-half]] / [[browser-verify-slot-hardening]].)
