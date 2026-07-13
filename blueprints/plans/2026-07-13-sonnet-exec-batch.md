# Sonnet 執行批次 — matt skills 優點落地 ＋ 派工分層 ＋ park

> **Generated**: 2026-07-13 · **設計**: Fable（session 強腦）· **執行**: Sonnet（cheap tier）· **驗收**: Fable/Paul
> **來源（單一 owner，本檔只引用不重抄）**:
> ① `blueprints/plans/2026-07-13-matt-skills-adoption.md`（已歸化進本檔，該檔僅存檔備查）
> ② `blueprints/thoughts/2026-07-13-dispatch-tiers-consultant-seat.md`（派工分層＋顧問席，本 session Paul 逐 fork 拍板）
> ③ `blueprints/thoughts/2026-07-13-reflect-park-writes-the-handoff.md`（park，含已裁決的存放位置與家族歸屬）
> ④ `blueprints/thoughts/2026-07-13-authoring-vocabulary-prose-failure-modes.md`（W2 詞彙表，屬 fable-rethink batch）
> **狀態**: P2/P3/P4 隨時可執行；P1 等 W2 拍板、P5 等 park 拍板（見 Gate 表）。

## 執行契約（Sonnet 執行者必讀，逐條遵守）

本計畫本身就是「派工分層」原則的實例：計畫與驗收在強腦，你負責執行。因此：

1. **STOP 規則（rule ⑦）**：任一步驟你的信心 <90%、或指令與 repo 現況矛盾（檔案不存在、行號對不上、validator 紅）→ **停下，回報卡點，不要即興發揮**。寧可停，不可猜。
2. **不 commit**：所有變更留在 working tree（新檔＝untracked、改檔＝unstaged），Paul 以 `git diff` 總審後自行 commit。你只保證 `node scripts/validate-codex-skills.mjs` 印 `ok`。
3. **每項有 Done 判準**：做完逐項核對，不合格不得宣稱完成（防 Premature Completion）。
4. **內容來源優先於自創**：凡標「內容取自 X」，去讀 X 原文搬運/改寫，不憑記憶重寫。
5. **★ 授權慣例**（root CLAUDE.md）：路徑一律 skills-root-relative（無 `./`、`../`）；範例 stack-neutral；不得洩漏來源專案 domain noun。
6. **回報格式**：每個 Phase 結束回報——改了哪些檔（路徑清單）、每項 Done 判準的核對結果、遇到的 STOP（若有）。回事實，不回感想。

### 收尾統一 Ripple（P6 執行一次，不要每 Phase 重複）

```bash
# 版本 bump 後：
node scripts/build-manifests.mjs        # 再生 cursor 投影 + marketplace 版本
node scripts/build-codex.mjs            # 再生 .agents/skills/ + AGENTS.md
node scripts/validate-codex-skills.mjs  # 必須印 ok，紅了就 STOP 回報
git status docs/site/index.html README.md   # 兩個硬閘門表面必須已修改
```

## Gate 表

| Gate | 內容 | 解鎖 |
|---|---|---|
| G0 | Paul `git diff` 拍板 fable-rethink batch（含 W2 詞彙表、park 等 thoughts） | P1、P5 |
| （無） | P2、P3、P4 的決定已在 2026-07-13 session 由 Paul 逐項拍板（來源②③與 matt-adoption plan 的 Resolved questions 表） | 隨時可跑 |

ADR 編號：執行時先 `ls docs/adr/ | sort | tail -5` 確認下一個空號，依 P1→P2→P3→P4→P5 順序遞增取號（下文以 065–069 佔位，以實查為準）。

---

## P1 — 寫作理論落地（等 G0）

1. **新建 owner 檔** `plugins/nav/skills/compose/references/authoring-failure-modes.md`：
   - 內容取自來源④的逐詞對照：六失敗模式（Premature Completion / Negation / No-Op / Sediment / Sprawl / Duplication）＋ Leading Word ＋ Completion Criterion。
   - 每詞四段：定義（轉述）· 本 repo 一手實例（照搬④的實例，保留其「跨 repo 印證」等邊界標記）· **the tell**（一句可觀察的現形訊號，④沒有的自行從定義推導並標「(derived)」）· 藥方。
   - 檔頭標來源：mattpocock/skills 的 writing-great-skills（沿 ADR-001 血緣敘事）。
2. **root `CLAUDE.md`**：Authoring conventions 區新增小節「★ Prose failure vocabulary」——每詞**恰一行**（詞名＋一句白話定義），末行連結 `plugins/nav/skills/compose/references/authoring-failure-modes.md`。不得展開定義（rule ①：owner 是 references 檔）。
3. **`plugins/nav/skills/compose/SKILL.md`**：適當位置加一行——撰寫/重構 skill prose 時按需載入上述 references 檔。
4. **ADR-065**：標題「adopt prose-failure vocabulary + the-tell column」。記：來源、owner 落點、W2 graduation、anti-pattern 表第三欄決定（**先只規範新表與被觸碰的表**加「The tell / Instead」欄；34 檔全面 sweep 列 optional 後續）。格式仿既有 ADR（Status/Date/Context/Decision/Why）。
5. **來源④ thought 頂部**加 graduation 標記：狀態行改「已 graduate → ADR-065 ＋ owner 檔路徑」。

