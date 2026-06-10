---
date: 2026-06-10
status: crystallized → plugins/shape/skills/setup (ADR-036, same day)
---

# `shape:setup` — archetype-driven project scaffolding with a three-layer knowledge base

> Source: TrackMate base setup (2026-06-10), the **third manual run** of the same scaffold (afterhours-dj → crate → trackmate). Design converged same-day across three volleys: (1) it's a skill, (2) Paul's reframe — archetype-driven, references accumulate, lives in shape, (3) extract the cross-archetype stack principles. Next consumer + evidence gate: Traversa setup.

## The three-layer design (the resolution of the "home" problem)

An earlier draft leaned toward an org plugin because the Rytho stack is opinionated and the marketplace is stack-neutral by charter. Paul's reframe dissolves this: **the engine is neutral; opinions live in references**.

```
SKILL.md(中立引擎)              判定專案屬性(問或推斷)→ 讀 principles → 讀屬性 reference
                                 → scaffold → preflight + 驗證鏈(按屬性)→ setup log
references/stack-principles.md   跨屬性不變量(per-concern tool rulings)— 每次 run 先讀
references/archetypes/<name>.md  屬性檔:組合與黏合 + 坑(fullstack-web 為首發)
```

- **Name = `setup`, not `init`** — shape has a documented "deliberately no init" razor (blueprints mkdir = structure-theatre; this skill's payload — archetype判定 + principles + gotchas + verification chain — is exactly the structure default scaffolding skips, so it passes the value-guardrail); `init` also collides with Claude Code's built-in. Home = **shape, build family** (a verified running scaffold is a new project's first running verified code; `build` makes plan items real, `setup` lays the ground build stands on).
- **Accumulation loop = the 晉升 pattern again** (4th appearance: 材料入池 · commit 入史 · UI 入 device · **setup log 入 archetype 庫**): new archetype → no reference → do it live against an exemplar → land a setup log → repeats + Paul's nod → graduates into `references/archetypes/<name>.md`; later runs ground the reference and write deltas back. New *principles* graduate the same way (a ruling recurring across two projects → nod → into stack-principles).

## Stack principles draft (Paul's extraction request, pending his strike/confirm)

**確定級(Paul 親口):** Python → **uv** (never pip/poetry/conda) · frontend → **React + pnpm** (never npm/yarn) · web audio → **audiorective** (audio logic lives on AudioProcessor only) · fullstack → **monorepo `backend/ + frontend/ + dev.sh`** (never two repos) · agent reasoning → **rented Claude** (claude-agent-sdk/anthropic, swappable via MCP — portfolio invariant).

**慣例級(crate+trackmate 雙實證,待點頭):** Python ≥3.13 · FastAPI + uvicorn · pytest(+asyncio, httpx ASGI)+ ruff(line 100) · Vite + TS strict + Tailwind v4(@tailwindcss/vite)+ vitest + oxlint + prettier · config 慣例:**committed defaults in config.py, `.env` = secrets only** · backend 形狀 `app/{main,config}.py + routers/services/models` · sqlite(aiosqlite)+ structlog · **每專案一組獨立 uncommon port 對**(crate 5417/8417 · trackmate 5420/8420;需要登記處防撞)。

**流程級:** **setup 完成 = 驗證鏈全綠**(不是檔案寫完)· preflight 按屬性 · 一階段一 commit · docs 樹同步開(`docs/core` + `docs/blueprints/{thoughts,plans,mockups}`)。

**Docs / git / .gitignore 傳統(Paul 確認,2026-06-10):**

- **Docs 樹**:`docs/core/` = canon(user-ratified、self-contained、principle-wise)· `docs/blueprints/{thoughts,plans,mockups}`(+ 成熟後的 `decisions.md`)。thoughts 命名 `YYYY-MM-DD-kebab.md` 帶狀態 blockquote;mockups 命名 `YYYY-MM-DD-topic/`,單檔自足 HTML,頂部註解(what/candidates/**pick**)。每份文件 progressive disclosure(head 可讀)。
- **⚠ 鐵律:`docs/blueprints/` 整棵(含 mockups)絕不進 .gitignore**(Paul 強調「這個很重要」)。理由:mockups 載著 Pick 記錄與定稿樣本(canon 會連結它們——design.md 指向 master mockup),ignore 等於讓 canon 連向不存在的檔案、讓視覺決策史只活在單一硬碟上。**已發現的實害:crate `.gitignore:47` 的 `mockups/`(無前導斜線)誤殺了 `docs/blueprints/mockups/` — 65 個 mockup 資料夾全部 untracked**,已修(crate `6e7535a`:root-scoped `/mockups/` + 176 檔 commit)。若要 ignore 散落的 scratch mockups,pattern 必須鎖根(`/mockups/`),且 blueprints 樹永遠豁免。
- ~~這條與 shape:mockup skill 的文件預設衝突~~ → **已裁並改畢(同日)**:skill 預設翻轉為 committed-in-blueprints(mockup SKILL.md + align blueprints-spec + site rev 38 同步);crate 的誤殺已修(root-scoped `/mockups/` + 176 檔 commit)。
- **.gitignore 該擋的**:OS/編輯器渣 · `.env*` · build 產物(node_modules/dist/.venv/__pycache__)· 執行期資料(`backend/data/`)· agent 工作渣(`.claude/`、`.agents/`、screenshots、dogfood-output)。**docs/ 永遠全部進 git。**
- **Git 傳統**:conventional commits(feat/chore/docs + scope)、詳細 body、一階段一 commit、里程碑式顯式 commit;push 由 Paul 指示。

## Payload from the live run (what files alone don't carry)

1. **Preflight tool check** — verify the toolchain the chain depends on before scaffolding: `uv` · `pnpm`/`node` · **`agent-browser` CLI**(`which agent-browser`; install `npm i -g agent-browser && agent-browser install`)**+ agent-browser skill**(`npx skills add vercel-labs/agent-browser`)— archetype-scoped (CLI projects don't need the browser leg). Fail-helpfully 3-way (install [recommended] / proceed flagged / skip), never silent.
2. **Gotchas, all hit live (→ fullstack-web.md):** pnpm 11 blocks postinstall → `pnpm-workspace.yaml: allowBuilds: esbuild` · pytest can't import `app` → `pythonpath=["."]` · vite proxy target literal `127.0.0.1` (Node tries ::1 first → ECONNREFUSED/500) · tsconfig include must exclude vite.config.ts (else @types/node) · audiorective: `useValue(engine.core.state)` needs a pure-read computed wrap (SignalAccessor's write overload resolves T to void).
3. **Verification chain (archetype-parameterized)** — the structure default "scaffold and declare done" skips: fullstack-web = `uv sync && pytest` → `pnpm typecheck/build/lint/test` → `./dev.sh` for real → `curl /api/health` direct AND via vite proxy → browser click-test + screenshot → teardown ports. The proxy curl + browser click are the two steps unit-green misses. CLI = `--help` + smoke command; lib = tests + build.

## Build list — ✅ built (same day, ADR-036)

`plugins/shape/skills/setup/SKILL.md`(中立引擎)+ `references/stack-principles.md` + `references/archetypes/fullstack-web.md`(蒸餾自 trackmate+crate)+ ADR-036(setup verb:三層設計、no-init razor 的區辨、晉升迴圈)+ shape CLAUDE.md/manifests/site rev。First field run = Traversa.

## Related

`2026-06-10-position-verb-canon-campaign.md`(同款 graduation 機制)· shape CLAUDE.md "no init" razor · ADR-018(evidence gate)· ADR-034(value-guardrail:skill 必須強迫預設跳過的結構)。
