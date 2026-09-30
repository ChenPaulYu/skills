import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { validateStaged } from "./staged-validation.mjs";

const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("GIT_")));
const quiet = { write() {} };
const gate = `import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
writeFileSync(process.env.STAGED_TEST_RECEIPT, process.cwd());
assert.equal(process.env.GIT_INDEX_FILE, undefined);
assert.equal(process.env.GIT_DIR, undefined);
assert.equal(existsSync('untracked.txt'), false);
assert.equal(readFileSync('source.txt', 'utf8'), readFileSync('mirror.txt', 'utf8'));
`;

function fixture(run) {
  const home = mkdtempSync(join(tmpdir(), "staged-test-"));
  const root = join(home, "repo");
  mkdirSync(root);
  const env = { ...cleanEnv, STAGED_TEST_RECEIPT: join(home, "receipt") };
  const git = (...args) => execFileSync("git", args, { cwd: root, env, stdio: ["pipe", "pipe", "pipe"] }).toString().trim();
  const put = (file, content) => { mkdirSync(dirname(join(root, file)), { recursive: true }); writeFileSync(join(root, file), content); };
  git("init", "-q");
  git("config", "user.name", "Staged Test");
  git("config", "user.email", "staged-test@example.invalid");
  git("config", "core.hooksPath", join(home, "no-hooks"));
  put("scripts/validate-codex-skills.mjs", gate);
  put("scripts/validate-blueprints.mjs", "// Fixture blueprint gate\n");
  put("source.txt", "old\n"); put("mirror.txt", "old\n");
  git("add", "."); git("commit", "-qm", "Fixture baseline");
  const check = (override = {}) => validateStaged(root, { env: { ...env, ...override }, output: quiet });
  try { run({ root, home, env, git, put, check }); }
  finally { rmSync(home, { recursive: true, force: true }); }
}

test("unstaged repairs cannot hide a broken staged mirror; failed snapshot is removed", () => fixture(({ root, env, git, put, check }) => {
  put("source.txt", "new\n"); git("add", "source.txt"); put("mirror.txt", "new\n");
  const tree = git("write-tree"); const status = git("status", "--porcelain");
  assert.throws(() => check(), /Staged scripts\/validate-codex-skills.mjs failed/);
  assert.equal(git("write-tree"), tree); assert.equal(git("status", "--porcelain"), status);
  assert.equal(readFileSync(join(root, "mirror.txt"), "utf8"), "new\n");
  assert.equal(existsSync(readFileSync(env.STAGED_TEST_RECEIPT, "utf8")), false);
}));

test("healthy staged files pass despite broken unstaged edits and extra untracked files", () => fixture(({ root, env, git, put, check }) => {
  put("source.txt", "new\n"); put("mirror.txt", "new\n"); git("add", ".");
  put("source.txt", "unfinished\n"); put("untracked.txt", "private work\n");
  const before = git("status", "--porcelain");
  const result = check(); assert.equal(result.tree, git("write-tree"));
  assert.equal(git("status", "--porcelain"), before);
  assert.equal(readFileSync(join(root, "source.txt"), "utf8"), "unfinished\n");
  assert.equal(existsSync(readFileSync(env.STAGED_TEST_RECEIPT, "utf8")), false);
}));

test("staged validator code runs, not a permissive unstaged replacement", () => fixture(({ git, put, check }) => {
  put("scripts/validate-blueprints.mjs", "process.exit(7);\n"); git("add", ".");
  put("scripts/validate-blueprints.mjs", "process.exit(0);\n");
  assert.throws(() => check(), /validate-blueprints.mjs failed \(exit 7\)/);
}));

test("a staged deletion cannot be repaired by an untracked working copy", () => fixture(({ git, put, check }) => {
  git("rm", "scripts/validate-blueprints.mjs"); put("scripts/validate-blueprints.mjs", "// local replacement\n");
  assert.throws(() => check(), /Staged snapshot is missing scripts\/validate-blueprints.mjs/);
}));

test("alternate commit indexes are honored and hook Git environment is cleared for checks", () => fixture(({ root, home, env, git, put, check }) => {
  put("source.txt", "broken default index\n"); git("add", "source.txt");
  const alternate = join(home, "alternate-index");
  execFileSync("git", ["read-tree", "HEAD"], { cwd: root, env: { ...env, GIT_INDEX_FILE: alternate } });
  check({ GIT_INDEX_FILE: alternate, GIT_DIR: join(root, ".git") });
  assert.throws(() => check(), /failed/);
}));

