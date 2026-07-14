#!/usr/bin/env node
/**
 * validate-codex-skills.mjs
 *
 * Guards the dual-support contract:
 * - Claude Code source lives under plugins/<plugin>/skills/<skill>/SKILL.md.
 * - Codex mirror lives under .agents/skills/<plugin>-<skill>/SKILL.md.
 * - The mirror must be exactly what scripts/build-codex.mjs generates.
 * - Every skill is REGISTERED in both human surfaces (README + site map) — gate #3.
 *   Without this the validator is blind to a half-registered skill (one whose SKILL.md
 *   + mirror are committed but whose README/site-map entries are missing); it ships
 *   green. The mechanical fix for the failure that shipped think:dialectic unregistered.
 * - Each plugin's CURRENT VERSION (plugins/<plugin>/.claude-plugin/plugin.json) is
 *   quoted correctly in docs/site/index.html's two live per-plugin blocks (the
 *   DOMAINS card blurb + the graph-node blurb). This is the narrow, mechanically
 *   checkable slice of gate #3's "stale surface lies silently" risk — the site map
 *   duplicates version/skill-count prose across 3 places (VERIFIED-list narrative +
 *   these two) with no single owner, and the free-form narrative isn't regular enough
 *   to gate, but the version token in these two fixed-shape blocks is. Doesn't check
 *   skill counts or verb lists — phrasing varies too much across plugins ("Four
 *   skills" vs "4 lenses" vs "7 skills, one verb each") to regex reliably; that stays
 *   a human/agent judgment call. Caught a real drift on 2026-07-03 (site map rev 62).
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
import {
  formatCodexCompatAudit,
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
const CODEX_HOOKS_DIR = join(ROOT, ".codex", "hooks");
const CODEX_HOOKS_CONFIG = join(ROOT, ".codex", "hooks.json");
const CODEX_DESCRIPTION_LIMIT = 1024;
const CODEX_PROJECTION = loadCodexProjection(ROOT);
const errors = [];

function main() {
  if (process.argv.includes("--compat-audit")) {
    const compat = validateCodexCompatPhase0(ROOT);
    console.log(formatCodexCompatAudit(compat));
    if (compat.errors.length) process.exit(1);
    return;
  }

  if (process.argv.includes("--metadata-audit")) {
    const pluginSkills = readPluginSkills();
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
  validateCodexProjection(pluginSkills);
  validateCodexMirror(pluginSkills, ROOT);
  validateGeneratedDrift();
  validateManifestDrift();
  validateRegistration(pluginSkills);
  validateSiteMapVersions();
  const compat = validateCodexCompatPhase0(ROOT, {
    worktreeFreeze: process.argv.includes("--codex-compat"),
  });
  errors.push(...compat.errors);

  if (errors.length) {
    console.error(`Codex/Claude skill compatibility check failed (${errors.length}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Codex/Claude skill compatibility ok: ${pluginSkills.length} plugin skills`);
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
    compareFiles(
      join(tempRoot, ".codex", "agents", "browser-verifier.toml"),
      join(CODEX_AGENTS_DIR, "browser-verifier.toml"),
      ".codex/agents/browser-verifier.toml",
    );
    compareFiles(
      join(tempRoot, ".codex", "hooks", "relay-digest-session-start.mjs"),
      join(CODEX_HOOKS_DIR, "relay-digest-session-start.mjs"),
      ".codex/hooks/relay-digest-session-start.mjs",
    );
    compareFiles(join(tempRoot, ".codex", "hooks.json"), CODEX_HOOKS_CONFIG, ".codex/hooks.json");
    compareFiles(join(tempRoot, "AGENTS.md"), join(ROOT, "AGENTS.md"), "AGENTS.md");
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
 * Registration gate (#3): every skill must be named in BOTH human-facing surfaces —
 * README.md and docs/site/index.html. The unambiguous token both carry is the
 * invocation form `/<plugin>:<skill>` (README skills list + site map command card),
 * which avoids the short-slug false positives a bare-name grep would hit. This is the
 * one check the rest of the validator can't give: it compares generated artifacts to
 * sources and is otherwise blind to whether a human ever wrote the skill down.
 */
