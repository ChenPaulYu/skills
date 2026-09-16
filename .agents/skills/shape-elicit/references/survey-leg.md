# Survey leg — fill a demonstrated gap in the decision space

> The focused mapping capability retained from the former shape-survey (ADR-110).
> ADR-129 removes automatic stall classification and mandatory reading detours.
> This is an optional part of elicit, not a separate skill call.

## When this helps

Use a survey when the user requests a map of unfamiliar options or a demonstrated
gap spans enough of the decision space that a short explanation is insufficient.
A passing expression of doubt is not enough. Offer the broader survey if it
would materially expand the current discussion; an explicit request already
authorizes that scope. A small factual gap can be answered inline.

## Map what matters to this decision

1. Identify the decision and relevant constraints from existing context. Ask what
   the user already knows only when it is needed; do not make them repeat it.
2. Sketch the relevant dimensions and options. If presenting dimensions as
   independent, test that changing one does not force another to change; otherwise
   state the coupling instead of calling them independent.
3. Ground the map in the actual situation: code, configuration, prior decisions,
   or applicable primary sources. Cite concrete evidence where available and
   distinguish general possibilities from verified constraints of this project.
4. Report the useful difference from the user's stated understanding. Distinguish
   an unfamiliar dimension from a missing option within a familiar dimension when
   that distinction changes the explanation. Do not dump a full textbook map or
   pretend the user lacks knowledge they have not expressed.

## Fill the gap without assigning homework

Explain enough in the conversation for the user to evaluate the choice. Examples,
a checked analogy, or a visual may help, but none is mandatory. Use verified
primary sources when the question needs them, without a source-count quota.

When understanding depends on firsthand assessment, or the user wants deeper
reading, offer the relevant material and agree on whether to pause. A larger
research effort or a paid experiment needs its own scope and authority; do not
infer those from a request for clarification or assume a fixed cost multiplier.

## Return the useful result

Summarize newly relevant options, constraints, and remaining uncertainty, then
return to the pending decision or let the user decide directly. No compulsory
resumption of questioning and no automatic next-skill invocation.

The elicit body owns persistence and authorization. A small map can remain in
chat; if saving is authorized, follow the existing document convention and show
the content or diff first. Tolerate non-standard or absent document structures
and report where the information came from; do not scaffold a tree merely to
finish a survey. The survey itself does not edit product code or decide for the user.
