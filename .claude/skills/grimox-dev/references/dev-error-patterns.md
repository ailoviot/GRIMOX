# Patrones de Error y Soluciones

Cuando un error ocurre en el ciclo Build→Test→Fix, busca aquí la categoría del error para encontrar la causa raíz y el fix. No leas todo el archivo — busca SOLO la categoría relevante.

---

## Errores de Módulos e Imports

### "Cannot find module 'X'" / "Module not found"
**Causa:** Dependencia no instalada o path de import incorrecto.
**Fix:**
1. Verificar si `X` está en package.json/requirements.txt
2. Si no está → `npm install X` o `pip install X`
3. Si sí está → verificar el path del import (typo, extensión faltante, alias no configurado)
4. Si es un path relativo → verificar que el archivo destino existe

### "SyntaxError: Cannot use import statement outside a module"
**Causa:** Archivo CommonJS intentando usar `import`.
**Fix:** Agregar `"type": "module"` en package.json, o cambiar `import` por `require`.

### "ERR_REQUIRE_ESM" / "require() of ES Module"
**Causa:** Archivo CJS haciendo `require()` de un paquete que solo exporta ESM.
**Fix:** Cambiar a `import()` dinámico o migrar el archivo a ESM.

### "The requested module does not provide an export named 'X'"
**Causa:** Named import incorrecto.
**Fix:** Verificar qué exporta el módulo. Puede ser default export: `import X from '...'` en vez de `import { X } from '...'`.

---

## Errores de TypeScript

### "Type 'X' is not assignable to type 'Y'"
**Causa:** Tipos incompatibles.
**Fix:** Verificar la interface/type esperada. Agregar conversión, extender la interface, o corregir el dato.

### "Property 'X' does not exist on type 'Y'"
**Causa:** Accediendo a propiedad no declarada.
**Fix:** Agregar la propiedad a la interface/type, o usar optional chaining (`?.`).

### "Cannot find name 'X'"
**Causa:** Variable/tipo no importado.
**Fix:** Agregar import del tipo/variable. Si es global (como `React`), verificar tsconfig `jsx` setting.

### "Argument of type 'X' is not assignable to parameter of type 'Y'"
**Causa:** Función recibe tipo incorrecto.
**Fix:** Verificar firma de la función, adaptar el argumento o agregar type assertion.

---

## Errores de Base de Datos

### "ECONNREFUSED" / "Connection refused" (DB)
**Causa:** Servicio de DB no está corriendo.
**Fix:**
1. Si usa Docker: `docker-compose up -d db` (o el nombre del servicio)
2. Si es local: verificar que PostgreSQL/MongoDB/etc. está corriendo
3. Verificar `.env` → `DATABASE_URL` apunta al host correcto (localhost vs container name)

### "relation 'X' does not exist" / "Table X doesn't exist"
**Causa:** Migraciones no ejecutadas.
**Fix:** Ejecutar migraciones: `npx prisma migrate dev`, `alembic upgrade head`, `npx drizzle-kit push`

### "password authentication failed"
**Causa:** Credenciales incorrectas en .env.
**Fix:** Verificar `DATABASE_URL` en `.env` — usuario, password, nombre de DB.

### "SQLITE_CANTOPEN"
**Causa:** Path del archivo SQLite incorrecto o permisos.
**Fix:** Verificar que el directorio existe. Crear con `mkdir -p` si no.

---

## Errores de Puertos

### "EADDRINUSE" / "Address already in use"
**Causa:** El puerto ya está ocupado por otro proceso.
**Fix:**
```bash
# Windows
netstat -ano | findstr :PORT
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:PORT | xargs kill -9
```

### "EACCES" en puertos < 1024
**Causa:** Puertos bajos requieren privilegios root.
**Fix:** Usar puerto > 1024 (3000, 8000, 8080).

---

## Errores de Framework Específicos

### Next.js: "Error: Hydration failed"
**Causa:** El HTML del servidor no coincide con el del cliente. Común con fechas, Math.random(), o acceso a `window`.
**Fix:** Envolver código que usa APIs del browser en `'use client'` + `useEffect`, o usar `suppressHydrationWarning`.

