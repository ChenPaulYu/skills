# skills marketplace — plan

> 2026-07-13 · status index (one layer, by status). Only "what to do + which doc".
> design in `thoughts/`; a visual view renders on demand via `/shape:mockup`.

## 🚧 In progress —— （本輪批次已全數收尾，無在飛項）

## ▶ Next —— 接下來
- **description 減重推廣到其餘 29 skill 的決定** — 試點 15/15 驗收＋路由 A/B 打平已解鎖（ADR-065 · `docs/findings/2026-07-13-description-diet-pilot.md` · `docs/findings/2026-07-13-skills-usability-tests.md`）；推廣時一併把 fixed-structure 藥方三（表述翻轉，SKILL.md/README 由結構先行改意圖先行）納入改寫準則，不另開工程
- **Codex Phases 1–5：行為相容編譯** — 讓 build-codex 降轉/剝除 Claude-only 語意，並把 `ratchet_ledger` 兩筆 bump 收回（`blueprints/plans/2026-07-13-codex-compatibility.md`，另一條工作線）
- **anti-pattern 表 optional sweep** — 34 檔補「Instead — and the tell」欄，機械掃、cheap tier（ADR-069）

## ⏸ Future —— deferred
- **fixed-structure 藥方順序** — `thoughts/2026-07-13-fixed-structure-learning-curve.md` · 等 Paul 的具體刺痛案例回來續 elicit
- **reflect:retro（第 5 成員）** — ADR-056 原則接受 · 先過 vs observe 的界線 elicit＋ADR
- **lifecycle buckets ＋ router** — Paul 於 matt-adoption 範圍裁決時剔除（deferred，非 rejected）
- **frontmatter `model:` 豁口的 validator 檢查** — `thoughts/2026-07-13-dispatch-tiers-consultant-seat.md` §待決

## ✅ Shipped
2026-07-13：mattpocock 比較調研、ADR-065 lean description 試點（frame -41%）、ADR-066 out-of-scope ledger、ADR-067 派工分層＋顧問席、ADR-068 Codex 凍結圈範圍仲裁、ADR-069 寫作理論 7 詞、ADR-070 /reflect:park＋catchup 取食順位、三組可用性實測全過。（detail in git log）
2026-07-13：fixed-structure-learning-curve 藥方一/二/四落地（ADR-071：契約名單明確化＋tolerant reader 三態＋README 動詞層小抄，`shape:reconcile`/`shape:build` 補一句缺席退化）、invocation-direction-law（W5）盤點後部分吸收（ADR-072：提案 1 落地 CLAUDE.md 一條 bullet＋README Invocation 分桶已套用，提案 3 已被 ADR-065 吸收，提案 2 維持未決——12 處候選違規的裁決留給 Paul）。
