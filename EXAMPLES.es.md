# Grimox CLI - Ejemplos de Uso

> 🇬🇧 [Read in English](EXAMPLES.md)

## Compatibilidad con IDEs y herramientas IA

Grimox genera integraciones automáticas para los siguientes IDEs y herramientas:

| IDE / Herramienta | Archivos que usa | Qué aporta |
|---|---|---|
| **Cualquier LLM** | `GRIMOX.md` + `.ai/skills/` + `.ai/rules.md` | Contexto, skills y reglas — nombres neutros, sin ataduras a ninguna herramienta |
| **Claude Code** | `.claude/commands/` | Slash commands automáticos: `/grimox-dev`, `/grimox-migrate`, `/grimox-docs` |
| **Open Code** | `.claude/commands/` + `GRIMOX.md` | Compatibilidad total con Claude Code |
| **Cursor** | `.cursorrules` + `.ai/rules.md` | Reglas del framework — Cursor lee `.cursorrules` automáticamente |
| **Windsurf** | `.cursorrules` | Lee `.cursorrules` automáticamente |
| **Trae** | `.cursorrules` | Lee `.cursorrules` automáticamente |
| **Antigravity** | `.cursorrules` | Lee `.cursorrules` automáticamente |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Copilot lee este archivo como instrucciones del proyecto |
| **GPT / Gemini / Grok / GLM / Ollama** | `.ai/skills/*.md` | Abre el skill que necesitas y úsalo como prompt directamente |

Para migración, Grimox se conecta a **cualquier LLM** disponible:

| LLM | Tipo | Cómo se detecta |
|---|---|---|
| Claude (Anthropic) | Nube | `ANTHROPIC_API_KEY` |
| GPT / Codex (OpenAI) | Nube | `OPENAI_API_KEY` |
| Gemini (Google) | Nube | `GOOGLE_API_KEY` o `GEMINI_API_KEY` |
| Grok (xAI) | Nube | `GROK_API_KEY` o `XAI_API_KEY` |
| GLM (Zhipu) | Nube | `GLM_API_KEY` |
| DeepSeek | Nube | `DEEPSEEK_API_KEY` |
| Ollama | Local | `localhost:11434` (servicio corriendo) |
| LM Studio | Local | `localhost:1234` (servicio corriendo) |
| Jan | Local | `localhost:1337` (servicio corriendo) |

---

## Tipos de Aplicación

```
grimox create

◆  ¿Qué tipo de aplicación necesitas?
│  ○ Web Fullstack Integrado        → Un solo framework (Next.js, Nuxt, SvelteKit)
│  ○ Web Fullstack Desacoplado      → Frontend + Backend como servicios separados
│  ○ Web Frontend (solo SPA)        → Solo frontend sin backend propio
│  ○ API / Backend (solo API)       → Solo backend sin frontend
│  ○ App Móvil                      → React Native (Expo), Flutter, Flet
│  ○ App Desktop                    → Tauri, Electron, Flet
│  ○ IoT / Embebido                 → Arduino (.ino), PlatformIO, ESP-IDF, MicroPython
│  ○ Data Analytics / IA            → FastAPI + Python ML stack
│  ○ Documentación                  → Astro, Docusaurus, VitePress
│  ○ Herramienta CLI                → Node.js + Commander
```

---

## CREAR PROYECTO NUEVO

> **Nota sobre integración con el IDE:** al final de cada `grimox create`, si el CLI se lanzó desde la terminal integrada de un IDE de la familia VSCode (VSCode, Cursor, Windsurf) y el workspace abierto es una carpeta padre del nuevo proyecto, Grimox preguntará `¿Abrir <proyecto> en una ventana nueva del IDE? (Y/n)`. Aceptar abre el proyecto en una ventana fresca para que los slash commands como `/grimox-dev` se reconozcan al instante. Los ejemplos a continuación omiten esta pregunta por brevedad, pero aparece después de la línea "✔ Proyecto listo".

### Ejemplo 1: Web Fullstack Integrado — Next.js

```
$ grimox create

◆  Nombre: crm-laboratorio

◆  Tipo: Web Fullstack Integrado

◆  Framework:
│  ● Next.js 15
│  ○ Nuxt 4
│  ○ SvelteKit

◇  Auto: TypeScript (estándar para Next.js 15)

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  Base de datos:
│  ● Supabase
│  ○ PostgreSQL
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis

◇  Stack completo configurado:

  │  📦 crm-laboratorio/
  │  ├── Framework:  Next.js 15 (TypeScript)
  │  ├── Database:   Supabase (PostgreSQL + Auth + Storage)
  │  ├── Estilos:    Tailwind CSS v4 (seleccionado)
  │  ├── Docker:     Dockerfile + docker-compose.yml
  │  ├── CI/CD:      GitHub Actions (lint, test, build, deploy)
  │  ├── Seguridad:  .env validation (zod) + CSP + CORS + Helmet
  │  ├── IA:         GRIMOX.md + .ai/skills/ + .ai/rules.md + adaptadores
  │  └── Infra:      API Routes + Server Actions

◆  ¿Crear proyecto?
│  ● Sí, crear proyecto
│  ○ Personalizar (quitar/agregar)
│  ○ Cancelar

  ✔ Proyecto listo

  Integraciones de IA generadas:
  📄 GRIMOX.md                    → Contexto universal (cualquier LLM)
  📁 .ai/skills/                  → Skills (cualquier LLM o IDE)
  📄 .ai/rules.md                 → Reglas del stack (cualquier LLM o IDE)
  📁 .claude/commands/            → Adaptador Claude Code / Open Code
  📄 .cursorrules                 → Adaptador Cursor / Windsurf / Trae / Antigravity
  📄 .github/copilot-instructions.md → Adaptador GitHub Copilot

  cd crm-laboratorio && npm install && npm run dev
```

### Ejemplo 2: Web Fullstack Integrado — Nuxt 4

```
$ grimox create

◆  Nombre: tienda-online

◆  Tipo: Web Fullstack Integrado

◆  Framework:
│  ○ Next.js 15
│  ● Nuxt 4
│  ○ SvelteKit

◇  Auto: TypeScript (estándar para Nuxt 4)

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  Base de datos:
│  ● PostgreSQL
│  ○ Supabase
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis

◇  Stack completo configurado:

  │  📦 tienda-online/
  │  ├── Framework:  Nuxt 4 (TypeScript)
  │  ├── Database:   PostgreSQL + Drizzle ORM
  │  ├── Estilos:    Tailwind CSS v4 (seleccionado)
  │  ├── Docker:     Dockerfile + docker-compose.yml (app + postgres)
  │  ├── CI/CD:      GitHub Actions
  │  ├── Seguridad:  .env validation + CSP + CORS
  │  ├── IA:         .ai/rules.md + .ai/skills/ + MCP config
  │  └── Extras:     Auto-imports, Nitro server routes

  ✔ Proyecto listo
  cd tienda-online && npm install && npm run dev
```

### Ejemplo 3: Web Fullstack Integrado — SvelteKit

```
$ grimox create

◆  Nombre: blog-personal

◆  Tipo: Web Fullstack Integrado

◆  Framework:
│  ○ Next.js 15
│  ○ Nuxt 4
│  ● SvelteKit

◇  Auto: TypeScript (estándar para SvelteKit)

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  Base de datos:
│  ● Turso
│  ○ PostgreSQL
│  ○ Supabase
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Insforge (insforge.dev)
│  ○ Redis

◇  Stack completo configurado:

  │  📦 blog-personal/
  │  ├── Framework:  SvelteKit (TypeScript)
  │  ├── Database:   Turso (libsql) + Drizzle ORM
  │  ├── Estilos:    Tailwind CSS v4 (seleccionado)
  │  ├── Docker:     Dockerfile + docker-compose.yml
  │  ├── CI/CD:      GitHub Actions
  │  ├── Seguridad:  .env validation + CSP + CORS
  │  ├── IA:         .ai/rules.md + .ai/skills/ + MCP config
  │  └── Extras:     Server endpoints, form actions

  ✔ Proyecto listo
  cd blog-personal && npm install && npm run dev
```

---

### Ejemplo 4: Web Fullstack Desacoplado — Angular + Spring Boot

```
$ grimox create

◆  Nombre: plataforma-rrhh

◆  Tipo: Web Fullstack Desacoplado

◆  Framework frontend:
│  ○ React + Vite
│  ○ Vue.js + Vite
│  ● Angular
│  ○ Svelte + Vite

◇  Auto: Angular → TypeScript (obligatorio)

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  Framework backend:
│  ● Spring Boot (Java / Kotlin)
│  ○ FastAPI (Python)
│  ○ NestJS (TypeScript)
│  ○ Hono (TypeScript)
│  ○ Fastify (JavaScript / TypeScript)

◆  ¿Java o Kotlin?
│  ○ Java
│  ● Kotlin

◇  Auto: Kotlin + Gradle + Spring Boot 3.x

◆  Base de datos:
│  ● PostgreSQL
│  ○ Supabase
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis

◇  Stack completo configurado:

  │  📦 plataforma-rrhh/
  │  │
  │  ├── frontend/                → Angular 19 (TypeScript)
  │  │   ├── Tailwind CSS v4 (seleccionado)
  │  │   ├── Dark mode configurado
  │  │   ├── Guards + Interceptors
  │  │   ├── Proxy → backend:8080
  │  │   └── Karma + Jasmine (tests)
  │  │
  │  ├── backend/                 → Spring Boot 3.x (Kotlin)
  │  │   ├── Gradle (Kotlin DSL)
  │  │   ├── Spring Data JPA + Hibernate
  │  │   ├── Spring Security + JWT
  │  │   ├── SpringDoc OpenAPI (Swagger)
  │  │   └── JUnit 5 + MockK (tests)
  │  │
  │  ├── docker-compose.yml       → frontend + backend + postgres
  │  ├── Dockerfile.frontend      → nginx multi-stage
  │  ├── Dockerfile.backend       → JVM multi-stage
  │  ├── .github/workflows/ci.yml → Lint + Test + Build (ambos)
  │  ├── .cursorrules             → Angular + Spring Boot practices
  │  ├── .mcp/config.json         → MCP servers
  │  └── .env.example

  ✔ Proyecto listo
  Frontend:  cd frontend && npm install && ng serve
  Backend:   cd backend && ./gradlew bootRun
  Todo:      docker-compose up
  Swagger:   http://localhost:8080/swagger-ui
```

### Ejemplo 5: Web Fullstack Desacoplado — React + FastAPI

```
$ grimox create

◆  Nombre: dashboard-analytics

◆  Tipo: Web Fullstack Desacoplado

◆  Framework frontend: React + Vite

◆  ¿JavaScript o TypeScript?
│  ● TypeScript

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  Framework backend: FastAPI (Python)

◇  Auto: Python 3.12 + Pydantic + Uvicorn

◆  Base de datos: MongoDB

◇  Stack completo configurado:

  │  📦 dashboard-analytics/
  │  │
  │  ├── frontend/                → React 19 (TypeScript + Vite)
  │  │   ├── Tailwind CSS v4 (seleccionado)
  │  │   ├── React Router v7
  │  │   └── Vitest + Testing Library
  │  │
  │  ├── backend/                 → FastAPI (Python 3.12)
  │  │   ├── Pydantic v2 models
  │  │   ├── Motor (async MongoDB driver)
  │  │   ├── Beanie ODM
  │  │   └── pytest + httpx
  │  │
  │  ├── docker-compose.yml       → frontend + backend + mongo
  │  ├── .github/workflows/ci.yml
  │  ├── .cursorrules
  │  └── .mcp/config.json

  ✔ Proyecto listo
  Frontend:  cd frontend && npm install && npm run dev
  Backend:   cd backend && pip install -r requirements.txt && uvicorn main:app --reload
  Todo:      docker-compose up
```

### Ejemplo 6: Web Fullstack Desacoplado — Vue.js + NestJS

```
$ grimox create

◆  Nombre: sistema-inventario

◆  Tipo: Web Fullstack Desacoplado

◆  Framework frontend: Vue.js + Vite

◆  ¿JavaScript o TypeScript?
│  ● TypeScript

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  Framework backend: NestJS (TypeScript)

◇  Auto: TypeScript + NestJS CLI structure

◆  Base de datos:
│  ● Supabase
│  ○ PostgreSQL
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis

◇  Stack completo configurado:

  │  📦 sistema-inventario/
  │  │
  │  ├── frontend/                → Vue.js 3 (TypeScript + Vite)
  │  │   ├── Tailwind CSS v4 (seleccionado)
  │  │   ├── Vue Router 4 + Pinia
  │  │   └── Vitest
  │  │
  │  ├── backend/                 → NestJS (TypeScript)
  │  │   ├── Supabase SDK
  │  │   ├── Class-validator + Class-transformer
  │  │   ├── Swagger (auto-generated)
  │  │   └── Jest (tests)
  │  │
  │  ├── docker-compose.yml
  │  ├── .github/workflows/ci.yml
  │  ├── .cursorrules
  │  └── .mcp/config.json

  ✔ Proyecto listo
```

---

### Ejemplo 7: Web Frontend (solo SPA) — Angular

