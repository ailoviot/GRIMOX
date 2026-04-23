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

    // README al lado de .mcp.json que documenta capabilities y limitaciones
    // de cada MCP para que el LLM sepa cuándo puede usarlo y cuándo debe
    // caer a un script con el SDK.
    await writeFileSafe(
        join(projectPath, '.mcp', 'README.md'),
        buildMcpReadme(config)
    );
}

/**
 * Genera el README de `.mcp/` con la guía práctica de qué puede (y no puede)
 * hacer cada MCP configurado, y el patrón de fallback cuando es read-only.
 */
function buildMcpReadme(config) {
    const db = config.database;
    let content = `# MCP Servers — capacidades y limitaciones\n\n`;
    content += `Este archivo documenta los servidores MCP configurados en \`.mcp.json\` y qué\n`;
    content += `puede hacer cada uno desde el LLM. Es importante para el flujo one-shot:\n`;
    content += `cuando un MCP es **read-only**, el LLM debe caer a un **script con el SDK**\n`;
    content += `para crear tablas, aplicar migraciones o sembrar datos iniciales.\n\n`;
    content += `## filesystem — lectura/escritura de archivos del proyecto\n\n`;
    content += `Permite al LLM leer, escribir y enumerar archivos del proyecto\n`;
    content += `(equivalente a las tools Read/Write/Glob). Siempre activo.\n\n`;

    if (!db) {
        content += `## No hay DB configurada\n\nNo se inyectó ningún MCP de base de datos.\n`;
        return content;
    }

    switch (db) {
        case 'supabase':
            content += `## supabase — Supabase Cloud management API\n\n`;
            content += `**Write capable ✓** (con \`SUPABASE_ACCESS_TOKEN\`).\n\n`;
            content += `Paquete: \`@supabase/mcp-server-supabase\`.\n\n`;
            content += `Permite al LLM: listar proyectos, ejecutar SQL arbitrario (incluyendo\n`;
            content += `CREATE TABLE, INSERT, ALTER), aplicar migraciones, gestionar Storage.\n\n`;
            content += `### Cómo obtener \`SUPABASE_ACCESS_TOKEN\`\n\n`;
            content += `1. Ir a https://supabase.com/dashboard/account/tokens\n`;
            content += `2. Click "Generate new token"\n`;
            content += `3. Copiar el token y pegarlo en \`.env\` como \`SUPABASE_ACCESS_TOKEN=sbp_...\`\n\n`;
            content += `### ⚠ Supabase self-hosted\n\n`;
            content += `Este MCP solo funciona con Supabase Cloud (usa la Management API). Si\n`;
            content += `tu Supabase es self-hosted (ej. \`supabase.tu-dominio.com\`):\n\n`;
            content += `1. El MCP no conectará — elimínalo de \`.mcp.json\` si molesta.\n`;
            content += `2. El LLM debe crear un **script Node** con \`@supabase/supabase-js\`\n`;
            content += `   usando \`SUPABASE_SERVICE_ROLE_KEY\` para setup inicial (ver patrón abajo).\n`;
            content += `3. Alternativa: usar fetch directo al endpoint admin \`/pg/query\` si\n`;
            content += `   tu Supabase self-hosted lo expone (el LLM ya lo resolvió así en pruebas).\n\n`;
            break;

        case 'postgresql':
            content += `## postgres — PostgreSQL direct\n\n`;
            content += `**⚠ READ-ONLY**. El MCP oficial de Anthropic ejecuta solo SELECT.\n\n`;
            content += `Paquete: \`@modelcontextprotocol/server-postgres\`.\n\n`;
            content += `Permite al LLM: inspeccionar schemas, ejecutar SELECT, describir tablas.\n`;
            content += `**NO** puede crear tablas, insertar, actualizar ni borrar.\n\n`;
            content += `### Para migraciones/seeds, el LLM debe usar uno de estos fallbacks:\n\n`;
            content += `**A. Script Node con \`pg\`** (recomendado):\n\`\`\`js\n`;
            content += `// scripts/migrate.js\nimport { Client } from 'pg';\nconst c = new Client({ connectionString: process.env.DATABASE_URL });\n`;
            content += `await c.connect();\nawait c.query(readFileSync('migrations/001_init.sql', 'utf8'));\nawait c.end();\n\`\`\`\n\n`;
            content += `Ejecutar: \`node --env-file=.env scripts/migrate.js\`\n\n`;
            content += `**B. ORM del proyecto** (Drizzle, Prisma, TypeORM): usar sus comandos de migration.\n\n`;
            break;

        case 'mongodb':
            content += `## mongodb — MongoDB\n\n`;
            content += `**Write capable ✓** (community MCP).\n\n`;
            content += `Paquete: \`mcp-mongo-server\`.\n\n`;
            content += `Permite al LLM: query, aggregate, insert, update, delete, crear índices.\n`;
            content += `Puede forzar read-only agregando \`--read-only\` al array \`args\` en \`.mcp.json\`.\n\n`;
            break;

        case 'firebase':
            content += `## firebase — Firebase Admin SDK\n\n`;
            content += `**Write capable ✓** (community MCP).\n\n`;
            content += `Paquete: \`@gannonh/firebase-mcp\`.\n\n`;
            content += `Permite al LLM: CRUD en Firestore, gestión de Storage, operaciones de Auth.\n\n`;
            content += `### Requisitos — service account JSON\n\n`;
            content += `1. Firebase Console → Project Settings → Service accounts\n`;
            content += `2. "Generate new private key" → descarga archivo \`.json\`\n`;
            content += `3. Guárdalo FUERA del repo (ej. \`~/firebase-keys/\`) o en \`.gitignore\`\n`;
            content += `4. En \`.env\`: \`FIREBASE_SERVICE_ACCOUNT_PATH=/ruta/absoluta/al/archivo.json\`\n\n`;
            content += `⚠ El path debe ser **absoluto** — rutas relativas no funcionan con MCPs.\n\n`;
            break;

        case 'turso':
            content += `## turso — Turso / LibSQL\n\n`;
            content += `**⚠ READ-ONLY**. Solo SELECT + introspection de schema.\n\n`;
            content += `Paquete: \`mcp-turso\`.\n\n`;
            content += `### Para migraciones/seeds, el LLM debe usar:\n\n`;
            content += `**A. Turso CLI:** \`turso db shell <db> < migrations/001.sql\`\n\n`;
            content += `**B. Script Node con \`@libsql/client\`:**\n\`\`\`js\nimport { createClient } from '@libsql/client';\n`;
            content += `const c = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });\n`;
            content += `await c.execute(readFileSync('migrations/001.sql', 'utf8'));\n\`\`\`\n\n`;
            break;

        case 'redis':
            content += `## redis — Redis\n\n`;
            content += `**Write capable ✓** (MCP oficial Anthropic).\n\n`;
            content += `Paquete: \`@modelcontextprotocol/server-redis\`.\n\n`;
            content += `Tools: set, get, delete, list. Sin create/drop de keyspaces (no aplica).\n\n`;
            break;

        case 'oracle':
            content += `## oracle — ⚠ sin MCP disponible\n\n`;
            content += `No hay MCP oficial ni community maduro para Oracle en npm. Los paquetes\n`;
            content += `que circulan con nombre \`oracle-mcp-server\` son en realidad de MySQL.\n\n`;
            content += `### El LLM debe usar el SDK \`oracledb\` en scripts:\n\n`;
            content += `\`\`\`js\nimport oracledb from 'oracledb';\nconst conn = await oracledb.getConnection({\n`;
            content += `  user: process.env.ORACLE_USER,\n  password: process.env.ORACLE_PASSWORD,\n`;
            content += `  connectString: process.env.ORACLE_CONNECTION_STRING,\n});\n`;
            content += `await conn.execute(readFileSync('migrations/001.sql', 'utf8'));\nawait conn.close();\n\`\`\`\n\n`;
            break;

        case 'insforge':
            content += `## insforge — InsForge MCP (HTTP remoto)\n\n`;
            content += `**Write capable ✓** — el MCP oficial de InsForge.\n\n`;
            content += `A diferencia de otros MCPs, éste NO es un paquete npm local: es un\n`;
            content += `servidor HTTP remoto en \`https://mcp.insforge.dev/mcp\`. El injector ya\n`;
            content += `generó la entrada correcta en \`.mcp.json\` con \`type: "http"\`.\n\n`;
            content += `### Vincular el proyecto\n\n`;
            content += `La URL HTTP es común para todos los proyectos de InsForge. Para que el\n`;
            content += `MCP sepa a cuál apuntar, corre **una sola vez** el CLI oficial:\n\n`;
            content += `\`\`\`bash\nnpx @insforge/cli link --project-id <TU_PROJECT_ID>\n\`\`\`\n\n`;
            content += `Obtén el \`PROJECT_ID\` desde tu dashboard de InsForge:\n`;
            content += `**Connect Project → CLI tab** (viene pre-llenado en el comando).\n\n`;
            content += `Tras el \`link\`, el MCP ya puede crear tablas, insertar y gestionar\n`;
            content += `Storage en tu proyecto InsForge sin intervención manual.\n\n`;
            content += `### Protocolos alternativos disponibles\n\n`;
            content += `InsForge también expone (ver dashboard → Connect Project):\n`;
            content += `- **Connection String** (PostgreSQL directo — InsForge corre sobre Postgres)\n`;
            content += `- **API Keys** — para acceso programático HTTP\n`;
            content += `- **CLI** — \`@insforge/cli\` para operaciones administrativas\n\n`;
            content += `El LLM prefiere el MCP (más ergonómico que fetch), pero puede caer a\n`;
            content += `connection string + \`pg\` si el MCP falla en algún entorno.\n\n`;
            break;
    }

    content += `---\n\n`;
    content += `## Patrón general: cuando el MCP es read-only o no existe\n\n`;
    content += `El LLM sigue este patrón para setup de DB:\n\n`;
    content += `1. Crear archivo \`migrations/001_init.sql\` (o equivalente del ORM).\n`;
    content += `2. Crear script \`scripts/migrate.mjs\` con el SDK/driver del motor.\n`;
    content += `3. Ejecutar: \`node --env-file=.env scripts/migrate.mjs\`.\n`;
    content += `4. Usar el MCP read-only para verificar el resultado (ej. listar tablas creadas).\n\n`;
    content += `Esto mantiene el one-shot: la IA hace todo el setup sin que tengas que\n`;
    content += `pegar SQL manualmente en ningún dashboard.\n`;

    return content;
}

