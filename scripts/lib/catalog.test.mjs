import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import {
  buildCatalog,
  buildPublicCatalog,
  renderReadmePlugins,
  renderReadmeSkills,
  renderSiteData,
  replaceGeneratedBlock,
} from "./catalog.mjs";

function withRoot(fn) {
  const root = mkdtempSync(join(tmpdir(), "skills-catalog-test-"));
  try {
    return fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function writeJson(root, path, value) {
  write(root, path, `${JSON.stringify(value, null, 2)}\n`);
}

function write(root, path, content) {
  const full = join(root, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
}

function plugin(root, name, { version = "1.0.0", description = `${name} plugin` } = {}) {
  writeJson(root, `plugins/${name}/.claude-plugin/plugin.json`, {
    name,
    version,
    description,
    author: { name: "Test" },
  });
}

function skill(root, pluginName, name, frontmatter = {}) {
  const description = frontmatter.description ?? `${name} skill`;
  const lines = ["---", `name: ${JSON.stringify(frontmatter.name ?? name)}`];
  if (frontmatter.rawDescription != null) lines.push(`description: ${frontmatter.rawDescription}`);
  else lines.push(`description: ${JSON.stringify(description)}`);
  if (frontmatter.explicit) lines.push("disable-model-invocation: true");
  if (frontmatter.extra) lines.push(frontmatter.extra);
  lines.push("---", "", `# ${name}`);
  write(root, `plugins/${pluginName}/skills/${name}/SKILL.md`, `${lines.join("\n")}\n`);
}

test("buildCatalog counts active manifests and skills, with versions and explicit toggles", () => withRoot((root) => {
  mkdirSync(join(root, "plugins", "retired-empty"), { recursive: true });
  plugin(root, "nav", { version: "1.2.3", description: "Navigation tools" });
  skill(root, "nav", "audit");
  skill(root, "nav", "plan", { explicit: true });

  const catalog = buildCatalog(root);
  assert.deepEqual(catalog.counts, { plugins: 1, skills: 2 });
  assert.equal(catalog.plugins[0].name, "nav");
  assert.equal(catalog.plugins[0].version, "1.2.3");
  assert.deepEqual(catalog.plugins[0].skills.map((item) => [item.name, item.explicit]), [
    ["audit", false],
    ["plan", true],
  ]);
}));

test("editorial copy orders matching plugins and skills, stale copy cannot create entries", () => withRoot((root) => {
  plugin(root, "zeta");
  skill(root, "zeta", "later");
  skill(root, "zeta", "first");
  plugin(root, "alpha");
  skill(root, "alpha", "only");
  writeJson(root, "docs/catalog-copy.json", {
    plugins: {
      stale: { readme: { summary: "nope" } },
      zeta: {
        readme: { summary: "Zed", skills: { ghost: "nope", first: "First copy" } },
        site: { layer: "state" },
      },
    },
  });

  const catalog = buildCatalog(root);
  assert.deepEqual(catalog.plugins.map((item) => item.name), ["zeta", "alpha"]);
  assert.deepEqual(catalog.plugins[0].skills.map((item) => item.name), ["first", "later"]);
  assert.equal(catalog.plugins[0].copy.readme.skills.first, "First copy");
  assert.equal(catalog.plugins[0].copy.readme.skills.later, "later skill");
  assert.equal(catalog.plugins.some((item) => item.name === "stale"), false);
}));

test("catalog follows active additions, renames, and removals from source", () => withRoot((root) => {
  plugin(root, "shape");
  skill(root, "shape", "old");
  assert.deepEqual(buildCatalog(root).plugins[0].skills.map((item) => item.name), ["old"]);

  rmSync(join(root, "plugins", "shape", "skills", "old"), { recursive: true, force: true });
  skill(root, "shape", "new");
  skill(root, "shape", "later");
  assert.deepEqual(buildCatalog(root).plugins[0].skills.map((item) => item.name), ["later", "new"]);

  rmSync(join(root, "plugins", "shape", "skills", "later"), { recursive: true, force: true });
  assert.deepEqual(buildCatalog(root).plugins[0].skills.map((item) => item.name), ["new"]);
}));

test("frontmatter name mismatch catches bad renames", () => withRoot((root) => {
  plugin(root, "shape");
  skill(root, "shape", "actual", { name: "stale" });
  assert.throws(() => buildCatalog(root), /must match skill directory/);
}));

test("frontmatter supports quoted, plain, folded, and literal descriptions", () => withRoot((root) => {
  plugin(root, "shape");
  skill(root, "shape", "quoted", { description: "Quoted: okay" });
  skill(root, "shape", "plain", { rawDescription: "plain-description" });
  skill(root, "shape", "folded", { rawDescription: ">\n  folded\n  description" });
  skill(root, "shape", "literal", { rawDescription: "|\n  literal\n  description" });

  const descriptions = Object.fromEntries(buildCatalog(root).plugins[0].skills.map((item) => [item.name, item.description]));
  assert.equal(descriptions.quoted, "Quoted: okay");
  assert.equal(descriptions.plain, "plain-description");
  assert.equal(descriptions.folded, "folded description");
  assert.equal(descriptions.literal, "literal\ndescription");
}));

test("malformed source metadata fails clearly", () => withRoot((root) => {
  plugin(root, "bad", { version: "not-semver" });
  skill(root, "bad", "one");
  assert.throws(() => buildCatalog(root), /version must be semver/);
}));

test("malformed YAML descriptions fail instead of being guessed", () => withRoot((root) => {
  plugin(root, "bad");
  skill(root, "bad", "one", { rawDescription: "[not, supported]" });
  assert.throws(() => buildCatalog(root), /unsupported YAML collection scalar/);
}));

test("non-string description and non-boolean disable-model-invocation are rejected", () => withRoot((root) => {
  plugin(root, "bad");
  skill(root, "bad", "one", { rawDescription: "true" });
  assert.throws(() => buildCatalog(root), /description frontmatter must be a non-empty string/);

  rmSync(join(root, "plugins", "bad", "skills", "one"), { recursive: true, force: true });
  skill(root, "bad", "two", { extra: "disable-model-invocation: sometimes" });
  assert.throws(() => buildCatalog(root), /disable-model-invocation frontmatter must be boolean/);
}));

test("renderers escape markdown and script-breaking characters", () => withRoot((root) => {
  plugin(root, "nav", { description: "Pipe | backtick ` and <tag> plus [link](x) *em*" });
  skill(root, "nav", "audit", { description: "Use <script> and [unsafe](x) *text* safely" });
  writeJson(root, "docs/catalog-copy.json", {
    plugins: {
      nav: {
        readme: {
          summary: "Trusted `code` | still table-safe",
          skills: {
            audit: "Trusted `inline code` | still table-safe",
          },
        },
        site: {
          blurb: { en: `Line separator ${String.fromCharCode(0x2028)} safely`, zh: "安全" },
        },
      },
    },
  });
  const catalog = buildCatalog(root);

  assert.match(renderReadmePlugins(catalog), /Trusted `code` \\| still table-safe/);
  assert.match(renderReadmeSkills(catalog), /Trusted `inline code` \\| still table-safe/);
  const siteData = renderSiteData(catalog);
  assert.equal(siteData.includes("<script>"), false);
  assert.match(siteData, /\\u2028/);
}));

test("source fallback README markdown is escaped more strongly than trusted editorial markdown", () => withRoot((root) => {
  plugin(root, "nav", { description: "Pipe | backtick ` and <tag> plus [link](x) *em*" });
  skill(root, "nav", "audit", { description: "Use <script> and [unsafe](x) *text*" });
  const catalog = buildCatalog(root);

  assert.ok(renderReadmePlugins(catalog).includes("Pipe \\| backtick \\` and &lt;tag&gt; plus \\[link\\]\\(x\\) \\*em\\*"));
  assert.ok(renderReadmeSkills(catalog).includes("Use &lt;script&gt; and \\[unsafe\\]\\(x\\) \\*text\\*"));
}));

test("source fallback site copy is HTML-escaped before innerHTML rendering", () => withRoot((root) => {
  plugin(root, "nav", { description: "<img src=x onerror=alert(1)> plugin" });
  skill(root, "nav", "audit", { description: "<img src=x onerror=alert(1)> skill" });
  const data = renderSiteData(buildCatalog(root));

  assert.equal(data.includes("<img"), false);
  assert.match(data, /&lt;img src=x onerror=alert\(1\)&gt; plugin/);
  assert.match(data, /&lt;img src=x onerror=alert\(1\)&gt; skill/);
}));

test("partial editorial site skill locales escape source fallbacks", () => withRoot((root) => {
  plugin(root, "nav");
  skill(root, "nav", "audit", { description: "<img src=x onerror=alert(1)> skill" });
  writeJson(root, "docs/catalog-copy.json", {
    plugins: {
      nav: {
        site: {
          skills: {
            audit: ["custom/path.md", { en: "Trusted <em>English</em>" }],
          },
        },
      },
    },
  });
  const data = renderSiteData(buildCatalog(root));

  assert.match(data, /\\u003Cem>English\\u003C\/em>/);
  assert.match(data, /&lt;img src=x onerror=alert\(1\)&gt; skill/);
  assert.equal(data.includes("<img"), false);
}));

test("trusted editorial site HTML is preserved as runtime markup", () => withRoot((root) => {
  plugin(root, "nav", { description: "safe fallback" });
  skill(root, "nav", "audit");
  writeJson(root, "docs/catalog-copy.json", {
    plugins: {
      nav: {
        site: {
          blurb: { en: "<strong>Trusted</strong>", zh: "<strong>可信</strong>" },
        },
      },
    },
  });
  const data = renderSiteData(buildCatalog(root));

  assert.equal(data.includes("&lt;strong"), false);
  assert.match(data, /\\u003Cstrong>Trusted\\u003C\/strong>/);
}));

test("renderSiteData includes active skill triples and non-skill editorial files without counting them", () => withRoot((root) => {
  plugin(root, "shape", { version: "2.0.0", description: "Shape" });
  skill(root, "shape", "mockup");
  writeJson(root, "docs/catalog-copy.json", {
    plugins: {
      shape: {
        site: {
          blurb: { en: "Shape EN", zh: "Shape ZH" },
          files: [["CLAUDE", "plugins/shape/CLAUDE.md", { en: "Rules", zh: "規則" }]],
          graph: { x: 10, y: 20, w: 30, role: { en: "Role", zh: "角色" }, desc: { en: "Desc", zh: "描述" } },
        },
      },
    },
  });
  const catalog = buildCatalog(root);
  const data = renderSiteData(catalog);
  assert.deepEqual(catalog.counts, { plugins: 1, skills: 1 });
  assert.match(data, /"skillCount": 1/);
  assert.match(data, /"\/shape:mockup"/);
  assert.match(data, /"CLAUDE"/);
  assert.ok(data.includes('"Shape EN (v2.0.0; 1 skills)"'));
  assert.ok(data.includes('"Shape ZH（v2.0.0；1 個 skills）"'));
}));

test("replaceGeneratedBlock replaces exact unique marker pairs and preserves surroundings", () => {
  const text = "before\n<!-- BEGIN GENERATED catalog-plugins -->\nold\n<!-- END GENERATED catalog-plugins -->\nafter\n";
  assert.equal(
    replaceGeneratedBlock(text, "catalog-plugins", "new\n"),
    "before\n<!-- BEGIN GENERATED catalog-plugins -->\nnew\n<!-- END GENERATED catalog-plugins -->\nafter\n",
  );
  assert.throws(() => replaceGeneratedBlock("no markers", "x", "body"), /Missing/);
  assert.throws(
    () => replaceGeneratedBlock("<!-- END GENERATED x -->\n<!-- BEGIN GENERATED x -->", "x", "body"),
    /Reversed/,
  );
  assert.throws(
    () => replaceGeneratedBlock("<!-- BEGIN GENERATED x --><!-- BEGIN GENERATED x --><!-- END GENERATED x -->", "x", "body"),
    /Duplicate/,
  );
});

test("script marker replacement uses JavaScript comment markers", () => {
  assert.equal(
    replaceGeneratedBlock("// BEGIN GENERATED catalog-data\nold\n// END GENERATED catalog-data\n", "catalog-data", "const x = 1;", { script: true }),
    "// BEGIN GENERATED catalog-data\nconst x = 1;\n// END GENERATED catalog-data\n",
  );
});

test("buildPublicCatalog computes both replacements before writing either", () => withRoot((root) => {
  plugin(root, "nav");
  skill(root, "nav", "audit");
  write(root, "README.md", "top\n<!-- BEGIN GENERATED catalog-plugins -->\nold\n<!-- END GENERATED catalog-plugins -->\nmid\n<!-- BEGIN GENERATED catalog-skills -->\nold\n<!-- END GENERATED catalog-skills -->\n");
  write(root, "docs/site/index.html", "missing site marker\n");
  assert.throws(() => buildPublicCatalog(root), /Missing generated block markers/);
  assert.match(readFileSync(join(root, "README.md"), "utf8"), /old/);
}));

test("catalog rendering is deterministic", () => withRoot((root) => {
  plugin(root, "b");
  skill(root, "b", "two");
  plugin(root, "a");
  skill(root, "a", "one");
  const first = renderReadmePlugins(buildCatalog(root)) + renderReadmeSkills(buildCatalog(root)) + renderSiteData(buildCatalog(root));
  const second = renderReadmePlugins(buildCatalog(root)) + renderReadmeSkills(buildCatalog(root)) + renderSiteData(buildCatalog(root));
  assert.equal(first, second);
}));
