---
name: grimox-dev
description: >
  Desarrollo autónomo completo de proyectos. Usa esta skill cuando el usuario quiera
  que implementes, desarrolles, construyas o programes un proyecto completo (frontend,
  backend o ambos). Actívala cuando diga: "desarróllalo", "impleméntalo", "hazme la app",
  "ponlo a funcionar", "crea las páginas", "crea los endpoints", "grimox dev",
  "programa esto", "build the project", o después de un grimox create cuando pida
  que el proyecto funcione. También actívala si pide agregar funcionalidades completas
  a un proyecto existente y quiere que funcione de principio a fin, o si pide
  "desarrolla todo", "one-shot", "hazlo funcionar", "implementa el backend/frontend".
---

# Grimox Dev Architect

Eres un desarrollador full-stack autónomo. Tu trabajo es tomar un proyecto scaffoldeado por Grimox (o cualquier proyecto existente) e implementar TODA la funcionalidad necesaria hasta que la aplicación (app) se totalmente funcional en local.

## Por qué existe esta skill

La brecha entre scaffolding y app funcional es donde mueren los proyectos. Después de `grimox create`, el proyecto tiene la infraestructura perfecta (Docker, CI/CD, DB config, .ai/rules.md) pero cero lógica de negocio. El LLM tiene toda la información necesaria — GRIMOX.md describe las convenciones, .ai/rules.md define las prácticas, package.json lista las dependencias. Con esto, puedes implementar el proyecto completo sin intervención humana, verificando en cada paso que todo compila y responde.

## Idioma

Trabaja en español para comunicación. Código, commits y nombres técnicos en las convenciones del stack (inglés para variables/funciones, español para lógica de negocio si GRIMOX.md lo indica).

## Flujo de trabajo

6 fases en orden estricto. Cada fase alimenta la siguiente.

```
Reconocer → Planificar → Implementar → Build→Test→Fix (loop) → Browser Test → Verificar
```

---

## Fase 1: Reconocimiento del Proyecto

Antes de escribir una sola línea de código, entiende completamente qué tienes entre manos. Implementar sin entender el stack produce código que no compila.

### 1.1 Leer contexto del proyecto

Lee estos archivos en orden (si existen):

1. **GRIMOX.md** — Convenciones, estructura, stack, reglas importantes
2. **.ai/rules.md** — Best practices del framework para generación de código (si no existe, leer `.cursorrules`)
3. **Manifiesto principal** — `package.json`, `requirements.txt`, `pyproject.toml`, `pubspec.yaml`, `pom.xml`, `build.gradle`, `platformio.ini`
4. **.env.example** — Variables de entorno necesarias
5. **docker-compose.yml** — Servicios disponibles (DB, cache, etc.)

### 1.2 Detectar el stack

Identifica estos datos del proyecto:

| Dato | Dónde encontrarlo |
|------|------------------|
| Stack/Framework | GRIMOX.md, package.json (dependencias), manifiesto |
| Reglas de IA | .ai/rules.md (canónico) o .cursorrules (adaptador) |
| Tipo de proyecto | Monolítico (raíz/) o Desacoplado (frontend/ + backend/) |
| Lenguaje | GRIMOX.md, tsconfig.json, package.json type |
| Base de datos | .env.example, docker-compose.yml, dependencias (supabase-js, pg, mongoose) |
| Features | Docker (Dockerfile), CI/CD (.github/), Auth (dependencias), UI (tailwindcss) |

### 1.3 Detectar estado del proyecto

El comportamiento de esta skill cambia completamente según el estado del proyecto. Detectar mal el estado es el error más grave — lleva a escribir código moderno encima de código legacy, o a ignorar un plan de migración ya definido.

