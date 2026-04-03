# Grimox CLI - Usage Examples

> 🇪🇸 [Leer en Español](EXAMPLES.es.md)

## IDE and AI Tool Compatibility

Grimox automatically generates integrations for the following IDEs and tools:

| IDE / Tool | Files it uses | What it provides |
|---|---|---|
| **Any LLM** | `GRIMOX.md` + `.ai/skills/` + `.ai/rules.md` | Context, skills, and rules — neutral names, not tied to any tool |
| **Claude Code** | `.claude/commands/` | Automatic slash commands: `/grimox-dev`, `/grimox-migrate`, `/grimox-docs` |
| **Open Code** | `.claude/commands/` + `GRIMOX.md` | Full compatibility with Claude Code |
| **Cursor** | `.cursorrules` + `.ai/rules.md` | Framework rules — Cursor reads `.cursorrules` automatically |
| **Windsurf** | `.cursorrules` | Reads `.cursorrules` automatically |
| **Trae** | `.cursorrules` | Reads `.cursorrules` automatically |
| **Antigravity** | `.cursorrules` | Reads `.cursorrules` automatically |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Copilot reads this file as project instructions |
| **GPT / Gemini / Grok / GLM / Ollama** | `.ai/skills/*.md` | Open the skill you need and use it as a prompt directly |

For migration, Grimox connects to **any available LLM**:

| LLM | Type | How it's detected |
|---|---|---|
| Claude (Anthropic) | Cloud | `ANTHROPIC_API_KEY` |
| GPT / Codex (OpenAI) | Cloud | `OPENAI_API_KEY` |
| Gemini (Google) | Cloud | `GOOGLE_API_KEY` or `GEMINI_API_KEY` |
| Grok (xAI) | Cloud | `GROK_API_KEY` or `XAI_API_KEY` |
| GLM (Zhipu) | Cloud | `GLM_API_KEY` |
| DeepSeek | Cloud | `DEEPSEEK_API_KEY` |
| Ollama | Local | `localhost:11434` (service running) |
| LM Studio | Local | `localhost:1234` (service running) |
| Jan | Local | `localhost:1337` (service running) |

---

## Application Types

```
grimox create

◆  What type of application do you need?
│  ○ Integrated Web Fullstack        → Single framework (Next.js, Nuxt, SvelteKit)
│  ○ Decoupled Web Fullstack         → Frontend + Backend as separate services
│  ○ Web Frontend (SPA only)         → Frontend only, no backend
│  ○ API / Backend (API only)        → Backend only, no frontend
│  ○ Mobile App                      → React Native (Expo), Flutter, Flet
│  ○ Desktop App                     → Tauri, Electron, Flet
│  ○ IoT / Embedded                  → Arduino (.ino), PlatformIO, ESP-IDF, MicroPython
│  ○ Data Analytics / AI             → FastAPI + Python ML stack
│  ○ Documentation                   → Astro, Docusaurus, VitePress
│  ○ CLI Tool                        → Node.js + Commander
```

---

## CREATE NEW PROJECT

### Example 1: Integrated Web Fullstack — Next.js

```
$ grimox create

◆  Name: crm-laboratorio

◆  Type: Integrated Web Fullstack

◆  Framework:
│  ● Next.js 15
│  ○ Nuxt 4
│  ○ SvelteKit

◇  Auto: TypeScript (standard for Next.js 15)

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Database:
│  ● Supabase
│  ○ PostgreSQL
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis

◇  Full stack configured:

  │  📦 crm-laboratorio/
  │  ├── Framework:  Next.js 15 (TypeScript)
  │  ├── Database:   Supabase (PostgreSQL + Auth + Storage)
  │  ├── Styles:     Tailwind CSS v4 (selected)
  │  ├── Docker:     Dockerfile + docker-compose.yml
  │  ├── CI/CD:      GitHub Actions (lint, test, build, deploy)
  │  ├── Security:   .env validation (zod) + CSP + CORS + Helmet
  │  ├── AI:         GRIMOX.md + .ai/skills/ + .ai/rules.md + adapters
  │  └── Infra:      API Routes + Server Actions

◆  Create project?
│  ● Yes, create project
│  ○ Customize (remove/add)
│  ○ Cancel

  ✔ Project ready

  AI integrations generated:
  📄 GRIMOX.md                    → Universal context (any LLM)
  📁 .ai/skills/                  → Skills (any LLM or IDE)
  📄 .ai/rules.md                 → Stack rules (any LLM or IDE)
  📁 .claude/commands/            → Claude Code / Open Code adapter
  📄 .cursorrules                 → Cursor / Windsurf / Trae / Antigravity adapter
  📄 .github/copilot-instructions.md → GitHub Copilot adapter

  cd crm-laboratorio && npm install && npm run dev
```

### Example 2: Integrated Web Fullstack — Nuxt 4

```
$ grimox create

◆  Name: tienda-online

◆  Type: Integrated Web Fullstack

◆  Framework:
│  ○ Next.js 15
│  ● Nuxt 4
│  ○ SvelteKit

◇  Auto: TypeScript (standard for Nuxt 4)

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Database:
│  ● PostgreSQL
│  ○ Supabase
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis

◇  Full stack configured:

  │  📦 tienda-online/
  │  ├── Framework:  Nuxt 4 (TypeScript)
  │  ├── Database:   PostgreSQL + Drizzle ORM
  │  ├── Styles:     Tailwind CSS v4 (selected)
  │  ├── Docker:     Dockerfile + docker-compose.yml (app + postgres)
  │  ├── CI/CD:      GitHub Actions
  │  ├── Security:   .env validation + CSP + CORS
  │  ├── AI:         .ai/rules.md + .ai/skills/ + MCP config
  │  └── Extras:     Auto-imports, Nitro server routes

  ✔ Project ready
  cd tienda-online && npm install && npm run dev
```

### Example 3: Integrated Web Fullstack — SvelteKit

```
$ grimox create

◆  Name: blog-personal

◆  Type: Integrated Web Fullstack

◆  Framework:
│  ○ Next.js 15
│  ○ Nuxt 4
│  ● SvelteKit

◇  Auto: TypeScript (standard for SvelteKit)

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Database:
│  ● Turso
│  ○ PostgreSQL
│  ○ Supabase
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Insforge (insforge.dev)
│  ○ Redis

◇  Full stack configured:

  │  📦 blog-personal/
  │  ├── Framework:  SvelteKit (TypeScript)
  │  ├── Database:   Turso (libsql) + Drizzle ORM
  │  ├── Styles:     Tailwind CSS v4 (selected)
  │  ├── Docker:     Dockerfile + docker-compose.yml
  │  ├── CI/CD:      GitHub Actions
  │  ├── Security:   .env validation + CSP + CORS
  │  ├── AI:         .ai/rules.md + .ai/skills/ + MCP config
  │  └── Extras:     Server endpoints, form actions

  ✔ Project ready
  cd blog-personal && npm install && npm run dev
```

---

### Example 4: Decoupled Web Fullstack — Angular + Spring Boot

```
$ grimox create

◆  Name: plataforma-rrhh

◆  Type: Decoupled Web Fullstack

◆  Frontend framework:
│  ○ React + Vite
│  ○ Vue.js + Vite
│  ● Angular
│  ○ Svelte + Vite

◇  Auto: Angular → TypeScript (required)

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Backend framework:
│  ● Spring Boot (Java / Kotlin)
│  ○ FastAPI (Python)
│  ○ NestJS (TypeScript)
│  ○ Hono (TypeScript)
│  ○ Fastify (JavaScript / TypeScript)

◆  Java or Kotlin?
│  ○ Java
│  ● Kotlin

◇  Auto: Kotlin + Gradle + Spring Boot 3.x

◆  Database:
│  ● PostgreSQL
│  ○ Supabase
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis

◇  Full stack configured:

  │  📦 plataforma-rrhh/
  │  │
  │  ├── frontend/                → Angular 19 (TypeScript)
  │  │   ├── Tailwind CSS v4 (selected)
  │  │   ├── Dark mode configured
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
  │  ├── .github/workflows/ci.yml → Lint + Test + Build (both)
  │  ├── .cursorrules             → Angular + Spring Boot practices
  │  ├── .mcp/config.json         → MCP servers
  │  └── .env.example

  ✔ Project ready
  Frontend:  cd frontend && npm install && ng serve
  Backend:   cd backend && ./gradlew bootRun
  All:       docker-compose up
  Swagger:   http://localhost:8080/swagger-ui
```

### Example 5: Decoupled Web Fullstack — React + FastAPI

```
$ grimox create

◆  Name: dashboard-analytics

◆  Type: Decoupled Web Fullstack

◆  Frontend framework: React + Vite

◆  JavaScript or TypeScript?
│  ● TypeScript

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Backend framework: FastAPI (Python)

◇  Auto: Python 3.12 + Pydantic + Uvicorn

◆  Database: MongoDB

◇  Full stack configured:

  │  📦 dashboard-analytics/
  │  │
  │  ├── frontend/                → React 19 (TypeScript + Vite)
  │  │   ├── Tailwind CSS v4 (selected)
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

  ✔ Project ready
  Frontend:  cd frontend && npm install && npm run dev
  Backend:   cd backend && pip install -r requirements.txt && uvicorn main:app --reload
  All:       docker-compose up
```

### Example 6: Decoupled Web Fullstack — Vue.js + NestJS

```
$ grimox create

◆  Name: sistema-inventario

◆  Type: Decoupled Web Fullstack

◆  Frontend framework: Vue.js + Vite

◆  JavaScript or TypeScript?
│  ● TypeScript

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Backend framework: NestJS (TypeScript)

◇  Auto: TypeScript + NestJS CLI structure

◆  Database:
│  ● Supabase
│  ○ PostgreSQL
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis

◇  Full stack configured:

  │  📦 sistema-inventario/
  │  │
  │  ├── frontend/                → Vue.js 3 (TypeScript + Vite)
  │  │   ├── Tailwind CSS v4 (selected)
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

  ✔ Project ready
```

---

### Example 7: Web Frontend (SPA only) — Angular

```
$ grimox create

◆  Name: portal-clientes

◆  Type: Web Frontend (SPA only)

◆  Framework:
│  ○ React + Vite
│  ○ Vue.js + Vite
│  ● Angular
│  ○ Svelte + Vite

◇  Auto: Angular → TypeScript (required)

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Do you need to connect to a database?
│  ● Yes → Firebase
│  ○ No (frontend only)

◇  Stack configured:

  │  📦 portal-clientes/
  │  ├── Framework:  Angular 19 (TypeScript)
  │  ├── Database:   Firebase (Firestore + Auth)
  │  ├── Styles:     Tailwind CSS v4 (selected)
  │  ├── Docker:     Dockerfile multi-stage (nginx)
  │  ├── CI/CD:      GitHub Actions (lint, test, build)
  │  ├── Security:   environment.ts validation + CSP + Guards
  │  ├── AI:         .ai/rules.md + .ai/skills/
  │  └── Tests:      Karma + Jasmine

  ✔ Project ready
  cd portal-clientes && npm install && ng serve
```

### Example 8: Web Frontend (SPA only) — React

```
$ grimox create

◆  Name: landing-producto

◆  Type: Web Frontend (SPA only)

◆  Framework: React + Vite

◆  JavaScript or TypeScript?
│  ● TypeScript

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Do you need to connect to a database?
│  ○ Yes
│  ● No (frontend only)

◇  Stack configured:

  │  📦 landing-producto/
  │  ├── Framework:  React 19 (TypeScript + Vite)
  │  ├── Styles:     Tailwind CSS v4 (selected)
  │  ├── Docker:     Dockerfile multi-stage (nginx)
  │  ├── CI/CD:      GitHub Actions
  │  ├── AI:         .ai/rules.md + .ai/skills/
  │  └── Tests:      Vitest + Testing Library

  ✔ Project ready
  cd landing-producto && npm install && npm run dev
```

---

### Example 9: API / Backend (API only) — FastAPI

