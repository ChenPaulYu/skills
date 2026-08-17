# analogize — full discipline, worked examples, anti-patterns

> Moved verbatim from the pre-ADR-109 SKILL.md body. The SKILL.md Stance carries the operative
> discipline + the output shape; this is the elaborated numbered walk-through, the two worked
> examples, and the full refuse-these table, loaded on demand.

## Core — the discipline (this IS the skill)

1. **Generate 2–3 candidate analogies from different source domains.** Don't stop at the first one — different domains expose different parts of the target's structure, and comparing candidates is how you notice the first one was lazy.
2. **Map the structure, not the surface.** For the leading candidate(s), check point-by-point: does each part of the source map to a real part of the target, in the same relationships (not just "these both feel similar")? A resemblance that's only vibes, not structure, doesn't survive this step.
3. **Pick on fit, not on which arrived first.** The winner is whichever candidate's structure holds up longest under the mapping check — not the one that sounded best in isolation.
4. **Name where it breaks.** Every analogy stops being true somewhere. Say so explicitly and briefly — this is what stops the user from over-extending it later. If a candidate breaks almost immediately, it wasn't a real candidate; drop it rather than force it into the output.
5. **Do this thinking silently.** The candidate comparison is your discipline, not the deliverable — don't narrate "I considered three analogies and rejected two" unless the user asks to see alternatives. The delivered output is clean.

## Worked examples (what "good" looks like)

Two examples of the finished shape — the candidate-comparison step is shown here only for teaching purposes; a real delivery skips straight to the four-part output (rule 5 above).

**Example — a multi-layer system, mapped onto a person playing a sport**

*Target:* a five-layer framework describing any agent system — a habit-library of what-comes-next (Pattern), a moment's choice of react-on-instinct vs think-it-through (Computation Model), the continuously-existing self carrying decisions out (Runtime), whatever external capabilities are reachable (Tool), everything not under the system's control (Environment).

*Candidates considered:* an orchestra (rejected — implies several separate performers; this is one continuous decision-maker) · a factory line (rejected — implies one-directional flow; the real thing loops, later steps feed back into earlier ones) · a person playing a sport (kept — one continuous actor, and the five parts land on five distinct, checkable parts of that one person).

*Delivered:*
> Think of the whole system as one person playing a sport, not a factory line — every layer is a different part of that *same* person, doing its own job.
>
> Their head holds the moves they've practiced and reach for without thinking (Pattern). A split second decides whether to react on instinct or actually think it over (Computation Model). Their body — heartbeat, stamina, whatever keeps this the same person from one moment to the next — carries the decision out (Runtime). Whatever's in their hands is what they can use (Tool). The field, the weather, the other players — everything they don't control (Environment).
>
> Folding "the body" into Runtime is a deliberate call, not an oversight: it's what lets Tool stay clean and separate, instead of arguing over whether an organ counts as a tool. You can test whether a layer really earns its own place by removing it and checking if the rest still holds — strip Tool away and the person is still a complete, continuous decision-maker, just empty-handed. That's what proves Tool is genuinely separate, not a hidden part of Runtime.
>
> **Where it breaks:** a person's body has needs the system doesn't (hunger, fatigue) that map to nothing real — and unlike a sports field, a system's "Environment" can sometimes be edited by the system itself. Don't push the analogy into questions about the system rewriting its own world.

**Example — an auth handshake, mapped onto a festival wristband**

*Delivered:*
> Getting access this way works like getting a wristband at a festival, not flashing ID at every single checkpoint all night.
>
> Try to walk in with nothing and the gate turns you away, pointing you to the right booth (an unauthenticated request gets refused, with directions to where to authenticate). One booth registers who you are (client registration). A second booth is where you personally say yes and get handed the physical wristband (the user consent step). You walk back in wearing it (you're holding a token now). From here on, staff scan the wristband itself at every checkpoint — not your face — so nobody's trusting a memory of having let you in once (every later request is re-validated against the token itself).
>
> The "scan" happens one of two ways: the checkpoint reads a code printed right on the wristband, no calls needed (a self-contained token) — or it radios back to the booth to ask "is this one still good?" (a live check against the source). Same wristband, two different ways to verify it.
>
> **Where it breaks:** nobody quietly clones or steals a physical wristband mid-festival the way a stolen token can be lifted and reused elsewhere without anyone noticing. The "only one of these can exist at a time" assumption doesn't hold for tokens — which is exactly the risk this analogy won't warn you about on its own.

## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| Ship the first analogy that comes to mind | Generate 2–3 candidates and pick on structural fit — that's the ambient default, not this skill; the comparison against alternatives is the value. Tell: the first comparison that popped to mind is also the one about to ship. |
| An analogy that only resembles on vibes | Check the mapping point-by-point before handing it over — if the structure doesn't map, it will mislead the moment the user pushes on it. Tell: you can say it "feels similar" but can't name what part maps to what part. |
| Never naming where it breaks | Say explicitly where the mapping stops holding — silence here is what lets the user over-extend a leaky mapping later. Tell: the explanation reads as complete with no "but it stops working when…" sentence. |
| Narrating the whole candidate search to the user | Keep the comparison internal and hand over only the clean four-part output — the discipline is internal, not the deliverable. Tell: the reply opens with "I considered a few analogies before landing on…". |
| Reaching for jargon "for precision" before the plain sentence | Lead with the plain sentence; layer in technical detail only after, and only if it adds something the analogy didn't already convey — plain-first is the point. Tell: the opening sentence needs a term the user would have to look up. |
