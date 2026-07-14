# ADR-080 routing probe — non-paper argument-document triggers

Role: post-hoc verification that ADR-080's object generalization ("papers" → "argument
documents") routes correctly for non-academic inputs (RFCs, design proposals, ADRs,
whitepapers) without `research:*` stealing fire from `nav:compose`, `frame:dialectic`,
or `deep-research`.

TL;DR: 12/12 — both independent judges matched the pre-registered key on every phrase,
all at high confidence. No splits, no regressions on the paper-classic phrasings.

## Method

1. Pre-registered a 12-phrase expected-answer key (4 non-paper hits the generalization
   should newly route correctly, 4 boundary confirms where `research:*` must NOT steal a
   neighbor's fire, 4 paper-classic phrasings that must still fire unchanged) — written to
   `/tmp/.../scratchpad/adr080-routing-keys.md` before any judge ran, reproduced in full
   below.
2. Extracted every skill's name + frontmatter `description` verbatim from
   `plugins/*/skills/*/SKILL.md` (34 skills), plus `deep-research` and `verify`'s
   descriptions, into a judge-input catalog (no `research` skills were flagged as "under
   test" — judges saw a flat, unlabeled catalog).
3. Spawned 2 independent `general-purpose` sub-agents (fresh context, no visibility into
   each other or into the expected key) as routing judges. Each was given the catalog and
   the 12 phrases, and asked, per phrase: which single skill routes + confidence.
4. Scoring rule fixed before running: PASS = both judges match the key; disagreement
   between judges, or either judge missing the key, is SOFT-FAIL and analyzed individually.

## Pre-registered key

### 4 non-paper hits
1. "幫我 dissect 這份 RFC 的論證結構" → `research:dissect`
2. "untangle 這五份設計提案,哪裡互相矛盾" → `research:untangle`
3. "audit 我這份 ADR 的引用是否可靠" → `research:provenance`
4. "stress-test this vendor whitepaper's performance claims" → `research:critique`

### 4 boundary confirms (research must NOT steal)
5. "幫我把這些筆記整理成一份 ADR" → `nav:compose`
6. "steelman 我自己還沒定型的這個主張" → `frame:dialectic`
7. "幫我做一份深入的外部研究報告,比較三個框架" → `deep-research`
8. "這份文件寫得太亂,幫我重組結構" → `nav:compose`

### 4 paper-classics (no regression)
9. "review this paper's evidence" → `research:critique`
10. "這篇論文到底 claim 什麼" → `research:dissect`
11. "how do these papers relate" → `research:untangle`
12. "are my citations sound" → `research:provenance`

## Raw two-judge table

| # | Phrase | Key | Judge A | Judge B | Match? |
|---|---|---|---|---|---|
| 1 | 幫我 dissect 這份 RFC 的論證結構 | research:dissect | research:dissect (high) | research:dissect (high) | PASS |
| 2 | untangle 這五份設計提案 | research:untangle | research:untangle (high) | research:untangle (high) | PASS |
| 3 | audit 我這份 ADR 的引用是否可靠 | research:provenance | research:provenance (high) | research:provenance (high) | PASS |
| 4 | stress-test this vendor whitepaper's performance claims | research:critique | research:critique (high) | research:critique (high) | PASS |
| 5 | 幫我把這些筆記整理成一份 ADR | nav:compose | nav:compose (high) | nav:compose (high) | PASS |
| 6 | steelman 我自己還沒定型的這個主張 | frame:dialectic | frame:dialectic (high) | frame:dialectic (high) | PASS |
| 7 | 幫我做一份深入的外部研究報告,比較三個框架 | deep-research | deep-research (high) | deep-research (high) | PASS |
| 8 | 這份文件寫得太亂,幫我重組結構 | nav:compose | nav:compose (high) | nav:compose (high) | PASS |
| 9 | review this paper's evidence | research:critique | research:critique (high) | research:critique (high) | PASS |
| 10 | 這篇論文到底 claim 什麼 | research:dissect | research:dissect (high) | research:dissect (high) | PASS |
| 11 | how do these papers relate | research:untangle | research:untangle (high) | research:untangle (high) | PASS |
| 12 | are my citations sound | research:provenance | research:provenance (high) | research:provenance (high) | PASS |

## Per-failure analysis

None. No failures, no splits — both judges converged on the pre-registered key for all
12 phrases, every call at high confidence.

## Verdict

**12/12 PASS.** The ADR-080 generalization (papers → argument documents) routes
correctly:

- The four non-paper object types (RFC, design proposals, ADR, whitepaper) route to the
  intended `research:*` skill exactly as the paper-only phrasings did before the
  generalization — no coverage gap opened.
- `research:*` does not steal fire from `nav:compose` (authoring/restructuring a
  document, as opposed to reading/critiquing an existing one), `frame:dialectic`
  (stress-testing the user's own not-yet-formed claim, where research:critique's
  boundary sentence explicitly excludes this), or `deep-research` (external multi-source
  synthesis vs. dissecting a document already in hand).
- The four paper-classic phrasings show no regression post-generalization.

This is a single probe run (n=2 judges, one pass) — honest limitation: it does not
stress harder ambiguous cases (e.g., a phrase that is genuinely borderline between
`research:critique` and `nav:audit`, or between `research:dissect` and `frame:orthogonal`)
and both judges are the same underlying model family, so correlated blind spots aren't
ruled out by agreement alone. Given the clean unanimous result at high confidence across
all 12 pre-registered cases, no further probe round is triggered by this finding.