```
$ grimox create

◆  Name: api-sensores-iot

◆  Type: API / Backend (API only)

◆  Framework:
│  ● FastAPI (Python)
│  ○ NestJS (TypeScript)
│  ○ Hono (TypeScript)
│  ○ Fastify (JavaScript / TypeScript)
│  ○ Spring Boot (Java / Kotlin)

◇  Auto: Python 3.12 + Pydantic + Uvicorn

◆  Database: Turso

◇  Stack configured:

  │  📦 api-sensores-iot/
  │  ├── Framework:  FastAPI (Python 3.12)
  │  ├── ORM:        SQLAlchemy + Alembic (migrations)
  │  ├── Database:   Turso (libsql)
  │  ├── Server:     Uvicorn + Gunicorn
  │  ├── Validation: Pydantic v2
  │  ├── Docker:     Dockerfile + docker-compose.yml
  │  ├── CI/CD:      GitHub Actions (lint, test, docker)
  │  ├── Security:   pydantic-settings + CORS
  │  ├── AI:         .ai/rules.md + .ai/skills/ + MCP
  │  ├── API Docs:   Auto (Swagger + ReDoc)
  │  └── Tests:      pytest + httpx

  ✔ Project ready
  cd api-sensores-iot && pip install -r requirements.txt && uvicorn main:app --reload
  Docs: http://localhost:8000/docs
```

### Example 10: API / Backend — Spring Boot

```
$ grimox create

◆  Name: api-gestion-pedidos

◆  Type: API / Backend (API only)

◆  Framework: Spring Boot (Java / Kotlin)

◆  Java or Kotlin?
│  ● Java

◇  Auto: Java 21 + Maven + Spring Boot 3.x

◆  Database: Oracle SQL

◇  Stack configured:

  │  📦 api-gestion-pedidos/
  │  ├── Framework:  Spring Boot 3.x (Java 21)
  │  ├── Build:      Maven
  │  ├── ORM:        Spring Data JPA + Hibernate
  │  ├── Database:   Oracle SQL (ojdbc11)
  │  ├── Security:   Spring Security + JWT + CORS
  │  ├── Docker:     Dockerfile + docker-compose.yml (app + oracle-xe)
  │  ├── CI/CD:      GitHub Actions
  │  ├── AI:         .ai/rules.md + .ai/skills/ + MCP
  │  ├── API Docs:   SpringDoc OpenAPI (Swagger UI)
  │  └── Tests:      JUnit 5 + Mockito

  ✔ Project ready
  cd api-gestion-pedidos && ./mvnw spring-boot:run
  Swagger: http://localhost:8080/swagger-ui
```

### Example 11: API / Backend — Hono

```
$ grimox create

◆  Name: api-notificaciones

◆  Type: API / Backend (API only)

◆  Framework: Hono (TypeScript)

◇  Auto: TypeScript + Hono

◆  Database: Redis

◇  Stack configured:

  │  📦 api-notificaciones/
  │  ├── Framework:  Hono (TypeScript)
  │  ├── Runtime:    Node.js / Bun / Cloudflare Workers
  │  ├── Database:   Redis (ioredis)
  │  ├── Validation: Zod
  │  ├── Docker:     Dockerfile + docker-compose.yml (app + redis)
  │  ├── CI/CD:      GitHub Actions
  │  ├── AI:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      Vitest

  ✔ Project ready
  cd api-notificaciones && npm install && npm run dev
```

---

### Example 12: Mobile App — React Native (Expo)

```
$ grimox create

◆  Name: app-delivery

◆  Type: Mobile App

◆  Framework:
│  ● React Native (Expo)
│  ○ Flutter
│  ○ Flet (Python)

◇  Auto: TypeScript + Expo Router + NativeWind

◆  Which styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Material UI / Material Design
│  ○ Plain CSS (custom / corporate)

◆  Database: Firebase

◇  Stack configured:

  │  📦 app-delivery/
  │  ├── Framework:  React Native (Expo SDK 52)
  │  ├── Navigation: Expo Router
  │  ├── Styles:     NativeWind (Tailwind for RN)
  │  ├── Database:   Firebase (Firestore + Auth)
  │  ├── CI/CD:      GitHub Actions + EAS Build
  │  ├── AI:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      Jest + React Native Testing Library

  ✔ Project ready
  cd app-delivery && npm install && npx expo start
```

### Example 13: Mobile App — Flutter

```
$ grimox create

◆  Name: app-fitness

◆  Type: Mobile App

◆  Framework: Flutter

◇  Auto: Dart + Material 3

◆  Which styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Material UI / Material Design
│  ○ Plain CSS (custom / corporate)

◆  Database: Supabase

◇  Stack configured:

  │  📦 app-fitness/
  │  ├── Framework:  Flutter 3.x (Dart)
  │  ├── UI:         Material 3
  │  ├── State:      Riverpod
  │  ├── Database:   Supabase (supabase_flutter)
  │  ├── CI/CD:      GitHub Actions (build APK + IPA)
  │  ├── AI:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      flutter_test

  ✔ Project ready
  cd app-fitness && flutter pub get && flutter run
```

### Example 14: Mobile App — Flet

```
$ grimox create

◆  Name: app-control-gastos

◆  Type: Mobile App

◆  Framework: Flet (Python)

◇  Auto: Python 3.12 + Flet

◆  Database: Supabase

◇  Stack configured:

  │  📦 app-control-gastos/
  │  ├── Framework:  Flet (Python 3.12)
  │  ├── UI:         Flet components + Material Design
  │  ├── Database:   Supabase (supabase-py)
  │  ├── Build:      flet build (APK/IPA/Desktop)
  │  ├── AI:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      pytest

  ✔ Project ready
  cd app-control-gastos && pip install -r requirements.txt && flet run
```

---

### Example 15: Desktop App — Tauri

```
$ grimox create

◆  Name: editor-markdown

◆  Type: Desktop App

◆  Framework:
│  ● Tauri
│  ○ Electron
│  ○ Flet (Python)

◇  Auto: TypeScript + Rust + Tailwind + shadcn/ui

◆  Database: Turso (distributed SQLite)

◇  Stack configured:

  │  📦 editor-markdown/
  │  ├── Framework:  Tauri 2.x (Rust backend + React frontend)
  │  ├── Frontend:   React + TypeScript + Vite
  │  ├── Styles:     Tailwind CSS v4 (selected)
  │  ├── Database:   Turso (local SQLite + sync)
  │  ├── CI/CD:      GitHub Actions (build Windows/Mac/Linux)
  │  ├── AI:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      Vitest (frontend) + cargo test (backend)

  ✔ Project ready
  cd editor-markdown && npm install && npm run tauri dev
```

### Example 16: Desktop App — Electron

```
$ grimox create

◆  Name: gestor-archivos

◆  Type: Desktop App

◆  Framework: Electron

◆  JavaScript or TypeScript?
│  ● TypeScript

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Database: No database

◇  Stack configured:

  │  📦 gestor-archivos/
  │  ├── Framework:  Electron (TypeScript)
  │  ├── Renderer:   React + Vite
  │  ├── Styles:     Tailwind CSS v4 (selected)
  │  ├── Build:      electron-builder (Windows/Mac/Linux)
  │  ├── CI/CD:      GitHub Actions (build + release)
  │  ├── AI:         .ai/rules.md + .ai/skills/
  │  └── Tests:      Vitest + Playwright (E2E)

  ✔ Project ready
  cd gestor-archivos && npm install && npm run dev
```

### Example 17: Desktop App — Flet

```
$ grimox create

◆  Name: herramienta-reportes

◆  Type: Desktop App

◆  Framework: Flet (Python)

◇  Auto: Python 3.12 + Flet

◆  Database: PostgreSQL

◇  Stack configured:

  │  📦 herramienta-reportes/
  │  ├── Framework:  Flet (Python 3.12)
  │  ├── UI:         Flet components + Material Design
  │  ├── Database:   PostgreSQL (asyncpg + SQLAlchemy)
  │  ├── Build:      flet build (Windows/Mac/Linux executables)
  │  ├── AI:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      pytest

  ✔ Project ready
  cd herramienta-reportes && pip install -r requirements.txt && flet run
```

---

### Example 18: IoT / Embedded — Arduino (.ino)

```
$ grimox create

◆  Name: lampara-aurora

◆  Type: IoT / Embedded

◆  Framework:
│  ● Arduino (.ino)
│  ○ PlatformIO
│  ○ ESP-IDF
│  ○ MicroPython

◇  Auto: C++ + Arduino IDE structure

◆  Which board?
│  ● ESP32
│  ○ Arduino Uno
│  ○ Arduino Mega
│  ○ ESP8266
│  ○ Other

◇  Stack configured:

  │  📦 lampara-aurora/
  │  ├── lampara-aurora.ino       → Main setup() + loop()
  │  ├── config.h                 → Constants and pins
  │  ├── wifi_manager.h           → WiFi connection (ESP32)
  │  ├── libraries/               → Local libraries
  │  ├── .cursorrules             → Arduino/ESP32 best practices
  │  └── README.md                → Wiring diagram

  ✔ Project ready
  Open lampara-aurora.ino in Arduino IDE or import in PlatformIO
```

### Example 19: IoT / Embedded — PlatformIO

```
$ grimox create

◆  Name: sensor-temperatura

◆  Type: IoT / Embedded

◆  Framework: PlatformIO

◆  Which board?
│  ● ESP32 (esp32dev)
│  ○ ESP8266 (nodemcuv2)
│  ○ Arduino Uno (uno)
│  ○ Other

◇  Stack configured:

  │  📦 sensor-temperatura/
  │  ├── platformio.ini           → Board: esp32dev, framework: arduino
  │  ├── src/
  │  │   └── main.cpp             → setup() + loop()
  │  ├── include/
  │  │   └── config.h             → Constants
  │  ├── lib/                     → Project libraries
  │  ├── test/                    → Unit tests (Unity)
  │  ├── .cursorrules             → PlatformIO/ESP32 best practices
  │  └── README.md

  ✔ Project ready
  cd sensor-temperatura && pio run
```

### Example 20: IoT / Embedded — MicroPython

```
$ grimox create

◆  Name: estacion-clima

◆  Type: IoT / Embedded

◆  Framework: MicroPython

◇  Auto: Python (MicroPython)

◆  Which board?
│  ● ESP32
│  ○ Raspberry Pi Pico
│  ○ ESP8266

◇  Stack configured:

  │  📦 estacion-clima/
  │  ├── main.py                  → Entry point
  │  ├── boot.py                  → Initial configuration
  │  ├── config.py                → WiFi credentials, pins
  │  ├── lib/                     → MicroPython modules
  │  ├── .cursorrules             → MicroPython best practices
  │  └── README.md

  ✔ Project ready
  Upload files to your ESP32 using Thonny or mpremote
```

---

### Example 21: Data Analytics / AI

```
$ grimox create

◆  Name: predictor-ventas

◆  Type: Data Analytics / AI

◇  Auto: FastAPI + Python 3.12

◆  Database: PostgreSQL

◇  Stack configured:

  │  📦 predictor-ventas/
  │  ├── Framework:  FastAPI (Python 3.12)
  │  ├── ML:         scikit-learn + pandas + numpy
  │  ├── Database:   PostgreSQL + SQLAlchemy
  │  ├── Notebooks:  Jupyter (exploration)
  │  ├── Docker:     Dockerfile + docker-compose.yml (app + postgres + jupyter)
  │  ├── CI/CD:      GitHub Actions
  │  ├── AI:         .ai/rules.md + .ai/skills/ + MCP
  │  └── Tests:      pytest

  ✔ Project ready
  cd predictor-ventas && pip install -r requirements.txt && uvicorn main:app --reload
  Jupyter: docker-compose up jupyter → http://localhost:8888
```

---

### Example 22: Documentation — Astro

