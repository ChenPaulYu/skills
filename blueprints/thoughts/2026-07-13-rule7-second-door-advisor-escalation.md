# rule ⑦ 長出第二扇門 —— advisor escalation

> **TL;DR**：rule ⑦「低於 90% 信心 → 問」目前只有一扇門(問使用者)。提案長出第二扇門：先問一句分流題——**這個卡住的判斷,答案握在使用者手裡,還是要更深一層推理才挖得出來?**——前者走原門(問使用者),後者走新門(呼叫 `advisor` tool 問更強的模型)。準則單一 owner 放 root `CLAUDE.md`(掛 rule ⑦ 旁,仿 ADR-059 手法),各 plugin 只列自己的 instance。**明確排除** `shape:elicit` 與 `frame` 家族——它們的存在意義就是把答案從使用者身上榨出來,advisor 介入等於讓大模型代替使用者回答自己的逼問。
>
> **狀態**：提案,待 Paul 拍板;**前提已解除**——unavailable 的根因是伺服器端分階段推送 flag(`tengu_sage_compass2`),2026-07-13 已在 `~/.claude/settings.json` env 設 `CLAUDE_CODE_ENABLE_EXPERIMENTAL_ADVISOR_TOOL=1` 繞過,並以兩次全新 headless session 實測(純 settings 路徑亦通),advisor 均回傳真實建議。
> **日期**：2026-07-13。Fable 出計畫、Sonnet 撰寫、Fable 已 review(同日)。

## 背景 —— 現況與缺口

rule ⑦ 目前的完整文字(單一 owner,`plugins/nav/CLAUDE.md:26`):

> 7. **Below 90% confidence → ask** — when unsure about scope, boundaries, intent: stop and clarify.

它只描述**一扇門**:卡住就問使用者。這扇門在三個實際 instance 裡都是「問使用者」的字面意思:

- `plugins/nav/skills/plan/SKILL.md:30` ——「this skill is rule ⑦ as a workflow」,Stage 2 就是問使用者澄清 spec 歧義。
- `plugins/nav/skills/audit/SKILL.md:75, 266` ——「Rule ⑦ applies to YOU running this audit」,信心不足就標 `(uncertain)`,不代使用者下判斷。
- `plugins/research/skills/critique/SKILL.md:128` ——「Below 90% confidence on a finding」就軟化措辭或改問句,不斷言。
- `plugins/shape/CLAUDE.md:21` 也把它列為「core principle, shared with nav rule ⑦」,`elicit`/`mockup`/`align`/`reconcile` 都是這條規則的工作流化身。

缺口:這四個 instance 裡,「卡住」的**性質其實不一樣**。`nav:plan` 的方案取捨、`nav:audit` 的深淺判定、`research:critique` 的自我攻擊是否到底——這些卡住,答案往往不在使用者腦子裡,使用者也答不出「哪個 refactor 拆法比較深模組」這種問題,問使用者只是把技術判斷的球丟給不該接的人。這正是 `advisor` tool(Claude Code ≥2.1.98 官方功能)存在的位置——它是本 repo 已經有的、只差被接上的第二扇門。

## 分流判準 —— 一句可執行的問句

> **這個 <90% 的判斷,答案握在使用者手裡(問了就有),還是握在更深一層推理裡(問使用者也答不出來)?**

- 前者 → 原門,問使用者(`AskUserQuestion` 或直接對話澄清)。答案的性質是**偏好、範圍、業務脈絡、使用者才有權拍板的取捨**——問使用者是唯一能拿到答案的路徑,advisor 答不了。
- 後者 → 新門,呼叫 `advisor` tool。答案的性質是**技術判斷本身不夠強**——推導鏈更長、更容易漏掉反例、需要更強的模型重算一次——使用者就算被問了也只能說「你決定」,問他等於白問。

判準本身不判斷「難不難」,判斷「答案的物理位置在誰那裡」。這條線刻意窄:大多數 <90% 情境仍然是「使用者才有答案」,新門只接住那一小撮「無人可問、只能算得更深」的情境。

## 適用範圍

### 納入 —— agent 側的技術判斷

- **`nav:plan`**——多個可行方案的技術取捨(哪個切法比較深模組、哪個邊界比較不會日後 leak),使用者通常沒有形成偏好,問了也只會說「你比較懂」。
- **`nav:audit`**——深淺判定的邊界案例(這個函式算不算 God Function、這層算不算 temporal decomposition),同上。
- **`research:critique`**——自我攻擊是否已經打穿一個 claim、還是遺漏了更強的反例,這是推理密度問題,不是使用者知不知道答案的問題。

