# frame 鏡頭的人話落地 — 最後一步強制零行話結論+比喻

> **TL;DR**:四個推理鏡頭(first-principles、orthogonal、dialectic、graft)的輸出對推理誠實、對人類殘忍——結論是行話寫的(B 型痛,Paul 2026-07-14 拍板)。藥方:每個鏡頭的 protocol 加最後一個 **walked step**——人話落地(一句零行話結論+一個比喻,借 `frame:analogize` 紀律 by protocol)。四鏡齊上,不試點。

## 一句話原則

**鏡頭的最後一個動作是翻譯,不是分析:一句禁用該鏡頭自身術語的結論+一個比喻——寫成協定步驟,以「落地段零行話」為機械可驗的判準。**

## 診斷(為什麼是這帖藥)

- **痛點定位**:A 型(結論埋在骨架裡)vs B 型(結論看到了但看不懂)——Paul 拍 B。骨架順序不動,補翻譯層。
- **footer 不 fire 的鐵證**:frame 每個 SKILL.md 都有 Communication Style footer(白話、多比喻),輸出照樣難懂——同日 elicit Probe A 三輪實測的同款病(knowledge≠cue:寫在附註/參考段的規則不觸發,只有 walked step 會執行)。所以藥必須是 **protocol 的最後一步**,不是再加一條風格提醒。
- **翻譯機自家就有**:`frame:analogize` 是家裡現成的「已定概念→人腦」引擎,其他四鏡從未借它——borrow-by-protocol(ADR-008 模式,本日第四次使用)。

## 設計要點(實施時照抄)

1. **每鏡 protocol 尾端加一步**(walked step):「Land it in plain words —— 一句零行話結論+一個比喻(analogize 紀律:比喻要選過、並一句話註明比喻在哪裡斷裂可略);骨架保留在前供驗證。」
2. **機械判準**(防 Premature Completion):落地段禁用該鏡頭自身術語——first-principles 禁「axiom/公理/first principles」、orthogonal 禁「orthogonal/正交/軸(axis)」、dialectic 禁「steelman/dialectic」、graft 禁「graft/primitive/donor」。行為探針可直接驗。
3. **各鏡加一列 anti-pattern**:「以行話句收尾」= 拒絕。
4. **analogize 自身不改**(它整個就是落地);Communication Style footer 保留(不衝突,但不再是唯一防線)。
5. **範圍**:四鏡齊上(Paul 拍板,不試點)——改動是同一個附加步驟、不動引擎,判準機械,一輪探針可四鏡齊驗,pilot 資訊增益不大。

## 驗收

sonnet 執行 + ADR-077 + 全套 gate;行為探針:每鏡 fresh agent 冷啟動跑一題,查(a)落地段存在且在最後(b)零該鏡術語(c)含比喻。全過才收。
