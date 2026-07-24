---
date: 2026-07-24
status: landed
---

# nav:tour 的單向 two-turn reconcile 撐不起 deep onboarding——缺「反向考核 + 迭代收斂」的 teach-converge mode

> Source: 2026-07-24 ricercar 全日 live tour——Paul 主動要求測試「怎麼理解一個已寫好的專案」，
> 跑出一個 nav:tour 規格之外、全程手搓的深度模式。

## What prompted it

Paul 召喚 nav:tour 理解 ricercar 整個系統。現行規格是 **fixed two-turn protocol**（Step 4:
agent 攤 4–7 條 falsifiable 模型 → 使用者糾正 → Step 5 收 alignment delta，結束）。實際跑的卻是
一整天的多回合循環，最後 Paul 自己命名了這個流程並要求把它變成 skill：

> 「你先介紹給我聽，我釐清我的疑問，然後最後你出一些小考題來考完，確認我的理解，然後再循環，
> 以此類推我們可以更接近有一致的理解。」

## The signal

**S/P/D bind**（可直接改 skill 的那種 feedback）：

- **S** = `nav:tour`
- **P** = fixed two-turn protocol（Step 4 的單向 correction door：只有「agent 模型被使用者編輯」
  這一個方向；跑完一輪 delta 即完成）
- **D** = 加一個 **deep teach-converge mode**（與現行 quick reconcile 並存，像 audit 的多 mode）：
  1. **反向考核**——每教完一層，agent 出小考題測「使用者的模型」，不只攤自己的模型給人改；
  2. **迭代收斂**——「教 → 使用者釐清 → 考 → 修」多回合循環，以逼近共同理解為終止條件
     （使用者的自評／連續答對是天然的進度訊號），不是固定兩回合。

**為什麼反向那一半是關鍵**（不是 nice-to-have）：正向教學測不到使用者模型裡的錯。當天反向出的
三題（Q1 facts/estimate 路由、Q2 決策線歸屬、Q3 schema 自我描述）撞出**兩個正向教學完全沒暴露
的軟點**——其中一個是使用者「當天自己裁的規則」在新案例上套反（概念對、詞彙對映錯）。單向
reconcile 只修 agent 的模型；共同理解需要兩邊的模型都被測過。

**分類上它屬於 nav、不是 shape**（當天 Paul 自己的疑問，已裁定）：物件是「既存系統的理解」
（nav 的物件），不是決策（shape 的物件）——證據是當天 tour 每撞出一個真決策（Domain 改名、
IDENTITY、engine topology）都正確外包給 `shape:elicit`，分界自己守住了。更利的一句話：**這是
elicit 的 volley-to-convergence 引擎、物件反過來對著「理解」**——elicit 收斂決策、tour-deep
收斂理解，同一個引擎兩種物件（見 [[2026-05-29-thought-mode-how-paul-converges]]——那份是
決策側的收斂 stance，本份是理解側的對稱物）。

## Evidence so far

- **Only case (2026-07-24, ricercar all-day tour)**：多回合「教→釐清→考」循環跑完整個系統
  （三動詞、schemas、決策線、job lifecycle、light/deep）；反向 quiz 撞出兩個正向沒暴露的軟點；
  Paul 自評理解 ~70% 並主動要求把流程 skill 化。同場副產物：tour 當審計揪出六個真設計改進——
  深度模式的「生產力」證據。

(**Landed same-day by maintainer decision (2026-07-24)**：Paul 拍板跳過 trip-wire，直接把 D 寫進
`nav:tour` SKILL.md——新增 Mode 2「deep teach-converge」（summoned；一層一念頭+鉤子、每層宣告
視角、checkpoint 反向 transfer-quiz、concept-vs-vocabulary 評分、收斂即出）；Mode 1 two-turn
reconcile 原樣保留為預設。原 trip-wire 作廢；後續案例直接餵 Mode 2 的實戰回饋。)