### Next.js: "Error: Event handlers cannot be passed to Client Component props"
**Causa:** Pasando `onClick` a un Server Component.
**Fix:** Agregar `'use client'` al componente que usa el event handler.

### Nuxt: "500 - [nuxt] A composable that requires access to the Nuxt instance was called outside of a plugin"
**Causa:** Usando composable fuera de setup context.
**Fix:** Mover la llamada dentro de `<script setup>` o dentro de un lifecycle hook.

### Angular: "NullInjectorError: No provider for X"
**Causa:** Servicio no registrado en providers.
**Fix:** Agregar `@Injectable({ providedIn: 'root' })` o incluir en `providers` del componente/módulo.

### FastAPI: "pydantic_core._pydantic_core.ValidationError"
**Causa:** Request body no cumple el schema Pydantic.
**Fix:** Verificar que el body enviado tiene todos los campos required con tipos correctos.

### NestJS: "Nest can't resolve dependencies of X"
**Causa:** Dependencia no importada en el módulo correcto.
**Fix:** Agregar el servicio/módulo en `imports` o `providers` del módulo que lo necesita.

### Spring Boot: "BeanCreationException"
**Causa:** Spring no puede crear un bean — falta dependencia, configuración incorrecta.
**Fix:** Verificar `@Autowired` fields, revisar que el bean existe y está en el component scan.

### Flutter: "RenderFlex overflowed"
**Causa:** Widget excede el espacio disponible.
**Fix:** Envolver en `SingleChildScrollView`, `Expanded`, o `Flexible`.

### Expo: "Error: Unable to resolve module"
**Causa:** Módulo no instalado o cache corrupto.
**Fix:** `npm install`, luego `npx expo start --clear`.

---

## Errores de Build / Compilación

### "SyntaxError: Unexpected token"
**Causa:** Sintaxis inválida — falta cierre de `}`, `)`, string sin cerrar, etc.
**Fix:** Ir al archivo y línea indicada en el error. Buscar el token inesperado y corregir la sintaxis.

### "ReferenceError: X is not defined"
**Causa:** Variable usada antes de ser declarada o importada.
**Fix:** Importar o declarar la variable antes de usarla.

### "JSX element 'X' has no corresponding closing tag"
**Causa:** Tag JSX no cerrado.
**Fix:** Agregar el cierre `</X>` o usar self-closing `<X />`.

---

## Errores de Environment / Config

### "Environment variable X is not set"
**Causa:** .env no tiene la variable requerida.
**Fix:** Copiar de `.env.example` si existe, o agregar la variable con un valor válido.

### "Invalid configuration" / "Configuration error"
**Causa:** Archivo de config (tsconfig, vite.config, next.config) tiene error de sintaxis o propiedad inválida.
**Fix:** Verificar JSON/JS syntax del archivo de config. Comparar con la documentación oficial del framework.

---

## Errores de Docker

### "Cannot connect to the Docker daemon"
**Causa:** Docker Desktop no está corriendo.
**Fix:** Iniciar Docker Desktop. Esperar a que esté listo. Reintentar.

### "port is already allocated"
**Causa:** Otro container o proceso local usa el mismo puerto.
**Fix:** Detener el proceso/container que usa el puerto, o cambiar el port mapping en docker-compose.yml.

### "COPY failed: file not found"
**Causa:** Dockerfile intenta copiar un archivo que no existe en el build context.
**Fix:** Verificar paths en COPY. El contexto es la raíz del proyecto (donde está docker-compose.yml).

### "npm ERR! Could not resolve dependency" (en Docker build)
**Causa:** Cache de npm corrupto o lockfile inconsistente.
**Fix:** Agregar `RUN npm ci` en vez de `npm install` en el Dockerfile. Asegurar que package-lock.json está actualizado.

---

## Regla general para errores desconocidos

Si el error no está en esta lista:
1. Lee el mensaje completo (no solo la primera línea)
2. Busca el nombre del error + el framework en tu conocimiento
3. El stack trace apunta al archivo y línea — léelo
4. Si es un error de un paquete de terceros, verifica la versión y compatibilidad
5. Si después de 3 intentos no lo resuelves, reporta al usuario con: error completo, archivo afectado, y lo que intentaste
