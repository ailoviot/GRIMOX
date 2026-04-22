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
