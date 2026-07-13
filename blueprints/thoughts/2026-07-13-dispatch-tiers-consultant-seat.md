# 派工分層與顧問席 — 強腦坐判斷席，便宜手做偵察與執行，席位認名字不認工具

> **TL;DR**：一條原則統一「advisor 機制」與「強模型規劃、弱模型執行」兩題——**判斷（計畫、驗收、卡點）用強腦，偵察與執行用便宜手；降階的安全條件是下游有強腦驗收點；所有席位用相對名字（session 模型／cheap tier），不寫死工具或模型名**。不新增任何 skill：落點是 ADR-058/059 的延伸慣例＋既有派工點各加一句。
>
> **狀態**：已 graduate → [ADR-067](docs/adr/067-dispatch-tiers-consultant-seat.md) · 2026-07-13 · 由 `/shape:elicit` 收斂（Paul × Fable，四個 fork 逐一拍板）
>
> **關係**：擴充（不取代）`blueprints/thoughts/2026-07-13-rule7-second-door-advisor-escalation.md`——該文的 advisor 第二扇門在本文中泛化為「顧問席」；其軟依賴條款（advisor 不穩的實證與 fallback）已由本日 session 補充（見 matt-adoption plan 的 Rider R1）。

## 決定經過 — 四個 fork 與拍板

### Fork 1：顧問是工具還是座位？ → **座位（capability slot）**

Claude Code 內建 advisor tool 極不穩定（本日一手實證：伺服器旗標已繞過、settings 正確，session 內仍整場 unavailable 且中途不可修）。機制若寫死「呼叫 advisor tool」，存亡就綁在一個 experimental 旗標上。拍板：仿 shape 的 browser-verify capability slot——skill 文件只寫席位名（「顧問席／second-opinion seat」），一個 owner 檔定義解析順位：① advisor tool（看得到完整 transcript，最便宜）→ ② fresh-context 強模型 subagent（inject 卡點＋證據）→ ③ 席位全空退回 rule ⑦ 原門（問使用者／標 uncertain 不斷言）。

### Fork 2：subagent 顧問的姿勢？ → **無傾向派審稿人，有傾向派反方**

subagent 只知道你 inject 的東西，餵法錯了就是回音室。兩種卡點對應兩種姿勢：

- **還沒有答案**（二選一卡住）→ **審稿人**：中立轉交「問題＋正反證據」，**不先講自己傾向哪邊**，請它獨立重算。
- **有答案但不敢信** → **反方**：把目前傾向的結論給它，命令它駁倒（repo 既有 adversarial-verify 形狀）。

鐵律一句：**永遠不把自己的結論餵給審稿人**。

**方向對稱（sonnet session 求 fable 建議）**：模型覆寫是雙向的——強 session 派便宜手（降階），便宜 session 也能派強腦坐席（升階；advisor tool 可用時它是首選，因為只有它看得到完整 transcript——sonnet 主＋fable advisor 正是官方配對規則的設計本意）。升階有個降階沒有的坑：**挑證據給強腦看的是弱腦**，可能挑錯重點。慣例化解法：升階 inject 的是**耐久產物的路徑**（plan 檔、diff、實際檔案），不是弱腦的轉述摘要——讓強腦自己重讀一手資料。

### Fork 3：偵察（讀 code／上網搜）要不要開 scout skill？ → **不開**

偵察是 Agent tool 的用法，不是一套會做錯的協定——skill 的存在理由是「有紀律要焊死」，而「派個便宜 agent 去查」沒有。真正需要紀律的偵察早有 owner（`/nav:audit` 的 fan-out、`deep-research` 的查證流程）。要規範的只有一段回報慣例（帶 file:line／來源 URL、回事實不回感想），併入派工分層慣例即可。

### Fork 4：強腦與便宜手都要可換，UX 怎麼設計？ → **相對命名**

