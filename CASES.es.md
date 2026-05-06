# Grimox CLI — Casos de Uso Reales

> 🇬🇧 [Read in English](CASES.md)

---

## CASO 1: Creación de proyecto desde cero

### "Alex quiere lanzar su propio SaaS de gestión veterinaria"

Alex es un desarrollador full-stack de 36 años que vive en Neiva, Colombia. Lleva 10 años trabajando como empleado en una empresa de software, pero siempre ha tenido una espina clavada: su mamá tiene una veterinaria llamada **"PetVida"** en el barrio Jardin, y todo lo maneja en un cuaderno — las citas, los historiales clínicos de los animales, las vacunas pendientes, los pagos. Cada diciembre se pierde información, los recordatorios de vacunas se olvidan, y los clientes llaman preguntando cosas que nadie recuerda.

Una noche, después de ver a su mamá buscando entre papeles el historial de un golden retriever llamado **Thor**, Alex decide: *"Voy a construir un sistema para esto. Y no solo para mamá — para todas las veterinarias que están igual."*

Alex tiene claro lo que necesita:
- Un panel para gestionar pacientes (mascotas), dueños, citas y vacunas
- Generación de historiales clínicos en PDF
- Recordatorios automáticos de vacunas por WhatsApp
- Un módulo de facturación básico
- Que funcione en computador y celular
- Que sea seguro (datos médicos de mascotas son sensibles para los dueños)
- Que pueda venderlo como SaaS a otras veterinarias

Alex sabe programar React y Node, pero cada vez que empieza un proyecto desde cero pierde 2-3 días configurando: Tailwind, Docker, CI/CD, variables de entorno, estructura de carpetas... y eso lo desmotiva. Un día, en un grupo de Telegram de desarrolladores colombianos, alguien menciona **Grimox CLI**:

> *"Prueben Grimox, les crea el proyecto con todo configurado: Docker, CI/CD, seguridad, hasta las reglas para Cursor y Claude Code."*

Alex lo busca y decide probarlo.

---

### Paso 1: Descargar e instalar Grimox

Alex abre su terminal y clona el proyecto:

```bash
git clone https://github.com/ailoviot/GRIMOX.git
cd GRIMOX
npm install
npm link
```

Verifica que funciona:

```bash
grimox --help
```

```
Usage: grimox [options] [command]

CLI inteligente para crear y migrar aplicaciones modernas

Commands:
  create [options] [name]  Crear un nuevo proyecto con stack moderno
  migrate [options]        Migrar un proyecto existente a un stack moderno
  list                     Mostrar todos los stacks y frameworks disponibles
```

Alex sonríe. *"Bien, ahora veamos qué stacks tiene."*

---

### Paso 2: Explorar los stacks disponibles

```bash
grimox list
```

```
  Grimox CLI — Stacks Disponibles

  Web Fullstack Integrado
  ├── Next.js 15            TypeScript    React + SSR + App Router + Server Actions
  ├── Nuxt 4                TypeScript    Vue + SSR + Nitro server
  └── SvelteKit             TypeScript    Svelte + SSR + Server Endpoints

  Web Fullstack Desacoplado
  (Combina cualquier frontend SPA + backend separado)

  Web Frontend (solo SPA)
  ├── React + Vite          JS / TS       SPA con React 19
  ├── Vue.js + Vite         JS / TS       SPA con Vue 3
  ├── Angular               TypeScript    SPA con Angular 19
  └── Svelte + Vite         JS / TS       SPA con Svelte 5

  API / Backend (solo API)
  ├── FastAPI               Python        API async con Pydantic + Uvicorn
  ├── NestJS                TypeScript    Enterprise API framework
  ├── Hono                  TypeScript    Ultra-fast, multi-runtime
  ├── Fastify               JS / TS       High performance Node.js
  └── Spring Boot           Java/Kotlin   Enterprise Java/Kotlin API

  ...y más (Mobile, Desktop, IoT, Data/IA, Docs, CLI)

  Bases de datos: Supabase | PostgreSQL | Firebase | MongoDB
                  Oracle SQL | Turso | Redis | Insforge (insforge.dev)
```

Alex piensa: *"Para un SaaS necesito SSR para SEO, API integrada para los endpoints, y una base de datos con autenticación. Next.js 15 + Supabase suena perfecto."*

---

### Paso 3: Crear el proyecto

```bash
grimox create
```

El CLI cobra vida con una interfaz interactiva:

```
  ╭─────────────────────────────────╮
  │  🔮 Grimox CLI v0.1.0          │
  │  Intelligent Project Generator  │
  ╰─────────────────────────────────╯

◆  ¿Cuál es el nombre de tu proyecto?
│  petvida-saas

◆  ¿Qué tipo de aplicación necesitas?
│  ● Web Fullstack Integrado        → Un solo framework (Next.js, Nuxt, SvelteKit)
│  ○ Web Fullstack Desacoplado      → Frontend + Backend como servicios separados
│  ○ Web Frontend (solo SPA)        → Solo frontend sin backend propio
│  ○ API / Backend (solo API)       → Solo backend sin frontend
│  ○ App Móvil                      → React Native (Expo), Flutter, Flet
│  ○ App Desktop                    → Tauri, Electron, Flet
│  ○ IoT / Embebido                 → Arduino, PlatformIO, ESP-IDF, MicroPython
│  ○ Data Analytics / IA            → FastAPI + Python ML stack
│  ○ Documentación                  → Astro, Docusaurus, VitePress
│  ○ Herramienta CLI                → Node.js + Commander
```

Alex elige **Web Fullstack Integrado**.

```
◆  Elige el framework:
│  ● Next.js 15
│  ○ Nuxt 4
│  ○ SvelteKit

◇  Auto: TypeScript (estándar para Next.js 15)
```

No le preguntó por el lenguaje — Grimox sabe que Next.js 15 va con TypeScript. Alex no tuvo que decidir nada innecesario.

```
◆  ¿Qué framework de estilos CSS deseas usar?
│  ● Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)
```

Alex elige **Tailwind CSS v4**. Le gusta la velocidad de desarrollo con utility classes.

```
◆  Base de datos:
│  ● Supabase
│  ○ PostgreSQL
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
```

Elige **Supabase** — le da PostgreSQL, autenticación, storage para fotos de mascotas, y realtime para notificaciones. Todo en uno.

```
◇  Stack completo configurado:

  │  📦 petvida-saas/
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
```

Alex revisa el resumen. Todo lo que necesita está ahí. Presiona Enter.

