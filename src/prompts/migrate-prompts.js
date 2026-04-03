import * as p from '@clack/prompts';
import pc from 'picocolors';
import { stacks } from '../registry/stacks.js';
import { findStackById } from '../registry/stacks.js';
import { findMigrationPaths } from '../registry/migrations.js';
import {
    getCompatibleTargets,
    getCompatibleTargetsForProject,
    targetLabels,
    classifyDetectedStack,
} from '../registry/migration-compatibility.js';
import { handleCancel, promptDatabase, promptStyles } from './shared-prompts.js';

/**
 * Ejecuta el flujo interactivo de migración
 * @param {object} detection - resultado de detectProject (con structure, parts[], infra)
 * @param {object} options - opciones del comando
 * @returns {Promise<object>} configuración de migración
 */
export async function runMigratePrompts(detection, options = {}) {
    p.intro(pc.magenta('Migration Assistant'));

    // Sin proyectos encontrados
    if (detection.parts.length === 0) {
        p.log.warn('No se encontró ningún proyecto en esta carpeta ni en subcarpetas.');
        p.log.info('Puedes indicar las rutas manualmente:');
        p.log.info('  grimox migrate --frontend=./client --backend=./server');
        p.outro('');
        return null;
    }

    // 1. Mostrar estructura detectada
    displayStructure(detection);

    // 2. Si es desacoplado, preguntar qué partes migrar
    let partsToMigrate = detection.parts;

    if (detection.structure === 'decoupled' && detection.parts.length > 1) {
        const partOptions = [
            {
                value: 'all',
                label: 'Todo (frontend + backend)',
                hint: 'Migrar todas las partes detectadas',
            },
            ...detection.parts.map((part) => ({
                value: part.folder,
                label: `Solo ${part.role} (${part.folder}/)`,
                hint: `${part.framework || part.language || 'Desconocido'}`,
            })),
        ];

        const choice = handleCancel(await p.select({
            message: '¿Qué deseas migrar?',
            options: partOptions,
        }));

        if (choice !== 'all') {
            partsToMigrate = detection.parts.filter((p) => p.folder === choice);
        }
    }

    // 3. Para cada parte: mostrar detalle → preguntar tipo destino → framework
    const migrationConfigs = [];

    for (const part of partsToMigrate) {
        const partLabel = detection.structure === 'decoupled'
            ? `${part.role} (${part.folder}/)`
            : part.folder === '.' ? 'Proyecto' : part.folder;

        displayPartDetection(part, partLabel);

        // 3a. Preguntar tipo de arquitectura destino (filtrado por compatibilidad)
        const compatibleTargetIds = getCompatibleTargets(part);
        const targetOptions = compatibleTargetIds
            .filter((id) => targetLabels[id])
            .map((id) => ({
                value: id,
                label: targetLabels[id].label,
                hint: targetLabels[id].hint,
            }));

        if (targetOptions.length === 0) {
            p.log.warn(`No hay rutas de migración compatibles para ${partLabel}.`);
            continue;
        }

        let targetCategoryId;

        if (targetOptions.length === 1) {
            // Solo una opción compatible → seleccionar automáticamente
            targetCategoryId = targetOptions[0].value;
            p.log.info(`Tipo destino: ${targetLabels[targetCategoryId].label}`);
        } else {
            targetCategoryId = handleCancel(await p.select({
                message: `¿A qué tipo de aplicación migrar ${partLabel}?`,
                options: targetOptions,
            }));
        }

        // 3b. Mostrar frameworks de la categoría destino elegida
        const category = stacks[targetCategoryId];

        if (!category || category.entries.length === 0) {
            // Para categorías combinadas (desacoplado), manejar de forma especial
            if (targetCategoryId === 'web-fullstack-decoupled') {
                p.log.info('Para fullstack desacoplado, usa "grimox create" con la opción Desacoplado.');
                continue;
            }
            p.log.warn(`No hay frameworks disponibles para ${targetLabels[targetCategoryId]?.label}.`);
            continue;
        }

        // Identificar framework recomendado (si existe en migrationPaths)
        const migPaths = findMigrationPaths(part);
        const recommendedId = migPaths.length > 0 ? migPaths[0].target : null;

        // Mostrar TODOS los frameworks de la categoría — no sesgar, solo recomendar
        const frameworkOptions = category.entries.map((entry) => ({
            value: entry.id,
            label: entry.id === recommendedId
                ? `${entry.name} (Recomendado)`
                : entry.name,
            hint: entry.description,
        }));

        // Agregar frameworks de otras categorías que estén en migrationPaths.alternatives
        for (const path of migPaths) {
            if (path.alternatives) {
                for (const altId of path.alternatives) {
                    if (!frameworkOptions.find((o) => o.value === altId)) {
                        const altStack = findStackById(altId);
                        if (altStack) {
                            frameworkOptions.push({
                                value: altId,
                                label: altStack.name,
                                hint: altStack.description,
                            });
                        }
                    }
                }
            }
        }

        const targetStackId = handleCancel(await p.select({
            message: `Elige el framework para ${partLabel}:`,
            options: frameworkOptions,
        }));

        const targetStack = findStackById(targetStackId) || category.entries.find((e) => e.id === targetStackId);

        // 3c. Estilos CSS (cuando aplica)
        const cssStyle = await promptStyles(targetCategoryId);

        // 3d. Base de datos — mostrar TODAS las compatibles, recomendar la actual
        let database = null;
        if (targetStack?.compatibleDatabases?.length > 0) {
            database = await promptDatabase(targetStack.compatibleDatabases);
        }

        // 3e. Construir pasos de migración
        const selectedMigPath = migPaths.find((mp) => mp.key === targetStackId || mp.target === targetStackId);
        const steps = selectedMigPath?.steps || [
            `Migrar ${part.framework || part.language} → ${targetStack?.name || 'nuevo framework'}`,
            'Actualizar dependencias',
            'Adaptar estructura de archivos',
            'Configurar Docker + CI/CD',
            'Agregar .cursorrules + MCP',
        ];

        migrationConfigs.push({
            part,
            targetCategoryId,
            targetStackId,
            targetStack,
            cssStyle,
            database,
            steps,
            migrationPath: selectedMigPath,
        });
    }

    if (migrationConfigs.length === 0) {
        p.log.warn('No hay migraciones disponibles para las partes seleccionadas.');
        p.outro('');
        return null;
    }

    // 4. Modo de migración
    let mode = 'plan';
    if (!options.apply && !options.plan) {
        mode = handleCancel(await p.select({
            message: '¿Modo de migración?',
            options: [
                { value: 'plan', label: 'Generar plan (revisar antes de aplicar)', hint: 'MIGRATION_PLAN.md' },
                { value: 'apply', label: 'Aplicar automáticamente (con backup)', hint: '.grimox-backup/' },
            ],
        }));
    } else if (options.apply) {
        mode = 'apply';
    }

    p.outro(pc.green('Procesando migración...'));

    return {
        detection,
        structure: detection.structure,
        migrations: migrationConfigs,
        mode,
    };
}

