import { join } from 'node:path';
import { writeFileSafe, ensureDir } from '../utils/fs-helpers.js';
import { logger } from '../utils/logger.js';

/**
 * Genera archivos de integración de IA para el proyecto:
 * - GRIMOX.md         — contexto universal para cualquier LLM
 * - .ai/skills/       — skills accesibles desde cualquier LLM o IDE (ubicación principal)
 * - .claude/commands/ — adaptador para Claude Code / Open Code (slash commands)
 *                       generado en silencio; usuarios de otros LLMs no necesitan conocerlo
 */
export async function generateClaudeCodeIntegration(projectPath, config) {
    await generateGrimoxMd(projectPath, config);
    await generateAISkills(projectPath);        // .ai/skills/ — universal
    await generateClaudeCommands(projectPath);  // .claude/commands/ — adaptador Claude Code
    logger.success('Skills generadas en .ai/skills/');
}

// ─── Sección de seguridad adaptada al stack detectado ────────────────────────

/**
 * Genera reglas de seguridad específicas para el framework y la base de datos
 * del proyecto. La sección universal siempre se incluye; las subsecciones
 * por framework y BD solo aparecen cuando son relevantes.
 */
function buildSecuritySection(config) {
    const stackId = config.isDecoupled
        ? null
        : config.stackEntry?.id || '';
    const frontendId = config.frontend?.stackEntry?.id || '';
    const backendId  = config.backend?.stackEntry?.id  || '';
    const category   = config.isDecoupled ? 'web-fullstack-decoupled' : config.stackEntry?.category || '';
    const db         = config.database || '';

    // Detectar si hay algún frontend web (para reglas XSS / vars cliente)
    const isWebFrontend = ['nextjs-15','nuxt-4','sveltekit','react-vite','vue-vite','angular','svelte-vite'].includes(stackId || frontendId);
    const isNodeBackend = ['hono','nestjs','fastify','nextjs-15','nuxt-4','sveltekit'].includes(stackId || backendId);
    const isPythonBackend = ['fastapi','flet-mobile','flet-desktop','micropython'].includes(stackId || backendId);
    const isIoT = category === 'iot-embedded';
    const isMobile = category === 'mobile';
    const isDesktop = category === 'desktop';
    const isSpringBoot = (stackId || backendId) === 'springboot';

    let s = `---\n\n## Seguridad — OBLIGATORIO\n\n`;
    s += `Estas reglas aplican a cada línea de código generada en este proyecto. Son parte del estándar de calidad de Grimox y no son negociables.\n\n`;

    // ── 1. Credenciales y secretos (universal) ───────────────────────────────
    s += `### Credenciales y secretos\n`;
    s += `- **NUNCA hardcodear** API keys, tokens, passwords, connection strings ni secretos en el código fuente\n`;
    if (isIoT) {
        s += `- Credenciales WiFi, MQTT y API keys van en un archivo \`credentials.h\` excluido del repositorio (\`.gitignore\`)\n`;
        s += `- Usar \`#include "credentials.h"\` y distribuir \`credentials.example.h\` con valores ficticios\n`;
    } else if (isMobile || isDesktop) {
        s += `- Secretos del servidor NUNCA van en el bundle de la app — solo en el backend\n`;
        s += `- Variables de entorno del lado cliente solo para valores no sensibles (URLs públicas, feature flags)\n`;
    } else {
        s += `- Toda credencial va en \`.env\` y nunca se commitea (\`.gitignore\` ya lo incluye)\n`;
        s += `- Usar \`.env.example\` con valores ficticios para documentar las variables requeridas\n`;
    }

    // Reglas específicas por framework para variables de entorno
    if (['nextjs-15'].includes(stackId || frontendId)) {
        s += `- **Next.js**: el prefijo \`NEXT_PUBLIC_\` expone la variable al bundle del cliente — NUNCA usarlo para secretos\n`;
        s += `- Secretos del servidor: solo accesibles en Server Components, Server Actions y Route Handlers (sin prefijo)\n`;
    }
    if (['nuxt-4'].includes(stackId || frontendId)) {
        s += `- **Nuxt**: \`runtimeConfig.public\` se expone al cliente — secretos solo en \`runtimeConfig.secretKey\` (sin \`public\`)\n`;
    }
    if (['sveltekit'].includes(stackId || frontendId)) {
        s += `- **SvelteKit**: \`$env/static/public\` (prefijo \`PUBLIC_\`) se expone al cliente — secretos solo via \`$env/static/private\`\n`;
    }
    if (['react-vite','vue-vite','svelte-vite'].includes(stackId || frontendId)) {
        s += `- **Vite**: el prefijo \`VITE_\` expone la variable al bundle del cliente — NUNCA usarlo para API keys ni secrets\n`;
    }
    if (isSpringBoot) {
        s += `- **Spring Boot**: credenciales van en \`application.properties\` o \`application.yml\` excluidos del repo, o via variables de entorno del sistema\n`;
        s += `- Usar Spring Cloud Config o Vault para producción — nunca commitear \`application-prod.properties\`\n`;
    }

    // ── 2. Inyección (SQL / NoSQL / Prompt) ──────────────────────────────────
    s += `\n### Inyección\n`;

    if (!isIoT) {
        // SQL injection
        if (['supabase','postgresql','oracle','turso','insforge'].includes(db) || isNodeBackend || isPythonBackend || isSpringBoot) {
            s += `**SQL Injection** — NUNCA construir queries concatenando strings con input del usuario:\n`;
            if (isSpringBoot) {
                s += `- Usar JPQL con parámetros nombrados: \`"SELECT u FROM User u WHERE u.id = :id"\`\n`;
                s += `- \`@Query\` con \`?1\` o \`@Param\` — nunca concatenación de strings en queries nativas\n`;
            } else if (isPythonBackend) {
                s += `- Usar SQLAlchemy ORM o queries parametrizadas: \`session.execute(text("SELECT * FROM t WHERE id=:id"), {"id": uid})\`\n`;
                s += `- Nunca usar f-strings ni \`%\` para construir queries: \`f"SELECT * FROM t WHERE id={uid}"\` ❌\n`;
            } else {
                s += `- Usar el ORM del proyecto (Prisma / Drizzle / TypeORM) para TODAS las operaciones con DB\n`;
                s += `- Si necesitas raw SQL: queries parametrizadas con \`$1, $2\` — nunca template literals con variables\n`;
            }
        }

        // NoSQL injection (MongoDB)
        if (db === 'mongodb') {
            s += `**NoSQL Injection (MongoDB)** — el input del usuario puede manipular operadores de Mongo:\n`;
            s += `- Sanitizar inputs con \`mongo-sanitize\` antes de usarlos en queries\n`;
            s += `- Nunca usar \`$where\`, \`$function\` ni \`$accumulator\` con input del usuario\n`;
            s += `- Definir schema estricto en Mongoose (\`strict: true\`) — rechazar campos no declarados\n`;
        }

        // Prompt injection
        if (category === 'data-ai' || ['fastapi'].includes(stackId)) {
            s += `**Prompt Injection** — si el proyecto envía input del usuario a un LLM:\n`;
            s += `- NUNCA concatenar input del usuario directamente en el system prompt\n`;
            s += `- Separar siempre el rol \`system\` del rol \`user\` en la API del LLM\n`;
            s += `- Sanitizar y limitar longitud del input antes de incluirlo en cualquier prompt\n`;
            s += `- Validar que la respuesta del LLM no contenga instrucciones ejecutables antes de procesarla\n`;
        }

        // Redis command injection
        if (db === 'redis') {
            s += `**Inyección en Redis** — nunca ejecutar comandos construidos con input del usuario:\n`;
            s += `- Prohibir \`EVAL\`/\`EVALSHA\` con datos del usuario (ejecución de Lua arbitraria)\n`;
            s += `- Validar y escapar las claves antes de usarlas en comandos Redis\n`;
        }
    }

    // ── 3. Validación de inputs ───────────────────────────────────────────────
    s += `\n### Validación de inputs\n`;
    if (isIoT) {
        s += `- Verificar siempre la longitud de los datos recibidos (serial, MQTT, HTTP) antes de copiarlos a buffers\n`;
        s += `- Bounds checking en todos los arrays — los buffer overflows pueden corromper la memoria del microcontrolador\n`;
        s += `- Validar rangos numéricos antes de usarlos en cálculos críticos (índices, offsets, timeouts)\n`;
    } else {
        s += `- Validar y sanitizar TODOS los inputs en los boundaries del sistema (endpoints, formularios, args CLI)\n`;
        s += `- Nunca confiar en la validación del cliente — siempre validar también en el servidor\n`;
        if (['fastapi'].includes(stackId || backendId)) {
            s += `- **FastAPI**: usar modelos Pydantic v2 en cada endpoint — \`model_validator\` para validaciones cruzadas\n`;
        }
        if (['nestjs'].includes(stackId || backendId)) {
            s += `- **NestJS**: \`ValidationPipe\` global con \`whitelist: true, forbidNonWhitelisted: true\` — rechaza campos no declarados en el DTO\n`;
        }
        if (['hono'].includes(stackId || backendId)) {
            s += `- **Hono**: usar \`zValidator\` middleware en cada ruta que acepte input\n`;
        }
        if (['fastify'].includes(stackId || backendId)) {
            s += `- **Fastify**: definir JSON Schema en cada ruta — Fastify rechaza automáticamente requests que no cumplan el schema\n`;
        }
        if (isSpringBoot) {
            s += `- **Spring Boot**: \`@Valid\` en cada \`@RequestBody\` — activar \`@Validated\` a nivel de clase para validación de parámetros\n`;
        }
        if (['angular'].includes(stackId || frontendId)) {
            s += `- **Angular**: validar en el FormGroup del lado cliente Y en el backend — nunca asumir que el Guard o el form cubren todo\n`;
        }
    }

    // ── 4. XSS (solo frontends web) ──────────────────────────────────────────
    if (isWebFrontend && !isIoT) {
        s += `\n### Cross-Site Scripting (XSS)\n`;
        if (['nextjs-15','react-vite'].includes(stackId || frontendId)) {
            s += `- **React**: \`dangerouslySetInnerHTML\` solo con contenido sanitizado via \`DOMPurify\` — nunca con input del usuario directo\n`;
            s += `- Evitar \`eval()\`, \`new Function()\` e inyección de scripts dinámicos\n`;
        }
        if (['nuxt-4','vue-vite'].includes(stackId || frontendId)) {
            s += `- **Vue**: \`v-html\` solo con contenido sanitizado via \`DOMPurify\` — nunca con input del usuario\n`;
            s += `- No almacenar datos sensibles en el store de Pinia (persiste al cliente)\n`;
        }
        if (['sveltekit','svelte-vite'].includes(stackId || frontendId)) {
            s += `- **Svelte**: el tag \`{@html}\` solo con contenido sanitizado via \`DOMPurify\`\n`;
        }
        if (['angular'].includes(stackId || frontendId)) {
            s += `- **Angular**: usar \`DomSanitizer.bypassSecurityTrust*\` con extrema cautela — Angular sanitiza por defecto, no lo bypasses\n`;
            s += `- Binding de \`innerHTML\` pasa por el sanitizer de Angular — no usar interpolación directa para HTML\n`;
        }
    }

    // ── 5. Almacenamiento seguro de tokens ────────────────────────────────────
    if (isMobile) {
        s += `\n### Almacenamiento seguro de tokens\n`;
        if (['expo'].includes(stackId)) {
            s += `- **Expo**: usar \`expo-secure-store\` para tokens y datos sensibles — NUNCA \`AsyncStorage\` (no encriptado)\n`;
            s += `- No loggear tokens, IDs de usuario ni PII en los logs de la app\n`;
        }
        if (['flutter'].includes(stackId)) {
            s += `- **Flutter**: usar \`flutter_secure_storage\` para tokens — nunca \`SharedPreferences\` para datos sensibles\n`;
            s += `- Activar ProGuard/R8 y obfuscación en builds de release\n`;
            s += `- Proteger logs: \`if (kDebugMode) print(sensitiveThing)\` — nunca en release\n`;
        }
        if (['flet-mobile'].includes(stackId)) {
            s += `- **Flet**: almacenar tokens via el keychain del sistema operativo — no en archivos planos\n`;
        }
    }

    // ── 6. IPC y APIs nativas (Desktop) ──────────────────────────────────────
    if (isDesktop) {
        s += `\n### Seguridad IPC y APIs nativas\n`;
        if (['tauri'].includes(stackId)) {
            s += `- **Tauri**: principio de mínimo privilegio en \`capabilities\` (\`tauri.conf.json\`) — solo exponer las APIs que el frontend realmente usa\n`;
            s += `- Validar TODOS los argumentos recibidos via \`invoke()\` en el backend Rust antes de procesarlos\n`;
            s += `- Nunca habilitar \`dangerousRemoteDomainIpcAccess\` ni \`dangerousUseHttpScheme\`\n`;
            s += `- CSP estricto en la config de seguridad de Tauri — sin \`unsafe-inline\` ni \`unsafe-eval\`\n`;
        }
        if (['electron'].includes(stackId)) {
            s += `- **Electron**: \`contextIsolation: true\` y \`nodeIntegration: false\` — NUNCA cambiar estos valores\n`;
            s += `- Toda comunicación frontend↔main via preload scripts (contextBridge) — validar cada mensaje en main\n`;
            s += `- \`webSecurity: true\` — nunca deshabilitar; \`allowRunningInsecureContent: false\`\n`;
            s += `- No cargar contenido externo sin validar la URL — riesgo de remote code execution\n`;
        }
        if (['flet-desktop'].includes(stackId)) {
            s += `- **Flet**: validar inputs del usuario antes de pasarlos a cualquier operación del sistema operativo\n`;
        }
    }

    // ── 7. Seguridad IoT ──────────────────────────────────────────────────────
    if (isIoT) {
        s += `\n### Comunicaciones seguras (IoT)\n`;
        s += `- Usar HTTPS/TLS para todas las llamadas HTTP — verificar certificados del servidor (no deshabilitar validación)\n`;
        s += `- MQTT: usar TLS (puerto 8883) y autenticación — nunca MQTT sin cifrado en producción\n`;
        if (['esp-idf','platformio'].includes(stackId)) {
            s += `- **ESP32**: habilitar Flash Encryption y Secure Boot en producción para proteger el firmware\n`;
            s += `- NVS (Non-Volatile Storage): usar NVS encryption para almacenar credenciales en flash\n`;
        }
        s += `\n### Estabilidad y robustez (IoT)\n`;
        s += `- Configurar Watchdog Timer (WDT) — resetear el dispositivo si el firmware se bloquea\n`;
        s += `- Verificar el valor de retorno de TODAS las operaciones críticas (malloc, WiFi connect, HTTP request)\n`;
        s += `- Limitar el tamaño de los buffers dinámicos — en embebido la memoria es escasa y no hay swap\n`;
        s += `- Nunca usar \`delay()\` en loops principales de ESP32 — usar FreeRTOS tasks o timers no bloqueantes\n`;
    }

    // ── 8. Base de datos (reglas específicas) ─────────────────────────────────
    if (db && !isIoT) {
        s += `\n### Base de datos: ${db}\n`;
        if (db === 'supabase') {
            s += `- **Row Level Security (RLS)**: OBLIGATORIO en todas las tablas con datos de usuario — sin RLS cualquier usuario puede leer todos los registros\n`;
            s += `- \`SUPABASE_SERVICE_ROLE_KEY\`: poder absoluto sobre la DB — NUNCA exponer al cliente, solo en servidor/edge functions\n`;
            s += `- \`SUPABASE_ANON_KEY\`: puede ir en cliente, pero el RLS es la última línea de defensa\n`;
            s += `- Storage buckets: definir políticas de acceso explícitas — nunca dejar buckets públicos sin intención\n`;
            s += `- Realtime: filtrar por RLS también en subscripciones en tiempo real\n`;
        }
        if (db === 'postgresql') {
            s += `- Usuario de DB con mínimos privilegios — nunca conectar con superuser en la aplicación\n`;
            s += `- SSL obligatorio en producción: \`ssl: { rejectUnauthorized: true }\`\n`;
            s += `- Connection pooling: usar el pool del ORM o PgBouncer — no abrir una conexión por request\n`;
            s += `- Revocar permisos no necesarios: \`REVOKE ALL ON SCHEMA public FROM PUBLIC\`\n`;
        }
        if (db === 'firebase') {
            s += `- **Firestore Security Rules**: definir explícitamente — nunca \`allow read, write: if true\` en producción\n`;
            s += `- \`firebase-admin\` SDK: solo en servidor (Node.js/Python) — NUNCA inicializarlo en el cliente\n`;
            s += `- Auth state del cliente: verificar el ID token en el servidor con \`admin.auth().verifyIdToken()\` — no confiar en el estado cliente\n`;
            s += `- Storage Rules: configurar acceso por ruta y por usuario autenticado\n`;
        }
        if (db === 'mongodb') {
            s += `- Mongoose \`strict: true\` (default): nunca deshabilitarlo — rechaza campos no declarados en el schema\n`;
            s += `- Deshabilitar JavaScript del servidor en producción: \`--noscripting\` en mongod\n`;
            s += `- Autenticación obligatoria: \`--auth\` en mongod — nunca MongoDB sin contraseña en producción\n`;
            s += `- Encriptar datos sensibles a nivel de campo antes de almacenarlos\n`;
        }
        if (db === 'oracle') {
            s += `- Bind variables en TODOS los queries — nunca concatenación de strings en SQL nativo\n`;
            s += `- Usuario de aplicación con mínimos privilegios — nunca conectar con SYS o SYSTEM\n`;
            s += `- Habilitar Unified Auditing para operaciones críticas (DELETE, DDL, intentos fallidos de login)\n`;
            s += `- Datos sensibles: encriptar con \`DBMS_CRYPTO\` o Transparent Data Encryption (TDE)\n`;
        }
        if (db === 'turso') {
            s += `- Usar siempre \`@libsql/client\` con queries parametrizadas: \`client.execute({ sql: "SELECT * WHERE id=?", args: [id] })\`\n`;
            s += `- Token de autenticación de Turso: solo en servidor, en variables de entorno — nunca en cliente\n`;
            s += `- Drizzle ORM sobre raw SQL cuando sea posible\n`;
        }
        if (db === 'insforge') {
            s += `- Usar el SDK oficial de Insforge — no construir queries manuales sobre la API\n`;
            s += `- API key de Insforge: solo en servidor, nunca expuesta al cliente\n`;
        }
        if (db === 'redis') {
            s += `- \`requirepass\` obligatorio en producción — nunca Redis sin autenticación\n`;
            s += `- ACL: configurar usuarios con permisos mínimos (\`ACL SETUSER app ~cache:* +GET +SET\`)\n`;
            s += `- Deshabilitar \`FLUSHALL\`/\`FLUSHDB\` por ACL en producción o restringirlo solo a admins\n`;
            s += `- Nunca \`EVAL\`/\`EVALSHA\` con input del usuario — permite ejecución arbitraria de Lua\n`;
            s += `- Encriptar datos sensibles antes de almacenarlos — Redis no encripta en reposo por defecto\n`;
            s += `- \`bind\`: nunca exponer Redis a \`0.0.0.0\` en producción sin firewall\n`;
        }
    }

    // ── 9. Auth y autorización (backends web) ────────────────────────────────
    if (!isIoT && !isMobile && isWebFrontend || isNodeBackend || isPythonBackend || isSpringBoot) {
        s += `\n### Autenticación y autorización\n`;
        s += `- Verificar autenticación en CADA endpoint protegido — no asumir que el middleware global lo cubre todo\n`;
        s += `- Autorización por recurso: el usuario A no puede acceder a datos del usuario B aunque ambos estén autenticados\n`;
        s += `- Tokens JWT: verificar firma, expiración (\`exp\`) y audience (\`aud\`) en cada request\n`;
        s += `- Cookies de sesión: \`HttpOnly\`, \`Secure\`, \`SameSite=Strict\`\n`;
        if (isSpringBoot) {
            s += `- **Spring Security**: configurar explícitamente — nunca depender de los defaults en producción\n`;
            s += `- \`@PreAuthorize\` para seguridad a nivel de método — no solo a nivel de URL\n`;
        }
        if (['nestjs'].includes(stackId || backendId)) {
            s += `- **NestJS**: Guards para autenticación, decoradores \`@Roles()\` para autorización — no lógica de auth en el controlador\n`;
        }
        if (['angular'].includes(stackId || frontendId)) {
            s += `- **Angular**: Route Guards (\`CanActivate\`) para rutas protegidas — pero también verificar en el backend, el guard es solo UX\n`;
            s += `- Interceptors HTTP para adjuntar token y manejar 401 globalmente\n`;
        }
    }

    // ── 10. Manejo de errores y fugas de memoria (universal) ─────────────────
    s += `\n### Manejo de errores\n`;
    if (isIoT) {
        s += `- Verificar el valor de retorno de funciones críticas antes de continuar\n`;
        s += `- Nunca ignorar errores de malloc/calloc — verificar puntero nulo antes de usar la memoria\n`;
        s += `- Log de errores via Serial solo en debug — en producción limitar la información expuesta\n`;
    } else {
        s += `- Manejar TODOS los errores con try/catch — no dejar promesas sin catch ni excepciones sin capturar\n`;
        s += `- NUNCA exponer stack traces, mensajes internos ni rutas de archivos al cliente en producción\n`;
        s += `- Devolver mensajes de error genéricos al usuario; loggear el detalle internamente\n`;
        s += `- No loggear datos sensibles (tokens, passwords, PII) en ningún nivel de log\n`;
    }

    if (!isIoT) {
        s += `\n### Fugas de memoria\n`;
        if (isWebFrontend) {
            s += `- Cancelar peticiones y limpiar efectos en el cleanup del componente (useEffect return, onUnmounted, onDestroy)\n`;
            s += `- Desuscribirse de observables, stores y event listeners cuando el componente se desmonta\n`;
        }
        if (isNodeBackend || isPythonBackend || isSpringBoot) {
            s += `- Cerrar siempre las conexiones a DB al terminar (usar pool — no abrir conexiones manualmente sin cerrarlas)\n`;
            s += `- En Node.js: evitar listeners acumulados — usar \`once\` cuando aplique, limpiar con \`removeListener\`\n`;
            s += `- No retener referencias a objetos grandes en closures o singletons que vivan toda la ejecución del servidor\n`;
        }
    }

    // ── 11. Headers y CORS (backends web) ────────────────────────────────────
    if (isNodeBackend || isPythonBackend || isSpringBoot) {
        s += `\n### Headers de seguridad y CORS\n`;
        s += `- CORS: origen explícito por entorno — nunca \`origin: '*'\` en producción\n`;
        s += `- Headers obligatorios: \`Content-Security-Policy\`, \`X-Frame-Options: DENY\`, \`X-Content-Type-Options: nosniff\`, \`Strict-Transport-Security\`\n`;
        if (['hono'].includes(stackId || backendId)) {
            s += `- Usar middleware \`secureHeaders()\` de Hono y configurar CORS con \`@hono/cors\`\n`;
        }
        if (['nestjs'].includes(stackId || backendId)) {
            s += `- Instalar \`@nestjs/helmet\` y aplicarlo globalmente en \`main.ts\`\n`;
        }
        if (['fastify'].includes(stackId || backendId)) {
            s += `- Usar \`@fastify/helmet\`, \`@fastify/cors\` y \`@fastify/rate-limit\`\n`;
        }
        if (isSpringBoot) {
            s += `- Configurar \`CorsConfigurationSource\` explícitamente en Spring Security — no usar \`@CrossOrigin\` con \`*\`\n`;
        }
    }

    s += `\n---\n\n`;
    return s;
}