```
◇  Copiando template local Next.js 15...       ████████████ 100%
◇  Aplicando features e integraciones IDE...    ████████████ 100%
◇  Repositorio git inicializado

  ╭───────────────────────────────────────────────╮
  │  ✔ Proyecto listo para desarrollar              │
  │                                                 │
  │  cd petvida-saas                                │
  │  npm install                                    │
  │  npm run dev                                    │
  │                                                 │
  │  Integraciones IDE generadas:                   │
  │  📄 GRIMOX.md  (contexto universal)             │
  │  📁 .ai/skills/ (skills: cualquier LLM)         │
  │  📄 .ai/rules.md (reglas: cualquier LLM)        │
  ╰───────────────────────────────────────────────╯
```

**12 segundos.** Alex tiene un proyecto listo.

---

### Paso 4: Ver lo que Grimox generó

Alex entra a la carpeta y explora:

```bash
cd petvida-saas
ls -la
```

```
petvida-saas/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Layout principal con metadata
│   │   ├── page.tsx            ← Página de inicio
│   │   └── globals.css         ← Tailwind configurado
│   ├── lib/
│   │   └── supabase.ts        ← Conexión a Supabase lista
│   └── styles/
│       └── globals.css         ← Design system base (colores, tipografía)
├── .cursorrules                ← Reglas para Cursor, Trae, Windsurf, Antigravity
├── GRIMOX.md                   ← Contexto universal (Claude, GPT, Gemini, Grok, GLM...)
├── .ai/
│   ├── skills/                 ← Skills: accesibles desde cualquier LLM o IDE
│   │   ├── grimox-dev.md       ← Skill de desarrollo autónomo
│   │   ├── grimox-migrate.md   ← Skill de migración profunda
│   │   └── grimox-docs.md      ← Skill de documentación
│   └── rules.md                ← Reglas del stack para cualquier LLM o IDE
├── .claude/
│   └── commands/               ← Adaptador Claude Code / Open Code (slash commands)
│       ├── grimox-dev.md       ← habilita /grimox-dev
│       ├── grimox-migrate.md   ← habilita /grimox-migrate
│       └── grimox-docs.md      ← habilita /grimox-docs
├── .github/
│   └── copilot-instructions.md ← Adaptador GitHub Copilot (reglas del stack)
├── .mcp/
│   └── config.json             ← Servidores MCP configurados para Supabase
├── .github/
│   └── workflows/
│       └── ci.yml              ← Pipeline de CI/CD listo
├── .env.example                ← Variables de entorno documentadas
├── .env                        ← Variables para desarrollo
├── Dockerfile                  ← Multi-stage build (Node → nginx)
├── docker-compose.yml          ← App + todo lo necesario
├── package.json                ← Dependencias + scripts
├── tailwind.config.ts          ← Tailwind configurado
├── tsconfig.json               ← TypeScript estricto
└── next.config.ts              ← Next.js configurado
```

Alex abre `.env.example` y ve:

```
# App
NODE_ENV=development
PORT=3000

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Auth
JWT_SECRET=change-this-to-a-secure-random-string
```

Cada variable documentada. Sin tener que adivinar qué necesita.

---

### Paso 5: Empezar a desarrollar

Alex configura sus credenciales de Supabase en `.env`, instala dependencias y arranca:

```bash
npm install
npm run dev
```

El proyecto corre en `http://localhost:3000`. Ve la página de bienvenida de Next.js con Tailwind configurado. Abre **Cursor** y nota que `.cursorrules` ya tiene las reglas de Next.js 15:

```
## Next.js 15
- Usa App Router (no Pages Router)
- Prefiere Server Components por defecto, usa 'use client' solo cuando sea necesario
- Usa Server Actions para mutaciones de datos
- Implementa loading.tsx y error.tsx en cada ruta
...
```

Cursor ya sabe cómo ayudarlo con Next.js 15 porque Grimox le enseñó.

Alex mira la estructura del proyecto. Todo está listo: Supabase conectado, Tailwind configurado, Docker preparado. Pero... las páginas están vacías. Solo tiene el template de bienvenida. Necesita la app completa: páginas de mascotas, citas, vacunas, dueños, facturación.

Podría programarlo manualmente — pero recuerda que Grimox le generó una skill llamada `/grimox-dev`. Justo al terminar el scaffold, Grimox detectó que su VSCode estaba abierto en la carpeta padre y le ofreció abrir el proyecto en una ventana nueva — aceptó y la nueva ventana ya tiene los slash commands cargados. Abre **Claude Code** ahí:

```bash
claude
```

---

### Paso 6: Desarrollar la app completa con `/grimox-dev`

Alex le dice a Claude Code lo que necesita:

> *"Necesito un SaaS veterinario con: registro de mascotas (nombre, especie, raza, edad, dueño, foto), gestión de citas (calendario, estados: pendiente/atendida/cancelada), control de vacunas (con recordatorios automáticos), y facturación básica. Usa Supabase para todo."*

```
> /grimox-dev
```

La skill se activa. Claude Code no pregunta más — ya tiene toda la información que necesita:

```
◇  Grimox Dev Architect activado

────────────────────────────────────────────
 FASE 1: Reconocimiento del Proyecto
────────────────────────────────────────────

◇  Leyendo GRIMOX.md...       ✓ Stack: Next.js 15 + Supabase + Tailwind
◇  Leyendo .ai/rules.md...    ✓ Reglas: App Router, Server Components, TypeScript estricto
◇  Leyendo package.json...    ✓ Dependencias: next@15, react@19, @supabase/supabase-js
◇  Leyendo .env.example...    ✓ Variables: SUPABASE_URL, SUPABASE_ANON_KEY
◇  Leyendo supabase.ts...     ✓ Conexión configurada

  Stack detectado: Next.js 15 (TypeScript) + Supabase + Tailwind CSS v4

────────────────────────────────────────────
 FASE 2: Plan de Implementación
────────────────────────────────────────────

  📋 Módulos a implementar:

  1. 🗃️ Database — Tablas en Supabase (mascotas, dueños, citas, vacunas, facturas)
  2. 🔐 Auth — Registro/login con Supabase Auth
  3. 🐾 Mascotas — CRUD completo + subida de fotos a Supabase Storage
  4. 👤 Dueños — CRUD + búsqueda + relación con mascotas
  5. 📅 Citas — Calendario, estados, filtros por fecha
  6. 💉 Vacunas — Control + cálculo de próxima dosis + recordatorios
  7. 💰 Facturación — Crear factura, items, totales, PDF
  8. 📊 Dashboard — KPIs (citas del día, vacunas pendientes, ingresos del mes)

  ¿Proceder con la implementación completa?
```

Alex confirma. Claude Code empieza a trabajar autónomamente:

