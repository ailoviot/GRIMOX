import { chromium } from 'playwright';
import { mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { loadConfig, resolveHeadedMode, detectBaseUrl } from './config.js';
import { discoverRoutes } from './discovery.js';
import { loadAttempts, saveAttempts, updateAttempts, resetAttempts } from './attempts.js';
import * as report from './reporter.js';
import { executeFlow } from './flow-executor.js';
import { completeProgress, updateStudioStatus } from './animations.js';
import { ipcRequest } from './daemon/ipc-server.js';

/**
 * Punto de entrada principal del CLI.
 *
 * Flujo:
 *   1. Cargar config (defaults + qa-plan.yml + args)
 *   2. Detectar URL base y modo headed/headless
 *   3. Verificar que el dev server responde
 *   4. Auto-descubrir rutas (si habilitado)
 *   5. Ejecutar smoke tests de rutas
 *   6. Ejecutar flows del plan
 *   7. Actualizar contador de intentos
 *   8. Reportar con exit code apropiado
 *
 * @returns {Promise<number>} exit code (0 pass, 1 fail, 2 escalation)
 */
export async function runQA(args) {
    if (args.reset) {
        resetAttempts();
        report.info('Contador de intentos reseteado (.grimox/attempts.json)');
    }

    const config = loadConfig(args);
    const mode = resolveHeadedMode(args);

    if (!config.baseUrl || config.baseUrl === 'http://localhost:3000') {
        config.baseUrl = detectBaseUrl();
    }

    ensureDir(args.evidence);

    report.header(config, mode);

    // Sanity check del dev server
    let serverOk = await pingServer(config.baseUrl, args.timeout);
    let autoServerProc = null;

    if (!serverOk && args.autoServer) {
        // Postbuild típico: el dev fue matado antes del build. Arrancamos production
        // server temporal en un puerto libre y apuntamos el QA ahí.
        const result = await startAutoServer({
            port: args.autoServerPort,
            cmd: args.autoServerCmd,
            timeoutMs: 30000,
        });
        if (!result) {
            report.warn(`No pude arrancar production server automático en :${args.autoServerPort}`);
            report.warn(`Intenta: npm run start && grimox-qa --url=http://localhost:${args.autoServerPort}`);
            return 1;
        }
        autoServerProc = result.proc;
        config.baseUrl = `http://localhost:${args.autoServerPort}`;
        report.info(`Production server temporal vivo en ${config.baseUrl}`);
        serverOk = true;
    }

    if (!serverOk) {
        report.warn(`Server no responde en ${config.baseUrl}`);
        report.warn(`Arranca el server con: npm run dev  (o pasa --auto-server)`);
        return 1;
    }

    // Auto-discover rutas
    let routes = [];
    if (config.autoDiscover) {
        routes = discoverRoutes();
        if (routes.length > 0) {
            report.info(`${routes.length} rutas descubiertas automáticamente`);
        }
    }

    // Nivel de animaciones: solo aplica en headed (en headless es irrelevante)
    const animations = mode.headed ? (args.animations || 'full') : 'off';

    // --dynamic: intenta reusar el browser del daemon via CDP.
    //
    // Poll con retries: el daemon spawneado en prebuild puede tardar 1-3s en
    // terminar de lanzar Chromium. Sin retries, el postbuild (que corre justo
    // después del build) encuentra CDP null y cae al fallback de browser propio,
    // resultando en DOS browsers visibles en vez de uno.
    let daemonBrowser = null;
    let daemonContext = null;
    if (args.dynamic && mode.headed) {
        const maxAttempts = 6;
        const delayMs = 500;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const daemonInfo = await ipcRequest('GET_BROWSER', {}, { timeoutMs: 1500 });
                // Usamos `endpoint` (URL HTTP del CDP). `wsEndpoint` no está
                // disponible en browsers lanzados con chromium.launch() — solo
                // con launchServer(). connectOverCDP acepta URL HTTP y resuelve
                // internamente el WS endpoint correcto.
                if (daemonInfo && daemonInfo.endpoint) {
                    daemonBrowser = await chromium.connectOverCDP(daemonInfo.endpoint).catch(() => null);
                    if (daemonBrowser) {
                        daemonContext = daemonBrowser.contexts()[0] || await daemonBrowser.newContext();
                        await ipcRequest('TAKE_OVER', {}, { timeoutMs: 1000 });
                        report.info(`Reusando browser del daemon (CDP ${daemonInfo.port}, intento ${attempt})`);
                        break;
                    }
                }
            } catch {
                // Silenciado — reintentamos
            }
            if (attempt < maxAttempts) {
                await new Promise((r) => setTimeout(r, delayMs));
            }
        }
        if (!daemonContext) {
            report.info('Daemon no respondió en 3s — usando browser propio');
        }
    }

    const useDaemonBrowser = Boolean(daemonContext);

    // Smoke tests: cuando hay daemon, reusar la MISMA page para todas las rutas
    // (navega entre ellas sin abrir/cerrar tabs). Sin daemon, browser dedicado.
    const smokeBrowser = useDaemonBrowser ? null : await chromium.launch({ headless: !mode.headed });
    const smokeContext = useDaemonBrowser
        ? daemonContext
        : await smokeBrowser.newContext({
            viewport: { width: 1280, height: 720 },
            ignoreHTTPSErrors: true,
        });

    // Page reutilizada: la del daemon (si existe) o una nueva para smoke.
    // Usarla entre todas las rutas evita la "ráfaga" de tabs abriendo/cerrando.
    const smokeReusePage = useDaemonBrowser
        ? (daemonContext.pages()[0] || await daemonContext.newPage())
        : null;

    const results = [];

    try {
        for (const route of routes) {
            const res = await smokeTestRoute(smokeContext, config, route, args, smokeReusePage);
            results.push(res);
            report.routeResult(
                route.path,
                res.pass ? 'pass' : 'fail',
                res.pass ? `${res.status}` : res.error
            );
        }
    } finally {
        // No cerrar el browser del daemon — es persistente
        if (smokeBrowser && !useDaemonBrowser) {
            await smokeBrowser.close();
        }
    }

    // Flows: política de browser según disponibilidad del daemon.
    //   - Con daemon vivo (--dynamic): reusa la MISMA page del daemon para todos los
    //     flows y retries. El browser queda visible durante todo el ciclo con los
    //     overlays de Grimox Studio — UN solo browser, sin abrir/cerrar por flow.
    //   - Headed sin daemon: browser único compartido para todos los flows (headed).
    //   - Headless (CI): browser compartido estándar.
    const flowsTotal = config.flows.length;

    if (useDaemonBrowser && flowsTotal > 0) {
        // Reusa el browser del daemon — UN browser, UNA page, todos los flows y retries
        const reusePage = daemonContext.pages()[0] || await daemonContext.newPage();
        for (let i = 0; i < config.flows.length; i++) {
            const flow = config.flows[i];
            const res = await runFlowWithRetry(daemonContext, config, flow, args, {
                flowIndex: i + 1,
                flowsTotal,
                animations,
                reusePage,
            });
            results.push(res);
            report.flowResult(flow, res.pass ? 'pass' : 'fail', res.issues || []);
        }
    } else if (flowsTotal > 0) {
        // Sin daemon: UN browser compartido para todos los flows
        const sharedBrowser = await chromium.launch({
            headless: !mode.headed,
            args: mode.headed ? ['--start-maximized'] : [],
        });
        const sharedContext = await sharedBrowser.newContext({
            viewport: mode.headed ? null : { width: 1280, height: 720 },
            ignoreHTTPSErrors: true,
        });
        try {
            for (let i = 0; i < config.flows.length; i++) {
                const flow = config.flows[i];
                const res = await runFlowWithRetry(sharedContext, config, flow, args, {
                    flowIndex: i + 1,
                    flowsTotal,
                    animations: mode.headed ? animations : 'off',
                });
                results.push(res);
                report.flowResult(flow, res.pass ? 'pass' : 'fail', res.issues || []);
            }
        } finally {
            await sharedBrowser.close();
        }
    }

    // Actualizar contador
    const prev = loadAttempts();
    const { attempts, escalated } = updateAttempts(prev, results);
    saveAttempts(attempts);

    // Summary + exit code
    const passed = results.filter((r) => r.pass).length;
    const failed = results.length - passed;

    report.summary({ passed, failed, total: results.length, escalated });

    // Si estábamos reusando el browser del daemon: devolvemos control + actualizamos banner
    if (useDaemonBrowser) {
        try {
            const pages = daemonContext.pages();
            if (pages.length > 0) {
                const finalStatus = failed > 0 ? `QA ${failed} fails` : `Build OK · QA ${passed}/${results.length}`;
                await updateStudioStatus(pages[0], { status: finalStatus, mode: failed > 0 ? 'error' : null }).catch(() => {});
            }
            await ipcRequest('RELEASE', {}, { timeoutMs: 1000 });
        } catch {}
    }

    // Matar production server temporal si lo arrancamos
    if (autoServerProc) {
        try {
            report.info('Apagando production server temporal…');
            autoServerProc.kill('SIGTERM');
            // En Windows, SIGTERM no siempre funciona — force kill tras 2s
            setTimeout(() => {
                try { autoServerProc.kill('SIGKILL'); } catch {}
            }, 2000).unref();
        } catch {}
    }

    if (escalated.length > 0) return 2;
    if (failed > 0) return 1;
    return 0;
}

