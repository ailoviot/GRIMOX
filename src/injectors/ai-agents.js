import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { writeFileSafe } from '../utils/fs-helpers.js';
import { hasUI } from './mcp-config.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..', '..');

/**
 * Inyecta sub-agents de Claude Code (.claude/agents/*.md) en el proyecto
 * generado.
 *
 * Por ahora solo inyecta grimox-qa para proyectos con UI. Los sub-agents
 * son específicos de Claude Code — otros IDEs (Cursor/Windsurf/Copilot)
 * reciben el flujo QA aplanado dentro de .cursorrules y copilot-instructions.md
 * (ver integrations/).
 */
export async function inject(projectPath, config) {
    if (!hasUI(config)) {
        logger.info('AI agents: proyecto sin UI, skip grimox-qa');
        return;
    }

    const sourcePath = join(REPO_ROOT, '.claude', 'agents', 'grimox-qa.md');
    let content;
    try {
        content = readFileSync(sourcePath, 'utf8');
    } catch (err) {
        logger.warn(`AI agents: no se pudo leer grimox-qa.md desde ${sourcePath}: ${err.message}`);
        return;
    }

    await writeFileSafe(
        join(projectPath, '.claude', 'agents', 'grimox-qa.md'),
        content
    );
}
