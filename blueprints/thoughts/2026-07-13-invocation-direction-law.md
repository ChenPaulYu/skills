# invocation 方向律 — model-invocable / summoned-only 的依賴方向

> **TL;DR**: 把 [mattpocock/skills](https://github.com/mattpocock/skills) 的 invocation 依賴方向紀律推廣為本
> marketplace 的通用規則——**summoned-only skill 永不被其他 skill 的散文推薦指向;cross-reference
> 只准指向 model-invocable 的 skill**,每個 skill 明示自己屬哪類。這是給 2026-07-02 那次「elicit 因
> 散文推薦需求交出 `disable-model-invocation`」讓步的一個結構性的家——平台閘門二元、沒有中間態,方向律
> 用「文字規範 + 盤點表」補上。
>
> **狀態**:提案,待拍板。2026-07-13。

## 背景:為什麼是這篇

`blueprints/thoughts/2026-07-02-elicit-summon-widen-not-autofire.md`(必讀,本篇的直接前情)記錄了本
repo 已經親身撞過的一次教訓:`shape:elicit` 曾經是 summoned-only(`disable-model-invocation: true`,
2026-07-01 commit `5bf071f` 加上),但因為 `align`/`dogfood`/`reconcile` 等 skill 的 Companion
skills / 路由散文一直推薦「遇到方向性缺口 → `/shape:elicit`」,而平台的觸發閘門是二元的——沒有
「別的 skill 可以推薦我,但推薦本身不算使用者點頭」這種中間態——鎖住 `disable-model-invocation` 就等於
讓那些推薦全部斷頭。使用者最終選擇拿掉這個鎖,讓 elicit 回到 model-invocable,行為紀律退回自己
`SKILL.md` 裡「Summoned, not automatic」這條**純文字**規範,不再由平台機制強制。目前(本次盤點確認)
`plugins/shape/skills/elicit/SKILL.md` 的 frontmatter 確實沒有 `disable-model-invocation` 這一行。

這次讓步沒有被結構化——它只解決了 elicit 這一個 skill,沒有留下「其他 skill 之後要不要 summoned-only、
可不可以被推薦」的通用判準。本篇要補的就是這個判準。

## Pocock 的原始設計(一手引用)

`github.com/mattpocock/skills` 的 `.agents/invocation.md`(已直接讀取全文,非轉述)這樣定義:

> Every `SKILL.md` in this repo is a skill. The one axis that splits them is **invocation** — who can
> reach it:
> - **User-invoked** — reachable **only by the human typing its name**. Set
>   `disable-model-invocation: true` in the frontmatter. The `description` is **human-facing**: a
>   one-line summary read by a person browsing slash-commands. Strip trigger lists ("Use when the
>   user says…").
> - **Model-invoked** — reachable by **model or user**. The default: omit
>   `disable-model-invocation`. The `description` is **model-facing** and keeps rich trigger
>   phrasing… The test: _could the model usefully reach for this autonomously?_
>
> Because a user-invoked skill has no [trigger-bearing] description, nothing but the human can reach
> it — no other skill can fire it. So a user-invoked skill may invoke model-invoked skills, but it
> can never reach another user-invoked skill.

三個要點,直接映射到本 repo:

1. **單一軸**:invocation 只分兩類,由 `disable-model-invocation` 決定,沒有第三態。
2. **依賴方向強制**:user-invoked → model-invoked 單向;user-invoked 之間不互相到達。
3. **description 的兩種寫法**:user-invoked 的 description 應該是給人看的一句話,**不留 trigger
   list**;model-invoked 才保留豐富的「Fires on …」措辭。這條在本 repo 目前**沒有遵守**(見下方盤點)。

Pocock 的 repo 用 README 把每個 skill 明確歸桶("Bucket `README.md`s … group entries into
**User-invoked** and **Model-invoked**")——這是他的「明示類別」的落地方式。

## 本 repo 現況盤點(實測,非猜測)

### 盤點 1 — 誰是 summoned-only(`disable-model-invocation: true`)

對 `plugins/*/skills/*/SKILL.md` 全量 grep frontmatter,結果(共 6 個,遍布 4 個 plugin):

| skill | plugin |
|---|---|
| `nav:refactor` | nav |
| `reflect:catchup` | reflect |
| `reflect:observe` | reflect |
| `reflect:summarize` | reflect |
| `shape:build` | shape |
| `shape:setup` | shape |

其餘 26 個 skill(`shape:elicit` 在內)都是預設 model-invocable。

### 盤點 2 — cross-reference 方向表(誰推薦誰)

對全部 SKILL.md 抓 `/nav:` `/shape:` `/reflect:` `/relay:` `/research:` `/frame:` 形式的引用,依
「目標是否 summoned-only」與「來源是否 summoned-only」交叉分類。**方向律下的候選違規** = model-invocable
skill 的正文/Companion 區塊指向一個 summoned-only 的目標:

| summoned-only 目標 | 被 model-invocable skill 推薦(候選違規) | 被 summoned-only skill 推薦(合規) |
|---|---|---|
| `nav:refactor` | `nav:audit`、`nav:do`、`nav:map`、`nav:plan`、`nav:sync`、`shape:reconcile` | `shape:build` |
| `reflect:catchup` | 無 | `reflect:observe`、`reflect:summarize` |
| `reflect:observe` | `nav:compose`(見下方註) | `reflect:catchup`、`reflect:summarize` |
| `reflect:summarize` | 無 | `reflect:catchup`、`reflect:observe` |
| `shape:build` | `nav:do`、`shape:dogfood`、`shape:elicit`、`shape:mockup` | `shape:setup` |
| `shape:setup` | `shape:align` | 無 |

觀察:
- **`reflect` 家族內部完全自洽**——三個 verb 互相推薦,但沒有任何 model-invocable skill 推薦
  `catchup`/`summarize`(只有 `observe` 被 `nav:compose` 提了一次,而且是弱案例——見下)。這印證
  CLAUDE.md 已經寫的「Summoned, not automatic」精神,在 reflect 家族已經是實踐,只是沒有推廣。
- **`nav:refactor` 被整個 nav 家族(加上 `shape:reconcile`)當成標準的「若要動結構,請自己去跑
  `/nav:refactor`」收尾句**——這是 disambiguation,不是自動鏈式呼叫(本 repo 本來就有
  「skills don't invoke each other」的既有不變量,見下),但方向律若要落地,這 6 處都要重新檢視措辭。
- **`shape:build` 被 4 個 model-invocable skill 當成路由終點**(`nav:do` 的 twin-比較表、
  `dogfood`/`elicit`/`mockup` 的 offer 分支)——這批本身多半走 ADR-007/015 的
  `AskUserQuestion` offer 模式(見下),風險比純散文提及低,但仍是方向律要處理的對象。
- **`nav:compose` → `reflect:observe`** 是最弱的一個案例:讀原文(`compose/SKILL.md` 的
  Companion skills 區塊)是「`/shape`、`/reflect:observe`、`/research`… authors their documents
  to compose's discipline」——這是「誰採用我的規範」的陳述,不是「接下來去跑 observe」的路由,語意上
  跟其他案例不同,不確定是否該算違規(標為假設,留給 Paul 判斷)。

### 盤點 3 — 既有的部分解法(此假設需要與此對照)

本 repo 並非對這個問題毫無防備,兩個既有機制值得注意,方向律必須跟它們對齊而不是疊床架屋:

1. **「skills don't invoke each other」是既有不變量**(`docs/adr/007-offer-next-action-pattern.md`
   引 ADR-001 #3;`docs/adr/015-converge-verbs-offer-align.md` 稱其為 "marketplace + shape
   invariant")——任何 SKILL.md 裡「invoke `/X`」「hand to `/X`」的措辭,本來就只是**寫給執行中的
   agent 或使用者看的建議文字**,不是程式化呼叫。
2. **ADR-007(offer-next-action)+ ADR-015(auto-offer, not auto-call)** 已經提供了一種「推薦但不
   自動執行」的中間態:用 `AskUserQuestion` 收斂一次明確點頭,而 2026-07-02 那篇 thought 的收斂結論
   ——「使用者在 AskUserQuestion 選中某 summoned-only skill,應視同 summon」——跟 ADR-007/015 的
   offer 模式其實是同一個機制家族。但那篇 thought 自己在文末承認**這條「AskUserQuestion 選中算
   summon」的協定,尚未落地、不知道該放哪個檔案**("下一步(未落地,交給後續)")。

**這是一個重要假設(未經 Paul 確認)**:上表列出的「候選違規」裡,真正有風險的子集合,可能不是全部 6+1+4+1
= 12 處,而是**沒有走 ADR-007/015 offer gate、純粹敘述性收尾句**的那些(本次抽查 `nav:audit`/
`nav:do`/`nav:map`/`nav:plan`/`nav:sync`/`shape:reconcile` 對 `nav:refactor` 的引用,確認都是敘述
收尾句,不是 `AskUserQuestion` offer)。走 offer 模式的(如 `shape:dogfood`/`shape:elicit`/
`shape:mockup` 對 `shape:build`)已經有一次明確點頭當中間態,方向律要不要放行這批,是留給 Paul 的判斷
題,不在本篇定案。

### 盤點 4 — 哪些該補宣告

1. **6 個 summoned-only skill 的 description 全部保留了 model-facing 的 trigger 措辭**
   (`nav:refactor`「Also fires when the user mentions…」、`reflect:catchup`/`observe`/
   `summarize` 皆用「Fires on "…", "…"…」、`shape:build`/`shape:setup` 同樣寫法)。按 Pocock 的
   規範,summoned-only 的 description 應該是**給人看的一句話,不留 trigger list**——目前這 6 個都沒
   照做。這段 trigger 文字現在對模型選擇沒有作用(`disable-model-invocation` 已經擋掉了),但保留它會
   讓「這是不是 summoned-only」這件事只能靠翻 frontmatter 才看得出來,讀 description 本身看不出。
2. **`README.md` 的「Invocation」一節目前把全部 32 個 skill 平鋪列出**(`/nav:audit`、
   `/nav:refactor`… 一路列到 `/relay:settle`),**沒有像 Pocock 的 repo 一樣把條目分桶成
   User-invoked / Model-invoked 兩組**。這是全 repo 唯一一處「一眼看全貌」的地方,目前看不出誰是
   summoned-only。
3. **沒有任何 SKILL.md 正文寫出「我是 summoned-only,其他 skill 不該把我當推薦終點」這句自我宣告**——
   目前這個事實完全鎖在 frontmatter 裡,一個新寫 Companion skills 段落的作者,沒有任何就近的文字提示
   會去檢查目標 skill 是不是 summoned-only。

## 提案(待拍板)

1. **每個 skill 明示自己的類別**——最小改動:在 `README.md` 的 Invocation 一節,把每個 plugin 底下的
   條目分成兩組(比照 Pocock 的 bucket 做法),summoned-only 的一組額外標注「僅限使用者手動輸入
   `/<skill>` 召喚,其他 skill 不推薦」。frontmatter 已經是 source of truth,這步只是讓它在文件裡
   **可見**。
2. **cross-reference 方向規則**:新寫或修改 Companion skills / 路由段落時,目標 skill 若是
   summoned-only,只能用兩種寫法之一——(a)明說「使用者可自行輸入 `/X`」,不寫成收尾指令句;或
   (b)走 ADR-007/015 的 `AskUserQuestion` offer,讓選中動作本身成立為 summon(呼應 2026-07-02
   thought 的收斂結論,順便把它「未落地」的那句協定給落地)。**不再允許**像目前 `nav:audit` 等 6 處
   那樣的裸露「invoke `/nav:refactor`」收尾句(假設性精修,需要 Paul 核可這條的嚴格度)。
3. **6 個 summoned-only skill 的 description 瘦身**:拿掉「Fires on "…"」式的 trigger list,換成
   一句人看的摘要(這條是照抄 Pocock 的規範,風險低、影響小,適合列入下一輪 `/nav:do`)。
4. **與 2026-07-02 thought 的關係要寫清楚(已在上文陳述,此處收尾重申)**:那次事件是這條方向律最好的
   本地證據——它證明了平台閘門二元、沒有中間態,所以「拿掉鎖」曾經是唯一能保住散文推薦通路的辦法。方向律
   不是要推翻那次讓步(elicit 現在保持 model-invocable 是合理的——它被大量 model-invocable skill
   當作方向性缺口的路由終點,這正是方向律允許的方向:model-invocable → model-invocable),而是把「其他
   6 個 summoned-only skill 要不要、能不能被同樣推薦」這件事講清楚規則,避免下一個 skill 又要重新
   吵一次同樣的架。

## 開放題(不在本篇定案)

- 「候選違規」12 處裡,走 ADR-007/015 offer gate 的子集合(`shape:dogfood`/`elicit`/`mockup` →
  `shape:build`)要不要算違規——留給 Paul。
- `nav:compose` → `reflect:observe` 那個「誰採用我規範」式提及算不算方向律管轄範圍——留給 Paul。
- description 瘦身(提案 3)雖然風險低,但要不要一次做完 6 個,還是先做 1 個當範例——留給後續
  `/nav:do` 決定範圍。

## 引用來源

- `blueprints/thoughts/2026-07-02-elicit-summon-widen-not-autofire.md`(本篇的直接前情,已通篇讀取)
- `github.com/mattpocock/skills` `.agents/invocation.md`(已直接讀取全文,commit 對應
  `c434516`,`gh api repos/mattpocock/skills/contents/.agents/invocation.md` 取得)
- `docs/adr/007-offer-next-action-pattern.md`、`docs/adr/015-converge-verbs-offer-align.md`
  (本 repo 既有的 offer/gate 機制,方向律的落點必須與其對齊)
- `plugins/*/skills/*/SKILL.md` 全量 grep(frontmatter + cross-reference),本次盤點的一手資料
