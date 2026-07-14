# skills marketplace — plan

> 2026-07-13 · status index (one layer, by status). Only "what to do + which doc".
> design in `thoughts/`; a visual view renders on demand via `/shape:mockup`.

## 🚧 In progress —— 暫無
- **目前沒有在飛的板子需要掛在 In progress。**

## ▶ Next —— 接下來
- **reflect:retro（第 5 成員）** — ADR-056 原則接受 · 先過 vs observe 的界線 elicit＋ADR

## ⏸ Future —— deferred
- **why/what/how 高度診斷（elicit 守門人第四種卡）** — Paul 2026-07-14 提出、方向已選（切對話紀律，不做分類軸——分類軸過不了 No-Op 檢驗）：「層次滑動型卡住」＝分岔立錯樓層（嘴上吵 how、分歧在 why），修法是把 fork 往上抬一層再立，借 `shape:position` 的 altitude instrument（axiom/principle/approach/bet ＋ churn alarm）by protocol，零新 skill。**等刺痛案例**（一場真的因層次滑動爛掉的討論）再落 SKILL.md——elicit 剛動完守門人刀（ADR-076），連續改同一 skill 是 Sprawl 起手式。
- **fixed-structure 藥方順序** — `thoughts/2026-07-13-fixed-structure-learning-curve.md` · 等 Paul 的具體刺痛案例回來續 elicit
- **lifecycle buckets ＋ router** — Paul 於 matt-adoption 範圍裁決時剔除（deferred，非 rejected）
- **frontmatter `model:` 豁口的 validator 檢查** — `thoughts/2026-07-13-dispatch-tiers-consultant-seat.md` §待決

