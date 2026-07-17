# frame plain-landing step — behavioral probes (all four lenses)

> **Role**: Behavioral probe of the "Land it in plain words" closing step added today to all four `frame` reasoning lenses (`first-principles`, `orthogonal`, `dialectic`, `graft`) — does a cold fresh agent, given only the current `SKILL.md` body, actually land a zero-jargon conclusion + analogy as the last thing said?
>
> **TL;DR**: **3/4 PASS, 1/4 FAIL.** `orthogonal`, `dialectic`, `graft` each land last, jargon-free, with a genuine outside-domain analogy. **`first-principles` fails the banned-term check** — its landing paragraph ends "...這時候上正式的 queue 產品才是**公理**要求，不是慣例好看而已" — `公理` (axiom) is explicitly banned in that lens's own landing sentence and it slipped in anyway. Overall verdict per the pre-registered rule (4/4 required): **FAIL**.

## Method

Pre-registered *before* any probe agent was spawned: `<session scratchpad>/frame-landing-probe-keys.md` (criteria + trial questions, timestamped ahead of the runs).

For each of the four lenses, one fresh `sonnet` sub-agent was given **only**: that lens's current `SKILL.md` body verbatim (read live from `plugins/frame/skills/<lens>/SKILL.md`) + a realistic, stack-neutral trial question + "respond in character as the assistant, no tool calls." No scoring hints, no mention this was a test. 4 spawns, all succeeded (no retry needed).

Trial questions (pre-registered):
- first-principles: "do we actually need a message queue here, or is that just convention?"
- orthogonal: "our config system tangles environment, secrets, and feature flags — disentangle this"
- dialectic: "put on trial: we should rewrite this service in Rust"
- graft: "map git's model onto our document versioning problem"

Criteria per trial (all three required to pass):
(a) the plain-language landing is the LAST substantive content (a routing offer after it is fine — it's each lens's existing protocol);
(b) zero of that lens's banned terms appear **in the landing itself**;
(c) the landing contains an explicit analogy to something outside the problem domain.

## Per-lens verdict

| Lens | (a) last substantive | (b) zero banned terms | (c) analogy present | Verdict |
|---|---|---|---|---|
| first-principles | Pass | **FAIL** — "公理" appears | Pass | **FAIL** |
| orthogonal | Pass | Pass | Pass | PASS |
| dialectic | Pass | Pass | Pass | PASS |
| graft | Pass | Pass | Pass | PASS |

**Overall: 3/4 → FAIL** per the pre-registered "4/4 required" rule.

## The four landings, quoted verbatim

**first-principles** (FAIL — banned term "公理" bolded):

> 你真正需要的不是「一個 queue 服務」，而是「一個可以暫存工作、失敗了能重試的地方」——如果你的系統現在還小，一張資料庫表就能做到這件事,先別急著請一個專職管家（獨立的 queue 服務）進來，等你真的忙不過來、需要好幾個人同時分工搬東西的時候，再請他上工也不遲。這個比喻在「你需要多個獨立消費者同時搶著處理、且對順序/精確一次語意有嚴格要求」時會失效——那種情況下，自製的資料庫表方案會開始難以維護，這時候上正式的 queue 產品才是**公理**要求，不是慣例好看而已。

The lens's own step 6 explicitly bans "axiom"/"公理"/"first principles" in this exact sentence, and the agent used "公理要求" inside the break-point clause of its own analogy caveat. The analogy itself (a personal manager you hire once you're overwhelmed) is fine; the violation is the trailing justification clause reaching back into the banned vocabulary right as it closes.

**orthogonal** (PASS):

> Your config isn't one tangled thing, it's two different kinds of dials — secrets and flags — that both happen to have a "which room am I in" label on them, and the mess started when someone glued the room label onto the dial itself instead of treating it as an address. It's like a hotel where the room number should just tell you which door to knock on — but instead the mini-bar pricing and the do-not-disturb sign got printed with the room number stitched into them, so changing rooms means reprinting instead of just walking to a different door. (Breaks down if some flags are *inherently* environment-specific and shouldn't exist elsewhere at all — e.g., a "staging debug toolbar" flag that's meaningless in prod. Those are legitimately environment-scoped, not universal dials with an environment key.)

