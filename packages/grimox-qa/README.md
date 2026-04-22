# grimox-qa

> QA visual autónomo + daemon de browser persistente para proyectos Grimox. Universal: funciona con cualquier LLM/IDE vía npm scripts.

## Qué es

Dos cosas en un solo paquete:

1. **CLI `grimox-qa`** — prueba tu app web automáticamente en browser real (Playwright) tras cada `npm run build`. **Determinístico**: corre como parte del pipeline de npm, no depende de que el LLM "se acuerde" de ejecutarlo.
2. **Daemon `grimox-daemon`** — proceso en background que mantiene **UN solo browser Chromium visible** durante toda la sesión de desarrollo con overlays Grimox Studio (banner LIVE, toasts de file changes, progress bar). El daemon es reusado por grimox-qa en el postbuild → nunca abres/cierras ventanas parásitas.

El QA determinístico es análogo a **ESLint** o **TypeScript check**: si falla, el build falla. Si el build falla, nadie puede reportar "funcionando".

## Por qué existe

Las skills de Claude Code (y equivalentes en otros IDEs) son **declarativas** — sugieren al LLM qué hacer. El LLM puede ignorar sugerencias. En la práctica, los LLMs tienden a reportar "build pasó, listo" sin haber verificado visualmente.

**`grimox-qa` mueve el QA del LLM al pipeline.** No es "sugerencia que el LLM puede saltar", es "comando npm que se ejecuta siempre".

## Instalación

Proyectos nuevos scaffoldeados con `grimox create` ya vienen con todo configurado (feature `qa-cli` habilitado por defecto para stacks con UI).

Para agregar a un proyecto existente, instala el paquete y agrega los scripts que documentamos abajo.

La primera ejecución descarga Chromium (~180MB, 1-2 min).

## Scripts que inyecta Grimox

En cada proyecto generado con `grimox create` (stack con UI), estos scripts se añaden al `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "predev": "grimox-daemon spawn-detached || true",
    "prebuild": "grimox-daemon kill-dev && grimox-daemon spawn-detached || true",
    "postbuild": "grimox-qa --dynamic --auto-server",
    "postinstall": "grimox-banner && grimox-daemon spawn-detached || true",
    "qa": "grimox-qa --dynamic",
    "daemon:stop": "grimox-daemon stop",
    "daemon:status": "grimox-daemon status",
    "daemon:demo": "grimox-daemon demo",
    "daemon:purge": "grimox-daemon purge-all",
    "dev:fresh": "grimox-daemon purge-all && npm run dev",
    "build:fresh": "grimox-daemon purge-all && npm run build"
  }
}
```

### Qué hace cada hook

| Hook | Qué hace | Por qué |
|---|---|---|
| `postinstall` | Spawnea daemon en background con splash Grimox Studio | Tras `npm install`, el browser ya está visible esperando el dev server |
| `predev` | Spawnea daemon si no vive (idempotente) | Si el usuario cerró el browser accidentalmente, al hacer `npm run dev` revive |
| `prebuild` | Mata dev server del puerto 3000 (libera `.next/trace` en Windows) y asegura daemon vivo | `next build` no puede abrir `.next/trace` si `next dev` lo tiene bloqueado — resolvió el `EPERM` clásico de Windows |
| `postbuild` | Dispara `grimox-qa --dynamic --auto-server` | QA automático tras cada build, reusando el mismo browser del daemon |

## Uso diario

```bash
npm run dev          # dev server + daemon (si no vive, se spawnea)
npm run build        # build + postbuild QA automático contra production server temporal
npm run qa           # correr QA manualmente (reusa daemon)
```

## Uso para garantía de estado limpio

Los scripts `*:fresh` primero purgan TODO (daemons, chromiums, servers zombies) y luego arrancan desde cero. Úsalos cuando:
- Vuelves al proyecto tras días sin tocarlo
- Notas comportamiento raro
- Antes de una demo crítica o CI local

```bash
npm run dev:fresh    # purga total → npm run dev
npm run build:fresh  # purga total → npm run build
npm run daemon:purge # solo purga, sin arrancar nada
```

## Directamente (sin npm scripts)

```bash
npx grimox-qa --help
npx grimox-qa --headed
npx grimox-qa --plan custom.yml --url http://localhost:4000
npx grimox-qa --dynamic --auto-server  # el que usa el postbuild
```

## Configuración

`.grimox/qa-plan.yml`:

