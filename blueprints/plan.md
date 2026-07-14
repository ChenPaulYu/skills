# skills marketplace — plan

> 2026-07-13 · status index (one layer, by status). Only "what to do + which doc".
> design in `thoughts/`; a visual view renders on demand via `/shape:mockup`.

## 🚧 In progress —— （本輪批次已全數收尾，無在飛項）

## ▶ Next —— 接下來
- **elicit 行為優化（兩個方向，待收斂）** — (1) 讓 elicit 主動把使用者「沒意識到自己不知道」的盲點攤出來；(2) 讓 elicit 反過來「教」使用者，幫助他們把需求講得更清楚。現況 SKILL.md 的收斂引擎（六個動作＋權重自適應退出）預設使用者已經有個模糊想法、AI 負責立分岔逼近，並沒有「主動揭露盲點」或「教使用者表達」這兩種機制——具體行為規格要先跑一輪 `/shape:elicit` 收斂，才落地成 SKILL.md 改動（Paul 2026-07-13 討論 elicit 路由實驗時提出）
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
2026-07-13：description 減重推廣到其餘 30 skill（ADR-073，5 個 sonnet sub-agent 分 plugin 執行，marketplace 整體 22,484→14,347 字元／63.8%），一併帶上 fixed-structure 藥方三（表述翻轉）——`docs/findings/2026-07-13-description-diet-rollout.md`。
