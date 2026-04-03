import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { cloneTemplate, initGit } from '../utils/git-helpers.js';
import { exists, writeFileSafe, readJson, copyDir, ensureDir } from '../utils/fs-helpers.js';
import { injectFeatures } from './feature-injector.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Ruta a la carpeta templates/ dentro de GRIMOX */
const TEMPLATES_DIR = resolve(__dirname, '..', '..', 'templates');

/**
 * Orquesta la creación completa de un proyecto.
 *
 * Orden de búsqueda de templates:
 *   1. templates/ local (dentro de GRIMOX)
 *   2. GitHub remoto (grimox-templates org)
 *   3. Scaffold mínimo (package.json + README + src/)
 *
 * @param {object} config - configuración del proyecto (de create-prompts)
 */
export async function scaffold(config) {
    const projectPath = resolve(process.cwd(), config.projectName);

    // Verificar que no exista
    if (await exists(projectPath)) {
        logger.error(`El directorio "${config.projectName}" ya existe.`);
        process.exit(1);
    }

    const spinner = p.spinner();

    try {
        if (config.isDecoupled) {
            await scaffoldDecoupled(config, projectPath, spinner);
        } else {
            await scaffoldStandard(config, projectPath, spinner);
        }

        // Inyectar features + integraciones IDE
        spinner.start('Aplicando features e integraciones IDE...');
        await injectFeatures(projectPath, config);
        spinner.stop('Features e integraciones IDE aplicadas');

        // Inicializar git
        initGit(projectPath);

        // Mostrar resultado
        displayResult(config, projectPath);
    } catch (err) {
        spinner.stop('Error');
        throw err;
    }
}

/**
 * Resuelve el template: primero local, luego remoto, luego scaffold mínimo.
 * @param {string} repo - nombre del template (ej: "nextjs-15", "react-spa")
 * @param {string} destPath - directorio destino
 * @param {string} stackName - nombre para logs
 * @param {object} spinner
 * @returns {Promise<'local'|'remote'|'minimal'>} fuente del template
 */
async function resolveTemplate(repo, destPath, stackName, spinner) {
    // 1. Buscar en templates/ local
    const localPath = join(TEMPLATES_DIR, repo);
    if (await exists(localPath)) {
        spinner.message = `Copiando template local ${stackName}...`;
        await copyDir(localPath, destPath);
        return 'local';
    }

    // 2. Intentar clonar desde GitHub
    try {
        spinner.message = `Clonando template remoto ${stackName}...`;
        await cloneTemplate(repo, destPath);
        return 'remote';
    } catch {
        // 3. Fallback: scaffold mínimo
        return 'minimal';
    }
}

/**
 * Scaffold estándar: un solo framework
 */
async function scaffoldStandard(config, projectPath, spinner) {
    const { stackEntry, language } = config;

    // Determinar nombre del template
    let repo = stackEntry.repo;
    if (language === 'TypeScript' && stackEntry.autoLanguage === null) {
        repo = `${repo}-ts`;
    } else if (language === 'JavaScript' && stackEntry.autoLanguage === null) {
        repo = `${repo}-js`;
    }

    spinner.start(`Preparando template ${stackEntry.name}...`);

    // Intentar primero con sufijo de lenguaje, luego sin sufijo
    let source = await resolveTemplate(repo, projectPath, stackEntry.name, spinner);

    if (source === 'minimal' && repo !== stackEntry.repo) {
        // Si el template con sufijo no existe, intentar sin sufijo
        source = await resolveTemplate(stackEntry.repo, projectPath, stackEntry.name, spinner);
    }

    if (source === 'minimal') {
        spinner.stop(`Creando estructura base para ${stackEntry.name}...`);
        await createMinimalScaffold(config, projectPath);
    } else {
        spinner.stop(`Template ${stackEntry.name} listo (${source === 'local' ? '📁 local' : '☁️ remoto'})`);
    }

    // Reemplazar nombre del proyecto
    await replaceProjectName(projectPath, config.projectName);
}

/**
 * Scaffold desacoplado: frontend + backend en carpetas separadas
 */
async function scaffoldDecoupled(config, projectPath, spinner) {
    const { frontend, backend } = config;
    const frontendPath = join(projectPath, 'frontend');
    const backendPath = join(projectPath, 'backend');

    await ensureDir(projectPath);

    // Frontend
    spinner.start(`Preparando ${frontend.stackEntry.name}...`);
    let fSource = await resolveTemplate(frontend.stackEntry.repo, frontendPath, frontend.stackEntry.name, spinner);
    if (fSource === 'minimal') {
        await createMinimalScaffold(
            { ...config, stackEntry: frontend.stackEntry, language: frontend.language, projectName: config.projectName },
            frontendPath
        );
    }
    spinner.stop(`Frontend ${frontend.stackEntry.name} listo (${fSource === 'local' ? '📁 local' : fSource === 'remote' ? '☁️ remoto' : '📦 base'})`);

    // Backend
    spinner.start(`Preparando ${backend.stackEntry.name}...`);
    let bSource = await resolveTemplate(backend.stackEntry.repo, backendPath, backend.stackEntry.name, spinner);
    if (bSource === 'minimal') {
        await createMinimalScaffold(
            { ...config, stackEntry: backend.stackEntry, language: backend.language, projectName: config.projectName },
            backendPath
        );
    }
    spinner.stop(`Backend ${backend.stackEntry.name} listo (${bSource === 'local' ? '📁 local' : bSource === 'remote' ? '☁️ remoto' : '📦 base'})`);

    // Reemplazar nombres
    await replaceProjectName(frontendPath, `${config.projectName}-frontend`);
    await replaceProjectName(backendPath, `${config.projectName}-backend`);
}

