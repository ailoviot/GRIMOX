import { logger } from '../utils/logger.js';

/**
 * Default models per provider when none is specified.
 * @type {Record<string, string>}
 */
const DEFAULT_MODELS = {
    claude: 'claude-sonnet-4-20250514',
    openai: 'gpt-4o',
    gemini: 'gemini-pro',
    grok: 'grok-3',
    deepseek: 'deepseek-chat',
    glm: 'glm-4',
    ollama: 'llama3',
    lmstudio: 'local-model',
    jan: 'local-model',
};

/**
 * API endpoints per provider.
 * @type {Record<string, string>}
 */
const ENDPOINTS = {
    claude: 'https://api.anthropic.com/v1/messages',
    openai: 'https://api.openai.com/v1/chat/completions',
    gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    grok: 'https://api.x.ai/v1/chat/completions',
    deepseek: 'https://api.deepseek.com/v1/chat/completions',
    glm: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    ollama: 'http://localhost:11434/api/chat',
    lmstudio: 'http://localhost:1234/v1/chat/completions',
    jan: 'http://localhost:1337/v1/chat/completions',
};

/**
 * Environment variable names mapped to each provider.
 * The first found key wins.
 * @type {Record<string, string[]>}
 */
const API_KEY_ENV_VARS = {
    claude: ['ANTHROPIC_API_KEY'],
    openai: ['OPENAI_API_KEY'],
    gemini: ['GOOGLE_API_KEY', 'GEMINI_API_KEY'],
    grok: ['GROK_API_KEY', 'XAI_API_KEY'],
    deepseek: ['DEEPSEEK_API_KEY'],
    glm: ['GLM_API_KEY'],
    ollama: [],
    lmstudio: [],
    jan: [],
};

/**
 * Providers that follow the OpenAI-compatible chat/completions format.
 * @type {Set<string>}
 */
const OPENAI_COMPATIBLE = new Set([
    'openai', 'grok', 'deepseek', 'glm', 'lmstudio', 'jan',
]);

/**
 * System prompt used by `generateMigrationPlan` to instruct the LLM.
 */
const MIGRATION_SYSTEM_PROMPT = `You are an expert software architect and migration specialist.
Your task is to analyze the provided source code and project information, then generate a detailed, actionable migration plan.

Follow these rules strictly:
1. Identify every framework, library, and pattern currently in use.
2. Detect anti-patterns, deprecated APIs, and potential security issues.
3. Generate SPECIFIC migration steps — never generic advice.
4. For each step include a "before" and "after" code snippet when applicable.
5. Return the plan in structured Markdown with the following sections:

## Project Summary
Brief overview of the current stack.

## Detected Patterns & Anti-Patterns
Bulleted list.

## Migration Steps
Numbered list. Each step has:
- **Description** — what to change and why.
- **Before** — current code (fenced code block).
- **After** — migrated code (fenced code block).
- **Risk Level** — low / medium / high.

## Dependency Changes
Table with columns: Package | Action (add/remove/upgrade) | Version

## Estimated Effort
Rough time estimate per step and total.`;

/**
 * Universal LLM client adapter for Grimox CLI.
 * Communicates with cloud and local LLM providers through a single interface
 * using only the native `fetch` API (Node 18+).
 */
export class LLMClient {
    /**
     * Creates a new LLMClient instance.
     *
     * @param {object} provider - Provider descriptor from llm-detector.js
     * @param {string} provider.id - Provider identifier (e.g. 'claude', 'openai')
     * @param {string} provider.name - Human-readable provider name
     * @param {string} provider.type - 'cloud' | 'local' | 'ide'
     * @param {string} provider.source - How the provider was detected
     * @param {string} [provider.model] - Optional model override
     */
    constructor(provider) {
        this.provider = provider;
        this.apiKey = this._resolveApiKey(provider);
        this.endpoint = this._resolveEndpoint(provider);
        this.model = provider.model || DEFAULT_MODELS[provider.id] || 'default';
    }

    // ───────────────────────── Public API ─────────────────────────

    /**
     * Sends a chat conversation to the LLM and returns the response text.
     *
     * @param {Array<{role: 'user'|'assistant'|'system', content: string}>} messages
     * @param {object} [options]
     * @param {number} [options.maxTokens=4096] - Maximum tokens in the response
     * @param {number} [options.temperature=0.7] - Sampling temperature
     * @param {string} [options.model] - Override the default model for this call
     * @returns {Promise<string>} The assistant's response text
     */
    async chat(messages, options = {}) {
        const model = options.model || this.model;
        const maxTokens = options.maxTokens ?? 4096;
        const temperature = options.temperature ?? 0.7;

        const { url, headers, body } = this._formatRequest(
            this.provider,
            messages,
            { model, maxTokens, temperature }
        );

        logger.step(`[LLM] ${this.provider.name} → ${model}`);

        const responseData = await this._fetch(url, headers, body);
        return this._parseResponse(this.provider, responseData);
    }

