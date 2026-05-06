# Grimox CLI

> 🇬🇧 [Read in English](README.md)

> CLI inteligente para crear y migrar aplicaciones modernas con un stack completamente configurado — Docker, CI/CD, seguridad, integraciones de IA y mas — en un solo comando.

## Inicio Rapido

```bash
npm install -g grimox

grimox create mi-app
```

Eso es todo. Sigue los prompts interactivos y obtiene un proyecto listo para produccion.

## Que Hace

Grimox pregunta que necesitas, recomienda el mejor stack y genera todo configurado:

```
$ grimox create crm-lab

  ◆ ¿Que tipo de aplicacion necesitas?
  │ ● Web Fullstack Integrado

  ◆ Framework:
  │ ● Next.js 15

  ◆ ¿Base de datos?
  │ ● Supabase

  ◆ Stack completo configurado:
  │
  │   📦 crm-lab/
  │   ├── Framework:  Next.js 15 (TypeScript)
  │   ├── Database:   Supabase
  │   ├── Estilos:    Tailwind CSS v4 + shadcn/ui + Dark Mode
  │   ├── Docker + docker-compose
  │   ├── CI/CD (GitHub Actions)
  │   ├── IA: GRIMOX.md + .ai/skills/ + .ai/rules.md
  │   ├── MCP Config
  │   ├── Seguridad (.env validation + headers)
  │   └── Database config

  ✔ Proyecto listo para desarrollar

  ◇ ¿Abrir crm-lab en una ventana nueva del IDE? (Y/n)
  │  (solo se pregunta si Grimox detecta un IDE abierto en una carpeta padre)

  cd crm-lab && npm install && npm run dev
```

## Stacks Soportados

| Categoria | Frameworks |
|-----------|-----------|
| Web Fullstack (Integrado) | Next.js 15, Nuxt 4, SvelteKit |
| Web Fullstack (Desacoplado) | Cualquier frontend + cualquier backend |
| Web Frontend (SPA) | React + Vite, Vue.js + Vite, Angular, Svelte + Vite |
| API / Backend | FastAPI, NestJS, Hono, Fastify, Spring Boot |
| App Movil | React Native (Expo), Flutter, Flet |
| App Desktop | Tauri, Electron, Flet |
| IoT / Embebido | Arduino, PlatformIO, ESP-IDF, MicroPython |
| Data Analytics / IA | FastAPI + ML Stack |
| Documentacion | Astro (Starlight), Docusaurus, VitePress |
| Herramienta CLI | Node.js + Commander |

**Bases de datos:** Supabase, PostgreSQL, Firebase, MongoDB, Oracle SQL, Turso, Insforge, Redis

## Comandos

| Comando | Descripcion |
|---------|-------------|
| `grimox create [nombre]` | Crear un nuevo proyecto con setup interactivo (`--yes` para saltar prompts) |
| `grimox migrate` | Migrar un proyecto legacy usando IA (`--plan` para previsualizar, `--apply` para ejecutar) |
| `grimox list` | Mostrar todos los stacks, frameworks y bases de datos disponibles |

## Cada Proyecto Incluye

| Feature | Que obtienes |
|---------|-------------|
| Docker | Dockerfile + docker-compose.yml |
| CI/CD | GitHub Actions (lint, test, build, deploy) |
| Seguridad | Validacion .env + CSP + CORS + headers de seguridad |
| AI Skills | Skills universales para cualquier LLM (dev, migrate, docs) |
| MCP Config | Configuracion de servidores Model Context Protocol |
| Cheatsheet de ayuda | `npm run grimox:help` desde dentro de cualquier proyecto generado — resumen con colores de todos los scripts disponibles, comandos del daemon, flujos comunes y tips de PowerShell |
| UI/UX | Tailwind CSS v4 + component library + dark mode |
| Database | Conexion, config ORM, schemas, variables de entorno (con los prefijos correctos por framework: `NEXT_PUBLIC_*` / `PUBLIC_*` / `VITE_*`) |
| **Grimox Dev Studio** | Daemon de browser persistente + pipeline de QA visual (ver abajo) |

Todas las features vienen habilitadas por defecto. Elige "Personalizar" en el paso de confirmacion para activar o desactivar cualquiera.

## Grimox Dev Studio — browser visible durante el desarrollo (para stacks web)

Los proyectos con UI obtienen un pipeline visual integrado que muestra **exactamente una ventana del browser** durante todo el desarrollo, build y QA, con overlays animados mostrando lo que sucede en tiempo real.

**Momentos clave:**

```bash
npm install              # → postinstall spawnea el daemon + abre Chromium con
                         #   el splash Grimox Studio (gradient purple animado)
npm run dev              # → daemon detecta el puerto → navega a tu app con
                         #   overlay LIVE persistente + toasts de cambios
npm run build            # → prebuild mata dev server, next build compila,
                         #   postbuild arranca production server temporal en
                         #   :3100 y corre QA reusando el mismo browser.
                         #   Exit 1 si QA falla → el LLM no puede reportar
                         #   "funciona" sin que efectivamente funcione
```

**Scripts extra para garantizar estado limpio:**

```bash
npm run dev:fresh        # purga todos los daemons + zombies y luego npm run dev
npm run build:fresh      # purga todo y luego npm run build
npm run daemon:purge     # solo purga (sin arrancar dev/build)
npm run daemon:status    # muestra estado del daemon (vivo, CDP, browser)
npm run daemon:stop      # detiene el daemon graciosamente
npm run daemon:demo      # prueba rapida del mecanismo daemon+browser
```

**Plan de QA visual** en `.grimox/qa-plan.yml` — auto-descubre rutas para smoke tests y permite declarar flows con steps como `click`, `fill`, `login: { as: demo }`, `assert: { text_visible / text_not_visible / element_visible / element_not_visible / url_contains / redirect_to }`.

Ver [packages/grimox-qa/README.md](packages/grimox-qa/README.md) para documentacion completa del CLI, comandos del daemon y detalles internos del pipeline.

## Integraciones de IA

Cada proyecto generado funciona con cualquier LLM o IDE desde el primer momento:

| Archivo Generado | Funciona Con |
|-----------------|-------------|
| `GRIMOX.md` + `.ai/skills/` + `.ai/rules.md` | Cualquier LLM (Claude, GPT, Gemini, Grok, Ollama...) |
| `.claude/commands/` | Claude Code, Open Code |
| `.cursorrules` | Cursor, Windsurf, Antigravity, Trae |
| `.github/copilot-instructions.md` | GitHub Copilot |

## Migracion con IA

Migra proyectos legacy a stacks modernos usando cualquier LLM disponible:

```bash
cd mi-proyecto-express
grimox migrate --plan      # Analiza codigo + genera MIGRATION_PLAN.md
grimox migrate --apply     # Aplica migracion (backup automatico)
```

Soporta: CRA → Vite, Express → Hono, Vue 2 → Nuxt 4, jQuery → Next.js, PHP → Next.js, Flask/Django → FastAPI, y mas.

## Requisitos

- Node.js >= 18

## Documentacion

- [PROJECT_DOCS.es.md](PROJECT_DOCS.es.md) — Documentacion tecnica completa
- [EXAMPLES.es.md](EXAMPLES.es.md) — 49 ejemplos de uso con output del CLI
- [CASES.es.md](CASES.es.md) — Casos de uso reales

## Licencia

[MIT](LICENSE)
