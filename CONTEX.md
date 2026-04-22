# Project Context: Grimox CLI 🔮

> 🇪🇸 [Leer en Español](CONTEX.es.md)

## 1. The Core Vision (The Origin)
Since nowadays commands are executed from the terminal to make life easier, **Grimox** was born as an intelligent CLI engine. Its goal is not just to create folders, but to act as an architectural assistant that allows you to create applications ready to develop, package, and deploy across multiple ecosystems.

The ultimate goal is to deliver a fully configured stack, validating development best practices so that applications are compact and highly secure.

## 2. Intelligent Workflow (The Assistant)
The CLI should interact with the developer following this logical flow:
1.  **Purpose:** Asks what the application is intended for.
2.  **Framework Suggestion:** Based on the purpose, the CLI recommends the best option:
    * If it's for electronics/IoT topics $\rightarrow$ Suggests C++ / Arduino (PlatformIO).
    * If it's for Data Analytics or AI $\rightarrow$ Suggests a Python-related framework (FastAPI).
    * If it's for management or CRM topics (e.g. crm_lab) $\rightarrow$ Suggests fullstack frameworks like Next.js.
    * If it's for content/documentation $\rightarrow$ Suggests Astro.
3.  **Database Deployment:** Asks where the data should be deployed and shows precise options:
    * Supabase
    * PostgreSQL
    * Firebase
    * Oracle SQL
    * Turso
    * Insforge (insforge.dev)
4.  **Materialization (Scaffolding):** Upon pressing "Enter", it creates the entire stack ready for development.

## 3. Advanced Integration (Skills, AI, and MCPs)
The true magic of Grimox lies in what it injects into the generated project:
* **Specific Skills:** Links "skills" or guidelines (such as `.cursorrules` files or instructions) deemed important depending on the chosen framework, ensuring that any AI assisting in subsequent development follows the creator's standards.
* **MCP Connectivity:** Configures the corresponding MCP (Model Context Protocol) servers to allow the application and local AI agents to connect seamlessly to different applications and databases from day zero.
* **Security:** Validates and implements directory structures, environment variable management (`.env`), and Docker configurations (`docker-compose`) under strict best practices.

## 4. Creator Profile
The orchestrator of this tool is **Alexander (Alex)**, Electronics Engineer and Full-Stack Software Developer, with experience in robust solutions (such as CRMs for laboratories), IoT development (projects like the Aurora smart lamp), corporate databases (Oracle, SQL), and modern deployments (Docker, CI/CD).

## 5. Claude Code Skills (AI-Powered Migration)
Grimox integrates **Claude Code skills** that enhance its capabilities using LLMs:

* **`/grimox-migrate`** — Deep migration skill. While `grimox migrate` generates a static 5-8 step plan based solely on package.json, this skill analyzes the project's actual source code: detects patterns (class vs functional components, state management, auth, ORM), maps external integrations (Stripe, SendGrid, Cloudinary), inventories environment variables, and generates a `MIGRATION_PLAN.md` with 30-60+ steps including exact commands, before/after snippets, verifications, and rollback.
* **`/grimox-dev`** — One-shot autonomous development skill. After `grimox create` or a migration, this skill implements the ENTIRE project autonomously: plans development phases, writes the code (backend + frontend), runs locally, and verifies in a Build→Test→Fix cycle until the app is fully functional. For web projects with UI, verification is **deterministic via the npm pipeline**: every `npm run build` automatically triggers `grimox-qa --dynamic --auto-server` (the `postbuild` hook) which runs visual flows declared in `.grimox/qa-plan.yml` inside a persistent Chromium browser managed by `grimox-daemon` with Grimox Studio overlays. If any flow fails, build exits ≠ 0 and the LLM is forced to fix before reporting "done" — QA is not a suggestion the LLM can skip, it's a build gate. Includes smart conflict detection: if it detects a pending MIGRATION_PLAN.md, it offers to run the migration first; if it detects unmigrated legacy code, it recommends using `/grimox-migrate` before developing. Generates `GRIMOX_DEV_PLAN.md` as persistent state to allow resuming if interrupted.
* **`/grimox-docs`** — Technical documentation skill. Generates and updates `PROJECT_DOCS.md` with architecture, stacks, commands, and changelog.

The skills follow the **progressive disclosure** pattern: a main SKILL.md (<500 lines) with reference files in `references/` loaded on demand based on the detected context.

**Integrated skills flow:**
```
grimox create → /grimox-dev → App running
grimox migrate → /grimox-migrate → MIGRATION_PLAN.md → /grimox-dev → App migrated and running
any time → /grimox-docs → Updated PROJECT_DOCS.md
```

## 6. Current Technological State
* **Engine:** Node.js using ESM modules.
* **CLI Tools:** `@clack/prompts` (for interactive menus) and `giget` (for clean cloning of base repositories).
* **AI Skills:** 3 Claude Code skills in `.claude/skills/` (migration, autonomous development, documentation).