- **換強腦＝換 session，改零個檔。** 判斷席在所有文件裡只叫「session 模型」。換 Fable→GPT-5.6 = 換 harness 開 session（`.agents/skills/` 鏡像已鋪好），**plan artifact（`blueprints/plans/*.md`）是跨廠商接縫**——執行端認檔案不認作者。
- **換便宜手＝改一行。** tier 對照表單一 owner（root CLAUDE.md 一條：「偵察/執行 subagent 預設 `sonnet`」），派工點一律寫 tier 名。
- **臨時換＝派工當下覆寫。** 慣例是預設不是鎖；判斷密集的單步可當場升階。

## 核心原則（residue，一行）

> **強腦坐判斷席（計畫、驗收、卡點），便宜手做偵察與執行；降階的安全條件＝下游有強腦驗收點；席位認名字不認工具，判斷席＝session 模型（換腦＝換 session）、手＝tier 對照一行（換手＝改一行）。**

三類工作的對照（降階判準比列舉耐用——新工作出現只問「它的輸出有沒有人驗收」）：

| 工作類 | 例子 | 模型 | 為什麼安全 |
|---|---|---|---|
| 偵察 | 讀 code、盤點、上網搜 | cheap tier | 產出由強 session 綜合 |
| 執行 | 照 plan 改 code、機械掃 | cheap tier | 產出過 inject↔check 驗收 |
| 判斷 | 計畫、review/check、顧問席 | session 模型 | 產出直接變決定，無人再驗 |

## 落點提案（實作時走 /nav:plan，本文只定方向）

1. **慣例 owner**：root `CLAUDE.md` Authoring conventions 加一條「Dispatch tiers」（原則一行＋tier 對照＋顧問席解析順位）——ADR-058/059 的延伸：cost tier 從「skill 的屬性」長出第二維「派工的屬性」。配一個新 ADR。
2. **派工點各加一句 instance**（不重述準則）：`nav:plan` Stage 4（派 subagent 預設 cheap tier）、`shape:build` 排程（同）、`nav:audit` fan-out（偵察 subagent 同）。
3. **顧問席**併入 rule7-second-door thought 的落地（該文的 root CLAUDE.md bullet 改寫成席位語言＋解析順位），非本文另立。
4. **偵察回報慣例**一段（file:line／URL、事實不感想）併入同一條。

## 附錄 — catchup 歸屬與交接紙條（同日追加收斂）

Paul 提出「catchup 是否搬去 shape／各家族客製自己的 catchup」。收斂結果：**不搬、不客製**。

- **變異點在資料，不在動詞**：park A/B 實驗（`docs/findings/2026-07-13-park-ab-experiment.md`）顯示同一個讀取器，餵純 git 得 11/20＋2 幻覺，餵交接單得 19/20——該客製的是寫入端，不是讀取器。各家族客製 catchup = 三份平行重建引擎（N+1 反模式，同 elicit 拒開 diagnose 的理由）。
- **catchup 留在 reflect 的理由**：reflect 的對象是「工作容器」，park 拍板後家族呈兩組讀寫對——catchup/park（游標）、summarize/observe（知識）。「不合身感」來自 park 未建的單腳懸空，不是放錯家族。
- **紙條分兩種**：①「決定了什麼」——shape/research 各動詞收尾本來就落檔（thought/板子/骨架），不用改；②「停在哪」——跨家族，單一寫入者 park 負責，家族不各自發明格式。
- **要補的兩條便宜接線**：catchup 加「取食順位」段（交接單/板子 → 家族產物 → 純 git，並自報吃到哪一級）；幾個自然收工點（build 信心不足停下、plan 存檔不執行）加一句 guarded 的「要不要 park？」提醒——offer，不 auto。

## 待決 / 誠實標記

- **frontmatter 豁口**：6 個 skill 的 `model: sonnet` 是 harness 讀的字面值，無法引用對照表——換手時須跟改 6 行。建議 validator 加一條「frontmatter 值 ≠ 對照表值 → fail」把豁口變被看守的豁口；是否值得，實作時定。
- advisor tool 的 experimental 旗標在官方全量前的穩定性（承 rule7 thought 開放題 1）。
- 「執行單步判斷密集可當場升階」的判斷標準沒有量化——先靠 dispatch 者的判斷，撞到案例再收緊。
