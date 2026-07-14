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
const HOOK_SMOKE_DIR = join("scripts", "fixtures", "codex", "hook-smokes");
const PRESERVATION_SMOKE_DIR = join("scripts", "fixtures", "codex", "preservation-smokes");
const SESSION_START_HOOK_COMMAND = "node .codex/hooks/relay-digest-session-start.mjs";
const GIT_LOCAL_ENV_VARS = [
  "GIT_ALTERNATE_OBJECT_DIRECTORIES",
  "GIT_CONFIG",
  "GIT_CONFIG_COUNT",
  "GIT_CONFIG_PARAMETERS",
  "GIT_DIR",
  "GIT_INDEX_FILE",
  "GIT_OBJECT_DIRECTORY",
  "GIT_PREFIX",
  "GIT_SHALLOW_FILE",
  "GIT_WORK_TREE",
  "GIT_COMMON_DIR",
];

/**
 * Scans arbitrary already-compiled text (not necessarily on disk yet) against the manifest's
 * denylisted-token rule list — the single owner of that list stays `platforms/codex/manifest.json`;
 * this is the shared entry point so `scripts/lib/codex-compat.mjs`'s `detectUnsupported` doesn't
 * duplicate it.
 */
export function scanTextForDenylist(root, file, content) {
  const manifest = readJson(join(root, MANIFEST_PATH));
  const rules = manifest.denylisted_unresolved_tokens.map(compileRule);
  return scanContent(file, content, rules);
}

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

export function validateCodexCompatPhase0(root, options = {}) {
  // worktreeFreeze is the codex-workstream discipline (adapter work must not
  // write Claude sources); it is NOT a repo-wide freeze. Default validator runs
  // pass worktreeFreeze: false so normal marketplace evolution stays possible
  // (arbitrated 2026-07-13, ADR-068). The --compat-audit door keeps it on.
  const { worktreeFreeze = true } = options;
  const errors = [];
  const audit = runCodexCompatAudit(root);
  const baseline = readJson(join(root, BASELINE_PATH));

  validateBaselineMetadata(audit, baseline, errors);
  validateBaselineRatchet(audit, baseline, errors);
  validateNoUnresolvedGeneratedFindings(audit, errors);

  const canaries = validateCanaries(root, audit);
  errors.push(...canaries.errors);

  const negativeTests = validateNegativeFixtures(root);
  errors.push(...negativeTests.errors);

  const browserRuntime = validateBrowserRuntimeContract(root, audit.manifest);
  errors.push(...browserRuntime.errors);

  const lifecycleHook = validateSessionOpenContract(root, audit.manifest);
  errors.push(...lifecycleHook.errors);

  const hookSmokes = validateHookSmokes(root);
  errors.push(...hookSmokes.errors);

  const preservationSmokes = validatePreservationSmokes(root);
  errors.push(...preservationSmokes.errors);

  const releaseSmokes = validateReleaseSmokes(root, audit.manifest);
  errors.push(...releaseSmokes.errors);

  const coverage = validateCodexCoverage(root, audit.manifest);
  errors.push(...coverage.errors);

  const frozen = validateFrozenContract(root, audit.manifest, worktreeFreeze);
  errors.push(...frozen.errors);

  return { root, audit, baseline, canaries, negativeTests, browserRuntime, lifecycleHook, hookSmokes, preservationSmokes, releaseSmokes, coverage, frozen, errors };
}

export function formatCodexCompatAudit(result) {
  const lines = [];
  const categories = Object.values(result.audit.categories);

  lines.push("Codex compatibility audit");
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
  lines.push(`Browser runtime contract: ${result.browserRuntime.errors.length ? "FAIL" : "OK"}`);
  lines.push(`Lifecycle hook contract: ${result.lifecycleHook.errors.length ? "FAIL" : "OK"}`);
  lines.push(`Lifecycle hook smokes: ${result.hookSmokes.passed}/${result.hookSmokes.total} ok`);
  lines.push(`Preservation smokes: ${result.preservationSmokes.passed}/${result.preservationSmokes.total} ok`);
  lines.push(`Release smokes: ${result.releaseSmokes.passed}/${result.releaseSmokes.total} ok`);
  if (result.coverage) {
    lines.push(...formatCodexCoverageSummaryLines(result.coverage));
  }
  lines.push(`Frozen contract: ${result.frozen.errors.length ? "FAIL" : "OK"}`);

  if (result.errors.length) {
    lines.push("");
    lines.push("Errors:");
    for (const error of result.errors) lines.push(`- ${error}`);
  }

  return lines.join("\n");
}

export function formatCodexCoverageReport(result) {
  const lines = [];
  const total = result.rows.length;
  lines.push(`Coverage ${result.coveredCount}/${total}`);
  for (const row of result.rows) {
    lines.push(`${row.flat} | ${row.classes.join("+")} | ${row.capabilities.length ? row.capabilities.join(", ") : "none"}`);
  }
  lines.push(`Capability counts: ${formatCountMap(result.capabilityCounts)}`);
  lines.push(`Capability statuses: ${formatCountMap(result.statusCounts)}`);
  for (const [capability, flats] of Object.entries(result.capabilityMatches || {}).sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`${capability}: ${flats.length ? flats.join(", ") : "none"}`);
  }
  return lines.join("\n");
}

function validateNoUnresolvedGeneratedFindings(audit, errors) {
  for (const category of Object.values(audit.categories)) {
    if (category.count === 0) continue;
    const refs = category.findings.map((finding) => `${finding.file}:${finding.line}`).join(", ");
    errors.push(`Phase 5: unresolved generated ${category.label} finding(s): ${refs}`);
  }
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
      : validateGeneratedCanary(root, audit, fixture);
    results.push({ id: fixture.id || basename(fixtureFile), errors });
  }

  return summarizeFixtureResults("canary", results);
}

/**
 * `expect` proves an OLD (still-unlowered) token remains — used for capabilities Phase 1 doesn't
 * touch (browser_verify, ask_user_question, session_open_awareness).
 * `reject` proves a token Phase 1 DOES lower no longer appears — the negative-space half of "the
 * compiler actually changed the output" (not just "the old fixture still passes by accident").
 * `expect_text` proves the NEW Codex-side instruction text is actually present (not just that the
 * old token is gone) — checked against the compiled file directly, not the audit's finding list.
 */