```
────────────────────────────────────────────
 FASE 3: Implementación
────────────────────────────────────────────

◇  [1/8] Database — Creando tablas en Supabase...
  ✔ Creado: supabase/migrations/001_create_tables.sql
  ✔ 5 tablas: mascotas, duenos, citas, vacunas, facturas
  ✔ RLS policies configuradas
  ✔ Storage bucket "fotos-mascotas" creado

◇  [2/8] Auth — Implementando autenticación...
  ✔ Creado: src/app/(auth)/login/page.tsx
  ✔ Creado: src/app/(auth)/register/page.tsx
  ✔ Creado: src/lib/auth.ts (helpers de Supabase Auth)
  ✔ Creado: src/middleware.ts (protección de rutas)

◇  [3/8] Mascotas — CRUD completo...
  ✔ Creado: src/app/(dashboard)/mascotas/page.tsx (listado con búsqueda)
  ✔ Creado: src/app/(dashboard)/mascotas/[id]/page.tsx (detalle)
  ✔ Creado: src/app/(dashboard)/mascotas/nueva/page.tsx (formulario)
  ✔ Creado: src/components/mascotas/MascotaCard.tsx
  ✔ Creado: src/components/mascotas/MascotaForm.tsx
  ✔ Creado: src/app/api/mascotas/route.ts (Server Actions)
  ✔ Subida de fotos a Supabase Storage integrada

◇  [4/8] Dueños...
  ✔ 4 archivos creados

◇  [5/8] Citas — Calendario + estados...
  ✔ Creado: src/app/(dashboard)/citas/page.tsx (vista calendario)
  ✔ Creado: src/components/citas/CalendarioCitas.tsx
  ✔ Creado: src/components/citas/NuevaCitaModal.tsx
  ✔ Estados: pendiente → atendida / cancelada

◇  [6/8] Vacunas — Control + recordatorios...
  ✔ Creado: src/app/(dashboard)/vacunas/page.tsx
  ✔ Creado: src/lib/vacunas/calcularProximaDosis.ts
  ✔ Creado: src/app/api/vacunas/recordatorios/route.ts (cron job)
  ✔ Lógica: calcula próxima dosis según especie + tipo de vacuna

◇  [7/8] Facturación...
  ✔ 5 archivos creados + generación de PDF con @react-pdf/renderer

◇  [8/8] Dashboard — KPIs...
  ✔ Creado: src/app/(dashboard)/page.tsx
  ✔ KPIs: citas del día, vacunas pendientes esta semana, ingresos del mes
  ✔ Gráficas con datos reales de Supabase

────────────────────────────────────────────
 FASE 4: Build → Test → Fix (loop)
────────────────────────────────────────────

◇  npm run build...
  ⚠ Error: 'MascotaCard' cannot be used as a Server Component (uses useState)
  → Fix: Agregando 'use client' a MascotaCard.tsx
  ◇  npm run build...
    ├── prebuild: grimox-daemon kill-dev && grimox-daemon spawn-detached
    ├── next build → ✓ Compilado correctamente
    └── postbuild: grimox-qa --dynamic --auto-server
        ├── Arrancando production server temporal: npx next start -p 3100
        ├── Reusando browser del daemon (CDP, intento 1)
        ├── 5 rutas auto-descubiertas — smoke tests ✓
        └── Ejecutando flows visuales de .grimox/qa-plan.yml
  ✓ QA pasó — 11/11 flows

────────────────────────────────────────────
 FASE 4.5: Testing Visual reusando el browser del daemon
────────────────────────────────────────────

  (Todo el testing ocurrió en la misma ventana Chromium que está
   visible desde npm install — con overlays Grimox Studio mostrando
   estado LIVE, progress bar, toasts de cambios y flash pass/fail.)

  ✓ /              → Dashboard carga — KPIs reales de Supabase visibles
  ✓ /mascotas      → Tabla muestra 3 registros de seed, botón "Nueva mascota" presente
  ✓ /citas         → Calendario renderiza correctamente, sin errores de hydration
  ✓ /vacunas       → Tabla con próximas fechas y estado por especie
  ✓ /facturacion   → Formulario de nueva factura sin errores visuales

  Flows ejecutados:
  ✓ "Crear nueva mascota Thor"     — llenar form + submit + aparece en listado
  ✓ "Crear 3 mascotas consecutivas" — listado muestra las 3 en orden
  ✓ "Borrar mascota"               — verifica text_not_visible tras eliminar
  ✓ "Ruta protegida sin sesión redirige a /login"

────────────────────────────────────────────
 FASE 5: Verificación Final
────────────────────────────────────────────

  ╭───────────────────────────────────────────────────────────╮
  │  ✔ Desarrollo completado                                  │
  │                                                           │
  │  📁 34 archivos creados                                   │
  │  🗃️ 5 tablas + RLS + Storage configurados                 │
  │  🔐 Auth: login + register + middleware                   │
  │  📦 8 módulos implementados                               │
  │  ✓ Build exitoso (exit 0)                                 │
  │  ✓ QA pasó — 11/11 flows en un solo browser visible       │
  │                                                           │
  │  npm run dev → http://localhost:3000                      │
  ╰───────────────────────────────────────────────────────────╯
```

**En 15 minutos**, Claude Code implementó toda la aplicación y la verificó visualmente — los 11 flows corrieron en la **misma ventana de Chromium** que está abierta desde `npm install` (con overlays Grimox Studio persistentes). Alex abre `http://localhost:3000`, registra a Thor como primer paciente, le programa una cita para el jueves, y agenda su vacuna antirrábica. Todo estaba ya verificado por el QA automático del postbuild — si algún flow hubiera fallado, `npm run build` habría retornado exit code 1 y Claude Code habría sido forzado a corregir antes de reportar "listo".

No escribió una sola línea de código. La skill `/grimox-dev` leyó las convenciones del proyecto (GRIMOX.md, .ai/rules.md), entendió el stack (Next.js 15 + Supabase), y desarrolló todo siguiendo las mejores prácticas que Grimox configuró al crear el proyecto.

---

### Paso 7: Generar documentación con `/grimox-docs`

Un mes después, Alex quiere incorporar a **Daniela**, una desarrolladora junior, al proyecto. Pero no tiene documentación — todo está en su cabeza. En vez de escribir docs manualmente, usa otra skill:

```
> /grimox-docs
```

Claude Code lee todo el código fuente, la estructura de la base de datos en Supabase, los API routes, los componentes, y genera:

```
◇  Analizando código fuente, API routes, componentes, schemas...

📄 PROJECT_DOCS.md generado (847 líneas)

Contenido:
  1. Descripción General — SaaS veterinario para gestión de pacientes, citas y vacunas
  2. Arquitectura — Next.js 15 App Router + Supabase (diagrama ASCII incluido)
  3. Stack Tecnológico — Next.js 15, React 19, TypeScript, Tailwind, Supabase
  4. Estructura de Archivos — tree con descripción de cada carpeta
  5. API Reference — 12 endpoints documentados con parámetros y respuestas
  6. Componentes UI — 18 componentes con sus props tipadas
  7. Base de Datos — 5 tablas con schema, relaciones y RLS policies
  8. Variables de Entorno — 6 variables con descripción
  9. Cómo Correr — dev, test, build, Docker
  10. Deploy — Vercel + Supabase (paso a paso)
```