這三個都已經在自己的 `SKILL.md` 裡把 rule ⑦ 焊死成「不確定就標注/軟化/停下問」——第二扇門只是在既有的「停下」動作後面,多一個「先試著自己問更強的腦」的分岔,不改變「不確定不要斷言」這個底線。

### 明確排除 —— `shape:elicit` 與 `frame` 家族

`shape:elicit` 的整個機制就是「把答案從使用者身上拉出來」——多輪逼問收斂概念/root-cause,答案**只存在使用者腦子裡**,skill 的工作是把它問出來,不是替使用者想出來。`frame:first-principles`/`frame:analogize`/`frame:orthogonal` 等同源——它們或者是推理鏈本身要展示給使用者看(而不是找更強模型偷跑),或者是把已有答案重新表達給使用者聽,都不是「卡住,需要更強的腦」的情境。

如果讓 advisor 在這裡介入,等於大模型代替使用者回答了 elicit 自己拋出的逼問題——這正是 `mattpocock/skills` wayfinder 那句話講的失敗模式(見下方外部印證):「a grilling agent that answers its own questions has broken this」。對 elicit/frame 家族來說,advisor 不是省力,是偷答案,會腐蝕這幾個 verb 存在的理由。

## 落點提案 —— 準則一個 owner,plugin 列 instance

仿 ADR-059 的手法(cost tier 準則搬進 root `CLAUDE.md` 的 Authoring conventions,各 plugin `CLAUDE.md` 只列自己的 instance,不重複準則本文):

- **準則本文**(分流判準這句問句 + 排除規則)進 root `CLAUDE.md`,掛在既有「confidence-gate」措辭附近(目前 `CLAUDE.md:103` 的 cost-tier 段落已提到「confidence-gate」但未展開;rule ⑦ 全文本身住在 `plugins/nav/CLAUDE.md:26`,root 檔目前完全沒有 rule ⑦ 的字——這個新 bullet 會是 root 檔第一次直接談 rule ⑦,精確接在那個既有措辭旁邊)。
- **各 plugin `CLAUDE.md` 列自己的 instance**:`nav`(`plan`/`audit` 已有的 rule ⑦ 段落各加一行「第二扇門見 root」)、`shape`(既有的「shared with nav rule ⑦」段落加一句排除 `elicit`/`frame` 的理由)、`research`(目前 plugin 層完全沒 restate rule ⑦,只在 `critique/SKILL.md` 內文——這個提案順帶點出這個 leak,但是否補齊留給 Paul 決定,不在本文件內定案)。

## 事實段 —— advisor tool(照實寫)

- `advisor` 是 Claude Code 官方功能(≥2.1.98)——呼叫時整段對話自動轉發給更強的 reviewer 模型。
- 需要**直連 Anthropic**——訂閱與 API 計費皆可,**排除** Bedrock / Vertex / Foundry。
- Sonnet 5 作為 session 主模型時,可配 Fable 作為 advisor。
- 設定途徑三種:`/advisor` 指令、`settings.json` 的 `advisorModel` 欄位、`--advisor` flag。
- **本機現況(2026-07-13 已驗證可用)**:已設 `advisorModel: fable` + `model: sonnet`,Claude Code 版本 2.1.207。先前 session 內呼叫 `advisor()` 回報 unavailable,追進 2.1.207 binary 後查明根因:advisor tool 位於伺服器端分階段推送 flag(`tengu_sage_compass2`)之後,帳號未入 rollout 即回 unavailable——與本機設定無關。繞過方式:`~/.claude/settings.json` 的 `env` 區塊設 `CLAUDE_CODE_ENABLE_EXPERIMENTAL_ADVISOR_TOOL=1`(binary 中此變數在 flag 檢查之前直接放行)。已以兩次全新 headless session 實測(含純 settings.json 路徑),advisor 均回傳真實建議。另自 binary 證得配對規則:各模型有 `advisor_rank`(Sonnet 5 = 2、Opus 4.8 = 4、Fable 5 = 4、Mythos 5 = 5),sonnet 主 + fable advisor 合法。留意:EXPERIMENTAL 旗標代表功能仍在推送期,官方全量後可移除此行。

## 外部印證

