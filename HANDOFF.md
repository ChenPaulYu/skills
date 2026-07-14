# HANDOFF

> git SHA at park time: b507bcbb8794d17bc8ef1e9cee4120551e52ff10 · parked 2026-07-14

## 🎯 Goal
今天整天在做兩條線：①把 skills marketplace 補齊、瘦身、生態系融合（elicit 生態系→frame 人話落地→relay/reflect 瘦身→research 泛化→派工可見性→anti-pattern 掃描）；②讓這個 marketplace 在 Codex 上「行為相容」，不只是格式相容——這是本次 park 的重點，細講在下面。

**Codex 這條線到底在做什麼（白話版）**：這個 repo 本來就會自動把每個 Claude Code skill 轉一份 Codex 看得懂的版本（`.agents/skills/`）——名字改一改、`CLAUDE.md` 換成 `AGENTS.md`，格式對了。但格式對不代表**行為**對：很多 skill 骨子裡用了 Claude Code 專屬的機制（例如彈出選項讓你選 `AskUserQuestion`、派一個子代理去做事、標記「這個 skill 只能手動叫」），這些機制翻譯過去之後，Codex 根本不認得，等於是空氣——使用者以為功能還在，其實悄悄失效了。這叫「假相容」：看起來裝得上，用起來是壞的。

這條 Codex workstream 要做的事，用蓋房子比喻：Claude 那邊的 skill 內容是**建築設計圖**，永遠凍結不能改（`plugins/**`、`CLAUDE.md` 這些檔案這整條工程全程零 diff，用機器驗證過）；我們蓋的是一個**翻譯機／轉接頭**（`scripts/lib/codex-compat.mjs`），把設計圖上「Claude 專屬的零件」換成「Codex 那邊真的能用的等價零件」，換不了的就老實說「這功能在 Codex 上做不到，降級成這樣」，絕不假裝存在。整個工程分五個階段（Phase 0-5），像蓋房子一樣一層一層來：Phase 0 先把問題盤點清楚（哪些零件是假相容）、Phase 1 把翻譯機的骨架搭起來、Phase 2 讓「派工作給別人、再檢查有沒有做完」這件事在 Codex 上也真的能運作、Phase 3-5 還沒做（分別是：把「彈出選項讓你選」這個機制接上 Codex 的等價功能、把「瀏覽器截圖驗證」這種綁定 Claude 工具的能力接上、最後把全部 35 個 skill 都掃過一遍、把稽核從「軟性報告」升級成「不過就擋 commit」的硬規則）。

## ✅ Done
**Skills marketplace 這條線（9 個 commit，8 份 ADR，已全部 push 到 origin）**：
- `shape:survey`（測繪決策空間）+ `shape:probe`（做實驗問現實）兩個新動詞落地，elicit 升格「守門人」——卡住時判斷該挖你、該教你、還是該問現實，三次實測迭代才把「知道規則」真正變成「會執行規則」（knowledge≠cue 定律，今天驗證四次，已寫進 `docs/observations/`）。
- frame 四個推理鏡頭（first-principles/orthogonal/dialectic/graft）尾端加了「人話落地」步驟——結論不准用術語，逼自己講白話+打比方。
- `reflect:summarize` 退役（沒做到「不裝這個 skill 也會做完」以上的事）、`relay:register` 併入 `relay:launch`（兩個都是薄動詞，合併省一個維護面）。
- `research` 家從「只服務論文」泛化成「服務任何論證型文件（RFC/ADR/白皮書都算）」，三條原本斷頭的資料流也接上了。
- 派工可見性機制上線（ADR-081）——以後我要把工作丟給便宜模型做之前，會先跟你提案問過；做完的回報會固定帶一行「⚙ 派工：執行=誰｜判斷=誰」，commit message 也會註記，你不用再猜到底是誰做的。
- anti-pattern 表格掃過一輪，26 個檔案裡 25 個補上「該怎麼做＋怎麼發現自己正在犯」的欄位。

**Codex 相容線（2 個 commit，已 push）**：
- **Phase 1**：把「怎麼把 Claude 專屬機制翻成 Codex 看得懂的東西」這件事，從原本雜在產生器裡的邏輯，抽成一個獨立、可測試的翻譯機（`codex-compat.mjs`）。「這個 skill 只能手動叫」「這個 skill 該用便宜模型做」這兩種標記，原本翻過去會憑空消失，現在會確實轉成 Codex 看得懂的白話說明文字。
- **Phase 2**：「派工作給別人、檢查有沒有真的做完」這件事，在 Codex 上也有了正式的說明書（work-packet 格式）和回條格式（worker-return 格式），而且明文規定「對方說做完了，我不能直接信，要自己重跑一次驗證指令才算數」。另外幫你把 Codex 上「誰扮演什麼角色該用什麼模型」的個人設定（GPT-5.6 當主導、GPT-5.4 做執行/探查/審查）做成範本，放在明確標示「這是你的個人設定，不是公開規則」的位置，也已經去查了 Codex 官方文件確認格式沒寫錯。
- 9 個固定測試樣本（canary fixtures）全過，兩次重新產生結果一模一樣（證明這個翻譯機是穩定的，不是隨機亂翻），凍結的設計圖確認完全沒被動到。

## 📍 Now
工作樹乾淨，`main` 與 `origin/main` 同步在 `b507bcb`。沒有任何在飛或未提交的東西。

順帶做的另一件事：Paul 開了一個新的私有 repo `ChenPaulYu/dotloadout`，存放個人跨機器、跨 agent 的設定（不是這個 skills repo 的一部分，但今天同一個 session 裡一起弄的）——已經建好骨架、盤點過這台機器現有設定、寫了同步腳本並真的在這台機器跑過一次。跟這份 HANDOFF 是兩個獨立專案，只在此順帶一提，供你回來時記得。

## ⚠️ Open
- **Codex Phase 3-5 尚未開始**，本次明確 park 在這裡（見下方 Next）。
- **elicit 守門人的冷啟動可靠度是已知限制**，不是待修的 bug：便宜模型（sonnet）冷啟動測試 0/3 沒能穩定接住「該喊停」的訊號，但這只是「地板」測試——實際 elicit 是跑在正常對話的 session model 上，天花板可能好很多。不要看到這個數字就想再去修 SKILL.md，這個限制已經誠實記錄在 `docs/findings/2026-07-14-elicit-ecosystem-probes.md`，是本輪刻意收工的結論，不是遺留債務。
- **`~/.claude/settings.json` 裡兩個安全姿態欄位**（`skipDangerousModePermissionPrompt`/`skipAutoPermissionPrompt`）要不要跨機器同步，還在等 Paul 拍板——這是 dotloadout 那邊的開放項，不影響 skills repo。

## ➡️ Next
1. **Codex Phase 3——把「彈出選項讓你選」這個機制接上 Codex**：找出所有用到互動選單的 skill（`nav-plan`、`nav-refactor`、`shape-elicit`、`shape-mockup`、`shape-dogfood`、`shape-reconcile`、三個 frame 鏡頭），把選單邏輯轉成 Codex 也能跑的等價形式，同時保住「選之前什麼都不准執行、選項互斥、有推薦選項、可以什麼都不選」這幾條行為規則不能丟。
2. Phase 3 過關後接 Phase 4（瀏覽器驗證能力、session-open 自動感知）→ Phase 5（全 roster 掃過、稽核從報告升級成硬規則）。
3. 每個 phase 一樣照今天的節奏：sonnet 執行 → 判斷席親自重跑驗證（不只信自報）→ commit → push。
