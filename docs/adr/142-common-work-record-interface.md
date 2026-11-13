# ADR-142: One reading interface for work records

Status: Accepted for the workspace pilot; legacy records remain readable.
Date: 2026-11-13

## Problem

Disposable renders can outlive their decisions with no clear parent, date, or
retirement condition. Reconstructing their purpose during tidy requires reading
old HTML and implementation narratives. This problem also affects ideas, plans,
tasks, thoughts and probes; a mockup-only sidecar rule would leave inconsistent
record interfaces and duplicate metadata owners.

## Decision

`plugins/shape/references/record-interface.md` owns the common interface: compact
frontmatter; an opening conclusion; visible Relations; then supporting detail.
New work records carry stable identity/type/title/status, honest created/updated
dates, and typed links. Unknown historical dates remain unknown. A Relations table
is a marked projection of frontmatter links, refreshed by the writer; it is not a
second edge owner. This change defines writer behavior, not a new rendering service
or a claim of automatic drift detection.

Each mockup decision has one Markdown record. Use the existing workspace record
when mapped, otherwise an adjacent `mockup.md` under the established artifact
location. Multiple candidate renders can share it. HTML headers point to the record
instead of separately owning mutable dates/status/picks. Durable thoughts retain
accepted reasons and deferred alternatives; closing a task surfaces linked artifacts
for retirement review without automatic deletion.

Project context and curated priorities stay in project.md; project state is derived
from original tasks and actual repository evidence. Git carries committed textual
history. Records retain intent, reasons and next actions, without mandatory History
sections or duplicate state boards. Ignored assets still require explicit preservation.

## Adoption and boundaries

Bundle the shared interface into Shape readers/writers and the Nav consumers that
produce or update working records. Keep body-level gates short and format detail
in the reference. Retain type-specific protocols, conventional/absent fallback tiers,
existing authority, artifact retention, and real-interaction verification.

Do not retrofit all legacy blueprints, create new tasks just to fill relations,
install new global copies, add a database or formatter, or treat this change as a
Foreedge migration/release. Demonstrate the interface in the existing skills pilot.