/**
 * Muestra la estructura general del proyecto
 */
function displayStructure(detection) {
    const { structure, parts, infra } = detection;

    if (structure === 'decoupled') {
        p.log.message(pc.cyan(pc.bold('Estructura detectada: Proyecto desacoplado')));
        console.log();
        parts.forEach((part) => {
            const icon = part.role === 'frontend' ? '🖥️' : part.role === 'backend' ? '⚙️' : '📁';
            const fw = part.framework ? `${part.framework} ${part.frameworkVersion || ''}` : part.language || 'Desconocido';
            console.log(`  ${icon} ${pc.white(pc.bold(part.folder + '/'))}  →  ${pc.cyan(fw)}`);
        });
    } else {
        p.log.message(pc.cyan(pc.bold('Estructura detectada: Proyecto monolítico')));
        console.log();
        const part = parts[0];
        if (part) {
            const fw = part.framework ? `${part.framework} ${part.frameworkVersion || ''}` : part.language || 'Desconocido';
            console.log(`  📁 ${pc.white(pc.bold(part.folder === '.' ? 'raíz/' : part.folder + '/'))}  →  ${pc.cyan(fw)}`);
        }
    }

    // Infraestructura
    console.log();
    console.log(`  ${pc.dim('├──')} Docker:  ${infra.hasDocker ? pc.green('✓') : pc.red('✗ No detectado')}`);
    console.log(`  ${pc.dim('└──')} CI/CD:   ${infra.hasCICD ? pc.green('✓') : pc.red('✗ No detectado')}`);
    console.log();
}

/**
 * Muestra detalle de una parte del proyecto
 */
function displayPartDetection(part, label) {
    p.log.message(pc.cyan(`Stack — ${label}:`));

    const lines = [
        ['Lenguaje', part.language || 'Desconocido'],
        ['Framework', `${part.framework || 'Sin framework'} ${part.frameworkVersion || ''}`],
        ['Build', part.buildTool || 'No detectado'],
        ['Database', part.database || 'No detectada'],
        ['Estilos', part.styling || 'No detectado'],
        ['Tests', part.hasTests ? '✓' : '✗ No detectado'],
    ];

    lines.forEach(([lbl, value]) => {
        const icon = value.startsWith('✗') ? pc.red(value) : pc.white(value);
        console.log(`  ${pc.dim('├──')} ${pc.gray(lbl.padEnd(12))} ${icon}`);
    });

    // Issues
    if (part.issues?.length > 0) {
        console.log();
        part.issues.forEach((issue) => {
            console.log(`  ${pc.yellow('⚠')} ${issue}`);
        });
    }
    console.log();
}
