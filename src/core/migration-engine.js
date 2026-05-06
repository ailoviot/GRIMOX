import { join } from 'node:path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { writeFileSafe, ensureDir, copyDir } from '../utils/fs-helpers.js';
import { createLLMClient } from './llm-client.js';
import { analyzeProject, generateSmartMigrationSteps, generateCodemods } from './code-analyzer.js';
import { inject as injectQACli } from '../injectors/qa-cli.js';
import { logger } from '../utils/logger.js';

/**
 * Ejecuta la migración completa (detecta, analiza con LLM, genera plan o aplica)
 * @param {object} config - configuración de migración (de migrate-prompts)
 * @param {object} options - opciones del comando
 */
export async function migrate(config, options = {}) {
    const projectPath = process.cwd();
    const spinner = p.spinner();

    // Crear cliente LLM
    const llmClient = createLLMClient(config.llm);

    if (config.mode === 'plan' || options.plan) {
        // --- Modo Plan: analiza con LLM y genera MIGRATION_PLAN.md ---
        spinner.start('Analizando código fuente con IA...');
        const analysis = await analyzeProjectWithLLM(projectPath, config, llmClient);
        spinner.stop('Análisis completado');

        spinner.start('Generando plan de migración inteligente...');
        await generateMigrationPlan(projectPath, config, analysis, llmClient);
        spinner.stop('Plan generado');

        displayPlanResult(config);
    } else {
        // --- Modo Apply: backup + análisis + transformaciones ---
        spinner.start('Creando backup...');
        await createBackup(projectPath, config);
        spinner.stop('Backup creado en .grimox-backup/');

        spinner.start('Analizando código fuente con IA...');
        const analysis = await analyzeProjectWithLLM(projectPath, config, llmClient);
        spinner.stop('Análisis completado');

        spinner.start('Generando plan de migración...');
        await generateMigrationPlan(projectPath, config, analysis, llmClient);
        spinner.stop('Plan generado');

        spinner.start('Aplicando transformaciones de código...');
        const results = await applyCodemods(projectPath, config, analysis, llmClient);
        spinner.stop(`Transformaciones aplicadas: ${results.applied}/${results.total} archivos`);

        // Inyectar grimox-qa al proyecto migrado (mismo flujo que `grimox create`).
        // Solo si el stack destino tiene UI. Try/catch silencioso: si falla,
        // la migración sigue exitosa — la inyección de QA es bonus, no requisito.
        try {
            const qaConfig = adaptMigrateConfigForQA(config);
            if (qaConfig) {
                spinner.start('Inyectando grimox-qa (QA visual)...');
                await injectQACli(projectPath, qaConfig);
                spinner.stop('grimox-qa inyectado (npm run dev abrirá browser visible con overlays)');
            }
        } catch (err) {
            logger.warn(`grimox-qa no se pudo inyectar (la migración sigue OK): ${err.message}`);
        }

        displayApplyResult(config, results);
    }
}

/**
 * Adapta el config de migración (con `migrations[]`) al shape que espera
 * el inyector qa-cli (que viene del flujo `grimox create`: { isDecoupled,
 * stackId, database, ... }).
 *
 * Retorna null si la migración no produce un stack con UI o si no hay
 * targetStackId — en ese caso saltamos la inyección sin error.
 */
