# ADR 131 — Restore reconcile, keep one sync, retire standing codebase maps

**Status**: accepted
**Date**: 2026-09-30
**Source**: the owner requested a separate reconciliation entrance, reported repeated README/doc-currentness requests, then chose one sync and retirement of the unread standing codebase HTML workflow. A complete README/docs batch is an explicit use case.
**Supersedes in part**: ADR-112's reconcile merge; ADR-108's retained map-render leg; ADR-125's narrow document checklist and unconditional second approval. Other decisions in those ADRs remain historical and in force where unaffected.

## Problem

Three distinct requests had become difficult to express: decide the next work, clean stale
project records, and update explanations to match implementation. Align combined the first
two, while sync advertised a map output the owner no longer reads. Document checking existed
but was easy to reduce to versions, rosters, and links, leaving behavioral drift and missing
reader workflows unexamined. Header checking could similarly skip a correctly formatted but
factually stale comment.

## Decision

| Entry | Responsibility | Completion |
|---|---|---|
| `shape-align` | Verify the board and decide priorities with the user | Carried items accounted for; authorized board changes applied |
| `shape-reconcile` | Reconcile thoughts, implementation plans, and mockups | Evidence-backed dispositions; reasons and inbound links preserved |
| `nav-sync` | Align source headers and reader documents with implementation | Requested explanations checked and authorized corrections applied |

Reconcile restores a door the owner explicitly needs. Shared evidence does not make cleanup
and prioritization the same action: one may be wanted without the other. Align keeps
verify-before-triage, no silent drops, and user-owned priorities. Reconcile keeps the mockup
retirement conditions, tracked/untracked safeguards, and preservation of unique rationale.
Neither automatically invokes the other. Both require session-model judgment; align loses
its whole-turn mechanical override. No retired canon/freeze tier is restored.

One sync handles explanations adjacent to source and explanations in README/setup/usage/API/
architecture docs. Separate `code-sync` and `doc-sync` would add two entrances to the same
comparison task; the surface belongs in the request. It does not change executable behavior
to make documentation true. A named README stays bounded; an explicit README/docs batch
inventories and processes the full set. Each document ends updated, checked/current,
historical/planned, regenerated through its owner, or blocked with a specific evidence gap.
The pass cannot stop after a sample and declare the whole batch current.

Checks run in both directions: verify documented claims against code and inspect relevant
public behavior for omissions. Formatting, symbol existence, and matching versions do not
prove semantics. Existing repo-specific gates take precedence for ownership and required
checks, but generated metadata does not prove surrounding prose. Preserve accepted intent,
planned work, and historical records rather than rewriting them to excuse implementation
drift. Check-only stays read-only; an authorized update does not need a second generic ask.

## Retire the map workflow

Delete sync's `map-render.md` and `visual-spec.md`, and remove active generation routes.
ADR-108 measured no direct use of the separate map entrance; today's owner report adds that
the standing output has no readership. This is not a routing failure cured by another name:
the artifact itself is unclaimed. Its source remains recoverable in Git history. When a
specific architecture question needs a picture, use the existing on-demand visual workflow.
Re-entry requires demonstrated recurring readership for a maintained projection.

Existing artifacts in unrelated projects are not swept or deleted by a sync invocation.
This marketplace's catalog site remains a distinct, required discovery surface. Generic
maps and diagrams remain useful; only the standing codebase-map production obligation retires.

## Alternatives and overlap

- A new `shape-sync` was considered, then folded back into nav-sync before release. ADR-125's
  reason for one entrance still holds; the useful change is semantic coverage and complete
  batch execution, not a new namespace.
- `nav-compose` owns authoring and document structure; sync owns factual freshness.
- `shape-migrate` owns structural convention migration; reconcile owns record lifecycle.
- Automatic full sweeps after every edit remain out of scope. Execution verbs still maintain
  directly affected explanations and board entries under their existing rules.

## Packaging and verification

Initially, reconcile bundled the existing blueprints specification through the shared-reference
generator. ADR-132 removes that unnecessary dependency; cleanup retains the existing record format. Native skills, Codex/ Cursor projections, catalog, and installation
metadata are updated together. The nav release is 0.20.0; shape is 0.24.1.

Validation covers packaging, registration, current references, and bounded task scenarios.
Same-session scenario checks establish coherence, not a measured improvement in model
behavior; actual routing and full-batch reliability still need evidence from use.