```
$ grimox create

◆  Nombre: portal-clientes

◆  Tipo: Web Frontend (solo SPA)

◆  Framework:
│  ○ React + Vite
│  ○ Vue.js + Vite
│  ● Angular
│  ○ Svelte + Vite

◇  Auto: Angular → TypeScript (obligatorio)

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  ¿Necesitas conectar a una base de datos?
│  ● Sí → Firebase
│  ○ No (solo frontend)

◇  Stack configurado:

  │  📦 portal-clientes/
  │  ├── Framework:  Angular 19 (TypeScript)
  │  ├── Database:   Firebase (Firestore + Auth)
  │  ├── Estilos:    Tailwind CSS v4 (seleccionado)
  │  ├── Docker:     Dockerfile multi-stage (nginx)
  │  ├── CI/CD:      GitHub Actions (lint, test, build)
  │  ├── Seguridad:  environment.ts validation + CSP + Guards
  │  ├── IA:         .ai/rules.md + .ai/skills/
  │  └── Tests:      Karma + Jasmine

  ✔ Proyecto listo
  cd portal-clientes && npm install && ng serve
```

### Ejemplo 8: Web Frontend (solo SPA) — React

```
$ grimox create

◆  Nombre: landing-producto

◆  Tipo: Web Frontend (solo SPA)

◆  Framework: React + Vite

◆  ¿JavaScript o TypeScript?
│  ● TypeScript

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  ¿Necesitas conectar a una base de datos?
│  ○ Sí
│  ● No (solo frontend)

◇  Stack configurado:

  │  📦 landing-producto/
  │  ├── Framework:  React 19 (TypeScript + Vite)
  │  ├── Estilos:    Tailwind CSS v4 (seleccionado)
  │  ├── Docker:     Dockerfile multi-stage (nginx)
  │  ├── CI/CD:      GitHub Actions
  │  ├── IA:         .ai/rules.md + .ai/skills/
  │  └── Tests:      Vitest + Testing Library

  ✔ Proyecto listo
  cd landing-producto && npm install && npm run dev
```

---

### Ejemplo 9: API / Backend (solo API) — FastAPI

```
$ grimox create

◆  Nombre: api-sensores-iot

◆  Tipo: API / Backend (solo API)

◆  Framework:
│  ● FastAPI (Python)
│  ○ NestJS (TypeScript)
│  ○ Hono (TypeScript)
│  ○ Fastify (JavaScript / TypeScript)
│  ○ Spring Boot (Java / Kotlin)

◇  Auto: Python 3.12 + Pydantic + Uvicorn

◆  Base de datos: Turso

◇  Stack configurado:

  │  📦 api-sensores-iot/
  │  ├── Framework:  FastAPI (Python 3.12)
  │  ├── ORM:        SQLAlchemy + Alembic (migrations)
  │  ├── Database:   Turso (libsql)
  │  ├── Server:     Uvicorn + Gunicorn
  │  ├── Validation: Pydantic v2
  │  ├── Docker:     Dockerfile + docker-compose.yml
  │  ├── CI/CD:      GitHub Actions (lint, test, docker)
  │  ├── Seguridad:  pydantic-settings + CORS
  │  ├── IA:         .ai/rules.md + .ai/skills/ + MCP
  │  ├── API Docs:   Auto (Swagger + ReDoc)
  │  └── Tests:      pytest + httpx

  ✔ Proyecto listo
  cd api-sensores-iot && pip install -r requirements.txt && uvicorn main:app --reload
  Docs: http://localhost:8000/docs
```

### Ejemplo 10: API / Backend — Spring Boot

```
$ grimox create

◆  Nombre: api-gestion-pedidos

◆  Tipo: API / Backend (solo API)

◆  Framework: Spring Boot (Java / Kotlin)

◆  ¿Java o Kotlin?
│  ● Java

◇  Auto: Java 21 + Maven + Spring Boot 3.x

◆  Base de datos: Oracle SQL

◇  Stack configurado:

  │  📦 api-gestion-pedidos/
  │  ├── Framework:  Spring Boot 3.x (Java 21)
  │  ├── Build:      Maven
  │  ├── ORM:        Spring Data JPA + Hibernate
  │  ├── Database:   Oracle SQL (ojdbc11)
  │  ├── Seguridad:  Spring Security + JWT + CORS
  │  ├── Docker:     Dockerfile + docker-compose.yml (app + oracle-xe)
  │  ├── CI/CD:      GitHub Actions
  │  ├── IA:         .ai/rules.md + .ai/skills/ + MCP
  │  ├── API Docs:   SpringDoc OpenAPI (Swagger UI)
  │  └── Tests:      JUnit 5 + Mockito

  ✔ Proyecto listo
  cd api-gestion-pedidos && ./mvnw spring-boot:run
  Swagger: http://localhost:8080/swagger-ui
```

### Ejemplo 11: API / Backend — Hono

```
$ grimox create

◆  Nombre: api-notificaciones

◆  Tipo: API / Backend (solo API)

◆  Framework: Hono (TypeScript)

◇  Auto: TypeScript + Hono

◆  Base de datos: Redis

◇  Stack configurado:

  │  📦 api-notificaciones/
  │  ├── Framework:  Hono (TypeScript)
  │  ├── Runtime:    Node.js / Bun / Cloudflare Workers
  │  ├── Database:   Redis (ioredis)
  │  ├── Validation: Zod
  │  ├── Docker:     Dockerfile + docker-compose.yml (app + redis)
  │  ├── CI/CD:      GitHub Actions
  │  ├── IA:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      Vitest

  ✔ Proyecto listo
  cd api-notificaciones && npm install && npm run dev
```

---

### Ejemplo 12: App Móvil — React Native (Expo)

```
$ grimox create

◆  Nombre: app-delivery

◆  Tipo: App Móvil

◆  Framework:
│  ● React Native (Expo)
│  ○ Flutter
│  ○ Flet (Python)

◇  Auto: TypeScript + Expo Router + NativeWind

◆  ¿Qué framework de estilos deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Material UI / Material Design
│  ○ CSS puro (custom / corporativo)

◆  Base de datos: Firebase

◇  Stack configurado:

  │  📦 app-delivery/
  │  ├── Framework:  React Native (Expo SDK 52)
  │  ├── Navigation: Expo Router
  │  ├── Estilos:    NativeWind (Tailwind para RN)
  │  ├── Database:   Firebase (Firestore + Auth)
  │  ├── CI/CD:      GitHub Actions + EAS Build
  │  ├── IA:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      Jest + React Native Testing Library

  ✔ Proyecto listo
  cd app-delivery && npm install && npx expo start
```

### Ejemplo 13: App Móvil — Flutter

```
$ grimox create

◆  Nombre: app-fitness

◆  Tipo: App Móvil

◆  Framework: Flutter

◇  Auto: Dart + Material 3

◆  ¿Qué framework de estilos deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Material UI / Material Design
│  ○ CSS puro (custom / corporativo)

◆  Base de datos: Supabase

◇  Stack configurado:

  │  📦 app-fitness/
  │  ├── Framework:  Flutter 3.x (Dart)
  │  ├── UI:         Material 3
  │  ├── State:      Riverpod
  │  ├── Database:   Supabase (supabase_flutter)
  │  ├── CI/CD:      GitHub Actions (build APK + IPA)
  │  ├── IA:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      flutter_test

  ✔ Proyecto listo
  cd app-fitness && flutter pub get && flutter run
```

### Ejemplo 14: App Móvil — Flet

```
$ grimox create

◆  Nombre: app-control-gastos

◆  Tipo: App Móvil

◆  Framework: Flet (Python)

◇  Auto: Python 3.12 + Flet

◆  Base de datos: Supabase

◇  Stack configurado:

  │  📦 app-control-gastos/
  │  ├── Framework:  Flet (Python 3.12)
  │  ├── UI:         Flet components + Material Design
  │  ├── Database:   Supabase (supabase-py)
  │  ├── Build:      flet build (APK/IPA/Desktop)
  │  ├── IA:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      pytest

  ✔ Proyecto listo
  cd app-control-gastos && pip install -r requirements.txt && flet run
```

---

### Ejemplo 15: App Desktop — Tauri

```
$ grimox create

◆  Nombre: editor-markdown

◆  Tipo: App Desktop

◆  Framework:
│  ● Tauri
│  ○ Electron
│  ○ Flet (Python)

◇  Auto: TypeScript + Rust + Tailwind + shadcn/ui

◆  Base de datos: Turso (SQLite distribuido)

◇  Stack configurado:

  │  📦 editor-markdown/
  │  ├── Framework:  Tauri 2.x (Rust backend + React frontend)
  │  ├── Frontend:   React + TypeScript + Vite
  │  ├── Estilos:    Tailwind CSS v4 (seleccionado)
  │  ├── Database:   Turso (local SQLite + sync)
  │  ├── CI/CD:      GitHub Actions (build Windows/Mac/Linux)
  │  ├── IA:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      Vitest (frontend) + cargo test (backend)

  ✔ Proyecto listo
  cd editor-markdown && npm install && npm run tauri dev
```

### Ejemplo 16: App Desktop — Electron

```
$ grimox create

◆  Nombre: gestor-archivos

◆  Tipo: App Desktop

◆  Framework: Electron

◆  ¿JavaScript o TypeScript?
│  ● TypeScript

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  Base de datos: Sin base de datos

◇  Stack configurado:

  │  📦 gestor-archivos/
  │  ├── Framework:  Electron (TypeScript)
  │  ├── Renderer:   React + Vite
  │  ├── Estilos:    Tailwind CSS v4 (seleccionado)
  │  ├── Build:      electron-builder (Windows/Mac/Linux)
  │  ├── CI/CD:      GitHub Actions (build + release)
  │  ├── IA:         .ai/rules.md + .ai/skills/
  │  └── Tests:      Vitest + Playwright (E2E)

  ✔ Proyecto listo
  cd gestor-archivos && npm install && npm run dev
```

### Ejemplo 17: App Desktop — Flet

```
$ grimox create

◆  Nombre: herramienta-reportes

◆  Tipo: App Desktop

◆  Framework: Flet (Python)

◇  Auto: Python 3.12 + Flet

◆  Base de datos: PostgreSQL

◇  Stack configurado:

  │  📦 herramienta-reportes/
  │  ├── Framework:  Flet (Python 3.12)
  │  ├── UI:         Flet components + Material Design
  │  ├── Database:   PostgreSQL (asyncpg + SQLAlchemy)
  │  ├── Build:      flet build (Windows/Mac/Linux executables)
  │  ├── IA:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      pytest

  ✔ Proyecto listo
  cd herramienta-reportes && pip install -r requirements.txt && flet run
```

---

### Ejemplo 18: IoT / Embebido — Arduino (.ino)

```
$ grimox create

◆  Nombre: lampara-aurora

◆  Tipo: IoT / Embebido

◆  Framework:
│  ● Arduino (.ino)
│  ○ PlatformIO
│  ○ ESP-IDF
│  ○ MicroPython

◇  Auto: C++ + estructura Arduino IDE

◆  ¿Para qué placa?
│  ● ESP32
│  ○ Arduino Uno
│  ○ Arduino Mega
│  ○ ESP8266
│  ○ Otra

◇  Stack configurado:

  │  📦 lampara-aurora/
  │  ├── lampara-aurora.ino       → setup() + loop() principal
  │  ├── config.h                 → Constantes y pines
  │  ├── wifi_manager.h           → Conexión WiFi (ESP32)
  │  ├── libraries/               → Librerías locales
  │  ├── .cursorrules             → Arduino/ESP32 best practices
  │  └── README.md                → Diagrama de conexiones

  ✔ Proyecto listo
  Abre lampara-aurora.ino en Arduino IDE o importa en PlatformIO
```

### Ejemplo 19: IoT / Embebido — PlatformIO

```
$ grimox create

◆  Nombre: sensor-temperatura

◆  Tipo: IoT / Embebido

◆  Framework: PlatformIO

◆  ¿Para qué placa?
│  ● ESP32 (esp32dev)
│  ○ ESP8266 (nodemcuv2)
│  ○ Arduino Uno (uno)
│  ○ Otra

◇  Stack configurado:

  │  📦 sensor-temperatura/
  │  ├── platformio.ini           → Board: esp32dev, framework: arduino
  │  ├── src/
  │  │   └── main.cpp             → setup() + loop()
  │  ├── include/
  │  │   └── config.h             → Constantes
  │  ├── lib/                     → Librerías del proyecto
  │  ├── test/                    → Unit tests (Unity)
  │  ├── .cursorrules             → PlatformIO/ESP32 best practices
  │  └── README.md

  ✔ Proyecto listo
  cd sensor-temperatura && pio run
```

### Ejemplo 20: IoT / Embebido — MicroPython

```
$ grimox create

◆  Nombre: estacion-clima

◆  Tipo: IoT / Embebido

◆  Framework: MicroPython

◇  Auto: Python (MicroPython)

◆  ¿Para qué placa?
│  ● ESP32
│  ○ Raspberry Pi Pico
│  ○ ESP8266

◇  Stack configurado:

  │  📦 estacion-clima/
  │  ├── main.py                  → Punto de entrada
  │  ├── boot.py                  → Configuración inicial
  │  ├── config.py                → WiFi credentials, pins
  │  ├── lib/                     → Módulos MicroPython
  │  ├── .cursorrules             → MicroPython best practices
  │  └── README.md

  ✔ Proyecto listo
  Sube los archivos a tu ESP32 con Thonny o mpremote
```

