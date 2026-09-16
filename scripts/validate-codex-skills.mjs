#!/usr/bin/env node
/**
 * validate-codex-skills.mjs
 *
 * Guards the generated-artifact contract:
 * - Claude Code source lives under plugins/<plugin>/skills/<skill>/SKILL.md.
 * - Codex mirror lives under .agents/skills/<plugin>-<skill>/SKILL.md.
 * - Cursor plugins live under platforms/cursor/<plugin>/ (flattened skill folders).
 * - Those mirrors must be exactly what scripts/build-codex.mjs / build-cursor.mjs generate.
 * - Public catalog blocks in README + site map derive from manifests, skill
 *   frontmatter, and docs/catalog-copy.json. Exact regeneration catches roster,
 *   version, count, invocation-category, and editorial-copy drift (gate #3).
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
import { SHARED_SKILL_REFERENCES } from "./lib/shared-skill-references.mjs";
import {
  formatCodexCompatAudit,
  formatCodexCoverageReport,
  validateCodexCompatPhase0,
} from "./lib/codex-compat-audit.mjs";
import {
  findInstalledSkillCopies,
  loadCodexProjection,
  selectProfile,
} from "./lib/codex-projection.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGINS_DIR = join(ROOT, "plugins");
const CODEX_SKILLS_DIR = join(ROOT, ".agents", "skills");
const CODEX_AGENTS_DIR = join(ROOT, ".codex", "agents");
const CURSOR_PLUGINS_DIR = join(ROOT, "platforms", "cursor");
const CURSOR_MANIFEST = join(CURSOR_PLUGINS_DIR, "manifest.json");
const CODEX_DESCRIPTION_LIMIT = 1024;
const CODEX_PROJECTION = loadCodexProjection(ROOT);
const errors = [];

function main() {
  if (process.argv.includes("--release-smoke")) {
    validateCodexManifestMetadata();
    const compat = validateCodexCompatPhase0(ROOT, {
      worktreeFreeze: process.argv.includes("--codex-compat"),
    });
    console.log(formatReleaseSmokeSummary(compat.releaseSmokes));
    if (errors.length || compat.errors.length) {
      for (const error of errors) console.error(`- ${error}`);
      for (const error of compat.errors) console.error(`- ${error}`);
      process.exit(1);
    }
    return;
  }

  if (process.argv.includes("--compat-audit")) {
    validateCodexManifestMetadata();
    const compat = validateCodexCompatPhase0(ROOT);
    console.log(formatCodexCompatAudit(compat));
    if (errors.length || compat.errors.length) {
      for (const error of errors) console.error(`- ${error}`);
      process.exit(1);
    }
    return;
  }

  if (process.argv.includes("--coverage-report")) {
    validateCodexManifestMetadata();
    const compat = validateCodexCompatPhase0(ROOT, {
      worktreeFreeze: process.argv.includes("--codex-compat"),
    });
    console.log(formatCodexCoverageReport(compat.coverage));
    if (errors.length || compat.errors.length) {
      for (const error of errors) console.error(`- ${error}`);
      process.exit(1);
    }
    return;
  }

  if (process.argv.includes("--metadata-audit")) {
    const pluginSkills = readPluginSkills();
    validateCodexManifestMetadata();
    validateCodexProjection(pluginSkills);
    printMetadataAudit(pluginSkills);
    if (errors.length) {
      for (const error of errors) console.error(`- ${error}`);
      process.exit(1);
    }
    return;
  }

  const pluginSkills = readPluginSkills();
  validateClaudeSources(pluginSkills);
  validateCodexManifestMetadata();
  validateCursorManifestMetadata();
  validateCodexProjection(pluginSkills);
  validateCodexMirror(pluginSkills, ROOT);
  validateCursorMirror(pluginSkills, ROOT);
  validateGeneratedDrift();
  validateManifestDrift();
  validateAdrNumbers();
  const compat = validateCodexCompatPhase0(ROOT, {
    worktreeFreeze: process.argv.includes("--codex-compat"),
  });
  errors.push(...compat.errors);

  if (errors.length) {
    console.error(`Codex/Claude skill compatibility check failed (${errors.length}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Codex/Claude/Cursor skill compatibility ok: ${pluginSkills.length} plugin skills`);
}

function validateCodexManifestMetadata() {
  const manifest = CODEX_PROJECTION.manifest;
  const releasePolicy = manifest.release_policy;

  if (!/^\d+$/.test(String(manifest.schema_version || ""))) {
    errors.push(`platforms/codex/manifest.json schema_version must be an integer string, got ${JSON.stringify(manifest.schema_version)}`);
  }
  if (!/^\d+\.\d+\.\d+$/.test(String(manifest.adapter_release || ""))) {
    errors.push(`platforms/codex/manifest.json adapter_release must be independent semver (x.y.z), got ${JSON.stringify(manifest.adapter_release)}`);
  }
  if (/phase/i.test(String(manifest.adapter_release || ""))) {
    errors.push(`platforms/codex/manifest.json adapter_release must not contain phase labels: ${JSON.stringify(manifest.adapter_release)}`);
  }
  if (!releasePolicy || typeof releasePolicy !== "object") {
    errors.push("platforms/codex/manifest.json is missing release_policy");
    return;
  }
  if (releasePolicy.adapter_versioning !== "independent-semver") {
    errors.push(`platforms/codex/manifest.json release_policy.adapter_versioning must be "independent-semver", got ${JSON.stringify(releasePolicy.adapter_versioning)}`);
  }
  if (releasePolicy.schema_versioning !== "increment-on-required-contract-change") {
    errors.push(`platforms/codex/manifest.json release_policy.schema_versioning must be "increment-on-required-contract-change", got ${JSON.stringify(releasePolicy.schema_versioning)}`);
  }
  if (releasePolicy.phase_labels_allowed_in_release !== false) {
    errors.push("platforms/codex/manifest.json release_policy.phase_labels_allowed_in_release must be false");
  }
  if (releasePolicy.docs_owner !== "docs/codex-compatibility.md") {
    errors.push(`platforms/codex/manifest.json release_policy.docs_owner must be "docs/codex-compatibility.md", got ${JSON.stringify(releasePolicy.docs_owner)}`);
  } else if (!existsSync(join(ROOT, releasePolicy.docs_owner))) {
    errors.push(`release_policy.docs_owner path is missing: ${releasePolicy.docs_owner}`);
  }
  if (releasePolicy.local_model_mapping_path !== "platforms/codex/local/README.md") {
    errors.push(`platforms/codex/manifest.json release_policy.local_model_mapping_path must be "platforms/codex/local/README.md", got ${JSON.stringify(releasePolicy.local_model_mapping_path)}`);
  } else if (!existsSync(join(ROOT, releasePolicy.local_model_mapping_path))) {
    errors.push(`release_policy.local_model_mapping_path is missing: ${releasePolicy.local_model_mapping_path}`);
  }
  if (releasePolicy.public_role_contract !== "portable-roles-local-models") {
    errors.push(`platforms/codex/manifest.json release_policy.public_role_contract must be "portable-roles-local-models", got ${JSON.stringify(releasePolicy.public_role_contract)}`);
  }

  const smokePaths = Array.isArray(releasePolicy.fresh_install_smokes) ? releasePolicy.fresh_install_smokes : [];
  if (smokePaths.length < 2) {
    errors.push("platforms/codex/manifest.json release_policy.fresh_install_smokes must list the Codex and Claude release smokes");
  }
  for (const path of smokePaths) {
    if (typeof path !== "string" || !path.trim()) {
      errors.push(`release_policy.fresh_install_smokes contains a non-string entry: ${JSON.stringify(path)}`);
      continue;
    }
    if (!existsSync(join(ROOT, path))) {
      errors.push(`release_policy.fresh_install_smokes path is missing: ${path}`);
    }
  }
}

function validateCodexProjection(pluginSkills) {
  const expected = new Set(pluginSkills.map((item) => item.flat));
  const descriptions = CODEX_PROJECTION.descriptions.skills ?? {};
  const described = new Set(Object.keys(descriptions));
  const maxPerSkill = CODEX_PROJECTION.descriptions.max_chars_per_skill;
  const maxTotal = CODEX_PROJECTION.descriptions.max_total_chars;

  for (const name of expected) {
    if (!described.has(name)) {
      errors.push(`platforms/codex/descriptions.json is missing ${name}`);
    }
  }
  for (const name of described) {
    if (!expected.has(name)) {
      errors.push(`platforms/codex/descriptions.json has stale unknown skill ${name}`);
    }
  }

  let total = 0;
  for (const [name, description] of Object.entries(descriptions)) {
    if (typeof description !== "string" || !description.trim()) {
      errors.push(`Codex description for ${name} must be a non-empty string`);
      continue;
    }
    total += description.length;
    if (description.length > maxPerSkill) {
      errors.push(`Codex description for ${name} is ${description.length} chars, over ${maxPerSkill}`);
    }
  }
  if (total > maxTotal) {
    errors.push(`Codex descriptions total ${total} chars, over metadata budget ${maxTotal}`);
  }

  const available = [...expected].sort();
  for (const profileName of Object.keys(CODEX_PROJECTION.manifest.install_profiles ?? {})) {
    try {
      selectProfile(CODEX_PROJECTION, profileName, available);
    } catch (error) {
      errors.push(error.message);
    }
  }
  const all = selectProfile(CODEX_PROJECTION, "all", available);
  if (all.length !== available.length) {
    errors.push(`Codex install profile "all" covers ${all.length}/${available.length} skills`);
  }
}

function printMetadataAudit(pluginSkills) {
  const descriptions = CODEX_PROJECTION.descriptions.skills;
  const lengths = Object.entries(descriptions).map(([name, value]) => [name, value.length]);
  const total = lengths.reduce((sum, [, length]) => sum + length, 0);
  const longest = lengths.sort((a, b) => b[1] - a[1])[0];
  console.log("Codex metadata audit");
  console.log(`- Skills: ${pluginSkills.length}`);
  console.log(`- Description characters: ${total}/${CODEX_PROJECTION.descriptions.max_total_chars}`);
  console.log(`- Longest: ${longest[0]} (${longest[1]}/${CODEX_PROJECTION.descriptions.max_chars_per_skill})`);

  for (const profileName of Object.keys(CODEX_PROJECTION.manifest.install_profiles)) {
    const selected = selectProfile(
      CODEX_PROJECTION,
      profileName,
      pluginSkills.map((item) => item.flat),
    );
    console.log(`- Profile ${profileName}: ${selected.length} skills`);
  }

  const copies = findInstalledSkillCopies(
    process.env.HOME || process.env.USERPROFILE,
    pluginSkills.map((item) => item.flat),
  );
  const workspaceOverlap = [...copies.entries()].filter(([, paths]) => paths.length > 0);
  console.log(`- Current workspace/global overlap: ${workspaceOverlap.length}`);
  const duplicates = [...copies.entries()].filter(([, paths]) => paths.length > 1);
  if (!duplicates.length) {
    console.log("- Global duplicate prefixed skills: none");
    return;
  }
  console.log(`- Global duplicate prefixed skills: ${duplicates.length}`);
  for (const [name, paths] of duplicates) console.log(`  ${name}: ${paths.join(" · ")}`);
}

function formatReleaseSmokeSummary(releaseSmokes) {
  const lines = ["Codex release smokes", `- Passed: ${releaseSmokes.passed}/${releaseSmokes.total}`];
  if (releaseSmokes.errors.length) {
    lines.push("- Errors:");
    for (const error of releaseSmokes.errors) lines.push(`  ${error}`);
  }
  return lines.join("\n");
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
    } else {
      if (isYamlUnsafePlainScalar(description.raw)) {
        errors.push(`${rel(item.skillMd)} description is not YAML-safe; quote it or remove plain ": "`);
      }
      if (description.value.length > CODEX_DESCRIPTION_LIMIT) {
        errors.push(
          `${rel(item.skillMd)} description is ${description.value.length} chars, over limit of ${CODEX_DESCRIPTION_LIMIT} (breaks compatibility when installed globally via agy)`,
        );
      }
    }
    validateLinks(item.skillMd);
  }
}

function validateLinks(file) {
  const content = readFileSync(file, "utf8");
  const linkRegex = /\[([^\]]*?)\]\(([^)]+?)\)/g;
  let match;
  const fileDir = dirname(file);

  while ((match = linkRegex.exec(content)) !== null) {
    const link = match[2].trim();
    if (/^[a-z]+:\/\//i.test(link) && !link.startsWith("file:///")) continue;

    if (link.startsWith("./") || link.startsWith("../")) {
      errors.push(
        `${rel(file)}: Link "${link}" violates skills-root-relative paths rule (uses ./ or ../)`,
      );
      continue;
    }

    let targetPath = link.replace(/^file:\/\/\//, ""); // strip file:/// if present
    targetPath = targetPath.split("#")[0];
    if (!targetPath) continue;

    // Determine if it is a root-relative link or skill-local relative link
    const isRootRelative =
      targetPath.startsWith("plugins/") ||
      targetPath.startsWith("docs/") ||
      targetPath.startsWith("scripts/");
    const fullPath = isRootRelative ? join(ROOT, targetPath) : join(fileDir, targetPath);

    if (!existsSync(fullPath)) {
      errors.push(`${rel(file)}: Broken link "${link}" -> "${targetPath}" does not exist`);
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

function validateCursorManifestMetadata() {
  if (!existsSync(CURSOR_MANIFEST)) {
    errors.push("platforms/cursor/manifest.json is missing");
    return;
  }
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(CURSOR_MANIFEST, "utf8"));
  } catch (error) {
    errors.push(`platforms/cursor/manifest.json is not valid JSON: ${error.message}`);
    return;
  }
  if (!/^\d+$/.test(String(manifest.schema_version || ""))) {
    errors.push(`platforms/cursor/manifest.json schema_version must be an integer string, got ${JSON.stringify(manifest.schema_version)}`);
  }
  if (!/^\d+\.\d+\.\d+$/.test(String(manifest.adapter_release || ""))) {
    errors.push(`platforms/cursor/manifest.json adapter_release must be independent semver (x.y.z), got ${JSON.stringify(manifest.adapter_release)}`);
  }
  if (manifest.release_policy?.docs_owner !== "docs/cursor-compatibility.md") {
    errors.push("platforms/cursor/manifest.json release_policy.docs_owner must be docs/cursor-compatibility.md");
  }
}

function validateCursorMirror(pluginSkills, root) {
  const cursorRoot = join(root, "platforms", "cursor");
  for (const item of pluginSkills) {
    const skillMd = join(cursorRoot, item.plugin, "skills", item.flat, "SKILL.md");
    if (!existsSync(skillMd)) {
      errors.push(`missing Cursor plugin skill for ${item.plugin}:${item.skill} at ${rel(skillMd)}`);
      continue;
    }

    const frontmatter = readFrontmatter(skillMd);
    if (!frontmatter) continue;

    const name = frontmatterField(frontmatter, "name");
    const description = frontmatterField(frontmatter, "description");
    if (name?.value !== item.flat) {
      errors.push(`${rel(skillMd)} has name "${name?.value}", expected "${item.flat}" for Cursor`);
    }
    if (!description) {
      errors.push(`${rel(skillMd)} is missing a description`);
    }

    const sourceFrontmatter = readFrontmatter(item.skillMd);
    if (sourceFrontmatter && /^disable-model-invocation:\s*true\s*$/m.test(sourceFrontmatter)) {
      if (!/^disable-model-invocation:\s*true\s*$/m.test(frontmatter)) {
        errors.push(`${rel(skillMd)} dropped disable-model-invocation from the Claude source`);
      }
    }

    const pluginManifest = join(cursorRoot, item.plugin, ".cursor-plugin", "plugin.json");
    if (!existsSync(pluginManifest)) {
      errors.push(`missing Cursor plugin manifest at ${rel(pluginManifest)}`);
    }
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
    execFileSync(process.execPath, ["scripts/build-cursor.mjs"], {
      cwd: tempRoot,
      stdio: ["ignore", "pipe", "pipe"],
    });

    validateCodexMirror(readPluginSkillsFrom(tempRoot), tempRoot);
    validateCursorMirror(readPluginSkillsFrom(tempRoot), tempRoot);
    compareTrees(join(tempRoot, ".agents", "skills"), CODEX_SKILLS_DIR, ".agents/skills");
    compareFiles(
      join(tempRoot, ".codex", "agents", "browser-verifier.toml"),
      join(CODEX_AGENTS_DIR, "browser-verifier.toml"),
      ".codex/agents/browser-verifier.toml",
    );
    compareFiles(join(tempRoot, "AGENTS.md"), join(ROOT, "AGENTS.md"), "AGENTS.md");
    compareTrees(
      join(tempRoot, "platforms", "cursor"),
      join(ROOT, "platforms", "cursor"),
      "platforms/cursor",
      "node scripts/build-cursor.mjs",
    );
    compareFiles(
      join(tempRoot, ".cursor-plugin", "marketplace.json"),
      join(ROOT, ".cursor-plugin", "marketplace.json"),
      ".cursor-plugin/marketplace.json",
      "node scripts/build-cursor.mjs",
    );
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

/**
 * Manifest drift: `.claude-plugin/plugin.json` is the single owner of each plugin's
 * version/description/author; `.cursor-plugin/plugin.json` + marketplace.json versions
 * are derived by scripts/build-manifests.mjs. Regenerate in a temp copy and compare.
 */
