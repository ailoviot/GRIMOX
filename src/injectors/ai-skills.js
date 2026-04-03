import { join } from 'node:path';
import { writeFileSafe } from '../utils/fs-helpers.js';

/**
 * Inyecta reglas de IA para el proyecto:
 * - .ai/rules.md  — ubicación canónica universal
 * - .cursorrules  — adaptador: Cursor, Windsurf, Trae, Antigravity
 * - .github/copilot-instructions.md — adaptador: GitHub Copilot
 */
export async function inject(projectPath, config) {
    const stackId = config.isDecoupled ? null : config.stackId;
    const language = config.isDecoupled
        ? `${config.frontend.stackEntry.name} + ${config.backend.stackEntry.name}`
        : config.language;

    const stackName = config.isDecoupled
        ? `${config.frontend.stackEntry.name} (frontend) + ${config.backend.stackEntry.name} (backend)`
        : config.stackEntry?.name || 'General';

    const rules = getCursorRules(stackId, stackName, language, config);

    await writeFileSafe(join(projectPath, '.cursorrules'), rules);
}

function getCursorRules(stackId, stackName, language, config) {
    const header = `# Cursor Rules - ${stackName}
# Generado por Grimox CLI v0.1.0
# Estas reglas guían a la IA para seguir las mejores prácticas del stack.

`;

    const commonRules = `## Reglas Generales
- Escribe código limpio, legible y mantenible.
- Sigue el principio DRY (Don't Repeat Yourself).
- Usa nombres descriptivos en español para variables de negocio, inglés para código técnico.
- Maneja errores apropiadamente con try/catch.
- No dejes console.log en producción, usa un logger apropiado.
- Valida inputs en los boundaries del sistema (API endpoints, formularios).
- Nunca hardcodees credenciales, usa variables de entorno.

`;

    let specificRules = '';

    if (['nextjs-15'].includes(stackId)) {
        specificRules = `## Next.js 15 Best Practices
- Usa App Router (no Pages Router).
- Prefiere Server Components por defecto, usa 'use client' solo cuando sea necesario.
- Usa Server Actions para mutaciones de datos.
- Implementa loading.tsx y error.tsx en cada ruta.
- Usa Image component para optimización automática.
- Implementa metadata para SEO en cada page.
- Usa Suspense boundaries para streaming.
- Organiza por features: app/(feature)/page.tsx.

## TypeScript
- Usa tipos estrictos, evita 'any'.
- Define interfaces para props de componentes.
- Usa satisfies para validación de tipos en tiempo de compilación.

`;
    } else if (stackId === 'angular') {
        specificRules = `## Angular 19 Best Practices
- Usa standalone components (no NgModule).
- Usa signals para estado reactivo.
- Implementa Guards para protección de rutas.
- Usa Interceptors para headers/auth.
- Lazy loading para módulos de features.
- Usa reactive forms con validación.
- Implementa OnPush change detection.
- Usa inject() en lugar de constructor injection.

## TypeScript (obligatorio en Angular)
- Usa tipos estrictos siempre.
- Define interfaces para modelos de datos.
- Usa enums para constantes tipadas.

`;
    } else if (stackId === 'fastapi') {
        specificRules = `## FastAPI Best Practices
- Usa Pydantic v2 models para validación.
- Implementa dependency injection con Depends().
- Usa async/await para endpoints I/O bound.
- Organiza por routers: /api/v1/users, /api/v1/items.
- Usa HTTPException para errores con status codes apropiados.
- Documenta endpoints con docstrings (auto-genera Swagger).
- Usa BackgroundTasks para operaciones pesadas.
- Implementa middleware de CORS.

## Python
- Sigue PEP 8.
- Usa type hints en todos los parámetros y retornos.
- Usa f-strings para interpolación.

`;
    } else if (stackId === 'springboot') {
        specificRules = `## Spring Boot 3 Best Practices
- Usa constructor injection (no @Autowired en campos).
- Implementa DTOs para request/response (no exponer entidades).
- Usa @Validated para validación de inputs.
- Implementa GlobalExceptionHandler con @ControllerAdvice.
- Usa Spring Data JPA repositories.
- Configura profiles (dev, staging, prod).
- Implementa Spring Security con JWT.
- Usa Flyway o Liquibase para migraciones de DB.

`;
    } else if (['arduino', 'platformio'].includes(stackId)) {
        specificRules = `## Arduino / IoT Best Practices
- Evita delay() — usa millis() para timing no bloqueante.
- Minimiza el uso de String, prefiere char arrays.
- Usa constexpr para constantes en tiempo de compilación.
- Implementa watchdog timer para recuperación de errores.
- Maneja la reconexión WiFi automáticamente.
- Usa deep sleep cuando sea posible para ahorro de energía.
- Estructura: setup() para inicialización, loop() para lógica principal.
- Separa lógica en archivos .h/.cpp modulares.

`;
    } else {
        specificRules = `## ${stackName} Best Practices
- Sigue las convenciones oficiales del framework.
- Mantén los componentes pequeños y enfocados.
- Implementa testing desde el inicio.
- Documenta las decisiones arquitectónicas importantes.

`;
    }

    const securityRules = `## Seguridad
- Valida y sanitiza todos los inputs del usuario.
- Usa HTTPS en producción.
- Implementa rate limiting en APIs.
- No expongas stack traces en errores de producción.
- Configura CORS restrictivo.
- Usa CSP headers.
- Almacena secretos en variables de entorno, nunca en código.
`;

    return header + commonRules + specificRules + securityRules;
}