Alex le manda el repo a Daniela con la documentación incluida. Ella empieza a contribuir al día siguiente sin necesitar una sola llamada de "onboarding".

---

### Lo que Alex obtuvo sin escribir una sola línea de configuración

| Componente | Antes (manual) | Con Grimox |
|---|---|---|
| Estructura del proyecto | 30 min | 0 min |
| Configurar TypeScript | 15 min | 0 min |
| Configurar Tailwind CSS | 20 min | 0 min |
| Conectar Supabase | 25 min | 0 min |
| Dockerfile + docker-compose | 45 min | 0 min |
| GitHub Actions CI/CD | 30 min | 0 min |
| .env.example + validación | 15 min | 0 min |
| .cursorrules para el IDE | 20 min | 0 min |
| GRIMOX.md + skills | ∞ (no sabía que existía) | 0 min |
| **Total** | **~3.5 horas** | **12 segundos** |

---

Tres meses después, **PetVida** es una plataforma que usan 14 veterinarias en Colombia. Alex dejó su empleo. Su mamá ya no pierde historiales. Y Thor, el golden retriever, recibió su vacuna a tiempo porque el sistema mandó un recordatorio automático por WhatsApp.

Todo empezó con un solo comando:

```bash
grimox create
```

---

---

## CASO 2: Migración de proyecto existente

### "Camila necesita rescatar el sistema contable de su empresa antes de que colapse"

Son las 11:47 p.m. de un martes. Camila está en la oficina sola, mirando un Slack que acaba de llegar del gerente de **Grupo Empresarial Torres** — su cliente más grande, 40 sedes, 3 años con ellos:

> *"Camila, ya van 3 días con errores al emitir facturas. Mis contadores no pueden trabajar. Si el sistema no está estable esta semana, vamos a buscar otra solución."*

Camila cierra el laptop. Sabe exactamente cuál es el problema — lo sabe desde hace dos años. No es un bug puntual. Es el sistema entero.

---

Camila tiene 32 años y es la líder técnica en **"ContaFlex"**, una empresa de software contable en Bogotá que lleva 8 años en el mercado. El producto estrella de ContaFlex es un sistema de facturación electrónica que usan 200+ empresas colombianas para generar facturas compatibles con la DIAN.

El problema: el sistema fue construido en **2016** con las tecnologías de esa época:

```
contaflex-legacy/
├── client/                    ← jQuery 2.x + Bootstrap 3 + Handlebars
│   ├── js/
│   │   ├── app.js             ← 4,200 líneas de jQuery
│   │   ├── factura.js         ← lógica de facturación
│   │   └── reportes.js        ← generación de reportes
│   ├── css/
│   │   └── styles.css         ← 2,800 líneas de CSS vanilla
│   └── templates/
│       └── *.hbs              ← 23 templates Handlebars
├── server/
│   ├── app.js                 ← Express 4.14 (CommonJS)
│   ├── routes/                ← 18 archivos de rutas
│   ├── models/                ← Mongoose 4.x (6 modelos)
│   └── middleware/
│       ├── auth.js            ← Passport.js + sessions
│       └── dian-connector.js  ← Integración con API de la DIAN
├── package.json
└── .env                       ← credenciales hardcodeadas (sí, en producción)
```

Los síntomas del sistema:
- **Lento**: cada página tarda 4-6 segundos en cargar (jQuery + Bootstrap sin optimizar)
- **Inseguro**: credenciales de la DIAN hardcodeadas en `.env` que está en el repositorio
- **Frágil**: no hay tests. Cada vez que tocan algo, algo más se rompe
- **Imposible de mantener**: 4,200 líneas de jQuery en un solo archivo
- **Sin CI/CD**: deploys manuales por FTP a un servidor en GoDaddy
- **Sin Docker**: funciona "en mi máquina" pero cuesta horrores deployar

El CTO le dice a Camila: *"Tenemos 3 meses antes de que la DIAN actualice su API de facturación electrónica. Si no migramos, dejamos de funcionar y perdemos 200 clientes."*

**200 clientes. 8 años de empresa. 3 meses.**

Camila sabe que reescribir desde cero no es opción — 3 meses no alcanzan para reescribir 8 años de lógica de negocio compleja: el conector de la DIAN, el motor de cálculo de IVA con 12 casos especiales, la lógica de retenciones, la generación de XML de factura electrónica con firma digital. Eso no se reescribe. Se **migra**.

La pregunta es cómo hacerlo sin romper nada mientras 200 empresas siguen facturando en producción.

Un colega de otro equipo, en una reunión casual, menciona Grimox. *"Hay una CLI que usa IA para analizar tu código real y generar un plan de migración archivo por archivo."* Camila lo busca esa noche.

---

### Paso 1: Instalar Grimox y configurar el LLM

Camila ya tiene Claude Code instalado con su `ANTHROPIC_API_KEY` configurada en su sistema. Instala Grimox:

```bash
git clone https://github.com/ailoviot/GRIMOX.git
cd GRIMOX
npm install
npm link
```

Verifica que Grimox detecta su LLM:

```bash
cd /proyectos/contaflex-legacy
grimox migrate --plan
```

```
  ╭─────────────────────────────────╮
  │  🔮 Grimox CLI v0.1.0          │
  │  Intelligent Project Generator  │
  ╰─────────────────────────────────╯

◇  Verificando modelos de IA disponibles...
◇  1 modelo(s) de IA encontrado(s)
  ✓ Modelo de IA: Claude (Anthropic) ☁️  (Variable de entorno: ANTHROPIC_API_KEY)
```

Perfecto. Grimox encontró Claude automáticamente.

---

### Paso 2: Grimox analiza el proyecto

El CLI escanea el proyecto automáticamente:

```
◇  Escaneando estructura del proyecto...

◆  Estructura detectada: Proyecto desacoplado

  🖥️  client/   →  JavaScript (jQuery + Handlebars)
  ⚙️  server/   →  Express ^4.14.0

  ├── Docker:  ✗ No detectado
  └── CI/CD:   ✗ No detectado

◆  ¿Qué deseas migrar?
│  ● Todo (frontend + backend)
│  ○ Solo frontend (client/)
│  ○ Solo backend (server/)
```

Camila elige **Todo**. Grimox le muestra el detalle de cada parte:

```
◆  Stack — frontend (client/):
│  ├── Lenguaje     JavaScript (ES5)
│  ├── Framework    jQuery 2.x (sin framework moderno)
│  ├── Build        No detectado (archivos estáticos)
│  ├── Database     No detectada (consume API del backend)
│  ├── Estilos      Bootstrap 3 + CSS vanilla
│  └── Tests        ✗ No detectado
│
│  ⚠ jQuery 2.x detectado → considerar migración a framework moderno
│  ⚠ Bootstrap 3 → descontinuado

◆  Stack — backend (server/):
│  ├── Lenguaje     JavaScript (CommonJS)
│  ├── Framework    Express ^4.14.0
│  ├── Build        No detectado
│  ├── Database     MongoDB (Mongoose 4.x)
│  ├── Estilos      No detectado
│  └── Tests        ✗ No detectado
│
│  ⚠ Express ^4.14.0 → versión muy desactualizada
│  ⚠ Mongoose 4.x → Mongoose 8 disponible
```

