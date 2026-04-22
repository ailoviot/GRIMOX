import { readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Auto-descubre rutas del proyecto analizando el filesystem según framework detectado.
 * Retorna lista de { path, type, authProtected (si se puede inferir) }.
 */
export function discoverRoutes(projectDir = process.cwd()) {
    const routes = [];

    // Next.js App Router — app/
    const appDir = join(projectDir, 'app');
    const srcAppDir = join(projectDir, 'src', 'app');
    const nextDir = existsSync(appDir) ? appDir : existsSync(srcAppDir) ? srcAppDir : null;
    if (nextDir) {
        routes.push(...walkNextAppRouter(nextDir));
    }

    // Next.js Pages Router — pages/
    const pagesDir = join(projectDir, 'pages');
    const srcPagesDir = join(projectDir, 'src', 'pages');
    const nextPagesDir = existsSync(pagesDir) ? pagesDir : existsSync(srcPagesDir) ? srcPagesDir : null;
    if (nextPagesDir && !nextDir) {
        routes.push(...walkNextPagesRouter(nextPagesDir));
    }

    // Nuxt — pages/
    if (routes.length === 0 && existsSync(pagesDir)) {
        routes.push(...walkNuxtPages(pagesDir));
    }

    // SvelteKit — src/routes/
    const svelteRoutesDir = join(projectDir, 'src', 'routes');
    if (routes.length === 0 && existsSync(svelteRoutesDir)) {
        routes.push(...walkSvelteKitRoutes(svelteRoutesDir));
    }

    // Deduplicar por path
    const seen = new Set();
    return routes.filter((r) => {
        if (seen.has(r.path)) return false;
        seen.add(r.path);
        return true;
    });
}

function walkNextAppRouter(baseDir, currentPath = '', depth = 0) {
    if (depth > 6) return [];
    const routes = [];
    const entries = safeReaddir(baseDir);

    for (const entry of entries) {
        const fullPath = join(baseDir, entry);
        const stat = safeStat(fullPath);
        if (!stat) continue;

        if (stat.isFile() && (entry === 'page.tsx' || entry === 'page.jsx' || entry === 'page.ts' || entry === 'page.js')) {
            routes.push({ path: currentPath || '/', type: 'page' });
        }

        if (stat.isDirectory()) {
            if (entry.startsWith('_') || entry === 'api' || entry === 'components' || entry === 'lib') continue;

            // Route group (parentheses) — don't add to path
            if (entry.startsWith('(') && entry.endsWith(')')) {
                routes.push(...walkNextAppRouter(fullPath, currentPath, depth + 1));
                continue;
            }

            // Dynamic segment [id]
            const segment = entry.startsWith('[') && entry.endsWith(']') ? ':id' : entry;
            routes.push(...walkNextAppRouter(fullPath, `${currentPath}/${segment}`, depth + 1));
        }
    }

    return routes;
}

function walkNextPagesRouter(baseDir, currentPath = '', depth = 0) {
    if (depth > 6) return [];
    const routes = [];
    const entries = safeReaddir(baseDir);

    for (const entry of entries) {
        const fullPath = join(baseDir, entry);
        const stat = safeStat(fullPath);
        if (!stat) continue;

        if (stat.isFile()) {
            if (/\.(tsx|jsx|ts|js)$/.test(entry) && !entry.startsWith('_') && entry !== 'api') {
                const name = entry.replace(/\.(tsx|jsx|ts|js)$/, '');
                if (name === 'index') {
                    routes.push({ path: currentPath || '/', type: 'page' });
                } else {
                    const segment = name.startsWith('[') && name.endsWith(']') ? ':id' : name;
                    routes.push({ path: `${currentPath}/${segment}`, type: 'page' });
                }
            }
        }

        if (stat.isDirectory() && entry !== 'api' && !entry.startsWith('_')) {
            routes.push(...walkNextPagesRouter(fullPath, `${currentPath}/${entry}`, depth + 1));
        }
    }

    return routes;
}

function walkNuxtPages(baseDir, currentPath = '', depth = 0) {
    if (depth > 6) return [];
    const routes = [];
    const entries = safeReaddir(baseDir);

    for (const entry of entries) {
        const fullPath = join(baseDir, entry);
        const stat = safeStat(fullPath);
        if (!stat) continue;

        if (stat.isFile() && /\.(vue|ts|js)$/.test(entry)) {
            const name = entry.replace(/\.(vue|ts|js)$/, '');
            if (name === 'index') {
                routes.push({ path: currentPath || '/', type: 'page' });
            } else {
                const segment = name.startsWith('[') && name.endsWith(']') ? ':id' : name;
                routes.push({ path: `${currentPath}/${segment}`, type: 'page' });
            }
        }

        if (stat.isDirectory()) {
            routes.push(...walkNuxtPages(fullPath, `${currentPath}/${entry}`, depth + 1));
        }
    }

    return routes;
}

function walkSvelteKitRoutes(baseDir, currentPath = '', depth = 0) {
    if (depth > 6) return [];
    const routes = [];
    const entries = safeReaddir(baseDir);

    const hasPageFile = entries.some((e) => /^\+page\.(svelte|ts|js)$/.test(e));
    if (hasPageFile) {
        routes.push({ path: currentPath || '/', type: 'page' });
    }

    for (const entry of entries) {
        const fullPath = join(baseDir, entry);
        const stat = safeStat(fullPath);
        if (!stat || !stat.isDirectory()) continue;

        if (entry.startsWith('(') && entry.endsWith(')')) {
            routes.push(...walkSvelteKitRoutes(fullPath, currentPath, depth + 1));
            continue;
        }

        const segment = entry.startsWith('[') && entry.endsWith(']') ? ':id' : entry;
        routes.push(...walkSvelteKitRoutes(fullPath, `${currentPath}/${segment}`, depth + 1));
    }

    return routes;
}

function safeReaddir(dir) {
    try { return readdirSync(dir); } catch { return []; }
}

function safeStat(path) {
    try { return statSync(path); } catch { return null; }
}
