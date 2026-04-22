# Grimox CLI

> 🇬🇧 [Read in English](PROJECT_DOCS.md)

> CLI inteligente para crear y migrar aplicaciones modernas con stack completamente configurado, validando buenas prácticas de desarrollo para que las aplicaciones sean compactas y altamente seguras.

**Creado por Alexander (Alex)** — Ingeniero en Electrónica y Desarrollador Full-Stack

---

## Descripción General

| Campo | Valor |
|-------|-------|
| **Nombre** | grimox |
| **Tipo** | Herramienta CLI (`cli-tools`) |
| **Framework** | Node.js + Commander.js |
| **Lenguaje** | JavaScript (ESM) |
| **UI** | N/A (terminal) |
| **Base de datos** | N/A |
| **Versión** | 0.1.0 |
| **Licencia** | MIT |
| **Fecha de creación** | 2026-03-19 |

---

## Arquitectura

Herramienta de línea de comandos construida con **Node.js** + **Commander.js** usando ESM modules.

**Capas principales:**
- **Entry point**: `bin/grimox.js` — shebang script que invoca el CLI
- **CLI setup**: `src/cli.js` — registro de comandos con Commander (`create`, `migrate`, `list`)
- **Commands**: `src/commands/` — un archivo por comando, cada uno retorna una instancia de `Command`
- **Core**: `src/core/` — motores de ejecución (scaffolding, inyección de features, migración, detección de proyectos, detección y comunicación con LLMs, análisis inteligente de código)
- **Registry**: `src/registry/` — catálogos declarativos de stacks, bases de datos, features, estilos CSS y rutas de migración
- **Prompts**: `src/prompts/` — flujos interactivos con `@clack/prompts` para creación y migración
- **Injectors**: `src/injectors/` — módulos que generan archivos de features (Docker, CI/CD, AI Skills, MCP, seguridad, UI, database)
- **Integrations**: `src/integrations/` — generadores de integraciones IDE (Claude Code, Cursor, Windsurf, Antigravity, Trae)
- **Utils**: `src/utils/` — helpers compartidos (logging, filesystem, validación, git, constantes)

**Flujo de ejecución:**

```
bin/grimox.js
  → src/cli.js (Commander setup + banner)
     → src/commands/create.js
        → src/prompts/create-prompts.js (flujo interactivo)
        → src/core/template-engine.js (scaffold: local → remoto → mínimo)
        → src/core/feature-injector.js (inyección lazy de features)
           → src/injectors/*.js (Docker, CI/CD, MCP, etc.)
           → src/integrations/index.js (GRIMOX.md, .ai/skills/, .ai/rules.md + adaptadores IDE)
     → src/commands/migrate.js
        → src/core/llm-detector.js (verificar LLM disponible)
        → src/core/llm-client.js (comunicación con LLM seleccionado)
        → src/core/project-detector.js (analizar proyecto existente)
        → src/core/code-analyzer.js (análisis inteligente de código con LLM)
        → src/prompts/migrate-prompts.js (flujo interactivo)
        → src/core/migration-engine.js (generar/aplicar plan)
     → src/commands/list.js
        → src/registry/stacks.js + databases.js (mostrar catálogo)
```

---

## Tech Stack

| Categoría | Tecnología | Versión/Notas |
|-----------|-----------|---------------|
| Runtime | Node.js | >= 18.0.0 |
| Lenguaje | JavaScript | ESM (`"type": "module"`) |
| CLI Framework | Commander.js | ^13.0.0 — parsing de argumentos y subcomandos |
| Prompts interactivos | @clack/prompts | ^0.10.0 — TUI con spinners, selects, confirms |
| Template cloning | giget | ^2.0.0 — clonación limpia de repos GitHub |
| Colores terminal | picocolors | ^1.1.0 — output con colores y estilos |
| Testing | Vitest | ^3.0.0 |
| Linting | ESLint | `npm run lint` |

---

## Estructura del Proyecto

```
grimox/
├── bin/
│   └── grimox.js                  # Entry point (#!/usr/bin/env node)
├── src/
│   ├── index.js                   # Re-export de cli.js
│   ├── cli.js                     # Setup de Commander (banner + 3 comandos)
│   ├── commands/
│   │   ├── create.js              # Comando: crear nuevo proyecto
│   │   ├── migrate.js             # Comando: migrar proyecto existente
│   │   └── list.js                # Comando: listar stacks disponibles
│   ├── core/
│   │   ├── template-engine.js     # Motor de scaffolding (local → remoto → mínimo)
│   │   ├── feature-injector.js    # Orquestador lazy de inyección de features + IDE integrations
│   │   ├── project-detector.js    # Detector de stack en proyecto existente
│   │   ├── migration-engine.js    # Motor de migración (plan + backup + apply)
│   │   ├── llm-detector.js        # Detector de LLMs disponibles (cloud, local, IDE)
│   │   ├── llm-client.js          # Cliente de comunicación con LLMs (Claude, GPT, Gemini, etc.)
│   │   └── code-analyzer.js       # Análisis inteligente de código con LLM (patrones, codemods)
│   ├── registry/
│   │   ├── index.js               # Export central del registry
│   │   ├── stacks.js              # Catálogo maestro: 12 categorías, 25+ stacks
│   │   ├── databases.js           # 8 bases de datos soportadas
│   │   ├── features.js            # 7 features inyectables
│   │   ├── styles.js              # 7 frameworks CSS (Tailwind, Bootstrap, Material, etc.)
│   │   ├── migrations.js          # Rutas de migración (legacy → moderno)
│   │   └── migration-compatibility.js # Reglas de compatibilidad
│   ├── prompts/
│   │   ├── create-prompts.js      # Flujo interactivo de creación
│   │   ├── migrate-prompts.js     # Flujo interactivo de migración
│   │   └── shared-prompts.js      # Prompts reutilizables (DB, lenguaje, features, board)
│   ├── injectors/
│   │   ├── docker.js              # Genera Dockerfile + docker-compose.yml
│   │   ├── cicd.js                # Genera .github/workflows/ci.yml
│   │   ├── ai-skills.js           # Genera .ai/rules.md + .cursorrules + .github/copilot-instructions.md
│   │   ├── mcp-config.js          # Genera configuración de servidores MCP
│   │   ├── security.js            # Genera .env.example + .env
│   │   ├── ui-styling.js          # Genera config de Tailwind CSS v4 + component library
│   │   └── database.js            # Genera archivos de conexión a DB
│   ├── integrations/
│   │   ├── index.js               # Orquestador de integraciones IDE
│   │   ├── claude-code.js         # Genera GRIMOX.md + .ai/skills/ (universal) + .claude/commands/ (adaptador Claude Code)
│   │   └── cursor.js              # Genera .ai/rules.md (universal) + .cursorrules + .github/copilot-instructions.md
│   └── utils/
│       ├── constants.js           # VERSION, CLI_NAME, TEMPLATES_ORG, GITHUB_BASE
│       ├── logger.js              # Logger con colores (info, success, warn, error)
│       ├── fs-helpers.js          # ensureDir, writeFileSafe, readJson, exists, copyDir
│       ├── git-helpers.js         # cloneTemplate (giget) + initGit
│       └── validation.js          # Validación de nombre de proyecto
├── templates/                     # Templates locales por stack (nextjs-15, react-spa, etc.)
├── .claude/
│   └── skills/
│       ├── grimox-migrate/        # Skill de migración profunda (análisis + plan)
│       ├── grimox-dev/            # Skill de desarrollo autónomo (one-shot)
│       └── grimox-docs/           # Skill de documentación técnica
├── package.json
├── .gitignore
├── PROJECT_DOCS.md                # Documentación técnica completa
├── CONTEX.MD                      # Documento de visión del proyecto
└── EXAMPLES.md                    # Ejemplos de uso (49 ejemplos)
```

