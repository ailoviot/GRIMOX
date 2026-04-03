import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import { exists } from '../utils/fs-helpers.js';

/** Directories to skip during source collection */
const IGNORE_DIRS = new Set([
    'node_modules', '.git', 'dist', 'build', '.next', '.nuxt',
    '__pycache__', '.venv', 'venv', 'vendor', 'target', '.gradle',
    '.grimox-backup', '.cache', 'coverage', '.turbo', '.output',
]);

/** Extensions considered as source code */
const SOURCE_EXTENSIONS = new Set([
    '.js', '.ts', '.jsx', '.tsx', '.vue', '.svelte',
    '.py', '.rb', '.java', '.kt', '.go', '.rs',
    '.css', '.scss', '.less', '.html', '.json',
    '.yaml', '.yml', '.toml', '.sql',
]);

/** Entry point patterns (higher priority) */
const ENTRY_PATTERNS = [
    /^index\.\w+$/,
    /^main\.\w+$/,
    /^app\.\w+$/,
    /^server\.\w+$/,
    /^startup\.\w+$/,
];

/** Config file patterns (higher priority) */
const CONFIG_PATTERNS = [
    /^package\.json$/,
    /^tsconfig.*\.json$/,
    /^vite\.config\.\w+$/,
    /^next\.config\.\w+$/,
    /^nuxt\.config\.\w+$/,
    /^svelte\.config\.\w+$/,
    /^webpack\.config\.\w+$/,
    /^tailwind\.config\.\w+$/,
    /^\.env.*$/,
    /^requirements\.txt$/,
    /^pyproject\.toml$/,
    /^Cargo\.toml$/,
    /^pom\.xml$/,
    /^build\.gradle(\.kts)?$/,
    /^Dockerfile$/,
    /^docker-compose\.ya?ml$/,
];

/** Priority directories (files inside these come first) */
const PRIORITY_DIRS = ['src', 'app', 'pages', 'routes', 'api', 'lib', 'components', 'models'];

/** Max lines to read per file */
const MAX_LINES_PER_FILE = 200;

/**
 * Collects source files from a project directory recursively.
 *
 * Ignores common non-source directories. Prioritizes entry points,
 * config files, and files inside src/ or similar directories.
 *
 * @param {string} projectPath - Root of the project
 * @param {number} [maxFiles=20] - Maximum number of files to return
 * @returns {Promise<Array<{ path: string, content: string }>>}
 */
export async function collectSourceFiles(projectPath, maxFiles = 20) {
    const allFiles = [];
    await walkDirectory(projectPath, projectPath, allFiles);

    // Score and sort files by priority
    const scored = allFiles.map((filePath) => ({
        path: filePath,
        score: scoreFile(filePath, projectPath),
    }));
    scored.sort((a, b) => b.score - a.score);

    // Take top N files and read their content
    const selected = scored.slice(0, maxFiles);
    const results = [];

    for (const item of selected) {
        try {
            const raw = await readFile(item.path, 'utf-8');
            const lines = raw.split('\n');
            const trimmed = lines.slice(0, MAX_LINES_PER_FILE).join('\n');
            const truncated = lines.length > MAX_LINES_PER_FILE
                ? `${trimmed}\n// ... (truncated, ${lines.length} total lines)`
                : trimmed;

            results.push({
                path: relative(projectPath, item.path).replace(/\\/g, '/'),
                content: truncated,
            });
        } catch {
            // Skip files that can't be read
        }
    }

    return results;
}

/**
 * Recursively walks a directory collecting file paths.
 *
 * @param {string} dirPath - Current directory to scan
 * @param {string} rootPath - Project root (for ignore logic)
 * @param {string[]} accumulator - Array to push found file paths into
 * @returns {Promise<void>}
 */
async function walkDirectory(dirPath, rootPath, accumulator) {
    let entries;
    try {
        entries = await readdir(dirPath, { withFileTypes: true });
    } catch {
        return;
    }

    for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);

        if (entry.isDirectory()) {
            if (IGNORE_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
            await walkDirectory(fullPath, rootPath, accumulator);
        } else if (entry.isFile()) {
            const ext = extname(entry.name).toLowerCase();
            if (SOURCE_EXTENSIONS.has(ext) || isConfigFile(entry.name)) {
                accumulator.push(fullPath);
            }
        }
    }
}

/**
 * Checks if a filename matches a known config pattern.
 *
 * @param {string} filename
 * @returns {boolean}
 */
function isConfigFile(filename) {
    return CONFIG_PATTERNS.some((pattern) => pattern.test(filename));
}

/**
 * Scores a file path for prioritization.
 * Higher score = more important to include.
 *
 * @param {string} filePath - Absolute path to the file
 * @param {string} rootPath - Project root
 * @returns {number}
 */