/**
 * Inyecta el MCP server adecuado por motor de DB. Cada MCP tiene su propia
 * convención (args vs env, write vs read-only, cloud vs self-hosted).
 *
 * Estado verificado contra npm registry y docs oficiales (abril 2026):
 *
 *   Supabase Cloud  → @supabase/mcp-server-supabase  (write ✓, stdio npx)
 *   Supabase self-h → postgres MCP como fallback     (read-only ⚠)
 *   PostgreSQL      → @modelcontextprotocol/server-postgres (read-only ⚠)
 *   MongoDB         → mcp-mongo-server (community)   (write ✓)
 *   Firebase        → @gannonh/firebase-mcp (community) (write ✓)
 *   Turso           → mcp-turso (community)          (read-only ⚠)
 *   Redis           → @modelcontextprotocol/server-redis (write ✓)
 *   Insforge        → https://mcp.insforge.dev/mcp   (write ✓, HTTP remoto)
 *   Oracle          → sin MCP oficial                (el LLM usa SDK)
 *
 * Dos protocolos de transporte:
 *   - stdio: `command` + `args` (npx ...). Default para la mayoría.
 *   - HTTP remoto: `type: 'http'` + `url`. InsForge usa esto.
 *
 * Para MCPs read-only, el LLM crea schema/seed vía un script Node usando
 * el SDK del proyecto (documentado en .mcp/README.md inyectado al lado).
 */