/**
 * Arranca un production server temporal y espera a que responda.
 * Usado por --auto-server cuando el dev server no está vivo (típico en postbuild).
 *
 * @param {object} opts
 * @param {number} opts.port - puerto donde arrancar (ej 3100)
 * @param {string|null} opts.cmd - comando a ejecutar; null = detectar del package.json
 * @param {number} opts.timeoutMs - tiempo máximo esperando que responda
 * @returns {Promise<{proc: ChildProcess}|null>} proceso vivo si arrancó; null si falló
 */
async function startAutoServer({ port, cmd, timeoutMs }) {
    const resolvedCmd = cmd || detectStartCmd(port);
    if (!resolvedCmd) {
        report.warn('No pude detectar comando de start — pasa --auto-server-cmd="<tu comando>"');
        return null;
    }

    report.info(`Arrancando production server: ${resolvedCmd}`);

    const isWin = process.platform === 'win32';
    const shell = isWin ? 'cmd.exe' : 'sh';
    const shellFlag = isWin ? '/c' : '-c';

    // PORT env var para que el framework lo respete (Next.js, Nuxt, SvelteKit lo soportan)
    const env = { ...process.env, PORT: String(port), NODE_ENV: 'production' };

    const proc = spawn(shell, [shellFlag, resolvedCmd], {
        stdio: ['ignore', 'pipe', 'pipe'],
        env,
        detached: !isWin,
    });

    // Consumir stdout/stderr para no bloquear el buffer; solo loggear errores
    proc.stdout.on('data', () => {});
    proc.stderr.on('data', (chunk) => {
        const text = chunk.toString();
        if (/error|EADDRINUSE|ENOENT/i.test(text)) {
            process.stderr.write(`[auto-server] ${text}`);
        }
    });

    proc.on('exit', (code) => {
        if (code !== null && code !== 0) {
            report.warn(`Production server salió con código ${code}`);
        }
    });

    // Poll hasta que el server responda
    const baseUrl = `http://localhost:${port}`;
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 500));
        if (await pingServer(baseUrl, 1500)) {
            return { proc };
        }
    }

    // Timeout — matar el proceso
    try { proc.kill('SIGKILL'); } catch {}
    return null;
}