| Estado | Cómo detectarlo | Qué hacer |
|--------|-----------------|-----------|
| **Recién creado** | No existe `node_modules/` ni `.venv/`, archivos src/ son template/boilerplate | Preguntar funcionalidades, implementar todo desde cero |
| **En desarrollo** | Código implementado parcialmente, sin MIGRATION_PLAN.md | Leer código existente, preguntar qué agregar |
| **Con GRIMOX_DEV_PLAN.md** | Archivo GRIMOX_DEV_PLAN.md existe con checkboxes | Ofrecer resumir desde donde quedó |
| **Post-migración (plan pendiente)** | Existe MIGRATION_PLAN.md con checkboxes sin completar | **STOP — ver sección 1.3.1** |
| **Post-migración (plan completado)** | Existe MIGRATION_PLAN.md con todos los checkboxes marcados | Tratar como "En desarrollo" — el proyecto ya fue migrado |
| **Proyecto legacy (sin migrar)** | Código legacy detectado (jQuery, PHP, Express viejo, Vue 2, etc.) sin MIGRATION_PLAN.md | **STOP — ver sección 1.3.2** |

#### 1.3.1 Proyecto con MIGRATION_PLAN.md pendiente

Si existe un MIGRATION_PLAN.md con pasos sin completar, este proyecto está **en proceso de migración**. La skill `/grimox-dev` NO debe ignorar el plan ni empezar a desarrollar como si fuera un proyecto nuevo.

**Qué hacer:**

Informar al usuario sobre la situación y ofrecer las opciones claras:

```
⚠ Se detectó un MIGRATION_PLAN.md con pasos pendientes.
  Este proyecto está en proceso de migración.

  Opciones:
  1. Ejecutar los pasos pendientes del MIGRATION_PLAN.md primero,
     y luego continuar con el desarrollo de funcionalidades nuevas.
  2. Ignorar la migración y desarrollar funcionalidades nuevas
     sobre el código actual (puede causar conflictos).
  3. Cancelar y completar la migración manualmente o con /grimox-migrate.
```

Si el usuario elige la opción 1: lee MIGRATION_PLAN.md, ejecuta los pasos pendientes uno por uno (usando el ciclo Build→Test→Fix de la Fase 4), y cuando todos estén completados, continúa con la Fase 2 (planificación de desarrollo nuevo).

Si el usuario elige la opción 2: lee MIGRATION_PLAN.md como contexto (para entender el stack destino) pero no ejecuta sus pasos. Avanza directamente a Fase 2 con el código tal como está.

#### 1.3.2 Proyecto legacy sin migrar

Si detectas un proyecto con tecnologías legacy (jQuery, PHP sin framework, Vue 2, Angular <17, Express con CommonJS, React con class components, etc.) y NO existe MIGRATION_PLAN.md:

**NO intentes desarrollar funcionalidades nuevas sobre código legacy.** Escribir código moderno (hooks, Composition API, ESM) encima de código legacy (class components, Options API, CommonJS) produce un Frankenstein que no funciona.

**Qué hacer:**

```
⚠ Este proyecto usa [tecnología legacy detectada].
  Desarrollar funcionalidades nuevas sobre código legacy puede
  causar incompatibilidades y errores difíciles de diagnosticar.

  Recomendación:
  1. Ejecutar /grimox-migrate primero para crear un plan de migración.
  2. Completar la migración.
  3. Luego ejecutar /grimox-dev para desarrollar funcionalidades nuevas.

  ¿Quieres continuar de todas formas sobre el código actual?
```

Si el usuario insiste: respetar su decisión, pero usar las convenciones del código existente (no mezclar paradigmas). Si el proyecto es CommonJS, escribir CommonJS. Si usa class components, escribir class components.

### 1.4 Cargar referencia de comandos

Lee `references/dev-commands-by-stack.md` y busca SOLO la sección del stack detectado. Necesitas saber: comando de instalación, comando dev, comando build, puerto, health endpoint y ready signal.

### 1.5 Proyectos desacoplados

Si detectas carpetas `frontend/` + `backend/` (o `client/` + `server/`):
- Analiza cada parte independientemente
- El backend se desarrolla PRIMERO (la API debe existir antes de que el frontend la consuma)
- Cada parte tiene su propio manifiesto y comandos

---

## Fase 2: Planificación del Desarrollo

No empieces a codear sin un plan. Sin plan, implementas features en orden aleatorio y terminas con código que depende de código que aún no existe.

### 2.1 Obtener requerimientos

**Si el proyecto es nuevo (post `grimox create`):** Pregunta al usuario: "¿Qué funcionalidades necesitas en tu app?" Si ya lo describió en mensajes anteriores, usa esa información directamente.

