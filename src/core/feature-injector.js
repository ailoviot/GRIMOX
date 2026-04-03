import { generateIDEIntegrations } from '../integrations/index.js';
import { logger } from '../utils/logger.js';

/**
 * Mapa de feature IDs a módulos injectors (lazy import)
 */
const injectorMap = {
    'docker': () => import('../injectors/docker.js'),
    'cicd': () => import('../injectors/cicd.js'),
    'ai-skills': () => import('../injectors/ai-skills.js'),
    'mcp': () => import('../injectors/mcp-config.js'),
    'security': () => import('../injectors/security.js'),
    'ui-styling': () => import('../injectors/ui-styling.js'),
    'database': () => import('../injectors/database.js'),
};

/**
 * Inyecta todas las features seleccionadas + integraciones IDE
 * @param {string} projectPath
 * @param {object} config
 */
export async function injectFeatures(projectPath, config) {
    const featureIds = config.features || [];

    for (const featureId of featureIds) {
        const loader = injectorMap[featureId];
        if (!loader) {
            logger.warn(`Injector desconocido: ${featureId}`);
            continue;
        }

        try {
            const module = await loader();
            await module.inject(projectPath, config);
        } catch (err) {
            logger.warn(`No se pudo inyectar ${featureId}: ${err.message}`);
        }
    }

    // Siempre generar integraciones IDE (Claude Code, Cursor, Antigravity, Trae, etc.)
    try {
        await generateIDEIntegrations(projectPath, config);
    } catch (err) {
        logger.warn(`No se pudieron generar integraciones IDE: ${err.message}`);
    }
}
