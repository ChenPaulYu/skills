---
name: position
description: "Author and maintain a project's core (principle-wise) documents — converge messy, multi-source direction (statements, AI chats, screenshots, prototypes) into self-contained canon, keeping it at altitude as it accretes. A CAMPAIGN verb: many feedings across days, each gated (provenance/authority tag → new/metabolized/conflict delta report → surgical edits, never wholesale rewrites), landed two-tier (core/ = user-ratified, principle-altitude canon; thoughts/ = dated hypotheses), grown by GRADUATION (a thought freezes into core only on user sign-off; never scaffold core upfront). Write protocol (ADR-041): core is single-writer + freeze-gated — mid-campaign rulings land in a campaign log; other verbs queue amendments in docs/core/amendments.md, adjudicated on summon. Fires when the user wants to converge what something IS into canon — \"幫我定位 X\", \"turn these discussions into a core doc\", \"this core file has accreted, re-layer it\", \"graduate this thought into core\", or any authoring of docs/core/*.md-class documents. NOT for converging one concept to one line in one sitting (/shape:elicit — position borrows it by protocol); NOT for syncing canon to shipped reality (/shape:reconcile — position births canon pre-code, reconcile keeps it true post-code); NOT for grounding a decided spec into code (/nav:plan). Meta-skill per ADR-008 (orchestrates elicit · mockup · think:first-principles, never invokes). Campaign-level — never fire on everyday product chat. Also invokable as /shape:position."
---

# Position — author the canon layer (a gated, multi-feeding campaign)

Converge what something **is** — a product, a design language, a schema — into **core (principle-wise) documents**: self-contained, principle-altitude, holding only what the user explicitly ratified. The defining unit is not a conversation but a **campaign**: many feedings of heterogeneous material across days, each one gated, each landing surgically, with the canon growing by graduation rather than being scaffolded.

## Why this skill exists

Canon documents fail in two characteristic ways when authored by default agent behavior (absorb + transcribe):

