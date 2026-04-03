import * as p from '@clack/prompts';
import pc from 'picocolors';
import { stacks, getCategoryOptions, getDecoupledOption } from '../registry/stacks.js';
import { getDefaultFeatures, getApplicableFeatures } from '../registry/features.js';
import { validateProjectName } from '../utils/validation.js';
import {
    handleCancel,
    promptDatabase,
    promptLanguage,
    promptCustomizeFeatures,
    promptBoard,
    promptStyles,
} from './shared-prompts.js';

/**
 * Ejecuta el flujo interactivo completo de creación
 * @param {string|undefined} initialName
 * @param {object} options
 * @returns {Promise<object>} configuración completa del proyecto
 */
export async function runCreatePrompts(initialName, options = {}) {
    p.intro(pc.magenta('Crear nuevo proyecto'));

    // 1. Nombre del proyecto
    const projectName = initialName || handleCancel(await p.text({
        message: '¿Cuál es el nombre de tu proyecto?',
        placeholder: 'mi-app',
        validate: validateProjectName,
    }));

    if (typeof projectName === 'string' && validateProjectName(projectName)) {
        p.log.error(validateProjectName(projectName));
        return null;
    }

    // 2. Tipo de aplicación
    const categoryOptions = getCategoryOptions();
    // Insertar opción desacoplada después de web-fullstack-integrated
    const idx = categoryOptions.findIndex((o) => o.value === 'web-fullstack-integrated');
    categoryOptions.splice(idx + 1, 0, getDecoupledOption());

    const categoryId = handleCancel(await p.select({
        message: '¿Qué tipo de aplicación necesitas?',
        options: categoryOptions,
    }));

    // 3. Flujo según categoría
    let config;

    if (categoryId === 'web-fullstack-decoupled') {
        config = await handleDecoupledFlow(projectName);
    } else {
        config = await handleStandardFlow(projectName, categoryId);
    }

    if (!config) return null;

    // 4. Mostrar resumen y confirmar
    displaySummary(config);

    const action = handleCancel(await p.select({
        message: '¿Crear proyecto?',
        options: [
            { value: 'create', label: 'Sí, crear proyecto' },
            { value: 'customize', label: 'Personalizar (quitar/agregar features)' },
            { value: 'cancel', label: 'Cancelar' },
        ],
    }));

    if (action === 'cancel') return null;

    if (action === 'customize') {
        config.features = await promptCustomizeFeatures(config.categoryId);
    }

    p.outro(pc.green('Generando proyecto...'));
    return config;
}

/**
 * Flujo estándar: una sola categoría con un framework
 */
async function handleStandardFlow(projectName, categoryId) {
    const category = stacks[categoryId];
    const entries = category.entries;

    // Seleccionar framework
    const stackId = handleCancel(await p.select({
        message: 'Elige el framework:',
        options: entries.map((e) => ({
            value: e.id,
            label: e.name,
            hint: e.description,
        })),
    }));

    const stackEntry = entries.find((e) => e.id === stackId);

    // Lenguaje (auto o preguntar)
    let language = stackEntry.autoLanguage;
    if (!language) {
        language = await promptLanguage(stackEntry.languageOptions);
    } else {
        p.log.info(`Auto: ${language} ${stackEntry.notes ? `(${stackEntry.notes})` : ''}`);
    }

    // Estilos CSS (solo si aplica — web, mobile, desktop)
    const cssStyle = await promptStyles(categoryId);

    // Board (para IoT)
    let board = null;
    if (stackEntry.boardOptions) {
        board = await promptBoard(stackEntry.boardOptions);
    }

    // Base de datos
    let database = null;
    if (stackEntry.compatibleDatabases.length > 0) {
        // Para SPA preguntar si necesita DB
        if (categoryId === 'web-frontend') {
            const needsDb = handleCancel(await p.select({
                message: '¿Necesitas conectar a una base de datos?',
                options: [
                    { value: true, label: 'Sí' },
                    { value: false, label: 'No (solo frontend)' },
                ],
            }));
            if (needsDb) {
                database = await promptDatabase(stackEntry.compatibleDatabases);
            }
        } else {
            database = await promptDatabase(stackEntry.compatibleDatabases);
        }
    }

    // Features por defecto (todos habilitados para fullstack/backend)
    const applicableFeatures = getApplicableFeatures(categoryId);
    const defaultFeatureIds = applicableFeatures
        .filter((f) => f.defaultEnabled)
        .map((f) => f.id);

    return {
        projectName,
        categoryId,
        stackId,
        stackEntry,
        language,
        cssStyle,
        database,
        board,
        features: defaultFeatureIds,
        isDecoupled: false,
    };
}

