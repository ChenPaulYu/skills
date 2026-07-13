# reflect:park — catchup 的寫入側

> **TL;DR**: reflect 現況 catchup 讀、summarize 讀、只有 observe 寫(且只寫一條 learning)——「游標位置＋為什麼」這個事實在整個體系裡**沒有 owner**。提案新增 `reflect:park`:收工時把 goal/done/now/open/next 五欄(catchup 的鏡像)＋當下 git SHA 寫進耐久狀態,讓 catchup 不再只能從 git 骨架反推。三方外部證據獨立指向同一缺口,依 ADR-018 立案標準(recurrence path)已達標。
>
> **狀態**: 提案,待拍板;「交接單寫到哪」**已於 2026-07-13 由 Paul 經 `/shape:elicit` 裁決**(見下方開放題 1 的裁決記錄),其餘仍待整批拍板。2026-07-13。

## 缺口陳述(提案的心臟)

`reflect` 三個現有成員裡,**catchup 讀、summarize 讀、只有 observe 寫**——而且 observe 只蒸餾「一條可重用的 learning」,不是「我現在做到哪、為什麼」。catchup 的法則寫得很清楚:「grounding is the value, not chat paraphrase」(`plugins/reflect/skills/catchup/SKILL.md`)——這條法則是對的。但問題是:耐久狀態裡**根本沒有 why 可讀**,因為沒有任何 verb 在收工那一刻把它寫下去。catchup 只能從 git log、diff、on-disk 佈局反推「大概做到哪」,反推不出「當時為什麼這樣選」。

一句話:**catchup 讀交接單,park 寫交接單;沒有 park,catchup 永遠只能讀到 git 骨架**。

這不違反 grounding 法則,park 是這條法則的**供給側**——在聊天視窗死掉(`/clear`、compaction、跨 session)之前,把 why 主動搬進耐久狀態,好讓下一次 catchup 有東西可讀,而不是每次都要從 commit message 硬猜。

## 三源證據

三個獨立來源,各自從不同角度撞到同一個結構缺口:

1. **softaworks/agent-toolkit 的 `session-handoff` skill** —— <https://github.com/softaworks/agent-toolkit/tree/main/skills/session-handoff>。固定 10 段模板(metadata / 現況 / 決策 / 下一步 / 已知坑…),存成 `.claude/handoffs/YYYY-MM-DD-HHMMSS-slug.md`;用 `--continues-from` 把多份交接單串成鏈;**復原時比對 git 狀態做過期檢查**(code 動過就知道交接單可能不準)。它有「context 用到 80% 自動觸發」的設計——本提案**明確不採**(見下〈維持 summoned〉)。
2. **Anthropic 2026-03 研究**(轉引,二手來源,原始論文未直接查證):context 用到 **20–40%** 品質就開始退化,接近上限時出現「趕著收尾」(rushed-finish)行為。轉引自 <https://www.mindstudio.ai/blog/context-rot-ai-agents-session-handoff-fix>,照實標註為轉引,尚未溯源到 Anthropic 原始出處。
3. **mattpocock/skills 的 `ask-matt` skill** —— <https://github.com/mattpocock/skills>。把 **~120k tokens** 命名為推理退化的 "smart zone" 界線,規定跨過這條線前要先 `/handoff`,不硬撐到 context 塞滿。

三源各自獨立提出「context 是耗材,退化早於塞滿,需要一個明確的『把 why 搬出去』動作」這同一個結構性缺口,加上本 repo 自己的內部證據(reflect 現況只有 observe 寫、且寫的顆粒度不是「游標」而是「learning」)——依 `docs/adr/018-promotion-gate-is-evidence-not-session-count.md` 的 recurrence path(≥2 獨立目擊即達標,不需湊到 5 次),已達立案門檻。

## 形狀草案(標明是草案,非定案)

- **park = catchup 的鏡像**:寫 `goal / done / now / open / next` 五欄(對齊 `catchup` Step 2 的五個問句),外加當下 **git SHA** 一個 metadata 欄位。
- **catchup 讀到交接單先比對 SHA**:如果目前的 SHA 跟交接單記的不一致,代表 code 又動過了,catchup 要把這份交接單標註「可能過期」,降級成參考而非權威來源——這點直接借鏡 softaworks 的過期檢查機制。
- **維持 summoned, not automatic**:不做 80% context 自動觸發那一段設計——`plugins/reflect/CLAUDE.md` 明列「auto-summarized / auto-observed every turn is the anti-feature」,park 沒有理由是例外。取而代之的是「油表給人看,人自己喊 park」:例如 statusline 顯示目前 context 用量,人看到大約四成(呼應源 2 的 20–40% 退化線)就自己決定要不要 park。
- **工作節奏**:做一段 → 喊 `park` → `/clear` → 下次 `catchup` 秒接,交接單讀起來不再只是 git 骨架反推,而是收工當下寫下的 why。

