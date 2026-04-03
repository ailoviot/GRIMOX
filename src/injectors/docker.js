import { join } from 'node:path';
import { writeFileSafe } from '../utils/fs-helpers.js';

/**
 * Inyecta Dockerfile y docker-compose.yml
 */
export async function inject(projectPath, config) {
    const stackId = config.isDecoupled ? null : config.stackId;
    const language = config.isDecoupled ? null : config.language;

    if (config.isDecoupled) {
        await injectDecoupled(projectPath, config);
        return;
    }

    const dockerfile = getDockerfile(stackId, language);
    const compose = getDockerCompose(stackId, config.database, config.projectName);

    await writeFileSafe(join(projectPath, 'Dockerfile'), dockerfile);
    await writeFileSafe(join(projectPath, 'docker-compose.yml'), compose);
}

async function injectDecoupled(projectPath, config) {
    const { frontend, backend, database, projectName } = config;

    // Dockerfile frontend
    const frontendDockerfile = getDockerfile(frontend.stackId, frontend.language);
    await writeFileSafe(join(projectPath, 'Dockerfile.frontend'), frontendDockerfile);

    // Dockerfile backend
    const backendDockerfile = getDockerfile(backend.stackId, backend.language);
    await writeFileSafe(join(projectPath, 'Dockerfile.backend'), backendDockerfile);

    // docker-compose con ambos servicios
    let compose = `version: '3.8'\n\nservices:\n`;
    compose += `  frontend:\n    build:\n      context: ./frontend\n      dockerfile: ../Dockerfile.frontend\n    ports:\n      - "3000:3000"\n    depends_on:\n      - backend\n\n`;
    compose += `  backend:\n    build:\n      context: ./backend\n      dockerfile: ../Dockerfile.backend\n    ports:\n      - "8080:8080"\n    env_file:\n      - .env\n\n`;

    if (database) {
        compose += getDbService(database);
    }

    await writeFileSafe(join(projectPath, 'docker-compose.yml'), compose);
}

function getDockerfile(stackId, language) {
    if (['fastapi', 'fastapi-ml', 'flet-mobile', 'flet-desktop'].includes(stackId) || language === 'Python') {
        return `FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
`;
    }

    if (stackId === 'springboot') {
        return `FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN ./gradlew build -x test

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
`;
    }

    // Default Node.js (multi-stage con nginx para frontend)
    return `FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`;
}

function getDockerCompose(stackId, database, projectName) {
    let compose = `version: '3.8'\n\nservices:\n`;
    compose += `  app:\n    build: .\n    ports:\n      - "3000:3000"\n    env_file:\n      - .env\n\n`;

    if (database) {
        compose += getDbService(database);
    }

    return compose;
}

function getDbService(database) {
    switch (database) {
        case 'postgresql':
            return `  postgres:\n    image: postgres:16-alpine\n    ports:\n      - "5432:5432"\n    environment:\n      POSTGRES_DB: app\n      POSTGRES_USER: postgres\n      POSTGRES_PASSWORD: postgres\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n\nvolumes:\n  pgdata:\n`;
        case 'mongodb':
            return `  mongo:\n    image: mongo:7\n    ports:\n      - "27017:27017"\n    volumes:\n      - mongodata:/data/db\n\nvolumes:\n  mongodata:\n`;
        case 'redis':
            return `  redis:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\n`;
        default:
            return '';
    }
}
