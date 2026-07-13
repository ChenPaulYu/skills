---
date: 2026-07-13
status: confirmed
---

# 2026-07-13 批次可用性實測 — 路由 A/B · out-of-scope 探針 · park→catchup 往返

> 對本日落地的 ADR-065～070 批次做的三組實測，全部由互盲的 Sonnet 受測 agent 執行、Fable 出題與評分。**三組全過**：description 瘦身 41% 零路由損失；拒絕知識庫的消費迴路成立；park→catchup 往返滿分、紅鯡魚零誤導。

## 1. 路由 A/B 盲測（驗 ADR-065 description 減重）

**設計**：兩個互盲 Sonnet router，各拿一套 34-skill description roster（A=改寫前、B=改寫後，僅 frame 5 skill 不同），同一份 25 句題目：15 句基線（改寫前 description 的引號句）＋5 句未見過的變化句（測泛化）＋5 句誘餌（正解在 research/nav/shape/reflect，測 frame 邊界）。每句恰選一個 skill。

**結果**：A 25/25，B 25/25——**打平於天花板**。新版以 59% 的字元量（3631→2145）維持滿分路由，含「poke holes in my thesis」（靠邊界句路由）與兩句中文語意句。誘餌句兩組皆未誤搶。

**結論**：減重的收益是純賺——同準度、常駐 context 省 41%。證明的是「無退步」，非「更準」（舊版已在天花板）。推廣到其餘 29 skill 的決定已解鎖（ADR-065）。

## 2. out-of-scope 消費探針（驗 ADR-066 拒絕知識庫）

**設計**：全新 Sonnet agent 收到誘餌提案「幫 repo 導入 Changesets 自動發版」（正是本日入庫的已拒案），只被告知「照 repo 規矩評估」，未提及 ledger 的存在。

**結果**：**PASS**——agent 自行找到 `docs/out-of-scope/changesets-release-automation.md`，逐字引用拒絕理由，用 repo 現實獨立驗證理由成立（無 package.json、版本單一 owner 閘門已存在），並正確套用 README 的重提規則（「重提須回應原拒絕理由」）判定本次提案未達門檻。結論：不做。

**結論**：知識庫的「防重複翻案」迴路端到端成立——從入庫、被發現、被引用、到擋下重提，全程無人工提示。

## 3. park→catchup 往返（驗 ADR-070）

**設計**：主 session（Fable，握有完整脈絡）依 park 協定寫 `HANDOFF.md`（含五條已否決路線的點名——A/B 實驗判定的最大誤導源）；全新零記憶 Sonnet agent 依 catchup 協定重建現況，對答案卷（Fable 持有 ground truth）。

**結果**：**五欄全對、幻覺 0、紅鯡魚 PASS**——
- 來源層級正確自報「HANDOFF.md (current)」：SHA `0a9ed59` 對章後採信，且主動用 `git log`/`status`/`find -newer` 交叉核對紙條未過期。
- 五條已否決路線（catchup 搬家、per-family catchup、scout skill、advisor 硬依賴、Changesets）**零誤導**，全數正確標為「勿當下一步」。
- Done 欄含 why（「為什麼用 Codex sidecar 當起點」等），非 commit 標題複讀。

**結論**：與 park A/B 實驗（`docs/findings/2026-07-13-park-ab-experiment.md`）的 C 臂結果一致且更強——實務工作流（強腦 park→冷啟動 catchup）達到滿分重建。catchup 的下限問題（純 git 11/20）在有 park 的工作流裡實測消失。

## 侷限（誠實標記）

- 路由測試是「description→選擇」的靜態盲測，非 Claude Code 真實觸發管線；但兩臂同法，對照有效。
- 往返測試 n=1（本 session 自身），且 HANDOFF 由設計者本人撰寫；跨 session、跨作者的重複觀察留給日常使用累積。
- 三組測試皆在批次落地當日執行，長期漂移（描述變 stale、ledger 淤積）不在本次範圍——那是 /shape:reconcile 與 ratchet 的職守。
