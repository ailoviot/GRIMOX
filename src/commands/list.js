import { Command } from 'commander';
import pc from 'picocolors';
import { stacks } from '../registry/stacks.js';
import { databases } from '../registry/databases.js';

export function listCommand() {
    const cmd = new Command('list');

    cmd
        .description('Mostrar todos los stacks y frameworks disponibles')
        .action(() => {
            console.log();
            console.log(pc.magenta(pc.bold('  Grimox CLI — Stacks Disponibles')));
            console.log();

            for (const [categoryId, category] of Object.entries(stacks)) {
                console.log(pc.cyan(pc.bold(`  ${category.label}`)));

                category.entries.forEach((entry, i) => {
                    const isLast = i === category.entries.length - 1;
                    const prefix = isLast ? '  └──' : '  ├──';
                    const langLabel = entry.autoLanguage
                        || (entry.languageOptions ? entry.languageOptions.join(' / ') : 'JS / TS');
                    const lang = pc.gray(langLabel);
                    const desc = pc.dim(entry.description || '');

                    console.log(`${prefix} ${pc.white(entry.name.padEnd(22))} ${lang.padEnd(30)} ${desc}`);
                });

                console.log();
            }

            // Bases de datos
            console.log(pc.cyan(pc.bold('  Bases de Datos')));
            const dbNames = databases.map((db) => db.name).join(' | ');
            console.log(`  ${pc.white(dbNames)}`);
            console.log();
        });

    return cmd;
}
