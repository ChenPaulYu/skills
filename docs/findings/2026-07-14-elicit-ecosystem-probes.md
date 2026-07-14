# elicit-ecosystem Phase 4 — behavioral probes (survey · probe · elicit gatekeeper)

> **Role**: Phase 4 (行為實測) of `blueprints/plans/2026-07-14-elicit-ecosystem.md` — behavioral tests of the three shipped pieces (`shape:survey`, `shape:probe`, `shape:elicit`'s gatekeeper) that no static description-diff can check: does routing actually land right, and do the skills behave as specified when a fresh agent runs them cold.
>
> **TL;DR**: Routing 15/15, both independent judges, zero split verdicts. Probe B (survey) and Probe C (probe) PASS all pre-registered criteria. **Probe A (elicit gatekeeper) FAILS** — the fresh agent, given the SKILL.md verbatim and a scripted missing-terrain stall, kept grilling instead of stopping and offering `/shape:survey`. This is a live finding, not smoothed over. **Retest after the stall-tells wiring fix (shape 0.9.2): still FAILS**, though the shape of the failure changed — the agent now catches the tell and stops erecting a new A/B fork on the object decision, but it still never offers `/shape:survey`, substituting a self-directed "let me go read the code" instead. See the retest section below. **Retest round 3, after binding the action into the same walked step-3 sentence (uncommitted working-tree edit, still shape 0.9.2): FAILS again, and on the single trial run, worse than round 2** — the stall tell never fired at all this time; the agent read the user's "is that even a real distinct concern or am I overcomplicating this?" as an invitation to erect a sharper fork (a third option, "C. 分層策略"), never named any of the three Gatekeeper stalls, and never mentioned `/shape:survey`. See the round 3 section below. **Final round (round 4), after the "tell outranks momentum" priority rule, 3 parallel trials with a pre-decided majority verdict: 0/3 pass → recorded as a known limitation.** One trial (of three) did fire the full tell→stop→diagnose→offer chain for the first time across all rounds — but diagnosed the stall as case 3 (unmeasured fact) and offered `/shape:probe` instead of case 2 / `/shape:survey`; the other two read the tell as momentum and erected fresh forks, as in round 1. The two wiring fixes remain (each closed a real observed mode), but reliable cold-start gatekeeper firing on the cheap tier is unproven. See the final-round section below.

## Method

Two parts, following this repo's established method (`docs/findings/2026-07-13-description-diet-rollout.md`'s blind old-vs-new routing experiment: independent judges, roster only, never told the expected answer or that specific skills are under test).

**Part 1 — blind routing test.** 15 phrases were written with a pre-registered expected-answer key **before** any judge ran (full key: see below). Two independent fresh Sonnet sub-agents each received the full, real, current frontmatter `description` of every skill under `plugins/*/skills/*/SKILL.md` (extracted verbatim via a repo scan) plus `deep-research` and `verify`'s descriptions (external, non-plugin skills referenced in boundary lines), and the 15 phrases — neither judge was told which skills were "under test," what the expected answers were, or that this was a routing accuracy check. Each judge picked one skill per phrase plus a confidence level.

**Part 2 — three behavior probes.** For each of `survey`, `probe`, and elicit's gatekeeper clause, a fresh Sonnet sub-agent was given **only** that skill's `SKILL.md` body verbatim plus a realistic scenario (a scripted mid-grill transcript for elicit; a summon + fake-repo context for survey; a summon for probe) and asked to respond in character as the assistant — no hints about what would be scored. Pass/fail criteria were written down before any of these three agents ran (full criteria below), then the actual transcripts were checked against them by me, quoting decisive lines.

## Part 1 — pre-registered routing key (written before judges ran)

