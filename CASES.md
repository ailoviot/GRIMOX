# Grimox CLI — Real-World Use Cases

> 🇪🇸 [Leer en Español](CASES.es.md)

---

## CASE 1: Creating a project from scratch

### "Alex wants to launch his own veterinary management SaaS"

Alex is a 36-year-old full-stack developer living in Neiva, Colombia. He's been working as an employee at a software company for 10 years, but something has always nagged at him: his mom owns a veterinary clinic called **"PetVida"** in the Jardin neighborhood, and she manages everything in a notebook — appointments, animal medical records, pending vaccinations, payments. Every December information gets lost, vaccine reminders are forgotten, and clients call asking about things nobody remembers.

One night, after watching his mom search through papers for the medical history of a golden retriever named **Thor**, Alex decides: *"I'm going to build a system for this. And not just for mom — for every veterinary clinic dealing with the same thing."*

Alex knows what he needs:
- A panel to manage patients (pets), owners, appointments, and vaccinations
- Clinical history PDF generation
- Automatic vaccine reminders via WhatsApp
- A basic billing module
- Works on both desktop and mobile
- Secure (pet medical data is sensitive to owners)
- Can be sold as a SaaS to other veterinary clinics

Alex knows how to code React and Node, but every time he starts a project from scratch he loses 2-3 days configuring: Tailwind, Docker, CI/CD, environment variables, folder structure... and that kills his motivation. One day, in a Telegram group for Colombian developers, someone mentions **Grimox CLI**:

> *"Try Grimox, it creates your project with everything configured: Docker, CI/CD, security, even the rules for Cursor and Claude Code."*

Alex looks it up and decides to try it.

---

### Step 1: Download and install Grimox

Alex opens his terminal and clones the project:

```bash
git clone https://github.com/ailoviot/GRIMOX.git
cd GRIMOX
npm install
npm link
```

He verifies it works:

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

Alex smiles. *"Good, now let's see what stacks it has."*

---

### Step 2: Explore the available stacks

```bash
grimox list
```

```
  Grimox CLI — Available Stacks

  Integrated Web Fullstack
  ├── Next.js 15            TypeScript    React + SSR + App Router + Server Actions
  ├── Nuxt 4                TypeScript    Vue + SSR + Nitro server
  └── SvelteKit             TypeScript    Svelte + SSR + Server Endpoints

  Decoupled Web Fullstack
  (Combine any SPA frontend + separate backend)

  Web Frontend (SPA only)
  ├── React + Vite          JS / TS       SPA with React 19
  ├── Vue.js + Vite         JS / TS       SPA with Vue 3
  ├── Angular               TypeScript    SPA with Angular 19
  └── Svelte + Vite         JS / TS       SPA with Svelte 5

  API / Backend (API only)
  ├── FastAPI               Python        Async API with Pydantic + Uvicorn
  ├── NestJS                TypeScript    Enterprise API framework
  ├── Hono                  TypeScript    Ultra-fast, multi-runtime
  ├── Fastify               JS / TS       High performance Node.js
  └── Spring Boot           Java/Kotlin   Enterprise Java/Kotlin API

  ...and more (Mobile, Desktop, IoT, Data/AI, Docs, CLI)

  Databases: Supabase | PostgreSQL | Firebase | MongoDB
             Oracle SQL | Turso | Redis | Insforge (insforge.dev)
```

Alex thinks: *"For a SaaS I need SSR for SEO, an integrated API for the endpoints, and a database with authentication. Next.js 15 + Supabase sounds perfect."*

---

### Step 3: Create the project

```bash
grimox create
```

The CLI comes to life with an interactive interface:

```
  ╭─────────────────────────────────╮
  │  🔮 Grimox CLI v0.1.0          │
  │  Intelligent Project Generator  │
  ╰─────────────────────────────────╯

◆  What is the name of your project?
│  petvida-saas

◆  What type of application do you need?
│  ● Integrated Web Fullstack       → A single framework (Next.js, Nuxt, SvelteKit)
│  ○ Decoupled Web Fullstack        → Frontend + Backend as separate services
│  ○ Web Frontend (SPA only)        → Frontend only without its own backend
│  ○ API / Backend (API only)       → Backend only without frontend
│  ○ Mobile App                     → React Native (Expo), Flutter, Flet
│  ○ Desktop App                    → Tauri, Electron, Flet
│  ○ IoT / Embedded                 → Arduino, PlatformIO, ESP-IDF, MicroPython
│  ○ Data Analytics / AI            → FastAPI + Python ML stack
│  ○ Documentation                  → Astro, Docusaurus, VitePress
│  ○ CLI Tool                       → Node.js + Commander
```

Alex chooses **Integrated Web Fullstack**.

```
◆  Choose the framework:
│  ● Next.js 15
│  ○ Nuxt 4
│  ○ SvelteKit

◇  Auto: TypeScript (standard for Next.js 15)
```

It didn't ask about the language — Grimox knows that Next.js 15 goes with TypeScript. Alex didn't have to make any unnecessary decisions.

```
◆  What CSS styling framework do you want to use?
│  ● Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ○ Pure Sass / SCSS
│  ○ Pure CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)
```

Alex chooses **Tailwind CSS v4**. He likes the development speed with utility classes.

```
◆  Database:
│  ● Supabase
│  ○ PostgreSQL
│  ○ Firebase
│  ○ MongoDB
│  ○ Oracle SQL
│  ○ Turso
│  ○ Insforge (insforge.dev)
│  ○ Redis
```

He chooses **Supabase** — it gives him PostgreSQL, authentication, storage for pet photos, and realtime for notifications. All in one.

