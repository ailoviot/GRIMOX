import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { normalize } from 'node:path';

const execAsync = promisify(exec);

/**
 * Detecta el IDE desde cuya terminal integrada se ejecuta el CLI.
 * Retorna { binary, workspaceFolder } o null si no hay IDE detectable.
 */
export function detectIDE() {
    const env = process.env;

    const isVSCodeFamily =
        env.TERM_PROGRAM === 'vscode' ||
        Boolean(env.VSCODE_GIT_IPC_HANDLE) ||
        Boolean(env.VSCODE_IPC_HOOK_CLI);

    if (!isVSCodeFamily) return null;

    let binary;
    let name;
    if (env.CURSOR_TRACE_ID) {
        binary = 'cursor';
        name = 'Cursor';
    } else if (env.WINDSURF_USER_DATA_DIR || env.WINDSURF_VERSION) {
        binary = 'windsurf';
        name = 'Windsurf';
    } else {
        binary = 'code';
        name = 'VSCode';
    }

    const workspaceFolder = env.VSCODE_CWD || null;

    return { binary, name, workspaceFolder };
}

/**
 * Verifica si un binario está disponible en el PATH.
 */
export async function isBinaryAvailable(binary) {
    const cmd = process.platform === 'win32' ? `where ${binary}` : `command -v ${binary}`;
    try {
        await execAsync(cmd);
        return true;
    } catch {
        return false;
    }
}

/**
 * Compara dos paths normalizando trailing slashes y, en Windows, casing.
 */
export function pathsAreEqual(a, b) {
    if (!a || !b) return false;
    const normA = normalize(a).replace(/[/\\]+$/, '');
    const normB = normalize(b).replace(/[/\\]+$/, '');
    if (process.platform === 'win32') {
        return normA.toLowerCase() === normB.toLowerCase();
    }
    return normA === normB;
}
