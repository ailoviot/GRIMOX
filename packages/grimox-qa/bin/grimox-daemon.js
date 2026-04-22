#!/usr/bin/env node
/**
 * grimox-daemon — proceso background que:
 *   - detecta dev servers en puertos comunes
 *   - abre browser visible con overlays
 *   - reacciona a cambios de archivos
 *   - coordina con grimox-qa (postbuild) via IPC
 *
 * Uso:
 *   grimox-daemon start      # arranca (normalmente via postinstall detached)
 *   grimox-daemon stop       # mata el daemon
 *   grimox-daemon status     # dice si vive
 *   grimox-daemon restart    # stop + start
 */

import { readPidFile, isDaemonAlive, killDaemon } from '../src/daemon/pid-manager.js';
import { ipcRequest } from '../src/daemon/ipc-server.js';

const cmd = process.argv[2] || 'start';

if (cmd === '--help' || cmd === '-h' || cmd === 'help') {
    console.log(`
grimox-daemon — Daemon de Grimox para dev browser visible

Comandos:
  start             Arranca el daemon en foreground (usar con &/detached para background)
  demo              Arranca el daemon + abre browser INMEDIATAMENTE con overlays (modo test/demo)
  spawn-detached    Arranca el daemon en background detached (usado por postinstall/predev/prebuild)
  kill-dev          Mata procesos escuchando en puertos dev comunes (3000, 5173, 4200...)
                    — usado por prebuild para evitar EPERM en .next/ en Windows
  purge-all         Mata TODOS los daemons de Grimox + chromiums de Playwright
                    del sistema. Útil cuando hay zombies de sesiones anteriores.
  stop              Mata el daemon
  status            Indica si el daemon vive
  restart           stop + start
`);
    process.exit(0);
}

if (cmd === 'purge-all') {
    // Limpieza total del sistema: mata TODOS los daemons de Grimox, chromiums
    // de Playwright, y `next start/dev` zombies (ocupando puertos).
    // Útil para empezar siempre desde cero antes de cualquier dev/build.
    const { spawnSync } = await import('node:child_process');
    const isWin = process.platform === 'win32';
    let killed = 0;
    const match = (s) =>
        s.includes('grimox-daemon') ||
        (s.includes('ms-playwright') && !s.includes('--type=')) ||
        ((s.includes('next\\dist\\bin\\next') || s.includes('next/dist/bin/next')) &&
            (s.includes(' start') || s.includes(' dev')));
    try {
        if (isWin) {
            const out = spawnSync('wmic', ['process', 'get', 'Name,CommandLine,ProcessId', '/format:csv'], { encoding: 'utf8', timeout: 3000 }).stdout || '';
            const pids = [];
            for (const line of out.split(/\r?\n/)) {
                const m = line.match(/,(\d+)\s*$/);
                if (!m) continue;
                if (match(line)) pids.push(Number(m[1]));
            }
            for (const pid of pids) {
                const r = spawnSync('taskkill', ['/F', '/T', '/PID', String(pid)], { timeout: 2000 });
                if (r.status === 0) killed++;
            }
        } else {
            const out = spawnSync('ps', ['ax', '-o', 'pid=,args='], { encoding: 'utf8', timeout: 3000 }).stdout || '';
            for (const line of out.split('\n')) {
                const m = line.trim().match(/^(\d+)\s+(.*)$/);
                if (!m) continue;
                if (match(m[2])) {
                    try { process.kill(Number(m[1]), 'SIGKILL'); killed++; } catch {}
                }
            }
        }
        const { unlinkSync } = await import('node:fs');
        try { unlinkSync('.grimox/daemon.pid'); } catch {}
        console.log(`purged: ${killed} processes killed`);
    } catch (err) {
        console.error(`[purge-all] ${err.message}`);
        process.exit(1);
    }
    process.exit(0);
}

if (cmd === 'kill-dev') {
    // Mata cualquier proceso escuchando en puertos dev comunes.
    // Útil para prebuild en Windows: `next build` no puede abrir .next/trace si
    // `next dev` todavía lo tiene abierto.
    const { killDevServers } = await import('../src/daemon/port-poller.js');
    try {
        const killed = await killDevServers();
        if (killed.length > 0) {
            console.log(`killed dev server(s) en puertos: ${killed.join(', ')}`);
        } else {
            console.log('no hay dev server corriendo — ok');
        }
    } catch (err) {
        console.error(`[kill-dev] ${err.message}`);
    }
    process.exit(0);
}

if (cmd === 'status') {
    const info = readPidFile();
    if (!info) {
        console.log('not-running');
        process.exit(1);
    }
    const alive = isDaemonAlive();
    if (!alive) {
        console.log('dead (stale PID file)');
        process.exit(1);
    }
    const status = await ipcRequest('STATUS', {}, { timeoutMs: 2000 });
    console.log(`running pid=${info.pid} since=${info.startedAt}`);
    if (status) console.log(JSON.stringify(status, null, 2));
    process.exit(0);
}

if (cmd === 'stop') {
    const resp = await ipcRequest('SHUTDOWN', {}, { timeoutMs: 1000 });
    if (resp) {
        console.log('shutdown signal sent');
    } else {
        if (killDaemon()) console.log('killed');
        else console.log('no daemon running');
    }
    process.exit(0);
}

if (cmd === 'spawn-detached') {
    // Arranca el daemon en modo detached (usado desde postinstall).
    // Sale inmediatamente; el daemon sobrevive en background.
    const { spawnDaemonDetached } = await import('../src/daemon-spawner.js');
    await spawnDaemonDetached();
    process.exit(0);
}

if (cmd === 'restart') {
    await ipcRequest('SHUTDOWN', {}, { timeoutMs: 1000 });
    killDaemon();
}

if (cmd === 'demo') {
    // Modo demo: mata daemon previo si vive + arranca en foreground + abre browser standby
    if (isDaemonAlive()) {
        console.log('daemon previo detectado — reiniciando en modo demo…');
        await ipcRequest('SHUTDOWN', {}, { timeoutMs: 1000 });
        killDaemon();
        await new Promise((r) => setTimeout(r, 1500));
    }
    try {
        const { runDaemon } = await import('../src/daemon/index.js');
        await runDaemon({ standby: true });
    } catch (err) {
        console.error(`[grimox-daemon demo] Error: ${err.message}`);
        process.exit(1);
    }
}

if (cmd === 'start' || cmd === 'restart') {
    if (cmd === 'start' && isDaemonAlive()) {
        console.log('daemon already running');
        process.exit(0);
    }

    // Flag --standby hace que el browser arranque inmediatamente con la landing
    // Grimox Studio (gradient + "esperando dev server") en vez de about:blank.
    // Usado por spawn-detached para mejor UX — el user ve el splash desde el
    // segundo 0, no una ventana vacía durante 2s hasta que el port poller
    // detecta el dev server.
    const standby = process.argv.includes('--standby');

    try {
        const { runDaemon } = await import('../src/daemon/index.js');
        await runDaemon({ standby });
    } catch (err) {
        if (err.code === 'ERR_MODULE_NOT_FOUND') {
            const missing = err.message.match(/Cannot find package '([^']+)'/)?.[1];
            if (missing) {
                console.error(`[grimox-daemon] Falta dependencia: ${missing}`);
                console.error('Ejecuta: npm install');
                process.exit(1);
            }
        }
        console.error(`[grimox-daemon] Error: ${err.message}`);
        process.exit(1);
    }
}
