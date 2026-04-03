import { join, basename, relative } from 'node:path';
import { readdir } from 'node:fs/promises';
import { readJson, exists } from '../utils/fs-helpers.js';
import { readFile } from 'node:fs/promises';

/** Archivos que indican un proyecto */
const PROJECT_MARKERS = [
    'package.json',
    'requirements.txt',
    'pyproject.toml',
    'pubspec.yaml',
    'platformio.ini',
    'Cargo.toml',
    'pom.xml',
    'build.gradle',
    'build.gradle.kts',
];

/** Carpetas comunes que contienen frontend o backend */
const KNOWN_SUBDIRS = [
    'frontend', 'backend', 'client', 'server',
    'api', 'web', 'app', 'ui', 'service',
    'packages', 'apps',
];

/** Carpetas a ignorar durante el escaneo */
const IGNORE_DIRS = [
    'node_modules', '.git', '.grimox-backup', 'dist',
    'build', '.next', '.nuxt', '__pycache__', '.venv',
    'venv', 'vendor', 'target', '.gradle',
];

/**
 * Escanea un proyecto detectando su estructura (monolítico o desacoplado).
 *
 * @param {string} projectPath  - Raíz donde se ejecutó grimox migrate
 * @param {object} [manualPaths] - Rutas manuales opcionales
 * @param {string} [manualPaths.frontend] - Ruta al frontend
 * @param {string} [manualPaths.backend]  - Ruta al backend
 * @returns {Promise<object>} resultado con structure, parts[], e infraestructura
 */
export async function detectProject(projectPath, manualPaths = {}) {
    const result = {
        /** 'monolithic' | 'decoupled' */
        structure: 'monolithic',
        /** Detecciones individuales por carpeta */
        parts: [],
        /** Infraestructura detectada en la raíz */
        infra: {
            hasDocker: false,
            hasCICD: false,
        },
    };

    // Detectar infraestructura en la raíz
    result.infra.hasDocker = await exists(join(projectPath, 'Dockerfile'))
        || await exists(join(projectPath, 'docker-compose.yml'))
        || await exists(join(projectPath, 'docker-compose.yaml'));
    result.infra.hasCICD = await exists(join(projectPath, '.github', 'workflows'));

    // --- Modo 1: Rutas manuales (--frontend / --backend) ---
    if (manualPaths.frontend || manualPaths.backend) {
        if (manualPaths.frontend) {
            const fullPath = join(projectPath, manualPaths.frontend);
            const det = await detectSingleProject(fullPath);
            det.role = 'frontend';
            det.folder = manualPaths.frontend;
            result.parts.push(det);
        }
        if (manualPaths.backend) {
            const fullPath = join(projectPath, manualPaths.backend);
            const det = await detectSingleProject(fullPath);
            det.role = 'backend';
            det.folder = manualPaths.backend;
            result.parts.push(det);
        }

        // Si una ruta fue manual pero la otra no, escanear automáticamente el resto
        if (manualPaths.frontend && !manualPaths.backend) {
            const autoBackend = await scanForSubprojects(projectPath, [manualPaths.frontend]);
            const backendPart = autoBackend.find((p) => classifyRole(p) === 'backend');
            if (backendPart) result.parts.push(backendPart);
        }
        if (manualPaths.backend && !manualPaths.frontend) {
            const autoFrontend = await scanForSubprojects(projectPath, [manualPaths.backend]);
            const frontendPart = autoFrontend.find((p) => classifyRole(p) === 'frontend');
            if (frontendPart) result.parts.push(frontendPart);
        }

        result.structure = result.parts.length > 1 ? 'decoupled' : 'monolithic';
        return result;
    }

    // --- Modo 2: Escaneo automático (por defecto) ---

    // Primero: ¿hay un proyecto en la raíz?
    const rootDetection = await detectSingleProject(projectPath);
    const rootHasProject = rootDetection.framework !== null || rootDetection.language !== null;

    // Segundo: buscar subproyectos en subcarpetas
    const subprojects = await scanForSubprojects(projectPath);

    if (subprojects.length >= 2) {
        // Proyecto desacoplado (múltiples subcarpetas con proyectos)
        result.structure = 'decoupled';
        result.parts = subprojects;
    } else if (subprojects.length === 1 && rootHasProject) {
        // Un subproyecto + proyecto en raíz → probablemente monolítico con subcarpeta
        result.structure = 'monolithic';
        rootDetection.role = 'root';
        rootDetection.folder = '.';
        result.parts = [rootDetection];
    } else if (subprojects.length === 1) {
        // Solo un subproyecto, sin nada en la raíz
        result.structure = 'monolithic';
        result.parts = subprojects;
    } else if (rootHasProject) {
        // Solo proyecto en la raíz
        result.structure = 'monolithic';
        rootDetection.role = classifyRole(rootDetection);
        rootDetection.folder = '.';
        result.parts = [rootDetection];
    } else {
        // No se encontró nada
        result.parts = [];
    }

    return result;
}

/**
 * Busca subproyectos en subcarpetas (nivel 1 y 2)
 * @param {string} rootPath
 * @param {string[]} [excludeFolders] - Carpetas a excluir
 */
