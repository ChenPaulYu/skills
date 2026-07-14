---
name: untangle
description: "Untangle a pile of argument documents into the relational structure of a field: lineage, clusters, contradictions, contested ground. The core is a relational map; add a claim to derive a positioning view (your location, the gap, related-work priority). Reuses /research:dissect notes. Fires on \"how do these papers relate\", \"untangle these design proposals\", \"where does my claim fit\". For single dissect skeletons, use /research:dissect; for document critiques, use /research:critique."
---

# research:untangle

Take a pile of documents whose relationships are knotted and unclear, and untangle them into the **relational structure** of the field — the edges, not the nodes. The unit of analysis is the *relationship between arguments*.

## Why this skill exists

`dissect` gives you the **nodes** — one argument's anatomy (Gap / Claim / Mechanism / Evidence). But a stack of dissected documents is still a *tangle*: you understand each one, yet you cannot yet *see how they relate*. `untangle` reveals the **edges** — which work descends from which, which run in parallel, which collide, and where the field is still arguing with itself.

That relational structure is the real asset. A related-work paragraph, a gap statement, a "what should I compare against" — these are all **derived views** of the structure, not the point. The point is comprehension: *seeing clearly how this body of work relates.*

The claim is **optional**. Without one, you get the field's intrinsic structure (onboarding to a topic, finding contested ground). With one, you overlay a **positioning** layer — where your claim sits, and the gap it fills. (Earlier framing called this "a related-work landscape"; that undersold it — the landscape is one rendering of the structure, written for one purpose.)

## The four edge types (the core output)

A relational structure is made of edges. Surface all four — and resist the pull to report only the friendly ones:

1. **Lineage** — *X builds on / extends / refines Y.* The threads of descent: how an idea evolved.
2. **Cluster** — *X and Y attack the same problem in parallel* (siblings, not descent). Competing or complementary approaches that don't cite-descend from each other.
3. **Contradiction** — *X disputes / refutes / reports the opposite of Y.* The tensions. **The most valuable and the most often missed** — affinity is easy to see, conflict is where the live questions are.
4. **Contested ground** — *the questions the set leaves open or disagrees on.* Not an edge between two documents but a region the whole set circles without settling. **This is where new work lives** — and, if you have a claim, where it sits.

> A flat list of "these documents are about similar things" is **not** a relational structure — that is topic proximity. The structure is the four edge types above. Hold this bar even when no claim is given.

## Protocol

### Step 1 — Receive the documents (and, optionally, your claim)

Accept a list of file paths / URLs / a folder, or a mix.

Then ask once: **"Do you have your own claim (1-2 sentences)? It's optional — with it, I'll add a positioning layer (where you sit, the gap you fill); without it, I'll map the field's intrinsic structure."**

- If a claim is given, it becomes a *lens overlaid on* the structure — not a precondition.
- If the user wants a claim but hasn't converged one, you may suggest `/shape:elicit` — but do not block: the relational structure is worth building either way.

### Step 2 — Ground each document (reuse `dissect`)

For each document, look for a prior `dissect` note **tolerantly, in three states** (ADR-071): ① dissected earlier in this conversation → reuse directly; ② the user points at where notes live → read there; ③ neither → check the conventional `notes/<shortname>.md`, and if absent, read the full document. Announce which tier each node came from. Reuse is best-effort — never a hard dependency on a folder shape. You only need each node's Claim / Mechanism / Evidence / Conclusion to find its edges.

### Step 3 — Build the relational structure (the core)

Across the set, identify the edges of all four types:

- **Lineage**: who extends/refines whom (cite-descent + conceptual descent).
- **Cluster**: which documents are parallel attacks on the same problem; name the clusters.
- **Contradiction**: which documents disagree — opposite claims, conflicting results, or one refuting another's assumption. Name the disagreement, not just the pair.
- **Contested ground**: the questions the set keeps circling without resolving.

This is the primary output. Render it so the *shape* is visible (clusters with their internal lineage; the contradictions drawn as tensions between clusters; the contested questions called out).

### Step 4 — Overlay positioning (only if a claim was given)

