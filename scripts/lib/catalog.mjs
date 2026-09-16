/**
 * catalog.mjs — source-owned plugin catalog discovery and public-surface rendering.
 * Reads: plugins/<plugin>/.claude-plugin/plugin.json · plugins/<plugin>/skills/<skill>/SKILL.md · docs/catalog-copy.json.
 */
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const PLUGIN_SLUG = /^[a-z][a-z0-9-]*$/;
const SKILL_SLUG = /^[a-z][a-z0-9-]*$/;
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

export function buildCatalog(root) {
  const editorial = loadEditorial(root);
  const pluginsDir = join(root, "plugins");
  const discovered = [];
  if (!existsSync(pluginsDir)) return { plugins: [], counts: { plugins: 0, skills: 0 } };

  for (const dirent of readdirSync(pluginsDir, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    const pluginSlug = dirent.name;
    const pluginDir = join(pluginsDir, pluginSlug);
    const manifestPath = join(pluginDir, ".claude-plugin", "plugin.json");
    if (!existsSync(manifestPath)) continue;
    validateSlug(pluginSlug, PLUGIN_SLUG, `plugin directory "${pluginSlug}"`);

    const manifest = readJson(manifestPath);
    if (manifest.name !== pluginSlug) {
      throw new Error(`${rel(root, manifestPath)} name "${manifest.name}" must match plugin directory "${pluginSlug}"`);
    }
    validateSlug(manifest.name, PLUGIN_SLUG, `plugin name "${manifest.name}"`);
    if (typeof manifest.version !== "string" || !SEMVER.test(manifest.version)) {
      throw new Error(`${rel(root, manifestPath)} version must be semver; got ${JSON.stringify(manifest.version)}`);
    }
    if (typeof manifest.description !== "string" || !manifest.description.trim()) {
      throw new Error(`${rel(root, manifestPath)} description must be a non-empty string`);
    }

    const pluginCopy = editorial.plugins?.[manifest.name] ?? {};
    const skills = discoverSkills(root, manifest.name, pluginDir, pluginCopy);
    const copy = normalizePluginCopy(manifest, skills, pluginCopy);
    discovered.push({ name: manifest.name, version: manifest.version, skills, copy });
  }

  const editorialOrder = Object.keys(editorial.plugins ?? {});
  const plugins = orderByEditorial(discovered, editorialOrder, (plugin) => plugin.name);
  return {
    plugins,
    counts: {
      plugins: plugins.length,
      skills: plugins.reduce((sum, plugin) => sum + plugin.skills.length, 0),
    },
  };
}

export function renderReadmePlugins(catalog) {
  const lines = [
    `Catalog: ${catalog.counts.plugins} plugins · ${catalog.counts.skills} skills.`,
    "",
    "| Plugin | Version | Skills | What it covers |",
    "|---|---:|---:|---|",
  ];
  for (const plugin of catalog.plugins) {
    lines.push(
      `| [\`${plugin.name}\`](plugins/${plugin.name}/) | ${plugin.version} | ${plugin.skills.length} | ${escapeReadmeCopy(plugin.copy.readme.summary, plugin.copy.readme.summaryTrusted)} |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

export function renderReadmeSkills(catalog) {
  const lines = [`Catalog skills: ${catalog.counts.skills} active skills.`, ""];
  for (const plugin of catalog.plugins) {
    lines.push(`### \`${plugin.name}\``, "");
    appendSkillGroup(lines, "Model-invoked", plugin, false);
    appendSkillGroup(lines, "User-invoked", plugin, true);
  }
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}

export function renderSiteData(catalog) {
  const domains = {};
  const nodes = [];
  let fallbackIndex = 0;

  for (const plugin of catalog.plugins) {
    const site = plugin.copy.site;
    const skillFiles = plugin.skills.map((skill) => [
      `/${plugin.name}:${skill.name}`,
      site.skills[skill.name]?.[0] ?? `plugins/${plugin.name}/skills/${skill.name}/SKILL.md`,
      site.skills[skill.name]?.[1] ?? {
        en: skill.description,
        zh: skill.description,
      },
    ]);
    const files = [...skillFiles, ...site.files];
    const blurb = withCatalogFacts(site.blurb, plugin);
    domains[plugin.name] = {
      layer: site.layer,
      path: `plugins/${plugin.name}/`,
      version: plugin.version,
      skillCount: plugin.skills.length,
      blurb,
      files,
    };

    const graph = site.graph;
    nodes.push({
      id: plugin.name,
      label: plugin.name,
      kind: "plugin",
      x: graph.x ?? 80 + (fallbackIndex % 4) * 190,
      y: graph.y ?? 80 + Math.floor(fallbackIndex / 4) * 150,
      w: graph.w ?? 150,
      ...(graph.link ? { link: graph.link } : {}),
      role: graph.role,
      desc: withCatalogFacts(graph.desc, plugin),
    });
    fallbackIndex += 1;
  }

  return [
    `const CATALOG_COUNTS = ${safeJsJson(catalog.counts)};`,
    `const DOMAINS = ${safeJsJson(domains)};`,
    `const CB_NODES = ${safeJsJson(nodes)};`,
  ].join("\n");
}

export function replaceGeneratedBlock(text, name, body, { script = false } = {}) {
  const open = script ? `// BEGIN GENERATED ${name}` : `<!-- BEGIN GENERATED ${name} -->`;
  const close = script ? `// END GENERATED ${name}` : `<!-- END GENERATED ${name} -->`;
  const start = text.indexOf(open);
  const end = text.indexOf(close);
  if (start === -1 || end === -1) throw new Error(`Missing generated block markers for ${name}`);
  if (text.indexOf(open, start + open.length) !== -1 || text.indexOf(close, end + close.length) !== -1) {
    throw new Error(`Duplicate generated block markers for ${name}`);
  }
  if (end < start) throw new Error(`Reversed generated block markers for ${name}`);
  return `${text.slice(0, start + open.length)}\n${body.replace(/\s*$/, "\n")}${text.slice(end)}`;
}

export function buildPublicCatalog(root) {
  const catalog = buildCatalog(root);
  const readmePath = join(root, "README.md");
  const sitePath = join(root, "docs", "site", "index.html");
  const readme = readFileSync(readmePath, "utf8");
  const site = readFileSync(sitePath, "utf8");
  const nextReadme = replaceGeneratedBlock(
    replaceGeneratedBlock(readme, "catalog-plugins", renderReadmePlugins(catalog)),
    "catalog-skills",
    renderReadmeSkills(catalog),
  );
  const nextSite = replaceGeneratedBlock(site, "catalog-data", renderSiteData(catalog), { script: true });
  writeFileSync(readmePath, nextReadme);
  writeFileSync(sitePath, nextSite);
}

function discoverSkills(root, pluginName, pluginDir, pluginCopy) {
  const skillsDir = join(pluginDir, "skills");
  if (!existsSync(skillsDir)) return [];
  const skillDirs = readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const skills = [];
  for (const skillSlug of skillDirs) {
    validateSlug(skillSlug, SKILL_SLUG, `skill directory "${pluginName}/${skillSlug}"`);
    const skillMd = join(skillsDir, skillSlug, "SKILL.md");
    if (!existsSync(skillMd) || !statSync(skillMd).isFile()) continue;
    const frontmatter = parseSkillFrontmatter(readFileSync(skillMd, "utf8"), rel(root, skillMd));
    if (frontmatter.name !== skillSlug) {
      throw new Error(`${rel(root, skillMd)} name "${frontmatter.name}" must match skill directory "${skillSlug}"`);
    }
    validateSlug(frontmatter.name, SKILL_SLUG, `skill name "${frontmatter.name}"`);
    if (typeof frontmatter.description !== "string" || !frontmatter.description.trim()) {
      throw new Error(`${rel(root, skillMd)} description frontmatter must be a non-empty string`);
    }
    if (
      Object.hasOwn(frontmatter, "disable-model-invocation")
      && typeof frontmatter["disable-model-invocation"] !== "boolean"
    ) {
      throw new Error(`${rel(root, skillMd)} disable-model-invocation frontmatter must be boolean`);
    }
    skills.push({
      name: frontmatter.name,
      description: frontmatter.description,
      explicit: frontmatter["disable-model-invocation"] === true,
    });
  }
  const orderKeys = [
    ...Object.keys(pluginCopy.readme?.skills ?? {}),
    ...Object.keys(pluginCopy.site?.skills ?? {}),
  ];
  return orderByEditorial(skills, orderKeys, (skill) => skill.name);
}

function normalizePluginCopy(manifest, skills, copy) {
  const readmeSkills = copy.readme?.skills ?? {};
  const siteSkills = copy.site?.skills ?? {};
  const normalizedSiteSkills = {};
  for (const skill of skills) {
    normalizedSiteSkills[skill.name] = normalizeSiteSkill(
      siteSkills[skill.name],
      manifest.name,
      skill,
    );
  }
  const blurb = normalizeLocalized(copy.site?.blurb, htmlEscape(manifest.description));
  return {
    readme: {
      summary: copy.readme?.summary ?? manifest.description,
      summaryTrusted: typeof copy.readme?.summary === "string",
      skills: Object.fromEntries(skills.map((skill) => [
        skill.name,
        readmeSkills[skill.name] ?? skill.description,
      ])),
      skillTrusted: Object.fromEntries(skills.map((skill) => [
        skill.name,
        typeof readmeSkills[skill.name] === "string",
      ])),
    },
    site: {
      layer: asString(copy.site?.layer, "foundation"),
      blurb,
      skills: normalizedSiteSkills,
      files: normalizeFiles(copy.site?.files),
      graph: normalizeGraph(copy.site?.graph, blurb),
    },
  };
}

function normalizeSiteSkill(value, pluginName, skill) {
  if (Array.isArray(value) && value.length === 2 && typeof value[0] === "string") {
    return [value[0], normalizeLocalized(value[1], htmlEscape(skill.description))];
  }
  if (value == null) {
    return [
      `plugins/${pluginName}/skills/${skill.name}/SKILL.md`,
      { en: htmlEscape(skill.description), zh: htmlEscape(skill.description) },
    ];
  }
  throw new Error(`docs/catalog-copy.json site.skills.${pluginName}.${skill.name} must be [path,{en,zh}]`);
}

function normalizeFiles(files) {
  if (files == null) return [];
  if (!Array.isArray(files)) throw new Error("docs/catalog-copy.json site.files must be an array");
  return files.map((file, index) => {
    if (!Array.isArray(file) || file.length !== 3 || typeof file[0] !== "string" || typeof file[1] !== "string") {
      throw new Error(`docs/catalog-copy.json site.files[${index}] must be [label,path,{en,zh}]`);
    }
    return [file[0], file[1], normalizeLocalized(file[2], file[1])];
  });
}

function normalizeGraph(graph, fallbackText) {
  const source = graph ?? {};
  return {
    ...(Number.isFinite(source.x) ? { x: source.x } : {}),
    ...(Number.isFinite(source.y) ? { y: source.y } : {}),
    ...(Number.isFinite(source.w) ? { w: source.w } : {}),
    ...(typeof source.link === "string" ? { link: source.link } : {}),
    role: normalizeLocalized(source.role, fallbackText.en),
    desc: normalizeLocalized(source.desc, fallbackText.en),
  };
}

function parseSkillFrontmatter(text, path) {
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(text);
  if (!match) throw new Error(`${path} is missing YAML frontmatter`);
  return parseYamlSubset(match[1], path);
}

function parseYamlSubset(source, path) {
  const result = {};
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (/^\s/.test(line)) throw new Error(`${path}:${i + 1} unsupported indented YAML outside a block scalar`);
    const match = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(line);
    if (!match) throw new Error(`${path}:${i + 1} unsupported YAML syntax`);
    const [, key, rawValue = ""] = match;
    if (Object.hasOwn(result, key)) throw new Error(`${path}:${i + 1} duplicate YAML key "${key}"`);
    if (rawValue === "|" || rawValue === ">") {
      const block = [];
      while (i + 1 < lines.length && (/^(?:\s|$)/.test(lines[i + 1]))) {
        i += 1;
        block.push(lines[i]);
      }
      result[key] = parseBlockScalar(block, rawValue);
      continue;
    }
    result[key] = parseScalar(rawValue.trim(), path, i + 1);
  }
  return result;
}

function parseScalar(raw, path, lineNumber) {
  if (raw === "") return "";
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (raw.startsWith("[") || raw.startsWith("{")) {
    throw new Error(`${path}:${lineNumber} unsupported YAML collection scalar`);
  }
  if (raw.startsWith('"')) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "string") throw new Error("not string");
      return parsed;
    } catch {
      throw new Error(`${path}:${lineNumber} malformed quoted YAML string`);
    }
  }
  if (raw.startsWith("'")) {
    if (!raw.endsWith("'") || raw.length === 1) throw new Error(`${path}:${lineNumber} malformed single-quoted YAML string`);
    return raw.slice(1, -1).replace(/''/g, "'");
  }
  if (/:\s/.test(raw) || /\s#/.test(raw)) {
    throw new Error(`${path}:${lineNumber} unsupported plain YAML scalar; quote it`);
  }
  return raw;
}

