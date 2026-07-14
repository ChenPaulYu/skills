# nav:tour routing probe

Role: post-hoc verification that adding `nav:tour` (ADR-082) and narrowing `nav:map`'s
onboarding trigger routes correctly — positives select `tour`, boundary negatives stay
with their owner (especially `nav:map`, whose description used to claim onboarding
language directly).

TL;DR: 15/15 — a single independent judge matched the expected owner on every phrase.
Three phrases came back medium-confidence (#2, #5, #13) but landed on the correct skill
each time; no boundary negative was stolen by `tour`.

## Method

1. Extracted every skill's name + frontmatter `description` verbatim from
   `plugins/*/skills/*/SKILL.md` (36 skills, post-`tour`) into a flat, unlabeled catalog.
2. Spawned one `general-purpose` sub-agent as a routing judge, fresh context, no
   visibility into which skill is "under test" or an expected-answer key. Given the
   catalog + 15 phrases (5 positive tour triggers, 6 boundary negatives, 4 focused/edge
   variants), asked to name the fired skill + confidence per phrase.
3. Scored by hand against the intended owner below.

This is a **lighter probe than the source plan's Phase 3** (`blueprints/plans/2026-07-14-nav-tour.md`
asked for 2 independent judges plus live behavioral runs against two real repositories).
One static judge is what actually ran here — self-reported so the gap is visible, not
because behavioral live-repo verification and a second judge wouldn't add real evidence.

## Results

| # | Phrase | Expected | Judge | Confidence | Verdict |
|---|---|---|---|---|---|
| 1 | 帶我逛一下這個 repo,我剛加入這個專案 | `/nav:tour` | `/nav:tour` | high | PASS |
| 2 | What features does this system have? | `/nav:tour` | `/nav:tour` | medium | PASS |
| 3 | Explain how this repo works and why it was designed this way | `/nav:tour` | `/nav:tour` | high | PASS |
| 4 | Onboard me to this codebase | `/nav:tour` | `/nav:tour` | high | PASS |
| 5 | Align our understanding of the current system before I start | `/nav:tour` | `/nav:tour` | medium (noted `/shape:align` as a near-miss, correctly ruled out) | PASS |
| 6 | Refresh the codebase map, it's stale | `/nav:map` | `/nav:map` | high | PASS |
| 7 | Where are we — what have I done so far and what's left? | `/reflect:catchup` | `/reflect:catchup` | high | PASS |
| 8 | I need to decide on a caching strategy but don't know this terrain, map it out first | `/shape:survey` | `/shape:survey` | high | PASS |
| 9 | Help me decide on a naming convention for our new module | `/shape:elicit` | `/shape:elicit` | medium | PASS |
| 10 | Explain this compiler pass to me like I'm five | `/frame:analogize` | `/frame:analogize` | high | PASS |
| 11 | Audit this codebase for architectural smells | `/nav:audit` | `/nav:audit` | high | PASS |
| 12 | Walk me through just the authentication subsystem | `/nav:tour` | `/nav:tour` | high | PASS |
| 13 | Explain the checkout user journey to me end to end | `/nav:tour` | `/nav:tour` | medium | PASS |
| 14 | No codebase map yet — can you still walk me through what it does? | `/nav:tour` | `/nav:tour` | high | PASS (tolerant-fallback framing correctly still selected tour) |
| 15 | ADRs exist but rationale for a DB choice is unclear — help me understand system + rationale | `/nav:tour` | `/nav:tour` | high | PASS |

## What this confirms

- `nav:map`'s narrowed frontmatter (onboarding language removed) does not create a routing
  gap — phrase #6 (an explicit map-refresh ask) still lands on `map`, not `tour`.