function scoreFile(filePath, rootPath) {
    const rel = relative(rootPath, filePath).replace(/\\/g, '/');
    const parts = rel.split('/');
    const filename = parts[parts.length - 1];
    let score = 0;

    // Entry point files get high priority
    if (ENTRY_PATTERNS.some((pattern) => pattern.test(filename))) {
        score += 50;
    }

    // Config files get high priority
    if (CONFIG_PATTERNS.some((pattern) => pattern.test(filename))) {
        score += 40;
    }

    // Files in priority directories
    if (parts.some((p) => PRIORITY_DIRS.includes(p))) {
        score += 30;
    }

    // Root-level files get a small boost
    if (parts.length === 1) {
        score += 15;
    }

    // Deeper files get lower priority
    score -= parts.length * 2;

    return score;
}

/**
 * Builds a tree-like string representation of a file list.
 *
 * @param {Array<{ path: string }>} files
 * @returns {string}
 */
function buildFileTree(files) {
    const lines = files.map((f) => `  ${f.path}`);
    return lines.join('\n');
}

/**
 * Analyzes a project's source code using an LLM.
 *
 * Reads key source files from the project, builds a summary,
 * and sends it to the LLM for architectural analysis.
 *
 * @param {string} projectPath - Root directory of the project
 * @param {object} detection - Result from project-detector (has parts[], infra, structure)
 * @param {object} llmClient - Instance of LLMClient from './llm-client.js'
 * @returns {Promise<object>} Structured analysis with architecture, patterns, issues, etc.
 */
export async function analyzeProject(projectPath, detection, llmClient) {
    const sourceFiles = await collectSourceFiles(projectPath, 20);

    // Build dependency info from detection parts
    const dependencyInfo = detection.parts
        .filter((part) => part.dependencies && Object.keys(part.dependencies).length > 0)
        .map((part) => {
            const label = part.folder === '.' ? 'Root' : part.folder;
            const deps = Object.entries(part.dependencies)
                .map(([name, version]) => `    ${name}: ${version}`)
                .join('\n');
            return `  [${label}]\n${deps}`;
        })
        .join('\n\n');

    // Build issues list
    const issuesList = detection.parts
        .flatMap((part) => {
            const label = part.folder === '.' ? 'Root' : part.folder;
            return (part.issues || []).map((issue) => `  - [${label}] ${issue}`);
        })
        .join('\n');

    // Build the project summary
    const summary = [
        '=== PROJECT FILE TREE ===',
        buildFileTree(sourceFiles),
        '',
        '=== DEPENDENCIES ===',
        dependencyInfo || '  (none detected)',
        '',
        '=== DETECTED ISSUES ===',
        issuesList || '  (none)',
        '',
        '=== SOURCE FILES ===',
        ...sourceFiles.map((f) => [
            `--- ${f.path} ---`,
            f.content,
            '',
        ].join('\n')),
    ].join('\n');

    const systemPrompt = [
        'You are a senior software architect analyzing a project for migration.',
        'Analyze the provided source code and project info thoroughly.',
        'Respond ONLY with valid JSON (no markdown, no code fences).',
        '',
        'Return this exact JSON structure:',
        '{',
        '  "architecture": "MVC | component-based | monolithic | microservices | serverless | other",',
        '  "architectureDetails": "explanation of the architecture pattern found",',
        '  "stateManagement": "description of how state is managed (Redux, Vuex, Context, etc.)",',
        '  "authentication": "description of auth patterns found or null if none",',
        '  "databaseAccess": "ORM name, raw queries, or description of DB access pattern",',
        '  "routing": "description of routing approach (file-based, express router, etc.)",',
        '  "styling": "description of styling approach (Tailwind, CSS modules, etc.)",',
        '  "apiIntegration": "description of how external APIs are consumed (fetch, axios, etc.)",',
        '  "testing": "description of testing patterns found or null if none",',
        '  "securityIssues": ["list of security concerns found"],',
        '  "codeQualityIssues": ["list of code quality concerns"],',
        '  "strengths": ["list of good practices found"],',
        '  "complexity": "low | medium | high",',
        '  "migrationRisk": "low | medium | high",',
        '  "summary": "2-3 sentence summary of the project"',
        '}',
    ].join('\n');

    const response = await llmClient.chat(systemPrompt, summary);

    try {
        const cleaned = response.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        return JSON.parse(cleaned);
    } catch {
        return {
            architecture: 'unknown',
            architectureDetails: response,
            stateManagement: null,
            authentication: null,
            databaseAccess: null,
            routing: null,
            styling: null,
            apiIntegration: null,
            testing: null,
            securityIssues: [],
            codeQualityIssues: [],
            strengths: [],
            complexity: 'unknown',
            migrationRisk: 'unknown',
            summary: 'Could not parse LLM analysis. Raw response stored in architectureDetails.',
        };
    }
}

/**
 * Generates smart, actionable migration steps using LLM analysis.
 *
 * Takes the project analysis and target stack, then asks the LLM
 * to produce specific file-by-file migration instructions with
 * code snippets and priority levels.
 *
 * @param {object} analysis - Result from analyzeProject()
 * @param {object} targetStack - Target stack info (name, framework, etc.)
 * @param {object} llmClient - Instance of LLMClient
 * @returns {Promise<Array<{ title: string, description: string, files: string[], codeSnippets: string[], priority: string }>>}
 */
