# The compile loop — shared law for every fathom stage artifact

Every stage artifact (repo dashboard · state board · atlas) is COMPILED from study state by the
same machine: a two-pass loop with a structural gate between the passes. The skeletons live in
`assets/shells/`; per-artifact authoring rules live with the door that owns the artifact's birth
gate. This file is the part that never varies.

## The loop

```
create (strong tier: judgment-dense re-creation from study seeds + source)
  → structural gate: node scripts/validate-fixture.mjs <fixture>  — must PASS
  → verify (cheap tier: every claim re-checked against the pinned clone; defect list)
  → loop create ← verify until the defect list is empty
  → deploy shell if absent/stale → render → one browser pass → report
```

Measured basis (2026-08-14, four studies): an unverified contribution shipped **9 defects**
(including a false causal mechanism a learner would have been taught); a brief-hardened verified
compile shipped **0**. The loop is not ceremony.

## Hard rules (each one exists because it caught a real defect)

1. **Gate before write.** `validate-fixture.mjs` passes before the file lands — any
   session, any writer, no exceptions.
2. **No unverified sections.** Content added to a fixture goes through the two-pass loop; a
   contribution from outside the loop is treated as a create pass and sent to verify.
3. **Magnitudes are numbers** from `scan-repo.mjs`. The model never authors counts; the
   shell formats.
4. **`provisional` / `studyGate` follow the study's recorded gate** (`progress.md`), never the
   author's optimism.
5. **常見誤解 framing is reserved** for entries traceable to the learner model's Corrected
   table; teaching notes without that provenance use 注意 framing.
6. **No fake calibration.** A claims chapter that reads as testing *this* learner is a defect
   unless `understanding.md` has a Corrected row for that claim. Generic-reader compiles say so
   in `meta.generatedBy` *and* in the claims intro. Horizon claims-nav is 「主張」; chrome that
   says 「先驗校準」 is a defect — it licenses the page to look like someone was asked.
7. **Interface verbs carry first-use names.** Gloss `mine` / `search` / a flag in the chapters
   the learner opens; do not park the only definition in `header.lead`. A product metaphor that
   is not those verbs is not the subject of a sentence (same gate as `/fathom:guide` core rule 5).

## Language: plain words, no borrowed metaphors

Learner-facing strings are 繁體中文（台灣用語）; identifiers, paths, and code stay English. Beyond
that, one rule with teeth:

**Name the thing by what it is. Never import a metaphor the reader has to decode.** A borrowed
metaphor is worse than jargon — jargon can be glossed, but a metaphor from the wrong domain makes
the reader translate before they can even start understanding.

| Don't | Do | Why |
| --- | --- | --- |
| 「兩種方言」for two ways of writing the same pattern | 「兩種寫法」 | dialect is a linguistics metaphor; the reader must map it back before it means anything |
| 「方言」for compile / infer / finetune | 「三種跑法」(field: `scenarios`) | those aren't even variants of one language — one bad word stretched over two different concepts, which is how a schema field starts lying |
| category names (「這是一個 facade」) | what you do with it (「正門：應用程式呼叫的那一行」) | fathom core rule 5 — category words explain a shape to someone who already owns the taxonomy |
| product furniture as subject (「closet 是 index」) | hang it on a command (「`mine` 寫短卡；`search` 拿來改原文順序」) | a name absent from the CLI is an empty slot; the learner fills it with the nearest word they own |

**Schema field names are upstream of prose.** An authoring agent given a field called `dialects`
will write 方言; renaming the field to `scenarios` fixes every future compile at the source. When
a word is wrong, fix the field, not just the sentence. (Real case, 2026-08-15: `dialects` →
`scenarios` across schema, shell, and three fixtures.)

## Shared invariants

- **Semantic data, no geometry.** Fixtures carry structure; skeletons compute layout. A
  coordinate key anywhere is an automatic gate failure.
- **Stable IDs + provenance stamps.** Recompiles re-render freely but never churn identity;
  every section records which compile produced it, at which gate, from which artifacts.
- **One-way dependency.** Artifacts read the study; the study never reads artifacts.
- **Deployed copies are instances; this skill's `assets/` is canonical.** Upgrade the skeleton
  here, redeploy; never fork a skeleton inside a workspace.
