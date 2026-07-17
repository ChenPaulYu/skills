---
date: 2026-06-11
type: execution handoff brief(給另一個 session 執行;非 observation)
status: ready — Paul 已核准方向,細節在本檔
---

# HANDOFF — 把「mockup 代表性 razor」寫進 reconcile skill(ADR-037 的銳化)

> **一句話任務**:把 TrackMate 實戰收斂出的 mockup prune 原則(代表性原理 + canon-pinned razor)
> 外科式寫進 `plugins/shape/skills/reconcile/SKILL.md` 的 mockups tier 一節,並落 ADR。
> 共三刀必做、一刀明確不做、一個 ADR、一個版號。

---

## 前因後果(完整因果鏈,讀完即有全脈絡)

1. **背景**:一個私有產品 repo 是本 marketplace 的 dogfood 試驗場。shape 的 mockups 儲存預設已翻成 **committed**(Paul 裁決,commit `4481b82`)→ 每個決策留下一個資料夾、沒有任何 verb 會回頭刪 → `mockups/` 單調增長。
2. **ADR-037**(commit `19c1324`,shape 0.5.0)為此建立 reconcile 的第三層 mockups tier:retire-on-ship、三前提(①決策 settled/shipped?②殘值已吸收?③inbound 引用已解?)、situation table。
3. **2026-06-11 實戰**(TrackMate,16 個 mockup 夾、四輪 gated sweep、最終 16→8):ADR-037 整體成立,但 keep-clause「③ hits a **load-bearing** citation」**沒說死誰有授予 load-bearing 的資格** → 「被 thoughts 引用的推導考古」這類中間案例每夾都要人工判斷,三輪才裁完。
4. **Paul 收斂出 razor**:「要不被釘在 core 文件(重要資產),或者正在執行,或者被 defer 到 future,其他可刪」——即 **KEEP iff canon-pinned ∨ in-flight ∨ parked**。銳點:**只有 canon(core 文件)的引用算釘子**;sibling blueprints 文件(thoughts/plan)的引用一律可改寫成 git-pointer(salvage 步本來就會做),永不阻擋退役。回測當日全部 16 個樣本,razor 重現每一個人工裁決,並把一個「keep 一輪(不確定)」的案例變成有規則的 keep。
5. **邊角案例**:一夾三條全不中但不該刪——Paul 的親作原稿(`CheckMate.html`,被 thoughts「萃取」的對象)。診斷:它是 **source material**(inputs-to-decisions),不是 decision-render,放錯 `mockups/` 櫃子。Paul 再修正:**原稿走吸收制生命週期**——萃取殘值還在就留;確認「迭代已吸收其設計」或「被推翻」後可 prune,**但 sweep 只能問作者、不能預設提案**(吸收與否只有作者答得了)。
6. **最終第一性原理**(Paul 拍板):**「mockup 的存在理由 = 代表真系統還沒有的東西;code 吸收它的那一刻,代表權移交,它就該退場。」** 三條 keep-clause 全是推論:canon-pinned = code 永遠吸收不了的部分(質感採樣)· in-flight = 還沒吸收 · parked = 暫不吸收。
7. **完整記錄**已落:[`2026-06-11-mockup-prune-razor-canon-pinned-or-inflight-or-parked.md`](2026-06-11-mockup-prune-razor-canon-pinned-or-inflight-or-parked.md)(同目錄)。Promote gate:慣例是 second sighting 才升 ADR,但 **Paul 已明示破例直改**(先例:ADR-038 同為 user-requested promote)。

---

## 要做的事(對象:`plugins/shape/skills/reconcile/SKILL.md` 的「The mockups tier」一節)

### 刀 ① — 換法源句(該節的開場原理)

找到:
```
**A mockup has no lifecycle of its own — its currency is inherited from the decision it served.**
```
換成:
```
**A mockup exists to represent what the running system cannot yet represent; the moment
code absorbs it, representation transfers and the artifact should exit.** The sweep's one
question per folder: "does this still represent something the code doesn't have?"
(Its currency is thus inherited from the decision it served — never its own.)
```

### 刀 ② — situation table 的 ③ 改成 canon-pinned

找到 table 中:
```
| ③ hits a load-bearing citation (a ratified sample serving as visual spec) | **keep + freshness stamp** (amend) — ... |
```
改成(保留原行尾的 re-check 語句):
```
| **canon-pinned** — cited from the project's CORE/canon docs(the part code can *never*
  absorb, e.g. texture sampling)| **keep + freshness stamp**(amend)— ONLY canon can pin:
  citations from sibling blueprints docs(thoughts/plans)are re-pointable(salvage → a
  `git log --follow` pointer)and never block retirement. Re-check each sweep like a
  `decisions.md` section: "still operative, or is the running system the ground truth now?" |
```
同時在「decision in-flight → keep」與「parked → keep + parked stamp」兩行**行尾各補一個括號**,把三條掛回同一根:in-flight 行補 `(= code hasn't absorbed it yet)`;parked 行補 `(= code won't absorb it for now — the deferred intent still needs a representative)`。

### 刀 ③ — 預設方向句(razor 的速度紅利)

在三前提清單之後、situation table 之前,加一句:
```
**Default direction:** a folder failing all keep-clauses gets prune as the *default
proposal* (the per-file gate stands — propose, don't presume). The razor exists so a
sweep is one gated round, not three.
```

### 明確不做 — 原稿條款(deliberate hold)

「source material 走吸收制生命週期、sweep 只能問不能提案」這條**本次不進 skill text**——只有一個樣本(CheckMate.html),照 promote gate 留在 observation 等第二例。執行時**不要**把它寫進 SKILL.md;它已完整記錄在 observation 的 Edge case 節。

### ADR

依 repo `docs/adr/` 慣例擇一(讀 README/前例自判):
- ADR-037 內加 **Amended(2026-06-11)** 節,或
- 新 **ADR-039 — mockup representativeness razor**(referencing 037 + observation)。
內容三點:代表性原理(法源)· canon-pinned 銳化(只有 canon 能釘)· default-proposal 方向。註明 promote 依 user 明示(ADR-038 先例)。

### 收尾

- `plugins/shape/.claude-plugin/plugin.json` 版號 bump(0.5.0 → 0.6.0;協定行為變更=minor,比照 0.4→0.5 慣例自判)。
- Observation 檔頭 `status: raw` → `status: actioned`(加一行 actioned 指向 ADR;**Edge case 原稿條款段保持 raw**,在該段註明)。
- mockup SKILL.md(`plugins/shape/skills/mockup/SKILL.md`)的 Visual-lock 節**可選**加一行生死對稱(「born because the real thing doesn't exist; dies when it does — enforcement lives in reconcile」)——已有 cross-ref,judgment call。

## 護欄(執行紀律)

- **外科式**:除上述指定行,SKILL.md 其餘文字 verbatim 不動;語言風格跟既有 skill text(英文為主)。
- **不碰 TrackMate repo**(testbed-guard:行為修正只住 skills repo)。
- 改完 `grep -n "canon-pinned\|representation transfers" plugins/shape/skills/reconcile/SKILL.md` 自驗三刀都在;commit 風格照 repo(`feat(shape): ...`),含 ADR + observation 狀態更新同一個 commit 或拆兩個皆可(照前例 `19c1324` 一個 commit 全包)。
- 完成後提醒 Paul:`/plugin` 更新 + `/reload-plugins`(否則 cache 又舊版——見同目錄 stale-cache observation)。