---

### Ejemplo 21: Data Analytics / IA

```
$ grimox create

◆  Nombre: predictor-ventas

◆  Tipo: Data Analytics / IA

◇  Auto: FastAPI + Python 3.12

◆  Base de datos: PostgreSQL

◇  Stack configurado:

  │  📦 predictor-ventas/
  │  ├── Framework:  FastAPI (Python 3.12)
  │  ├── ML:         scikit-learn + pandas + numpy
  │  ├── Database:   PostgreSQL + SQLAlchemy
  │  ├── Notebooks:  Jupyter (exploración)
  │  ├── Docker:     Dockerfile + docker-compose.yml (app + postgres + jupyter)
  │  ├── CI/CD:      GitHub Actions
  │  ├── IA:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      pytest

  ✔ Proyecto listo
  cd predictor-ventas && pip install -r requirements.txt && uvicorn main:app --reload
  Jupyter: docker-compose up jupyter → http://localhost:8888
```

---

### Ejemplo 22: Documentación — Astro

```
$ grimox create

◆  Nombre: docs-api-interna

◆  Tipo: Documentación

◆  Framework:
│  ● Astro (Starlight)
│  ○ Docusaurus
│  ○ VitePress

◇  Auto: TypeScript + Tailwind + Starlight

◇  Stack configurado:

  │  📦 docs-api-interna/
  │  ├── Framework:  Astro + Starlight (TypeScript)
  │  ├── Estilos:    Tailwind CSS v4 (seleccionado)
  │  ├── Docker:     Dockerfile (nginx)
  │  ├── CI/CD:      GitHub Actions (build + deploy to Pages)
  │  ├── IA:         .ai/rules.md + .ai/skills/
  │  └── Content:    Markdown + MDX support

  ✔ Proyecto listo
  cd docs-api-interna && npm install && npm run dev
```

---

### Ejemplo 23: Herramienta CLI

```
$ grimox create

◆  Nombre: migra-tool

◆  Tipo: Herramienta CLI

◇  Auto: Node.js + Commander.js + ESM

◇  Stack configurado:

  │  📦 migra-tool/
  │  ├── bin/cli.js               → Entry point con shebang
  │  ├── src/
  │  │   ├── index.js             → Commander.js setup
  │  │   └── commands/            → Subcomandos
  │  ├── package.json             → bin field configurado
  │  ├── .cursorrules             → Node.js CLI best practices
  │  └── Tests:      Vitest

  ✔ Proyecto listo
  cd migra-tool && npm install && npm link && migra-tool --help
```

---

## MIGRAR PROYECTO EXISTENTE

### Cómo funciona la migración

Grimox requiere un **modelo de IA (LLM)** para migrar proyectos. Antes de iniciar
cualquier migración, verifica automáticamente si tienes acceso a un LLM:

```
Dónde busca LLMs:
  1. Variables de entorno del SO → ANTHROPIC_API_KEY, OPENAI_API_KEY, etc.
  2. Archivos .env del proyecto  → mismas API keys
  3. IDEs con LLM integrado      → Cursor IDE, GitHub Copilot
  4. LLMs locales corriendo       → Ollama (localhost:11434), LM Studio, Jan
  5. Configuración MCP            → .mcp/config.json con servidores IA

Escaneo de proyecto (automático por defecto):
  1. Busca package.json, requirements.txt, pubspec.yaml, platformio.ini,
     pom.xml, build.gradle en la raíz y subcarpetas (nivel 1-2)
  2. Carpetas reconocidas: frontend/, backend/, client/, server/, api/,
     web/, app/, ui/, service/, packages/, apps/
  3. Si encuentra múltiples proyectos → Proyecto Desacoplado
  4. Si encuentra uno solo → Proyecto Monolítico

Rutas manuales (opcional):
  grimox migrate --frontend=./client --backend=./server
```

---

### ESCENARIO 0: NO TIENE LLM CONFIGURADO

### Ejemplo 24: Grimox bloquea migración sin LLM

```
$ grimox migrate

◇  Verificando modelos de IA disponibles...
◇  No se encontraron modelos de IA

  ╭──────────────────────────────────────────────────────────╮
  │  ⚠ Se requiere un modelo de IA para migración            │
  │                                                          │
  │  La migración requiere un LLM para analizar tu código    │
  │  y generar un plan consistente y personalizado.          │
  │                                                          │
  │  Nube (recomendado):                                     │
  │  • Claude       → ANTHROPIC_API_KEY en .env              │
  │  • GPT / Codex  → OPENAI_API_KEY en .env                 │
  │  • Gemini       → GOOGLE_API_KEY en .env                 │
  │  • Grok         → GROK_API_KEY en .env                   │
  │  • GLM          → GLM_API_KEY en .env                    │
  │  • DeepSeek     → DEEPSEEK_API_KEY en .env               │
  │                                                          │
  │  Local:                                                  │
  │  • Ollama       → ollama serve (localhost:11434)          │
  │  • LM Studio    → Iniciar servidor (localhost:1234)      │
  │  • Jan          → Iniciar servidor (localhost:1337)      │
  │                                                          │
  │  Configura alguno de los anteriores y ejecuta            │
  │  grimox migrate de nuevo.                                │
  ╰──────────────────────────────────────────────────────────╯
```

---

### ESCENARIO A: PROYECTO MONOLÍTICO — UN SOLO LLM DETECTADO

### Ejemplo 25: Migrar proyecto monolítico — jQuery → Next.js (con Claude)

```
$ cd sistema-ventas-viejo/
$ grimox migrate

◇  Verificando modelos de IA disponibles...
◇  1 modelo(s) de IA encontrado(s)
  ✓ Modelo de IA: Claude (Anthropic) ☁️  (Variable de entorno: ANTHROPIC_API_KEY)

◇  Escaneando estructura del proyecto...

◆  Estructura detectada: Proyecto monolítico

  📁 raíz/  →  jQuery + PHP 7.4

  ├── Docker:  ✗ No detectado
  └── CI/CD:   ✗ No detectado

◆  Stack — Proyecto:
│  ├── Lenguaje     PHP 7.4 + JavaScript
│  ├── Framework    jQuery 3.3 (sin framework moderno)
│  ├── Build        No detectado
│  ├── Database     MySQL
│  ├── Estilos      Bootstrap 3
│  └── Tests        ✗ No detectado
│
│  ⚠ jQuery detectado → considerar migración a framework moderno

◆  ¿A qué tipo de aplicación migrar Proyecto?       ← NUEVO: pregunta tipo destino
│  ● Web Fullstack Integrado    → Next.js, Nuxt, SvelteKit
│  ○ Web Fullstack Desacoplado  → Frontend + Backend separados
│  ○ Web Frontend (solo SPA)    → React+Vite, Vue+Vite, Angular
│  ○ App Desktop                → Tauri, Electron
│
│  ✗ App Móvil (no compatible)
│  ✗ IoT (no compatible)

◆  Elige el framework para Proyecto:
│  ● Next.js 15 (Recomendado)
│  ○ Nuxt 4
│  ○ SvelteKit

◆  ¿Base de datos?
│  ● Supabase (Recomendado — ideal para apps fullstack con auth + storage)
│  ○ PostgreSQL
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ Mantener MySQL (actual)
│  ○ Sin base de datos

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)        ← para estilos corporativos propios
│  ○ Styled Components (CSS-in-JS)

◆  ¿Modo de migración?
│  ● Generar plan (revisar antes de aplicar)
│  ○ Aplicar automáticamente (con backup)

◇  Analizando código fuente con IA...           ← LLM lee los archivos reales
◇  Análisis completado

◇  Generando plan de migración inteligente...   ← LLM genera pasos específicos
◇  Plan generado

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado con IA                │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  🤖 Modelo: Claude (Anthropic)                      │
  │  frontend (raíz/) → Next.js 15                      │
  │                                                     │
  │  El plan incluye:                                   │
  │  • Análisis de arquitectura y patrones detectados   │
  │  • Pasos específicos archivo por archivo            │
  │  • Snippets before/after para cada cambio           │
  │  • Script de migración de MySQL → Supabase          │
  │  • Dependencias a agregar/quitar                    │
  │                                                     │
  │  Para aplicar:  grimox migrate --apply              │
  ╰─────────────────────────────────────────────────────╯

El MIGRATION_PLAN.md generado contiene análisis REAL del código fuente,
no pasos genéricos. El LLM leyó tus archivos y generó un plan
personalizado para TU proyecto.
```

### Ejemplo 26: Migrar proyecto monolítico — React CRA → Vite moderno

```
$ cd mi-dashboard/
$ grimox migrate

◇  Verificando modelos de IA disponibles...
◇  1 modelo(s) de IA encontrado(s)
  ✓ Modelo de IA: GPT / Codex (OpenAI) ☁️  (Variable de entorno: OPENAI_API_KEY)

◇  Escaneando estructura del proyecto...

◆  Estructura detectada: Proyecto monolítico

  📁 raíz/  →  React ^17.0.2

  ├── Docker:  ✗ No detectado
  └── CI/CD:   ✗ No detectado

◆  Stack — Proyecto:
│  ├── Lenguaje     JavaScript
│  ├── Framework    React ^17.0.2
│  ├── Build        Create React App
│  ├── Database     Firebase
│  ├── Estilos      styled-components
│  └── Tests        ✓
│
│  ⚠ Create React App está descontinuado → migrar a Vite o Next.js
│  ⚠ React ^17.0.2 → React 19 disponible

◆  ¿A qué tipo de aplicación migrar Proyecto?
│  ● Web Fullstack Integrado    → Next.js, Nuxt, SvelteKit
│  ○ Web Fullstack Desacoplado  → Frontend + Backend separados
│  ○ Web Frontend (solo SPA)    → React+Vite, Vue+Vite, Angular
│  ○ App Desktop                → Tauri, Electron

◆  Elige el framework para Proyecto:        ← según tipo elegido (SPA)
│  ● React + Vite (Recomendado)
│  ○ Vue.js + Vite
│  ○ Angular
│  ○ Svelte + Vite

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  ¿Base de datos?
│  ● Firebase (Recomendado — mantener actual, ya integrado)
│  ○ Supabase
│  ○ PostgreSQL
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ Sin base de datos

◆  ¿Modo de migración?
│  ○ Generar plan (revisar antes de aplicar)
│  ● Aplicar automáticamente (con backup)

◇  Creando backup...                              ████████████ 100%
◇  Analizando código fuente con IA...             ████████████ 100%
◇  Generando plan de migración...                 ████████████ 100%
◇  Aplicando transformaciones de código...         ████████████ 100%
  Transformado: src/App.jsx
  Transformado: src/components/Dashboard.jsx
  Transformado: src/services/firebase.js
◇  Transformaciones aplicadas: 3/8 archivos

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Migración aplicada con IA                        │
  │                                                     │
  │  📁 .grimox-backup/ (archivos originales)           │
  │  📄 MIGRATION_PLAN.md (plan detallado)              │
  │  🔄 Archivos transformados: 3/8                     │
  │                                                     │
  │  ⚠ 5 archivo(s) requieren revisión manual          │
  ╰─────────────────────────────────────────────────────╯
```

### Ejemplo 27: Migrar proyecto monolítico — Express.js → Hono

```
$ cd api-legacy/
$ grimox migrate

◇  Verificando modelos de IA disponibles...
◇  1 modelo(s) de IA encontrado(s)
  ✓ Modelo de IA: Ollama (llama3.2) 💻  (http://localhost:11434)

◇  Escaneando estructura del proyecto...

◆  Estructura detectada: Proyecto monolítico

  📁 raíz/  →  Express ^4.17.0

  ├── Docker:  ✓
  └── CI/CD:   ✗ No detectado

◆  Stack — Proyecto:
│  ├── Lenguaje     JavaScript
│  ├── Framework    Express ^4.17.0
│  ├── Build        No detectado
│  ├── Database     MongoDB (Mongoose)
│  ├── Estilos      No detectado
│  └── Tests        ✓

◆  ¿A qué tipo de aplicación migrar Proyecto?
│  ● API / Backend (solo API)       → FastAPI, Hono, NestJS, Fastify, Spring Boot
│  ○ Web Fullstack Integrado        → Next.js, Nuxt, SvelteKit
│  ○ Web Fullstack Desacoplado      → Frontend + Backend separados
│
│  ✗ Web Frontend (no compatible — es un backend)
│  ✗ App Móvil, IoT (no compatible)

◆  Elige el framework para Proyecto:
│  ● Hono (Recomendado)
│  ○ Fastify
│  ○ NestJS
│  ○ FastAPI
│  ○ Spring Boot

◆  ¿Base de datos?
│  ● MongoDB (Recomendado — mantener actual, ya integrado con Mongoose)
│  ○ Supabase
│  ○ PostgreSQL
│  ○ Firebase
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ Sin base de datos

◆  ¿Modo de migración?
│  ● Generar plan (revisar antes de aplicar)
│  ○ Aplicar automáticamente (con backup)

◇  Analizando código fuente con IA...             ████████████ 100%
◇  Generando plan de migración inteligente...     ████████████ 100%

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado con IA                │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  🤖 Modelo: Ollama (llama3.2)                       │
  │  backend (raíz/) → Hono                             │
  │                                                     │
  │  Total: 6 pasos                                     │
  │  Para aplicar:  grimox migrate --apply              │
  ╰─────────────────────────────────────────────────────╯
```

