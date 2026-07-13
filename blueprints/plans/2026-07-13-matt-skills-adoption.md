# mattpocock/skills 優點融入本 marketplace — 計畫

> **⚠️ 已歸化**（2026-07-13 同日）：本檔＋同日兩篇 thought（dispatch-tiers、park 裁決）已合併為可由 Sonnet 執行的 `blueprints/plans/2026-07-13-sonnet-exec-batch.md`——**執行以該檔為準**，本檔僅存 Stage 1 接地事實與 Stage 2 問答備查。
>
> **Generated**: 2026-07-13 · **Spec source**: 本日 session 的雙 agent 比較調研（mattpocock/skills 深讀 + 本 repo 盤點）· **Stage 1**: fresh（沿用調研 agent 的盤點 + 本 session 補測）
> **狀態**: 已與 Paul 完成 Stage 2 對齊（範圍三選、試點策略、理論落腳）；Phase 1 依賴 fable-rethink batch W2 thought 的拍板。
> **與既有計畫的關係**: `blueprints/plans/2026-07-13-fable-rethink-skills-batch.md` 的 W2（authoring 詞彙表 thought）是本計畫 Phase 1 的上半場——W2 產出提案文件，本計畫負責拍板後的**落地**。不重複、不衝突。

## Context

本日調研結論：mattpocock/skills（16.7 萬星、單一作者高頻維護）與本 repo 在哲學上高度趨同（同尊 Ousterhout deep module、同有 grill／handoff／invocation 二分），但互補處明確——他有一套**成文的 skill 寫作理論**（writing-great-skills：leading words、六種失敗模式、雙負載模型），本 repo 有他完全沒有的**機械化治理**（validator + pre-commit + 生成鏡像）。本計畫把他理論側的三件優點收進來，治理側維持我們的做法。

接地事實（2026-07-13 實測）：

- 34 個 skill 的 frontmatter description 共 **22,272 字元**常駐 context（中位數 641、最長 `frame:analogize` 974）。Codex sidecar（`platforms/codex/descriptions.json`）已存在 34 條 ~240 字元壓縮版——瘦身版已有雛形，只是 Claude 端未受益。
- **6 個 skill 已是 user-invoked**（`disable-model-invocation: true`）：`reflect:catchup/observe/summarize`、`shape:build`、`shape:setup`、`nav:refactor`——模型不會讀它們的觸發句清單來觸發，清單是純死重量。
- Anti-pattern 表現行為兩欄（Temptation │ Why to refuse）。W2 thought 已從 Negation 教義獨立推出「缺第三欄把『改做什麼』變成必填」；本日調研補上另一面：「the tell」（怎麼**發現**自己正在犯）。同一個洞的兩面，一次補。
- `blueprints/thoughts/2026-07-13-authoring-vocabulary-prose-failure-modes.md`（W2）已把六詞逐一對照到本 repo 一手實例，狀態「提案，待拍板」。
- ADR 現到 064；`nav` v0.8.1、`frame` v0.5.0。
- 本 session 實證：advisor tool 整場 unavailable（session 綁定、中途不可修）→ 衍生 Rider R1。

意圖一句話：**把 Matt 的寫作理論收為本 repo 的成文慣例（有 owner、有指認詞彙），用試點驗證 description 減重，並建立「拒絕過什麼」的機構記憶。**

## Resolved questions（Stage 2）

| 問題 | Paul 的回答 |
|---|---|
| 納入範圍？ | 寫作理論三件組 ＋ Description 減重 ＋ Out-of-scope 拒絕知識庫（生命週期分層與 router **不做**） |
| Description 減重策略？ | 先試點一個 plugin，實測觸發準確度後再決定全面推 |
| 寫作理論落腳？ | root CLAUDE.md 精簡條目 ＋ `nav:compose` references/ 詳文（rule ② 漸進揭露） |
| advisor 模式該依賴嗎？（session 中補問） | 不依賴——收斂為 Rider R1 的軟依賴條款 |

## Open questions

- **W2 thought 尚待拍板** — Phase 1 的前置。若 W2 被退回，Phase 1 改以 ADR-065 重議落點，不自動執行。
- **第三欄的形狀** — 「Instead（改做什麼）」與「Tell（怎麼發現）」是兩種資訊：合成一欄（`Instead / tell`）還是只加 Instead、Tell 進 Why 欄尾？在 ADR-065 起草時與 Paul 定案，不在本計畫預決。
- **試點中文觸發句去留** — 減重後每個 skill 保留幾句中文觸發句（現況：`frame:analogize` 有「用比喻解釋」「打個比方」「說白話一點」三句）？由試點量測結果回答，不預決。

## Approach

三個 Phase 互相獨立（P1 等拍板；P2、P3 隨時可起跑，可平行）。每個 Phase 收在自己的 commit（們）裡，逐 commit 綠 validator。

### Phase 1 — 寫作理論落地（graduate W2 ＋ the tell）

