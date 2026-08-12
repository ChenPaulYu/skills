# dialectic — worked example, anti-patterns

> Moved verbatim from the pre-ADR-109 SKILL.md body. The SKILL.md Stance carries the operative
> discipline (the five-part trial table + the plain-language landing gate); this is the worked
> example and the full refuse-these table, loaded on demand.

## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| A Devil's Advocate you can wave away | Re-attack the objection until it actually worries you — a strawman is the weak version; steelman the attack, not just the defense. Tell: you can dismiss your own counter-argument in one sentence without effort. |
| Lukewarm "here are some pros and cons" | Push both sides to maximum strength, then adjudicate — the default already lists pros and cons; the value is the decider on top. Tell: the two sides read interchangeable with any other claim's pros/cons list. |
| Assert "A therefore C" without testing the arrow | Lay out the chain and test each link for cause vs correlation / coincidence / missing variable. Tell: you stated the conclusion before naming the links that connect it to the premise. |
| Kill an unproven frontier claim with "no evidence" | Return a three-way verdict — refuted / unsettled-owned-bet / supported — since "not yet tested" ≠ "refuted." Tell: the verdict collapses evidence-absent and evidence-against into the same "no". |
| Let awareness excuse broken logic or existing counter-evidence | Reserve "I'm aware it's unproven" for genuine unknowns only — not a snapped chain, not a result that already contradicts it. Tell: you're using the word "unproven" to describe something that's actually been tested and failed. |
| Invent a convenient opponent / a result to win | Ground the opposition in what the field actually holds and mark *uncertain* where you can't verify — fabrication makes the trial theater. Tell: you can't point to where the opposing view actually comes from. |
| Decide the claim's fate or start building | Try + route — the commit is `/shape:elicit`, the build is `/nav:plan`. Tell: the reply ends with "so we should build X" instead of an offer to route. |
| End on a jargon sentence ("verdict: unsettled — owned bet") | Close with a plain-words conclusion + analogy as the actual last word, not the five-part table alone. Tell: the final sentence needs "steelman" or "dialectic" to parse. |

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
