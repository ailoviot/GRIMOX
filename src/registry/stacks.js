/**
 * Catálogo maestro de stacks disponibles en Grimox CLI.
 *
 * autoLanguage: si es string, se auto-configura sin preguntar.
 *               si es null, el CLI pregunta JS/TS (o Java/Kotlin).
 * autoUI:       librería UI que se inyecta automáticamente.
 */
export const stacks = {
    'web-fullstack-integrated': {
        label: 'Web Fullstack Integrado',
        description: 'Un solo framework con SSR + API + DB',
        entries: [
            {
                id: 'nextjs-15',
                name: 'Next.js 15',
                repo: 'nextjs-15',
                autoLanguage: 'TypeScript',
                autoUI: 'Tailwind CSS v4 + shadcn/ui',
                description: 'React + SSR + App Router + Server Actions',
                compatibleDatabases: ['supabase', 'postgresql', 'firebase', 'mongodb', 'turso', 'insforge', 'redis'],
                tags: ['react', 'ssr', 'fullstack'],
                notes: 'App Router, Server Actions',
            },
            {
                id: 'nuxt-4',
                name: 'Nuxt 4',
                repo: 'nuxt-4',
                autoLanguage: 'TypeScript',
                autoUI: 'Tailwind CSS v4 + NuxtUI',
                description: 'Vue + SSR + Nitro server',
                compatibleDatabases: ['supabase', 'postgresql', 'firebase', 'mongodb', 'turso', 'insforge'],
                tags: ['vue', 'ssr', 'fullstack'],
                notes: 'Auto-imports, Nitro server routes',
            },
            {
                id: 'sveltekit',
                name: 'SvelteKit',
                repo: 'sveltekit',
                autoLanguage: 'TypeScript',
                autoUI: 'Tailwind CSS v4 + Skeleton',
                description: 'Svelte + SSR + Server Endpoints',
                compatibleDatabases: ['supabase', 'postgresql', 'firebase', 'mongodb', 'turso', 'insforge'],
                tags: ['svelte', 'ssr', 'fullstack'],
                notes: 'Server endpoints, form actions',
            },
        ],
    },

    'web-fullstack-decoupled': {
        label: 'Web Fullstack Desacoplado',
        description: 'Frontend SPA + Backend como servicios separados (monorepo)',
        isCombined: true,
        entries: [], // se combinan dinámicamente desde web-frontend + api-backend
    },

    'web-frontend': {
        label: 'Web Frontend (solo SPA)',
        description: 'Solo frontend, sin backend propio',
        entries: [
            {
                id: 'react-vite',
                name: 'React + Vite',
                repo: 'react-spa',
                autoLanguage: null, // pregunta JS/TS
                autoUI: 'Tailwind CSS v4 + shadcn/ui',
                description: 'SPA con React 19 + Vite',
                compatibleDatabases: ['supabase', 'firebase', 'insforge'],
                tags: ['react', 'spa', 'vite'],
            },
            {
                id: 'vue-vite',
                name: 'Vue.js + Vite',
                repo: 'vue-spa',
                autoLanguage: null,
                autoUI: 'Tailwind CSS v4 + PrimeVue',
                description: 'SPA con Vue 3 + Vite',
                compatibleDatabases: ['supabase', 'firebase', 'insforge'],
                tags: ['vue', 'spa', 'vite'],
            },
            {
                id: 'angular',
                name: 'Angular',
                repo: 'angular',
                autoLanguage: 'TypeScript',
                autoUI: 'Tailwind CSS v4 + Angular Material',
                description: 'SPA con Angular 19 + standalone components',
                compatibleDatabases: ['supabase', 'firebase', 'insforge'],
                tags: ['angular', 'spa'],
                notes: 'TypeScript obligatorio, standalone components, Guards',
            },
            {
                id: 'svelte-vite',
                name: 'Svelte + Vite',
                repo: 'svelte-spa',
                autoLanguage: null,
                autoUI: 'Tailwind CSS v4 + Skeleton',
                description: 'SPA con Svelte 5 + Vite',
                compatibleDatabases: ['supabase', 'firebase', 'insforge'],
                tags: ['svelte', 'spa', 'vite'],
            },
        ],
    },

    'api-backend': {
        label: 'API / Backend (solo API)',
        description: 'Solo backend, sin frontend',
        entries: [
            {
                id: 'fastapi',
                name: 'FastAPI',
                repo: 'fastapi-base',
                autoLanguage: 'Python',
                autoUI: null,
                description: 'API async con Pydantic + Uvicorn',
                compatibleDatabases: ['supabase', 'postgresql', 'firebase', 'mongodb', 'oracle', 'turso', 'insforge', 'redis'],
                tags: ['python', 'api', 'async'],
                notes: 'Pydantic v2, uvicorn, auto-docs Swagger/ReDoc',
            },
            {
                id: 'nestjs',
                name: 'NestJS',
                repo: 'nestjs',
                autoLanguage: 'TypeScript',
                autoUI: null,
                description: 'Enterprise API framework para Node.js',
                compatibleDatabases: ['supabase', 'postgresql', 'firebase', 'mongodb', 'oracle', 'turso', 'insforge', 'redis'],
                tags: ['typescript', 'api', 'enterprise'],
            },
            {
                id: 'hono',
                name: 'Hono',
                repo: 'hono',
                autoLanguage: 'TypeScript',
                autoUI: null,
                description: 'Ultra-fast, multi-runtime API',
                compatibleDatabases: ['supabase', 'postgresql', 'mongodb', 'turso', 'insforge', 'redis'],
                tags: ['typescript', 'api', 'edge'],
            },
            {
                id: 'fastify',
                name: 'Fastify',
                repo: 'fastify',
                autoLanguage: null,
                autoUI: null,
                description: 'High performance Node.js API',
                compatibleDatabases: ['supabase', 'postgresql', 'mongodb', 'turso', 'insforge', 'redis'],
                tags: ['node', 'api', 'performance'],
            },
            {
                id: 'springboot',
                name: 'Spring Boot',
                repo: 'springboot',
                autoLanguage: null, // pregunta Java/Kotlin
                autoUI: null,
                description: 'Enterprise Java/Kotlin API',
                compatibleDatabases: ['postgresql', 'mongodb', 'oracle', 'insforge', 'redis'],
                tags: ['java', 'kotlin', 'api', 'enterprise'],
                languageOptions: ['Java', 'Kotlin'],
                notes: 'Maven/Gradle, Spring Security, JPA + Hibernate',
            },
        ],
    },

    'mobile': {
        label: 'App Móvil',
        description: 'Aplicaciones móviles multiplataforma',
        entries: [
            {
                id: 'expo',
                name: 'React Native (Expo)',
                repo: 'expo-router',
                autoLanguage: 'TypeScript',
                autoUI: 'NativeWind',
                description: 'Expo SDK + Expo Router',
                compatibleDatabases: ['supabase', 'firebase', 'insforge'],
                tags: ['react-native', 'expo', 'mobile'],
                notes: 'Expo Router, EAS Build',
            },
            {
                id: 'flutter',
                name: 'Flutter',
                repo: 'flutter',
                autoLanguage: 'Dart',
                autoUI: 'Material 3',
                description: 'Flutter multiplataforma',
                compatibleDatabases: ['supabase', 'firebase', 'insforge'],
                tags: ['flutter', 'dart', 'mobile'],
                notes: 'Riverpod, Material 3',
            },
            {
                id: 'flet-mobile',
                name: 'Flet (Python)',
                repo: 'flet-mobile',
                autoLanguage: 'Python',
                autoUI: 'Flet components',
                description: 'Apps móviles desde Python',
                compatibleDatabases: ['supabase', 'firebase', 'insforge'],
                tags: ['python', 'flet', 'mobile'],
            },
        ],
    },

    'desktop': {
        label: 'App Desktop',
        description: 'Aplicaciones de escritorio multiplataforma',
        entries: [
            {
                id: 'tauri',
                name: 'Tauri',
                repo: 'tauri-react',
                autoLanguage: 'TypeScript + Rust',
                autoUI: 'Tailwind CSS v4 + shadcn/ui',
                description: 'Apps ligeras con web UI + Rust',
                compatibleDatabases: ['supabase', 'turso', 'insforge'],
                tags: ['tauri', 'rust', 'desktop'],
            },
            {
                id: 'electron',
                name: 'Electron',
                repo: 'electron',
                autoLanguage: null,
                autoUI: 'Tailwind CSS v4',
                description: 'Cross-platform desktop con Node.js',
                compatibleDatabases: ['supabase', 'turso', 'insforge'],
                tags: ['electron', 'desktop'],
            },
            {
                id: 'flet-desktop',
                name: 'Flet (Python)',
                repo: 'flet-desktop',
                autoLanguage: 'Python',
                autoUI: 'Flet components',
                description: 'Apps desktop desde Python',
                compatibleDatabases: ['supabase', 'postgresql', 'insforge'],
                tags: ['python', 'flet', 'desktop'],
            },
        ],
    },

    'iot-embedded': {
        label: 'IoT / Embebido',
        description: 'Proyectos de electrónica y microcontroladores',
        entries: [
            {
                id: 'arduino',
                name: 'Arduino (.ino)',
                repo: 'arduino-base',
                autoLanguage: 'C++',
                autoUI: null,
                description: 'Estructura Arduino IDE con .ino',
                compatibleDatabases: [],
                tags: ['arduino', 'iot', 'cpp'],
                boardOptions: ['ESP32', 'Arduino Uno', 'Arduino Mega', 'ESP8266'],
            },
            {
                id: 'platformio',
                name: 'PlatformIO',
                repo: 'platformio-esp32',
                autoLanguage: 'C++',
                autoUI: null,
                description: 'Desarrollo embebido profesional',
                compatibleDatabases: [],
                tags: ['platformio', 'iot', 'cpp'],
                boardOptions: ['ESP32 (esp32dev)', 'ESP8266 (nodemcuv2)', 'Arduino Uno (uno)'],
            },
            {
                id: 'esp-idf',
                name: 'ESP-IDF',
                repo: 'esp-idf',
                autoLanguage: 'C',
                autoUI: null,
                description: 'Framework nativo Espressif',
                compatibleDatabases: [],
                tags: ['esp-idf', 'iot', 'c'],
            },
            {
                id: 'micropython',
                name: 'MicroPython',
                repo: 'micropython',
                autoLanguage: 'Python',
                autoUI: null,
                description: 'Python en microcontroladores',
                compatibleDatabases: [],
                tags: ['micropython', 'iot', 'python'],
                boardOptions: ['ESP32', 'Raspberry Pi Pico', 'ESP8266'],
            },
        ],
    },

    'data-ai': {
        label: 'Data Analytics / IA',
        description: 'Proyectos de ciencia de datos e inteligencia artificial',
        entries: [
            {
                id: 'fastapi-ml',
                name: 'FastAPI + ML Stack',
                repo: 'fastapi-ml',
                autoLanguage: 'Python',
                autoUI: null,
                description: 'FastAPI + scikit-learn + pandas + Jupyter',
                compatibleDatabases: ['supabase', 'postgresql', 'mongodb', 'insforge'],
                tags: ['python', 'ml', 'data'],
                notes: 'scikit-learn, pandas, numpy, Jupyter notebooks',
            },
        ],
    },

    'documentation': {
        label: 'Documentación',
        description: 'Sitios de documentación estáticos',
        entries: [
            {
                id: 'astro',
                name: 'Astro (Starlight)',
                repo: 'astro-docs',
                autoLanguage: 'TypeScript',
                autoUI: 'Tailwind CSS v4 + Starlight',
                description: 'Documentación rápida con Astro',
                compatibleDatabases: [],
                tags: ['astro', 'docs', 'static'],
            },
            {
                id: 'docusaurus',
                name: 'Docusaurus',
                repo: 'docusaurus',
                autoLanguage: 'TypeScript',
                autoUI: null,
                description: 'Documentación React-based (Meta)',
                compatibleDatabases: [],
                tags: ['docusaurus', 'docs', 'react'],
            },
            {
                id: 'vitepress',
                name: 'VitePress',
                repo: 'vitepress',
                autoLanguage: 'TypeScript',
                autoUI: null,
                description: 'Documentación Vue-based',
                compatibleDatabases: [],
                tags: ['vitepress', 'docs', 'vue'],
            },
        ],
    },

    'cli-tools': {
        label: 'Herramienta CLI',
        description: 'Herramientas de línea de comandos',
        entries: [
            {
                id: 'node-cli',
                name: 'Node.js + Commander',
                repo: 'node-cli',
                autoLanguage: 'JavaScript',
                autoUI: null,
                description: 'CLI tool scaffold con Commander.js',
                compatibleDatabases: [],
                tags: ['node', 'cli'],
            },
        ],
    },
};

/**
 * Busca un stack entry por su ID
 * @param {string} stackId
 * @returns {object|null}
 */
export function findStackById(stackId) {
    for (const category of Object.values(stacks)) {
        const found = category.entries.find((e) => e.id === stackId);
        if (found) return found;
    }
    return null;
}

/**
 * Obtiene todas las categorías como array de opciones para @clack/prompts
 */
export function getCategoryOptions() {
    return Object.entries(stacks)
        .filter(([id]) => id !== 'web-fullstack-decoupled')
        .map(([id, cat]) => ({
            value: id,
            label: cat.label,
            hint: cat.description,
        }));
}

/**
 * Obtiene la categoría "desacoplado" con sus opciones combinadas
 */
export function getDecoupledOption() {
    return {
        value: 'web-fullstack-decoupled',
        label: 'Web Fullstack Desacoplado',
        hint: 'Frontend SPA + Backend como servicios separados (monorepo)',
    };
}
