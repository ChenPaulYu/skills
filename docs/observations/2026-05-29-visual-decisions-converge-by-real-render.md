---
date: 2026-05-29
status: raw
---

# Mockup-mode —— Paul 用「真實 render 的候選」收斂視覺決策(不是 spec / ASCII / 結構化選項)

> [[2026-05-29-thought-mode-how-paul-converges]] 的姊妹篇。thought-mode 是 [[2026-05-29-lightweight-spec-pipeline-single-source]] stage 1(口頭收斂)的行為規格;**這篇是 stage 3「mockup」+ build 的視覺收斂規格**。同一個人、同一個「在真實脈絡裡判斷」的 stance,換了媒介:口頭用命名的 fork,視覺用 render 出來的候選。來自 2026-05-29 一整個 Crate UI session(reset-zoom glyph → 卡片型別 glyph → gutter overflow 修正)。

## 核心:他用「真東西」收斂,不用「描述」收斂

Paul 幾乎不靠規格 / 文字 / ASCII 拍視覺板。**每個視覺決策都發生在「我把候選 render 在真實瀏覽器、真實大小」之後**:

- **reset-zoom glyph**:`1:1` → 我排了 10 個候選成真實 20px 按鈕(`−/+` 旁)→ 他選 `=`。
- **concept glyph**:燈泡 / 節點 / 火花 / 菱形 render 在**真實卡標題**上 → 他選燈泡。
- **hover 字樣式 + glyph**:做成**可互動 HTML mockup**(真 hover + 兩個 toggle 對應兩個未定點)→ 他自己撥著比。

最硬的訊號:**他兩次拒絕我的 `AskUserQuestion` 結構化選項**(一次「我想先釐清」、一次直接要求換成 HTML mockup),要的是「先看到真的」。ASCII preview / 描述 / option list **一路輸給真實 pixel**。

## 對照 thought-mode(兩半同一個 stance)

| | thought-mode(stage 1) | 這篇(mockup / build) |
|---|---|---|
| 媒介 | 口頭、命名的 fork(A/B/c) | render 出來的候選(真實尺寸 / 可互動) |
| 他的角色 | refiner / picker | 一樣是 picker —— **目視**挑 |
| AI 的工作 | 立起可被否定的結構讓他撞 | 把候選做成**可看可摸的真東西** |
| residue | 一行 principle | 一個拍板的 pick |

共同 stance:**在真實脈絡裡判斷,不在抽象層判斷。** thought-mode 那條「grounding 是品質差異不是方便」在這裡的對應是「render 是判斷依據不是裝飾」—— 看不到真 pixel 的決策(ASCII / option list)飄、不準,跟看不到 code 的 fork 飄是同一回事。

## AI 該做的 move(build 側)

1. **別用 ASCII / 描述 / 結構化選項先逼他選**;先 render 真候選 —— 瀏覽器真實大小,或可互動 mockup。
2. 候選**並排、真實尺寸、真實脈絡**(放在真卡上,不是孤立小圖)。
3. 把「還沒定的點」做成 **toggle**,讓他自己撥比較,而不是替他決定。
4. **reframe 也出現在這層**:字面是「給更好的 icon」,槓桿常在「這元件**該不該存在** / 在解什麼問題」—— `1:1` 結論是文字比任何 icon 精準;型別標籤結論是「卡的形態已經表了型別,大寫字是多餘 chrome」。← 這是 thought-mode「鑽到最根本層」在 build 側的同一招。flag 語義稅(fit-frame icon 暗示 fit-to-view 但按鈕不 fit)→ 他事後回「你說的有道理」轉向 → **同意不推進、摩擦才推進**也在 build 側成立。

## Refinements(round 2,2026-05-29)—— 對齊後的修正

四刀,推翻/收緊了上面幾條:

1. **mockup 不是 pipeline 的一個 stage,是 probe** —— 它能**在任何高度開火、且會回饋上游**。線性 thought→synthesis→mockup→spec 是錯的框。判準不是「描述判不判得了」(那常常**事前不知道** —— 以為能、build 完才發現不能),而是 **「有疑就 render」**。thought=ontology / mockup=visual 那道牆是**傾向,不是法則**。

2. **三個 trigger,而 C 是主模式(不是第三個):**
   - **A. DECIDE** —— 在 2+ 已知選項裡挑。
   - **B. DE-RISK** —— 動工前驗「想像 == 做出來」。
   - **C. GENERATE / DISCOVER**(本 session 的**主模式**)—— 你連「要比什麼」都還沒有,只給 open 問題(「有沒有簡潔 icon」「concept 要個 glyph」),render **同時長出 + 顯示**選項空間。純 A 這 session 幾乎沒發生 —— 你很少帶成形候選來。