```
$ grimox create

◆  Name: docs-api-interna

◆  Type: Documentation

◆  Framework:
│  ● Astro (Starlight)
│  ○ Docusaurus
│  ○ VitePress

◇  Auto: TypeScript + Tailwind + Starlight

◇  Stack configured:

  │  📦 docs-api-interna/
  │  ├── Framework:  Astro + Starlight (TypeScript)
  │  ├── Styles:     Tailwind CSS v4 (selected)
  │  ├── Docker:     Dockerfile (nginx)
  │  ├── CI/CD:      GitHub Actions (build + deploy to Pages)
  │  ├── AI:         .ai/rules.md + .ai/skills/
  │  └── Content:    Markdown + MDX support

  ✔ Project ready
  cd docs-api-interna && npm install && npm run dev
```

---

### Example 23: CLI Tool

```
$ grimox create

◆  Name: migra-tool

◆  Type: CLI Tool

◇  Auto: Node.js + Commander.js + ESM

◇  Stack configured:

  │  📦 migra-tool/
  │  ├── bin/cli.js               → Entry point with shebang
  │  ├── src/
  │  │   ├── index.js             → Commander.js setup
  │  │   └── commands/            → Subcommands
  │  ├── package.json             → bin field configured
  │  ├── .cursorrules             → Node.js CLI best practices
  │  └── Tests:      Vitest

  ✔ Project ready
  cd migra-tool && npm install && npm link && migra-tool --help
```

---

## MIGRATE EXISTING PROJECT

### How migration works

Grimox requires an **AI model (LLM)** to migrate projects. Before starting
any migration, it automatically checks if you have access to an LLM:

```
Where it looks for LLMs:
  1. OS environment variables       → ANTHROPIC_API_KEY, OPENAI_API_KEY, etc.
  2. Project .env files             → same API keys
  3. IDEs with built-in LLM         → Cursor IDE, GitHub Copilot
  4. Local LLMs running             → Ollama (localhost:11434), LM Studio, Jan
  5. MCP configuration              → .mcp/config.json with AI servers

Project scanning (automatic by default):
  1. Looks for package.json, requirements.txt, pubspec.yaml, platformio.ini,
     pom.xml, build.gradle in root and subfolders (depth 1-2)
  2. Recognized folders: frontend/, backend/, client/, server/, api/,
     web/, app/, ui/, service/, packages/, apps/
  3. If multiple projects found → Decoupled Project
  4. If only one found → Monolithic Project

Manual paths (optional):
  grimox migrate --frontend=./client --backend=./server
```

---

### SCENARIO 0: NO LLM CONFIGURED

### Example 24: Grimox blocks migration without LLM

```
$ grimox migrate

◇  Checking available AI models...
◇  No AI models found

  ╭──────────────────────────────────────────────────────────╮
  │  ⚠ An AI model is required for migration                 │
  │                                                          │
  │  Migration requires an LLM to analyze your code          │
  │  and generate a consistent, personalized plan.           │
  │                                                          │
  │  Cloud (recommended):                                    │
  │  • Claude       → ANTHROPIC_API_KEY in .env              │
  │  • GPT / Codex  → OPENAI_API_KEY in .env                 │
  │  • Gemini       → GOOGLE_API_KEY in .env                 │
  │  • Grok         → GROK_API_KEY in .env                   │
  │  • GLM          → GLM_API_KEY in .env                    │
  │  • DeepSeek     → DEEPSEEK_API_KEY in .env               │
  │                                                          │
  │  Local:                                                  │
  │  • Ollama       → ollama serve (localhost:11434)          │
  │  • LM Studio    → Start server (localhost:1234)          │
  │  • Jan          → Start server (localhost:1337)          │
  │                                                          │
  │  Configure one of the above and run                      │
  │  grimox migrate again.                                   │
  ╰──────────────────────────────────────────────────────────╯
```

---

### SCENARIO A: MONOLITHIC PROJECT — SINGLE LLM DETECTED

### Example 25: Migrate monolithic project — jQuery → Next.js (with Claude)

```
$ cd sistema-ventas-viejo/
$ grimox migrate

◇  Checking available AI models...
◇  1 AI model(s) found
  ✓ AI Model: Claude (Anthropic) ☁️  (Environment variable: ANTHROPIC_API_KEY)

◇  Scanning project structure...

◆  Detected structure: Monolithic project

  📁 root/  →  jQuery + PHP 7.4

  ├── Docker:  ✗ Not detected
  └── CI/CD:   ✗ Not detected

◆  Stack — Project:
│  ├── Language     PHP 7.4 + JavaScript
│  ├── Framework    jQuery 3.3 (no modern framework)
│  ├── Build        Not detected
│  ├── Database     MySQL
│  ├── Styles       Bootstrap 3
│  └── Tests        ✗ Not detected
│
│  ⚠ jQuery detected → consider migrating to a modern framework

◆  What application type to migrate Project to?       ← NEW: asks target type
│  ● Integrated Web Fullstack    → Next.js, Nuxt, SvelteKit
│  ○ Decoupled Web Fullstack     → Separate Frontend + Backend
│  ○ Web Frontend (SPA only)     → React+Vite, Vue+Vite, Angular
│  ○ Desktop App                 → Tauri, Electron
│
│  ✗ Mobile App (not compatible)
│  ✗ IoT (not compatible)

◆  Choose the framework for Project:
│  ● Next.js 15 (Recommended)
│  ○ Nuxt 4
│  ○ SvelteKit

◆  Database?
│  ● Supabase (Recommended — ideal for fullstack apps with auth + storage)
│  ○ PostgreSQL
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ Keep MySQL (current)
│  ○ No database

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)        ← for proprietary corporate styles
│  ○ Styled Components (CSS-in-JS)

◆  Migration mode?
│  ● Generate plan (review before applying)
│  ○ Apply automatically (with backup)

◇  Analyzing source code with AI...           ← LLM reads the actual files
◇  Analysis completed

◇  Generating intelligent migration plan...   ← LLM generates specific steps
◇  Plan generated

  ╭─────────────────────────────────────────────────────╮
  │  ✔ AI-powered migration plan generated              │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  🤖 Model: Claude (Anthropic)                       │
  │  frontend (root/) → Next.js 15                      │
  │                                                     │
  │  The plan includes:                                 │
  │  • Architecture and detected patterns analysis      │
  │  • Specific steps file by file                      │
  │  • Before/after snippets for each change            │
  │  • MySQL → Supabase migration script                │
  │  • Dependencies to add/remove                       │
  │                                                     │
  │  To apply:  grimox migrate --apply                  │
  ╰─────────────────────────────────────────────────────╯

The generated MIGRATION_PLAN.md contains REAL analysis of your source code,
not generic steps. The LLM read your files and generated a plan
customized for YOUR project.
```

### Example 26: Migrate monolithic project — React CRA → modern Vite

```
$ cd mi-dashboard/
$ grimox migrate

◇  Checking available AI models...
◇  1 AI model(s) found
  ✓ AI Model: GPT / Codex (OpenAI) ☁️  (Environment variable: OPENAI_API_KEY)

◇  Scanning project structure...

◆  Detected structure: Monolithic project

  📁 root/  →  React ^17.0.2

  ├── Docker:  ✗ Not detected
  └── CI/CD:   ✗ Not detected

◆  Stack — Project:
│  ├── Language     JavaScript
│  ├── Framework    React ^17.0.2
│  ├── Build        Create React App
│  ├── Database     Firebase
│  ├── Styles       styled-components
│  └── Tests        ✓
│
│  ⚠ Create React App is deprecated → migrate to Vite or Next.js
│  ⚠ React ^17.0.2 → React 19 available

◆  What application type to migrate Project to?
│  ● Integrated Web Fullstack    → Next.js, Nuxt, SvelteKit
│  ○ Decoupled Web Fullstack     → Separate Frontend + Backend
│  ○ Web Frontend (SPA only)     → React+Vite, Vue+Vite, Angular
│  ○ Desktop App                 → Tauri, Electron

◆  Choose the framework for Project:        ← based on chosen type (SPA)
│  ● React + Vite (Recommended)
│  ○ Vue.js + Vite
│  ○ Angular
│  ○ Svelte + Vite

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Database?
│  ● Firebase (Recommended — keep current, already integrated)
│  ○ Supabase
│  ○ PostgreSQL
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ No database

◆  Migration mode?
│  ○ Generate plan (review before applying)
│  ● Apply automatically (with backup)

◇  Creating backup...                              ████████████ 100%
◇  Analyzing source code with AI...                ████████████ 100%
◇  Generating migration plan...                    ████████████ 100%
◇  Applying code transformations...                ████████████ 100%
  Transformed: src/App.jsx
  Transformed: src/components/Dashboard.jsx
  Transformed: src/services/firebase.js
◇  Transformations applied: 3/8 files

  ╭─────────────────────────────────────────────────────╮
  │  ✔ AI-powered migration applied                     │
  │                                                     │
  │  📁 .grimox-backup/ (original files)                │
  │  📄 MIGRATION_PLAN.md (detailed plan)               │
  │  🔄 Files transformed: 3/8                          │
  │                                                     │
  │  ⚠ 5 file(s) require manual review                 │
  ╰─────────────────────────────────────────────────────╯
```

### Example 27: Migrate monolithic project — Express.js → Hono

```
$ cd api-legacy/
$ grimox migrate

◇  Checking available AI models...
◇  1 AI model(s) found
  ✓ AI Model: Ollama (llama3.2) 💻  (http://localhost:11434)

◇  Scanning project structure...

◆  Detected structure: Monolithic project

  📁 root/  →  Express ^4.17.0

  ├── Docker:  ✓
  └── CI/CD:   ✗ Not detected

◆  Stack — Project:
│  ├── Language     JavaScript
│  ├── Framework    Express ^4.17.0
│  ├── Build        Not detected
│  ├── Database     MongoDB (Mongoose)
│  ├── Styles       Not detected
│  └── Tests        ✓

◆  What application type to migrate Project to?
│  ● API / Backend (API only)       → FastAPI, Hono, NestJS, Fastify, Spring Boot
│  ○ Integrated Web Fullstack       → Next.js, Nuxt, SvelteKit
│  ○ Decoupled Web Fullstack        → Separate Frontend + Backend
│
│  ✗ Web Frontend (not compatible — it's a backend)
│  ✗ Mobile App, IoT (not compatible)

◆  Choose the framework for Project:
│  ● Hono (Recommended)
│  ○ Fastify
│  ○ NestJS
│  ○ FastAPI
│  ○ Spring Boot

◆  Database?
│  ● MongoDB (Recommended — keep current, already integrated with Mongoose)
│  ○ Supabase
│  ○ PostgreSQL
│  ○ Firebase
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ No database

◆  Migration mode?
│  ● Generate plan (review before applying)
│  ○ Apply automatically (with backup)

◇  Analyzing source code with AI...             ████████████ 100%
◇  Generating intelligent migration plan...     ████████████ 100%

  ╭─────────────────────────────────────────────────────╮
  │  ✔ AI-powered migration plan generated              │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  🤖 Model: Ollama (llama3.2)                        │
  │  backend (root/) → Hono                             │
  │                                                     │
  │  Total: 6 steps                                     │
  │  To apply:  grimox migrate --apply                  │
  ╰─────────────────────────────────────────────────────╯
```

### Example 28: Migrate monolithic project — old Angular → modern Angular

```
$ cd panel-admin/
$ grimox migrate

◇  Checking available AI models...
◇  1 AI model(s) found
  ✓ AI Model: Claude (Anthropic) ☁️  (Environment variable: ANTHROPIC_API_KEY)

◇  Scanning project structure...

◆  Detected structure: Monolithic project

  📁 root/  →  Angular ^12.0.0

  ├── Docker:  ✗ Not detected
  └── CI/CD:   ✗ Not detected

◆  Stack — Project:
│  ├── Language     TypeScript
│  ├── Framework    Angular ^12.0.0
│  ├── Build        Not detected
│  ├── Database     Not detected
│  ├── Styles       Bootstrap
│  └── Tests        ✓
│
│  ⚠ Angular ^12.0.0 → Angular 19 available

◆  What application type to migrate Project to?
│  ● Web Frontend (SPA only)        → React+Vite, Vue+Vite, Angular, Svelte+Vite
│  ○ Integrated Web Fullstack       → Next.js, Nuxt, SvelteKit
│  ○ Decoupled Web Fullstack        → Separate Frontend + Backend
│  ○ Desktop App                    → Tauri, Electron

◆  Choose the framework for Project:
│  ● Angular (Recommended) — upgrade to Angular 19
│  ○ React + Vite
│  ○ Vue.js + Vite
│  ○ Svelte + Vite

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Migration mode?
│  ● Generate plan (review before applying)
│  ○ Apply automatically (with backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Migration plan generated                         │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  frontend (root/) → Angular                         │
  │                                                     │
  │  Total: 5 steps                                     │
  │  To apply:  grimox migrate --apply                  │
  ╰─────────────────────────────────────────────────────╯
```

