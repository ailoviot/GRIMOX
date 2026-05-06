import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, existsSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { writeFileSafe, ensureDir } from '../utils/fs-helpers.js';
import { findStackById } from '../registry/stacks.js';
import { hasUI } from './mcp-config.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..', '..');
const GRIMOX_QA_TARBALL = join(REPO_ROOT, 'templates', '_vendor', 'grimox-qa.tgz');

/**
 * Inyecta el CLI grimox-qa en proyectos con UI.
 *
 * Qué hace:
 *   1. Agrega `grimox-qa` como devDependency al package.json
 *   2. Agrega scripts: qa, postbuild, dev:qa
 *   3. Crea .grimox/qa-plan.yml con smoke tests iniciales
 *   4. Crea .grimox/.gitignore (ignorar evidencia, attempts.json)
 *
 * Cómo habilita one-shot:
 *   El postbuild hook de npm ejecuta grimox-qa automáticamente tras cada
 *   `npm run build`. Si falla, exit code != 0 → el LLM no puede reportar
 *   "funcionando" sin corregir. Universal para cualquier IDE (Claude Code,
 *   Cursor, Antigravity, Trae, Copilot, OpenCode).
 */
export async function inject(projectPath, config) {
    if (!hasUI(config)) {
        logger.info('QA CLI: proyecto sin UI, skip grimox-qa');
        return;
    }

    const stackId = config.isDecoupled ? config.frontend?.stackId : config.stackId;
    const port = detectPort(stackId);

    const vendorRef = await copyVendorTarball(projectPath);

    await modifyPackageJson(projectPath, port, vendorRef);
    await createQAPlan(projectPath, config, port);
    await createGitignore(projectPath);
    await createConfigYml(projectPath);
    await createReadme(projectPath);
    await createHelpScript(projectPath);
}

/**
 * Copia el tarball de grimox-qa al proyecto en .vendor/grimox-qa.tgz.
 * Esto permite que `npm install` resuelva la dep sin tocar el npm registry
 * (importante porque grimox-qa no está publicado todavía).
 *
 * Si el tarball no existe en templates/_vendor/, se retorna fallback al
 * spec de npm registry — el LLM verá el error y podrá pedir ayuda al usuario.
 *
 * @returns {string} spec para devDependencies (file:.vendor/... o ^0.1.0)
 */
async function copyVendorTarball(projectPath) {
    if (!existsSync(GRIMOX_QA_TARBALL)) {
        logger.warn('QA CLI: tarball vendor no encontrado, usando spec de npm registry');
        logger.warn(`  Esperado en: ${GRIMOX_QA_TARBALL}`);
        logger.warn('  Genera con: cd packages/grimox-qa && npm pack && mv *.tgz ../../templates/_vendor/grimox-qa.tgz');
        return '^0.1.0';
    }

    const vendorDir = join(projectPath, '.vendor');
    if (!existsSync(vendorDir)) mkdirSync(vendorDir, { recursive: true });
    copyFileSync(GRIMOX_QA_TARBALL, join(vendorDir, 'grimox-qa.tgz'));
    return 'file:.vendor/grimox-qa.tgz';
}

function detectPort(stackId) {
    const portMap = {
        'nextjs-15': 3000,
        'nuxt-4': 3000,
        'sveltekit': 5173,
        'react-vite': 5173,
        'vue-vite': 5173,
        'svelte-vite': 5173,
        'angular': 4200,
        'astro': 4321,
        'docusaurus': 3000,
        'vitepress': 5173,
    };
    return portMap[stackId] || 3000;
}