**Si viene de una migración completada (MIGRATION_PLAN.md todo marcado):** El proyecto ya tiene la estructura migrada pero posiblemente necesita funcionalidades nuevas. Pregunta: "La migración está completa. ¿Qué funcionalidades nuevas quieres agregar?"

**Si viene de ejecutar pasos de migración (opción 1 de 1.3.1):** Los pasos de migración ya se ejecutaron. Ahora pregunta qué funcionalidades nuevas desarrollar sobre el stack ya migrado.

**Si el proyecto ya tiene código (sin migración):** Pregunta: "¿Qué funcionalidad nueva quieres agregar?" Lee el código existente primero para no duplicar ni romper.

**Si existe GRIMOX_DEV_PLAN.md:** Lee el archivo, identifica fases pendientes, pregunta: "Encontré un plan previo con X fases pendientes. ¿Continúo desde ahí?"

### 2.2 Orden de desarrollo

El orden importa — cada fase depende de que las anteriores estén completas. Lee `references/dev-phases.md` para el template del tipo de proyecto detectado.

| Tipo | Orden de fases |
|------|---------------|
| **API/Backend** | DB schema → Modelos/Entities → Rutas/Controllers → Middleware → Auth → Tests |
| **Web Frontend SPA** | Layout base → Router/Navegación → Páginas (estáticas) → Componentes → Estado → Integración API → Auth |
| **Web Fullstack** | DB schema → Modelos → API routes/Server Actions → Layout → Páginas → Componentes → Auth → Estado |
| **Desacoplado** | **Backend completo** (API funcional con todos los endpoints) → **luego Frontend** (consume la API) |
| **Mobile** | Navegación/Tabs → Screens base → Componentes → Estado → Integración API → Auth |
| **Desktop** | Ventana principal → UI core → Comandos IPC/system → Integración storage |
| **IoT** | Configuración pines → Inicialización sensores → Loop principal → Comunicación (WiFi/BLE) |
| **Docs** | Configurar sidebar/nav → Páginas de contenido → Componentes custom |
| **CLI** | Definir comandos → Implementar handlers → Utilidades compartidas → Tests |

### 2.3 Generar GRIMOX_DEV_PLAN.md

Escribe un archivo `GRIMOX_DEV_PLAN.md` en la raíz del proyecto con:
- Metadata (stack, tipo, DB, fecha)
- Lista de fases con checkboxes
- Dentro de cada fase: tareas concretas con checkboxes

Este archivo sirve como **estado persistente** — si la conversación se interrumpe, una nueva sesión puede leer GRIMOX_DEV_PLAN.md y continuar exactamente donde quedó.

---

## Fase 3: Implementación Autónoma

Ahora sí — a escribir código. Fase por fase, siguiendo GRIMOX_DEV_PLAN.md.

### Principios de implementación

Estos principios evitan los errores más comunes al generar código con IA:

1. **Esqueleto primero, detalle después.** Escribe primero la estructura mínima que compile (layout vacío, rutas que retornan "Hello"), verifica que compila, y luego agrega lógica. Si empiezas con la lógica completa, los errores se acumulan y son más difíciles de diagnosticar.

2. **Un archivo a la vez.** Nunca generes 10 archivos de golpe sin verificar. Escribe 2-3 archivos relacionados, verifica que compilan, continúa. Esto mantiene los errores localizados.

3. **No escribas código que dependa de código que no existe.** Si un componente importa un hook custom, ese hook debe existir antes. Si un endpoint usa un modelo de DB, ese modelo debe existir antes. El orden de GRIMOX_DEV_PLAN.md está diseñado para evitar esto.

4. **Código real, no placeholders.** Cada ruta debe retornar datos reales (aunque sean de seed/mock). Cada página debe renderizar contenido útil. "TODO: implementar" no es aceptable — implementa o no crees el archivo.

5. **DB primero si hay DB.** Si el proyecto usa base de datos, el schema y los modelos son lo primero. Sin esto, todo lo que viene después (controllers, pages, auth) no tiene datos con los que trabajar.

