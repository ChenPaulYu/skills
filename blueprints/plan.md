# skills marketplace — plan

> 2026-07-13 · status index (one layer, by status). Only "what to do + which doc".
> design in `thoughts/`; a visual view renders on demand via `/shape:mockup`.

## 🚧 In progress —— frame 人話落地
- **frame 四鏡人話落地** — Paul 2026-07-14 拍板（B 型痛：結論是行話寫的；四鏡齊上不試點）：每鏡 protocol 尾端加一個 walked step——一句零行話結論+一個比喻（借 analogize 紀律 by protocol），機械判準＝落地段禁用該鏡自身術語。決策：`thoughts/2026-07-14-frame-plain-landing.md`。待：sonnet 執行 + ADR-077 + 探針驗收。

## ▶ Next —— 接下來
- **reflect:summarize 退役** — Paul 2026-07-14 拍板刪除：No-Op 檢驗不過（模型不裝 skill 也會做完整回顧），護城河最淺（對照 catchup 的三態機器/park 的落檔）。做法：ADR（引 ADR-021 doctor 退役先例）＋移除 SKILL.md＋全套 gate 反向（reflect 版本 bump、README、site map 中英、mirror regen）。**等 elicit 生態系四 phase 落完再動**（避免與在飛 sub-agent 撞 gating surfaces）。
- **relay:launch＋register 合併案（待 Paul 裁決）** — 兩個結構動詞踩 structure-theatre 剃刀（本體＝建資料夾＋改 yaml，觸發頻率趨近零）；修法候選：register 併入 launch 分支，或雙雙降級為 relay/CLAUDE.md 協定說明。2026-07-14 冗餘掃描提出，未拍板。
- **Codex Phases 1–5：行為相容編譯** — 讓 build-codex 降轉/剝除 Claude-only 語意，並把 `ratchet_ledger` 兩筆 bump 收回（`blueprints/plans/2026-07-13-codex-compatibility.md`，另一條工作線）
- **anti-pattern 表 optional sweep** — 34 檔補「Instead — and the tell」欄，機械掃、cheap tier（ADR-069）

## ⏸ Future —— deferred
- **why/what/how 高度診斷（elicit 守門人第四種卡）** — Paul 2026-07-14 提出、方向已選（切對話紀律，不做分類軸——分類軸過不了 No-Op 檢驗）：「層次滑動型卡住」＝分岔立錯樓層（嘴上吵 how、分歧在 why），修法是把 fork 往上抬一層再立，借 `shape:position` 的 altitude instrument（axiom/principle/approach/bet ＋ churn alarm）by protocol，零新 skill。**等刺痛案例**（一場真的因層次滑動爛掉的討論）再落 SKILL.md——elicit 剛動完守門人刀（ADR-076），連續改同一 skill 是 Sprawl 起手式。
- **fixed-structure 藥方順序** — `thoughts/2026-07-13-fixed-structure-learning-curve.md` · 等 Paul 的具體刺痛案例回來續 elicit
- **reflect:retro（第 5 成員）** — ADR-056 原則接受 · 先過 vs observe 的界線 elicit＋ADR
- **lifecycle buckets ＋ router** — Paul 於 matt-adoption 範圍裁決時剔除（deferred，非 rejected）
- **frontmatter `model:` 豁口的 validator 檢查** — `thoughts/2026-07-13-dispatch-tiers-consultant-seat.md` §待決

## ✅ Shipped
2026-07-14：**elicit 生態系全線落地**（`thoughts/2026-07-14-elicit-ecosystem-four-quadrants.md` · `plans/2026-07-14-elicit-ecosystem.md`）——Phase 1 `shape:survey`（ADR-074）、Phase 2 `shape:probe` + dialectic 橋（ADR-075）、Phase 3 elicit 守門人（ADR-076）、Phase 4 行為實測（`docs/findings/2026-07-14-elicit-ecosystem-probes.md`：路由 15/15、survey/probe 探針 PASS；**守門人探針四輪迭代後記為已知限制**——兩次 wiring fix 各封掉一種實測逃逸、鏈路首次可 fire，但冷啟動 sonnet 0/3 不可靠；實際 elicit 跑 session model，地板≠天花板）。全程 sonnet 執行、判斷席驗收（ADR-067 dispatch tiers 首次全流程實戰）。
2026-07-13：mattpocock 比較調研、ADR-065 lean description 試點（frame -41%）、ADR-066 out-of-scope ledger、ADR-067 派工分層＋顧問席、ADR-068 Codex 凍結圈範圍仲裁、ADR-069 寫作理論 7 詞、ADR-070 /reflect:park＋catchup 取食順位、三組可用性實測全過。（detail in git log）
2026-07-13：fixed-structure-learning-curve 藥方一/二/四落地（ADR-071：契約名單明確化＋tolerant reader 三態＋README 動詞層小抄，`shape:reconcile`/`shape:build` 補一句缺席退化）、invocation-direction-law（W5）盤點後部分吸收（ADR-072：提案 1 落地 CLAUDE.md 一條 bullet＋README Invocation 分桶已套用，提案 3 已被 ADR-065 吸收，提案 2 維持未決——12 處候選違規的裁決留給 Paul）。
2026-07-13：description 減重推廣到其餘 30 skill（ADR-073，5 個 sonnet sub-agent 分 plugin 執行，marketplace 整體 22,484→14,347 字元／63.8%），一併帶上 fixed-structure 藥方三（表述翻轉）——`docs/findings/2026-07-13-description-diet-rollout.md`。
