# Fable rethink batch — 全域守則搬遷 + 四篇 thoughts 提案

> **TL;DR**: Fable 主持的一次批次落地：把 nav 紀律與白話規則搬進全域 `~/.claude/CLAUDE.md`（W1），並在本 repo `blueprints/thoughts/` 落四篇提案文件（W2–W5：authoring 詞彙表 / rule ⑦ 第二扇門 / reflect:park / invocation 方向律）。全部是 hypothesis 層——**不動 core、不動 SKILL.md、不 commit、不 bump manifest**，等 Paul 拍板。
> **狀態**: 計畫 2026-07-13 由 Fable 撰寫；實作交 Sonnet subagents；**已完成 Fable review（同日）**——五件全過驗收，W3 修三處字面小疵，餘無退回。待 Paul 以 `git diff` 審後拍板。
> **來源**: 2026-07-13 session——重讀本 repo 核心哲學（Ousterhout 深模組、ADR-018/038/041/051/058/059）＋ 外部調研（Anthropic context 研究、softaworks session-handoff、mattpocock/skills）。

## Context — 為什麼是這五件事

使用者提出五個痛點：(1) Fable 用量有限，該放在計畫/高階判斷/顧問位；(2) catchup 接不回上次開發；(3) context 不會自己卸貨、快滿了不自知；(4) 新專案會跳過 nav 原則；(5) 解釋不夠白話要一直提醒。經過 repo 哲學重讀＋外部調研，收斂為：

- **#4 #5 的根因是守則放錯樓層**——nav 鐵律只活在 tactus 專案的 CLAUDE.md，新專案裸奔；白話規則太抽象（「白話一點」無可執行形狀）。→ W1
- **#2 #3 是同一個病**——catchup 只讀耐久狀態，但沒有任何 verb 在收工時把「游標＋為什麼」寫進耐久狀態。外部三源印證（softaworks handoff / Anthropic 20–40% 品質退化研究 / Pocock ~120k smart zone），已達 ADR-018 立案標準。→ W4
- **#1 的正解是 advisor tool，不是 frontmatter 升級**——rule ⑦（<90% 信心→問）本來就是業界 escalation pattern 的觸發器，只差第二扇門。→ W3
- 調研 mattpocock/skills 額外揭露兩個本 repo 缺口：**prose 層的 authoring 詞彙**（Premature Completion / Negation / Leading Word / Completion Criterion…）→ W2；**invocation 方向律**（本 repo 2026-07-02 elicit thought 已親身撞過此題）→ W5。

## Approach — 執行結構

- **Fable 寫計畫（本檔）→ 5 個 Sonnet subagents 平行實作 → Fable 逐檔 review → 報告 Paul。**
- W2–W5 是 thoughts：**提案語氣、標明「待拍板」**，agent 推導必須標為假設，引用外部來源附 URL。這正是「agent 衍生推導不直接進 core」的既定流程。
- W1 動的是使用者自己的全域檔（不在任何 repo），實作前先備份到 scratchpad。

## Work items

### W1 — 全域 `~/.claude/CLAUDE.md`：搬鐵律 + 白話規則具體化
- **保留現有內容一字不動**（語言偏好、解釋風格、個人信箱），只新增兩節，總增量 ≤ 20 行——此檔每個專案每個 session 都載入，必須精瘦。
- 新增〈動手前的紀律〉：行為變更走該專案已裝的 do/plan 類 skill；一整塊新能力先寫接地計畫；不確定走哪條就先問。**正向目標先行、禁令殿後**（Negation 教義）；必須專案無關（不得出現 tactus/nav 等專案專屬 noun——寫「若專案裝有對應 skill」這種條件式）。
- 白話規則改為可檢查的形狀：第一句先講結論；術語第一次出現跟一句白話註解；解釋概念比喻先行細節在後。
- **驗收**：diff 顯示只有新增；新增段落無專案專屬 noun；≤20 行。

### W2 — thoughts：authoring 詞彙表（prose 層失敗模式命名）
- 檔名 `2026-07-13-authoring-vocabulary-prose-failure-modes.md`。
- 內容：借 mattpocock/skills 的 GLOSSARY 詞彙（Premature Completion / Negation / No-Op / Sediment / Leading Word / Completion Criterion / Sprawl），每個詞**對應到本 repo 已觀察到的實例**（例如「趕著收尾」= Premature Completion；anti-pattern 表格的禁令密度 = Negation 風險）。
- 提案落點：root CLAUDE.md Authoring conventions 加一節（criterion 一個 owner），各 plugin 不重複。**只提案，不動 CLAUDE.md。**
- **驗收**：每個詞有本 repo 實例對應，不是空翻譯；引用出處（github.com/mattpocock/skills 的 writing-great-skills + GLOSSARY.md）。