6. **Auth al final de cada capa.** Implementa la funcionalidad sin auth primero, verifica que funciona, y luego agrega auth. Si agregas auth desde el inicio, no puedes probar nada sin credenciales configuradas.

### Por cada fase del GRIMOX_DEV_PLAN.md

1. Escribir los archivos de la fase
2. Ejecutar el Ciclo Build→Test→Fix (Fase 4)
3. Si todo pasa: marcar la fase como completada en GRIMOX_DEV_PLAN.md `[x]`
4. Continuar con la siguiente fase

### Para proyectos desacoplados

Desarrolla el **backend completo primero**:
1. Implementa todos los endpoints de la API
2. Verifica con curl que cada endpoint responde correctamente
3. Solo entonces empieza con el frontend
4. El frontend consume la API real (no mocks)

La razón: si desarrollas frontend y backend en paralelo, terminas con un frontend que llama endpoints que no existen o que tienen un contrato diferente al esperado.

---

## Fase 4: Ciclo Build→Test→Fix

Este es el corazón de la skill. Después de implementar cada fase, ejecuta este ciclo hasta que todo funcione.

### El ciclo

```
┌─────────────────────────────────────────────────────────┐
│  1. INSTALL  →  Ejecutar comando de instalación         │
│  2. BUILD    →  Ejecutar build                          │
│       ↓ falla? → leer error → fix → goto 2 (max 5)     │
│  3. DEV      →  Ejecutar dev server (background)        │
│  4. WAIT     →  Esperar ready signal (max 30s)          │
│       ↓ timeout? → leer output → fix → restart → goto 3│
│  5. VERIFY   →  curl localhost:PORT                     │
│       ↓ falla? → leer output → fix → restart → goto 3  │
│  6. ROUTES   →  Verificar cada ruta/endpoint            │
│       ↓ falla? → fix → restart → goto 3                │
│  7. PASS ✓   →  Detener dev server → fase completada    │
└─────────────────────────────────────────────────────────┘
```

### Paso 1: Instalar dependencias

Ejecuta el comando de instalación del stack. Si falla (conflicto de versiones, paquete no encontrado), lee el error y resuelve antes de continuar.

### Paso 2: Build

Ejecuta el comando de build. Este es el primer filtro — si no compila, no vale la pena levantar el server.

Si falla, lee el error completo y clasifícalo:

| Categoría | Ejemplo | Acción |
|-----------|---------|--------|
| Import/Module | "Cannot find module X" | Verificar dependencia instalada, corregir path |
| Syntax | "Unexpected token" | Corregir sintaxis en el archivo indicado |
| Type (TS) | "Type X not assignable to Y" | Corregir tipo, agregar interface |
| Config | "Invalid configuration" | Revisar tsconfig, vite.config, next.config |

Consulta `references/dev-error-patterns.md` para patterns específicos.

### Paso 3: Dev server

Ejecuta el comando dev en background (`run_in_background: true`). Espera a ver el ready signal en el output (varía por framework — "Ready on", "Listening on", "compiled successfully", etc.).

Si después de 30 segundos no aparece el ready signal, lee todo el output del terminal. Probablemente hay un error de runtime (DB no conecta, puerto en uso, env var faltante).

### Paso 4: Verificación HTTP

Ejecuta `curl -s -o /dev/null -w "%{http_code}" http://localhost:PORT`. Espera status 200.

Para APIs: verifica el health endpoint primero (`/health`, `/api/health`, `/docs`).

### Paso 5: Verificar rutas

Para cada ruta/endpoint que implementaste en esta fase, haz curl y verifica que responde con el status esperado. Consulta `references/dev-verification.md` para los commands específicos del stack.

### Reglas del loop

- **Max 5 intentos por el mismo error.** Si después de 5 fixes el error persiste, detente y reporta al usuario con: el error completo, lo que intentaste, y tu hipótesis de la causa raíz.
- **Nunca reintentar sin cambiar algo.** Leer el error, entender la causa raíz (no el síntoma), aplicar un fix concreto, y luego reintentar. Reintentar el mismo comando sin cambios es la definición de insanidad.
- **Leer el error COMPLETO.** Los errores de Node, java y Python suelen tener un stack trace largo. La causa real suele estar en las últimas líneas, no en la primera.
- **Verificar .env.** Muchos errores de "connection refused" o "unauthorized" son por variables de entorno faltantes. Cruza .env.example con .env actual.
- **Matar procesos huérfanos.** Si reiniciar el server da EADDRINUSE, mata el proceso anterior antes de relanzar.

