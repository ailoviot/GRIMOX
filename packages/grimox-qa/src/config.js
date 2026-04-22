import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'yaml';

const DEFAULT_CONFIG = {
    version: 1,
    baseUrl: 'http://localhost:3000',
    autoDiscover: true,
    auth: null, // { testUser: { email, password }, loginUrl, fields: {...} }
    flows: [],
    dataAttr: 'data-testid', // selector preferido
};

/**
 * Carga configuración combinando:
 *   1. defaults
 *   2. .grimox/qa-plan.yml del proyecto (si existe)
 *   3. args de CLI (override explícito)
 *
 * @param {object} args - argumentos del CLI
 * @returns {object} config efectiva
 */
export function loadConfig(args) {
    let cfg = { ...DEFAULT_CONFIG };

    const planPath = join(process.cwd(), args.plan);
    if (existsSync(planPath)) {
        const raw = readFileSync(planPath, 'utf8');
        const parsed = yaml.parse(raw) || {};
        cfg = { ...cfg, ...parsed, flows: parsed.flows || [] };
    }

    if (args.url) cfg.baseUrl = args.url;
    if (args.autoDiscover !== null) cfg.autoDiscover = args.autoDiscover;

    cfg.baseUrl = cfg.baseUrl.replace(/\/$/, '');

    return cfg;
}

/**
 * Decide si correr en modo visible (headed) o sin display (headless).
 * Prioridad:
 *   1. Flag explícito --headed / --headless
 *   2. Env GRIMOX_QA_HEADLESS
 *   3. CI environment (GitHub Actions, Jenkins, etc.) → headless
 *   4. Linux/WSL sin DISPLAY ni WAYLAND_DISPLAY → headless
 *   5. Default: headed (desktop normal)
 */
export function resolveHeadedMode(args) {
    if (args.headed === true) return { headed: true, reason: 'flag --headed' };
    if (args.headed === false) return { headed: false, reason: 'flag --headless' };

    if (process.env.GRIMOX_QA_HEADLESS === '1' || process.env.GRIMOX_QA_HEADLESS === 'true') {
        return { headed: false, reason: 'GRIMOX_QA_HEADLESS=1' };
    }

    const ciVars = ['CI', 'GITHUB_ACTIONS', 'GITLAB_CI', 'JENKINS_HOME', 'CIRCLECI', 'BUILDKITE'];
    if (ciVars.some((v) => process.env[v])) {
        return { headed: false, reason: 'CI detectado' };
    }

    if (process.platform === 'linux') {
        if (!process.env.DISPLAY && !process.env.WAYLAND_DISPLAY) {
            return { headed: false, reason: 'Linux sin DISPLAY' };
        }
    }

    return { headed: true, reason: 'desktop local' };
}

/**
 * Detecta puerto del dev server desde package.json y convenciones de frameworks.
 */
export function detectBaseUrl(projectDir = process.cwd()) {
    const pkgPath = join(projectDir, 'package.json');
    if (!existsSync(pkgPath)) return 'http://localhost:3000';

    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

    if (deps.next) return 'http://localhost:3000';
    if (deps.nuxt) return 'http://localhost:3000';
    if (deps['@sveltejs/kit']) return 'http://localhost:5173';
    if (deps.vite) return 'http://localhost:5173';
    if (deps['@angular/core']) return 'http://localhost:4200';
    if (deps.astro) return 'http://localhost:4321';
    if (deps['@nestjs/core']) return 'http://localhost:3000';
    if (deps.hono || deps.fastify) return 'http://localhost:3000';

    return 'http://localhost:3000';
}
