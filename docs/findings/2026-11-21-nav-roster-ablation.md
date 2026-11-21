---
title: "Nav roster ablation: can fewer entry points preserve the work?"
description: "Fresh-agent comparisons of docs, source headers, architecture assessment, routing, and release-snapshot documentation in the full and reduced Nav rosters."
date: 2026-11-21
status: raw
plugin: nav
plugin_version: "0.28.7"
skill_repository_commit: "dd1de7b0579a561f3cd5ebf1c5268b5703290d91"
skills: ["nav:do", "nav:audit", "nav:sync", "nav:refactor", "nav:compose", "nav:ship"]
model: "gpt-6.2-sol"
tags: [skill-evaluation, ablation, routing, documentation]
---

# A reduced Nav roster passed with on-demand procedures

The results support trialing `do` as the entry for scoped docs and header work
and decided behavior-preserving refactors. Keep the detailed procedures
available on demand. Routine prose restructuring worked directly. In one
feature-readiness pair, both the dedicated audit and direct inspection found
the main architectural risks.

## Conditions

Twelve fresh Sol agents ran the new comparisons. Each worker received one task.
Matched workers received identical prompts and isolated copies of the same
input. The session independently checked outcomes and retained judgment.

| Condition | What the worker could discover |
|---|---|
| Full | Current native Nav roster and skill bodies from the recorded commit |
| Reduced | Audit and Ship unchanged. Do accepts code changes, behavior-preserving refactors, and check-only or authorized explanation updates. Refactor, docs, and header procedures load on demand. |
| Reduced without detailed sync procedures | Same reduced roster and short docs-mode instructions, with the detailed docs/header references removed |
| Direct architecture inspection | Same read-only feature request and source snapshot, using ordinary judgment |

The reduced and stripped Do bodies had SHA-256 hashes
`b5c03c0a9d369b22b5f9c468c09d5c5bf1cd41a8710017bdfca7ebf214b31485` and
`d4e5c6b992eedd4f7a089961f9e1993522fff080e1070dd5c9cf20e766b9d5ea`,
respectively. They were scratch variants of Nav 0.28.7.

## Results

| Comparison | Result | Decision signal |
|---|---|---|
| Batch docs update, three conditions | All three corrected the same five documents, ran the owner generator, and preserved current, historical, and planned material. | A separate Sync entry was unnecessary on this fixture. |
| Check-only docs, three conditions | All three gave grounded findings. Full and reduced had zero observed worktree writes. The stripped run overwrote the generated options, then restored the file. | Keep the authorization and safe-verification procedure when consolidating. Final Git status missed the transient write. |
| Scoped header update, full vs. reduced | Both fixed two stale headers, preserved the correct third header, and passed two CLI tests plus inspection of the file preambles, permissions, and executable contents. | The on-demand header procedure worked inside Do for this scoped update. |
| Metadata routing, full vs. reduced | Both matched 13/13 expected routes and write scopes. | The smaller catalog retained the tested distinctions, including approach-first, read-only checks, structural changes, direct prose, and explicit shipping. |
| Feature-readiness assessment, Audit vs. direct | Both identified the persistence gap, native tab identity, focus fallback, vault isolation, legacy state, and the need for restart tests. | No material decision advantage established for Audit on this request. |

### Documentation and scope

The docs comparisons used a local Reporter fixture based on the existing
[behavior case catalog](../../scripts/fixtures/behavior/cases.json). It
contained eight reader documents, including nested usage and API guidance, a
generated options page, accurate local-execution guidance, a historical
document, and a future plan. The CLI accepted JSON or CSV, defaulted to JSON
and at most 25 rows, returned a string from its formatter, and exposed an
undocumented way to pass a JSON array through standard input. The stale
examples used unsupported format and limit arguments.

The session reran three CLI tests and example commands in each batch result,
compared the generated file with a fresh projection, and checked relative
links, scope, and Git state. All three check-only results returned to the
original Git tree. A recursive worktree watcher recorded the stripped run's
two events on the same generated file, corroborating the worker's report of
an attempted output interception followed by an overwrite and restoration.
The detailed references were the principal difference between the two
reduced conditions. A single incident measures a failure in that run and
leaves its population frequency and exact cause open.

The separate header fixture used a CLI entry, catalog facade, and
implementation module. Both outputs corrected the two stale `Reads:`
routes and kept the executable shebang, license, mode, and bytes outside the
header blocks. The actual CLI invocation still printed `Lin, Mo`.

### Architecture and routes

The architecture question asked whether a desktop reader could restore
interleaved external web tabs alongside PDF source tabs, preserving order
and selected tab. Both agents found a work-only persistence contract and
window-scoped native views with fresh runtime IDs. Both surfaced the risk
of delayed views crossing a vault switch, the distinction between a selected
web tab and its underlying work tab, and workspace writes during Work
merge/delete. Their proposed checks included old saves, same-URL tabs,
restore failure, and last-operation-before-quit. The session verified the
core claims against source. Neither worker implemented the feature or
tested desktop restart.