---

## Getting Started

### Requisitos previos

- Node.js >= 18

### Instalación

```bash
npm install
```

### Desarrollo

```bash
node bin/grimox.js
```

### Link global (para usar `grimox` como comando en cualquier directorio)

```bash
npm link
```

### Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Publicar

```bash
npm publish
```

---

## Comandos

| Comando | Opciones | Descripción | Ejemplo |
|---------|----------|-------------|---------|
| `grimox create [name]` | `--yes` | Crear un nuevo proyecto con stack moderno | `grimox create mi-app` |
| `grimox migrate` | `--apply`, `--plan`, `--frontend <path>`, `--backend <path>` | Migrar un proyecto existente a un stack moderno | `grimox migrate --plan` |
| `grimox list` | — | Mostrar todos los stacks y frameworks disponibles | `grimox list` |

### Opciones Globales

| Flag | Alias | Descripción |
|------|-------|-------------|
| `--version` | `-v` | Mostrar versión (0.1.0) |
| `--help` | `-h` | Mostrar ayuda |

---

### `grimox create [name]`

Flujo interactivo que guía al desarrollador para configurar un nuevo proyecto:

1. **Nombre** del proyecto (o pasado como argumento)
2. **Tipo de aplicación** — seleccionar de 12 categorías
3. **Framework** específico del tipo seleccionado
4. **Lenguaje** — auto-detectado o seleccionado (JS/TS, Java/Kotlin, etc.)
5. **Base de datos** — si el stack lo soporta
6. **Board** — si es proyecto IoT (ESP32, Uno, Mega, etc.)
7. **Features** — confirmar o personalizar features habilitadas
8. **Confirmación** — resumen completo antes de crear

El flag `--yes` salta las preguntas y usa la configuración por defecto.

**Estrategia de templates:**
- Intenta clonar desde `github:grimox-templates/[repo-name]` via giget
- Si el template remoto no existe, genera una estructura base local (package.json + README + src/)

### `grimox migrate`

Migra proyectos legacy a stacks modernos usando un LLM. Un único flujo AI-powered: analiza el código real del proyecto, genera un plan detallado (`MIGRATION_PLAN.md`) y guía la ejecución paso a paso.

**LLMs soportados (detección automática):**

| Tipo | Proveedores |
|------|------------|
| Cloud | Claude (Anthropic), GPT/Codex (OpenAI), Gemini (Google), Grok (xAI), GLM (Zhipu), DeepSeek |
| Local | Ollama, LM Studio, Jan, llama.cpp |
| IDE | Cursor IDE, GitHub Copilot |

La detección es automática: busca API keys en variables de entorno y `.env`, pinga servicios locales, y detecta IDEs con LLM integrado. Si hay múltiples LLMs, el usuario elige cuál usar. Si no hay ninguno disponible, el CLI lo indica y bloquea la migración.

| Flag | Descripción |
|------|-------------|
| `--plan` | Solo generar `MIGRATION_PLAN.md` sin aplicar cambios |
| `--apply` | Aplicar migración automáticamente (crea backup en `.grimox-backup/`) |
| `--frontend <path>` | Ruta al frontend en proyecto desacoplado |
| `--backend <path>` | Ruta al backend en proyecto desacoplado |

**`grimox migrate` vs la skill `grimox-migrate` — dos puertas de entrada, mismo flujo:**

`grimox migrate` y la skill `grimox-migrate` ejecutan el mismo proceso de migración. La diferencia es el punto de entrada:

| Punto de entrada | Cuándo usarlo |
|-----------------|---------------|
| `grimox migrate --plan` | Quieres generar el plan desde la terminal — el CLI detecta y llama al LLM automáticamente |
| `grimox migrate --apply` | Quieres aplicar los cambios del plan generado (crea backup automático antes) |
| Skill `grimox-migrate` (Claude Code: `/grimox-migrate`) | Ya tienes Claude Code u Open Code abierto en el proyecto |
| Skill `grimox-migrate` (otros LLMs/IDEs) | Abrir `.ai/skills/grimox-migrate.md` como prompt en GPT, Gemini, Grok, GLM, Cursor, Ollama, etc. |

**Ambos usan un LLM.** La diferencia es quién orquesta: con `grimox migrate`, el CLI detecta el LLM disponible y lo invoca en segundo plano — tú solo corres el comando en terminal. Con la skill, eres tú quien abre el LLM o IDE y lo usa directamente con el archivo de la skill como instrucción. El resultado — análisis del código real, `MIGRATION_PLAN.md` detallado, guía de ejecución — es el mismo en ambos casos.

### `grimox list`

Muestra un árbol visual con todos los stacks, frameworks y bases de datos disponibles en la terminal con colores.

---

## Stacks Soportados

### Por categoría

| Categoría | Frameworks |
|-----------|-----------|
| Web Fullstack Integrado | Next.js 15, Nuxt 4, SvelteKit |
| Web Fullstack Desacoplado | Combinación dinámica frontend + backend |
| Web Frontend (SPA) | React + Vite, Vue.js + Vite, Angular, Svelte + Vite |
| API / Backend | FastAPI, NestJS, Hono, Fastify, Spring Boot |
| App Móvil | React Native (Expo), Flutter, Flet |
| App Desktop | Tauri, Electron, Flet |
| IoT / Embebido | Arduino, PlatformIO, ESP-IDF, MicroPython |
| Data Analytics / IA | FastAPI + ML Stack |
| Documentación | Astro (Starlight), Docusaurus, VitePress |
| Herramienta CLI | Node.js + Commander |

### Bases de datos soportadas

