# How a form grows — the procedure for what the artifacts can't hold

The three artifacts (horizon · tides · atlas) are not a specification handed down; they are the
three shapes that **recurred** across studies. When a repository's interesting thing doesn't fit
one of them, that is normal — this file is what to do about it, and the discipline that keeps the
answer from being "fork the skeleton".

## 0. First ask: is this a new FORM, or an old form with new content?

Almost always the second. The artifacts are more general than their names suggest:

| The repo's interesting thing | Try first |
| --- | --- |
| a state machine (protocol, workflow engine) | **tides** — states are lanes, transitions are triggers, guards are delta conditions |
| a data pipeline / ETL | **atlas** — a route IS a pipeline; stages are nodes, cargo edges are the payloads |
| a compiler / DSL | **atlas** for the phases, **tides** for the IR shapes as they accumulate |
| a config-driven system | **horizon** capability tree for the surface, **tides** for what a config change moves |

**The discriminator:** if you only need different content and vocabulary, it is the same form. A
genuinely new form is one whose **question none of the three are asking**.

## 1. It really doesn't fit → bespoke, and leave a scar

Author it as a `bespoke` fragment inside the nearest artifact — hand-written HTML/SVG/prose the
shell renders as-is. State the cost in the same breath, because bespoke content:

- is **not schema-validated** and not checkable by the verify pass the way structured slots are,
- does **not participate in enrichment** — a recompile may leave it stale,
- must be **marked** in the fixture (`"bespoke": true` on the block).

Visible debt, never an invisible exception.

## 2. Count recurrences — in the ledger, not in memory

Append a row to the workspace's **form ledger** (`studies/_forms-ledger.md`) with a **shape-key**:
a slug that names the *shape* of what was missing, not the instance
(`glossary-terms`, `edge-note`, `signal-evidence-anchor`). Reuse an existing key whenever the shape
matches — which is why the ledger is **read before authoring, appended after**.

`node scripts/forms-ledger.mjs <ledger>` tallies by shape-key across **distinct studies** (three
rows from one study is one repo's idiosyncrasy, not an invariant) and flags anything ripe.

## 3. Three distinct studies → promote. To what?

| Promote to | When | Cost |
| --- | --- | --- |
| **a section/slot in an existing artifact** | same level, same question as an artifact that already exists (glossary, edge notes, anchors on seams) | cheap — add an optional schema field + shell renderer, bump `fixtureVersion`; old fixtures keep working |
| **a fourth artifact** | it has its **own level and its own question** | expensive — own schema, own shell, own birth gate, own protocol+brief |

Structural note for the second case: the ladder has **five levels and only three artifacts** —
Runtime and Code currently have none. A fourth artifact most plausibly grows into one of those
gaps rather than appearing from nowhere.

## 4. Either way, run the pilot before it ships

Same play every time, no shortcuts:

```
≥2 hand-built instances → extract skeleton/data split → schema → ground-truth fixture
  → fixture-driven shell → generate for a SECOND repo → blind compare → graduate
```

Two failure modes this pilot has actually hit, both worth pre-empting:

- **Extraction inherits the seeds' vocabulary, not only their structure.** The hand-built
  instances were written by someone solving one repo, and their words carry that repo's accidents.
  Audit the words while extracting: a field named for a metaphor (`dialects`) will make every
  future compile write that metaphor, and one bad word stretched over two different concepts is
  how a schema field starts lying. Name fields for what they hold. (2026-08-15: `dialects` held
  both "two notations for the same music" and "three different runs" before it became
  `scenarios`.)
- **A shell built against one instance encodes that instance's content shape.** The second repo's
  data is the real test — stress it deliberately before generating: very long strings in every
  label slot, missing optional fields, the largest and smallest plausible item counts. Constrain
  in the schema what the layout genuinely cannot absorb (`maxLength` on a chip label) rather than
  discovering it as a rendering bug. (2026-08-15: verdict chips designed around two-character tags
  overflowed the moment an author wrote a sentence into one.)

Evidence for why the pilot is not ceremony: a contribution that skipped the loop shipped **9
defects** including a false causal mechanism a learner would have been taught; a brief-hardened
verified compile shipped **0**.

## The anti-rule

**Never make an existing schema more general so it can hold the new thing.** Optional fields added
until everything is expressible is a contract that says nothing — that is the road back to
freeform HTML, which is exactly what the artifact layer exists to escape. A new shape gets a new
tight contract, not a loosened old one.

## Where each thing is recorded

| Stage | Home |
| --- | --- |
| first encounter | the study's own evaluation notes + a ledger row |
| recurrence (2nd, 3rd) | ledger rows — the tally is the evidence |
| the decision to promote | the workspace's decision log (a lab's `blueprints/thoughts/`) |
| the promoted form | **this plugin** — schema, shell, protocol, brief |

Experiments stay in the lab; only conclusions enter the plugin.
