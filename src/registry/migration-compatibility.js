/**
 * Matriz de compatibilidad: qué tipos de arquitectura destino son válidos
 * según el stack detectado.
 *
 * La clave es la categoría del stack detectado (clasificada por el detector).
 * El valor es un array de categorías destino válidas del registry de stacks.
 */
export const compatibilityMatrix = {
    // Web frontend detectado (React, Vue, Angular, Svelte, jQuery)
    'web-frontend': [
        'web-fullstack-integrated',   // Puede migrar a fullstack integrado (Next.js, Nuxt)
        'web-fullstack-decoupled',    // Puede migrar a fullstack desacoplado
        'web-frontend',               // Puede modernizar el frontend (CRA→Vite, React 16→19)
        'desktop',                    // Puede empaquetar como desktop (Tauri, Electron)
    ],

    // Web backend detectado (Express, Fastify, Flask, Django, Spring Boot, NestJS)
    'web-backend': [
        'api-backend',                // Puede modernizar backend (Express→Hono, Flask→FastAPI)
        'web-fullstack-integrated',   // Puede migrar a fullstack integrado
        'web-fullstack-decoupled',    // Puede migrar a fullstack desacoplado
    ],

    // Web fullstack integrado detectado (Next.js, Nuxt, SvelteKit)
    'web-fullstack': [
        'web-fullstack-integrated',   // Puede cambiar framework (Next.js→Nuxt)
        'web-fullstack-decoupled',    // Puede desacoplar
        'web-frontend',               // Puede extraer solo frontend
        'api-backend',                // Puede extraer solo backend
        'desktop',                    // Puede empaquetar como desktop
    ],

    // Proyecto desacoplado detectado (frontend/ + backend/)
    'web-decoupled': [
        'web-fullstack-integrated',   // Puede unificar en un solo framework
        'web-fullstack-decoupled',    // Puede modernizar manteniendo desacoplado
        'web-frontend',               // Puede migrar solo frontend
        'api-backend',                // Puede migrar solo backend
        'desktop',                    // Puede empaquetar frontend como desktop
    ],

    // Móvil detectado (React Native, Flutter, Flet mobile)
    'mobile': [
        'mobile',                     // Puede actualizar framework (RN viejo→nuevo, Flutter upgrade)
        'desktop',                    // Flet puede ir a desktop
    ],

    // Desktop detectado (Electron, Tauri, Flet desktop)
    'desktop': [
        'desktop',                    // Puede actualizar o cambiar framework (Electron→Tauri)
        'mobile',                     // Flet puede ir a móvil
        'web-frontend',               // Puede extraer UI como web SPA
    ],

    // IoT detectado (Arduino, PlatformIO, ESP-IDF, MicroPython)
    'iot': [
        'iot-embedded',               // Solo puede migrar dentro de IoT
    ],

    // Data/IA detectado (FastAPI + ML, Jupyter)
    'data-ai': [
        'data-ai',                    // Puede actualizar stack ML
        'api-backend',                // Puede migrar a API pura
    ],

    // Documentación detectada (Astro, Docusaurus, VitePress)
    'documentation': [
        'documentation',              // Puede cambiar framework docs
    ],
};

/**
 * Clasifica qué tipo de stack fue detectado para buscar compatibilidad
 * @param {object} detection - resultado del project-detector (una parte)
 * @returns {string} categoría para la matriz de compatibilidad
 */