### Ejemplo 28: Migrar proyecto monolítico — Angular antiguo → Angular moderno

```
$ cd panel-admin/
$ grimox migrate

◇  Verificando modelos de IA disponibles...
◇  1 modelo(s) de IA encontrado(s)
  ✓ Modelo de IA: Claude (Anthropic) ☁️  (Variable de entorno: ANTHROPIC_API_KEY)

◇  Escaneando estructura del proyecto...

◆  Estructura detectada: Proyecto monolítico

  📁 raíz/  →  Angular ^12.0.0

  ├── Docker:  ✗ No detectado
  └── CI/CD:   ✗ No detectado

◆  Stack — Proyecto:
│  ├── Lenguaje     TypeScript
│  ├── Framework    Angular ^12.0.0
│  ├── Build        No detectado
│  ├── Database     No detectada
│  ├── Estilos      Bootstrap
│  └── Tests        ✓
│
│  ⚠ Angular ^12.0.0 → Angular 19 disponible

◆  ¿A qué tipo de aplicación migrar Proyecto?
│  ● Web Frontend (solo SPA)        → React+Vite, Vue+Vite, Angular, Svelte+vite
│  ○ Web Fullstack Integrado        → Next.js, Nuxt, SvelteKit
│  ○ Web Fullstack Desacoplado      → Frontend + Backend separados
│  ○ App Desktop                    → Tauri, Electron

◆  Elige el framework para Proyecto:
│  ● Angular (Recomendado) — actualizar a Angular 19
│  ○ React + Vite
│  ○ Vue.js + Vite
│  ○ Svelte + Vite

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  ¿Modo de migración?
│  ● Generar plan (revisar antes de aplicar)
│  ○ Aplicar automáticamente (con backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado                       │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  frontend (raíz/) → Angular                         │
  │                                                     │
  │  Total: 5 pasos                                     │
  │  Para aplicar:  grimox migrate --apply              │
  ╰─────────────────────────────────────────────────────╯
```

---

### ESCENARIO B: PROYECTO DESACOPLADO (frontend + backend en carpetas separadas)

### ESCENARIO B-1: MÚLTIPLES LLMs DETECTADOS

### Ejemplo 29: Grimox encuentra varios LLMs y deja elegir

```
$ grimox migrate

◇  Verificando modelos de IA disponibles...
◇  3 modelo(s) de IA encontrado(s)

◆  ¿Qué modelo de IA usar para la migración?
│  ● Claude (Anthropic) (Recomendado)   ☁️  Nube — Variable de entorno: ANTHROPIC_API_KEY
│  ○ GPT / Codex (OpenAI)               ☁️  Nube — Variable de entorno: OPENAI_API_KEY
│  ○ Ollama (llama3.2)                   💻 Local — http://localhost:11434

  ✓ Modelo de IA: Claude (Anthropic) ☁️  (Variable de entorno: ANTHROPIC_API_KEY)

◇  Escaneando estructura del proyecto...

  ...continúa el flujo normal de migración...
```

---

### ESCENARIO C: PROYECTO DESACOPLADO (frontend + backend en carpetas separadas)

### Ejemplo 30: Escaneo automático — React CRA + Express (carpetas comunes)

Estructura del proyecto:
```
mi-plataforma/
├── frontend/          ← package.json con React 16 + CRA
├── backend/           ← package.json con Express 4
└── docker-compose.yml
```

```
$ cd mi-plataforma/
$ grimox migrate

◇  Verificando modelos de IA disponibles...
◇  1 modelo(s) de IA encontrado(s)
  ✓ Modelo de IA: Claude (Anthropic) ☁️  (Variable de entorno: ANTHROPIC_API_KEY)

◇  Escaneando estructura del proyecto...

◆  Estructura detectada: Proyecto desacoplado

  🖥️  frontend/   →  React ^16.8.0
  ⚙️  backend/    →  Express ^4.17.0

  ├── Docker:  ✓
  └── CI/CD:   ✗ No detectado

◆  ¿Qué deseas migrar?
│  ● Todo (frontend + backend)
│  ○ Solo frontend (frontend/)
│  ○ Solo backend (backend/)

◆  Stack — frontend (frontend/):
│  ├── Lenguaje     JavaScript
│  ├── Framework    React ^16.8.0
│  ├── Build        Create React App
│  ├── Database     No detectada
│  ├── Estilos      Bootstrap
│  └── Tests        ✓
│
│  ⚠ Create React App está descontinuado → migrar a Vite o Next.js
│  ⚠ React ^16.8.0 → React 19 disponible

◆  ¿A qué tipo de aplicación migrar frontend (frontend/)?
│  ● Web Fullstack Integrado    → Next.js, Nuxt, SvelteKit
│  ○ Web Fullstack Desacoplado  → Frontend + Backend separados
│  ○ Web Frontend (solo SPA)    → React+Vite, Vue+Vite, Angular
│  ○ App Desktop                → Tauri, Electron

◆  Elige el framework para frontend (frontend/):
│  ● React + Vite (Recomendado)
│  ○ Vue.js + Vite
│  ○ Angular
│  ○ Svelte + Vite

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  Stack — backend (backend/):
│  ├── Lenguaje     JavaScript
│  ├── Framework    Express ^4.17.0
│  ├── Build        No detectado
│  ├── Database     PostgreSQL
│  ├── Estilos      No detectado
│  └── Tests        ✗ No detectado

◆  ¿A qué tipo de aplicación migrar backend (backend/)?
│  ● API / Backend (solo API)       → FastAPI, Hono, NestJS, Fastify, Spring Boot
│  ○ Web Fullstack Integrado        → Next.js, Nuxt, SvelteKit
│  ○ Web Fullstack Desacoplado      → Frontend + Backend separados

◆  Elige el framework para backend (backend/):
│  ● Hono (Recomendado)
│  ○ Fastify
│  ○ NestJS
│  ○ FastAPI
│  ○ Spring Boot

◆  ¿Base de datos?
│  ● PostgreSQL (Recomendado — mantener actual)
│  ○ Supabase
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ Sin base de datos

◆  ¿Modo de migración?
│  ● Generar plan (revisar antes de aplicar)
│  ○ Aplicar automáticamente (con backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado                       │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  frontend (frontend/) → React + Vite                │
  │  backend (backend/) → Hono                          │
  │                                                     │
  │  Total: 12 pasos                                    │
  │  Para aplicar:  grimox migrate --apply              │
  ╰─────────────────────────────────────────────────────╯
```

### Ejemplo 31: Escaneo automático — Angular + Flask (carpetas comunes)

Estructura del proyecto:
```
sistema-rrhh/
├── client/            ← package.json con Angular 12
├── server/            ← requirements.txt con Flask
├── docker-compose.yml
└── .github/workflows/ci.yml
```

```
$ cd sistema-rrhh/
$ grimox migrate

◇  Escaneando estructura del proyecto...

◆  Estructura detectada: Proyecto desacoplado

  🖥️  client/   →  Angular ^12.0.0
  ⚙️  server/   →  Flask

  ├── Docker:  ✓
  └── CI/CD:   ✓

◆  ¿Qué deseas migrar?
│  ● Todo (frontend + backend)
│  ○ Solo frontend (client/)
│  ○ Solo backend (server/)

◆  Stack — frontend (client/):
│  ├── Lenguaje     TypeScript
│  ├── Framework    Angular ^12.0.0
│  ├── Build        No detectado
│  ├── Database     No detectada
│  ├── Estilos      Bootstrap
│  └── Tests        ✓
│
│  ⚠ Angular ^12.0.0 → Angular 19 disponible

◆  ¿A qué tipo de aplicación migrar frontend (client/)?
│  ● Web Frontend (solo SPA)        → React+Vite, Vue+Vite, Angular, Svelte
│  ○ Web Fullstack Integrado        → Next.js, Nuxt, SvelteKit
│  ○ Web Fullstack Desacoplado      → Frontend + Backend separados
│  ○ App Desktop                    → Tauri, Electron

◆  Elige el framework para frontend (client/):
│  ● Angular (Recomendado) — actualizar a Angular 19
│  ○ React + Vite
│  ○ Vue.js + Vite
│  ○ Svelte + Vite

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  Stack — backend (server/):
│  ├── Lenguaje     Python
│  ├── Framework    Flask
│  ├── Build        No detectado
│  ├── Database     PostgreSQL
│  ├── Estilos      No detectado
│  └── Tests        ✓

◆  ¿A qué tipo de aplicación migrar backend (server/)?
│  ● API / Backend (solo API)       → FastAPI, Hono, NestJS, Fastify, Spring Boot
│  ○ Web Fullstack Integrado        → Next.js, Nuxt, SvelteKit

◆  Elige el framework para backend (server/):
│  ● FastAPI (Recomendado)
│  ○ Hono
│  ○ NestJS
│  ○ Fastify
│  ○ Spring Boot

◆  ¿Base de datos?
│  ● PostgreSQL (Recomendado — mantener actual)
│  ○ Supabase
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ Sin base de datos

◆  ¿Modo de migración?
│  ● Generar plan (revisar antes de aplicar)
│  ○ Aplicar automáticamente (con backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado                       │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  frontend (client/) → Angular                       │
  │  backend (server/) → FastAPI                        │
  │                                                     │
  │  Total: 10 pasos                                    │
  │  Para aplicar:  grimox migrate --apply              │
  ╰─────────────────────────────────────────────────────╯
```

### Ejemplo 32: Migrar solo una parte — Solo frontend de un proyecto desacoplado

```
$ cd mi-plataforma/
$ grimox migrate

◇  Escaneando estructura del proyecto...

◆  Estructura detectada: Proyecto desacoplado

  🖥️  frontend/   →  React ^16.8.0
  ⚙️  backend/    →  Express ^4.17.0

  ├── Docker:  ✓
  └── CI/CD:   ✗ No detectado

◆  ¿Qué deseas migrar?
│  ○ Todo (frontend + backend)
│  ● Solo frontend (frontend/)          ← Elige solo el frontend
│  ○ Solo backend (backend/)

◆  Stack — frontend (frontend/):
│  ├── Lenguaje     JavaScript
│  ├── Framework    React ^16.8.0
│  ├── Build        Create React App
│  ├── Database     No detectada
│  ├── Estilos      styled-components
│  └── Tests        ✓
│
│  ⚠ Create React App está descontinuado → migrar a Vite o Next.js
│  ⚠ React ^16.8.0 → React 19 disponible

◆  ¿A qué tipo de aplicación migrar frontend (frontend/)?
│  ● Web Frontend (solo SPA)        → React+Vite, Vue+Vite, Angular, Svelte
│  ○ Web Fullstack Integrado        → Next.js, Nuxt, SvelteKit
│  ○ App Desktop                    → Tauri, Electron

◆  Elige el framework para frontend (frontend/):
│  ● React + Vite (Recomendado)
│  ○ Vue.js + Vite
│  ○ Angular
│  ○ Svelte + Vite

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  ¿Modo de migración?
│  ● Generar plan (revisar antes de aplicar)
│  ○ Aplicar automáticamente (con backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado                       │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  frontend (frontend/) → React + Vite                │
  │                                                     │
  │  Total: 4 pasos                                     │
  │  Para aplicar:  grimox migrate --apply              │
  ╰─────────────────────────────────────────────────────╯
```

---

### ESCENARIO C: RUTAS MANUALES (carpetas con nombres no estándar)

### Ejemplo 33: Rutas manuales — Carpetas con nombres raros

Estructura del proyecto:
```
proyecto-empresa/
├── modulo-web/            ← nombre no estándar
│   └── package.json       (Vue 2)
├── servicios/api-core/    ← 2 niveles de profundidad
│   └── requirements.txt   (Django)
└── otro-modulo/           ← no tiene nada que migrar
```

Sin flags, el escaneo automático podría no encontrar `servicios/api-core/`.
Usamos rutas manuales:

```
$ cd proyecto-empresa/
$ grimox migrate --frontend=./modulo-web --backend=./servicios/api-core

◇  Escaneando rutas indicadas...

◆  Estructura detectada: Proyecto desacoplado

  🖥️  ./modulo-web/              →  Vue ^2.6.0
  ⚙️  ./servicios/api-core/      →  Django

  ├── Docker:  ✗ No detectado
  └── CI/CD:   ✗ No detectado

◆  ¿Qué deseas migrar?
│  ● Todo (frontend + backend)
│  ○ Solo frontend (./modulo-web/)
│  ○ Solo backend (./servicios/api-core/)

◆  Stack — frontend (./modulo-web/):
│  ├── Lenguaje     JavaScript
│  ├── Framework    Vue ^2.6.0
│  ├── Build        Webpack
│  ├── Database     No detectada
│  ├── Estilos      No detectado
│  └── Tests        ✗ No detectado
│
│  ⚠ Vue ^2.6.0 → Vue 3 disponible (breaking changes)

◆  ¿A qué tipo de aplicación migrar frontend (./modulo-web/)?
│  ● Web Fullstack Integrado        → Next.js, Nuxt, SvelteKit
│  ○ Web Frontend (solo SPA)        → React+Vite, Vue+Vite, Angular, Svelte
│  ○ App Desktop                    → Tauri, Electron

◆  Elige el framework para frontend (./modulo-web/):
│  ● Nuxt 4 (Recomendado)
│  ○ Next.js 15
│  ○ SvelteKit

◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)

◆  Stack — backend (./servicios/api-core/):
│  ├── Lenguaje     Python
│  ├── Framework    Django
│  ├── Build        No detectado
│  ├── Database     PostgreSQL
│  ├── Estilos      No detectado
│  └── Tests        ✓

◆  ¿A qué tipo de aplicación migrar backend (./servicios/api-core/)?
│  ● API / Backend (solo API)       → FastAPI, Hono, NestJS, Fastify, Spring Boot

◆  Elige el framework para backend (./servicios/api-core/):
│  ● FastAPI (Recomendado)
│  ○ Hono
│  ○ NestJS
│  ○ Fastify
│  ○ Spring Boot

◆  ¿Base de datos?
│  ● Supabase (Recomendado — auth + storage + realtime integrado)
│  ○ PostgreSQL (mantener actual)
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ Sin base de datos

◆  ¿Modo de migración?
│  ● Generar plan (revisar antes de aplicar)
│  ○ Aplicar automáticamente (con backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado                       │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  frontend (./modulo-web/) → Nuxt 4                  │
  │  backend (./servicios/api-core/) → FastAPI           │
  │                                                     │
  │  Total: 9 pasos                                     │
  │  Para aplicar:  grimox migrate --apply              │
  ╰─────────────────────────────────────────────────────╯
```

### Ejemplo 34: Ruta manual parcial — Solo indicar frontend, escanear backend automático

Estructura del proyecto:
```
mi-app/
├── portal/             ← nombre raro, no estándar
│   └── package.json     (React 17)
├── api/                ← nombre estándar, se detecta solo
│   └── package.json     (Express)
└── docs/
```

```
$ cd mi-app/
$ grimox migrate --frontend=./portal

◇  Escaneando ruta indicada + escaneo automático del resto...

◆  Estructura detectada: Proyecto desacoplado

  🖥️  ./portal/   →  React ^17.0.2
  ⚙️  api/        →  Express ^4.18.0     ← detectado automáticamente

  ├── Docker:  ✗ No detectado
  └── CI/CD:   ✗ No detectado

◆  ¿Qué deseas migrar?
│  ● Todo (frontend + backend)
│  ○ Solo frontend (./portal/)
│  ○ Solo backend (api/)

  ...continúa el flujo normal de migración...
```

### Ejemplo 35: Ruta manual — Solo migrar el backend

```
$ cd proyecto-grande/
$ grimox migrate --backend=./services/main-api

◇  Escaneando ruta indicada...

◆  Estructura detectada: Proyecto monolítico

  ⚙️  ./services/main-api/   →  Express ^4.17.0

  ├── Docker:  ✗ No detectado
  └── CI/CD:   ✗ No detectado

◆  Stack — backend (./services/main-api/):
│  ├── Lenguaje     TypeScript
│  ├── Framework    Express ^4.17.0
│  ├── Build        No detectado
│  ├── Database     MongoDB (Mongoose)
│  ├── Estilos      No detectado
│  └── Tests        ✓

◆  ¿A qué tipo de aplicación migrar backend (./services/main-api/)?
│  ● API / Backend (solo API)       → FastAPI, Hono, NestJS, Fastify, Spring Boot

◆  Elige el framework para backend (./services/main-api/):
│  ● Hono (Recomendado)
│  ○ FastAPI
│  ○ NestJS
│  ○ Fastify
│  ○ Spring Boot

◆  ¿Base de datos?
│  ● MongoDB (Recomendado — mantener actual)
│  ○ Supabase
│  ○ PostgreSQL
│  ○ Firebase
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ Sin base de datos
│  ○ Supabase
│  ○ PostgreSQL

◆  ¿Modo de migración?
│  ● Generar plan (revisar antes de aplicar)
│  ○ Aplicar automáticamente (con backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado                       │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  backend (./services/main-api/) → Hono              │
  │                                                     │
  │  Total: 6 pasos                                     │
  │  Para aplicar:  grimox migrate --apply              │
  ╰─────────────────────────────────────────────────────╯
```

---

### ESCENARIO D: PROYECTO NO ENCONTRADO

### Ejemplo 36: No se encuentra ningún proyecto

```
$ cd carpeta-vacia/
$ grimox migrate

◇  Escaneando estructura del proyecto...

⚠  No se encontró ningún proyecto en esta carpeta ni en subcarpetas.
ℹ  Puedes indicar las rutas manualmente:
ℹ    grimox migrate --frontend=./client --backend=./server
```

---

### ESCENARIO E: MONOREPO CON MÚLTIPLES APPS

### Ejemplo 37: Monorepo con packages/ o apps/

Estructura del proyecto:
```
mi-monorepo/
├── packages/
│   ├── web/               ← package.json con React 17
│   └── api/               ← package.json con Express 4
├── package.json           ← raíz del monorepo (workspaces)
└── turbo.json
```

```
$ cd mi-monorepo/
$ grimox migrate

◇  Escaneando estructura del proyecto...

◆  Estructura detectada: Proyecto desacoplado

  🖥️  packages/web/   →  React ^17.0.2
  ⚙️  packages/api/   →  Express ^4.18.0

  ├── Docker:  ✗ No detectado
  └── CI/CD:   ✗ No detectado

◆  ¿Qué deseas migrar?
│  ● Todo (frontend + backend)
│  ○ Solo frontend (packages/web/)
│  ○ Solo backend (packages/api/)

  ...continúa el flujo normal de migración...
```

---

### ESCENARIO F: APLICAR MIGRACIÓN CON BACKUP

### Ejemplo 38: Aplicar migración automáticamente (con backup + transformación IA)

```
$ cd mi-plataforma/
$ grimox migrate --apply

◇  Verificando modelos de IA disponibles...
  ✓ Modelo de IA: Claude (Anthropic) ☁️  (Variable de entorno: ANTHROPIC_API_KEY)

◇  Escaneando estructura del proyecto...

◆  Estructura detectada: Proyecto desacoplado

  🖥️  frontend/   →  React ^16.8.0
  ⚙️  backend/    →  Express ^4.17.0

  ├── Docker:  ✓
  └── CI/CD:   ✗ No detectado

◆  ¿Qué deseas migrar?
│  ● Todo (frontend + backend)

  ...selección de tipo destino + frameworks + base de datos...

◇  Creando backup...                                  ████████████ 100%
◇  Backup creado en .grimox-backup/

◇  Analizando código fuente con IA...                 ████████████ 100%
◇  Análisis completado

◇  Generando plan de migración...                     ████████████ 100%
◇  Plan generado

◇  Aplicando transformaciones de código...             ████████████ 100%
  Transformado: frontend/src/App.jsx
  Transformado: frontend/src/components/Header.jsx
  Transformado: frontend/src/components/UserList.jsx
  Transformado: frontend/src/services/api.js
  Transformado: backend/routes/users.js
  Transformado: backend/routes/auth.js
  Transformado: backend/models/User.js
◇  Transformaciones aplicadas: 7/12 archivos

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Migración aplicada con IA                        │
  │                                                     │
  │  📁 .grimox-backup/ (archivos originales)           │
  │     ├── frontend/   (copia completa)                │
  │     └── backend/    (copia completa)                │
  │  📄 MIGRATION_PLAN.md (plan detallado)              │
  │  🔄 Archivos transformados: 7/12                    │
  │                                                     │
  │  ⚠ 5 archivo(s) requieren revisión manual          │
  ╰─────────────────────────────────────────────────────╯

El LLM transformó 7 archivos automáticamente. Los 5 restantes
son demasiado complejos para transformación automática — revisa
MIGRATION_PLAN.md para instrucciones de migración manual.

El backup en .grimox-backup/ contiene los archivos originales.
Si algo falla: cp -r .grimox-backup/* .
```

---

### ESCENARIO G: SPRING BOOT / JAVA (Maven o Gradle)

### Ejemplo 39: Migrar Spring Boot viejo

Estructura del proyecto:
```
api-corporativa/
├── pom.xml                ← Maven + Spring Boot 2.x
├── src/main/java/...
└── src/test/java/...
```

```
$ cd api-corporativa/
$ grimox migrate

◇  Escaneando estructura del proyecto...

◆  Estructura detectada: Proyecto monolítico

  📁 raíz/  →  Spring Boot (Maven)

  ├── Docker:  ✗ No detectado
  └── CI/CD:   ✗ No detectado

◆  Stack — Proyecto:
│  ├── Lenguaje     Java
│  ├── Framework    Spring Boot
│  ├── Build        Maven
│  ├── Database     No detectada
│  ├── Estilos      No detectado
│  └── Tests        ✗ No detectado

◆  ¿A qué tipo de aplicación migrar Proyecto?
│  ● API / Backend (solo API)       → FastAPI, Hono, NestJS, Fastify, Spring Boot
│  ○ Web Fullstack Integrado        → Next.js, Nuxt, SvelteKit
│  ○ Web Fullstack Desacoplado      → Frontend + Backend separados

◆  Elige el framework para Proyecto:
│  ● Spring Boot (Recomendado) — actualizar a Spring Boot 3.x + Java 21
│  ○ FastAPI
│  ○ Hono
│  ○ NestJS
│  ○ Fastify

◆  ¿Base de datos?
│  ● PostgreSQL (Recomendado — estándar para Spring Boot)
│  ○ Supabase
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ Sin base de datos

◆  ¿Modo de migración?
│  ● Generar plan (revisar antes de aplicar)
│  ○ Aplicar automáticamente (con backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado                       │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  backend (raíz/) → Spring Boot                      │
  │                                                     │
  │  Total: 7 pasos                                     │
  │  Para aplicar:  grimox migrate --apply              │
  ╰─────────────────────────────────────────────────────╯
```

---

### RESUMEN DE COMANDOS DE MIGRACIÓN

```
# Escaneo automático (por defecto)
grimox migrate

# Aplicar directamente (con backup automático)
grimox migrate --apply

# Solo ver plan sin aplicar
grimox migrate --plan

# Indicar rutas manualmente
grimox migrate --frontend=./client --backend=./server

# Solo migrar frontend (ruta manual)
grimox migrate --frontend=./modulo-web

# Solo migrar backend (ruta manual)
grimox migrate --backend=./servicios/api-core

# Combinar: una ruta manual + escaneo automático del resto
grimox migrate --frontend=./portal

# Ruta manual + aplicar directamente
grimox migrate --frontend=./client --backend=./api --apply
```

---

## MIGRACIÓN DESDE IDEs CON IA (Skill `/grimox-migrate`)

Grimox genera la skill `/grimox-migrate` en `.ai/skills/` al crear cualquier proyecto.
Esta es la ubicación universal — cualquier LLM puede leerla. Para Claude Code y Open Code
también se genera automáticamente en `.claude/commands/` como adaptador (slash commands).

Para IDEs que leen `.cursorrules` (Cursor, Antigravity, Trae, Windsurf), las reglas
del framework ya están incluidas en `.ai/rules.md` y se replican en `.cursorrules`.
Para Copilot se genera `.github/copilot-instructions.md`.

```
Dónde funciona cada integración:

  grimox migrate (CLI)           → Cualquier terminal (standalone)
  /grimox-migrate (Skill)        → Claude Code, Open Code  (.claude/commands/ — adaptador)
  .ai/skills/grimox-migrate.md   → Cualquier LLM  (abrir y usar como prompt)
  .ai/rules.md                   → Cualquier LLM  (reglas del stack)
  .cursorrules                   → Cursor, Antigravity, Trae, Windsurf  (adaptador)
  .github/copilot-instructions.md→ GitHub Copilot  (adaptador)
  /grimox-dev (Skill)            → Claude Code, Open Code
  /grimox-docs (Skill)           → Claude Code, Open Code

Todas usan IA para analizar código real. La diferencia es el entorno:
  - CLI: conecta a un LLM vía API (Claude, GPT, Ollama, etc.)
  - Skills: usa el LLM integrado del IDE directamente
```

---

### Ejemplo 40: Migración desde IDE — React CRA + Express → Next.js 15