**Done 判準**：references 檔存在且無 `./`/`../` 路徑；`grep -c "authoring-failure-modes" CLAUDE.md plugins/nav/skills/compose/SKILL.md` 各 ≥1；ADR 檔存在；④狀態行已改。

## P2 — Description 減重試點（frame 5 skills，免 Gate）

1. **ADR-066**：標題「description two-load convention — lean but honest（pilot: frame）」。記：雙負載模型（model-invoked 付 context load / user-invoked 付 cognitive load）、慣例修訂（leading word 前置、一分支一觸發句、不堆同義詞、user-invoked 不放觸發句清單）、試點範圍與量測法（下述）。
2. **root `CLAUDE.md`**：把 Authoring conventions 的「Frontmatter `description`」條目改寫為 lean-but-honest 版（原則一句＋指向 ADR-066）。保留「honest about scope」語意。
3. **基線矩陣**（改寫前做）：新建 `docs/findings/2026-07-13-description-diet-pilot.md`。對 frame 5 skills（`first-principles`/`orthogonal`/`dialectic`/`graft`/`analogize`），各從現行 description 抽 3 句代表觸發語（2 英 1 中），列表記錄。
4. **重寫 5 個 description**：以 `platforms/codex/descriptions.json` 對應條目為起點擴寫（**不是**從現行長版刪減）；必保留：NOT/vs 邊界句、每 skill 1–2 句最高頻中文觸發語（`analogize` 保「用比喻解釋」）；目標 frame 總 description 字元數 ≤ 現況 60%（量測：沿 matt-adoption plan Context 的 node 一行腳本法）。
5. **改寫後核對**：對基線矩陣每句做**線索保留檢查**——新 description 是否仍含該句的路由線索（同詞、同義 leading word、或明確分支句）。任一句無線索 → 修 description，不得刪基線句。結果寫回 findings 檔。**最終觸發 QA 標記為「待 Fable/Paul 驗收」——你只做線索保留檢查，不自行宣稱觸發無退步。**

**Done 判準**：findings 檔含基線＋改後對照＋字元數前後量測；5 個 description 全部 ≤60% 且線索檢查全過；ADR 存在；root CLAUDE.md 條目已改。

## P3 — Out-of-scope 拒絕知識庫（免 Gate）

1. **新建 `docs/out-of-scope/README.md`**：格式規範——一檔一拒絕；每檔欄位：被拒的提案 · 理由 · 來源（ADR/issue/session 的逐字引用＋路徑）· 日期。明寫鐵律「**deferral ≠ rejection**：延後的事項不進來」。
2. **種子條目 ≥2 個**：候選（執行時逐字核對原文，grep 得到才寫）：
   - 「skills 互相 invoke」的拒絕（源：root CLAUDE.md「skills don't invoke each other」＋ ADR-007/038 一帶）。
   - ADR-021（nav-doctor 退役）中被拒的保留方案。
   - 2026-07-13 比較調研判定不採的 Changesets 發布自動化（源：matt-adoption plan Out of scope 節）。
3. **root `CLAUDE.md`**：「New skill」維護規則加一句「先查 `docs/out-of-scope/`，勿重提已拒案」。
4. **ADR-067**：標題「out-of-scope rejection ledger」。記：動機（mattpocock `.out-of-scope/` 先例）、格式、消費端。

**Done 判準**：README＋≥2 種子檔存在；每種子的來源引用可 grep 命中原文；root CLAUDE.md 含 `docs/out-of-scope/` 字串；ADR 存在。

## P4 — 派工分層＋顧問席落地（免 Gate；決定全在來源②）

1. **root `CLAUDE.md`**：Authoring conventions 新增「★ Dispatch tiers」條目，內容取自來源②的核心原則與三類工作表——含：
   - 原則一行（強腦坐判斷席、便宜手做偵察與執行、降階安全條件＝下游有強腦驗收點、席位認名字不認工具）。
   - tier 對照一行：「判斷＝session 模型；偵察/執行 subagent 預設 `sonnet` ← 換手改此行」。
   - 顧問席解析順位：advisor tool（可用時）→ 強模型 subagent（無傾向派審稿人、有傾向派反方；**升階 inject 耐久產物路徑，不 inject 轉述摘要**）→ 退回問使用者。
   - 偵察回報慣例一句（帶 file:line / 來源 URL，回事實不回感想）。
