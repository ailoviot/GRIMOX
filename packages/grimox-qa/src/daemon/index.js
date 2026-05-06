import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import pc from 'picocolors';
import { writePidFile, removePidFile, isDaemonAlive } from './pid-manager.js';
import { PortPoller } from './port-poller.js';
import { FileWatcher } from './file-watcher.js';
import { IpcServer } from './ipc-server.js';
import { BrowserManager } from './browser-manager.js';

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 min sin dev server activo → auto-kill

/**
 * Lee el puerto del proyecto desde .grimox/qa-plan.yml.
 * Devuelve null si el archivo no existe o no tiene baseUrl parseable.
 *
 * Cuando el proyecto declara su puerto, el daemon SOLO ese puerto — evita
 * detectar otros servicios del usuario (Evolution API, MQTT brokers, etc.)
 * que puedan estar respondiendo en puertos genéricos como :8080.
 */
function readProjectPort(cwd) {
    try {
        const yml = readFileSync(join(cwd, '.grimox', 'qa-plan.yml'), 'utf8');
        const m = yml.match(/^\s*baseUrl:\s*https?:\/\/[^:\s]+:(\d+)/m);
        return m ? Number(m[1]) : null;
    } catch {
        return null;
    }
}

/**
 * Orquestador del daemon.
 * Vive en background durante toda la sesión de desarrollo.
 *
 * @param {object} opts
 * @param {boolean} opts.standby - si true, abre browser en modo standby inmediatamente
 *                                 (no espera dev server). Útil para demo/test.
 */
export async function runDaemon(opts = {}) {
    const cwd = process.cwd();

    if (isDaemonAlive()) {
        console.log(pc.dim('[grimox-daemon] a daemon is already running in this project'));
        process.exit(0);
    }

    console.log(pc.magenta(pc.bold('🧪 Grimox Daemon')));
    console.log(pc.dim(`   cwd: ${cwd}`));
    console.log(pc.dim(`   Watching dev server ports and file changes…`));

    writePidFile(process.pid);

    const browserMgr = new BrowserManager();

    let lastServerSeenAt = Date.now();
    let currentBaseUrl = null;

    const chokidar = (await import('chokidar')).default;

    const watcher = new FileWatcher({
        chokidar,
        cwd,
        onChange: async (events) => {
            if (currentBaseUrl) {
                await browserMgr.onFileEvents(events, { baseUrl: currentBaseUrl });
            }
        },
    });

    const projectPort = readProjectPort(cwd);
    const pollerOpts = {};
    if (projectPort) {
        pollerOpts.ports = [projectPort];
        console.log(pc.dim(`   Project port from qa-plan.yml: :${projectPort} (only this port will be polled)`));
    }

    const poller = new PortPoller({
        ...pollerOpts,
        onFound: async (port) => {
            currentBaseUrl = `http://localhost:${port}`;
            lastServerSeenAt = Date.now();
            console.log(pc.cyan(`[daemon] dev server detected on :${port}`));
            try {
                await browserMgr.ensure(currentBaseUrl);
                console.log(pc.green(`[daemon] browser active with overlays`));
            } catch (err) {
                console.error(pc.red(`[daemon] failed to launch browser: ${err.message}`));
            }
        },
    });

    const ipc = new IpcServer({
        handlers: {
            STATUS: () => ({
                alive: true,
                baseUrl: currentBaseUrl,
                cdp: browserMgr.getCdpInfo(),
                takenOver: browserMgr.takenOver,
            }),
            GET_BROWSER: () => browserMgr.getCdpInfo(),
            TAKE_OVER: () => {
                browserMgr.setTakenOver(true);
                return { ok: true };
            },
            RELEASE: () => {
                browserMgr.setTakenOver(false);
                return { ok: true };
            },
            SHUTDOWN: () => {
                setTimeout(() => cleanup(0), 100);
                return { ok: true };
            },
        },
    });

    watcher.start();
    poller.start();
    ipc.start();

    // Modo standby: abrir browser inmediatamente con overlays (útil para demo/test)
    if (opts.standby) {
        console.log(pc.cyan('[daemon] STANDBY mode — opening browser with overlays…'));
        try {
            await browserMgr.openStandby();
            console.log(pc.green('[daemon] standby browser active — waiting for dev server'));
        } catch (err) {
            console.error(pc.red(`[daemon] failed to open standby browser: ${err.message}`));
        }
    }

    // Watchdog doble:
    //   (1) Si el puerto queda muerto > IDLE_TIMEOUT (15min) → auto-kill
    //   (2) Si el browser murió (Playwright browser.isConnected() === false) →
    //       auto-kill en vez de quedarse en loop con cdp=null. Esto evita zombie
    //       daemons (un bug anterior en Windows: browser se cierra solo y el
    //       daemon no se daba cuenta).
    const idleCheck = setInterval(() => {
        // (2) Browser dead check
        const browserDead = browserMgr.browser && !browserMgr.browser.isConnected?.();
        if (browserDead && !browserMgr.takenOver) {
            console.log(pc.dim('[daemon] browser closed externally — auto-kill'));
            cleanup(0);
            return;
        }

        // (1) Idle timeout
        if (!currentBaseUrl) {
            if (Date.now() - lastServerSeenAt > IDLE_TIMEOUT_MS) {
                console.log(pc.dim('[daemon] no activity > 15min — auto-kill'));
                cleanup(0);
            }
        } else {
            lastServerSeenAt = Date.now();
        }
    }, 5000);

    async function cleanup(code = 0) {
        clearInterval(idleCheck);
        poller.stop();
        await watcher.stop();
        ipc.stop();
        await browserMgr.close();
        removePidFile();
        process.exit(code);
    }

    process.on('SIGINT', () => cleanup(0));
    process.on('SIGTERM', () => cleanup(0));
    process.on('uncaughtException', (err) => {
        console.error(pc.red(`[daemon] uncaught: ${err.message}`));
        cleanup(1);
    });

    // Mantener vivo
    return new Promise(() => {});
}