## 家族歸屬檢驗 — park 違不違反 reflect 之名?(2026-07-13 追加,Paul 質疑後收斂)

**結論:有一點字面違和,但不違反——判準是 ADR-056 已裁決過的那把尺。**

- **判準是對象,不是氣質**:reflect 收「對象為工作容器本身」的動詞(reflexivity),不是「回頭看」的動詞(tense)——catchup 當初往前看(now+next)也是靠這條進家門。park 收工時寫的是「我這個 session 走到哪、為什麼」,對象百分之百是工作容器。合格。
- **鏡子比喻串起來反而更順**(沿 ADR-056 自己的比喻):catchup=照鏡子、park=離開前把鏡中樣子拍下來、summarize=回放錄影、observe=剪精華。park 進來後家族從「讀讀寫」跛腳組合變**兩對讀寫**(catchup/park=游標、summarize/observe=知識),每個讀動詞都有寫搭檔。
- **反面檢查**:shape 的對象是產品意圖(park 不推進產品);為它另立家族=兩動詞開一戶,違反 right grain。
- **翻案線(誠實預留)**:若 reflect 日後堆進更多 session 管理動詞(resume/pause/checkpoint),那是「continuity 家族」在成形,該拆家。訊號:**當每次都要解釋「為什麼這個也算 reflect」時,就是名字撐不住的時候**——現況 park 的一句話介紹「catchup 的鏡像」不需解釋,名字還撐得住。

## 兩件必須明確標示、本文件不裁決的事

1. **開放題 —— 交接單寫到哪(留給 Paul 走 `/shape:elicit`)**:
   - 獨立 dated handoff note(作者傾向的方向——理由是「游標位置＋為什麼」是一個獨立的事實,值得有自己的家,而不是寄生在別的檔案裡)
   - `blueprints/plan.md` 的 In progress 段(缺點:撞 `/shape:align` 的單一寫者慣例——align 才是 plan.md 的維護者)
   - commit message body(缺點:收工時機不一定剛好落在一次 commit 上,寫入時機受限)
   
   三個選項各有取捨,~~本文件刻意不選,留給 Paul 裁決~~。

   **✅ 裁決(2026-07-13,Paul 經 `/shape:elicit` 拍板)**:採**選項一的單檔變體——工作專案根目錄一張 `HANDOFF.md`,每次 park 蓋掉重寫**,外加 git SHA 章(過期檢查照原草案)。理由:
   - **根目錄=一回來就撞見**:catchup Step 1 本來就 `ls` 根目錄;藏進 `.claude/` 暗格失去便利貼的意義。
   - **單檔蓋寫,不留 dated 檔案鏈**:游標只有最新的有意義,舊游標是 Sediment(歷史另有 owner:git 管做了什麼、observe 管學到什麼)。此處與 softaworks 的 dated-chain 設計分道。
   - **已實測**:park A/B 實驗(`docs/findings/2026-07-13-park-ab-experiment.md`)19/20 的 C 臂用的正是根目錄單張 HANDOFF.md。
   - 另兩案出局:plan.md 撞 `/shape:align` 單一寫者且非每專案有 blueprints;commit body 在「還沒到能 commit 就要停」的主場景寫不了。
   - 小尾巴留實作:HANDOFF.md 要不要 commit 進 git——預設不強制(本地游標),跨機器工作才 commit。

2. **對既有慣例的衝擊 —— 需要正式 ADR**:`plugins/reflect/CLAUDE.md` 現行慣例明寫「Read-only by default, one writer: catchup + summarize never write... only observe writes」。新增 `park` 打破這條「只有 observe 寫」的慣例(reflect 家族會有兩個 writer),這不是本 thoughts 文件能單方面拍板的事——需要走 `/shape:elicit` 收斂形狀之後,補一份正式 ADR 記錄「為什麼 reflect 從單一 writer 變成兩個 writer」,再回頭改 `plugins/reflect/CLAUDE.md` 的慣例描述。本文件只到「提案 + 缺口證據」為止。