/**
 * Detecta el comando de start según el framework.
 * Lee package.json y busca el script "start"; si existe, lo usa con PORT env var.
 * Si no, intenta comandos por framework detectado.
 */
function detectStartCmd(port) {
    const pkgPath = join(process.cwd(), 'package.json');
    if (!existsSync(pkgPath)) return null;

    try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

        // Next.js: preferir `next start -p PORT` directamente sobre el script del usuario.
        // Razón: el script típico `node .next/standalone/server.js` NO sirve assets estáticos
        // (_next/static/), lo que hace que JS client-side retorne 404 y la app no hidrate.
        // `next start` los sirve correctamente, aunque emita un warning con output:standalone.
        if (deps.next) return `npx next start -p ${port}`;

        // Nuxt: preview corre el build (.output/server) con todos los assets
        if (deps.nuxt) return `npx nuxt preview`;

        // SvelteKit: el build produce un server Node completo
        if (deps['@sveltejs/kit']) return `node build/index.js`;

        // NestJS
        if (deps['@nestjs/core']) return 'node dist/main.js';

        // Fallback al script start del usuario si existe
        const scripts = pkg.scripts || {};
        if (scripts.start) return 'npm run start';
    } catch {}
    return null;
}

/**
 * Modo headed: abre un browser dedicado para ESTE flow, lo cierra al terminar.
 * UX dinámica — el usuario ve la ventana aparecer, ejecutar el test, cerrarse.
 */
