# Grimox CLI

> 🇪🇸 [Leer en Español](README.es.md)

> Intelligent CLI for creating and migrating modern applications with a fully configured stack — Docker, CI/CD, security, AI integrations, and more — in one command.

## Quick Start

```bash
npm install -g grimox

grimox create my-app
```

That's it. Follow the interactive prompts and get a production-ready project.

## What It Does

Grimox asks what you need, recommends the best stack, and scaffolds everything configured:

```
$ grimox create crm-lab

  ◆ What type of application do you need?
  │ ● Integrated Web Fullstack

  ◆ Framework:
  │ ● Next.js 15

  ◆ Database?
  │ ● Supabase

  ◆ Fully configured stack:
  │
  │   📦 crm-lab/
  │   ├── Framework:  Next.js 15 (TypeScript)
  │   ├── Database:   Supabase
  │   ├── Styles:     Tailwind CSS v4 + shadcn/ui + Dark Mode
  │   ├── Docker + docker-compose
  │   ├── CI/CD (GitHub Actions)
  │   ├── AI: GRIMOX.md + .ai/skills/ + .ai/rules.md
  │   ├── MCP Config
  │   ├── Security (.env validation + headers)
  │   └── Database config

  ✔ Project ready for development

  ◇ Open crm-lab in a new IDE window? (Y/n)
  │  (only asked if Grimox detects an IDE open in a parent folder)

  cd crm-lab && npm install && npm run dev
```

## Supported Stacks

| Category | Frameworks |
|----------|-----------|
| Web Fullstack (Integrated) | Next.js 15, Nuxt 4, SvelteKit |
| Web Fullstack (Decoupled) | Any frontend + any backend combination |
| Web Frontend (SPA) | React + Vite, Vue.js + Vite, Angular, Svelte + Vite |
| API / Backend | FastAPI, NestJS, Hono, Fastify, Spring Boot |
| Mobile App | React Native (Expo), Flutter, Flet |
| Desktop App | Tauri, Electron, Flet |
| IoT / Embedded | Arduino, PlatformIO, ESP-IDF, MicroPython |
| Data Analytics / AI | FastAPI + ML Stack |
| Documentation | Astro (Starlight), Docusaurus, VitePress |
| CLI Tool | Node.js + Commander |

**Databases:** Supabase, PostgreSQL, Firebase, MongoDB, Oracle SQL, Turso, Insforge, Redis

## Commands

| Command | Description |
|---------|-------------|
| `grimox create [name]` | Create a new project with interactive setup (`--yes` to skip prompts) |
| `grimox migrate` | Migrate a legacy project using AI (`--plan` to preview, `--apply` to execute) |
| `grimox list` | Show all available stacks, frameworks, and databases |

## Every Project Includes

| Feature | What you get |
|---------|-------------|
| Docker | Dockerfile + docker-compose.yml |
| CI/CD | GitHub Actions (lint, test, build, deploy) |
| Security | .env validation + CSP + CORS + security headers |
| AI Skills | Universal skills for any LLM (dev, migrate, docs) |
| MCP Config | Model Context Protocol server configuration |
| Help cheatsheet | `npm run grimox:help` from inside any generated project — colored summary of all available scripts, daemon commands, common workflows, and PowerShell tips |
| UI/UX | Tailwind CSS v4 + component library + dark mode |
| Database | Connection, ORM config, schemas, env vars (with correct framework prefixes like `NEXT_PUBLIC_*` / `PUBLIC_*` / `VITE_*`) |
| **Grimox Dev Studio** | Persistent browser daemon + visual QA pipeline (see below) |

All features are enabled by default. Choose "Customize" at the confirmation step to toggle any off.

## Grimox Dev Studio — visible browser during development (for web stacks)

Projects with a UI get an integrated visual pipeline that shows **exactly one browser window** during all dev/build/QA activity, with live animated overlays showing what's happening in real time.

**Key moments:**

```bash
npm install              # → postinstall spawns daemon + opens Chromium with
                         #   Grimox Studio splash (animated gradient purple)
npm run dev              # → daemon detects port → navigates browser to your app
                         #   with persistent LIVE overlay + file-change toasts
npm run build            # → prebuild kills dev server, next build compiles,
                         #   postbuild auto-spawns production server on :3100
                         #   and runs QA flows reusing the same browser.
                         #   Exit 1 if QA fails → LLM can't report "working"
```

**Extra scripts for guaranteed clean state:**

```bash
npm run dev:fresh        # purge all Grimox daemons + zombies, then npm run dev
npm run build:fresh      # purge all, then npm run build
npm run daemon:purge     # just purge (no dev/build after)
npm run daemon:status    # show daemon state (alive, CDP endpoint, browser)
npm run daemon:stop      # gracefully stop the daemon
npm run daemon:demo      # test the daemon/browser mechanism quickly
```

**Visual QA plan** in `.grimox/qa-plan.yml` — auto-discovers routes for smoke tests and lets you declare flows with steps like `click`, `fill`, `login: { as: demo }`, `assert: { text_visible / text_not_visible / element_visible / element_not_visible / url_contains / redirect_to }`.

See [packages/grimox-qa/README.md](packages/grimox-qa/README.md) for complete documentation of the CLI, daemon commands, and pipeline internals.

## AI Integrations

Every generated project works with any LLM or IDE out of the box:

| Generated File | Works With |
|---------------|-----------|
| `GRIMOX.md` + `.ai/skills/` + `.ai/rules.md` | Any LLM (Claude, GPT, Gemini, Grok, Ollama...) |
| `.claude/commands/` | Claude Code, Open Code |
| `.cursorrules` | Cursor, Windsurf, Antigravity, Trae |
| `.github/copilot-instructions.md` | GitHub Copilot |

## AI-Powered Migration

Migrate legacy projects to modern stacks using any available LLM:

```bash
cd my-old-express-app
grimox migrate --plan      # Analyze code + generate MIGRATION_PLAN.md
grimox migrate --apply     # Apply migration (auto-backup first)
```

Supports: CRA → Vite, Express → Hono, Vue 2 → Nuxt 4, jQuery → Next.js, PHP → Next.js, Flask/Django → FastAPI, and more.

## Requirements

- Node.js >= 18

## Documentation

- [PROJECT_DOCS.md](PROJECT_DOCS.md) — Full technical documentation
- [EXAMPLES.md](EXAMPLES.md) — 49 usage examples with CLI output
- [CASES.md](CASES.md) — Real-world use case stories

## License

[MIT](LICENSE)