/**
 * Crea estructura mínima cuando no hay template local ni remoto
 */
async function createMinimalScaffold(config, projectPath) {
    const { stackEntry, language, projectName } = config;
    const isNode = ['JavaScript', 'TypeScript'].includes(language);

    if (isNode) {
        const pkg = {
            name: projectName || 'my-app',
            version: '0.1.0',
            type: 'module',
            private: true,
            scripts: {
                dev: 'echo "Configure dev script"',
                build: 'echo "Configure build script"',
                test: 'echo "Configure test script"',
            },
        };
        await writeFileSafe(join(projectPath, 'package.json'), JSON.stringify(pkg, null, 4));
    }

    await writeFileSafe(
        join(projectPath, 'README.md'),
        `# ${projectName || 'My App'}\n\nGenerado con Grimox CLI.\n\nStack: ${stackEntry.name} (${language})\n`
    );

    await writeFileSafe(join(projectPath, 'src', '.gitkeep'), '');
}

/**
 * Reemplaza el nombre del proyecto en package.json, pubspec.yaml, etc.
 */
async function replaceProjectName(projectPath, name) {
    // package.json
    const pkgPath = join(projectPath, 'package.json');
    const pkg = await readJson(pkgPath);
    if (pkg) {
        pkg.name = name;
        await writeFileSafe(pkgPath, JSON.stringify(pkg, null, 4));
    }

    // pubspec.yaml (Flutter)
    const pubspecPath = join(projectPath, 'pubspec.yaml');
    if (await exists(pubspecPath)) {
        const { readFile } = await import('node:fs/promises');
        try {
            let content = await readFile(pubspecPath, 'utf-8');
            content = content.replace(/^name:\s*.+$/m, `name: ${name.replace(/-/g, '_')}`);
            await writeFileSafe(pubspecPath, content);
        } catch { /* ignore */ }
    }

    // platformio.ini — no tiene campo name, skip

    // Cargo.toml (Tauri/Rust)
    const cargoPath = join(projectPath, 'Cargo.toml');
    if (await exists(cargoPath)) {
        const { readFile } = await import('node:fs/promises');
        try {
            let content = await readFile(cargoPath, 'utf-8');
            content = content.replace(/^name\s*=\s*".+"$/m, `name = "${name}"`);
            await writeFileSafe(cargoPath, content);
        } catch { /* ignore */ }
    }
}

/**
 * Muestra el resultado final
 */
function displayResult(config, projectPath) {
    console.log();
    console.log(pc.green(pc.bold('  ╭───────────────────────────────────────────────╮')));
    console.log(pc.green(pc.bold('  │')) + '  ✔ Proyecto listo para desarrollar' + pc.green(pc.bold('              │')));
    console.log(pc.green(pc.bold('  │')) + pc.green(pc.bold('                                               │')));
    console.log(pc.green(pc.bold('  │')) + `  cd ${config.projectName}`.padEnd(46) + pc.green(pc.bold('│')));

    if (config.isDecoupled) {
        console.log(pc.green(pc.bold('  │')) + pc.green(pc.bold('                                               │')));
        console.log(pc.green(pc.bold('  │')) + '  🐳 Todo: docker-compose up'.padEnd(46) + pc.green(pc.bold('│')));
    } else {
        const cmds = getStartCommands(config);
        cmds.forEach((cmd) => {
            console.log(pc.green(pc.bold('  │')) + `  ${cmd}`.padEnd(46) + pc.green(pc.bold('│')));
        });
    }

    console.log(pc.green(pc.bold('  │')) + pc.green(pc.bold('                                               │')));
    console.log(pc.green(pc.bold('  │')) + '  Integraciones de IA generadas:'.padEnd(46) + pc.green(pc.bold('│')));
    console.log(pc.green(pc.bold('  │')) + '  📄 GRIMOX.md  (contexto universal)'.padEnd(46) + pc.green(pc.bold('│')));
    console.log(pc.green(pc.bold('  │')) + '  📁 .ai/skills/ (skills: cualquier LLM)'.padEnd(46) + pc.green(pc.bold('│')));
    console.log(pc.green(pc.bold('  │')) + '  📄 .ai/rules.md (reglas: cualquier LLM)'.padEnd(46) + pc.green(pc.bold('│')));
    console.log(pc.green(pc.bold('  ╰───────────────────────────────────────────────╯')));
    console.log();
}

/**
 * Retorna los comandos de inicio según el stack
 */
function getStartCommands(config) {
    const stackId = config.stackId;

    if (['fastapi', 'fastapi-ml'].includes(stackId)) {
        return ['pip install -r requirements.txt', 'uvicorn main:app --reload'];
    }
    if (stackId === 'springboot') {
        return ['./gradlew bootRun'];
    }
    if (stackId === 'flutter') {
        return ['flutter pub get', 'flutter run'];
    }
    if (['flet-mobile', 'flet-desktop'].includes(stackId)) {
        return ['pip install -r requirements.txt', 'flet run'];
    }
    if (stackId === 'arduino') {
        return ['Abre el .ino en Arduino IDE'];
    }
    if (stackId === 'platformio') {
        return ['pio run'];
    }
    if (stackId === 'esp-idf') {
        return ['idf.py build'];
    }
    if (stackId === 'micropython') {
        return ['Sube archivos con Thonny o mpremote'];
    }
    if (stackId === 'angular') {
        return ['npm install', 'ng serve'];
    }
    if (stackId === 'tauri') {
        return ['npm install', 'npm run tauri dev'];
    }

    // Default Node.js
    return ['npm install', 'npm run dev'];
}
