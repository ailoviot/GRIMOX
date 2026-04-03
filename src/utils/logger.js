import pc from 'picocolors';

export const logger = {
    info: (msg) => console.log(pc.cyan(`  ${msg}`)),
    success: (msg) => console.log(pc.green(`  ${msg}`)),
    warn: (msg) => console.log(pc.yellow(`  ${msg}`)),
    error: (msg) => console.log(pc.red(`  ${msg}`)),
    step: (msg) => console.log(pc.gray(`  ${msg}`)),
    brand: (msg) => console.log(pc.magenta(pc.bold(msg))),
};
