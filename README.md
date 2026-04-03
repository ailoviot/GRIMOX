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
| UI/UX | Tailwind CSS v4 + component library + dark mode |
| Database | Connection, ORM config, schemas, env vars |

All features are enabled by default. Choose "Customize" at the confirmation step to toggle any off.

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
