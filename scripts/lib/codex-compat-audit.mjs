import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { basename, dirname, join, relative, sep } from "node:path";
import { tmpdir } from "node:os";

const MANIFEST_PATH = join("platforms", "codex", "manifest.json");
const BASELINE_PATH = join("scripts", "fixtures", "codex", "compat-baseline.json");
const CANARY_DIR = join("scripts", "fixtures", "codex", "canaries");
const NEGATIVE_DIR = join("scripts", "fixtures", "codex", "negative");

export function runCodexCompatAudit(root) {
  const manifest = readJson(join(root, MANIFEST_PATH));
  const rules = manifest.denylisted_unresolved_tokens.map(compileRule);
  const scannerRoots = normalizeAndSort(manifest.generated_destinations);
  const generatedFiles = listGeneratedFiles(root, scannerRoots);
  const findings = scanFiles(root, generatedFiles, rules);
  const categories = buildCategorySummary(rules, findings);

  return {
    manifest,
    scannerRoots,
    generatedFiles,
    rules,
    findings,
    categories,
  };
}

export function validateCodexCompatPhase0(root) {
  const errors = [];
  const audit = runCodexCompatAudit(root);
  const baseline = readJson(join(root, BASELINE_PATH));

  validateBaselineMetadata(audit, baseline, errors);
  validateBaselineRatchet(audit, baseline, errors);

  const canaries = validateCanaries(root, audit);
  errors.push(...canaries.errors);

  const negativeTests = validateNegativeFixtures(root);
  errors.push(...negativeTests.errors);

  const frozen = validateFrozenContract(root, audit.manifest);
  errors.push(...frozen.errors);

  return { root, audit, baseline, canaries, negativeTests, frozen, errors };
}

export function formatCodexCompatAudit(result) {
  const lines = [];
  const categories = Object.values(result.audit.categories);

  lines.push("Codex compatibility audit — Phase 0");
  lines.push(`Scanned ${result.audit.generatedFiles.length} generated files`);
  lines.push(`Scanner roots: ${result.audit.scannerRoots.join(", ")}`);
  lines.push("");

  for (const category of categories) {
    const baselineCounts = result.baseline.per_file_max_counts[category.id] || {};
    const movedOrAdded = [];
    for (const [file, count] of Object.entries(category.perFileCounts)) {
      const baselineCount = baselineCounts[file] ?? 0;
      if (count > baselineCount) movedOrAdded.push(`${file} (${count} > ${baselineCount})`);
    }
    const status = movedOrAdded.length ? "FAIL" : "OK";
    lines.push(
      `${category.label}: ${category.count} hit(s) in ${category.files.length} file(s) ${status}`,
    );
    for (const file of category.files) {
      const hits = category.findings.filter((finding) => finding.file === file);
      const refs = hits.map((finding) => `${finding.file}:${finding.line}`).join(", ");
      const baselineCount = baselineCounts[file] ?? 0;
      lines.push(`  ${refs} [baseline ${baselineCount} -> now ${category.perFileCounts[file]}]`);
    }
    if (!category.files.length) lines.push("  none");
    lines.push("");
  }

  lines.push(`Canary fixtures: ${result.canaries.passed}/${result.canaries.total} ok`);
  lines.push(`Negative fixtures: ${result.negativeTests.passed}/${result.negativeTests.total} ok`);
  lines.push(`Frozen contract: ${result.frozen.errors.length ? "FAIL" : "OK"}`);

  if (result.errors.length) {
    lines.push("");
    lines.push("Errors:");
    for (const error of result.errors) lines.push(`- ${error}`);
  }

  return lines.join("\n");
}

