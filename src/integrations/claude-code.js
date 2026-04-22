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
## 🚨 REGLA #1: ARRANCAR DESARROLLO

**Para arrancar el dev server:**

\`\`\`bash
npm run dev                  # uso normal
npm run dev -- -p 3100       # si el puerto 3000 está ocupado
npm run dev -- --turbo       # cualquier otro flag del framework
\`\`\`

\`grimox-dev-studio\` propaga automáticamente los flags tras \`--\` al framework.

**NUNCA uses**: \`npx next dev\`, \`next dev\`, \`vite\`, \`ng serve\`, ni ningún otro comando que arranque el dev server del framework directamente. Aunque necesites un puerto específico, usa \`npm run dev -- -p XXXX\`.

Razón: \`npm run dev\` está configurado para ejecutar \`grimox-dev-studio\` que abre un Chromium visible con overlays animados. Si saltas esto, el usuario no ve nada. Esta visibilidad es la feature core de Grimox.

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
- **Cursor / Windsurf / Antigravity / Trae**: \`@workspace sigue el flujo definido en GRIMOX.md y .ai/rules.md para desarrollar: <descripción>\`
- **GitHub Copilot (agent mode)**: \`@workspace lee .github/copilot-instructions.md y ejecuta el flujo para: <descripción>\`
- **GPT, Gemini, Grok, GLM, Ollama u otro LLM**: Abre el .md en \`.ai/skills/\` y úsalo como system prompt

### Dev Studio — browser siempre visible con animaciones

Este proyecto usa **grimox-dev-studio** (redefinición de \`npm run dev\`). Cuando arrancas el dev server, **automáticamente se abre Chromium visible** con overlays animados. Feedback visual continuo sobre cada cambio de código, sin que tengas que invocar nada adicional.

**Flujo normal de desarrollo:**

\`\`\`bash
npm run dev
# └── grimox-dev-studio (wrapper automático)
#     ├── levanta el dev server del framework
#     ├── lanza Chromium visible conectado al server
#     ├── inyecta overlays con branding Grimox
#     ├── activa file watcher sobre src/
#     └── reacciona a cambios: animaciones, navegación, errores en vivo
\`\`\`

**Durante desarrollo verás:**
- **Banner superior** con gradient animado: estado LIVE + ruta actual
- **Toasts** cuando se modifican archivos
- **Flash verde** en HMR exitoso
- **Flash rojo + overlay** si hay errores de runtime/consola/network
- **Scanline ambient** sutil (nunca parece estático)

**Importante:** cuando el dev server está corriendo, \`grimox-dev-studio\` se encarga del browser. **No lo cierres manualmente** mientras trabajas — se cerrará solo cuando detengas el dev server.

**Verificación de builds (postbuild QA):**

\`\`\`bash
npm run build
# ├── next/nuxt/vite build
# └── postbuild: grimox-qa (ejecuta flows + smoke tests contra dev server vivo)
\`\`\`

**Comandos disponibles:**

\`\`\`bash
npm run dev          # Dev Studio con browser visible + animaciones
npm run build        # build + QA automático
npm run qa           # correr flows manualmente (reusa browser abierto)
npm run start        # servidor de producción (standalone)
\`\`\`

**Universal:** el studio funciona igual en Claude Code (CLI y VSCode ext), OpenCode, Cursor, Antigravity, Trae, Copilot agent mode, Windsurf, y cualquier IDE que pueda ejecutar \`npm run dev\`.

**Editar tests:** modifica \`.grimox/qa-plan.yml\` para agregar flows específicos (auth, CRUD, formularios). El auto-discovery cubre smoke tests; los flows interactivos los declaras tú por feature.

**Primera vez:** \`postinstall\` descarga Chromium (~180MB, 1-2 min) automáticamente en \`npm install\`.

**Complementos opcionales (solo Claude Code):**
- Sub-agent \`.claude/agents/grimox-qa.md\` — QA interactivo vía Task tool para debugging dirigido.
- MCPs Playwright + Chrome DevTools en \`.mcp.json\` — herramientas de browser para el LLM.

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

const SKILL_DEV = `---
description: Desarrollo autónomo de features con browser visible y QA automático en cada build
argument-hint: <descripción del feature a implementar>
---