---

### SCENARIO B: DECOUPLED PROJECT (frontend + backend in separate folders)

### SCENARIO B-1: MULTIPLE LLMs DETECTED

### Example 29: Grimox finds multiple LLMs and lets you choose

```
$ grimox migrate

◇  Checking available AI models...
◇  3 AI model(s) found

◆  Which AI model to use for migration?
│  ● Claude (Anthropic) (Recommended)   ☁️  Cloud — Environment variable: ANTHROPIC_API_KEY
│  ○ GPT / Codex (OpenAI)               ☁️  Cloud — Environment variable: OPENAI_API_KEY
│  ○ Ollama (llama3.2)                   💻 Local — http://localhost:11434

  ✓ AI Model: Claude (Anthropic) ☁️  (Environment variable: ANTHROPIC_API_KEY)

◇  Scanning project structure...

  ...normal migration flow continues...
```

---

### SCENARIO C: DECOUPLED PROJECT (frontend + backend in separate folders)

### Example 30: Automatic scan — React CRA + Express (common folders)

Project structure:
```
mi-plataforma/
├── frontend/          ← package.json with React 16 + CRA
├── backend/           ← package.json with Express 4
└── docker-compose.yml
```

```
$ cd mi-plataforma/
$ grimox migrate

◇  Checking available AI models...
◇  1 AI model(s) found
  ✓ AI Model: Claude (Anthropic) ☁️  (Environment variable: ANTHROPIC_API_KEY)

◇  Scanning project structure...

◆  Detected structure: Decoupled project

  🖥️  frontend/   →  React ^16.8.0
  ⚙️  backend/    →  Express ^4.17.0

  ├── Docker:  ✓
  └── CI/CD:   ✗ Not detected

◆  What do you want to migrate?
│  ● Everything (frontend + backend)
│  ○ Frontend only (frontend/)
│  ○ Backend only (backend/)

◆  Stack — frontend (frontend/):
│  ├── Language     JavaScript
│  ├── Framework    React ^16.8.0
│  ├── Build        Create React App
│  ├── Database     Not detected
│  ├── Styles       Bootstrap
│  └── Tests        ✓
│
│  ⚠ Create React App is deprecated → migrate to Vite or Next.js
│  ⚠ React ^16.8.0 → React 19 available

◆  What application type to migrate frontend (frontend/) to?
│  ● Integrated Web Fullstack    → Next.js, Nuxt, SvelteKit
│  ○ Decoupled Web Fullstack     → Separate Frontend + Backend
│  ○ Web Frontend (SPA only)     → React+Vite, Vue+Vite, Angular
│  ○ Desktop App                 → Tauri, Electron

◆  Choose the framework for frontend (frontend/):
│  ● React + Vite (Recommended)
│  ○ Vue.js + Vite
│  ○ Angular
│  ○ Svelte + Vite

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Stack — backend (backend/):
│  ├── Language     JavaScript
│  ├── Framework    Express ^4.17.0
│  ├── Build        Not detected
│  ├── Database     PostgreSQL
│  ├── Styles       Not detected
│  └── Tests        ✗ Not detected

◆  What application type to migrate backend (backend/) to?
│  ● API / Backend (API only)       → FastAPI, Hono, NestJS, Fastify, Spring Boot
│  ○ Integrated Web Fullstack       → Next.js, Nuxt, SvelteKit
│  ○ Decoupled Web Fullstack        → Separate Frontend + Backend

◆  Choose the framework for backend (backend/):
│  ● Hono (Recommended)
│  ○ Fastify
│  ○ NestJS
│  ○ FastAPI
│  ○ Spring Boot

◆  Database?
│  ● PostgreSQL (Recommended — keep current)
│  ○ Supabase
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ No database

◆  Migration mode?
│  ● Generate plan (review before applying)
│  ○ Apply automatically (with backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Migration plan generated                         │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  frontend (frontend/) → React + Vite                │
  │  backend (backend/) → Hono                          │
  │                                                     │
  │  Total: 12 steps                                    │
  │  To apply:  grimox migrate --apply                  │
  ╰─────────────────────────────────────────────────────╯
```

### Example 31: Automatic scan — Angular + Flask (common folders)

Project structure:
```
sistema-rrhh/
├── client/            ← package.json with Angular 12
├── server/            ← requirements.txt with Flask
├── docker-compose.yml
└── .github/workflows/ci.yml
```

```
$ cd sistema-rrhh/
$ grimox migrate

◇  Scanning project structure...

◆  Detected structure: Decoupled project

  🖥️  client/   →  Angular ^12.0.0
  ⚙️  server/   →  Flask

  ├── Docker:  ✓
  └── CI/CD:   ✓

◆  What do you want to migrate?
│  ● Everything (frontend + backend)
│  ○ Frontend only (client/)
│  ○ Backend only (server/)

◆  Stack — frontend (client/):
│  ├── Language     TypeScript
│  ├── Framework    Angular ^12.0.0
│  ├── Build        Not detected
│  ├── Database     Not detected
│  ├── Styles       Bootstrap
│  └── Tests        ✓
│
│  ⚠ Angular ^12.0.0 → Angular 19 available

◆  What application type to migrate frontend (client/) to?
│  ● Web Frontend (SPA only)        → React+Vite, Vue+Vite, Angular, Svelte
│  ○ Integrated Web Fullstack       → Next.js, Nuxt, SvelteKit
│  ○ Decoupled Web Fullstack        → Separate Frontend + Backend
│  ○ Desktop App                    → Tauri, Electron

◆  Choose the framework for frontend (client/):
│  ● Angular (Recommended) — upgrade to Angular 19
│  ○ React + Vite
│  ○ Vue.js + Vite
│  ○ Svelte + Vite

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Stack — backend (server/):
│  ├── Language     Python
│  ├── Framework    Flask
│  ├── Build        Not detected
│  ├── Database     PostgreSQL
│  ├── Styles       Not detected
│  └── Tests        ✓

◆  What application type to migrate backend (server/) to?
│  ● API / Backend (API only)       → FastAPI, Hono, NestJS, Fastify, Spring Boot
│  ○ Integrated Web Fullstack       → Next.js, Nuxt, SvelteKit

◆  Choose the framework for backend (server/):
│  ● FastAPI (Recommended)
│  ○ Hono
│  ○ NestJS
│  ○ Fastify
│  ○ Spring Boot

◆  Database?
│  ● PostgreSQL (Recommended — keep current)
│  ○ Supabase
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ No database

◆  Migration mode?
│  ● Generate plan (review before applying)
│  ○ Apply automatically (with backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Migration plan generated                         │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  frontend (client/) → Angular                       │
  │  backend (server/) → FastAPI                        │
  │                                                     │
  │  Total: 10 steps                                    │
  │  To apply:  grimox migrate --apply                  │
  ╰─────────────────────────────────────────────────────╯
```

### Example 32: Migrate only one part — Frontend only from a decoupled project

```
$ cd mi-plataforma/
$ grimox migrate

◇  Scanning project structure...

◆  Detected structure: Decoupled project

  🖥️  frontend/   →  React ^16.8.0
  ⚙️  backend/    →  Express ^4.17.0

  ├── Docker:  ✓
  └── CI/CD:   ✗ Not detected

◆  What do you want to migrate?
│  ○ Everything (frontend + backend)
│  ● Frontend only (frontend/)          ← Chooses frontend only
│  ○ Backend only (backend/)

◆  Stack — frontend (frontend/):
│  ├── Language     JavaScript
│  ├── Framework    React ^16.8.0
│  ├── Build        Create React App
│  ├── Database     Not detected
│  ├── Styles       styled-components
│  └── Tests        ✓
│
│  ⚠ Create React App is deprecated → migrate to Vite or Next.js
│  ⚠ React ^16.8.0 → React 19 available

◆  What application type to migrate frontend (frontend/) to?
│  ● Web Frontend (SPA only)        → React+Vite, Vue+Vite, Angular, Svelte
│  ○ Integrated Web Fullstack       → Next.js, Nuxt, SvelteKit
│  ○ Desktop App                    → Tauri, Electron

◆  Choose the framework for frontend (frontend/):
│  ● React + Vite (Recommended)
│  ○ Vue.js + Vite
│  ○ Angular
│  ○ Svelte + Vite

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Migration mode?
│  ● Generate plan (review before applying)
│  ○ Apply automatically (with backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Migration plan generated                         │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  frontend (frontend/) → React + Vite                │
  │                                                     │
  │  Total: 4 steps                                     │
  │  To apply:  grimox migrate --apply                  │
  ╰─────────────────────────────────────────────────────╯
```

---

### SCENARIO C: MANUAL PATHS (folders with non-standard names)

### Example 33: Manual paths — Folders with unusual names

Project structure:
```
proyecto-empresa/
├── modulo-web/            ← non-standard name
│   └── package.json       (Vue 2)
├── servicios/api-core/    ← 2 levels deep
│   └── requirements.txt   (Django)
└── otro-modulo/           ← nothing to migrate
```

Without flags, automatic scanning might not find `servicios/api-core/`.
We use manual paths:

```
$ cd proyecto-empresa/
$ grimox migrate --frontend=./modulo-web --backend=./servicios/api-core

◇  Scanning specified paths...

◆  Detected structure: Decoupled project

  🖥️  ./modulo-web/              →  Vue ^2.6.0
  ⚙️  ./servicios/api-core/      →  Django

  ├── Docker:  ✗ Not detected
  └── CI/CD:   ✗ Not detected

◆  What do you want to migrate?
│  ● Everything (frontend + backend)
│  ○ Frontend only (./modulo-web/)
│  ○ Backend only (./servicios/api-core/)

◆  Stack — frontend (./modulo-web/):
│  ├── Language     JavaScript
│  ├── Framework    Vue ^2.6.0
│  ├── Build        Webpack
│  ├── Database     Not detected
│  ├── Styles       Not detected
│  └── Tests        ✗ Not detected
│
│  ⚠ Vue ^2.6.0 → Vue 3 available (breaking changes)

◆  What application type to migrate frontend (./modulo-web/) to?
│  ● Integrated Web Fullstack       → Next.js, Nuxt, SvelteKit
│  ○ Web Frontend (SPA only)        → React+Vite, Vue+Vite, Angular, Svelte
│  ○ Desktop App                    → Tauri, Electron

◆  Choose the framework for frontend (./modulo-web/):
│  ● Nuxt 4 (Recommended)
│  ○ Next.js 15
│  ○ SvelteKit

◆  Which CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Plain Sass / SCSS
│  ○ Plain CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)

◆  Stack — backend (./servicios/api-core/):
│  ├── Language     Python
│  ├── Framework    Django
│  ├── Build        Not detected
│  ├── Database     PostgreSQL
│  ├── Styles       Not detected
│  └── Tests        ✓

◆  What application type to migrate backend (./servicios/api-core/) to?
│  ● API / Backend (API only)       → FastAPI, Hono, NestJS, Fastify, Spring Boot

◆  Choose the framework for backend (./servicios/api-core/):
│  ● FastAPI (Recommended)
│  ○ Hono
│  ○ NestJS
│  ○ Fastify
│  ○ Spring Boot

◆  Database?
│  ● Supabase (Recommended — auth + storage + realtime built-in)
│  ○ PostgreSQL (keep current)
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ No database

◆  Migration mode?
│  ● Generate plan (review before applying)
│  ○ Apply automatically (with backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Migration plan generated                         │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  frontend (./modulo-web/) → Nuxt 4                  │
  │  backend (./servicios/api-core/) → FastAPI           │
  │                                                     │
  │  Total: 9 steps                                     │
  │  To apply:  grimox migrate --apply                  │
  ╰─────────────────────────────────────────────────────╯
```

