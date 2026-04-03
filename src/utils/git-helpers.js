import { downloadTemplate } from 'giget';
import { execSync } from 'node:child_process';
import { GITHUB_BASE } from './constants.js';
import { logger } from './logger.js';

/**
 * Clona un template desde GitHub usando giget
 * @param {string} repo - Nombre del repo (sin org), ej: "nextjs-15-ts"
 * @param {string} dest - Directorio destino
 * @param {object} [options]
 * @param {boolean} [options.force] - Sobrescribir si existe
 */
export async function cloneTemplate(repo, dest, options = {}) {
    const source = `${GITHUB_BASE}/${repo}`;

    logger.step(`Clonando template ${repo}...`);

    const result = await downloadTemplate(source, {
        dir: dest,
        force: options.force ?? false,
    });

    return result;
}

/**
 * Inicializa un repositorio git en el directorio dado
 * @param {string} dir
 */
export function initGit(dir) {
    try {
        execSync('git init', { cwd: dir, stdio: 'ignore' });
        execSync('git add -A', { cwd: dir, stdio: 'ignore' });
        execSync('git commit -m "Initial commit (Grimox CLI)"', { cwd: dir, stdio: 'ignore' });
        logger.step('Repositorio git inicializado');
    } catch {
        logger.warn('No se pudo inicializar git');
    }
}
