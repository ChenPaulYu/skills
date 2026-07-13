# ADR 068 — Codex phase-0 凍結檢查圈範圍：工作線紀律，不是 repo 級凍結

**Status**: accepted（2026-07-13 Paul 仲裁）
**Date**: 2026-07-13

## Context

同日兩個獲准的方向相撞：

- 稍早，Codex 相容計畫（`blueprints/plans/2026-07-13-codex-compatibility.md`，commit `b7bac46`）把 Claude 側（root `CLAUDE.md`、`.claude-plugin/**`、`plugins/**`）宣告為凍結契約，並在 `validate-codex-skills.mjs` 的**預設路徑**焊進兩個檢查：①凍結 worktree 檢查——凍結路徑有任何未 commit 變更即 fail；②token ratchet——Codex 鏡像（`.agents/skills/**`、`AGENTS.md`）裡的 Claude 專屬語彙相對 `scripts/fixtures/codex/compat-baseline.json` 只准減不准增。
- 稍晚，ADR-065/066/067 批次（description 減重試點、out-of-scope ledger、dispatch tiers）依既定流程修改 plugins/ 與 root CLAUDE.md——被①全數擋下（16 錯）；且 dispatch tiers 的內容本質上就是 subagent 與 model tier 語彙，正當地觸發②（7 錯）。執行 agent 依 STOP 規則停下，未自行繞道。

問題核心：凍結計畫的**本意是窄的**（Codex adapter 工作線不得寫 Claude 檔——該線自己的紀律），但**實作是寬的**（任何人任何時候不得改 Claude 側）。寬讀凍結整個 marketplace 的演化，與 root CLAUDE.md 的既有維護流程（new skill → 同 commit 更新表面等）直接矛盾。

## Decision

1. **凍結 worktree 檢查移出預設路徑**：`validateCodexCompatPhase0` 增加 `worktreeFreeze` 選項；預設 validator 傳 `false`，`--codex-compat` 旗標（及既有的 `--compat-audit` 完整審計門）傳 `true`。Codex 工作線與其 CI 用旗標模式自我約束；一般 marketplace 演化不再被擋。
2. **temp-build 純度檢查保留在預設路徑**：「`build-codex.mjs` 只寫生成目的地、不改凍結路徑」是生成器的不變量，與誰在改 worktree 無關，永遠檢查。
3. **Ratchet 保留在預設路徑，配「有意識 bump」協定**：Claude 側功能正當新增語彙時，在 `compat-baseline.json` 的 `ratchet_ledger` 記一筆（日期、理由、逐項 bump），ratchet 繼續禁止**無聲**增長。本 ADR 附帶第一筆 ledger（ADR-067 dispatch tiers 的 7 項 bump）。
4. **長期方向不變**：正解是 codex-compatibility Phases 1–5 讓 `build-codex.mjs` 學會降轉/剝除 Claude 專屬語意（翻譯而非禁止），屆時 ledger 裡的 bump 應被 ratchet 回收。

## Why

- 「adapter 不得寫 Claude 檔」約束的對象是**一條工作線**，把它實作成**全 repo 的 worktree 狀態檢查**是錯的顆粒度（rule ④）——它讓閘門從「守護單一事實」變成「接管整個流程」，正是本 repo 引用 mattpocock 對重框架的批評（own the process, take away control）要避免的形狀。
- Ratchet 的價值是防鏡像品質無聲劣化；正當演化被逼著改寫內容或偷改 baseline 都是自肥式繞道。ledger 讓 bump 變成有簽名的決定，仲裁權留在人手上。
- 執行 agent 撞牆即停、不繞道、留全部證據——本次事件同時驗證了 dispatch-tiers（ADR-067）的 STOP 紀律設計是有效的。