Camila ve la lista de problemas. No es sorpresa — los conoce todos. Pero ahora tiene que decidir a dónde migrar.

---

### Paso 3: Elegir el stack destino

Grimox le pregunta primero por el **frontend**:

```
◆  ¿A qué tipo de aplicación migrar frontend (client/)?
│  ○ Web Fullstack Integrado        → Next.js, Nuxt, SvelteKit
│  ● Web Frontend (solo SPA)        → React+Vite, Vue+Vite, Angular, Svelte
│  ○ Web Fullstack Desacoplado      → Frontend + Backend separados
│  ○ App Desktop                    → Tauri, Electron
```

Camila elige **Web Frontend (solo SPA)** — quiere mantener el frontend y backend separados porque el equipo de backend es diferente al de frontend.

```
◆  Elige el framework para frontend (client/):
│  ● React + Vite (Recomendado)
│  ○ Vue.js + Vite
│  ○ Angular
│  ○ Svelte + Vite
```

Grimox recomienda React + Vite, pero Camila tiene 3 desarrolladores Angular en su equipo. Elige **Angular**:

```
◇  Auto: TypeScript (obligatorio en Angular)
```

Ahora los estilos:

```
◆  ¿Qué framework de estilos CSS deseas usar?
│  ○ Tailwind CSS v4 (Recomendado)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ● Sass / SCSS puro
│  ○ CSS puro (custom / corporativo)
│  ○ Styled Components (CSS-in-JS)
```

Camila elige **Sass / SCSS puro**. ContaFlex tiene un design system corporativo con colores, tipografías y componentes propios que no quiere perder. Sass le permite mantener sus variables y mixins existentes mientras moderniza la estructura.

Ahora el **backend**:

```
◆  ¿A qué tipo de aplicación migrar backend (server/)?
│  ● API / Backend (solo API)       → FastAPI, Hono, NestJS, Fastify, Spring Boot
│  ○ Web Fullstack Integrado        → Next.js, Nuxt, SvelteKit

◆  Elige el framework para backend (server/):
│  ○ FastAPI
│  ● NestJS (Recomendado)
│  ○ Hono
│  ○ Fastify
│  ○ Spring Boot
```

Camila elige **NestJS** — el equipo es TypeScript y NestJS tiene una estructura modular similar a lo que ya tienen con Express, lo que facilita la migración.

La base de datos:

```
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
```

Camila elige **mantener MongoDB** — tienen 200 empresas con datos en producción. Cambiar la base de datos es demasiado riesgo en 3 meses.

---

### Paso 4: Grimox analiza el código con IA

```
◆  ¿Modo de migración?
│  ● Generar plan (revisar antes de aplicar)
│  ○ Aplicar automáticamente (con backup)
```

Camila elige **Generar plan** — quiere revisar antes de que la IA toque algo.

```
◇  Analizando código fuente con IA...             ████████████ 100%
◇  Análisis completado

◇  Generando plan de migración inteligente...     ████████████ 100%
◇  Plan generado

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Plan de migración generado con IA                │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  🤖 Modelo: Claude (Anthropic)                      │
  │                                                     │
  │  frontend (client/) → Angular 19                    │
  │  backend (server/) → NestJS                         │
  │                                                     │
  │  El plan incluye:                                   │
  │  • Análisis de arquitectura y patrones detectados   │
  │  • Pasos específicos archivo por archivo            │
  │  • Snippets before/after para cada cambio           │
  │  • Mapeo de middleware Express → NestJS              │
  │  • Migración de Mongoose 4 → 8                      │
  │  • Dependencias a agregar/quitar                    │
  │                                                     │
  │  Para aplicar:  grimox migrate --apply              │
  ╰─────────────────────────────────────────────────────╯
```

---

### Paso 5: Revisar el plan

Camila abre `MIGRATION_PLAN.md` y encuentra un documento detallado:

```markdown
# Plan de Migración — Grimox CLI

**Fecha:** 2026-03-19
**Modelo IA:** Claude (Anthropic)
**Estructura:** Desacoplado
**Partes a migrar:** 2

## Análisis del Proyecto (generado por IA)

**Arquitectura:** Monolítico desacoplado (client estático + API REST)
**Patrones:** MVC en backend, jQuery spaghetti en frontend
**Estado:** Sin gestión de estado (variables globales en jQuery)
**Autenticación:** Passport.js con sessions (sin JWT)
**Acceso a DB:** Mongoose directo en controllers (sin repository pattern)

### Problemas Detectados

- ⚠ Credenciales de DIAN hardcodeadas en .env (CRÍTICO)
- ⚠ No hay validación de inputs en 12 de 18 rutas
- ⚠ SQL injection posible en búsqueda de facturas (query string sin sanitizar)
- ⚠ 4,200 líneas en un solo archivo jQuery (inmaintenible)
- ⚠ Mongoose 4.x tiene vulnerabilidades conocidas
- ⚠ No hay tests — cualquier cambio es un riesgo

### Recomendaciones de la IA

- 💡 Priorizar la migración del módulo DIAN — es lo más urgente
- 💡 Migrar autenticación a JWT antes que el resto
- 💡 Crear tests para la lógica de facturación ANTES de migrar
- 💡 Los 23 templates Handlebars mapean a 23 componentes Angular

---

## frontend (client/) → Angular 19

**Stack actual:** jQuery 2.x + Handlebars + Bootstrap 3 (JavaScript ES5)
**Stack destino:** Angular 19 (TypeScript) + Sass/SCSS

### Pasos de Migración (generados por IA)

#### 1. Crear estructura Angular

Crear proyecto Angular con los módulos equivalentes a las páginas actuales.

**Archivos afectados:**
- Todos los .hbs → componentes Angular
- js/app.js → app.component.ts + router
- js/factura.js → factura.module.ts
- js/reportes.js → reportes.module.ts

#### 2. Migrar templates Handlebars → Componentes Angular

**Antes (Handlebars):**
```hbs
<div class="factura-row">
  <span>{{factura.numero}}</span>
  <span>{{factura.cliente}}</span>
  <span class="total">${{formatMoney factura.total}}</span>
</div>
```

**Después (Angular):**
```html
<div class="factura-row">
  <span>{{ factura.numero }}</span>
  <span>{{ factura.cliente }}</span>
  <span class="total">{{ factura.total | currency:'COP' }}</span>