3. **generate 是一半的價值,也是回饋上游的引擎。** skill 的核心**不是「渲染你給的」,是「generate 一組夠發散的候選 + 在真脈絡 render」**。只會渲染給定選項的 skill 會錯過主模式。而 reframe 之所以能回饋 thought,正因為 **generate 把「不要做這個」也當候選 render 出來**(`1:1` 用文字、不要 glyph)—— 你看到「不做」長什麼樣,才改了 ontology。

4. **visual-lock:預設 retire-on-ship + 蓋戳,不維護;壽命隨高度分。**(上面「PROMOTE」講得太慷慨,收緊)
   - **detail / 元件級**:ship 即退役,**real app 變 ground truth**(你的 stale=lie + real-browser-is-truth 直接給的結論)。
   - **結構 / 版型級**(如 option-c):漂得慢、又活在 code 不易投影的高度 → 可續命,**但必須帶 freshness / supersession 戳**(「intent as of <date>,shipped <commit>,細節以 real app 為準」),否則它就是謊。
   - **關鍵差別 vs nav:map**:map 能從 source auto-投影刷新;mockup **不能 auto-regen** → 紀律是「**退役 + 蓋戳**」,不是 refresh。**多數 mockup discard/retire;永久 lock 是罕見的結構例外。**

**Anti-trigger(同樣重要)**:純概念 / ontology / 資料模型決策 → 走 thought-mode,**別 mockup**(media/track 那段就不該 mockup)。

(status 仍 `raw`,但本 session 已多次出現 —— 逼近 `repeated`。)

## 同場加映:這 session 自證的執行紀律(次要,但具體)

- **ground-before-change 反覆抓到看不見的約束**(沒 ground 就會做錯):
  | 撈到的約束 | 沒撈到會怎樣 |
  |---|---|
  | CARD 是 `overflow-hidden` | 跨邊框 hover 膠囊被切掉 → 改掛 wrapper sibling |
  | barrel 註解「glyphs.tsx stays private」 | 破 facade 去 import → 改 inline glyph |
  | LayerGutter 已有 `min-w-0 truncate` idiom | 自創一套 → 該 N+1 reuse 既有 |
  | 控制鈕溢出**只在有 layer 時**出現 | 0-layer demo 騙過去、修錯地方 |
- **全綠 ≠ 對**:4 個改動 typecheck / lint / vitest 全綠,但 overflow bug、clip 約束、膠囊渲染**全是 agent-browser 真實互動才現形**。Crate CLAUDE.md「UI 改動完成標準必含 browser-smoke」又自證一次。
- **驗證的機械工是隱形稅**:agent-browser 飄到 mockup 頁、React 19 `onPointerEnter` 不吃合成事件(要用真實 `agent-browser hover`、別 `dispatchEvent`)、自己留 `--clip` 垃圾檔 —— 好幾個 cycle 耗在**搞定驗證手段**而非改 code。

## What it could become

- **最可能**:`render-to-decide` 接進 thought-mode 姊妹 skill,或直接當 mockup 階的行為規格 —— 規格 = 上面「AI 該做的 4 個 move」。**先不 pre-skill**(守 README 紀律,一次觀察)。
- **次要 candidate(偏 tooling / 可能該進 `findings/`)**:一個可靠的「進 app → 進指定 crate → 定位卡 → hover / 截圖」helper,把驗證機械稅壓下來。已知坑:React 19 合成事件用真實 hover、別 dispatch;`agent-browser open` 有時不導航 → 用 `location.href`;screenshot `--clip` flag 不存在(用 selector 截圖)。

## Evidence / status

- **單一來源(2026-05-29)**:一整個 Crate UI session —— reset-zoom `1:1`→`=`(一個 commit)、卡片型別 glyph + hover chip(另一個 commit)、gutter「Track」truncate + min-width 修正(兩個 commit)。每個視覺定案都前置「render 真候選」;兩次 `AskUserQuestion` 被拒 = 直接證據;HTML mockup(一個私有專案內的 mockup 資料夾,gitignored)= 收斂載具。
- `raw` —— 一次觀察。下個 session 若又看到「先 render 才決策 / ASCII 輸給真 pixel」→ 升 `repeated`,並考慮把 4 個 move 接進 thought-mode 實作。