- `nav:tour` does not steal `reflect:catchup` (#7), `shape:survey` (#8), `shape:elicit` (#9),
  `frame:analogize` (#10), or `nav:audit` (#11) — the six boundary-negative neighbors named
  in ADR-082 all held.
- The sparse-repo phrasing (#14) still routes to `tour` rather than falling through to
  "none" — consistent with the skill's own tolerant-fallback design (Step 2 of its process).

## Known gap (not closed by this probe)

- Only one static judge ran, not the two independent judges the source plan specified.
- ~~No live behavioral run~~ — closed by the cold-start behavior probe below, but only
  **one** trial ran, not the source plan's two-repo / multiple-trial design.

These are open items, not failures; recorded so a future session can close them rather
than assume this probe covered what the plan asked for.

## Follow-up — cold-start correction-loop behavior probe (`/shape:probe`, 2026-07-14)

Role: the routing probe above never exercised `tour`'s actual load-bearing feature — the
mandatory correction loop (Steps 4–5). This is a fourth-quadrant ("nobody knows") question
per ADR-075's map: no amount of re-reading the SKILL.md answers whether a fresh agent
actually reaches Step 4 instead of stopping after Step 3 (Premature Completion) — it has to
be run.

**Design** (three lenses borrowed by protocol, per `/shape:probe`):
1. Load-bearing assumption (dialectic move): a cold-start agent given only the SKILL.md text
   will execute the full 5-step protocol, not degrade to a plain lecture.
2. Stripped to testable claim (first-principles move): does the first-turn response end with
   the falsifiable-statements block + the correction question — yes/no.
3. Controlled variable (orthogonal move): one axis varied (protocol-following), everything
   else fixed — same repo (this one, evidence-rich), same user phrasing, one model tier.

**Shape**: behavior probe — one fresh `general-purpose` sub-agent, `model: sonnet`, given the
full `tour` SKILL.md text pasted inline (not the repo's own copy — the agent was told not to
open `plugins/nav/skills/tour/SKILL.md` or `docs/adr/082*`) plus a realistic onboarding
request ("幫我瞭解一下這個 codebase,尤其是 nav 這個 plugin 底下的東西,我剛加入這個專案。"),
run against the real skills-marketplace repo.

**Pre-registered verdict rule**: PASS if the response ends with both the falsifiable
"我目前認為我們共同理解的是" block and the correction question, and self-reports not having
stopped after Step 3.

**Result — PASS.** Single trial: full protocol executed. Self-reported evidence tier =
standard navigation layer (root/plugin `CLAUDE.md`, `README.md`, `docs/site/index.html`,
`plugin.json`) supplemented by `git log`; no source-and-git fallback needed. Rationale claims
correctly separated into Recorded (citing ADR-019/029/021/082 by name) vs Inferred (the "8
rules restated per-SKILL.md" pattern, explicitly flagged as inference, not fact). Response
ended with a 6-item falsifiable shared-model block covering capability (#2), a recorded
decision (#3), the tour's own differentiator (#4), a repo-wide constraint (#5), and an
explicit audience assumption open to correction (#6) — plus the exact correction question.

**Experimental contamination, disclosed**: the trial agent was told not to read `tour`'s own
SKILL.md or ADR-082 directly, but it picked up ADR-082's rationale secondhand from
`docs/site/index.html`'s audit block (also authored in this session) and cited it as Recorded.
This is a minor design leak — the site map should have been excluded too — not evidence the
protocol failed; the agent didn't fabricate the citation, it found a real one through an
unblocked channel.

**What this closes vs what it doesn't**: closes the "totally unverified" gap from the routing
probe — the correction loop demonstrably fires on a real repo with real evidence, at least
once, on `sonnet`. Does **not** close: multiple trials (N=1, not the ≥2-of-3 the pre-registered
rule in the probe proposal called for — the user opted for a single trial to look first),
a sparse/no-map repo run (tolerant-fallback tier untested), or the Step 5 alignment-delta
half of the loop (this trial only produced the first turn).

## 2026-07-14 closure

- Final Phase 3 gate: **PASS**.
- Two independent blind routing judges both scored **15/15** against the intended owners.
- Two real-repo behavioral runs are now documented: the marketplace repo, plus one temporary sparse git fixture with **no** map / README / ADR and visible files `package.json`, `NOTES.txt`, `src/queue.js`, `src/cli.js`, and `test/queue.test.js`.
- In the sparse fallback run, GPT-5.4 `nav:tour` self-reported evidence tiers **2+3** (mainly tier 3), labeled dependency-free / offline operation as **Recorded**, default rejection semantics as **undecided rejection**, the overall repo shape as **Inferred** demo-like, and the default concurrency rationale as **Unknown**.
- The first turn ended with exactly six falsifiable shared-model statements plus the exact correction question, satisfying Step 4.
- The deliberate correction turn produced all four required Step 5 categories: **Confirmed**, **Corrected**, **Missing**, and **Intent/code divergence**, using only the required three sections.
- `git status --short` before and after the behavioral runs was unchanged.
- The later closure run explicitly forbade reads from the source marketplace docs / plugins / blueprints / site surfaces, avoiding the earlier contamination path.