function validateGeneratedCanary(root, audit, fixture) {
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
  for (const rejected of fixture.reject || []) {
    const matches = fileFindings.filter((finding) => finding.category === rejected.category);
    if (matches.length) {
      errors.push(
        `generated canary ${fixture.id} unexpectedly still matches ${rejected.category} in ${fixture.file}`,
      );
    }
  }
  if (fixture.expect_text?.length) {
    const filePath = join(root, fixture.file);
    const content = existsSync(filePath) ? readFileSync(filePath, "utf8") : null;
    for (const text of fixture.expect_text) {
      if (content == null || !content.includes(text)) {
        errors.push(`generated canary ${fixture.id} is missing expected text "${text}" in ${fixture.file}`);
      }
    }
  }
  if (fixture.reject_text?.length) {
    const filePath = join(root, fixture.file);
    const content = existsSync(filePath) ? readFileSync(filePath, "utf8") : null;
    for (const text of fixture.reject_text) {
      if (content != null && content.includes(text)) {
        errors.push(`generated canary ${fixture.id} unexpectedly still contains "${text}" in ${fixture.file}`);
      }
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

  if (fixture.scenario === "browser_runtime_contract") {
    const result = validateBrowserRuntimeContractFixture(fixture);
    errors.push(...result.errors);
    return errors;
  }

  if (fixture.scenario === "session_start_hook_contract") {
    const result = validateSessionOpenContractFixture(fixture);
    errors.push(...result.errors);
    return errors;
  }

  if (fixture.scenario === "coverage_contract") {
    const result = validateCoverageFixture(fixture);
    errors.push(...result.errors);
    return errors;
  }

  errors.push(`unknown negative fixture scenario: ${fixture.scenario}`);
  return errors;
}

function validateBrowserRuntimeContract(root, manifest) {
  const errors = [];
  const capability = manifest.capabilities?.find((item) => item.id === "browser_verify");
  if (!capability) {
    errors.push("browser_verify capability is missing from platforms/codex/manifest.json");
    return { errors, tomlRefs: [] };
  }

  const artifact = capability.runtime_artifact;
  if (typeof artifact === "string") {
    if (!existsSync(join(root, artifact))) {
      errors.push(`browser runtime artifact is missing: ${artifact}`);
    }
  } else {
    errors.push("browser_verify capability is missing runtime_artifact");
  }

  for (const consumer of capability.contract_consumers || []) {
    const consumerPath = join(root, consumer);
    if (!existsSync(consumerPath)) {
      errors.push(`browser contract consumer is missing: ${consumer}`);
      continue;
    }
    const content = readFileSync(consumerPath, "utf8");
    if (!content.includes(".codex/agents/browser-verifier.toml")) {
      errors.push(`browser contract consumer is missing exact runtime reference ".codex/agents/browser-verifier.toml": ${consumer}`);
    }
  }

  const tomlRefs = collectGeneratedTomlReferences(root, manifest.generated_destinations || []);
  for (const ref of tomlRefs) {
    if (!existsSync(join(root, ref.target))) {
      errors.push(`generated .codex/agents reference does not resolve: ${ref.file} -> ${ref.target}`);
    }
  }

  return { errors, tomlRefs };
}

function validateBrowserRuntimeContractFixture(fixture) {
  const tempRoot = mkdtempSync(join(tmpdir(), "skills-codex-browser-runtime-"));
  const errors = [];
  try {
    mkdirSync(tempRoot, { recursive: true });
    for (const [file, content] of Object.entries(fixture.files || {})) {
      const full = join(tempRoot, file);
      mkdirSync(dirname(full), { recursive: true });
      writeFileSync(full, content);
    }
    const result = validateBrowserRuntimeContract(tempRoot, fixture.manifest || {});
    errors.push(...result.errors);
    return { errors };
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function validateSessionOpenContract(root, manifest) {
  const errors = [];
  const capability = manifest.capabilities?.find((item) => item.id === "session_open_awareness");
  if (!capability) {
    errors.push("session_open_awareness capability is missing from platforms/codex/manifest.json");
    return { errors, hookRefs: [] };
  }

  if (capability.status !== "lowered") {
    errors.push(`session_open_awareness capability must be lowered, got ${JSON.stringify(capability.status)}`);
  }
  if (capability.matcher !== "startup|resume") {
    errors.push(`session_open_awareness matcher must be "startup|resume", got ${JSON.stringify(capability.matcher)}`);
  }
  if (capability.project_trust_required !== true) {
    errors.push("session_open_awareness capability must require project trust");
  }
  if (capability.default_behavior !== "on-demand") {
    errors.push(`session_open_awareness default_behavior must be "on-demand", got ${JSON.stringify(capability.default_behavior)}`);
  }

  const runtimeArtifacts = capability.runtime_artifacts || [];
  for (const artifact of runtimeArtifacts) {
    if (!existsSync(join(root, artifact))) {
      errors.push(`session-open runtime artifact is missing: ${artifact}`);
    }
  }

  const consumerChecks = [
    { needle: "Lifecycle awareness contract (Codex).", label: "lifecycle contract" },
    { needle: "on demand", label: "on-demand language" },
    { needle: "trusted", label: "trust language" },
  ];
  for (const consumer of capability.contract_consumers || []) {
    const consumerPath = join(root, consumer);
    if (!existsSync(consumerPath)) {
      errors.push(`session-open contract consumer is missing: ${consumer}`);
      continue;
    }
    const content = readFileSync(consumerPath, "utf8");
    for (const check of consumerChecks) {
      if (!content.includes(check.needle)) {
        errors.push(`session-open contract consumer is missing ${check.label} "${check.needle}": ${consumer}`);
      }
    }
  }

  const configPath = join(root, ".codex", "hooks.json");
  if (!existsSync(configPath)) {
    errors.push("session-open hooks config is missing: .codex/hooks.json");
  } else {
    errors.push(...validateSessionStartHooksConfig(readJson(configPath)));
  }

  const hookRefs = collectGeneratedHookReferences(root, manifest.generated_destinations || []);
  for (const ref of hookRefs) {
    if (!existsSync(join(root, ref.target))) {
      errors.push(`generated .codex/hooks reference does not resolve: ${ref.file} -> ${ref.target}`);
    }
  }

  return { errors, hookRefs };
}

function validateSessionStartHooksConfig(config) {
  const errors = [];
  const entries = config?.hooks?.SessionStart;
  if (!Array.isArray(entries) || entries.length === 0) {
    errors.push("session-open hooks config must contain at least one hooks.SessionStart entry");
    return errors;
  }

  const ownedEntries = entries.filter((entry) =>
    Array.isArray(entry?.hooks) &&
    entry.hooks.some((hook) => hook?.type === "command" && hook?.command === SESSION_START_HOOK_COMMAND),
  );
  if (ownedEntries.length !== 1) {
    errors.push(`session-open hooks config must contain exactly one owned SessionStart command entry for ${JSON.stringify(SESSION_START_HOOK_COMMAND)}`);
    return errors;
  }

  const [entry] = ownedEntries;
  if (entry?.matcher !== "startup|resume") {
    errors.push(`session-open hooks matcher must be exactly "startup|resume", got ${JSON.stringify(entry?.matcher)}`);
  }
  if (!Array.isArray(entry?.hooks) || entry.hooks.length !== 1) {
    errors.push("session-open owned SessionStart entry must contain exactly one command hook");
    return errors;
  }

  const [hook] = entry.hooks;
  if (hook?.type !== "command") {
    errors.push(`session-open hook type must be "command", got ${JSON.stringify(hook?.type)}`);
  }
  if (hook?.command !== SESSION_START_HOOK_COMMAND) {
    errors.push(`session-open hook command must be exactly ${JSON.stringify(SESSION_START_HOOK_COMMAND)}, got ${JSON.stringify(hook?.command)}`);
  }
  if (hook?.timeout !== 5) {
    errors.push(`session-open hook timeout must be exactly 5, got ${JSON.stringify(hook?.timeout)}`);
  }
  return errors;
}

function validateSessionOpenContractFixture(fixture) {
  const tempRoot = mkdtempSync(join(tmpdir(), "skills-codex-session-open-"));
  const errors = [];
  try {
    mkdirSync(tempRoot, { recursive: true });
    for (const [file, content] of Object.entries(fixture.files || {})) {
      const full = join(tempRoot, file);
      mkdirSync(dirname(full), { recursive: true });
      writeFileSync(full, content);
    }
    const result = validateSessionOpenContract(tempRoot, fixture.manifest || {});
    errors.push(...result.errors);
    return { errors };
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function validateCoverageFixture(fixture) {
  const tempRoot = mkdtempSync(join(tmpdir(), "skills-codex-coverage-"));
  const errors = [];
  try {
    mkdirSync(tempRoot, { recursive: true });
    writeTextFile(join(tempRoot, MANIFEST_PATH), JSON.stringify(fixture.manifest || {}, null, 2));
    for (const [file, content] of Object.entries(fixture.files || {})) {
      writeTextFile(join(tempRoot, file), content);
    }
    const result = validateCodexCoverage(tempRoot, fixture.manifest || {});
    errors.push(...result.errors);
    return { errors };
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function validateHookSmokes(root) {
  const results = [];
  for (const fixtureFile of listFixtureJsonFiles(root, HOOK_SMOKE_DIR)) {
    const fixture = readJson(fixtureFile);
    const result = runHookSmokeFixture(root, fixture);
    results.push({ id: fixture.id || basename(fixtureFile), errors: result.errors });
  }
  return summarizeFixtureResults("hook smoke", results);
}

function validatePreservationSmokes(root) {
  const results = [];
  for (const fixtureFile of listFixtureJsonFiles(root, PRESERVATION_SMOKE_DIR)) {
    const fixture = readJson(fixtureFile);
    const result = runPreservationSmokeFixture(root, fixture);
    results.push({ id: fixture.id || basename(fixtureFile), errors: result.errors });
  }
  return summarizeFixtureResults("preservation smoke", results);
}

function validateReleaseSmokes(root, manifest) {
  const results = [];
  const fixtureFiles = manifest?.release_policy?.fresh_install_smokes || [];
  for (const fixtureFile of fixtureFiles) {
    const fullPath = join(root, fixtureFile);
    const fixture = readJson(fullPath);
    const errors = runReleaseSmokeFixture(root, fixture);
    results.push({ id: fixture.id || basename(fullPath), errors });
  }
  const summary = summarizeFixtureResults("release smoke", results);
  if (!process.env.CODEX_RELEASE_SMOKE_REGRESSION_CHILD) {
    const entrypointFixture = fixtureFiles
      .map((fixtureFile) => readJson(join(root, fixtureFile)))
      .find((fixture) => fixture.verify_full_compat_exit === true);
    if (entrypointFixture) summary.errors.push(...validateReleaseSmokeEntrypointRegression(root));
  }
  return summary;
}

function runReleaseSmokeFixture(root, fixture) {
  if (fixture.scenario === "codex_global_install") {
    return validateCodexGlobalInstallSmoke(root, fixture);
  }
  if (fixture.scenario === "claude_fresh_build") {
    return validateClaudeFreshBuildSmoke(root, fixture);
  }
  return [`unknown release smoke scenario: ${fixture.scenario}`];
}

function validateCodexGlobalInstallSmoke(root, fixture) {
  const errors = [];
  const tempHome = mkdtempSync(join(tmpdir(), "skills-codex-release-home-"));
  const env = { ...process.env, HOME: tempHome, USERPROFILE: tempHome };

  try {
    for (const skill of fixture.seed_legacy_duplicates || []) {
      const sourceDir = join(root, ".agents", "skills", skill);
      if (!existsSync(join(sourceDir, "SKILL.md"))) {
        errors.push(`release smoke ${fixture.id} seed skill is missing from repo mirror: ${skill}`);
        continue;
      }
      const legacyDir = join(tempHome, ".codex", "skills", skill);
      mkdirSync(dirname(legacyDir), { recursive: true });
      cpSync(sourceDir, legacyDir, { recursive: true });
    }

    const args = ["scripts/build-codex.mjs", "--sync-global", "--profile", fixture.profile || "all"];
    if (fixture.dedupe_global_roots) args.push("--dedupe-global-roots");
    const result = spawnSync(process.execPath, args, {
      cwd: root,
      encoding: "utf8",
      env,
    });
    if (result.error || result.status !== 0) {
      errors.push(`global install smoke build failed: ${summarizeSpawnFailure(result)}`);
      return errors;
    }

    const globalSkillsDir = join(tempHome, ".agents", "skills");
    const receiptPath = join(globalSkillsDir, ".skills-marketplace-codex.json");
    if (!existsSync(receiptPath)) {
      errors.push("global install smoke is missing ~/.agents/skills/.skills-marketplace-codex.json");
      return errors;
    }
    const receipt = readJson(receiptPath);
    if (receipt.profile !== (fixture.profile || "all")) {
      errors.push(`global install smoke receipt profile drifted: ${JSON.stringify(receipt.profile)}`);
    }
    if (typeof fixture.expect_skill_count === "number" && receipt.skills?.length !== fixture.expect_skill_count) {
      errors.push(`global install smoke receipt skill count drifted: ${receipt.skills?.length ?? "missing"} !== ${fixture.expect_skill_count}`);
    }
    if (fixture.verify_runtime_ownership_conflicts === true) {
      if (!receipt.runtimeOwnership?.files || !receipt.runtimeOwnership?.sessionStartEntry) {
        errors.push("global install smoke receipt is missing runtime ownership hashes");
      }
      errors.push(...validateRuntimeOwnershipConflictSmokes(root));
    }

    for (const skill of fixture.expect_skills || []) {
      const skillMd = join(globalSkillsDir, skill, "SKILL.md");
      if (!existsSync(skillMd)) {
        errors.push(`global install smoke missing compiled skill: ${skill}`);
        continue;
      }
      const content = readFileSync(skillMd, "utf8");
      if (!content.includes("GENERATED by scripts/build-codex.mjs from plugins/")) {
        errors.push(`global install smoke installed a non-generated skill copy: ${skill}`);
      }
      const findings = scanTextForDenylist(root, `.agents/skills/${skill}/SKILL.md`, content);
      if (findings.length) {
        errors.push(`global install smoke unresolved Claude-only token(s) remain in ${skill}: ${findings.map((item) => item.category).join(", ")}`);
      }
    }

    for (const rel of fixture.expect_runtime_files || []) {
      if (!existsSync(join(tempHome, rel))) {
        errors.push(`global install smoke missing runtime artifact: ${rel}`);
      }
    }

    for (const skill of fixture.reject_legacy_duplicates || []) {
      if (existsSync(join(tempHome, ".codex", "skills", skill))) {
        errors.push(`global install smoke kept duplicate legacy skill: .codex/skills/${skill}`);
      }
    }

    const hookConfigPath = join(tempHome, ".codex", "hooks.json");
    if (fixture.expect_hook_command && existsSync(hookConfigPath)) {
      const config = readJson(hookConfigPath);
      const entries = config?.hooks?.SessionStart || [];
      const hasCommand = entries.some((entry) =>
        Array.isArray(entry?.hooks) &&
        entry.hooks.some((hook) => hook?.command === fixture.expect_hook_command),
      );
      if (!hasCommand) {
        errors.push(`global install smoke missing SessionStart hook command ${JSON.stringify(fixture.expect_hook_command)}`);
      }
    }
  } finally {
    rmSync(tempHome, { recursive: true, force: true });
  }

  return errors;
}

function validateRuntimeOwnershipConflictSmokes(root) {
  const errors = [];
  const firstHome = mkdtempSync(join(tmpdir(), "skills-codex-runtime-conflict-first-"));
  const editedHome = mkdtempSync(join(tmpdir(), "skills-codex-runtime-conflict-edited-"));
  try {
    const firstEnv = { ...process.env, HOME: firstHome, USERPROFILE: firstHome };
    const userAgent = "name = \"user-executor\"\ndescription = \"preserve me\"\n";
    const userHookScript = "#!/usr/bin/env node\nprocess.stdout.write(\"user hook\\n\");\n";
    const userHookConfig = `${JSON.stringify({
      hooks: {
        SessionStart: [{
          matcher: "user-owned",
          hooks: [{ type: "command", command: SESSION_START_HOOK_COMMAND, timeout: 99 }],
        }],
      },
    }, null, 2)}\n`;
    writeTextFile(join(firstHome, ".codex", "agents", "executor.toml"), userAgent);
    writeTextFile(join(firstHome, ".codex", "hooks", "relay-digest-session-start.mjs"), userHookScript);
    writeTextFile(join(firstHome, ".codex", "hooks.json"), userHookConfig);

    const first = spawnSync(process.execPath, ["scripts/build-codex.mjs", "--sync-global", "--profile", "all"], {
      cwd: root,
      encoding: "utf8",
      env: firstEnv,
    });
    if (first.status === 0) errors.push("runtime ownership smoke expected first-install same-name conflict to fail");
    if (readFileSync(join(firstHome, ".codex", "agents", "executor.toml"), "utf8") !== userAgent) {
      errors.push("runtime ownership smoke overwrote first-install user executor.toml");
    }
    if (readFileSync(join(firstHome, ".codex", "hooks", "relay-digest-session-start.mjs"), "utf8") !== userHookScript) {
      errors.push("runtime ownership smoke overwrote first-install user hook script");
    }
    if (readFileSync(join(firstHome, ".codex", "hooks.json"), "utf8") !== userHookConfig) {
      errors.push("runtime ownership smoke overwrote first-install user hooks.json entry");
    }
    if (existsSync(join(firstHome, ".agents", "skills", ".skills-marketplace-codex.json"))) {
      errors.push("runtime ownership smoke wrote a partial receipt before reporting first-install conflict");
    }

    const editedEnv = { ...process.env, HOME: editedHome, USERPROFILE: editedHome };
    const install = spawnSync(
      process.execPath,
      ["scripts/build-codex.mjs", "--sync-global", "--profile", "all"],
      { cwd: root, encoding: "utf8", env: editedEnv },
    );
    if (install.status !== 0) {
      errors.push(`runtime ownership smoke setup install failed: ${summarizeSpawnFailure(install)}`);
      return errors;
    }
    const explorerPath = join(editedHome, ".codex", "agents", "explorer.toml");
    const receiptPath = join(editedHome, ".agents", "skills", ".skills-marketplace-codex.json");
    const editedExplorer = `${readFileSync(explorerPath, "utf8")}\n# user edit\n`;
    writeFileSync(explorerPath, editedExplorer);
    const receiptBefore = readFileSync(receiptPath, "utf8");
    const prune = spawnSync(
      process.execPath,
      ["scripts/build-codex.mjs", "--sync-global", "--profile", "project-only"],
      { cwd: root, encoding: "utf8", env: editedEnv },
    );
    if (prune.status === 0) errors.push("runtime ownership smoke expected modified receipt-owned prune to fail");
    if (readFileSync(explorerPath, "utf8") !== editedExplorer) {
      errors.push("runtime ownership smoke changed a user-edited explorer.toml during failed prune");
    }
    if (readFileSync(receiptPath, "utf8") !== receiptBefore) {
      errors.push("runtime ownership smoke changed the receipt during failed prune");
    }
  } finally {
    rmSync(firstHome, { recursive: true, force: true });
    rmSync(editedHome, { recursive: true, force: true });
  }
  return errors;
}

function validateReleaseSmokeEntrypointRegression(root) {
  const errors = [];
  const tempRoot = mkdtempSync(join(tmpdir(), "skills-codex-release-entrypoint-"));
  try {
    cpSync(root, tempRoot, { recursive: true, filter: (source) => shouldCopyIntoTempRoot(root, source) });
    const manifestPath = join(tempRoot, MANIFEST_PATH);
    const manifest = readJson(manifestPath);
    const capability = manifest.capabilities?.find((item) => item.id === "worker_dispatch");
    capability.generated_contract_markers.push("__release_smoke_must_fail_on_full_compat_error__");
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const result = spawnSync(process.execPath, ["scripts/validate-codex-skills.mjs", "--release-smoke"], {
      cwd: tempRoot,
      encoding: "utf8",
      env: { ...process.env, CODEX_RELEASE_SMOKE_REGRESSION_CHILD: "1" },
    });
    if (result.status === 0) {
      errors.push("release-smoke entrypoint regression: command passed despite a non-release compatibility error");
    }
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
  return errors;
}

function validateClaudeFreshBuildSmoke(root, fixture) {
  const errors = [];
  const tempRoot = mkdtempSync(join(tmpdir(), "skills-claude-release-"));
  try {
    cpSync(root, tempRoot, {
      recursive: true,
      filter: (source) => shouldCopyIntoTempRoot(root, source),
    });

    const monitored = fixture.monitored_paths || ["CLAUDE.md", ".claude-plugin", "plugins"];
    const before = snapshotPaths(tempRoot, monitored);
    const commands = fixture.commands || [
      ["scripts/build-manifests.mjs"],
      ["scripts/validate-codex-skills.mjs", "--metadata-audit"],
    ];

    for (const args of commands) {
      const result = spawnSync(process.execPath, args, {
        cwd: tempRoot,
        encoding: "utf8",
        env: { ...process.env, HOME: process.env.HOME, USERPROFILE: process.env.USERPROFILE },
      });
      if (result.error || result.status !== 0) {
        errors.push(`fresh Claude build smoke failed for ${args.join(" ")}: ${summarizeSpawnFailure(result)}`);
        return errors;
      }
    }

    const after = snapshotPaths(tempRoot, monitored);
    const drift = diffSnapshots(before, after);
    if (drift.length) {
      errors.push(`fresh Claude build smoke changed frozen/manifests paths: ${drift.join(", ")}`);
    }
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }

  return errors;
}

function validateCodexCoverage(root, manifest) {
  const errors = [];
  const sourceSkills = discoverSkillFiles(root, join("plugins"), "source", errors);
  const generatedSkills = discoverSkillFiles(root, join(".agents", "skills"), "generated", errors);
  const sourceByFlat = new Map(sourceSkills.map((skill) => [skill.flat, skill]));
  const generatedByFlat = new Map(generatedSkills.map((skill) => [skill.flat, skill]));
  const sourceFlats = normalizeAndSort([...sourceByFlat.keys()]);
  const generatedFlats = normalizeAndSort([...generatedByFlat.keys()]);

  for (const flat of sourceFlats) {
    if (!generatedByFlat.has(flat)) errors.push(`Phase 5: missing generated skill for ${flat}: .agents/skills/${flat}/SKILL.md`);
  }
  for (const flat of generatedFlats) {
    if (!sourceByFlat.has(flat)) errors.push(`Phase 5: missing source skill for ${flat}: plugins/*/skills/*/SKILL.md`);
  }

  const coveragePolicy = manifest.coverage_policy || {};
  const sourceAllowlist = new Set(coveragePolicy.source_frontmatter_allowlist || []);
  const generatedAllowlist = new Set(coveragePolicy.generated_frontmatter_allowlist || []);
  const allowedStatuses = new Set(
    coveragePolicy.allowed_statuses ||
    coveragePolicy.capability_status_allowlist ||
    [],
  );
  const baselineClasses = coveragePolicy.baseline_classes || ["A", "B"];
  const capabilityClass = coveragePolicy.capability_class || "C";
  const degradationClass = coveragePolicy.degradation_class || "D";
  const degradationStatuses = new Set(coveragePolicy.degradation_statuses || ["degraded", "unsupported"]);

  const capabilities = Array.isArray(manifest.capabilities) ? manifest.capabilities : [];
  const capabilityMatches = new Map();
  const capabilityCounts = {};
  const statusCounts = {};

  for (const capability of capabilities) {
    const status = capability.status;
    const hasValidStatus = allowedStatuses.has(status);
    if (!hasValidStatus) {
      errors.push(`Phase 5: capability ${capability.id} has invalid or missing status ${JSON.stringify(status)}`);
    } else {
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }

    validateManifestCapabilityPaths(root, capability, errors);
    const sourceSignals = compileSourceSignals(capability.source_signals || []);
    if (sourceSignals.length === 0) {
      errors.push(`Phase 5: capability ${capability.id} is missing source_signals`);
    }

    const matchedFlats = [];
    for (const source of sourceSkills) {
      const matchedSignals = matchSourceSignals(source, sourceSignals);
      if (matchedSignals.length === 0) continue;
      matchedFlats.push(source.flat);
    }
    const normalizedMatches = normalizeAndSort(matchedFlats);
    capabilityMatches.set(capability.id, normalizedMatches);
    capabilityCounts[capability.id] = normalizedMatches.length;

    const consumerFlats = normalizeAndSort(
      (capability.contract_consumers || [])
        .map((consumer) => {
          if (!consumer.endsWith("/SKILL.md")) {
            errors.push(`Phase 5: manifest capability ${capability.id} has non-skill contract consumer ${consumer}`);
            return null;
          }
          const flat = flatSkillFromGeneratedPath(consumer);
          if (!flat) {
            errors.push(`Phase 5: manifest capability ${capability.id} has invalid contract consumer path ${consumer}`);
            return null;
          }
          if (!generatedByFlat.has(flat)) {
            errors.push(`Phase 5: manifest capability ${capability.id} references missing generated skill ${consumer}`);
            return null;
          }
          return flat;
        })
        .filter(Boolean),
    );
    if (hasValidStatus && !sameMembers(consumerFlats, normalizedMatches)) {
      errors.push(
        `Phase 5: capability ${capability.id} contract_consumers drifted: coverage [${normalizedMatches.join(", ")}] vs manifest [${consumerFlats.join(", ")}]`,
      );
    }
  }

  const rows = [];
  for (const flat of sourceFlats) {
    const source = sourceByFlat.get(flat);
    const generated = generatedByFlat.get(flat);
    if (!generated) continue;

    validateFrontmatterAllowlist(source, sourceAllowlist, "source", errors);
    validateFrontmatterAllowlist(generated, generatedAllowlist, "generated", errors);

    const capabilitiesForSkill = capabilities
      .filter((capability) => (capabilityMatches.get(capability.id) || []).includes(flat))
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id));
    const classes = [...baselineClasses];
    if (capabilitiesForSkill.length) classes.push(capabilityClass);
    if (capabilitiesForSkill.some((capability) => degradationStatuses.has(capability.status))) {
      classes.push(degradationClass);
    }

    validateGeneratedPolicyMarkers(source, generated, capabilitiesForSkill, errors);
    validateGeneratedContractMarkers(generated, capabilitiesForSkill, errors);

    rows.push({
      flat,
      classes,
      capabilities: capabilitiesForSkill.map((capability) => capability.id),
      generatedPath: generated.path,
    });
  }

  errors.push(...validateGeneratedArtifactTargets(root, manifest));

  const coveredRoster = normalizeAndSort(rows.map((row) => row.flat));
  if (!sameMembers(sourceFlats, coveredRoster)) {
    errors.push(`Phase 5: coverage roster mismatch: discovered [${sourceFlats.join(", ")}] vs covered [${coveredRoster.join(", ")}]`);
  }

  return {
    totalSkills: sourceFlats.length,
    coveredCount: rows.length,
    rows,
    capabilityCounts,
    statusCounts,
    capabilityMatches: Object.fromEntries(
      capabilities.map((capability) => [capability.id, capabilityMatches.get(capability.id) || []]),
    ),
    errors,
  };
}

function runHookSmokeFixture(root, fixture) {
  const errors = [];
  const tempRoot = mkdtempSync(join(tmpdir(), "skills-codex-hook-smoke-"));
  const tempHome = join(tempRoot, "home");
  const workspace = join(tempRoot, "workspace");
  try {
    mkdirSync(tempHome, { recursive: true });
    mkdirSync(join(tempRoot, ".codex", "hooks"), { recursive: true });
    mkdirSync(workspace, { recursive: true });
    cpSync(
      join(root, ".codex", "hooks", "relay-digest-session-start.mjs"),
      join(tempRoot, ".codex", "hooks", "relay-digest-session-start.mjs"),
    );

    if (fixture.relay_repo?.enabled) {
      writeTextFile(join(workspace, "relay.yml"), fixture.relay_repo.relay_yml || "people:\n");
    }

    if (fixture.relay_repo?.files) {
      for (const [file, content] of Object.entries(fixture.relay_repo.files)) {
        writeTextFile(join(workspace, file), content);
      }
    }

    if (fixture.helper?.enabled) {
      const helperPath = resolveHookHelperPath(tempRoot, tempHome, fixture.helper.location);
      writeTextFile(helperPath, buildFixtureHelperScript(fixture.helper));
    }

    const payload = JSON.stringify({
      hook_event_name: "SessionStart",
      cwd: workspace,
      source: "startup",
      ...(fixture.payload || {}),
    });

    const result = spawnSync(process.execPath, [join(tempRoot, ".codex", "hooks", "relay-digest-session-start.mjs")], {
      cwd: tempRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        HOME: tempHome,
      },
      input: payload,
    });

    if (result.error || result.status !== 0) {
      errors.push(`hook smoke ${fixture.id} execution failed: ${summarizeSpawnFailure(result)}`);
      return { errors };
    }

    const stdout = typeof result.stdout === "string" ? result.stdout.trim() : "";
    if (fixture.expect_output === "empty") {
      if (stdout !== "") {
        errors.push(`hook smoke ${fixture.id} expected no output, got ${JSON.stringify(stdout)}`);
      }
      return { errors };
    }

    if (!stdout) {
      errors.push(`hook smoke ${fixture.id} expected JSON output, got empty stdout`);
      return { errors };
    }

    const output = safeJsonParse(stdout);
    if (!output) {
      errors.push(`hook smoke ${fixture.id} emitted invalid JSON`);
      return { errors };
    }

    const additionalContext = output?.hookSpecificOutput?.additionalContext;
    if (typeof additionalContext !== "string" || !additionalContext.trim()) {
      errors.push(`hook smoke ${fixture.id} is missing hookSpecificOutput.additionalContext`);
      return { errors };
    }

    for (const text of fixture.expect_output_contains || []) {
      if (!additionalContext.includes(text)) {
        errors.push(`hook smoke ${fixture.id} missing output text "${text}"`);
      }
    }
    return { errors };
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function runPreservationSmokeFixture(root, fixture) {
  const errors = [];
  const tempRoot = mkdtempSync(join(tmpdir(), "skills-codex-preserve-"));
  try {
    cpSync(root, tempRoot, {
      recursive: true,
      filter: (source) => shouldCopyIntoTempRoot(root, source),
    });

    for (const [file, content] of Object.entries(fixture.seed_files || {})) {
      writeTextFile(join(tempRoot, file), content);
    }

    for (let run = 0; run < (fixture.runs || 1); run++) {
      const result = spawnSync(process.execPath, ["scripts/build-codex.mjs"], {
        cwd: tempRoot,
        encoding: "utf8",
      });
      if (result.error || result.status !== 0) {
        errors.push(`preservation smoke ${fixture.id} build ${run + 1} failed: ${summarizeSpawnFailure(result)}`);
        return { errors };
      }
    }

    for (const file of fixture.expect_files || []) {
      if (!existsSync(join(tempRoot, file))) {
        errors.push(`preservation smoke ${fixture.id} expected file to survive rebuild: ${file}`);
      }
    }

    for (const [file, snippets] of Object.entries(fixture.expect_text || {})) {
      const full = join(tempRoot, file);
      if (!existsSync(full)) {
        errors.push(`preservation smoke ${fixture.id} expected text file is missing: ${file}`);
        continue;
      }
      const content = readFileSync(full, "utf8");
      for (const snippet of snippets) {
        if (!content.includes(snippet)) {
          errors.push(`preservation smoke ${fixture.id} missing text ${JSON.stringify(snippet)} in ${file}`);
        }
      }
    }

    for (const [file, snippets] of Object.entries(fixture.reject_text || {})) {
      const full = join(tempRoot, file);
      if (!existsSync(full)) continue;
      const content = readFileSync(full, "utf8");
      for (const snippet of snippets) {
        if (content.includes(snippet)) {
          errors.push(`preservation smoke ${fixture.id} unexpectedly kept text ${JSON.stringify(snippet)} in ${file}`);
        }
      }
    }

    return { errors };
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function buildFixtureHelperScript(helper) {
  const status = Number.isInteger(helper.status) ? helper.status : 0;
  const stdout = JSON.stringify(helper.stdout || "");
  const stderr = JSON.stringify(helper.stderr || "");
  return [
    "#!/usr/bin/env node",
    `if (${stderr} !== \"\") process.stderr.write(${stderr});`,
    `if (${stdout} !== \"\") process.stdout.write(${stdout});`,
    `process.exit(${status});`,
    "",
  ].join("\n");
}

function discoverSkillFiles(root, startDir, kind, errors) {
  const fullStart = join(root, startDir);
  if (!existsSync(fullStart)) return [];
  const skills = [];
  for (const file of walkFiles(fullStart)) {
    const relPath = normalizePath(relative(root, file));
    if (!relPath.endsWith("/SKILL.md")) continue;
    const flat = kind === "source" ? flatSkillFromSourcePath(relPath) : flatSkillFromGeneratedPath(relPath);
    if (!flat) continue;
    const content = readFileSync(file, "utf8");
    const frontmatter = parseTopYamlFrontmatter(content);
    if (!frontmatter) {
      errors.push(`Phase 5: ${kind} skill is missing top YAML frontmatter: ${relPath}`);
      continue;
    }
    skills.push({ flat, path: relPath, content, frontmatter });
  }
  return skills.sort((a, b) => a.flat.localeCompare(b.flat));
}

function flatSkillFromSourcePath(path) {
  const match = /^plugins\/([^/]+)\/skills\/([^/]+)\/SKILL\.md$/.exec(normalizePath(path));
  if (!match) return null;
  return `${match[1]}-${match[2]}`;
}

function flatSkillFromGeneratedPath(path) {
  const match = /^\.agents\/skills\/([^/]+)\/SKILL\.md$/.exec(normalizePath(path));
  return match ? match[1] : null;
}

function parseTopYamlFrontmatter(content) {
  const lines = content.split("\n");
  if (lines[0] !== "---") return null;
  const keys = [];
  const values = {};
  for (let index = 1; index < lines.length; index++) {
    const line = lines[index];
    if (line === "---") return { keys, values };
    const match = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line);
    if (!match) continue;
    const key = match[1];
    keys.push(key);
    values[key] = parseScalarFrontmatterValue(match[2]);
  }
  return null;
}

function parseScalarFrontmatterValue(rawValue) {
  const value = rawValue.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function validateFrontmatterAllowlist(skill, allowlist, kind, errors) {
  for (const key of skill.frontmatter.keys) {
    if (!allowlist.has(key)) {
      errors.push(`Phase 5: ${kind} frontmatter key ${JSON.stringify(key)} is not allowed in ${skill.path}`);
    }
  }
}

function validateManifestCapabilityPaths(root, capability, errors) {
  for (const field of [
    "local_mapping",
    "runtime_artifact",
    "interactive_choice_contract",
    "work_packet_contract",
    "worker_return_contract",
  ]) {
    if (typeof capability[field] === "string") {
      validateManifestPointer(root, capability.id, field, capability[field], errors);
    }
  }

  for (const field of ["agents", "runtime_artifacts", "template_sources", "compiler_owners"]) {
    for (const pointer of capability[field] || []) {
      validateManifestPointer(root, capability.id, field, pointer, errors);
    }
  }
}

function validateGeneratedPolicyMarkers(source, generated, capabilitiesForSkill, errors) {
  const activeMarkers = new Map();
  for (const capability of capabilitiesForSkill) {
    for (const marker of capability.generated_policy_markers || []) {
      activeMarkers.set(marker, capability.id);
      if (!generated.content.includes(marker)) {
        errors.push(`Phase 5: generated ${capability.id} policy marker is missing in ${generated.path}`);
      }
    }
  }

  for (const marker of ["> **Explicitly invoked only.**", "> **Mechanical-tier skill.**"]) {
    if (generated.content.includes(marker) && !activeMarkers.has(marker)) {
      errors.push(`Phase 5: unexpected generated policy marker ${JSON.stringify(marker)} in ${generated.path}`);
    }
  }
}

function validateGeneratedContractMarkers(generated, capabilitiesForSkill, errors) {
  const activeMarkers = new Map();
  for (const capability of capabilitiesForSkill) {
    for (const marker of capability.generated_contract_markers || []) {
      activeMarkers.set(marker, capability.id);
      if (!generated.content.includes(marker)) {
        errors.push(`Phase 5: generated ${capability.id} contract marker is missing in ${generated.path}`);
      }
    }
  }

  for (const marker of [
    "> **Interactive choice contract (Codex).**",
    "## Worker dispatch contract (Codex)",
    "> **Browser-verify contract (Codex).**",
    "architecture enrichment adds detail once code exists.",
    "> **Lifecycle awareness contract (Codex).**",
  ]) {
    if (generated.content.includes(marker) && !activeMarkers.has(marker)) {
      errors.push(`Phase 5: unexpected generated contract marker ${JSON.stringify(marker)} in ${generated.path}`);
    }
  }
}

function validateGeneratedArtifactTargets(root, manifest) {
  const errors = [];
  for (const file of listGeneratedFiles(root, manifest.generated_destinations || [])) {
    if (!/\.md$/i.test(file)) continue;
    const content = readFileSync(join(root, file), "utf8");
    for (const link of collectLocalMarkdownLinks(content)) {
      const resolved = resolveGeneratedReference(root, file, link.target);
      if (!resolved.exists) {
        errors.push(`Phase 5: missing markdown target in ${file}: ${link.target}`);
      }
    }
    for (const target of collectInlineBacktickPaths(content)) {
      const resolved = resolveGeneratedReference(root, file, target);
      if (!resolved.exists) {
        errors.push(`Phase 5: missing inline path target in ${file}: ${target}`);
      }
    }
  }
  return errors;
}

function compileSourceSignals(signals) {
  return signals.map((signal) => {
    if (signal.scope === "frontmatter") return signal;
    return compileRule(signal);
  });
}

function matchSourceSignals(skill, signals) {
  const matched = [];
  for (const signal of signals) {
    if (signal.scope === "frontmatter") {
      const actual = skill.frontmatter.values[signal.field];
      const expected = parseScalarFrontmatterValue(String(signal.value));
      if (actual === expected) matched.push(signal.id || `${signal.field}:${signal.value}`);
      continue;
    }
    const findings = scanContent(skill.path, skill.content, [signal]);
    if (findings.length > 0) matched.push(signal.id || signal.pattern);
  }
  return matched;
}

function validateManifestPointer(root, capabilityId, field, pointer, errors) {
  if (typeof pointer !== "string" || !pointer.trim()) {
    errors.push(`Phase 5: capability ${capabilityId} has invalid ${field} pointer ${JSON.stringify(pointer)}`);
    return;
  }
  const [file, symbol] = pointer.split("#");
  const fullPath = join(root, file);
  if (!existsSync(fullPath)) {
    errors.push(`Phase 5: capability ${capabilityId} references missing ${field} ${pointer}`);
    return;
  }
  if (symbol) {
    const content = readFileSync(fullPath, "utf8");
    if (!content.includes(symbol)) {
      errors.push(`Phase 5: capability ${capabilityId} pointer ${pointer} is missing symbol ${symbol}`);
    }
  }
}

function collectLocalMarkdownLinks(content) {
  const links = [];
  const regex = /\[[^\]]+\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const target = match[1].trim();
    if (isIgnorableLinkTarget(target)) continue;
    links.push({ target });
  }
  return links;
}

function collectInlineBacktickPaths(content) {
  const matches = [];
  const regex = /`([^`]+)`/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const value = match[1].trim();
    if (containsIllustrativePlaceholderPath(value)) continue;
    if (value.endsWith("/")) continue;
    if (
      value.startsWith(".codex/agents/") ||
      value.startsWith(".codex/hooks/") ||
      value.startsWith("references/") ||
      value.startsWith("scripts/")
    ) {
      matches.push(value);
    }
  }
  return matches;
}

function isIgnorableLinkTarget(target) {
  const cleanTarget = target.split("#")[0].trim();
  return (
    target.startsWith("#") ||
    /^[a-z]+:\/\//i.test(target) ||
    target.startsWith("mailto:") ||
    target.startsWith("app://") ||
    containsIllustrativePlaceholderPath(cleanTarget)
  );
}

function resolveGeneratedReference(root, generatedPath, target) {
  const cleanTarget = target.split("#")[0].trim();
  if (!cleanTarget) return { exists: true };
  if (cleanTarget === "references/") return { exists: true };
  if (containsIllustrativePlaceholderPath(cleanTarget)) return { exists: true };
  const generatedDir = dirname(join(root, generatedPath));
  const generatedSkillRoot = generatedPath.startsWith(".agents/skills/")
    ? join(root, normalizePath(generatedPath).split("/").slice(0, 3).join("/"))
    : generatedDir;
  const candidates = [];

  if (cleanTarget.startsWith(".codex/") || cleanTarget.startsWith("scripts/")) {
    candidates.push(join(root, cleanTarget));
  } else if (cleanTarget.startsWith(".agents/skills/")) {
    candidates.push(join(root, cleanTarget));
  } else if (cleanTarget.startsWith("references/")) {
    candidates.push(join(generatedSkillRoot, cleanTarget));
  } else {
    candidates.push(join(generatedDir, cleanTarget));
    candidates.push(join(root, cleanTarget));
  }

  return { exists: candidates.some((candidate) => existsSync(candidate)) };
}

function containsIllustrativePlaceholderPath(target) {
  return target.split("/").some((segment) => {
    if (!segment) return false;
    return /<[^<>/]+>/.test(segment) || /\{[^{}\/]+\}/.test(segment);
  });
}

function formatCodexCoverageSummaryLines(result) {
  return [
    `Coverage: ${result.coveredCount}/${result.totalSkills}`,
    `Capability rows: ${formatCountMap(result.capabilityCounts)}`,
    `Capability statuses: ${formatCountMap(result.statusCounts)}`,
  ];
}

function resolveHookHelperPath(tempRoot, tempHome, location = "project") {
  if (location === "home-agents") {
    return join(tempHome, ".agents", "skills", "relay-digest", "scripts", "compute-state.mjs");
  }
  if (location === "home-codex") {
    return join(tempHome, ".codex", "skills", "relay-digest", "scripts", "compute-state.mjs");
  }
  return join(tempRoot, ".agents", "skills", "relay-digest", "scripts", "compute-state.mjs");
}

function validateFrozenContract(root, manifest, includeWorktreeFreeze = true) {
  const errors = [];
  const worktree = includeWorktreeFreeze
    ? validateFrozenWorktree(root, manifest.frozen_contract_paths)
    : { errors: [], staged: [], unstaged: [], untracked: [], skipped: true };
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

function collectGeneratedTomlReferences(root, destinations) {
  return collectGeneratedPathReferences(
    root,
    destinations,
    /(?:^|[^A-Za-z0-9._-])(\.codex\/agents\/[A-Za-z0-9._-]+\.toml)\b/g,
  );
}

function collectGeneratedHookReferences(root, destinations) {
  return collectGeneratedPathReferences(
    root,
    destinations,
    /(?:^|[^A-Za-z0-9._-])(\.codex\/hooks\/[A-Za-z0-9._/-]+\.(?:mjs|js|json))\b/g,
  );
}

function collectGeneratedPathReferences(root, destinations, regex) {
  const refs = [];
  const files = listGeneratedFiles(root, destinations);
  for (const file of files) {
    const content = readFileSync(join(root, file), "utf8");
    const pattern = new RegExp(regex.source, regex.flags);
    let match;
    while ((match = pattern.exec(content)) !== null) {
      refs.push({ file, target: match[1] });
    }
  }
  return refs;
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

function snapshotPaths(root, paths) {
  const files = new Map();
  for (const relPath of paths) {
    const fullPath = join(root, relPath);
    if (!existsSync(fullPath)) continue;
    if (statSync(fullPath).isDirectory()) {
      for (const file of walkFiles(fullPath)) {
        files.set(normalizePath(relative(root, file)), readFileSync(file));
      }
      continue;
    }
    files.set(normalizePath(relPath), readFileSync(fullPath));
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

function formatCountMap(counts) {
  const entries = Object.entries(counts || {}).sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) return "none";
  return entries.map(([key, value]) => `${key}=${value}`).join(", ");
}

function summarizeSpawnFailure(result) {
  if (result.error) return result.error.message;
  return summarizeCommandOutput(result.stderr || result.stdout);
}

function buildChildGitEnv() {
  const env = { ...process.env };
  for (const key of GIT_LOCAL_ENV_VARS) {
    delete env[key];
  }
  return env;
}

function listGitPaths(root, args, { context, errors }) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    env: buildChildGitEnv(),
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
    env: buildChildGitEnv(),
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

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
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
