---
date: 2026-05-29
status: raw
---

# Thought-mode —— Paul 跟 AI 收斂的方式(behavioral spec,不是 workflow)

> 這是 [[2026-05-29-lightweight-spec-pipeline-single-source]] 裡「stage 1 — thought」那一階的**行為規格**。它不是一條 workflow,是 AI 該進入的**收斂 stance**。來自觀察 Paul 實際的 AI 對話逐字稿(GPT + Crate/Claude),重點是「他怎麼收斂」,不是談話內容。

## 核心:他用「反應」收斂,不用「產出」收斂

Paul 幾乎不先寫出乾淨的陳述;他**推 AI 搭起來的 scaffold**(「B 這個也是」「這句很關鍵」「我會改寫一下」)。
→ **AI 的工作 = 不斷立起可被否定的結構讓他撞,不是搶著解完。** 他是 refiner/picker,AI 是 proposer;收斂是一場 volley。

## 他獎勵的 6 個 move

1. **先 mirror** —— 重述確認(「我先重述一下,看我有沒有理解對」)再往下。
2. **往下鑽到最根本層,且沿路驗證每個被當作地基的前提** —— 鑽到表面問題底下(provenance 在 reference-card 底下;enablement 在 restriction 底下;affordance 在 H1/H2 底下)。往 principle 收斂。**但 drill 不是純對話內的推理 —— 鑽到一個前提時,要離開對話去撞現實(grep code / 跑 app / 看真實使用)驗證它真假,驗證的結果決定下一鏟挖哪。**(2026-06-01 補:見下「drill 的完整定義」+ [[2026-06-01-verify-the-belief-before-acting-on-it]]。)
3. **把模糊壓成命名好的 fork** —— A/B 或 a/b/c,他秒選(「B 這個也是」)。一個 fork 能讓他動;一牆散文不行。
4. **要 friction,不要附和** —— 他留下的是 AI 反駁/重構他的那幾輪(「我可能不同意」)。同意不推進,摩擦才推進。
5. **用版本收斂,終點是一句話** —— 「第三版」、落在可引用的壓縮句(「audio = rich cognitive object」)。residue 是**一行**,不是逐字稿。
6. **短回合,一次一件事** —— 快、短的來回;每輪丟**一個**尖東西,不是 essay。

## 一句話

> 他要的不是「會回答的 AI」,是「**每回合立起最尖的一個東西讓他撞、往下鑽到 principle、再壓成一行**」的 AI —— 一次一刀,不要解完。

## Failure mode(實際踩過)

AI 一旦 **灌內容 / 想解完 / 附和 / 給一牆 essay / 停在表面 framing** → 逆他的紋。本 observation 就是在我犯了「灌內容+想替他解 Crate」之後,他糾正「我要你觀察的是我**怎麼**收斂,不是內容」才浮現的。

## 2026-06-01 補:elicit 有兩個模式 —— 助產 vs 探勘

上面整篇把 elicit 寫成**純粹以 Paul 為中心的助產**(「他用反應收斂」「他是 refiner/picker」「AI 不要搶著解完」)。那個描述準,但**窄了一半** —— 它假設「本質已經在他腦中,只是還沒講清」。Paul 自己反駁(2026-06-01):*「elicit 除了幫人講出想法,不也該有幫大家釐清本質的時候?」* 對 —— 有兩個模式,同一個收斂引擎:

| | **助產(midwife)** | **探勘(co-excavator)** |
|---|---|---|
| 前提 | 答案在他心裡,AI 逼他講出來 | 答案**還不存在**,要一起鑽到底層才第一次浮現 |
| AI 角色 | 立 fork 讓他撞 | 真的跟他一起把本質挖出來 |
| 上面 6 moves 寫的 | ✅ 全是這個 | ⚠️ 只隱含在 move 2 |

