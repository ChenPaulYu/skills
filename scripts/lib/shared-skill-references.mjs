/**
 * Shared skill references: one editable owner, self-contained packaged consumers.
 * build-manifests materializes them; the validator checks every destination for drift.
 * Reads: node:fs · node:path · shared handoff convention owner.
 * Removes retired bundles only when they bear this builder's exact ownership marker.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const SHARED_SKILL_REFERENCES = [{
  source: "plugins/shape/references/session-handoff.md",
  destinations: [
    "plugins/shape/skills/park/references/session-handoff.md",
    "plugins/shape/skills/catchup/references/session-handoff.md",
  ],
}];

export function buildSharedSkillReferences(root) {
  const active = new Set(SHARED_SKILL_REFERENCES.flatMap(({ destinations }) => destinations));
  pruneRetiredBundles(root, active);
  for (const { source, destinations } of SHARED_SKILL_REFERENCES) {
    const content = `<!-- GENERATED from ${source} by scripts/build-manifests.mjs; do not hand-edit. -->\n\n${readFileSync(join(root, source), "utf8")}`;
    for (const destination of destinations) {
      const path = join(root, destination);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
    }
  }
}

function pruneRetiredBundles(root, active) {
  const directories = (path) => existsSync(path)
    ? readdirSync(path, { withFileTypes: true }).filter(entry => entry.isDirectory())
    : [];
  function visit(relative) {
    for (const entry of readdirSync(join(root, relative), { withFileTypes: true })) {
      const file = `${relative}/${entry.name}`;
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile() && !active.has(file)) {
        const firstLine = readFileSync(join(root, file), "utf8").split("\n", 1)[0];
        if (/^<!-- GENERATED from \S+ by scripts\/build-manifests\.mjs; do not hand-edit\. -->$/.test(firstLine)) {
          rmSync(join(root, file));
        }
      }
    }
  }
  for (const plugin of directories(join(root, "plugins"))) {
    const skills = `plugins/${plugin.name}/skills`;
    for (const skill of directories(join(root, skills))) {
      const refs = `${skills}/${skill.name}/references`;
      // Directory entries exclude symlinks, including a symlinked references root.
      if (directories(join(root, skills, skill.name)).some(entry => entry.name === "references")) visit(refs);
    }
  }
}
