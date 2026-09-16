/**
 * Shared skill references: one editable owner, self-contained packaged consumers.
 * build-manifests materializes them; the validator checks every destination for drift.
 * Reads: node:fs · node:path · plugins/shape/references/session-handoff.md.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const SHARED_SKILL_REFERENCES = [{
  source: "plugins/shape/references/session-handoff.md",
  destinations: [
    "plugins/shape/skills/park/references/session-handoff.md",
    "plugins/shape/skills/catchup/references/session-handoff.md",
  ],
}];

export function buildSharedSkillReferences(root) {
  for (const { source, destinations } of SHARED_SKILL_REFERENCES) {
    const content = `<!-- GENERATED from ${source} by scripts/build-manifests.mjs; do not hand-edit. -->\n\n${readFileSync(join(root, source), "utf8")}`;
    for (const destination of destinations) {
      const path = join(root, destination);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
    }
  }
}