/**
 * Genera GRIMOX.md — archivo de contexto universal para cualquier LLM
 * (Claude, GPT-Codex, Gemini, Grok, GLM, DeepSeek, Ollama, etc.)
 */
async function generateGrimoxMd(projectPath, config) {
    const stackName = config.isDecoupled
        ? `${config.frontend?.stackEntry?.name} + ${config.backend?.stackEntry?.name}`
        : config.stackEntry?.name || 'Proyecto';

    const language = config.isDecoupled
        ? `Frontend: ${config.frontend?.language}, Backend: ${config.backend?.language}`
        : config.language || 'No especificado';

    let content = `# ${config.projectName || 'Proyecto'}

## Stack
- **Framework:** ${stackName}
- **Lenguaje:** ${language}
${config.database ? `- **Base de datos:** ${config.database}` : ''}

## Convenciones de código
- Usa ESM imports (import/export), no CommonJS (require)
- Indentación: 4 espacios
- Comillas simples para strings, dobles para JSX/HTML attributes
- Punto y coma al final de cada sentencia
- Nombres descriptivos: camelCase para variables/funciones, PascalCase para componentes/clases
- Variables de negocio en español, código técnico en inglés

## Estructura del proyecto
`;

    if (config.isDecoupled) {
        content += `\`\`\`
${config.projectName}/
├── frontend/          → ${config.frontend?.stackEntry?.name} (${config.frontend?.language})
├── backend/           → ${config.backend?.stackEntry?.name} (${config.backend?.language})
├── docker-compose.yml → Orquesta ambos servicios${config.database ? ' + DB' : ''}
├── .env.example       → Variables de entorno requeridas
└── .ai/rules.md       → Reglas del stack para asistentes IA
\`\`\`
`;
    } else {
        content += `\`\`\`
${config.projectName}/
├── src/               → Código fuente principal
├── .env.example       → Variables de entorno requeridas
├── .ai/rules.md       → Reglas del stack para asistentes IA
└── docker-compose.yml → Contenedores de desarrollo
\`\`\`
`;
    }

    content += `
## Comandos CLI
- \`grimox list\` — Ver stacks disponibles
- \`grimox create\` — Crear nuevo proyecto
- \`grimox migrate\` — Migrar proyecto existente

## Skills de IA disponibles

Las skills están en \`.ai/skills/\` — accesibles desde cualquier LLM o IDE:

| Skill | Archivo | Cuándo usarla |
|-------|---------|---------------|
| Desarrollo autónomo | \`.ai/skills/grimox-dev.md\` | Implementar la app completa desde el scaffold |
| Migración | \`.ai/skills/grimox-migrate.md\` | Migrar a un stack moderno con plan detallado |
| Documentación | \`.ai/skills/grimox-docs.md\` | Generar PROJECT_DOCS.md completo |

### Cómo invocar según tu herramienta

- **Claude Code / Open Code**: \`/grimox-dev\`, \`/grimox-migrate\`, \`/grimox-docs\` (slash commands automáticos)
- **Cursor / Trae / Windsurf / Antigravity / Copilot**: Abre \`.ai/skills/grimox-dev.md\` y pégalo como prompt al asistente
- **GPT, Gemini, Grok, GLM, Ollama u otro LLM**: Abre el .md en \`.ai/skills/\` y úsalo como system prompt

`;

    content += buildSecuritySection(config);

    content += `## Buenas prácticas de código

- No dejar \`console.log\` en producción — usar el logger del proyecto
- Nombres descriptivos: camelCase para variables/funciones, PascalCase para componentes/clases
- Variables de negocio en español, código técnico en inglés
- Funciones pequeñas y con responsabilidad única — si una función supera 40 líneas, dividirla
- Comentar el *por qué*, no el *qué* — el código debe ser autoexplicativo

> Generado por Grimox CLI — skills en .ai/skills/ (universal) | .ai/rules.md (reglas del stack)
`;

    await writeFileSafe(join(projectPath, 'GRIMOX.md'), content);
}

