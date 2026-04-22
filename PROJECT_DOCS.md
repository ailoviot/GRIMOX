# Grimox CLI

> 🇪🇸 [Leer en Español](PROJECT_DOCS.es.md)

> Intelligent CLI for creating and migrating modern applications with a fully configured stack, validating development best practices so that applications are compact and highly secure.

**Created by Alexander (Alex)** — Electronics Engineer and Full-Stack Developer

---

## General Description

| Field | Value |
|-------|-------|
| **Name** | grimox |
| **Type** | CLI Tool (`cli-tools`) |
| **Framework** | Node.js + Commander.js |
| **Language** | JavaScript (ESM) |
| **UI** | N/A (terminal) |
| **Database** | N/A |
| **Version** | 0.1.0 |
| **License** | MIT |
| **Creation Date** | 2026-03-19 |

---

## Architecture

Command-line tool built with **Node.js** + **Commander.js** using ESM modules.

**Main layers:**
- **Entry point**: `bin/grimox.js` — shebang script that invokes the CLI
- **CLI setup**: `src/cli.js` — command registration with Commander (`create`, `migrate`, `list`)
- **Commands**: `src/commands/` — one file per command, each returns a `Command` instance
- **Core**: `src/core/` — execution engines (scaffolding, feature injection, migration, project detection, LLM detection and communication, intelligent code analysis)
- **Registry**: `src/registry/` — declarative catalogs of stacks, databases, features, CSS styles, and migration paths
- **Prompts**: `src/prompts/` — interactive flows with `@clack/prompts` for creation and migration
- **Injectors**: `src/injectors/` — modules that generate feature files (Docker, CI/CD, AI Skills, MCP, security, UI, database)
- **Integrations**: `src/integrations/` — IDE integration generators (Claude Code, Cursor, Windsurf, Antigravity, Trae)
- **Utils**: `src/utils/` — shared helpers (logging, filesystem, validation, git, constants)

**Execution flow:**

```
bin/grimox.js
  → src/cli.js (Commander setup + banner)
     → src/commands/create.js
        → src/prompts/create-prompts.js (interactive flow)
        → src/core/template-engine.js (scaffold: local → remote → minimal)
        → src/core/feature-injector.js (lazy feature injection)
           → src/injectors/*.js (Docker, CI/CD, MCP, etc.)
           → src/integrations/index.js (GRIMOX.md, .ai/skills/, .ai/rules.md + IDE adapters)
     → src/commands/migrate.js
        → src/core/llm-detector.js (check available LLM)
        → src/core/llm-client.js (communication with selected LLM)
        → src/core/project-detector.js (analyze existing project)
        → src/core/code-analyzer.js (intelligent code analysis with LLM)
        → src/prompts/migrate-prompts.js (interactive flow)
        → src/core/migration-engine.js (generate/apply plan)
     → src/commands/list.js
        → src/registry/stacks.js + databases.js (display catalog)
```

---

## Tech Stack

| Category | Technology | Version/Notes |
|----------|-----------|---------------|
| Runtime | Node.js | >= 18.0.0 |
| Language | JavaScript | ESM (`"type": "module"`) |
| CLI Framework | Commander.js | ^13.0.0 — argument and subcommand parsing |
| Interactive Prompts | @clack/prompts | ^0.10.0 — TUI with spinners, selects, confirms |
| Template cloning | giget | ^2.0.0 — clean cloning from GitHub repos |
| Terminal colors | picocolors | ^1.1.0 — colored and styled output |
| Testing | Vitest | ^3.0.0 |
| Linting | ESLint | `npm run lint` |

---

## Project Structure

```
grimox/
├── bin/
│   └── grimox.js                  # Entry point (#!/usr/bin/env node)
├── src/
│   ├── index.js                   # Re-export from cli.js
│   ├── cli.js                     # Commander setup (banner + 3 commands)
│   ├── commands/
│   │   ├── create.js              # Command: create new project
│   │   ├── migrate.js             # Command: migrate existing project
│   │   └── list.js                # Command: list available stacks
│   ├── core/
│   │   ├── template-engine.js     # Scaffolding engine (local → remote → minimal)
│   │   ├── feature-injector.js    # Lazy feature injection orchestrator + IDE integrations
│   │   ├── project-detector.js    # Existing project stack detector
│   │   ├── migration-engine.js    # Migration engine (plan + backup + apply)
│   │   ├── llm-detector.js        # Available LLM detector (cloud, local, IDE)
│   │   ├── llm-client.js          # LLM communication client (Claude, GPT, Gemini, etc.)
│   │   └── code-analyzer.js       # Intelligent code analysis with LLM (patterns, codemods)
│   ├── registry/
│   │   ├── index.js               # Central registry export
│   │   ├── stacks.js              # Master catalog: 12 categories, 25+ stacks
│   │   ├── databases.js           # 8 supported databases
│   │   ├── features.js            # 7 injectable features
│   │   ├── styles.js              # 7 CSS frameworks (Tailwind, Bootstrap, Material, etc.)
│   │   ├── migrations.js          # Migration paths (legacy → modern)
│   │   └── migration-compatibility.js # Compatibility rules
│   ├── prompts/
│   │   ├── create-prompts.js      # Creation interactive flow
│   │   ├── migrate-prompts.js     # Migration interactive flow
│   │   └── shared-prompts.js      # Reusable prompts (DB, language, features, board)
│   ├── injectors/
│   │   ├── docker.js              # Generates Dockerfile + docker-compose.yml
│   │   ├── cicd.js                # Generates .github/workflows/ci.yml
│   │   ├── ai-skills.js           # Generates .ai/rules.md + .cursorrules + .github/copilot-instructions.md
│   │   ├── mcp-config.js          # Generates MCP server configuration
│   │   ├── security.js            # Generates .env.example + .env
│   │   ├── ui-styling.js          # Generates Tailwind CSS v4 config + component library
│   │   └── database.js            # Generates DB connection files
│   ├── integrations/
│   │   ├── index.js               # IDE integrations orchestrator
│   │   ├── claude-code.js         # Generates GRIMOX.md + .ai/skills/ (universal) + .claude/commands/ (Claude Code adapter)
│   │   └── cursor.js              # Generates .ai/rules.md (universal) + .cursorrules + .github/copilot-instructions.md
│   └── utils/
│       ├── constants.js           # VERSION, CLI_NAME, TEMPLATES_ORG, GITHUB_BASE
│       ├── logger.js              # Logger with colors (info, success, warn, error)
│       ├── fs-helpers.js          # ensureDir, writeFileSafe, readJson, exists, copyDir
│       ├── git-helpers.js         # cloneTemplate (giget) + initGit
│       └── validation.js          # Project name validation
├── templates/                     # Local templates per stack (nextjs-15, react-spa, etc.)
├── .claude/
│   └── skills/
│       ├── grimox-migrate/        # Deep migration skill (analysis + plan)
│       ├── grimox-dev/            # Autonomous development skill (one-shot)
│       └── grimox-docs/           # Technical documentation skill
├── package.json
├── .gitignore
├── PROJECT_DOCS.md                # Complete technical documentation
├── CONTEX.MD                      # Project vision document
└── EXAMPLES.md                    # Usage examples (49 examples)
```

