import { Command } from 'commander';
import pc from 'picocolors';
import { createCommand } from './commands/create.js';
import { migrateCommand } from './commands/migrate.js';
import { listCommand } from './commands/list.js';
import { VERSION, CLI_NAME } from './utils/constants.js';

const BANNER = `
${pc.magenta(pc.bold('  ╭─────────────────────────────────╮'))}
${pc.magenta(pc.bold('  │'))}  ${pc.magenta('🔮 Grimox CLI')} ${pc.dim(`v${VERSION}`)}            ${pc.magenta(pc.bold('│'))}
${pc.magenta(pc.bold('  │'))}  ${pc.dim('Intelligent Project Generator')}   ${pc.magenta(pc.bold('│'))}
${pc.magenta(pc.bold('  ╰─────────────────────────────────╯'))}
`;

export function run(argv) {
    const program = new Command();

    program
        .name(CLI_NAME)
        .description('CLI inteligente para crear y migrar aplicaciones modernas')
        .version(VERSION, '-v, --version')
        .hook('preAction', () => {
            console.log(BANNER);
        });

    program.addCommand(createCommand());
    program.addCommand(migrateCommand());
    program.addCommand(listCommand());

    program.parse(argv);
}