// ─── Contenido canónico de cada skill ───────────────────────────────────────

const SKILL_MIGRATE = `Analiza este proyecto en profundidad para preparar una migración.

1. Lee TODOS los archivos fuente (src/, app/, lib/, etc.)
2. Identifica:
   - Arquitectura y patrones usados
   - Gestión de estado
   - Autenticación/autorización
   - Acceso a base de datos (ORM, queries raw, etc.)
   - Rutas y navegación
   - Estilos y componentes UI (CSS framework actual)
   - Integraciones externas (APIs, servicios)
   - Tests existentes
   - Problemas de seguridad

3. ANTES de generar el plan, pregúntame:
   a. ¿A qué tipo de aplicación quiero migrar? (Fullstack Integrado, Desacoplado, SPA, API, Móvil, Desktop)
   b. ¿Qué framework destino? — muestra TODOS los compatibles, recomienda uno pero NO me limites
   c. ¿Qué framework de estilos CSS? (Tailwind, Bootstrap, Material, Bulma, Sass, CSS puro/corporativo, Styled Components)
   d. ¿Qué base de datos? — muestra TODAS las opciones compatibles

4. Genera un archivo MIGRATION_PLAN.md con:
   - Análisis completo del estado actual
   - Plan de migración paso a paso
   - Para cada archivo: qué cambiar y por qué
   - Snippets before/after para cambios clave
   - Dependencias a agregar/quitar
   - Migración de estilos CSS al framework elegido
   - Scripts de migración de base de datos si aplica
   - Checklist de verificación post-migración

Sé específico — no uses pasos genéricos. Cada paso debe referenciar archivos y código real de ESTE proyecto.
IMPORTANTE: No sesgues mis opciones. Recomienda, pero siempre muestra TODAS las alternativas disponibles.
`;