function validateManifestDrift() {
  const tempRoot = mkdtempSync(join(tmpdir(), "skills-manifests-validate-"));
  try {
    cpSync(ROOT, tempRoot, {
      recursive: true,
      filter: (source) => !source.includes(`${ROOT}/.git`) && !source.includes(`${ROOT}/node_modules`),
    });
    execFileSync(process.execPath, ["scripts/build-manifests.mjs"], {
      cwd: tempRoot,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const hint = "node scripts/build-manifests.mjs";
    for (const surface of ["README.md", "docs/site/index.html"]) {
      compareFiles(join(tempRoot, surface), join(ROOT, surface), surface, hint);
    }
    for (const { destinations } of SHARED_SKILL_REFERENCES) {
      for (const destination of destinations) {
        compareFiles(join(tempRoot, destination), join(ROOT, destination), destination, hint);
      }
    }
    for (const plugin of sortedDirs(PLUGINS_DIR)) {
      const cursor = join(plugin, ".cursor-plugin", "plugin.json");
      if (!existsSync(join(PLUGINS_DIR, cursor))) continue;
      compareFiles(
        join(tempRoot, "plugins", cursor),
        join(PLUGINS_DIR, cursor),
        `plugins/${cursor}`,
        hint,
      );
    }
    compareFiles(
      join(tempRoot, ".claude-plugin", "marketplace.json"),
      join(ROOT, ".claude-plugin", "marketplace.json"),
      ".claude-plugin/marketplace.json",
      hint,
    );
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

/**
 * ADR numbers are a single-owner namespace with no owner — two sessions that pick a
 * number independently collide silently, and the collision only surfaces when a human
 * notices two files sharing a prefix (this happened twice in one afternoon: 114 and
 * 115). There is no manifest to derive the next number from, so the cheapest durable
 * fix is to refuse a duplicate at commit time and let the second author renumber.
 */
function validateAdrNumbers() {
  const dir = join(ROOT, "docs", "adr");
  if (!existsSync(dir)) return;
  const byNumber = new Map();
  for (const name of readdirSync(dir)) {
    const m = /^(\d{3})-.+\.md$/.exec(name);
    if (!m) continue;
    const n = m[1];
    if (!byNumber.has(n)) byNumber.set(n, []);
    byNumber.get(n).push(name);
  }
  for (const [n, files] of [...byNumber].sort()) {
    if (files.length > 1) {
      errors.push(
        `docs/adr/: number ${n} is claimed by ${files.length} files (${files.join(", ")}) — ` +
          `ADR numbers must be unique; the later author renumbers to the next free number and ` +
          `updates every reference (site map audit block, plugin CLAUDE.md, skill bodies)`,
      );
    }
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

function compareTrees(expectedDir, actualDir, label, hint = "node scripts/build-codex.mjs") {
  const expectedFiles = listFiles(expectedDir).sort();
  const actualFiles = existsSync(actualDir) ? listFiles(actualDir).sort() : [];
  const all = new Set([...expectedFiles, ...actualFiles]);

  for (const file of all) {
    if (!expectedFiles.includes(file)) {
      errors.push(`${label}/${file} exists but is not generated from plugins`);
      continue;
    }
    if (!actualFiles.includes(file)) {
      errors.push(`${label}/${file} is missing; run ${hint}`);
      continue;
    }
    compareFiles(join(expectedDir, file), join(actualDir, file), `${label}/${file}`, hint);
  }
}

function compareFiles(expected, actual, label, hint = "node scripts/build-codex.mjs") {
  if (!existsSync(actual)) {
    errors.push(`${label} is missing; run ${hint}`);
    return;
  }
  if (readFileSync(expected, "utf8") !== readFileSync(actual, "utf8")) {
    errors.push(`${label} is stale; run ${hint}`);
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
