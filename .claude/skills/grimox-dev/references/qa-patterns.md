# QA Patterns — prompts para Task(grimox-qa) por tipo de feature

Cuando el developer implementa una feature común, usa estos patterns para construir el prompt del sub-agent `grimox-qa`. Cada pattern define `routes` y `flows` esperados.

Formato esperado del Task call:

```
Task({
  subagent_type: 'grimox-qa',
  prompt: <JSON con baseUrl, feature, routes, flows, stackId, attemptNumber>
})
```

---

## Pattern: Auth flow (login + register + protected route)

**Trigger:** se implementó `/login`, `/register`, middleware de sesión, o guards.

```json
{
  "baseUrl": "http://localhost:3000",
  "feature": "Auth flow",
  "routes": ["/login", "/register", "/dashboard"],
  "flows": [
    {
      "name": "register nuevo usuario",
      "steps": [
        "navegar a /register",
        "fill email=qa+001@test.local",
        "fill password=QaTest123!",
        "fill confirmPassword=QaTest123!",
        "click submit",
        "assert redirect a /dashboard o /login con mensaje de verificación",
        "assert sin errores en consola"
      ]
    },
    {
      "name": "login exitoso con usuario existente",
      "steps": [
        "navegar a /login",
        "fill email=<credencial de .env.test>",
        "fill password=<credencial de .env.test>",
        "click submit",
        "assert redirect a /dashboard",
        "assert elemento <nav> o <header> con nombre de usuario visible"
      ]
    },
    {
      "name": "acceso a ruta protegida sin sesión",
      "steps": [
        "limpiar cookies/localStorage",
        "navegar a /dashboard",
        "assert redirect a /login o status 401",
        "assert no se filtra contenido protegido"
      ]
    }
  ]
}
```

---

## Pattern: CRUD (list + create + edit + delete)

**Trigger:** se implementó un recurso CRUD (tareas, productos, usuarios, etc).

```json
{
  "baseUrl": "http://localhost:3000",
  "feature": "CRUD de <recurso>",
  "routes": ["/<recurso>", "/<recurso>/new", "/<recurso>/:id/edit"],
  "flows": [
    {
      "name": "listar recursos (con seed data)",
      "steps": [
        "navegar a /<recurso>",
        "assert tabla o lista contiene al menos 1 elemento del seed",
        "assert headers de columnas esperados",
        "assert sin errores 500 en network"
      ]
    },
    {
      "name": "crear recurso",
      "steps": [
        "click 'Nuevo' o navegar a /<recurso>/new",
        "fill campos requeridos con datos válidos",
        "click submit",
        "assert redirect a /<recurso> o a /<recurso>/:id",
        "assert el nuevo recurso aparece en la lista"
      ]
    },
    {
      "name": "editar recurso",
      "steps": [
        "navegar a /<recurso>",
        "click botón editar del primer elemento",
        "modificar un campo",
        "click submit",
        "assert el cambio persiste al recargar la lista"
      ]
    },
    {
      "name": "borrar recurso (con confirmación)",
      "steps": [
        "navegar a /<recurso>",
        "click botón borrar del primer elemento",
        "assert modal/dialog de confirmación aparece VISIBLE",
        "click 'Confirmar'",
        "assert el recurso desaparece de la lista"
      ]
    }
  ]
}
```

---

## Pattern: Form submit con validación

**Trigger:** formulario con validación client-side + server-side.

```json
{
  "baseUrl": "http://localhost:3000",
  "feature": "Form <nombre>",
  "routes": ["/<ruta-del-form>"],
  "flows": [
    {
      "name": "submit con datos válidos",
      "steps": [
        "navegar a /<ruta>",
        "fill todos los campos requeridos correctamente",
        "click submit",
        "assert mensaje de éxito o redirect esperado",
        "assert no hay errores en consola"
      ]
    },
    {
      "name": "validación de campos requeridos",
      "steps": [
        "navegar a /<ruta>",
        "dejar campos vacíos",
        "click submit",
        "assert mensajes de error aparecen junto a los campos",
        "assert no se hace request al servidor (network vacío)"
      ]
    },
    {
      "name": "validación de formato (email, etc)",
      "steps": [
        "navegar a /<ruta>",
        "fill email=texto-no-email",
        "click submit o blur del campo",
        "assert mensaje de error de formato visible"
      ]
    }
  ]
}
```

---

## Pattern: Navigation (menús, breadcrumbs, links internos)

**Trigger:** se implementó nav principal, sidebar, breadcrumbs.

```json
{
  "baseUrl": "http://localhost:3000",
  "feature": "Navigation",
  "routes": ["/"],
  "flows": [
    {
      "name": "navegar por menú principal",
      "steps": [
        "navegar a /",
        "para cada link del <nav>: click y assert URL correcta + página carga 200",
        "assert link activo tiene clase/estilo distinto"
      ]
    },
    {
      "name": "responsive mobile (<768px)",
      "steps": [
        "cambiar viewport a 375x812",
        "assert menú hamburguesa aparece",
        "click hamburguesa",
        "assert menú desplegable visible con todos los links"
      ]
    }
  ]
}
```

---

## Pattern: Docs site (astro/docusaurus/vitepress)

**Trigger:** stack es `astro`, `docusaurus` o `vitepress`.

```json
{
  "baseUrl": "http://localhost:4321",
  "feature": "Docs site",
  "routes": ["/", "/<primera sección>", "/<segunda sección>"],
  "flows": [
    {
      "name": "sidebar navigation",
      "steps": [
        "navegar a /",
        "click en primer item del sidebar",
        "assert URL cambia y contenido carga",
        "assert el item queda activo (highlight)"
      ]
    },
    {
      "name": "search (si existe)",
      "steps": [
        "abrir search (Ctrl+K o click en input)",
        "typear query de prueba",
        "assert resultados aparecen"
      ]
    }
  ]
}
```

---

## Pattern: API puro (sin UI)

**Trigger:** stack es `fastapi`, `nestjs`, `hono`, `fastify`, `springboot`.

NO invocar grimox-qa. El developer verifica con curl directo:

```bash
curl -s http://localhost:<PORT>/docs     # Swagger si aplica
curl -s http://localhost:<PORT>/<endpoint> -X POST -H "Content-Type: application/json" -d '{...}'
```

grimox-qa retorna `{ pass: true, summary: 'QA visual no aplica' }` si se invoca con un stack API puro.

---

## Reglas al usar estos patterns

1. **Adaptar `<placeholders>` al contexto real** — reemplazar `/<recurso>` por `/tasks`, `/<ruta>` por la ruta real.
2. **Credenciales** — para auth flows, leer `.env.test` o `.ai/test-credentials.md`. Si no existe, el developer debe crear seed user primero.
3. **Datos de prueba** — usar prefijo `qa+` en emails (`qa+001@test.local`) para poder limpiar después.
4. **attemptNumber** — en re-intentos tras fix, pasar `attemptNumber: 2` o `3`. El QA sabe que debe validar el fix exacto.
5. **Combinaciones** — una feature puede requerir combinación (ej: "CRUD de tareas con auth" → pattern CRUD + pattern Auth para proteger las rutas).