const SKILL_DEV = `Eres un desarrollador full-stack autónomo. Tu trabajo es tomar este proyecto e implementar TODA la funcionalidad necesaria hasta que la app funcione en local.

## Flujo de trabajo

5 fases en orden estricto:

### Fase 1: Reconocimiento
Lee estos archivos (si existen):
1. GRIMOX.md — Convenciones, estructura, stack y reglas de seguridad
2. .ai/rules.md — Best practices del framework (o .cursorrules si no existe)
3. package.json / requirements.txt — Dependencias
4. .env.example — Variables de entorno
5. docker-compose.yml — Servicios disponibles

### Fase 2: Plan
Presenta al usuario un plan con los módulos a implementar. Espera confirmación antes de empezar.

### Fase 3: Implementación
Implementa módulo por módulo:
- Crea los archivos necesarios (modelos, servicios, controladores, componentes, rutas)
- Sigue las convenciones de GRIMOX.md y .cursorrules
- Conecta con la base de datos configurada
- Implementa autenticación si aplica
- Código en español para lógica de negocio, inglés para nombres técnicos

### Fase 4: Build → Test → Fix (loop)
Después de implementar, ejecuta:
1. Build del proyecto (npm run build / equivalente)
2. Si falla: lee el error, corrige, vuelve a compilar
3. Repite hasta que compile sin errores
4. Verifica que los endpoints/páginas principales responden

### Fase 5: Verificación
Muestra resumen: archivos creados, módulos implementados, endpoints verificados.

IMPORTANTE: No preguntes excesivamente. Lee la información disponible y actúa. Si el usuario te dijo qué construir, hazlo completo.
`;