關鍵:探勘模式下,「**驗證一個前提的真假**」不是釐清本質的*前置*動作,**它就是釐清本質的鑽探本身**。(實例:Crate 的 cascade 設計卡很久,真正該釐清的本質是「clip 到底依賴什麼」,而「刪 track 後 audio 會不會洩漏」這個前提的真假 —— grep 一下發現是假 —— 就是通往那個本質的那一鏟。驗證前提 = 鑽本身,不是鑽之前的閘。)

## 2026-06-01 補:drill 的完整定義(move 2 的展開)

> 一度想把「驗證前提」做成 drill **前**的一道獨立閘(暫名 zoom-out / ground-check),通過了才往下鑽。**否決了** —— 它跟 elicit 是同一個收斂引擎(立可被否定的結構、要 friction、grounded、snap 退出),照 [[../adr/013-diagnosis-folds-into-elicit]] 的同一條判斷(同引擎→不另開,N+1),它該**溶進 drill**,不是新東西、不是 move 0。

所以 drill(move 2)的完整形狀:

> **drill = 往下鑽到最根本層 + 沿路 ground 踩到的每個前提。** 鑽到一個被當作地基的前提時,先分類它:① **程式行為**(系統現在做什麼)→ grep/跑,當場驗,假就地結束這條 drill;② **使用行為**(人實際會怎麼用)→ **別在想像中推**,標記「這得 ship+dogfood」,真實使用是比 code 更強的錨;③ **邏輯必然**(從定義推得)→ 可純推,但講出推理鏈讓人能反駁。**鐵則:① 類前提沒驗證過,禁止繼續往下 drill —— 否則是在假地基上鑽**(cascade 那段的根因)。

這把原本「純對話內往下想」的 drill,補上「**鑽到前提就離開對話、撞現實**」的另一半。`ground` 從「錨在 code」擴大成「鑽之前先確認你踩的每塊地基為真」。

## 兩個附帶但重要的點

- **grounding 是品質差異,不是方便。** 同一場思考,錨在 Crate kernel/schema 的(Claude side)逼得出精確 a/b;看不到 code 的(GPT side)是好哲學但飄、碎、listy。這就是「stage 1-2 該從 ChatGPT 搬進 Claude」的鐵證 —— 因為 AI 看得到 code,fork 才尖得起來。
- **residue 要小。** 這個 mode 的產出天生就是「一個命名的 principle + 幾個拍板的 fork」,不是一份 doc → 剛好閃過「沒人看的密 MD」痛。

## What it could become — the `Thought-ground` skill

若 thought 階要 skill 化,名字暫定 **`Thought-ground`**(thought + grounding),且 **這 6 個 move + 那句一行 = 它的 behavioral spec**,不是另寫一條 brainstorm SOP。它是 **on-demand 的 grill-me / 蘇格拉底式釐清**:你召喚才開、不常駐。on-demand 在這裡是 feature 不是冗餘——你不想每次對話都被拷問。

**唯一的核心機制 = weight-adaptive exit:你一 snap 到 principle 就收手。** Superpowers brainstorm 的原罪是「跑完問題清單才停 → 變重 → 你不用」;`Thought-ground` 必須「你撞到了就停」。問題一律 **grounded**(錨在 repo/kernel,不是抽象蘇格拉底 —— 這是它贏過 ChatGPT 的唯一理由)。

(2026-05-29:Paul 判定這是**最該先做的兩個 skill 之一**,另一個是 mockup —— 但**仍先不建**,守 don't-pre-skill。見 [[2026-05-29-lightweight-spec-pipeline-single-source]] 的 Priority 段。)

## Evidence / status

- **唯一來源(2026-05-29)**:Paul 分享的兩段逐字稿 —— Crate kernel 決策(moment / Region vs 衍生 Clip / dual projection / immutability 三岔路)+ provenance philosophy(Source→Reference→Thought、enablement-not-restriction、第三版 audio-first)。grounded 側 vs GPT 側的鬆緊對比即證據。
- `raw` —— 一次觀察。重複見到同樣收斂節奏 → 升 `repeated`,並考慮把這 6 點接進 thought-mode 的實作。