| Base de datos | Tipo | Descripción |
|--------------|------|-------------|
| Supabase | SQL | PostgreSQL + Auth + Storage + Realtime |
| PostgreSQL | SQL | Base de datos relacional robusta |
| Firebase | NoSQL | Firestore + Auth + Storage (Google) |
| MongoDB | NoSQL | Base de datos orientada a documentos |
| Oracle SQL | SQL | Base de datos empresarial Oracle |
| Turso | SQL | SQLite distribuido para edge |
| Insforge | SQL | Base de datos moderna (insforge.dev) |
| Redis | Key-Value | Cache, sessions y mensajería en memoria |

### Features inyectables

| Feature | ID | Descripción | Por defecto |
|---------|-----|-------------|-------------|
| Docker | `docker` | Dockerfile + docker-compose.yml | Habilitado |
| CI/CD | `cicd` | GitHub Actions (lint, test, build, deploy) | Habilitado |
| AI Skills | `ai-skills` | .ai/rules.md (universal) + .cursorrules + .github/copilot-instructions.md | Habilitado |
| AI Agents | `ai-agents` | `.claude/agents/grimox-qa.md` — agente opcional de inspección QA | Habilitado |
| MCP Config | `mcp` | Configuración de servidores MCP (solo DB; MCPs de browser intencionalmente excluidos — ver sección Grimox Dev Studio) | Habilitado |
| **QA CLI** | `qa-cli` | **CLI `grimox-qa` + `grimox-daemon` en tarball `.vendor/`, `qa-plan.yml`, scripts `dev:fresh`/`build:fresh`, QA automático en postbuild** | Habilitado (solo stacks web) |
| Seguridad | `security` | .env validation + CSP + CORS + headers (vars con prefijo correcto por framework: `NEXT_PUBLIC_*` / `PUBLIC_*` / `VITE_*`) | Habilitado |
| UI/UX | `ui-styling` | Tailwind CSS v4 + component library + dark mode (solo web) | Habilitado |
| Database Config | `database` | Conexión DB, ORM config, schemas, .env vars (con prefijos correctos por framework para vars expuestas al cliente) | Habilitado |

### Grimox Dev Studio (feature `qa-cli`)

Para stacks web (Next.js, Nuxt, SvelteKit, SPAs basadas en Vite, Astro, sitios de docs, Electron/Tauri), este feature instala un **daemon de browser persistente + pipeline de QA visual determinístico**:

**Componentes instalados:**
- CLI `grimox-qa` (distribuido como tarball `.vendor/grimox-qa.tgz`, resuelto con `file:.vendor/...` sin pasar por npm registry)
- `grimox-daemon` — proceso en background que administra un browser Chromium persistente con overlays Grimox Studio
- `.grimox/qa-plan.yml` — configuración de flows de QA
- `.grimox/config.yml`, `.grimox/.gitignore`, `.grimox/README.md`

**Scripts inyectados en `package.json`:**

| Script | Propósito |
|---|---|
| `dev` | dev nativo del framework (`next dev`, `vite`, etc.) — sin cambios |
| `build` | build nativo del framework — sin cambios |
| `postinstall` | `grimox-banner && grimox-daemon spawn-detached` — muestra banner de bienvenida y spawnea daemon tras `npm install` |
| `predev` | `grimox-daemon spawn-detached \|\| true` — asegura daemon vivo antes de `npm run dev` |
| `prebuild` | `grimox-daemon kill-dev && grimox-daemon spawn-detached \|\| true` — libera puerto 3000 (resuelve `EPERM` en `.next/trace` en Windows) + asegura daemon vivo antes del build |
| `postbuild` | `grimox-qa --dynamic --auto-server` — QA automatizado contra production server temporal en puerto 3100 |
| `qa` | `grimox-qa --dynamic` — QA manual reusando el daemon |
| `daemon:status` | `grimox-daemon status` — estado del daemon (vivo, endpoint CDP, browser) |
| `daemon:stop` | `grimox-daemon stop` — detiene daemon graciosamente |
| `daemon:demo` | `grimox-daemon demo` — prueba rápida del mecanismo daemon+browser |
| `daemon:purge` | `grimox-daemon purge-all` — mata TODOS los daemons de Grimox + chromiums de Playwright + zombies de `next start/dev` |
| `dev:fresh` | `grimox-daemon purge-all && npm run dev` — garantía de estado limpio antes del dev |
| `build:fresh` | `grimox-daemon purge-all && npm run build` — garantía de estado limpio antes del build |

**Comandos del CLI del daemon (también disponibles standalone con `npx grimox-daemon <cmd>`):**

| Comando | Comportamiento |
|---|---|
| `start --standby` | Arranque en foreground con browser mostrando splash Grimox Studio desde el segundo 0 |
| `spawn-detached` | Spawn en background. Idempotente: preserva daemon existente si vive con browser OK; respawn si el browser murió; además auto-purga daemons foráneos (otros proyectos) y zombies de `next start/dev` del sistema |
| `stop` | Shutdown graceful vía IPC |
| `status` | Reporte JSON (`alive`, `baseUrl`, `cdp` con `port` y `endpoint`, `takenOver`) |
| `kill-dev` | Mata procesos escuchando en puertos dev comunes (3000, 3001, 3100, 4200, 5173, 4321, 8080) |
| `demo` | Mata daemon previo + arranca en modo standby para verificación rápida |
| `purge-all` | Kill global de todos los daemons de Grimox, chromiums de Playwright (root, no workers `--type=*`) y zombies de `next start/dev` |

**Por qué `grimox-qa --dynamic --auto-server` importa:**

- `--dynamic` — se conecta vía CDP (endpoint HTTP) al browser del daemon y reusa su page para smoke tests y flows. Resultado: un solo browser visible durante todo el ciclo dev→build→QA, no múltiples ventanas abriendo/cerrando.
- `--auto-server` — si `baseUrl` no responde (típico tras el `prebuild` que mata el dev server para liberar `.next/`), arranca automáticamente un production server en puerto 3100 (`npx next start -p 3100` para Next, `nuxt preview` para Nuxt, `node build/index.js` para SvelteKit, etc.), corre QA contra él, y lo mata al salir.

**Tipos de asserts soportados en `qa-plan.yml`:**

`text_visible`, `text_not_visible`, `element_visible`, `element_not_visible`, `url_contains`, `redirect_to`, `status`, `no_console_errors`. Tipos de step: `goto`, `click`, `fill`, `login` (macro), `wait`.

### Integraciones de IA generadas automáticamente

Además de las features, `grimox create` siempre genera integraciones para cualquier LLM o IDE:

| Archivo generado | Propósito |
|-----------------|-----------|
| `GRIMOX.md` | Contexto universal del proyecto — cualquier LLM puede leerlo (Claude, GPT, Gemini, Grok, GLM...) |
| `.ai/skills/grimox-dev.md` | Skill de desarrollo autónomo — ubicación canónica accesible desde cualquier LLM |
| `.ai/skills/grimox-migrate.md` | Skill de migración — ubicación canónica accesible desde cualquier LLM |
| `.ai/skills/grimox-docs.md` | Skill de documentación — ubicación canónica accesible desde cualquier LLM |
| `.claude/commands/grimox-*.md` | Adaptador Claude Code / Open Code — activa las skills como slash commands |
| `.ai/rules.md` | Reglas del framework — canónico, accesible desde cualquier LLM o IDE |
| `.cursorrules` | Adaptador: Cursor, Windsurf, Antigravity, Trae (replica `.ai/rules.md`) |
| `.github/copilot-instructions.md` | Adaptador: GitHub Copilot (replica `.ai/rules.md`) |

Las skills en `.ai/skills/` son archivos Markdown estándar. Claude Code y Open Code las activan como slash commands vía `.claude/commands/`; con cualquier otro LLM se abren directamente como prompt. Generadas via `src/integrations/claude-code.js` + `src/integrations/cursor.js`.

### Estilos CSS disponibles

| Framework CSS | Disponible para |
|--------------|----------------|
| Tailwind CSS v4 | Todos los stacks web |
| Bootstrap 5 | Todos los stacks web |
| Angular Material | Angular |
| Bulma | Todos los stacks web |
| Sass/SCSS | Todos los stacks web |
| CSS puro | Todos los stacks web |
| Styled Components | React, Next.js |

---

## Rutas de Migración

| Proyecto Legacy | Stack Recomendado | Alternativas |
|----------------|-------------------|-------------|
| Create React App | React + Vite | Next.js 15 |
| React Legacy (<18) | Next.js 15 | React + Vite |
| Vue 2 | Nuxt 4 | Vue.js + Vite |
| Angular Legacy (<17) | Angular 19 | — |
| Express | Hono | Fastify, NestJS |
| jQuery | Next.js 15 | React + Vite, Vue.js + Vite |
| PHP Legacy | Next.js 15 | Nuxt 4, FastAPI |
| Django | FastAPI | — |
| Flask | FastAPI | — |

---

## Skills de IA Integradas

Grimox CLI incluye 3 skills para asistencia inteligente con cualquier LLM o IDE. Las skills viven en **`.ai/skills/`** (ubicación canónica, accesible desde cualquier LLM) y se replican automáticamente en `.claude/commands/` (adaptador para slash commands en Claude Code y Open Code).

| Skill | Claude Code / Open Code | Otros LLMs | Ubicación canónica | Propósito |
|-------|------------------------|------------|--------------------|-----------|
| `grimox-migrate` | `/grimox-migrate` | Abrir `.ai/skills/grimox-migrate.md` como prompt | `.ai/skills/grimox-migrate.md` | Análisis profundo de código y plan de migración archivo por archivo |
| `grimox-dev` | `/grimox-dev` | Abrir `.ai/skills/grimox-dev.md` como prompt | `.ai/skills/grimox-dev.md` | Desarrollo autónomo one-shot: implementa, ejecuta, debugea y verifica hasta que funcione |
| `grimox-docs` | `/grimox-docs` | Abrir `.ai/skills/grimox-docs.md` como prompt | `.ai/skills/grimox-docs.md` | Generación y actualización de documentación técnica |

### Skill: `grimox-migrate` — Migración con IA

Único flujo de migración de Grimox. Analiza el código real del proyecto con un LLM, genera un plan detallado y guía la ejecución paso a paso.

**Flujo de 4 fases:**

1. **Análisis Profundo** — Estructura del proyecto, árbol de archivos, patrones de código (class vs functional, CJS vs ESM, Redux/Vuex/Pinia, JWT/sessions, Prisma/Mongoose/SQLAlchemy), dependencias categorizadas (migrable/reescribible/eliminable/mantenible), integraciones externas (Stripe, SendGrid, Cloudinary), variables de entorno, testing
2. **Selección de Stack Destino** — Valida compatibilidad con la matriz de Grimox, recomienda basado en el análisis, carga la referencia específica del path
3. **Generación de MIGRATION_PLAN.md** — Inventario archivo por archivo, 10 fases ordenadas por dependencias, cada paso con comando exacto, snippet de transformación, verificación y rollback
4. **Guía de Ejecución** — Quick-start (5 comandos), checklist resumido, troubleshooting

**Estructura de la skill:**

```
.ai/skills/grimox-migrate.md          ← Flujo principal (accesible desde cualquier LLM/IDE)
.claude/skills/grimox-migrate/        ← Referencias extendidas (cargadas bajo demanda)
└── references/
    ├── migration-paths-frontend.md   ← CRA→Vite, React→Next, Vue2→Nuxt, Angular→19
    ├── migration-paths-backend.md    ← Express→Hono, Flask→FastAPI, Django→FastAPI, Spring Boot
    ├── migration-paths-other.md      ← jQuery/PHP→Next, Electron→Tauri, Mobile, IoT
    ├── stacks-catalog.md             ← Catálogo de todos los stacks Grimox
    └── plan-template.md              ← Plantilla del MIGRATION_PLAN.md
```

**Progressive Disclosure:** El archivo principal contiene el flujo completo. Las guías por ruta de migración están en `references/` — el LLM solo carga la referencia relevante al path detectado, optimizando el uso de contexto.

### Skill: `/grimox-dev` — Desarrollo Autónomo One-Shot

Después de crear un proyecto con `grimox create` (o migrar con `grimox-migrate`), esta skill implementa TODO el proyecto de forma autónoma en un ciclo Build→Test→Fix hasta que funcione en local.

**Flujo de 6 fases:**

1. **Reconocimiento** — Lee GRIMOX.md, .ai/rules.md, manifiestos. Detecta stack, DB, features, y estado del proyecto (nuevo, existente, post-migración, legacy)
2. **Planificación** — Genera `GRIMOX_DEV_PLAN.md` con fases de desarrollo ordenadas por dependencias
3. **Implementación** — Escribe todo el código fase por fase (esqueleto primero, detalle después)
4. **Ciclo Build→Test→Fix** — Instalar → Build → Dev server → curl → WebFetch por fase (sanidad rápida) → Fix errores → Repetir (max 5 intentos por error)
4.5. **Testing Visual con Browser** *(solo proyectos web con UI)* — Verifica la app con `agent-browser` (instalado automáticamente si falta): snapshot de cada ruta, interacción con formularios y botones, detección de errores de renderizado e hydration
5. **Verificación Final** — Build production + todas las rutas + Docker (si aplica) + reporte

**Detección de conflictos con migración:**

