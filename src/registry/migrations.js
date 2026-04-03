/**
 * Mapeos de migración: tecnología vieja → stack moderno recomendado
 */
export const migrationPaths = {
    'create-react-app': {
        target: 'react-vite',
        label: 'React + Vite (SPA)',
        alternatives: ['nextjs-15'],
        steps: [
            'Reemplazar react-scripts por Vite',
            'Migrar configuración webpack → vite.config',
            'Actualizar imports y estructura de archivos',
            'Actualizar dependencias de React',
        ],
    },
    'react-legacy': {
        target: 'nextjs-15',
        label: 'Next.js 15',
        alternatives: ['react-vite'],
        steps: [
            'Migrar a App Router',
            'Convertir class components → functional',
            'Actualizar React Router → Next.js routing',
        ],
    },
    'vue-2': {
        target: 'nuxt-4',
        label: 'Nuxt 4',
        alternatives: ['vue-vite'],
        steps: [
            'Migrar Options API → Composition API',
            'Vue 2 → Vue 3 (breaking changes)',
            'Vuex → Pinia',
        ],
    },
    'angular-legacy': {
        target: 'angular',
        label: 'Angular 19',
        steps: [
            'Actualizar Angular versión por versión',
            'NgModule → Standalone components',
            'Actualizar RxJS patterns',
        ],
    },
    'express': {
        target: 'hono',
        label: 'Hono',
        alternatives: ['fastify', 'nestjs'],
        steps: [
            'Migrar CommonJS → ESM',
            'Express routes → Hono routes',
            'Express middleware → Hono middleware',
            'Actualizar error handling',
        ],
    },
    'jquery': {
        target: 'nextjs-15',
        label: 'Next.js 15',
        alternatives: ['react-vite', 'vue-vite'],
        steps: [
            'Identificar componentes UI',
            'jQuery DOM → React/Vue components',
            'AJAX → fetch/Supabase SDK',
            'Reescribir event handlers',
        ],
    },
    'php-legacy': {
        target: 'nextjs-15',
        label: 'Next.js 15',
        alternatives: ['nuxt-4', 'fastapi'],
        steps: [
            'Mapear rutas PHP → App Router pages',
            'Migrar queries SQL → ORM/Supabase',
            'Migrar sesiones PHP → Auth moderna',
            'Migrar templates PHP → React components',
        ],
    },
    'django': {
        target: 'fastapi',
        label: 'FastAPI',
        steps: [
            'Migrar Django ORM → SQLAlchemy/Supabase',
            'Django views → FastAPI endpoints',
            'Django templates → API REST + SPA frontend',
        ],
    },
    'flask': {
        target: 'fastapi',
        label: 'FastAPI',
        steps: [
            'Flask routes → FastAPI routes',
            'Sync → Async',
            'Marshmallow → Pydantic',
        ],
    },
};

/**
 * Detecta rutas de migración basado en las dependencias detectadas
 * @param {object} detection - resultado de project-detector
 * @returns {object[]} posibles migraciones
 */
export function findMigrationPaths(detection) {
    const paths = [];

    if (detection.dependencies?.['react-scripts']) {
        paths.push({ key: 'create-react-app', ...migrationPaths['create-react-app'] });
    }
    if (detection.dependencies?.['react'] && !detection.dependencies?.['react-scripts'] && !detection.dependencies?.['next']) {
        const reactVersion = parseInt(detection.dependencies['react']?.replace(/[^0-9]/g, '') || '0');
        if (reactVersion < 18) {
            paths.push({ key: 'react-legacy', ...migrationPaths['react-legacy'] });
        }
    }
    if (detection.dependencies?.['vue'] && detection.dependencies?.vue?.startsWith('2')) {
        paths.push({ key: 'vue-2', ...migrationPaths['vue-2'] });
    }
    if (detection.dependencies?.['@angular/core']) {
        const ver = parseInt(detection.dependencies['@angular/core']?.replace(/[^0-9]/g, '') || '0');
        if (ver < 17) {
            paths.push({ key: 'angular-legacy', ...migrationPaths['angular-legacy'] });
        }
    }
    if (detection.dependencies?.['express']) {
        paths.push({ key: 'express', ...migrationPaths['express'] });
    }
    if (detection.dependencies?.['jquery']) {
        paths.push({ key: 'jquery', ...migrationPaths['jquery'] });
    }

    return paths;
}
