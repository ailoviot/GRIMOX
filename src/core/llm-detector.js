import { join } from 'node:path';
import pc from 'picocolors';
import * as p from '@clack/prompts';
import { readFile } from 'node:fs/promises';
import { exists } from '../utils/fs-helpers.js';

/**
 * Proveedores de LLM en la nube y sus API keys
 */
const CLOUD_PROVIDERS = [
    {
        id: 'claude',
        name: 'Claude (Anthropic)',
        envKeys: ['ANTHROPIC_API_KEY'],
        type: 'cloud',
    },
    {
        id: 'openai',
        name: 'GPT / Codex (OpenAI)',
        envKeys: ['OPENAI_API_KEY'],
        type: 'cloud',
    },
    {
        id: 'gemini',
        name: 'Gemini (Google)',
        envKeys: ['GOOGLE_API_KEY', 'GEMINI_API_KEY', 'GOOGLE_AI_API_KEY'],
        type: 'cloud',
    },
    {
        id: 'grok',
        name: 'Grok (xAI)',
        envKeys: ['GROK_API_KEY', 'XAI_API_KEY'],
        type: 'cloud',
    },
    {
        id: 'glm',
        name: 'GLM (Zhipu)',
        envKeys: ['GLM_API_KEY', 'ZHIPU_API_KEY'],
        type: 'cloud',
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        envKeys: ['DEEPSEEK_API_KEY'],
        type: 'cloud',
    },
];

/**
 * Proveedores de LLM locales y sus endpoints
 */
const LOCAL_PROVIDERS = [
    {
        id: 'ollama',
        name: 'Ollama',
        url: 'http://localhost:11434',
        checkEndpoint: '/api/tags',
        type: 'local',
    },
    {
        id: 'lmstudio',
        name: 'LM Studio',
        url: 'http://localhost:1234',
        checkEndpoint: '/v1/models',
        type: 'local',
    },
    {
        id: 'jan',
        name: 'Jan',
        url: 'http://localhost:1337',
        checkEndpoint: '/v1/models',
        type: 'local',
    },
    {
        id: 'llamacpp',
        name: 'llama.cpp',
        url: 'http://localhost:8080',
        checkEndpoint: '/health',
        type: 'local',
    },
];

/**
 * IDEs con LLM integrado
 */
const IDE_PROVIDERS = [
    {
        id: 'cursor',
        name: 'Cursor IDE (LLM integrado)',
        envKeys: ['CURSOR_SESSION_ID', 'CURSOR_TRACE_ID'],
        type: 'ide',
    },
    {
        id: 'copilot',
        name: 'GitHub Copilot',
        envKeys: ['GITHUB_COPILOT', 'COPILOT_AGENT'],
        type: 'ide',
    },
];

/**
 * Detecta TODOS los LLMs disponibles (nube, local, IDE, MCP).
 *
 * @param {string} projectPath - Directorio del proyecto
 * @returns {Promise<object[]>} Lista de LLMs detectados, cada uno con:
 *   { id, name, type, source, model? }
 */
