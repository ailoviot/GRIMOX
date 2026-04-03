import { generateClaudeCodeIntegration } from './claude-code.js';
import { generateCursorIntegration } from './cursor.js';
import { logger } from '../utils/logger.js';

/**
 * Genera todas las integraciones de IDE para un proyecto
 * @param {string} projectPath
 * @param {object} config — configuración del proyecto
 */
export async function generateIDEIntegrations(projectPath, config) {
    // GRIMOX.md + .ai/skills/ (universal) + .claude/commands/ (adaptador Claude Code)
    await generateClaudeCodeIntegration(projectPath, config);

    // .ai/rules.md (universal) + .cursorrules (Cursor/Windsurf/Trae/Antigravity)
    //                           + .github/copilot-instructions.md (GitHub Copilot)
    await generateCursorIntegration(projectPath, config);
}

export { generateClaudeCodeIntegration } from './claude-code.js';
export { generateCursorIntegration } from './cursor.js';