```
$ cd mi-plataforma/
$ claude    ← Abrir Claude Code en el proyecto

> /grimox-migrate

◇  Grimox Migration activado

────────────────────────────────────────────
 FASE 1: Análisis del Proyecto
────────────────────────────────────────────

◇  Escaneando estructura del proyecto...

  📁 Estructura: Proyecto desacoplado

  🖥️  frontend/   →  React ^16.8.0 (JavaScript)
  ⚙️  backend/    →  Express ^4.17.0 (JavaScript)

  ├── Docker:  ✗ No detectado
  └── CI/CD:   ✗ No detectado

◇  Analizando código fuente (muestreo inteligente)...

  📊 Escala del proyecto:
  │  frontend/  →  47 archivos (.jsx: 28, .css: 12, .js: 7)
  │  backend/   →  23 archivos (.js: 18, .json: 3, .sql: 2)

  🔍 Patrones detectados — frontend:
  │  ├── Componentes:    12 class components, 16 functional
  │  ├── State:          Redux (react-redux + redux-thunk)
  │  ├── Routing:        React Router v5 (<Switch>, <Route>)
  │  ├── Auth:           JWT manual (localStorage)
  │  ├── Styling:        styled-components
  │  ├── HTTP:           axios (12 llamadas a /api/*)
  │  ├── Forms:          Formik + Yup
  │  └── Tests:          Jest + React Testing Library (8 archivos)

  🔍 Patrones detectados — backend:
  │  ├── Módulos:        CommonJS (require/module.exports)
  │  ├── Middleware:     cors, helmet, express-session, multer
  │  ├── Auth:           Passport.js (local + JWT strategy)
  │  ├── DB:             PostgreSQL (pg + raw SQL queries)
  │  ├── Uploads:        multer → disco local
  │  ├── Email:          Nodemailer (SMTP)
  │  └── Tests:          Mocha + chai (5 archivos)

  🔗 Integraciones externas detectadas:
  │  ├── Stripe (pagos)         → stripe SDK v12
  │  ├── SendGrid (email)       → @sendgrid/mail
  │  ├── Cloudinary (imágenes)  → cloudinary SDK
  │  └── Google Analytics       → react-ga

  🔑 Variables de entorno (14 encontradas):
  │  ├── REACT_APP_API_URL          → usado en 8 archivos
  │  ├── REACT_APP_STRIPE_KEY       → usado en 2 archivos
  │  ├── DATABASE_URL               → usado en 1 archivo
  │  ├── JWT_SECRET                  → usado en 3 archivos
  │  ├── STRIPE_SECRET_KEY          → usado en 2 archivos
  │  ├── SENDGRID_API_KEY           → usado en 1 archivo
  │  ├── CLOUDINARY_URL             → usado en 1 archivo
  │  └── ... (7 más)

  📦 Dependencias clasificadas:
  │  ├── Migrables:     18 (axios→fetch, express→API Routes, pg→Prisma)
  │  ├── Mantenibles:   12 (stripe, dayjs, uuid, lodash, zod)
  │  ├── Reescribibles:  4 (passport→NextAuth, multer→Supabase Storage)
  │  └── Eliminables:    8 (react-scripts, redux-thunk, react-router-dom v5)

  ⚠ Problemas detectados:
  │  ├── Create React App descontinuado
  │  ├── React ^16.8.0 → React 19 disponible
  │  ├── 12 class components necesitan conversión a functional
  │  ├── Redux con thunks → patrón obsoleto (Server Actions lo reemplazan)
  │  ├── SQL raw queries → riesgo de SQL injection en 3 endpoints
  │  ├── JWT en localStorage → vulnerabilidad XSS
  │  └── CommonJS en backend → necesita migración a ESM

  📈 Complejidad estimada:
  │  ├── frontend: ALTA (class components + Redux + Router v5)
  │  ├── backend:  MEDIA (Express estándar, sin ORM)
  │  └── Total:    ALTA

────────────────────────────────────────────
 FASE 2: Selección de Stack Destino
────────────────────────────────────────────

◇  Recomendación basada en el análisis:

  Next.js 15 (Fullstack Integrado) — Recomendado porque:
  │  ├── Unifica frontend + backend (elimina Express)
  │  ├── Server Components eliminan la necesidad de Redux para data fetching
  │  ├── Server Actions reemplazan los endpoints REST simples
  │  ├── File-based routing reemplaza React Router
  │  ├── TypeScript + Tailwind reemplazan styled-components
  │  └── Supabase como DB reemplaza pg raw queries + agrega Auth segura

  ¿Confirmar? → Sí, Next.js 15 + Supabase

────────────────────────────────────────────
 FASE 3: MIGRATION_PLAN.md Generado
────────────────────────────────────────────

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado con IA                   │
  │                                                          │
  │  📄 MIGRATION_PLAN.md                                    │
  │  Modelo IA: Claude (Anthropic)                           │
  │                                                          │
  │  Stack:     React 16 + Express → Next.js 15 + Supabase  │
  │  Archivos:  70 archivos analizados                       │
  │  Acciones:  28 CONVERTIR, 12 REESCRIBIR, 8 ELIMINAR,    │
  │             15 ADAPTAR, 7 MANTENER                       │
  │  Fases:     10                                           │
  │  Pasos:     47 pasos detallados                          │
  │                                                          │
  │  Quick-start:                                            │
  │  1. npx create-next-app@latest mi-plataforma-v2 --ts    │
  │  2. npm i @supabase/supabase-js stripe dayjs             │
  │  3. cp -r frontend/src/utils/* src/lib/                  │
  │  4. Seguir MIGRATION_PLAN.md fase por fase               │
  ╰──────────────────────────────────────────────────────────╯
```

### Ejemplo 41: Migración desde IDE — Vue 2 + Vuex + Django → Nuxt 4 + FastAPI

```
$ cd sistema-inventario/
$ claude

> /grimox-migrate

◇  Grimox Migration activado

────────────────────────────────────────────
 FASE 1: Análisis del Proyecto
────────────────────────────────────────────

◇  Escaneando estructura del proyecto...

  📁 Estructura: Proyecto desacoplado

  🖥️  client/    →  Vue ^2.6.14 (JavaScript)
  ⚙️  server/    →  Django 3.2 (Python)

  ├── Docker:  ✓ (docker-compose.yml)
  └── CI/CD:   ✓ (.github/workflows/ci.yml)

◇  Analizando código fuente...

  📊 Escala:
  │  client/  →  62 archivos (.vue: 38, .js: 18, .css: 6)
  │  server/  →  45 archivos (.py: 35, .html: 5, .sql: 5)

  🔍 Patrones detectados — client (Vue 2):
  │  ├── API:           Options API (100% — ningún Composition API)
  │  ├── State:         Vuex 3 (4 módulos: auth, productos, pedidos, ui)
  │  ├── Routing:       Vue Router 3 (12 rutas, 3 con guards)
  │  ├── Auth:          Token JWT en Vuex + axios interceptor
  │  ├── UI:            BootstrapVue (v-b-* components)
  │  ├── Forms:         VeeValidate v3 (6 formularios)
  │  ├── i18n:          vue-i18n (español + inglés)
  │  ├── Mixins:        4 mixins globales (auth, pagination, filters, toast)
  │  └── Filters:       5 filtros Vue (currency, date, truncate, uppercase, slug)

  🔍 Patrones detectados — server (Django):
  │  ├── ORM:           Django ORM (12 modelos, 5 relaciones M2M)
  │  ├── Admin:         Django Admin personalizado (8 ModelAdmin)
  │  ├── Auth:          Django Rest Framework + JWT (drf-simplejwt)
  │  ├── API:           DRF ViewSets (8 viewsets, 15 serializers)
  │  ├── Signals:       3 signals (post_save, pre_delete)
  │  ├── Management:    2 comandos custom (import_data, generate_report)
  │  ├── Templates:     5 templates Django (emails + PDF reports)
  │  ├── Celery:        4 tareas asíncronas (emails, reportes, sync)
  │  └── Tests:         pytest + factory_boy (22 archivos)

  ⚠ Problemas detectados:
  │  ├── Vue 2 EOL (fin de soporte) → breaking changes severos a Vue 3
  │  ├── Vuex 3 → Pinia (API completamente diferente)
  │  ├── Options API → Composition API (reescritura de todos los componentes)
  │  ├── Vue filters eliminados en Vue 3 → reescribir como funciones
  │  ├── Mixins → Composables (patrón diferente)
  │  ├── BootstrapVue NO es compatible con Vue 3
  │  ├── Django Admin → sin equivalente directo en FastAPI
  │  ├── Celery tasks → FastAPI BackgroundTasks o equivalente
  │  └── Django signals → event handlers manuales

  📈 Complejidad estimada:
  │  ├── client: CRÍTICA (Vue 2→3 breaking changes + Vuex + BootstrapVue)
  │  ├── server: ALTA (Django ORM + Admin + Celery + Signals)
  │  └── Total:  CRÍTICA

────────────────────────────────────────────
 FASE 2: Selección de Stack Destino
────────────────────────────────────────────

◇  Recomendación:

  Nuxt 4 + FastAPI — Recomendado porque:
  │  ├── Nuxt 4 incluye auto-imports, Pinia integrado, file-based routing
  │  ├── Composition API con <script setup> es más conciso
  │  ├── PrimeVue reemplaza BootstrapVue (compatible Vue 3)
  │  ├── FastAPI mantiene el ecosistema Python del equipo
  │  ├── SQLAlchemy async reemplaza Django ORM
  │  └── vue-i18n v9 es compatible con Nuxt 4

  ¿Confirmar? → Sí, Nuxt 4 + FastAPI + PostgreSQL (mantener)

────────────────────────────────────────────
 FASE 3: MIGRATION_PLAN.md Generado
────────────────────────────────────────────

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado con IA                   │
  │                                                          │
  │  📄 MIGRATION_PLAN.md                                    │
  │  Modelo IA: Claude (Anthropic)                           │
  │                                                          │
  │  Frontend:  Vue 2 + Vuex → Nuxt 4 + Pinia               │
  │  Backend:   Django 3.2 → FastAPI                         │
  │  Database:  PostgreSQL (mantener datos)                   │
  │  Archivos:  107 archivos analizados                      │
  │  Acciones:  38 REESCRIBIR, 24 CONVERTIR, 18 ADAPTAR,    │
  │             15 ELIMINAR, 12 MANTENER                     │
  │  Fases:     10                                           │
  │  Pasos:     63 pasos detallados                          │
  │                                                          │
  │  ⚠ Complejidad CRÍTICA — se recomienda migrar            │
  │    frontend y backend en sprints separados                │
  ╰──────────────────────────────────────────────────────────╯
```

### Ejemplo 42: Migración desde IDE — Angular 12 → Angular 19 (upgrade in-place)

```
$ cd panel-admin/
$ claude

> /grimox-migrate

◇  Grimox Migration activado

────────────────────────────────────────────
 FASE 1: Análisis del Proyecto
────────────────────────────────────────────

◇  Escaneando estructura del proyecto...

  📁 Estructura: Proyecto monolítico

  📁 raíz/  →  Angular ^12.0.0 (TypeScript)

  ├── Docker:  ✗ No detectado
  └── CI/CD:   ✗ No detectado

◇  Analizando código fuente...

  📊 Escala: 85 archivos (.ts: 52, .html: 22, .scss: 11)

  🔍 Patrones detectados:
  │  ├── Componentes:  35 componentes en NgModule (0 standalone)
  │  ├── Módulos:      8 NgModules (AppModule, SharedModule, 6 feature modules)
  │  ├── State:        NgRx (4 stores, 12 actions, 8 effects, 6 selectors)
  │  ├── Routing:      Angular Router con lazy loading (loadChildren)
  │  ├── Auth:         Guard + Interceptor + JWT
  │  ├── Forms:        Reactive Forms (template-driven en 3 componentes)
  │  ├── HTTP:         HttpClient con interceptors (auth, error, loading)
  │  ├── Pipes:        6 pipes custom (currency, date-ago, filesize, etc.)
  │  ├── Directives:   2 directivas custom (click-outside, autofocus)
  │  ├── UI:           Angular Material 12 + custom theme
  │  ├── RxJS:         Uso extensivo (switchMap, combineLatest, BehaviorSubject)
  │  └── Tests:        Karma + Jasmine (18 archivos .spec.ts)

  📦 Dependencias clasificadas:
  │  ├── Actualizables: 22 (@angular/*, rxjs, @ngrx/*, @angular/material)
  │  ├── Mantenibles:   8 (lodash, dayjs, uuid, file-saver)
  │  └── Eliminables:   3 (codelyzer — deprecado desde Angular 12)

  ⚠ Problemas detectados:
  │  ├── Angular 12 → 7 versiones major de diferencia
  │  ├── NgModules → deben migrar a standalone (35 componentes)
  │  ├── NgRx patterns obsoletos → recomendar signals o NgRx signals
  │  ├── *ngIf / *ngFor → nuevo control flow (@if, @for)
  │  ├── Angular Material 12 → Material 19 (muchos breaking changes en theming)
  │  └── Karma → migrar a Jest o Web Test Runner (Karma deprecado)

  📈 Complejidad estimada: ALTA

────────────────────────────────────────────
 FASE 2: Stack Destino → Angular 19
────────────────────────────────────────────

◇  Estrategia recomendada: Upgrade incremental

  Angular recomienda actualizar de a 1 major a la vez.
  Para ir de v12 a v19 se necesitan 7 upgrades secuenciales:
  │  12 → 13 → 14 → 15 → 16 → 17 → 18 → 19
  │
  │  Hitos clave:
  │  ├── v15: Standalone components (empezar a migrar)
  │  ├── v17: Nuevo control flow (@if, @for) + signals
  │  ├── v18: Zoneless change detection
  │  └── v19: Standalone por defecto, signals estable

────────────────────────────────────────────
 FASE 3: MIGRATION_PLAN.md Generado
────────────────────────────────────────────

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado con IA                   │
  │                                                          │
  │  📄 MIGRATION_PLAN.md                                    │
  │  Stack:     Angular 12 → Angular 19 (upgrade in-place)   │
  │  Archivos:  85 archivos analizados                       │
  │  Acciones:  35 CONVERTIR, 22 ADAPTAR, 18 MANTENER,      │
  │             6 REESCRIBIR, 4 ELIMINAR                     │
  │  Fases:     10 (7 upgrades + 3 modernización)            │
  │  Pasos:     52 pasos detallados                          │
  │                                                          │
  │  Quick-start:                                            │
  │  1. git checkout -b migration/angular-19                 │
  │  2. npx @angular/cli@13 update @angular/core@13          │
  │  3. ng build  (verificar)                                │
  │  4. Repetir para cada versión hasta v19                  │
  │  5. Seguir MIGRATION_PLAN.md para modernización          │
  ╰──────────────────────────────────────────────────────────╯
```