async function scanForSubprojects(rootPath, excludeFolders = []) {
    const subprojects = [];

    let entries;
    try {
        entries = await readdir(rootPath, { withFileTypes: true });
    } catch {
        return subprojects;
    }

    // Nivel 1: buscar en subcarpetas directas
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (IGNORE_DIRS.includes(entry.name)) continue;
        if (excludeFolders.includes(entry.name) || excludeFolders.includes(`./${entry.name}`)) continue;

        const subPath = join(rootPath, entry.name);
        const hasMarker = await hasProjectMarker(subPath);

        if (hasMarker) {
            const det = await detectSingleProject(subPath);
            det.folder = entry.name;
            det.role = classifyRole(det);
            subprojects.push(det);
            continue;
        }

        // Nivel 2: buscar una capa más adentro (ej: packages/frontend/)
        if (KNOWN_SUBDIRS.includes(entry.name) || entry.name === 'packages' || entry.name === 'apps') {
            try {
                const level2Entries = await readdir(subPath, { withFileTypes: true });
                for (const l2 of level2Entries) {
                    if (!l2.isDirectory() || IGNORE_DIRS.includes(l2.name)) continue;
                    const l2Path = join(subPath, l2.name);
                    if (await hasProjectMarker(l2Path)) {
                        const det = await detectSingleProject(l2Path);
                        det.folder = `${entry.name}/${l2.name}`;
                        det.role = classifyRole(det);
                        subprojects.push(det);
                    }
                }
            } catch { /* ignore */ }
        }
    }

    return subprojects;
}

/**
 * Verifica si un directorio contiene algún marcador de proyecto
 */
async function hasProjectMarker(dirPath) {
    for (const marker of PROJECT_MARKERS) {
        if (await exists(join(dirPath, marker))) return true;
    }
    return false;
}

/**
 * Clasifica un proyecto detectado como 'frontend', 'backend' o 'unknown'
 */
function classifyRole(detection) {
    // Por nombre de carpeta
    const folder = (detection.folder || '').toLowerCase();
    if (['frontend', 'client', 'web', 'ui', 'app'].some((n) => folder.includes(n))) return 'frontend';
    if (['backend', 'server', 'api', 'service'].some((n) => folder.includes(n))) return 'backend';

    // Por framework
    const frontendFrameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt', 'SvelteKit'];
    const backendFrameworks = ['Express', 'Fastify', 'NestJS', 'Hono', 'FastAPI', 'Django', 'Flask', 'Spring Boot'];

    if (frontendFrameworks.includes(detection.framework)) return 'frontend';
    if (backendFrameworks.includes(detection.framework)) return 'backend';

    return 'unknown';
}

/**
 * Detecta el stack de un solo directorio (sin buscar subcarpetas)
 * @param {string} projectPath
 * @returns {Promise<object>}
 */