---

## Getting Started

### Prerequisites

- Node.js >= 18

### Installation

```bash
npm install
```

### Development

```bash
node bin/grimox.js
```

### Global link (to use `grimox` as a command from any directory)

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

### Publish

```bash
npm publish
```

---

## Commands

| Command | Options | Description | Example |
|---------|---------|-------------|---------|
| `grimox create [name]` | `--yes` | Create a new project with a modern stack | `grimox create my-app` |
| `grimox migrate` | `--apply`, `--plan`, `--frontend <path>`, `--backend <path>` | Migrate an existing project to a modern stack | `grimox migrate --plan` |
| `grimox list` | — | Show all available stacks and frameworks | `grimox list` |

### Global Options

| Flag | Alias | Description |
|------|-------|-------------|
| `--version` | `-v` | Show version (0.1.0) |
| `--help` | `-h` | Show help |

---

### `grimox create [name]`

Interactive flow that guides the developer to configure a new project:

1. **Name** of the project (or passed as argument)
2. **Application type** — select from 12 categories
3. **Specific framework** for the selected type
4. **Language** — auto-detected or selected (JS/TS, Java/Kotlin, etc.)
5. **Database** — if the stack supports it
6. **Board** — if it's an IoT project (ESP32, Uno, Mega, etc.)
7. **Features** — confirm or customize enabled features
8. **Confirmation** — complete summary before creation

The `--yes` flag skips all questions and uses the default configuration.

**Template strategy:**
- Attempts to clone from `github:grimox-templates/[repo-name]` via giget
- If the remote template doesn't exist, generates a local base structure (package.json + README + src/)

### `grimox migrate`

Migrates legacy projects to modern stacks using an LLM. A single AI-powered flow: analyzes the project's actual code, generates a detailed plan (`MIGRATION_PLAN.md`), and guides step-by-step execution.

**Supported LLMs (automatic detection):**

| Type | Providers |
|------|----------|
| Cloud | Claude (Anthropic), GPT/Codex (OpenAI), Gemini (Google), Grok (xAI), GLM (Zhipu), DeepSeek |
| Local | Ollama, LM Studio, Jan, llama.cpp |
| IDE | Cursor IDE, GitHub Copilot |

Detection is automatic: it searches for API keys in environment variables and `.env`, pings local services, and detects IDEs with built-in LLM. If multiple LLMs are available, the user chooses which one to use. If none are available, the CLI indicates this and blocks the migration.

| Flag | Description |
|------|-------------|
| `--plan` | Only generate `MIGRATION_PLAN.md` without applying changes |
| `--apply` | Apply migration automatically (creates backup in `.grimox-backup/`) |
| `--frontend <path>` | Path to frontend in decoupled project |
| `--backend <path>` | Path to backend in decoupled project |

**`grimox migrate` vs the `grimox-migrate` skill — two entry points, same flow:**

`grimox migrate` and the `grimox-migrate` skill execute the same migration process. The difference is the entry point:

| Entry Point | When to Use |
|-------------|-------------|
| `grimox migrate --plan` | You want to generate the plan from the terminal — the CLI detects and calls the LLM automatically |
| `grimox migrate --apply` | You want to apply the changes from the generated plan (creates automatic backup first) |
| Skill `grimox-migrate` (Claude Code: `/grimox-migrate`) | You already have Claude Code or Open Code open in the project |
| Skill `grimox-migrate` (other LLMs/IDEs) | Open `.ai/skills/grimox-migrate.md` as a prompt in GPT, Gemini, Grok, GLM, Cursor, Ollama, etc. |

**Both use an LLM.** The difference is who orchestrates: with `grimox migrate`, the CLI detects the available LLM and invokes it in the background — you just run the command in the terminal. With the skill, you open the LLM or IDE yourself and use the skill file as instruction. The result — real code analysis, detailed `MIGRATION_PLAN.md`, execution guide — is the same in both cases.

### `grimox list`

Displays a visual tree with all available stacks, frameworks, and databases in the terminal with colors.

---

## Supported Stacks

### By Category

| Category | Frameworks |
|----------|-----------|
| Integrated Web Fullstack | Next.js 15, Nuxt 4, SvelteKit |
| Decoupled Web Fullstack | Dynamic frontend + backend combination |
| Web Frontend (SPA) | React + Vite, Vue.js + Vite, Angular, Svelte + Vite |
| API / Backend | FastAPI, NestJS, Hono, Fastify, Spring Boot |
| Mobile App | React Native (Expo), Flutter, Flet |
| Desktop App | Tauri, Electron, Flet |
| IoT / Embedded | Arduino, PlatformIO, ESP-IDF, MicroPython |
| Data Analytics / AI | FastAPI + ML Stack |
| Documentation | Astro (Starlight), Docusaurus, VitePress |
| CLI Tool | Node.js + Commander |

