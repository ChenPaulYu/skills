# HANDOFF

> git SHA at park time: 3dd66451aa6f1f6e1738394f66d6f53fc2ce79e0 · parked 2026-07-14

## 🎯 Goal

讓 skills marketplace 的 Codex mirror 從「格式可載入」升級為「行為相容」：Claude Code source 維持 frozen contract，Codex-only compiler 負責把專屬機制降轉成可執行的等價物；無法等價時必須誠實降級，不能假裝功能存在。

## ✅ Done

- Marketplace 工作線已完成 elicit 生態系、frame 人話落地、relay/reflect 瘦身、research 泛化、派工可見性與 anti-pattern tell-column sweep。
- Codex Phase 1 已抽出 `scripts/lib/codex-compat.mjs`，把 explicit invocation、mechanical tier、worker prose 與 project guidance 收進單一 compiler owner。
- Codex Phase 2 已加入 worker work-packet/return contract、重新驗證拒收規則，以及 executor/explorer/reviewer role TOML 與個人 5.6/5.4 mapping。
- Codex Phase 3 已完成互動選擇降轉：九個 consumer 共用一份 Codex contract，支援 `request_user_input`，不可用時直接問完即停；保留選擇前不執行、互斥、推薦、退出、one-shot 與 explicit-invocation 語意。
- Phase 3 驗收證據：`AskUserQuestion` 0 hit、九個 contract consumer、15/15 canaries、6/6 negative fixtures、三道 validator 綠燈、兩次生成 hash 一致、frozen Claude source 零 diff。Commit `3dd6645` 已 push 到 `origin/main`。

## 📍 Now

Phase 3 已收工；`blueprints/plan.md` 與 `blueprints/plans/2026-07-13-codex-compatibility.md` 已更新。工作樹在寫入本 HANDOFF 前是乾淨的，Phase 4 尚未開始。

## ⚠️ Open

- Phase 3 沒有在真實互動 host 裡跑一次 chooser session；目前證據是 compiler output、正向 fixtures 與 validator。這是已知驗證邊界，不是 Phase 3 的未完成實作。
- Phase 4 尚有 `browser-verifier` 8 hits、`agent-browser` 41 hits、session-open 3 hits，仍由 baseline 明確追蹤。
- Phase 5 的全 roster coverage report 與 universal hard gate 尚未開始。
- elicit 守門人 cheap-tier 冷啟動 0/3 是已記錄的能力地板，不要誤當成待修 SKILL.md bug。

## ➡️ Next

1. 執行 Codex Phase 4：產生 browser-verifier 的 Codex artifact，查證安裝/發現方式，接上 `shape-build`、`shape-mockup`、`shape-dogfood`，並以真實 verdict 或明確 unsupported 結果驗收。
2. 分開處理 session-open awareness：若 Codex client 支援 lifecycle hook 就生成設定；不支援則把 `relay-digest` 誠實降級為 on-demand / explicitly invoked。
3. Phase 4 綠燈後進 Phase 5：全 roster 分類、coverage report、零 unexplained findings、hard gate、determinism 與 frozen contract 驗收。