```
◇  Full stack configured:

  │  📦 petvida-saas/
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
```

Alex reviews the summary. Everything he needs is there. He presses Enter.

```
◇  Copying local Next.js 15 template...             ████████████ 100%
◇  Applying features and IDE integrations...         ████████████ 100%
◇  Git repository initialized

  ╭───────────────────────────────────────────────╮
  │  ✔ Project ready for development                │
  │                                                 │
  │  cd petvida-saas                                │
  │  npm install                                    │
  │  npm run dev                                    │
  │                                                 │
  │  IDE integrations generated:                    │
  │  📄 GRIMOX.md  (universal context)              │
  │  📁 .ai/skills/ (skills: any LLM)              │
  │  📄 .ai/rules.md (rules: any LLM)              │
  ╰───────────────────────────────────────────────╯
```

**12 seconds.** Alex has a ready-to-go project.

---

### Step 4: See what Grimox generated

Alex enters the folder and explores:

```bash
cd petvida-saas
ls -la
```

```
petvida-saas/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Main layout with metadata
│   │   ├── page.tsx            ← Home page
│   │   └── globals.css         ← Tailwind configured
│   ├── lib/
│   │   └── supabase.ts        ← Supabase connection ready
│   └── styles/
│       └── globals.css         ← Base design system (colors, typography)
├── .cursorrules                ← Rules for Cursor, Trae, Windsurf, Antigravity
├── GRIMOX.md                   ← Universal context (Claude, GPT, Gemini, Grok, GLM...)
├── .ai/
│   ├── skills/                 ← Skills: accessible from any LLM or IDE
│   │   ├── grimox-dev.md       ← Autonomous development skill
│   │   ├── grimox-migrate.md   ← Deep migration skill
│   │   └── grimox-docs.md      ← Documentation skill
│   └── rules.md                ← Stack rules for any LLM or IDE
├── .claude/
│   └── commands/               ← Claude Code / Open Code adapter (slash commands)
│       ├── grimox-dev.md       ← enables /grimox-dev
│       ├── grimox-migrate.md   ← enables /grimox-migrate
│       └── grimox-docs.md      ← enables /grimox-docs
├── .github/
│   └── copilot-instructions.md ← GitHub Copilot adapter (stack rules)
├── .mcp/
│   └── config.json             ← MCP servers configured for Supabase
├── .github/
│   └── workflows/
│       └── ci.yml              ← CI/CD pipeline ready
├── .env.example                ← Documented environment variables
├── .env                        ← Development variables
├── Dockerfile                  ← Multi-stage build (Node → nginx)
├── docker-compose.yml          ← App + everything needed
├── package.json                ← Dependencies + scripts
├── tailwind.config.ts          ← Tailwind configured
├── tsconfig.json               ← Strict TypeScript
└── next.config.ts              ← Next.js configured
```

Alex opens `.env.example` and sees:

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

Every variable documented. No guessing what's needed.

---

### Step 5: Start developing

Alex configures his Supabase credentials in `.env`, installs dependencies, and starts:

```bash
npm install
npm run dev
```

The project runs at `http://localhost:3000`. He sees the Next.js welcome page with Tailwind configured. He opens **Cursor** and notices that `.cursorrules` already has the Next.js 15 rules:

```
## Next.js 15
- Use App Router (not Pages Router)
- Prefer Server Components by default, use 'use client' only when necessary
- Use Server Actions for data mutations
- Implement loading.tsx and error.tsx in every route
...
```

Cursor already knows how to help him with Next.js 15 because Grimox taught it.

Alex looks at the project structure. Everything is ready: Supabase connected, Tailwind configured, Docker prepared. But... the pages are empty. He only has the welcome template. He needs the complete app: pet pages, appointments, vaccinations, owners, billing.

He could code it manually — but he remembers that Grimox generated a skill called `/grimox-dev`. He opens **Claude Code**:

```bash
claude
```

---

### Step 6: Develop the complete app with `/grimox-dev`

Alex tells Claude Code what he needs:

> *"I need a veterinary SaaS with: pet registration (name, species, breed, age, owner, photo), appointment management (calendar, statuses: pending/attended/cancelled), vaccination tracking (with automatic reminders), and basic billing. Use Supabase for everything."*

```
> /grimox-dev
```

The skill activates. Claude Code doesn't ask any more questions — it already has all the information it needs:

```
◇  Grimox Dev Architect activated

────────────────────────────────────────────
 PHASE 1: Project Reconnaissance
────────────────────────────────────────────

◇  Reading GRIMOX.md...       ✓ Stack: Next.js 15 + Supabase + Tailwind
◇  Reading .ai/rules.md...    ✓ Rules: App Router, Server Components, strict TypeScript
◇  Reading package.json...    ✓ Dependencies: next@15, react@19, @supabase/supabase-js
◇  Reading .env.example...    ✓ Variables: SUPABASE_URL, SUPABASE_ANON_KEY
◇  Reading supabase.ts...     ✓ Connection configured

  Detected stack: Next.js 15 (TypeScript) + Supabase + Tailwind CSS v4

────────────────────────────────────────────
 PHASE 2: Implementation Plan
────────────────────────────────────────────

  📋 Modules to implement:

  1. 🗃️ Database — Supabase tables (pets, owners, appointments, vaccinations, invoices)
  2. 🔐 Auth — Registration/login with Supabase Auth
  3. 🐾 Pets — Full CRUD + photo upload to Supabase Storage
  4. 👤 Owners — CRUD + search + relationship with pets
  5. 📅 Appointments — Calendar, statuses, date filters
  6. 💉 Vaccinations — Tracking + next dose calculation + reminders
  7. 💰 Billing — Create invoice, items, totals, PDF
  8. 📊 Dashboard — KPIs (today's appointments, pending vaccinations, monthly revenue)

  Proceed with full implementation?
```