## ✅ Shipped
2026-07-14：**Codex 相容層 Phases 1–6 全部完成**——全 roster 相容覆蓋 **36/36**，能力列數 `browser 3 / explicit 6 / interactive 9 / mechanical 5 / project 1 / session 1 / worker 5`，現在連 Phase 6 的獨立釋出契約也落地：`platforms/codex/manifest.json` 升為 adapter `schema_version=2` / `adapter_release=1.0.0` 的單一 owner，README + site install path 改成受支援的 `node scripts/build-codex.mjs --sync-global --profile <name> --dedupe-global-roots`，新鮮安裝 smoke **2/2**（fresh Codex HOME 安裝 + fresh Claude-side manifests/metadata preservation）已併入驗證門；`--compat-audit` 仍為 **20/20 canaries**、**16/16 negatives**、**3/3** hook smokes、**1/1** preservation smokes、**2/2** release smokes、零 unresolved categories，`--codex-compat` 與預設 validator 皆綠，frozen contract clean，重建 deterministic（`blueprints/plans/2026-07-13-codex-compatibility.md`，`docs/findings/2026-07-14-codex-phase5-coverage.md`，`docs/findings/2026-07-14-codex-phase6-release-smokes.md`）。
2026-07-14：**新增 `nav:tour`**（ADR-082，nav 0.8.4 → 0.9.0，site map rev 78，marketplace 35 → 36 skills）——對話式導覽：三態容錯讀證據（map/header → 非標準文件 → source+git fallback）＋「為什麼」全標 Recorded/Inferred/Unknown，結尾強制丟出 4-7 條可證偽的共同理解句、等使用者糾正、回報分類過的認知差集（Confirmed/Corrected/Missing/Intent-code divergence）——這個強制糾正回合是它沒被 No-Op 檢驗擋下的唯一理由（複核 2026-07-14 elicit 生態系那次對通用 `teach` 的否決仍然成立）。`nav:map` frontmatter 同步收窄,拿掉「onboarding」觸發詞,移交給 tour。Closure probes 現在已補齊：兩個獨立路由 judges 都是 **15/15**，一個無 map / README / ADR 的 sparse 真 git repo 成功走 tier 2+3 fallback，且 Step 5 糾正回合實測產出 **Confirmed/Corrected/Missing/Intent-code divergence** 四類差集；`git status --short` 前後不變（`docs/findings/2026-07-14-nav-tour-routing-probe.md`）。
2026-07-14：**anti-pattern 表 tell 欄掃描完成**（ADR-069 的 optional sweep 收尾）——實際 26 檔（板子估 34 高了），25 檔完成 merged 格式（park 原本就是 canonical），frame 0.6.1／nav 0.8.4／relay 0.8.1／shape 0.9.4，site map rev 77。sonnet 執行；它正確地照 ADR-069「merged not appended」抗命了 brief 的字面「加第三欄」。
2026-07-14：**research 泛化＋能力優先**（ADR-080，research 0.6.0、shape 0.9.3）——物件從「論文」泛化為「論證型文件」（Paul 原則：paper 是文件的一種）；三條下游縫記錄（untangle→position/elicit、critique→probe、survey→deep-research）；deep-research offer 帶量級標示（b 案，ADR-062 實例）；`notes/`／`sources/` 由準契約降為 convention，複用改 tolerant 三態（決策：`thoughts/2026-07-14-research-generalize-argument-docs.md`）。路由探針 follow-up 已跑：12/12 全過（4 非論文觸發＋4 邊界防搶＋4 論文經典零退步，`docs/findings/2026-07-14-adr080-routing-probe.md`）。
2026-07-14：**派工可見性**（ADR-081）——dispatch-tiers 增三件：事前提案閘門（一批一問＋降級閥，借 ADR-040）、回程自報行（⚙ 派工行＋commit 格式，鏡射 ADR-071 自報層級）、使用者 tier 指定壓過預設（持久覆寫=寫進 CLAUDE.md，不是記憶）。Paul 拍板：派工不可見則信任無錨點。
2026-07-14：**relay:register 併入 launch**（ADR-078，relay 0.8.0，marketplace 36 skills）——structure-theatre 剃刀裁決（Paul 拍板選 A）：register 的協定內容（身分/角色兩層、handle 凍結、diff-gate）以 Branch B 形式全數保留在 launch 內；降級案（b）因真實價格（format 擴權＋walked-step 改寫，knowledge≠cue 法則否決便宜版）出局。
2026-07-14：**frame 四鏡人話落地**（ADR-077，frame 0.6.0）——每鏡 protocol 尾端加 walked 落地步（零行話結論+比喻，借 analogize 紀律；禁詞範圍經探針抓漏後擴至整個落地段）。探針 3/4 過（orthogonal/dialectic/graft 落地品質佳）；first-principles 一次禁詞洩漏（已修 spec 歧義）+ 一次未達落地步的冷啟動雜訊,記為 cheap-tier 地板軟點（`docs/findings/2026-07-14-frame-plain-landing-probes.md`）。決策：`thoughts/2026-07-14-frame-plain-landing.md`。
2026-07-14：**elicit 生態系全線落地**（`thoughts/2026-07-14-elicit-ecosystem-four-quadrants.md` · `plans/2026-07-14-elicit-ecosystem.md`）——Phase 1 `shape:survey`（ADR-074）、Phase 2 `shape:probe` + dialectic 橋（ADR-075）、Phase 3 elicit 守門人（ADR-076）、Phase 4 行為實測（`docs/findings/2026-07-14-elicit-ecosystem-probes.md`：路由 15/15、survey/probe 探針 PASS；**守門人探針四輪迭代後記為已知限制**——兩次 wiring fix 各封掉一種實測逃逸、鏈路首次可 fire，但冷啟動 sonnet 0/3 不可靠；實際 elicit 跑 session model，地板≠天花板）。全程 sonnet 執行、判斷席驗收（ADR-067 dispatch tiers 首次全流程實戰）。
2026-07-13：mattpocock 比較調研、ADR-065 lean description 試點（frame -41%）、ADR-066 out-of-scope ledger、ADR-067 派工分層＋顧問席、ADR-068 Codex 凍結圈範圍仲裁、ADR-069 寫作理論 7 詞、ADR-070 /reflect:park＋catchup 取食順位、三組可用性實測全過。（detail in git log）
2026-07-13：fixed-structure-learning-curve 藥方一/二/四落地（ADR-071：契約名單明確化＋tolerant reader 三態＋README 動詞層小抄，`shape:reconcile`/`shape:build` 補一句缺席退化）、invocation-direction-law（W5）盤點後部分吸收（ADR-072：提案 1 落地 CLAUDE.md 一條 bullet＋README Invocation 分桶已套用，提案 3 已被 ADR-065 吸收，提案 2 維持未決——12 處候選違規的裁決留給 Paul）。
2026-07-13：description 減重推廣到其餘 30 skill（ADR-073，5 個 sonnet sub-agent 分 plugin 執行，marketplace 整體 22,484→14,347 字元／63.8%），一併帶上 fixed-structure 藥方三（表述翻轉）——`docs/findings/2026-07-13-description-diet-rollout.md`。
