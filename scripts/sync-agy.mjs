#!/usr/bin/env node
/**
 * sync-agy.mjs — Link installed skills and my-wiki methods into Antigravity (AGY).
 *
 * Antigravity (Orca chat / ~/.gemini/config/skills) discovers skills by inspecting
 * directories containing SKILL.md. This script links:
 *   1. Namespaced marketplace skills from ~/.codex/skills (nav-*, shape-*, frame-*, seek-*)
 *   2. Active My-wiki skills from my-wiki repository
 */

import { existsSync, readdirSync, lstatSync, symlinkSync, unlinkSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

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

// 2. Link active My-wiki methods
const activeJsonPath = join(MY_WIKI_ROOT, '.my-wiki', 'active.json');
if (existsSync(activeJsonPath)) {
  const active = JSON.parse(readFileSync(activeJsonPath, 'utf8'));
  const enabled = active.enabled_skills || {};

  for (const skillId of Object.keys(enabled)) {
    if (skillId === 'my-wiki') continue; // already linked as root entry

    // Look in core or extensions
    let skillPath = join(MY_WIKI_ROOT, 'skills', 'core', skillId);
    if (!existsSync(skillPath)) {
      skillPath = join(MY_WIKI_ROOT, 'skills', 'extensions', skillId);
    }

    if (existsSync(skillPath)) {
      const linkName = `my-wiki-${skillId}`;
      const linkPath = join(AGY_SKILLS_DIR, linkName);
      linkIfNeeded(linkPath, skillPath, linkName);
    }
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