```yaml
version: 1
baseUrl: http://localhost:3000
autoDiscover: true  # descubre rutas del proyecto → smoke tests automáticos

# Credenciales (opcional — para flows con auth)
auth:
  testUser:
    email: demo@test.local
    password: demo12345
  loginUrl: /login
  fields:
    email: '#email'
    password: '#password'
    submit: 'button[type=submit]'
  redirectTo: /dashboard

# Flows específicos por feature
flows:
  - name: "Home loads"
    url: /
    steps:
      - assert: { text_visible: "Bienvenido" }

  - name: "Login exitoso"
    steps:
      - login: { as: demo }  # macro — usa config.auth
      - assert: { url_contains: /dashboard }

  - name: "Borrar tarea"
    steps:
      - login: { as: demo }
      - goto: /tasks
      - click: 'button:has-text("Borrar"):first'
      - assert: { text_not_visible: "Mi tarea" }   # valida que desapareció
```

## Tipos de step soportados

| Step | Ejemplo | Qué hace |
|---|---|---|
| `goto` | `goto: /login` | Navega a URL (relativa a baseUrl) |
| `click` | `click: '#submit'` | Click en selector |
| `fill` | `fill: { selector: '#email', value: 'x' }` | Llena input |
| `login` | `login: { as: demo }` | Macro: login usando config.auth |
| `wait` | `wait: 500` | Delay explícito en ms |
| `assert.text_visible` | `assert: { text_visible: 'Hola' }` | Texto presente en página |
| `assert.text_not_visible` | `assert: { text_not_visible: 'Borrado' }` | **Texto ausente** (útil tras DELETE) |
| `assert.element_visible` | `assert: { element_visible: 'h1' }` | Selector visible |
| `assert.element_not_visible` | `assert: { element_not_visible: '.modal' }` | **Selector ausente** (tras cerrar modal) |
| `assert.url_contains` | `assert: { url_contains: /dashboard }` | URL actual contiene string |
| `assert.redirect_to` | `assert: { redirect_to: /login }` | Espera redirect a path |
| `assert.no_console_errors` | `assert: { no_console_errors: true }` | Sin errores de consola |

## Flags del CLI

### Flags de visualización

| Flag | Default | Qué hace |
|---|---|---|
| `--headed` | auto-detect | Fuerza browser visible |
| `--headless` | auto-detect | Fuerza sin ventana |
| `--animations=full\|minimal\|off` | `full` en headed | Nivel de overlays visuales |

### Flags de pipeline

| Flag | Qué hace |
|---|---|
| `--dynamic` | Intenta reusar el browser del daemon vía CDP (un solo browser durante todo el ciclo) |
| `--auto-server` | Si `baseUrl` no responde, arranca un production server temporal en puerto 3100 (`npx next start -p 3100`) y apunta QA ahí. Se mata al terminar. |
| `--auto-server-port N` | Puerto del production server temporal (default: 3100) |
| `--auto-server-cmd "..."` | Comando custom para arrancar server (default: auto-detect por stack) |
| `--url http://...` | Override de baseUrl del qa-plan |
| `--plan path.yml` | Usa otro archivo de plan |
| `--timeout ms` | Timeout por step (default: 10000) |
| `--retries N` | Reintentos por flow flaky (default: 2) |
| `--reset` | Resetea contador de intentos (`.grimox/attempts.json`) |

## Modo headed vs headless

Auto-detectado por defecto:

| Entorno | Modo por defecto |
|---|---|
| Desktop local (Windows/Mac/Linux con DISPLAY) | **headed** (visible) |
| CI (GitHub Actions, Jenkins, etc.) | **headless** |
| Linux/WSL sin DISPLAY | **headless** + screenshots |
| SSH remoto | **headless** + screenshots |

### En modo headed: un solo browser durante todo el ciclo

Cuando hay daemon vivo + flag `--dynamic`, grimox-qa **reusa el browser del daemon vía CDP**. No abre browsers nuevos por flow ni por smoke test. La misma ventana Chromium cambia de URL entre rutas — sin ráfaga de tabs, sin ventanas que aparecen/desaparecen.

Sin daemon, cae al fallback: un browser compartido para todos los flows.

## Animaciones visuales

En modo headed con daemon, los overlays **Grimox Dev Studio** viven en el browser:

- **Banner superior persistente** (LIVE · Grimox Dev Studio · ruta actual · status)
- **Toasts** cuando cambian archivos del proyecto (file watcher)
- **Flash verde/rojo** tras cada flow del QA
- **Highlight de elementos** antes de click/fill (outline cyan pulsing)
- **Scanline ambient** (nunca parece estático)

Los overlays son CSS+DOM inyectados solo durante el test — la app real no los modifica. Al cerrar la página, desaparecen.

## Comandos del daemon

`grimox-daemon` es el proceso que mantiene el browser visible. Se invoca automáticamente por los hooks de npm, pero puedes usarlo manualmente:

| Comando | Qué hace |
|---|---|
| `grimox-daemon spawn-detached` | Spawnea daemon en background con splash Grimox Studio. Idempotente: si ya vive con browser OK, skip. Si vive pero browser murió, respawn. También purga daemons parásitos y `next start/dev` zombies antes del spawn. |
| `grimox-daemon start --standby` | Arranca daemon en foreground con browser en modo standby (visible con splash desde el segundo 0). Útil para debug. |
| `grimox-daemon demo` | Mata daemon previo + arranca en standby. Para test rápido del mecanismo. |
| `grimox-daemon stop` | Envía SIGTERM al daemon (graceful shutdown). |
| `grimox-daemon status` | Reporta si vive, baseUrl actual, endpoint CDP y si está "taken over" por un QA. |
| `grimox-daemon kill-dev` | Mata procesos escuchando en puertos dev comunes (3000, 3001, 3100, 4200, 5173, 4321, 8080). Usado por `prebuild` para liberar `.next/trace` en Windows. |
| `grimox-daemon purge-all` | **Mata TODOS los daemons de Grimox + chromiums de Playwright + `next start/dev` zombies del sistema.** Útil cuando hay parásitos acumulados. |

## Exit codes

| Código | Significado |
|---|---|
| `0` | Todos los flows pasaron |
| `1` | Al menos un flow falló |
| `2` | **Escalación**: mismo flow falló 3 veces seguidas. Requiere intervención manual. Reset con `grimox-qa --reset`. |

## Evidencia de fallos

Screenshots automáticos en `.grimox/qa-evidence/`:

- `smoke-<path>.png` — rutas que fallaron auto-discovery
- `flow-<name>-step<N>-attempt<M>.png` — step exacto donde falló el flow

## Auto-discovery

Detecta rutas de:

- **Next.js App Router** (`app/` o `src/app/`)
- **Next.js Pages Router** (`pages/` o `src/pages/`)
- **Nuxt** (`pages/`)
- **SvelteKit** (`src/routes/`)

Crea un smoke test por ruta: navega, espera status 2xx/3xx, verifica sin console errors.

## Auto-server (QA tras build sin dev server vivo)

Cuando ejecutas `npm run build`, el `prebuild` mata el dev server (para que `next build` pueda crear `.next/trace` en Windows). Entonces el `postbuild` corre **sin dev server vivo**. El flag `--auto-server` resuelve esto:

1. Detecta que baseUrl no responde
2. Arranca un production server temporal en puerto 3100 (`npx next start -p 3100` para Next, equivalentes por stack)
3. Espera a que responda
4. Corre QA contra `http://localhost:3100`
5. Mata el production server al terminar

Así build + QA funcionan aunque el dev server esté muerto. En Windows resolvemos además el bug de EPERM en `.next/trace` con `kill-dev`.

## Universal entre IDEs

Funciona idéntico en:

- ✅ Claude Code CLI y extensión VSCode
- ✅ OpenCode
- ✅ Cursor (agent mode)
- ✅ Windsurf (Cascade)
- ✅ Antigravity
- ✅ Trae
- ✅ GitHub Copilot (agent mode)

Porque es un comando npm — no depende de APIs de IDEs particulares.

## Tamaño y deps

- Paquete: ~38KB
- Runtime dep: `playwright` (tras `npm install`, ~180MB con Chromium)
- Parseo: `yaml`, `picocolors`, `chokidar` (file watcher del daemon)

## Arquitectura interna (resumen)

```
┌─────────────────────────────────────────────────────────────┐
│  npm install → postinstall → grimox-daemon spawn-detached   │
│  ├── auto-purga de parásitos (otros daemons, next zombies)  │
│  └── spawn daemon en background con --standby               │
│      └── Chromium visible con splash Grimox Studio          │
├─────────────────────────────────────────────────────────────┤
│  npm run dev → predev asegura daemon vivo                   │
│  └── next dev arranca en :3000                              │
│      └── port poller del daemon detecta → navega browser    │
│          └── file watcher del daemon → toasts en overlays   │
├─────────────────────────────────────────────────────────────┤
│  npm run build                                              │
│  ├── prebuild: kill-dev (libera .next/) + daemon vivo       │
│  ├── next build (compila, sin browser)                      │
│  └── postbuild: grimox-qa --dynamic --auto-server           │
│      ├── auto-server: npx next start -p 3100                │
│      ├── --dynamic: conecta al daemon vía CDP (endpoint     │
│      │   HTTP), reusa su page para smoke + flows            │
│      ├── corre 0..N smoke tests (auto-discovered routes)    │
│      ├── corre 0..N flows del qa-plan.yml                   │
│      └── mata production server al terminar                 │
└─────────────────────────────────────────────────────────────┘
```

## Licencia

MIT
