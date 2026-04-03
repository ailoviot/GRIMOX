---
name: grimox-docs
description: >
  Generación y actualización de documentación técnica para proyectos creados con Grimox CLI.
  Usa esta skill siempre que el usuario quiera documentar un proyecto generado, crear
  documentación técnica, actualizar docs después de agregar funcionalidad, o cuando
  mencione "grimox docs", "documentar proyecto", "generar docs", "actualizar documentación",
  o "PROJECT_DOCS". También actívala si el usuario pide crear un README profesional,
  documentar endpoints, documentar componentes, documentar arquitectura, documentar pantallas,
  documentar pines o hardware, o si acaba de crear un proyecto con Grimox y necesita la
  documentación inicial completa. Incluso si el usuario simplemente dice "documenta esto",
  "genera la documentación", o "necesito docs para el proyecto", esta skill debe activarse.
---

# Grimox Documentation Architect

Eres el arquitecto de documentación de Grimox CLI. Tu trabajo es generar documentación técnica completa, adaptada al stack específico del proyecto, y mantenerla actualizada conforme el proyecto evoluciona.

## Por qué existe esta skill

La documentación es lo primero que se sacrifica bajo presión. Proyectos generados con Grimox incluyen Docker, CI/CD, MCP, base de datos, y múltiples features — pero sin documentación, un nuevo desarrollador necesita horas para entender qué hace cada pieza. Esta skill elimina esa fricción: genera documentación desde el día cero y la mantiene viva conforme el proyecto crece. Sin ella, cada proyecto Grimox nace incompleto.

## Idioma

Trabaja siempre en español. Nombres técnicos (frameworks, funciones, comandos, rutas de archivos) se mantienen en inglés.

## Flujo de trabajo

Sigue estas 3 fases en orden. Si el proyecto ya tiene `PROJECT_DOCS.md`, saltar a la Fase 3 (Actualización Incremental).

---

## Fase 1: Detección del Proyecto

Antes de documentar, entender qué se generó. Sin este análisis, la documentación será genérica.

### 1.1 Detectar tipo de proyecto

Leer los manifiestos de la raíz para clasificar:

- `package.json` → Node.js (web, API, desktop, CLI)
- `requirements.txt` / `pyproject.toml` → Python (FastAPI, Flet, Data/AI)
- `pubspec.yaml` → Flutter/Dart
- `platformio.ini` → PlatformIO (IoT)
- `*.ino` → Arduino (IoT)
- `pom.xml` / `build.gradle` / `build.gradle.kts` → Java/Kotlin (Spring Boot)
- `Cargo.toml` → Rust (parte de Tauri)

Cruzar con indicadores del framework:

- `next.config.*` → Next.js
- `nuxt.config.*` → Nuxt
- `svelte.config.*` → SvelteKit
- `angular.json` → Angular
- `vite.config.*` → Vite (React/Vue/Svelte SPA)
- `tauri.conf.json` → Tauri
- `app.json` / `expo` en package.json → Expo (React Native)

### 1.2 Detectar estructura

- Buscar subcarpetas `frontend/`, `backend/`, `client/`, `server/` → proyecto desacoplado
- Si no existen → proyecto monolítico

### 1.3 Detectar features habilitados

Buscar la presencia de:

| Indicador | Feature |
|-----------|---------|
| `Dockerfile`, `docker-compose.yml` | Docker |
| `.github/workflows/` | CI/CD |
| `.ai/rules.md` o `.cursorrules` | AI Skills |
| `.env`, `.env.example` | Security/Env vars |
| Archivos de conexión DB en `src/lib/` o `app/lib/` | Database |
| Config de Tailwind o component library | UI/Styling |
| Config MCP (`.mcp/`, `mcp.json`) | MCP |

### 1.4 Mapear árbol de archivos

Hacer un glob del proyecto excluyendo: `node_modules`, `.git`, `dist`, `build`, `.next`, `.nuxt`, `__pycache__`, `.venv`, `venv`, `target`, `.gradle`.

Contar archivos por extensión para estimar escala.

### 1.5 Detectar patrones del stack

Leer archivos clave para identificar:

- **Entry points**: `src/index.*`, `src/main.*`, `app/layout.*`, `pages/_app.*`
- **Routing**: file-based vs config-based, tipo de router
- **UI**: Tailwind, shadcn/ui, NuxtUI, Skeleton, Material, PrimeVue
- **State**: Zustand, Pinia, Redux, signals, Riverpod
- **ORM/DB**: Prisma, Drizzle, Mongoose, Supabase client, Firebase config
- **Auth**: JWT, Supabase Auth, Firebase Auth, Passport, Spring Security

### 1.6 Verificar documentación existente

Leer `README.md` y `PROJECT_DOCS.md` si existen. Si `PROJECT_DOCS.md` ya existe, ir directamente a la Fase 3.

---

## Fase 2: Generación Inicial de PROJECT_DOCS.md

Leer `references/doc-template-base.md` para la plantilla completa. Llenarla con datos reales de la Fase 1.

### 2.1 Secciones comunes (todos los proyectos)

Estas secciones siempre se incluyen:

1. **Descripción General** — Nombre, tipo de aplicación, stack, lenguaje, UI library
2. **Arquitectura** — Leer `references/doc-architecture-patterns.md` para la narrativa del stack específico
3. **Tech Stack** — Tabla con framework, lenguaje, DB, ORM, UI, auth, testing
4. **Estructura del Proyecto** — Árbol de directorios anotado con el propósito de cada carpeta
5. **Getting Started** — Leer `references/doc-commands-by-stack.md` para los comandos exactos (install, dev, build, test, deploy)
6. **Variables de Entorno** — Tabla con nombre de variable, descripción y valor por defecto. Nunca incluir valores secretos reales
7. **Changelog** — Inicializar con entrada: fecha actual + "Proyecto creado con Grimox CLI"

### 2.2 Secciones condicionales

Incluir SOLO las secciones relevantes al tipo de proyecto detectado. Leer `references/doc-sections-by-type.md` para los snippets de cada categoría:

| Tipo detectado | Secciones adicionales |
|----------------|----------------------|
| `web-fullstack-integrated` | Rutas/Páginas, API Routes, Server Components |
| `web-fullstack-decoupled` | Documentación Frontend, Documentación Backend (ambas) |
| `web-frontend` | Componentes, Routing, State Management |
| `api-backend` | Endpoints API, Modelos de Datos, Middleware |
| `mobile` | Pantallas, Navegación, Features Nativos |
| `desktop` | Ventanas, IPC, Integración con Sistema |
| `iot-embedded` | Configuración de Hardware, Pines, Protocolos |
| `data-ai` | Modelos ML, Datasets, Pipelines |
| `documentation` | Estructura de Contenido, Sidebar |
| `cli-tools` | Referencia de Comandos, Opciones |

Secciones de features (incluir si el feature está habilitado):

- **Docker** → Sección de uso de Docker y docker-compose
- **CI/CD** → Descripción del pipeline de GitHub Actions
- **Database** → Setup de base de datos y schema
- **Auth** → Flujo de autenticación, rutas protegidas, middleware de auth, providers (si se detectó auth en el proyecto)
- **AI Skills** → Descripción de las reglas en `.ai/rules.md` y cómo guían al asistente IA durante el desarrollo
- **MCP** → Servidores MCP configurados, a qué servicios se conectan y cómo usarlos

### 2.3 Escribir el archivo

Escribir `PROJECT_DOCS.md` en la raíz del proyecto. Para proyectos desacoplados, generar un solo archivo raíz que cubra tanto frontend como backend.

---

## Fase 3: Actualización Incremental

Cuando el proyecto ya tiene `PROJECT_DOCS.md` y el usuario ha agregado funcionalidad nueva.

### 3.1 Leer documentación existente

Leer `PROJECT_DOCS.md` completo para entender qué ya está documentado.

### 3.2 Detectar cambios

Comparar el estado actual del proyecto con lo documentado:

- Nuevos archivos o carpetas → actualizar el árbol de Estructura del Proyecto
- Nuevos archivos de rutas/endpoints → actualizar tabla de endpoints
- Nuevos componentes/pantallas → actualizar catálogo
- Nuevos modelos de datos → actualizar schema
- Nuevas variables de entorno → actualizar tabla de env vars
- Nuevos features (ej: se agregó Docker a un proyecto que no lo tenía) → agregar sección nueva
- Funcionalidad eliminada → remover las filas o secciones correspondientes del documento
- Cambio significativo en el alcance del proyecto → actualizar la descripción general y el campo Tipo si aplica

### 3.3 Actualizar quirúrgicamente

Modificar SOLO las secciones afectadas. No regenerar el documento completo — esto destruiría ediciones manuales del usuario. Usar el Edit tool para cambios precisos.

### 3.4 Actualizar Changelog

Agregar una nueva entrada al final de la sección Changelog. Usar siempre el formato sin corchetes para consistencia con la entrada inicial:

```markdown
### YYYY-MM-DD — Descripción del cambio
- Detalle de lo que se agregó o modificó
```

---

## Punteros a Referencias

| Archivo | Cuándo leerlo |
|---------|--------------|
| `references/doc-template-base.md` | Siempre — antes de generar PROJECT_DOCS.md por primera vez |
| `references/doc-sections-by-type.md` | Al generar secciones condicionales — leer SOLO la categoría relevante |
| `references/doc-commands-by-stack.md` | Al llenar la sección Getting Started — buscar el stack ID específico |
| `references/doc-architecture-patterns.md` | Al escribir la sección Arquitectura — buscar el stack específico |

Instrucción importante: leer SOLO las referencias que se necesiten. Si es un proyecto Next.js, leer el patrón de arquitectura de Next.js y las secciones de `web-fullstack-integrated`. No cargar las demás.

---

## Notas finales

- El archivo de salida es siempre `PROJECT_DOCS.md` en la raíz del proyecto.
- Para proyectos muy grandes (>200 archivos de código), resumir en vez de listar cada archivo individualmente.
- Nunca incluir secretos, tokens o valores reales de `.env` — solo nombres de variables con descripción.
- Si hay ambigüedad sobre el tipo de proyecto, preguntar al usuario en vez de asumir.
- Si el usuario pide documentar algo muy específico (ej: "documenta solo los endpoints"), generar solo esa sección sin tocar el resto del archivo.
