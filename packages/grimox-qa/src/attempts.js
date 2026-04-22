import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ATTEMPTS_PATH = '.grimox/attempts.json';
const ESCALATION_THRESHOLD = 3;

/**
 * Lleva cuenta de intentos consecutivos fallidos por flow.
 * Si un flow falla 3 veces seguidas → escalación (exit code 2).
 */
export function loadAttempts() {
    if (!existsSync(ATTEMPTS_PATH)) return {};
    try {
        return JSON.parse(readFileSync(ATTEMPTS_PATH, 'utf8'));
    } catch {
        return {};
    }
}

export function saveAttempts(attempts) {
    const dir = dirname(ATTEMPTS_PATH);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(ATTEMPTS_PATH, JSON.stringify(attempts, null, 2));
}

export function resetAttempts() {
    if (existsSync(ATTEMPTS_PATH)) {
        writeFileSync(ATTEMPTS_PATH, '{}');
    }
}

/**
 * Actualiza el contador tras un run. Retorna flows en estado "escalated".
 *
 * @param {object} attempts - estado previo
 * @param {Array<{name, pass}>} results - resultados del run actual
 * @returns {{ attempts: object, escalated: string[] }}
 */
export function updateAttempts(attempts, results) {
    const next = { ...attempts };
    const escalated = [];

    for (const r of results) {
        if (r.pass) {
            delete next[r.name];
        } else {
            const count = (next[r.name]?.count || 0) + 1;
            next[r.name] = { count, lastError: r.error || null, lastRun: new Date().toISOString() };
            if (count >= ESCALATION_THRESHOLD) {
                escalated.push(r.name);
            }
        }
    }

    return { attempts: next, escalated };
}