The routing workers saw descriptions and request text only. They performed
no actions. The reduced catalog still contains references to removed entry
names in Audit and the copied header procedure. Update those pointers to the
new owners before a pilot. The metadata exercise does not cover behavior
under every installed host or with neighboring plugins.

## Earlier matched results

- **Refactor.** The first candidate passed shared behavior tests and browser
  checks but failed TypeScript on a new test callback. A repeat on the same
  reader snapshot required a passing build before submission. Both arms
  passed the 150 common tests, build, and Chromium flow. A second task
  extracted IndexedDB storage in a sample DAW. Both arms passed 14 storage
  and 25 browser checks, including legacy data, aborted writes, Warp and
  reopening. The candidate still contained the original on-demand refactor
  procedure.
- **Compose.** In separate paired trials, both ordinary writing and the
  dedicated skill preserved the important facts and constraints in the
  marketplace's install guide and an engineering findings report. The skill
  version added navigation links in the guide. Both versions offered a
  usable path to the correct setup, verification, and caveats. Specialized
  skill authoring was outside those trials.

## Interpretation

The evidence supports a pilot that keeps Audit read-only, gives Do separate
on-demand modes for refactor and docs/header work, and leaves ordinary
prose restructuring direct. Preserve the existing authorization boundary
for Ship. In a check-only docs pass, inspect a generator or capture its
output in memory without touching the requested checkout. In a refactor,
establish the observable contract before editing and rerun the same
regression checks and required build on the final diff.

These are bounded samples. They do not establish equivalence for larger
docs batches, deep audits, or a live workspace with attached records. The
earlier [Do evaluation](2026-11-21-nav-do-evaluation.md) covers the core
implementation comparison.

## Follow-up: docs verified against the exact release

Six additional fresh Sol agents tested three matched pairs with local Git
remotes. All started with approved CSV changes plus unrelated work: another
file already staged, an unstaged draft in the README that needed a public
update, a dirty source default of 99, and an untracked draft. The session
checked the landed diff, every new reachable remote commit for draft markers,
the original working copies and staged index, exact generator output, the
two unit tests, and a live CSV invocation on each landed snapshot.

| Request | Comparison | Observed result |
|---|---|---|
| Plain ship | Original Ship vs. Ship with affected-docs check | Both landed the code safely. Original Ship left the CSV guidance stale. The candidate also updated README, usage, and generated options. Both left the independent stale limits guide outside this request. |
| Explicit full docs refresh and ship | Separate Sync and Ship vs. combined Ship | Both corrected four reader documents, preserved dated history and planned work, and generated options from the actual release default of 25. Both kept the operator drafts. |
| Explicit full refresh with main already ahead | Combined Ship vs. combined Ship with explicit clean-snapshot and recheck instructions | Both discovered the upstream change, generated docs against the new default of 40, and fast-forwarded safely. The dirty operator copy still contained 99. |

The combined Ship body had SHA-256
`e16092ccd225f3476f7b6ce041ed6928a7cef5cb4eee7eb3b5f808fbcd027a1e`.
The variant with explicit isolation and rechecking had SHA-256
`7bf9e25a5f152e8a831f9027ca5a48c86b7b520a447fdacc2598ac90898e1c3e`.
The last pair did not establish a worker outcome advantage from the added
instructions. Two direct replays established why the safeguards matter:

- The existing [Ship command recipe](../../plugins/nav/skills/ship/references/protocol.md)
  staged only the two approved paths, but the following plain commit also
  included the already-staged notes. Running the docs generator in the dirty
  source tree recorded 99. Each operation succeeded while using the wrong scope.
- A late-upstream replay started from the release already verified at 25 and
  rebased it onto the upstream commit changing the source default to 40. The
  two unit tests and the CSV command still passed. Regenerating exposed the
  stale options page. This was a controlled replay of an update after docs
  verification. The fresh-agent pair saw the upstream commit before working.

A release docs pass should keep ordinary ship focused on affected reader
guidance and expand to a full review when the user or repo calls for it.
Select the intended release snapshot before checking or generating docs,
separate unrelated staged and unstaged work, and inspect the final commit.
Recheck affected docs and generated output whenever integration alters the
verified snapshot. These samples exercised local fast-forwards, with PR and
deployment workflows outside their scope.

## Generated-package pilot

The Nav 0.29.0 pilot exposes Audit, Do, and Ship. Fresh Sol workers selected
the generated Codex entries from natural requests. The docs check selected
Do and compared the generator's output in memory, with no observed
worktree writes. The behavior-preserving reader extraction selected Do,
passed the same 146 tests before and after, and built in both states.
Independent checks passed 152 tests and exercised PDF and web navigation
in Chromium. The release test selected Ship and landed the CSV change
with docs generated against the upstream default of 40. In the original
worktree, the unrelated staged note and working drafts were preserved.
The landed commit and its reachable remote history had no draft markers.