### Ejemplo 43: Migración desde IDE — Express monolítico → Hono

```
$ cd api-legacy/
$ claude

> /grimox-migrate

◇  Grimox Migration activado

────────────────────────────────────────────
 FASE 1: Análisis del Proyecto
────────────────────────────────────────────

◇  Escaneando estructura del proyecto...

  📁 Estructura: Proyecto monolítico

  📁 raíz/  →  Express ^4.17.0 (JavaScript)

  ├── Docker:  ✓
  └── CI/CD:   ✗ No detectado

◇  Analizando código fuente...

  📊 Escala: 34 archivos (.js: 28, .json: 4, .sql: 2)

  🔍 Patrones detectados:
  │  ├── Módulos:       CommonJS (100% require/module.exports)
  │  ├── Rutas:         15 endpoints (GET: 8, POST: 4, PUT: 2, DELETE: 1)
  │  ├── Middleware:     cors, helmet, morgan, express-session, multer
  │  ├── Auth:          express-session + bcrypt (session-based)
  │  ├── DB:            MongoDB (Mongoose — 6 modelos, 3 con populate)
  │  ├── Validation:    express-validator (en 8 endpoints)
  │  ├── File uploads:  multer (2 rutas)
  │  ├── Error handler: Middleware centralizado
  │  └── Tests:         Mocha + supertest (6 archivos)

  📦 Mapeo de middleware Express → Hono:
  │  ├── cors           → hono/cors (built-in)
  │  ├── helmet         → hono/secure-headers (built-in)
  │  ├── morgan         → hono/logger (built-in)
  │  ├── express.json() → built-in (automático)
  │  ├── express-session→ hono-sessions o JWT
  │  ├── multer         → @hono/multipart o Supabase Storage
  │  └── express-validator→ Zod + @hono/zod-validator

  🔑 Variables de entorno (8 encontradas):
  │  ├── PORT, MONGODB_URI, SESSION_SECRET
  │  ├── CORS_ORIGIN, NODE_ENV
  │  └── SMTP_HOST, SMTP_USER, SMTP_PASS

  📈 Complejidad estimada: MEDIA

────────────────────────────────────────────
 FASE 2: Stack Destino → Hono
────────────────────────────────────────────

◇  Hono recomendado porque:
  │  ├── API similar a Express (curva de aprendizaje mínima)
  │  ├── ESM nativo (elimina toda la deuda CommonJS)
  │  ├── Middleware equivalentes built-in (cors, logger, secure-headers)
  │  ├── TypeScript-first (puede adoptar gradualmente)
  │  ├── Multi-runtime (Node, Bun, Cloudflare Workers)
  │  └── 15 endpoints es un proyecto ideal para migrar a Hono

  ¿Base de datos? → MongoDB (mantener, actualizar Mongoose)

────────────────────────────────────────────
 FASE 3: MIGRATION_PLAN.md Generado
────────────────────────────────────────────

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado con IA                   │
  │                                                          │
  │  📄 MIGRATION_PLAN.md                                    │
  │  Stack:     Express 4 → Hono (TypeScript)                │
  │  Archivos:  34 archivos analizados                       │
  │  Acciones:  18 CONVERTIR, 6 ADAPTAR, 5 ELIMINAR,        │
  │             3 REESCRIBIR, 2 MANTENER                     │
  │  Fases:     10                                           │
  │  Pasos:     28 pasos detallados                          │
  │                                                          │
  │  Quick-start:                                            │
  │  1. npm init -y && npm i hono @hono/node-server          │
  │  2. Agregar "type": "module" en package.json             │
  │  3. Renombrar .js → .ts (opcional, recomendado)          │
  │  4. Convertir require → import archivo por archivo       │
  │  5. Seguir MIGRATION_PLAN.md fase por fase               │
  ╰──────────────────────────────────────────────────────────╯
```

### Ejemplo 44: Migración desde IDE — jQuery + PHP → Next.js 15

```
$ cd sistema-ventas-viejo/
$ claude

> /grimox-migrate

◇  Grimox Migration activado

────────────────────────────────────────────
 FASE 1: Análisis del Proyecto
────────────────────────────────────────────

◇  Escaneando estructura del proyecto...

  📁 Estructura: Proyecto monolítico

  📁 raíz/  →  jQuery 3.3 + PHP 7.4

  ├── Docker:  ✗ No detectado
  └── CI/CD:   ✗ No detectado

◇  Analizando código fuente...

  📊 Escala: 56 archivos (.php: 28, .js: 15, .css: 8, .sql: 5)

  🔍 Patrones detectados:
  │  ├── Frontend:      jQuery + Bootstrap 3 (DOM manipulation directa)
  │  ├── Backend:       PHP 7.4 procedural (sin framework, sin MVC)
  │  ├── Templates:     PHP inline con HTML (<?php echo ... ?>)
  │  ├── DB:            MySQL (mysqli_query — queries SQL inline)
  │  ├── Auth:          $_SESSION + md5() para passwords ⚠
  │  ├── Uploads:       move_uploaded_file() a carpeta local
  │  ├── AJAX:          $.ajax() (14 llamadas a endpoints PHP)
  │  ├── Routing:       Sin router — cada archivo .php es una "ruta"
  │  └── Tests:         ✗ No detectados

  ⚠ Problemas CRÍTICOS detectados:
  │  ├── md5() para passwords → EXTREMADAMENTE INSEGURO
  │  ├── SQL inline sin prepared statements → SQL INJECTION
  │  ├── $_SESSION sin CSRF tokens → vulnerable a CSRF
  │  ├── PHP 7.4 EOL (diciembre 2022)
  │  ├── jQuery 3.3 + Bootstrap 3 → ambos obsoletos
  │  ├── Sin tests → migración sin red de seguridad
  │  └── Sin separación de concerns → código spaghetti

  📋 Mapeo de páginas PHP → rutas Next.js:
  │  ├── index.php           → app/page.tsx
  │  ├── login.php           → app/login/page.tsx
  │  ├── dashboard.php       → app/dashboard/page.tsx
  │  ├── productos.php       → app/productos/page.tsx
  │  ├── producto.php?id=X   → app/productos/[id]/page.tsx
  │  ├── ventas.php           → app/ventas/page.tsx
  │  ├── reportes.php        → app/reportes/page.tsx
  │  ├── api/save_product.php→ Server Action en app/productos/
  │  └── ... (20 archivos más)

  📈 Complejidad estimada: CRÍTICA (reescritura total)

────────────────────────────────────────────
 FASE 2: Stack Destino → Next.js 15 + Supabase
────────────────────────────────────────────

◇  Next.js 15 + Supabase recomendado porque:
  │  ├── Reemplaza PHP + jQuery + MySQL completamente
  │  ├── Supabase Auth resuelve todas las vulnerabilidades de auth
  │  ├── Supabase PostgreSQL reemplaza MySQL con seguridad por defecto
  │  ├── Server Actions reemplazan los endpoints PHP de AJAX
  │  ├── Tailwind + shadcn/ui reemplazan Bootstrap 3
  │  └── RLS (Row Level Security) previene SQL injection por diseño

────────────────────────────────────────────
 FASE 3: MIGRATION_PLAN.md Generado
────────────────────────────────────────────

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado con IA                   │
  │                                                          │
  │  📄 MIGRATION_PLAN.md                                    │
  │  Stack:     jQuery+PHP 7.4 → Next.js 15 + Supabase      │
  │  Archivos:  56 archivos analizados                       │
  │  Acciones:  28 REESCRIBIR, 15 ELIMINAR, 8 CONVERTIR,    │
  │             3 ADAPTAR, 2 MANTENER                        │
  │  Fases:     10                                           │
  │  Pasos:     58 pasos detallados                          │
  │                                                          │
  │  ⚠ IMPORTANTE: Migrar datos de MySQL a Supabase          │
  │    ANTES de empezar la migración de código.               │
  │    Las passwords md5 deben rehasharse con bcrypt.         │
  │                                                          │
  │  Plan incluye:                                           │
  │  ├── Script de migración MySQL → Supabase (SQL export)   │
  │  ├── Script de rehash de passwords                       │
  │  ├── Mapeo completo de 28 páginas PHP → rutas Next.js    │
  │  └── Guía de reescritura jQuery DOM → React components   │
  ╰──────────────────────────────────────────────────────────╯
```

---

### RESUMEN DE MIGRACIÓN DESDE IDE

```
# Invocar la skill de migración en Claude Code
/grimox-migrate

# Lo que genera:
#   1. Análisis del código real (no solo package.json)
#   2. Detección de patrones: state, auth, routing, ORM, integraciones
#   3. Inventario archivo por archivo con acciones
#   4. MIGRATION_PLAN.md con 10 fases, pasos detallados,
#      comandos, snippets before/after, verificaciones y rollback

# Diferencia con grimox migrate:
#   grimox migrate     → Plan estático de 5-8 pasos genéricos
#   /grimox-migrate    → Plan de 30-60+ pasos específicos al proyecto
```

---

## DESARROLLO AUTÓNOMO ONE-SHOT (Skill `/grimox-dev`)

### Cómo funciona el desarrollo autónomo

Después de crear un proyecto con `grimox create`, la skill `/grimox-dev` permite que
el LLM implemente TODO el proyecto de forma autónoma en un ciclo infinito hasta que
funcione. Analiza el stack, planifica las fases, escribe el código, ejecuta, debugea
errores, verifica en navegador y repite hasta que la app esté funcionando en local.

```
Flujo de /grimox-dev:

  1. RECONOCER   →  Lee GRIMOX.md, .ai/rules.md, manifiestos, .env
                    Detecta: stack, DB, features, estado del proyecto

  2. PLANIFICAR  →  Genera GRIMOX_DEV_PLAN.md con fases ordenadas
                    (DB → Modelos → API → Layout → Páginas → Auth)

  3. IMPLEMENTAR →  Escribe TODO el código fase por fase
                    Código real, no placeholders

  4. BUILD→TEST→FIX (loop infinito):
     │  Instalar → Build → Dev server → curl localhost
     │  → WebFetch para verificar HTML/UI → Abrir navegador
     │  → Si error: analizar → fix → reintentar (max 5 por error)
     │  → Si éxito: siguiente fase
     └──────────────────────────────────────────────

  5. VERIFICAR   →  Build production + todas las rutas + Docker
                    Reporte final al usuario
```

---

### Ejemplo 45: Desarrollo one-shot — CRM con Next.js 15 + Supabase