const SKILL_DOCS = `Genera documentación técnica completa para este proyecto.

Lee todo el código fuente y genera PROJECT_DOCS.md con:

1. **Descripción general** — qué hace el proyecto, para quién
2. **Arquitectura** — diagrama ASCII de componentes y sus relaciones
3. **Stack tecnológico** — frameworks, librerías, herramientas con versiones
4. **Estructura de archivos** — tree con descripción de cada carpeta/archivo importante
5. **API Reference** — endpoints, parámetros, respuestas (si aplica)
6. **Componentes** — lista de componentes UI con sus props (si aplica)
7. **Base de datos** — schema, relaciones, índices (si aplica)
8. **Variables de entorno** — lista completa con descripción de cada una
9. **Cómo correr** — pasos para desarrollo local, testing, producción
10. **Deploy** — instrucciones de despliegue

Usa el código real del proyecto, no inventes funcionalidad que no existe.
`;

/**
 * Genera .ai/skills/ — ubicación universal visible para el usuario.
 * Cualquier LLM (Claude, GPT, Gemini, Grok, GLM, Ollama...) puede leer estos archivos.
 */
async function generateAISkills(projectPath) {
    const skillsDir = join(projectPath, '.ai', 'skills');
    await ensureDir(skillsDir);
    await writeFileSafe(join(skillsDir, 'grimox-migrate.md'), SKILL_MIGRATE);
    await writeFileSafe(join(skillsDir, 'grimox-dev.md'), SKILL_DEV);
    await writeFileSafe(join(skillsDir, 'grimox-docs.md'), SKILL_DOCS);
}

/**
 * Genera .claude/commands/ — adaptador para Claude Code y Open Code.
 * Mismo contenido que .ai/skills/ — habilita los slash commands (/grimox-dev, etc.).
 * Claude Code requiere exactamente esta ruta; es un detalle de implementación.
 */
async function generateClaudeCommands(projectPath) {
    const commandsDir = join(projectPath, '.claude', 'commands');
    await ensureDir(commandsDir);
    await writeFileSafe(join(commandsDir, 'grimox-migrate.md'), SKILL_MIGRATE);
    await writeFileSafe(join(commandsDir, 'grimox-dev.md'), SKILL_DEV);
    await writeFileSafe(join(commandsDir, 'grimox-docs.md'), SKILL_DOCS);
}
