# Patrones de Arquitectura por Stack

Narrativas descriptivas para la sección "Arquitectura" de PROJECT_DOCS.md. Buscar por stack ID y copiar/adaptar la narrativa correspondiente.

---

## Tabla de contenidos

- [Web Fullstack Integrado](#web-fullstack-integrado)
- [Web Frontend SPA](#web-frontend-spa)
- [API / Backend](#api--backend)
- [Mobile](#mobile)
- [Desktop](#desktop)
- [IoT / Embebido](#iot--embebido)
- [Data / AI](#data--ai)
- [Documentation](#documentation)
- [CLI Tools](#cli-tools)

---

## Web Fullstack Integrado

### nextjs-15

Aplicación fullstack construida con **Next.js 15** usando el App Router. La arquitectura se basa en React Server Components (RSC) para renderizado en el servidor por defecto, con Client Components marcados explícitamente con `'use client'` para interactividad del lado del cliente.

**Capas principales:**
- **Routing**: File-based routing dentro de `app/`. Cada carpeta es una ruta, `page.tsx` define la UI, `layout.tsx` define layouts compartidos
- **Data fetching**: Server Components hacen fetch directo a datos (sin useEffect). Los datos fluyen de servidor a cliente
- **Mutaciones**: Server Actions (`'use server'`) permiten llamar funciones del servidor desde formularios y componentes cliente
- **API Routes**: Route Handlers en `app/api/` para endpoints REST consumidos por terceros
- **Middleware**: `middleware.ts` en la raíz intercepta requests antes del routing (auth, redirects, i18n)

### nuxt-4

Aplicación fullstack construida con **Nuxt 4** sobre Vue 3 y el servidor Nitro. Usa Composition API y auto-imports para un desarrollo ergonómico.

**Capas principales:**
- **Routing**: File-based routing en `pages/`. Layouts en `layouts/`. Componentes auto-importados desde `components/`
- **Server**: Nitro server con endpoints en `server/api/` y middleware en `server/middleware/`
- **Data fetching**: `useFetch()` y `useAsyncData()` para hidratación SSR-safe
- **Estado**: Pinia como state manager (auto-importado)
- **Plugins**: Sistema de plugins en `plugins/` para extensiones globales

### sveltekit

Aplicación fullstack construida con **SvelteKit**. Combina el rendimiento de Svelte 5 con SSR y API endpoints en un solo framework.

**Capas principales:**
- **Routing**: File-based routing en `src/routes/`. `+page.svelte` para UI, `+page.server.ts` para carga de datos
- **Server endpoints**: `+server.ts` para API endpoints REST
- **Data loading**: Funciones `load()` en `+page.server.ts` ejecutan en servidor y pasan datos al componente
- **Form actions**: Acciones de formulario procesadas en servidor sin JavaScript del cliente
- **Hooks**: `hooks.server.ts` para middleware global (auth, logging)

---

## Web Frontend SPA

### react-vite

Single Page Application construida con **React 19** y **Vite** como bundler. Renderizado completamente en el cliente (CSR).

**Capas principales:**
- **Componentes**: Functional components con hooks. Organizados en `src/components/`
- **Routing**: React Router para navegación client-side sin recargas
- **Estado**: Context API para estado simple, o Zustand/Jotai para estado complejo
- **Estilos**: Tailwind CSS v4 con shadcn/ui para componentes pre-construidos
- **Build**: Vite para dev server con HMR y build optimizado con tree-shaking

### vue-vite

Single Page Application construida con **Vue 3** y **Vite**. Usa Composition API (`<script setup>`) para componentes reactivos.

**Capas principales:**
- **Componentes**: Single File Components (`.vue`) con `<script setup>`, `<template>`, `<style>`
- **Routing**: Vue Router para navegación client-side con guards de navegación
- **Estado**: Pinia para state management con stores tipados
- **Estilos**: Tailwind CSS v4 con PrimeVue para componentes UI
- **Reactividad**: Sistema de reactividad de Vue 3 (ref, reactive, computed, watch)

### angular

Single Page Application construida con **Angular 19** usando standalone components (sin NgModules).

**Capas principales:**
- **Componentes**: Standalone components con signals para reactividad
- **Routing**: Angular Router con lazy-loading por ruta y guards de autenticación
- **Servicios**: Inyección de dependencias (DI) con services como singletons
- **Estado**: Signals para estado local, NgRx o signal store para estado global
- **Estilos**: Tailwind CSS v4 con Angular Material para componentes UI
- **HTTP**: HttpClient con interceptors para headers, auth, y manejo de errores

### svelte-vite

Single Page Application construida con **Svelte 5** y **Vite**. Svelte compila componentes a JavaScript vanilla — sin virtual DOM.

**Capas principales:**
- **Componentes**: Archivos `.svelte` con lógica, markup y estilos en un solo archivo
- **Reactividad**: Runes (`$state`, `$derived`, `$effect`) para reactividad declarativa
- **Routing**: svelte-routing o TanStack Router para navegación client-side
- **Estilos**: Tailwind CSS v4 con Skeleton para componentes UI
- **Build**: Vite con compilación a JS vanilla (bundles muy pequeños)

---

## API / Backend

### fastapi

API REST asíncrona construida con **FastAPI** (Python). Diseñada para alto rendimiento con tipado estático via Pydantic.

**Capas principales:**
- **Routers**: Endpoints organizados por dominio en `app/routers/` o `app/api/`
- **Schemas**: Pydantic v2 models para validación de request/response
- **Services**: Lógica de negocio separada de los endpoints
- **Database**: Conexión async via SQLAlchemy/asyncpg, Motor (MongoDB), o Supabase client
- **Dependencies**: Sistema de dependency injection para auth, DB sessions, etc
- **Docs**: Swagger UI (`/docs`) y ReDoc (`/redoc`) auto-generados desde los type hints

### nestjs

API enterprise construida con **NestJS** (TypeScript). Arquitectura modular inspirada en Angular.

**Capas principales:**
- **Modules**: Cada dominio es un módulo con sus controllers, services y entities
- **Controllers**: Decoradores `@Get()`, `@Post()`, etc. para definir endpoints
- **Services**: Lógica de negocio inyectable con `@Injectable()`
- **Guards**: Middleware de autenticación/autorización con `@UseGuards()`
- **Pipes**: Validación y transformación de datos con class-validator
- **Interceptors**: Lógica transversal (logging, caching, transform response)

### hono

API REST ultraligera construida con **Hono** (TypeScript). Compatible con múltiples runtimes: Node.js, Bun, Deno, Cloudflare Workers.

**Capas principales:**
- **Routes**: Definición de rutas con encadenamiento fluido (`app.get()`, `app.post()`)
- **Middleware**: Middleware chain para CORS, auth, logging, rate limiting
- **Validators**: Validación de request con Zod o Valibot via `@hono/zod-validator`
- **Context**: Objeto `c` (Context) para acceder a request, response, env vars
- **Adaptadores**: Multi-runtime — misma API funciona en Node, Workers, Bun

### fastify

API de alto rendimiento construida con **Fastify** (Node.js). Basada en plugins y schemas JSON para validación.

**Capas principales:**
- **Routes**: Endpoints definidos con JSON Schema para validación automática
- **Plugins**: Sistema de plugins para modularizar (cada plugin es un scope aislado)
- **Hooks**: Lifecycle hooks (onRequest, preHandler, onSend, etc.) para lógica transversal
- **Serialization**: Serialización rápida con JSON Schema (fast-json-stringify)
- **Decorators**: Extensión del request/reply con `.decorate()`

### springboot

API enterprise construida con **Spring Boot** (Java/Kotlin). Usa Spring MVC para REST y Spring Data JPA para persistencia.

**Capas principales:**
- **Controllers**: `@RestController` con mapeo de endpoints (`@GetMapping`, `@PostMapping`)
- **Services**: `@Service` con lógica de negocio y transacciones
- **Repositories**: `@Repository` con Spring Data JPA (queries derivados del nombre del método)
- **Entities**: `@Entity` con anotaciones JPA para mapeo ORM
- **DTOs**: Objetos de transferencia para request/response (records en Java, data class en Kotlin)
- **Security**: Spring Security para autenticación (JWT/sessions) y autorización (roles)
- **Config**: Configuración via `application.properties` o `application.yml`

---

## Mobile

### expo (React Native)

Aplicación móvil multiplataforma construida con **React Native** via **Expo SDK**. Una base de código para iOS y Android.

**Capas principales:**
- **Screens**: Pantallas como componentes React en `app/` (Expo Router, file-based routing)
- **Navigation**: Expo Router con Stack, Tab, y Drawer navigators
- **Componentes**: React Native components + NativeWind (Tailwind para RN)
- **Estado**: Zustand o Context API para state management
- **APIs nativas**: Expo modules (cámara, ubicación, notificaciones, etc)
- **Build**: EAS Build para compilación en la nube (iOS y Android)

### flutter

Aplicación móvil multiplataforma construida con **Flutter** y **Dart**. Widget-based UI con Material Design 3.

**Capas principales:**
- **Screens**: Widgets en `lib/screens/` o `lib/pages/`
- **Widgets**: Composición de widgets (StatelessWidget, StatefulWidget, ConsumerWidget)
- **Estado**: Riverpod para state management reactivo
- **Navigation**: GoRouter o Navigator 2.0 para routing declarativo
- **Services**: Clases de servicio para API calls y lógica de negocio
- **Models**: Data classes con `freezed` o `json_serializable` para serialización

### flet-mobile

Aplicación móvil construida con **Flet** (Python). UI declarativa con componentes Material Design.

**Capas principales:**
- **Views**: Páginas como funciones Python que retornan árboles de controles Flet
- **Controls**: Componentes UI de Flet (TextField, ElevatedButton, ListView, etc)
- **Estado**: Variables Python con `page.update()` para reactividad
- **Navigation**: Flet routing con `page.route`
- **Build**: Flet CLI para compilar a APK/IPA

---

## Desktop

### tauri

Aplicación desktop construida con **Tauri**. Frontend web (React + TypeScript) con backend nativo en **Rust**. Binarios ultra-ligeros (~5MB).

**Capas principales:**
- **Frontend**: React + Vite en `src/` — renderizado en WebView nativo
- **Backend Rust**: Comandos Tauri en `src-tauri/src/` — lógica pesada, acceso a filesystem, sistema
- **IPC**: Comunicación Frontend↔Rust via `invoke()` y eventos
- **Plugins**: Tauri plugins para acceso al sistema (fs, shell, dialog, notification)
- **Config**: `tauri.conf.json` para ventanas, permisos, bundling

### electron

Aplicación desktop construida con **Electron**. Proceso principal (Node.js) + proceso renderer (Chromium).

**Capas principales:**
- **Main process**: `main.js` — crea ventanas, acceso a Node.js APIs, IPC handler
- **Renderer process**: Frontend web (HTML/CSS/JS) renderizado en Chromium
- **Preload**: `preload.js` — puente seguro entre main y renderer (contextBridge)
- **IPC**: `ipcMain`/`ipcRenderer` para comunicación entre procesos
- **Build**: electron-builder o electron-forge para empaquetar

### flet-desktop

Aplicación desktop construida con **Flet** (Python). UI nativa con componentes Material Design.

**Capas principales:**
- **Views**: Páginas como funciones Python con controles Flet
- **Controls**: Componentes UI nativos (adaptados al OS)
- **Estado**: Variables Python con actualización explícita
- **Window**: Configuración de ventana (tamaño, título, ícono)
- **Build**: Flet CLI para compilar a ejecutable nativo (Windows/macOS/Linux)

---

## IoT / Embebido

### arduino

Proyecto embebido con estructura **Arduino IDE**. Código en C++ con el paradigma `setup()` + `loop()`.

**Capas principales:**
- **Main sketch**: Archivo `.ino` con `setup()` (inicialización) y `loop()` (ciclo principal)
- **Librerías**: Headers en `#include` para sensores, displays, comunicación
- **Pines**: Configuración de GPIO (pinMode, digitalWrite, analogRead)
- **Timing**: Uso de `millis()` para timing no bloqueante (evitar `delay()`)
- **Serial**: Comunicación serie para debug y datos a 115200 baud

### platformio

Proyecto embebido profesional con **PlatformIO**. Estructura de proyecto C++ con gestión de dependencias.

**Capas principales:**
- **Source**: Código en `src/main.cpp` con `setup()` y `loop()`
- **Librerías**: Dependencias declaradas en `platformio.ini` (`lib_deps`)
- **Config**: `platformio.ini` define placa, framework, baudrate, dependencias
- **Test**: Tests unitarios en `test/` ejecutados con `pio test`
- **Environments**: Múltiples targets (ESP32, ESP8266, etc) en un solo proyecto

### esp-idf

Proyecto embebido nativo con **ESP-IDF** (Espressif IoT Development Framework). C puro con FreeRTOS.

**Capas principales:**
- **Main**: Entry point en `main/main.c` con `app_main()`
- **Components**: Módulos reutilizables en `components/`
- **FreeRTOS**: Tasks, queues, semaphores para multitarea
- **Drivers**: APIs de bajo nivel para GPIO, SPI, I2C, UART, WiFi, BLE
- **Config**: Menuconfig (`idf.py menuconfig`) para configuración del SDK

### micropython

Proyecto embebido con **MicroPython**. Python interpretado en microcontroladores.

**Capas principales:**
- **Main**: `main.py` se ejecuta automáticamente al encender
- **Boot**: `boot.py` se ejecuta antes de main (config WiFi, etc)
- **Módulos**: Archivos `.py` importables para organizar el código
- **Hardware**: Módulos `machine` (Pin, ADC, PWM, I2C, SPI) para acceso a hardware
- **Networking**: `network` module para WiFi, `usocket` para TCP/UDP

---

## Data / AI

### fastapi-ml

Plataforma de Data Science / ML construida sobre **FastAPI** con stack de Python para machine learning.

**Capas principales:**
- **API**: FastAPI endpoints para servir predicciones (inference)
- **Models**: Modelos entrenados guardados en `models/` (pickle, joblib, ONNX)
- **Training**: Scripts de entrenamiento en `train/` o `scripts/`
- **Notebooks**: Jupyter notebooks en `notebooks/` para exploración y prototipado
- **Data**: Datos raw en `data/raw/`, procesados en `data/processed/`
- **Pipeline**: ETL + feature engineering + training + evaluation como pipeline reproducible
- **Stack ML**: scikit-learn, pandas, numpy, matplotlib/seaborn

---

## Documentation

### astro (Starlight)

Sitio de documentación construido con **Astro** + **Starlight**. Contenido en MDX con generación estática.

**Capas principales:**
- **Content**: Archivos MDX/MD en `src/content/docs/`
- **Config**: `astro.config.mjs` con Starlight plugin (sidebar, i18n, themes)
- **Components**: Componentes Astro/React en `src/components/` para UI custom
- **Assets**: Imágenes y archivos estáticos en `src/assets/` o `public/`
- **Build**: Generación estática — output en `dist/`

### docusaurus

Sitio de documentación construido con **Docusaurus** (Meta). React-based con MDX.

**Capas principales:**
- **Docs**: Archivos MD/MDX en `docs/`
- **Blog**: Posts en `blog/` (opcional)
- **Config**: `docusaurus.config.js` para navbar, footer, plugins
- **Sidebar**: `sidebars.js` para navegación lateral
- **Theme**: Customización del tema en `src/theme/`

### vitepress

Sitio de documentación construido con **VitePress**. Vue-based, ultra-rápido.

**Capas principales:**
- **Content**: Archivos Markdown en `docs/` o raíz
- **Config**: `.vitepress/config.ts` para sidebar, navbar, theme
- **Theme**: Customización en `.vitepress/theme/`
- **Components**: Vue components embeddable en Markdown
- **Build**: SSG con output en `.vitepress/dist/`

---

## CLI Tools

### node-cli

Herramienta de línea de comandos construida con **Node.js** + **Commander.js**. ESM modules.

**Capas principales:**
- **Entry point**: `bin/{{cli_name}}.js` — shebang script que invoca el CLI
- **CLI setup**: `src/cli.js` — registro de comandos con Commander
- **Commands**: `src/commands/` — un archivo por comando
- **Utils**: `src/utils/` — helpers compartidos (logging, fs, validation)
- **Config**: `package.json` con campo `bin` para registro global (`npm link`)
