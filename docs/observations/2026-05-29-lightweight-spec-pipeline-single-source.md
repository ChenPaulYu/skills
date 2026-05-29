---
date: 2026-05-29
status: raw
---

# 輕量化 intent→spec→plan pipeline —— 單一 MD source → 按需 HTML 投影,分層解耦,重量可調

> 設計藍圖(blueprint),不是已實作。來自 2026-05-29 一場長討論。未來若要開 `spec` / pipeline 家族 plugin(ADR-005 已點名 `spec`),這是起點。**先 capture、不 pre-skill。**

## Context

Paul 的真實工作流是一條 5 階 pipeline,目前散在不同工具、且各自亂:

1. **thought**(名字暫定)—— 發散:聊天釐清「我到底要什麼 / 核心 principle 是什麼」。現在在 **ChatGPT** 做。
2. **synthesis** —— 收斂:多個 thought 綜合成一個方向。
3. **mockup** —— 實作前先做視覺 mockup,確認「想像中的 feature == 做出來的」。現在在 `crate/mockups/YYYY-MM-DD-<topic>/`。
4. **spec** —— 轉成可實作的 spec,敘述 **WHAT not HOW**,搭配 mockup。現在在 `crate/docs/specs/`。
5. **plan + progress** —— spec → 可執行 plan + 一個 agent 自己維護、跨 session 的 `progress.md`。

## 三個痛(都實際發生)

1. **spec / mockup / plan 都亂,且互相依賴** → 做到一半想改 plan 或 spec 很麻煩(要手動追相依)。證據:`crate/docs/specs/plan.md` 一份裡同時塞 spec 指標、狀態表、出貨順序三層(WHAT + STATE + HOW);spec 互相引用、還引用已刪除的 spec;mockup 只有 5/13 有 README。
2. **重 SOP 不會自動縮小** → 用過 Superpowers 的 brainstorm,喜歡但「邏輯太重」;小功能也要走完整 SDD 很煩。
3. **agent 寫的 spec/plan 沒人看** → (a) MD 對人類很難看;(b) 寫得太密 / 太 hedgy(agent 腔)。

## 收斂後的設計(5 條原則)

**① 單一 source,按需投影(解痛 3 + 「太重」恐懼)**
> **MD = source of truth(agent 面,寫得 concise)→ HTML = 從 MD 機械生成的投影(人類面,視覺+白話+只給決策)。**
- 人類不編輯 HTML,只讀它決策;要改 → 對話 → agent 改 MD → 重生 HTML。一份真相、兩種 render → **無雙重維護、無 drift**(投影帶 `generated from <md>@<date>` 戳記,stale 立刻可見)。
- 這正是 **nav:map 已有的 pattern**(source code → HTML projection + freshness block)。機器現成(雙語 renderer、`visual-spec.md`)。Paul 手做的 `crate/docs/specs/plan-visual.html` = 這投影的手工前身。

**② 分層解耦 + 單向依賴(解痛 1,最高優先「好改 plan」)**
> spec=**介面(WHAT)**、plan=**實作(HOW)**、progress=**state**。依賴只往下;**改下游永不回頭改上游。**
- 改 plan = 換介面背後的實作 → spec 不動、thought 更不動、progress 自動跟。這是 **rule ①(deep modules)套在文件上**。
- Paul 自己的話:「改 plan 不用去改 thought」—— 正確,且是單向依賴的自然結果(不需設計成「互不依賴」,那會丟 grounding)。
- 現在改 plan 痛,正因 `plan.md` 把三層黏一起;分層後 = 只動 HOW 那層。

**③ 重量可調(解痛 2)**
- **階段是可選進場點,不是必經關卡。** 小任務 thought→直接做;只有大/跨session/需人類拍板才走全程。
- **「分層」≠「拆檔」;檔案數是重量旋鈕。** 小任務:一個檔三段(WHAT/HOW/STATE),改 plan = 只編輯 HOW 段。大任務才拆成三檔。解耦靠**編輯局部性**,不是檔案多寡 → 破解「越多階=越多檔=越難改」的恐懼。
- HTML 投影也按需生:只在「需要 review/決策」或里程碑才生,小事不付成本。

