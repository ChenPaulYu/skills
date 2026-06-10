# Archetype: fullstack-web — uv/FastAPI backend + React/Vite frontend monorepo

> Distilled 2026-06-10 from three live scaffolds; **exemplars(ground these, don't trust prose): crate**(`rytho-ai/crate` — mature)**· trackmate**(`rytho-ai/trackmate` — cleanest minimal baseline, commits `c44c423` scaffold + `46ef843` audiorective). Stack rulings come from `../stack-principles.md` — this file is composition, glue, gotchas, and the verification chain.

## Composition

```
<project>/
├── dev.sh / dev.config      single dev entry: free stale ports → uvicorn(bg) + vite(fg)
├── backend/                 uv · FastAPI · Python ≥3.13
│   ├── app/{__init__,main,config}.py + routers/ services/ models/(empty pkgs)
│   ├── tests/test_health.py(httpx ASGITransport — no live server needed)
│   └── pyproject.toml(deps + dev group + pytest/ruff config)
├── frontend/                React 19 · Vite 7 · TS strict · Tailwind 4 · pnpm
│   ├── vite.config.ts · tsconfig.json · index.html · pnpm-workspace.yaml
│   └── src/{main.tsx, App.tsx, index.css, vite-env.d.ts}
├── docs/{core, blueprints/{thoughts,plans,mockups}}
├── .gitignore · README.md
```

## Glue contracts(the parts that must agree with each other)

- **dev.sh**: sources `dev.config`(FRONTEND_PORT/BACKEND_PORT from the registry)→ `free_port` both(lsof + kill, escalate -9)→ uvicorn on `127.0.0.1:$BACKEND_PORT --reload` in background with EXIT/INT/TERM trap → vite foreground `--strictPort`. Exports `BACKEND_PORT` because vite.config reads it.
- **vite.config.ts**: proxy `/api` **and** `/audio` → `http://127.0.0.1:${BACKEND_PORT}`(same-origin app, relative audio URLs resolve)· `@` alias → `./src`.
- **main.py**: lifespan creates data dirs · CORS `allow_origin_regex: http://localhost:\d+`(dev; prod locks to `frontend_origin`)· `/api/health` · StaticFiles mount `/audio`(ensure dir exists at mount time, not just lifespan).
- **Audio(when the product is audio-native)**: `@audiorective/core` + `@audiorective/react`; engine root at `src/audio/engine.ts`(createEngine + createEngineContext, autoStart)· processors own all audio logic(see stack-principles).

## Gotchas(all field-hit; check each on every run)

1. **pnpm ≥11 blocks postinstall scripts** → `frontend/pnpm-workspace.yaml`: `allowBuilds: esbuild`(else install exits 1 / ERR_PNPM_IGNORED_BUILDS).
2. **pytest can't import `app`** → `[tool.pytest.ini_options] pythonpath = ["."]`(crate solves it by self-installing the package; this is the lighter fix).
3. **vite proxy target must be literal `127.0.0.1`**, never `localhost` — Node resolves ::1 first and misses the IPv4-bound backend(symptom: proxy ECONNREFUSED/500).
4. **tsconfig `include` must NOT contain `vite.config.ts`** — else typecheck demands `@types/node`(crate convention: include `["src"]` only).
5. **audiorective + useValue type-trap**: `useValue(engine.core.state)` resolves `T = void`(SignalAccessor's write overload); wrap as a pure-read computed — `useValue(() => engine.core.state())`.

## Preflight(this archetype)

`uv` · `node` + `pnpm` · **`agent-browser` CLI**(`which agent-browser`; install `npm i -g agent-browser && agent-browser install`)**+ skill**(`npx skills add vercel-labs/agent-browser`)— the browser leg of the chain depends on it.

## Verification chain(done = all green, in order)

1. `cd backend && uv sync && uv run pytest` — ASGI health test passes.
2. `cd frontend && pnpm install && pnpm typecheck && pnpm build && pnpm lint && pnpm test`.
3. `./dev.sh` for real(background it; sleep for boot).
4. `curl http://127.0.0.1:$BACKEND_PORT/api/health` **and** `curl http://localhost:$FRONTEND_PORT/api/health` — the second proves the proxy(the leg unit-green misses).
5. Browser: open the frontend, click-test the smoke interactions, **screenshot**; for audio — a click must flip engine state to `running`(gesture-gated autoStart).
6. **Teardown**: close the browser, kill both ports. An unclosed headless browser burns a core silently.

## Per-project adaptation checklist

Name(pyproject `name`/`description`, package.json, README, dev.sh echo)· **fresh port pair → append to the registry in stack-principles** · project-specific deps only(baseline stays lean; agent-sdk/anthropic etc. land with their feature)· smoke screen carries the product's brand mark(it becomes the first visual identity check).
