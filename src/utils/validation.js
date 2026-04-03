/**
 * Valida que el nombre del proyecto sea válido para npm/filesystem
 * @param {string} name
 * @returns {string|undefined} mensaje de error o undefined si es válido
 */
export function validateProjectName(name) {
    if (!name || name.trim().length === 0) {
        return 'El nombre del proyecto no puede estar vacío';
    }

    if (!/^[a-z0-9][a-z0-9._-]*$/.test(name)) {
        return 'El nombre debe empezar con letra minúscula o número, y solo contener a-z, 0-9, -, _, .';
    }

    if (name.length > 214) {
        return 'El nombre no puede exceder 214 caracteres';
    }
}
