---
date: 2026-05-29
status: raw
---

# `shape` —— 跟 `nav` 同級的未來 sibling plugin(charter / 保留名,尚未建)

> 這是把今天一整串收斂(thought-mode · mockup-mode · pipeline · planning-with-files 比對 · Superpowers brainstorm 比對)收口的**家族 charter**。**plugin 尚未建** —— 這份只釘下「名字 + spine + 何時結晶 + 成員與狀態」。詳細各 skill 規格在被連結的 observation 裡。

## 名字:`shape`(跟 `nav` 同級)

| marketplace | plugin | spine(through-line) |
|---|---|---|
| `skills` | `nav` | deep modules(讓**既有 code** 可導覽,post-build) |
| `skills` | **`shape`** | **用真實、可丟的實例收斂,不用描述**(把 **intent 給形狀**,pre-build) |

為什麼是 `shape`(收斂過程):**forge** 淘汰(鍛劍 = 費力、精細、結果硬且永久,反「輕、可丟」)。**frame** 淘汰(framing 停在高層 lens,跟 spine「降到具體真實例」反向)。**shape** 勝:(1) 命名整段 **arc**(thought→mockup→spec)而非單一 move;(2) **可重塑** = 直接對上最高優先「改一半要輕鬆」;(3) Shape Up 先例「shaped work = 定義到剛好能建、不過度規格」= WHAT-not-HOW + right-grain(rule ④);(4) 一路從粗胚**降到可建的具體形狀**,涵蓋整個 altitude 落差。

## Spine:一個 stance、N 種媒介

> **Paul 不從描述收斂,他從「擺在真實脈絡裡、可丟的真實樣本」收斂。AI 的工作 = 把那樣本做出來,夠真、夠快、夠便宜到能丟 —— 並只為值得的決策出菜(weight-adaptive)。**

| 決策性質 | 「真實例」= | 規格在 |
|---|---|---|
| 概念/口頭 | grounded 的命名 fork | [[2026-05-29-thought-mode-how-paul-converges]] |
| 視覺 | 真實尺寸 render 的候選 | [[2026-05-29-visual-decisions-converge-by-real-render]] |
| (未來)API 形狀 | 跑得動的 code sketch | — |
| (未來)data model | 對真資料的 query | — |

共同律:**降到具體真實例 + reframe 到最根本層 + residue 一行。** 對照組:Superpowers brainstorm 有對的蘇格拉底核心,但外殼是「強制、9 phase、跑到 doc 才停」;`shape` 的差別在 **exit = 「Paul 撞到 principle」而非「文件被批准」**。

## 成員與狀態(結晶時才正式收進 plugin)

| 候選 skill | 狀態 | 形式 |
|---|---|---|
| **mockup**(render-to-decide) | **earned**(13×/2 週 = maturing)· **先做** | 重 skill:render N 候選(真尺寸/真脈絡/toggle)+ verify-helper(browser tax;偏 `findings/`) |
| **thought-ground** | ~raw · 先不 skill | **兩半**:always-on 的 grounded 收斂 stance → **CLAUDE.md**;召喚式 grill → **延後的薄 skill**(exit = 撞到 principle) |
| **spec**(WHAT) | convention,不太是 skill | 分層 artifact(spec=介面 / plan=實作 / progress=state,單向依賴);人類面 = nav:map 式 HTML 投影;progress 借 `planning-with-files` 機制、棄其 ceremony。藍圖見 [[2026-05-29-lightweight-spec-pipeline-single-source]] |

## 何時結晶成 plugin(關鍵紀律)

**plugin = 收割,不是播種。** nav 不是一開始就 6-skill —— `observations/README` 自己寫「每個 `/nav:*` 都從 observation 長出來」,ADR-003 是 skill 已存在後才辯「5 不 4 不 6」。`shape` 走同一條:

1. **現在**:名字保留(本檔)+ spine 已寫。
2. 建 **mockup** 獨立 skill 原型(先 standalone 或 Crate-local,因 verify 綁 agent-browser)。
3. **thought-ground** stance 進 CLAUDE.md、用起來證實。
4. **湊到 2-3 個 proven skill 共用此 spine → 才結晶**:寫 ADR(命名、與 nav 的邊界、各 skill overlap)+ plugin manifest + `shape/CLAUDE.md`(spine 當 through-line)。

**現在就蓋 = 包一個房間的房子 = 踩 rule ④(needless abstraction)。**

## Evidence / status

- **單一來源(2026-05-29)**:一整場關於 Crate pre-build 工作流的設計討論 + 對 Crate `mockups/`(13 session)、`docs/specs/`、Superpowers brainstorm(`skills/brainstorming/SKILL.md`)、planning-with-files 的實讀。
- `raw` —— 名字與 spine 已定,plugin 未建。下一個真實 Crate 任務跑過 thought-ground stance + mockup 行為 → 累積證據 → 升 `repeated` → 屆時建 mockup skill;湊滿 2-3 個再結晶 `shape`。