La skill detecta automáticamente si el proyecto está en proceso de migración o es legacy:

| Situación | Comportamiento |
|-----------|---------------|
| MIGRATION_PLAN.md con pasos pendientes | Ofrece 3 opciones: ejecutar migración primero, ignorar, o cancelar |
| Proyecto legacy sin migrar (jQuery, PHP, Vue 2, etc.) | Recomienda ejecutar `grimox-migrate` primero |
| MIGRATION_PLAN.md completado | Trata como proyecto migrado, procede al desarrollo |
| Proyecto nuevo (post `grimox create`) | Implementación completa desde cero |

**Orden de desarrollo según tipo:**

| Tipo | Orden |
|------|-------|
| API/Backend | DB → Modelos → Rutas → Middleware → Auth → Tests |
| Web Fullstack | DB → Modelos → API → Layout → Páginas → Componentes → Auth |
| Desacoplado | Backend completo primero → luego Frontend consume la API |
| Mobile | Navegación → Screens → Componentes → Estado → API → Auth |

**Estructura de la skill:**

```
.ai/skills/grimox-dev.md              ← Flujo principal (accesible desde cualquier LLM/IDE)
.claude/skills/grimox-dev/            ← Referencias extendidas (cargadas bajo demanda)
└── references/
    ├── dev-commands-by-stack.md      ← Comandos install/dev/build/test/puerto por stack
    ├── dev-phases.md                 ← Fases de desarrollo por tipo de proyecto
    ├── dev-verification.md           ← Verificación (curl, WebFetch, agent-browser, Docker) por stack
    └── dev-error-patterns.md        ← Patrones de error comunes y sus fixes
```

**GRIMOX_DEV_PLAN.md como estado persistente:** Si la conversación se interrumpe, una nueva sesión puede leer este archivo y continuar exactamente donde quedó. El nombre evita conflicto con MIGRATION_PLAN.md.

---

## Ejemplos de Uso por Propósito

### `grimox list` — Ver todo lo disponible

```bash
grimox list
```

Muestra en terminal un árbol con colores de las 12 categorías, sus frameworks, lenguajes y las 8 bases de datos soportadas. Útil para explorar opciones antes de crear.

---

### Web Fullstack Integrado — CRM, dashboards, SaaS

Un solo framework que incluye frontend + backend + SSR + API routes.

```bash
grimox create crm-lab
```

```
  🔮 Grimox CLI v0.1.0

  ◆ ¿Qué tipo de aplicación necesitas?
  │ ● Web Fullstack Integrado    ← Un solo framework con SSR + API + DB
  │
  ◆ Elige el framework:
  │ ● Next.js 15                 ← React + SSR + App Router + Server Actions
  │   Nuxt 4                       Vue + SSR + Nitro server
  │   SvelteKit                    Svelte + SSR + Server Endpoints
  │
  ℹ Auto: TypeScript (App Router, Server Actions)
  ℹ Auto: Tailwind CSS v4 + shadcn/ui
  │
  ◆ ¿Base de datos?
  │ ● Supabase                   ← PostgreSQL + Auth + Storage + Realtime
  │   PostgreSQL                   Base de datos relacional robusta
  │   Firebase                     Firestore + Auth + Storage (Google)
  │   MongoDB                      Base de datos NoSQL orientada a documentos
  │   Turso                        SQLite distribuido para edge
  │   Insforge                     Base de datos moderna (insforge.dev)
  │   Redis                        Cache, sessions y mensajería en memoria
  │   Sin base de datos
  │
  ◆ Stack completo configurado:
  │
  │   📦 crm-lab/
  │   ├── Framework:  Next.js 15 (TypeScript)
  │   ├── Database:   supabase
  │   ├── Estilos:    Tailwind CSS v4 + shadcn/ui + Dark Mode
  │   ├── Docker + docker-compose
  │   ├── CI/CD (GitHub Actions)
  │   ├── IA: GRIMOX.md + .ai/skills/ + .ai/rules.md + adaptadores
  │   ├── MCP Config
  │   ├── Seguridad (.env validation + headers)
  │   ├── UI/UX (Tailwind + component lib + dark mode)
  │   └── Database config
  │
  ◆ ¿Crear proyecto?
  │ ● Sí, crear proyecto
  │   Personalizar (quitar/agregar features)
  │   Cancelar

  ╭───────────────────────────────────────────────╮
  │  ✔ Proyecto listo para desarrollar            │
  │                                               │
  │  cd crm-lab                                   │
  │  npm install                                  │
  │  npm run dev                                  │
  ╰───────────────────────────────────────────────╯
```

**Lo que genera:**

```
crm-lab/
├── app/                    # App Router (pages, layouts, API routes)
├── components/             # Componentes React
├── lib/                    # Supabase client, utils
├── .ai/
│   ├── rules.md            # Best practices Next.js (canónico, cualquier LLM)
│   └── skills/             # grimox-dev.md, grimox-migrate.md, grimox-docs.md
├── .claude/commands/       # Adaptador Claude Code / Open Code (slash commands)
├── .cursorrules            # Adaptador: Cursor, Windsurf, Antigravity, Trae
├── .github/
│   ├── workflows/ci.yml
│   └── copilot-instructions.md  # Adaptador: GitHub Copilot
├── GRIMOX.md               # Contexto universal (cualquier LLM)
├── Dockerfile              # Build multi-stage
├── docker-compose.yml      # App + servicios
├── .env.example            # SUPABASE_URL, SUPABASE_ANON_KEY, etc.
└── package.json
```

---

### Web Fullstack Desacoplado — Frontend + Backend separados

Monorepo con frontend SPA y backend API como servicios independientes.

```bash
grimox create mi-saas
```

```
  ◆ ¿Qué tipo de aplicación necesitas?
  │ ● Web Fullstack Desacoplado  ← Frontend SPA + Backend como servicios separados

  ◆ Elige el framework frontend:
  │ ● React + Vite               ← SPA con React 19 + Vite
  │
  ◆ ¿Lenguaje?
  │ ● TypeScript                 ← Recomendado
  │   JavaScript
  │
  ℹ Auto: Tailwind CSS v4 + shadcn/ui

  ◆ Elige el framework backend:
  │ ● Hono                       ← Ultra-fast, multi-runtime API
  │
  ℹ Auto: Hono → TypeScript

  ◆ ¿Base de datos?
  │ ● PostgreSQL

  ◆ Stack completo configurado:
  │
  │   📦 mi-saas/
  │   frontend/    → React + Vite (TypeScript)
  │     └── Tailwind CSS v4 + shadcn/ui
  │   backend/     → Hono (TypeScript)
  │   Database:    postgresql
```

**Lo que genera:**

