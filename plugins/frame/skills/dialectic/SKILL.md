---
name: dialectic
description: "Put a claim on trial — build its strongest case (steelman) and its strongest attack (devil's advocate, also steelmanned, never a strawman), surface the deepest load-bearing assumption, then name the experiment that would decide it. For paradigm-class questions with no standard answer. Fires on \"steelman this\", \"steelman both sides\", \"play devil's advocate\", \"stress-test this idea\", \"strongest case for and against\", \"poke holes in my thesis\". Analysis only; in-chat, offers to route (/shape:elicit, /shape:mockup, /nav:plan). Distinct from /research:critique (audits an external doc's existing evidence; dialectic stress-tests your own forming claim, where the decider doesn't exist yet)."
---

# dialectic — put a claim on trial: strongest case vs strongest attack, then the deciding experiment

Take a claim you're forming — a thesis, a paradigm, a "this is actually a new thing" — and **put it on trial**: build the strongest possible case *for* it, the strongest possible case *against* it, find the one assumption the whole thing hangs on, and name the experiment that would settle it. The point is **not** "list some pros and cons" (the default does that, lukewarm). It's the discipline the default skips: **steelman *both* sides to their maximum strength, then adjudicate** — so you learn whether the idea actually stands, not whether you can still like it.

## Why this skill exists

For hard, no-standard-answer questions — *"is identity a thing you store or a thing you run?"*, *"is this a new paradigm or an old one renamed?"* — the quality of an idea is decided by one ability: **can you hold the supporter's and the attacker's view at full strength at the same time?** Most ideas don't die from being beaten; they die from **never being truly understood** — you reach "this is cool → let me build it" without ever constructing the existing approach's strongest form, or your reviewer's strongest objection. The model's default "weigh it up" reproduces this: it strawmans the opposition by reflex and gives no decider. dialectic forces the opposite — **symmetric maximal charity, plus a deciding experiment** — which is exactly the structure the default omits.

## Core — the forced structure (this IS the skill)

> **Core: build the claim's strongest case (Steelman) → build the strongest attack, also at full strength (Devil's Advocate) → surface the single deepest load-bearing assumption (Missing Evidence) → name the one experiment that would decide it (Killer Experiment). The output is always those five parts, plus a three-way verdict. If your "attack" is one you can easily wave away, you built a strawman — re-attack until it scares you.**

The disciplines that make it real (not lukewarm pros/cons):

- **Steelman *both* sides — the opposition too.** A steelman is the *strongest* version of a view, the one its smartest advocate would give. The default's reflex is the strawman ("so you think memory *is* the whole character?" — making the other side stupid). Build the version that, if you're honest, *worries you*. This applies to the attack as much as your own claim: a Devil's Advocate you can't answer is the point.
- **Write each side as an explicit inference chain, and test every link.** Don't assert "A, therefore C." Lay out A → B → C and interrogate each arrow: is it *cause*, or just *correlation* / *coincidence* / *a missing variable*? A steelman with a broken arrow is a strawman in disguise — and the snapped link is often the whole finding ("memory → consistent information ✓, but consistency → identity ✗ — identity also needs motivation, values, a way of acting").
- **The verdict is three-way, not pass/fail.** See below — for a claim no one has tested yet, "no evidence" is *not* a refutation.
- **Grounded, not asserted.** The opposition / the existing approach must be grounded in what the field *actually* holds, where that's checkable — don't invent a convenient opponent. Where you can't verify, mark it *uncertain*; never fabricate a position (or a result) to win.

## The five-part structure — the trial, always

The output is the structured trial itself, **in the conversation** — its shape IS the value (a table is the natural form):