function validateBaselineMetadata(audit, baseline, errors) {
  const baselineRoots = normalizeAndSort(baseline.scanner_roots || []);
  const auditRoots = audit.scannerRoots;
  if (!sameMembers(baselineRoots, auditRoots)) {
    errors.push(
      `compat baseline scanner_roots drifted: baseline [${baselineRoots.join(", ")}] vs current [${auditRoots.join(", ")}]`,
    );
  }

  const baselineRules = baseline.rules || [];
  const baselineRuleMap = new Map(baselineRules.map((rule) => [rule.id, rule]));
  const auditRuleIds = audit.rules.map((rule) => rule.id);
  const baselineRuleIds = baselineRules.map((rule) => rule.id);

  for (const id of baselineRuleIds) {
    if (!auditRuleIds.includes(id)) {
      errors.push(`compat baseline rule "${id}" no longer exists in manifest`);
    }
  }
  for (const id of auditRuleIds) {
    if (!baselineRuleIds.includes(id)) {
      errors.push(`compat baseline is missing rule "${id}"`);
    }
  }

  for (const rule of audit.rules) {
    const baselineRule = baselineRuleMap.get(rule.id);
    if (!baselineRule) continue;
    const fingerprint = fingerprintRule(rule);
    if (baselineRule.fingerprint !== fingerprint) {
      errors.push(
        `compat baseline fingerprint mismatch for ${rule.id}: baseline ${baselineRule.fingerprint} vs current ${fingerprint}`,
      );
    }
  }

  const baselineCategories = normalizeAndSort(Object.keys(baseline.per_file_max_counts || {}));
  const auditCategories = normalizeAndSort(audit.rules.map((rule) => rule.id));
  if (!sameMembers(baselineCategories, auditCategories)) {
    for (const id of baselineCategories) {
      if (!auditCategories.includes(id)) {
        errors.push(`compat baseline has extra category "${id}" in per_file_max_counts`);
      }
    }
    for (const id of auditCategories) {
      if (!baselineCategories.includes(id)) {
        errors.push(`compat baseline is missing category "${id}" in per_file_max_counts`);
      }
    }
  }
}

function validateBaselineRatchet(audit, baseline, errors) {
  const perFileMaxCounts = baseline.per_file_max_counts || {};
  for (const category of Object.values(audit.categories)) {
    const baselineCounts = perFileMaxCounts[category.id];
    if (!baselineCounts) continue;

    for (const [file, count] of Object.entries(category.perFileCounts)) {
      const max = baselineCounts[file] ?? 0;
      if (count > max) {
        errors.push(
          `compat ratchet exceeded for ${category.label} in ${file}: ${count} > baseline ${max}`,
        );
      }
    }
  }
}

function validateCanaries(root, audit) {
  const results = [];
  for (const fixtureFile of listFixtureJsonFiles(root, CANARY_DIR)) {
    const fixture = readJson(fixtureFile);
    const errors = fixture.mode === "synthetic"
      ? validateSyntheticCanary(audit.rules, fixture)
      : validateGeneratedCanary(audit, fixture);
    results.push({ id: fixture.id || basename(fixtureFile), errors });
  }

  return summarizeFixtureResults("canary", results);
}

function validateGeneratedCanary(audit, fixture) {
  const errors = [];
  const fileFindings = audit.findings.filter((finding) => finding.file === fixture.file);
  for (const expected of fixture.expect || []) {
    const matches = fileFindings.filter(
      (finding) =>
        finding.category === expected.category &&
        finding.snippet.includes(expected.contains),
    );
    if (!matches.length) {
      errors.push(
        `generated canary ${fixture.id} is missing ${expected.category} containing "${expected.contains}" in ${fixture.file}`,
      );
    }
  }
  return errors;
}

function validateSyntheticCanary(rules, fixture) {
  const errors = [];
  const file = fixture.file || `synthetic/${fixture.id}.md`;
  const findings = scanContent(file, fixture.content || "", rules);

  for (const expected of fixture.expect || []) {
    const matches = findings.filter(
      (finding) =>
        finding.category === expected.category &&
        finding.snippet.includes(expected.contains),
    );
    if (!matches.length) {
      errors.push(
        `synthetic canary ${fixture.id} is missing ${expected.category} containing "${expected.contains}"`,
      );
    }
  }

  for (const rejected of fixture.reject || []) {
    const matches = findings.filter((finding) => finding.category === rejected.category);
    if (matches.length) {
      errors.push(
        `synthetic canary ${fixture.id} unexpectedly matched ${rejected.category}`,
      );
    }
  }

  if (typeof fixture.expected_total === "number" && findings.length !== fixture.expected_total) {
    errors.push(
      `synthetic canary ${fixture.id} expected ${fixture.expected_total} finding(s), got ${findings.length}`,
    );
  }

  return errors;
}

function validateNegativeFixtures(root) {
  const results = [];
  for (const fixtureFile of listFixtureJsonFiles(root, NEGATIVE_DIR)) {
    const fixture = readJson(fixtureFile);
    const errors = runNegativeFixture(fixture);
    results.push({ id: fixture.id || basename(fixtureFile), errors });
  }
  return summarizeFixtureResults("negative", results);
}