1. **建 owner 檔** `plugins/nav/skills/compose/references/authoring-failure-modes.md`（compose 現無 references/，新建）：六失敗模式（Premature Completion / Negation / No-Op / Sediment / Sprawl / Duplication）＋ Leading Word ＋ Completion Criterion。每詞四件事：定義（轉述）、本 repo 一手實例（自 W2 thought 搬入）、**the tell**（可觀察的現形訊號）、藥方。Stack-neutral、self-contained、路徑一律 skills-root-relative。來源標註 mattpocock/skills（沿 ADR-001 的血緣敘事）。
2. **root CLAUDE.md 加精簡條目**：Authoring conventions 加一小節——每詞**一行**（詞 ＋ 一句白話定義）＋ 一個指向 references 詳文的連結。CLAUDE.md 不是 owner，只是索引（rule ①＋②）。
3. **`nav:compose` SKILL.md** 加一行指引：撰寫 skill prose 時按需載入該 references 檔。
4. **Anti-pattern 表格式演進**：依 ADR-065 定案的欄形，先只規範「**新表、與本次被觸碰的表**」採用新格式；34 檔全面 sweep 列為 optional 後續（機械掃，適合 sonnet 子代理），不擋本 Phase。
5. **ADR-065**：收養寫作理論——來源、決定（owner 位置、欄形定案、sweep 策略）、與 W2 thought 的 graduation 關係。
6. **W2 thought graduation 標記**（沿 `/shape:reconcile` 慣例，thought 頂部標 graduated → 指向 ADR-065 與 owner 檔）。
7. **Ripple**：nav 版本 bump 0.8.1→0.8.2 → `node scripts/build-manifests.mjs` → 站點地圖雙語版本 token ＋ rev bump ＋ FIXED 條目 → `node scripts/build-codex.mjs`（root CLAUDE.md 變更流入 AGENTS.md）→ `node scripts/validate-codex-skills.mjs` 綠。

### Phase 2 — Description 減重試點（frame plugin，5 skills）

1. **ADR-066**：引入雙負載模型（model-invoked 付 context load；user-invoked 付 cognitive load），修訂「broad but honest」→「**lean but honest**」：leading word 前置、一個分支一句觸發、不堆同義詞、**user-invoked skill 的 description 不放觸發句清單**（人臉描述即可）。載明試點範圍與量測法。
2. **建基線觸發矩陣**（改動前）：frame 5 skills × 各 3 句觸發語（2 英 1 中，取自現行 description 的引號句），記錄現行路由正確性。基線與方法存 `docs/findings/2026-07-13-description-diet-pilot.md`。
3. **重寫 frame 5 個 description**：以 Codex sidecar 240 字元版為起點擴寫（不是從 974 字元版刪減——方向決定成品形狀）；保留 NOT/vs 邊界句（消歧義是 load-bearing，Matt 的 one-trigger-per-branch 教義也支持留）；每 skill 保留 1-2 句最高頻中文觸發句。目標：frame 總 description 字元數 **≥40% 減幅**（現況約 3.5k）。
4. **重跑觸發矩陣**：任何一句路由退步 → 修該句或回滾該 skill 的重寫；結果補進 findings 檔。
5. **（optional rider）6 個 user-invoked skill 刪觸發句清單**：零觸發風險（模型不讀），但波及 reflect/shape/nav 三個 plugin 的版本 bump 與站點地圖 token——執行時問 Paul 是否搭車或另開 commit。
6. **Ripple**：frame 版本 bump 0.5.0→0.5.1 → build-manifests → 站點地圖雙語 token ＋ rev → build-codex → validator 綠 → `git status README.md docs/site/index.html` 檢查（frame 各 skill 的 README 一行說明如有實質改變需同步；sidecar `descriptions.json` 是否與新 Claude 版收斂為同文，執行時判斷、不強制）。
7. **試點結論寫入 findings 檔**：全面推 34 個與否是**下一個 session 的決定**，不在本計畫內。

### Phase 3 — Out-of-scope 拒絕知識庫

1. **建 `docs/out-of-scope/README.md`**：格式規範——一檔一拒絕：被拒的提案 · 理由 · 來源（issue / ADR / session 引用）· 日期。**deferral ≠ rejection**：延後的事項不進來（例：本計畫的生命週期分層是 deferred，不是 rejected）。
2. **種子條目 2-3 個**：自既有 ADR / observations 挖真實拒絕案（候選：「skill 互相 invoke」的硬性拒絕、ADR-021 nav-doctor 的退役理由中被拒的替代案、ADR-009 砍規則時被拒的保留案）。執行時核對原 ADR 逐字，不憑記憶。
3. **接上消費端**：root CLAUDE.md 的「New skill」維護規則加一句「先查 `docs/out-of-scope/`，別重提已拒案」。（未來 `/shape:elicit`、`/reflect:observe` 是否也讀它，列 optional 後續，不在本計畫。）
4. **ADR-067** ＋ **Ripple**：build-codex（root CLAUDE.md → AGENTS.md）→ validator 綠。

### Rider R1 — advisor 軟依賴條款（amendment，非本計畫的 phase）

