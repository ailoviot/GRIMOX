export const features = [
    {
        id: 'docker',
        name: 'Docker',
        description: 'Dockerfile + docker-compose.yml',
        defaultEnabled: true,
    },
    {
        id: 'cicd',
        name: 'CI/CD',
        description: 'GitHub Actions (lint, test, build, deploy)',
        defaultEnabled: true,
    },
    {
        id: 'ai-skills',
        name: 'AI Skills',
        description: '.ai/rules.md + .cursorrules + .github/copilot-instructions.md con best practices',
        defaultEnabled: true,
    },
    {
        id: 'ai-agents',
        name: 'AI Sub-agents',
        description: '.claude/agents/grimox-qa.md para testing visual autónomo durante /grimox-dev',
        defaultEnabled: true,
        webOnly: true, // solo tiene sentido con UI
    },
    {
        id: 'qa-cli',
        name: 'QA Visual CLI',
        description: 'grimox-qa CLI en postbuild de npm: QA visual determinístico universal (funciona en cualquier IDE/LLM)',
        defaultEnabled: true,
        webOnly: true,
    },
    {
        id: 'mcp',
        name: 'MCP Config',
        description: 'Servidores MCP para DB, filesystem y testing visual (Playwright + Chrome DevTools)',
        defaultEnabled: true,
    },
    {
        id: 'security',
        name: 'Seguridad',
        description: '.env validation + CSP + CORS + headers de seguridad',
        defaultEnabled: true,
    },
    {
        id: 'ui-styling',
        name: 'UI/UX',
        description: 'Tailwind CSS v4 + component library + dark mode',
        defaultEnabled: true,
        webOnly: true, // solo aplica a stacks web
    },
    {
        id: 'database',
        name: 'Database Config',
        description: 'Conexión DB, ORM config, schemas, .env vars',
        defaultEnabled: true,
    },
];

/**
 * Retorna features por defecto habilitadas
 */
export function getDefaultFeatures() {
    return features.filter((f) => f.defaultEnabled);
}

/**
 * Retorna features aplicables a un tipo de stack
 * @param {string} categoryId
 */
export function getApplicableFeatures(categoryId) {
    const isWeb = categoryId.startsWith('web-') || categoryId === 'documentation';
    return features.filter((f) => {
        if (f.webOnly && !isWeb) return false;
        return true;
    });
}