### Example 34: Partial manual path — Only specify frontend, auto-scan backend

Project structure:
```
mi-app/
├── portal/             ← unusual name, non-standard
│   └── package.json     (React 17)
├── api/                ← standard name, detected automatically
│   └── package.json     (Express)
└── docs/
```

```
$ cd mi-app/
$ grimox migrate --frontend=./portal

◇  Scanning specified path + auto-scanning the rest...

◆  Detected structure: Decoupled project

  🖥️  ./portal/   →  React ^17.0.2
  ⚙️  api/        →  Express ^4.18.0     ← detected automatically

  ├── Docker:  ✗ Not detected
  └── CI/CD:   ✗ Not detected

◆  What do you want to migrate?
│  ● Everything (frontend + backend)
│  ○ Frontend only (./portal/)
│  ○ Backend only (api/)

  ...normal migration flow continues...
```

### Example 35: Manual path — Only migrate the backend

```
$ cd proyecto-grande/
$ grimox migrate --backend=./services/main-api

◇  Scanning specified path...

◆  Detected structure: Monolithic project

  ⚙️  ./services/main-api/   →  Express ^4.17.0

  ├── Docker:  ✗ Not detected
  └── CI/CD:   ✗ Not detected

◆  Stack — backend (./services/main-api/):
│  ├── Language     TypeScript
│  ├── Framework    Express ^4.17.0
│  ├── Build        Not detected
│  ├── Database     MongoDB (Mongoose)
│  ├── Styles       Not detected
│  └── Tests        ✓

◆  What application type to migrate backend (./services/main-api/) to?
│  ● API / Backend (API only)       → FastAPI, Hono, NestJS, Fastify, Spring Boot

◆  Choose the framework for backend (./services/main-api/):
│  ● Hono (Recommended)
│  ○ FastAPI
│  ○ NestJS
│  ○ Fastify
│  ○ Spring Boot

◆  Database?
│  ● MongoDB (Recommended — keep current)
│  ○ Supabase
│  ○ PostgreSQL
│  ○ Firebase
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ No database
│  ○ Supabase
│  ○ PostgreSQL

◆  Migration mode?
│  ● Generate plan (review before applying)
│  ○ Apply automatically (with backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Migration plan generated                         │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  backend (./services/main-api/) → Hono              │
  │                                                     │
  │  Total: 6 steps                                     │
  │  To apply:  grimox migrate --apply                  │
  ╰─────────────────────────────────────────────────────╯
```

---

### SCENARIO D: PROJECT NOT FOUND

### Example 36: No project found

```
$ cd carpeta-vacia/
$ grimox migrate

◇  Scanning project structure...

⚠  No project found in this folder or subfolders.
ℹ  You can specify paths manually:
ℹ    grimox migrate --frontend=./client --backend=./server
```

---

### SCENARIO E: MONOREPO WITH MULTIPLE APPS

### Example 37: Monorepo with packages/ or apps/

Project structure:
```
mi-monorepo/
├── packages/
│   ├── web/               ← package.json with React 17
│   └── api/               ← package.json with Express 4
├── package.json           ← monorepo root (workspaces)
└── turbo.json
```

```
$ cd mi-monorepo/
$ grimox migrate

◇  Scanning project structure...

◆  Detected structure: Decoupled project

  🖥️  packages/web/   →  React ^17.0.2
  ⚙️  packages/api/   →  Express ^4.18.0

  ├── Docker:  ✗ Not detected
  └── CI/CD:   ✗ Not detected

◆  What do you want to migrate?
│  ● Everything (frontend + backend)
│  ○ Frontend only (packages/web/)
│  ○ Backend only (packages/api/)

  ...normal migration flow continues...
```

---

### SCENARIO F: APPLY MIGRATION WITH BACKUP

### Example 38: Apply migration automatically (with backup + AI transformation)

```
$ cd mi-plataforma/
$ grimox migrate --apply

◇  Checking available AI models...
  ✓ AI Model: Claude (Anthropic) ☁️  (Environment variable: ANTHROPIC_API_KEY)

◇  Scanning project structure...

◆  Detected structure: Decoupled project

  🖥️  frontend/   →  React ^16.8.0
  ⚙️  backend/    →  Express ^4.17.0

  ├── Docker:  ✓
  └── CI/CD:   ✗ Not detected

◆  What do you want to migrate?
│  ● Everything (frontend + backend)

  ...target type + frameworks + database selection...

◇  Creating backup...                                  ████████████ 100%
◇  Backup created at .grimox-backup/

◇  Analyzing source code with AI...                    ████████████ 100%
◇  Analysis completed

◇  Generating migration plan...                        ████████████ 100%
◇  Plan generated

◇  Applying code transformations...                    ████████████ 100%
  Transformed: frontend/src/App.jsx
  Transformed: frontend/src/components/Header.jsx
  Transformed: frontend/src/components/UserList.jsx
  Transformed: frontend/src/services/api.js
  Transformed: backend/routes/users.js
  Transformed: backend/routes/auth.js
  Transformed: backend/models/User.js
◇  Transformations applied: 7/12 files

  ╭─────────────────────────────────────────────────────╮
  │  ✔ AI-powered migration applied                     │
  │                                                     │
  │  📁 .grimox-backup/ (original files)                │
  │     ├── frontend/   (full copy)                     │
  │     └── backend/    (full copy)                     │
  │  📄 MIGRATION_PLAN.md (detailed plan)               │
  │  🔄 Files transformed: 7/12                         │
  │                                                     │
  │  ⚠ 5 file(s) require manual review                 │
  ╰─────────────────────────────────────────────────────╯

The LLM transformed 7 files automatically. The remaining 5
are too complex for automatic transformation — check
MIGRATION_PLAN.md for manual migration instructions.

The backup at .grimox-backup/ contains the original files.
If something fails: cp -r .grimox-backup/* .
```

---

### SCENARIO G: SPRING BOOT / JAVA (Maven or Gradle)

### Example 39: Migrate old Spring Boot

Project structure:
```
api-corporativa/
├── pom.xml                ← Maven + Spring Boot 2.x
├── src/main/java/...
└── src/test/java/...
```

```
$ cd api-corporativa/
$ grimox migrate

◇  Scanning project structure...

◆  Detected structure: Monolithic project

  📁 root/  →  Spring Boot (Maven)

  ├── Docker:  ✗ Not detected
  └── CI/CD:   ✗ Not detected

◆  Stack — Project:
│  ├── Language     Java
│  ├── Framework    Spring Boot
│  ├── Build        Maven
│  ├── Database     Not detected
│  ├── Styles       Not detected
│  └── Tests        ✗ Not detected

◆  What application type to migrate Project to?
│  ● API / Backend (API only)       → FastAPI, Hono, NestJS, Fastify, Spring Boot
│  ○ Integrated Web Fullstack       → Next.js, Nuxt, SvelteKit
│  ○ Decoupled Web Fullstack        → Separate Frontend + Backend

◆  Choose the framework for Project:
│  ● Spring Boot (Recommended) — upgrade to Spring Boot 3.x + Java 21
│  ○ FastAPI
│  ○ Hono
│  ○ NestJS
│  ○ Fastify

◆  Database?
│  ● PostgreSQL (Recommended — standard for Spring Boot)
│  ○ Supabase
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
│  ○ No database

◆  Migration mode?
│  ● Generate plan (review before applying)
│  ○ Apply automatically (with backup)

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Migration plan generated                         │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  backend (root/) → Spring Boot                      │
  │                                                     │
  │  Total: 7 steps                                     │
  │  To apply:  grimox migrate --apply                  │
  ╰─────────────────────────────────────────────────────╯
```

---

### MIGRATION COMMANDS SUMMARY

```
# Automatic scan (default)
grimox migrate

# Apply directly (with automatic backup)
grimox migrate --apply

# Only view plan without applying
grimox migrate --plan

# Specify paths manually
grimox migrate --frontend=./client --backend=./server

# Only migrate frontend (manual path)
grimox migrate --frontend=./modulo-web

# Only migrate backend (manual path)
grimox migrate --backend=./servicios/api-core

# Combine: one manual path + auto-scan the rest
grimox migrate --frontend=./portal

# Manual path + apply directly
grimox migrate --frontend=./client --backend=./api --apply
```

---

## MIGRATION FROM AI-POWERED IDEs (Skill `/grimox-migrate`)

Grimox generates the `/grimox-migrate` skill in `.ai/skills/` when creating any project.
This is the universal location — any LLM can read it. For Claude Code and Open Code
it is also automatically generated in `.claude/commands/` as an adapter (slash commands).

For IDEs that read `.cursorrules` (Cursor, Antigravity, Trae, Windsurf), the framework
rules are already included in `.ai/rules.md` and replicated in `.cursorrules`.
For Copilot, `.github/copilot-instructions.md` is generated.

```
Where each integration works:

  grimox migrate (CLI)           → Any terminal (standalone)
  /grimox-migrate (Skill)        → Claude Code, Open Code  (.claude/commands/ — adapter)
  .ai/skills/grimox-migrate.md   → Any LLM  (open and use as prompt)
  .ai/rules.md                   → Any LLM  (stack rules)
  .cursorrules                   → Cursor, Antigravity, Trae, Windsurf  (adapter)
  .github/copilot-instructions.md→ GitHub Copilot  (adapter)
  /grimox-dev (Skill)            → Claude Code, Open Code
  /grimox-docs (Skill)           → Claude Code, Open Code

All use AI to analyze real code. The difference is the environment:
  - CLI: connects to an LLM via API (Claude, GPT, Ollama, etc.)
  - Skills: uses the IDE's built-in LLM directly
```

---

### Example 40: Migration from IDE — React CRA + Express → Next.js 15

