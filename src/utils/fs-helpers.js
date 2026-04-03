import { mkdir, writeFile, readFile, access, cp } from 'node:fs/promises';
import { join, dirname } from 'node:path';

/**
 * Crea un directorio recursivamente si no existe
 * @param {string} dirPath
 */
export async function ensureDir(dirPath) {
    await mkdir(dirPath, { recursive: true });
}

/**
 * Escribe un archivo creando directorios intermedios si es necesario
 * @param {string} filePath
 * @param {string} content
 */
export async function writeFileSafe(filePath, content) {
    await ensureDir(dirname(filePath));
    await writeFile(filePath, content, 'utf-8');
}

/**
 * Lee un archivo JSON y retorna el objeto parseado
 * @param {string} filePath
 * @returns {Promise<object|null>}
 */
export async function readJson(filePath) {
    try {
        const raw = await readFile(filePath, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

/**
 * Verifica si un archivo o directorio existe
 * @param {string} path
 * @returns {Promise<boolean>}
 */
export async function exists(path) {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

/**
 * Copia un directorio recursivamente
 * @param {string} src
 * @param {string} dest
 */
export async function copyDir(src, dest) {
    await cp(src, dest, { recursive: true });
}