Alex confirms. Claude Code starts working autonomously:

```
────────────────────────────────────────────
 PHASE 3: Implementation
────────────────────────────────────────────

◇  [1/8] Database — Creating Supabase tables...
  ✔ Created: supabase/migrations/001_create_tables.sql
  ✔ 5 tables: mascotas, duenos, citas, vacunas, facturas
  ✔ RLS policies configured
  ✔ Storage bucket "fotos-mascotas" created

◇  [2/8] Auth — Implementing authentication...
  ✔ Created: src/app/(auth)/login/page.tsx
  ✔ Created: src/app/(auth)/register/page.tsx
  ✔ Created: src/lib/auth.ts (Supabase Auth helpers)
  ✔ Created: src/middleware.ts (route protection)

◇  [3/8] Pets — Full CRUD...
  ✔ Created: src/app/(dashboard)/mascotas/page.tsx (listing with search)
  ✔ Created: src/app/(dashboard)/mascotas/[id]/page.tsx (detail)
  ✔ Created: src/app/(dashboard)/mascotas/nueva/page.tsx (form)
  ✔ Created: src/components/mascotas/MascotaCard.tsx
  ✔ Created: src/components/mascotas/MascotaForm.tsx
  ✔ Created: src/app/api/mascotas/route.ts (Server Actions)
  ✔ Photo upload to Supabase Storage integrated

◇  [4/8] Owners...
  ✔ 4 files created

◇  [5/8] Appointments — Calendar + statuses...
  ✔ Created: src/app/(dashboard)/citas/page.tsx (calendar view)
  ✔ Created: src/components/citas/CalendarioCitas.tsx
  ✔ Created: src/components/citas/NuevaCitaModal.tsx
  ✔ Statuses: pending → attended / cancelled

◇  [6/8] Vaccinations — Tracking + reminders...
  ✔ Created: src/app/(dashboard)/vacunas/page.tsx
  ✔ Created: src/lib/vacunas/calcularProximaDosis.ts
  ✔ Created: src/app/api/vacunas/recordatorios/route.ts (cron job)
  ✔ Logic: calculates next dose based on species + vaccine type

◇  [7/8] Billing...
  ✔ 5 files created + PDF generation with @react-pdf/renderer

◇  [8/8] Dashboard — KPIs...
  ✔ Created: src/app/(dashboard)/page.tsx
  ✔ KPIs: today's appointments, pending vaccinations this week, monthly revenue
  ✔ Charts with real Supabase data

────────────────────────────────────────────
 PHASE 4: Build → Test → Fix (loop)
────────────────────────────────────────────

◇  npm run build...
  ⚠ Error: 'MascotaCard' cannot be used as a Server Component (uses useState)
  → Fix: Adding 'use client' to MascotaCard.tsx
  ◇  npm run build... ✓ Build successful

◇  Verifying endpoints...
  ✓ GET /api/mascotas → 200
  ✓ POST /api/mascotas → 201
  ✓ GET /api/citas → 200
  ✓ GET /api/vacunas/recordatorios → 200

────────────────────────────────────────────
 PHASE 4.5: Visual Testing with Browser
────────────────────────────────────────────

◇  Checking agent-browser... ✓ available

◇  agent-browser open http://localhost:3000
◇  agent-browser snapshot -i --json

  ✓ /              → Dashboard loads — real Supabase KPIs visible
  ✓ /mascotas      → Table shows 3 seed records, "New pet" button present
  ✓ /citas         → Calendar renders correctly, no hydration errors
  ✓ /vacunas       → Table with upcoming dates and status by species
  ✓ /facturacion   → New invoice form without visual errors

◇  Testing pet registration flow...
  → agent-browser click @e_nueva_mascota
  → agent-browser fill @e_nombre "Thor"
  → agent-browser fill @e_especie "Perro"
  → agent-browser click @e_guardar
  ✓ Confirmation toast visible — pet created successfully

────────────────────────────────────────────
 PHASE 5: Final Verification
────────────────────────────────────────────

  ╭───────────────────────────────────────────────────────────╮
  │  ✔ Development completed                                  │
  │                                                           │
  │  📁 34 files created                                      │
  │  🗃️ 5 tables + RLS + Storage configured                   │
  │  🔐 Auth: login + register + middleware                   │
  │  📦 8 modules implemented                                 │
  │  ✓ Build successful                                       │
  │  ✓ Endpoints verified                                     │
  │  ✓ UI verified in browser (5 routes + registration flow)  │
  │                                                           │
  │  npm run dev → http://localhost:3000                      │
  ╰───────────────────────────────────────────────────────────╯
```

**In 15 minutes**, Claude Code implemented the entire application and verified it visually — including the pet registration flow from the browser. Alex opens `http://localhost:3000`, registers Thor as the first patient, schedules an appointment for Thursday, and books his rabies vaccine. Everything had already been verified.

He didn't write a single line of code. The `/grimox-dev` skill read the project conventions (GRIMOX.md, .ai/rules.md), understood the stack (Next.js 15 + Supabase), and developed everything following the best practices that Grimox configured when creating the project.

---

### Step 7: Generate documentation with `/grimox-docs`

A month later, Alex wants to bring **Daniela**, a junior developer, onto the project. But he has no documentation — everything is in his head. Instead of writing docs manually, he uses another skill:

```
> /grimox-docs
```

Claude Code reads all the source code, the Supabase database structure, the API routes, the components, and generates:

```
◇  Analyzing source code, API routes, components, schemas...

📄 PROJECT_DOCS.md generated (847 lines)

Contents:
  1. General Description — Veterinary SaaS for patient, appointment, and vaccination management
  2. Architecture — Next.js 15 App Router + Supabase (ASCII diagram included)
  3. Tech Stack — Next.js 15, React 19, TypeScript, Tailwind, Supabase
  4. File Structure — tree with description of each folder
  5. API Reference — 12 endpoints documented with parameters and responses
  6. UI Components — 18 components with their typed props
  7. Database — 5 tables with schema, relationships, and RLS policies
  8. Environment Variables — 6 variables with descriptions
  9. How to Run — dev, test, build, Docker
  10. Deploy — Vercel + Supabase (step by step)
```

Alex sends the repo to Daniela with the documentation included. She starts contributing the next day without needing a single "onboarding" call.

---

### What Alex got without writing a single line of configuration

| Component | Before (manual) | With Grimox |
|---|---|---|
| Project structure | 30 min | 0 min |
| Configure TypeScript | 15 min | 0 min |
| Configure Tailwind CSS | 20 min | 0 min |
| Connect Supabase | 25 min | 0 min |
| Dockerfile + docker-compose | 45 min | 0 min |
| GitHub Actions CI/CD | 30 min | 0 min |
| .env.example + validation | 15 min | 0 min |
| .cursorrules for the IDE | 20 min | 0 min |
| GRIMOX.md + skills | ∞ (didn't know it existed) | 0 min |
| **Total** | **~3.5 hours** | **12 seconds** |

---

Three months later, **PetVida** is a platform used by 14 veterinary clinics across Colombia. Alex quit his job. His mom no longer loses medical records. And Thor, the golden retriever, got his vaccine on time because the system sent an automatic reminder via WhatsApp.

It all started with a single command:

```bash
grimox create
```

---

---

## CASE 2: Migrating an existing project

### "Camila needs to rescue her company's accounting system before it collapses"

It's 11:47 p.m. on a Tuesday. Camila is alone in the office, staring at a Slack message that just came in from the manager of **Grupo Empresarial Torres** — her biggest client, 40 locations, 3 years with them:

> *"Camila, it's been 3 days with errors when issuing invoices. My accountants can't work. If the system isn't stable this week, we're going to look for another solution."*

Camila closes her laptop. She knows exactly what the problem is — she's known for two years. It's not a specific bug. It's the entire system.

---

Camila is 32 years old and is the tech lead at **"ContaFlex"**, an accounting software company in Bogota that has been in business for 8 years. ContaFlex's flagship product is an electronic invoicing system used by 200+ Colombian companies to generate invoices compatible with DIAN (Colombia's tax authority).

The problem: the system was built in **2016** with the technologies of that era:

```
contaflex-legacy/
├── client/                    ← jQuery 2.x + Bootstrap 3 + Handlebars
│   ├── js/
│   │   ├── app.js             ← 4,200 lines of jQuery
│   │   ├── factura.js         ← billing logic
│   │   └── reportes.js        ← report generation
│   ├── css/
│   │   └── styles.css         ← 2,800 lines of vanilla CSS
│   └── templates/
│       └── *.hbs              ← 23 Handlebars templates
├── server/
│   ├── app.js                 ← Express 4.14 (CommonJS)
│   ├── routes/                ← 18 route files
│   ├── models/                ← Mongoose 4.x (6 models)
│   └── middleware/
│       ├── auth.js            ← Passport.js + sessions
│       └── dian-connector.js  ← Integration with DIAN API
├── package.json
└── .env                       ← hardcoded credentials (yes, in production)
```

The system's symptoms:
- **Slow**: every page takes 4-6 seconds to load (unoptimized jQuery + Bootstrap)
- **Insecure**: DIAN credentials hardcoded in `.env` which is in the repository
- **Fragile**: no tests. Every time they touch something, something else breaks
- **Impossible to maintain**: 4,200 lines of jQuery in a single file
- **No CI/CD**: manual deploys via FTP to a GoDaddy server
- **No Docker**: works "on my machine" but deploying is a nightmare

The CTO tells Camila: *"We have 3 months before DIAN updates its electronic invoicing API. If we don't migrate, we stop working and lose 200 clients."*

**200 clients. 8 years of business. 3 months.**

Camila knows that rewriting from scratch isn't an option — 3 months isn't enough to rewrite 8 years of complex business logic: the DIAN connector, the VAT calculation engine with 12 special cases, the tax withholding logic, the electronic invoice XML generation with digital signatures. That can't be rewritten. It needs to be **migrated**.

The question is how to do it without breaking anything while 200 companies continue invoicing in production.

A colleague from another team, in a casual meeting, mentions Grimox. *"There's a CLI that uses AI to analyze your actual code and generate a migration plan file by file."* Camila looks it up that night.

---

### Step 1: Install Grimox and configure the LLM

Camila already has Claude Code installed with her `ANTHROPIC_API_KEY` configured on her system. She installs Grimox:

```bash
git clone https://github.com/ailoviot/GRIMOX.git
cd GRIMOX
npm install
npm link
```

She verifies that Grimox detects her LLM:

```bash
cd /proyectos/contaflex-legacy
grimox migrate --plan
```

```
  ╭─────────────────────────────────╮
  │  🔮 Grimox CLI v0.1.0          │
  │  Intelligent Project Generator  │
  ╰─────────────────────────────────╯

◇  Checking available AI models...
◇  1 AI model(s) found
  ✓ AI Model: Claude (Anthropic) ☁️  (Environment variable: ANTHROPIC_API_KEY)
```

