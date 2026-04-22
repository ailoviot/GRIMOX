/**
 * Poller que detecta cuál puerto tiene un dev server respondiendo.
 * Prueba puertos comunes de frameworks modernos cada N segundos hasta
 * encontrar uno con 2xx o 3xx.
 */

const DEFAULT_PORTS = [3000, 3001, 3100, 3002, 4200, 5173, 4321, 8080];

export class PortPoller {
    constructor({ ports = DEFAULT_PORTS, intervalMs = 2000, onFound } = {}) {
        this.ports = ports;
        this.intervalMs = intervalMs;
        this.onFound = onFound;
        this.running = false;
        this.timer = null;
        this.lastFoundPort = null;
    }

    start() {
        if (this.running) return;
        this.running = true;
        this._tick();
    }

    stop() {
        this.running = false;
        if (this.timer) clearTimeout(this.timer);
        this.timer = null;
    }

    async _tick() {
        if (!this.running) return;

        const found = await this._probeAll();

        if (found && found !== this.lastFoundPort) {
            this.lastFoundPort = found;
            if (this.onFound) {
                try { await this.onFound(found); } catch {}
            }
        } else if (!found && this.lastFoundPort) {
            // dev server murió — reset
            this.lastFoundPort = null;
        }

        if (this.running) {
            this.timer = setTimeout(() => this._tick(), this.intervalMs);
        }
    }

    async _probeAll() {
        for (const port of this.ports) {
            if (await probePort(port)) return port;
        }
        return null;
    }
}

async function probePort(port) {
    // AbortController manual + consumo explícito del body para evitar el bug de
    // undici en Node 21 (ERR_INVALID_STATE: Controller is already closed) que
    // ocurre cuando AbortSignal.timeout dispara mientras el body está en stream.
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1200);
    try {
        const res = await fetch(`http://localhost:${port}/`, {
            method: 'GET',
            signal: ctrl.signal,
            redirect: 'manual',
        });
        await res.text().catch(() => '');
        return res.status < 500;
    } catch {
        return false;
    } finally {
        clearTimeout(timer);
    }
}

/**
 * Mata procesos que estén escuchando en los puertos dev comunes.
 * Usado por `grimox-daemon kill-dev` como prebuild — libera .next/ en Windows
 * para que `next build` pueda abrir sus archivos de trace.
 *
 * @returns {Promise<number[]>} lista de puertos liberados
 */
export async function killDevServers(ports = DEFAULT_PORTS) {
    const { spawn } = await import('node:child_process');
    const isWin = process.platform === 'win32';
    const killed = [];

    for (const port of ports) {
        if (!(await probePort(port))) continue;

        const pid = await findPidOnPort(port);
        if (!pid) continue;

        try {
            if (isWin) {
                await new Promise((resolve) => {
                    const p = spawn('taskkill', ['/F', '/T', '/PID', String(pid)], {
                        stdio: 'ignore',
                    });
                    p.on('exit', () => resolve());
                    p.on('error', () => resolve());
                });
            } else {
                process.kill(pid, 'SIGKILL');
            }
            killed.push(port);
        } catch {}
    }

    return killed;
}

async function findPidOnPort(port) {
    const { spawn } = await import('node:child_process');
    const isWin = process.platform === 'win32';

    return new Promise((resolve) => {
        let output = '';
        const cmd = isWin
            ? spawn('netstat', ['-ano'], { stdio: ['ignore', 'pipe', 'ignore'] })
            : spawn('lsof', ['-i', `:${port}`, '-t'], { stdio: ['ignore', 'pipe', 'ignore'] });

        cmd.stdout.on('data', (chunk) => { output += chunk.toString(); });
        cmd.on('exit', () => {
            if (isWin) {
                // netstat output: "TCP 0.0.0.0:3000 ... LISTENING 1234"
                const lines = output.split(/\r?\n/);
                const re = new RegExp(`[: ]${port}\\s+\\S+\\s+LISTENING\\s+(\\d+)`);
                for (const line of lines) {
                    const m = line.match(re);
                    if (m) return resolve(Number(m[1]));
                }
                resolve(null);
            } else {
                const pid = parseInt(output.trim().split(/\s+/)[0], 10);
                resolve(isNaN(pid) ? null : pid);
            }
        });
        cmd.on('error', () => resolve(null));
    });
}
