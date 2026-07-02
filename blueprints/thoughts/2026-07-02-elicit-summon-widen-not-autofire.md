# elicit 移除 disable-model-invocation — 決策

> **TL;DR**: `shape:elicit` 拿掉 `disable-model-invocation: true`,回到 2026-07-01(commit `5bf071f`)之前的狀態。原因:目前平台的觸發閘門是二元的(model-invocable 全開 / 全鎖,只有使用者訊息裡逐字出現 `/shape:elicit` 才能繞過鎖),沒有「使用者明確點頭但 AI 不會自己猜」這種中間態——而 elicit 過去能被其他 skill(`align`/`dogfood`/`reconcile`)的散文推薦(「recommend `/shape:elicit`」)順暢接上,靠的正是 model-invocation 開著。拿掉鎖之後,行為紀律回到 elicit 自己 `SKILL.md` 寫的「Summoned, not automatic」這條*文字*規範,不再由平台機制硬擋。
>
> **狀態**: 已落地——`plugins/shape/skills/elicit/SKILL.md` 的 frontmatter 已移除該行,尚未 commit。

## 背景

使用者一開始要求把 `shape:elicit` 改成「能自動觸發」,理由是它「很常用到」。但這個要求跟昨天(2026-07-01, commit `5bf071f`)使用者自己刻意加上 `disable-model-invocation: true` 的決定正面衝突——理由寫在 elicit 自己的 `SKILL.md`:「Summoned, not automatic」「Auto-fire on any uncertainty」是明列的 anti-pattern。

## 收斂過程(volley 摘要)

1. 使用者最初訴求:讓 elicit 能自動觸發。
2. 分岔 A(機制缺口:AskUserQuestion 選中該算 summon)vs B(真的要推翻昨天的設計決策)→ 使用者選 **B**。
3. 分岔 B1(AI 自主判斷、不用使用者點頭就開始 grill)vs B2(AI 可以主動提議,但仍要使用者點頭才算 summon)→ 使用者選 **B1**。
4. 反駁 B1:拿掉 `disable-model-invocation` 不只是「AI 更常提醒」,而是把 elicit 放回自動清單,AI 會在毫無預警下開始多輪逼問——正是 SKILL.md anti-pattern 表格第一條要拒絕的行為。且技術上,elicit 是多輪、有份量的 grill,不是一次性提問,自動誤判的代價遠高於一般 skill。
5. 追問「常用」到底是什麼意思 → 使用者澄清:根本原因是**打字的手續本身**,不是「AI 沒有主動判斷」。
6. **Snap**:問題其實是「summon 管道太窄」,不是「該不該自動」。使用者親手在 AskUserQuestion 裡選中 elicit,跟手打指令在精神上是同一件事——只是機制上沒被當成 summon 處理。

## 決定的原則(one line)

> **elicit 的 summon 資格看「使用者是否做了明確選擇」,不看「輸入管道是打字還是點選」——AI 自主判斷觸發永遠不算 summon。**

## 決定的分岔

- ❌ 拿掉 `disable-model-invocation: true`(B1,AI 自主判斷觸發)— 已否決,違反 elicit 自身的 anti-pattern。
- ✅ 拓寬 summon 的合法管道:使用者在 AskUserQuestion 選中 elicit(或其他 `disable-model-invocation: true` 的 skill,如 `position`/`build`/`setup`/`nav:refactor`/`reflect:catchup`/`summarize`/`observe`)時,執行中的 skill 應把這個明確選擇當成一次 summon 直接呼叫,而不是被 Skill tool 的「使用者需親手打出 `/<name>`」規則擋下。

## 下一步(未落地,交給後續)

這是個小型、範圍明確的修正 —— 適合 `/nav:do`,不需要完整的 `/nav:plan`。具體待決:
- 是在每個「offer 分支」的 `SKILL.md`(如 elicit 自己 Step 6、dogfood 的路由等)裡,補一句「使用者選中後直接呼叫,視同 summon」的協定,還是
- 在更上層(例如 repo-root CLAUDE.md 或某個共用約定)一次講清楚「AskUserQuestion 選中 = summon」這條規則,避免每個 offer 分支各自重複寫(踩到 rule ① 資訊外洩)。

這個「單一擁有者放哪裡」的選擇,留給實際動手修的那一輪決定。