# Grimox Dev — desarrollo con feedback visual continuo

Eres un desarrollador full-stack autónomo. Tu trabajo es implementar el feature que pidió el usuario, con **feedback visual continuo en un browser Chromium real** que se abre automáticamente. El usuario verá cada cambio reflejado en tiempo real.

---

## 🚨 REGLA #1 — ARRANCAR EL DEV SERVER

La única forma permitida:

\`\`\`bash
npm run dev               # uso normal (puerto 3000)
npm run dev -- -p 3100    # puerto alternativo si 3000 está ocupado
\`\`\`

**JAMÁS uses:**
- ❌ \`npx next dev\` (ni con -p, ni con nada)
- ❌ \`next dev\`, \`vite\`, \`ng serve\`
- ❌ Cualquier comando que arranque el framework directamente

**Por qué**: el \`package.json\` tiene un hook \`predev\` que spawnea \`grimox-daemon\` en background. El daemon:
1. Abre Chromium visible en modo standby (gradient purple + overlays Grimox)
2. Detecta cuándo el dev server arranca en el puerto
3. Navega automáticamente a \`http://localhost:<port>\` con overlays en tiempo real
4. Muestra toasts cuando cambian archivos del proyecto

Si usas \`npx next dev\`, te saltas el hook \`predev\`, el daemon NO spawnea, el browser NO aparece. Esta visibilidad es la feature core de Grimox.

---

## 🚨 REGLA #2 — NO ocultar el browser

- ❌ No uses \`--headless\` en ningún comando
- ❌ No uses \`GRIMOX_QA_HEADLESS=1\`
- ❌ No modifiques scripts \`dev\`, \`predev\`, \`prebuild\`, \`postbuild\` del \`package.json\`
- ❌ No cierres el daemon mientras trabajas (\`grimox-daemon stop\`)

---

## 🚨 REGLA #3 — AUTONOMÍA ANTE PROMPTS GENÉRICOS

El usuario describe **dominios**, no especificaciones técnicas. Cuando escribe *"app de citas con match geográfico"*, *"SaaS de facturación"*, *"red social de fotógrafos"*, espera que TÚ (con apoyo del stack inyectado por Grimox) decidas todo lo técnico.

**Tu trabajo es inferir, no preguntar.** Con un prompt de una sola oración, debes deducir:

- **Tablas/schemas** (nombres, columnas, relaciones, índices, RLS si hay Supabase)
- **Rutas** (qué páginas necesita el MVP, jerarquía, segments dinámicos)
- **Auth** (email+password por defecto; OAuth solo si el dominio lo sugiere claramente)
- **Storage** (buckets para imágenes/archivos si el dominio los implica — ej. fotos de perfil, catálogo)
- **Features accesorias** (upload de imágenes, búsqueda, paginación, filtros — solo las que definen el MVP, no "nice-to-have")

**NO preguntes por detalles que puedas decidir tú.** Prohibido decir *"¿cuántos campos quieres en el perfil?"* o *"¿qué ORM prefieres?"*. Usa lo que ya está inyectado por Grimox (cliente Supabase SSR, Drizzle, mongoose, etc. — lo que venga con el proyecto).

**Solo pregunta al usuario cuando:**
- Falta una credencial externa que el proyecto no tiene (Stripe key, SMTP, etc.)
- Hay un conflicto de scope real (ej. el dominio implica pagos pero no hay passarela configurada)
- El MCP de DB falla y necesitas pegar SQL en otro sitio

**MVP mínimo viable**: implementa la *espina dorsal* del dominio. Para "app de citas" eso es: auth, perfil (foto + bio + ubicación), listado de candidatos cerca, like/pass, match cuando ambos dieron like. No implementes chat en tiempo real, push notifications, o features avanzadas a menos que el prompt las pida explícitamente.

## Flujo de trabajo

### Fase 1 — Reconocimiento breve

Lee solo lo necesario:
1. \`GRIMOX.md\` — stack, convenciones, reglas de seguridad
2. \`.ai/rules.md\` o \`.cursorrules\` — best practices del framework
3. \`package.json\` — scripts y deps disponibles
4. \`.mcp.json\` — **qué MCP servers tienes** (DB, filesystem, browser). Si hay uno de DB (supabase, postgres, mongodb…), **úsalo** para crear schema y seed data, no pidas al usuario que corra SQL manualmente.
5. \`.grimox/qa-plan.yml\` — plan de QA (lo editarás después)
6. \`src/lib/\`, \`src/app/\` — qué hay ya escrito (cliente de DB, middleware, helpers). **Reutiliza, no reescribas.**

### Fase 2 — Arrancar el dev server PRIMERO

Antes de escribir una sola línea de código:

\`\`\`bash
npm install   # si es la primera vez
npm run dev   # en background (run_in_background=true)
\`\`\`

Espera ~6 segundos y verifica en los logs que arrancó. El browser Chromium aparece automáticamente con los overlays Grimox Studio. Si no aparece tras 10s, reporta al usuario antes de seguir.

### 🚨 REGLA #4 — UN solo browser durante todo el proceso

El browser del daemon (Grimox Studio) es **el único** que el usuario debe ver. Esto es crítico para la experiencia.

**Para verificar rutas durante desarrollo, usa SOLO:**
- \`curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:3000/ruta\` — check rápido de HTTP status
- Lectura de logs del dev server en background (HMR, compile errors)
- Lectura de archivos del proyecto

**JAMÁS uses** (aunque estén disponibles como tools):
- ❌ Playwright MCP (\`browser_navigate\`, \`browser_click\`, etc.) — lanza su propio Chromium SIN overlays Grimox y aparece como un segundo browser para el usuario
- ❌ Chrome DevTools MCP — igual, lanza browser parásito
- ❌ Cualquier tool que spawnee un browser visible alternativo

**La validación visual es responsabilidad del postbuild**: tú implementas código → \`npm run build\` → grimox-qa corre los flows del qa-plan.yml en el mismo browser del daemon → ves exit 0 o reportas fallo. No duplicas ese trabajo abriendo browsers manuales.

**Si no hay MCP de Playwright instalado en el proyecto**: no lo eches de menos, es intencional. Confía en \`curl\` + postbuild QA.

### Fase 3 — Implementación

Implementa el feature siguiendo las convenciones del proyecto. A medida que editas:
- El daemon detecta cambios → toasts en browser
- HMR recarga la ruta afectada

No reinventes arquitectura. Si hay \`src/app/\`, agrega ahí.

### Fase 4 — Editar qa-plan.yml con cobertura adecuada al TIPO de proyecto

Un QA que solo prueba "la página carga" NO es suficiente. Pero la cobertura correcta **depende del tipo de app**. No apliques una matriz CRUD a un landing page, ni uses flows de landing en una app transaccional.

**Principio universal**: cada **interacción observable** que implementaste debe tener un flow. Si hay un botón, un form, un link, un toggle, un modal, un upload — cada uno merece al menos un flow que lo ejecute y verifique su efecto.

**Elige la matriz según la naturaleza del proyecto:**

#### A) App con auth + CRUD (blogs, todo lists, CMS, marketplaces, redes sociales, dashboards transaccionales)

Obligatorios por cada recurso (receta, todo, post, producto…):

| Operación | Flow | Por qué |
|---|---|---|
| Create happy | crea con datos válidos → aparece en la lista | valida INSERT + render |
| Create edge | intenta crear vacío → mensaje de error | valida validación de forms |
| **Create múltiple** | crea 2-3 consecutivos → los 3 aparecen en orden | detecta race conditions / keys duplicadas |
| Read/List | lista con N items → verifica primero | valida SELECT + hidratación |
| Update | edita → cambio persiste tras reload | valida UPDATE + cache invalidation |
| **Delete** (\`text_not_visible\`) | borra → desaparece de la lista + otros siguen | valida DELETE + RLS |
| Protected sin sesión | navega sin login → redirect a /login | valida middleware |
| Auth ciclo | register → login → ruta protegida → logout → redirect | valida ciclo completo |

**Regla dura**: si implementaste un botón "Borrar", debe existir un flow que lo haga click y verifique con \`text_not_visible\`. Si hay "Editar", igual. Si crear es el 80% del valor, crea **al menos 2** para detectar colisiones.

#### B) Landing / marketing (promocional, portfolios, páginas de producto)

Obligatorios:

| Chequeo | Flow |
|---|---|
| Hero visible | \`/\` → texto clave del CTA visible |
| Secciones | scroll/nav a cada sección (Features, Pricing, About, FAQ) → texto ancla presente |
| CTAs funcionan | click en cada CTA principal → verifica URL destino o modal abierto |
| Form contacto | si hay form: llenar + submit → mensaje de éxito (o validación de campos requeridos vacíos) |
| Links externos | anchors a redes sociales / demos tienen \`href\` con URL absoluta válida |
| Mobile breakpoint | opcional: \`viewport\` < 768 → menú hamburguesa visible |

**NO apliques la matriz CRUD aquí** — no hay nada que crear/borrar.

#### C) Docs site (Docusaurus, VitePress, Astro con MDX)

Obligatorios:

| Chequeo | Flow |
|---|---|
| Home de docs | \`/\` → título del docset visible |
| Navegación | sidebar → click en 3 páginas distintas → cada una carga con su título correcto |
| Búsqueda | si hay: tipear query → resultado aparece → click abre la página |
| Links internos | una página con referencias → los links cargan 200 |
| Code blocks | bloque de código visible con highlighting |

#### D) SPA puro (consume API externa o localStorage, sin backend propio)

Obligatorios:

| Chequeo | Flow |
|---|---|
| Estado inicial | app carga sin crashes → vista default renderiza |
| Interacción core | la acción principal (add/toggle/filter) funciona → UI reacciona |
| Persistencia local | si usa localStorage: añadir item → recargar → item sigue |
| API externa | si consume API: mock o espera datos → loading → datos visibles |
| Error boundary | forzar error (URL inválida, etc.) → no crashea blank page |

#### E) Dashboard read-only (analytics, monitoring, reporting)

Obligatorios:

| Chequeo | Flow |
|---|---|
| Auth + acceso | login → dashboard carga |
| Widgets visibles | cada tarjeta/chart principal tiene contenido (no spinners infinitos) |
| Filtros de fecha / dropdowns | cambiar → datos se recargan |
| Estado vacío | filtro que no devuelve datos → mensaje "sin resultados" |

### Cómo decidir

Al final de Fase 3 pregúntate: *¿este proyecto cabe en A, B, C, D o E?* Escribe los flows según la matriz que elegiste, **no copies la de arriba**. Si no estás seguro, predomina el **principio universal**: cada interacción observable = un flow.

**Cuenta los flows antes de cerrar Fase 4**: bajo-la-matriz-A típica: 8-12 flows. Matriz B (landing): 3-6 flows. Matriz C/D: 4-8 flows. Si tienes menos de lo esperado, falta cobertura.

Ejemplos de \`.grimox/qa-plan.yml\` según matriz:

**Matriz A (CRUD con auth)** — app de recetas:

\`\`\`yaml
flows:
  - name: "Crear receta vacía muestra error"
    url: /recipes/new
    steps:
      - click: 'button[type=submit]'
      - assert: { text_visible: "obligatorio" }

  - name: "Crear 3 recetas consecutivas aparecen en orden"
    steps:
      - login: { as: demo }
      - goto: /recipes/new
      - fill: { selector: '#title', value: 'Arepa' }
      - fill: { selector: '#ingredientes', value: 'maíz, agua, sal' }
      - fill: { selector: '#pasos', value: 'mezclar y asar' }
      - click: 'button[type=submit]'
      - assert: { text_visible: "Arepa" }
      - goto: /recipes/new
      - fill: { selector: '#title', value: 'Sancocho' }
      - fill: { selector: '#ingredientes', value: 'pollo, yuca' }
      - fill: { selector: '#pasos', value: 'hervir' }
      - click: 'button[type=submit]'
      - assert: { text_visible: "Sancocho" }
      - assert: { text_visible: "Arepa" }      # la primera sigue ahí

  - name: "Borrar receta la remueve del feed"
    steps:
      - login: { as: demo }
      - goto: /feed
      - click: 'button:has-text("Borrar"):near(:text("Sancocho"))'
      - assert: { text_not_visible: "Sancocho" }

  - name: "Ruta protegida sin login redirige"
    url: /feed
    steps:
      - assert: { url_contains: /login }
\`\`\`

**Matriz B (landing page)** — portfolio, página de producto:

\`\`\`yaml
flows:
  - name: "Hero + CTA principal visibles"
    url: /
    steps:
      - assert: { text_visible: "Bienvenido" }
      - assert: { element_visible: "a.cta-primary" }

  - name: "Nav a sección Pricing"
    url: /
    steps:
      - click: 'a[href="#pricing"]'
      - assert: { text_visible: "Planes" }

  - name: "Form de contacto envía"
    url: /#contacto
    steps:
      - fill: { selector: '#email', value: 'a@b.com' }
      - fill: { selector: '#message', value: 'Hola' }
      - click: 'button[type=submit]'
      - assert: { text_visible: "gracias" }

  - name: "Form vacío muestra error"
    url: /#contacto
    steps:
      - click: 'button[type=submit]'
      - assert: { text_visible: "requerido" }
\`\`\`

**Matriz C (docs site)** — para sitios de documentación:

\`\`\`yaml
flows:
  - name: "Home de docs carga"
    url: /
    steps:
      - assert: { text_visible: "Getting Started" }

  - name: "Navegación entre páginas"
    url: /docs/intro
    steps:
      - click: 'a:has-text("Installation")'
      - assert: { url_contains: /installation }
      - assert: { text_visible: "npm install" }
\`\`\`

**Credenciales de test**: el macro \`login: { as: demo }\` usa \`auth.testUser\` del qa-plan. Si el proyecto no tiene usuario seed con ese email, crea uno en el MCP de la DB antes de correr el QA (o pídele al usuario real uno), y actualiza \`auth.testUser\` con esas credenciales.

### Fase 5 — Build + QA automático

\`\`\`bash
npm run build
\`\`\`

El pipeline hace todo automáticamente:
- **prebuild**: \`grimox-daemon kill-dev\` libera puerto 3000 (resuelve conflicto dev↔build en Windows) + spawnea daemon
- **build**: \`next build\` compila limpio
- **postbuild**: \`grimox-qa --dynamic --auto-server\` arranca production server temporal en puerto 3100 y corre QA contra ahí — el dev server puede quedar muerto, no importa

**Exit codes:**
- \`0\` → todo pasa → reporta "funcionando"
- \`1\` → fallo → lee evidencia en \`.grimox/qa-evidence/\`, corrige, re-ejecuta \`npm run build\`
- \`2\` → 3 intentos fallidos → DETENTE y reporta al usuario

---

## Señales de que estás haciendo MAL el flujo

- ❌ Usaste \`npx next dev\` → browser no aparece
- ❌ Reportaste "funcionando" sin ejecutar \`npm run build\`
- ❌ Build dio exit code ≠ 0 y seguiste adelante
- ❌ No editaste \`qa-plan.yml\` para el feature nuevo
- ❌ Modificaste scripts del package.json → sabotaje del pipeline

Termina cuando exit code de \`npm run build\` sea \`0\` y el browser muestre el feature funcionando.
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
