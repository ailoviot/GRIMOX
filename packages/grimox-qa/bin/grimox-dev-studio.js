#!/usr/bin/env node
/**
 * grimox-dev-studio — reemplaza `npm run dev` con dev server + browser
 * visible con overlays animados + file watcher.
 *
 * Uso:
 *   grimox-dev-studio              # auto-detect framework
 *
 * Este comando se configura automáticamente en el package.json del proyecto
 * scaffoldeado por Grimox (script "dev" apunta a este binario).
 */

if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
grimox-dev-studio — Dev server + browser visible con animaciones

Reemplaza 'npm run dev' en proyectos Grimox. Arranca automáticamente:
  • El dev server del framework (next dev, nuxt dev, vite, etc.)
  • Chromium visible conectado al dev server
  • Overlays persistentes con estado LIVE
  • File watcher con reacciones visuales a cambios

No requiere argumentos. Auto-detecta Next.js / Nuxt / SvelteKit / Vite / Angular / Astro.

Para silenciar: no uses este comando, usa 'npx next dev' directo (pierdes el studio).
`);
    process.exit(0);
}

if (process.argv.includes('--version') || process.argv.includes('-v')) {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, join } = await import('node:path');
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
    console.log(`grimox-dev-studio ${pkg.version}`);
    process.exit(0);
}

try {
    const { runDevStudio } = await import('../src/dev-studio.js');
    await runDevStudio();
} catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND') {
        const missing = err.message.match(/Cannot find package '([^']+)'/)?.[1];
        if (missing === 'playwright' || missing === 'chokidar') {
            console.error(`\x1b[31m[grimox-dev-studio] Falta la dependencia: ${missing}\x1b[0m`);
            console.error('Ejecuta: npm install');
            process.exit(1);
        }
    }
    console.error('\x1b[31m[grimox-dev-studio] Error fatal:\x1b[0m', err.message);
    if (process.env.DEBUG) console.error(err.stack);
    process.exit(1);
}