export async function detectSingleProject(projectPath) {
    const result = {
        language: null,
        framework: null,
        frameworkVersion: null,
        buildTool: null,
        packageManager: null,
        database: null,
        styling: null,
        dependencies: {},
        hasDocker: false,
        hasCICD: false,
        hasTests: false,
        issues: [],
        role: 'unknown',
        folder: null,
    };

    // --- JS/TS: package.json ---
    const pkg = await readJson(join(projectPath, 'package.json'));
    if (pkg) {
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        result.dependencies = allDeps;

        // Lenguaje
        if (allDeps.typescript || allDeps['@types/node']) {
            result.language = 'TypeScript';
        } else {
            result.language = 'JavaScript';
        }

        // Framework
        if (allDeps.next) {
            result.framework = 'Next.js';
            result.frameworkVersion = allDeps.next;
        } else if (allDeps.nuxt) {
            result.framework = 'Nuxt';
            result.frameworkVersion = allDeps.nuxt;
        } else if (allDeps['@sveltejs/kit']) {
            result.framework = 'SvelteKit';
            result.frameworkVersion = allDeps['@sveltejs/kit'];
        } else if (allDeps['@angular/core']) {
            result.framework = 'Angular';
            result.frameworkVersion = allDeps['@angular/core'];
        } else if (allDeps.react) {
            result.framework = 'React';
            result.frameworkVersion = allDeps.react;
        } else if (allDeps.vue) {
            result.framework = 'Vue';
            result.frameworkVersion = allDeps.vue;
        } else if (allDeps.svelte) {
            result.framework = 'Svelte';
            result.frameworkVersion = allDeps.svelte;
        } else if (allDeps.express) {
            result.framework = 'Express';
            result.frameworkVersion = allDeps.express;
        } else if (allDeps.fastify) {
            result.framework = 'Fastify';
            result.frameworkVersion = allDeps.fastify;
        } else if (allDeps['@nestjs/core']) {
            result.framework = 'NestJS';
            result.frameworkVersion = allDeps['@nestjs/core'];
        } else if (allDeps.hono) {
            result.framework = 'Hono';
            result.frameworkVersion = allDeps.hono;
        } else if (allDeps.electron) {
            result.framework = 'Electron';
            result.frameworkVersion = allDeps.electron;
        }

        // Build tool
        if (allDeps['react-scripts']) {
            result.buildTool = 'Create React App';
            result.issues.push('Create React App está descontinuado → migrar a Vite o Next.js');
        } else if (allDeps.vite) {
            result.buildTool = 'Vite';
        } else if (allDeps.webpack) {
            result.buildTool = 'Webpack';
        }

        // Package manager
        if (await exists(join(projectPath, 'pnpm-lock.yaml'))) {
            result.packageManager = 'pnpm';
        } else if (await exists(join(projectPath, 'yarn.lock'))) {
            result.packageManager = 'yarn';
        } else if (await exists(join(projectPath, 'bun.lockb'))) {
            result.packageManager = 'bun';
        } else {
            result.packageManager = 'npm';
        }

        // Database
        if (allDeps['@supabase/supabase-js']) result.database = 'Supabase';
        else if (allDeps.firebase || allDeps['firebase-admin']) result.database = 'Firebase';
        else if (allDeps.mongoose) result.database = 'MongoDB (Mongoose)';
        else if (allDeps.pg) result.database = 'PostgreSQL';
        else if (allDeps.mysql2 || allDeps.mysql) result.database = 'MySQL';
        else if (allDeps.oracledb) result.database = 'Oracle';

        // Styling
        if (allDeps.tailwindcss) result.styling = 'Tailwind CSS';
        else if (allDeps.bootstrap) result.styling = 'Bootstrap';
        else if (allDeps['styled-components']) result.styling = 'styled-components';
        else if (allDeps['@emotion/react']) result.styling = 'Emotion';

        // jQuery
        if (allDeps.jquery) {
            result.issues.push('jQuery detectado → considerar migración a framework moderno');
        }

        // Tests
        if (allDeps.jest || allDeps.vitest || allDeps.mocha || allDeps['@testing-library/react']) {
            result.hasTests = true;
        }

        // Version checks
        if (allDeps.react) {
            const majorVersion = parseInt(allDeps.react.replace(/[^0-9]/g, ''));
            if (majorVersion < 18) {
                result.issues.push(`React ${allDeps.react} → React 19 disponible`);
            }
        }
        if (allDeps.vue && allDeps.vue.startsWith('2')) {
            result.issues.push(`Vue ${allDeps.vue} → Vue 3 disponible (breaking changes)`);
        }
        if (allDeps['@angular/core']) {
            const angVer = parseInt(allDeps['@angular/core'].replace(/[^0-9]/g, ''));
            if (angVer < 17) {
                result.issues.push(`Angular ${allDeps['@angular/core']} → Angular 19 disponible`);
            }
        }
    }

    // --- Python: requirements.txt / pyproject.toml ---
    if (await exists(join(projectPath, 'requirements.txt'))) {
        result.language = result.language || 'Python';
        try {
            const reqs = await readFile(join(projectPath, 'requirements.txt'), 'utf-8');
            if (reqs.includes('fastapi')) result.framework = 'FastAPI';
            else if (reqs.includes('django')) result.framework = 'Django';
            else if (reqs.includes('flask')) result.framework = 'Flask';
            else if (reqs.includes('flet')) result.framework = 'Flet';

            if (reqs.includes('psycopg2') || reqs.includes('asyncpg')) result.database = 'PostgreSQL';
            else if (reqs.includes('pymongo') || reqs.includes('motor')) result.database = 'MongoDB';
            else if (reqs.includes('mysql')) result.database = 'MySQL';
            else if (reqs.includes('oracledb')) result.database = 'Oracle';
            else if (reqs.includes('supabase')) result.database = 'Supabase';

            if (reqs.includes('pytest')) result.hasTests = true;
        } catch { /* ignore */ }
    }

    if (await exists(join(projectPath, 'pyproject.toml'))) {
        result.language = result.language || 'Python';
    }

    // --- Dart/Flutter ---
    if (await exists(join(projectPath, 'pubspec.yaml'))) {
        result.language = 'Dart';
        result.framework = 'Flutter';
    }

    // --- IoT ---
    if (await exists(join(projectPath, 'platformio.ini'))) {
        result.language = 'C++';
        result.framework = 'PlatformIO';
    }

    // --- Java/Kotlin (Spring Boot) ---
    if (await exists(join(projectPath, 'pom.xml'))) {
        result.language = result.language || 'Java';
        result.framework = result.framework || 'Spring Boot';
        result.buildTool = 'Maven';
    }
    if (await exists(join(projectPath, 'build.gradle')) || await exists(join(projectPath, 'build.gradle.kts'))) {
        result.language = result.language || 'Java';
        result.framework = result.framework || 'Spring Boot';
        result.buildTool = 'Gradle';
    }

    // --- Rust ---
    if (await exists(join(projectPath, 'Cargo.toml'))) {
        result.language = 'Rust';
    }

    // Docker & CI/CD
    result.hasDocker = await exists(join(projectPath, 'Dockerfile'))
        || await exists(join(projectPath, 'docker-compose.yml'))
        || await exists(join(projectPath, 'docker-compose.yaml'));
    result.hasCICD = await exists(join(projectPath, '.github', 'workflows'));

    return result;
}