    /**
     * Convenience method: sends code along with an analysis prompt.
     *
     * @param {string} code - Source code to analyse
     * @param {string} prompt - Analysis instructions
     * @param {object} [options] - Same options as `chat`
     * @returns {Promise<string>} Analysis result
     */
    async analyzeCode(code, prompt, options = {}) {
        const messages = [
            {
                role: 'system',
                content: 'You are an expert code analyst. Provide clear, actionable insights.',
            },
            {
                role: 'user',
                content: `${prompt}\n\n\`\`\`\n${code}\n\`\`\``,
            },
        ];
        return this.chat(messages, options);
    }

    /**
     * Sends project information and source code to the LLM and asks
     * for a structured migration plan.
     *
     * @param {object} projectInfo - Metadata about the project (name, deps, etc.)
     * @param {string} sourceCode - Representative source code to migrate
     * @param {object} [options] - Same options as `chat`
     * @returns {Promise<string>} Migration plan in Markdown
     */
    async generateMigrationPlan(projectInfo, sourceCode, options = {}) {
        const messages = [
            {
                role: 'system',
                content: MIGRATION_SYSTEM_PROMPT,
            },
            {
                role: 'user',
                content: [
                    '## Project Information',
                    '```json',
                    JSON.stringify(projectInfo, null, 2),
                    '```',
                    '',
                    '## Source Code',
                    '```',
                    sourceCode,
                    '```',
                    '',
                    'Generate a complete migration plan following the format specified in your instructions.',
                ].join('\n'),
            },
        ];
        return this.chat(messages, { maxTokens: 8192, ...options });
    }

    // ───────────────────────── Internal Methods ─────────────────────────

    /**
     * Resolves the API key for the given provider from environment variables.
     *
     * @param {object} provider
     * @returns {string|null} The API key, or null for local providers
     * @private
     */
    _resolveApiKey(provider) {
        const envVars = API_KEY_ENV_VARS[provider.id] || [];
        for (const key of envVars) {
            const value = process.env[key];
            if (value && value.trim().length > 0) {
                return value.trim();
            }
        }

        // Local providers don't need an API key
        if (provider.type === 'local') {
            return null;
        }

        // Cloud provider without a key — warn but don't crash yet
        if (envVars.length > 0) {
            logger.warn(
                `[LLM] No API key found for ${provider.name}. ` +
                `Set one of: ${envVars.join(', ')}`
            );
        }
        return null;
    }

    /**
     * Resolves the API endpoint for the given provider.
     *
     * @param {object} provider
     * @returns {string} The full endpoint URL
     * @private
     */
    _resolveEndpoint(provider) {
        return ENDPOINTS[provider.id] || '';
    }

    /**
     * Builds the URL, headers, and JSON body for the provider-specific API.
     *
     * @param {object} provider
     * @param {Array<{role: string, content: string}>} messages
     * @param {object} options - { model, maxTokens, temperature }
     * @returns {{ url: string, headers: Record<string, string>, body: object }}
     * @private
     */
    _formatRequest(provider, messages, options) {
        const { model, maxTokens, temperature } = options;

        // ── Claude (Anthropic) ──────────────────────────────────────
        if (provider.id === 'claude') {
            // Anthropic Messages API separates the system prompt
            const systemMsg = messages.find((m) => m.role === 'system');
            const nonSystemMsgs = messages.filter((m) => m.role !== 'system');

            const body = {
                model,
                max_tokens: maxTokens,
                temperature,
                messages: nonSystemMsgs.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
            };
            if (systemMsg) {
                body.system = systemMsg.content;
            }

            return {
                url: this.endpoint,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey || '',
                    'anthropic-version': '2023-06-01',
                },
                body,
            };
        }