Perfect. Grimox found Claude automatically.

---

### Step 2: Grimox analyzes the project

The CLI scans the project automatically:

```
◇  Scanning project structure...

◆  Detected structure: Decoupled project

  🖥️  client/   →  JavaScript (jQuery + Handlebars)
  ⚙️  server/   →  Express ^4.14.0

  ├── Docker:  ✗ Not detected
  └── CI/CD:   ✗ Not detected

◆  What do you want to migrate?
│  ● Everything (frontend + backend)
│  ○ Frontend only (client/)
│  ○ Backend only (server/)
```

Camila chooses **Everything**. Grimox shows her the details of each part:

```
◆  Stack — frontend (client/):
│  ├── Language     JavaScript (ES5)
│  ├── Framework    jQuery 2.x (no modern framework)
│  ├── Build        Not detected (static files)
│  ├── Database     Not detected (consumes backend API)
│  ├── Styles       Bootstrap 3 + vanilla CSS
│  └── Tests        ✗ Not detected
│
│  ⚠ jQuery 2.x detected → consider migration to modern framework
│  ⚠ Bootstrap 3 → discontinued

◆  Stack — backend (server/):
│  ├── Language     JavaScript (CommonJS)
│  ├── Framework    Express ^4.14.0
│  ├── Build        Not detected
│  ├── Database     MongoDB (Mongoose 4.x)
│  ├── Styles       Not detected
│  └── Tests        ✗ Not detected
│
│  ⚠ Express ^4.14.0 → very outdated version
│  ⚠ Mongoose 4.x → Mongoose 8 available
```

Camila sees the list of problems. No surprise — she knows them all. But now she has to decide where to migrate to.

---

### Step 3: Choose the target stack

Grimox asks her about the **frontend** first:

```
◆  What type of application to migrate frontend (client/) to?
│  ○ Integrated Web Fullstack       → Next.js, Nuxt, SvelteKit
│  ● Web Frontend (SPA only)        → React+Vite, Vue+Vite, Angular, Svelte
│  ○ Decoupled Web Fullstack        → Frontend + Backend separate
│  ○ Desktop App                    → Tauri, Electron
```

Camila chooses **Web Frontend (SPA only)** — she wants to keep the frontend and backend separate because the backend team is different from the frontend team.

```
◆  Choose the framework for frontend (client/):
│  ● React + Vite (Recommended)
│  ○ Vue.js + Vite
│  ○ Angular
│  ○ Svelte + Vite
```

Grimox recommends React + Vite, but Camila has 3 Angular developers on her team. She chooses **Angular**:

```
◇  Auto: TypeScript (mandatory in Angular)
```

Now the styles:

```
◆  What CSS styling framework do you want to use?
│  ○ Tailwind CSS v4 (Recommended)
│  ○ Bootstrap 5
│  ○ Material UI / Material Design
│  ○ Bulma
│  ● Sass / SCSS pure
│  ○ Pure CSS (custom / corporate)
│  ○ Styled Components (CSS-in-JS)
```

Camila chooses **Sass / SCSS pure**. ContaFlex has a corporate design system with its own colors, typography, and components that she doesn't want to lose. Sass lets her keep her existing variables and mixins while modernizing the structure.

Now the **backend**:

```
◆  What type of application to migrate backend (server/) to?
│  ● API / Backend (API only)       → FastAPI, Hono, NestJS, Fastify, Spring Boot
│  ○ Integrated Web Fullstack       → Next.js, Nuxt, SvelteKit

◆  Choose the framework for backend (server/):
│  ○ FastAPI
│  ● NestJS (Recommended)
│  ○ Hono
│  ○ Fastify
│  ○ Spring Boot
```

Camila chooses **NestJS** — the team is TypeScript and NestJS has a modular structure similar to what they already have with Express, which makes the migration easier.

The database:

```
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
```

Camila chooses **keep MongoDB** — they have 200 companies with data in production. Changing the database is too much risk in 3 months.

---

### Step 4: Grimox analyzes the code with AI

```
◆  Migration mode?
│  ● Generate plan (review before applying)
│  ○ Apply automatically (with backup)
```

Camila chooses **Generate plan** — she wants to review before the AI touches anything.

```
◇  Analyzing source code with AI...                 ████████████ 100%
◇  Analysis completed

◇  Generating intelligent migration plan...          ████████████ 100%
◇  Plan generated

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Migration plan generated with AI                  │
  │                                                     │
  │  📄 MIGRATION_PLAN.md                               │
  │  🤖 Model: Claude (Anthropic)                       │
  │                                                     │
  │  frontend (client/) → Angular 19                    │
  │  backend (server/) → NestJS                         │
  │                                                     │
  │  The plan includes:                                 │
  │  • Architecture and detected patterns analysis      │
  │  • Specific steps file by file                      │
  │  • Before/after snippets for each change            │
  │  • Express middleware → NestJS mapping              │
  │  • Mongoose 4 → 8 migration                        │
  │  • Dependencies to add/remove                      │
  │                                                     │
  │  To apply:  grimox migrate --apply                  │
  ╰─────────────────────────────────────────────────────╯
```

---

### Step 5: Review the plan

Camila opens `MIGRATION_PLAN.md` and finds a detailed document:

```markdown
# Migration Plan — Grimox CLI

**Date:** 2026-03-19
**AI Model:** Claude (Anthropic)
**Structure:** Decoupled
**Parts to migrate:** 2

## Project Analysis (generated by AI)

**Architecture:** Decoupled monolith (static client + REST API)
**Patterns:** MVC in backend, jQuery spaghetti in frontend
**State:** No state management (global variables in jQuery)
**Authentication:** Passport.js with sessions (no JWT)
**DB Access:** Mongoose direct in controllers (no repository pattern)

### Detected Problems

- ⚠ DIAN credentials hardcoded in .env (CRITICAL)
- ⚠ No input validation in 12 of 18 routes
- ⚠ SQL injection possible in invoice search (unsanitized query string)
- ⚠ 4,200 lines in a single jQuery file (unmaintainable)
- ⚠ Mongoose 4.x has known vulnerabilities
- ⚠ No tests — any change is a risk

### AI Recommendations

- 💡 Prioritize the DIAN module migration — it's the most urgent
- 💡 Migrate authentication to JWT before the rest
- 💡 Create tests for billing logic BEFORE migrating
- 💡 The 23 Handlebars templates map to 23 Angular components

---

## frontend (client/) → Angular 19

**Current stack:** jQuery 2.x + Handlebars + Bootstrap 3 (JavaScript ES5)
**Target stack:** Angular 19 (TypeScript) + Sass/SCSS

### Migration Steps (generated by AI)

#### 1. Create Angular structure

Create Angular project with modules equivalent to the current pages.

**Affected files:**
- All .hbs → Angular components
- js/app.js → app.component.ts + router
- js/factura.js → factura.module.ts
- js/reportes.js → reportes.module.ts

#### 2. Migrate Handlebars templates → Angular Components

**Before (Handlebars):**
```hbs
<div class="factura-row">
  <span>{{factura.numero}}</span>
  <span>{{factura.cliente}}</span>
  <span class="total">${{formatMoney factura.total}}</span>
</div>
```

**After (Angular):**
```html
<div class="factura-row">
  <span>{{ factura.numero }}</span>
  <span>{{ factura.cliente }}</span>
  <span class="total">{{ factura.total | currency:'COP' }}</span>
</div>
```

#### 3. Migrate jQuery DOM → Angular bindings

**Before (jQuery):**
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

**After (Angular):**
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

...and so on for every file, every pattern, every transformation.
```

Camila reads the complete plan — it has 28 detailed steps divided into 10 phases. Each step references actual files from HER project with before/after snippets. These aren't generic steps like "migrate the frontend" — they're specific instructions like *"Convert js/factura.js lines 145-230 (VAT calculation logic) into an Angular service FacturaCalculatorService"*.

She prints it out. She calls her team together the next day — two frontend developers and one backend developer. She shows them the plan. **"An AI seriously generated this?"** asks Julian, the most skeptical one on the team. *"This is specific to our code."* Camila nods. *"Exactly. Now let's divide up the steps."*

---

### Step 6: Apply the migration

After reviewing and adjusting the plan with her team, Camila decides to apply:

```bash
grimox migrate --apply
```

```
◇  Checking available AI models...
  ✓ AI Model: Claude (Anthropic) ☁️

◇  Creating backup...                               ████████████ 100%
◇  Backup created in .grimox-backup/

◇  Analyzing source code with AI...                  ████████████ 100%
◇  Analysis completed

◇  Generating migration plan...                      ████████████ 100%
◇  Plan generated

◇  Applying code transformations...                  ████████████ 100%
  Transformed: server/routes/facturas.js
  Transformed: server/routes/clientes.js
  Transformed: server/routes/auth.js
  Transformed: server/models/Factura.js
  Transformed: server/models/Cliente.js
  Transformed: server/middleware/auth.js
  Transformed: client/js/factura.js
  Transformed: client/js/reportes.js
◇  Transformations applied: 8/15 files

  ╭─────────────────────────────────────────────────────╮
  │  ✔ Migration applied with AI                         │
  │                                                     │
  │  📁 .grimox-backup/ (original files)                │
  │     ├── client/    (full copy)                      │
  │     └── server/    (full copy)                      │
  │  📄 MIGRATION_PLAN.md (detailed plan)               │
  │  🔄 Files transformed: 8/15                         │
  │                                                     │
  │  ⚠ 7 file(s) require manual review                  │
  ╰─────────────────────────────────────────────────────╯
```

8 of 15 files were automatically transformed. The remaining 7 are too complex (like the DIAN connector with very specific business logic) and need manual review by the team.

---

### Step 7: Continue the migration with `/grimox-migrate` in the IDE

For the 7 remaining files, the team gathers. Julian points out the elephant in the room: *"The DIAN connector. 380 lines. Digital certificates, XML signatures, 3 different endpoints. If this breaks, no client can invoice."*

Silence. That file nobody wants to touch. It's been in production for 4 years without anyone fully understanding how it works — it was written by a developer who's no longer at the company.

Camila opens **Claude Code** in the project and uses the skill that Grimox generated:

```bash
claude
```

```
> /grimox-migrate
```

Claude Code reads ALL the source code and guides her file by file. Camila tells it:

> *"I need to migrate the DIAN connector (server/middleware/dian-connector.js). It's the most critical file — it cannot break. There's logic that nobody on the team fully understands."*

Claude Code analyzes the 380 lines of the connector, identifies the DIAN endpoints it uses, the digital certificates, the electronic invoicing XML formats, and generates the NestJS version:

```
◇  Analyzing dian-connector.js...

  Found:
  • 3 DIAN endpoints (send invoice, check status, void)
  • Digital certificate .p12 loaded with crypto
  • XML signatures with xmldsig
  • 2 retry functions with exponential backoff

  Generating DianService for NestJS...

  ✔ Created: server/src/integrations/dian/dian.service.ts
  ✔ Created: server/src/integrations/dian/dian.module.ts
  ✔ Created: server/src/integrations/dian/dian.types.ts
  ✔ Tests: server/src/integrations/dian/dian.service.spec.ts

  The XML signing and certificate logic was kept identical.
  Only the structure changed (Express middleware → NestJS injectable service).
```

Camila reviews the generated code line by line — and sees something she didn't expect: it didn't just migrate the structure. The AI understood the purpose of each block. It found a silent bug in the retry function where the original code never performed the third attempt (incorrectly written condition), and fixed it in the NestJS version.

Julian looks over her shoulder. *"Wait... that was a real bug?"* Camila runs the tests. They all pass. *"Six years with that bug in production,"* she says quietly.

The NestJS version of the connector is ready. The most feared file in the project, migrated in 40 minutes.

---

### Step 8: Complete the frontend migration with `/grimox-dev`

The backend is already migrated to NestJS. But the frontend is still jQuery + Handlebars. Camila needs to build the entire Angular UI from scratch — all 23 components, the routes, the forms, the integration with the migrated API.

Instead of assigning this to her team (which would take weeks), she uses the autonomous development skill:

```
> /grimox-dev
```

> *"The backend is already migrated to NestJS with the same endpoints. I need the complete Angular frontend: login, dashboard with metrics, client CRUD, billing module with PDF generation, reports module, and the integration with the DIAN API to check invoice status. The styles should be Sass using the corporate variables that already exist in client/css/styles.css."*

```
◇  Grimox Dev Architect activated

────────────────────────────────────────────
 PHASE 1: Reconnaissance
────────────────────────────────────────────

◇  Reading GRIMOX.md...        ✓ Stack: Angular 19 + NestJS + MongoDB + Sass
◇  Reading .ai/rules.md...     ✓ Angular 19 + Sass + standalone components
◇  Reading backend endpoints... ✓ 18 NestJS endpoints detected
◇  Reading old styles.css...   ✓ Corporate variables extracted:
    $color-primary: #1a3c5e, $color-secondary: #2e86c1, $font-family: 'Segoe UI'

────────────────────────────────────────────
 PHASE 3: Implementation
────────────────────────────────────────────

◇  [1/7] Auth — Login + Guards...
  ✔ Created: src/app/auth/login/login.component.ts
  ✔ Created: src/app/core/guards/auth.guard.ts
  ✔ Created: src/app/core/interceptors/jwt.interceptor.ts

◇  [2/7] Dashboard — Daily metrics...
  ✔ Created: src/app/dashboard/dashboard.component.ts
  ✔ KPIs: today's invoices, DIAN pending, monthly revenue

◇  [3/7] Clients — Full CRUD...
  ✔ 5 files: listing, detail, form, service, types

◇  [4/7] Billing — With PDF...
  ✔ 6 files + PDF generation with jsPDF
  ✔ VAT calculation migrated (with floating point fix using cents)

◇  [5/7] Reports...
  ✔ 3 files with monthly sales charts

◇  [6/7] DIAN Query — Invoice status...
  ✔ Created: src/app/dian/consulta-dian/consulta-dian.component.ts
  ✔ Integration with endpoint GET /api/dian/estado/:facturaId

◇  [7/7] Corporate styles — Migrating variables...
  ✔ CSS variables converted to Sass variables (_variables.scss)
  ✔ Corporate colors applied to all components
  ✔ Segoe UI typography maintained

◇  npm run build... ✓ Build successful
◇  Verifying integration with backend... ✓ 18/18 endpoints responding

◇  agent-browser open http://localhost:4200
◇  agent-browser snapshot -i --json
  ✓ /login         → Form with corporate colors (#1a3c5e) renders correctly
  ✓ /dashboard     → Daily KPIs visible, Segoe UI typography applied
  ✓ /clientes      → CRUD table with corporate Sass styles
  ✓ /facturacion   → Form with VAT calculation visible
  ✓ /reportes      → Monthly sales charts render without errors

  ╭───────────────────────────────────────────────────────────╮
  │  ✔ Angular frontend completed                             │
  │                                                           │
  │  📁 28 files created                                      │
  │  🔐 Auth + Guards + JWT interceptor                       │
  │  📦 7 modules implemented                                 │
  │  🎨 Corporate styles migrated to Sass                     │
  │  ✓ Build successful + integration verified                │
  │  ✓ UI verified in browser (5 routes, corporate colors)    │
  ╰───────────────────────────────────────────────────────────╯
```

In 20 minutes, Claude Code built the entire Angular frontend with ContaFlex's corporate styles and verified it visually. The colors, typography, and components are identical to the old system — users won't notice the change. But under the hood, everything is Angular 19 with TypeScript, standalone components, and a maintainable architecture.

---

### Step 9: Generate documentation with `/grimox-docs`

ContaFlex has 5 developers and none of them understands the entire system. Camila uses the last skill:

```
> /grimox-docs
```

