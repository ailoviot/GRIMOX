#!/usr/bin/env node
import { parseArgs } from '../src/args.js';

const args = parseArgs(process.argv.slice(2));

if (args.help) {
    console.log(`
grimox-qa — QA visual autónomo con Playwright

USO:
  grimox-qa [opciones]

OPCIONES:
  --url <url>              URL base del dev server (default: detectar del package.json)
  --plan <path>            Archivo de plan YAML (default: .grimox/qa-plan.yml)
  --headed / --headless    Forzar modo visible/headless (default: auto-detectar display)
  --retries <n>            Reintentos por flow flaky (default: 2)
  --timeout <ms>           Timeout por step (default: 10000)
  --no-auto-close          No cerrar browser tras pass (default: cerrar si todos pasan)
  --auto-discover / --no-auto-discover
                           Descubrir rutas automáticamente (default: true)
  --evidence <dir>         Directorio de screenshots/videos (default: .grimox/qa-evidence)
  --animations <nivel>     full | minimal | off  (default: full en headed, off en headless)
                           full    = banner + highlight + progress + flash
                           minimal = solo banner
                           off     = sin overlays
  --reset                  Resetear contador de intentos (.grimox/attempts.json)
  --version                Ver versión
  --help                   Ver esta ayuda

EXIT CODES:
  0  todos los flows pasaron
  1  al menos un flow falló
  2  escalación: mismo flow falló 3 veces consecutivas (requiere intervención)

EJEMPLOS:
  grimox-qa                              # run default con auto-discover
  grimox-qa --headed                     # forzar browser visible
  grimox-qa --headless                   # forzar headless (CI)
  grimox-qa --plan custom.yml            # usar plan customizado
  grimox-qa --reset && grimox-qa         # reset counter y re-run

MÁS INFO: https://github.com/jhonalex949/GRIMOX
`);
    process.exit(0);
}

if (args.version) {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, join } = await import('node:path');
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
    console.log(`grimox-qa ${pkg.version}`);
    process.exit(0);
}

try {
    const { runQA } = await import('../src/runner.js'); // lazy — carga playwright solo al correr
    const exitCode = await runQA(args);
    process.exit(exitCode);
} catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND' && err.message.includes('playwright')) {
        console.error('\x1b[31m[grimox-qa] Playwright no está instalado.\x1b[0m');
        console.error('Ejecuta: npm install');
        console.error('(o si instalaste grimox-qa globalmente: npm install -g playwright)');
        process.exit(1);
    }
    console.error('\x1b[31m[grimox-qa] Error fatal:\x1b[0m', err.message);
    if (process.env.DEBUG) {
        console.error(err.stack);
    }
    process.exit(1);
}
