import { join } from 'node:path';
import { writeFileSafe, ensureDir } from '../utils/fs-helpers.js';
import { logger } from '../utils/logger.js';

/**
 * Genera archivos de reglas de IA para el proyecto:
 * - .ai/rules.md       — reglas canónicas, universales (ubicación principal)
 * - .cursorrules       — adaptador: Cursor, Windsurf, Trae, Antigravity
 * - .github/copilot-instructions.md — adaptador: GitHub Copilot
 *
 * El contenido es idéntico en todos — solo cambia el nombre de archivo
 * porque cada herramienta busca en una ubicación distinta.
 */
export async function generateCursorIntegration(projectPath, config) {
    await generateAIRules(projectPath, config);
    logger.success('Reglas de IA generadas en .ai/rules.md');
}

/**
 * Genera .ai/rules.md (canónico) + adaptadores por IDE
 */
async function generateAIRules(projectPath, config) {
    const stackName = config.isDecoupled
        ? `${config.frontend?.stackEntry?.name} + ${config.backend?.stackEntry?.name}`
        : config.stackEntry?.name || 'General';

    const language = config.isDecoupled
        ? config.frontend?.language
        : config.language;

    let rules = `# AI Rules — ${stackName}
# Generado por Grimox CLI — Compatible con Cursor, Windsurf, Trae, Antigravity, Copilot y otros

## Proyecto
- Nombre: ${config.projectName || 'App'}
- Stack: ${stackName}
- Lenguaje: ${language || 'No especificado'}
${config.database ? `- Base de datos: ${config.database}` : ''}

## Reglas Generales
- Escribe código limpio, legible y mantenible
- ESM modules (import/export), no CommonJS (require)
- 4 espacios de indentación
- Comillas simples para strings, dobles para JSX attributes
- Punto y coma obligatorio
- camelCase para variables/funciones, PascalCase para componentes/clases
- UPPER_SNAKE_CASE para constantes
- Nunca hardcodear credenciales — usar variables de entorno
- Manejar errores con try/catch en boundaries del sistema
- No console.log en producción, usar un logger apropiado

## Seguridad
- Validar y sanitizar todos los inputs del usuario
- Implementar rate limiting en APIs
- Configurar CSP y CORS restrictivos
- No exponer stack traces en errores de producción
- Almacenar secretos en .env, nunca en código

`;

    // Reglas específicas del framework
    rules += getFrameworkRules(config);

    // Reglas de Grimox
    rules += `
## Grimox CLI
Este proyecto fue generado con Grimox CLI. Comandos disponibles:
- \`grimox list\` — Ver stacks y bases de datos disponibles
- \`grimox create\` — Crear nuevo proyecto con stack moderno
- \`grimox migrate\` — Migrar proyecto existente (requiere LLM)

## Skills de IA
Las skills están en \`.ai/skills/\` — ábrelas y úsalas como prompt en tu herramienta:
- \`.ai/skills/grimox-dev.md\` — desarrollo autónomo completo
- \`.ai/skills/grimox-migrate.md\` — migración a stack moderno
- \`.ai/skills/grimox-docs.md\` — documentación técnica
`;

    // .ai/rules.md — archivo canónico (ubicación universal)
    const aiDir = join(projectPath, '.ai');
    await ensureDir(aiDir);
    await writeFileSafe(join(aiDir, 'rules.md'), rules);

    // Adaptadores por IDE — mismo contenido, nombres que cada herramienta busca
    // Cursor, Windsurf, Trae, Antigravity → .cursorrules
    await writeFileSafe(join(projectPath, '.cursorrules'), rules);

    // GitHub Copilot → .github/copilot-instructions.md
    const githubDir = join(projectPath, '.github');
    await ensureDir(githubDir);
    await writeFileSafe(join(githubDir, 'copilot-instructions.md'), rules);
}

/**
 * Retorna reglas específicas para el framework del proyecto
 */
