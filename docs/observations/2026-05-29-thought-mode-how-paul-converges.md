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
2. **往下鑽到最根本層** —— 鑽到表面問題底下(provenance 在 reference-card 底下;enablement 在 restriction 底下;affordance 在 H1/H2 底下)。往 principle 收斂。
3. **把模糊壓成命名好的 fork** —— A/B 或 a/b/c,他秒選(「B 這個也是」)。一個 fork 能讓他動;一牆散文不行。
4. **要 friction,不要附和** —— 他留下的是 AI 反駁/重構他的那幾輪(「我可能不同意」)。同意不推進,摩擦才推進。
5. **用版本收斂,終點是一句話** —— 「第三版」、落在可引用的壓縮句(「audio = rich cognitive object」)。residue 是**一行**,不是逐字稿。
6. **短回合,一次一件事** —— 快、短的來回;每輪丟**一個**尖東西,不是 essay。

## 一句話

> 他要的不是「會回答的 AI」,是「**每回合立起最尖的一個東西讓他撞、往下鑽到 principle、再壓成一行**」的 AI —— 一次一刀,不要解完。

## Failure mode(實際踩過)

AI 一旦 **灌內容 / 想解完 / 附和 / 給一牆 essay / 停在表面 framing** → 逆他的紋。本 observation 就是在我犯了「灌內容+想替他解 Crate」之後,他糾正「我要你觀察的是我**怎麼**收斂,不是內容」才浮現的。

## 兩個附帶但重要的點

- **grounding 是品質差異,不是方便。** 同一場思考,錨在 Crate kernel/schema 的(Claude side)逼得出精確 a/b;看不到 code 的(GPT side)是好哲學但飄、碎、listy。這就是「stage 1-2 該從 ChatGPT 搬進 Claude」的鐵證 —— 因為 AI 看得到 code,fork 才尖得起來。
- **residue 要小。** 這個 mode 的產出天生就是「一個命名的 principle + 幾個拍板的 fork」,不是一份 doc → 剛好閃過「沒人看的密 MD」痛。

## What it could become

若 thought 階真的要 skill 化:**這 6 個 move + 那句一行 = 它的 system prompt / behavioral spec**,不是另寫一條 SOP。但它本質是 stance,**先當習慣採用**(下次想 kernel 這種事,在 repo 裡用這個 mode),別急著 skill。

## Evidence / status

- **唯一來源(2026-05-29)**:Paul 分享的兩段逐字稿 —— Crate kernel 決策(moment / Region vs 衍生 Clip / dual projection / immutability 三岔路)+ provenance philosophy(Source→Reference→Thought、enablement-not-restriction、第三版 audio-first)。grounded 側 vs GPT 側的鬆緊對比即證據。
- `raw` —— 一次觀察。重複見到同樣收斂節奏 → 升 `repeated`,並考慮把這 6 點接進 thought-mode 的實作。