### 業界 supervisor escalation pattern

Hierarchical supervisor-worker 架構下,worker 信心低於門檻時,supervisor 可以重試、換路徑,或**升級給更強的模型**。一份 2026 年的多 agent 編排 benchmark(金融文件抽取場景)量到:supervisor-worker 分流架構達到 reflexive(全程用強模型)品質的 98.5%(F1 0.929),但只花 60.7% 的成本——供 selective 升級只用在低信心欄位上。出處:[Benchmarking Multi-Agent LLM Architectures for Financial Document Processing](https://arxiv.org/pdf/2603.22651)。這是同一個判準的量化版本:大部分情境不需要升級,只有低信心那一撮值得。

### mattpocock/skills 的 wayfinder —— HITL / AFK 二分

`mattpocock/skills` 的 `wayfinder` skill 把每張工作票分成 **HITL**(human in the loop,要跟活人對話才能解)與 **AFK**(agent 自己跑)兩種,並且明講:

> "A HITL ticket only resolves through that live exchange; the agent never stands in for the human's side of it (a grilling agent that answers its own questions has broken this)."

—— [`skills/engineering/wayfinder/SKILL.md`](https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md)(repo:[mattpocock/skills](https://github.com/mattpocock/skills))。

這跟本提案是**同一個判斷、不同顆粒度**:wayfinder 在「整張工作票」的粒度上做 HITL/AFK 二分;本提案在「單次 <90% 信心判斷」的粒度上做使用者門/advisor 門二分。兩者的排除邏輯完全同構——elicit/frame 家族本質上就是一整族 HITL 判斷,advisor 介入 = 讓 agent 代答自己該問活人的問題。

## 開放題 / 前提(留給 Paul)

1. ~~advisor 可用性待新 session 驗證~~——**已解除**(見上方事實段:flag 根因已查明、逃生門已設、兩次實測通過)。殘餘小前提:experimental 旗標在官方全量推送前的穩定性,屬低風險。
2. `research` plugin 層目前沒有 restate rule ⑦(只在 `critique/SKILL.md` 內文出現)——要不要在 `research/CLAUDE.md` 補一段,或維持現狀,留給 Paul 決定,不在本文件定案。
3. root `CLAUDE.md` 新增 bullet 的確切措辭、要不要順帶把「confidence-gate」那句話展開——實作時再定,本文件只提案方向與落點。

## 軟依賴條款(2026-07-13 追加)

> **Amendment,不改動本文件其餘段落。** 本節由 `blueprints/thoughts/2026-07-13-dispatch-tiers-consultant-seat.md`(顧問席泛化提案)同日追加,落地為 [ADR-067](docs/adr/067-dispatch-tiers-consultant-seat.md)。

**advisor 是 escalation 的優先門,不是必經步驟。** 本文件上方「事實段」記錄的樂觀結論(旗標根因已查明、逃生門已設、兩次實測通過)在同一天的另一場 session 裡被推翻:**旗標已按文件繞過、settings 正確,advisor 仍整場 unavailable,且中途不可修**——這是本日的第二手一手實證,與上方「已解除」的判斷矛盾,保留兩者並陳而非事後改寫上方段落(amendment 語氣)。

**因此不得假設 mid-session 可修復。** 呼叫 `advisor()` 前不確定它會不會用,呼叫失敗後也不能假設換個設定、等一下、重試就會恢復——這是 experimental 旗標推送期的特性,不是使用者這端能排除的故障。

**fallback 永遠是 rule ⑦ 的原始那扇門**:advisor 不可用時,不要卡在「等 advisor 修好」,直接退回問使用者 / 標記不確定,不斷言。這與 shape 的 `browser-verify` capability-slot 同款設計——**能力缺席時降級,不是停擺**。

**席位語言**:本文件原本的「兩扇門」(問使用者 / 呼叫 advisor tool)在 ADR-067 中泛化為三順位的「顧問席」解析順序——① `advisor` tool(可用時最省)→ ② 一個 fresh-context 的強模型 sub-agent(無傾向派審稿人、有傾向派反方,注入耐久產物路徑而非轉述摘要)→ ③ 席位全空,退回本文件的原始 fallback。完整措辭見來源②與 ADR-067;本文件的分流判準(答案握在使用者手裡 vs 握在更深一層推理裡)與排除範圍(`shape:elicit`、`frame` 家族)不受此節影響,原樣有效。
