# Adopt the selected home without duplicating progress

Use only for explicitly requested legacy migration. Resolve the home and project
connection through `connection.md`; the target is the selected home's convention in
`workspace-records.md`, not an intermediate blueprints layout. The historical
`migration-ledger.md` applies only when the requested target is an old blueprints dialect.

## Inspect and map before changing

Read the source records, code/Git state, existing home records and instruction owners.
Search repo and home for inbound links, anchors, old storage instructions and duplicate
registrations. Check tracked, staged, ignored and untracked content separately. Reuse
existing record IDs, creation dates and progress owners; unknown dates remain unknown.

Show a compact mapping in chat: each source file or section, its destination or reason
to stay, affected links, retained attachments and recovery route. An explicit request
to migrate covers unambiguous, reversible moves in that scope; ask only for unresolved
ownership, a broader collection, destructive loss or a storage-policy conflict. A
pending-work list is not authority to implement its tasks.

## Carry only useful work forward

- Put live work from plans, boards and handoffs into its original task or the smallest
  needed task. Preserve scope, authorization, progress, evidence/limits, blockers,
  next action and human acceptance. Preserve source claims as claims; mark unverified
  imports accordingly rather than declaring them done from old checkboxes.
- Keep undecided ideas as ideas. Put a reason in its task unless it has independent
  reuse or an explicit thought owner. Retain adopted decisions after implementation.
- Keep code, tests, runtime fixtures and product README/docs in the code repo. Preserve
  their content; update only affected storage/skill pointers through their real owner.
- Move requested or still-needed authored artifacts with their owner, preserving bytes,
  local dependencies and relative links. Reopen from the destination. Respect the home's
  asset policy; image/PDF locators do not back up the original bytes. Preserve unique
  untracked or ignored material until its storage and any removal are authorized.
- Completed history with no live use may remain recoverable in Git. Verify recovery
  from the actual commit and file, not just the existence of a repository. Do not copy
  an entire archive, generate empty type folders or add a second index/state/registry.

Keep moved content faithful. Consolidation must account for every source section and
preserve unique operative reasons; it is not permission to rewrite product decisions,
change priorities or discard ambiguous material.

## Verify before retiring an entrance

Resolve repo → home selector → project.md → actual mapped checkout. Run the bundled
reader's projects, status and scoped check, comparing with baseline diagnostics. Verify
source coverage and links in both repositories; an ignored file or HTML dependency
will not be proved present by the record reader alone. Inspect the migrated task's
actual next action and acceptance gate without executing it.

Once preservation, references and the selected destination are verified, remove the old
progress entrance only within the granted cleanup authority. Otherwise retain it with
an explicit legacy/read-only boundary so future updates have one owner. Never silently
maintain two writable boards or delete the only untracked copy. Keep historical examples
readable and distinguish them from current instructions in a stale-path search.

Re-running against the unchanged connected project must preserve bytes, record IDs,
dates and configuration. Keep a durable account in the original task only when needed.

## State what is complete

Report three outcomes separately: whether current work and operative reasons have named owners;
which historical material is recoverable from verified committed content or a chosen backup;
and whether the old source is ready for deletion. State explicit exclusions, unavailable assets and
remaining blockers. Product code/docs staying in their repository is a deliberate
boundary, not a claim that every source file was copied into the home.

Source deletion readiness requires complete source-section accounting, independent
preservation of selected artifacts, repaired references and resolved retention choices.
Distinguish readiness from an authorized deletion actually performed. For Git-backed
entrance retirement, name whether changes are local, committed/pushed on a branch or
integrated into the default branch; an open PR is not integrated retirement.
Checksums prove recovered bytes, not that live work and reasons have current owners;
setup success or a clean reader check alone does not prove a completed migration.
