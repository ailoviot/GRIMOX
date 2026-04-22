# Contexto del Proyecto: Grimox CLI 🔮

> 🇬🇧 [Read in English](CONTEX.md)

## 1. La Visión Central (El Origen)
Dado que hoy en día se ejecutan comandos desde la terminal para hacer la vida más fácil, **Grimox** nace como un motor CLI inteligente. Su objetivo no es solo crear carpetas, sino actuar como un asistente arquitectónico que permite crear aplicaciones listas para desarrollar, empaquetar y desplegar en múltiples ecosistemas. 

El objetivo final es entregar un stack completamente configurado, validando buenas prácticas de desarrollo para que las aplicaciones sean compactas y altamente seguras.

## 2. Flujo de Trabajo Inteligente (El Asistente)
El CLI debe interactuar con el desarrollador siguiendo este flujo lógico:
1.  **Propósito:** Pregunta para qué se quiere desarrollar la aplicación.
2.  **Sugerencia de Framework:** Basado en el propósito, el CLI recomienda la mejor opción:
    * Si es para temas de electrónica/IoT $\rightarrow$ Sugiere C++ / Arduino (PlatformIO).
    * Si es para Data Analytics o IA $\rightarrow$ Sugiere un framework relacionado con Python (FastAPI).
    * Si es para temas de gestión o CRM (ej. crm_lab) $\rightarrow$ Sugiere frameworks fullstack como Next.js.
    * Si es para contenido/documentación $\rightarrow$ Sugiere Astro.
3.  **Despliegue de Base de Datos:** Pregunta dónde se desea desplegar la información y muestra opciones precisas:
    * Supabase
    * PostgreSQL
    * Firebase
    * Oracle SQL
    * Turso
    * Insforge (insforge.dev)
4.  **Materialización (Scaffolding):** Al dar "Enter", crea todo el stack listo para desarrollar.

## 3. Integración Avanzada (Skills, IA y MCPs)
La verdadera magia de Grimox radica en lo que inyecta en el proyecto generado:
* **Skills Específicas:** Vincula "skills" o directrices (como archivos `.cursorrules` o instrucciones) que considere importantes dependiendo del framework elegido, asegurando que cualquier IA que asista al desarrollo posterior siga los estándares del creador.
* **Conectividad MCP:** Configura los correspondientes servidores MCP (Model Context Protocol) para permitir que la aplicación y los agentes de IA locales se conecten fluidamente a diferentes aplicaciones y bases de datos desde el día cero.
* **Seguridad:** Valida e implementa estructuras de directorios, manejo de variables de entorno (`.env`) y configuraciones de Docker (`docker-compose`) bajo estrictas buenas prácticas.

## 4. Perfil del Creador
El orquestador de esta herramienta es **Alexander (Alex)**, Ingeniero en Electrónica y Desarrollador de Software Full-Stack, con experiencia en soluciones robustas (como CRMs para laboratorios), desarrollo IoT (proyectos como la lámpara inteligente Aurora), bases de datos corporativas (Oracle, SQL) y despliegues modernos (Docker, CI/CD).

## 5. Skills de Claude Code (Migración Potenciada con IA)
Grimox integra **skills de Claude Code** que potencian sus capacidades usando LLMs:

* **`/grimox-migrate`** — Skill de migración profunda. Mientras `grimox migrate` genera un plan estático de 5-8 pasos basado solo en package.json, esta skill analiza el código fuente real del proyecto: detecta patrones (class vs functional components, state management, auth, ORM), mapea integraciones externas (Stripe, SendGrid, Cloudinary), inventaría variables de entorno, y genera un `MIGRATION_PLAN.md` de 30-60+ pasos con comandos exactos, snippets before/after, verificaciones y rollback.
* **`/grimox-dev`** — Skill de desarrollo autónomo one-shot. Después de `grimox create` o una migración, esta skill implementa TODO el proyecto de forma autónoma: planifica fases de desarrollo, escribe el código (backend + frontend), ejecuta en local, y verifica en un ciclo Build→Test→Fix hasta que la app funcione completamente. Para proyectos web con UI, la verificación es **determinística vía el pipeline de npm**: cada `npm run build` dispara automáticamente `grimox-qa --dynamic --auto-server` (el hook `postbuild`) que corre flows visuales declarados en `.grimox/qa-plan.yml` dentro de un browser Chromium persistente administrado por `grimox-daemon` con overlays Grimox Studio. Si algún flow falla, el build sale con exit ≠ 0 y el LLM es forzado a corregir antes de reportar "listo" — el QA no es una sugerencia que el LLM pueda saltarse, es una compuerta de build. Incluye detección inteligente de conflictos: si detecta un MIGRATION_PLAN.md pendiente, ofrece ejecutar la migración primero; si detecta código legacy sin migrar, recomienda usar `/grimox-migrate` antes de desarrollar. Genera `GRIMOX_DEV_PLAN.md` como estado persistente para poder resumir si se interrumpe.
* **`/grimox-docs`** — Skill de documentación técnica. Genera y actualiza `PROJECT_DOCS.md` con arquitectura, stacks, comandos y changelog.

Las skills siguen el patrón de **progressive disclosure**: un SKILL.md principal (<500 líneas) con archivos de referencia en `references/` cargados bajo demanda según el contexto detectado.

**Flujo integrado de skills:**
```
grimox create → /grimox-dev → App funcionando
grimox migrate → /grimox-migrate → MIGRATION_PLAN.md → /grimox-dev → App migrada y funcionando
cualquier momento → /grimox-docs → PROJECT_DOCS.md actualizado
```

## 6. Estado Actual Tecnológico
* **Motor:** Node.js usando módulos ESM.
* **Herramientas CLI:** `@clack/prompts` (para menús interactivos) y `giget` (para la clonación limpia de repositorios base).
* **Skills IA:** 3 Claude Code skills en `.claude/skills/` (migración, desarrollo autónomo, documentación).