function adaptMigrateConfigForQA(config) {
    const migs = config.migrations || [];
    if (migs.length === 0) return null;

    if (migs.length === 1) {
        const m = migs[0];
        if (!m.targetStackId) return null;
        return {
            isDecoupled: false,
            stackId: m.targetStackId,
            stackEntry: m.targetStack,
            database: m.database,
            features: [],
        };
    }

    // Migraciones múltiples → tratar como decoupled. Identificar frontend/backend
    // por categoría del stack destino. Si no podemos distinguir claramente,
    // tratamos la primera con UI como frontend.
    const findFrontend = (mig) => {
        const tags = mig.targetStack?.tags || [];
        const cat = mig.targetStack?.category || mig.targetCategoryId || '';
        return tags.includes('ssr') || tags.includes('spa') || cat.includes('frontend') || cat.includes('fullstack');
    };
    const findBackend = (mig) => {
        const tags = mig.targetStack?.tags || [];
        const cat = mig.targetStack?.category || mig.targetCategoryId || '';
        return tags.includes('api') || cat.includes('backend');
    };

    const frontMig = migs.find(findFrontend) || migs[0];
    const backMig = migs.find(findBackend) || migs.find((m) => m !== frontMig);

    if (!frontMig?.targetStackId) return null;

    return {
        isDecoupled: true,
        frontend: { stackId: frontMig.targetStackId, stackEntry: frontMig.targetStack },
        backend: backMig ? { stackId: backMig.targetStackId, stackEntry: backMig.targetStack } : undefined,
        database: frontMig.database || backMig?.database,
        features: [],
    };
}

/**
 * Analiza el proyecto usando el LLM
 */
async function analyzeProjectWithLLM(projectPath, config, llmClient) {
    try {
        const analysis = await analyzeProject(projectPath, config.detection, llmClient);
        return analysis;
    } catch (err) {
        logger.warn(`Análisis con LLM parcial: ${err.message}`);
        // Retorna análisis básico si el LLM falla
        return {
            architecture: 'No analizado (LLM no disponible)',
            patterns: [],
            issues: config.detection.parts?.flatMap((p) => p.issues || []) || [],
            recommendations: [],
        };
    }
}

/**
 * Genera MIGRATION_PLAN.md usando análisis del LLM
 */
