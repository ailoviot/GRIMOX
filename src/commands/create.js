import { Command } from 'commander';
import { runCreatePrompts } from '../prompts/create-prompts.js';
import { scaffold } from '../core/template-engine.js';
import { logger } from '../utils/logger.js';

export function createCommand() {
    const cmd = new Command('create');

    cmd
        .description('Crear un nuevo proyecto con stack moderno')
        .argument('[name]', 'Nombre del proyecto')
        .option('--yes', 'Usar configuración por defecto sin preguntar')
        .action(async (name, options) => {
            try {
                const config = await runCreatePrompts(name, options);

                if (!config) return; // usuario canceló

                await scaffold(config);
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
