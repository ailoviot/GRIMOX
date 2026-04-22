/**
 * Docker strategy builders.
 *
 * Cada builder recibe el docker profile del stack (desde registry/stacks.js)
 * y retorna { dockerfile, extraFiles } donde extraFiles es un array de
 * { path, content } para archivos auxiliares (nginx.conf, etc.).
 *
 * Strategies soportadas:
 *   - node-ssr     Next.js, Nuxt, SvelteKit, NestJS (Node server con build output)
 *   - node-api     Hono, Fastify (Node server API)
 *   - static-spa   React/Vue/Svelte/Angular SPAs + Astro/Docusaurus/VitePress (nginx)
 *   - python-asgi  FastAPI, FastAPI + ML (uvicorn)
 *   - jvm-jar      Spring Boot (java -jar)
 *   - none         Mobile/IoT/CLI/Desktop nativo (skip, no genera Dockerfile)
 */

const NODE_DOCKERIGNORE = `node_modules
.next
.nuxt
.output
.svelte-kit
dist
build
.env
.env.local
.git
.gitignore
*.log
npm-debug.log*
coverage
.vscode
.idea
Dockerfile
docker-compose.yml
README.md
`;

const PYTHON_DOCKERIGNORE = `__pycache__
*.pyc
*.pyo
*.pyd
.venv
venv/
env/
.pytest_cache
.mypy_cache
.env
.git
*.log
coverage
htmlcov
.vscode
.idea
Dockerfile
docker-compose.yml
`;

const JAVA_DOCKERIGNORE = `target
build
.gradle
out
.idea
.vscode
*.iml
.env
.git
*.log
Dockerfile
docker-compose.yml
`;

const NGINX_CONF_SPA = `server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/javascript application/javascript application/json application/xml+rss application/rss+xml application/atom+xml image/svg+xml;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
`;

/**
 * Node SSR/Node API comparten base: multi-stage deps → build → runner
 * con non-root user y HEALTHCHECK opcional.
 *
 * Acepta el array `copies` del profile (src:dst pares), donde dst='.' significa
 * aplanar a /app. Esto es crítico para Next.js standalone que espera server.js
 * en la raíz de WORKDIR.
 */
function buildNodeRuntimeDockerfile(profile) {
    const { port, buildCmd = 'npm run build', startCmd, copies = [], healthPath } = profile;

    const copyLines = copies.map((entry) => {
        const [src, dst] = entry.split(':');
        return `COPY --from=build /app/${src} ./${dst}`;
    });

    const healthcheck = healthPath
        ? `\nHEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \\\n  CMD wget -qO- http://localhost:${port}${healthPath} || exit 1\n`
        : '';

    const cmdParts = startCmd.split(' ');
    const cmdJson = JSON.stringify(cmdParts);

    return `# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ${buildCmd}

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=${port}
${copyLines.join('\n')}
USER node
EXPOSE ${port}
${healthcheck}
CMD ${cmdJson}
`;
}

export function buildNodeSsr(profile) {
    return {
        dockerfile: buildNodeRuntimeDockerfile(profile),
        extraFiles: [
            { path: '.dockerignore', content: NODE_DOCKERIGNORE },
        ],
    };
}

export function buildNodeApi(profile) {
    return {
        dockerfile: buildNodeRuntimeDockerfile(profile),
        extraFiles: [
            { path: '.dockerignore', content: NODE_DOCKERIGNORE },
        ],
    };
}

/**
 * React/Vue/Svelte/Angular SPA + Astro/Docusaurus/VitePress (estáticos)
 * Genera nginx.conf adjunto con SPA fallback.
 */
export function buildStaticSpa(profile) {
    const { port = 80, buildCmd = 'npm run build', outputDir } = profile;

    const dockerfile = `# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN ${buildCmd}

FROM nginx:1.27-alpine AS runner
COPY --from=build /app/${outputDir} /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE ${port}
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \\
  CMD wget -qO- http://localhost:${port}/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
`;

    return {
        dockerfile,
        extraFiles: [
            { path: '.dockerignore', content: NODE_DOCKERIGNORE },
            { path: 'nginx.conf', content: NGINX_CONF_SPA },
        ],
    };
}

/**
 * FastAPI / FastAPI + ML
 * Python slim + uvicorn + user no-root.
 */
export function buildPythonAsgi(profile) {
    const { port = 8000, startCmd = `uvicorn main:app --host 0.0.0.0 --port ${port}`, healthPath } = profile;

    const cmdParts = startCmd.split(' ');
    const cmdJson = JSON.stringify(cmdParts);

    const healthcheck = healthPath
        ? `\nHEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \\\n  CMD wget -qO- http://localhost:${port}${healthPath} || exit 1\n`
        : '';

    const dockerfile = `# syntax=docker/dockerfile:1.7
FROM python:3.12-slim AS runner

WORKDIR /app

RUN adduser --disabled-password --gecos '' app && \\
    apt-get update && apt-get install -y --no-install-recommends wget && \\
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chown -R app:app /app
USER app

EXPOSE ${port}
${healthcheck}
CMD ${cmdJson}
`;

    return {
        dockerfile,
        extraFiles: [
            { path: '.dockerignore', content: PYTHON_DOCKERIGNORE },
        ],
    };
}

/**
 * Spring Boot (Maven o Gradle — detecta por Dockerfile abrazando ambos).
 */
export function buildJvmJar(profile) {
    const { port = 8080, healthPath = '/actuator/health' } = profile;

    const dockerfile = `# syntax=docker/dockerfile:1.7
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /src
COPY . .
RUN if [ -f "./mvnw" ]; then \\
      chmod +x ./mvnw && ./mvnw clean package -DskipTests && \\
      cp target/*.jar /app.jar; \\
    elif [ -f "./gradlew" ]; then \\
      chmod +x ./gradlew && ./gradlew build -x test && \\
      cp build/libs/*.jar /app.jar; \\
    else \\
      echo "No build tool found (mvnw/gradlew missing)" && exit 1; \\
    fi

FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app
RUN adduser -D app && apk add --no-cache wget
COPY --from=build /app.jar app.jar
USER app
EXPOSE ${port}
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \\
  CMD wget -qO- http://localhost:${port}${healthPath} || exit 1
CMD ["java", "-jar", "app.jar"]
`;

    return {
        dockerfile,
        extraFiles: [
            { path: '.dockerignore', content: JAVA_DOCKERIGNORE },
        ],
    };
}

/**
 * Dispatcher principal. Resuelve strategy → builder.
 * Retorna null si strategy es 'none' (no generar Dockerfile).
 */
export function buildDockerArtifacts(profile) {
    if (!profile || profile.strategy === 'none') return null;

    switch (profile.strategy) {
        case 'node-ssr':
            return buildNodeSsr(profile);
        case 'node-api':
            return buildNodeApi(profile);
        case 'static-spa':
            return buildStaticSpa(profile);
        case 'python-asgi':
            return buildPythonAsgi(profile);
        case 'jvm-jar':
            return buildJvmJar(profile);
        default:
            throw new Error(`Docker strategy desconocida: ${profile.strategy}`);
    }
}
