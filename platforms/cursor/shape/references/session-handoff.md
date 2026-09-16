# Session handoff — one note, two entrances

> Editable owner of the location and format shared by shape-park and shape-catchup.
> `node scripts/build-manifests.mjs` bundles this reference into both skill folders.
> The handoff itself is a tolerant convention, not a mandatory schema.

## Location

Use the project's existing blueprints tree: its `baton.md` is the session note
(normally `blueprints/baton.md`; follow an established `docs/blueprints/` location).
With no blueprints tree, use root `HANDOFF.md`. Never scaffold a tree solely for a
handoff. Report the selected location. The entrance rename does not rename data.

When a tree exists but its note is absent and a legacy root `HANDOFF.md` remains,
read and report that legacy note rather than silently ignore it. Do not migrate
it as a side effect of catchup. If both files exist, inspect both and flag conflicting
live content; do not silently discard one. Park updates the selected existing note
until an explicit migration is requested, avoiding a second competing cursor.

## Fields and evidence

One overwritten note holds these five questions. Read older headings, translated
headings, and ad-hoc notes for their meaning; missing sections are not a failure.
For a new note, use this familiar shape (follow the project's document language):

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
decision record. It is local-only by default; committing for cross-machine use is
the user's choice. Neither entrance commits it automatically.