export function classifyDetectedStack(detection) {
    const fw = detection.framework;

    if (!fw && !detection.language) return 'unknown';

    // IoT
    if (['PlatformIO', 'Arduino', 'ESP-IDF', 'MicroPython'].includes(fw)) return 'iot';
    if (detection.language === 'C++' || detection.language === 'C') return 'iot';

    // Móvil
    if (['Flutter', 'Flet'].includes(fw) && detection.role === 'mobile') return 'mobile';
    if (fw === 'Flutter') return 'mobile';

    // Desktop
    if (['Electron', 'Tauri'].includes(fw)) return 'desktop';
    if (fw === 'Flet' && detection.role === 'desktop') return 'desktop';

    // Web fullstack integrado
    if (['Next.js', 'Nuxt', 'SvelteKit'].includes(fw)) return 'web-fullstack';

    // Web backend
    const backendFrameworks = ['Express', 'Fastify', 'NestJS', 'Hono', 'FastAPI', 'Django', 'Flask', 'Spring Boot'];
    if (backendFrameworks.includes(fw)) return 'web-backend';

    // Web frontend
    const frontendFrameworks = ['React', 'Vue', 'Angular', 'Svelte'];
    if (frontendFrameworks.includes(fw)) return 'web-frontend';

    // jQuery / PHP legacy → web frontend
    if (detection.dependencies?.jquery) return 'web-frontend';

    // Data/IA (Python con librerías ML)
    if (detection.language === 'Python') {
        const deps = detection.dependencies || {};
        if (deps.scikit || deps.pandas || deps.numpy || deps.tensorflow || deps.torch) return 'data-ai';
    }

    // Documentación
    if (['Astro', 'Docusaurus', 'VitePress'].includes(fw)) return 'documentation';

    // Default: si tiene frontend detectado
    if (detection.role === 'frontend') return 'web-frontend';
    if (detection.role === 'backend') return 'web-backend';

    return 'unknown';
}

/**
 * Obtiene las categorías destino compatibles para un stack detectado
 * @param {object} detection - resultado del project-detector (una parte)
 * @returns {string[]} IDs de categorías del registry compatibles
 */
export function getCompatibleTargets(detection) {
    const category = classifyDetectedStack(detection);
    return compatibilityMatrix[category] || Object.keys(compatibilityMatrix).flatMap((k) => compatibilityMatrix[k]);
}

/**
 * Obtiene las categorías destino compatibles para un proyecto completo
 * (considerando todas sus partes si es desacoplado)
 * @param {object} fullDetection - resultado completo de detectProject
 * @returns {string[]} IDs de categorías únicos compatibles
 */
export function getCompatibleTargetsForProject(fullDetection) {
    if (fullDetection.structure === 'decoupled') {
        return ['web-fullstack-integrated', 'web-fullstack-decoupled', 'web-frontend', 'api-backend', 'desktop'];
    }

    if (fullDetection.parts.length === 0) return [];

    return getCompatibleTargets(fullDetection.parts[0]);
}

/**
 * Labels legibles para cada categoría destino
 */
export const targetLabels = {
    'web-fullstack-integrated': {
        label: 'Web Fullstack Integrado',
        hint: 'Un solo framework (Next.js, Nuxt, SvelteKit)',
    },
    'web-fullstack-decoupled': {
        label: 'Web Fullstack Desacoplado',
        hint: 'Frontend + Backend como servicios separados',
    },
    'web-frontend': {
        label: 'Web Frontend (solo SPA)',
        hint: 'React+Vite, Vue+Vite, Angular, Svelte+Vite',
    },
    'api-backend': {
        label: 'API / Backend (solo API)',
        hint: 'FastAPI, Hono, NestJS, Fastify, Spring Boot',
    },
    'mobile': {
        label: 'App Móvil',
        hint: 'React Native (Expo), Flutter, Flet',
    },
    'desktop': {
        label: 'App Desktop',
        hint: 'Tauri, Electron, Flet',
    },
    'iot-embedded': {
        label: 'IoT / Embebido',
        hint: 'Arduino, PlatformIO, ESP-IDF, MicroPython',
    },
    'data-ai': {
        label: 'Data Analytics / IA',
        hint: 'FastAPI + ML stack',
    },
    'documentation': {
        label: 'Documentación',
        hint: 'Astro, Docusaurus, VitePress',
    },
};
