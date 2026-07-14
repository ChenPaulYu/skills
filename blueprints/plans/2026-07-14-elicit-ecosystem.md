# 實施計畫 — elicit 生態系落地(survey · probe · 守門人)

> **TL;DR**:四個 phase,每 phase 一個 commit、validator 綠燈:①`shape:survey` 新 skill ②`shape:probe` 新 skill+dialectic 橋 ③elicit 守門人升級 ④行為實測。設計裁決見 `blueprints/thoughts/2026-07-14-elicit-ecosystem-four-quadrants.md`(單一 owner,本檔不重述 why)。
> 狀態:2026-07-14 規劃完成,未動工。

## 順序原則

**供應商先於守門人**——elicit 的 offer 要指向存在的 skill,所以 survey → probe → elicit 升級,最後實測。每 phase 獨立可 commit(綠燈才走下一個),中斷不留半成品。

## Phase 1 — `shape:survey`(測繪)

**產出**:`plugins/shape/skills/survey/SKILL.md` + ADR-074。

SKILL.md 要件:
- **兩個入口**:summoned(狀態 2:「我要做 X 的決定,但這領域我沒把握,先掃地形」)+ 被 elicit offer(狀態 3)。frontmatter description 照 lean-but-honest。
- **引擎**:① 建完整地圖——雙圖層:領域先驗軸集(借 `frame:orthogonal` 紀律驗收:動一軸其他不動,否則不是軸是檢查表項)+ 現實落差層(對照 repo 實況/既有決策,grounded 到 file:line 級);② 對照使用者的敘述算**差集**(缺整條軸 vs 缺軸上一點,分開報);③ 對差集補課——小洞就地講(白話+比喻),大洞 offer `frame:analogize`(概念灌注)或 `deep-research`(共讀外部資料)——offer 不 call。
- **落檔**:`blueprints/thoughts/<date>-<topic>-survey.md`(進度揭露 shape),明言「此檔是 `/shape:elicit` 的輸入」。
- **邊界段**(NOT 句):vs `nav:map`、`deep-research`、`nav:audit` Mode 2(措辭見 thought 檔邊界節)。
- **cost tier**:judgment-heavy,session model(地圖品質即判斷);偵察腿(掃 repo/查資料)按 ADR-067 派 sonnet 手,報告 grounded in fact。
- **tolerant reader**:讀 blueprints/ 為 convention 三態(ADR-071)。

ADR-074 要件:為何存在、與三個鄰居的 overlap 防撞、trigger 不搶戲的理由、雙入口設計。

## Phase 2 — `shape:probe`(實驗)

**產出**:`plugins/shape/skills/probe/SKILL.md` + ADR-075 + `frame:dialectic` 收尾橋接一句。

SKILL.md 要件:
- **觸發**:一個分岔誰都答不出來(elicit offer 過來),或使用者直接召喚「做個小實驗確認 X」。
- **設計鏈**(借協定,ADR-008 模式):`dialectic` 找承重假設 → `first-principles` 剝到可測公理 → `orthogonal` 控制變因(只動一軸、其他鎖死)。實驗預算花在承重點,不測表面。
- **執行**:最小可信實驗(A/B、探針、盲測——repo 自己的三個手工先例即 canonical examples,寫進 SKILL.md 時去專案名詞化、stack-neutral)。執行腿可派 sonnet 手;**設計與判讀留 session model**。
- **落檔**:findings 風格證據檔(方法+數據+結論),明言證據回流 elicit 裁決。read-only 對產品碼;實驗産物進 scratchpad/獨立目錄。
- **邊界段**:vs `mockup`(偏好 vs 事實,同 spine 兩面)、`dogfood`、`/verify`。
- **live-LLM-cost 訊號**(ADR-062):實驗若 fan-out 呼叫付費 LLM,先報成本再跑。
- `frame:dialectic` SKILL.md 收尾加一句 guarded offer `/shape:probe`(接上斷頭交接)→ frame plugin 版本 bump。

ADR-075 要件:三次手工先例作為 ADR-038 觸發證據、與四個鄰居防撞、dialectic 橋的方向(frame→shape soft offer,ADR-012 模式)。

## Phase 3 — elicit 守門人升級

**產出**:`plugins/shape/skills/elicit/SKILL.md` 編輯 + ADR-076。

改動最小化——**六 moves 與 snap-exit 一字不動**,新增:
- **卡住診斷**一節:volley 卡住時三分(你有但糊→續 grill;你沒有世界有→喊停 offer `survey`;誰都沒有→offer `probe`),法庭比喻一句話版。
- Protocol step 3 補一行:立不起分岔時進診斷,不硬立。
- Step 6 offer 分支+Companion skills 加 survey/probe 兩條。
- Anti-patterns 加一列:「明知使用者缺一塊地圖仍硬 grill」= 拒絕(誠實喊停是義務)。
- description 更新(lean-but-honest,提守門人分流一句)。

ADR-076 要件:為何診斷住 elicit(唯一在場)、為何不複製引擎(N+1)、offers-not-calls。

## 每 phase 共用的 gate 清單(缺一即紅燈)

1. `plugins/shape/.claude-plugin/plugin.json` 版本 bump(Phase 2 另 bump frame)
2. `node scripts/build-manifests.mjs` → `node scripts/build-codex.mjs` → `node scripts/validate-codex-skills.mjs` 綠燈
3. `README.md`:plugin 表 skill 清單 + Invocation 分桶(兩個新動詞均 model-invoked?——survey/probe 是 summoned+offered,**不設** `disable-model-invocation`,入桶 Model-invoked;實施時複核 ADR-072)
4. `docs/site/index.html`:DOMAINS 卡+graph node(**中英兩份獨立改**)、rev bump、FIXED entry、版本 token
5. `plugins/shape/CLAUDE.md` roster(converge 群組加兩員+守門人一句)(Phase 2 另補 frame CLAUDE.md 橋接一句)
6. ADR 落 `docs/adr/`
7. `git status docs/site/index.html README.md` 非空確認

## Phase 4 — 行為實測(repo 文化:出貨後探針)

- **路由盲測**:仿 ADR-073 方法,~15 句邊界短語(survey vs nav:map/deep-research、probe vs mockup/dogfood/verify、elicit 不被搶戲),獨立 sonnet 評審。
- **活體 dogfood**:各跑一次真場景——survey 掃一個 Paul 真的沒把握的決策;probe 跑一個真未決分岔;elicit 演練一次「喊停→offer」。
- 結果落 `docs/findings/`,板子項目移 Shipped。

## 驗收(Completion Criterion,防 Premature Completion)

四個 phase 各自 commit 綠燈+Phase 4 findings 檔存在且三測皆有結論,才算「生態系落地」。任何 phase 中斷,板子如實標注到哪。