/**
 * Flujo desacoplado: frontend + backend separados
 */
async function handleDecoupledFlow(projectName) {
    // Seleccionar frontend
    const frontendEntries = stacks['web-frontend'].entries;
    const frontendId = handleCancel(await p.select({
        message: 'Elige el framework frontend:',
        options: frontendEntries.map((e) => ({
            value: e.id,
            label: e.name,
            hint: e.description,
        })),
    }));
    const frontendEntry = frontendEntries.find((e) => e.id === frontendId);

    // Lenguaje frontend
    let frontendLanguage = frontendEntry.autoLanguage;
    if (!frontendLanguage) {
        frontendLanguage = await promptLanguage(frontendEntry.languageOptions);
    } else {
        p.log.info(`Auto: ${frontendEntry.name} → ${frontendLanguage}`);
    }
    // Estilos CSS para el frontend
    const cssStyle = await promptStyles('web-frontend');

    // Seleccionar backend
    const backendEntries = stacks['api-backend'].entries;
    const backendId = handleCancel(await p.select({
        message: 'Elige el framework backend:',
        options: backendEntries.map((e) => ({
            value: e.id,
            label: e.name,
            hint: e.description,
        })),
    }));
    const backendEntry = backendEntries.find((e) => e.id === backendId);

    // Lenguaje backend
    let backendLanguage = backendEntry.autoLanguage;
    if (!backendLanguage) {
        backendLanguage = await promptLanguage(backendEntry.languageOptions);
    } else {
        p.log.info(`Auto: ${backendEntry.name} → ${backendLanguage}`);
    }

    // Base de datos (usando compatibilidad del backend)
    const database = await promptDatabase(backendEntry.compatibleDatabases);

    // Features por defecto
    const applicableFeatures = getApplicableFeatures('web-fullstack-decoupled');
    const defaultFeatureIds = applicableFeatures
        .filter((f) => f.defaultEnabled)
        .map((f) => f.id);

    return {
        projectName,
        categoryId: 'web-fullstack-decoupled',
        isDecoupled: true,
        cssStyle,
        frontend: {
            stackId: frontendId,
            stackEntry: frontendEntry,
            language: frontendLanguage,
        },
        backend: {
            stackId: backendId,
            stackEntry: backendEntry,
            language: backendLanguage,
        },
        database,
        features: defaultFeatureIds,
    };
}

/**
 * Muestra resumen visual del stack configurado
 */
function displaySummary(config) {
    console.log();
    p.log.message(pc.cyan(pc.bold('Stack completo configurado:')));
    console.log();

    if (config.isDecoupled) {
        console.log(`  ${pc.white(pc.bold(`📦 ${config.projectName}/`))}`);
        console.log();
        console.log(`  ${pc.cyan('frontend/')}         → ${config.frontend.stackEntry.name} (${config.frontend.language})`);
        if (config.frontend.stackEntry.autoUI) {
            console.log(`  ${pc.dim('  └──')} ${config.frontend.stackEntry.autoUI}`);
        }
        console.log(`  ${pc.cyan('backend/')}          → ${config.backend.stackEntry.name} (${config.backend.language})`);
        if (config.database) {
            console.log(`  ${pc.cyan('Database:')}         ${config.database}`);
        }
    } else {
        console.log(`  ${pc.white(pc.bold(`📦 ${config.projectName}/`))}`);
        console.log(`  ${pc.dim('├──')} Framework:  ${config.stackEntry.name} (${config.language})`);
        if (config.database) {
            console.log(`  ${pc.dim('├──')} Database:   ${config.database}`);
        }
        if (config.stackEntry.autoUI) {
            console.log(`  ${pc.dim('├──')} Estilos:    ${config.stackEntry.autoUI} + Dark Mode`);
        }
        if (config.board) {
            console.log(`  ${pc.dim('├──')} Board:      ${config.board}`);
        }
    }

    // Features
    if (config.features.length > 0) {
        const featureLabels = {
            docker: 'Docker + docker-compose',
            cicd: 'CI/CD (GitHub Actions)',
            'ai-skills': '.cursorrules (AI practices)',
            mcp: 'MCP Config',
            security: 'Seguridad (.env validation + headers)',
            'ui-styling': 'UI/UX (Tailwind + component lib + dark mode)',
            database: 'Database config',
        };
        config.features.forEach((fId) => {
            console.log(`  ${pc.dim('├──')} ${featureLabels[fId] || fId}`);
        });
    }

    console.log();
}
