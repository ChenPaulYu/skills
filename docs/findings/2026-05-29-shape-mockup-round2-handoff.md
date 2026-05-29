---
date: 2026-05-29
kind: handoff
---

# Handoff — 把 `shape:mockup` 帶到 round-2(給做這個 skill 的人參考)

> Build-side note。**別重推 —— 思考已經做完了。** 這是「現有草稿 → round-2」的 delta + checklist,不是要你從零寫。模型側的 source of truth 是下面那份 observation。

## 現況(三件事先知道)

- **草稿已存在、而且不錯**:`plugins/shape/skills/mockup/SKILL.md` —— 已有 render-to-decide、weight-adaptive、exit-on-pick、toggles、faithful-replica、reframe-watch、anti-patterns。**但它早於 round-2。**
- **Round-2 的 source of truth**:`docs/observations/2026-05-29-visual-decisions-converge-by-real-render.md`,讀它的「**Refinements(round 2)**」段(probe-not-stage、三 trigger、有疑就 render、lock retire+戳)。配對的 verbal 孿生 = `2026-05-29-thought-mode-how-paul-converges.md`。
- **Plugin 沒 scaffold**:`plugins/shape/` 只有那個 SKILL.md —— **沒 `plugin.json`、沒進 `marketplace.json`**,目前不能當 plugin 安裝。

## 5 個 delta(折進 SKILL.md)

| # | round-2 的點 | 現有草稿 | 動作 |
|---|---|---|---|
| 1 | mockup 是 **probe,可在任何高度開火、回饋上游**(能改 ontology) | 只有 step-4 reframe-watch（半個） | 補 probe / altitude 框 |
| 2 | 判準 **「有疑就 render」**（事前常不知道描述夠不夠） | 只有 weight-adaptive（trivial→不做） | 並列「有疑就 render」 |
| 3 | **GENERATE/DISCOVER 是主模式**（render 一排發散候選來長選項空間） | 把「一候選+toggle」當 default、多候選當 heavy 例外 —— **方向反了** | 見下方 ⚠ |
| 4 | **visual-lock：retire-on-ship + 蓋戳、壽命隨高度、不能 auto-regen** | 只說「成 canonical、記進 CLAUDE.md」（太慷慨） | 改寫 lock 段 |
| 5 | **anti-trigger：純 ontology/概念/資料模型決策 → thought-mode,別 mockup** | anti-patterns 缺這條 | 補 anti-trigger |

## ⚠ delta #3 細節 —— 三種形狀(唯一的實質內容改動)

現有草稿把世界分成兩種(一候選+toggle = default / 多候選 = heavy 例外),但這跟本 session 觀察到的主模式(reset-zoom 排 10 個、concept 排 4 個 glyph)不符 —— 那是**一個檔裡放一排 generated 候選,便宜、不 heavy**,草稿的 default 裡卻沒有它。改成**三種**:

- **(a) 一候選 + toggle** —— 已知方向,定它的未決子點。
- **(b) 一檔、一排 generated 候選並排** —— 還在 **discover** 選項空間(← round-2 主模式)。**便宜、是 light default,不是 heavy。**
- **(c) 多檔 + decision note** —— heavy、要持久比較記錄(罕見例外)。

→ (a)(b) 都收進 light default,**「generate 一組發散候選」升級成一等公民**;(c) 維持例外。
→ 為什麼重要:**generate 是一半的價值,也是回饋上游的引擎** —— 候選生得夠廣時會包含「不做這個元件」的選項(`1:1` 用文字、不要 glyph),使用者看到「不做」長怎樣才改了 ontology。只渲染給定選項的 skill 會錯過這個。

## Scaffolding TODO(若要做成可安裝的 plugin)

- `plugins/shape/.claude-plugin/plugin.json`(name: `shape`)
- 在 `skills/.claude-plugin/marketplace.json` 註冊 `shape`
- (可選)`plugins/shape/CLAUDE.md` —— 家族慣例
- (可選)ADR:「為何開 `shape` 家族(視覺/UI 決策),與 `nav`(code shape / deep-module)分開」—— 這是 marketplace 結構決定,照慣例該有 ADR

## 留給做的人/ Paul 拍的 open 決策

1. **三分法(delta #3)** —— 確認 OK?
2. **Scaffolding 現在補還是之後**(A 順手補完 plugin.json + 註冊;B 只精煉 SKILL.md)。
3. **Eval 取向** —— 這是**主觀行為 skill**(產物=協作過程+渲染候選,非可驗證 artifact)→ 建議**跳過量化 benchmark**,但**做 skill-creator 的 description-optimization**:
   - 要被打中:「這 icon 該怎樣 / 這要長怎樣 / 我不知道有哪些選項可比」。
   - **不可**被誤觸:純 ontology / 資料模型決策(那是 thought-mode)。

## 別漏掉

- **anti-trigger(ontology→thought-mode)目前草稿沒有** —— 一定要補(這是 mockup vs thought-mode 的界線)。
- **visual-lock 段要整段重寫成 round-2 版**(retire-on-ship + 蓋戳 + 壽命隨高度 + 不能 auto-regen,對照 `nav:map` 能 auto-投影、mockup 不能)。
- 描述(description frontmatter)目前偏 DECIDE/explore,**沒帶 GENERATE/discover 與 anti-trigger** —— description-opt 時補。
