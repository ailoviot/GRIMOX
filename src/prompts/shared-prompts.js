import * as p from '@clack/prompts';
import { getCompatibleDatabases } from '../registry/databases.js';
import { getApplicableFeatures } from '../registry/features.js';
import { getCompatibleStyles } from '../registry/styles.js';

/**
 * Verifica si el usuario canceló (Ctrl+C)
 */
export function handleCancel(value) {
    if (p.isCancel(value)) {
        throw new Error('USER_CANCELLED');
    }
    return value;
}

/**
 * Prompt para seleccionar base de datos
 * @param {string[]} compatibleIds - IDs de DBs compatibles
 */
export async function promptDatabase(compatibleIds) {
    const dbs = getCompatibleDatabases(compatibleIds);

    if (dbs.length === 0) return null;

    const options = [
        ...dbs.map((db) => ({
            value: db.id,
            label: db.name,
            hint: db.description,
        })),
        { value: 'none', label: 'Sin base de datos', hint: 'Solo el framework, sin DB' },
    ];

    const dbChoice = await p.select({
        message: '¿Base de datos?',
        options,
    });

    return handleCancel(dbChoice) === 'none' ? null : dbChoice;
}

/**
 * Prompt para seleccionar lenguaje cuando no es auto
 * @param {string[]} [languageOptions] - Opciones custom (ej: ['Java', 'Kotlin'])
 */
export async function promptLanguage(languageOptions) {
    const options = languageOptions
        ? languageOptions.map((lang) => ({ value: lang, label: lang }))
        : [
            { value: 'TypeScript', label: 'TypeScript', hint: 'Recomendado' },
            { value: 'JavaScript', label: 'JavaScript' },
        ];

    const lang = await p.select({
        message: '¿Lenguaje?',
        options,
    });

    return handleCancel(lang);
}

/**
 * Prompt para personalizar features (cuando el usuario elige "Personalizar")
 * @param {string} categoryId
 */
export async function promptCustomizeFeatures(categoryId) {
    const applicable = getApplicableFeatures(categoryId);

    const selected = await p.multiselect({
        message: '¿Qué features deseas incluir?',
        options: applicable.map((f) => ({
            value: f.id,
            label: f.name,
            hint: f.description,
        })),
        initialValues: applicable.filter((f) => f.defaultEnabled).map((f) => f.id),
    });

    return handleCancel(selected);
}

/**
 * Prompt para seleccionar placa IoT
 * @param {string[]} boardOptions
 */
export async function promptBoard(boardOptions) {
    if (!boardOptions || boardOptions.length === 0) return null;

    const board = await p.select({
        message: '¿Para qué placa?',
        options: boardOptions.map((b) => ({ value: b, label: b })),
    });

    return handleCancel(board);
}

/**
 * Prompt para seleccionar framework/enfoque de estilos CSS.
 * Solo se muestra cuando aplica (web, mobile, desktop — no IoT, CLI, Data/IA).
 *
 * @param {string} categoryId — categoría del stack
 * @param {string|null} [recommended] — ID del estilo recomendado (ej: 'tailwind')
 * @returns {Promise<string|null>} ID del estilo elegido, o null si no aplica
 */
export async function promptStyles(categoryId, recommended = 'tailwind') {
    const compatible = getCompatibleStyles(categoryId);

    // No aplica para IoT, CLI, Data/IA
    if (compatible.length === 0) return null;

    const options = compatible.map((s) => ({
        value: s.id,
        label: s.id === recommended
            ? `${s.name} (Recomendado)`
            : s.name,
        hint: s.description,
    }));

    const choice = await p.select({
        message: '¿Qué framework de estilos CSS deseas usar?',
        options,
    });

    return handleCancel(choice);
}