```
$ cd mi-plataforma/
$ claude    ← Open Claude Code in the project

> /grimox-migrate

◇  Grimox Migration activated

────────────────────────────────────────────
 PHASE 1: Project Analysis
────────────────────────────────────────────

◇  Scanning project structure...

  📁 Structure: Decoupled project

  🖥️  frontend/   →  React ^16.8.0 (JavaScript)
  ⚙️  backend/    →  Express ^4.17.0 (JavaScript)

  ├── Docker:  ✗ Not detected
  └── CI/CD:   ✗ Not detected

◇  Analyzing source code (intelligent sampling)...

  📊 Project scale:
  │  frontend/  →  47 files (.jsx: 28, .css: 12, .js: 7)
  │  backend/   →  23 files (.js: 18, .json: 3, .sql: 2)

  🔍 Detected patterns — frontend:
  │  ├── Components:    12 class components, 16 functional
  │  ├── State:         Redux (react-redux + redux-thunk)
  │  ├── Routing:       React Router v5 (<Switch>, <Route>)
  │  ├── Auth:          Manual JWT (localStorage)
  │  ├── Styling:       styled-components
  │  ├── HTTP:          axios (12 calls to /api/*)
  │  ├── Forms:         Formik + Yup
  │  └── Tests:         Jest + React Testing Library (8 files)

  🔍 Detected patterns — backend:
  │  ├── Modules:       CommonJS (require/module.exports)
  │  ├── Middleware:     cors, helmet, express-session, multer
  │  ├── Auth:          Passport.js (local + JWT strategy)
  │  ├── DB:            PostgreSQL (pg + raw SQL queries)
  │  ├── Uploads:       multer → local disk
  │  ├── Email:         Nodemailer (SMTP)
  │  └── Tests:         Mocha + chai (5 files)

  🔗 External integrations detected:
  │  ├── Stripe (payments)       → stripe SDK v12
  │  ├── SendGrid (email)        → @sendgrid/mail
  │  ├── Cloudinary (images)     → cloudinary SDK
  │  └── Google Analytics        → react-ga

  🔑 Environment variables (14 found):
  │  ├── REACT_APP_API_URL          → used in 8 files
  │  ├── REACT_APP_STRIPE_KEY       → used in 2 files
  │  ├── DATABASE_URL               → used in 1 file
  │  ├── JWT_SECRET                  → used in 3 files
  │  ├── STRIPE_SECRET_KEY          → used in 2 files
  │  ├── SENDGRID_API_KEY           → used in 1 file
  │  ├── CLOUDINARY_URL             → used in 1 file
  │  └── ... (7 more)

  📦 Classified dependencies:
  │  ├── Migratable:    18 (axios→fetch, express→API Routes, pg→Prisma)
  │  ├── Keepable:      12 (stripe, dayjs, uuid, lodash, zod)
  │  ├── Rewritable:     4 (passport→NextAuth, multer→Supabase Storage)
  │  └── Removable:      8 (react-scripts, redux-thunk, react-router-dom v5)

  ⚠ Issues detected:
  │  ├── Create React App is deprecated
  │  ├── React ^16.8.0 → React 19 available
  │  ├── 12 class components need conversion to functional
  │  ├── Redux with thunks → obsolete pattern (Server Actions replace it)
  │  ├── Raw SQL queries → SQL injection risk in 3 endpoints
  │  ├── JWT in localStorage → XSS vulnerability
  │  └── CommonJS in backend → needs migration to ESM

  📈 Estimated complexity:
  │  ├── frontend: HIGH (class components + Redux + Router v5)
  │  ├── backend:  MEDIUM (standard Express, no ORM)
  │  └── Total:    HIGH

────────────────────────────────────────────
 PHASE 2: Target Stack Selection
────────────────────────────────────────────

◇  Recommendation based on analysis:

  Next.js 15 (Integrated Fullstack) — Recommended because:
  │  ├── Unifies frontend + backend (eliminates Express)
  │  ├── Server Components eliminate the need for Redux for data fetching
  │  ├── Server Actions replace simple REST endpoints
  │  ├── File-based routing replaces React Router
  │  ├── TypeScript + Tailwind replace styled-components
  │  └── Supabase as DB replaces pg raw queries + adds secure Auth

  Confirm? → Yes, Next.js 15 + Supabase

────────────────────────────────────────────
 PHASE 3: MIGRATION_PLAN.md Generated
────────────────────────────────────────────

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ AI-powered migration plan generated                  │
  │                                                          │
  │  📄 MIGRATION_PLAN.md                                    │
  │  AI Model: Claude (Anthropic)                            │
  │                                                          │
  │  Stack:     React 16 + Express → Next.js 15 + Supabase  │
  │  Files:     70 files analyzed                            │
  │  Actions:   28 CONVERT, 12 REWRITE, 8 DELETE,           │
  │             15 ADAPT, 7 KEEP                             │
  │  Phases:    10                                           │
  │  Steps:     47 detailed steps                            │
  │                                                          │
  │  Quick-start:                                            │
  │  1. npx create-next-app@latest mi-plataforma-v2 --ts    │
  │  2. npm i @supabase/supabase-js stripe dayjs             │
  │  3. cp -r frontend/src/utils/* src/lib/                  │
  │  4. Follow MIGRATION_PLAN.md phase by phase              │
  ╰──────────────────────────────────────────────────────────╯
```

### Example 41: Migration from IDE — Vue 2 + Vuex + Django → Nuxt 4 + FastAPI

```
$ cd sistema-inventario/
$ claude

> /grimox-migrate

◇  Grimox Migration activated

────────────────────────────────────────────
 PHASE 1: Project Analysis
────────────────────────────────────────────

◇  Scanning project structure...

  📁 Structure: Decoupled project

  🖥️  client/    →  Vue ^2.6.14 (JavaScript)
  ⚙️  server/    →  Django 3.2 (Python)

  ├── Docker:  ✓ (docker-compose.yml)
  └── CI/CD:   ✓ (.github/workflows/ci.yml)

◇  Analyzing source code...

  📊 Scale:
  │  client/  →  62 files (.vue: 38, .js: 18, .css: 6)
  │  server/  →  45 files (.py: 35, .html: 5, .sql: 5)

  🔍 Detected patterns — client (Vue 2):
  │  ├── API:          Options API (100% — no Composition API)
  │  ├── State:        Vuex 3 (4 modules: auth, products, orders, ui)
  │  ├── Routing:      Vue Router 3 (12 routes, 3 with guards)
  │  ├── Auth:         JWT token in Vuex + axios interceptor
  │  ├── UI:           BootstrapVue (v-b-* components)
  │  ├── Forms:        VeeValidate v3 (6 forms)
  │  ├── i18n:         vue-i18n (Spanish + English)
  │  ├── Mixins:       4 global mixins (auth, pagination, filters, toast)
  │  └── Filters:      5 Vue filters (currency, date, truncate, uppercase, slug)

  🔍 Detected patterns — server (Django):
  │  ├── ORM:          Django ORM (12 models, 5 M2M relationships)
  │  ├── Admin:        Custom Django Admin (8 ModelAdmin)
  │  ├── Auth:         Django Rest Framework + JWT (drf-simplejwt)
  │  ├── API:          DRF ViewSets (8 viewsets, 15 serializers)
  │  ├── Signals:      3 signals (post_save, pre_delete)
  │  ├── Management:   2 custom commands (import_data, generate_report)
  │  ├── Templates:    5 Django templates (emails + PDF reports)
  │  ├── Celery:       4 async tasks (emails, reports, sync)
  │  └── Tests:        pytest + factory_boy (22 files)

  ⚠ Issues detected:
  │  ├── Vue 2 EOL (end of life) → severe breaking changes to Vue 3
  │  ├── Vuex 3 → Pinia (completely different API)
  │  ├── Options API → Composition API (rewrite all components)
  │  ├── Vue filters removed in Vue 3 → rewrite as functions
  │  ├── Mixins → Composables (different pattern)
  │  ├── BootstrapVue is NOT compatible with Vue 3
  │  ├── Django Admin → no direct equivalent in FastAPI
  │  ├── Celery tasks → FastAPI BackgroundTasks or equivalent
  │  └── Django signals → manual event handlers

  📈 Estimated complexity:
  │  ├── client: CRITICAL (Vue 2→3 breaking changes + Vuex + BootstrapVue)
  │  ├── server: HIGH (Django ORM + Admin + Celery + Signals)
  │  └── Total:  CRITICAL

────────────────────────────────────────────
 PHASE 2: Target Stack Selection
────────────────────────────────────────────

◇  Recommendation:

  Nuxt 4 + FastAPI — Recommended because:
  │  ├── Nuxt 4 includes auto-imports, built-in Pinia, file-based routing
  │  ├── Composition API with <script setup> is more concise
  │  ├── PrimeVue replaces BootstrapVue (Vue 3 compatible)
  │  ├── FastAPI keeps the team's Python ecosystem
  │  ├── SQLAlchemy async replaces Django ORM
  │  └── vue-i18n v9 is compatible with Nuxt 4

  Confirm? → Yes, Nuxt 4 + FastAPI + PostgreSQL (keep)

────────────────────────────────────────────
 PHASE 3: MIGRATION_PLAN.md Generated
────────────────────────────────────────────

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ AI-powered migration plan generated                  │
  │                                                          │
  │  📄 MIGRATION_PLAN.md                                    │
  │  AI Model: Claude (Anthropic)                            │
  │                                                          │
  │  Frontend:  Vue 2 + Vuex → Nuxt 4 + Pinia               │
  │  Backend:   Django 3.2 → FastAPI                         │
  │  Database:  PostgreSQL (keep data)                        │
  │  Files:     107 files analyzed                           │
  │  Actions:   38 REWRITE, 24 CONVERT, 18 ADAPT,           │
  │             15 DELETE, 12 KEEP                           │
  │  Phases:    10                                           │
  │  Steps:     63 detailed steps                            │
  │                                                          │
  │  ⚠ CRITICAL complexity — it is recommended to migrate    │
  │    frontend and backend in separate sprints               │
  ╰──────────────────────────────────────────────────────────╯
```

### Example 42: Migration from IDE — Angular 12 → Angular 19 (upgrade in-place)

```
$ cd panel-admin/
$ claude

> /grimox-migrate

◇  Grimox Migration activated

────────────────────────────────────────────
 PHASE 1: Project Analysis
────────────────────────────────────────────

◇  Scanning project structure...

  📁 Structure: Monolithic project

  📁 root/  →  Angular ^12.0.0 (TypeScript)

  ├── Docker:  ✗ Not detected
  └── CI/CD:   ✗ Not detected

◇  Analyzing source code...

  📊 Scale: 85 files (.ts: 52, .html: 22, .scss: 11)

  🔍 Detected patterns:
  │  ├── Components:  35 components in NgModule (0 standalone)
  │  ├── Modules:     8 NgModules (AppModule, SharedModule, 6 feature modules)
  │  ├── State:       NgRx (4 stores, 12 actions, 8 effects, 6 selectors)
  │  ├── Routing:     Angular Router with lazy loading (loadChildren)
  │  ├── Auth:        Guard + Interceptor + JWT
  │  ├── Forms:       Reactive Forms (template-driven in 3 components)
  │  ├── HTTP:        HttpClient with interceptors (auth, error, loading)
  │  ├── Pipes:       6 custom pipes (currency, date-ago, filesize, etc.)
  │  ├── Directives:  2 custom directives (click-outside, autofocus)
  │  ├── UI:          Angular Material 12 + custom theme
  │  ├── RxJS:        Extensive usage (switchMap, combineLatest, BehaviorSubject)
  │  └── Tests:       Karma + Jasmine (18 .spec.ts files)

  📦 Classified dependencies:
  │  ├── Upgradable:  22 (@angular/*, rxjs, @ngrx/*, @angular/material)
  │  ├── Keepable:     8 (lodash, dayjs, uuid, file-saver)
  │  └── Removable:    3 (codelyzer — deprecated since Angular 12)

  ⚠ Issues detected:
  │  ├── Angular 12 → 7 major versions behind
  │  ├── NgModules → must migrate to standalone (35 components)
  │  ├── NgRx obsolete patterns → recommend signals or NgRx signals
  │  ├── *ngIf / *ngFor → new control flow (@if, @for)
  │  ├── Angular Material 12 → Material 19 (many theming breaking changes)
  │  └── Karma → migrate to Jest or Web Test Runner (Karma deprecated)

  📈 Estimated complexity: HIGH

────────────────────────────────────────────
 PHASE 2: Target Stack → Angular 19
────────────────────────────────────────────

◇  Recommended strategy: Incremental upgrade

  Angular recommends upgrading 1 major at a time.
  Going from v12 to v19 requires 7 sequential upgrades:
  │  12 → 13 → 14 → 15 → 16 → 17 → 18 → 19
  │
  │  Key milestones:
  │  ├── v15: Standalone components (start migrating)
  │  ├── v17: New control flow (@if, @for) + signals
  │  ├── v18: Zoneless change detection
  │  └── v19: Standalone by default, signals stable

────────────────────────────────────────────
 PHASE 3: MIGRATION_PLAN.md Generated
────────────────────────────────────────────

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ AI-powered migration plan generated                  │
  │                                                          │
  │  📄 MIGRATION_PLAN.md                                    │
  │  Stack:     Angular 12 → Angular 19 (upgrade in-place)   │
  │  Files:     85 files analyzed                            │
  │  Actions:   35 CONVERT, 22 ADAPT, 18 KEEP,              │
  │             6 REWRITE, 4 DELETE                          │
  │  Phases:    10 (7 upgrades + 3 modernization)            │
  │  Steps:     52 detailed steps                            │
  │                                                          │
  │  Quick-start:                                            │
  │  1. git checkout -b migration/angular-19                 │
  │  2. npx @angular/cli@13 update @angular/core@13          │
  │  3. ng build  (verify)                                   │
  │  4. Repeat for each version up to v19                    │
  │  5. Follow MIGRATION_PLAN.md for modernization           │
  ╰──────────────────────────────────────────────────────────╯
```

