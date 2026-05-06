#!/usr/bin/env node
// Prints a summary of all commands available for working on the Grimox CLI itself.
// Usage: npm run grimox:help

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

const C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    cyan: '\x1b[36m', green: '\x1b[32m', yellow: '\x1b[33m', magenta: '\x1b[35m',
};

const SCRIPT_DESC = {
    dev: 'Runs the local CLI bin (bin/grimox.js). Same as `node bin/grimox.js` — pass args after `--`, e.g. `npm run dev -- create my-app`.',
    test: 'Runs the Vitest test suite (no specs yet — placeholder).',
    lint: 'Runs ESLint over src/.',
    'qa:pack': 'Bumps packages/grimox-qa patch version + runs `npm pack` + moves the .tgz to templates/_vendor/grimox-qa.tgz. Use this every time you change code under packages/grimox-qa/. The bump is critical — npm caches `file:` tarballs by (name, version), so without it consuming projects keep using stale code.',
    prepublishOnly: 'Auto hook before `npm publish`. Runs lint to block broken publishes.',
    'grimox:help': 'Shows this help.',
};

const isHook = (n) => /^(pre|post)/.test(n);

console.log(`
${C.magenta}${C.bold}╔══════════════════════════════════════════════════════════════╗
║  Grimox CLI · Available commands for working on this repo    ║
╚══════════════════════════════════════════════════════════════╝${C.reset}

${C.cyan}${C.bold}1) npm scripts you invoke yourself  ${C.dim}(npm run <script>)${C.reset}
`);

const scripts = pkg.scripts || {};
const userFacing = [], hooks = [];
for (const [name, cmd] of Object.entries(scripts)) {
    if (isHook(name)) hooks.push([name, cmd]);
    else userFacing.push([name, cmd]);
}

for (const [name, cmd] of userFacing) {
    const desc = SCRIPT_DESC[name] || `${C.dim}(no description · runs: ${cmd})${C.reset}`;
    console.log(`  ${C.green}${C.bold}npm run ${name}${C.reset}`);
    console.log(`    ${C.dim}${desc}${C.reset}\n`);
}

if (hooks.length) {
    console.log(`${C.yellow}${C.bold}2) Auto hooks  ${C.dim}(npm fires them itself — do not invoke manually)${C.reset}\n`);
    for (const [name] of hooks) {
        const desc = SCRIPT_DESC[name] || '';
        console.log(`  ${C.yellow}${name}${C.reset}  ${C.dim}→ ${desc}${C.reset}`);
    }
    console.log();
}

console.log(`${C.cyan}${C.bold}3) Grimox CLI subcommands  ${C.dim}(the actual commands the published CLI exposes)${C.reset}\n`);
console.log(`  ${C.green}grimox create [name]${C.reset}      ${C.dim}— scaffold a new project (interactive). Pass --yes to skip prompts.${C.reset}`);
console.log(`  ${C.green}grimox migrate${C.reset}            ${C.dim}— migrate a legacy project. Pass --plan or --apply.${C.reset}`);
console.log(`  ${C.green}grimox list${C.reset}               ${C.dim}— list all available stacks, frameworks and databases.${C.reset}`);
console.log(`  ${C.green}grimox --help${C.reset}             ${C.dim}— full CLI usage from commander.${C.reset}`);
console.log(`  ${C.dim}During development you can invoke the local bin directly:${C.reset}`);
console.log(`  ${C.green}node bin/grimox.js <subcommand>${C.reset}    ${C.dim}or  ${C.green}npm run dev -- <subcommand>${C.reset}`);
console.log();

console.log(`${C.cyan}${C.bold}4) Make the local CLI usable from anywhere  ${C.dim}(while not published to npm)${C.reset}\n`);
console.log(`  ${C.green}npm link${C.reset}                  ${C.dim}— installs \`grimox\` globally as a symlink to this repo. Live edits.${C.reset}`);
console.log(`  ${C.green}npm unlink -g grimox${C.reset}      ${C.dim}— remove the global symlink when you are done.${C.reset}`);
console.log();