export async function generateSmartMigrationSteps(analysis, targetStack, llmClient) {
    const systemPrompt = [
        'You are a senior software engineer creating a detailed migration plan.',
        'Based on the project analysis and target stack, generate specific migration steps.',
        'Respond ONLY with valid JSON (no markdown, no code fences).',
        '',
        'Return a JSON array of step objects with this structure:',
        '[',
        '  {',
        '    "title": "Short step title",',
        '    "description": "Detailed description with before/after explanation",',
        '    "files": ["list of files to create or modify"],',
        '    "codeSnippets": ["before/after code examples as strings"],',
        '    "priority": "critical | high | medium | low",',
        '    "breakingChanges": ["list of breaking changes to watch for"],',
        '    "dependencyChanges": {',
        '      "add": ["packages to install"],',
        '      "remove": ["packages to uninstall"]',
        '    },',
        '    "migrationSQL": "SQL statements if database changes needed, or null"',
        '  }',
        ']',
        '',
        'Order steps by priority (critical first) and logical dependency.',
        'Include concrete code snippets showing before/after transformations.',
    ].join('\n');

    const userMessage = [
        '=== CURRENT PROJECT ANALYSIS ===',
        JSON.stringify(analysis, null, 2),
        '',
        '=== TARGET STACK ===',
        JSON.stringify(targetStack, null, 2),
        '',
        'Generate specific, actionable migration steps to move this project to the target stack.',
        'Include before/after code snippets for key transformations.',
        'Include dependency changes (what to add, what to remove).',
        'Include database migration SQL if the database technology is changing.',
        'Flag all breaking changes.',
    ].join('\n');

    const response = await llmClient.chat(systemPrompt, userMessage);

    try {
        const cleaned = response.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const steps = JSON.parse(cleaned);

        if (!Array.isArray(steps)) {
            return [{ title: 'Migration plan', description: response, files: [], codeSnippets: [], priority: 'medium' }];
        }

        // Normalize each step to ensure required fields
        return steps.map((step) => ({
            title: step.title || 'Untitled step',
            description: step.description || '',
            files: Array.isArray(step.files) ? step.files : [],
            codeSnippets: Array.isArray(step.codeSnippets) ? step.codeSnippets : [],
            priority: step.priority || 'medium',
            breakingChanges: Array.isArray(step.breakingChanges) ? step.breakingChanges : [],
            dependencyChanges: step.dependencyChanges || { add: [], remove: [] },
            migrationSQL: step.migrationSQL || null,
        }));
    } catch {
        return [{
            title: 'Migration plan (unparsed)',
            description: response,
            files: [],
            codeSnippets: [],
            priority: 'medium',
        }];
    }
}

/**
 * Generates a codemod for a single source file using the LLM.
 *
 * Takes the content of one file and the target stack, then asks
 * the LLM to transform the code accordingly.
 *
 * @param {string} sourceFile - Content of the source file to transform
 * @param {object} targetStack - Target stack info (name, framework, language, etc.)
 * @param {object} llmClient - Instance of LLMClient
 * @returns {Promise<{ originalPath: string, transformedCode: string, explanation: string }>}
 */
export async function generateCodemods(sourceFile, targetStack, llmClient) {
    const systemPrompt = [
        'You are an expert code migration tool.',
        'Transform the provided source code to work with the target stack.',
        'Respond ONLY with valid JSON (no markdown, no code fences).',
        '',
        'Return this JSON structure:',
        '{',
        '  "originalPath": "suggested file path for the transformed file",',
        '  "transformedCode": "the complete transformed source code",',
        '  "explanation": "brief explanation of what was changed and why"',
        '}',
        '',
        'Rules:',
        '- Preserve business logic and functionality',
        '- Update imports, syntax, and patterns to match the target stack',
        '- Add necessary type annotations if moving to TypeScript',
        '- Update API patterns (e.g., Express routes to Hono handlers)',
        '- Keep code clean and idiomatic for the target stack',
    ].join('\n');

    const userMessage = [
        '=== SOURCE CODE ===',
        sourceFile,
        '',
        '=== TARGET STACK ===',
        JSON.stringify(targetStack, null, 2),
        '',
        'Transform this code to work with the target stack.',
    ].join('\n');

    const response = await llmClient.chat(systemPrompt, userMessage);

    try {
        const cleaned = response.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const result = JSON.parse(cleaned);

        return {
            originalPath: result.originalPath || 'unknown',
            transformedCode: result.transformedCode || '',
            explanation: result.explanation || 'No explanation provided.',
        };
    } catch {
        return {
            originalPath: 'unknown',
            transformedCode: response,
            explanation: 'Could not parse LLM response. Raw transformed code returned.',
        };
    }
}