function runNegativeFixture(fixture) {
  const produced = buildNegativeFixtureErrors(fixture);
  const errors = [];
  for (const expected of fixture.expect_errors || []) {
    if (!produced.some((message) => message.includes(expected))) {
      errors.push(`negative fixture ${fixture.id} expected error containing "${expected}"`);
    }
  }
  if (fixture.expect_only === true && produced.length !== (fixture.expect_errors || []).length) {
    errors.push(
      `negative fixture ${fixture.id} produced ${produced.length} error(s), expected ${(fixture.expect_errors || []).length}`,
    );
  }
  return errors;
}

function buildNegativeFixtureErrors(fixture) {
  const errors = [];

  if (fixture.scenario === "ratchet") {
    validateBaselineRatchet(
      {
        categories: fixture.audit_categories,
      },
      {
        per_file_max_counts: fixture.per_file_max_counts,
      },
      errors,
    );
    return errors;
  }

  if (fixture.scenario === "baseline_metadata") {
    validateBaselineMetadata(
      {
        scannerRoots: fixture.scanner_roots,
        rules: (fixture.rules || []).map(compileRule),
      },
      fixture.baseline,
      errors,
    );
    return errors;
  }

  if (fixture.scenario === "write_set") {
    validateBuildDiff(
      fixture.changed_files || [],
      fixture.generated_destinations || [],
      fixture.frozen_contract_paths || [],
      errors,
    );
    return errors;
  }

  if (fixture.scenario === "git_frozen_paths") {
    const result = validateGitFrozenFixture(fixture);
    errors.push(...result.errors);
    return errors;
  }

  errors.push(`unknown negative fixture scenario: ${fixture.scenario}`);
  return errors;
}

