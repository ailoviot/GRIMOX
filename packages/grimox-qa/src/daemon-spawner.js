import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { openSync, readFileSync } from 'node:fs';
import { mkdirSync, existsSync } from 'node:fs';
import { isDaemonAlive, killDaemon } from './daemon/pid-manager.js';
import { ipcRequest } from './daemon/ipc-server.js';

/**
 * Arranca el daemon en modo detached desde postinstall/predev/prebuild.
 *
 * Lógica (idempotente):
 *   1. Si NO hay daemon → spawn fresh con --standby (browser con splash).
 *   2. Si hay daemon VIVO y su browser está vivo (cdp no-null) → skip (ya sirve).
 *   3. Si hay daemon VIVO pero su browser murió (cdp=null) → matar daemon
 *      fantasma y spawn fresh. Este caso es el "zombie con browser muerto"
 *      que hacía que el postbuild grimox-qa cayera al fallback de browser
 *      propio en vez de reusar el del daemon.
 *
 * IMPORTANTE: silencia stdout/stderr al daemon.log para no contaminar output
 * del npm install.
 */
export async function spawnDaemonDetached() {
    try {
        // (A) Identifica el PID del daemon "oficial" de este proyecto — el que
        // está en .grimox/daemon.pid y con browser vivo. Lo preservamos.
        let ourPid = null;
        if (isDaemonAlive()) {
            const status = await ipcRequest('STATUS', {}, { timeoutMs: 1500 });
            if (status && status.cdp) {
                try {
                    const info = JSON.parse(readFileSync('.grimox/daemon.pid', 'utf8'));
                    ourPid = info.pid;
                } catch {}
            } else {
                // daemon vivo pero browser muerto → matar para spawn fresh
                await ipcRequest('SHUTDOWN', {}, { timeoutMs: 500 }).catch(() => {});
                await new Promise((r) => setTimeout(r, 300));
                killDaemon();
                await new Promise((r) => setTimeout(r, 200));
            }
        }

        // (B) Mata todos los daemons "foráneos" (de otros proyectos o zombies).
        // Un daemon por proyecto es la regla; los demás confunden la UX
        // (múltiples browsers visibles con overlays Grimox Studio pero inertes).
        killForeignDaemons(ourPid);

        // (C) Si preservamos un daemon oficial vivo, terminamos — ya sirve.
        if (ourPid) return;

        const __dirname = dirname(fileURLToPath(import.meta.url));
        const daemonBin = resolve(__dirname, '..', 'bin', 'grimox-daemon.js');

        const grimoxDir = '.grimox';
        if (!existsSync(grimoxDir)) mkdirSync(grimoxDir, { recursive: true });

        const logPath = `${grimoxDir}/daemon.log`;
        const out = openSync(logPath, 'a');
        const err = openSync(logPath, 'a');

        // --standby: browser arranca inmediatamente con splash Grimox Studio.
        const child = spawn(process.execPath, [daemonBin, 'start', '--standby'], {
            cwd: process.cwd(),
            detached: true,
            stdio: ['ignore', out, err],
            windowsHide: true,
        });

        child.unref();
    } catch {
        // Si falla arrancar el daemon, no rompemos el npm install / build
    }
}

/**
 * Enumera procesos node.exe con "grimox-daemon" en command line y mata todos
 * excepto el PID preservado (el daemon oficial del proyecto actual).
 *
 * También mata los chromiums de Playwright huérfanos (hijos del browser.launch
 * de esos daemons muertos) que quedan visibles en pantalla con overlays Grimox
 * pero sin controlador — la causa principal del "múltiples browsers parásitos".
 */
function killForeignDaemons(preservePid) {
    const isWin = process.platform === 'win32';

    try {
        let daemonPids = [];
        let chromePids = [];
        let nextServerPids = [];

        if (isWin) {
            const result = spawnSync(
                'wmic',
                ['process', 'get', 'Name,CommandLine,ProcessId,ParentProcessId', '/format:csv'],
                { encoding: 'utf8', timeout: 3000 }
            );
            const lines = (result.stdout || '').split(/\r?\n/);
            for (const line of lines) {
                // Daemons de grimox
                if (line.includes('grimox-daemon') && line.includes('node.exe')) {
                    const pidMatch = line.match(/,(\d+),(\d+)\s*$/);
                    if (pidMatch) {
                        const pid = Number(pidMatch[2]);
                        if (pid !== preservePid && pid !== process.pid) daemonPids.push(pid);
                    }
                }
                // Chromiums de Playwright (root, sin --type=)
                if (line.includes('ms-playwright') && line.includes('chrome.exe') && !line.includes('--type=')) {
                    const pidMatch = line.match(/,(\d+),(\d+)\s*$/);
                    if (pidMatch) chromePids.push(Number(pidMatch[2]));
                }
                // `next start -p PORT` zombies de auto-server previos.
                // Estos responden en el puerto y confunden al port poller del
                // daemon nuevo, que los interpreta como dev server válido.
                if ((line.includes('next\\dist\\bin\\next') || line.includes('next/dist/bin/next'))
                    && (line.includes(' start ') || line.includes(' start\t') || line.includes(' start"'))) {
                    const pidMatch = line.match(/,(\d+),(\d+)\s*$/);
                    if (pidMatch) nextServerPids.push(Number(pidMatch[2]));
                }
            }
        } else {
            const result = spawnSync('ps', ['ax', '-o', 'pid=,args='], {
                encoding: 'utf8',
                timeout: 3000,
            });
            const lines = (result.stdout || '').split('\n');
            for (const line of lines) {
                const pidMatch = line.trim().match(/^(\d+)\s+(.*)$/);
                if (!pidMatch) continue;
                const pid = Number(pidMatch[1]);
                const args = pidMatch[2];
                if (args.includes('grimox-daemon') && args.includes('node') && pid !== preservePid && pid !== process.pid) {
                    daemonPids.push(pid);
                }
                if (args.includes('ms-playwright') && args.includes('chrome') && !args.includes('--type=')) {
                    chromePids.push(pid);
                }
                if (args.includes('next/dist/bin/next') && args.includes(' start ')) {
                    nextServerPids.push(pid);
                }
            }
        }

        const killPid = (pid) => {
            if (isWin) spawnSync('taskkill', ['/F', '/T', '/PID', String(pid)], { timeout: 2000 });
            else { try { process.kill(pid, 'SIGKILL'); } catch {} }
        };

        // Mata daemons parásitos con árbol (mata también sus chromiums hijos)
        daemonPids.forEach(killPid);

        // Mata `next start` zombies — estos confunden al port poller con puertos
        // "ocupados" por servers que realmente no pertenecen a este proyecto.
        nextServerPids.forEach(killPid);

        // Chromiums huérfanos: solo si no hay daemon oficial que preservar
        if (!preservePid) {
            chromePids.forEach(killPid);
        }
    } catch {
        // Enumeración falló — no abortar, solo skip
    }
}
