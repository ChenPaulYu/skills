#!/usr/bin/env node
/**
 * scan-repo.mjs — mechanical layer of the atlas export: magnitudes + import edges.
 *
 * The model never authors these numbers (export-protocol.md § Mechanical). One heuristic,
 * two dialects: a **module** is the first path segment under the given root (a source file or
 * a directory); an **edge** is an import whose target resolves to another module in that root.
 *   · python  — `from pkg.x import y` · `from .x import y` · `import pkg.x`
 *   · js      — `from '@scope/x'` (monorepo package) · `from './x'` · `require('…')`
 * Language is auto-detected from which extensions dominate; override with --lang.
 *
 * Usage: node scan-repo.mjs <sourceRoot> <rootDirRelativeToSourceRoot> [--lang python|js]
 *   python single package:  node scan-repo.mjs studies/mem0/source mem0
 *   js monorepo:            node scan-repo.mjs studies/strudel/source packages
 * Prints JSON: { package, lang, modules: {name: {lines, files}}, imports: [[from, to]] }
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, resolve } from "node:path";

const argv = process.argv.slice(2);
const langFlag = (argv.find((a) => a.startsWith("--lang=")) || "").split("=")[1];
const [sourceRoot, pkgRel] = argv.filter((a) => !a.startsWith("--"));
if (!sourceRoot || !pkgRel) {
  console.error("usage: node scan-repo.mjs <sourceRoot> <rootDir> [--lang=python|js]");
  process.exit(2);
}
const pkgDir = join(sourceRoot, pkgRel);
const pkgName = pkgRel.split("/").pop();

const EXT = { python: [".py"], js: [".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx"] };
const SKIP_DIRS = new Set(["__pycache__", "node_modules", "dist", "build", "coverage", "vendor", ".git"]);
// Test files import freely across module lines; counting those as production edges teaches a
// false lesson (real case: strudel core→mini came only from core/test/controls.test.mjs).
const isTest = (p) =>
  /(^|\/)(test|tests|__tests__|spec)(\/|$)/.test(p) || /\.(test|spec)\.[^.]+$/.test(p);

// ---------- collect files ----------
function collect(exts) {
  const out = [];
  (function walk(dir) {
    let entries;
    try { entries = readdirSync(dir); } catch { return; }
    for (const entry of entries) {
      if (entry.startsWith(".") || SKIP_DIRS.has(entry)) continue;
      const full = join(dir, entry);
      let st;
      try { st = statSync(full); } catch { continue; }
      if (st.isDirectory()) walk(full);
      else if (exts.some((e) => entry.endsWith(e))) out.push(full);
    }
  })(pkgDir);
  return out;
}

const lang = langFlag || (collect(EXT.python).length >= collect(EXT.js).length ? "python" : "js");
const files = collect(EXT[lang]);
if (!files.length) {
  console.error(`no ${lang} files under ${pkgDir}`);
  process.exit(1);
}

const stripExt = (name) => name.replace(/\.(py|mjs|cjs|jsx|tsx|ts|js)$/, "");
const moduleOf = (relPath) => stripExt(relPath.split("/")[0]);
const modules = {};
const importPairs = new Set();

function moduleExists(name) {
  const candidates = [join(pkgDir, name), ...EXT[lang].map((e) => join(pkgDir, name + e))];
  return candidates.some((c) => { try { statSync(c); return true; } catch { return false; } });
}

// ---------- per-language import extraction ----------
function pythonTargets(line, mod) {
  let m = line.match(new RegExp(`^\\s*from\\s+${pkgName}\\.([\\w.]+)\\s+import`));
  if (m) return m[1].split(".")[0];
  m = line.match(/^\s*from\s+\.([\w.]*)\s*import/);
  if (m && m[1]) return m[1].split(".")[0];
  m = line.match(new RegExp(`^\\s*import\\s+${pkgName}\\.([\\w.]+)`));
  if (m) return m[1].split(".")[0];
  return null;
}

// JS: a specifier is either a workspace package ('@scope/name' / 'name') or a relative path.
function jsTargets(line, mod, file) {
  const specs = [];
  const from = line.match(/\bfrom\s+['"]([^'"]+)['"]/);
  if (from) specs.push(from[1]);
  const bare = line.match(/^\s*import\s+['"]([^'"]+)['"]/);
  if (bare) specs.push(bare[1]);
  const req = line.match(/\brequire\(\s*['"]([^'"]+)['"]\s*\)/);
  if (req) specs.push(req[1]);
  const dyn = line.match(/\bimport\(\s*['"]([^'"]+)['"]\s*\)/);
  if (dyn) specs.push(dyn[1]);

  for (const spec of specs) {
    if (spec.startsWith(".")) {
      // relative: resolve against the importing file, then take the first segment under root
      const abs = resolve(dirname(file), spec);
      const rel = relative(resolve(pkgDir), abs);
      if (rel.startsWith("..")) continue; // leaves the scanned root
      const seg = stripExt(rel.split("/")[0]);
      if (seg && seg !== mod) return seg;
      continue;
    }
    // scoped workspace package: '@strudel/core' → 'core'; plain 'core' also accepted
    const scoped = spec.match(/^@[^/]+\/([^/]+)/);
    const name = scoped ? scoped[1] : spec.split("/")[0];
    if (name && name !== mod && moduleExists(name)) return name;
  }
  return null;
}

for (const file of files) {
  const rel = relative(pkgDir, file);
  const mod = moduleOf(rel);
  const text = readFileSync(file, "utf8");
  modules[mod] = modules[mod] || { lines: 0, files: 0 };
  modules[mod].lines += text.split("\n").length;
  modules[mod].files += 1;

  if (isTest(rel)) continue; // magnitudes include tests; import edges must not
  for (const line of text.split("\n")) {
    const target = lang === "python" ? pythonTargets(line, mod) : jsTargets(line, mod, file);
    if (target && target !== mod && moduleExists(target)) importPairs.add(`${mod}>${target}`);
  }
}

const imports = [...importPairs]
  .map((pair) => pair.split(">"))
  .filter(([from, to]) => modules[from] && modules[to]);

console.log(JSON.stringify({ package: pkgName, lang, modules, imports }, null, 2));