async function generateMigrationPlan(projectPath, config, analysis, llmClient) {
    const { detection, migrations } = config;

    let content = `# Plan de Migración — Grimox CLI\n\n`;
    content += `**Fecha:** ${new Date().toISOString().split('T')[0]}\n`;
    content += `**Modelo IA:** ${config.llm?.name || 'No especificado'}\n`;
    content += `**Estructura:** ${detection.structure === 'decoupled' ? 'Desacoplado' : 'Monolítico'}\n`;
    content += `**Partes a migrar:** ${migrations.length}\n\n`;

    // Análisis del LLM
    if (analysis.architecture) {
        content += `## Análisis del Proyecto (generado por IA)\n\n`;
        if (typeof analysis === 'string') {
            content += analysis + '\n\n';
        } else {
            if (analysis.architecture) content += `**Arquitectura:** ${analysis.architecture}\n`;
            if (analysis.patterns?.length) content += `**Patrones:** ${analysis.patterns.join(', ')}\n`;
            if (analysis.stateManagement) content += `**Estado:** ${analysis.stateManagement}\n`;
            if (analysis.authPattern) content += `**Autenticación:** ${analysis.authPattern}\n`;
            if (analysis.dbPattern) content += `**Acceso a DB:** ${analysis.dbPattern}\n`;
            content += '\n';

            if (analysis.issues?.length) {
                content += `### Problemas Detectados\n\n`;
                analysis.issues.forEach((issue) => {
                    content += `- ⚠ ${issue}\n`;
                });
                content += '\n';
            }

            if (analysis.recommendations?.length) {
                content += `### Recomendaciones de la IA\n\n`;
                analysis.recommendations.forEach((rec) => {
                    content += `- 💡 ${rec}\n`;
                });
                content += '\n';
            }
        }
        content += `---\n\n`;
    }

    // Pasos de migración por cada parte
    for (const mig of migrations) {
        const { part, targetStack, database } = mig;
        const partLabel = part.folder === '.' ? 'Proyecto principal' : `${part.role} (${part.folder}/)`;
        const targetName = targetStack?.name || mig.migrationPath?.label || 'Stack moderno';

        content += `## ${partLabel}\n\n`;
        content += `**Stack actual:** ${part.framework || 'Desconocido'} ${part.frameworkVersion || ''} (${part.language || '?'})\n`;
        content += `**Stack destino:** ${targetName}\n`;
        if (database) content += `**Base de datos:** ${database}\n`;
        content += '\n';

        // Intentar generar pasos inteligentes con LLM
        try {
            const smartSteps = await generateSmartMigrationSteps(analysis, targetStack, llmClient);

            if (smartSteps && smartSteps.length > 0) {
                content += `### Pasos de Migración (generados por IA)\n\n`;
                smartSteps.forEach((step, i) => {
                    content += `#### ${i + 1}. ${step.title}\n\n`;
                    content += `${step.description}\n\n`;

                    if (step.files?.length) {
                        content += `**Archivos afectados:**\n`;
                        step.files.forEach((f) => content += `- \`${f}\`\n`);
                        content += '\n';
                    }

                    if (step.codeSnippets?.length) {
                        step.codeSnippets.forEach((snippet) => {
                            if (snippet.before) {
                                content += `**Antes:**\n\`\`\`${snippet.language || ''}\n${snippet.before}\n\`\`\`\n\n`;
                            }
                            if (snippet.after) {
                                content += `**Después:**\n\`\`\`${snippet.language || ''}\n${snippet.after}\n\`\`\`\n\n`;
                            }
                        });
                    }
                });
            } else {
                // Fallback a pasos genéricos del registry
                content += `### Pasos de Migración\n\n`;
                const steps = mig.steps || ['Migrar framework', 'Actualizar dependencias', 'Adaptar estructura'];
                steps.forEach((step, i) => {
                    content += `- [ ] ${i + 1}. ${step}\n`;
                });
                content += '\n';
            }
        } catch {
            // Fallback a pasos genéricos del registry
            content += `### Pasos de Migración\n\n`;
            const steps = mig.steps || ['Migrar framework', 'Actualizar dependencias', 'Adaptar estructura'];
            steps.forEach((step, i) => {
                content += `- [ ] ${i + 1}. ${step}\n`;
            });
            content += '\n';
        }
    }

    // Infraestructura
    content += `## Infraestructura\n\n`;
    if (!detection.infra?.hasDocker) content += `- [ ] Agregar Docker + docker-compose\n`;
    if (!detection.infra?.hasCICD) content += `- [ ] Agregar CI/CD (GitHub Actions)\n`;
    content += `- [ ] Agregar seguridad (.env validation, CSP, CORS)\n`;
    content += `- [ ] Agregar .cursorrules + GRIMOX.md (integraciones IDE)\n`;
    content += `- [ ] Agregar MCP config\n\n`;

    content += `---\n\n`;
    content += `Para aplicar: \`grimox migrate --apply\`\n\n`;
    content += `> Generado por Grimox CLI v0.1.0 con ${config.llm?.name || 'IA'}\n`;

    await writeFileSafe(join(projectPath, 'MIGRATION_PLAN.md'), content);
}

/**
 * Aplica codemods usando el LLM para transformar archivos
 */
async function applyCodemods(projectPath, config, analysis, llmClient) {
    const results = { applied: 0, total: 0, errors: [] };

    for (const mig of config.migrations) {
        const part = mig.part;
        const partPath = part.folder === '.' ? projectPath : join(projectPath, part.folder);

        // Obtener archivos a transformar
        const { collectSourceFiles } = await import('./code-analyzer.js');
        const sourceFiles = await collectSourceFiles(partPath, 15);
        results.total += sourceFiles.length;

        for (const file of sourceFiles) {
            try {
                const result = await generateCodemods(file.content, mig.targetStack, llmClient);

                if (result && result.transformedCode && result.transformedCode !== file.content) {
                    const fullPath = join(partPath, file.path);
                    await writeFileSafe(fullPath, result.transformedCode);
                    results.applied++;
                    logger.step(`  Transformado: ${file.path}`);
                }
            } catch (err) {
                results.errors.push({ file: file.path, error: err.message });
            }
        }
    }

    return results;
}