```
mi-saas/
├── frontend/              # React + Vite (SPA)
│   ├── src/
│   └── package.json
├── backend/               # Hono (API)
│   ├── src/
│   └── package.json
├── docker-compose.yml     # Orquesta frontend + backend + DB
└── .github/workflows/ci.yml
```

**Para levantar:**

```bash
cd mi-saas
docker-compose up          # Levanta todo orquestado
```

---

### Web Frontend SPA — Landing pages, apps cliente

Solo frontend, sin backend propio. Opcionalmente conecta a Supabase/Firebase.

```bash
grimox create mi-landing
```

```
  ◆ ¿Qué tipo de aplicación necesitas?
  │ ● Web Frontend (solo SPA)

  ◆ Elige el framework:
  │   React + Vite
  │ ● Vue.js + Vite              ← SPA con Vue 3 + Vite
  │   Angular
  │   Svelte + Vite

  ◆ ¿Lenguaje?
  │ ● TypeScript

  ℹ Auto: Tailwind CSS v4 + PrimeVue

  ◆ ¿Necesitas conectar a una base de datos?
  │ ● No (solo frontend)
```

**Nota:** En SPAs, Grimox pregunta explícitamente si necesitas DB porque muchas landing pages no la requieren. Si eliges "Sí", muestra las DBs compatibles con cliente (Supabase, Firebase, Insforge).

---

### API / Backend — REST APIs, microservicios

Solo backend, sin frontend. Ideal para microservicios o APIs que consumen otros clientes.

```bash
grimox create inventory-api
```

```
  ◆ ¿Qué tipo de aplicación necesitas?
  │ ● API / Backend (solo API)

  ◆ Elige el framework:
  │   FastAPI                    Python, Pydantic v2, auto Swagger
  │   NestJS                     TypeScript, enterprise decorators
  │ ● Hono                      ← Ultra-fast, multi-runtime API
  │   Fastify                    High performance Node.js API
  │   Spring Boot                Enterprise Java/Kotlin API

  ℹ Auto: TypeScript

  ◆ ¿Base de datos?
  │ ● PostgreSQL

  ◆ ¿Crear proyecto?
  │ ● Sí, crear proyecto

  ╭───────────────────────────────────────────────╮
  │  cd inventory-api                             │
  │  npm install                                  │
  │  npm run dev                                  │
  ╰───────────────────────────────────────────────╯
```

**Ejemplo con FastAPI (Python):**

```bash
grimox create ml-api
```

```
  ◆ Elige el framework:
  │ ● FastAPI                    ← API async con Pydantic + Uvicorn

  ℹ Auto: Python (Pydantic v2, uvicorn, auto-docs Swagger/ReDoc)

  ◆ ¿Base de datos?
  │ ● Supabase

  ╭───────────────────────────────────────────────╮
  │  cd ml-api                                    │
  │  pip install -r requirements.txt              │
  │  uvicorn main:app --reload                    │
  ╰───────────────────────────────────────────────╯
```

**Ejemplo con Spring Boot (Java/Kotlin):**

```bash
grimox create enterprise-api
```

```
  ◆ Elige el framework:
  │ ● Spring Boot                ← Enterprise Java/Kotlin API

  ◆ ¿Lenguaje?
  │ ● Java
  │   Kotlin

  ◆ ¿Base de datos?
  │ ● Oracle SQL                 ← Base de datos empresarial Oracle

  ╭───────────────────────────────────────────────╮
  │  cd enterprise-api                            │
  │  ./mvnw spring-boot:run                       │
  ╰───────────────────────────────────────────────╯
```

---

### App Móvil — iOS y Android multiplataforma

```bash
grimox create mi-app-movil
```

```
  ◆ ¿Qué tipo de aplicación necesitas?
  │ ● App Móvil

  ◆ Elige el framework:
  │ ● React Native (Expo)        ← Expo SDK + Expo Router
  │   Flutter                      Flutter multiplataforma (Dart)
  │   Flet (Python)                Apps móviles desde Python

  ℹ Auto: TypeScript
  ℹ Auto: NativeWind

  ◆ ¿Base de datos?
  │ ● Supabase

  ╭───────────────────────────────────────────────╮
  │  cd mi-app-movil                              │
  │  npm install                                  │
  │  npm run dev                                  │
  ╰───────────────────────────────────────────────╯
```

**Ejemplo con Flutter:**

```bash
grimox create delivery-app
```

```
  ◆ Elige el framework:
  │ ● Flutter                    ← Flutter multiplataforma

  ℹ Auto: Dart (Riverpod, Material 3)

  ◆ ¿Base de datos?
  │ ● Firebase

  ╭───────────────────────────────────────────────╮
  │  cd delivery-app                              │
  │  flutter pub get                              │
  │  flutter run                                  │
  ╰───────────────────────────────────────────────╯
```

---

### App Desktop — Windows, macOS, Linux

```bash
grimox create file-manager
```

```
  ◆ ¿Qué tipo de aplicación necesitas?
  │ ● App Desktop

  ◆ Elige el framework:
  │ ● Tauri                      ← Apps ligeras con web UI + Rust (~5MB)
  │   Electron                     Cross-platform desktop con Node.js
  │   Flet (Python)                Apps desktop desde Python

  ℹ Auto: TypeScript + Rust
  ℹ Auto: Tailwind CSS v4 + shadcn/ui

  ◆ ¿Base de datos?
  │ ● Turso                      ← SQLite distribuido para edge

  ╭───────────────────────────────────────────────╮
  │  cd file-manager                              │
  │  npm install                                  │
  │  npm run tauri dev                            │
  ╰───────────────────────────────────────────────╯
```

**Ejemplo con Electron:**

```bash
grimox create mi-editor
```

```
  ◆ Elige el framework:
  │ ● Electron

  ◆ ¿Lenguaje?
  │ ● TypeScript

  ╭───────────────────────────────────────────────╮
  │  cd mi-editor                                 │
  │  npm install                                  │
  │  npm run dev                                  │
  ╰───────────────────────────────────────────────╯
```

---

### IoT / Embebido — Electrónica y microcontroladores

```bash
grimox create sensor-temp
```

```
  ◆ ¿Qué tipo de aplicación necesitas?
  │ ● IoT / Embebido

  ◆ Elige el framework:
  │   Arduino (.ino)             Estructura Arduino IDE con .ino
  │ ● PlatformIO                 ← Desarrollo embebido profesional
  │   ESP-IDF                      Framework nativo Espressif
  │   MicroPython                  Python en microcontroladores

  ℹ Auto: C++

  ◆ ¿Para qué placa?
  │ ● ESP32 (esp32dev)
  │   ESP8266 (nodemcuv2)
  │   Arduino Uno (uno)

  ╭───────────────────────────────────────────────╮
  │  cd sensor-temp                               │
  │  pio run                                      │
  ╰───────────────────────────────────────────────╯
```