1. **Hypothesis dressed as canon** (authority failure) — details from an unvetted source (a pasted GPT conversation, the agent's own synthesis) written in 定稿 voice. The user steered the *direction*; nobody ratified the *details*. Field case: three core docs had to be demoted to `thoughts/` in one surgery.
2. **Conversation sediment** (altitude failure) — a "principles" list accreted bottom-up, one item per discussion round, admitted by "is this important?" instead of "is this the same layer?". Important ≠ same altitude. Field case: a 7-item "core principles" list contained 2 principles, 4 approaches, 1 derived rule.

position forces the two disciplines the default skips: **gatekeeping** (who ratified this?) and **altitude** (what layer is this?).

## Core — the one non-negotiable

> **A core document holds only what the user explicitly ratified, at principle altitude, readable standalone.** Three conditions; violating any one produces a known failure: hypothesis-as-canon · sediment-list · link-dependent doc. Altitude mistakes are recoverable (restructure); **authority mistakes poison the canon** — when unsure which tier something belongs to, it's a thought.

## The five kernels (what position itself carries)

Everything else is borrowed; these five have no other owner:

### 1. Ingest-assess(守門)— every feeding, any modality

Input modes map to *default* authority (user overrides per item):

| Mode | Default authority |
|---|---|
| User's own statement | canon candidate |
| Pasted AI conversation (any LLM) | direction = user-steered (candidate); details = unvetted (hypothesis) |
| Existing docs / specs | dated facts — check staleness |
| Screenshots, old prototypes, competitor references | grounding material, not claims |
| Live discussion in-session | escalatable to elicit |
| Memory / past transcripts | true-when-written, re-verify |

Per feeding: tag provenance → classify every piece **new / already-metabolized / conflicts-with-locked** → emit a **delta report** (new · metabolized · conflict · needs-ruling) → apply *surgical* edits the user ruled on — **to the campaign log, not to core** (the write protocol below: core is read-only outside freeze moments; the surgical discipline is unchanged, the object under the knife changed). The stance: the material provides divergence, position provides convergence **and guarding** — a conflict with a locked decision (e.g. an architecture invariant) gets *blocked and surfaced*, not absorbed; the more authoritative the source feels, the more the guard matters. Never rewrite a canon doc wholesale — the evolution log survives only surgical edits.

### 2. Altitude instrument(海拔儀)

The test, per claim: **survives any implementation change = principle · one means among several = approach · needs validation to know its worth = bet · above principles = axiom.** Two companion signals:

- **Churn alarm**: the same decision flipping a *second* time means the debate is at the form layer — stop arranging furniture, lift one layer, converge the governing rule (form churns; rules don't). Don't iterate a third variant alongside the user without sounding this.
- **User weighting beats taxonomy**: the user may declare the canon's center of gravity ("style and layout matter most; the rest is fine") — the doc's *structure* follows their weighting; the altitude test still governs what's *in* it.

### 3. Two-tier landing(雙層落地)

- **core/** — user-ratified canon: self-contained at its altitude (*"reading this one page gives the complete picture; links are magnifiers, never required"* — state this invariant in the doc), carries a superseded/evolution log and an open-questions list.
- **thoughts/** — dated hypotheses: status header ("direction confirmed / details unverified"), ⚠ conflict markers where a later ruling contradicts the text, never silently edited into agreement.

### 4. Graduation(畢業制)— core grows, it is not scaffolded

position guarantees ONE core file (the root positioning doc). Every further core doc is **graduated**: a thought passes the freeze test — *explicit user sign-off, or validated by built reality* — then re-runs the authority + altitude gates and becomes `core/<domain>.md`; the root doc keeps a high-level section + link (layered self-containment). **Never pre-open empty core files** — canon means frozen, and early campaigns have nothing to freeze. On canon renames, position owns **reference integrity** (every thought, doc, and memory pointing at the old name).

### 5. Periodic altitude re-audit(週期重審)

Canon accretes *during* campaigns, not only at feedings. Before landing a domain into core — and whenever a core doc has absorbed a day of rulings — run a re-audit: the altitude test over every section, plus (by protocol) a `think:first-principles` self-audit where the *conventional answer under test is the design just shipped*. Field case: the self-audit caught an inverted entrance hierarchy and a process error (an afternoon of form-layer churn) the same day they were made.

## The write protocol — door × timing (ADR-041)

> **Core is single-writer and freeze-gated.** Two orthogonal gates, both must pass — full protocol in [`references/write-protocol.md`](references/write-protocol.md); the kernel:

- **Door (who):** only an explicitly-summoned `/shape:position` writes core — every other verb, ambient conversation, and sub-agents (no inherited authority): never. The "does this belong in core?" judgment has exactly one owner. Other verbs queue a **one-line pending amendment** in `docs/core/amendments.md` (what changed · evidence · by which verb) instead.
- **Timing (when):** inside the door, core is writable only at **freeze moments** — ① campaign close (post-re-audit, the campaign log's surviving rulings batch-diff in) · ② an explicit per-item freeze order ("lock this into canon") · ③ root-doc birth. Outside these, core is read-only **including for position's own rulings**: ruling ≠ ratification — a mid-campaign ruling is a hypothesis with authority; ratification is a ruling that survived the campaign's churn.
- **The campaign log** (a dated, `thoughts/`-class doc) is the campaign's durable working surface — rulings land here; delta reports compute against the core + log union. Core's evolution log then records only diffs between frozen versions — canon's version history, not meeting minutes.
- **The ledger is each summon's first feeding:** open by batch-adjudicating `docs/core/amendments.md` (provenance pre-tagged: reality-grade) — absorb or reject per item. `reconcile` sweeps the ledger's leftovers (its exit — a grow-only layer is the ADR-026 bug).

## Protocol — a campaign loop, not fixed stages

1. **Summoned.** Confirm the campaign's object (what canon, which repo home — `docs/core/` if the project has one, else the blueprints tree).
2. **Ground.** Read existing core / thoughts / memory; know the locked decisions before the first feeding arrives. **Then clear the ledger**: `docs/core/amendments.md` is the summon's first feeding (write protocol above).
3. **Feeding loop** (repeats across days): ingest-assess → delta report → user rules per item → surgical edits **to the campaign log** (core stays read-only until a freeze moment).
4. **Convergence moments, outsourced by protocol** (reuse-via-transcript, never skill-calls): a principle fork → `elicit`'s grill · a look/structure decision → `mockup`'s render · a pre-landing audit → `think:first-principles`.
5. **Land / graduate.** Two-tier landing; graduations as domains freeze; re-audit before each landing. **Landing is a freeze moment — the only time core is written** (write protocol).
6. **Exit.** The campaign closes when the open-questions list is the only thing still moving. Re-summonable: later feedings, graduations, and re-layerings are new (smaller) campaigns.

## Boundaries

- **vs `elicit`** — elicit converges ONE concept to one line in one sitting (maieutic; the user holds the answer). position is the campaign that *contains* elicit moments and lands a whole canon layer. When the ask is "help me think through X", that's elicit alone.
- **vs `reconcile`** — mirror verbs across the first line of implementation code: **position births canon** (authority-driven: a freeze is a conversational event), **reconcile keeps it true** (reality-driven: its engine diffs docs against built code — pre-code it has nothing to scan, and its charter refuses decision-acts; canonization IS a decision-act). After code exists, reconcile maintains everything position birthed.
- **vs `nav:plan`** — downstream: position converges what something *is*; nav:plan grounds a decided spec into code.
- **vs `align`** — downstream: align triages what to *build next* from the thoughts position leaves behind.

## Anti-patterns (refuse these — all field-tested failures)

| Temptation | Why to refuse |
|---|---|
| Write unvetted details in canon voice | The original sin; cost a three-doc demotion surgery. When in doubt → thoughts. |
| Admit items by importance, not altitude | Sediment list. Important ≠ same layer; run the test per claim. |
| Let canon depend on links to be complete | Self-containment broken = the doc is mis-written, by definition. |
| Rewrite the whole doc per feeding | Surgical edits only; the evolution log is the campaign's memory. |
| Treat one input mode as the norm | The campaign's first accident (AI-paste) is not its definition; gate every modality. |
| Absorb because the source sounds authoritative | Guarding is the job; conflicts block and surface. |
| Scaffold core files upfront | Canon = frozen; nothing freezes early. Graduation only. |
| Iterate a third form-variant after two flips | Churn alarm: lift to the rule layer first. |
| Fire on everyday product chat | Campaign-level summons only. |
| Write core mid-campaign on an in-conversation ruling | Ruling ≠ ratification — rulings land in the campaign log; core only at freeze moments (write protocol, ADR-041). |
| Accept another verb's "it's ratified" core edit | The door: only summoned position writes core; everything else queues a `docs/core/amendments.md` line. |

## Output

- `core/<domain>.md` files — self-contained, principle-altitude, user-ratified; superseded log + open questions inside. Written only at freeze moments (ADR-041).
- The **campaign log** — a dated, `thoughts/`-class working surface holding the campaign's rulings until they freeze.
- An **adjudicated `docs/core/amendments.md`** — pending amendments absorbed or rejected as the summon's first feeding.
- `thoughts/` hypotheses with status headers and conflict markers.
- Per-feeding **delta reports** in conversation (new / metabolized / conflict / needs-ruling).
- Graduation stamps on promoted thoughts; reference integrity on renames.

## Companion skills

- **`/shape:elicit`** — the in-campaign principle-fork converger (borrowed by protocol).
- **`/shape:mockup`** — the in-campaign render-to-decide moment (visual/structural rulings feed the canon).
- **`/think:first-principles`** — the pre-landing self-audit lens (the "conventional answer" may be the canon just written).
- **`/shape:reconcile`** — the post-code mirror: maintains what position birthed.
- **`/shape:align` · `/nav:plan`** — downstream consumers of the landed canon and thoughts.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
