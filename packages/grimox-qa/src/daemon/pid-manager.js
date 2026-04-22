import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const PID_PATH = '.grimox/daemon.pid';

export function writePidFile(pid, extra = {}) {
    const dir = dirname(PID_PATH);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const payload = {
        pid,
        startedAt: new Date().toISOString(),
        cwd: process.cwd(),
        ...extra,
    };
    writeFileSync(PID_PATH, JSON.stringify(payload, null, 2));
}

export function readPidFile() {
    if (!existsSync(PID_PATH)) return null;
    try {
        return JSON.parse(readFileSync(PID_PATH, 'utf8'));
    } catch {
        return null;
    }
}

export function removePidFile() {
    if (existsSync(PID_PATH)) {
        try { unlinkSync(PID_PATH); } catch {}
    }
}

/**
 * Verifica si el proceso del PID file está efectivamente vivo.
 * En Windows y Unix: intenta `kill -0 pid` (no mata, solo verifica).
 */
export function isDaemonAlive() {
    const info = readPidFile();
    if (!info) return false;

    try {
        process.kill(info.pid, 0);
        return true;
    } catch {
        // PID no existe o no tenemos permiso → limpiamos el PID file huérfano
        removePidFile();
        return false;
    }
}

export function killDaemon() {
    const info = readPidFile();
    if (!info) return false;

    try {
        process.kill(info.pid, 'SIGTERM');
        setTimeout(() => {
            try { process.kill(info.pid, 'SIGKILL'); } catch {}
        }, 2000);
        removePidFile();
        return true;
    } catch {
        removePidFile();
        return false;
    }
}