| Part | What goes here |
|---|---|
| **Claim** | The one-sentence thesis on trial (echo back your read of it as line 1, so a misread claim doesn't get tried). |
| **Steelman** | The claim's strongest case — an explicit inference chain, every arrow tested. The version its best advocate would give. |
| **Devil's Advocate** | The strongest *attack*, also steelmanned. Run the three archetypes: **deflation** (it reduces to something we already have / already do), **competing explanation** (a different cause explains the same evidence — better prompting, more compute, more memory, caching…), **no-evidence** (no experiment has shown it beats the baseline). |
| **Missing Evidence** | The single deepest assumption the whole claim hangs on, and **which bucket it's in**: already *contradicted by existing evidence* (fatal), or merely *not-yet-tested* (an owned bet). This is the assumption you must not mistake for a fact. |
| **Killer Experiment** | The one experiment that would *decide it* — allowed to be future/hypothetical. The thing that turns "interesting philosophy" into "a testable claim." |

Lightweight by default: the trial stays **in-chat** — frame writes **no file**. Never write source or make the decision. To persist it, route to shape (below).

## The verdict — three buckets, not pass/fail

The most dangerous misread of this skill is using "no evidence" to kill every idea no one has done yet — which would make it useless for exactly the frontier work it's *for*. The verdict has three buckets:

- **Refuted** — the inference chain snaps, **or** the claim is contradicted by evidence that *already exists*. It dies. Awareness can't save it.
- **Unsettled — an owned bet** — coherent, not contradicted, but the deciding experiment hasn't been run. **This is not death.** For a genuinely new idea this is the *expected* result, and the right output is a bet you're carrying *with eyes open*: "I'm betting on assumption X; experiment Y would settle it; I'm building on X before Y is run — knowingly."
- **Supported** — the evidence exists and holds.

> dialectic does **not** demand you *have* the evidence. It demands you (a) survive logic and *existing* evidence, and (b) for what's genuinely unknown, name the bet so precisely that you're carrying it consciously, not stepping on it blindly. **The sin isn't an unproven assumption — frontier work always has one. The sin is mistaking it for a fact and building on it without knowing.** The whole move is one conversion: a *hidden, fatal assumption* → *a visible, owned bet*. Hidden, it's a landmine; named, it's a bet you chose.

## After the trial — offer to route it (don't decide, don't auto-run)

dialectic *tries* a claim; it does not decide its fate or build on it. Once the table is up, *offer* — never auto-call — the next step, via `AskUserQuestion` (offer-next-action, ADR-007/015):

- **Converge it into a decision** → `/shape:elicit` (the trial is a strong input to the grill — but whether to commit to the claim is still drawn out *with you*, not declared here).
- **Render a side to decide by seeing it** → `/shape:mockup`.
- **Ground the surviving claim into code** → `/nav:plan` (when it's settled enough to build).

**Guarded + one-shot:** compose from what the trial actually found, always include a "just leave the table, I'll take it from here" opt-out, don't re-offer after the pick. An offer, not a call — skills don't invoke each other.

## When it fires — and the boundaries that matter

**Summoned on a "steelman / argue both sides / stress-test this idea" request** — not auto-fired because a claim appeared. The tell it's the right lens: a **paradigm-class** question with no standard answer, and you catch yourself sliding from *"this is cool"* straight to *"let me build it"* without having built the opposition.

- **vs `/research:critique` (the line to hold):** critique audits an **external document's** argument against the **evidence it already presents** (validated ≠ claimed — claim too big, evidence too small). dialectic stress-tests **your own forming claim**, where the deciding evidence **doesn't exist yet** — that's *why* Missing Evidence and Killer Experiment are rows. One audits evidence that's there; the other designs the evidence that isn't.
- **vs `/frame:first-principles`:** first-principles decomposes a question **down** to axioms and rebuilds (the assumption-laddering — surfacing what a claim secretly assumes — lives *there*). dialectic puts a *claim* on **trial**. They hand off: first-principles surfaces the deepest assumption → that assumption becomes dialectic's **Missing Evidence**, the thing the Killer Experiment targets. Don't re-do the laddering here; borrow its output.
- **vs `/frame:orthogonal`:** orthogonal factors a tangle **sideways** into independent axes. dialectic doesn't factor — it adjudicates one claim. The trio: two lenses take a problem *apart* (down / sideways), this one puts a claim *on trial*.
- **vs `/shape:elicit`:** elicit draws the answer **out of you** (maieutic — *you* hold it). dialectic **derives** the strongest case and attack from the claim's own structure (the agent applies the frame). elicit extracts; dialectic tries. They pair: run dialectic to get the trial, then `/shape:elicit` to commit the call *with you*.

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| A Devil's Advocate you can wave away | That's a strawman — you attacked the weak version. Re-attack until the objection actually worries you. |
| Lukewarm "here are some pros and cons" | The default already does that. The value is *both sides at maximum strength* + a decider. |
| Assert "A therefore C" without testing the arrow | Lay out the chain; test each link for cause vs correlation / coincidence / missing variable. A snapped link is often the finding. |
| Kill an unproven frontier claim with "no evidence" | "Not yet tested" ≠ "refuted." The honest output is an *owned bet*, not a death sentence. (Three-way verdict.) |
| Let awareness excuse broken logic or existing counter-evidence | "I'm aware it's unproven" only covers genuine unknowns — not a snapped chain, not a result that already contradicts it. |
| Invent a convenient opponent / a result to win | Ground the opposition in what the field actually holds; mark *uncertain* where you can't verify. Fabrication makes the trial theater. |
| Decide the claim's fate or start building | dialectic tries + routes. The commit is `/shape:elicit`; the build is `/nav:plan`. |

## Example — the move (domain-neutral)

**Claim:** "A graph database is the right primary store for our product's feed."

| Part | |
|---|---|
| **Claim** | Graph DB should be the feed's primary store. |
| **Steelman** | The feed is fundamentally relationships (who-follows-whom, who-reshared-what). *Chain:* feed = multi-hop traversals → graph engines do traversal in O(hops) not O(joins) → at deep traversal a graph beats indexed joins. The strongest case isn't "graphs are trendy" — it's "our access pattern *is* traversal, so the model should match it." |
| **Devil's Advocate** | **Deflation:** a 2-hop feed is a join you can already do in Postgres — no new primitive. **Competing explanation:** the speedup in the spike was from the *cache* we added at the same time, not the graph model. **No-evidence:** we've never benchmarked graph vs the relational baseline at our actual read volume. |
| **Missing Evidence** | Load-bearing assumption: *our real traversal depth exceeds what indexed joins handle at our read volume.* Bucket: **not-yet-tested** (an owned bet) — not contradicted by anything we have, just unmeasured. |
| **Killer Experiment** | Replay the production query mix against both stores at target scale. If the graph only wins past depth N, and our measured p95 depth is below N, the claim is **refuted for us** — and the bet was the depth assumption all along. |

**Verdict:** *Unsettled — owned bet.* Coherent and uncontradicted, but it rides entirely on the depth assumption. Building on graph *now* is legitimate **if** you say out loud "we're betting our p95 depth is high — and we haven't measured it." Hidden, that assumption is a rewrite waiting to happen; named, it's a bet with a one-week experiment attached.

## Output

- **The five-part trial, in-chat** (no file artifact): Claim · Steelman · Devil's Advocate · Missing Evidence · Killer Experiment — plus a **three-way verdict** (refuted / unsettled-owned-bet / supported). To persist it, route to shape (below).
- A guarded, one-shot **offer** to route the insight — `/shape:elicit` (converge) · `/shape:mockup` (render) · `/nav:plan` (ground) — never an auto-call.

## Companion skills

- **`/frame:first-principles`** — surfaces the deepest assumption a claim hides (assumption-laddering); its output feeds dialectic's **Missing Evidence**. The depth lens to dialectic's trial.
- **`/frame:orthogonal`** — the separation lens (factor a tangle sideways); the third member of the trio.
- **`/shape:elicit`** — commit the surviving claim into a decision *with the user* (dialectic tries; elicit draws out the call). The pairing partner.
- **`/research:critique`** — when the thing on trial is an *external paper* with evidence already in it, that's critique, not this.
- **`/nav:plan`** — ground a surviving claim into a code-level plan once settled.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
