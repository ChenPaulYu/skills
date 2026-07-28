---
name: migrate
description: "Migrate a project's blueprints/core document tree to the current convention version — detect which version the tree speaks, propose the mapping, then execute gated, verbatim structural transforms with reference integrity (e.g. v1 decisions.md → v2 precedents/). Fires on \"migrate the blueprints\", \"升級文件結構\", \"this tree still uses decisions.md\", or when another shape/reflect verb reports a legacy tree. NOT for judging staleness (/shape:reconcile), authoring decisions (/shape:elicit), or canon content (/shape:position) — migrate moves recorded content, never re-decides it. Distinct from relay:migrate (GitHub workspace migration)."
---

# Migrate — bring a document tree to the current convention version

The blueprints/core artifact convention is a **versioned interface with living instances**
(ADR-105). When the convention evolves, existing project trees keep speaking the old dialect —
valid, readable by every version-tolerant skill, but drifting from what new trees look like.
migrate is the one verb that upgrades a tree: detect the version, propose the mapping, execute
**verbatim, gated, reference-safe** transforms, verify nothing dangles.

## Why this skill exists

Without it, a convention change has three bad exits, all field-witnessed on the 2026-07-28
`decisions.md → precedents/` rename: hand-migration (works once, per-project, unrepeatable),
skills that silently break on old trees (seven files resolved the old name), or a convention
frozen forever because changing it orphans the fleet. The fix is the database-migration shape:
an **append-only ledger of structural transforms**, each shipped in the same commit as the
convention change it implements, runnable against any tree, any time, once.

## The two rules that keep it safe

1. **Migrate is a verbatim reorganizer.** It moves recorded content into the new structure and
   repairs every reference — it never judges whether content is stale (reconcile), never authors
   or re-decides content (elicit / position), and never "improves prose while it's in there."
   The one thing it may *add* is structure the new convention requires (headers, an index, a
   status line), each derived mechanically from what the content already says.
2. **A convention change is not complete until its migration entry exists.** Any ADR that changes
   the blueprints/core convention lands its `M<n>` entry below **in the same commit**. A spec
   change without a migration is a fleet-orphaning event — refuse to let one merge quietly.

## Version detection — by structure, never a marker file

| Version | Fingerprint |
|---|---|
| **v2** (current, ADR-105) | `blueprints/precedents/index.md` exists |
| **v1** (legacy, ADR-026) | `blueprints/decisions.md` exists, no `precedents/` |
| pre-blueprints | neither; possibly no `blueprints/` at all — nothing to migrate, point at `/shape:align` to scaffold |

Both present = a half-migrated tree; report it as the finding and offer to complete M1. Detection
is idempotent — re-running migrate on a current tree reports "already v2, nothing to do."

## The migration ledger (append-only)

### M1 — `decisions.md` (v1) → `precedents/` (v2) · ADR-105, 2026-07-28

**Shape of the target:** `blueprints/precedents/` with one precedent per dated file
(`YYYY-MM-DD-<slug>.md`), `index.md` (one-line-per-precedent standing table + the tier's
conventions), `overruled.md` (dead claims, each with **what survives**). Per-file skeleton: an H1,
a `> Precedent · established <date> · **Status: in force**` blockquote, the section's body
**verbatim**, and an `**Evidence.**` line pointing at whatever the section already cited (or the
project's notes/registry when it cited nothing — say so rather than invent).

**Mapping:**
- Each `## <topic>` feature-section → one precedent file. Date it by when the call was
  established: `git log -L` on the section (or `--follow` history); when undeterminable, use the
  migration date and note the approximation in the Status line.
- `Supersedes:` / `Rejected:` fold-forward residue → `overruled.md` entries (claim · what
  survives · pointer to the overturning precedent).
- Build `index.md`: one row per file — name + the standing in one line, distilled from the file's
  own opening (never newly authored prose).
- The source file is **deleted** after verification (git is the archive). A pointer tombstone is
  optional and only on request — a prescriptive placeholder left behind is the same lock ADR-104
  named in `core/`.

## Protocol

1. **Detect + report (read-only).** Version fingerprint, section inventory, inbound-reference
   inventory: `grep -rn` the whole repo (docs, code, READMEs, AGENTS/CLAUDE.md) for the old
   structure's name and anchors. Present the full mapping — per section: target filename, date
   and its provenance, references that will be re-pointed. **User confirms before any write.**
2. **Tracked-check (hard gate).** `git ls-files` on every source — untracked content has no
   recovery path; resolve tracked status before any transform. Never chain a destructive `rm`
   after an unverified move.
3. **Execute, one transform at a time.** Content moves verbatim; added structure only as the
   ledger entry specifies. Re-check between steps; don't batch destructive ops behind one
   confirmation.
4. **Reference integrity.** Re-point every inbound reference found in step 1 — standing pointers
   in `plan.md` / `AGENTS.md` / `CLAUDE.md` / READMEs included. Old anchors
   (`decisions.md#<topic>`) map to their target file.
5. **Verify, then delete.** Every source section accounted for in the target (diff the moved
   prose, not the line counts); repo-wide grep for the old name returns zero non-historical hits;
   *then* remove the source. Run the project's test/lint gate if one exists — migration must not
   break a build that greps docs.
6. **Report.** What moved where, every re-pointed reference, anything marked approximate, and a
   one-line suggestion to run `/shape:reconcile` next — migration preserves staleness faithfully,
   so a stale v1 section is now a stale v2 precedent, and that's reconcile's job to find.

## Boundaries

- **vs `reconcile`** — reconcile judges *currency* (is this doc still true?) with per-file gates;
  migrate transforms *structure* (which convention does this tree speak?) with a whole-tree
  mapping. Migrate runs first when both are wanted: reconcile's verbs then operate on the current
  convention.
- **vs `position`** — core content changes go through position's door, always. When a future
  migration touches `docs/core/` *structure* (file renames, an amendments-ledger reshape), the
  migration is authored into the ledger by the ADR that changes the convention, and execution
  still respects ADR-041: migrate may move canon files verbatim, never edit their content.
- **vs `relay:migrate`** — different plugin, different object entirely (GitHub workspace
  migration). The shared verb name is why both descriptions disambiguate.

## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| Improve prose while moving it | Verbatim or nothing — a migration diff should be `git mv`-shaped plus mechanical structure. Tell: a moved sentence reads better than its source. |
| Migrate and reconcile in one pass | Migrate first, offer reconcile after. Tell: about to drop a section because it "looks stale" mid-move. |
| Invent a date or an evidence pointer | Mark it approximate in the Status line. Tell: a `established <date>` no git query produced. |
| Leave a prescriptive tombstone by default | Delete the source; git archives it. Tell: writing a file whose only content is "this moved". |
| Ship a convention change without its `M<n>` | Block it — rule 2. Tell: a spec/ADR edit renames a structure and this ledger gained nothing. |

## Output

- A migration report: version detected, mapping executed, references re-pointed, approximations
  flagged.
- The tree at the current convention version, contents verbatim, zero dangling references.
- A one-shot suggestion to run `/shape:reconcile` (never auto-invoked).

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.