### Supported Databases

| Database | Type | Description |
|----------|------|-------------|
| Supabase | SQL | PostgreSQL + Auth + Storage + Realtime |
| PostgreSQL | SQL | Robust relational database |
| Firebase | NoSQL | Firestore + Auth + Storage (Google) |
| MongoDB | NoSQL | Document-oriented database |
| Oracle SQL | SQL | Oracle enterprise database |
| Turso | SQL | Distributed SQLite for edge |
| Insforge | SQL | Modern database (insforge.dev) |
| Redis | Key-Value | In-memory cache, sessions, and messaging |

### Injectable Features

| Feature | ID | Description | Default |
|---------|-----|-------------|---------|
| Docker | `docker` | Dockerfile + docker-compose.yml | Enabled |
| CI/CD | `cicd` | GitHub Actions (lint, test, build, deploy) | Enabled |
| AI Skills | `ai-skills` | .ai/rules.md (universal) + .cursorrules + .github/copilot-instructions.md | Enabled |
| AI Agents | `ai-agents` | `.claude/agents/grimox-qa.md` — optional QA inspection agent | Enabled |
| MCP Config | `mcp` | MCP server configuration (DB only; browser MCPs intentionally excluded — see Grimox Dev Studio section) | Enabled |
| **QA CLI** | `qa-cli` | **`grimox-qa` CLI + `grimox-daemon` in `.vendor/` tarball, `qa-plan.yml`, `dev:fresh`/`build:fresh` scripts, automated postbuild QA** | Enabled (web stacks only) |
| Security | `security` | .env validation + CSP + CORS + headers (vars get correct framework prefix: `NEXT_PUBLIC_*` / `PUBLIC_*` / `VITE_*`) | Enabled |
| UI/UX | `ui-styling` | Tailwind CSS v4 + component library + dark mode (web only) | Enabled |
| Database Config | `database` | DB connection, ORM config, schemas, .env vars (with framework-correct prefixes for client-exposed vars) | Enabled |

### Grimox Dev Studio (feature `qa-cli`)

For web stacks (Next.js, Nuxt, SvelteKit, Vite-based SPAs, Astro, docs sites, Electron/Tauri), this feature installs a **persistent browser daemon + deterministic visual QA pipeline**:

**Components installed:**
- `grimox-qa` CLI (bundled as `.vendor/grimox-qa.tgz`, resolved via `file:.vendor/...` to avoid npm registry)
- `grimox-daemon` — background process managing a persistent Chromium browser with Grimox Studio overlays
- `.grimox/qa-plan.yml` — QA flow configuration
- `.grimox/config.yml`, `.grimox/.gitignore`, `.grimox/README.md`

**Scripts injected into `package.json`:**

| Script | Purpose |
|---|---|
| `dev` | Framework's native dev (`next dev`, `vite`, etc.) — unchanged |
| `build` | Framework's native build — unchanged |
| `postinstall` | `grimox-banner && grimox-daemon spawn-detached` — shows welcome banner and spawns daemon after `npm install` |
| `predev` | `grimox-daemon spawn-detached \|\| true` — ensures daemon is alive before `npm run dev` |
| `prebuild` | `grimox-daemon kill-dev && grimox-daemon spawn-detached \|\| true` — frees port 3000 (resolves Windows `EPERM` on `.next/trace`) + ensures daemon alive before build |
| `postbuild` | `grimox-qa --dynamic --auto-server` — automated QA against production server temporarily launched on port 3100 |
| `qa` | `grimox-qa --dynamic` — manual QA run reusing the daemon |
| `daemon:status` | `grimox-daemon status` — show daemon state (alive, CDP endpoint, browser info) |
| `daemon:stop` | `grimox-daemon stop` — gracefully stop daemon |
| `daemon:demo` | `grimox-daemon demo` — quick test of the daemon+browser mechanism |
| `daemon:purge` | `grimox-daemon purge-all` — kill ALL Grimox daemons + Playwright chromiums + `next start/dev` zombies |
| `dev:fresh` | `grimox-daemon purge-all && npm run dev` — guaranteed clean state before dev |
| `build:fresh` | `grimox-daemon purge-all && npm run build` — guaranteed clean state before build |

**Daemon CLI commands (also available standalone via `npx grimox-daemon <cmd>`):**

| Command | Behavior |
|---|---|
| `start --standby` | Foreground start with browser showing Grimox Studio splash from second 0 |
| `spawn-detached` | Background spawn. Idempotent: preserves existing daemon if alive with working browser; respawns if browser died; also auto-purges foreign daemons (other projects) and `next start/dev` zombies from the system |
| `stop` | Graceful shutdown via IPC |
| `status` | JSON report (`alive`, `baseUrl`, `cdp` with `port` and `endpoint`, `takenOver`) |
| `kill-dev` | Kill processes listening on common dev ports (3000, 3001, 3100, 4200, 5173, 4321, 8080) |
| `demo` | Kill previous daemon + start in standby mode for quick verification |
| `purge-all` | System-wide kill of all Grimox daemons, Playwright chromiums (root, not `--type=*` workers), and `next start/dev` zombies |

**Why `grimox-qa --dynamic --auto-server` matters:**

- `--dynamic` — connects via CDP (HTTP endpoint) to the daemon's browser and reuses its page for smoke tests and flows. Result: one browser visible during the entire dev→build→QA cycle, not multiple windows opening/closing.
- `--auto-server` — if `baseUrl` doesn't respond (typical after `prebuild` kills the dev server to free `.next/`), automatically spawns a production server on port 3100 (`npx next start -p 3100` for Next.js, `nuxt preview` for Nuxt, `node build/index.js` for SvelteKit, etc.), runs QA against it, and kills it on exit.

**Supported assert types in `qa-plan.yml`:**

`text_visible`, `text_not_visible`, `element_visible`, `element_not_visible`, `url_contains`, `redirect_to`, `status`, `no_console_errors`. Step types: `goto`, `click`, `fill`, `login` (macro), `wait`.

