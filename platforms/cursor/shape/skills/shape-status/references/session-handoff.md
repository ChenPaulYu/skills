<!-- GENERATED from ../../references/session-handoff.md by scripts/build-manifests.mjs; do not hand-edit. -->

# Legacy handoff — consume without losing live context

Read existing baton/HANDOFF files during status reconstruction. Wrap saves into original
work items rather than creating another session cursor. This reference describes existing
inputs; the template below is a reading map, not an instruction to create a new note.

## Location

Use the project's existing blueprints tree: its `baton.md` is the session note
(normally `blueprints/baton.md`; follow an established `docs/blueprints/` location).
With no blueprints tree, use root `HANDOFF.md`. Never scaffold a tree solely for a
handoff. Report the selected location. The entrance rename does not rename data.

When a tree exists but its note is absent and a legacy root `HANDOFF.md` remains,
read and report that legacy note rather than silently ignore it. Do not migrate
it as a side effect of catchup. If both files exist, inspect both and flag conflicting
live content; do not silently discard one. Preserve both originals until their live work and reasons are explicitly transferred.

## Fields and evidence

One overwritten note holds these five questions. Read older headings, translated
headings, and ad-hoc notes for their meaning; missing sections are not a failure.
Recognize this familiar legacy shape:

```markdown
# HANDOFF

> git SHA at park time: <fresh SHA, or unavailable> · parked <ISO date>

## 🎯 Goal
<what we are trying to do and why>

## ✅ Done
<what is implemented, verified, or committed; why this approach>

## 📍 Now
<where work stopped, how far it got, including uncommitted work>

## ⚠️ Open
<unresolved questions and blockers; name rejected approaches as rejected>

## ➡️ Next
<the concrete next action and why it comes next>
```

Empty means empty; do not pad. Record why while it is known, especially why a path
was abandoned. Current files and checks establish what exists and works; git
establishes what is committed; conversation or recorded decisions establish intent.
Mark inference and unknowns instead of treating one kind of evidence as another.

This note is a temporary stopping point, not a second project board or a permanent
decision record. Storage, sharing, and Git checks follow `references/development-artifacts.md`.
Neither a read nor a save claims that a local-only note is shared.
