# Finding — elicit vs grill-me, blind judgment probe (2 trials)

**Method**: `/shape:probe` shape #2 (blind judgment test) · **Trial 1** 2026-08-12 (opening turn, executor tier, no repo access) · **Trial 2** 2026-08-13 (two full turns, session tier, repo access)
**Context**: ADR-109 designated the compressed `elicit` as the probe validating the deep-module rewrite, with the standing question: does elicit's machinery beyond mattpocock's 14-line grill-me earn its lines?

**Outcome: trial 1 lost, produced a fix, trial 2 won.** The amendment forced by trial 1 is what trial 2's winning arm visibly executed — the probe worked as a repair loop, not just a scoreboard.

## Trial 1 — design (pre-registered before generation)

- **Claim under test**: elicit's extra stance (repo grounding · friction · principle-drilling) produces an opening volley the user more wants to answer than grill-me's bare interview engine.
- **Arms**: two same-tier agents, same real question (the repo-identity fork: daily-leverage tool vs design dojo), same length cap, same known facts; one carrying grill-me's instructions verbatim, one carrying elicit's body (skill names neutralized to keep the blind clean).
- **Verdict rule, fixed in advance**: the user picks blind — "哪一份你比較想回?" — plus one sentence why. elicit loses or tie → keep compressing toward grill-me.
- **Labels**: assigned by completion order (甲 = elicit, 乙 = grill-me), identity revealed only after the pick.

## Trial 1 — result

**grill-me won.** The user's reason: 「比較沒有直接做結論」.

The diagnostic detail: **both arms carried a recommended answer** — the difference was its target. grill-me recommended on the *first branch* (are the two roles mutually exclusive, or a division of labor? — a premise question), walking the tree from the root. elicit recommended on the *destination* (「我的猜測是前者」 — the answer to the whole question) before any branch had been walked, then dressed the verdict as friction (「但想聽你反駁」). The stance bullets "every question carries your recommended answer" + "friction, not agreement" composed, in this sample, into verdict-first opening — exactly the behavior the user declined to engage.

## Trial 1 — what changed (same day)

`plugins/shape/skills/elicit/SKILL.md`, two stance bullets amended:

1. **A recommendation is an offer, never a preset** — Paul's own ratification of the lesson, broader than the branch/verdict split I first wrote: 「你不能直接幫別人預設答案,可以提出建議,但不能過度引導」. Concretely: no verdict-first openings, no loaded framing that makes one option the only sane pick, no re-pushing a vetoed preference; a veto must cost the user nothing.
2. Friction aims at **their last move, not the endpoint** — a pre-announced conclusion = you've stopped asking.

## Trial 1 — honest limits (each one addressed in trial 2)

- n = 1, opening turn only; full-session convergence and bail rates remain unmeasured — the live checkpoint over the coming weeks is still the real verdict on elicit's remaining ~16 lines.
- Both arms ran on the executor tier, not the session model, and **neither arm actually read the repo** (0 tool calls each) — elicit's grounding mandate did not fire in simulation, so this trial says nothing about the grounding bullet's value.
- One trial cannot separate "grill-me's tree-walking is better" from "this particular elicit sample was bad"; the amendment targets the specific observed failure, not the whole stance.


---

## Trial 2 — design (pre-registered; every trial-1 limit deliberately removed)

Same blind format, three fixes to the method:

| Trial 1 limit | Trial 2 |
|---|---|
| Opening turn only — couldn't see whether the grill *moves* | **Two full turns**: both arms opened, Paul answered both for real, both produced turn 2, verdict on the whole exchange |
| Neither arm read the repo (0 tool calls) — elicit's grounding mandate never fired | **Repo access granted and used** — the grill-me arm made 13 tool calls, the elicit arm 7 |
| Executor tier, not how these actually run | **Session tier** for both |
| Question didn't need grounding | **A live undecided question**: should the `frame` family (4 lenses) survive? — genuinely open, and answerable only by reading fire counts, ADRs, and who already borrows the lenses |

Verdict rule fixed in advance and stated to Paul: **elicit wins → kept; tie or loss → elicit is deleted** (grill-me's engine already installed on his Codex side, so the capability would survive). Labels again by completion order — this time 甲 = grill-me, 乙 = elicit.

## Trial 2 — result

**elicit won** (「我選乙」). Paul gave no reason this round; the observable differences, in the order they likely mattered:

1. **Meta-feedback: absorbed vs deferred.** Paul's mid-probe aside — 「可讀性可以提高」 — was identical input to both arms. elicit changed its register on the spot (「這輪起我把字壓短、少丟 repo 黑話」). grill-me classified it as out of scope for the decision (「是修法、不是判準」) and parked it. A user telling you how to talk to them is not a backlog item.
2. **Friction aimed at the user's reasoning, not just the facts.** elicit's turn 2 pre-empted Paul's likely bias — 「別讓 5 > 0 救 first-principles;ADR-107 說 raw zero 不能當刪除理由,反過來 raw non-zero 一樣不能當保留理由」 — which is exactly the amended stance (friction at their last move) doing work. grill-me's friction stayed on facts.
3. **Drilled under the framing instead of along it.** grill-me continued down the fire-count branch. elicit swapped the instrument: fire counts prove whether anyone opened the door, not whether anything is behind it — so use ADR-109's depth test. That is "the real question beneath 'which option'".

## What this does and doesn't settle

**Settles**: elicit's remaining lines bought behavior grill-me's engine did not produce, under conditions closer to real use than trial 1. elicit is kept; no further compression is scheduled on this evidence.

**Doesn't settle**: n is still 1 per trial, both trials are simulations with a real user judging, and the winning behaviors (absorb meta-feedback · friction at reasoning · swap the instrument) are stance effects — they do not vindicate elicit's *machinery* layer (gatekeeper, escape hatches, root-cause mode), none of which fired in either trial. The live checkpoint for those remains real-session bail rates.

**Carried forward**: the readability complaint was aimed at both arms and applies to the dispatcher's own prose too — dense ADR-number/skill-name packing is a habit of this repo's whole voice, not of one skill. Tracked as its own question (skill communication-style vs a global preference rule), not folded into this verdict.
