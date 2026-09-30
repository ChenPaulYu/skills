---
name: orthogonal
description: "Separate a tangled problem into independent dimensions and test whether changing one leaves the others fixed. Use for 這些是獨立的嗎 or separating concerns; deriving an answer from base truths is first-principles reasoning."
---

# Orthogonal — test whether the parts vary independently

1. Name the tangle and ground candidate dimensions in concrete cases or actual code.
2. For each dimension, change it while holding the others fixed. If another must change
   with it, explain the coupling and merge or re-cut the proposed dimensions.
3. Keep only the independent distinctions the evidence supports, and state what was
   conflated or falsely separated. Do not force independence where the phenomenon is coupled.

The change-one/check-the-rest test is the work; naming tidy categories is not evidence.
For small questions, a few grounded examples suffice. Show fuller checks when the decision
is consequential, and label cases that could not be verified.

An analysis-only request writes nothing; return to an already-authorized workflow without
adding a next-action menu. Read `references/anti-patterns.md` when a decomposition remains suspect.
