# Stack principles — the maintainer's per-concern rulings(讀我:每次 setup run 的第一份文件)

> **This file is the opinionated layer** — the maintainer's (Paul's) accumulated tool rulings, extracted 2026-06-10 from three live scaffolds (afterhours-dj · crate · trackmate). Fork/replace with your own; the engine (SKILL.md) never assumes these. New rulings graduate in when they recur across two projects and the user signs off.

## 確定級 — user-stated, non-negotiable

| Concern | Ruling | Never |
|---|---|---|
| Python | **uv** | pip / poetry / conda |
| Frontend | **React + pnpm** | npm / yarn |
| Web audio | **audiorective** — audio logic lives on `AudioProcessor` subclasses only; UI stays thin | scheduling in components |
| Fullstack project | **monorepo: `backend/ + frontend/ + dev.sh`** | two repos |
| Agent reasoning | **rented Claude** (claude-agent-sdk / anthropic), swappable via MCP | building an own reasoning engine (portfolio invariant) |

## 慣例級 — twice-evidenced defaults (crate + trackmate)

- Python ≥3.13 · **FastAPI + uvicorn** for web backends · pytest(+pytest-asyncio, httpx ASGI transport tests)· ruff, line-length 100.
- **Vite · TypeScript strict · Tailwind v4**(`@tailwindcss/vite`)· vitest · oxlint · prettier.
- **Config convention:** committed defaults live in `app/config.py`(pydantic-settings);`.env` = **secrets only**, gitignored.
- Backend shape: `app/{main,config}.py` + `routers/ services/ models/` packages.
- Default storage: sqlite(aiosqlite)· logging: structlog.
- sqlite/structlog/etc. are *defaults*, not laws — deviate with a surfaced reason.

## Port registry — one fresh uncommon pair per project, never reuse

| Project | Frontend | Backend |
|---|---|---|
| crate | 5417 | 8417 |
| trackmate | 5420 | 8420 |
| *(next project: take a fresh pair, append here)* | | |

## 流程級 — how a setup behaves

- **Done = verification chain green**, each leg reported(skipped legs surfaced, never silent).
- Preflight per archetype; fail-helpfully 3-way on missing tools.
- **One commit per stage**(scaffold · each major wiring), conventional commits(`feat/chore/docs(scope): …`)with substantive bodies; pushes on the user's word.
- Docs tree opens with the project: `docs/core/`(canon — authored later by `shape-position`)+ `docs/blueprints/{thoughts,plans,mockups}`.

## Docs / git / .gitignore 傳統

- `docs/core/` = canon: user-ratified · principle-altitude · self-contained. `docs/blueprints/thoughts/` = `YYYY-MM-DD-kebab.md` with a status blockquote; `mockups/` = `YYYY-MM-DD-topic/` self-contained HTML with a top comment(what / candidates / **Pick**). Progressive disclosure everywhere(head-readable).
- **⚠ Iron rule: `docs/blueprints/` — including `mockups/` — is NEVER gitignored.** Mockups carry Pick logs and ratified samples; canon links into them. Untracked = single-disk decision record + dead links on clone. Field case: a depth-unanchored `mockups/` pattern silently swallowed a repo's entire `docs/blueprints/mockups/`(65 folders). Scratch mockups at repo root may stay local via a **root-scoped** `/mockups/`.
- .gitignore covers: OS/editor junk · `.env*` · build artifacts(node_modules / dist / .venv / __pycache__)· runtime data(`backend/data/`)· agent workspace junk(`.claude/`, `.agents/`, screenshots/, dogfood-output/). **`docs/` goes to git in full, always.**