async function modifyPackageJson(projectPath, port, vendorRef) {
    const pkgPath = join(projectPath, 'package.json');
    if (!existsSync(pkgPath)) {
        logger.warn('QA CLI: package.json no encontrado, skip');
        return;
    }

    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

    pkg.devDependencies = { ...(pkg.devDependencies || {}), 'grimox-qa': vendorRef };

    pkg.scripts = pkg.scripts || {};

    // NO tocamos el script `dev` — dejamos el del framework (next dev, vite, etc).
    // El LLM puede usar `npm run dev` o `npx next dev -p XXXX`: al daemon no le importa.
    // El daemon detecta CUALQUIER dev server que se abra en puertos comunes.

    // Comandos de QA disponibles
    if (!pkg.scripts.qa) {
        pkg.scripts.qa = 'grimox-qa --dynamic';
    }
    if (!pkg.scripts.postbuild) {
        // --dynamic: reusa browser del daemon si existe (con overlays Dev Studio activos).
        // --auto-server: si dev server no está vivo (típico tras build), arranca production
        // server temporal en puerto 3100 y apunta QA ahí. Tras QA lo mata.
        // Resuelve el conflicto dev+build en Windows (EPERM en .next/trace).
        pkg.scripts.postbuild = 'grimox-qa --dynamic --auto-server';
    }

    // Hooks que garantizan estado limpio antes de dev/build.
    // npm ejecuta predev/prebuild AUTOMÁTICAMENTE antes de dev/build.
    if (!pkg.scripts.predev) {
        // predev: spawnea daemon (idempotente — no crea duplicados)
        pkg.scripts.predev = 'grimox-daemon spawn-detached || true';
    }
    if (!pkg.scripts.prebuild) {
        // prebuild: mata dev server si está vivo (libera .next/ en Windows) y spawnea daemon.
        // grimox-daemon kill-dev: mata procesos node ocupando puertos de dev comunes.
        pkg.scripts.prebuild = 'grimox-daemon kill-dev && grimox-daemon spawn-detached || true';
    }
    if (!pkg.scripts['dev:studio']) {
        // Alternativa opcional: usa grimox-dev-studio en vez del dev raw del framework.
        // Útil si el usuario quiere feedback durante el desarrollo (no solo tras build).
        pkg.scripts['dev:studio'] = 'grimox-dev-studio';
    }
    if (!pkg.scripts['daemon:stop']) {
        pkg.scripts['daemon:stop'] = 'grimox-daemon stop';
    }
    if (!pkg.scripts['daemon:status']) {
        pkg.scripts['daemon:status'] = 'grimox-daemon status';
    }
    if (!pkg.scripts['daemon:demo']) {
        // Modo demo: arranca daemon + abre browser con overlays INMEDIATAMENTE,
        // sin esperar dev server. Útil para test rápido del mecanismo.
        pkg.scripts['daemon:demo'] = 'grimox-daemon demo';
    }
    if (!pkg.scripts['daemon:purge']) {
        // Limpieza manual total: mata daemons + chromiums + next start/dev zombies.
        // Útil cuando notas zombies acumulados o quieres arrancar 100% fresh.
        pkg.scripts['daemon:purge'] = 'grimox-daemon purge-all';
    }
    if (!pkg.scripts['dev:fresh']) {
        // Arranque fresco: purga total + dev. Usar cuando quieras estado limpio
        // garantizado (sin preservar daemons de sesiones anteriores).
        pkg.scripts['dev:fresh'] = 'grimox-daemon purge-all && npm run dev';
    }
    if (!pkg.scripts['build:fresh']) {
        // Build fresco: purga total + build. Mismo propósito que dev:fresh.
        pkg.scripts['build:fresh'] = 'grimox-daemon purge-all && npm run build';
    }
    if (!pkg.scripts['grimox:help']) {
        // Imprime resumen formateado de todos los scripts y CLIs Grimox del proyecto.
        // El usuario lo invoca cuando no recuerda qué comando usar.
        pkg.scripts['grimox:help'] = 'node scripts/grimox-help.mjs';
    }

    // Postinstall:
    //   1. Muestra el banner informativo
    //   2. Arranca el daemon en background (detached) — vive durante toda la sesión
    //      y aparece automáticamente cuando detecta dev server o cambios de archivos
    //
    // El daemon es INVISIBLE al LLM: no lo ve en stdout del npm install (va a /dev/null),
    // no lo ve en procesos del proyecto. Simplemente cuando el LLM arranca un dev server,
    // el browser aparece "mágicamente" con animaciones.
    if (!pkg.scripts.postinstall) {
        // `&&` es universal en npm scripts (npm corre scripts con sh en Unix/Git-Bash
        // y con cmd en Windows, ambos soportan &&). Añadimos `|| true` al final por si
        // el daemon spawn falla en algún entorno (no queremos romper npm install).
        pkg.scripts.postinstall = 'grimox-banner && grimox-daemon spawn-detached || true';
    }

    writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + '\n');
}

async function createQAPlan(projectPath, config, port) {
    const hasAuth = config.database === 'supabase' || config.database === 'firebase' || config.features?.includes('security');

    const authBlock = hasAuth ? `
# Credenciales de prueba. Actualiza con un usuario seed real.
# Puedes usar variables de entorno: value: \${QA_TEST_PASSWORD}
auth:
  testUser:
    email: demo@test.local
    password: demo12345
  loginUrl: /login
  fields:
    email: '#email'
    password: '#password'
    submit: 'button[type=submit]'
  redirectTo: /dashboard
` : '';

    const plan = `# grimox-qa plan — plan de tests visuales
#
# Este archivo es editado por el LLM durante /grimox-dev para agregar flows
# específicos de cada feature. Puedes editarlo manualmente también.
#
# Docs: https://github.com/jhonalex949/GRIMOX/tree/main/packages/grimox-qa

version: 1
baseUrl: http://localhost:${port}

# autoDiscover: descubre rutas del proyecto automáticamente y hace smoke tests
# (status 2xx/3xx + no console errors) en cada una. Útil como baseline.
autoDiscover: true
${authBlock}
# Flows específicos. Agrega uno por feature relevante.
# Ejemplo completo:
#
# flows:
#   - name: "Home loads"
#     url: /
#     steps:
#       - assert: { text_visible: "Bienvenido" }
#
#   - name: "Login exitoso"
#     steps:
#       - login: { as: demo }
#       - assert: { url_contains: /dashboard }
#
#   - name: "Crear item"
#     steps:
#       - login: { as: demo }
#       - goto: /items/new
#       - fill: { selector: '#title', value: 'QA test' }
#       - click: 'button[type=submit]'
#       - assert: { text_visible: 'QA test' }

flows: []
`;

    await writeFileSafe(join(projectPath, '.grimox', 'qa-plan.yml'), plan);
}