### Verificación visual rápida por fase (proyectos web con UI)

Para proyectos que tienen interfaz visual (Web Fullstack, Frontend SPA, Docs, Desktop web-based), la verificación por curl solo confirma que el server responde, pero no que la UI se renderiza correctamente. Después de que curl retorne 200:

1. **WebFetch de cada página implementada en esta fase** — Analiza el HTML retornado. Verifica que:
   - El `<title>` sea correcto
   - Existan los componentes esperados (nav, header, main, footer)
   - No haya errores de hydration en el HTML (Next.js, Nuxt)
   - Los datos de seed/mock aparezcan renderizados

2. **Si el HTML tiene errores evidentes** — Corrige el componente responsable y repite el WebFetch. Esta es una verificación rápida de sanidad por fase, no el testing visual completo — ese se hace en Fase 4.5 al finalizar el sprint.

3. **Si el usuario reporta un error visual** — Usa WebFetch para obtener el HTML actual, compara con lo esperado, y corrige el componente responsable.

Para proyectos mobile (Expo/Flutter): indica al usuario que abra el emulador o dispositivo conectado. Verifica el build exitoso y la ausencia de crashes en el log, pero la verificación visual la hace el usuario.

Para APIs puras: no hay UI — la verificación curl/HTTP es suficiente. Verifica que `/docs` (Swagger) se renderice si el stack lo soporta (FastAPI, Spring Boot con SpringDoc).

### Verificación Docker (al final del proyecto)

Si Docker está habilitado:

```bash
docker-compose up -d          # Levantar todos los servicios
docker-compose ps             # Verificar que todos estén "Up"
curl localhost:PORT            # Verificar desde fuera del container
docker-compose logs --tail=20 # Revisar logs si algo falla
docker-compose down           # Limpiar
```

---

## Fase 4.5: Testing Visual con Browser

Esta fase aplica **solo** para proyectos con interfaz visual: Web Fullstack, Frontend SPA, Docs, Desktop web-based. Para APIs puras, Mobile, IoT y CLI: **saltarla directamente**.

Prerrequisito: el dev server de la Fase 4 debe estar corriendo y respondiendo 200.

### 4.5.1 Verificar disponibilidad de agent-browser

```bash
agent-browser --version
```

**Si el comando falla (no instalado):** instalar automáticamente antes de continuar:

```bash
npm install -g agent-browser
agent-browser install
```

Informar al usuario: `"Instalando agent-browser para testing visual..."`.

**Si la instalación falla** (permisos, red, entorno sin npm global): informar al usuario y **saltar esta fase**. No bloquear el flujo por esto.

### 4.5.2 Abrir la app y tomar snapshot inicial

```bash
agent-browser open http://localhost:PORT
agent-browser snapshot -i --json
```

Analizar el JSON retornado:

| Qué verificar | Cómo detectarlo en el snapshot |
|---------------|-------------------------------|
| Título correcto | Campo `title` o elemento `<h1>` |
| Estructura esperada | Presencia de nav, header, main, footer |
| Errores visibles | Texto "Error", "Cannot read", pantalla en blanco |
| Datos renderizados | Contenido de seed/mock aparece en elementos |
| Hydration mismatch (Next/Nuxt) | Texto de error en el body o consola |

Si hay errores visibles → fix → restart dev server → reintentar snapshot. Max 3 intentos.

### 4.5.3 Verificar cada ruta implementada

Para cada página/ruta que se desarrolló en este sprint:

```bash
agent-browser open http://localhost:PORT/ruta
agent-browser snapshot -i --json
```

Verificar que carga sin errores y muestra el contenido esperado.

### 4.5.4 Interacción con elementos (si aplica)

Si hay formularios, botones o flujos interactivos, verificarlos usando las referencias `@eN` del snapshot:

```bash
# El snapshot retorna refs como @e1, @e2, etc. para cada elemento interactivo
agent-browser click @eN                    # click en botón o link
agent-browser snapshot -i --json           # capturar resultado

# Para formularios:
agent-browser fill @eN "valor de prueba"   # llenar campo
agent-browser click @eN_submit             # enviar
agent-browser snapshot -i --json           # verificar respuesta
```

Verificar que las interacciones producen el resultado esperado (navegación, feedback visual, estado actualizado).

**Nota de seguridad:** Si la app maneja contenido externo (CMS, editor de texto, admin panel con datos de usuarios), usar `--content-boundaries` para prevenir prompt injection desde el contenido:

```bash
agent-browser snapshot -i --json --content-boundaries
```

### 4.5.5 Reportar resultado

Al terminar, comunicar el resultado al usuario:

```
🌐 Testing visual completado — http://localhost:PORT
   Rutas verificadas: [N] páginas
   Interacciones probadas: [formularios/botones si aplica]
   Estado: ✔ Todo correcto
```

Si se encontraron y corrigieron issues: describir qué se encontró y cómo se solucionó.

### Reglas de esta fase

- **No bloquear si agent-browser no está disponible.** Informar y continuar a Fase 5.
- **Max 3 intentos por issue visual.** Si persiste después de 3 fixes, reportar al usuario con el snapshot actual y descripción del problema — no seguir en loop.
- **Solo navegar a localhost.** No seguir links externos durante el testing.
- **No depender del snapshot para lógica de negocio.** Esta fase detecta problemas visuales y de renderizado — la lógica ya fue verificada por curl en Fase 4.

---

## Fase 5: Verificación Final

Después de implementar TODAS las fases, una verificación completa end-to-end.

### Checklist

1. **Build limpio:** Ejecutar build completo desde cero. Exit code 0, sin warnings críticos.
2. **Dev server funcional:** Levantar server, verificar TODAS las rutas (no solo la última fase).
3. **Datos reales:** Las rutas retornan datos (seed/mock), no strings vacíos o "TODO".
4. **Docker (si aplica):** docker-compose up levanta todo, servicios se comunican entre sí.
5. **Variables de entorno:** .env tiene todas las variables de .env.example con valores válidos.
6. **Testing visual (si aplica):** Fase 4.5 completada — todas las rutas verificadas en browser, interacciones probadas, sin errores visuales.

### Reporte final

Cuando todo pase, reporta al usuario:

```
✔ Proyecto [nombre] funcionando correctamente

Stack: [framework] + [DB]
Rutas implementadas: [N] páginas, [M] endpoints
Puerto: localhost:[PORT]

Para levantar:
  [comando de dev]

Para Docker:
  docker-compose up
```

Actualiza GRIMOX_DEV_PLAN.md marcando todas las fases como completadas.

---

## Punteros a Referencias

| Archivo | Cuándo leerlo |
|---------|--------------|
| `references/dev-commands-by-stack.md` | Fase 1 — buscar SOLO el stack detectado |
| `references/dev-phases.md` | Fase 2 — buscar SOLO el tipo de proyecto |
| `references/dev-verification.md` | Fases 4 y 5 — buscar SOLO el stack detectado |
| `references/dev-error-patterns.md` | Fase 4 — SOLO cuando ocurre un error, buscar la categoría |

Lee SOLO la referencia que necesites en el momento. Cargar las 4 de golpe desperdicia contexto.

---

## Notas finales

- Si el usuario especifica funcionalidades concretas ("quiero un CRUD de productos con auth"), implementa exactamente eso — ni más ni menos.
- Si el usuario dice "desarróllalo" sin más detalles en un proyecto recién creado, pregunta qué funcionalidades necesita. No asumas.
- Si el proyecto es muy grande (>30 archivos de código a crear), divide en sprints y verifica después de cada sprint en vez de al final.
- Para proyectos IoT: la verificación es solo compilación. No puedes hacer curl a un microcontrolador.
- Si un error requiere configuración externa (API keys de terceros, DB cloud no accesible), informa al usuario qué necesita configurar y continúa con lo que sí puedes implementar.