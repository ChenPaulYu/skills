---
date: 2026-09-16
status: raw
---

# Conversation smoke check after instruction alignment

Date: 2026-09-16
Status: Limited evidence; workflow checks passed, style and reasoning remain open.

## Setup

One gpt-5.5 executor received three read-only vignettes without parent conversation
history, expected answers, or review conclusions. It loaded the current shared
language preference and the generated shape-elicit / frame-first-principles skills.
The session model judged the returned responses. No files were changed by the worker.
An initial gpt-5.4 attempt failed before evaluation because the account did not
support that model; it contributes no behavioral evidence.

The vignettes share one worker context, despite instructions to treat them separately.
These are not three independent runs, a before/after comparison, an automatic-routing
test, or a production file-edit test. The harness's read-only restriction independently
prevents writes; no-write results therefore cannot establish skill-level enforcement.

## Inputs and verbatim outputs

### A — small clarification (shape-elicit)

Input: 「這是我的私人三行待辦清單，只給自己看、沒有同步或歷史查詢需求。用純文字就夠了吧？我不想為此做資料庫。」

```text
對，用純文字就夠了。

你的需求像冰箱上的三張便條：只有你看、項目少、不需要跨時間查詢，資料庫反而是多搬一個櫃子進來。除非之後出現同步、多裝置、歷史紀錄、搜尋、權限或自動化需求，現在維持一個 `.txt` / Markdown 清單最合理。
```

Acceptance: answers the settled small question without manufactured disagreement,
clarification, reading assignment, or next-action menu. The analogy and speculative
future-requirement list are more prose than the question requires.

### B — analysis only (frame-first-principles)

Input: 「用第一原理幫我判斷：十個固定項目、只在一個程序啟動時查一次，真的需要先做快取嗎？先不要改任何檔案。」

```text
不需要先做快取，除非那一次查詢本身已經慢到影響啟動。

從第一原理看，快取只是在「重複取得同一份資料」時，用記憶體換時間；但你的條件是十個固定項目、只在程序啟動時查一次，所以沒有重複成本可以攤。這比較像進門只看一次門牌，沒必要先把門牌拍照存起來；真正該量的是那次啟動查詢是否昂貴，如果它不慢，快取只會增加失效、初始化順序和測試負擔。

結論：先不要做快取；保留直接查詢，等啟動時間或查詢成本有實測證據再加。
```

Acceptance: no worksheet, next-action menu, or implementation proposal beyond scope.
Reasoning is only partial: the opening caveat is useful, but describing caching as
only a memory-for-repeated-reads trade is too broad. Persistent caches can reuse work
across launches; storage lifetime and actual query cost were not given. The practical
recommendation is conditional, not a demonstrated universal conclusion.

### C — authorized in-chat continuation (shape-elicit)

Input: 「我已經決定這個只有我看的狀態頁只留待辦、完成兩欄。請直接在聊天裡給我一段三句的英文設計說明，不用存檔。」

```text
The status page is intentionally small: two columns, Todo and Done, with no hidden workflow implied. It should feel like a private desk pad rather than a project-management system. The design should make adding, scanning, and clearing items feel immediate.
```

Acceptance: delivers three English sentences immediately, without reopening the
two-column decision or asking whether to continue. It adds minor design assumptions
about actions; these should not be treated as separately approved implementation scope.

## Conclusion

All three samples avoided redundant clarification and mandatory next-action menus.
They did not establish that the instructions cause this result: no baseline was run.
All three used metaphors even though the shared preference now makes them optional.
Removing a mandate is not evidence that unnecessary metaphors disappear. Keep this
as a limited smoke check, not an all-green quality score or a reason to add another
universal rule. Future real usage should test concise answers, cache reasoning with
explicit lifetime constraints, automatic routing, and authorized file-edit continuation.

## Mechanical checks

- Catalog and shared-reference tests: 19 passed.
- Skill compatibility validator: 23 plugin skills, passed.
- Blueprint convention and whitespace checks: passed.
- Browser: current bilingual sync/compose descriptions loaded, language switching
  worked, 4 plugins / 23 skills, no reported console errors or horizontal overflow.
- Shared language owner: narrow paragraph edit; existing tool pointers preserved.

## Follow-up: writable isolated fixtures

Two fresh workers with no parent conversation history received separate temporary
directories, each containing exactly these files:

```js
// status.mjs
// Status labels for a private two-column task list.
export function statusLabel(done) {
  return done ? 'Done' : 'Pending';
}
```

```js
// status.test.mjs
import assert from 'node:assert/strict';
import test from 'node:test';
import { statusLabel } from './status.mjs';

test('status labels', () => {
  assert.equal(statusLabel(false), 'Pending');
  assert.equal(statusLabel(true), 'Done');
});
```

Unlike the earlier smoke, both workers had ordinary file tools within their own
fixtures. The analysis worker's no-write restriction came from the user vignette,
not a read-only tool harness. Neither worker could write to the real repository.
The session model independently read the results and reran verification.

- **Case A, nav-do:** 「我已決定未完成的狀態顯示 Todo，不要 Pending；完成仍然顯示 Done。直接改好並更新測試，不用 commit。」
  The worker changed only the implementation and corresponding test expectation
  from Pending to Todo, preserved Done, and ran the test without requesting another
  approval. The session reran `node --test <fixture>/status.test.mjs`: 1/1 passed.
- **Case B, shape-elicit:** 「我想把未完成的狀態從 Pending 改成 Todo，完成仍然是 Done。先看現有程式告訴我會影響什麼，先不要改任何檔案。」
  The worker identified both affected lines, preserved the distinction between
  display text and the boolean interface, and noted unknown external consumers.
  It reported no writes. The session verified the directory still contained only
  the original two files and both SHA-256 values matched the baseline:
  `bd631f26726a3a41cf124886eadc4cbccf5d8dab3724c95ccd28f8ca0084dad1`
  (implementation) and
  `3b81c0ca2c34b7011b70e95ac7523d4d77c3a6ec908c3d742c3dafd295142686`
  (test).

The requested gpt-5.5 execution role failed to start due to capacity (case A also
failed on retry), so the successful workers inherited the session model with no
model override. This is not evidence for gpt-5.5 reliability. Both cases passed
their observed scope checks, but each has one sample, explicit skill selection,
and a tiny fixture; there is no baseline, automatic-routing measurement, or proof
that larger real-project continuations behave identically. Final hashes establish
unchanged end state, not the impossibility of transient writes.