### W3 — thoughts：rule ⑦ 第二扇門（advisor escalation）
- 檔名 `2026-07-13-rule7-second-door-advisor-escalation.md`。
- 主張：<90% 信心時分流——**該使用者決定的 → 問使用者（原門）；難的技術判斷但非使用者之事 → 問 advisor（新門）**。準則一個 owner（root CLAUDE.md，掛 rule ⑦ 旁），plugin 列 instances。
- 適用：agent 側判斷（nav:plan 方案取捨、nav:audit 深淺判定、research:critique 自我攻擊）。**明確排除** shape:elicit 與 frame 家族——它們的本質是把答案從使用者身上拉出來，advisor 介入會腐蝕 verb 的存在意義。
- 事實段（照實寫）：advisor tool 需 Claude Code ≥2.1.98、直連 Anthropic（訂閱與 API 計費皆可、排除 Bedrock/Vertex/Foundry）；Sonnet 5 主模型可配 Fable advisor；本機已設 `advisorModel: fable` + `model: sonnet`、版本 2.1.207，但 session 內呼叫回報 unavailable，**待新 session 驗證**——此提案以驗證通過為前提。
- 外部印證：業界 supervisor escalation（低信心升級強模型）；Pocock wayfinder 的 HITL/AFK ticket 二分（同一判斷、不同顆粒度）。
- **驗收**：兩扇門的分流判準寫成一句可執行的問句；事實段無過度承諾。

### W4 — thoughts：reflect:park（catchup 的寫入側）
- 檔名 `2026-07-13-reflect-park-writes-the-handoff.md`。
- 缺口陳述：reflect 現況 catchup 讀、summarize 讀、只有 observe 寫（一條 learning）——「游標位置＋為什麼」這個事實**沒有 owner**。一句話：catchup 讀交接單，park 寫交接單；沒有 park，catchup 永遠只能讀到 git 骨架。
- 三源證據（各附出處）：softaworks/agent-toolkit session-handoff（10 段模板、`--continues-from` 鏈、恢復時比對 git SHA 做過期檢查）；Anthropic 2026-03 研究（context 20–40% 即開始退化、近上限出現 rushed-finish）；Pocock ask-matt（~120k smart zone、跨線前 /handoff）。
- 形狀草案：park 寫 catchup 五欄的鏡像（goal/done/now/open/next）＋當下 git SHA；catchup 讀到先比對 SHA，過期就標註降級。**維持 summoned, not automatic**——油表給人看（statusline 顯示用量，人喊 park），不做 80% 自動觸發（那是本 repo 定義的 anti-feature）。
- **開放題（留給 Paul／shape:elicit）**：交接單寫到哪——獨立 dated handoff note（傾向）vs plan.md In progress（撞 align 的單一寫者）vs commit body（時機受限）。此題不得在本文件內定案。
- 註明衝突點：新增 park 會動 reflect「只有 observe 寫」的慣例，需 ADR。
- **驗收**：三源都有 URL；開放題明確標示未決；未僭越定案。

### W5 — thoughts：invocation 方向律（marketplace-wide）
- 檔名 `2026-07-13-invocation-direction-law.md`。
- 主張：把 Pocock 的依賴方向紀律推廣為全市場規則——**user-invoked skill 永不被其他 skill 召喚；依賴方向只准 user-invoked → model-invoked**；每個 skill 明示自己屬哪類。
- **必須先讀並引用** `blueprints/thoughts/2026-07-02-elicit-summon-widen-not-autofire.md`——本 repo 已親身撞過這題（elicit 因跨 skill 散文推薦需求而拿掉 disable-model-invocation，行為紀律退回文字規範）。本提案就是給那次事件一個結構性的家：平台閘門是二元的，方向律用「文字規範＋盤點表」補上中間態。
- 內容含一張現況盤點表：逐 plugin 列哪些 verb 現在是 model-invocable、哪些該是 summoned-only、哪些被別的 skill 散文推薦（grep companion 區塊）。
- **驗收**：盤點表基於實際 grep，不是猜的；引用 2026-07-02 thought。

## Verification — Fable review 清單

1. 逐檔全文讀（不抽查）。
2. rule ① 檢查：thoughts 指向 owner，不複述他檔已有內容。
3. 語氣檢查：提案／假設語氣，狀態列「待拍板」；W1 除外（它是直接生效的使用者偏好檔）。
4. 事實檢查：版本號、閾值、URL、advisor 可用性 caveat 照實。
5. 聲音檢查：對齊 repo 的 taste（負空間、拒絕 ceremony、正向目標先行）。
6. W1 額外：diff 只有新增、無專案 noun、≤20 行。
7. 不合格 → 退回該 agent 修或 Fable 直接修，記入報告。

## Out of scope
- 不 commit（Paul 用 git diff 審）；不動 `docs/adr/`、`plugins/`、manifests、site map、core 級文件。
- advisor 新 session 驗證（使用者親手做）。
- park 的「寫到哪」定案（走 shape:elicit）。
