---
name: migrate
description: "Inventory and migrate a legacy file-based Relay repository into the GitHub-native model while preserving provenance. Audit and mapping are mandatory before mutation; execution is idempotent and write-gated."
disable-model-invocation: true
---

# migrate — bridge legacy Relay repositories to GitHub-native Relay

This is exceptional compatibility work, not a daily Relay verb. Preserve the complete old record by immutable git reference, then promote only current reusable knowledge and live obligations.

## Process

1. **Preflight read-only.** Resolve the legacy repository, current commit, remote, target GitHub repository, authentication, permissions, and protection. Never infer a target.
2. **Preserve evidence.** Propose an immutable baseline tag/commit reference and permanent permalinks. Do not delete anything until the reference exists remotely and cited files render.
3. **Inventory everything.** Read legacy projects, thoughts, ledger entries, Core files, and assets. Frontmatter defects may be noted as evidence, but syntactic conformance is not migration and never decides disposition.
4. **Classify each source exactly once:**
   - preserve at baseline only;
   - create/update a cited brief;
   - propose a Core candidate PR;
   - create a live Discussion;
   - create a live Issue with one owner/decider;
   - create a live PR for an exact diff.
5. **Show the complete mapping.** Include source permalink, destination/title, citations, assignee/reviewer, and planned legacy-path removal. Wait for explicit approval before any live mutation.
6. **Execute idempotently.** Record each created GitHub URL in the mapping. Before creating, check for an existing recorded destination. Partial failure resumes that URL and repairs missing steps.
7. **Verify before cleanup.** Every retained citation resolves; Core contains only effective-now truth; briefs are current and indexed; only live obligations became objects. Cleanup is a separate protected change after verification.

## Rules

- Never copy every old thought into GitHub merely to preserve it; immutable git history is the archive.
- Never create `legacy/`, `raw/`, `archive/`, or time-bucket directories.
- Migration is semantic and gated, not a frontmatter-format sweep.
- Do not rewrite historical evidence or expose private names, repository identifiers, or confidential text in public artifacts.
- GitHub-native daily work uses `/relay:launch`, `report`, `digest`, `reply`, `brief`, and `settle`.

## Completion

Done means every legacy source has one disposition, provenance is durable, every live mutation has one verified URL, and retries are safe. Pending human ACK or approval is reported truthfully rather than fabricated.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead with the result; put technical details after it.
