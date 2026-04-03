# Secciones Específicas por Tipo de Proyecto

Cada tipo de proyecto generado por Grimox tiene secciones únicas. Insertar SOLO las secciones de la categoría detectada.

---

## Tabla de contenidos

- [web-fullstack-integrated](#web-fullstack-integrated)
- [web-fullstack-decoupled](#web-fullstack-decoupled)
- [web-frontend](#web-frontend)
- [api-backend](#api-backend)
- [mobile](#mobile)
- [desktop](#desktop)
- [iot-embedded](#iot-embedded)
- [data-ai](#data-ai)
- [documentation](#documentation)
- [cli-tools](#cli-tools)

---

## web-fullstack-integrated

Aplica a: Next.js 15, Nuxt 4, SvelteKit

### Rutas y Páginas

```markdown
## Rutas y Páginas

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `app/page.tsx` | Página principal |
| `/about` | `app/about/page.tsx` | Página About |

<!-- Listar TODAS las rutas encontradas en el proyecto -->
```

### API Routes

```markdown
## API Routes

| Método | Endpoint | Archivo | Descripción |
|--------|----------|---------|-------------|
| GET | `/api/health` | `app/api/health/route.ts` | Health check |

<!-- Para Next.js: archivos en app/api/
     Para Nuxt: archivos en server/api/
     Para SvelteKit: archivos +server.ts -->
```

### Server Components / Server Actions

```markdown
## Server Components

Este proyecto usa {{framework}} con renderizado en servidor.

- **Server Components**: Componentes que se renderizan en el servidor (por defecto en Next.js App Router)
- **Client Components**: Marcados con `'use client'` para interactividad
- **Server Actions**: Funciones del servidor llamadas desde el cliente (marcadas con `'use server'`)

### Componentes principales

| Componente | Tipo | Archivo | Descripción |
|-----------|------|---------|-------------|
| {{name}} | Server/Client | {{path}} | {{description}} |
```

---

## web-fullstack-decoupled

Aplica a: cualquier combinación frontend + backend

```markdown
## Arquitectura Desacoplada

Este proyecto usa una arquitectura de monorepo con frontend y backend separados.

```
{{project_name}}/
├── frontend/    → {{frontend_framework}} ({{frontend_language}})
├── backend/     → {{backend_framework}} ({{backend_language}})
└── docker-compose.yml
```

### Comunicación

- El frontend consume la API del backend vía HTTP/REST
- En desarrollo: frontend en puerto {{frontend_port}}, backend en puerto {{backend_port}}
- En producción: orquestados con docker-compose

---

## Frontend ({{frontend_framework}})

<!-- Insertar secciones de web-frontend aquí -->

---

## Backend ({{backend_framework}})

<!-- Insertar secciones de api-backend aquí -->
```

---

## web-frontend

Aplica a: React + Vite, Vue.js + Vite, Angular, Svelte + Vite

### Componentes

```markdown
## Componentes

| Componente | Archivo | Props | Descripción |
|-----------|---------|-------|-------------|
| {{name}} | `src/components/{{file}}` | {{props}} | {{description}} |

### Árbol de componentes

```
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── Footer
└── Pages
    ├── Home
    └── ...
```
```

### Routing

```markdown
## Routing

| Ruta | Componente | Guard/Auth | Descripción |
|------|-----------|------------|-------------|
| `/` | `Home` | No | Página principal |
| `/login` | `Login` | No | Inicio de sesión |
| `/dashboard` | `Dashboard` | Sí | Panel principal |

<!-- Para React: React Router
     Para Vue: Vue Router
     Para Angular: Angular Router
     Para Svelte: SvelteKit routing o svelte-routing -->
```

### State Management

```markdown
## State Management

**Solución**: {{state_library}}

| Store/Slice | Archivo | Estado que maneja |
|-------------|---------|-------------------|
| {{name}} | `src/stores/{{file}}` | {{description}} |
```

---

## api-backend

Aplica a: FastAPI, NestJS, Hono, Fastify, Spring Boot

### Endpoints

```markdown
## Endpoints API

Base URL: `http://localhost:{{port}}`

### Autenticación

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/login` | No | Iniciar sesión |
| POST | `/auth/register` | No | Registrar usuario |
| POST | `/auth/logout` | Bearer | Cerrar sesión |

### Recursos

| Método | Ruta | Auth | Body/Params | Respuesta | Descripción |
|--------|------|------|-------------|-----------|-------------|
| GET | `/api/v1/{{resource}}` | Bearer | — | `{{resource}}[]` | Listar todos |
| GET | `/api/v1/{{resource}}/:id` | Bearer | — | `{{resource}}` | Obtener por ID |
| POST | `/api/v1/{{resource}}` | Bearer | `{{create_dto}}` | `{{resource}}` | Crear |
| PUT | `/api/v1/{{resource}}/:id` | Bearer | `{{update_dto}}` | `{{resource}}` | Actualizar |
| DELETE | `/api/v1/{{resource}}/:id` | Bearer | — | — | Eliminar |
```

### Modelos de Datos

```markdown
## Modelos de Datos

### {{ModelName}}

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | UUID/Int | Sí | Identificador único |
| {{field}} | {{type}} | {{required}} | {{description}} |

<!-- Leer los archivos de modelos/schemas/entities del proyecto -->
```

### Middleware

```markdown
## Middleware

| Nombre | Orden | Archivo | Propósito |
|--------|-------|---------|-----------|
| CORS | 1 | — | Controlar orígenes permitidos |
| Auth | 2 | `src/middleware/auth.*` | Validar JWT/sesión |
| Logger | 3 | — | Registrar peticiones |

<!-- Para Express/Hono/Fastify: middleware chain
     Para NestJS: guards, interceptors, pipes
     Para FastAPI: dependencies, middleware
     Para Spring Boot: filters, interceptors -->
```

---

## mobile

Aplica a: React Native (Expo), Flutter, Flet

### Pantallas

```markdown
## Pantallas

| Pantalla | Archivo | Navegación desde | Descripción |
|----------|---------|-------------------|-------------|
| Home | `app/(tabs)/index.tsx` | Tab Bar | Pantalla principal |
| Profile | `app/profile.tsx` | Home → Header | Perfil de usuario |
| Settings | `app/settings.tsx` | Profile → Menú | Configuración |
```

### Navegación

```markdown
## Navegación

**Tipo**: {{navigation_type}}

<!-- Para Expo: Expo Router (file-based)
     Para Flutter: GoRouter o Navigator 2.0
     Para Flet: Flet navigation -->

### Estructura de navegación

```
Tab Navigator
├── Home (Stack)
│   ├── HomeScreen
│   └── DetailScreen
├── Search
└── Profile (Stack)
    ├── ProfileScreen
    └── SettingsScreen
```
```

### Features Nativos

```markdown
## Features Nativos

| Feature | Librería | Permisos | Descripción |
|---------|----------|----------|-------------|
| Cámara | expo-camera | CAMERA | Captura de fotos/video |
| Ubicación | expo-location | LOCATION | GPS del dispositivo |
| Notificaciones | expo-notifications | NOTIFICATIONS | Push notifications |
```

---

## desktop

Aplica a: Tauri, Electron, Flet

### Ventanas

```markdown
## Ventanas

| Ventana | Archivo | Dimensiones | Propósito |
|---------|---------|-------------|-----------|
| Main | `src/App.tsx` | 1200x800 | Ventana principal |
| Settings | `src/Settings.tsx` | 600x400 | Configuración |
```

### IPC (Inter-Process Communication)

```markdown
## Comunicación IPC

<!-- Para Tauri: Tauri commands (Rust ↔ JS)
     Para Electron: ipcMain / ipcRenderer -->

| Canal/Comando | Dirección | Payload | Respuesta | Descripción |
|---------------|-----------|---------|-----------|-------------|
| `get_data` | Frontend → Backend | — | `Data[]` | Obtener datos |
| `save_file` | Frontend → Backend | `{ path, content }` | `boolean` | Guardar archivo |
```

### Integración con Sistema

```markdown
## Integración con Sistema

| Feature | API/Módulo | Descripción |
|---------|-----------|-------------|
| Sistema de archivos | `fs` / Tauri fs API | Lectura/escritura de archivos |
| Tray icon | Tray API | Icono en la bandeja del sistema |
| Menú nativo | Menu API | Menú de la aplicación |
| Notificaciones | Notification API | Notificaciones del sistema |
```

---

## iot-embedded

Aplica a: Arduino, PlatformIO, ESP-IDF, MicroPython

### Configuración de Hardware

```markdown
## Configuración de Hardware

**Placa**: {{board_name}}
**Microcontrolador**: {{mcu}}
**Frecuencia**: {{clock_speed}}

### Pines utilizados

| Pin | Componente | Tipo | Dirección | Descripción |
|-----|-----------|------|-----------|-------------|
| GPIO2 | LED | Digital | Output | LED indicador |
| GPIO4 | DHT22 | Digital | Input | Sensor temperatura/humedad |
| GPIO34 | Potenciómetro | Analógico | Input | Control de brillo |
| GPIO21 | SDA (I2C) | I2C | Bidireccional | Bus de datos I2C |
| GPIO22 | SCL (I2C) | I2C | Bidireccional | Bus de reloj I2C |
```

### Protocolos de Comunicación

```markdown
## Protocolos de Comunicación

| Protocolo | Configuración | Pines | Uso |
|-----------|--------------|-------|-----|
| WiFi | SSID + Password | — | Conectividad a internet |
| I2C | 400kHz | GPIO21 (SDA), GPIO22 (SCL) | Sensores/displays |
| SPI | 10MHz | MOSI, MISO, SCK, CS | Módulos externos |
| Serial/UART | 115200 baud | TX, RX | Debug / comunicación |
| BLE | — | — | Bluetooth Low Energy |
```

### Diagrama de Conexión

```markdown
## Diagrama de Conexión

```
{{board_name}}
┌──────────────────┐
│                  │
│  GPIO2  ──→ LED (+ R330Ω)
│  GPIO4  ←── DHT22 (+ R4.7kΩ pullup)
│  GPIO34 ←── Potenciómetro
│  GPIO21 ↔── SDA (I2C Bus)
│  GPIO22 ↔── SCL (I2C Bus)
│  3V3    ──→ VCC sensores
│  GND    ──→ GND común
│                  │
└──────────────────┘
```

<!-- Adaptar según los componentes reales del proyecto -->
```

### Librerías

```markdown
## Librerías

| Librería | Versión | Propósito |
|----------|---------|-----------|
| WiFi.h | built-in | Conectividad WiFi |
| DHT.h | 1.4.6 | Sensor DHT22 |
| Adafruit_SSD1306 | 2.5.7 | Display OLED |

<!-- Para PlatformIO: leer lib_deps de platformio.ini
     Para Arduino: leer includes del .ino -->
```

---

## data-ai

Aplica a: FastAPI + ML Stack

### Modelos ML

```markdown
## Modelos de Machine Learning

| Modelo | Tipo | Algoritmo | Input | Output | Archivo |
|--------|------|-----------|-------|--------|---------|
| {{name}} | Clasificación/Regresión | {{algorithm}} | `{{input_shape}}` | `{{output_shape}}` | `models/{{file}}` |
```

### Datasets

```markdown
## Datasets

| Dataset | Formato | Ubicación | Filas | Columnas | Descripción |
|---------|---------|-----------|-------|----------|-------------|
| {{name}} | CSV/Parquet | `data/{{file}}` | {{rows}} | {{cols}} | {{description}} |
```

### Notebooks

```markdown
## Notebooks

| Notebook | Propósito | Dependencias |
|----------|-----------|-------------|
| `notebooks/EDA.ipynb` | Análisis exploratorio | pandas, matplotlib |
| `notebooks/training.ipynb` | Entrenamiento del modelo | scikit-learn |
```

### Pipelines

```markdown
## Pipelines de Datos

| Pipeline | Pasos | Trigger | Output |
|----------|-------|---------|--------|
| Preprocessing | Limpieza → Normalización → Feature Engineering | Manual | `data/processed/` |
| Training | Load → Train → Evaluate → Save | Manual | `models/` |
| Inference | Load model → Predict → Return | API endpoint | JSON response |
```

---

## documentation

Aplica a: Astro (Starlight), Docusaurus, VitePress

### Estructura de Contenido

```markdown
## Estructura de Contenido

| Sección | Directorio | Formato | Descripción |
|---------|-----------|---------|-------------|
| Guías | `src/content/docs/guides/` | MDX | Tutoriales paso a paso |
| Referencia | `src/content/docs/reference/` | MDX | Documentación de API |
| Blog | `src/content/blog/` | MDX | Artículos y novedades |

<!-- Para Astro Starlight: src/content/docs/
     Para Docusaurus: docs/
     Para VitePress: docs/ o src/ -->
```

### Configuración del Sidebar

```markdown
## Sidebar

La navegación lateral se configura en {{config_file}}.

<!-- Para Astro: astro.config.mjs (starlight.sidebar)
     Para Docusaurus: sidebars.js
     Para VitePress: .vitepress/config.ts (sidebar) -->

### Estructura actual

```
Docs
├── Introducción
│   ├── Getting Started
│   └── Instalación
├── Guías
│   ├── Guía Básica
│   └── Guía Avanzada
└── API Reference
    └── Endpoints
```
```

---

## cli-tools

Aplica a: Node.js + Commander

### Referencia de Comandos

```markdown
## Comandos

| Comando | Alias | Opciones | Descripción | Ejemplo |
|---------|-------|----------|-------------|---------|
| `{{cli_name}} {{command}}` | — | `--flag` | {{description}} | `{{cli_name}} {{command}} --flag value` |

### Opciones Globales

| Flag | Alias | Tipo | Descripción |
|------|-------|------|-------------|
| `--version` | `-V` | — | Mostrar versión |
| `--help` | `-h` | — | Mostrar ayuda |
| `--verbose` | `-v` | boolean | Modo detallado |
```

### Ejemplos de Uso

```markdown
## Ejemplos

### Caso básico
```bash
{{cli_name}} {{command}} argument
```

### Con opciones
```bash
{{cli_name}} {{command}} --option value --flag
```

### Pipeline
```bash
cat input.txt | {{cli_name}} process | {{cli_name}} format > output.txt
```
```