async function runFlowIsolated(config, flow, args, meta) {
    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized'],
    });
    const context = await browser.newContext({
        viewport: null,
        ignoreHTTPSErrors: true,
    });

    let result;
    try {
        result = await runFlowWithRetry(context, config, flow, args, meta);
    } finally {
        // Pausa breve para que el ojo humano perciba el resultado
        try {
            const pages = context.pages();
            if (pages.length > 0) {
                // En el último flow, progreso a 100%
                if (meta.flowIndex === meta.flowsTotal) {
                    await completeProgress(pages[0]).catch(() => {});
                    await pages[0].waitForTimeout(600);
                } else {
                    await pages[0].waitForTimeout(300);
                }
            }
        } catch {}

        await browser.close().catch(() => {});

        // Pausa entre flows para que se note el "refresh" visual
        if (args.autoClose !== false && meta.flowIndex < meta.flowsTotal) {
            await new Promise((r) => setTimeout(r, 400));
        }
    }
    return result;
}

async function pingServer(url, timeout) {
    // Usamos AbortController manual en vez de AbortSignal.timeout para evitar
    // un bug conocido de undici en Node 21 (ERR_INVALID_STATE: Controller is
    // already closed) que ocurre cuando el timeout se dispara mientras el body
    // aún está en streaming. Además consumimos el body explícitamente con
    // res.text() para asegurar que el stream cierre de forma limpia.
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    try {
        const res = await fetch(url, {
            method: 'GET',
            signal: ctrl.signal,
        });
        await res.text().catch(() => '');
        return res.status < 500;
    } catch {
        return false;
    } finally {
        clearTimeout(timer);
    }
}

async function smokeTestRoute(context, config, route, args, reusePage = null) {
    // Si hay reusePage (modo daemon), navegamos en la MISMA page entre rutas.
    // Si no, creamos una nueva y la cerramos al final.
    const page = reusePage || await context.newPage();
    const consoleErrors = [];
    const onError = (err) => consoleErrors.push(err.message);
    const onConsole = (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); };
    page.on('pageerror', onError);
    page.on('console', onConsole);

    const urlPath = route.path.replace(/:id/g, '1'); // sustituir dinámicos para smoke
    const fullUrl = `${config.baseUrl}${urlPath}`;

    try {
        const response = await page.goto(fullUrl, { timeout: args.timeout, waitUntil: 'domcontentloaded' });
        const status = response?.status() || 0;

        // 2xx o 3xx (redirect esperado para rutas auth) se consideran OK
        const pass = status < 400;

        let screenshot = null;
        if (!pass) {
            screenshot = join(args.evidence, `smoke-${sanitize(route.path)}.png`);
            await page.screenshot({ path: screenshot, fullPage: false });
        }

        return {
            name: `smoke ${route.path}`,
            pass,
            status,
            error: pass ? null : `status ${status}${consoleErrors.length ? ' + console errors' : ''}`,
            consoleErrors,
            screenshot,
        };
    } catch (err) {
        return {
            name: `smoke ${route.path}`,
            pass: false,
            error: err.message,
            consoleErrors,
        };
    } finally {
        // Limpiar listeners (evita acumulación al reusar page) y cerrar solo si
        // la creamos nosotros — si es reusePage, el daemon la conserva.
        page.off('pageerror', onError);
        page.off('console', onConsole);
        if (!reusePage) await page.close();
    }
}

async function runFlowWithRetry(context, config, flow, args, meta = {}) {
    let lastResult = null;
    const reusePage = meta.reusePage || null;

    for (let attempt = 1; attempt <= args.retries + 1; attempt++) {
        // Si reusePage está presente, usamos la MISMA page (del daemon) — no abrimos
        // tabs nuevos. Overlays persisten, el usuario ve un solo browser.
        const page = reusePage || await context.newPage();
        try {
            lastResult = await executeFlow(page, config, flow, args, attempt, meta);
            if (lastResult.pass) return lastResult;
        } catch (err) {
            lastResult = { name: flow.name, pass: false, error: err.message, issues: [{ step: 'fatal', actual: err.message }] };
        } finally {
            if (!reusePage) await page.close();
        }

        if (attempt < args.retries + 1) {
            report.info(`Flow "${flow.name}" falló (intento ${attempt}), reintentando...`);
        }
    }

    return lastResult;
}

function sanitize(s) {
    return s.replace(/[^a-zA-Z0-9]/g, '_') || 'root';
}

function ensureDir(dir) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}