async function createGitignore(projectPath) {
    const content = `# Evidencia del QA (screenshots, videos, trazas) — local, no commitear
qa-evidence/

# Contador de intentos consecutivos — local
attempts.json

# Config personal (preferencias del usuario)
config.local.yml
`;

    await writeFileSafe(join(projectPath, '.grimox', '.gitignore'), content);
}

async function createConfigYml(projectPath) {
    const content = `# grimox-qa config — opcional, sobrescribe defaults
#
# Descomenta para customizar. Todos estos valores también se pueden
# pasar como flags al CLI (--headless, etc.).

# Forzar modo (default: auto-detectar display)
# headless: false

# Directorio de evidencia (default: .grimox/qa-evidence)
# evidence: .grimox/qa-evidence

# Reintentos por flow flaky (default: 2)
# retries: 2

# Timeout por step en ms (default: 10000)
# timeout: 10000
`;

    await writeFileSafe(join(projectPath, '.grimox', 'config.yml'), content);
}

async function createReadme(projectPath) {
    const content = `# .grimox/ — QA visual autónomo

Esta carpeta contiene la configuración de \`grimox-qa\`, el CLI que prueba
automáticamente tu app en browser real tras cada \`npm run build\`.

## Archivos

- **qa-plan.yml** — plan de tests (editable). Auto-discovery + flows custom.
- **config.yml** — preferencias (headless, timeout, retries).
- **qa-evidence/** — screenshots/videos de tests fallidos (gitignored).
- **attempts.json** — contador de fallos consecutivos (gitignored).

## Cómo funciona

\`\`\`bash
npm run build
# ├── build del framework (next, nuxt, vite...)
# └── postbuild: grimox-qa --headless
#     ├── auto-discover rutas
#     ├── smoke test cada ruta (200 + sin console errors)
#     ├── ejecutar flows de qa-plan.yml
#     └── exit 0 (pasó) | 1 (falló) | 2 (escalation tras 3 intentos)
\`\`\`

## Modos

\`\`\`bash
npm run qa           # manual, browser visible (headed por default en desktop)
npm run dev:qa       # dev server + QA en paralelo (watch)
npm run build        # QA automático tras build (headless)
\`\`\`

## Docs

https://github.com/jhonalex949/GRIMOX/tree/main/packages/grimox-qa
`;

    await writeFileSafe(join(projectPath, '.grimox', 'README.md'), content);
}

/**
 * Creates scripts/grimox-help.mjs — a script that prints a formatted summary
 * of all npm scripts + Grimox CLIs + PowerShell tips + common workflows.
 * The user invokes it with `npm run grimox:help` when they forget which command to use.
 */