function validateFrozenContract(root, manifest) {
  const errors = [];
  const worktree = validateFrozenWorktree(root, manifest.frozen_contract_paths);
  errors.push(...worktree.errors);

  const tempRoot = mkdtempSync(join(tmpdir(), "skills-codex-frozen-"));
  try {
    cpSync(root, tempRoot, {
      recursive: true,
      filter: (source) => shouldCopyIntoTempRoot(root, source),
    });

    const before = snapshotAllFiles(tempRoot);
    const build = spawnSync(process.execPath, ["scripts/build-codex.mjs"], {
      cwd: tempRoot,
      encoding: "utf8",
    });

    if (build.status !== 0) {
      errors.push(
        `compat temp build failed with exit ${build.status ?? "unknown"}: ${summarizeCommandOutput(build.stderr || build.stdout)}`,
      );
      return { errors };
    }

    const after = snapshotAllFiles(tempRoot);
    const changedFiles = diffSnapshots(before, after);
    validateBuildDiff(
      changedFiles,
      manifest.generated_destinations,
      manifest.frozen_contract_paths,
      errors,
    );
    return { errors, changedFiles, worktree };
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function validateFrozenWorktree(root, frozenContractPaths) {
  const errors = [];
  const frozenPaths = normalizeAndSort(frozenContractPaths);
  if (frozenPaths.length === 0) return { errors, staged: [], unstaged: [], untracked: [] };

  const unstaged = listGitPaths(root, ["diff", "--name-only", "--", ...frozenPaths], {
    context: "tracked unstaged changes under frozen_contract_paths",
    errors,
  });
  for (const file of unstaged) {
    errors.push(`frozen Claude contract has tracked unstaged changes: ${file}`);
  }

  const staged = listGitPaths(root, ["diff", "--cached", "--name-only", "--", ...frozenPaths], {
    context: "staged changes under frozen_contract_paths",
    errors,
  });
  for (const file of staged) {
    errors.push(`frozen Claude contract has staged changes: ${file}`);
  }

  const untracked = listGitPaths(
    root,
    ["ls-files", "--others", "--exclude-standard", "--", ...frozenPaths],
    {
      context: "untracked files under frozen_contract_paths",
      errors,
    },
  );
  for (const file of untracked) {
    errors.push(`frozen Claude contract has untracked files: ${file}`);
  }

  return { errors, staged, unstaged, untracked };
}

function validateBuildDiff(changedFiles, generatedDestinations, frozenContractPaths, errors) {
  const normalizedGenerated = normalizeAndSort(generatedDestinations);
  const normalizedFrozen = normalizeAndSort(frozenContractPaths);

  for (const file of normalizeAndSort(changedFiles)) {
    if (matchesAnyRoot(file, normalizedFrozen)) {
      errors.push(`frozen Claude contract changed during temp build: ${file}`);
    }
    if (!matchesAnyRoot(file, normalizedGenerated)) {
      errors.push(`temp build wrote outside generated_destinations: ${file}`);
    }
  }
}

function summarizeFixtureResults(label, results) {
  const errors = [];
  let passed = 0;
  for (const result of results) {
    if (result.errors.length === 0) {
      passed += 1;
      continue;
    }
    for (const error of result.errors) errors.push(`${label} ${result.id}: ${error}`);
  }
  return { total: results.length, passed, errors };
}

function scanFiles(root, files, rules) {
  const findings = [];
  for (const file of files) {
    const content = readFileSync(join(root, file), "utf8");
    findings.push(...scanContent(file, content, rules));
  }
  return findings;
}

function scanContent(file, content, rules) {
  const lines = content.split("\n");
  const findings = [];
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    for (const rule of rules) {
      findings.push(...matchRule(rule, file, index + 1, line));
    }
  }
  return findings;
}

function listGeneratedFiles(root, destinations) {
  const files = [];
  for (const destination of destinations) {
    const fullPath = join(root, destination);
    if (!existsSync(fullPath)) continue;
    if (statSync(fullPath).isDirectory()) {
      for (const child of walkFiles(fullPath)) files.push(normalizePath(relative(root, child)));
    } else {
      files.push(destination);
    }
  }
  return normalizeAndSort(files);
}

function buildCategorySummary(rules, findings) {
  const summary = Object.fromEntries(
    rules.map((rule) => [
      rule.id,
      { id: rule.id, label: rule.label, count: 0, files: [], findings: [], perFileCounts: {} },
    ]),
  );

  for (const finding of findings) {
    const category = summary[finding.category];
    category.count += 1;
    category.findings.push(finding);
    category.perFileCounts[finding.file] = (category.perFileCounts[finding.file] || 0) + 1;
  }

  for (const category of Object.values(summary)) {
    category.files = normalizeAndSort(Object.keys(category.perFileCounts));
  }

  return summary;
}

function compileRule(rule) {
  if (rule.kind === "literal") return rule;
  return {
    ...rule,
    regex: new RegExp(rule.pattern, rule.flags || "g"),
  };
}

function fingerprintRule(rule) {
  const payload = JSON.stringify({
    id: rule.id,
    kind: rule.kind,
    pattern: rule.pattern,
    flags: rule.flags || "",
  });
  return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}

function matchRule(rule, file, line, text) {
  if (rule.kind === "literal") return matchLiteral(rule, file, line, text);
  return matchRegex(rule, file, line, text);
}

function matchLiteral(rule, file, line, text) {
  const findings = [];
  let start = 0;
  while (true) {
    const index = text.indexOf(rule.pattern, start);
    if (index === -1) break;
    findings.push(makeFinding(rule, file, line, text, index, index + rule.pattern.length));
    start = index + rule.pattern.length;
  }
  return findings;
}

function matchRegex(rule, file, line, text) {
  const findings = [];
  const regex = new RegExp(rule.regex.source, rule.regex.flags);
  let match;
  while ((match = regex.exec(text)) !== null) {
    findings.push(makeFinding(rule, file, line, text, match.index, match.index + match[0].length));
    if (match[0].length === 0) regex.lastIndex += 1;
  }
  return findings;
}

function makeFinding(rule, file, line, text, start, end) {
  return {
    category: rule.id,
    label: rule.label,
    file: normalizePath(file),
    line,
    snippet: text.slice(Math.max(0, start - 40), Math.min(text.length, end + 80)).trim(),
  };
}

function snapshotAllFiles(root) {
  const files = new Map();
  for (const file of walkFiles(root)) {
    files.set(normalizePath(relative(root, file)), readFileSync(file));
  }
  return files;
}

function diffSnapshots(before, after) {
  const changed = [];
  const paths = new Set([...before.keys(), ...after.keys()]);
  for (const file of paths) {
    if (!before.has(file) || !after.has(file)) {
      changed.push(file);
      continue;
    }
    if (!before.get(file).equals(after.get(file))) changed.push(file);
  }
  return normalizeAndSort(changed);
}

function validateGitFrozenFixture(fixture) {
  const errors = [];
  const tempRoot = mkdtempSync(join(tmpdir(), "skills-codex-git-frozen-"));

  try {
    writeFixtureRepo(tempRoot, fixture.files || {});
    runGit(tempRoot, ["init"], "fixture repo init", errors);
    runGit(tempRoot, ["config", "user.name", "Codex Compat Fixture"], "fixture repo config user.name", errors);
    runGit(
      tempRoot,
      ["config", "user.email", "codex-compat-fixture@example.com"],
      "fixture repo config user.email",
      errors,
    );
    runGit(tempRoot, ["add", "."], "fixture repo initial add", errors);
    runGit(tempRoot, ["commit", "-m", "fixture baseline"], "fixture repo initial commit", errors);
    if (errors.length) return { errors };

    for (const op of fixture.operations || []) {
      try {
        applyFixtureOperation(tempRoot, op, errors);
      } catch (error) {
        errors.push(`compat frozen git fixture operation failed: ${error.message}`);
      }
    }

    const result = validateFrozenWorktree(tempRoot, fixture.frozen_contract_paths || []);
    errors.push(...result.errors);

    for (const expected of fixture.expect_errors || []) {
      if (!result.errors.some((message) => message.includes(expected))) {
        errors.push(`git frozen fixture ${fixture.id} expected error containing "${expected}"`);
      }
    }

    if (fixture.expect_only === true && result.errors.length !== (fixture.expect_errors || []).length) {
      errors.push(
        `git frozen fixture ${fixture.id} produced ${result.errors.length} error(s), expected ${(fixture.expect_errors || []).length}`,
      );
    }

    return { errors, result };
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function writeFixtureRepo(root, files) {
  for (const [file, content] of Object.entries(files)) {
    const target = join(root, normalizePath(file));
    writeTextFile(target, content);
  }
}

function applyFixtureOperation(root, operation, errors) {
  const target = join(root, normalizePath(operation.path));
  if (operation.kind === "append") {
    writeTextFile(target, `${readExistingText(target)}${operation.content || ""}`);
    return;
  }
  if (operation.kind === "write") {
    writeTextFile(target, operation.content || "");
    return;
  }
  if (operation.kind === "git_add") {
    runGit(root, ["add", "--", normalizePath(operation.path)], `fixture git add ${operation.path}`, errors);
    return;
  }
  throw new Error(`unknown git frozen fixture operation: ${operation.kind}`);
}

function shouldCopyIntoTempRoot(root, source) {
  const relPath = relative(root, source);
  if (!relPath || relPath === "") return true;
  const normalized = normalizePath(relPath);
  if (normalized === ".git" || normalized.startsWith(`.git/`)) return false;
  if (normalized === "node_modules" || normalized.startsWith("node_modules/")) return false;
  return true;
}

function matchesAnyRoot(file, roots) {
  return roots.some((root) => file === root || file.startsWith(`${root}/`));
}

function listFixtureJsonFiles(root, dir) {
  const fullDir = join(root, dir);
  if (!existsSync(fullDir)) return [];
  return readdirSync(fullDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => join(fullDir, file));
}

function normalizeAndSort(values) {
  return [...new Set(values.map((value) => normalizePath(value)))].sort();
}

function normalizePath(value) {
  return value.split(sep).join("/");
}

function sameMembers(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function summarizeCommandOutput(output) {
  return (output || "")
    .trim()
    .split("\n")
    .slice(0, 4)
    .join(" | ") || "no stderr/stdout";
}

function summarizeSpawnFailure(result) {
  if (result.error) return result.error.message;
  return summarizeCommandOutput(result.stderr || result.stdout);
}

function listGitPaths(root, args, { context, errors }) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
  });

  if (result.error || result.status !== 0) {
    errors.push(
      `compat frozen git gate failed while checking ${context}: ${summarizeSpawnFailure(result)}`,
    );
    return [];
  }

  return normalizeAndSort(
    (result.stdout || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  );
}

function runGit(root, args, context, errors) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
  });
  if (result.error || result.status !== 0) {
    errors.push(
      `compat frozen git fixture failed during ${context}: ${summarizeSpawnFailure(result)}`,
    );
  }
  return result;
}

function writeTextFile(file, content) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content, "utf8");
}

function readExistingText(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

function* walkFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(path);
    } else {
      yield path;
    }
  }
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}
