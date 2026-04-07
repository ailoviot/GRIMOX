import { join } from 'node:path';
import { writeFileSafe } from '../utils/fs-helpers.js';

/**
 * Inyecta configuración de servidores MCP
 */
export async function inject(projectPath, config) {
    const mcpConfig = {
        mcpServers: {},
    };

    // Agregar servidor MCP según la base de datos
    if (config.database === 'supabase') {
        mcpConfig.mcpServers['supabase'] = {
            command: 'npx',
            args: ['-y', '@supabase/mcp-server'],
            env: {
                SUPABASE_URL: '${SUPABASE_URL}',
                SUPABASE_SERVICE_ROLE_KEY: '${SUPABASE_SERVICE_ROLE_KEY}',
            },
        };
    }

    if (config.database === 'postgresql') {
        mcpConfig.mcpServers['postgres'] = {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-postgres'],
            env: {
                DATABASE_URL: '${DATABASE_URL}',
            },
        };
    }

    if (config.database === 'firebase') {
        mcpConfig.mcpServers['firebase'] = {
            command: 'npx',
            args: ['-y', 'firebase-mcp-server'],
        };
    }

    if (config.database === 'mongodb') {
        mcpConfig.mcpServers['mongodb'] = {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-mongodb'],
            env: {
                MONGODB_URI: '${MONGODB_URI}',
            },
        };
    }

    if (config.database === 'redis') {
        mcpConfig.mcpServers['redis'] = {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-redis'],
            env: {
                REDIS_URL: '${REDIS_URL:redis://localhost:6379}',
            },
        };
    }

    if (config.database === 'oracle') {
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

    // Servidor MCP de filesystem (útil para todos los proyectos)
    mcpConfig.mcpServers['filesystem'] = {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-filesystem', '.'],
    };

    await writeFileSafe(
        join(projectPath, '.mcp', 'config.json'),
        JSON.stringify(mcpConfig, null, 4)
    );
}
