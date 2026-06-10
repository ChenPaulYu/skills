---
date: 2026-06-10
status: raw
---

# first-principles as a post-design self-audit — turn the lens on what you just built

> Source: `think:first-principles` 的頭兩次實戰(TrackMate session, 2026-06-10)— 安裝當天跑了兩輪,第二輪的用法是 skill 文件沒寫的。

## The two runs (dogfood evidence)

1. **Forward use(設計對象)**:「幫我看一下目前針對 pool 的 design」— five-part structure held;four real divergences(ask-first retrieval · relevance sort · skip≠delete · global-library-with-projections),其中一條直接解掉一個掛著的 open question。Routing offer 運作正常(user 選了 opt-out「先放著」,筆記留對話)。
2. **Self-audit use(剛做完的東西)**:「你自己覺得這樣有符合我們想要的嗎?」— the *conventional answer under test was the design we had just shipped that afternoon*。Findings: the entrance hierarchy was inverted(visual doors treated as primary;our own axioms say composer > keyboard > visual),and a process-level finding — the whole afternoon's placement debate had been convention-layer churn the axioms could have short-circuited。User accepted both;design updated。

## The pattern worth keeping

**Run first-principles against your own fresh design before calling it done.** The "conventional answer" slot accepts *your own output* — and that's where it bites hardest, because a just-converged design feels settled and is maximally convention-contaminated(it inherited whatever the volley touched last)。The self-audit also caught the *agent's* failure(iterating form with the user instead of lifting to the rule)— the lens audits the process, not just the artifact。

## Candidate integrations

- A line in `think:first-principles`'s whenToUse: "also fires on 『這樣有符合我們要的嗎』-style self-audits — the conventional answer may be the thing you just built."
- A step in the future `shape:position` campaign: before landing a converged domain into core, one first-principles pass over it(axioms = the project's own principle tree)。
- Pairs with `2026-06-10-churn-is-an-altitude-alarm.md`: the self-audit is how the churn alarm gets *heard*。

## Also noted(skill works as designed)

Five-part output 結構穩;`AskUserQuestion` routing(併入/獨立筆記/先放著)被自然使用;與 elicit 的分工(derive vs extract)在實戰中沒有混淆——同日稍早的 elicit(原則樹)和這兩輪 first-principles 各司其職。