function addDatabaseServers(mcpConfig, config) {
    const db = config.database;
    if (!db) return;

    if (db === 'supabase') {
        // MCP oficial de Supabase. Funciona con Supabase Cloud usando un
        // Personal Access Token (no el service_role_key del proyecto).
        // Para Supabase self-hosted no funciona — usar el postgres MCP como
        // fallback apuntando al PostgreSQL subyacente, o el LLM creará un
        // script con @supabase/supabase-js / fetch al endpoint /pg/query.
        mcpConfig.mcpServers['supabase'] = {
            command: 'npx',
            args: ['-y', '@supabase/mcp-server-supabase@latest'],
            env: {
                SUPABASE_ACCESS_TOKEN: '${SUPABASE_ACCESS_TOKEN}',
            },
        };
    } else if (db === 'postgresql') {
        // Read-only. El LLM puede introspeccionar schemas y ejecutar SELECT,
        // pero NO puede crear tablas ni insertar — para setup/migrations
        // usar un script Node con `pg` o el CLI de la herramienta de migración.
        // Nota: este MCP toma la URL como ARG posicional, no como env var.
        mcpConfig.mcpServers['postgres'] = {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-postgres', '${DATABASE_URL}'],
        };
    } else if (db === 'firebase') {
        // Community MCP con write support. Requiere service account JSON.
        // SERVICE_ACCOUNT_KEY_PATH debe ser ruta absoluta al archivo .json
        // descargado desde Firebase Console → Settings → Service accounts.
        mcpConfig.mcpServers['firebase'] = {
            command: 'npx',
            args: ['-y', '@gannonh/firebase-mcp'],
            env: {
                SERVICE_ACCOUNT_KEY_PATH: '${FIREBASE_SERVICE_ACCOUNT_PATH}',
                FIREBASE_STORAGE_BUCKET: '${FIREBASE_STORAGE_BUCKET}',
            },
        };
    } else if (db === 'mongodb') {
        // Community MCP con write support (inserts, updates, indexes).
        // Por defecto permite escritura. Para modo read-only en producción
        // agregar '--read-only' a args tras MCP_MONGODB_URI.
        // Nota: toma URI como ARG posicional.
        mcpConfig.mcpServers['mongodb'] = {
            command: 'npx',
            args: ['-y', 'mcp-mongo-server', '${MONGODB_URI}'],
        };
    } else if (db === 'turso') {
        // Community MCP. Read-only (solo SELECT + introspection de schema).
        // Para crear tablas usar turso CLI o un script con @libsql/client.
        mcpConfig.mcpServers['turso'] = {
            command: 'npx',
            args: ['-y', 'mcp-turso'],
            env: {
                TURSO_DATABASE_URL: '${TURSO_DATABASE_URL}',
                TURSO_AUTH_TOKEN: '${TURSO_AUTH_TOKEN}',
            },
        };
    } else if (db === 'redis') {
        // MCP oficial Anthropic con write (tools: set, get, delete, list).
        // URL como ARG posicional.
        mcpConfig.mcpServers['redis'] = {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-redis', '${REDIS_URL}'],
        };
    } else if (db === 'insforge') {
        // InsForge MCP es un servidor HTTP remoto (no un paquete npm local).
        // La URL es común para todos los proyectos; el vínculo con el proyecto
        // específico se hace vía `npx @insforge/cli link --project-id <id>`,
        // que almacena credenciales localmente usadas por el MCP.
        // Docs: https://docs.insforge.dev/mcp-setup
        mcpConfig.mcpServers['insforge'] = {
            type: 'http',
            url: 'https://mcp.insforge.dev/mcp',
        };
    }
    // Oracle: no hay MCP oficial ni community maduro — el LLM usa el SDK
    // oracledb directamente en scripts de setup. Documentado en .mcp/README.md.
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