function parseBlockScalar(lines, marker) {
  const nonBlank = lines.filter((line) => line.trim());
  const indent = nonBlank.length ? Math.min(...nonBlank.map((line) => line.match(/^ */)[0].length)) : 0;
  const stripped = lines.map((line) => line.slice(Math.min(indent, line.length)));
  if (marker === "|") return stripped.join("\n").replace(/\n+$/, "");
  return stripped.join("\n").split(/\n{2,}/).map((part) => part.replace(/\n/g, " ").trim()).join("\n\n");
}

function loadEditorial(root) {
  const path = join(root, "docs", "catalog-copy.json");
  if (!existsSync(path)) return { plugins: {} };
  const copy = readJson(path);
  if (copy == null || typeof copy !== "object" || Array.isArray(copy)) {
    throw new Error("docs/catalog-copy.json must be an object");
  }
  if (copy.plugins != null && (typeof copy.plugins !== "object" || Array.isArray(copy.plugins))) {
    throw new Error("docs/catalog-copy.json plugins must be an object");
  }
  return { plugins: copy.plugins ?? {} };
}

function orderByEditorial(items, keys, getKey) {
  const byKey = new Map(items.map((item) => [getKey(item), item]));
  const seen = new Set();
  const ordered = [];
  for (const key of keys) {
    if (seen.has(key) || !byKey.has(key)) continue;
    seen.add(key);
    ordered.push(byKey.get(key));
  }
  const rest = items.filter((item) => !seen.has(getKey(item))).sort((a, b) => getKey(a).localeCompare(getKey(b)));
  return [...ordered, ...rest];
}

