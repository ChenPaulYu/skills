#!/usr/bin/env node
/**
 * sync-agy.mjs — Link installed skills and sync plugins into Antigravity (AGY).
 *
 * Links:
 *   1. Namespaced marketplace skills from ~/.codex/skills (nav-*, shape-*, frame-*, seek-*)
 *   2. Registers my-wiki as an independent native AGY plugin via its catalog adapter
 */

import { existsSync, readdirSync, lstatSync, symlinkSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const HOME = process.env.HOME;
if (!HOME) {
  console.error('HOME environment variable is required');
  process.exit(1);
}

const AGY_SKILLS_DIR = join(HOME, '.gemini', 'config', 'skills');
const CODEX_SKILLS_DIR = join(HOME, '.codex', 'skills');
const MY_WIKI_ROOT = join(HOME, 'Desktop', 'Github', '01-project', 'personal', 'my-wiki');

if (!existsSync(AGY_SKILLS_DIR)) {
  console.error(`AGY skills directory not found: ${AGY_SKILLS_DIR}`);
  process.exit(1);
}

console.log('→ Syncing skills into Antigravity (`~/.gemini/config/skills`)...');

// 1. Link marketplace skills from ~/.codex/skills
if (existsSync(CODEX_SKILLS_DIR)) {
  const prefixes = ['nav-', 'shape-', 'frame-', 'seek-'];
  const entries = readdirSync(CODEX_SKILLS_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && prefixes.some(p => entry.name.startsWith(p))) {
      const target = join(CODEX_SKILLS_DIR, entry.name);
      const linkPath = join(AGY_SKILLS_DIR, entry.name);
      linkIfNeeded(linkPath, target, entry.name);
    }
  }
}

// 2. Clean up any legacy loose my-wiki symlinks from ~/.gemini/config/skills
for (const entry of readdirSync(AGY_SKILLS_DIR)) {
  if (entry === 'my-wiki' || entry.startsWith('my-wiki-')) {
    const linkPath = join(AGY_SKILLS_DIR, entry);
    try {
      unlinkSync(linkPath);
      console.log(`  ✓ Cleaned legacy symlink: ${entry}`);
    } catch {}
  }
}

// 3. Register/sync My-wiki as an independent AGY plugin
const catalogScript = join(MY_WIKI_ROOT, 'skills', 'core', 'my-wiki', 'scripts', 'catalog');
if (existsSync(catalogScript)) {
  try {
    execFileSync(catalogScript, ['sync-agy'], { stdio: 'pipe' });
    console.log('  ✓ Synced My-wiki as independent AGY plugin');
  } catch (err) {
    console.error('  ✗ Failed to sync My-wiki plugin:', err.message);
  }
}

function linkIfNeeded(linkPath, target, name) {
  try {
    if (existsSync(linkPath) || isBrokenSymlink(linkPath)) {
      const stat = lstatSync(linkPath);
      if (stat.isSymbolicLink()) {
        unlinkSync(linkPath);
      }
    }
    symlinkSync(target, linkPath);
    console.log(`  ✓ Linked: ${name} → ${target}`);
  } catch (err) {
    console.error(`  ✗ Failed to link ${name}:`, err.message);
  }
}

function isBrokenSymlink(p) {
  try {
    lstatSync(p);
    return true;
  } catch {
    return false;
  }
}

console.log('✓ AGY skills sync complete. New sessions will recognize all skills.');