        // ── Gemini (Google) ─────────────────────────────────────────
        if (provider.id === 'gemini') {
            // Gemini uses a different message shape
            const contents = messages
                .filter((m) => m.role !== 'system')
                .map((m) => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }],
                }));

            // Prepend system message as a user turn if present
            const systemMsg = messages.find((m) => m.role === 'system');
            if (systemMsg) {
                contents.unshift({
                    role: 'user',
                    parts: [{ text: `[System Instructions]\n${systemMsg.content}` }],
                });
            }

            const url = `${this.endpoint}?key=${this.apiKey || ''}`;

            return {
                url,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    contents,
                    generationConfig: {
                        maxOutputTokens: maxTokens,
                        temperature,
                    },
                },
            };
        }

        // ── Ollama (local) ──────────────────────────────────────────
        if (provider.id === 'ollama') {
            return {
                url: this.endpoint,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    model,
                    messages: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    stream: false,
                    options: {
                        num_predict: maxTokens,
                        temperature,
                    },
                },
            };
        }

        // ── OpenAI-compatible (OpenAI, Grok, DeepSeek, GLM, LM Studio, Jan) ──
        if (OPENAI_COMPATIBLE.has(provider.id)) {
            const headers = {
                'Content-Type': 'application/json',
            };
            if (this.apiKey) {
                headers['Authorization'] = `Bearer ${this.apiKey}`;
            }

            return {
                url: this.endpoint,
                headers,
                body: {
                    model,
                    messages: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    max_tokens: maxTokens,
                    temperature,
                },
            };
        }

        // Fallback — treat as OpenAI-compatible
        logger.warn(`[LLM] Unknown provider "${provider.id}", using OpenAI-compatible format.`);
        return {
            url: this.endpoint,
            headers: {
                'Content-Type': 'application/json',
                ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
            },
            body: {
                model,
                messages: messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
                max_tokens: maxTokens,
                temperature,
            },
        };
    }

    /**
     * Extracts the assistant's text from a provider-specific response payload.
     *
     * @param {object} provider
     * @param {object} responseData - Parsed JSON from the API
     * @returns {string} The assistant's response text
     * @private
     */
    _parseResponse(provider, responseData) {
        try {
            // ── Claude ──────────────────────────────────────────────
            if (provider.id === 'claude') {
                const blocks = responseData.content || [];
                return blocks
                    .filter((b) => b.type === 'text')
                    .map((b) => b.text)
                    .join('');
            }

            // ── Gemini ──────────────────────────────────────────────
            if (provider.id === 'gemini') {
                const candidates = responseData.candidates || [];
                if (candidates.length === 0) {
                    return '';
                }
                const parts = candidates[0]?.content?.parts || [];
                return parts.map((p) => p.text || '').join('');
            }

            // ── Ollama ──────────────────────────────────────────────
            if (provider.id === 'ollama') {
                return responseData.message?.content || '';
            }

            // ── OpenAI-compatible ───────────────────────────────────
            const choices = responseData.choices || [];
            if (choices.length === 0) {
                return '';
            }
            return choices[0]?.message?.content || '';
        } catch (err) {
            logger.error(`[LLM] Failed to parse response from ${provider.name}: ${err.message}`);
            return '';
        }
    }

    /**
     * Executes the HTTP request using native fetch with error handling.
     *
     * @param {string} url
     * @param {Record<string, string>} headers
     * @param {object} body
     * @returns {Promise<object>} Parsed JSON response
     * @private
     */
    async _fetch(url, headers, body) {
        if (!url) {
            throw new LLMError(
                `No endpoint configured for provider "${this.provider.id}".`,
                'MISSING_ENDPOINT'
            );
        }

        let response;
        try {
            response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
        } catch (err) {
            // Network-level failures (DNS, connection refused, timeout, etc.)
            throw new LLMError(
                `Network error calling ${this.provider.name}: ${err.message}`,
                'NETWORK_ERROR'
            );
        }

        // Read the response body once
        let data;
        try {
            data = await response.json();
        } catch {
            const text = await response.text().catch(() => '(unreadable body)');
            throw new LLMError(
                `Invalid JSON from ${this.provider.name} (HTTP ${response.status}): ${text.slice(0, 300)}`,
                'INVALID_RESPONSE'
            );
        }

        // Handle HTTP error statuses
        if (!response.ok) {
            const status = response.status;
            const detail = data?.error?.message || JSON.stringify(data).slice(0, 300);

            if (status === 401 || status === 403) {
                throw new LLMError(
                    `Authentication failed for ${this.provider.name}: ${detail}`,
                    'AUTH_ERROR'
                );
            }
            if (status === 429) {
                throw new LLMError(
                    `Rate limit exceeded for ${this.provider.name}. Try again later.`,
                    'RATE_LIMIT'
                );
            }
            throw new LLMError(
                `HTTP ${status} from ${this.provider.name}: ${detail}`,
                'API_ERROR'
            );
        }

        return data;
    }
}

/**
 * Custom error class for LLM-related failures.
 */
export class LLMError extends Error {
    /**
     * @param {string} message
     * @param {'NETWORK_ERROR'|'AUTH_ERROR'|'RATE_LIMIT'|'API_ERROR'|'INVALID_RESPONSE'|'MISSING_ENDPOINT'} code
     */
    constructor(message, code) {
        super(message);
        this.name = 'LLMError';
        this.code = code;
    }
}

/**
 * Factory function — creates and returns a new LLMClient instance.
 *
 * @param {object} provider - Provider descriptor from llm-detector.js
 * @returns {LLMClient}
 */
export function createLLMClient(provider) {
    return new LLMClient(provider);
}