function appendSkillGroup(lines, title, plugin, explicit) {
  const skills = plugin.skills.filter((skill) => skill.explicit === explicit);
  if (!skills.length) return;
  lines.push(`*${title}:*`, "");
  for (const skill of skills) {
    lines.push(`- \`/${plugin.name}:${skill.name}\` — ${escapeReadmeCopy(plugin.copy.readme.skills[skill.name] ?? skill.description, plugin.copy.readme.skillTrusted[skill.name])}`);
  }
  lines.push("");
}

function withCatalogFacts(text, plugin) {
  return {
    en: `${text.en} (v${plugin.version}; ${plugin.skills.length} skills)`,
    zh: `${text.zh}（v${plugin.version}；${plugin.skills.length} 個 skills）`,
  };
}

function normalizeLocalized(value, fallback) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return {
      en: asString(value.en, fallback),
      zh: asString(value.zh, fallback),
    };
  }
  const text = asString(value, fallback);
  return { en: text, zh: text };
}

function asString(value, fallback) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function safeJsJson(value) {
  return JSON.stringify(value, null, 2)
    .replace(/</g, "\\u003C")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function escapeMarkdownSource(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/([\\`*_{}\[\]()#+\-.!|])/g, "\\$1")
    .replace(/\n/g, " ");
}

function escapeReadmeCopy(value, trustedMarkdown) {
  return trustedMarkdown ? escapeMarkdownTableCell(value) : escapeMarkdownSource(value);
}

function escapeMarkdownTableCell(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function validateSlug(value, pattern, label) {
  if (typeof value !== "string" || !pattern.test(value)) throw new Error(`Invalid ${label}`);
}

function rel(root, path) {
  return path.replace(`${root}/`, "");
}
