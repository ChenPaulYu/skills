import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = join(dirname(fileURLToPath(import.meta.url)), "..", "auto-pull.sh");
const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("GIT_")));

function git(cwd, ...args) {
  return execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.com", ...args], {
    cwd,
    env: cleanEnv,
    encoding: "utf8",
  }).trim();
}

// bare remote + `local` (the checkout under test) + `other` (pushes upstream changes)
function fixture(run) {
  const home = mkdtempSync(join(tmpdir(), "auto-pull-test-"));
  try {
    const remote = join(home, "remote.git");
    const local = join(home, "local");
    const other = join(home, "other");
    git(home, "init", "--bare", "-b", "main", remote);
    git(home, "clone", remote, local);
    writeFileSync(join(local, "a.txt"), "one\n");
    git(local, "add", ".");
    git(local, "commit", "-m", "init");
    git(local, "push", "-u", "origin", "main");
    git(home, "clone", remote, other);
    const config = join(home, "config");
    const state = join(home, "state");
    mkdirSync(join(config, "auto-pull"), { recursive: true });
    writeFileSync(join(config, "auto-pull", "repos"), `# test\n\n${local}\n`);
    const env = { ...cleanEnv, XDG_CONFIG_HOME: config, XDG_STATE_HOME: state };
    const pull = (...args) => {
      const r = spawnSync("sh", [script, ...args], { env, encoding: "utf8" });
      assert.equal(r.status, 0, r.stderr);
      return r.stdout;
    };
    const upstream = (file, text) => {
      writeFileSync(join(other, file), text);
      git(other, "add", ".");
      git(other, "commit", "-m", `edit ${file}`);
      git(other, "push", "origin", "main");
    };
    return run({ local, upstream, pull, state });
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
}

test("behind: fast-forwarded", () =>
  fixture(({ local, upstream, pull }) => {
    upstream("b.txt", "new\n");
    pull();
    assert.equal(readFileSync(join(local, "b.txt"), "utf8"), "new\n");
  }));

test("ahead: untouched, never pushed", () =>
  fixture(({ local, pull }) => {
    writeFileSync(join(local, "c.txt"), "mine\n");
    git(local, "add", ".");
    git(local, "commit", "-m", "mine");
    const head = git(local, "rev-parse", "HEAD");
    pull();
    assert.equal(git(local, "rev-parse", "HEAD"), head);
    assert.equal(git(local, "rev-parse", "origin/main"), git(local, "rev-parse", "HEAD~1"));
  }));

test("diverged: untouched and WARN logged", () =>
  fixture(({ local, upstream, pull, state }) => {
    writeFileSync(join(local, "c.txt"), "mine\n");
    git(local, "add", ".");
    git(local, "commit", "-m", "mine");
    const head = git(local, "rev-parse", "HEAD");
    upstream("b.txt", "theirs\n");
    const out = pull();
    assert.equal(git(local, "rev-parse", "HEAD"), head);
    assert.match(out, /WARN .*diverged/);
    assert.match(readFileSync(join(state, "auto-pull", "auto-pull.log"), "utf8"), /WARN .*diverged/);
  }));

test("dirty tracked file in the way: untouched and WARN", () =>
  fixture(({ local, upstream, pull }) => {
    upstream("a.txt", "upstream\n");
    writeFileSync(join(local, "a.txt"), "local edit\n");
    const head = git(local, "rev-parse", "HEAD");
    const out = pull();
    assert.equal(git(local, "rev-parse", "HEAD"), head);
    assert.equal(readFileSync(join(local, "a.txt"), "utf8"), "local edit\n");
    assert.match(out, /WARN .*refused/);
  }));

test("non-conflicting untracked file: still fast-forwarded", () =>
  fixture(({ local, upstream, pull }) => {
    writeFileSync(join(local, "scratch.txt"), "x\n");
    upstream("b.txt", "new\n");
    pull();
    assert.equal(readFileSync(join(local, "b.txt"), "utf8"), "new\n");
    assert.ok(existsSync(join(local, "scratch.txt")));
  }));

test("--dry-run changes nothing", () =>
  fixture(({ local, upstream, pull }) => {
    upstream("b.txt", "new\n");
    const head = git(local, "rev-parse", "HEAD");
    const out = pull("--dry-run");
    assert.equal(git(local, "rev-parse", "HEAD"), head);
    assert.equal(existsSync(join(local, "b.txt")), false);
    assert.match(out, /DRY .*would fast-forward/);
  }));