### Example 43: Migration from IDE — Express monolith → Hono

```
$ cd api-legacy/
$ claude

> /grimox-migrate

◇  Grimox Migration activated

────────────────────────────────────────────
 PHASE 1: Project Analysis
────────────────────────────────────────────

◇  Scanning project structure...

  📁 Structure: Monolithic project

  📁 root/  →  Express ^4.17.0 (JavaScript)

  ├── Docker:  ✓
  └── CI/CD:   ✗ Not detected

◇  Analyzing source code...

  📊 Scale: 34 files (.js: 28, .json: 4, .sql: 2)

  🔍 Detected patterns:
  │  ├── Modules:       CommonJS (100% require/module.exports)
  │  ├── Routes:        15 endpoints (GET: 8, POST: 4, PUT: 2, DELETE: 1)
  │  ├── Middleware:     cors, helmet, morgan, express-session, multer
  │  ├── Auth:          express-session + bcrypt (session-based)
  │  ├── DB:            MongoDB (Mongoose — 6 models, 3 with populate)
  │  ├── Validation:    express-validator (in 8 endpoints)
  │  ├── File uploads:  multer (2 routes)
  │  ├── Error handler: Centralized middleware
  │  └── Tests:         Mocha + supertest (6 files)

  📦 Express → Hono middleware mapping:
  │  ├── cors           → hono/cors (built-in)
  │  ├── helmet         → hono/secure-headers (built-in)
  │  ├── morgan         → hono/logger (built-in)
  │  ├── express.json() → built-in (automatic)
  │  ├── express-session→ hono-sessions or JWT
  │  ├── multer         → @hono/multipart or Supabase Storage
  │  └── express-validator→ Zod + @hono/zod-validator

  🔑 Environment variables (8 found):
  │  ├── PORT, MONGODB_URI, SESSION_SECRET
  │  ├── CORS_ORIGIN, NODE_ENV
  │  └── SMTP_HOST, SMTP_USER, SMTP_PASS

  📈 Estimated complexity: MEDIUM

────────────────────────────────────────────
 PHASE 2: Target Stack → Hono
────────────────────────────────────────────

◇  Hono recommended because:
  │  ├── API similar to Express (minimal learning curve)
  │  ├── Native ESM (eliminates all CommonJS debt)
  │  ├── Equivalent built-in middleware (cors, logger, secure-headers)
  │  ├── TypeScript-first (can adopt gradually)
  │  ├── Multi-runtime (Node, Bun, Cloudflare Workers)
  │  └── 15 endpoints is an ideal project to migrate to Hono

  Database? → MongoDB (keep, update Mongoose)

────────────────────────────────────────────
 PHASE 3: MIGRATION_PLAN.md Generated
────────────────────────────────────────────

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ AI-powered migration plan generated                  │
  │                                                          │
  │  📄 MIGRATION_PLAN.md                                    │
  │  Stack:     Express 4 → Hono (TypeScript)                │
  │  Files:     34 files analyzed                            │
  │  Actions:   18 CONVERT, 6 ADAPT, 5 DELETE,              │
  │             3 REWRITE, 2 KEEP                            │
  │  Phases:    10                                           │
  │  Steps:     28 detailed steps                            │
  │                                                          │
  │  Quick-start:                                            │
  │  1. npm init -y && npm i hono @hono/node-server          │
  │  2. Add "type": "module" in package.json                 │
  │  3. Rename .js → .ts (optional, recommended)             │
  │  4. Convert require → import file by file                │
  │  5. Follow MIGRATION_PLAN.md phase by phase              │
  ╰──────────────────────────────────────────────────────────╯
```

### Example 44: Migration from IDE — jQuery + PHP → Next.js 15

```
$ cd sistema-ventas-viejo/
$ claude

> /grimox-migrate

◇  Grimox Migration activated

────────────────────────────────────────────
 PHASE 1: Project Analysis
────────────────────────────────────────────

◇  Scanning project structure...

  📁 Structure: Monolithic project

  📁 root/  →  jQuery 3.3 + PHP 7.4

  ├── Docker:  ✗ Not detected
  └── CI/CD:   ✗ Not detected

◇  Analyzing source code...

  📊 Scale: 56 files (.php: 28, .js: 15, .css: 8, .sql: 5)

  🔍 Detected patterns:
  │  ├── Frontend:      jQuery + Bootstrap 3 (direct DOM manipulation)
  │  ├── Backend:       PHP 7.4 procedural (no framework, no MVC)
  │  ├── Templates:     Inline PHP with HTML (<?php echo ... ?>)
  │  ├── DB:            MySQL (mysqli_query — inline SQL queries)
  │  ├── Auth:          $_SESSION + md5() for passwords ⚠
  │  ├── Uploads:       move_uploaded_file() to local folder
  │  ├── AJAX:          $.ajax() (14 calls to PHP endpoints)
  │  ├── Routing:       No router — each .php file is a "route"
  │  └── Tests:         ✗ Not detected

  ⚠ CRITICAL issues detected:
  │  ├── md5() for passwords → EXTREMELY INSECURE
  │  ├── Inline SQL without prepared statements → SQL INJECTION
  │  ├── $_SESSION without CSRF tokens → vulnerable to CSRF
  │  ├── PHP 7.4 EOL (December 2022)
  │  ├── jQuery 3.3 + Bootstrap 3 → both obsolete
  │  ├── No tests → migration without safety net
  │  └── No separation of concerns → spaghetti code

  📋 PHP pages → Next.js routes mapping:
  │  ├── index.php           → app/page.tsx
  │  ├── login.php           → app/login/page.tsx
  │  ├── dashboard.php       → app/dashboard/page.tsx
  │  ├── productos.php       → app/productos/page.tsx
  │  ├── producto.php?id=X   → app/productos/[id]/page.tsx
  │  ├── ventas.php           → app/ventas/page.tsx
  │  ├── reportes.php        → app/reportes/page.tsx
  │  ├── api/save_product.php→ Server Action in app/productos/
  │  └── ... (20 more files)

  📈 Estimated complexity: CRITICAL (total rewrite)

────────────────────────────────────────────
 PHASE 2: Target Stack → Next.js 15 + Supabase
────────────────────────────────────────────

◇  Next.js 15 + Supabase recommended because:
  │  ├── Completely replaces PHP + jQuery + MySQL
  │  ├── Supabase Auth resolves all auth vulnerabilities
  │  ├── Supabase PostgreSQL replaces MySQL with security by default
  │  ├── Server Actions replace PHP AJAX endpoints
  │  ├── Tailwind + shadcn/ui replace Bootstrap 3
  │  └── RLS (Row Level Security) prevents SQL injection by design

────────────────────────────────────────────
 PHASE 3: MIGRATION_PLAN.md Generated
────────────────────────────────────────────

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ AI-powered migration plan generated                  │
  │                                                          │
  │  📄 MIGRATION_PLAN.md                                    │
  │  Stack:     jQuery+PHP 7.4 → Next.js 15 + Supabase      │
  │  Files:     56 files analyzed                            │
  │  Actions:   28 REWRITE, 15 DELETE, 8 CONVERT,           │
  │             3 ADAPT, 2 KEEP                              │
  │  Phases:    10                                           │
  │  Steps:     58 detailed steps                            │
  │                                                          │
  │  ⚠ IMPORTANT: Migrate data from MySQL to Supabase        │
  │    BEFORE starting the code migration.                    │
  │    md5 passwords must be rehashed with bcrypt.            │
  │                                                          │
  │  Plan includes:                                          │
  │  ├── MySQL → Supabase migration script (SQL export)      │
  │  ├── Password rehash script                              │
  │  ├── Full mapping of 28 PHP pages → Next.js routes       │
  │  └── jQuery DOM → React components rewrite guide         │
  ╰──────────────────────────────────────────────────────────╯
```

---

### IDE MIGRATION SUMMARY

```
# Invoke the migration skill in Claude Code
/grimox-migrate

# What it generates:
#   1. Real code analysis (not just package.json)
#   2. Pattern detection: state, auth, routing, ORM, integrations
#   3. File-by-file inventory with actions
#   4. MIGRATION_PLAN.md with 10 phases, detailed steps,
#      commands, before/after snippets, verifications and rollback

# Difference from grimox migrate:
#   grimox migrate     → Static plan with 5-8 generic steps
#   /grimox-migrate    → Plan with 30-60+ project-specific steps
```

---

## AUTONOMOUS ONE-SHOT DEVELOPMENT (Skill `/grimox-dev`)

### How autonomous development works

After creating a project with `grimox create`, the `/grimox-dev` skill allows the
LLM to implement the ENTIRE project autonomously in an infinite loop until it
works. It analyzes the stack, plans phases, writes code, runs, debugs
errors, verifies in the browser, and repeats until the app is running locally.

```
/grimox-dev flow:

  1. RECOGNIZE   →  Reads GRIMOX.md, .ai/rules.md, manifests, .env
                    Detects: stack, DB, features, project state

  2. PLAN        →  Generates GRIMOX_DEV_PLAN.md with ordered phases
                    (DB → Models → API → Layout → Pages → Auth)

  3. IMPLEMENT   →  Writes ALL code phase by phase
                    Real code, not placeholders

  4. BUILD→TEST→FIX (infinite loop):
     │  Install → Build → Dev server → curl localhost
     │  → WebFetch to verify HTML/UI → Open browser
     │  → If error: analyze → fix → retry (max 5 per error)
     │  → If success: next phase
     └──────────────────────────────────────────────

  5. VERIFY      →  Production build + all routes + Docker
                    Final report to user
```

---

### Example 45: One-shot development — CRM with Next.js 15 + Supabase

```
$ grimox create crm-lab
  ...project created...

$ claude

> /grimox-dev
  I need a CRM for a laboratory with: client management, products,
  orders, dashboard with metrics, and authentication with roles (admin/user).

◇  Grimox Dev Architect activated

────────────────────────────────────────────
 PHASE 1: Reconnaissance
────────────────────────────────────────────

◇  Reading project context...

  📦 Detected stack:
  │  ├── Framework:   Next.js 15 (TypeScript)
  │  ├── Database:    Supabase (PostgreSQL + Auth)
  │  ├── UI:          Tailwind CSS v4 + shadcn/ui
  │  ├── Docker:      ✓ (docker-compose.yml)
  │  ├── CI/CD:       ✓ (GitHub Actions)
  │  └── State:       Freshly created (no node_modules)

────────────────────────────────────────────
 PHASE 2: Planning
────────────────────────────────────────────

◇  Generating GRIMOX_DEV_PLAN.md...

  📋 Development plan:
  │  Phase 1: Database (6 tables: clients, products, orders, etc.)
  │  Phase 2: API / Server Actions (CRUD x 4 resources)
  │  Phase 3: Layout (sidebar, header, dark mode)
  │  Phase 4: Pages (dashboard, clients, products, orders)
  │  Phase 5: Components (tables, forms, charts, modals)
  │  Phase 6: Auth (login, admin/user roles, middleware)
  │  Total: 6 phases, ~35 files to create

────────────────────────────────────────────
 PHASE 3: Implementation + Build→Test→Fix
────────────────────────────────────────────

◇  [Phase 1/6] Database...
  ✓ Supabase schema: 6 tables created
  ✓ Seed data inserted
  ✓ Connection verified

◇  [Phase 2/6] Server Actions...
  ✓ CRUD clients (4 actions)
  ✓ CRUD products (4 actions)
  ✓ CRUD orders (4 actions)
  ✓ Dashboard queries (3 actions)
  → Build: ✓ successful
  → curl localhost:3000/api/health: 200 ✓

◇  [Phase 3/6] Layout...
  ✓ Sidebar with navigation
  ✓ Header with dark mode toggle
  ✓ Responsive layout
  → Build: ✗ Error: "Cannot find module '@/components/Sidebar'"
  → Fix: correct import path
  → Build: ✓ successful
  → WebFetch localhost:3000: HTML has <nav>, <header>, <main> ✓

◇  [Phase 4/6] Pages...
  ✓ Dashboard with 4 metric cards
  ✓ Client list with table + search
  ✓ Product list with filters
  ✓ Order list with status
  ✓ Detail view for each resource
  → Build: ✓ successful
  → curl all routes: 200 ✓
  → WebFetch /dashboard: seed data visible ✓

  🌐 App running at http://localhost:3000
     Open it in your browser to verify the UI.

◇  [Phase 5/6] Components...
  ✓ Reusable DataTable
  ✓ Forms with validation (Zod)
  ✓ Charts with Recharts (dashboard metrics)
  ✓ Confirmation modal
  → Build: ✗ Error: "Type 'string' not assignable to 'number'"
  → Fix: correct type in ChartData interface
  → Build: ✓ successful

◇  [Phase 6/6] Auth...
  ✓ Login with Supabase Auth
  ✓ Protection middleware
  ✓ Roles: admin sees everything, user sees only their orders
  → Build: ✓ successful
  → curl /dashboard without auth: 302 → redirect to /login ✓
  → curl /login: 200 ✓

────────────────────────────────────────────
 PHASE 5: Final Verification
────────────────────────────────────────────

  ✓ npm run build: successful (0 errors, 0 warnings)
  ✓ 12 pages verified (all 200)
  ✓ 15 Server Actions working
  ✓ Auth: route protection correct
  ✓ Docker: docker-compose up ✓ (app + supabase local)

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ Project crm-lab running correctly                     │
  │                                                          │
  │  Stack:   Next.js 15 + Supabase                          │
  │  Pages:   12 (dashboard, clients, products, orders)      │
  │  Actions: 15 Server Actions                              │
  │  Auth:    Supabase Auth with roles (admin/user)          │
  │  Port:    http://localhost:3000                           │
  │                                                          │
  │  To start:                                               │
  │    npm run dev                                           │
  │                                                          │
  │  For Docker:                                             │
  │    docker-compose up                                     │
  ╰──────────────────────────────────────────────────────────╯
```