export async function detectAllLLMs(projectPath) {
    const detected = [];

    // 1. Variables de entorno del SO → LLMs en la nube
    for (const provider of CLOUD_PROVIDERS) {
        for (const key of provider.envKeys) {
            if (process.env[key] && process.env[key].trim().length > 0) {
                detected.push({
                    id: provider.id,
                    name: provider.name,
                    type: 'cloud',
                    source: `Variable de entorno: ${key}`,
                });
                break; // no duplicar si tiene múltiples keys del mismo provider
            }
        }
    }

    // 2. Archivos .env del proyecto → LLMs en la nube
    const envFiles = ['.env', '.env.local', '.env.development'];
    for (const envFile of envFiles) {
        const envPath = join(projectPath, envFile);
        if (await exists(envPath)) {
            try {
                const content = await readFile(envPath, 'utf-8');
                for (const provider of CLOUD_PROVIDERS) {
                    // Evitar duplicados si ya se detectó por env var del SO
                    if (detected.find((d) => d.id === provider.id)) continue;

                    for (const key of provider.envKeys) {
                        const regex = new RegExp(`^${key}=(.+)$`, 'm');
                        const match = content.match(regex);
                        if (match && match[1].trim().length > 0) {
                            detected.push({
                                id: provider.id,
                                name: provider.name,
                                type: 'cloud',
                                source: `Archivo ${envFile}: ${key}`,
                            });
                            break;
                        }
                    }
                }
            } catch { /* ignore */ }
        }
    }

    // 3. IDEs con LLM integrado
    for (const ide of IDE_PROVIDERS) {
        const hasIDE = ide.envKeys.some((key) => process.env[key] && process.env[key].trim().length > 0);
        if (hasIDE) {
            detected.push({
                id: ide.id,
                name: ide.name,
                type: 'ide',
                source: `IDE detectado`,
            });
        }
    }

    // 4. LLMs locales (verificar si el servicio está corriendo)
    for (const local of LOCAL_PROVIDERS) {
        const result = await checkLocalLLM(local);
        if (result) {
            detected.push(result);
        }
    }

    // 5. MCP config con servidores de IA
    const mcpConfigPath = join(projectPath, '.mcp', 'config.json');
    if (await exists(mcpConfigPath)) {
        try {
            const content = await readFile(mcpConfigPath, 'utf-8');
            const mcpConfig = JSON.parse(content);
            const servers = Object.keys(mcpConfig.mcpServers || {});
            const aiServers = servers.filter((s) =>
                ['claude', 'openai', 'anthropic', 'gemini', 'gpt'].some((ai) =>
                    s.toLowerCase().includes(ai)
                )
            );
            for (const serverName of aiServers) {
                if (!detected.find((d) => d.source === '.mcp/config.json')) {
                    detected.push({
                        id: `mcp-${serverName}`,
                        name: `MCP Server: ${serverName}`,
                        type: 'mcp',
                        source: '.mcp/config.json',
                    });
                }
            }
        } catch { /* ignore */ }
    }

    return detected;
}

/**
 * Verifica si un LLM local está corriendo haciendo un request al endpoint
 * @param {object} provider - Config del provider local
 * @returns {Promise<object|null>}
 */
async function checkLocalLLM(provider) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000); // 2 segundos timeout

        const response = await fetch(`${provider.url}${provider.checkEndpoint}`, {
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (response.ok) {
            let model = null;

            // Intentar obtener el nombre del modelo activo
            try {
                const data = await response.json();
                if (data.models && data.models.length > 0) {
                    // Ollama retorna { models: [{ name: "llama3.2" }] }
                    model = data.models[0].name || data.models[0].id;
                } else if (data.data && data.data.length > 0) {
                    // OpenAI-compatible (LM Studio, Jan) retorna { data: [{ id: "model-name" }] }
                    model = data.data[0].id;
                }
            } catch { /* respuesta no es JSON, pero el servicio responde */ }

            return {
                id: provider.id,
                name: model ? `${provider.name} (${model})` : provider.name,
                type: 'local',
                source: `${provider.url}`,
                model,
            };
        }
    } catch {
        // Servicio no disponible — no está corriendo
    }
    return null;
}

/**
 * Flujo completo de detección y selección de LLM.
 * - Si encuentra uno solo → lo muestra y continúa
 * - Si encuentra varios → pregunta cuál usar
 * - Si no encuentra ninguno → bloquea con advertencia
 *
 * @param {string} projectPath
 * @returns {Promise<{ id: string, name: string, type: string, source: string }|null>}
 *          El LLM seleccionado, o null si no hay ninguno disponible
 */
export async function selectLLM(projectPath) {
    const spinner = p.spinner();
    spinner.start('Verificando modelos de IA disponibles...');

    const allLLMs = await detectAllLLMs(projectPath);

    spinner.stop(allLLMs.length > 0
        ? `${allLLMs.length} modelo(s) de IA encontrado(s)`
        : 'No se encontraron modelos de IA'
    );

    // Caso: ningún LLM detectado
    if (allLLMs.length === 0) {
        displayLLMWarning();
        return null;
    }

    // Caso: un solo LLM detectado → mostrar cuál es y confirmar
    if (allLLMs.length === 1) {
        const llm = allLLMs[0];
        displayLLMDetected(llm);
        return llm;
    }

    // Caso: múltiples LLMs detectados → preguntar cuál usar
    console.log();
    const options = allLLMs.map((llm, i) => {
        const typeLabel = llm.type === 'cloud' ? '☁️  Nube' : llm.type === 'local' ? '💻 Local' : llm.type === 'ide' ? '🖥️  IDE' : '🔌 MCP';
        return {
            value: llm.id,
            label: `${llm.name}${i === 0 ? ' (Recomendado)' : ''}`,
            hint: `${typeLabel} — ${llm.source}`,
        };
    });

    const selectedId = await p.select({
        message: '¿Qué modelo de IA usar para la migración?',
        options,
    });

    if (p.isCancel(selectedId)) {
        throw new Error('USER_CANCELLED');
    }

    const selected = allLLMs.find((l) => l.id === selectedId);
    displayLLMDetected(selected);

    return selected;
}

