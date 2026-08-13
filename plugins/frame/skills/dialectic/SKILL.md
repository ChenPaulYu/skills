---
name: dialectic
description: "Put a forming claim on trial: steelman both sides, surface the load-bearing assumption, name the deciding experiment. Fires on \"steelman this\", \"play devil's advocate\", \"這個論點站得住嗎\". In-chat, no file."
---

# dialectic — put a claim on trial: strongest case vs strongest attack, then the deciding experiment

Take a claim you're forming — a thesis, a paradigm, a "this is actually a new thing" — and **put it on trial**: build the strongest possible case *for* it, the strongest possible case *against* it, find the one assumption the whole thing hangs on, and name the experiment that would settle it. For hard, no-standard-answer questions, most ideas don't die from being beaten; they die from **never being truly understood** — the model's default "weigh it up" strawmans the opposition by reflex and gives no decider. The point is **not** "list some pros and cons" (lukewarm, the default already does that); it's the discipline the default skips: **steelman *both* sides to their maximum strength, then adjudicate** — so you learn whether the idea actually stands, not whether you can still like it.

## Stance

- **Core: build the claim's strongest case (Steelman) → build the strongest attack, also at full strength (Devil's Advocate) → surface the single deepest load-bearing assumption (Missing Evidence) → name the one experiment that would decide it (Killer Experiment).** The output is always those five parts, plus a three-way verdict. If your "attack" is one you can easily wave away, you built a strawman — re-attack until it scares you. **Steelman both sides — the opposition too**; a Devil's Advocate you can't answer is the point, not a bug. **Write each side as an explicit inference chain and test every link** — is each arrow *cause*, or just correlation/coincidence/a missing variable? **Grounded, not asserted** — the opposition must be grounded in what the field actually holds where checkable; mark *uncertain*, never fabricate a position or result to win.
- **The forced output, always in-chat** (no file artifact — frame writes none; never write source or make the decision), a table:

  | Part | What goes here |
  |---|---|
  | **Claim** | The one-sentence thesis on trial (echo back your read of it as line 1, so a misread claim doesn't get tried). |
  | **Steelman** | The claim's strongest case — an explicit inference chain, every arrow tested. The version its best advocate would give. |
  | **Devil's Advocate** | The strongest *attack*, also steelmanned. Run the three archetypes: **deflation** (it reduces to something we already have / already do), **competing explanation** (a different cause explains the same evidence — better prompting, more compute, more memory, caching…), **no-evidence** (no experiment has shown it beats the baseline). |
  | **Missing Evidence** | The single deepest assumption the whole claim hangs on, and **which bucket it's in**: already *contradicted by existing evidence* (fatal), or merely *not-yet-tested* (an owned bet). This is the assumption you must not mistake for a fact. |
  | **Killer Experiment** | The one experiment that would *decide it* — allowed to be future/hypothetical. The thing that turns "interesting philosophy" into "a testable claim." |
  | **Land it in plain words** | Walked, not optional: one conclusion sentence with zero jargon — banned anywhere in this landing — the conclusion, the analogy, AND its break-note alike: "steelman", "dialectic" (need the concept? say it plainly: "the strongest honest case each side can make") — plus one analogy, chosen deliberately (borrow `frame:analogize`'s discipline **by protocol, never a call**: weigh it against alternatives, pick on fit, and — if checkable — name in half a sentence where it breaks). The trial above (Claim → Steelman → Devil's Advocate → Missing Evidence → Killer Experiment, plus the verdict) stays intact for anyone verifying; this row only adds the translation on top. |

- **The verdict is three-way, not pass/fail** — "no evidence" is not a refutation, or the skill is useless for exactly the frontier work it's for. **Refuted** — the inference chain snaps, or the claim is contradicted by evidence that *already exists*; awareness can't save it. **Unsettled — an owned bet** — coherent, not contradicted, deciding experiment not yet run; the expected result for a genuinely new idea, carried consciously ("I'm betting on X; experiment Y would settle it; I'm building on X before Y is run — knowingly"). **Supported** — the evidence exists and holds. dialectic does not demand you *have* the evidence; it demands you survive logic and existing evidence, and name the bet precisely where genuinely unknown. The sin isn't an unproven assumption — it's mistaking it for a fact.
- **After the trial — offer to route it, never decide or auto-run.** dialectic *tries* a claim; it does not decide its fate or build on it. Once the table is up, *offer* — never auto-call — via `AskUserQuestion` (offer-next-action, ADR-007/015): `/shape:elicit` (converge into a decision *with the user*) · `/shape:mockup` (render a side to decide by seeing it) · `/nav:plan` (ground the surviving claim once settled enough to build) · `/shape:probe` (run the Killer Experiment itself, when the verdict is *unsettled — owned bet* and the experiment is real work worth running — guarded on `shape` being installed, ADR-012). **Guarded + one-shot:** compose from what the trial actually found, always include a "just leave the table, I'll take it from here" opt-out, don't re-offer after the pick.
- **When it fires.** Summoned on a "steelman / argue both sides / stress-test this idea" request — not auto-fired because a claim appeared. The tell: a **paradigm-class** question with no standard answer, and you catch yourself sliding from "this is cool" straight to "let me build it" without having built the opposition. **NOT for auditing an external document's evidence** — that's a referee-style review (validated ≠ claimed); dialectic stress-tests **your own forming claim**, where the deciding evidence doesn't exist yet. **vs `/frame:first-principles`:** first-principles decomposes a question **down** to axioms (the assumption-laddering lives there) → its output feeds dialectic's Missing Evidence; don't re-do the laddering here. **vs `/frame:orthogonal`:** orthogonal factors a tangle **sideways**; dialectic adjudicates one claim. **vs `/shape:elicit`:** elicit draws the answer **out of you** (maieutic); dialectic **derives** the strongest case and attack from the claim's own structure. They pair: dialectic tries, then `/shape:elicit` commits the call *with you*.

Worked example + anti-pattern table: `references/protocol.md`.

## After the trial — offer to route it (don't decide, don't auto-run)

dialectic *tries* a claim; it does not decide its fate or build on it. Once the table is up, *offer* — never auto-call — the next step, via `AskUserQuestion` (offer-next-action, ADR-007/015):

- **Converge it into a decision** → `/shape:elicit` (the trial is a strong input to the grill — but whether to commit to the claim is still drawn out *with you*, not declared here).
- **Render a side to decide by seeing it** → `/shape:mockup`.
- **Ground the surviving claim into code** → `/nav:plan` (when it's settled enough to build).
- **Run the Killer Experiment itself** → `/shape:probe`, when the verdict came back *unsettled — owned bet* and the deciding experiment named in that row is real work worth actually running, not just naming. **Guarded**: offered only when `shape` is installed; omitted otherwise (a broken option is worse than none) — mirrors `/nav:plan`'s guarded `/shape:mockup` offer (ADR-012).

**Guarded + one-shot:** compose from what the trial actually found, always include a "just leave the table, I'll take it from here" opt-out, don't re-offer after the pick. An offer, not a call — skills don't invoke each other.

## Companion skills

- **`/frame:first-principles`** — surfaces the deepest assumption a claim hides (assumption-laddering); its output feeds dialectic's **Missing Evidence**. The depth lens to dialectic's trial.
- **`/frame:orthogonal`** — the separation lens (factor a tangle sideways); the third member of the trio.
- **`/shape:elicit`** — commit the surviving claim into a decision *with the user* (dialectic tries; elicit draws out the call). The pairing partner.
- **`/nav:plan`** — ground a surviving claim into a code-level plan once settled.
- **`/shape:probe`** — runs the Killer Experiment this skill only names: when the verdict is *unsettled — owned bet*, probe designs and runs the minimal experiment that decides it. Guarded offer (ADR-012 pattern); degrades gracefully if `shape` isn't installed.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.
