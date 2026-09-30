---
name: sync
description: "Check or update code-file headers and reader documents against current implementation. Use for sync the headers, README 有沒有跟上 code, or 一次更新 README 和 docs; project-record cleanup belongs to /shape:reconcile."
---

# Sync — make explanations match the code

Keep the requested explanations accurate, whether they live above code or in a README,
setup guide, usage example, API reference, or architecture document. Inspect both what
those explanations claim and what reader-relevant behavior they omit.

## Workflow

1. **Establish scope and target.** Identify the requested files or changed feature, and
   whether this is a check or an authorized update. Use the current working tree unless
   the user names a release or installed version; keep those targets distinct. A named
   README does not imply a header sweep, and a header update does not imply all docs.
   A request to update README and/or docs is a batch update: inventory all reader documents
   in that named scope, then work through the full set, not just an initial sample.
   For an unqualified sync, use the active change's affected explanations; ask only if
   no bounded target can be established. No silent fetch, upgrade, or product-code change.
2. **Ground the explanations.** Inspect implementation, configuration, command entries,
   registries, and relevant tests. Reuse fresh same-session findings after checking for
   relevant changes. Headers and other docs locate evidence; they are not proof. Follow
   declared repository consistency gates and report the convention/evidence tier used.
3. **Load the procedure for the requested surface.** Use `references/header-render.md`
   for source headers and `references/docs-render.md` for reader documents. Load both
   only when both are in scope. Verify claims, defaults, setup, examples, and limitations;
   inspect the relevant implementation for missing reader workflows or changed usage.
4. **Correct within authorization.** Show a focused diff. Check-only requests write
   nothing; an authorized update proceeds without another generic approval. Preserve
   unrelated edits and useful explanations. Edit generated text through its actual owner
   and regenerate. Ask only for unresolved intent, destructive scope, or external effects.
5. **Verify and report.** Re-read changed claims against code; validate links and safely
   exercise changed commands/examples when useful. Run repository-required checks.
   Distinguish static inspection from executed behavior, and state checked scope,
   changes, unchanged-current files, historical/planned records retained, unresolved claims,
   and runtime checks that could not run. A batch is complete only when every inventoried
   document has a disposition; report any blocker rather than silently shrink the scope.

## Gates

- **Truth is more than formatting.** A well-shaped header can still be stale. A present
  symbol does not prove documented behavior; a version match does not prove a README.
  Include meaningful omissions, without turning every internal function into a feature.
- **Implementation is not product intent.** A violated accepted decision is a discrepancy
  to surface, not permission to rewrite intent or fix product code. Planned work remains
  planned; dated ADRs and release notes remain historical. Add a status pointer as needed.
- **Tolerate the existing convention.** Report standard, nonstandard, or absent input.
  During a check, an absent document is a finding; create one only when requested scope
  includes it. Headers preserve applicable shebangs, encoding markers, and legal notices.
- **Keep the pass proportional.** Skip thin source files and say why. Preserve substantive
  comments when restructuring, correcting only claims the evidence disproves. Composing
  explanations and accepting their accuracy stay on the session model.
- **On demand, no standing HTML map.** Sync does not generate or maintain codebase maps,
  remove existing project artifacts, or impose a full documentation pass after every edit.

## Boundaries

/nav:compose authors or restructures prose; /nav:audit assesses code structure;
/nav:refactor changes it. /shape:reconcile maintains the lifecycle of project design
records; /shape:align owns priorities. Missing siblings do not block a scoped sync.
