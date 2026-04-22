import { join } from 'node:path';
import { writeFileSafe } from '../utils/fs-helpers.js';
import { findStackById } from '../registry/stacks.js';
import { buildDockerArtifacts } from './docker-strategies.js';
import { logger } from '../utils/logger.js';

/**
 * Inyecta Dockerfile + docker-compose.yml + .dockerignore + nginx.conf (si aplica).
 *
 * Despacha a la strategy declarada en stacks.js → docker.strategy:
 *   - node-ssr, node-api, static-spa, python-asgi, jvm-jar → genera artefactos
 *   - none → skip con mensaje educativo (mobile/IoT/CLI/desktop nativo)
 */
export async function inject(projectPath, config) {
    if (config.isDecoupled) {
        await injectDecoupled(projectPath, config);
        return;
    }

    const stackId = config.stackId;
    const entry = findStackById(stackId);
    if (!entry) {
        logger.warn(`Docker: stack "${stackId}" no encontrado en registry. Skip.`);
        return;
    }

    const profile = entry.docker;
    if (!profile || profile.strategy === 'none') {
        const reason = profile?.reason || 'este stack no soporta Docker.';
        logger.info(`Docker skipped para ${entry.name}: ${reason}`);
        return;
    }

    const artifacts = buildDockerArtifacts(profile);
    if (!artifacts) return;

    await writeFileSafe(join(projectPath, 'Dockerfile'), artifacts.dockerfile);
    for (const extra of artifacts.extraFiles || []) {
        await writeFileSafe(join(projectPath, extra.path), extra.content);
    }

    const compose = buildComposeIntegrated({
        port: profile.port,
        database: config.database,
        projectName: config.projectName,
    });
    await writeFileSafe(join(projectPath, 'docker-compose.yml'), compose);
}

async function injectDecoupled(projectPath, config) {
    const { frontend, backend, database } = config;

    const frontendEntry = findStackById(frontend.stackId);
    const backendEntry = findStackById(backend.stackId);

    const frontendProfile = frontendEntry?.docker;
    const backendProfile = backendEntry?.docker;

    const frontendOk = frontendProfile && frontendProfile.strategy !== 'none';
    const backendOk = backendProfile && backendProfile.strategy !== 'none';

    if (!frontendOk && !backendOk) {
        logger.info('Docker skipped: ni frontend ni backend soportan Docker.');
        return;
    }

    if (frontendOk) {
        const artifacts = buildDockerArtifacts(frontendProfile);
        await writeFileSafe(join(projectPath, 'frontend', 'Dockerfile'), artifacts.dockerfile);
        for (const extra of artifacts.extraFiles || []) {
            await writeFileSafe(join(projectPath, 'frontend', extra.path), extra.content);
        }
    } else {
        logger.info(`Docker frontend skipped: ${frontendProfile?.reason || 'no aplica'}.`);
    }

    if (backendOk) {
        const artifacts = buildDockerArtifacts(backendProfile);
        await writeFileSafe(join(projectPath, 'backend', 'Dockerfile'), artifacts.dockerfile);
        for (const extra of artifacts.extraFiles || []) {
            await writeFileSafe(join(projectPath, 'backend', extra.path), extra.content);
        }
    } else {
        logger.info(`Docker backend skipped: ${backendProfile?.reason || 'no aplica'}.`);
    }

    const compose = buildComposeDecoupled({
        frontendPort: frontendProfile?.port || 80,
        backendPort: backendProfile?.port || 8080,
        frontendEnabled: frontendOk,
        backendEnabled: backendOk,
        database,
    });
    await writeFileSafe(join(projectPath, 'docker-compose.yml'), compose);
}

function buildComposeIntegrated({ port, database }) {
    let compose = `services:\n`;
    compose += `  app:\n`;
    compose += `    build: .\n`;
    compose += `    ports:\n`;
    compose += `      - "${port}:${port}"\n`;
    compose += `    env_file:\n`;
    compose += `      - .env\n`;

    if (database) {
        const depends = requiresLocalService(database);
        if (depends) {
            compose += `    depends_on:\n`;
            compose += `      - ${depends}\n`;
        }
    }

    compose += `\n`;
    compose += getDbService(database);
    return compose;
}

function buildComposeDecoupled({ frontendPort, backendPort, frontendEnabled, backendEnabled, database }) {
    let compose = `services:\n`;

    if (backendEnabled) {
        compose += `  backend:\n`;
        compose += `    build:\n`;
        compose += `      context: ./backend\n`;
        compose += `    ports:\n`;
        compose += `      - "${backendPort}:${backendPort}"\n`;
        compose += `    env_file:\n`;
        compose += `      - .env\n`;
        const depends = requiresLocalService(database);
        if (depends) {
            compose += `    depends_on:\n`;
            compose += `      - ${depends}\n`;
        }
        compose += `\n`;
    }

    if (frontendEnabled) {
        compose += `  frontend:\n`;
        compose += `    build:\n`;
        compose += `      context: ./frontend\n`;
        compose += `    ports:\n`;
        compose += `      - "${frontendPort}:${frontendPort}"\n`;
        if (backendEnabled) {
            compose += `    environment:\n`;
            compose += `      # URL pública para el browser del usuario\n`;
            compose += `      - VITE_API_URL=http://localhost:${backendPort}\n`;
            compose += `      - NEXT_PUBLIC_API_URL=http://localhost:${backendPort}\n`;
            compose += `    depends_on:\n`;
            compose += `      - backend\n`;
        }
        compose += `\n`;
    }

    compose += getDbService(database);
    return compose;
}

function requiresLocalService(database) {
    switch (database) {
        case 'postgresql': return 'postgres';
        case 'mongodb': return 'mongo';
        case 'redis': return 'redis';
        case 'oracle': return 'oracle';
        default: return null; // supabase/firebase/turso/insforge son cloud
    }
}

function getDbService(database) {
    switch (database) {
        case 'postgresql':
            return `  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
`;
        case 'mongodb':
            return `  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodata:/data/db

volumes:
  mongodata:
`;
        case 'redis':
            return `  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
`;
        case 'oracle':
            return `  oracle:
    image: gvenzl/oracle-xe:21-slim
    ports:
      - "1521:1521"
    environment:
      ORACLE_PASSWORD: oracle
    volumes:
      - oradata:/opt/oracle/oradata

volumes:
  oradata:
`;
        default:
            return '';
    }
}
