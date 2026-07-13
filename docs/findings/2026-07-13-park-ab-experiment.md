---
date: 2026-07-13
status: confirmed
---

# park A/B 實驗 — 交接單 vs 隨手筆記 vs 純 git:why 不寫下來就會被編造出來

> 對 `blueprints/thoughts/2026-07-13-reflect-park-writes-the-handoff.md`(park 提案)的實驗檢驗。
> 設計:Fable · 執行:6 個互盲的 Sonnet 受測 agent + 1 個 Sonnet 裁判 · 2026-07-13。

## What I tried

3 臂 × 2 情境。兩個合成的「做到一半」git repo(filewatch:polling→事件驅動 mid-refactor;prefsvc:JSON→SQLite 已決策未實作),各複製三份:**A 臂**只有 repo(= 現況 catchup 的 floor)、**B 臂**加一份無結構隨手筆記(NOTES.md)、**C 臂**加一份 park 規格交接單(HANDOFF.md:五欄+git SHA+已否決路線明確標記)。每個情境埋一個**紅鯡魚**——從 git 看最像下一步、實際已在上個 session 被否決的半成品。6 個受測 agent 互不知情、只拿到 repo 路徑,產出五欄交接報告;獨立裁判只對照答案卷評分(五欄各 0–2、紅鯡魚 PASS/PARTIAL/FAIL、幻覺計數)。

## What happened

| 臂 | 五欄總分(20) | 紅鯡魚 | 幻覺 | 工具呼叫合計 |
|---|---|---|---|---|
| A 純 git | **11** | PARTIAL+PASS | **2** | 19 |
| B 隨手筆記 | **19** | PARTIAL+PASS | 1 | 30 |
| C park 交接單 | **19** | **PASS+PASS** | **0** | 24 |

- **A 臂的失分方式正中提案的預測**:情境 1 的 A 臂把動機編造成「polling 效能差」(答案卷明列的 confabulated-why 陷阱;真因是部署環境檔案系統不支援高頻 stat,code 裡無跡可循),Goal 拿 0,且以確定語氣輸出——**why 不在耐久狀態裡時,agent 不是留白,是編一個像的**。兩條幻覺都出自 A 臂。
- **B 臂逼近 C 臂**(19=19):收工時隨手寫幾句,就拿回了 8/20 的差距——「有寫」本身貢獻了大部分價值。
- **C 臂的增量集中在兩處**:紅鯡魚全過(交接單裡「polling_v2 已放棄勿續作」一句直接消除誤導;B 臂筆記寫「polling_v2 之後該處理一下」反而留了活口,受測者把已否決路線當成懸案,產生該臂唯一的幻覺)+ 全場唯一零幻覺。
- **交接單不省調查成本**:C 臂受測者逐項驗證交接單(trust-but-verify,好行為),工具呼叫不比 A 臂少。park 買到的是 **why 的正確性與誤導的消除,不是速度**。
- 受測者拿到筆記後仍獨立查核、甚至找出筆記沒寫的真 gap(B 臂實測出測試依賴缺漏)——筆記不會讓 agent 偷懶盲信。

## What it means

1. **park 提案的缺口主張成立且比預期嚴重**:純 git 重建不只丟 why,還會**自信地編造 why**(2 條幻覺全在 A 臂)。catchup 的 floor 需要供給側,實驗確認。
2. **最值錢的欄位是「已否決清單」**:C 對 B 的全部增量(紅鯡魚 2×PASS、零幻覺)都來自交接單明確否決死路——五欄結構本身的增量反而小(B 臂無結構也拿 19)。**建議回饋給 park 提案:把「dead ends / 勿續作」從 next/open 欄的附註升格為必填欄位。**
3. 與 authoring 詞彙表(同日 W2 thought)的 Negation 教義有一個值得記錄的張力:交接單裡的**禁令(勿續作+原因)恰恰是實驗中最有效的內容**——Negation 教義管的是 skill prose 的行為引導,交接單記錄的是事實性否決,兩者不同物種,寫 park spec 時別誤用教義砍掉這個欄位。

## Limitations

n=2 情境、每臂單次無變異數;合成教材(一名受測者從 commit 時間戳識破,不影響評分但外部效度打折);B/C 筆記由知道答案的建造者撰寫(真實收工筆記的品質可能更差,若如此 C 對 B 的差距會擴大——結構的強制完整性在疲憊時最有值);裁判單人;無法完全盲(輸出會提及筆記存在,已指示裁判忽略)。