### Automatically Generated AI Integrations

In addition to features, `grimox create` always generates integrations for any LLM or IDE:

| Generated File | Purpose |
|---------------|---------|
| `GRIMOX.md` | Universal project context — any LLM can read it (Claude, GPT, Gemini, Grok, GLM...) |
| `.ai/skills/grimox-dev.md` | Autonomous development skill — canonical location accessible from any LLM |
| `.ai/skills/grimox-migrate.md` | Migration skill — canonical location accessible from any LLM |
| `.ai/skills/grimox-docs.md` | Documentation skill — canonical location accessible from any LLM |
| `.claude/commands/grimox-*.md` | Claude Code / Open Code adapter — activates skills as slash commands |
| `.ai/rules.md` | Framework rules — canonical, accessible from any LLM or IDE |
| `.cursorrules` | Adapter: Cursor, Windsurf, Antigravity, Trae (replicates `.ai/rules.md`) |
| `.github/copilot-instructions.md` | Adapter: GitHub Copilot (replicates `.ai/rules.md`) |

Skills in `.ai/skills/` are standard Markdown files. Claude Code and Open Code activate them as slash commands via `.claude/commands/`; with any other LLM they are opened directly as prompts. Generated via `src/integrations/claude-code.js` + `src/integrations/cursor.js`.

### Available CSS Styles

| CSS Framework | Available For |
|--------------|---------------|
| Tailwind CSS v4 | All web stacks |
| Bootstrap 5 | All web stacks |
| Angular Material | Angular |
| Bulma | All web stacks |
| Sass/SCSS | All web stacks |
| Pure CSS | All web stacks |
| Styled Components | React, Next.js |

---

## Migration Paths

| Legacy Project | Recommended Stack | Alternatives |
|---------------|-------------------|-------------|
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

## Integrated AI Skills

Grimox CLI includes 3 skills for intelligent assistance with any LLM or IDE. Skills live in **`.ai/skills/`** (canonical location, accessible from any LLM) and are automatically replicated in `.claude/commands/` (adapter for slash commands in Claude Code and Open Code).

| Skill | Claude Code / Open Code | Other LLMs | Canonical Location | Purpose |
|-------|------------------------|------------|--------------------|---------|
| `grimox-migrate` | `/grimox-migrate` | Open `.ai/skills/grimox-migrate.md` as prompt | `.ai/skills/grimox-migrate.md` | Deep code analysis and file-by-file migration plan |
| `grimox-dev` | `/grimox-dev` | Open `.ai/skills/grimox-dev.md` as prompt | `.ai/skills/grimox-dev.md` | Autonomous one-shot development: implements, runs, debugs, and verifies until it works |
| `grimox-docs` | `/grimox-docs` | Open `.ai/skills/grimox-docs.md` as prompt | `.ai/skills/grimox-docs.md` | Technical documentation generation and update |

### Skill: `grimox-migrate` — AI-Powered Migration

Grimox's single migration flow. Analyzes the project's actual code with an LLM, generates a detailed plan, and guides step-by-step execution.

**4-phase flow:**

1. **Deep Analysis** — Project structure, file tree, code patterns (class vs functional, CJS vs ESM, Redux/Vuex/Pinia, JWT/sessions, Prisma/Mongoose/SQLAlchemy), categorized dependencies (migratable/rewritable/removable/keepable), external integrations (Stripe, SendGrid, Cloudinary), environment variables, testing
2. **Target Stack Selection** — Validates compatibility with Grimox's matrix, recommends based on analysis, loads the specific path reference
3. **MIGRATION_PLAN.md Generation** — File-by-file inventory, 10 phases ordered by dependencies, each step with exact command, transformation snippet, verification, and rollback
4. **Execution Guide** — Quick-start (5 commands), summary checklist, troubleshooting

**Skill structure:**

```
.ai/skills/grimox-migrate.md          ← Main flow (accessible from any LLM/IDE)
.claude/skills/grimox-migrate/        ← Extended references (loaded on demand)
└── references/
    ├── migration-paths-frontend.md   ← CRA→Vite, React→Next, Vue2→Nuxt, Angular→19
    ├── migration-paths-backend.md    ← Express→Hono, Flask→FastAPI, Django→FastAPI, Spring Boot
    ├── migration-paths-other.md      ← jQuery/PHP→Next, Electron→Tauri, Mobile, IoT
    ├── stacks-catalog.md             ← Catalog of all Grimox stacks
    └── plan-template.md              ← MIGRATION_PLAN.md template
```

**Progressive Disclosure:** The main file contains the complete flow. Per-migration-path guides are in `references/` — the LLM only loads the relevant reference for the detected path, optimizing context usage.

### Skill: `/grimox-dev` — Autonomous One-Shot Development

After creating a project with `grimox create` (or migrating with `grimox-migrate`), this skill implements the ENTIRE project autonomously in a Build→Test→Fix cycle until it works locally.

**6-phase flow:**

1. **Reconnaissance** — Reads GRIMOX.md, .ai/rules.md, manifests. Detects stack, DB, features, and project state (new, existing, post-migration, legacy)
2. **Planning** — Generates `GRIMOX_DEV_PLAN.md` with development phases ordered by dependencies
3. **Implementation** — Writes all code phase by phase (skeleton first, details after)
4. **Build→Test→Fix Cycle** — Install → Build → Dev server → curl → WebFetch per phase (quick sanity) → Fix errors → Repeat (max 5 attempts per error)
4.5. **Visual Testing with Browser** *(web projects with UI only)* — Verifies the app with `agent-browser` (automatically installed if missing): snapshot of each route, form and button interaction, rendering and hydration error detection
5. **Final Verification** — Production build + all routes + Docker (if applicable) + report

**Migration conflict detection:**

The skill automatically detects if the project is in the migration process or is legacy:

| Situation | Behavior |
|-----------|----------|
| MIGRATION_PLAN.md with pending steps | Offers 3 options: run migration first, ignore, or cancel |
| Legacy project without migration (jQuery, PHP, Vue 2, etc.) | Recommends running `grimox-migrate` first |
| Completed MIGRATION_PLAN.md | Treats as migrated project, proceeds to development |
| New project (post `grimox create`) | Complete implementation from scratch |

**Development order by type:**

| Type | Order |
|------|-------|
| API/Backend | DB → Models → Routes → Middleware → Auth → Tests |
| Web Fullstack | DB → Models → API → Layout → Pages → Components → Auth |
| Decoupled | Complete backend first → then Frontend consumes the API |
| Mobile | Navigation → Screens → Components → State → API → Auth |

**Skill structure:**

```
.ai/skills/grimox-dev.md              ← Main flow (accessible from any LLM/IDE)
.claude/skills/grimox-dev/            ← Extended references (loaded on demand)
└── references/
    ├── dev-commands-by-stack.md      ← Install/dev/build/test/port commands per stack
    ├── dev-phases.md                 ← Development phases per project type
    ├── dev-verification.md           ← Verification (curl, WebFetch, agent-browser, Docker) per stack
    └── dev-error-patterns.md        ← Common error patterns and their fixes
```

**GRIMOX_DEV_PLAN.md as persistent state:** If the conversation is interrupted, a new session can read this file and continue exactly where it left off. The name avoids conflict with MIGRATION_PLAN.md.

---

## Usage Examples by Purpose

### `grimox list` — See everything available

```bash
grimox list
```

Displays a colored tree in the terminal with the 12 categories, their frameworks, languages, and the 8 supported databases. Useful for exploring options before creating.

---

### Integrated Web Fullstack — CRM, dashboards, SaaS

A single framework that includes frontend + backend + SSR + API routes.

```bash
grimox create crm-lab
```

```
  🔮 Grimox CLI v0.1.0

  ◆ What type of application do you need?
  │ ● Integrated Web Fullstack    ← Single framework with SSR + API + DB
  │
  ◆ Choose the framework:
  │ ● Next.js 15                 ← React + SSR + App Router + Server Actions
  │   Nuxt 4                       Vue + SSR + Nitro server
  │   SvelteKit                    Svelte + SSR + Server Endpoints
  │
  ℹ Auto: TypeScript (App Router, Server Actions)
  ℹ Auto: Tailwind CSS v4 + shadcn/ui
  │
  ◆ Database?
  │ ● Supabase                   ← PostgreSQL + Auth + Storage + Realtime
  │   PostgreSQL                   Robust relational database
  │   Firebase                     Firestore + Auth + Storage (Google)
  │   MongoDB                      Document-oriented NoSQL database
  │   Turso                        Distributed SQLite for edge
  │   Insforge                     Modern database (insforge.dev)
  │   Redis                        In-memory cache, sessions, and messaging
  │   No database
  │
  ◆ Fully configured stack:
  │
  │   📦 crm-lab/
  │   ├── Framework:  Next.js 15 (TypeScript)
  │   ├── Database:   supabase
  │   ├── Styles:     Tailwind CSS v4 + shadcn/ui + Dark Mode
  │   ├── Docker + docker-compose
  │   ├── CI/CD (GitHub Actions)
  │   ├── AI: GRIMOX.md + .ai/skills/ + .ai/rules.md + adapters
  │   ├── MCP Config
  │   ├── Security (.env validation + headers)
  │   ├── UI/UX (Tailwind + component lib + dark mode)
  │   └── Database config
  │
  ◆ Create project?
  │ ● Yes, create project
  │   Customize (remove/add features)
  │   Cancel

  ╭───────────────────────────────────────────────╮
  │  ✔ Project ready for development              │
  │                                               │
  │  cd crm-lab                                   │
  │  npm install                                  │
  │  npm run dev                                  │
  ╰───────────────────────────────────────────────╯
```

**What it generates:**

```
crm-lab/
├── app/                    # App Router (pages, layouts, API routes)
├── components/             # React components
├── lib/                    # Supabase client, utils
├── .ai/
│   ├── rules.md            # Next.js best practices (canonical, any LLM)
│   └── skills/             # grimox-dev.md, grimox-migrate.md, grimox-docs.md
├── .claude/commands/       # Claude Code / Open Code adapter (slash commands)
├── .cursorrules            # Adapter: Cursor, Windsurf, Antigravity, Trae
├── .github/
│   ├── workflows/ci.yml
│   └── copilot-instructions.md  # Adapter: GitHub Copilot
├── GRIMOX.md               # Universal context (any LLM)
├── Dockerfile              # Multi-stage build
├── docker-compose.yml      # App + services
├── .env.example            # SUPABASE_URL, SUPABASE_ANON_KEY, etc.
└── package.json
```

---

### Decoupled Web Fullstack — Separate Frontend + Backend

Monorepo with frontend SPA and backend API as independent services.

```bash
grimox create my-saas
```

```
  ◆ What type of application do you need?
  │ ● Decoupled Web Fullstack  ← Frontend SPA + Backend as separate services

  ◆ Choose the frontend framework:
  │ ● React + Vite               ← SPA with React 19 + Vite
  │
  ◆ Language?
  │ ● TypeScript                 ← Recommended
  │   JavaScript
  │
  ℹ Auto: Tailwind CSS v4 + shadcn/ui

  ◆ Choose the backend framework:
  │ ● Hono                       ← Ultra-fast, multi-runtime API
  │
  ℹ Auto: Hono → TypeScript

  ◆ Database?
  │ ● PostgreSQL

  ◆ Fully configured stack:
  │
  │   📦 my-saas/
  │   frontend/    → React + Vite (TypeScript)
  │     └── Tailwind CSS v4 + shadcn/ui
  │   backend/     → Hono (TypeScript)
  │   Database:    postgresql
```

**What it generates:**

```
my-saas/
├── frontend/              # React + Vite (SPA)
│   ├── src/
│   └── package.json
├── backend/               # Hono (API)
│   ├── src/
│   └── package.json
├── docker-compose.yml     # Orchestrates frontend + backend + DB
└── .github/workflows/ci.yml
```