</div>
```

#### 3. Migrar jQuery DOM → Angular bindings

**Antes (jQuery):**
```javascript
$('#btn-crear-factura').on('click', function() {
    var cliente = $('#select-cliente').val();
    var items = [];
    $('.item-row').each(function() {
        items.push({
            descripcion: $(this).find('.desc').val(),
            cantidad: parseInt($(this).find('.cant').val()),
            precio: parseFloat($(this).find('.precio').val())
        });
    });
    $.ajax({
        url: '/api/facturas',
        method: 'POST',
        data: JSON.stringify({ cliente, items }),
        contentType: 'application/json',
        success: function(res) {
            alert('Factura creada: ' + res.numero);
            location.reload();
        }
    });
});
```

**Después (Angular):**
```typescript
@Component({ ... })
export class CrearFacturaComponent {
    private facturaService = inject(FacturaService);

    clienteId = '';
    items: FacturaItem[] = [];

    async crearFactura() {
        const factura = await this.facturaService.crear({
            clienteId: this.clienteId,
            items: this.items,
        });
        this.router.navigate(['/facturas', factura.id]);
    }
}
```

...y así con cada archivo, cada patrón, cada transformación.
```

Camila lee el plan completo — tiene 28 pasos detallados divididos en 10 fases. Cada paso referencia archivos reales de SU proyecto con snippets before/after. No son pasos genéricos tipo "migrar el frontend" — son instrucciones específicas como *"Convertir js/factura.js líneas 145-230 (lógica de cálculo de IVA) en un service Angular FacturaCalculatorService"*.

Lo imprime. Convoca a su equipo al día siguiente — dos desarrolladores frontend y uno backend. Les muestra el plan. **"¿En serio una IA generó esto?"** pregunta Julián, el más escéptico del equipo. *"Esto es específico para nuestro código."* Camila asiente. *"Exacto. Ahora dividamos los pasos."*

---

### Paso 6: Aplicar la migración

Después de revisar y ajustar el plan con su equipo, Camila decide aplicar:

```bash
grimox migrate --apply
```

```
◇  Verificando modelos de IA disponibles...
  ✓ Modelo de IA: Claude (Anthropic) ☁️

◇  Creando backup...                              ████████████ 100%
◇  Backup creado en .grimox-backup/

◇  Analizando código fuente con IA...             ████████████ 100%
◇  Análisis completado

◇  Generando plan de migración...                 ████████████ 100%
◇  Plan generado

◇  Aplicando transformaciones de código...         ████████████ 100%
  Transformado: server/routes/facturas.js
  Transformado: server/routes/clientes.js
  Transformado: server/routes/auth.js
  Transformado: server/models/Factura.js
  Transformado: server/models/Cliente.js
  Transformado: server/middleware/auth.js
  Transformado: client/js/factura.js
  Transformado: client/js/reportes.js
◇  Transformaciones aplicadas: 8/15 archivos

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Migración aplicada con IA                        │
  │                                                     │
  │  📁 .grimox-backup/ (archivos originales)           │
  │     ├── client/    (copia completa)                 │
  │     └── server/    (copia completa)                 │
  │  📄 MIGRATION_PLAN.md (plan detallado)              │
  │  🔄 Archivos transformados: 8/15                    │
  │                                                     │
  │  ⚠ 7 archivo(s) requieren revisión manual          │
  ╰─────────────────────────────────────────────────────╯
```

8 de 15 archivos fueron transformados automáticamente. Los 7 restantes son demasiado complejos (como el conector de la DIAN con lógica de negocio muy específica) y necesitan revisión manual del equipo.

---

### Paso 7: Continuar la migración con `/grimox-migrate` en el IDE

Para los 7 archivos pendientes, el equipo se reúne. Julián señala el elefante en la habitación: *"El conector de la DIAN. 380 líneas. Certificados digitales, firmas XML, 3 endpoints distintos. Si esto se rompe, ningún cliente puede facturar."*

Silencio. Ese archivo nadie quiere tocarlo. Lleva 4 años en producción sin que nadie entienda exactamente cómo funciona — fue escrito por un desarrollador que ya no está en la empresa.

Camila abre **Claude Code** en el proyecto y usa la skill que Grimox generó:

```bash
claude
```

```
> /grimox-migrate
```

Claude Code lee TODO el código fuente y la guía archivo por archivo. Camila le dice:

> *"Necesito migrar el conector de la DIAN (server/middleware/dian-connector.js). Es el archivo más crítico — no puede romperse. Hay lógica que nadie del equipo entiende completamente."*

Claude Code analiza las 380 líneas del conector, identifica los endpoints de la DIAN que usa, los certificados digitales, los formatos XML de facturación electrónica, y genera la versión NestJS:

```
◇  Analizando dian-connector.js...

  Encontré:
  • 3 endpoints de la DIAN (enviar factura, consultar estado, anular)
  • Certificado digital .p12 cargado con crypto
  • Firmas XML con xmldsig
  • 2 funciones de retry con backoff exponencial

  Generando DianService para NestJS...

  ✔ Creado: server/src/integrations/dian/dian.service.ts
  ✔ Creado: server/src/integrations/dian/dian.module.ts
  ✔ Creado: server/src/integrations/dian/dian.types.ts
  ✔ Tests: server/src/integrations/dian/dian.service.spec.ts

  La lógica de firma XML y certificados se mantuvo idéntica.
  Solo cambió la estructura (Express middleware → NestJS injectable service).
```

Camila revisa el código generado línea por línea — y ve algo que no esperaba: no solo migró la estructura. La IA entendió el propósito de cada bloque. Encontró un bug silencioso en la función de retry que en el código original nunca hacía el tercer intento (condición mal escrita), y lo corrigió en la versión NestJS.

Julián mira sobre su hombro. *"Espera... eso era un bug real?"* Camila corre los tests. Pasan todos. *"Seis años con ese bug en producción"*, dice en voz baja.

La versión NestJS del conector está lista. El archivo más temido del proyecto, migrado en 40 minutos.

---

### Paso 8: Completar la migración del frontend con `/grimox-dev`

El backend ya está migrado a NestJS. Pero el frontend sigue siendo jQuery + Handlebars. Camila necesita construir toda la UI de Angular desde cero — los 23 componentes, las rutas, los formularios, la integración con la API migrada.

En vez de asignar esto a su equipo (que tardaría semanas), usa la skill de desarrollo autónomo:

```
> /grimox-dev
```

> *"El backend ya está migrado a NestJS con los mismos endpoints. Necesito el frontend Angular completo: login, dashboard con métricas, CRUD de clientes, módulo de facturación con generación de PDF, módulo de reportes, y la integración con la API de la DIAN para consultar estado de facturas. Los estilos deben ser Sass usando las variables corporativas que ya existen en client/css/styles.css."*