async function createHelpScript(projectPath) {
    const content = `#!/usr/bin/env node
// Prints a summary of all commands available in this project.
// Usage: npm run grimox:help

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

const C = {
    reset: '\\x1b[0m', bold: '\\x1b[1m', dim: '\\x1b[2m',
    cyan: '\\x1b[36m', green: '\\x1b[32m', yellow: '\\x1b[33m', magenta: '\\x1b[35m',
};

const DESC = {
    dev: 'Starts the dev server + the daemon (visible browser with Studio overlays).',
    build: 'Builds for production. When done, automatically triggers QA (postbuild).',
    start: 'Serves the production build.',
    lint: 'Runs the framework linter on the project.',
    qa: 'Runs visual QA reusing the already-open browser daemon. Requires "npm run dev" running in another terminal.',
    'dev:studio': 'Starts only the Dev Studio (no dev server). Useful if you want the visible browser pointing to another server.',
    'daemon:stop': 'Stops the daemon manually.',
    'daemon:status': 'Shows whether the daemon is alive and on what port/PID.',
    'daemon:demo': 'Starts daemon + opens browser immediately with overlays for test/demo.',
    'daemon:purge': 'Kills ALL Grimox daemons + Playwright chromiums on the system. For zombie cleanup.',
    'dev:fresh': 'Purges zombie daemon + starts dev clean. Use if "npm run dev" hangs or the browser does not appear.',
    'build:fresh': 'Purges zombie daemon + runs a clean build.',
    'grimox:help': 'Shows this help.',
    postinstall: 'Auto hook after "npm install". Shows banner + launches daemon.',
    predev: 'Auto hook before "npm run dev". Launches the daemon in background.',
    prebuild: 'Auto hook before "npm run build". Kills processes on dev ports and relaunches daemon.',
    postbuild: 'Auto hook after "npm run build". Spins up a temp server and runs QA against it.',
};

const isHook = (n) => ['postinstall', 'postbuild', 'predev', 'prebuild'].includes(n);

console.log(\`
\${C.magenta}\${C.bold}╔══════════════════════════════════════════════════════════════╗
║  Grimox · Available commands in this project                 ║
╚══════════════════════════════════════════════════════════════╝\${C.reset}

\${C.cyan}\${C.bold}1) npm scripts you invoke yourself  \${C.dim}(npm run <script>)\${C.reset}
\`);

const scripts = pkg.scripts || {};
const userFacing = [], hooks = [];
for (const [name, cmd] of Object.entries(scripts)) {
    if (isHook(name)) hooks.push([name, cmd]);
    else userFacing.push([name, cmd]);
}

for (const [name, cmd] of userFacing) {
    const desc = DESC[name] || \`\${C.dim}(no description · runs: \${cmd})\${C.reset}\`;
    console.log(\`  \${C.green}\${C.bold}npm run \${name}\${C.reset}\`);
    console.log(\`    \${C.dim}\${desc}\${C.reset}\\n\`);
}

if (hooks.length) {
    console.log(\`\${C.yellow}\${C.bold}2) Auto hooks  \${C.dim}(npm fires them itself — do not invoke manually)\${C.reset}\\n\`);
    for (const [name] of hooks) {
        const desc = DESC[name] || '';
        console.log(\`  \${C.yellow}\${name}\${C.reset}  \${C.dim}→ \${desc}\${C.reset}\`);
    }
    console.log();
}

console.log(\`\${C.cyan}\${C.bold}3) Grimox CLIs via npx  \${C.dim}(one-off uses without a script wrapper)\${C.reset}\\n\`);
console.log(\`  \${C.green}npx grimox-qa --help\${C.reset}        \${C.dim}— all QA flags\${C.reset}\`);
console.log(\`  \${C.green}npx grimox-daemon --help\${C.reset}    \${C.dim}— daemon subcommands\${C.reset}\`);
console.log(\`  \${C.green}npx grimox-dev-studio\${C.reset}       \${C.dim}— start only the dev studio\${C.reset}\`);
console.log(\`  \${C.green}npx grimox-banner\${C.reset}           \${C.dim}— show the install ASCII banner\${C.reset}\`);
console.log();

console.log(\`\${C.cyan}\${C.bold}4) PowerShell tips (Windows)\${C.reset}\\n\`);
console.log(\`  \${C.dim}• "&&" does not work in PowerShell 5.x → use ";" or "if (\\$?) { ... }".\${C.reset}\`);
console.log(\`  \${C.dim}• grimox-* binaries live in node_modules\\\\.bin → invoke them via\${C.reset}\`);
console.log(\`  \${C.dim}  "npm run <script>" or "npx grimox-<something>".\${C.reset}\`);
console.log(\`  \${C.dim}• "rm -rf" does not exist → use "Remove-Item -Recurse -Force <path>".\${C.reset}\`);
console.log();

console.log(\`\${C.cyan}\${C.bold}5) Common workflows\${C.reset}\\n\`);
console.log(\`  \${C.bold}Daily development:\${C.reset}\`);
console.log(\`    \${C.dim}Terminal 1 →\${C.reset} \${C.green}npm run dev\${C.reset}\`);
console.log(\`    \${C.dim}Terminal 2 →\${C.reset} \${C.green}npm run qa\${C.reset}      \${C.dim}# when you want to run QA\${C.reset}\\n\`);
console.log(\`  \${C.bold}Something hung (zombie browser, lost daemon):\${C.reset}\`);
console.log(\`    \${C.green}npm run dev:fresh\${C.reset}\\n\`);
console.log(\`  \${C.bold}CI-style final validation:\${C.reset}\`);
console.log(\`    \${C.green}npm run build\${C.reset}        \${C.dim}# postbuild triggers QA against prod automatically\${C.reset}\\n\`);
console.log(\`  \${C.bold}Diagnose daemon:\${C.reset}\`);
console.log(\`    \${C.green}npm run daemon:status\${C.reset}    \${C.dim}# is it alive?\${C.reset}\`);
console.log(\`    \${C.green}npm run daemon:purge\${C.reset}     \${C.dim}# kill everything and start clean\${C.reset}\\n\`);
`;

    await writeFileSafe(join(projectPath, 'scripts', 'grimox-help.mjs'), content);
}
