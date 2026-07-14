# Knowledge ≠ cue — 只有「被走到的步驟」會 fire(2026-07-14,單日四次行為驗證)

> **一句話定律**:寫在 footer、參考段落、或「見上文」指標裡的規則是**被動知識**——模型讀過但不執行;規則只有被寫進「協定裡每次必走的步驟」、且觸發條件是**可觀察訊號**(不是 agent 的自我評估)時,才可靠地 fire。設計 skill 條文時,問的不是「有沒有寫」,是「執行路徑走不走得到」。

## 出處與升格

首次記載:shape CLAUDE.md 的 browser-verify close-contract 註記(「a walked step is a cue, a reference doc is not」)——當時是單一領域的教訓。2026-07-14 一天內四次獨立行為實測把它升格為 repo 級設計定律。

## 四次證據(全部有 findings 檔可溯)

| # | 場景 | 失敗形態 | 修法 | 出處 |
|---|---|---|---|---|
| 1 | elicit 守門人 R1:診斷寫成獨立段落+step 3 一句「fork 立不起來時進診斷」 | tell 完全沒 fire——「立不起來」是自我評估,agent 永遠相信下一個 fork 立得起來 | stall tells(可觀察的使用者用語)寫進 step 3 的動作序列 | `docs/findings/2026-07-14-elicit-ecosystem-probes.md` |
| 2 | elicit 守門人 R2:tell 進了 walked path,但動作寫「run the Gatekeeper diagnosis (above)」 | tell fire 了,動作即興(gut-check 叉、自查 code)——「見上文」指標又是被動知識 | 動作(叫哪個 stall+offer 什麼)綁進**同一句** walked 條文,並封死實測抓到的逃逸 | 同上 |
| 3 | elicit 守門人 R3:條文齊了,但 tell 短語長得像使用者的頓悟 | 模型「獎勵洞察」的本能壓過條文 | 優先權規則:「listed tell 高於你對動能的解讀」(部分有效——冷啟動 cheap tier 仍不可靠,記為地板軟點) | 同上 |
| 4 | frame 四鏡:每鏡都有「白話+比喻」Communication Style footer | 輸出照樣行話——footer 從未 fire | 落地步寫進協定最後一步(walked),配機械判準(落地段禁該鏡術語);探針 3/4 過 | `docs/findings/2026-07-14-frame-plain-landing-probes.md` |

## 設計檢查表(寫 skill 條文時過一遍)

1. **這條規則在哪個步驟被走到?** 不在任何步驟裡 → 它不會執行,只是裝飾。
2. **觸發條件是可觀察訊號還是自我評估?** 「當你發現自己卡住」不會 fire;「當使用者說出 X 類句子」會。
3. **觸發後的動作跟觸發寫在同一句嗎?** 「見上文/見某節」= 又一層被動知識;動作要 inline。
4. **判準機械可驗嗎?** 禁詞清單、必含元素——探針一測就知道;「要寫得白話」測不了。
5. **範圍詞會被鑽字眼嗎?** 「this sentence」漏掉比喻註解(frame 探針實抓);範圍要寫成整段/整個交付物。

## 邊界(誠實記)

- walked step 提高 fire 機率,**不保證**:R3/R4 顯示冷啟動 cheap-tier 模型的本能(獎勵頓悟、要求釐清)仍可壓過條文——條文是地板工程,天花板由執行模型決定(dispatch tiers:judgment 動詞跑 session model 正是為此)。
- 本定律管「行為觸發」;它不否定參考文件的價值——bulky 知識照舊住 references/,但**觸發那一下**必須在 walked path 上。