```
◇  Analyzing source code, schemas, API endpoints, NestJS modules...

📄 PROJECT_DOCS.md generated (1,240 lines)

Contents:
  1. General Description — DIAN electronic invoicing system for Colombian companies
  2. Architecture — Angular 19 (frontend) + NestJS (backend) + MongoDB

     ┌─────────────┐     REST API     ┌──────────────┐     ┌─────────┐
     │  Angular 19  │ ◄──────────────► │   NestJS     │ ◄──►│ MongoDB │
     │  (Sass/SCSS) │                  │  (TypeScript) │     └─────────┘
     └─────────────┘                  │              │     ┌─────────┐
                                       │  DianService │ ◄──►│ DIAN API│
                                       └──────────────┘     └─────────┘

  3. Tech Stack — Angular 19, NestJS, Mongoose 8, TypeScript
  4. File Structure — full tree frontend/ + backend/
  5. API Reference — 18 endpoints with auth, params, responses, errors
  6. Angular Components — 23 components (migrated from Handlebars) with inputs/outputs
  7. NestJS Modules — 6 modules with their services, controllers, guards
  8. Database — 6 MongoDB collections with Mongoose schemas and indexes
  9. DIAN Integration — Complete electronic invoicing flow (diagram)
  10. Environment Variables — 14 variables with descriptions and example values
  11. How to Run — dev (frontend + backend), Docker, tests
  12. Deploy — Docker Compose + GitHub Actions pipeline
```

For the first time in 8 years, ContaFlex has complete technical documentation. All 5 developers can understand any module without asking Camila.

---

### What Camila achieved

| Before | After |
|---|---|
| jQuery 2.x + Bootstrap 3 | Angular 19 + corporate Sass/SCSS |
| Express 4.14 (CommonJS) | NestJS (TypeScript, modular) |
| Mongoose 4.x | Mongoose 8 |
| Passport.js sessions | JWT + NestJS Guards |
| No tests | Base tests generated |
| Manual deploy via FTP | GitHub Actions CI/CD |
| No Docker | Docker + docker-compose |
| Hardcoded credentials | .env validation + security |
| 4,200 lines of jQuery | 23 typed Angular components |

**Total migration time:** 6 weeks (instead of the 6 months the CTO estimated).

**What ended up working:** The electronic invoicing system migrated to a modern stack, with the DIAN integration intact, all 200 clients unaware of the change, and the DIAN API update completed **1 month before the deadline**.

---

The night they deployed to production, Camila was in the server room with Julian. Silence. The first pings from clients hitting the new system. No errors. Julian checked the logs. All green.

*"You know what surprises me the most?"* said Julian. *"Grupo Empresarial Torres didn't notice anything. 40 locations invoicing without a single support ticket."*

Camila thought about the Slack message from 11:47 p.m. that Tuesday. About the 380 lines of the DIAN connector that nobody wanted to touch. About the 6-year-old silent bug that an AI found in 40 minutes.

Two weeks later, DIAN announced another API update for the following year. The CTO forwarded the announcement to the team with a single comment: *"This is no longer our problem."*

He was right. For the first time in 8 years, ContaFlex's system could adapt.

It all started with:

```bash
grimox migrate
```

---

---

## Summary

| | Alex (Creation) | Camila (Migration) |
|---|---|---|
| **Problem** | Configuring a project from scratch takes days | Legacy system about to collapse |
| **Command** | `grimox create` | `grimox migrate` |
| **Time saved** | 3.5 hours of config → 12 sec + 15 min of autonomous dev | 6 months estimated → 6 weeks |
| **Stack** | Next.js 15 + Supabase + Tailwind | Angular 19 + NestJS + Sass |
| **Skills used** | `/grimox-dev` (full app: 34 files, 8 modules in 15 min), `/grimox-docs` (Daniela's onboarding) | `/grimox-migrate` (DIAN connector), `/grimox-dev` (full Angular frontend: 28 files in 20 min), `/grimox-docs` (first docs in 8 years) |
| **Result** | Veterinary SaaS with 14 clients in 3 months | 200 companies migrated with zero downtime |

---

## The 3 Grimox Skills in Action

| Skill | When to use it | What it does | Alex used it for... | Camila used it for... |
|---|---|---|---|---|
| `/grimox-dev` | After `grimox create` or when you need to implement complete functionality. It's the **most important** skill — it turns an empty scaffold into a functional app | Reads GRIMOX.md + .ai/rules.md + stack → implements the complete app autonomously: DB, auth, CRUD, UI, APIs. Verifies that it compiles, that endpoints respond, and that the UI renders correctly in the browser with `agent-browser` (snapshots + interactions) | Develop the ENTIRE PetVida app from scratch: 34 files, 8 modules (pets, appointments, vaccinations, billing, dashboard) in 15 minutes without writing a single line | Build the entire Angular frontend (28 files, 7 modules) with ContaFlex's corporate styles migrated to Sass |
| `/grimox-migrate` | To migrate existing projects file by file with AI guidance | Analyzes real code, generates MIGRATION_PLAN.md with specific steps, before/after snippets, and can apply transformations | — | Migrate the DIAN connector (380 lines of critical logic with XML signing and certificates) from Express to NestJS without breaking anything |
| `/grimox-docs` | To document the project or onboard new developers to the team | Generates a complete PROJECT_DOCS.md: architecture, API reference, components, schemas, environment variables, how to run and deploy | Onboard Daniela (junior) to the project — she started contributing the next day without an onboarding call | Give 5 developers technical documentation for the first time in ContaFlex's 8-year history |

All 3 skills live in **`.ai/skills/`** — accessible from any LLM or IDE. Claude Code and Open Code activate them automatically as slash commands from `.claude/commands/` (adapter generated silently). Cursor, Trae, Windsurf, and Antigravity use `.cursorrules` and `.ai/rules.md`. Copilot uses `.github/copilot-instructions.md`. With GPT, Gemini, Grok, GLM, or Ollama: open the skill's `.md` file in `.ai/skills/` and use it as a prompt.

---

**Grimox doesn't just create and configure your project — it develops it, migrates it, and documents it. All AI-assisted, all from the terminal.**
