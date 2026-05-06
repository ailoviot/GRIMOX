#!/usr/bin/env node
/**
 * Regenerates packages/grimox-qa/grimox-qa.tgz and propagates it to
 * templates/_vendor/grimox-qa.tgz, bumping the patch version first.
 *
 * Why the bump matters: npm caches `file:` tarballs by (name, version) under
 * ~/.npm/_cacache. Without bumping, `npm install` in consuming projects keeps
 * extracting the OLD cached version even when the .tgz file changed on disk.
 * Bumping forces npm to treat it as new and extract the actual updated content.
 *
 * Usage: npm run qa:pack
 */

import { readFileSync, writeFileSync, renameSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const PKG_DIR = join(REPO_ROOT, 'packages', 'grimox-qa');
const PKG_JSON = join(PKG_DIR, 'package.json');
const VENDOR_TARGET = join(REPO_ROOT, 'templates', '_vendor', 'grimox-qa.tgz');

const C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    cyan: '\x1b[36m', green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m',
};
const log = (msg) => console.log(msg);
const fail = (msg) => { console.error(`${C.red}✗ ${msg}${C.reset}`); process.exit(1); };

if (!existsSync(PKG_JSON)) fail(`Cannot find ${PKG_JSON}`);

// ── 1. Read current version + bump patch ─────────────────────────────────
const pkg = JSON.parse(readFileSync(PKG_JSON, 'utf8'));
const oldVersion = pkg.version;
const parts = oldVersion.split('.');
if (parts.length !== 3 || parts.some((p) => !/^\d+$/.test(p))) {
    fail(`Unexpected version format "${oldVersion}" — expected MAJOR.MINOR.PATCH`);
}
parts[2] = String(Number(parts[2]) + 1);
const newVersion = parts.join('.');

log(`${C.cyan}Bumping version:${C.reset} ${C.dim}${oldVersion}${C.reset} → ${C.bold}${newVersion}${C.reset}`);
pkg.version = newVersion;
writeFileSync(PKG_JSON, JSON.stringify(pkg, null, 4) + '\n');

// ── 2. Clean up any leftover .tgz from previous runs in PKG_DIR ──────────
for (const f of readdirSync(PKG_DIR)) {
    if (/^grimox-qa-\d+\.\d+\.\d+\.tgz$/.test(f)) {
        try { unlinkSync(join(PKG_DIR, f)); } catch {}
    }
}

// ── 3. Run npm pack inside the package ───────────────────────────────────
log(`${C.cyan}Running npm pack…${C.reset}`);
const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const result = spawnSync(npmCmd, ['pack'], { cwd: PKG_DIR, stdio: 'pipe', encoding: 'utf8' });
if (result.status !== 0) {
    // restore version on failure so we don't leave a half-bumped state
    pkg.version = oldVersion;
    writeFileSync(PKG_JSON, JSON.stringify(pkg, null, 4) + '\n');
    fail(`npm pack failed (exit ${result.status})\n${result.stderr || result.stdout}`);
}

// ── 4. Find the produced tarball + move to templates/_vendor/ ────────────
const expectedTarball = join(PKG_DIR, `grimox-qa-${newVersion}.tgz`);
if (!existsSync(expectedTarball)) {
    fail(`npm pack didn't produce ${expectedTarball}`);
}

renameSync(expectedTarball, VENDOR_TARGET);

// ── 5. Done ──────────────────────────────────────────────────────────────
log(``);
log(`${C.green}${C.bold}✓ Tarball regenerated${C.reset}`);
log(`  ${C.dim}version:${C.reset} ${C.bold}${newVersion}${C.reset}`);
log(`  ${C.dim}path:   ${C.reset} ${VENDOR_TARGET}`);
log(``);
log(`${C.yellow}Next steps:${C.reset}`);
log(`  ${C.dim}• New projects created with${C.reset} ${C.cyan}grimox create${C.reset} ${C.dim}will receive this tarball automatically.${C.reset}`);
log(`  ${C.dim}• Existing projects: copy this tarball to <project>/.vendor/grimox-qa.tgz${C.reset}`);
log(`  ${C.dim}  and run${C.reset} ${C.cyan}npm install grimox-qa --force${C.reset} ${C.dim}there.${C.reset}`);
log(``);