**④ 每層有 owner + lifecycle(維護面其實很小)**
thought = write-once 火花(寫了就忘)· spec = **人類唯一手養的層** · plan = 衍生/可丟可重生 · progress = **agent 自己顧** · HTML = 按需生成。Paul 手動維護的其實只有 spec。

**⑤ 寫作紀律(解痛 3b)**
MD source 寫得 concise、不 hedge、不繞 → 套 `writing-clearly-and-concisely`(Strunk)skill 當產出紀律。與架構正交,可獨立加。

## 落點 + 別過度 skill 化

- **新家族**(ADR-005 的 `spec`,或更廣的 pipeline 命名)。`nav:plan` 很可能要從 nav **搬過來**當「plan 階」成員 —— 這是一條 ADR。
- **別做 5 個 skill(rule ④ over-modular)。** thought/synthesis 本質是**對話**,要的是 artifact 形狀 + clarify 協定,不是 skill。skill 只長在**有可重複機械動作**的階。
- **真正的第一步是 convention(artifact 契約 + 分層 + 顯式單向邊 + 按需投影),不是 skill** —— 跟 nav 一樣「先立規則,skill 只是 enforcer」。

### 已有可 reuse vs net-new
- **reuse**:`nav:map`(source→HTML 投影 + freshness)· `planning-with-files`(progress.md 跨 session,正好是階 5)· `writing-clearly`(原則 ⑤)· `nav:plan`(階 5 創作端)。
- **net-new**:thought 捕捉/clarify(放 Claude 比 ChatGPT 強的理由 = clarify 時能對 Crate 真實 code **紮根**,= nav:plan Stage 2 的洞見)· synthesis · mockup loop · artifact 契約本身。

### mockup 子工作流(階 3 —— 也可獨立 skill 化)
13 個 session / 2 週,protocol 一致(日期資料夾 · N 個 standalone HTML options + 假資料紀律 · 截圖 · 對照 real-app · README 含 build-cost/out-of-scope · visual-lock),但只 5/13 有 README。**單獨看就已遠超 raw**,是這條 pipeline 裡最先可動的一塊。對位既有 `frontend-design`/Pencil/`ui-ux-pro-max`(它們生**一個** UI;這裡是**多 option→比→lock→記錄**的 loop)。

## Priority —— 結論 (2026-05-29)

走過完整討論後,Paul 判定:**所有候選裡,只有兩個值得做成 skill,其餘留藍圖 / CLAUDE.md / reuse。**

1. **`Thought-ground`**(stage 1)—— on-demand 的 grounded grill-me;behavioral spec = [[2026-05-29-thought-mode-how-paul-converges]];核心機制 = weight-adaptive exit。**最該先做**:認知槓桿最高、現有工具(ChatGPT)最弱、且 spec 已寫好。
2. **mockup loop**(stage 3)—— 機械、13×/2 週、net-new、不糾纏 pipeline。

其餘(synthesis · spec=WHAT · plan/progress · 單一 source→投影 · 分層 convention)= **留藍圖,等痛到了再動**。收斂 stance 放 CLAUDE.md;progress reuse `planning-with-files`;寫作套 `writing-clearly`。

**但兩個都先不建** —— 守 don't-pre-skill。這段只是把「該做哪兩個、什麼順序」釘下來。

## Open questions / trip-wires

- 家族命名 + 「thought」命名待定。
- thought / spec 對小任務要不要直接 collapse?
- HTML 投影的「生成時機」具體怎麼定(每次?里程碑?手動?)。
- `nav:plan` 搬家 = 要寫 ADR(重開 ADR-006 的歸屬)。

## Evidence / status

- **唯一來源(2026-05-29 討論 + Crate 現況勘查)**:`crate/mockups/`(13 session)、`crate/docs/specs/`(plan.md 三層混 + naming 三style混 + 引用已刪 spec)、`crate/docs/specs/plan-visual.html`(投影手工前身)。
- `raw` —— 一次設計探討,尚未實作。下次真要動時:先寫 artifact-契約 ADR + 開新 plugin 家族,**convention 先於 skill**。
