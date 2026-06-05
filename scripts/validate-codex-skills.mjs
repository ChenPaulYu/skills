#!/usr/bin/env node
/**
 * validate-codex-skills.mjs
 *
 * Guards the dual-support contract:
 * - Claude Code source lives under plugins/<plugin>/skills/<skill>/SKILL.md.
 * - Codex mirror lives under .agents/skills/<plugin>-<skill>/SKILL.md.
 * - The mirror must be exactly what scripts/build-codex.mjs generates.
 */
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, relative } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGINS_DIR = join(ROOT, "plugins");
const CODEX_SKILLS_DIR = join(ROOT, ".agents", "skills");
const CODEX_DESCRIPTION_LIMIT = 1024;
const errors = [];

function main() {
  const pluginSkills = readPluginSkills();
  validateClaudeSources(pluginSkills);
  validateCodexMirror(pluginSkills, ROOT);
  validateGeneratedDrift();

  if (errors.length) {
    console.error(`Codex/Claude skill compatibility check failed (${errors.length}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Codex/Claude skill compatibility ok: ${pluginSkills.length} plugin skills`);
}

function readPluginSkills() {
  const skills = [];
  for (const plugin of sortedDirs(PLUGINS_DIR)) {
    const pluginDir = join(PLUGINS_DIR, plugin);
    const skillsDir = join(pluginDir, "skills");
    if (!existsSync(join(pluginDir, "CLAUDE.md")) || !existsSync(skillsDir)) continue;

    for (const skill of sortedDirs(skillsDir)) {
      const skillMd = join(skillsDir, skill, "SKILL.md");
      if (!existsSync(skillMd)) continue;
      skills.push({ plugin, skill, flat: `${plugin}-${skill}`, skillMd });
    }
  }
  return skills;
}

function validateClaudeSources(pluginSkills) {
  for (const item of pluginSkills) {
    const frontmatter = readFrontmatter(item.skillMd);
    if (!frontmatter) continue;

    const name = frontmatterField(frontmatter, "name");
    const description = frontmatterField(frontmatter, "description");
    if (name?.value !== item.skill) {
      errors.push(`${rel(item.skillMd)} has name "${name?.value}", expected "${item.skill}" for Claude Code`);
    }
    if (!description) {
      errors.push(`${rel(item.skillMd)} is missing a description`);
    }
    if (isYamlUnsafePlainScalar(description.raw)) {
      errors.push(`${rel(item.skillMd)} description is not YAML-safe; quote it or remove plain ": "`);
    }
  }
}

function validateCodexMirror(pluginSkills, root) {
  for (const item of pluginSkills) {
    const skillMd = join(root, ".agents", "skills", item.flat, "SKILL.md");
    if (!existsSync(skillMd)) {
      errors.push(`missing Codex mirror for ${item.plugin}:${item.skill} at ${rel(skillMd)}`);
      continue;
    }

    const frontmatter = readFrontmatter(skillMd);
    if (!frontmatter) continue;

    const name = frontmatterField(frontmatter, "name");
    const description = frontmatterField(frontmatter, "description");
    if (name?.value !== item.flat) {
      errors.push(`${rel(skillMd)} has name "${name?.value}", expected "${item.flat}" for Codex`);
    }
    if (!description) {
      errors.push(`${rel(skillMd)} is missing a description`);
      continue;
    }

    const parsed = parseJsonString(description.raw);
    if (parsed == null) {
      errors.push(`${rel(skillMd)} description must be a quoted JSON/YAML-safe string`);
    } else if (parsed.length > CODEX_DESCRIPTION_LIMIT) {
      errors.push(`${rel(skillMd)} description is ${parsed.length} chars, over ${CODEX_DESCRIPTION_LIMIT}`);
    } else if (parsed.startsWith("\"") || parsed.startsWith("'")) {
      errors.push(`${rel(skillMd)} description appears double-encoded; regenerate with node scripts/build-codex.mjs`);
    }
  }

  for (const codexSkill of sortedDirs(join(root, ".agents", "skills"))) {
    const expected = pluginSkills.some((item) => item.flat === codexSkill);
    if (!expected) errors.push(`unexpected Codex mirror directory: .agents/skills/${codexSkill}`);
  }
}

function validateGeneratedDrift() {
  const tempRoot = mkdtempSync(join(tmpdir(), "skills-codex-validate-"));
  try {
    cpSync(ROOT, tempRoot, {
      recursive: true,
      filter: (source) => !source.includes(`${ROOT}/.git`) && !source.includes(`${ROOT}/node_modules`),
    });
    execFileSync(process.execPath, ["scripts/build-codex.mjs"], {
      cwd: tempRoot,
      stdio: ["ignore", "pipe", "pipe"],
    });

    validateCodexMirror(readPluginSkillsFrom(tempRoot), tempRoot);
    compareTrees(join(tempRoot, ".agents", "skills"), CODEX_SKILLS_DIR, ".agents/skills");
    compareFiles(join(tempRoot, "AGENTS.md"), join(ROOT, "AGENTS.md"), "AGENTS.md");
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function readPluginSkillsFrom(root) {
  const originalRoot = ROOT;
  const pluginSkills = [];
  const pluginsDir = join(root, "plugins");
  for (const plugin of sortedDirs(pluginsDir)) {
    const pluginDir = join(pluginsDir, plugin);
    const skillsDir = join(pluginDir, "skills");
    if (!existsSync(join(pluginDir, "CLAUDE.md")) || !existsSync(skillsDir)) continue;
    for (const skill of sortedDirs(skillsDir)) {
      const skillMd = join(skillsDir, skill, "SKILL.md");
      if (existsSync(skillMd)) pluginSkills.push({ plugin, skill, flat: `${plugin}-${skill}`, skillMd });
    }
  }
  void originalRoot;
  return pluginSkills;
}

function compareTrees(expectedDir, actualDir, label) {
  const expectedFiles = listFiles(expectedDir).sort();
  const actualFiles = listFiles(actualDir).sort();
  const all = new Set([...expectedFiles, ...actualFiles]);

  for (const file of all) {
    if (!expectedFiles.includes(file)) {
      errors.push(`${label}/${file} exists but is not generated from plugins`);
      continue;
    }
    if (!actualFiles.includes(file)) {
      errors.push(`${label}/${file} is missing; run node scripts/build-codex.mjs`);
      continue;
    }
    compareFiles(join(expectedDir, file), join(actualDir, file), `${label}/${file}`);
  }
}

function compareFiles(expected, actual, label) {
  if (!existsSync(actual)) {
    errors.push(`${label} is missing; run node scripts/build-codex.mjs`);
    return;
  }
  if (readFileSync(expected, "utf8") !== readFileSync(actual, "utf8")) {
    errors.push(`${label} is stale; run node scripts/build-codex.mjs`);
  }
}

function readFrontmatter(file) {
  const match = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    errors.push(`${rel(file)} is missing YAML frontmatter`);
    return null;
  }
  return match[1];
}

function frontmatterField(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.*)$`, "m"));
  if (!match) return null;
  return { raw: match[1].trim(), value: unquote(match[1].trim()) };
}

function parseJsonString(raw) {
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "string" ? parsed : null;
  } catch {
    return null;
  }
}

function unquote(raw) {
  const parsed = parseJsonString(raw);
  if (parsed != null) return parsed;
  return raw;
}

function isYamlUnsafePlainScalar(raw) {
  if (!raw) return true;
  if (parseJsonString(raw) != null) return false;
  return raw.includes(": ");
}

function listFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const child of listFiles(path)) files.push(join(entry.name, child));
    } else {
      files.push(entry.name);
    }
  }
  return files;
}

function sortedDirs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((entry) => statSync(join(dir, entry)).isDirectory())
    .sort();
}

function rel(file) {
  return relative(ROOT, file);
}

main();