2. **三個派工點各加一句 instance**（引用 root，不重述準則）：
   - `plugins/nav/skills/plan/SKILL.md` Stage 4 選項 1 段內：派 subagent 預設 cheap tier，判斷密集的單步可當場升階（見 root CLAUDE.md Dispatch tiers）。
   - `plugins/shape/skills/build/SKILL.md` 排程段：同上一句。
   - `plugins/nav/skills/audit/SKILL.md` deep-sweep fan-out 段：偵察 subagent 同上一句。
3. **ADR-068**：標題「dispatch tiers + consultant seat（capability slot）」。內容取自來源②全文結構（四 fork＋拍板＋落點）。
4. **R1 amendment**：`blueprints/thoughts/2026-07-13-rule7-second-door-advisor-escalation.md` 追加一節「軟依賴條款（2026-07-13 追加）」：advisor 是 escalation 優先門非必經步驟；不得假設 mid-session 可修復；fallback＝rule ⑦ 原門；附本日實證（旗標已繞過仍整場 unavailable）；席位語言見來源②。amendment 語氣，不改動原文其餘段落。
5. **來源② thought 狀態行**改「已 graduate → ADR-068」。

**Done 判準**：root CLAUDE.md 含「Dispatch tiers」節；三個 SKILL.md 各 `grep -c "Dispatch tiers"` ≥1；ADR 存在；R1 節存在；②狀態行已改。

## P5 — park 實作（等 G0）

1. **scaffold `plugins/reflect/skills/park/SKILL.md`**：形狀全部取自來源③（含兩個 ✅ 裁決）——五欄鏡像（goal/done/now/open/next，對齊 catchup Step 2）＋ git SHA 章；寫入目標＝**工作專案根目錄 `HANDOFF.md`，蓋掉重寫**；`disable-model-invocation: true`（summoned，同家族慣例）；寫檔前顯示內容（write-gate）；description 依 P2 的 lean 慣例撰寫。
2. **`plugins/reflect/skills/catchup/SKILL.md`**：Step 1 加「取食順位」段——根目錄 `HANDOFF.md`（先對 SHA，不符標「可能過期」降級）→ blueprints/plan.md 等家族產物 → 純 git；報告時自報吃到哪一級。
3. **收工點提醒（offer，不 auto）兩處**：`plugins/shape/skills/build/SKILL.md` 信心不足停下處、`plugins/nav/skills/plan/SKILL.md` Stage 4「Save plan only」選項描述——各加一句 guarded 提醒「可喊 /reflect:park 留游標」。
4. **`plugins/reflect/CLAUDE.md`**：roster 加 park（讀寫對稱表述：catchup/park＝游標、summarize/observe＝知識）；「one writer」慣例改寫為兩寫者並引 ADR-069；家族歸屬檢驗結論（對象是工作容器＋翻案線）一句帶過並指向來源③。
5. **ADR-069**：標題「reflect:park — the write side of the cursor（reflect becomes two writers）」。內容取自來源③（缺口、三源證據、A/B 實驗、兩項裁決、家族檢驗）。
6. **註冊（gate #3，新 skill 必做）**：`README.md` 的 reflect 節加 `/reflect:park` 一行；`docs/site/index.html` 對應資料陣列加 park 節點/字樣（validator 會查 slug）。

**Done 判準**：SKILL.md 存在且含 `HANDOFF.md`、SHA、五欄；catchup 含取食順位段；兩處提醒存在；reflect CLAUDE.md 已改；ADR 存在；README 與 site map 均 `grep "reflect:park"` 命中。

## P6 — 收尾統一 Ripple（所有執行的 Phase 完成後跑一次）

1. **版本 bump**（只 bump 實際被改到 SKILL.md/CLAUDE.md 的 plugin，各一次）：nav 0.8.1→0.8.2 · frame 0.5.0→0.5.1 · shape 0.7.2→0.7.3 · reflect 0.3.0→0.4.0（新 skill）。改各自 `plugins/<n>/.claude-plugin/plugin.json`（唯一 owner）。
2. **`docs/site/index.html`**：每個 bump 的 plugin，其 DOMAINS 卡片與 graph 節點 blurb 的版本 token **英中兩處都改**（validator `validateSiteMapVersions` 會查）；audit-block 的 rev +1、日期改今日；FIXED 清單加一條列本批變更。
3. 跑「收尾統一 Ripple」命令塊；validator 必須 `ok`。
4. **總回報**：per-Phase Done 判準核對表＋全部改動檔案清單＋validator 輸出尾行。

## 驗收協定（check 側，Fable/Paul 執行，Sonnet 不做）

- 逐 Phase 讀 diff：rule ① 洩漏（詞彙定義是否只在 owner 檔出現）、★ 慣例（路徑/域名詞）、P2 的觸發 QA 終判、ADR 與 thought 狀態一致性。
- 過了才 commit；P2 試點結論（是否全面推 34 個）另開 session 決定。

## Out of scope（沿 matt-adoption plan，不變）

生命週期分層目錄 · router skill · 34 skill 全面減重 · anti-pattern 表全面 sweep · Changesets。