```
◇  Grimox Dev Architect activado

────────────────────────────────────────────
 FASE 1: Reconocimiento
────────────────────────────────────────────

◇  Leyendo GRIMOX.md...        ✓ Stack: Angular 19 + NestJS + MongoDB + Sass
◇  Leyendo .ai/rules.md...     ✓ Angular 19 + Sass + standalone components
◇  Leyendo backend endpoints... ✓ 18 endpoints NestJS detectados
◇  Leyendo styles.css viejo... ✓ Variables corporativas extraídas:
    $color-primary: #1a3c5e, $color-secondary: #2e86c1, $font-family: 'Segoe UI'

────────────────────────────────────────────
 FASE 3: Implementación
────────────────────────────────────────────

◇  [1/7] Auth — Login + Guards...
  ✔ Creado: src/app/auth/login/login.component.ts
  ✔ Creado: src/app/core/guards/auth.guard.ts
  ✔ Creado: src/app/core/interceptors/jwt.interceptor.ts

◇  [2/7] Dashboard — Métricas del día...
  ✔ Creado: src/app/dashboard/dashboard.component.ts
  ✔ KPIs: facturas del día, pendientes DIAN, ingresos del mes

◇  [3/7] Clientes — CRUD completo...
  ✔ 5 archivos: listado, detalle, formulario, service, tipos

◇  [4/7] Facturación — Con PDF...
  ✔ 6 archivos + generación de PDF con jsPDF
  ✔ Cálculo de IVA migrado (con fix de punto flotante usando centavos)

◇  [5/7] Reportes...
  ✔ 3 archivos con gráficas de ventas mensuales

◇  [6/7] Consulta DIAN — Estado de facturas...
  ✔ Creado: src/app/dian/consulta-dian/consulta-dian.component.ts
  ✔ Integración con endpoint GET /api/dian/estado/:facturaId

◇  [7/7] Estilos corporativos — Migrando variables...
  ✔ Variables CSS convertidas a variables Sass (_variables.scss)
  ✔ Colores corporativos aplicados a todos los componentes
  ✔ Tipografía Segoe UI mantenida

◇  npm run build...
    ├── prebuild: grimox-daemon kill-dev && grimox-daemon spawn-detached
    ├── ng build --configuration production → ✓
    └── postbuild: grimox-qa --dynamic --auto-server
        ├── Production server temporal en :3100
        ├── Reusando browser del daemon (ventana única visible)
        └── 14 flows visuales de .grimox/qa-plan.yml
  ✓ QA pasó — 14/14 flows
◇  Verificando integración con backend... ✓ 18/18 endpoints responden

  (Todas las verificaciones visuales corrieron dentro del único browser
   del daemon con overlays Grimox Studio — no se abrieron ventanas
   adicionales durante el build ni el QA.)

  ✓ /login         → Formulario con colores corporativos (#1a3c5e) renderiza correctamente
  ✓ /dashboard     → KPIs del día visibles, tipografía Segoe UI aplicada
  ✓ /clientes      → Tabla CRUD con estilos Sass corporativos + delete verificado
  ✓ /facturacion   → Formulario con cálculo de IVA visible, flujo factura E2E
  ✓ /reportes      → Gráficas de ventas mensuales renderizan sin errores

  ╭───────────────────────────────────────────────────────────╮
  │  ✔ Frontend Angular completado                            │
  │                                                           │
  │  📁 28 archivos creados                                   │
  │  🔐 Auth + Guards + JWT interceptor                       │
  │  📦 7 módulos implementados                               │
  │  🎨 Estilos corporativos migrados a Sass                  │
  │  ✓ Build exitoso + integración verificada                 │
  │  ✓ QA pasó — 14/14 flows en un solo browser visible       │
  ╰───────────────────────────────────────────────────────────╯
```

En 20 minutos, Claude Code construyó todo el frontend Angular con los estilos corporativos de ContaFlex y lo verificó visualmente. Los colores, tipografías y componentes son idénticos al sistema viejo — los usuarios no notarán el cambio. Pero por debajo, todo es Angular 19 con TypeScript, componentes standalone, y una arquitectura mantenible.

---

### Paso 9: Generar documentación con `/grimox-docs`

ContaFlex tiene 5 desarrolladores y ninguno entiende todo el sistema. Camila usa la última skill:

```
> /grimox-docs
```

```
◇  Analizando código fuente, schemas, API endpoints, módulos NestJS...

📄 PROJECT_DOCS.md generado (1,240 líneas)

Contenido:
  1. Descripción General — Sistema de facturación electrónica DIAN para empresas colombianas
  2. Arquitectura — Angular 19 (frontend) + NestJS (backend) + MongoDB

     ┌─────────────┐     REST API     ┌──────────────┐     ┌─────────┐
     │  Angular 19  │ ◄──────────────► │   NestJS     │ ◄──►│ MongoDB │
     │  (Sass/SCSS) │                  │  (TypeScript) │     └─────────┘
     └─────────────┘                  │              │     ┌─────────┐
                                       │  DianService │ ◄──►│ DIAN API│
                                       └──────────────┘     └─────────┘

  3. Stack Tecnológico — Angular 19, NestJS, Mongoose 8, TypeScript
  4. Estructura de Archivos — tree completo frontend/ + backend/
  5. API Reference — 18 endpoints con auth, params, responses, errors
  6. Componentes Angular — 23 componentes (migrados de Handlebars) con inputs/outputs
  7. Módulos NestJS — 6 módulos con sus services, controllers, guards
  8. Base de Datos — 6 colecciones MongoDB con schemas Mongoose y índices
  9. Integración DIAN — Flujo completo de facturación electrónica (diagrama)
  10. Variables de Entorno — 14 variables con descripción y valores de ejemplo
  11. Cómo Correr — dev (frontend + backend), Docker, tests
  12. Deploy — Docker Compose + GitHub Actions pipeline
```

Por primera vez en 8 años, ContaFlex tiene documentación técnica completa. Los 5 desarrolladores pueden entender cualquier módulo sin preguntarle a Camila.

---

### Lo que Camila logró

| Antes | Después |
|---|---|
| jQuery 2.x + Bootstrap 3 | Angular 19 + Sass/SCSS corporativo |
| Express 4.14 (CommonJS) | NestJS (TypeScript, modular) |
| Mongoose 4.x | Mongoose 8 |
| Passport.js sessions | JWT + Guards NestJS |
| Sin tests | Tests base generados |
| Deploy manual por FTP | GitHub Actions CI/CD |
| Sin Docker | Docker + docker-compose |
| Credenciales hardcodeadas | .env validation + seguridad |
| 4,200 líneas jQuery | 23 componentes Angular tipados |

**Tiempo total de migración:** 6 semanas (en vez de los 6 meses que estimaba el CTO).

**Lo que quedó funcionando:** El sistema de facturación electrónica migrado a un stack moderno, con la integración de la DIAN intacta, los 200 clientes sin enterarse del cambio, y la actualización de la API de la DIAN completada **1 mes antes del deadline**.

