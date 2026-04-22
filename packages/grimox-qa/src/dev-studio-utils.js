import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Detecta el framework del proyecto y retorna el comando de dev server correspondiente.
 */
export function detectFrameworkCmd(cwd) {
    const pkgPath = join(cwd, 'package.json');
    if (!existsSync(pkgPath)) return null;

    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

    // Next.js
    if (deps.next) {
        return {
            kind: 'next',
            name: 'Next.js',
            cmd: 'npx',
            args: ['next', 'dev'],
            port: 3000,
        };
    }

    // Nuxt
    if (deps.nuxt) {
        return {
            kind: 'nuxt',
            name: 'Nuxt',
            cmd: 'npx',
            args: ['nuxt', 'dev'],
            port: 3000,
        };
    }

    // SvelteKit (vite con adapter)
    if (deps['@sveltejs/kit']) {
        return {
            kind: 'sveltekit',
            name: 'SvelteKit',
            cmd: 'npx',
            args: ['vite', 'dev'],
            port: 5173,
        };
    }

    // Vite (React/Vue/Svelte SPA)
    if (deps.vite) {
        return {
            kind: 'vite',
            name: 'Vite',
            cmd: 'npx',
            args: ['vite'],
            port: 5173,
        };
    }

    // Angular
    if (deps['@angular/core']) {
        return {
            kind: 'angular',
            name: 'Angular',
            cmd: 'npx',
            args: ['ng', 'serve'],
            port: 4200,
        };
    }

    // Astro
    if (deps.astro) {
        return {
            kind: 'astro',
            name: 'Astro',
            cmd: 'npx',
            args: ['astro', 'dev'],
            port: 4321,
        };
    }

    return null;
}

/**
 * Mapea un archivo modificado a la ruta más probable que le corresponde.
 * Ejemplo: src/app/login/page.tsx → /login
 */
export function mapFileToRoute(relPath) {
    // Next.js App Router: src/app/<ruta>/page.tsx
    let m = relPath.match(/^(?:src\/)?app\/(.+)\/(?:page|layout)\.(tsx|jsx|ts|js)$/);
    if (m) {
        const seg = m[1]
            .split('/')
            .filter((p) => !(p.startsWith('(') && p.endsWith(')'))) // skip route groups
            .map((p) => (p.startsWith('[') && p.endsWith(']') ? '1' : p))
            .join('/');
        return '/' + seg;
    }

    // Next.js App Router root: src/app/page.tsx
    if (/^(?:src\/)?app\/(?:page|layout)\.(tsx|jsx|ts|js)$/.test(relPath)) {
        return '/';
    }

    // Next.js Pages Router: src/pages/<name>.tsx
    m = relPath.match(/^(?:src\/)?pages\/(.+?)\.(tsx|jsx|ts|js)$/);
    if (m && !m[1].startsWith('_') && !m[1].startsWith('api/')) {
        return m[1] === 'index' ? '/' : '/' + m[1];
    }

    // Nuxt: pages/<name>.vue
    m = relPath.match(/^pages\/(.+?)\.(vue|ts|js)$/);
    if (m) {
        return m[1] === 'index' ? '/' : '/' + m[1];
    }

    // SvelteKit: src/routes/<path>/+page.svelte
    m = relPath.match(/^src\/routes\/(.*)\+page\.(svelte|ts|js)$/);
    if (m) {
        const seg = m[1]
            .replace(/\/$/, '')
            .split('/')
            .filter((p) => p && !(p.startsWith('(') && p.endsWith(')')))
            .join('/');
        return '/' + seg;
    }

    return null;
}

/**
 * Crea un watcher de chokidar sobre los directorios típicos del código.
 * Ignora node_modules, .next, .nuxt, dist, etc.
 */
export function chokidarWatcher(chokidar, cwd) {
    const paths = ['src', 'app', 'pages', 'components', 'lib', 'styles', 'composables'];
    const toWatch = paths.map((p) => join(cwd, p));

    return chokidar.watch(toWatch, {
        ignored: /(^|[\/\\])(node_modules|\.next|\.nuxt|\.output|\.svelte-kit|dist|build|\.git|\.grimox|\.vendor)[\/\\]/,
        ignoreInitial: true,
        persistent: true,
        awaitWriteFinish: {
            stabilityThreshold: 200,
            pollInterval: 100,
        },
    });
}
