---
name: migrate
disable-model-invocation: true
description: "Migrate a project's blueprints/core document tree to the current convention version — detect which version the tree speaks, propose the mapping, then execute gated, verbatim structural transforms with reference integrity (e.g. v1 decisions.md → v2 precedents/). Fires on \"migrate the blueprints\", \"升級文件結構\", \"this tree still uses decisions.md\", or when another shape/reflect verb reports a legacy tree. NOT for judging staleness (/shape:reconcile), authoring decisions (/shape:elicit), or canon content (/shape:position) — migrate moves recorded content, never re-decides it. Distinct from relay:migrate (GitHub workspace migration)."
---

# Migrate — bring a document tree to the current convention version

The blueprints/core artifact convention is a **versioned interface with living instances** (ADR-105). When the convention evolves, existing project trees keep speaking the old dialect — valid, readable by every version-tolerant skill, but drifting from what new trees look like. migrate is the one verb that upgrades a tree: detect the version, propose the mapping, execute **verbatim, gated, reference-safe** transforms, verify nothing dangles.

## Stance

- **Migrate is a verbatim reorganizer.** It moves recorded content into the new structure and repairs every reference — it never judges whether content is stale (reconcile), never authors or re-decides content (elicit / position), and never "improves prose while it's in there." The one thing it may *add* is structure the new convention requires (headers, an index, a status line), each derived mechanically from what the content already says.
- **A convention change is not complete until its migration entry exists.** Any ADR that changes the blueprints/core convention lands its `M<n>` entry in `references/migration-ledger.md` **in the same commit**. A spec change without a migration is a fleet-orphaning event — refuse to let one merge quietly.
- **Detect by structure, never a marker file** — the version fingerprint is what files exist (`precedents/index.md` vs `decisions.md`), not a version stamp. Detection is idempotent: re-running on a current tree reports "already current, nothing to do."
- **Tracked-check is a hard gate.** `git ls-files` on every source before any transform — untracked content has no recovery path. Never chain a destructive `rm` after an unverified move.
- **User confirms before any write**, and execution proceeds one transform at a time, re-checked between steps — never batch destructive ops behind a single confirmation.
- **Verify, then delete.** Every source section must be accounted for in the target and a repo-wide grep for the old name must return zero non-historical hits *before* the source is removed.

Full version-detection table, the append-only migration ledger (where new `M<n>` entries land), the six-step protocol, boundary detail (vs `/shape:reconcile`, `/shape:position`, `/relay:migrate`), and the anti-pattern table: `references/migration-ledger.md`.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.