```
$ grimox create crm-lab
  ...proyecto creado...

$ claude

> /grimox-dev
  Necesito un CRM para laboratorio con: gestión de clientes, productos,
  pedidos, dashboard con métricas, y autenticación con roles (admin/user).

◇  Grimox Dev Architect activado

────────────────────────────────────────────
 FASE 1: Reconocimiento
────────────────────────────────────────────

◇  Leyendo contexto del proyecto...

  📦 Stack detectado:
  │  ├── Framework:   Next.js 15 (TypeScript)
  │  ├── Database:    Supabase (PostgreSQL + Auth)
  │  ├── UI:          Tailwind CSS v4 + shadcn/ui
  │  ├── Docker:      ✓ (docker-compose.yml)
  │  ├── CI/CD:       ✓ (GitHub Actions)
  │  └── Estado:      Recién creado (sin node_modules)

────────────────────────────────────────────
 FASE 2: Planificación
────────────────────────────────────────────

◇  Generando GRIMOX_DEV_PLAN.md...

  📋 Plan de desarrollo:
  │  Fase 1: Base de datos (6 tablas: clients, products, orders, etc.)
  │  Fase 2: API / Server Actions (CRUD × 4 recursos)
  │  Fase 3: Layout (sidebar, header, dark mode)
  │  Fase 4: Páginas (dashboard, clientes, productos, pedidos)
  │  Fase 5: Componentes (tables, forms, charts, modals)
  │  Fase 6: Auth (login, roles admin/user, middleware)
  │  Total: 6 fases, ~35 archivos a crear

────────────────────────────────────────────
 FASE 3: Implementación + Build→Test→Fix
────────────────────────────────────────────

◇  [Fase 1/6] Base de datos...
  ✓ Schema Supabase: 6 tablas creadas
  ✓ Datos de seed insertados
  ✓ Conexión verificada

◇  [Fase 2/6] Server Actions...
  ✓ CRUD clientes (4 actions)
  ✓ CRUD productos (4 actions)
  ✓ CRUD pedidos (4 actions)
  ✓ Dashboard queries (3 actions)
  → Build: ✓ exitoso
  → curl localhost:3000/api/health: 200 ✓

◇  [Fase 3/6] Layout...
  ✓ Sidebar con navegación
  ✓ Header con dark mode toggle
  ✓ Layout responsive
  → Build: ✗ Error: "Cannot find module '@/components/Sidebar'"
  → Fix: corregir path del import
  → Build: ✓ exitoso
  → WebFetch localhost:3000: HTML tiene <nav>, <header>, <main> ✓

◇  [Fase 4/6] Páginas...
  ✓ Dashboard con 4 cards de métricas
  ✓ Lista de clientes con tabla + búsqueda
  ✓ Lista de productos con filtros
  ✓ Lista de pedidos con estado
  ✓ Detalle de cada recurso
  → Build: ✓ exitoso
  → curl todas las rutas: 200 ✓
  → WebFetch /dashboard: datos de seed visibles ✓

  🌐 App corriendo en http://localhost:3000
     Ábrela en tu navegador para verificar la UI.

◇  [Fase 5/6] Componentes...
  ✓ DataTable reutilizable
  ✓ Formularios con validación (Zod)
  ✓ Charts con Recharts (métricas dashboard)
  ✓ Modal de confirmación
  → Build: ✗ Error: "Type 'string' not assignable to 'number'"
  → Fix: corregir tipo en ChartData interface
  → Build: ✓ exitoso

◇  [Fase 6/6] Auth...
  ✓ Login con Supabase Auth
  ✓ Middleware de protección
  ✓ Roles: admin ve todo, user solo sus pedidos
  → Build: ✓ exitoso
  → curl /dashboard sin auth: 302 → redirect a /login ✓
  → curl /login: 200 ✓

────────────────────────────────────────────
 FASE 5: Verificación Final
────────────────────────────────────────────

  ✓ npm run build: exitoso (0 errores, 0 warnings)
  ✓ 12 páginas verificadas (todas 200)
  ✓ 15 Server Actions funcionando
  ✓ Auth: protección de rutas correcta
  ✓ Docker: docker-compose up ✓ (app + supabase local)

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ Proyecto crm-lab funcionando correctamente            │
  │                                                          │
  │  Stack:   Next.js 15 + Supabase                          │
  │  Páginas: 12 (dashboard, clientes, productos, pedidos)   │
  │  Actions: 15 Server Actions                              │
  │  Auth:    Supabase Auth con roles (admin/user)           │
  │  Puerto:  http://localhost:3000                           │
  │                                                          │
  │  Para levantar:                                          │
  │    npm run dev                                           │
  │                                                          │
  │  Para Docker:                                            │
  │    docker-compose up                                     │
  ╰──────────────────────────────────────────────────────────╯
```

### Ejemplo 46: Desarrollo one-shot — API REST con Hono + PostgreSQL

```
$ grimox create inventory-api
  ...proyecto creado...

$ claude

> /grimox-dev
  API de inventario con: productos (CRUD), categorías, stock,
  alertas de stock bajo, y autenticación JWT.

◇  Grimox Dev Architect activado

  📦 Stack: Hono (TypeScript) + PostgreSQL
  📋 Plan: 5 fases, ~20 archivos

◇  Implementando...

  [Fase 1/5] DB + Modelos: ✓ (Drizzle ORM, 4 tablas, seed data)
  [Fase 2/5] Endpoints:    ✓ (18 endpoints CRUD + búsqueda + alertas)
    → curl localhost:3000/api/products: 200 ✓ (retorna 10 productos de seed)
    → curl POST /api/products con body inválido: 422 ✓ (Zod validation)
  [Fase 3/5] Middleware:    ✓ (CORS, logger, error handler)
  [Fase 4/5] Auth JWT:      ✓ (register, login, protect endpoints)
    → curl /api/products sin token: 401 ✓
    → curl /api/products con token: 200 ✓
  [Fase 5/5] Tests:         ✓ (Vitest, 12 tests passing)

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ API inventory-api funcionando                         │
  │                                                          │
  │  Endpoints: 18 rutas                                     │
  │  Auth:      JWT (register + login)                       │
  │  Tests:     12/12 passing                                │
  │  Swagger:   http://localhost:3000/docs (si configurado)  │
  │  Docker:    docker-compose up ✓                          │
  ╰──────────────────────────────────────────────────────────╯
```

### Ejemplo 47: Desarrollo one-shot — App desacoplada React + FastAPI

```
$ grimox create dashboard-analytics
  ...proyecto desacoplado creado...

$ claude

> /grimox-dev
  Dashboard de analytics con: gráficos de ventas, tabla de transacciones,
  filtros por fecha, y exportar a CSV.

◇  Grimox Dev Architect activado

  📦 Stack desacoplado:
  │  frontend/  → React + Vite (TypeScript) + shadcn/ui
  │  backend/   → FastAPI (Python) + PostgreSQL

  📋 Plan: Backend completo primero, luego Frontend
  │  Backend: 4 fases (DB, endpoints, middleware, auth)
  │  Frontend: 4 fases (layout, páginas, componentes, integración API)

◇  [BACKEND] Implementando...

  [1/4] DB + Modelos:   ✓ (SQLAlchemy async, 3 tablas, seed 1000 transacciones)
  [2/4] Endpoints:      ✓ (GET /transactions, /analytics, /export-csv)
    → curl localhost:8000/docs: 200 ✓ (Swagger UI)
    → curl /api/v1/analytics: 200 ✓ (retorna métricas)
  [3/4] Middleware:      ✓ (CORS config para frontend en :5173)
  [4/4] Auth:            ✓ (JWT, OAuth2PasswordBearer)

  ✓ Backend completo y verificado

◇  [FRONTEND] Implementando...

  [5/8] Layout:          ✓ (sidebar, header, dark mode)
  [6/8] Páginas:         ✓ (dashboard con charts, transactions con tabla)
  [7/8] Componentes:     ✓ (LineChart, BarChart, DataTable, DateFilter)
    → Build: ✗ Error "Type 'ChartData[]' is not assignable..."
    → Fix: ajustar interface ChartData
    → Build: ✓
  [8/8] API integration:  ✓ (fetch a backend, loading states, error handling)
    → WebFetch localhost:5173: Dashboard renderiza con gráficos ✓
    → Datos reales del backend visibles en la UI ✓

  🌐 Frontend: http://localhost:5173
  🌐 Backend:  http://localhost:8000/docs

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ Proyecto dashboard-analytics funcionando              │
  │                                                          │
  │  Frontend: 4 páginas, 8 componentes                      │
  │  Backend:  6 endpoints, Swagger en /docs                 │
  │  Docker:   docker-compose up ✓ (frontend + backend + db) │
  ╰──────────────────────────────────────────────────────────╯
```

---

### Ejemplo 48: /grimox-dev detecta migración pendiente

```
$ cd mi-plataforma/     ← proyecto con MIGRATION_PLAN.md sin completar
$ claude

> /grimox-dev
  Quiero agregar un dashboard con gráficos

◇  Grimox Dev Architect activado

────────────────────────────────────────────
 FASE 1: Reconocimiento
────────────────────────────────────────────

◇  Leyendo contexto del proyecto...

  ⚠ Se detectó un MIGRATION_PLAN.md con pasos pendientes.
    Este proyecto está en proceso de migración.
    │
    │  Stack actual:  React 16 + Express (en migración)
    │  Stack destino: Next.js 15 + Supabase
    │  Progreso:      4/10 fases completadas (40%)
    │
    │  Opciones:
    │  1. Ejecutar los 6 pasos pendientes del MIGRATION_PLAN.md
    │     primero, y luego desarrollar el dashboard.
    │  2. Ignorar la migración y desarrollar sobre el código actual
    │     (puede causar conflictos con React 16 + Express).
    │  3. Cancelar y completar la migración con /grimox-migrate.

  ◆ ¿Qué prefieres?
  │ ● Opción 1: Completar migración, luego desarrollar

◇  Ejecutando pasos pendientes de MIGRATION_PLAN.md...

  [Fase 5/10] Migrar componentes UI:        ✓
  [Fase 6/10] Migrar state management:      ✓
  [Fase 7/10] Migrar autenticación:         ✓
  [Fase 8/10] Migrar testing:               ✓
  [Fase 9/10] Actualizar CI/CD:             ✓
  [Fase 10/10] Limpieza y verificación:     ✓

  ✓ MIGRATION_PLAN.md completado (10/10 fases)
  → Build: ✓ Next.js 15 compila correctamente
  → curl localhost:3000: 200 ✓

◇  Migración completa. Ahora desarrollo el dashboard...

  📋 GRIMOX_DEV_PLAN.md generado:
  │  Fase 1: API routes para analytics (Server Actions)
  │  Fase 2: Página dashboard con gráficos
  │  Fase 3: Componentes (LineChart, BarChart, KPI cards)

  ...continúa el flujo normal de /grimox-dev...
```

### Ejemplo 49: /grimox-dev detecta proyecto legacy sin migrar

```
$ cd api-legacy/        ← proyecto Express + CommonJS sin migrar
$ claude

> /grimox-dev
  Agregar endpoint de notificaciones push

◇  Grimox Dev Architect activado

  ⚠ Este proyecto usa Express ^4.17.0 con CommonJS (require/module.exports).
    Desarrollar funcionalidades nuevas sobre código legacy puede causar
    incompatibilidades y errores difíciles de diagnosticar.

    Recomendación:
    1. Ejecutar /grimox-migrate primero para migrar a Hono (ESM).
    2. Completar la migración.
    3. Luego ejecutar /grimox-dev para desarrollar el endpoint.

  ◆ ¿Quieres continuar sobre el código actual?
  │ ● Sí, desarrollar con las convenciones actuales (CommonJS + Express)

◇  Entendido. Usando convenciones del código existente.

  📋 GRIMOX_DEV_PLAN.md:
  │  Fase 1: Modelo de notificaciones (Mongoose)
  │  Fase 2: Endpoint POST /api/notifications (Express + CommonJS)
  │  Fase 3: Integración Firebase Cloud Messaging

  ...implementa usando require/module.exports, NO import/export...
```

---

### RESUMEN DE DESARROLLO AUTÓNOMO

```
# Invocar la skill de desarrollo en Claude Code
/grimox-dev

# Lo que hace:
#   1. Reconoce el stack (lee GRIMOX.md, .ai/rules.md, manifiestos)
#   2. Detecta conflictos (migración pendiente, código legacy)
#   3. Planifica fases de desarrollo (GRIMOX_DEV_PLAN.md)
#   4. Implementa TODO el código fase por fase
#   5. Ciclo Build→Test→Fix hasta que funcione
#   6. Verifica en navegador (WebFetch + URL para el usuario)
#   7. Verificación final: build + docker + todas las rutas

# Proyecto desacoplado:
#   Backend COMPLETO primero → luego Frontend consume la API

# Si se interrumpe:
#   GRIMOX_DEV_PLAN.md persiste → /grimox-dev retoma donde quedó

# Si hay migración pendiente:
#   Ofrece completar MIGRATION_PLAN.md primero → luego desarrollar

# Si el proyecto es legacy:
#   Recomienda /grimox-migrate → pero respeta la decisión del usuario
```

---

## LISTAR STACKS DISPONIBLES

```
$ grimox list

  ╭─────────────────────────────────╮
  │  🔮 Grimox CLI v0.1.0          │
  │  Available Stacks               │
  ╰─────────────────────────────────╯

  Web Fullstack Integrado
  ├── Next.js 15        TypeScript    React + SSR + API Routes
  ├── Nuxt 4            TypeScript    Vue + SSR + Nitro
  └── SvelteKit         TypeScript    Svelte + SSR + Endpoints

  Web Frontend (SPA)
  ├── React + Vite      JS / TS       SPA con React 19
  ├── Vue.js + Vite     JS / TS       SPA con Vue 3
  ├── Angular           TypeScript    SPA con Angular 19
  └── Svelte + Vite     JS / TS       SPA con Svelte 5

  API / Backend
  ├── FastAPI            Python        API async con Pydantic
  ├── NestJS             TypeScript    Enterprise API framework
  ├── Hono               TypeScript    Ultra-fast, multi-runtime
  ├── Fastify            JS / TS       High performance Node.js
  └── Spring Boot        Java/Kotlin   Enterprise Java/Kotlin API

  Mobile
  ├── React Native       TypeScript    Expo + NativeWind
  ├── Flutter             Dart          Material 3
  └── Flet                Python        Desktop + Mobile desde Python

  Desktop
  ├── Tauri               TS + Rust     Lightweight native apps
  ├── Electron            JS / TS       Cross-platform desktop
  └── Flet                Python        Desktop desde Python

  IoT / Embebido
  ├── Arduino (.ino)      C++           Arduino IDE structure
  ├── PlatformIO          C++           Professional embedded dev
  ├── ESP-IDF             C             Espressif framework
  └── MicroPython         Python        Python on microcontrollers

  Data Analytics / IA
  └── FastAPI + ML        Python        scikit-learn + pandas + Jupyter

  Documentación
  ├── Astro (Starlight)   TypeScript    Fast static docs
  ├── Docusaurus          TypeScript    React-based docs
  └── VitePress           TypeScript    Vue-based docs

  Herramienta CLI
  └── Node.js + Commander JS            CLI tool scaffold

  Bases de datos: Supabase | PostgreSQL | Firebase | MongoDB
                  Oracle SQL | Turso | Redis | Insforge (insforge.dev)
```