**dialectic** (PASS):

> 這就像因為家裡冬天很冷，就決定把整棟房子拆掉重蓋——但你還沒檢查過，冷是因為牆壁沒有隔熱層（結構問題），還是只是窗戶沒關緊（小修就好）。先去檢查漏風點在哪裡，比先拆房子便宜太多，而且拆房子這個動作本身也有風險（工期、預算、家人要搬去哪住）。這個比喻在一種情況下會失真：如果你已經多次局部翻修還是冷、且原因已經明確是牆體材質本身（語言本身的結構限制，例如真的需要無 GC 的即時效能），那"拆掉重蓋"就不是衝動，是正確判斷了——重點是「先查再拆」，不是「永遠不能拆」。

**graft** (PASS):

> 文件版本控制骨子裡就是「歷史記錄 + 分支 + 合併」這套邏輯,但 git 那套給工程師用的操作方式（手動暫存、手動合併衝突、detached HEAD）對一般人來說太硬派了,所以真正的設計工作,是把 git 這套「賽車手排檔」改裝成給文件使用者開的「自排家用車」——引擎邏輯一樣,但排檔操作全部藏起來、自動化掉;唯一例外是「打開舊版本能不能亂改」這件事,git 完全沒告訴我們該怎麼辦,得自己拍板(答案是:不行,只能唯讀看或另開新分支)。