**To start:**

```bash
cd my-saas
docker-compose up          # Starts everything orchestrated
```

---

### Web Frontend SPA — Landing pages, client apps

Frontend only, no own backend. Optionally connects to Supabase/Firebase.

```bash
grimox create my-landing
```

```
  ◆ What type of application do you need?
  │ ● Web Frontend (SPA only)

  ◆ Choose the framework:
  │   React + Vite
  │ ● Vue.js + Vite              ← SPA with Vue 3 + Vite
  │   Angular
  │   Svelte + Vite

  ◆ Language?
  │ ● TypeScript

  ℹ Auto: Tailwind CSS v4 + PrimeVue

  ◆ Do you need to connect to a database?
  │ ● No (frontend only)
```

**Note:** In SPAs, Grimox explicitly asks if you need a DB because many landing pages don't require one. If you choose "Yes", it shows client-compatible DBs (Supabase, Firebase, Insforge).

---

### API / Backend — REST APIs, microservices

Backend only, no frontend. Ideal for microservices or APIs consumed by other clients.

```bash
grimox create inventory-api
```

```
  ◆ What type of application do you need?
  │ ● API / Backend (API only)

  ◆ Choose the framework:
  │   FastAPI                    Python, Pydantic v2, auto Swagger
  │   NestJS                     TypeScript, enterprise decorators
  │ ● Hono                      ← Ultra-fast, multi-runtime API
  │   Fastify                    High performance Node.js API
  │   Spring Boot                Enterprise Java/Kotlin API

  ℹ Auto: TypeScript

  ◆ Database?
  │ ● PostgreSQL

  ◆ Create project?
  │ ● Yes, create project

  ╭───────────────────────────────────────────────╮
  │  cd inventory-api                             │
  │  npm install                                  │
  │  npm run dev                                  │
  ╰───────────────────────────────────────────────╯
```

**Example with FastAPI (Python):**

```bash
grimox create ml-api
```

```
  ◆ Choose the framework:
  │ ● FastAPI                    ← Async API with Pydantic + Uvicorn

  ℹ Auto: Python (Pydantic v2, uvicorn, auto-docs Swagger/ReDoc)

  ◆ Database?
  │ ● Supabase

  ╭───────────────────────────────────────────────╮
  │  cd ml-api                                    │
  │  pip install -r requirements.txt              │
  │  uvicorn main:app --reload                    │
  ╰───────────────────────────────────────────────╯
```

**Example with Spring Boot (Java/Kotlin):**

```bash
grimox create enterprise-api
```

```
  ◆ Choose the framework:
  │ ● Spring Boot                ← Enterprise Java/Kotlin API

  ◆ Language?
  │ ● Java
  │   Kotlin

  ◆ Database?
  │ ● Oracle SQL                 ← Oracle enterprise database

  ╭───────────────────────────────────────────────╮
  │  cd enterprise-api                            │
  │  ./mvnw spring-boot:run                       │
  ╰───────────────────────────────────────────────╯
```

---

### Mobile App — Cross-platform iOS and Android

```bash
grimox create my-mobile-app
```

```
  ◆ What type of application do you need?
  │ ● Mobile App

  ◆ Choose the framework:
  │ ● React Native (Expo)        ← Expo SDK + Expo Router
  │   Flutter                      Cross-platform Flutter (Dart)
  │   Flet (Python)                Mobile apps from Python

  ℹ Auto: TypeScript
  ℹ Auto: NativeWind

  ◆ Database?
  │ ● Supabase

  ╭───────────────────────────────────────────────╮
  │  cd my-mobile-app                             │
  │  npm install                                  │
  │  npm run dev                                  │
  ╰───────────────────────────────────────────────╯
```

**Example with Flutter:**

```bash
grimox create delivery-app
```

```
  ◆ Choose the framework:
  │ ● Flutter                    ← Cross-platform Flutter

  ℹ Auto: Dart (Riverpod, Material 3)

  ◆ Database?
  │ ● Firebase

  ╭───────────────────────────────────────────────╮
  │  cd delivery-app                              │
  │  flutter pub get                              │
  │  flutter run                                  │
  ╰───────────────────────────────────────────────╯
```

---

### Desktop App — Windows, macOS, Linux

```bash
grimox create file-manager
```

```
  ◆ What type of application do you need?
  │ ● Desktop App

  ◆ Choose the framework:
  │ ● Tauri                      ← Lightweight apps with web UI + Rust (~5MB)
  │   Electron                     Cross-platform desktop with Node.js
  │   Flet (Python)                Desktop apps from Python

  ℹ Auto: TypeScript + Rust
  ℹ Auto: Tailwind CSS v4 + shadcn/ui

  ◆ Database?
  │ ● Turso                      ← Distributed SQLite for edge

  ╭───────────────────────────────────────────────╮
  │  cd file-manager                              │
  │  npm install                                  │
  │  npm run tauri dev                            │
  ╰───────────────────────────────────────────────╯
```

**Example with Electron:**

```bash
grimox create my-editor
```

```
  ◆ Choose the framework:
  │ ● Electron

  ◆ Language?
  │ ● TypeScript

  ╭───────────────────────────────────────────────╮
  │  cd my-editor                                 │
  │  npm install                                  │
  │  npm run dev                                  │
  ╰───────────────────────────────────────────────╯
```

---

### IoT / Embedded — Electronics and microcontrollers

```bash
grimox create temp-sensor
```

```
  ◆ What type of application do you need?
  │ ● IoT / Embedded

  ◆ Choose the framework:
  │   Arduino (.ino)             Arduino IDE structure with .ino
  │ ● PlatformIO                 ← Professional embedded development
  │   ESP-IDF                      Native Espressif framework
  │   MicroPython                  Python on microcontrollers

  ℹ Auto: C++

  ◆ Which board?
  │ ● ESP32 (esp32dev)
  │   ESP8266 (nodemcuv2)
  │   Arduino Uno (uno)

  ╭───────────────────────────────────────────────╮
  │  cd temp-sensor                               │
  │  pio run                                      │
  ╰───────────────────────────────────────────────╯
```

