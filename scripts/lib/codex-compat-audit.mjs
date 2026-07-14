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

  const frozen = validateFrozenContract(root, audit.manifest, worktreeFreeze);
  errors.push(...frozen.errors);

  return { root, audit, baseline, canaries, negativeTests, browserRuntime, lifecycleHook, hookSmokes, preservationSmokes, frozen, errors };
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
  lines.push(`Browser runtime contract: ${result.browserRuntime.errors.length ? "FAIL" : "OK"}`);
  lines.push(`Lifecycle hook contract: ${result.lifecycleHook.errors.length ? "FAIL" : "OK"}`);
  lines.push(`Lifecycle hook smokes: ${result.hookSmokes.passed}/${result.hookSmokes.total} ok`);
  lines.push(`Preservation smokes: ${result.preservationSmokes.passed}/${result.preservationSmokes.total} ok`);
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
