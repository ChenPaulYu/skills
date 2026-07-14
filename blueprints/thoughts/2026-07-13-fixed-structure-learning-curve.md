# shape/nav 的固定資料結構 vs 使用彈性 — 學習成本從哪來

> **TL;DR**: Paul 提出 shape/nav 帶著大量固定的磁碟資料形狀（blueprints 樹、plan.md、headers、map、HANDOFF.md），用起來「要先學會這套」、不夠彈性。本輪 elicit 收斂到一半：把學習成本拆成**資料層**與**動詞層**兩層、立了「契約 vs 慣例」的 fork、盤點發現多數結構原則上已是慣例（soft）——**問題可能不是結構太硬，是「軟」沒有被使用者感覺到**（rule ② 的反面：工件層複雜度洩漏進人的介面）。**未收斂**：缺一個具體刺痛時刻來定藥方方向。
>
> **狀態**: 部分 graduated → [ADR-071](docs/adr/071-contracts-vs-conventions-tolerant-reader.md)（藥方一：契約名單明確化、藥方二：tolerant reader 三態 —— 已落地 in root CLAUDE.md；藥方四：README 動詞層小抄 —— 已落地於 `README.md`「Which verb do I want?」）· 2026-07-13 · 藥方三（表述翻轉）已隨 description 減重推廣落地 → [ADR-073](docs/adr/073-description-lean-rollout-marketplace-wide.md)（全 30 skill 意圖優先改寫）；開放題（具體刺痛案例）保留，未收斂

## 外部共鳴 — 這正是 Matt 的開場白

mattpocock/skills README 對 GSD/BMAD/Spec-Kit 的批評原話：它們「own the process… take away your control」；他主張 skill 要「small, easy to adapt, and composable」。Paul 的體感 = 我們的 shape/nav 在往「框架接管流程」那一側滑。這個張力值得認真對待，不是防衛。

## 拆兩層 — 藥方完全不同

1. **資料層**：得認得 blueprints 樹、plan.md、headers、codebase map、HANDOFF.md 這套「檔案宗教」——本輪 Paul 指的是這層。
2. **動詞層**：34 個動詞哪個時刻喊哪個（router/ask-matt 一類的解法，2026-07-13 matt-adoption 範圍裁決時已被剔除、屬 deferred——若刺痛其實在這層，要回頭翻案）。

## Fork（已立、未拍板）：固定結構是「契約」還是「慣例」？

- **契約** = reader 依賴它，缺了就壞。真契約應維持嚴格＋配 linter/validator（現況實例：relay frontmatter 有 `/relay:format` 伺候、manifest 有 validator 閘門）。
- **慣例** = writer 寫標準形，reader **容忍任意形**（tolerant reader）。現況實例：catchup 的取食順位（有交接單吃交接單、沒有退 git）、nav:plan 對 blueprints 的 soft 偏好（ADR-012/017 明文「偏好，不要求」）。

**盤點結論（2026-07-13 快掃，非窮舉）**：blueprints 樹是 align 自己搭的、headers 是 sync 自己寫的、map 按需渲染、HANDOFF.md 是 park 寫且 catchup 容忍缺席——**幾乎所有結構在原則上已是慣例**；真契約只有 relay 格式與 manifest 這種機器閘門。

## 殺傷力最強的內部證據 — A/B 的 B 臂

park A/B 實驗（`docs/findings/2026-07-13-park-ab-experiment.md`）：**無結構隨手筆記（B 臂）拿 19/20，幾乎追平結構化交接單**；純 git 只有 11。→ **內容寫不寫，遠比格式標不標準重要。** 這直接支持「慣例化（tolerant reader）不會犧牲多少品質，硬格式的邊際價值有限」的方向。

## 目前的工作假設（待刺痛案例檢驗）

問題不是結構太硬，是**「軟」沒有被感覺到**——原則層到處寫著 soft，但使用者體感是「得先學會才敢用」。用 repo 自己的語言講：這是 **rule ②（interface-first / progressive disclosure）的反面教材——工件層的複雜度洩漏進了人的介面**。深模組的標準：人說意圖（「接下來做什麼」「幫我想清楚」），格式歸動詞管；scaffold、遷移、容忍全是動詞的內務。

## 藥方候選（2026-07-13 追加；方向已提、優先序未經刺痛案例驗證）

共同原則：**結構是動詞的內臟，不是使用者的必修課**——人面對的介面只有一句話的意圖。

1. **契約名單明確化（認知層，建議先做）**：root CLAUDE.md 明列真契約清單（relay frontmatter、manifest/生成物、core/ 凍結協定——皆有 linter/validator 伺候），名單外一切結構宣告為慣例（動詞自己搭、自己修、容忍亂放）。一段話、零風險，學習範圍從「整套檔案宗教」縮成「三樣別手改」。
2. **Tolerant reader 三態慣例（行為層）**：每個讀結構的動詞必須三態可走——標準形→照吃；任意形→容忍照吃；缺席→退化路徑＋**自報吃到哪一級**（例：catchup「只有 git 可讀，11 分那級」）。把「軟」從個別動詞的默契升為 repo 級承諾；A/B B 臂 19 分證明容忍任意形不太虧品質。結構因此變加分項不是門票。
3. **表述翻轉（文件層，搭 P2 的車）**：SKILL.md/README 由結構先行改為意圖先行（「告訴我你想做什麼，板子我自己管」）；P2 lean-description 試點驗證後全面推時，把翻轉納入改寫準則，不另開工程。
4. **動詞層小抄（順帶）**：不復活 router——真 router 是模型的 description 觸發，P2 修瘦描述即修路由器；只加 README 頂部「你想幹嘛→喊誰」十行小抄，成本近零。

## 開放題（本文不定案，下輪 elicit 的輸入）

1. **缺一個具體刺痛時刻**：最近哪次想用 shape/nav 卻因「不知道該有什麼檔／格式對不對／怕弄壞結構」而遲疑或繞路？案例長相決定藥下在哪：
   - reader 更容忍（把殘存的硬要求慣例化）
   - scaffold 更自動（動詞把檔案宗教完全收進內務）
   - 其實是動詞層問題 → 復活 router（翻 matt-adoption 的 deferred 案）
2. 若走「慣例化」：哪些結構該**保留**契約地位（直覺候選：relay 格式、manifest、core/ 凍結協定）——名單要逐一過。
3. 「軟」怎麼被**感覺到**：是文件表述問題（處處把 canonical 形狀擺最前面，看起來像必修）還是行為問題（某些動詞實際上硬要求了）？兩者修法不同。**→ 行為半邊已有答案（2026-07-13 三探針實測，`docs/findings/2026-07-13-skills-usability-tests.md` §4）：reconcile/build 缺席退化、catchup 容忍任意形＋紅鯡魚全過——行為層是真的軟。殘餘嫌疑只剩表述層，等刺痛案例定罪。**
