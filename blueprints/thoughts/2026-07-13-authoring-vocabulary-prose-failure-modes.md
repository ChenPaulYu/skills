# Authoring 詞彙表 — skill prose 怎麼失效,把詞釘進本 repo 的實例

> **TL;DR**: mattpocock/skills 的 writing-great-skills skill 建了一套「skill prose 怎麼失效」的正式詞彙(Premature Completion / Negation / No-Op / Sediment / Sprawl / Leading Word / Completion Criterion),本文把每個詞對應到本 repo 已觀察到的具體案例——多半是本 repo **憑直覺已經做對(或半做對)**的事,只是沒有名字可指認、傳承、檢查。提案:root `CLAUDE.md` 的 Authoring conventions 加一節收留這套詞彙(單一 owner),各 plugin 引用而非各自重述。
>
> **狀態**：已 graduate → [ADR-069](docs/adr/069-adopt-prose-failure-vocabulary-plus-the-tell-column.md) · owner 檔 `plugins/nav/skills/compose/references/authoring-failure-modes.md` · 2026-07-13
>
> **來源**: [mattpocock/skills](https://github.com/mattpocock/skills) 的 [writing-great-skills SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-great-skills/SKILL.md) + 同目錄 [GLOSSARY.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-great-skills/GLOSSARY.md)(本文透過 WebFetch 讀取,定義為轉述而非逐字複製)

## 為什麼接這套詞彙,不是重新發明

本 repo 的創始 ADR 就寫著這個血緣:「Following Matt Pocock's `mattpocock/skills`」(`docs/adr/001-plugin-shape-and-naming.md`)——當初借的是他的 plugin 命名慣例。這次調研等於回頭再借一次,借的是他後來為 **prose 本身怎麼失效**建立的詞彙。本 repo 至今沒有這套詞彙,結果是:同一種失效模式在不同 skill 裡各自被撞見、各自被修好,但彼此認不出對方在講同一件事(rule ① 的一種變體——不是事實重複,是**命名重複發明**)。

## 逐詞對照(假設:每條「本 repo 實例」都是本次調研的個案觀察,不是窮舉)

### Premature Completion — 趕著宣告完成、跳過剩餘步驟
定義(轉述自 SKILL.md):模型因為後面步驟先進入視野而提早結束當前步驟;解法是把 Completion Criterion 磨得更銳利,若這一步本質模糊,就用拆分把後續步驟先藏起來。

- **本 repo 一手實例**:`plugins/nav/skills/plan/SKILL.md` 的 Anti-patterns 表(L191–201)裡至少三行是同一失效模式的不同分身,已被獨立收斂,只是沒有共同名字——"I'll skip Stage 2 — I can guess what the user means"、"I'll execute step 1 while I'm here, the plan is obvious"、"I'll skip Stage 4 — the next step is obvious"。三句話都是「提早喊完工」的變體(跳步驟 / 混合驗收與執行 / 省略最後一步)。
- **跨 repo 印證(假設,非本 repo 檔案內的一手實例,是消費端的野外案例)**:一個 sibling 私有專案的 `CLAUDE.md` 寫著「這條鐵律很容易被跳過(2026-07-10 連續兩次忘記,被使用者提醒才想起來)」——這條鐵律指的正是本 repo 輸出的 `/nav:do` / `/nav:plan` 路由判斷。同一份批次計畫 `blueprints/plans/2026-07-13-fable-rethink-skills-batch.md` 的 Context 也把它列為根因之一(痛點 #4)。
- **落點**:Completion Criterion 是解藥,本任務本身就是活教材——這篇 W2 文件受 plan.md「Verification — Fable review 清單」7 條把關,寫作過程等於在演練這個詞。

### Negation — 禁令反而喚起被禁行為
定義:prohibition 本身把被禁的行為變得更容易被想起(「別想大象」);教義是正向目標為主,禁令只留給硬護欄,且必須配一個正向替代動作。

- **本 repo 實例**:`plugins/shape/skills/elicit/SKILL.md`(L84–99)與 `plugins/nav/skills/plan/SKILL.md`(L191–201)都用「Temptation │ Why to refuse」兩欄表,本質是 9–11 條密集禁令——Negation 風險的教科書形狀。但多數行**已經半符合教義**:Why 欄尾巴常順手帶一句正向替代動作,例如 elicit 的「Stand up a fork instead.」「Exit on the snap, not the list.」「Ground the fork in real code or it isn't sharp.」
- **具體缺口(逐字引用,非轉述)**:至少兩行只寫了「為什麼不准」,沒寫「那要做什麼」:
  - elicit 表格第 94 行:「Auto-fire on any uncertainty」→「It's summoned. Grilling unbidden is the anti-feature.」(重述規則,沒有顯式的替代動詞)
  - nav:plan 表格第 196 行:「I'll write the plan straight to disk without asking where」→「Surprising. The user has a convention; respect it」(「先問」是隱含的,沒寫成動作)
- **結論(假設)**:本 repo 目前把「正向替代」塞進同一個 Why 欄位的尾巴,靠作者自律,不是結構強制——缺的不是教義理解,是**第三欄**(或欄位內的固定小節)把「改做什麼」變成必填。

### No-Op — 讀了等於沒讀、不改變行為的句子
定義:相對模型預設行為沒有差異的指令,如「be thorough」這種弱詞,應換成更硬的字(如「relentless」)。

- **本 repo 觀察(假設,單次 grep、非窮舉)**:對全部 `plugins/*/skills/*/SKILL.md` 搜尋常見弱詞(「be thorough」「be careful」「as appropriate」「carefully」等)零命中。這本身值得記一筆——可能是 rule ④「right grain」的紀律副作用已經頂住 No-Op,也可能只是調研搜尋詞不夠廣、還沒撞到真正的案例。不足以宣稱本 repo 對 No-Op 免疫。

### Sediment — 歷次修補淤積下來的死字
定義:因為捨不得刪而長期堆積的過時、不再相關的行。

- **本 repo 實例(已示範解法)**:`docs/adr/009-consolidate-11-rules-to-8.md` 開頭原句:「The eleven rules grew by accretion and, on review, mixed three different *kinds* of statement under one flat list」——這就是 Sediment 的教科書案例,而且本 repo 已經走過完整解法(辨認出三種不同語句混在一起、合併同構規則、11 條砍到 8 條)。這條 ADR 本身可以直接當 Sediment 詞條的 canonical 案例引用。

### Sprawl — skill 越寫越長本身是失敗模式
定義:篇幅過長即使每行都「有必要」也是失敗;解法是漸進揭露(progressive disclosure)或拆分。Pocock 自己的 grilling skill 只有約 13 行。

- **本 repo 現況與張力(假設,待商榷,不定案)**:root `CLAUDE.md` 已有明確數字門檻——「A `SKILL.md` or CLAUDE.md past ~500 lines, or enumerating many distinct responsibilities, gets split」。目前最長的 `plugins/nav/skills/audit/SKILL.md` 也只有 280 行,離門檻還遠;`research/dissect`(229)、`nav/plan`(219)、`nav/refactor`(206)次之。但 Pocock 展示的單一行為 skill 量級是 ~13 行,跟本 repo 的 500 行門檻差了超過一個數量級。兩種解讀都成立,本文不選邊:(a) 500 行門檻是給「repo 維運文件」校準的,不是給「單一行為 skill」;(b) 本 repo 的 skill 天生比 Pocock 的重(多模式、語言無關、跨 stack 判斷),門檻本來就該不同。留給 Paul 判斷是否要為「單一行為 skill」另立更嚴的門檻。

### Leading Word — 用預訓練裡已有的概念詞壓縮指令
定義:用一個模型已經理解的緊湊詞(如「tight loop」「red-green」「tracer bullet」)取代反覆的散文描述,更省 token 也更容易錨定行為一致。

- **本 repo 實例(已經自然在用,只是沒被指名是同一種修辭工具)**:
  - 「summoned, not automatic」—— `plugins/reflect/CLAUDE.md`、`shape:elicit` 等處反覆原句重用,不是每處重新散文描述。
  - 「one fact one owner」—— `plugins/relay/CLAUDE.md` 引用 `/nav:compose` 紀律時直接沿用這個詞,不重新定義。
  - 「right grain」—— rule ④ 的代稱,一個詞頂住「不要巨石模組、也不要過度拆分」整段散文。
  - 「stop on the snap」—— elicit 的退出判準,一個詞頂住「怎樣算收斂完成」。
  - 「inject → check」—— `/nav:do` 的執行括號,一個詞頂住整套 sub-agent 交接協定。
  - 這些詞已經在扮演 Leading Word 的角色;本文只是第一次把「這是同一種修辭工具,值得刻意重用而非各自散文重寫」講出來。
- **調研素材裡的例句(未能獨立核對原檔路徑,標記為轉述,非逐字驗證)**:diagnosing-bugs skill 的教學句「If you catch yourself reading code to build a theory before this command exists, stop — jumping straight to a hypothesis is the exact failure this skill prevents.」——示範 Leading Word(「seam」「tracer bullet」一類)與硬性 stop 條件如何合寫在同一句。因 GitHub code search 需要登入,本文未能取得逐字原始檔路徑核對,列此僅供參考,不作為 canonical 引用。

## 提案落點

- root `CLAUDE.md` 的 Authoring conventions 加一節,收留這套詞彙(定義 + 一句本 repo 範例),讓 plugin 級 `CLAUDE.md` / `SKILL.md` 之後**引用**(例如「見 CLAUDE.md 的 Negation 條」)而不是各自重新定義或用散文重述——這正是 rule ① 「一個 owner」該管的對象,詞彙表本身也不該有第二個 owner。
- **只提案,絕不動 `CLAUDE.md` 本身**——待 Paul 拍板,落地時建議走 `/nav:compose`。

## 待決 / 假設清單(誠實標記,避免過度承諾)

- Premature Completion 的 tactus 案例是跨 repo 印證,不是本 repo 檔案內的一手實例,引用時要保留這個邊界。
- No-Op「零命中」只是單次 grep 弱詞清單的結果,不是窮舉性證明。
- Sprawl 的 500 行門檻是否校準過鬆,本文不定案,留給 Paul。
- GLOSSARY.md / SKILL.md 原文透過 WebFetch(AI 摘要轉述)讀取,非本機檔案、非逐字複製;diagnosing-bugs 例句的原始檔路徑未能獨立核對。