**Ejemplo con Arduino:**

```bash
grimox create lampara-aurora
```

```
  ◆ Elige el framework:
  │ ● Arduino (.ino)

  ℹ Auto: C++

  ◆ ¿Para qué placa?
  │ ● ESP32
  │   Arduino Uno
  │   Arduino Mega
  │   ESP8266

  ╭───────────────────────────────────────────────╮
  │  cd lampara-aurora                            │
  │  Abre el .ino en Arduino IDE                  │
  ╰───────────────────────────────────────────────╯
```

**Ejemplo con MicroPython:**

```bash
grimox create riego-auto
```

```
  ◆ Elige el framework:
  │ ● MicroPython                ← Python en microcontroladores

  ℹ Auto: Python

  ◆ ¿Para qué placa?
  │ ● ESP32
  │   Raspberry Pi Pico
  │   ESP8266

  ╭───────────────────────────────────────────────╮
  │  cd riego-auto                                │
  │  Sube los archivos con Thonny o mpremote      │
  ╰───────────────────────────────────────────────╯
```

**Nota:** Los proyectos IoT no tienen bases de datos compatibles — se conectan a servicios externos via WiFi/BLE si necesitan persistencia.

---

### Data Analytics / IA — Machine learning, ciencia de datos

```bash
grimox create predictor-ventas
```

```
  ◆ ¿Qué tipo de aplicación necesitas?
  │ ● Data Analytics / IA

  ◆ Elige el framework:
  │ ● FastAPI + ML Stack         ← FastAPI + scikit-learn + pandas + Jupyter

  ℹ Auto: Python (scikit-learn, pandas, numpy, Jupyter notebooks)

  ◆ ¿Base de datos?
  │ ● PostgreSQL

  ╭───────────────────────────────────────────────╮
  │  cd predictor-ventas                          │
  │  pip install -r requirements.txt              │
  │  uvicorn main:app --reload                    │
  ╰───────────────────────────────────────────────╯
```

**Lo que genera además del API:**

```
predictor-ventas/
├── app/                   # FastAPI endpoints
├── models/                # Modelos ML entrenados (.pkl, .joblib)
├── notebooks/             # Jupyter notebooks (EDA, training)
├── data/
│   ├── raw/               # Datos crudos
│   └── processed/         # Datos procesados
├── requirements.txt       # scikit-learn, pandas, numpy, matplotlib, jupyter
└── Dockerfile
```

---

### Documentación — Sitios de docs estáticos

```bash
grimox create docs-proyecto
```

```
  ◆ ¿Qué tipo de aplicación necesitas?
  │ ● Documentación

  ◆ Elige el framework:
  │ ● Astro (Starlight)          ← Documentación rápida con Astro
  │   Docusaurus                   Documentación React-based (Meta)
  │   VitePress                    Documentación Vue-based

  ℹ Auto: TypeScript
  ℹ Auto: Tailwind CSS v4 + Starlight

  ╭───────────────────────────────────────────────╮
  │  cd docs-proyecto                             │
  │  npm install                                  │
  │  npm run dev                                  │
  ╰───────────────────────────────────────────────╯
```

---

### Herramienta CLI — Comandos de terminal

```bash
grimox create mi-cli
```

```
  ◆ ¿Qué tipo de aplicación necesitas?
  │ ● Herramienta CLI

  ◆ Elige el framework:
  │ ● Node.js + Commander        ← CLI tool scaffold con Commander.js

  ℹ Auto: JavaScript

  ╭───────────────────────────────────────────────╮
  │  cd mi-cli                                    │
  │  npm install                                  │
  │  npm run dev                                  │
  ╰───────────────────────────────────────────────╯
```

**Lo que genera:**

```
mi-cli/
├── bin/
│   └── mi-cli.js          # Entry point con shebang
├── src/
│   ├── cli.js             # Setup de Commander
│   └── commands/          # Un archivo por comando
└── package.json           # "bin": { "mi-cli": "./bin/mi-cli.js" }
```

**Para registrar globalmente:** `npm link` → ahora `mi-cli` funciona desde cualquier directorio.

---

### Personalizar features — Quitar o agregar

En cualquier proyecto, al llegar a la confirmación puedes elegir "Personalizar":

```
  ◆ ¿Crear proyecto?
  │   Sí, crear proyecto
  │ ● Personalizar (quitar/agregar features)
  │   Cancelar

  ◆ ¿Qué features deseas incluir?
  │ ◻ Docker               Dockerfile + docker-compose.yml
  │ ◼ CI/CD                GitHub Actions (lint, test, build, deploy)
  │ ◼ AI Skills            .ai/rules.md + .cursorrules + copilot-instructions.md
  │ ◻ MCP Config           Configuración de servidores MCP para agentes IA
  │ ◼ Seguridad            .env validation + CSP + CORS + headers
  │ ◼ UI/UX                Tailwind CSS v4 + component library + dark mode
  │ ◼ Database Config      Conexión DB, ORM config, schemas, .env vars
  │
  │ (Espacio para toggle, Enter para confirmar)
```

---

### `grimox migrate` — Migrar proyectos legacy

Un único flujo AI-powered. El CLI detecta el LLM disponible y analiza el código real del proyecto.

**Generar plan (ver sin aplicar):**

```bash
cd mi-proyecto-express
grimox migrate --plan
# → LLM detectado: Claude (Anthropic)
# → Analiza código real: Express + MongoDB + EJS templates
# → Detecta patrones: auth, routing, middleware, env vars
# → Genera MIGRATION_PLAN.md (30-60+ pasos, archivo por archivo)
```

**Aplicar migración (con backup automático):**

```bash
grimox migrate --apply
# → Crea backup en .grimox-backup/
# → Aplica los cambios del plan
```

**Proyecto desacoplado (frontend + backend en carpetas separadas):**

```bash
grimox migrate --frontend ./client --backend ./server
# → Analiza cada parte por separado
# → Genera plan unificado
```

**Desde el LLM directamente (sin CLI):**

Abrir `.ai/skills/grimox-migrate.md` en el LLM de preferencia y usarlo como prompt con el proyecto en contexto. Funciona con Claude, GPT, Gemini, Grok, GLM, Ollama, o cualquier LLM compatible.

---

### Creación rápida con `--yes`

Salta todas las preguntas y usa la configuración por defecto:

```bash
grimox create mi-app --yes
# → Usa el primer framework de la primera categoría
# → Todas las features habilitadas
# → Sin preguntas interactivas
```

---

## Changelog

### 2026-04-22 — Grimox Dev Studio: daemon de browser persistente + pipeline de QA determinístico