console.log(`${C.cyan}${C.bold}5) Updating the bundled grimox-qa tarball${C.reset}\n`);
console.log(`  ${C.dim}Whenever you change code under packages/grimox-qa/src/, regenerate the${C.reset}`);
console.log(`  ${C.dim}tarball so the change becomes available to consuming projects:${C.reset}\n`);
console.log(`    ${C.green}npm run qa:pack${C.reset}`);
console.log(`    ${C.dim}↑ bumps patch version, runs npm pack, moves to templates/_vendor/${C.reset}`);
console.log(`    ${C.dim}  in one atomic step. The version bump is required — npm caches local${C.reset}`);
console.log(`    ${C.dim}  tarballs by (name, version), so reusing the same version means npm install${C.reset}`);
console.log(`    ${C.dim}  in consuming projects keeps the OLD cached content.${C.reset}\n`);
console.log(`  ${C.bold}${C.green}Who picks up the change automatically (no extra steps needed):${C.reset}`);
console.log(`    ${C.dim}• NEW projects created with \`grimox create\` AFTER you ran qa:pack${C.reset}`);
console.log(`    ${C.dim}• Projects migrated with \`grimox migrate --apply\` AFTER qa:pack${C.reset}`);
console.log(`    ${C.dim}  → both pull templates/_vendor/grimox-qa.tgz at scaffold time, so they${C.reset}`);
console.log(`    ${C.dim}    receive whatever version is current when they are generated.${C.reset}\n`);
console.log(`  ${C.bold}${C.yellow}Who does NOT pick it up automatically (manual update needed):${C.reset}`);
console.log(`    ${C.dim}• OLD projects that were generated BEFORE this qa:pack — they already${C.reset}`);
console.log(`    ${C.dim}  have a copy of the OLD tarball in their <project>/.vendor/ folder.${C.reset}`);
console.log(`    ${C.dim}  To upgrade them, copy the new tarball over and force-reinstall:${C.reset}\n`);
console.log(`    ${C.green}cp templates/_vendor/grimox-qa.tgz <project>/.vendor/grimox-qa.tgz${C.reset}`);
console.log(`    ${C.dim}then in that <project>:${C.reset}`);
console.log(`    ${C.green}npm install grimox-qa --force${C.reset}\n`);
console.log(`    ${C.dim}This is exactly how we upgraded LabIA after the port-poller fix —${C.reset}`);
console.log(`    ${C.dim}it had been generated before the fix existed.${C.reset}\n`);

console.log(`${C.cyan}${C.bold}6) PowerShell tips (Windows)${C.reset}\n`);
console.log(`  ${C.dim}• "&&" does not work in PowerShell 5.x → use ";" or "if ($?) { ... }".${C.reset}`);
console.log(`  ${C.dim}• "rm -rf" does not exist → use "Remove-Item -Recurse -Force <path>".${C.reset}`);
console.log(`  ${C.dim}• Inside npm scripts, "&&" works fine because npm uses cmd.exe, not PowerShell.${C.reset}`);
console.log();

console.log(`${C.cyan}${C.bold}7) Common workflows${C.reset}\n`);
console.log(`  ${C.bold}Iterate on the CLI locally (no install):${C.reset}`);
console.log(`    ${C.green}npm run dev -- create my-test-app${C.reset}\n`);
console.log(`  ${C.bold}Install the local CLI globally to use it from any folder:${C.reset}`);
console.log(`    ${C.green}npm link${C.reset}                ${C.dim}# once${C.reset}`);
console.log(`    ${C.green}grimox create my-app${C.reset}    ${C.dim}# from anywhere${C.reset}\n`);
console.log(`  ${C.bold}Ship a fix to grimox-qa and propagate it:${C.reset}`);
console.log(`    ${C.green}npm run qa:pack${C.reset}        ${C.dim}# atomic: bump version + pack + move${C.reset}\n`);