/**
 * Muestra la advertencia cuando no se detecta ningún LLM
 */
export function displayLLMWarning() {
    console.log();
    console.log(pc.yellow(pc.bold('  ╭──────────────────────────────────────────────────────────╮')));
    console.log(pc.yellow(pc.bold('  │')) + '  ⚠ Se requiere un modelo de IA para migración' + pc.yellow(pc.bold('            │')));
    console.log(pc.yellow(pc.bold('  │')) + pc.yellow(pc.bold('                                                          │')));
    console.log(pc.yellow(pc.bold('  │')) + '  La migración requiere un LLM para analizar tu código' + pc.yellow(pc.bold('   │')));
    console.log(pc.yellow(pc.bold('  │')) + '  y generar un plan consistente y personalizado.' + pc.yellow(pc.bold('         │')));
    console.log(pc.yellow(pc.bold('  │')) + pc.yellow(pc.bold('                                                          │')));
    console.log(pc.yellow(pc.bold('  │')) + pc.white('  Nube (recomendado):') + pc.yellow(pc.bold('                                    │')));
    console.log(pc.yellow(pc.bold('  │')) + '  • Claude       → ANTHROPIC_API_KEY en .env' + pc.yellow(pc.bold('              │')));
    console.log(pc.yellow(pc.bold('  │')) + '  • GPT / Codex  → OPENAI_API_KEY en .env' + pc.yellow(pc.bold('                 │')));
    console.log(pc.yellow(pc.bold('  │')) + '  • Gemini       → GOOGLE_API_KEY en .env' + pc.yellow(pc.bold('                 │')));
    console.log(pc.yellow(pc.bold('  │')) + '  • Grok         → GROK_API_KEY en .env' + pc.yellow(pc.bold('                   │')));
    console.log(pc.yellow(pc.bold('  │')) + '  • GLM          → GLM_API_KEY en .env' + pc.yellow(pc.bold('                    │')));
    console.log(pc.yellow(pc.bold('  │')) + '  • DeepSeek     → DEEPSEEK_API_KEY en .env' + pc.yellow(pc.bold('               │')));
    console.log(pc.yellow(pc.bold('  │')) + pc.yellow(pc.bold('                                                          │')));
    console.log(pc.yellow(pc.bold('  │')) + pc.white('  Local:') + pc.yellow(pc.bold('                                                 │')));
    console.log(pc.yellow(pc.bold('  │')) + '  • Ollama       → ollama serve (localhost:11434)' + pc.yellow(pc.bold('         │')));
    console.log(pc.yellow(pc.bold('  │')) + '  • LM Studio    → Iniciar servidor (localhost:1234)' + pc.yellow(pc.bold('      │')));
    console.log(pc.yellow(pc.bold('  │')) + '  • Jan          → Iniciar servidor (localhost:1337)' + pc.yellow(pc.bold('      │')));
    console.log(pc.yellow(pc.bold('  │')) + pc.yellow(pc.bold('                                                          │')));
    console.log(pc.yellow(pc.bold('  │')) + '  Configura alguno de los anteriores y ejecuta' + pc.yellow(pc.bold('           │')));
    console.log(pc.yellow(pc.bold('  │')) + '  grimox migrate de nuevo.' + pc.yellow(pc.bold('                                │')));
    console.log(pc.yellow(pc.bold('  ╰──────────────────────────────────────────────────────────╯')));
    console.log();
}

/**
 * Muestra confirmación del LLM que se va a usar
 * @param {object} llm
 */
export function displayLLMDetected(llm) {
    const typeIcon = llm.type === 'cloud' ? '☁️' : llm.type === 'local' ? '💻' : llm.type === 'ide' ? '🖥️' : '🔌';
    console.log(`  ${pc.green('✓')} Modelo de IA: ${pc.cyan(pc.bold(llm.name))} ${typeIcon}  ${pc.dim(`(${llm.source})`)}`);
}
