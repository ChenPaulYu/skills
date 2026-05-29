---
date: 2026-05-29
status: raw
---

# Sub-agent tactical drift —— 真正的修法是 parent integration audit,不是更聰明的 sub-agent

> **Partial promotion (2026-05-29)** → lever C+D wired into the meta-skill sub-agent hand-off as the **inject↔check** pattern: [`docs/adr/008-inject-check-at-handoff.md`](docs/adr/008-inject-check-at-handoff.md). Status stays `raw` — standalone `/nav:integrate` skill still deferred until the pattern recurs outside the hand-off. The 5-step parent audit also landed in the operator's own `~/.claude/CLAUDE.md` ("Working with sub-agents").

## Context (for non-Crate readers)

**Crate** = a music research / knowledge-graph app(TS + React + Vite + TipTap)。重點 surface:
- **TrackCard** = 一張 card 包一首歌,中間是 full-width waveform + transport controls(play/scrub/loop)。
- **ConceptCard** = 知識筆記,內文(TipTap)可以 `@`-mention 並 inline cite 一首歌的某段時間 —— 稱為 **moment**。
- **`@`-picker** = 在 ConceptCard 內文打 `@` 開出的兩欄選單(Heptabase-style):左欄候選列表(card / note / moment),右欄預覽。
- **MomentPreview** = `@`-picker 右欄的元件 —— 當左欄選到一個 moment 時,畫一個 mini waveform 給 user 確認「對,就這段」。
- **Waveform** = audio domain 唯一對外的 React component(facade),內部包 [WaveSurfer.js](https://wavesurfer-js.org/)(decode + peaks extraction)+ 自製 SVG renderer。CLAUDE.md 明文規定 app code 一律 import `Waveform`,不准直接碰 WaveSurfer。

**11 個 deep-module 規則** = 這個 `nav` plugin 的核心(`plugins/nav/CLAUDE.md` 列了全部)。文中 by name 提到的幾條:
- **#6 No needless abstraction** —— 不該抽就不抽;DRY 跟過早抽象之間取平衡
- **#7 Fit the framework** —— 用 idiomatic patterns;不要洩漏實作細節
- **#10 Group + expose via one door** —— subsystem 走 barrel / facade
- **#11 Agent-navigability is the audit** —— agent 描述檔案的難度本身就是 deep-module 失敗訊號

## What happened

2026-05-25 ~ 2026-05-28:Crate 的「Concept Card 改造」分 4 phase 用 sub-agent 跑。**Phase 3**(commit `81bb05c`)= 蓋 `@`-picker 的 2 欄 UI + MomentPreview。sub-agent 收工、tests 109/109 綠、agent-browser smoke 3 截圖、parent(我)按 ✓ merge。

2026-05-29 user 開新 session 第一句話:「waveform 視覺化有跟 TrackCard 一樣嗎?」翻 source 才發現:

| File | 內容 | LOC |
|---|---|---|
| `audio/renderers/svg.tsx`(原本就有) | `fillPath(peaks, w, h)` → SVG `d` string,**有 `BUCKET_PX = 2.6` bucketing** | ~30 |
| `editor/MomentPreview.tsx`(Phase 3 新加) | **又一份** `fillPath(peaks, w, h)`,algorithm 幾乎一樣,**沒** bucketing | ~30 |

`BUCKET_PX = 2.6` 是什麼?WaveSurfer decode 出來的 raw peaks 可能 5000~10000 個;一個 200px 寬的 waveform 顯示空間放不下 → 把 peaks 按「每 2.6px 顯示寬度 1 bucket」壓縮(每 bucket 取 max amplitude),最後 ~77 buckets 上 SVG。**這讓「視覺密度」跟「資料密度」脫鉤 —— 不管 raw peaks 有幾個,長相一樣。**

→ MomentPreview 沒 bucket = 直接畫每個 raw peak。Mock track 只有 3 個 peak 時看起來像 3 顆菱形(剛好被 user 在截圖看到);但一旦放真實 track 5000+ peaks,thumbnail 會變黑色 noise(每 0.04px 1 筆 data 全擠成黑條)。

修法:`/nav:plan`(這個 plugin 的 plan skill)→ 抽 `audio/peaks.ts` primitive(`bucketPeaks` + `peaksPath` + `renderPeaks` + `BUCKET_PX` 常數)→ svg renderer + MomentPreview 兩邊都 import。commit `88d46de`,1 個 session 內收完。Cost 算便宜,但這次能抓到是 **user 主動問** —— 不是 parent 自己抓的,所以才是 observation。

## Root cause —— 4 個機制串起來

1. **Sub-agent 天生是 tactical 的**:Phase 3 sub-agent 拿到的 brief 是「蓋 MomentPreview 元件」。它**沒有 codebase-wide 視角**去問「`fillPath` 這個 utility 是不是已經有家?」 —— 看到要畫 waveform → 寫 `fillPath` → 收工。**Rule #11(agent-navigability)在 sub-agent 層級失靈**,因為 sub-agent 只能看自己被指派的那塊檔案,不會主動 grep 同 domain 既有 impl。

2. **沒有 primitive seam → inline 變最省力路徑**:`fillPath` 在 Phase 3 之前是 `audio/renderers/svg.tsx` 的**內部 function**(沒 export);audio domain 對外的 interface 只有 `<Waveform>` 這個 React component,但它綁了 WaveSurfer playback control + peaks bucket 數學。第二個 consumer(MomentPreview)想要「只要 pixels-from-peaks 的數學」,只能 (a) 把 thumbnail 概念 shove 進 `<Waveform>` facade(會違反 **rule #6 no needless abstraction**,因為要加 mode branching prop)、或 (b) copy 那 30 行(也違反 rule #6,DRY 方向)。**seam 還沒劃出來 → 形狀本身在推 copy-paste**。

3. **Facade 規則畫錯線了**:Crate 的 project-level CLAUDE.md 寫「app code 一律 import `Waveform` facade,不准直接 import WaveSurfer」。Sub-agent 字面執行 → 解讀成「audio domain 內部不可重用 → 那我自己畫」。但這條規則的**本意**是保護 playback 一致性(避免每個 consumer 自己接 WaveSurfer lifecycle),**不是**封死 pixel rendering 的 seam。**規則被 over-read**,從「保護 playback」變成「audio domain 不可重用」。

4. **N+1 trigger 沒守**:N+1 原則 = 第一個 consumer 用某 function = inline OK;**第二個 consumer 出現 = 抽 primitive**。Phase 3 的 MomentPreview 就是 `fillPath` 的第二個 consumer。當下沒按暫停鍵 —— 前 2 個 phase 已經 ship 出去的 ship-it momentum 蓋過了「停下來抽 primitive」的衝動。

## 評過的 4 個 lever

| Lever | 評分 | 為什麼 |
|---|---|---|
| **A. Plan 寫更清楚** | ★★ | 補位的:plan 描述 WHAT(「這是 fillPath 第二個 consumer」),但 plan 寫不出**我自己當下還不知道**的事 —— 我沒讀過 svg.tsx 就不會在 plan 裡寫「跟它合流」。Plan 反應的是我的盲點,不是 codebase 真實狀態。 |
| **B. 不用 sub-agent** | ✗ | 自我打臉。Sub-agent 存在的理由是保護 main context;移掉 → parent 被 implementation noise 淹沒 → 反而失去抓 strategic pattern 的視角。問題不是 delegation,是 briefing + audit。 |
| **C. Sub-agent 帶 deep-module discipline** | ★★★ | 11 rules + N+1 + facade seam 是**普世規則**,不該每 plan 重寫。寫一次 sub-agent brief,每次 dispatch 帶。Cheap、scalable。但仍然受限於 sub-agent 看不到 codebase 全貌。 |
| **D. Parent integration audit**(原本沒列) | ★★★★ | Sub-agent 寫完 ≠ done。**Parent 必須讀 diff,問「這引入了跟既有什麼平行的 impl?seam 長對了嗎?facade 規則有被當原意理解嗎?」** 抓的是 emergent 的問題 —— C 抓預期得到的,A 抓 plan-specific 的,D 抓 emergent 的。Emergent 才是真實世界的常態。 |

## What it could become

- **CLAUDE.md addition(下一階)**:「Sub-agent 回報 done 之後,parent 做 5-step integration audit:(1) 讀 diff 1 分鐘 (2) grep 任何新加的 utility 看有沒有 sibling impl (3) 確認 facade / seam 規則被當原意理解 (4) 確認沒長平行實作 (5) 才接受 done」。可以寫進 `~/.claude/CLAUDE.md` 的 sub-agent 段。
- **`/nav:integrate` skill(更遠)**:把 5-step audit 變成可呼叫的 skill 形狀。Parent 呼叫:「audit sub-agent's diff against the rest of the codebase」。**但現在還只看到 1 個案例 —— 等 pattern 重複再說**(rule:不 pre-skill)。
- **`nav` plugin CLAUDE.md 加 N+1 trigger**:第二個 consumer = extract,寫進 plugin-level convention,讓 nav 系列 skill(尤其 `/nav:refactor`)觸發這個檢查。

## Evidence so far

- **唯一案例(2026-05-29 · Crate `refactor/trackcard-track-subsystem` branch)**:
  - 引入時的 commit:`81bb05c` —— sub-agent ships `MomentPreview.tsx` with inline `fillPath()`,跟既有 `audio/renderers/svg.tsx` 的 `fillPath()` 平行。tests 109/109 綠,parent ✓ 過。
  - 抓到時的觸發:next session user 第一句「waveform 視覺化有跟 TrackCard 一樣嗎?」—— **user spotted,不是 parent。**
  - 修法時的 commit:`88d46de` —— `/nav:plan` → 抽 `audio/peaks.ts` primitive → 5 files changed,109/109 仍綠。
  - 從引入到修掉:1 session 內,~1 hour。

(只有 1 個案例 → 還停在 `raw`。再見到 1 次 → 升 `repeated` + 補 evidence;見到 2-3 次 → `maturing` + 草 SKILL.md;見到 5+ 次再 promote 成 skill。)

## 通則(預備性的)

當 sub-agent 寫一個 function,parent 必須做的最小檢查:

1. **同 domain grep**:`grep -rn 'function.*<name>\|const <name>' <same-domain-dir>` —— 看有沒有平行 impl。
2. **Seam 對照**:這個檔案 import 了什麼?是不是該走 facade / barrel 沒走?是不是繞過了既有的對外 interface?
3. **Rule 字面 vs 原意**:被引用的 codebase rule(facade 規則、deny list、conventions),sub-agent 有沒有 over-read?規則保護的線在哪裡?

短版:**sub-agent 報 "feature 完成" 是真的,但 "整合乾淨" 是 parent 的責任**。
