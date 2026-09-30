/**
 * Validate the exact commit candidate without disturbing unstaged work.
 * Owns index capture, raw-blob materialization, and temporary validator execution.
 * Reads: Git object/index APIs, node:fs, node:child_process, node:path.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

const CHECKS = ["scripts/validate-codex-skills.mjs", "scripts/validate-blueprints.mjs"];
const MAX_BUFFER = 128 * 1024 * 1024;

export function validateStaged(cwd, { env = process.env, output = process.stdout } = {}) {
  const git = (...args) => execFileSync("git", args, { cwd, env, maxBuffer: MAX_BUFFER, stdio: ["pipe", "pipe", "pipe"] });
  git("diff", "--cached", "--check");
  // Honor GIT_INDEX_FILE, including Git's temporary index for path-limited commits.
  // write-tree refuses unresolved merges and freezes the candidate as immutable objects.
  const tree = git("write-tree").toString().trim();
  const entries = git("ls-tree", "-rz", tree).toString().split("\0").filter(Boolean).map(parseEntry);
  const snapshot = mkdtempSync(join(tmpdir(), "skills-staged-"));
  try {
    materialize(snapshot, entries, { cwd, env });
    const childEnv = Object.fromEntries(Object.entries(env).filter(([name]) =>
      !name.startsWith("GIT_") && name !== "NODE_TEST_CONTEXT"));
    for (const check of CHECKS) {
      if (!existsSync(join(snapshot, check))) throw new Error(`Staged snapshot is missing ${check}`);
      output.write(`→ staged ${check}\n`);
      const result = spawnSync(process.execPath, [check], {
        cwd: snapshot, env: childEnv, encoding: "utf8", maxBuffer: MAX_BUFFER,
      });
      if (result.stdout) output.write(result.stdout);
      if (result.stderr) output.write(result.stderr);
      if (result.error || result.status !== 0) {
        throw new Error(`Staged ${check} failed${result.error ? `: ${result.error.message}` : ` (exit ${result.status ?? result.signal})`}`);
      }
    }
    if (git("write-tree").toString().trim() !== tree) {
      throw new Error("The index changed during validation; rerun against the new staged content.");
    }
    output.write(`✓ staged snapshot ${tree.slice(0, 12)} verified\n`);
    return { tree };
  } finally {
    rmSync(snapshot, { recursive: true, force: true });
  }
}

function parseEntry(record) {
  const match = /^(\d+) (\w+) ([0-9a-f]+)\t([\s\S]+)$/.exec(record);
  if (!match) throw new Error("Cannot parse the staged Git tree.");
  const [, mode, type, oid, path] = match;
  if (type !== "blob" || !["100644", "100755", "120000"].includes(mode)) {
    throw new Error(`Unsupported staged entry ${path} (${mode}); submodule contents must be validated separately.`);
  }
  return { mode, oid, path };
}

function materialize(root, entries, gitOptions) {
  // archive honors export-ignore; checkout-index can apply filters. Read raw
  // objects so neither changes the bytes that validators see.
  const ids = [...new Set(entries.map(entry => entry.oid))];
  const data = execFileSync("git", ["cat-file", "--batch"], {
    ...gitOptions, input: ids.map(id => `${id}\n`).join(""), maxBuffer: MAX_BUFFER,
  });
  const blobs = new Map();
  let offset = 0;
  for (const id of ids) {
    const newline = data.indexOf(10, offset);
    const match = /^([0-9a-f]+) blob (\d+)$/.exec(data.subarray(offset, newline).toString());
    if (!match || match[1] !== id) throw new Error(`Cannot read staged blob ${id}`);
    const end = newline + 1 + Number(match[2]);
    if (end >= data.length || data[end] !== 10) throw new Error(`Truncated staged blob ${id}`);
    blobs.set(id, data.subarray(newline + 1, end));
    offset = end + 1;
  }
  // Symlinks last: a staged link cannot redirect materialization writes.
  for (const entry of entries.filter(entry => entry.mode !== "120000")) {
    const path = safePath(root, entry.path);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, blobs.get(entry.oid));
    chmodSync(path, entry.mode === "100755" ? 0o755 : 0o644);
  }
  for (const entry of entries.filter(entry => entry.mode === "120000")) {
    const path = safePath(root, entry.path);
    const target = blobs.get(entry.oid).toString();
    if (isAbsolute(target)) throw new Error(`Staged symlink escapes snapshot: ${entry.path}`);
    safePath(root, relative(root, resolve(dirname(path), target)));
    mkdirSync(dirname(path), { recursive: true });
    symlinkSync(target, path);
  }
  // Resolve complete chains too: an internal-looking target can escape through
  // another link followed by '..'. Dangling/cyclic links cannot be verified.
  for (const entry of entries.filter(entry => entry.mode === "120000")) {
    let target;
    try { target = realpathSync.native(safePath(root, entry.path)); }
    catch { throw new Error(`Staged symlink must resolve inside snapshot: ${entry.path}`); }
    const physicalRoot = realpathSync.native(root);
    safePath(physicalRoot, relative(physicalRoot, target));
  }
}

function safePath(root, path) {
  const destination = resolve(root, path);
  if (destination === root || !destination.startsWith(`${root}${sep}`)) {
    throw new Error(`Staged path escapes snapshot: ${path}`);
  }
  return destination;
}
