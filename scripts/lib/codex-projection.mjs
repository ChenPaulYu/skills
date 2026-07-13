import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export function loadCodexProjection(root) {
  const manifestPath = join(root, "platforms", "codex", "manifest.json");
  const descriptionsPath = join(root, "platforms", "codex", "descriptions.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const descriptions = JSON.parse(readFileSync(descriptionsPath, "utf8"));
  return { manifest, descriptions, manifestPath, descriptionsPath };
}

export function codexDescription(projection, flatName, fallback) {
  return projection.descriptions.skills[flatName] ?? fallback;
}

export function selectProfile(projection, profileName, availableSkills) {
  const profile = projection.manifest.install_profiles?.[profileName];
  if (!profile) {
    const names = Object.keys(projection.manifest.install_profiles ?? {}).sort().join(", ");
    throw new Error(`Unknown Codex install profile "${profileName}". Available: ${names}`);
  }

  const selected = new Set();
  for (const pattern of profile.skills) {
    if (pattern === "*") {
      for (const skill of availableSkills) selected.add(skill);
      continue;
    }
    if (pattern.endsWith("-*")) {
      const prefix = pattern.slice(0, -1);
      for (const skill of availableSkills) {
        if (skill.startsWith(prefix)) selected.add(skill);
      }
      continue;
    }
    if (!availableSkills.includes(pattern)) {
      throw new Error(`Codex profile "${profileName}" references unknown skill "${pattern}"`);
    }
    selected.add(pattern);
  }
  return [...selected].sort();
}

export function findInstalledSkillCopies(home, skillNames) {
  if (!home) return new Map();
  const roots = [join(home, ".agents", "skills"), join(home, ".codex", "skills")];
  const copies = new Map();
  for (const root of roots) {
    if (!existsSync(root)) continue;
    for (const skill of skillNames) {
      if (!existsSync(join(root, skill, "SKILL.md"))) continue;
      const paths = copies.get(skill) ?? [];
      paths.push(join(root, skill));
      copies.set(skill, paths);
    }
  }
  return copies;
}