test("raw objects retain export-ignored files, unusual names, binary bytes, and executable modes", () => fixture(({ root, git, put, check }) => {
  const odd = "docs/a space\nand 中文.md";
  put(odd, Buffer.from([0, 255, 13, 10])); put("run.sh", "#!/bin/sh\nexit 0\n");
  chmodSync(join(root, "run.sh"), 0o755);
  put(".gitattributes", "source.txt export-ignore\n");
  put("scripts/validate-blueprints.mjs", `import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
assert.deepEqual([...readFileSync(${JSON.stringify(odd)})], [0,255,13,10]);
assert.ok(statSync('run.sh').mode & 0o111);
`);
  git("add", "."); check();
}));

test("internal symlinks survive while escaping symlinks are blocked", () => fixture(({ root, git, put, check }) => {
  symlinkSync("source.txt", join(root, "link.txt"));
  put("scripts/validate-blueprints.mjs", "import {readlinkSync} from 'node:fs'; if(readlinkSync('link.txt')!=='source.txt') process.exit(1);\n");
  git("add", "."); check();
  symlinkSync("../outside", join(root, "escape")); git("add", "escape");
  assert.throws(() => check(), /escapes snapshot/);
}));

test("unresolved merges are refused before any validator executes", () => fixture(({ root, env, git, check }) => {
  const blob = git("rev-parse", "HEAD:source.txt");
  execFileSync("git", ["update-index", "--index-info"], {
    cwd: root, env,
    input: `0 ${"0".repeat(40)}\tsource.txt\n100644 ${blob} 2\tsource.txt\n100644 ${blob} 3\tsource.txt\n`,
  });
  assert.throws(() => check(), /write-tree/);
  assert.equal(existsSync(env.STAGED_TEST_RECEIPT), false);
}));

test("staged whitespace errors fail even when the worktree was repaired", () => fixture(({ env, git, put, check }) => {
  put("note.md", "Trailing spaces   \n"); git("add", "note.md");
  put("note.md", "Trailing spaces\n");
  assert.throws(() => check(), /diff --cached --check/);
  assert.equal(existsSync(env.STAGED_TEST_RECEIPT), false);
}));

test("indirect escaping and dangling symlinks are refused", () => fixture(({ root, home, git, put, check }) => {
  put("inside/file.txt", "inside\n"); put("deep/anchor.txt", "anchor\n");
  writeFileSync(join(home, "outside.txt"), "outside\n");
  symlinkSync("../inside", join(root, "deep/link"));
  symlinkSync(`deep/link/../../${basename(home)}/outside.txt`, join(root, "indirect"));
  git("add", ".");
  assert.throws(() => check(), /escapes snapshot/);
  git("rm", "-f", "indirect");
  symlinkSync("missing.txt", join(root, "dangling")); git("add", "dangling");
  assert.throws(() => check(), /must resolve inside snapshot/);
}));

test("an index change during checks invalidates the result", () => fixture(({ root, env, git, put }) => {
  let changed = false;
  assert.throws(() => validateStaged(root, { env, output: { write() {
    if (!changed) { changed = true; put("later.txt", "new staged work\n"); git("add", "later.txt"); }
  } } }), /index changed during validation/);
}));

test("the real pre-commit hook blocks a stale commit and accepts its staged repair", () => fixture(({ root, env, git, put }) => {
  for (const file of ["hooks/pre-commit", "validate-staged.mjs", "lib/staged-validation.mjs"]) {
    put(`scripts/${file}`, readFileSync(fileURLToPath(new URL(`../${file}`, import.meta.url))));
  }
  chmodSync(join(root, "scripts/hooks/pre-commit"), 0o755);
  git("config", "core.hooksPath", "scripts/hooks");
  git("add", "scripts");
  put("source.txt", "changed\n"); git("add", "source.txt"); put("mirror.txt", "changed\n");
  const head = git("rev-parse", "HEAD");
  const failed = spawnSync("git", ["commit", "-m", "Must fail"], { cwd: root, env, encoding: "utf8" });
  assert.notEqual(failed.status, 0); assert.equal(git("rev-parse", "HEAD"), head);
  assert.match(failed.stderr, /commit blocked/);
  git("add", "mirror.txt");
  const passed = spawnSync("git", ["commit", "-m", "Staged repair"], { cwd: root, env, encoding: "utf8" });
  assert.equal(passed.status, 0, passed.stderr);
  assert.notEqual(git("rev-parse", "HEAD"), head);
}));