Place the claim on the structure:
- Which cluster it joins or challenges; which lineage it extends.
- **Must-differentiate** — documents whose claim overlaps most with yours (a threat to novelty, not a compliment).
- The **gap** the claim fills — stated against the contested ground, specifically.

### Step 5 — Derive the views the user needs

From the structure (+ overlay), derive only what's asked for:
- **Related-work priority order** (needs a claim): must-differentiate · must-cite-as-foundation · should-cite-as-context · may-cite.
- **Gap statement** (needs a claim): one precise sentence locating the unoccupied ground.
- **Reading priority** (no claim needed): which documents to read deeply given the structure.

### Step 6 — Output

The relational map is presented **in-chat first — that's the deliverable**; saving is an offer. If the user wants it kept, suggest `notes/<topic>-untangled.md` (or `notes/landscape.md`) as the conventional default — any location they name works (convention, not contract; ADR-071). Never write without confirmation.

The positioning view (Step 4, when a claim was given) is not just a written section — it is **input to two downstream verbs**, offered, never called: `/shape:position` when the positioning is ready to ratify as canon (where your project's claim sits, recorded as settled), and `/shape:elicit` when the positioning itself still needs converging (which cluster, which gap — argued out rather than obvious from the map). Name the offer; let the user pick.

## Output format

```markdown
# Untangled — <topic or claim shorthand>

**Documents**: <N> (shortnames) · **Dissect notes reused**: <list, or "none">
**Claim (optional lens)**: <user's claim verbatim, or "none — intrinsic structure">

---

## Relational structure

### Clusters (parallel approaches)
- **<Cluster name>** — <documents>; shared problem: <one sentence>. Internal lineage: <X → Y → Z>.
- ...

### Lineage (who builds on whom)
- <X> → <Y> (<how Y extends X, one phrase>)
- ...

### Contradictions (where they collide)
- **<X> vs <Y>** — the disagreement: <what they claim oppositely / where results conflict>.
- ...

### Contested ground (open / unsettled)
- <The question the set circles without resolving — stated precisely.>
- ...

---

## Positioning  *(only if a claim was given)*

- **Where your claim sits**: <which cluster/lineage; joins or challenges what>.
- **Gap it fills**: <one precise sentence, located against the contested ground>.
- ⚠ **Must-differentiate**: <documents whose claim overlaps — and why yours differs>.

## Derived views  *(produce only what's needed)*

| Priority | Document | Reason |
|---|---|---|
| Must-differentiate | <name> | <one line> |
| Must-cite (foundation) | <name> | <one line> |
| Should-cite (context) | <name> | <one line> |

**Reading priority** (no claim needed): <which to read deeply first, and why>.
```

## Discipline

- **Show the tensions, not just the affinities.** Contradiction and contested ground are the highest-value edges and the easiest to omit. A structure with only lineage and clusters is half-built.
- **Claim is optional; the bar is not.** Even with no claim, produce *relational structure* (the four edge types), never a flat topic list. Topic proximity is the failure mode the claim used to guard against — guard against it directly instead.
- **Reuse dissect notes — tolerantly.** Conversation first, user-pointed location second, conventional `notes/` third; found → don't re-read the PDF, and announce which tier. Absent everywhere → read the document; never fail because a folder isn't shaped as expected.
- **The gap / contested ground must be specific.** "No one studied X" is not contested ground. "Two documents claim opposite results on whether Y causes Z, and neither isolates the confound" is.
- **Must-differentiate is a threat, surfaced honestly** — a referee will find it whether you name it or not.
- **Rule ⑦ applies.** Below 90% confidence on an edge (especially a claimed contradiction), flag it: "(uncertain — re-read section X before relying on this)".

## Companion skills

- **`/research:dissect`** — supplies the nodes this skill reuses; run it first per document, or let untangle dispatch it itself for any document missing a note.
- **`/shape:position`** — the positioning view's next stop when it's ready to ratify: "where your project's claim sits relative to this field" is exactly canon-shaped once settled. Offered, never called.
- **`/shape:elicit`** — the positioning view's next stop when it's *not* settled yet: which cluster your claim joins, or how to state the gap, converged by a grounded grill rather than assumed from the map.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