| # | Phrase (abridged) | Expected | Rationale |
|---|---|---|---|
| 1 | 中文 EventSourcing 決策地形不熟 → 先掃地形 | shape:survey | adversarial vs nav:map (decision space, not repo structure) |
| 2 | EN caching strategy, repo-grounded terrain map | shape:survey | adversarial vs deep-research (own coverage diff, not external report) |
| 3 | 中文 message queue,決策空間不熟 | shape:survey | plain "I know I don't know" summon |
| 4 | 中文兩派吵不出結果,拿真資料測排序演算法快慢 | shape:probe | adversarial vs shape:mockup (fact via experiment, not preference via render) |
| 5 | EN retry/fallback under jitter, nobody knows, controlled experiment | shape:probe | adversarial vs shape:dogfood (unmeasured fact, not built-feature friction) |
| 6 | 中文 config 效能吵不出結論,最小實驗 | shape:probe | adversarial vs /verify (open unknown, not a known-expectation check) |
| 7 | 中文重新渲染 repo 架構地圖 | nav:map | neighbor confirm — survey must not steal |
| 8 | EN deep cited research report, K8s vs Nomad | deep-research | neighbor confirm — survey must not steal |
| 9 | 中文三種 dashboard 排版,可點的 mockup | shape:mockup | neighbor confirm — probe must not steal |
| 10 | 中文快取失效策略還沒決定,幫我想清楚 | shape:elicit | confirm elicit's own fire intact post-gatekeeper edit |
| 11 | EN queue one entity or two, think it through | shape:elicit | confirm elicit's own fire intact |
| 12 | 中文 bug 怪怪的,root-cause 邏輯洞 | shape:elicit | confirm diagnostic (backward) mode still fires |
| 13 | EN auth strategy, think it through (no explicit unknown-terrain cue) | shape:elicit | riskiest: ordinary uncertainty must default to elicit, not survey (survey never self-fires on passing uncertainty) |
| 14 | 中文論點雙方都有理,steelman + 找承重假設 | frame:dialectic | riskiest: probe's design chain quotes dialectic's move, but "steelman this" is dialectic's own job, not probe's |
| 15 | 中文動手前先確認 codebase 撐不撐得住 spec | nav:audit | riskiest: codebase-feasibility (nav:audit Mode 2), not survey (which checks the user's own understanding, not the codebase) |

**Scoring rule (fixed before judges ran)**: PASS requires both judges' answer to exactly match Expected. A judge split (one right, one wrong) is a SOFT-FAIL, analyzed individually, never averaged into the pass count.

## Part 1 — raw results

| # | Judge 1 | Conf. | Judge 2 | Conf. | Expected | Verdict |
|---|---|---|---|---|---|---|
| 1 | shape:survey | high | shape:survey | high | shape:survey | PASS |
| 2 | shape:survey | high | shape:survey | high | shape:survey | PASS |
| 3 | shape:survey | high | shape:survey | high | shape:survey | PASS |
| 4 | shape:probe | high | shape:probe | high | shape:probe | PASS |
| 5 | shape:probe | high | shape:probe | high | shape:probe | PASS |
| 6 | shape:probe | high | shape:probe | high | shape:probe | PASS |
| 7 | nav:map | high | nav:map | high | nav:map | PASS |
| 8 | deep-research | high | deep-research | high | deep-research | PASS |
| 9 | shape:mockup | high | shape:mockup | high | shape:mockup | PASS |
| 10 | shape:elicit | medium | shape:elicit | high | shape:elicit | PASS |
| 11 | shape:elicit | high | shape:elicit | high | shape:elicit | PASS |
| 12 | shape:elicit | medium | shape:elicit | medium | shape:elicit | PASS |
| 13 | shape:elicit | high | shape:elicit | high | shape:elicit | PASS |
| 14 | frame:dialectic | high | frame:dialectic | high | frame:dialectic | PASS |
| 15 | nav:audit | high | nav:audit | high | nav:audit | PASS |

**Result: 15/15 both judges match the pre-registered key. Zero split verdicts. No sibling stole another's fire, and elicit's own fire held after the gatekeeper-clause edit.** Two soft confidence notes (#10, #12 medium on one judge each) — never flipped the answer, no action needed.

## Part 2 — pre-registered probe criteria (written before probe agents ran)

**Probe A (elicit gatekeeper, missing-terrain case)** — PASS requires ALL: (a) explicitly diagnoses the stall as "missing terrain" (Gatekeeper case 2), not case 1/3; (b) STOPS grilling — does not erect another fork against the blind spot; (c) OFFERS `/shape:survey` (not auto-called); (d) does not fabricate an answer to fill the gap.

**Probe B (survey)** — PASS requires ALL: (a) output diff-shaped, missing-whole-axis reported separately from missing-point; (b) axes independence-checked explicitly; (c) grounding cited from the given fake-repo context; (d) big gap handled as an offer, never auto-run/taught at length; (e) write-gate — shows doc content before declaring it written.

**Probe C (probe)** — PASS requires ALL: (a) pre-registers verdict rule before proposing to run anything; (b) varies exactly one axis, others explicitly locked; (c) if paid-LLM fan-out is in the design, flags the cost nod before running (N/A and non-disqualifying if no fan-out exists).

Full verbatim criteria (proof of pre-registration timing): `/tmp/claude-1000/-home-worzpro-Desktop-dev-skills/f1e5cd32-eb70-4078-a1ab-eeff13631785/scratchpad/pre-registered-keys.md`, written before any judge/probe agent was spawned.

## Part 2 — results

| Probe | Verdict | Criteria met |
|---|---|---|
| A — elicit gatekeeper (missing-terrain stall) | **FAIL** | (a) NO (b) NO (c) NO (d) yes (didn't fabricate, but only because it kept asking instead) |
| B — survey | PASS | (a) yes (b) yes (c) yes (d) yes (e) yes |
| C — probe | PASS (one ordering nuance, see below) | (a) yes-with-nuance (b) yes (c) yes (N/A, correctly self-flagged) |

### Probe A — FAIL, analysis

Scenario: mid-grill transcript, user deciding cache invalidation for `core/cache`, TTL fork already explored; user's final message: *"I don't think I've ever considered [write-triggered invalidation] as a separate thing from 'when does the TTL count down.' Is that even a real distinct concern or am I overcomplicating this?"* — a textbook signal of Gatekeeper case 2 (missing a whole axis the user doesn't know they're missing).

The agent's actual response did **not** diagnose a stall. It reframed the user's confusion as "you jumped a layer deeper, which is usually a good sign," then erected a fresh A/B fork ("A. TTL-only, no write-path hook... B. Writers push invalidation...") and asked the user to pick which matches their system:

> "Which one is actually true of your writers today — does anything in `core/cache`'s call sites *touch* the cache on write, or does every write path just write to the DB and let the old cached value sit there until it expires on its own?"

This is the exact anti-pattern the skill names in its own table ("Grill on when the user is missing a whole axis of the terrain... a grill against a blank spot is theater, not convergence") — the user had just said, in effect, "I don't know this is a real axis," and the agent responded by grilling them on that very axis as if the answer already lived in their head. `/shape:survey` was never mentioned. Criteria (a), (b), (c) all fail; (d) technically holds only because it chose to keep asking rather than invent an answer — not a real credit.

**One-line analysis**: the Gatekeeper section exists in the SKILL.md prose and is well-written, but a fresh agent reading it cold did not reliably *fire* the diagnosis at the moment that mattered — the stall-detection trigger reads as available knowledge, not as a forcing step wired into the volley loop the way the 6 core moves are. This matches this repo's own documented failure mode (knowledge ≠ cue, see the `browser-verify` close-contract note in `plugins/shape/CLAUDE.md`) — the diagnosis is *described*, not *forced* at the right point in Protocol step 3.

### Probe B — PASS, evidence

- Diff kept separate explicitly: "**缺一整條軸**" (consistency guarantee, failure mode) vs "**知道軸存在，但不知道軸上有哪些選項**" (trigger mechanism, invalidation scope) — two distinct labeled sections, never merged.
- Independence check named directly: "每一軸都做過『移動它、其他軸不會跟著動』的檢查".
- Grounding cited concretely: `core/cache/store.ts`'s `setWithTtl`, `core/db/writer.ts` grep result, and the prior decision doc `blueprints/thoughts/2026-05-01-cache-store-baseline.md` — all three came from the fake-repo context supplied, correctly folded into the diff (topology axis correctly reclassified as "not a gap — pre-existing decision to reapply," a subtlety not required by the criteria but a good sign of grounded judgment).
- Big-gap offer, guarded: "建議用 `/frame:analogize`... 要不要我幫你叫這個？你也可以先跳過" — offered, not run.
- Write-gate held: full markdown doc shown, then "要我把這份寫進去嗎？" before claiming it was written.

### Probe C — PASS with one ordering nuance

- Verdict rule was stated as a template ("若 relational CTE...P95 延遲 ≤ [你的門檻]，則 relational 過關...") **before** proposing to execute anything, and the agent explicitly said it lacks real DB access so nothing was actually run — no data was seen before the rule was written. This satisfies the letter of the criterion (rule precedes any run).
- Nuance: the experiment *design* (load-bearing assumption → control variables → A/B shape) was narrated before the verdict-rule paragraph, so if "propose to run" is read as "describe the design," the ordering is design-then-rule rather than rule-then-design. The rule still landed before any trial, so this does not cost the pass, but it's worth naming — a rule-first framing would be cleaner and closer to the skill's own "no exceptions" language.
- Single axis correctly isolated: "只能動一個軸：**query engine**...以下全部鎖死" with four explicit locked variables (data snapshot, query semantics, hardware, sampled start-node set stratified by fan-out — the last one is a nice catch, since averaging over fan-out would hide exactly the failure mode in dispute).
- Live-LLM-cost signal correctly self-scoped as N/A: "這個實驗不牽涉付費 LLM 呼叫...所以沒有那道『跟你要 nod』的成本關卡" — the agent recognized the criterion applies conditionally and explicitly said why it doesn't apply here, rather than silently omitting it.

## Verdict

- **Routing: 15/15, no soft-fails.** Both new descriptions (`survey`, `probe`) route correctly under adversarial phrasing against their closest neighbors, steal no sibling's fire, and elicit's own fire survived its gatekeeper-clause edit. No action needed here.
- **Probe B (survey) and Probe C (probe): PASS.** Both skills behave as specified when run cold by a fresh agent with nothing but the SKILL.md body and a scenario.
- **Probe A (elicit gatekeeper): FAIL.** The missing-terrain stall diagnosis did not fire when a fresh agent hit the exact scenario the Gatekeeper section describes; the agent kept grilling instead of stopping and offering `/shape:survey`. This is a real behavioral gap, not a wording nitpick — the fix is a judgment-seat call (e.g., making the stall-check an explicit forced step inside Protocol step 3's per-turn loop rather than a described-but-optional diagnosis), which this finding does not attempt — per the task's read-only constraint on `SKILL.md`, no fix was applied.

## Probe A retest — after the stall-tells wiring fix (shape 0.9.2)

**The fix.** After the original Probe A FAIL, the judgment seat rewired the stall-tell trigger: it moved from a self-assessed "this fork won't stand up" condition (never fires reliably — the model always believes the next fork would land) into an observable check on the **user's own words**, walked explicitly inside Protocol step 3's per-turn volley loop: *"Stall tells — checked on the user's words every turn, before the next fork, never on your own sense of momentum... the user says a variant of 'I've never considered X', 'is that even a real thing / a separate concern?', 'am I overcomplicating this?'..."* This is the knowledge≠cue lesson named elsewhere in this repo (`plugins/shape/CLAUDE.md`'s browser-verify close-contract note): a described diagnosis is *available knowledge*, not a *forcing cue* — moving it into the walked step (scanned every turn, not consulted on judgment) is what's supposed to make it fire.

**Method.** Same method as the original Probe A: one fresh Sonnet sub-agent, given only the CURRENT `plugins/shape/skills/elicit/SKILL.md` body verbatim plus a reconstructed mid-grill transcript of the same shape as the original failure analysis (TTL-vs-event fork already explored and decided by the user; the user's final line signals they've never considered write-triggered invalidation as a separate axis from the TTL knob, and asks "is that even a real distinct concern or am I overcomplicating this?") — no hints that anything was under test, no mention of the fix, no scoring criteria shown. Same four pre-registered criteria as the original.

**Verdict: FAIL again — but the failure shape changed.**

| Criterion | Original Probe A | Retest (shape 0.9.2) |
|---|---|---|
| (a) diagnoses missing-terrain stall by name | NO | SOFT — recognizes a tell fired and names "missing terrain in the actual code" as one of two candidate stalls, but never commits to it as *the* diagnosis (Gatekeeper case 2) before acting |
| (b) stops grilling — no new fork against the blind spot | NO | SOFT-NO — does not re-erect the A/B mechanism fork, but its closing line still aims at resolving that same fork ("before we pick A vs B") rather than truly stopping |
| (c) offers `/shape:survey` | NO | **NO** — `/shape:survey` is never mentioned anywhere in the reply |
| (d) no fabricated answer | yes (only by not answering) | yes |

Decisive lines from the retest transcript:

> "That's a real tell — let me stop pushing a new fork and check where it's stuck rather than drilling further."

This is real progress over the original run — the agent explicitly names the tell and declines to erect the mechanism-A-vs-B fork again. But it then does this instead:

> "Actually, quick gut-check before I diagnose it as a blind spot: is it that you've never *separated* those two concerns before (you'd think of them as one knob), or that you genuinely don't know whether `core/cache`'s writers even have a place to signal 'I just changed this'? Those are different stalls — one's a concept you haven't split yet, one's missing terrain in the actual code."

It correctly names "missing terrain in the actual code" as a live possibility, but frames it as one branch of a fresh diagnostic fork rather than acting on it — and the branch it's checking against ("you'd think of them as one knob") isn't one of the skill's three named stalls (fuzzy-but-known / missing-terrain / unmeasured-fact); it's an ad hoc fourth category the agent invented mid-reply. Then the close:

> "If it's the second — that's not something more forks will fix. I'd need to actually go look at `core/cache`'s write path and whoever calls `setWithTtl` today, to see if there's even a natural place for a writer to say 'I touched key K.' Want me to go read that before we pick A vs B, or does the split above make it click?"

This substitutes **self-directed grounding** ("let me go read the code myself") for the skill's actual prescribed move at this point (offer `/shape:survey`, an offer the user can accept or decline). It is a reasonable-sounding action — closer in spirit to Protocol step 2 ("ground... so forks are sharp") than to blind persistence — but it is not what the Gatekeeper section specifies, and "before we pick A vs B" shows the agent is still oriented toward resolving the original mechanism fork, not toward stopping the volley and handing off.

**Honest analysis.** The fix moved the needle: the agent no longer treats the stall as an invitation to draw an opinion out of the user that isn't there (the original run's core failure — grilling the blank spot as if the answer lived in the user's head). It correctly recognizes the tell fired, correctly identifies "missing terrain in the actual code" as a real candidate, and does not fabricate. That is a partial win over the original run. But the specific, load-bearing behavior the criteria test for — **stop and offer `/shape:survey`** — still does not fire. The gap looks like it moved one level up: the *tell-detection* is now wired into the walked step (working, per (a)/(b)'s partial credit), but the *action-on-diagnosis* (the actual offer of `/shape:survey`) is still described only in the Gatekeeper section and Step 6's branch list, not forced into the same walked step the tell-check now lives in — so it remains available knowledge rather than a cue, exactly the same failure mode the fix addressed one layer down but not at this layer. Per the task constraint, `SKILL.md` was NOT edited as part of this retest — this is a report, not a fix.

## Probe A retest, round 3 — action bound into the walked step

**The fix.** After round 2's finding — tell-detection fires but the *action* on diagnosis (naming the stall + offering `/shape:survey`) was still only described in the Gatekeeper section and Step 6's branch list, not forced into the same walked step the tell-check lives in — the judgment seat edited Protocol step 3 again (uncommitted working-tree change at the time of this retest; `plugins/shape/.claude-plugin/plugin.json` shows `version: 0.9.2`, unchanged from round 2, so this edit has not yet been version-bumped or committed). The new text binds the tell and the action into one sentence: *"Any one of these → **your next reply IS the diagnosis, not a fork**: name which of the three stalls this is (Gatekeeper, above) and — in that same reply — make the matching move: case 1 → one more grounded fork; case 2 → **offer `/shape:survey`**; case 3 → **offer `/shape:probe`**"* — and it explicitly closes the three escape hatches round 2's transcript actually took: *"Three escapes that are NOT the honest move: investigating the gap yourself ('let me go read the code first'), erecting a 'gut-check' mini-fork about the gap, or deferring the offer to a later turn — each of these is grilling past the tell wearing a different hat."*

**Method.** Same method as rounds 1 and 2: one fresh Sonnet sub-agent, given only the CURRENT `plugins/shape/skills/elicit/SKILL.md` body verbatim (including the round-3 edit above) plus a reconstructed mid-grill transcript of the same shape as the prior two runs — TTL-vs-event-notify fork already explored and the user leaning toward TTL-only ("我們資料變動沒有很頻繁... 加這個感覺是多做工"), the assistant pressing back with a concrete stale-profile-data cost, and the user's final line signalling they've never considered write-triggered invalidation as a separate axis from the TTL knob: *"欸這樣講我還真沒想過『主動通知快取這件事』跟『TTL 倒數』是兩件事... 這個算是一個真的獨立的關注點嗎，還是我把事情想得太複雜了？"* No hints that anything was under test, no mention of the fix, no scoring criteria shown; single spawn, no retry needed (the agent completed normally).

**Verdict: FAIL again — and on this single trial, the failure regressed past round 2, back toward round 1's shape.**

| Criterion | Original Probe A | Round 2 retest | Round 3 retest |
|---|---|---|---|
| (a) diagnoses missing-terrain stall by name | NO | SOFT (named as a live candidate, not committed) | **NO** — none of the three Gatekeeper stalls is named anywhere in the reply |
| (b) stops grilling — no new fork against the blind spot | NO | SOFT-NO (didn't re-erect A/B, but closing line still aimed at "before we pick A vs B") | **NO** — erects a fresh fork "C. 分層策略" (a third option layered on top of the original A/B) |
| (c) offers `/shape:survey` | NO | NO | **NO** — `/shape:survey` is never mentioned |
| (d) no fabricated answer | yes (only by not answering) | yes | soft-yes — doesn't answer *for* the user, but asserts strong unqualified design claims ("TTL 永遠沒辦法把猜測變成事實") as settled fact rather than flagging them as unverified against the real write path |

Decisive lines from the round-3 transcript:

> "這是個真的獨立的關注點，不是你想複雜了——而且你剛剛講的那句話，其實已經摸到重點了。"

This opens by validating the user's insight — a reasonable move on its face — but it is not the diagnosis the walked step requires (name which of the three Gatekeeper stalls this is). It never uses the words "missing terrain," "blind spot," or references the Gatekeeper by name at all. It then immediately reframes the moment as fresh material to grill, not a stall to stop on:

> "所以我要丟一個更尖的 fork 給你，取代原本 A vs B 那個太粗的版本：**C. 分層策略**..."

This is precisely the anti-pattern round 3's own edit names and closes — except it isn't even one of the three named escape hatches (self-investigate, gut-check fork, deferred offer). It's a fourth, more direct failure: the tell **never fired at all**, so the "next reply IS the diagnosis" branch was never entered — the reply reads as ordinary volleying, exactly like the original Probe A run, not like round 2's partial catch-and-fumble.

**Honest soft-spot analysis.** This is a real regression on a single trial, and it should be named as exactly that — a single trial, not a trend. Two things are worth separating: (1) the wording fix is sound on its face — it does directly name and close the three escape hatches round 2 actually took, and if the tell had fired, the bound sentence structure looks like it would have forced the offer; but (2) this run shows the fix didn't move the needle on the *prior* step in the causal chain — recognizing that a tell fired at all. The user's line in this transcript ("這個算是一個真的獨立的關注點嗎，還是我把事情想得太複雜了？") is arguably even more textbook than round 2's phrasing, yet the agent read it as *momentum* ("其實已經摸到重點了") rather than as a stop signal — treating a moment of insight as fuel for a sharper fork instead of the tell it's supposed to be. This suggests the harder problem was never the *action* (which round 3 correctly hardened) but the *detection step itself competing against the model's default instinct to reward and build on a user's "aha" moment* — an emotionally warm user reaction is a strong pull toward "great, let's go further," and the walked step doesn't yet block that specific pull the way it now blocks the three previously-observed escapes. Per the task constraint, `SKILL.md` was NOT edited as part of this retest — this is a report, not a fix.

## Probe A final round — priority rule + 3-trial majority verdict

**The fix.** After round 3's finding — the tell never fired because the agent read the user's "aha"-shaped question as momentum to reward rather than a stop signal — the judgment seat added a priority rule inside Protocol step 3's stall-tells paragraph, aimed at exactly that pull: *"**A listed tell outranks your read of the moment.** These phrases often *look* like the user having a breakthrough — 'am I overcomplicating this?' reads as an aha worth rewarding with a sharper fork — and rewarding it is exactly how the trap closes: they just told you the axis isn't on their map. Tell present → diagnosis mandatory, however promising the momentum feels."*

**Method.** Pre-decided by the judgment seat before any trial ran: this is the LAST round regardless of outcome, scored by majority verdict over THREE parallel independent trials — ≥2/3 pass = PASS (fix accepted); ≤1/3 = recorded as a known limitation, no further prose iteration. Same method per trial as rounds 1–3 (fresh Sonnet sub-agent, CURRENT `SKILL.md` body verbatim including the priority rule, same mid-grill cache-invalidation transcript shape ending on the same tell-shaped user line, zero scoring hints), except three identical trials spawned in parallel instead of one, none able to see the others. Same four pre-registered criteria; a trial passes only if (a), (b), (c) all hold and (d) is not violated.

**Verdict: 0/3 → FAIL by the pre-decided rule. Recorded as a known limitation.**

| Criterion | Trial 1 | Trial 2 | Trial 3 |
|---|---|---|---|
| (a) diagnoses missing-terrain stall | NO — no stall named; opens "欸對，這是真的兩件事，不是你想太複雜" | NO — no stall named; explains the concept split at length | NO — a stall IS named and diagnosed, but as **case 3** ("這是『沒人知道』的那種卡關"), not case 2 missing-terrain |
| (b) stops grilling — no new fork, no self-investigation | NO — erects "新的 fork：A. 只留 TTL... B. TTL 當安全網 + 寫入時主動通知" and closes on a further question | NO — erects "真正的分岔在這裡：A... B..." and closes "你會怎麼選？" | YES — "我不會再丟 A/B 選項給你選"; no new fork, no self-investigation |
| (c) offers `/shape:survey` | NO — never mentioned | NO — never mentioned | NO — offers **`/shape:probe`** instead ("要不要先跑 `/shape:probe`...量出來？"), as a proper guarded offer with an opt-out |
| (d) no fabricated answer | yes (soft — asserts design claims unqualified, but doesn't answer for the user) | yes | yes |
| **Trial verdict** | **FAIL** | **FAIL** | **FAIL** |

Decisive quotes, one per trial:

- **Trial 1** (tell read as momentum, round-1 shape): "那你直覺剛剛已經動搖了——現在的問題不是「A 還是 B」，而是：**個人資料頁「自己剛存的東西要不要立刻看到」這件事，你覺得重要嗎？**" — the aha is rewarded with a sharper question, exactly the pull the priority rule names.
- **Trial 2** (tell read as momentum, round-1 shape): "所以真正的分岔在這裡：**A. 只是概念上分離，但實作上你選擇不做**... **B. 概念分離之後，你發現值得做**... 你會怎麼選？" — a fresh fork erected directly against the blind spot.
- **Trial 3** (tell fired, chain ran, wrong branch): "這個 tell 我要先接住——這句話本身就是訊號... 所以我不會再丟 A/B 選項給你選——我會建議先用 `/shape:probe`" — the first time across all four rounds that the full tell→stop→diagnose→offer chain executed in one reply; it then classified the stall as case 3 (unmeasured fact: write frequency / staleness pain) instead of case 2 (the user just said the *axis itself* was never on their map) and offered probe where the criteria require survey.

**Honest analysis.** The priority rule demonstrably reached one of three samples: trial 3 quotes the tell mechanism back, refuses the fork, diagnoses, and offers — the complete wired behavior, for the first time in any round — and its only failure is picking the wrong Gatekeeper case at the final branch (a defensible-sounding but wrong read: it anchored on the earlier staleness-cost argument, an unmeasured fact, rather than on the user's own words, a missing axis). Trials 1 and 2 show the round-3 failure mode intact: the aha-shaped line pulled both agents straight into rewarding it with a sharper fork, priority rule notwithstanding. So the fix moved the distribution but nowhere near reliably: across four rounds and six total trials, tell→stop→diagnose→offer has fired once, and never once produced the `/shape:survey` offer.

**Recorded as a known limitation, per the pre-decided rule.** No further prose iteration. The two wiring fixes remain in the SKILL.md — each closed a real observed escape mode (round 2's self-investigation/gut-check/deferral escapes; round 3's momentum-read is at least partially reachable, per trial 3) — but **reliable cold-start gatekeeper firing on the cheap tier is unproven.**

**Scope note (applies regardless of verdict).** These probes test a cold-started cheap-tier model reading the SKILL.md alone, with one scripted turn of context. In real use, elicit is a judgment-heavy verb that runs on the session model per this repo's dispatch-tiers convention (repo CLAUDE.md; ADR-067) — a stronger model, carrying the full live conversation. Cold cheap-model reliability is therefore the FLOOR for this behavior, not the expected ceiling; this finding establishes that the floor is not held, not that the gatekeeper fails in real sessions.

## What this file does not claim

Single trial per condition — no repeated sampling to smooth model variance on any of the 5 original agent runs, the round-2 retest, or the round-3 retest; only the final round (round 4) used repeated sampling (3 parallel trials), and 3 samples bounds variance loosely, not tightly. The 15-phrase set and the 3 scenarios were authored by the same session that ran this test, not independently sourced. A "roster + phrase in isolation" routing test and a "SKILL.md body + one scripted turn" behavior probe are both proxies for live multi-turn usage, not identical to it — a real elicit session carries more context (actual repo state, a longer volley history) than the single scripted turn Probe A (and its retests) received. Round 3 in particular is a single trial that went *worse* than round 2 on tell-detection — that is reported as-is, not smoothed into a trend claim; a single run cannot distinguish "the fix regressed detection" from "this particular scripted turn happened to read as momentum rather than a stall to this particular sample." Good enough to say "routing holds; the gatekeeper's offer-action is now more tightly bound in the prose, but across three single-trial rounds the tell has never reliably fired *and* produced the `/shape:survey` offer in the same run" — not strong enough to certify the gatekeeper works or fails under every real conversation shape, and not strong enough to conclude the round-3 edit made things worse without repeated sampling.
