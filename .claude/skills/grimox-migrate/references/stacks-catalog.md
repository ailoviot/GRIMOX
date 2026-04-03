# Catálogo de Stacks — Grimox CLI

Todos los stacks disponibles como destino de migración en Grimox CLI.

## Web Fullstack Integrado

Un solo framework con SSR + API + DB.

| Stack | Lenguaje | UI Auto | DBs Compatibles | Notas |
|-------|----------|---------|-----------------|-------|
| Next.js 15 | TypeScript | Tailwind v4 + shadcn/ui | Supabase, PostgreSQL, Firebase, MongoDB, Turso, Insforge, Redis | App Router, Server Actions |
| Nuxt 4 | TypeScript | Tailwind v4 + NuxtUI | Supabase, PostgreSQL, Firebase, MongoDB, Turso, Insforge | Auto-imports, Nitro server routes |
| SvelteKit | TypeScript | Tailwind v4 + Skeleton | Supabase, PostgreSQL, Firebase, MongoDB, Turso, Insforge | Server endpoints, form actions |

## Web Frontend (SPA)

Solo frontend, sin backend propio.

| Stack | Lenguaje | UI Auto | DBs Compatibles | Notas |
|-------|----------|---------|-----------------|-------|
| React + Vite | JS / TS | Tailwind v4 + shadcn/ui | Supabase, Firebase, Insforge | SPA con React 19 |
| Vue.js + Vite | JS / TS | Tailwind v4 + PrimeVue | Supabase, Firebase, Insforge | SPA con Vue 3 |
| Angular | TypeScript | Tailwind v4 + Material | Supabase, Firebase, Insforge | Standalone components, Guards |
| Svelte + Vite | JS / TS | Tailwind v4 + Skeleton | Supabase, Firebase, Insforge | SPA con Svelte 5 |

## API / Backend

Solo backend, sin frontend.

| Stack | Lenguaje | DBs Compatibles | Notas |
|-------|----------|-----------------|-------|
| FastAPI | Python | Supabase, PostgreSQL, Firebase, MongoDB, Oracle, Turso, Insforge, Redis | Pydantic v2, uvicorn, Swagger/ReDoc auto |
| NestJS | TypeScript | Supabase, PostgreSQL, Firebase, MongoDB, Oracle, Turso, Insforge, Redis | Enterprise, decoradores, DI |
| Hono | TypeScript | Supabase, PostgreSQL, MongoDB, Turso, Insforge, Redis | Ultra-fast, multi-runtime (Node, Bun, CF Workers) |
| Fastify | JS / TS | Supabase, PostgreSQL, MongoDB, Turso, Insforge, Redis | High performance, plugins, schema validation |
| Spring Boot | Java / Kotlin | PostgreSQL, MongoDB, Oracle, Insforge, Redis | Enterprise, Maven/Gradle, JPA + Hibernate |

## Mobile

Apps móviles multiplataforma.

| Stack | Lenguaje | UI Auto | DBs Compatibles | Notas |
|-------|----------|---------|-----------------|-------|
| React Native (Expo) | TypeScript | NativeWind | Supabase, Firebase, Insforge | Expo Router, EAS Build |
| Flutter | Dart | Material 3 | Supabase, Firebase, Insforge | Riverpod, Material 3 |
| Flet | Python | Flet components | Supabase, Firebase, Insforge | Desktop + Mobile desde Python |

## Desktop

Apps de escritorio multiplataforma.

| Stack | Lenguaje | UI Auto | DBs Compatibles | Notas |
|-------|----------|---------|-----------------|-------|
| Tauri | TS + Rust | Tailwind v4 + shadcn/ui | Supabase, Turso, Insforge | Ligero (~5MB), webview nativo |
| Electron | JS / TS | Tailwind v4 | Supabase, Turso, Insforge | Cross-platform, Chromium bundled |
| Flet | Python | Flet components | Supabase, PostgreSQL, Insforge | Desktop desde Python |

## IoT / Embebido

Proyectos de electrónica y microcontroladores.

| Stack | Lenguaje | Placas | Notas |
|-------|----------|--------|-------|
| Arduino (.ino) | C++ | ESP32, Uno, Mega, ESP8266 | Estructura Arduino IDE |
| PlatformIO | C++ | ESP32, ESP8266, Arduino Uno | Profesional, testing, multi-board |
| ESP-IDF | C | ESP32, ESP32-S2, ESP32-C3 | Framework nativo Espressif |
| MicroPython | Python | ESP32, RPi Pico, ESP8266 | Python en microcontroladores |

## Data Analytics / IA

Ciencia de datos e inteligencia artificial.

| Stack | Lenguaje | DBs Compatibles | Notas |
|-------|----------|-----------------|-------|
| FastAPI + ML | Python | Supabase, PostgreSQL, MongoDB, Insforge | scikit-learn, pandas, numpy, Jupyter |

## Documentación

Sitios de documentación estáticos.

| Stack | Lenguaje | UI Auto | Notas |
|-------|----------|---------|-------|
| Astro (Starlight) | TypeScript | Tailwind v4 + Starlight | Rápido, MDX support |
| Docusaurus | TypeScript | — | React-based (Meta) |
| VitePress | TypeScript | — | Vue-based |

## Herramienta CLI

| Stack | Lenguaje | Notas |
|-------|----------|-------|
| Node.js + Commander | JavaScript | CLI scaffold con Commander.js + ESM |

## Bases de Datos Soportadas

| Base de datos | Tipo | Caso de uso |
|--------------|------|-------------|
| Supabase | PostgreSQL + Auth + Storage (cloud) | Apps web/mobile con auth integrada |
| PostgreSQL | Relacional (self-hosted o cloud) | Apps enterprise, datos estructurados |
| Firebase | NoSQL + Auth + Storage (cloud) | Apps mobile, real-time |
| MongoDB | NoSQL (document-based) | Datos flexibles, schemas dinámicos |
| Oracle SQL | Relacional enterprise | Sistemas corporativos, legacy |
| Turso | SQLite distribuido (edge) | Apps edge, bajo latency |
| Redis | Key-value (in-memory) | Cache, sessions, queues |
| Insforge | Cloud DB (insforge.dev) | Proyectos Grimox-native |