function getFrameworkRules(config) {
    const stackId = config.isDecoupled ? config.frontend?.stackId : config.stackId;
    const backendId = config.isDecoupled ? config.backend?.stackId : null;

    let rules = '';

    // Frontend rules
    switch (stackId) {
        case 'nextjs-15':
            rules += `## Next.js 15
- Usa App Router (no Pages Router)
- Prefiere Server Components por defecto, usa 'use client' solo cuando sea necesario
- Usa Server Actions para mutaciones de datos
- Implementa loading.tsx y error.tsx en cada ruta
- Usa Image de next/image para optimización automática
- Implementa metadata para SEO en cada page.tsx
- Usa Suspense boundaries para streaming
- Organiza por features: app/(feature)/page.tsx

## TypeScript
- Usa tipos estrictos, evita 'any'
- Define interfaces para props de componentes
- Usa satisfies para validación en compilación

## Tailwind CSS + shadcn/ui
- Usa className directamente, no clsx ni classnames
- Colores: usa el sistema de design tokens de shadcn
- Dark mode: usa la clase 'dark' en el html
- Componentes: importar de @/components/ui/
`;
            break;

        case 'nuxt-4':
            rules += `## Nuxt 4
- Usa auto-imports (no importar ref, computed, etc. manualmente)
- Server routes en server/api/
- Usa useFetch o useAsyncData para data fetching
- Composables en composables/ (auto-importados)
- Usa definePageMeta para metadata de páginas
- Middleware en middleware/
- Layouts en layouts/

## Tailwind CSS + NuxtUI
- Usa UButton, UInput, etc. de NuxtUI
- Tema configurado en app.config.ts
`;
            break;

        case 'angular':
            rules += `## Angular 19
- Usa standalone components (no NgModule)
- Usa signals para estado reactivo
- Usa inject() en lugar de constructor injection
- Implementa Guards para protección de rutas
- Usa Interceptors para headers/auth
- Lazy loading para módulos de features
- Reactive forms con validación
- OnPush change detection strategy

## TypeScript (obligatorio)
- strict mode activado
- Interfaces para modelos de datos
- Enums para constantes tipadas

## Tailwind CSS + Angular Material
- mat-* componentes para UI consistente
- Temas con Angular Material theming system
`;
            break;

        case 'react-vite':
            rules += `## React 19 + Vite
- Functional components siempre
- Hooks para lógica reutilizable (custom hooks en hooks/)
- React.lazy + Suspense para code splitting
- React Router v7 para navegación
- Forms: React Hook Form o controlled components

## Tailwind CSS + shadcn/ui
- className directo, no librerías de utilidad CSS
- Componentes de @/components/ui/
- Dark mode con clase 'dark'
`;
            break;

        case 'vue-vite':
            rules += `## Vue 3 + Vite
- Composition API con <script setup>
- Pinia para state management
- Vue Router 4 para navegación
- Composables para lógica reutilizable

## Tailwind CSS + PrimeVue
- Componentes PrimeVue para UI consistente
- Tailwind para layout y personalización
`;
            break;

        case 'svelte-vite':
        case 'sveltekit':
            rules += `## Svelte 5 / SvelteKit
- Usa runes ($state, $derived, $effect) en Svelte 5
- +page.svelte, +layout.svelte, +server.ts
- Load functions en +page.ts para data fetching
- Form actions para mutaciones

## Tailwind CSS + Skeleton
- Componentes Skeleton UI
- Temas con CSS custom properties
`;
            break;

        case 'expo':
            rules += `## React Native (Expo)
- Expo Router para navegación (file-based)
- NativeWind para estilos (Tailwind en RN)
- Expo SDK APIs para funcionalidades nativas
- No usar componentes web (div, span) — usar View, Text, etc.
- SafeAreaView para pantalla completa
- FlatList para listas largas (no ScrollView con map)
`;
            break;

        case 'flutter':
            rules += `## Flutter
- Usa Riverpod para state management
- Material 3 widgets
- GoRouter para navegación
- Repository pattern para data access
- No lógica de negocio en widgets — usar providers/notifiers
`;
            break;

        case 'tauri':
            rules += `## Tauri 2
- Frontend en React + TypeScript + Vite
- Backend en Rust (src-tauri/)
- Usa invoke() para comunicación frontend → Rust
- Commands en Rust con #[tauri::command]
- No usar window.__TAURI__ directamente — usar @tauri-apps/api
`;
            break;
    }

    // Backend rules (for decoupled projects)
    switch (backendId) {
        case 'fastapi':
            rules += `## FastAPI (Backend)
- Pydantic v2 models para validación
- Dependency injection con Depends()
- Async/await para endpoints I/O bound
- Routers organizados: /api/v1/users, /api/v1/items
- HTTPException para errores con status codes
- BackgroundTasks para operaciones pesadas
- Type hints en todos los parámetros y retornos
`;
            break;

        case 'springboot':
            rules += `## Spring Boot (Backend)
- Constructor injection (no @Autowired en campos)
- DTOs para request/response (no exponer entidades)
- @Validated para validación de inputs
- @ControllerAdvice para manejo global de errores
- Spring Data JPA repositories
- Profiles: dev, staging, prod
- Flyway para migraciones de DB
`;
            break;

        case 'nestjs':
            rules += `## NestJS (Backend)
- Modules para organización
- DTOs con class-validator
- Guards para autenticación
- Interceptors para transformación
- Pipes para validación
- Exception filters para errores
`;
            break;

        case 'hono':
            rules += `## Hono (Backend)
- Middleware pattern
- Zod para validación
- Context helpers para responses
- Variables de entorno con c.env
`;
            break;
    }

    return rules;
}