`blueprints/thoughts/2026-07-13-rule7-second-door-advisor-escalation.md`（屬 fable-rethink plan 管轄）補一節「軟依賴條款」：advisor 是 escalation 的**優先門，不是必經步驟**；不得假設 mid-session 可修復；fallback 永遠是 rule ⑦ 原始行為（問使用者）——與 shape 的 browser-verify capability-slot 同款設計。附本日一手實證：本 session advisor 整場 unavailable。amendment 語氣，不重寫該 thought。

## Critical files

| File | 為什麼重要 ＋ 改什麼 | Phase |
|---|---|---|
| `plugins/nav/skills/compose/references/authoring-failure-modes.md` | 新建；寫作理論的唯一 owner | P1.1 |
| `CLAUDE.md`（root） | 加詞彙索引小節（P1.2）＋ out-of-scope 查核句（P3.3） | P1 / P3 |
| `plugins/nav/skills/compose/SKILL.md` | 加 references 指引一行 | P1.3 |
| `docs/adr/065·066·067-*.md` | 三個決定各一 ADR | P1 / P2 / P3 |
| `blueprints/thoughts/2026-07-13-authoring-vocabulary-prose-failure-modes.md` | graduation 標記 | P1.6 |
| `plugins/frame/skills/*/SKILL.md`（×5） | description 重寫 | P2.3 |
| `docs/findings/2026-07-13-description-diet-pilot.md` | 新建；試點基線 ＋ 結果 | P2.2/2.4 |
| `platforms/codex/descriptions.json` | 試點後可能與 Claude 版收斂 | P2.6 |
| `docs/out-of-scope/README.md` ＋ 種子條目 | 新建；拒絕知識庫 owner | P3.1-2 |
| `plugins/{nav,frame}/.claude-plugin/plugin.json` | 版本 bump（單一 owner，衍生檔用腳本再生） | P1.7 / P2.6 |
| `docs/site/index.html`、`README.md` | 硬閘門表面：版本 token（雙語）＋ rev ＋ 一行說明同步 | 各 Phase ripple |
| `blueprints/thoughts/2026-07-13-rule7-second-door-advisor-escalation.md` | R1 amendment | R1 |

## Single-source-of-truth owners

| 決定（會整批變動的知識） | Owner |
|---|---|
| 寫作理論詞彙（六失敗模式 ＋ leading word ＋ completion criterion） | `plugins/nav/skills/compose/references/authoring-failure-modes.md`；root CLAUDE.md 僅一行索引；plugin 檔一律引用詞條名，不重述定義 |
| description 撰寫慣例（lean but honest） | root CLAUDE.md 的 ★ Frontmatter description 條目（改寫現行條目，非另立）；ADR-066 記 rationale |
| 已拒絕的提案 | `docs/out-of-scope/` 一檔一案 |

**Adoption 檢查**（owner 要有 caller 才算落地）：P1 收尾時 `grep -rn "authoring-failure-modes" CLAUDE.md plugins/nav/skills/compose/SKILL.md` 須 ≥2 處命中；P3 收尾時 root CLAUDE.md 須含 `docs/out-of-scope/` 字串。

## Verification

1. **每 Phase 收尾**：`node scripts/validate-codex-skills.mjs` 印 `ok`（pre-commit hook 為後盾）；`git status docs/site/index.html README.md` 確認硬閘門表面已動（P1、P2 有版本 bump 必動站點地圖；P3 若 README 未動需說明為何無表面影響）。
2. **P1**：AGENTS.md 再生後含新慣例字樣；references 檔無 `./`/`../` 路徑、無來源專案 domain noun（W2 thought 的 tactus 案例引用保留其「跨 repo 印證」邊界標記）。
3. **P2**：觸發矩陣 15 句（5 skills × 3）改寫前後路由皆正確——**任一退步即該 skill 回滾**；frame description 總字元數減幅 ≥40%（`node` 一行腳本量測，量法同本計畫 Context 的基線）。
4. **P3**：種子條目每條含逐字來源引用（可 grep 到原 ADR 行）；「deferral ≠ rejection」規則寫進 README.md 格式節。
5. **End-to-end**:三 Phase 落完後跑一次 `/nav:audit`（Mode 1，健檢）確認 root CLAUDE.md 增重後仍過 rule ④ 門檻（現有 ~500 行守則），且無 rule ① 洩漏（詞彙定義只在 owner 檔出現一次）。

## Out of scope（本計畫刻意不做）

- **生命週期分層目錄**（in-progress/deprecated buckets）與 **router skill**——Paul 於 Stage 2 明確剔除；如未來重提，先讀本計畫與屆時的 `docs/out-of-scope/`（若屆時已判定為拒絕而非延後）。
- **34 skill 全面 description 減重**——等 P2 試點數據，另開 session 決定。
- **Anti-pattern 表 34 檔全面 sweep**——P1.4 列為 optional 機械後續。
- **Changesets 發布自動化**——比較報告已判定低收益，不採。
- **W2 thought 本體的拍板**——屬 fable-rethink plan 的既有流程，本計畫只等待、不代決。
