# elicit 生態系 — 四象限知識狀態與三個裁決

> **TL;DR**:elicit 只服務「我知道我知道」象限;補齊生態系 = 兩個新動詞(`shape:survey` 測繪盲點、`shape:probe` 實驗問現實)+ teach 走路由(不新建)+ elicit 升格守門人(卡住時診斷該挖你/該教你/該問現實,遞出去)。
> 狀態:2026-07-14 elicit 收斂完成,Paul 拍板;實施計畫在 `blueprints/plans/2026-07-14-elicit-ecosystem.md`。

## 一句話原則

**elicit 從「收斂引擎」升格為「收斂的守門人」——它多的不是能力,是誠實:分辨這個問題該挖你、該教你、還是該問現實,然後把裁決以外的事全部遞出去。**

## 四象限(收斂的地基)

| 知識狀態 | 解法 | 負責的動詞 |
|---|---|---|
| 我知道我知道 | 引出來對齊 | `shape:elicit`(現有,不動引擎) |
| 我知道我不知道(世界知道) | 測繪→補課→再對齊 | **`shape:survey`(新)**,使用者主動召喚 |
| 我不知道我不知道(世界知道) | grill 中偵測→offer 測繪 | elicit 守門人偵測 → offer `survey` |
| 我們都不知道 | 設計最小實驗,讓現實回答 | **`shape:probe`(新)** |

## 三個裁決(Paul 2026-07-14)

1. **`survey` 新建**——本尊是「測繪」不是「教學」:核心交付是**差集**(你的地圖 vs 完整地圖,標出缺的軸/點,每個空白區 grounded 到會波及你的證據),教學只是差集上的服務。沒有 diff 的教學會滑回教科書檢查表(任何 chatbot 都做得到,不值得一個動詞)。兩個入口:狀態(2)使用者召喚;狀態(3)elicit 偵測後 offer。
2. **`probe` 新建**——「誰都不知道」的分岔沒得教也沒得引,只能問現實。鐵證:本 repo 已手工跑過至少三次(park A/B、51 句盲測路由、tolerant-reader 三態探針)= ADR-038「一再手工生產某交付物即缺動詞」的觸發條件;且 `frame:dialectic` 收尾「name the deciding experiment」點完名沒人接手跑——斷頭交接,probe 收掉。
3. **teach 不新建,走路由**——「灌 context」是 `frame:analogize` 本業,「一起 align 外部資料」是 `deep-research` 本業;缺的從來是「知道該教什麼」,那是 survey 的差集輸出。teach 若只是「叫 analogize 來講」就是下一個 nav:doctor(too thin,ADR-021 退役理由)。

## elicit 守門人定位(法庭比喻)

法官(使用者)在庭上裁決,elicit 是法庭程序;背景不清就傳專家證人(survey),事實有爭議就送鑑定(probe)——**專家和鑑定報告都不做判決,裁決權從頭到尾不離開法庭**。落到行為:volley 卡住時多一個診斷義務,分三種卡:

1. **你有,但糊** → 繼續 grill(現有引擎不動)
2. **你沒有,但世界有** → 誠實喊停,offer `survey`,補完帶地圖回來
3. **誰都沒有** → 再吵一百輪也不會有答案,offer `probe`,拿證據回來裁決

好處全踩既有家法:不複製收斂引擎(N+1);偵測寄生在唯一在場的動詞(解「沒人會召喚掀盲點 skill」死結);offers 不 calls。

## 組合技(meta-skill 借協定,ADR-008 先例 = shape:position)

| 動詞 | 借的鏡頭 | 借來幹嘛 |
|---|---|---|
| `survey` | `frame:orthogonal` | 地圖 = 正交軸集而非檢查表;「動一軸其他不動」是維度集的驗收標準;差集以「缺軸/缺點」報告 |
| `probe` | `frame:dialectic` → `frame:first-principles` → `frame:orthogonal` | 找承重假設 → 剝到可測公理 → 控制變因設計(orthogonal 的獨立性驗證字面上就是控制變因實驗的定義) |
| `elicit` | `frame:first-principles`(既有 move 2) | 不變 |

frame 家在生態系裡是**鏡頭庫**——零新增。

## 邊界防撞(ADR 要寫透的)

- **survey** vs `nav:map`(repo 結構圖 vs 決策空間圖)、vs `deep-research`(外部研究報告 vs 你的覆蓋差集)、vs `nav:audit` Mode 2(codebase 可行性 vs 你的知識完整性)。
- **probe** vs `shape:mockup`(偏好可裁決 render vs 事實可裁決 experiment——同一條 spine「converge by a real disposable instance」的兩個面)、vs `shape:dogfood`(已建功能的摩擦 vs 未決分岔的證據)、vs `/verify`(改動的正確性 vs 未知事實)。

## 未決(實施時定)

- 兩動詞的 description 措辭(lean-but-honest,ADR-065/073 紀律)與最終命名確認(bare verb:survey/probe 均合家規)。
- probe 執行腿是否派 sonnet 手(dispatch-tiers ADR-067;實驗設計 = judgment 留 session model,跑腿可下放)。
- `frame:dialectic` 收尾補一句 offer `/shape:probe` 的橋(跨 plugin soft offer,ADR-012 模式)。