**Example with Arduino:**

```bash
grimox create aurora-lamp
```

```
  ◆ Choose the framework:
  │ ● Arduino (.ino)

  ℹ Auto: C++

  ◆ Which board?
  │ ● ESP32
  │   Arduino Uno
  │   Arduino Mega
  │   ESP8266

  ╭───────────────────────────────────────────────╮
  │  cd aurora-lamp                               │
  │  Open the .ino in Arduino IDE                 │
  ╰───────────────────────────────────────────────╯
```

**Example with MicroPython:**

```bash
grimox create auto-irrigation
```

```
  ◆ Choose the framework:
  │ ● MicroPython                ← Python on microcontrollers

  ℹ Auto: Python

  ◆ Which board?
  │ ● ESP32
  │   Raspberry Pi Pico
  │   ESP8266

  ╭───────────────────────────────────────────────╮
  │  cd auto-irrigation                           │
  │  Upload files with Thonny or mpremote         │
  ╰───────────────────────────────────────────────╯
```

**Note:** IoT projects don't have compatible databases — they connect to external services via WiFi/BLE if they need persistence.

---

### Data Analytics / AI — Machine learning, data science

```bash
grimox create sales-predictor
```

```
  ◆ What type of application do you need?
  │ ● Data Analytics / AI

  ◆ Choose the framework:
  │ ● FastAPI + ML Stack         ← FastAPI + scikit-learn + pandas + Jupyter

  ℹ Auto: Python (scikit-learn, pandas, numpy, Jupyter notebooks)

  ◆ Database?
  │ ● PostgreSQL

  ╭───────────────────────────────────────────────╮
  │  cd sales-predictor                           │
  │  pip install -r requirements.txt              │
  │  uvicorn main:app --reload                    │
  ╰───────────────────────────────────────────────╯
```

**What it generates besides the API:**

```
sales-predictor/
├── app/                   # FastAPI endpoints
├── models/                # Trained ML models (.pkl, .joblib)
├── notebooks/             # Jupyter notebooks (EDA, training)
├── data/
│   ├── raw/               # Raw data
│   └── processed/         # Processed data
├── requirements.txt       # scikit-learn, pandas, numpy, matplotlib, jupyter
└── Dockerfile
```

---

### Documentation — Static docs sites

```bash
grimox create project-docs
```

```
  ◆ What type of application do you need?
  │ ● Documentation

  ◆ Choose the framework:
  │ ● Astro (Starlight)          ← Fast documentation with Astro
  │   Docusaurus                   React-based documentation (Meta)
  │   VitePress                    Vue-based documentation

  ℹ Auto: TypeScript
  ℹ Auto: Tailwind CSS v4 + Starlight

  ╭───────────────────────────────────────────────╮
  │  cd project-docs                              │
  │  npm install                                  │
  │  npm run dev                                  │
  ╰───────────────────────────────────────────────╯
```

---

### CLI Tool — Terminal commands

```bash
grimox create my-cli
```

```
  ◆ What type of application do you need?
  │ ● CLI Tool

  ◆ Choose the framework:
  │ ● Node.js + Commander        ← CLI tool scaffold with Commander.js

  ℹ Auto: JavaScript

  ╭───────────────────────────────────────────────╮
  │  cd my-cli                                    │
  │  npm install                                  │
  │  npm run dev                                  │
  ╰───────────────────────────────────────────────╯
```

**What it generates:**

```
my-cli/
├── bin/
│   └── my-cli.js          # Entry point with shebang
├── src/
│   ├── cli.js             # Commander setup
│   └── commands/          # One file per command
└── package.json           # "bin": { "my-cli": "./bin/my-cli.js" }
```

**To register globally:** `npm link` → now `my-cli` works from any directory.

---

### Customize Features — Remove or add

In any project, when reaching the confirmation step you can choose "Customize":

```
  ◆ Create project?
  │   Yes, create project
  │ ● Customize (remove/add features)
  │   Cancel

  ◆ Which features do you want to include?
  │ ◻ Docker               Dockerfile + docker-compose.yml
  │ ◼ CI/CD                GitHub Actions (lint, test, build, deploy)
  │ ◼ AI Skills            .ai/rules.md + .cursorrules + copilot-instructions.md
  │ ◻ MCP Config           MCP server configuration for AI agents
  │ ◼ Security             .env validation + CSP + CORS + headers
  │ ◼ UI/UX                Tailwind CSS v4 + component library + dark mode
  │ ◼ Database Config      DB connection, ORM config, schemas, .env vars
  │
  │ (Space to toggle, Enter to confirm)
```

---

### `grimox migrate` — Migrate legacy projects

A single AI-powered flow. The CLI detects the available LLM and analyzes the project's actual code.

**Generate plan (view without applying):**

```bash
cd my-express-project
grimox migrate --plan
# → LLM detected: Claude (Anthropic)
# → Analyzes actual code: Express + MongoDB + EJS templates
# → Detects patterns: auth, routing, middleware, env vars
# → Generates MIGRATION_PLAN.md (30-60+ steps, file by file)
```

**Apply migration (with automatic backup):**

```bash
grimox migrate --apply
# → Creates backup in .grimox-backup/
# → Applies changes from the plan
```

**Decoupled project (frontend + backend in separate folders):**

```bash
grimox migrate --frontend ./client --backend ./server
# → Analyzes each part separately
# → Generates unified plan
```

**Directly from the LLM (without CLI):**

Open `.ai/skills/grimox-migrate.md` in your preferred LLM and use it as a prompt with the project in context. Works with Claude, GPT, Gemini, Grok, GLM, Ollama, or any compatible LLM.

---

### Quick creation with `--yes`

Skips all questions and uses the default configuration:

```bash
grimox create my-app --yes
# → Uses the first framework from the first category
# → All features enabled
# → No interactive questions
```

---

## Changelog

### 2026-04-22 — Grimox Dev Studio: persistent browser daemon + deterministic QA pipeline

