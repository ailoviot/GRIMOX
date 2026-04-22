import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { chokidarWatcher, detectFrameworkCmd, mapFileToRoute } from './dev-studio-utils.js';
import {
    injectStudioOverlays,
    updateStudioStatus,
    showStudioToast,
    pulseAmbient,
    flashResult,
} from './animations.js';
import pc from 'picocolors';

const READY_PATTERNS = {
    next: /Ready in \d+|Local:\s+http/i,
    nuxt: /Local:\s+http|Nuxt ready/i,
    vite: /Local:\s+http|ready in/i,
    sveltekit: /Local:\s+http/i,
    angular: /Angular Live Development Server|compiled successfully/i,
    astro: /watching for file changes|Local:\s+http/i,
};

/**
 * Dev Studio — reemplazo de `npm run dev` que arranca dev server + browser
 * visible con animaciones + file watcher. Es el comando que SIEMPRE corre el
 * LLM para arrancar desarrollo. El browser aparece automáticamente.
 */
export async function runDevStudio(opts = {}) {
    const cwd = opts.cwd || process.cwd();
    const { chromium } = await import('playwright');
    const chokidar = await import('chokidar');

    const framework = detectFrameworkCmd(cwd);
    if (!framework) {
        console.error(pc.red('[grimox-dev-studio] No se detectó framework soportado en package.json'));
        console.error(pc.dim('Supported: Next.js, Nuxt, SvelteKit, Vite, Angular, Astro'));
        process.exit(1);
    }

    // Propagar argumentos extra al comando del framework (ej: -p 3000, --turbo)
    // El usuario los pasa con: npm run dev -- -p 3000
    const extraArgs = opts.extraArgs || process.argv.slice(2);
    const finalArgs = [...framework.args, ...extraArgs];

    console.log(pc.magenta(pc.bold('\n🧪 Grimox Dev Studio')));
    console.log(pc.dim(`   Framework: ${framework.name} · puerto esperado: ${framework.port}`));
    if (extraArgs.length > 0) {
        console.log(pc.dim(`   Args extra: ${extraArgs.join(' ')}`));
    }
    console.log(pc.dim(`   Iniciando dev server…\n`));

    // 1. Arrancar dev server del framework
    const devProc = spawn(framework.cmd, finalArgs, {
        cwd,
        shell: true,
        stdio: ['inherit', 'pipe', 'pipe'],
        env: { ...process.env, FORCE_COLOR: '1' },
    });

    let browserLaunched = false;
    let readyDetected = false;
    let actualPort = framework.port;
    const readyPattern = READY_PATTERNS[framework.kind] || READY_PATTERNS.next;
    // Parse real del puerto (frameworks saltan si 3000 está ocupado)
    const portPattern = /(?:Local:\s+http:\/\/localhost:|http:\/\/localhost:|localhost:)(\d+)/;

    const forwardOutput = (stream, target) => {
        stream.on('data', async (chunk) => {
            const text = chunk.toString();
            target.write(text);

            // Parsear puerto real de la salida del framework
            const portMatch = text.match(portPattern);
            if (portMatch) {
                const p = Number(portMatch[1]);
                if (p && p !== actualPort) {
                    actualPort = p;
                }
            }

            // Detectar ready signal y lanzar browser una sola vez
            if (!readyDetected && readyPattern.test(text)) {
                readyDetected = true;
                setTimeout(() => launchBrowserAndWatcher().catch(console.error), 800);
            }
        });
    };

    forwardOutput(devProc.stdout, process.stdout);
    forwardOutput(devProc.stderr, process.stderr);

    let browser = null;
    let page = null;
    let watcher = null;

    async function launchBrowserAndWatcher() {
        if (browserLaunched) return;
        browserLaunched = true;

        const baseUrl = `http://localhost:${actualPort}`;
        console.log(pc.cyan(`\n[studio] Abriendo browser en ${baseUrl}`));

        try {
            browser = await chromium.launch({
                headless: false,
                args: ['--disable-blink-features=AutomationControlled'],
            });
        } catch (err) {
            console.error(pc.red('[studio] No se pudo lanzar Chromium:'), err.message);
            console.error(pc.dim('        ¿Falta Chromium? Ejecuta: npx playwright install chromium'));
            return;
        }

        const context = await browser.newContext({
            viewport: { width: 1280, height: 800 },
            ignoreHTTPSErrors: true,
        });

        page = await context.newPage();

        // Capturar errores del browser y enviarlos al stdout del LLM
        page.on('pageerror', (err) => {
            console.log(pc.red(`[studio] Error en página: ${err.message}`));
            updateStudioStatus(page, { status: 'error', mode: 'error' }).catch(() => {});
            showStudioToast(page, {
                text: 'Error en runtime',
                path: err.message.slice(0, 80),
                type: 'error',
                durationMs: 4000,
            }).catch(() => {});
        });

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                const text = msg.text();
                // Ignorar ruido típico de Next dev
                if (!text.includes('Download the React DevTools') && !text.includes('Fast Refresh')) {
                    console.log(pc.yellow(`[studio] console.error: ${text.slice(0, 150)}`));
                }
            }
        });

        page.on('response', (res) => {
            if (res.status() >= 500) {
                const url = new URL(res.url()).pathname;
                console.log(pc.red(`[studio] ${res.status()} ${res.request().method()} ${url}`));
                showStudioToast(page, {
                    text: `HTTP ${res.status()}`,
                    path: url,
                    type: 'error',
                    durationMs: 3500,
                }).catch(() => {});
            }
        });

        // Navegación inicial + overlays
        try {
            await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
            await injectStudioOverlays(page, { route: '/', status: 'listo' });
            console.log(pc.green('[studio] Browser listo con overlays activos'));
        } catch (err) {
            console.error(pc.red('[studio] Error al navegar:'), err.message);
        }

        // Reinyectar overlays en cada nueva navegación (framework client-side nav o full reload)
        page.on('framenavigated', async (frame) => {
            if (frame !== page.mainFrame()) return;
            const url = new URL(frame.url());
            await injectStudioOverlays(page, { route: url.pathname, status: 'listo' });
        });

        // 2. File watcher
        watcher = chokidarWatcher(chokidar.default || chokidar, cwd);
        console.log(pc.cyan(`[studio] File watcher activo sobre src/**\n`));

        let debounceTimer = null;
        watcher.on('change', async (filePath) => {
            const rel = relative(cwd, filePath).replace(/\\/g, '/');
            console.log(pc.dim(`[studio] cambio: ${rel}`));

            // Actividad visible
            if (page && !page.isClosed()) {
                updateStudioStatus(page, { status: 'compiling', mode: 'activity' }).catch(() => {});
                showStudioToast(page, {
                    text: 'Archivo modificado',
                    path: rel,
                    type: 'info',
                    durationMs: 2500,
                }).catch(() => {});
                pulseAmbient(page).catch(() => {});
            }

            // Debounce — esperar a que batch de cambios termine
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                if (!page || page.isClosed()) return;

                const targetRoute = mapFileToRoute(rel);
                const currentPath = new URL(page.url()).pathname;

                try {
                    // HMR usualmente ya refrescó. Si el archivo mapea a una ruta distinta,
                    // opcionalmente navegar. Pero NO robar foco al usuario — solo si el path
                    // exacto cambió + fue un nuevo componente principal (page.tsx, +page.svelte).
                    if (targetRoute && targetRoute !== currentPath && isNewPageFile(rel)) {
                        await page.goto(`${baseUrl}${targetRoute}`, { waitUntil: 'domcontentloaded' });
                    }

                    // Flash verde suave tras HMR successful
                    await page.waitForTimeout(400);
                    await flashResult(page, 'pass').catch(() => {});
                    await updateStudioStatus(page, { status: 'listo', mode: null });
                } catch (err) {
                    console.log(pc.red(`[studio] error tras cambio: ${err.message}`));
                    await updateStudioStatus(page, { status: 'error', mode: 'error' }).catch(() => {});
                }
            }, 600);
        });

        watcher.on('add', (filePath) => {
            const rel = relative(cwd, filePath).replace(/\\/g, '/');
            if (page && !page.isClosed() && (rel.endsWith('.tsx') || rel.endsWith('.ts') || rel.endsWith('.vue') || rel.endsWith('.svelte'))) {
                console.log(pc.dim(`[studio] nuevo archivo: ${rel}`));
                showStudioToast(page, {
                    text: 'Archivo nuevo',
                    path: rel,
                    type: 'success',
                    durationMs: 2000,
                }).catch(() => {});
            }
        });
    }

    // Handle browser cerrado por el usuario
    process.on('SIGINT', async () => {
        console.log(pc.dim('\n[studio] Cerrando…'));
        await cleanup();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        await cleanup();
        process.exit(0);
    });

    async function cleanup() {
        if (watcher) await watcher.close().catch(() => {});
        if (browser) await browser.close().catch(() => {});
        if (devProc && !devProc.killed) {
            try {
                if (process.platform === 'win32') {
                    spawn('taskkill', ['/pid', String(devProc.pid), '/t', '/f']);
                } else {
                    devProc.kill('SIGTERM');
                }
            } catch {}
        }
    }

    devProc.on('exit', async (code) => {
        console.log(pc.dim(`\n[studio] Dev server terminó (exit ${code})`));
        await cleanup();
        process.exit(code ?? 0);
    });

    // Keep alive
    return new Promise(() => {});
}

function isNewPageFile(relPath) {
    // Considera "página principal nueva" solo si es un archivo top-level de una ruta
    return /\/(page|index|\+page)\.(tsx|jsx|ts|js|vue|svelte)$/i.test(relPath);
}
