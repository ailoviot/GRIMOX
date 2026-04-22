import { join } from 'node:path';
import { writeFileSafe } from '../utils/fs-helpers.js';
import { findStackById } from '../registry/stacks.js';

/**
 * Inyecta configuración de servidores MCP en `.mcp.json` (ubicación estándar
 * de Claude Code) con los servers relevantes según la DB y el tipo de proyecto.
 *
 * Para proyectos con UI (web fullstack, frontend SPA, docs, desktop con web UI)
 * inyecta también Playwright MCP + Chrome DevTools MCP — los usa el sub-agent
 * grimox-qa para testing visual durante `/grimox-dev`.
 */
export async function inject(projectPath, config) {
    const mcpConfig = { mcpServers: {} };

    addDatabaseServers(mcpConfig, config);

    mcpConfig.mcpServers['filesystem'] = {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-filesystem', '.'],
    };

    // NOTA: antes se inyectaban también `@playwright/mcp` y `chrome-devtools-mcp`
    // para proyectos con UI, pero los eliminamos intencionalmente por dos razones:
    //
    //   1. UX: cada MCP de browser lanza su PROPIO Chromium (sin overlays Grimox
    //      Studio), que aparecía además del browser del daemon. El usuario veía 2+
    //      ventanas simultáneas, una sin estilos, confundiendo la experiencia.
    //
    //   2. Redundancia: el daemon + grimox-qa ya cubren browser visible con overlays
    //      (durante desarrollo) y QA automático en postbuild. El LLM no necesita
    //      herramientas adicionales de browser — verifica rutas con curl y delega
    //      la validación visual al pipeline (postbuild grimox-qa --dynamic).
    //
    // Si necesitas browser tools manuales para un proyecto específico, agrégalos
    // explícitamente a .mcp.json tras el scaffold.

    await writeFileSafe(
        join(projectPath, '.mcp.json'),
        JSON.stringify(mcpConfig, null, 2)
    );
}

function addDatabaseServers(mcpConfig, config) {
    const db = config.database;
    if (!db) return;

    if (db === 'supabase') {
        // El MCP lee SUPABASE_URL sin prefijo. El .env del proyecto también
        // expone `NEXT_PUBLIC_SUPABASE_URL` para el cliente-side. Usamos
        // substitución con fallback para cubrir ambos casos.
        const stackId = config.isDecoupled ? config.frontend?.stackId : config.stackId;
        const prefix = getClientEnvPrefix(stackId);
        const urlVar = prefix ? `${prefix}SUPABASE_URL` : 'SUPABASE_URL';
        mcpConfig.mcpServers['supabase'] = {
            command: 'npx',
            args: ['-y', '@supabase/mcp-server'],
            env: {
                SUPABASE_URL: `\${${urlVar}}`,
                SUPABASE_SERVICE_ROLE_KEY: '${SUPABASE_SERVICE_ROLE_KEY}',
            },
        };
    } else if (db === 'postgresql') {
        mcpConfig.mcpServers['postgres'] = {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-postgres'],
            env: { DATABASE_URL: '${DATABASE_URL}' },
        };
    } else if (db === 'firebase') {
        mcpConfig.mcpServers['firebase'] = {
            command: 'npx',
            args: ['-y', 'firebase-mcp-server'],
        };
    } else if (db === 'mongodb') {
        mcpConfig.mcpServers['mongodb'] = {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-mongodb'],
            env: { MONGODB_URI: '${MONGODB_URI}' },
        };
    } else if (db === 'redis') {
        mcpConfig.mcpServers['redis'] = {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-redis'],
            env: { REDIS_URL: '${REDIS_URL:redis://localhost:6379}' },
        };
    } else if (db === 'oracle') {
        mcpConfig.mcpServers['oracle'] = {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-oracle'],
            env: {
                ORACLE_CONNECTION_STRING: '${ORACLE_CONNECTION_STRING}',
                ORACLE_USER: '${ORACLE_USER}',
                ORACLE_PASSWORD: '${ORACLE_PASSWORD}',
            },
        };
    }
}

/**
 * Determina si el proyecto tiene UI (para inyectar browser MCPs).
 *
 * Usa los tags del stack desde el registry. Stacks con UI visual:
 *   - SSR/fullstack: ssr
 *   - SPAs: spa
 *   - Docs: docs
 *   - Desktop con web UI: electron, tauri (tienen tag 'desktop' + web UI)
 *
 * Excluye: api-backend (sin UI), mobile (UI nativa, no testeable con Playwright),
 * IoT, CLI, data/AI puro, flet desktop (Python widget toolkit no-web).
 */
export function hasUI(config) {
    if (config.isDecoupled) {
        // Decoupled siempre tiene frontend web → sí tiene UI
        return true;
    }

    const entry = findStackById(config.stackId);
    if (!entry) return false;

    const tags = entry.tags || [];
    if (tags.includes('ssr') || tags.includes('spa') || tags.includes('docs')) {
        return true;
    }

    // Desktop con web UI (Electron/Tauri — NO flet-desktop)
    if (tags.includes('desktop')) {
        return !tags.includes('python'); // flet-desktop es python, excluir
    }

    return false;
}


/**
 * Prefijo de var de entorno cliente-exposable según framework.
 * Usado para alinear MCP config con .env del proyecto.
 */
function getClientEnvPrefix(stackId) {
    if (['nextjs-15'].includes(stackId)) return 'NEXT_PUBLIC_';
    if (['nuxt-4'].includes(stackId)) return 'NUXT_PUBLIC_';
    if (['sveltekit'].includes(stackId)) return 'PUBLIC_';
    if (['react-vite', 'vue-vite', 'svelte-vite'].includes(stackId)) return 'VITE_';
    return '';
}
