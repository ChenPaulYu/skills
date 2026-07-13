# Stack principles — the maintainer's per-concern rulings(讀我:每次 setup run 的第一份文件)

> **This file is the opinionated layer** — a maintainer's accumulated tool rulings, distilled from their own live scaffolds. **It ships as a worked EXAMPLE, not a default to inherit — fork/replace every ruling with your own.** The engine (SKILL.md) never assumes these. **No specific app's data (project names, ports, private repos) is presupposed here** — those are *yours* and live in your fork / your projects, never shipped. New rulings graduate in when they recur across two of your projects and you sign off.

## 確定級 — user-stated, non-negotiable

| Concern | Ruling | Never |
|---|---|---|
| Python | **uv** | pip / poetry / conda |
| Frontend | **React + pnpm** | npm / yarn |
| Web audio | **a reactive web-audio lib** (maintainer's pick: `audiorective`) — audio logic lives on processor subclasses only; UI stays thin | scheduling in components |
| Fullstack project | **monorepo: `backend/ + frontend/ + dev.sh`** | two repos |
| Agent reasoning | **rented Claude** (claude-agent-sdk / anthropic), swappable via MCP | building an own reasoning engine (portfolio invariant) |
| Communication | converse in **Traditional Chinese (Taiwanese phrasing)**, plain + analogy-led; code / identifiers / commit messages in English | monolingual-English chat by default |
| Blueprints human render | **`plan.md` alone is the maintained board, always — no standing HTML file, ever.** A visual view, when wanted, renders fresh via `/shape:mockup` (disposable, on-demand) — never a file `setup`/`align` scaffolds, maintains, or regenerates. | maintaining/regenerating a standing `overview.html`, or asking whether to |

## 慣例級 — twice-evidenced defaults (recurred across the maintainer's scaffolds)

- Python ≥3.13 · **FastAPI + uvicorn** for web backends · pytest(+pytest-asyncio, httpx ASGI transport tests)· ruff, line-length 100.
- **Vite · TypeScript strict · Tailwind v4**(`@tailwindcss/vite`)· vitest · oxlint · prettier.
- **Config convention:** committed defaults live in `app/config.py`(pydantic-settings);`.env` = **secrets only**, gitignored.
- Backend shape: `app/{main,config}.py` + `routers/ services/ models/` packages.
- Default storage: sqlite(aiosqlite)· logging: structlog.
- sqlite/structlog/etc. are *defaults*, not laws — deviate with a surfaced reason.

## Port registry — one fresh uncommon pair per project, never reuse

**This ships EMPTY — port allocations are *your* app data, not a shipped default.** When you scaffold, pick a fresh uncommon pair (away from the crowded `5173` / `3000` / `8000` ranges) that none of your existing projects already use — the authoritative record is each project's own `dev.config`, so check those rather than relying on a central list. If *you* want a central tally, keep it in your fork (a local, untracked note), never in the shipped skill.

| Project | Frontend | Backend |
|---|---|---|
| *(your projects — your fork's local record, shipped empty)* | | |

## 流程級 — how a setup behaves

- **Done = verification chain green**, each leg reported(skipped legs surfaced, never silent).
- Preflight per archetype; fail-helpfully 3-way on missing tools.
- **One commit per stage**(scaffold · each major wiring), conventional commits(`feat/chore/docs(scope): …`)with substantive bodies; pushes on the user's word.
- Docs tree opens with the project: `docs/core/`(canon — authored later by `/shape:position`)+ `docs/blueprints/{thoughts,plans,mockups}`.
- **Born primed** — every new project gets the workflow-priming layer at birth (setup step 5): a `CLAUDE.md` `## Dev workflow` block (verbs + standing pointers + the Communication ruling above) **plus** the `docs/blueprints/` tree, always scaffolded with `plan.md` as its only standing board (per the Blueprints-human-render ruling above — a visual view renders on demand via `/shape:mockup`, never pre-scaffolded). Materialized from align's templates so setup and align can't drift. Grounded plans live at `docs/blueprints/plans/` — one canonical location, so a project never half-adopts (nav output one place, board another).

## Docs / git / .gitignore 傳統

- `docs/core/` = canon: user-ratified · principle-altitude · self-contained. `docs/blueprints/thoughts/` = `YYYY-MM-DD-kebab.md` with a status blockquote; `mockups/` = `YYYY-MM-DD-topic/` self-contained HTML with a top comment(what / candidates / **Pick**). Progressive disclosure everywhere(head-readable).
- **⚠ Iron rule: `docs/blueprints/` — including `mockups/` — is NEVER gitignored.** Mockups carry Pick logs and ratified samples; canon links into them. Untracked = single-disk decision record + dead links on clone. Field case: a depth-unanchored `mockups/` pattern silently swallowed a repo's entire `docs/blueprints/mockups/`(65 folders). Scratch mockups at repo root may stay local via a **root-scoped** `/mockups/`.
- .gitignore covers: OS/editor junk · `.env*` · build artifacts(node_modules / dist / .venv / __pycache__)· runtime data(`backend/data/`)· agent workspace junk(`.claude/`, `.agents/`, screenshots/, dogfood-output/). **`docs/` goes to git in full, always.**