### Example 46: One-shot development — REST API with Hono + PostgreSQL

```
$ grimox create inventory-api
  ...project created...

$ claude

> /grimox-dev
  Inventory API with: products (CRUD), categories, stock,
  low stock alerts, and JWT authentication.

◇  Grimox Dev Architect activated

  📦 Stack: Hono (TypeScript) + PostgreSQL
  📋 Plan: 5 phases, ~20 files

◇  Implementing...

  [Phase 1/5] DB + Models: ✓ (Drizzle ORM, 4 tables, seed data)
  [Phase 2/5] Endpoints:   ✓ (18 CRUD endpoints + search + alerts)
    → curl localhost:3000/api/products: 200 ✓ (returns 10 seed products)
    → curl POST /api/products with invalid body: 422 ✓ (Zod validation)
  [Phase 3/5] Middleware:   ✓ (CORS, logger, error handler)
  [Phase 4/5] Auth JWT:     ✓ (register, login, protect endpoints)
    → curl /api/products without token: 401 ✓
    → curl /api/products with token: 200 ✓
  [Phase 5/5] Tests:        ✓ (Vitest, 12 tests passing)

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ API inventory-api running                             │
  │                                                          │
  │  Endpoints: 18 routes                                    │
  │  Auth:      JWT (register + login)                       │
  │  Tests:     12/12 passing                                │
  │  Swagger:   http://localhost:3000/docs (if configured)   │
  │  Docker:    docker-compose up ✓                          │
  ╰──────────────────────────────────────────────────────────╯
```

### Example 47: One-shot development — Decoupled app React + FastAPI

```
$ grimox create dashboard-analytics
  ...decoupled project created...

$ claude

> /grimox-dev
  Analytics dashboard with: sales charts, transactions table,
  date filters, and CSV export.

◇  Grimox Dev Architect activated

  📦 Decoupled stack:
  │  frontend/  → React + Vite (TypeScript) + shadcn/ui
  │  backend/   → FastAPI (Python) + PostgreSQL

  📋 Plan: Backend complete first, then Frontend
  │  Backend: 4 phases (DB, endpoints, middleware, auth)
  │  Frontend: 4 phases (layout, pages, components, API integration)

◇  [BACKEND] Implementing...

  [1/4] DB + Models:   ✓ (SQLAlchemy async, 3 tables, seed 1000 transactions)
  [2/4] Endpoints:     ✓ (GET /transactions, /analytics, /export-csv)
    → curl localhost:8000/docs: 200 ✓ (Swagger UI)
    → curl /api/v1/analytics: 200 ✓ (returns metrics)
  [3/4] Middleware:     ✓ (CORS config for frontend on :5173)
  [4/4] Auth:           ✓ (JWT, OAuth2PasswordBearer)

  ✓ Backend complete and verified

◇  [FRONTEND] Implementing...

  [5/8] Layout:         ✓ (sidebar, header, dark mode)
  [6/8] Pages:          ✓ (dashboard with charts, transactions with table)
  [7/8] Components:     ✓ (LineChart, BarChart, DataTable, DateFilter)
    → Build: ✗ Error "Type 'ChartData[]' is not assignable..."
    → Fix: adjust ChartData interface
    → Build: ✓
  [8/8] API integration: ✓ (fetch to backend, loading states, error handling)
    → WebFetch localhost:5173: Dashboard renders with charts ✓
    → Real data from backend visible in UI ✓

  🌐 Frontend: http://localhost:5173
  🌐 Backend:  http://localhost:8000/docs

  ╭──────────────────────────────────────────────────────────╮
  │  ✔ Project dashboard-analytics running                   │
  │                                                          │
  │  Frontend: 4 pages, 8 components                         │
  │  Backend:  6 endpoints, Swagger at /docs                 │
  │  Docker:   docker-compose up ✓ (frontend + backend + db) │
  ╰──────────────────────────────────────────────────────────╯
```

---

### Example 48: /grimox-dev detects pending migration

```
$ cd mi-plataforma/     ← project with incomplete MIGRATION_PLAN.md
$ claude

> /grimox-dev
  I want to add a dashboard with charts

◇  Grimox Dev Architect activated

────────────────────────────────────────────
 PHASE 1: Reconnaissance
────────────────────────────────────────────

◇  Reading project context...

  ⚠ A MIGRATION_PLAN.md with pending steps was detected.
    This project is in the process of being migrated.
    │
    │  Current stack:  React 16 + Express (migrating)
    │  Target stack:   Next.js 15 + Supabase
    │  Progress:       4/10 phases completed (40%)
    │
    │  Options:
    │  1. Execute the 6 pending steps from MIGRATION_PLAN.md
    │     first, then develop the dashboard.
    │  2. Ignore the migration and develop on the current code
    │     (may cause conflicts with React 16 + Express).
    │  3. Cancel and complete the migration with /grimox-migrate.

  ◆ What do you prefer?
  │ ● Option 1: Complete migration, then develop

◇  Executing pending steps from MIGRATION_PLAN.md...

  [Phase 5/10] Migrate UI components:        ✓
  [Phase 6/10] Migrate state management:     ✓
  [Phase 7/10] Migrate authentication:       ✓
  [Phase 8/10] Migrate testing:              ✓
  [Phase 9/10] Update CI/CD:                 ✓
  [Phase 10/10] Cleanup and verification:    ✓

  ✓ MIGRATION_PLAN.md completed (10/10 phases)
  → Build: ✓ Next.js 15 compiles correctly
  → curl localhost:3000: 200 ✓

◇  Migration complete. Now developing the dashboard...

  📋 GRIMOX_DEV_PLAN.md generated:
  │  Phase 1: API routes for analytics (Server Actions)
  │  Phase 2: Dashboard page with charts
  │  Phase 3: Components (LineChart, BarChart, KPI cards)

  ...normal /grimox-dev flow continues...
```

### Example 49: /grimox-dev detects legacy project without migration

```
$ cd api-legacy/        ← Express + CommonJS project without migration
$ claude

> /grimox-dev
  Add push notifications endpoint

◇  Grimox Dev Architect activated

  ⚠ This project uses Express ^4.17.0 with CommonJS (require/module.exports).
    Developing new features on legacy code can cause
    incompatibilities and hard-to-diagnose errors.

    Recommendation:
    1. Run /grimox-migrate first to migrate to Hono (ESM).
    2. Complete the migration.
    3. Then run /grimox-dev to develop the endpoint.

  ◆ Do you want to continue on the current code?
  │ ● Yes, develop using current conventions (CommonJS + Express)

◇  Understood. Using existing code conventions.

  📋 GRIMOX_DEV_PLAN.md:
  │  Phase 1: Notifications model (Mongoose)
  │  Phase 2: Endpoint POST /api/notifications (Express + CommonJS)
  │  Phase 3: Firebase Cloud Messaging integration

  ...implements using require/module.exports, NOT import/export...
```

---

### AUTONOMOUS DEVELOPMENT SUMMARY

```
# Invoke the development skill in Claude Code
/grimox-dev

# What it does:
#   1. Recognizes the stack (reads GRIMOX.md, .ai/rules.md, manifests)
#   2. Detects conflicts (pending migration, legacy code)
#   3. Plans development phases (GRIMOX_DEV_PLAN.md)
#   4. Implements ALL code phase by phase
#   5. Build→Test→Fix cycle until it works
#   6. Verifies in browser (WebFetch + URL for the user)
#   7. Final verification: build + docker + all routes

# Decoupled project:
#   Complete BACKEND first → then Frontend consumes the API

# If interrupted:
#   GRIMOX_DEV_PLAN.md persists → /grimox-dev resumes where it left off

# If there's a pending migration:
#   Offers to complete MIGRATION_PLAN.md first → then develop

# If the project is legacy:
#   Recommends /grimox-migrate → but respects the user's decision
```

---

## LIST AVAILABLE STACKS

```
$ grimox list

  ╭─────────────────────────────────╮
  │  🔮 Grimox CLI v0.1.0          │
  │  Available Stacks               │
  ╰─────────────────────────────────╯

  Integrated Web Fullstack
  ├── Next.js 15        TypeScript    React + SSR + API Routes
  ├── Nuxt 4            TypeScript    Vue + SSR + Nitro
  └── SvelteKit         TypeScript    Svelte + SSR + Endpoints

  Web Frontend (SPA)
  ├── React + Vite      JS / TS       SPA with React 19
  ├── Vue.js + Vite     JS / TS       SPA with Vue 3
  ├── Angular           TypeScript    SPA with Angular 19
  └── Svelte + Vite     JS / TS       SPA with Svelte 5

  API / Backend
  ├── FastAPI            Python        Async API with Pydantic
  ├── NestJS             TypeScript    Enterprise API framework
  ├── Hono               TypeScript    Ultra-fast, multi-runtime
  ├── Fastify            JS / TS       High performance Node.js
  └── Spring Boot        Java/Kotlin   Enterprise Java/Kotlin API

  Mobile
  ├── React Native       TypeScript    Expo + NativeWind
  ├── Flutter             Dart          Material 3
  └── Flet                Python        Desktop + Mobile from Python

  Desktop
  ├── Tauri               TS + Rust     Lightweight native apps
  ├── Electron            JS / TS       Cross-platform desktop
  └── Flet                Python        Desktop from Python

  IoT / Embedded
  ├── Arduino (.ino)      C++           Arduino IDE structure
  ├── PlatformIO          C++           Professional embedded dev
  ├── ESP-IDF             C             Espressif framework
  └── MicroPython         Python        Python on microcontrollers

  Data Analytics / AI
  └── FastAPI + ML        Python        scikit-learn + pandas + Jupyter

  Documentation
  ├── Astro (Starlight)   TypeScript    Fast static docs
  ├── Docusaurus          TypeScript    React-based docs
  └── VitePress           TypeScript    Vue-based docs

  CLI Tool
  └── Node.js + Commander JS            CLI tool scaffold

  Databases: Supabase | PostgreSQL | Firebase | MongoDB
             Oracle SQL | Turso | Redis | Insforge (insforge.dev)
```
