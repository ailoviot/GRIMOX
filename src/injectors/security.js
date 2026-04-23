import { join } from 'node:path';
import { writeFileSafe } from '../utils/fs-helpers.js';

/**
 * Inyecta configuración de seguridad (.env.example, validación)
 */
export async function inject(projectPath, config) {
    // .env.example
    const envContent = getEnvExample(config);
    await writeFileSafe(join(projectPath, '.env.example'), envContent);

    // .env (copia de .env.example para desarrollo)
    await writeFileSafe(join(projectPath, '.env'), envContent);
}

function getEnvExample(config) {
    let content = `# ============================================\n`;
    content += `# Variables de Entorno - ${config.projectName || 'App'}\n`;
    content += `# Generado por Grimox CLI\n`;
    content += `# ============================================\n\n`;

    content += `# App\n`;
    content += `NODE_ENV=development\n`;
    content += `PORT=3000\n\n`;

    // Prefijo de vars cliente según framework
    // Next.js: NEXT_PUBLIC_, Nuxt: NUXT_PUBLIC_, SvelteKit: PUBLIC_, Vite: VITE_
    const stackId = config.isDecoupled ? config.frontend?.stackId : config.stackId;
    const clientPrefix = getClientEnvPrefix(stackId);

    // Database vars
    if (config.database) {
        content += `# Database\n`;
        switch (config.database) {
            case 'supabase':
                // URL y ANON_KEY deben exponerse al cliente (requeridos por el browser client)
                // SERVICE_ROLE_KEY SOLO en servidor — sin prefijo de cliente
                content += `${clientPrefix}SUPABASE_URL=https://your-project.supabase.co\n`;
                content += `${clientPrefix}SUPABASE_ANON_KEY=your-anon-key\n`;
                content += `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # server only\n`;
                content += `\n# Supabase MCP (for the AI agent to manage tables/migrations)\n`;
                content += `# Get from: https://supabase.com/dashboard/account/tokens\n`;
                content += `# Only for Supabase Cloud. Self-hosted users: leave empty and the\n`;
                content += `# AI will use SUPABASE_SERVICE_ROLE_KEY with scripts instead.\n`;
                content += `SUPABASE_ACCESS_TOKEN=your-personal-access-token\n`;
                break;
            case 'postgresql':
                content += `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app\n`;
                break;
            case 'firebase':
                content += `FIREBASE_API_KEY=your-api-key\n`;
                content += `FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com\n`;
                content += `FIREBASE_PROJECT_ID=your-project-id\n`;
                content += `\n# Firebase MCP (for the AI agent)\n`;
                content += `# Download service account JSON from: Firebase Console → Project\n`;
                content += `# Settings → Service accounts → Generate new private key\n`;
                content += `FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/to/serviceAccountKey.json\n`;
                content += `FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app\n`;
                break;
            case 'mongodb':
                content += `MONGODB_URI=mongodb://localhost:27017/app\n`;
                break;
            case 'oracle':
                content += `ORACLE_USER=system\n`;
                content += `ORACLE_PASSWORD=oracle\n`;
                content += `ORACLE_CONNECTION_STRING=localhost:1521/XEPDB1\n`;
                break;
            case 'turso':
                content += `TURSO_DATABASE_URL=libsql://your-db.turso.io\n`;
                content += `TURSO_AUTH_TOKEN=your-auth-token\n`;
                break;
            case 'insforge':
                content += `# InsForge project credentials. Get from your InsForge dashboard:\n`;
                content += `#   Connect Project → API Keys tab (or Connection String tab)\n`;
                content += `INSFORGE_PROJECT_ID=your-project-id\n`;
                content += `INSFORGE_API_KEY=your-api-key\n`;
                content += `INSFORGE_API_BASE_URL=https://api.insforge.dev\n`;
                content += `\n# Optional — PostgreSQL direct connection (InsForge runs on Postgres)\n`;
                content += `# Useful if you prefer pg / Drizzle / Prisma over the InsForge SDK.\n`;
                content += `# Get from: Connect Project → Connection String tab\n`;
                content += `# DATABASE_URL=postgresql://postgres:password@host.database.insforge.app:5432/insforge?sslmode=require\n`;
                content += `\n# The InsForge MCP (https://mcp.insforge.dev/mcp) uses credentials from:\n`;
                content += `#   npx @insforge/cli link --project-id \${INSFORGE_PROJECT_ID}\n`;
                content += `# Run that once to authorize the MCP against your project.\n`;
                break;
            case 'redis':
                content += `REDIS_URL=redis://localhost:6379\n`;
                break;
        }
        content += `\n`;
    }

    // Auth
    content += `# Auth (si aplica)\n`;
    content += `JWT_SECRET=change-this-to-a-secure-random-string\n\n`;

    return content;
}

/**
 * Devuelve el prefijo de var de entorno cliente-exposable según el framework.
 * Supabase necesita URL + ANON_KEY en el browser (createBrowserClient),
 * así que esas vars requieren el prefijo del framework.
 */
function getClientEnvPrefix(stackId) {
    if (['nextjs-15'].includes(stackId)) return 'NEXT_PUBLIC_';
    if (['nuxt-4'].includes(stackId)) return 'NUXT_PUBLIC_';
    if (['sveltekit'].includes(stackId)) return 'PUBLIC_';
    if (['react-vite', 'vue-vite', 'svelte-vite'].includes(stackId)) return 'VITE_';
    return ''; // backends, SPAs sin framework
}