/**
 * Crea backup de archivos que serán modificados
 */
async function createBackup(projectPath, config) {
    const backupPath = join(projectPath, '.grimox-backup');
    await ensureDir(backupPath);

    for (const mig of config.migrations) {
        const folder = mig.part.folder;
        if (folder && folder !== '.') {
            const srcPath = join(projectPath, folder);
            const destPath = join(backupPath, folder);
            try {
                await copyDir(srcPath, destPath);
            } catch {
                logger.warn(`No se pudo hacer backup de ${folder}/`);
            }
        }
    }

    await writeFileSafe(
        join(backupPath, 'README.md'),
        `# Grimox Backup\n\nBackup creado el ${new Date().toISOString()}\n\nCarpetas respaldadas:\n${config.migrations.map((m) => `- ${m.part.folder}/`).join('\n')}\n`
    );
}

/**
 * Muestra resultado del plan
 */
function displayPlanResult(config) {
    const totalSteps = config.migrations.reduce((sum, m) => sum + (m.steps?.length || 0), 0);

    console.log();
    console.log(pc.green(pc.bold('  ╭─────────────────────────────────────────────────────╮')));
    console.log(pc.green(pc.bold('  │')) + '  ✔ Plan de migración generado con IA' + pc.green(pc.bold('                │')));
    console.log(pc.green(pc.bold('  │')) + pc.green(pc.bold('                                                     │')));
    console.log(pc.green(pc.bold('  │')) + '  📄 MIGRATION_PLAN.md' + pc.green(pc.bold('                                 │')));
    console.log(pc.green(pc.bold('  │')) + `  🤖 Modelo: ${(config.llm?.name || 'IA').substring(0, 35)}`.padEnd(53) + pc.green(pc.bold('│')));

    for (const mig of config.migrations) {
        const label = mig.part.folder === '.'
            ? `  ${mig.targetStack?.name || 'Migración'}`
            : `  ${mig.part.role} (${mig.part.folder}/) → ${mig.targetStack?.name || ''}`;
        console.log(pc.green(pc.bold('  │')) + label.padEnd(53) + pc.green(pc.bold('│')));
    }

    console.log(pc.green(pc.bold('  │')) + pc.green(pc.bold('                                                     │')));
    console.log(pc.green(pc.bold('  │')) + '  Para aplicar:  grimox migrate --apply'.padEnd(53) + pc.green(pc.bold('│')));
    console.log(pc.green(pc.bold('  ╰─────────────────────────────────────────────────────╯')));
    console.log();
}

/**
 * Muestra resultado de la aplicación
 */
function displayApplyResult(config, results) {
    console.log();
    console.log(pc.green(pc.bold('  ╭─────────────────────────────────────────────────────╮')));
    console.log(pc.green(pc.bold('  │')) + '  ✔ Migración aplicada con IA' + pc.green(pc.bold('                        │')));
    console.log(pc.green(pc.bold('  │')) + pc.green(pc.bold('                                                     │')));
    console.log(pc.green(pc.bold('  │')) + '  📁 .grimox-backup/ (archivos originales)' + pc.green(pc.bold('           │')));
    console.log(pc.green(pc.bold('  │')) + '  📄 MIGRATION_PLAN.md (plan detallado)' + pc.green(pc.bold('              │')));
    console.log(pc.green(pc.bold('  │')) + `  🔄 Archivos transformados: ${results.applied}/${results.total}`.padEnd(53) + pc.green(pc.bold('│')));

    if (results.errors.length > 0) {
        console.log(pc.green(pc.bold('  │')) + pc.green(pc.bold('                                                     │')));
        console.log(pc.green(pc.bold('  │')) + pc.yellow(`  ⚠ ${results.errors.length} archivo(s) requieren revisión manual`) + pc.green(pc.bold('  │')));
    }

    console.log(pc.green(pc.bold('  ╰─────────────────────────────────────────────────────╯')));
    console.log();
}
