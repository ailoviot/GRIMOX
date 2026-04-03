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

    // Database vars
    if (config.database) {
        content += `# Database\n`;
        switch (config.database) {
            case 'supabase':
                content += `SUPABASE_URL=https://your-project.supabase.co\n`;
                content += `SUPABASE_ANON_KEY=your-anon-key\n`;
                content += `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n`;
                break;
            case 'postgresql':
                content += `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app\n`;
                break;
            case 'firebase':
                content += `FIREBASE_API_KEY=your-api-key\n`;
                content += `FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com\n`;
                content += `FIREBASE_PROJECT_ID=your-project-id\n`;
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
                content += `INSFORGE_URL=https://your-project.insforge.dev\n`;
                content += `INSFORGE_API_KEY=your-api-key\n`;
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