Rediseño mayor de la capa de testing visual. Reemplaza el modelo anterior "el LLM invoca al agente" por un modelo determinístico de pipeline npm: el LLM no puede saltarse el QA porque npm lo ejecuta automáticamente.

**Nuevo paquete: `grimox-qa`** (distribuido como `.vendor/grimox-qa.tgz` en cada proyecto scaffoldeado)
- CLI `grimox-qa` con flags: `--dynamic` (reusa browser del daemon via CDP), `--auto-server` (spawnea production server temporal para QA), `--headed/--headless` (auto-detectado), `--animations=full|minimal|off`, `--plan`, `--url`, `--retries`, `--reset`
- `grimox-daemon` — proceso en background que administra un browser Chromium persistente con overlays Grimox Studio. Comandos: `start --standby`, `spawn-detached`, `stop`, `status`, `kill-dev`, `demo`, `purge-all`
- Asserts soportados: `text_visible`, `text_not_visible`, `element_visible`, `element_not_visible`, `url_contains`, `redirect_to`, `status`, `no_console_errors`

**Feature `qa-cli`** (auto-activado para stacks web) inyecta en `package.json`:
- Hooks: `postinstall`, `predev`, `prebuild`, `postbuild` — todo el pipeline se automatiza
- Scripts para uso diario: `qa`, `daemon:status`, `daemon:stop`, `daemon:demo`
- Scripts para garantía de estado limpio: `daemon:purge`, `dev:fresh`, `build:fresh`

**Garantías de UX conseguidas:**
- Una sola ventana de Chromium visible durante todo el ciclo dev→build→QA (se acabó la "ráfaga" de tabs abriendo/cerrando)
- Overlays Grimox Studio (banner LIVE, toasts de cambios, progress bar) persistentes incluso tras navegación client-side
- El browser arranca con splash animado desde el segundo 0 (modo standby) — no más `about:blank` en blanco
- Auto-purga de daemons foráneos y procesos zombies de `next start/dev` en cada `spawn-detached`

**Fixes específicos de Windows:**
- `prebuild` mata el dev server que tiene bloqueado `.next/trace` antes de `next build` (resuelve el `EPERM` clásico)
- `auto-server` spawnea production server en puerto separado (3100) para que build + QA puedan coexistir

**Correctness en Supabase SSR:**
- `.env.example` vars con el prefijo correcto por framework (`NEXT_PUBLIC_*` para Next.js, `PUBLIC_*` para SvelteKit, `VITE_*` para Vite-based, `NUXT_PUBLIC_*` para Nuxt)
- `.mcp.json` substituye la misma variable prefijada para el MCP de Supabase

**Actualizaciones del SKILL:**
- Nueva REGLA #4: "nunca uses Playwright MCP / Chrome DevTools MCP — spawnean browsers parásitos; confía en el daemon + el pipeline del postbuild"
- Fase 4 (plan QA): 5 matrices predefinidas según tipo de proyecto — A (CRUD con auth), B (landing/marketing), C (sitio de docs), D (SPA consumiendo API), E (dashboard read-only)
- Reglas de cobertura: si implementaste un botón "Borrar", tu qa-plan debe tener un flow que lo haga click y verifique con `text_not_visible`

**MCPs de browser removidos del injector:** `@playwright/mcp` y `chrome-devtools-mcp` ya no se inyectan en `.mcp.json`. Spawneaban ventanas adicionales de Chromium sin overlays, contradiciendo el objetivo de "un solo browser visible". El daemon + `grimox-qa --dynamic` cubren todas esas capacidades.

**Fix de undici (Node 21):** reemplazado `AbortSignal.timeout(X)` por `AbortController` manual + consumo explícito del body en `pingServer` y `probePort`, resolviendo los crashes intermitentes de `ERR_INVALID_STATE: Controller is already closed` durante `npm run build`.

### 2026-03-21 — Testing visual autónomo con agent-browser en grimox-dev
- Skill `grimox-dev` actualizada a 6 fases: nueva Fase 4.5 de testing visual con browser
- Fase 4.5 usa `agent-browser` (headless browser CLI): verifica renderizado, interacciones, hydration errors
- Instalación automática de `agent-browser` si no está disponible — no requiere acción del usuario
- Solo se activa en proyectos web con UI (Web Fullstack, Frontend SPA, Docs, Desktop web); APIs, Mobile, IoT y CLI la saltan
- Seguridad: activa `--content-boundaries` en apps con contenido externo (CMS, admin panels) para prevenir prompt injection
- `dev-verification.md` actualizado: patrón universal distingue WebFetch por-fase vs agent-browser end-to-end

### 2026-03-21 — Arquitectura de IA multi-LLM
- Skills renombradas a ubicación canónica `.ai/skills/` (accesibles desde cualquier LLM o IDE)
- `.claude/commands/` se mantiene como adaptador silencioso para Claude Code y Open Code (slash commands)
- Reglas del framework en `.ai/rules.md` (canónico) + `.cursorrules` (Cursor/Windsurf/Trae/Antigravity) + `.github/copilot-instructions.md` (Copilot)
- `GRIMOX.md` como contexto universal en reemplazo de `CLAUDE.md`
- Flujo de migración unificado: un solo mecanismo AI-powered (sin distinción básico/profundo)

### 2026-03-19 — Skill de desarrollo autónomo `grimox-dev`
- Skill de desarrollo one-shot con ciclo autónomo Build→Test→Fix
- SKILL.md + 4 archivos de referencia en `references/`
- Verificación visual con WebFetch + URL para el usuario en navegador
- Soporte para los 25+ stacks de Grimox (web, mobile, desktop, IoT, data, docs, CLI)
- GRIMOX_DEV_PLAN.md como estado persistente (resume si se interrumpe)
- Detección inteligente de conflictos con migración pendiente o proyectos legacy

### 2026-03-19 — Skill de migración `grimox-migrate`
- Skill de migración con análisis profundo de código real usando LLM
- SKILL.md + 5 archivos de referencia en `references/`
- Análisis de patrones: componentes, state management, auth, routing, ORM, integraciones
- Inventario archivo por archivo con acciones (CONVERTIR/REESCRIBIR/ELIMINAR/MANTENER/ADAPTAR)
- 10 fases de migración ordenadas por dependencias
- Guías para 12+ rutas de migración (CRA→Vite, Express→Hono, Vue2→Nuxt, etc.)

### 2026-03-19 — Proyecto documentado
- Grimox CLI v0.1.0 en desarrollo activo
- 3 comandos: `create`, `migrate`, `list`
- 12 categorías de stacks con 25+ frameworks soportados
- 8 bases de datos soportadas
- 7 features inyectables por defecto
- 3 Skills de IA integradas (migrate, dev, docs) — multi-LLM