---

La noche que desplegaron a producción, Camila estaba en la sala de servidores con Julián. Silencio. Los primeros pings de los clientes llegando al nuevo sistema. Ningún error. Julián revisó los logs. Todo verde.

*"¿Sabes qué me sorprende más?"*, dijo Julián. *"Grupo Empresarial Torres no notó nada. 40 sedes facturando sin un solo ticket de soporte."*

Camila pensó en el mensaje de Slack de las 11:47 p.m. de ese martes. En las 380 líneas del conector de la DIAN que nadie quería tocar. En el bug silencioso de 6 años que una IA encontró en 40 minutos.

Dos semanas después, la DIAN anunció otra actualización de API para el siguiente año. El CTO reenvió el comunicado al equipo con un solo comentario: *"Este ya no es nuestro problema."*

Tenía razón. Por primera vez en 8 años, el sistema de ContaFlex podía adaptarse.

Todo empezó con:

```bash
grimox migrate
```

---

---

## Resumen

| | Alex (Creación) | Camila (Migración) |
|---|---|---|
| **Problema** | Configurar proyecto desde cero toma días | Sistema legacy a punto de colapsar |
| **Comando** | `grimox create` | `grimox migrate` |
| **Tiempo ahorrado** | 3.5 horas de config → 12 seg + 15 min de dev autónomo | 6 meses estimados → 6 semanas |
| **Stack** | Next.js 15 + Supabase + Tailwind | Angular 19 + NestJS + Sass |
| **Skills usadas** | `/grimox-dev` (app completa: 34 archivos, 8 módulos en 15 min), `/grimox-docs` (onboarding de Daniela) | `/grimox-migrate` (conector DIAN), `/grimox-dev` (frontend Angular completo: 28 archivos en 20 min), `/grimox-docs` (primera doc en 8 años) |
| **Resultado** | SaaS veterinario con 14 clientes en 3 meses | 200 empresas migradas sin downtime |

---

## Las 3 Skills de Grimox en acción

| Skill | Cuándo usarla | Qué hace | Alex la usó para... | Camila la usó para... |
|---|---|---|---|---|
| `/grimox-dev` | Después de `grimox create` o cuando necesitas implementar funcionalidad completa. Es la skill **más importante** — convierte un scaffold vacío en una app funcional | Lee GRIMOX.md + .ai/rules.md + stack → implementa la app completa de forma autónoma: DB, auth, CRUD, UI, APIs. Cada `npm run build` dispara determinísticamente `grimox-qa --dynamic --auto-server` que corre flows visuales desde `.grimox/qa-plan.yml` dentro del browser persistente del daemon (una sola ventana Chromium visible con overlays Grimox Studio). Si algún flow falla, el build falla (exit ≠ 0) y el LLM se ve forzado a corregir antes de reportar "listo" | Desarrollar TODA la app PetVida de cero: 34 archivos, 8 módulos (mascotas, citas, vacunas, facturación, dashboard) en 15 minutos sin escribir una línea | Construir todo el frontend Angular (28 archivos, 7 módulos) con los estilos corporativos de ContaFlex migrados a Sass |
| `/grimox-migrate` | Para migrar proyectos existentes archivo por archivo con guía de IA | Analiza código real, genera MIGRATION_PLAN.md con pasos específicos, snippets before/after, y puede aplicar transformaciones | — | Migrar el conector de la DIAN (380 líneas de lógica crítica con firma XML y certificados) de Express a NestJS sin romper nada |
| `/grimox-docs` | Para documentar el proyecto o incorporar nuevos developers al equipo | Genera PROJECT_DOCS.md completo: arquitectura, API reference, componentes, schemas, variables de entorno, cómo correr y deployar | Incorporar a Daniela (junior) al proyecto — empezó a contribuir al día siguiente sin llamada de onboarding | Dar a 5 desarrolladores documentación técnica por primera vez en 8 años de ContaFlex |

Las 3 skills viven en **`.ai/skills/`** — accesibles desde cualquier LLM o IDE. Claude Code y Open Code las activan automáticamente como slash commands desde `.claude/commands/` (adaptador generado en silencio). Cursor, Trae, Windsurf y Antigravity usan `.cursorrules` y `.ai/rules.md`. Copilot usa `.github/copilot-instructions.md`. Con GPT, Gemini, Grok, GLM u Ollama: abre el `.md` de la skill en `.ai/skills/` y úsalo como prompt.

---

## Comandos diarios en cualquier proyecto web scaffoldeado

Cuando generas un stack web (Next.js, Nuxt, SvelteKit, SPAs Vite, Astro, etc.) Grimox inyecta estos scripts npm. Cuándo usar cada uno en la práctica:

| Comando | Úsalo cuando |
|---|---|
| `npm run dev` | **Desarrollo diario.** `predev` spawnea el daemon si no está vivo. La ventana Chromium única aparece con el splash Grimox Studio y navega a tu app cuando el dev server responde |
| `npm run build` | **Antes de commit / push.** `prebuild` libera el puerto dev (fix del `EPERM` en `.next/trace` de Windows), `next build` compila, y `postbuild` corre `grimox-qa --dynamic --auto-server` contra un production server temporal en puerto 3100. El LLM no puede reportar "listo" sin que esto pase |
| `npm run qa` | **Rerun de QA ad-hoc** contra el dev/production server actualmente vivo, reusando el browser del daemon |
| `npm run dev:fresh` | **Al volver al proyecto tras varios días.** Corre `grimox-daemon purge-all` (mata todos los daemons de Grimox, chromiums huérfanos de Playwright, zombies de `next start/dev`) antes de `npm run dev`. Garantía de estado limpio |
| `npm run build:fresh` | **Antes de una demo o una run crítica tipo CI local.** La misma garantía de purga, seguida de `npm run build` |
| `npm run daemon:purge` | **Solo la limpieza**, sin arrancar nada más. Útil si notas ventanas pegadas o múltiples daemons |
| `npm run daemon:status` | **Debugging.** Muestra JSON con `alive`, `baseUrl`, `cdp.endpoint`, `takenOver` — te dice exactamente en qué estado está el daemon |
| `npm run daemon:stop` | **Parada graceful.** Cierra también el browser visible |
| `npm run daemon:demo` | **Verificación rápida de que el mecanismo daemon/browser funciona** en tu máquina (mata daemon previo, lanza uno en standby) |

Día típico de Alex: `npm run dev` por la mañana, edita código, ocasional `npm run build` para verificar antes de commitear. Primera corrida de Camila tras instalar: `npm run dev:fresh` para garantizar estado limpio antes de demo al equipo.

---

**Grimox no solo crea tu proyecto y lo configura — lo desarrolla, lo migra, y lo documenta. Todo asistido por IA, todo desde la terminal.**
