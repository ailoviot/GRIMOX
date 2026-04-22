import { createServer, createConnection } from 'node:net';
import { unlinkSync, existsSync } from 'node:fs';

/**
 * IPC simple entre el daemon y el CLI grimox-qa (postbuild) para coordinar:
 *   - grimox-qa pregunta al daemon "¿tienes browser?" (GET_BROWSER)
 *   - grimox-qa avisa "estoy tomando control" (TAKE_OVER)
 *   - grimox-qa avisa "terminé" (RELEASE)
 *   - daemon responde con CDP endpoint o null
 *
 * Usa:
 *   - Unix: Unix socket en .grimox/daemon.sock
 *   - Windows: named pipe \\?\pipe\grimox-daemon-<hash>
 */

const SOCKET_PATH = process.platform === 'win32'
    ? `\\\\.\\pipe\\grimox-daemon-${simpleHash(process.cwd())}`
    : '.grimox/daemon.sock';

function simpleHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return Math.abs(h).toString(36);
}

export function getIpcPath() {
    return SOCKET_PATH;
}

export class IpcServer {
    constructor({ handlers = {} } = {}) {
        this.handlers = handlers;
        this.server = null;
    }

    start() {
        if (this.server) return;

        // Limpia socket viejo si quedó
        if (process.platform !== 'win32' && existsSync(SOCKET_PATH)) {
            try { unlinkSync(SOCKET_PATH); } catch {}
        }

        this.server = createServer((socket) => {
            let buffer = '';
            socket.on('data', async (chunk) => {
                buffer += chunk.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const msg = JSON.parse(line);
                        const handler = this.handlers[msg.type];
                        const response = handler
                            ? await handler(msg.payload || {})
                            : { error: `unknown type: ${msg.type}` };
                        socket.write(JSON.stringify({ id: msg.id, response }) + '\n');
                    } catch (err) {
                        socket.write(JSON.stringify({ error: err.message }) + '\n');
                    }
                }
            });
            socket.on('error', () => {});
        });

        this.server.on('error', () => {});
        this.server.listen(SOCKET_PATH);
    }

    stop() {
        if (this.server) {
            try { this.server.close(); } catch {}
            this.server = null;
        }
        if (process.platform !== 'win32' && existsSync(SOCKET_PATH)) {
            try { unlinkSync(SOCKET_PATH); } catch {}
        }
    }
}

/**
 * Cliente IPC simple para que grimox-qa (postbuild) hable con el daemon.
 */
export async function ipcRequest(type, payload = {}, { timeoutMs = 3000 } = {}) {
    return new Promise((resolve) => {
        let settled = false;
        const timer = setTimeout(() => {
            if (settled) return;
            settled = true;
            try { client.destroy(); } catch {}
            resolve(null);
        }, timeoutMs);

        const client = createConnection(SOCKET_PATH, () => {
            const id = Math.random().toString(36).slice(2, 10);
            client.write(JSON.stringify({ id, type, payload }) + '\n');

            let buffer = '';
            client.on('data', (chunk) => {
                buffer += chunk.toString();
                const lines = buffer.split('\n');
                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const msg = JSON.parse(line);
                        if (msg.id === id || !msg.id) {
                            if (!settled) {
                                settled = true;
                                clearTimeout(timer);
                                resolve(msg.response ?? null);
                                try { client.end(); } catch {}
                            }
                        }
                    } catch {}
                }
            });
        });

        client.on('error', () => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve(null);
        });
    });
}
