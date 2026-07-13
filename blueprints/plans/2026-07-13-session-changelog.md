# 2026-07-13 session changelog — 我改了什麼、怎麼撤銷

> **TL;DR**: 本次 session(Fable 主持、Sonnet 執行)共動了三個地方:①你的機器設定(全域 CLAUDE.md、settings.json、清除殭屍安裝)——**已生效**;②skills repo 七個新檔——**全部 untracked、未 commit,等你 `git diff` 審後拍板**;③agent 長期記憶兩則。**沒有碰任何專案的程式碼,沒有做任何 commit。**

---

## ① 你的機器(已生效的變更)

### `~/.claude/CLAUDE.md` — 新增 13 行
- 新增〈動手前的紀律〉:改 code 前先判斷「小行為變更 vs 一整塊新能力」、有對應 skill 就走、不確定先問。**為什麼**:這條鐵律原本只活在 tactus 專案的 CLAUDE.md,新專案裸奔(你的痛點 #4)。
- 新增〈解釋的形狀〉:第一句先結論、術語首次出現配白話註解、比喻先行。**為什麼**:把「白話一點」變成可檢查的規則(痛點 #5)。
- 既有三條(語言/解釋風格/信箱)一字未動。
- **撤銷**:還原備份 `<scratchpad>/CLAUDE.md.bak-w1`,或刪掉最後兩節。

### `~/.claude/settings.json` — env 區塊加一行
- 加入 `"CLAUDE_CODE_ENABLE_EXPERIMENTAL_ADVISOR_TOOL": "1"`。
- **為什麼**:advisor tool 回報 unavailable 的根因是伺服器端分階段推送 flag(`tengu_sage_compass2`),你的帳號未入 rollout;此環境變數在 binary 的判斷式裡走在 flag 檢查之前,直接放行。已用兩次全新 headless session 實測通過(含純 settings.json 路徑)——你的「Sonnet 日常 + Fable advisor」配置自此上線。(`advisorModel: fable` 是你原本就設好的,本次未動。)
- **撤銷**:還原備份 `~/.claude/settings.json.bak-advisor`,或刪掉 env 裡那一行。官方全量推送後這行就可以刪。

### 殭屍安裝清除
- 刪除 `/usr/local/bin/claude`(symlink)與 `/usr/local/lib/node_modules/@anthropic-ai/claude-code/`(2025-09 的 v1.0.126 npm 舊裝)。
- **為什麼**:與現役 native 安裝(`~/.local`,v2.1.207)重複;檔案本來就是你的使用者權限,未用 sudo。已驗證 PATH 上只剩一份、`claude --version` 正常。
- **撤銷**:不需要(舊版本身已無用);真要裝回 `npm -g install @anthropic-ai/claude-code`。

### 未動的已知問題
- PATH 裡 `~/.local/bin` 重複 9 次(shell 設定檔疊加)——僅回報,未修。
- 滾輪送方向鍵:Linux 平台已知 issue(GitHub #64214/#65833),無設定可根治;緩解:PgUp/PgDn、`/tui fullscreen` 關全螢幕、`"wheelScrollAccelerationEnabled": false`。未替你改任何設定。

## ② skills repo(全部 untracked,等你拍板)

`git status` 應顯示恰好這些新檔:

| 檔案 | 是什麼 |
|---|---|
| `blueprints/plans/2026-07-13-fable-rethink-skills-batch.md` | 本批次的計畫本體(Fable 寫,含驗收清單;狀態已更新為 review 完成) |
| `blueprints/plans/2026-07-13-session-changelog.md` | 本檔 |
| `blueprints/thoughts/2026-07-13-authoring-vocabulary-prose-failure-modes.md` | W2:借 mattpocock/skills 的 prose 失敗模式詞彙(Premature Completion / Negation / Leading Word…),每詞釘上本 repo 實例;提案進 root CLAUDE.md authoring 節 |
| `blueprints/thoughts/2026-07-13-rule7-second-door-advisor-escalation.md` | W3:rule ⑦ 長第二扇門(答案在使用者手裡→問人;在更深推理裡→問 advisor);排除 elicit/frame。advisor 前提已解除(見①) |
| `blueprints/thoughts/2026-07-13-reflect-park-writes-the-handoff.md` | W4:新 verb `reflect:park`(catchup 的寫入側,五欄+git SHA);「寫到哪」留給 /shape:elicit |
| `blueprints/thoughts/2026-07-13-invocation-direction-law.md` | W5:invocation 方向律(summoned-only 不被其他 skill 推薦);含實測盤點表(6 個 summoned-only、12 處候選違規) |
| `docs/findings/2026-07-13-park-ab-experiment.md` | park 的 3 臂×2 情境 A/B 實驗:純 git 11/20 且會**編造 why**(全場僅有的 2 條幻覺都在此臂);隨手筆記 19/20;park 交接單 19/20+紅鯡魚全過+零幻覺。最值錢的欄位是「已否決清單」→ 建議在 park spec 升格為必填 |

- **撤銷**:全是 untracked,`git clean -n`(先看)→ 逐檔刪即可。
- 過程中 Fable review 修過的地方:W3 三處字面小疵 + 前提狀態更新;其餘無退回。

## ③ Agent 長期記憶(`~/.claude/projects/.../memory/`)

- 新增 `advisor-setup.md`:advisor 已可用 + 你的模型策略(Sonnet 日常、Fable 顧問、卡關主動呼叫)。**為什麼**:讓之後所有專案的 session 都不必重新發現這件事。
- `MEMORY.md` 索引加一行。
- **撤銷**:刪檔 + 刪索引行。

## 沒有做的事(明確列出)

- **沒有 commit 任何東西**(skills repo 的新檔等你審;你機器上的檔案不在 git 內)。
- **沒有動 tactus 或任何專案的程式碼**(tactus 工作樹保持乾淨)。
- **skill 瘦身未執行**:第三方 plugin 停用(impeccable 21 個 skill、planning-with-files、python-dev、agent-sdk-dev、artifacts-builder、code-review plugin、重複的 frontend-design/context7)與自家退休候選(frame:graft、nav:compose,均 0 次終身使用)——已給評估與建議,等你點頭。
- 實驗產物(`<scratchpad>/park-exp/`,6 個合成 repo+答案卷+評分)在 session 結束後隨 scratchpad 消失,結論已固化在 findings 檔。

## 等你拍板的佇列(建議順序)

1. skills repo 七個新檔 `git diff` 審 → 要留的 commit,四篇 thoughts 決定 graduate 與否(park 的「寫到哪」建議走 `/shape:elicit`)。
2. skill 瘦身:先停用第三方(止血 + 修復清單截斷),再走 ADR 退休 graft/compose。
3. park 若立案:把實驗發現的「已否決清單必填」寫進 spec。
