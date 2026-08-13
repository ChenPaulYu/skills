# Migrate — full protocol, the migration ledger, boundaries, and anti-patterns

Machinery sunk from the SKILL.md body per ADR-109 (three-layer re-homing). The Stance section
in SKILL.md carries the two safety rules (verbatim reorganizer; no convention change without a
matching ledger entry) verbatim; this file carries the version-detection table, the append-only
ledger itself (new `M<n>` entries land here, in the same commit as the convention change they
implement — this file is where rule 2 in the SKILL.md body points), the full step protocol, the
boundary detail, and the anti-pattern table.

## Why this skill exists

Without it, a convention change has three bad exits, all field-witnessed on the 2026-07-28
`decisions.md → precedents/` rename: hand-migration (works once, per-project, unrepeatable),
skills that silently break on old trees (seven files resolved the old name), or a convention
frozen forever because changing it orphans the fleet. The fix is the database-migration shape:
an **append-only ledger of structural transforms**, each shipped in the same commit as the
convention change it implements, runnable against any tree, any time, once.

## Version detection — by structure, never a marker file

| Version | Fingerprint |
|---|---|
| **v3** (current, ADR-112 · extended ADR-113) | `blueprints/thoughts/*.md` carry a `Status:` line; no `precedents/` folder |
| v2 (legacy, ADR-105) | `blueprints/precedents/index.md` exists |
| v1 (legacy, ADR-026) | `blueprints/decisions.md` exists, no `precedents/` |
| pre-blueprints | neither; possibly no `blueprints/` at all — nothing to migrate, point at `/shape:align` to scaffold |

More than one fingerprint present = a half-migrated tree; report it as the finding and offer to
complete the relevant `M<n>` (M1 for a v1 remnant, M2 for a v2 remnant, M3 for a root `HANDOFF.md`
remnant). Detection is idempotent — re-running migrate on a current tree reports "already v3,
nothing to do."

**`baton.md` is not part of the fingerprint.** ADR-113 added it to v3's layout as an optional,
ephemeral tier — it is single-use and routinely absent (deleted once read), so its absence never
signals an old version the way a missing `Status:` line does. M3 below moves an existing root
`HANDOFF.md` into the tree; a v3 tree that has simply never had one parked is not "unmigrated."

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

### M2 — `core/` + `precedents/` (v2) → `thoughts/` with `Status:` lines (v3) · ADR-112, 2026-08-13

**Shape of the target:** `blueprints/thoughts/` only — the durable thought template
(`blueprints-spec.md`): an H1, a `> <date> · **Status: in force** (or `superseded by <file>` /
`shipped`) · <TL;DR>` blockquote in the first three lines, then **the call** · **how it shows up
in the system** · **what was rejected or deferred**, and an `**Evidence.**` line. One tier, no
promotion step, no freeze gate.

**Mapping:**
- Each `precedents/<date>-<slug>.md` → moves to `thoughts/<date>-<slug>.md` **verbatim** — its
  existing `Status:` line, 3-part body, and `**Evidence.**` pointer already match the target
  template; only the opening blockquote's wording is normalized to the three-line form.
- Each `core/<doc>.md` (a ratified canon doc) → becomes a new `thoughts/<date>-<slug>.md`, dated
  by the doc's own established-date (`git log -L`, or the migration date if undeterminable — noted
  as approximate in the `Status:` line) with `**Status: in force**`; content maps onto the call /
  how it shows up / what was rejected sections **verbatim**, split by the doc's existing headings
  where it already used them, or filed under "the call" whole when it didn't.
- `precedents/index.md` and `overruled.md` are **deleted** — the index was a standing render of
  exactly what `head -3 thoughts/*.md` reproduces on demand (no longer maintained, per doctrine);
  each `overruled.md` entry's **what survives** folds into the *overturning* thought's own body
  (if not already present there), and the *overturned* file's `Status:` line is set to
  `superseded by <file>` — **in place, not a move** (supersession is an edit, ADR-112).
- Each open row in `docs/core/amendments.md` **folds into its target doc as a direct edit** — the
  amendment is applied, not left queued, because there is no freeze gate left to wait behind; the
  ledger file is then deleted.
- The ADR-041 freeze protocol and the `/shape:position` write-door retire with this migration —
  no replacement door. Any verb may edit a `thoughts/` file's `Status:` line directly going
  forward (`/shape:align` for a fact reality already settled, `/shape:elicit` for a reconsidered
  call).

### M3 — root `HANDOFF.md` → `blueprints/baton.md` (joins v3's ephemeral tier) · ADR-113, 2026-08-13

**Shape of the target:** no format change — `blueprints/baton.md` is the exact same five-section
template (`goal · done · now · open · next` + the git-SHA metadata line) `HANDOFF.md` already
used; only its location and owner move, from a root file written/read by the now-dissolved
`reflect` plugin's `park`/`catchup` to a `blueprints/` tier written/read by `/shape:baton`.

**Mapping:**
- **Tree exists** → the source file moves **verbatim**, content untouched: `git mv HANDOFF.md
  blueprints/baton.md` if tracked, a plain `mv` if not (park's own doctrine already treats it as
  local-only by default — most sources will be untracked; check with `git ls-files` per the
  tracked-check gate before choosing which). No reformatting, no re-dating — the SHA and the five
  sections carry over exactly as written.
- **No tree** → **left in place** at the project root. This is not a partial migration: root
  `HANDOFF.md` is the standing no-tree fallback (tolerant reader, ADR-071), not a legacy dialect
  waiting to be moved. Only migrate it once a `blueprints/` tree is scaffolded (by `/shape:align`
  or otherwise) for some other reason — never scaffold a tree just to relocate a cursor.
- No index/`overruled.md` equivalent — `baton.md` is a singleton with no cross-references to
  repoint, so this is the ledger's simplest entry: one file, one move, no fold-forward.
- Stale `/reflect:catchup` / `/reflect:park` mentions elsewhere in a project's own docs are a
  naming sweep, not a structural transform — out of scope for this entry; migrate moves content,
  it doesn't rewrite prose that names the old skill.

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
   one-line suggestion to run `/shape:align` next — migration preserves staleness faithfully, so a
   stale source section is now a stale target entry, and finding that is align's compaction pass's
   job.

## Boundaries

- **vs `/shape:align`'s compaction pass** — that pass judges *currency* (is this doc still true?)
  with per-file gates; migrate transforms *structure* (which convention does this tree speak?)
  with a whole-tree mapping. Migrate runs first when both are wanted: align's compaction pass then
  operates on the current convention.
- **vs `relay:migrate`** — different plugin, different object entirely (GitHub workspace
  migration). The shared verb name is why both descriptions disambiguate.

## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| Improve prose while moving it | Verbatim or nothing — a migration diff should be `git mv`-shaped plus mechanical structure. Tell: a moved sentence reads better than its source. |
| Migrate and reconcile staleness in one pass | Migrate first, offer `/shape:align`'s compaction pass after. Tell: about to drop a section because it "looks stale" mid-move. |
| Invent a date or an evidence pointer | Mark it approximate in the Status line. Tell: a `established <date>` no git query produced. |
| Leave a prescriptive tombstone by default | Delete the source; git archives it. Tell: writing a file whose only content is "this moved". |
| Ship a convention change without its `M<n>` | Block it — rule 2. Tell: a spec/ADR edit renames a structure and this ledger gained nothing. |

## Output

- A migration report: version detected, mapping executed, references re-pointed, approximations
  flagged.
- The tree at the current convention version, contents verbatim, zero dangling references.
- A one-shot suggestion to run `/shape:align` (never auto-invoked).