Major overhaul of the visual testing layer. Replaces the previous "LLM-invokes-agent" model with a deterministic npm-pipeline model: the LLM can't skip QA because npm runs it automatically.

**New package: `grimox-qa`** (bundled as `.vendor/grimox-qa.tgz` in each scaffolded project)
- `grimox-qa` CLI with flags: `--dynamic` (reuse daemon browser via CDP), `--auto-server` (spawn temporary production server for QA), `--headed/--headless` (auto-detected), `--animations=full|minimal|off`, `--plan`, `--url`, `--retries`, `--reset`
- `grimox-daemon` — background process managing a persistent Chromium browser with Grimox Studio overlays. Commands: `start --standby`, `spawn-detached`, `stop`, `status`, `kill-dev`, `demo`, `purge-all`
- Assert types supported: `text_visible`, `text_not_visible`, `element_visible`, `element_not_visible`, `url_contains`, `redirect_to`, `status`, `no_console_errors`

**Feature `qa-cli`** (auto-enabled for web stacks) injects into `package.json`:
- Hooks: `postinstall`, `predev`, `prebuild`, `postbuild` — the whole pipeline is automated
- Scripts for daily use: `qa`, `daemon:status`, `daemon:stop`, `daemon:demo`
- Scripts for clean state guarantee: `daemon:purge`, `dev:fresh`, `build:fresh`

**UX guarantees achieved:**
- Single Chromium window visible during entire dev→build→QA cycle (no more "ráfaga" of tabs opening/closing)
- Grimox Studio overlays (LIVE banner, file-change toasts, progress bar) persistent across client-side navigation
- Browser opens with animated splash from second 0 (standby mode) — no more blank `about:blank`
- Auto-purge of foreign daemons and zombie `next start/dev` processes on every `spawn-detached`

**Windows-specific fixes:**
- `prebuild` kills dev server holding `.next/trace` before `next build` (resolves `EPERM` error)
- `auto-server` spawns production server on separate port (3100) so build + QA can coexist

**Supabase SSR correctness:**
- `.env.example` vars use correct framework prefix (`NEXT_PUBLIC_*` for Next.js, `PUBLIC_*` for SvelteKit, `VITE_*` for Vite-based, `NUXT_PUBLIC_*` for Nuxt)
- `.mcp.json` substitutes the same prefixed variable for the Supabase MCP server

**SKILL updates:**
- REGLA #4 added: "never use Playwright MCP / Chrome DevTools MCP — they spawn parasite browsers; trust the daemon + postbuild pipeline"
- Phase 4 (QA plan): 5 matrix presets depending on project type — A (CRUD with auth), B (landing/marketing), C (docs site), D (SPA consuming API), E (read-only dashboard)
- Coverage rules: if you implemented a "Delete" button, your qa-plan must have a flow that clicks it and asserts `text_not_visible`

**Browser MCPs removed from injector:** `@playwright/mcp` and `chrome-devtools-mcp` no longer scaffold into `.mcp.json`. They spawned additional Chromium windows without overlays, contradicting the "one browser visible" goal. The daemon + `grimox-qa --dynamic` cover all the capabilities.

**Undici fix (Node 21):** replaced `AbortSignal.timeout(X)` with manual `AbortController` + explicit body consumption in `pingServer` and `probePort`, resolving `ERR_INVALID_STATE: Controller is already closed` intermittent crashes during `npm run build`.

### 2026-03-21 — Autonomous visual testing with agent-browser in grimox-dev
- Skill `grimox-dev` updated to 6 phases: new Phase 4.5 for visual browser testing
- Phase 4.5 uses `agent-browser` (headless browser CLI): verifies rendering, interactions, hydration errors
- Automatic installation of `agent-browser` if not available — requires no user action
- Only activates for web projects with UI (Web Fullstack, Frontend SPA, Docs, Desktop web); APIs, Mobile, IoT, and CLI skip it
- Security: enables `--content-boundaries` in apps with external content (CMS, admin panels) to prevent prompt injection
- `dev-verification.md` updated: universal pattern distinguishes per-phase WebFetch vs end-to-end agent-browser

### 2026-03-21 — Multi-LLM AI architecture
- Skills renamed to canonical location `.ai/skills/` (accessible from any LLM or IDE)
- `.claude/commands/` maintained as silent adapter for Claude Code and Open Code (slash commands)
- Framework rules in `.ai/rules.md` (canonical) + `.cursorrules` (Cursor/Windsurf/Trae/Antigravity) + `.github/copilot-instructions.md` (Copilot)
- `GRIMOX.md` as universal context replacing `CLAUDE.md`
- Unified migration flow: single AI-powered mechanism (no basic/deep distinction)

### 2026-03-19 — Autonomous development skill `grimox-dev`
- One-shot development skill with autonomous Build→Test→Fix cycle
- SKILL.md + 4 reference files in `references/`
- Visual verification with WebFetch + URL for the user in browser
- Support for all 25+ Grimox stacks (web, mobile, desktop, IoT, data, docs, CLI)
- GRIMOX_DEV_PLAN.md as persistent state (resumes if interrupted)
- Intelligent detection of conflicts with pending migration or legacy projects

### 2026-03-19 — Migration skill `grimox-migrate`
- Migration skill with deep analysis of actual code using LLM
- SKILL.md + 5 reference files in `references/`
- Pattern analysis: components, state management, auth, routing, ORM, integrations
- File-by-file inventory with actions (CONVERT/REWRITE/DELETE/KEEP/ADAPT)
- 10 migration phases ordered by dependencies
- Guides for 12+ migration paths (CRA→Vite, Express→Hono, Vue2→Nuxt, etc.)

### 2026-03-19 — Project documented
- Grimox CLI v0.1.0 in active development
- 3 commands: `create`, `migrate`, `list`
- 12 stack categories with 25+ supported frameworks
- 8 supported databases
- 7 injectable features by default
- 3 integrated AI Skills (migrate, dev, docs) — multi-LLM