function validateRegistration(pluginSkills) {
  for (const [label, path] of [
    ["README.md", join(ROOT, "README.md")],
    ["docs/site/index.html", join(ROOT, "docs", "site", "index.html")],
  ]) {
    if (!existsSync(path)) {
      errors.push(`${label} is missing; cannot verify skill registration (gate #3)`);
      continue;
    }
    const content = readFileSync(path, "utf8");
    for (const item of pluginSkills) {
      const token = `/${item.plugin}:${item.skill}`;
      if (!content.includes(token)) {
        errors.push(
          `${item.plugin}:${item.skill} is not registered in ${label} (no "${token}") — see CLAUDE.md gate #3 registration table`,
        );
      }
    }
  }
}

/**
 * Version-in-site-map gate: docs/site/index.html states each plugin's version twice
 * more, outside the VERIFIED-list narrative — once in its DOMAINS card blurb, once in
 * its graph-node blurb. Both are single-line entries in the current file shape, so a
 * plain per-line scan finds them without an HTML/JS parser. Reports every mismatch it
 * finds (not just the first) so a fix pass sees the whole list at once.
 */
function validateSiteMapVersions() {
  const sitePath = join(ROOT, "docs", "site", "index.html");
  if (!existsSync(sitePath)) return; // already flagged by validateRegistration

  const lines = readFileSync(sitePath, "utf8").split("\n");
  const label = "docs/site/index.html";

  for (const plugin of sortedDirs(PLUGINS_DIR)) {
    const pluginJsonPath = join(PLUGINS_DIR, plugin, ".claude-plugin", "plugin.json");
    if (!existsSync(pluginJsonPath)) continue;
    const { version } = JSON.parse(readFileSync(pluginJsonPath, "utf8"));
    const versionToken = `v${version}`;

    const domainsLine = findLineAfter(lines, new RegExp(`^\\s*${plugin}:\\s*\\{\\s*$`), (l) =>
      l.includes("blurb: {en:"),
    );
    checkBilingualVersion(domainsLine, "blurb: {en:", `DOMAINS.${plugin}.blurb`, versionToken, plugin, label);

    const nodeLine = lines.find((l) => l.includes(`{id:'${plugin}', kind:'plugin'`));
    checkBilingualVersion(nodeLine, "desc:{en:", `graph-node blurb for '${plugin}'`, versionToken, plugin, label);
  }
}

/**
 * A blurb line always carries both `en:'...'` and `zh:'...'` — checking the raw line
 * for the version token would pass as long as EITHER language still had it, missing a
 * one-language-only edit (an agent updating English and forgetting Chinese, or vice
 * versa). Node lines also carry an earlier, unrelated `role:{en:..., zh:...}` pair
 * before the `desc:` field, so we can't just split the whole line on the first "zh:" —
 * that would grab role's zh, not desc's. Slice from fieldMarker first, then split.
 */
function checkBilingualVersion(line, fieldMarker, label, versionToken, plugin, fileLabel) {
  if (!line) return;
  const fieldIdx = line.indexOf(fieldMarker);
  if (fieldIdx === -1) return;
  const field = line.slice(fieldIdx);

  const zhIdx = field.indexOf("zh:");
  const enPart = zhIdx === -1 ? field : field.slice(0, zhIdx);
  const zhPart = zhIdx === -1 ? "" : field.slice(zhIdx);

  if (!enPart.includes(versionToken)) {
    errors.push(
      `${fileLabel}: ${label} (en) doesn't mention ${versionToken} (from plugins/${plugin}/.claude-plugin/plugin.json) — site map version prose is stale, see CLAUDE.md gate #3`,
    );
  }
  if (zhPart && !zhPart.includes(versionToken)) {
    errors.push(
      `${fileLabel}: ${label} (zh) doesn't mention ${versionToken} (from plugins/${plugin}/.claude-plugin/plugin.json) — site map version prose is stale, see CLAUDE.md gate #3`,
    );
  }
}

function findLineAfter(lines, startRegex, matchFn, windowSize = 10) {
  const startIdx = lines.findIndex((l) => startRegex.test(l));
  if (startIdx === -1) return null;
  for (let i = startIdx + 1; i < Math.min(startIdx + 1 + windowSize, lines.length); i++) {
    if (matchFn(lines[i])) return lines[i];
  }
  return null;
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
