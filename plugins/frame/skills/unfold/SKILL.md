---
name: unfold
description: "Walk someone through an unfamiliar repository, library, paper, book, or concept one layer at a time, skeleton first. Use for 用 progressive disclosure 帶我認識 X, 帶我導讀這本書／這篇, or walk me through X. A single explanation or ELI5 belongs to /frame:analogize."
---

# Unfold — one layer per turn, skeleton first

Leave the learner with a reusable mental model of the subject, not a file tour or a dump.
The rhythm is fixed; the layers are not. Pick them from the subject and the learner's
questions: no set level count, no exit gates, no syllabus to return to, no learner-state file.

1. **Ground first.** Fix the learner's question and the boundary of the subject, then read
   the source before explaining: `references/repository.md` for code, `references/document.md`
   for a paper, book, or spec. For a concept, say what you can and cannot verify.
2. **Skeleton first.** Turn one: what it is and why it exists, in one screen: what someone
   would need to understand it in five minutes. Name the likely layers; explain none yet.
3. **One layer per turn.** One conceptual boundary, chosen because it depends on what the
   learner just got. Open with one plain sentence, then the detail. Gloss each new term in
   a clause at first use. Skip neighbours the question did not reach.
4. **Source-grounded.** Anchor each key claim (path and symbol, section or page, a quote).
   Mark it recorded in the source, inferred by you, or unknown. Never infer from names alone.
5. **Follow the learner.** A question repairs or extends the current model before you
   advance. "Got it" opens the next layer. Never replay settled ground; after a free dive,
   stay where they went.
6. **Stop at a checkpoint.** End on what is now clear, what is open, and the next layer on
   offer. A checkpoint is not a quiz. When they stop, close with the model so far, the
   strongest anchors, and the open questions.
7. **Choose the form per layer** by the question the layer asks, defaulting to plain text:

| The layer's question | Form |
|---|---|
| What is it, in one breath? (the skeleton) | plain text at ELI5 depth, optionally one analogy |
| What is this unfamiliar abstraction like? | analogy: `references/forms/analogize.md` |
| How do the parts relate, flow, or sit? | picture: `references/forms/draw.md` |
| What changes if I change X? Why does it behave so? | object to poke: `references/forms/tinker.md` |
| Exactly what does the source say? | quote and cite; no form |

Apply a form's discipline inside this turn; read its file only when the layer uses it. Use at
most one non-text form per layer, and name it in a short phrase ("a picture of the flow:").
Honor overrides at once ("用圖講", "讓我試試", "講簡單點"). A poke-able object is an artifact:
activate it per `references/artifact-activation.md`.

Do not change the subject's files. Not for a simple API question, debugging, or implementing
a decided change.