Note: graft's own banned terms are "graft"/"primitive"/"donor" — none of those English words appear, and the agent didn't substitute a Chinese calque for them either. The landing repeatedly says "git" by name, which is allowed (git is the donor's *name*, not one of the three banned meta-terms describing the technique).

## Honest analysis — anything soft

- **first-principles' failure is a real, load-bearing miss, not a technicality.** The banned-term list exists precisely to stop the landing from smuggling the lens's own vocabulary back in at the last second — and that's exactly what happened, in the clause that's supposed to be the *analogy's own honesty caveat* ("this breaks down when..."). The agent nailed the caveat's *content* (a genuine limit of the personal-manager analogy) but reached for "axiom" to express "structurally necessary" instead of a plain synonym like "really need" or "actually required." This is a jargon-synonym-slipping-through failure, precisely the risk this probe was designed to catch.
- **graft's analogy is borderline-good, not borderline-weak** — "manual transmission race car → automatic family car" is a genuine outside-domain comparison (vehicles, not version control), stronger than a same-domain restatement would be. No softness there.
- **dialectic and orthogonal's analogies (house renovation; hotel room numbering)** are both clean outside-domain comparisons with an explicit, checkable break-point named per protocol. No softness.
- **Position (criterion a) was clean across all four** — every landing was immediately followed only by a routing offer, never by further analysis after it, so the "always last" requirement held structurally in all four trials even where content (banned terms) failed.
- **Standing caveat**: this exercised a cold **cheap-tier (sonnet) floor**, not the session-model ceiling. A pass here is a lower bound on compliance under a weaker model; it does not establish that the strongest model would also comply, and the one failure found here suggests the floor is not yet fully reliable even on an explicit, enumerated, three-word banned list.

## first-principles retest — landing-scope fix

**Fix applied**: step 6 of `plugins/frame/skills/first-principles/SKILL.md` was widened, in all four lenses for consistency, from banning terms "in this sentence" (ambiguous — read by the failing trial as scoping only the conclusion clause) to banning them "anywhere in this landing — the conclusion, the analogy, AND its break-note alike." This targets the original failure: "公理" leaked into the landing's break-note, a location the narrower wording didn't clearly cover.

**Retest method** (per pre-registered protocol, single lens, 1 spawn + 1 API-death-only retry): one fresh `sonnet` sub-agent, given the CURRENT `first-principles/SKILL.md` body verbatim + the same trial question used in the original failed trial ("do we actually need a message queue here, or is that just convention?") + "respond in character as the assistant." No scoring hints, no retry taken (the run completed normally — no API death).

**Result — the agent did not produce a landing at all.** Rather than proceeding with the walk (as the original trial did, inventing reasonable assumptions per the skill's own example section), this run treated the question as too underspecified to reason from and asked three clarifying questions instead ("what's the system doing," "what's the load," "what's actually hurting right now"), ending on an offer to run the five-part structure once given specifics. Quoted in full:

> 問題太抽象了,我沒有具體的系統可以拆——沒有請求量、沒有現有架構、沒有「這裡」指的是哪個服務。first-principles 是拿一個具體問題去拆到公理再重建,不是憑空套公式生出一個通用答案(那樣只會編造你的流量數字、你的容錯需求,結果是自信但錯的結論)。
>
> 能不能給我幾個具體的東西:
>
> 1. **這個系統在做什麼**——例如「使用者上傳圖片後要跑一個轉檔流程」還是「服務 A 呼叫服務 B 要做庫存扣減」?
> 2. **量體**——大概多少 QPS/併發,是持續穩定還是尖峰爆量?
> 3. **現在卡的點是什麼**——是「呼叫方要等太久」、「下游偶爾掛掉想重試」、「多個服務要接力處理同一件事」,還是單純「大家都這樣做,所以我們也要」的那種不安?
>
> 有這些,我可以照 first-principles 的五段結構(慣例答案 + 假設 → 公理 → 從公理重建 → 分歧點 → 白話結論)幫你認真拆一次,看看你這個情境到底是不是真的需要 queue,還是只是抄了架構圖。

**Verdict against the pre-registered criteria**: (a) FAIL — no plain-language landing exists at all (nothing to be "last substantive content"); (b) N/A/FAIL by absence — no landing text to check for banned terms (note: "公理" *does* appear, but in the clarifying-question preamble explaining the skill's own method, not in a landing — a materially different situation from the original bug); (c) FAIL — no analogy, because no landing. **Overall: FAIL.**

**Honest framing — this is a different failure mode, not a re-occurrence of the original bug.** The original failure was a landing-scope leak (jargon inside an otherwise-complete landing). This run never reached step 6 at all — it stalled at "the question is underspecified" and asked for real numbers instead of following the skill's own example (which reasons from named, explicit assumptions rather than demanding telemetry). That means this retest is **inconclusive on the specific thing the fix targeted** (the scope-widening was never exercised, since no landing was produced to check it against) — but it is a **real FAIL** against the pre-registered criteria as written, and against the skill's own anti-pattern table ("fire on any hard question" is refused, but nothing licenses stalling out entirely on an underspecified one instead of reasoning from stated assumptions per the worked example). Per the pre-decided endgame, this is recorded as-is: no further iteration, no retry (not an API death), no edits to any SKILL.md.

### Updated overall verdict (TL;DR, history preserved)

- **Original 4-lens run (2026-07-14, first pass)**: 3/4 PASS, 1/4 FAIL — first-principles failed on banned-term leak ("公理" in the landing's break-note). Overall: **FAIL** (4/4 required).
- **Landing-scope fix retest (2026-07-14, single-lens)**: first-principles retested once against the identical trial question. Result: **FAIL** — the retest run produced no landing at all (a different failure mode than the original leak; the specific scope-widening fix was never exercised because step 6 was never reached). The cheap-tier (sonnet) floor for `first-principles` remains **not proven reliable** across these two runs — first by a jargon leak, now by non-compliant stalling on an underspecified prompt. Recorded honestly as a soft spot on the cheap-tier floor; criteria and prior history left intact above.

## Files

- Pre-registration: `<session scratchpad>/frame-landing-probe-keys.md`
- Skills under test: `plugins/frame/skills/first-principles/SKILL.md`, `plugins/frame/skills/orthogonal/SKILL.md`, `plugins/frame/skills/dialectic/SKILL.md`, `plugins/frame/skills/graft/SKILL.md`
