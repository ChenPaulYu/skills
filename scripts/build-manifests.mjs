#!/usr/bin/env node
/**
 * build-manifests.mjs — one-way generator: each plugin's `.claude-plugin/plugin.json`
 * is the SINGLE SOURCE OF TRUTH for that plugin's name + version + description + author.
 *
 * The same facts used to live hand-copied in three places (`.claude-plugin/plugin.json`,
 * `.cursor-plugin/plugin.json`, the root `.claude-plugin/marketplace.json` entry), so a
 * version bump that missed one copy drifted silently (rule ① information leakage). This
 * script gives those facts one owner and derives the rest:
 *   - `.cursor-plugin/plugin.json` is fully regenerated as a projection {name, version,
 *     description, author} — never hand-edit it (it is overwritten).
 *   - the root marketplace.json entry's `version` is synced from the owner; its
 *     `description` stays hand-owned (it is a separate marketplace-facing blurb).
 * Re-run after any plugin.json version/description/author edit; `scripts/validate-codex-skills.mjs`
 * gates drift the same way it gates the Codex mirror.
 *
 * Reads: node:fs · node:path (plugins/<p>/.claude-plugin/plugin.json · .claude-plugin/marketplace.json)
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGINS_DIR = join(ROOT, "plugins");
const MARKETPLACE = join(ROOT, ".claude-plugin", "marketplace.json");

/** Serialize as 2-space-indented JSON with a trailing newline (matches the repo's manifests). */
function toJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function ownerManifests() {
  const owners = [];
  for (const plugin of readdirSync(PLUGINS_DIR).sort()) {
    const pluginDir = join(PLUGINS_DIR, plugin);
    if (!statSync(pluginDir).isDirectory()) continue;
    const claudeManifest = join(pluginDir, ".claude-plugin", "plugin.json");
    if (!existsSync(claudeManifest)) continue;
    owners.push({ plugin, pluginDir, manifest: JSON.parse(readFileSync(claudeManifest, "utf8")) });
  }
  return owners;
}

function writeCursorProjection({ pluginDir, manifest }) {
  // Cursor reads a subset; project the owner's fields in the canonical key order.
  const projection = {
    name: manifest.name,
    version: manifest.version,
    description: manifest.description,
    author: manifest.author,
  };
  writeFileSync(join(pluginDir, ".cursor-plugin", "plugin.json"), toJson(projection));
}

function syncMarketplaceVersions(owners) {
  const data = JSON.parse(readFileSync(MARKETPLACE, "utf8"));
  const versionByName = new Map(owners.map((o) => [o.manifest.name, o.manifest.version]));
  for (const entry of data.plugins ?? []) {
    const owned = versionByName.get(entry.name);
    if (owned != null) entry.version = owned; // version is derived; description stays hand-owned
  }
  writeFileSync(MARKETPLACE, toJson(data));
}

function main() {
  const owners = ownerManifests();
  for (const owner of owners) writeCursorProjection(owner);
  syncMarketplaceVersions(owners);
  const summary = owners.map((o) => `${o.manifest.name}@${o.manifest.version}`).join(", ");
  console.log(`✓ ${owners.length} cursor projections + marketplace versions synced  (${summary})`);
}

main();
