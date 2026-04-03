import { Command } from 'commander';
import { selectLLM } from '../core/llm-detector.js';
import { runMigratePrompts } from '../prompts/migrate-prompts.js';
import { migrate } from '../core/migration-engine.js';
import { detectProject } from '../core/project-detector.js';
import { logger } from '../utils/logger.js';

export function migrateCommand() {
    const cmd = new Command('migrate');

    cmd
        .description('Migrar un proyecto existente a un stack moderno')
        .option('--apply', 'Aplicar migración automáticamente (con backup)')
        .option('--plan', 'Solo generar plan sin aplicar cambios')
        .option('--frontend <path>', 'Ruta al frontend (ej: ./client)')
        .option('--backend <path>', 'Ruta al backend (ej: ./server)')
        .action(async (options) => {
            try {
                // 1. Verificar que hay un LLM disponible (obligatorio)
                const selectedLLM = await selectLLM(process.cwd());

                if (!selectedLLM) {
                    // displayLLMWarning ya se mostró dentro de selectLLM
                    process.exit(1);
                }

                // 2. Detectar proyecto
                const manualPaths = {};
                if (options.frontend) manualPaths.frontend = options.frontend;
                if (options.backend) manualPaths.backend = options.backend;

                const detection = await detectProject(process.cwd(), manualPaths);

                // 3. Flujo interactivo de migración
                const config = await runMigratePrompts(detection, options);

                if (!config) return;

                // 4. Agregar LLM seleccionado al config
                config.llm = selectedLLM;

                // 5. Ejecutar migración
                await migrate(config, options);
            } catch (err) {
                if (err.message === 'USER_CANCELLED') {
                    logger.warn('Operación cancelada.');
                    return;
                }
                logger.error(`Error: ${err.message}`);
                process.exit(1);
            }
        });

    return cmd;
}
