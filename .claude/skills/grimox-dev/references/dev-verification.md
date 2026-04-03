# Verificación de Desarrollo por Stack

Cómo verificar que cada tipo de proyecto funciona correctamente. Busca SOLO el stack relevante.

---

## Patrón universal de verificación

Todas las verificaciones siguen este orden:

```
1. Build       → ¿Compila sin errores?
2. Dev server  → ¿Levanta y muestra ready signal?
3. HTTP check  → ¿Responde en localhost:PORT?
4. Routes      → ¿Cada ruta/endpoint responde correctamente?
5. Visual      → ¿La UI se renderiza? (web con UI)
               → Per fase: WebFetch + análisis de HTML
               → End-to-end: agent-browser (Fase 4.5, al final del sprint)
6. Docker      → ¿docker-compose levanta todo? (si aplica)
```

---

## Web Fullstack (Next.js, Nuxt, SvelteKit)

### Verificación básica
```bash
npm run build                    # Exit code 0, sin errores
npm run dev &                    # Levantar en background
sleep 5                          # Esperar startup
curl -s -o /dev/null -w "%{http_code}" http://localhost:PORT  # Esperar 200
```

### Verificación de páginas
Para cada archivo `page.tsx` / `page.vue` / `+page.svelte` en el proyecto:
```bash
# Extraer ruta del path del archivo:
# app/users/page.tsx → /users
# app/users/[id]/page.tsx → /users/1
curl -s -o /dev/null -w "%{http_code}" http://localhost:PORT/RUTA
# Esperar: 200 para páginas públicas, 200 o 302 para protegidas
```

### Verificación de API routes
```bash
# GET endpoints
curl -s -w "\n%{http_code}" http://localhost:PORT/api/RECURSO
# Esperar: 200 + JSON

# POST endpoints
curl -s -X POST -H "Content-Type: application/json" -d '{}' http://localhost:PORT/api/RECURSO
# Esperar: 201 (created) o 400/422 (validation, lo cual confirma que el endpoint existe)
```

### Verificación visual (WebFetch)
```
Usar WebFetch para cargar http://localhost:PORT y verificar:
- <title> no está vacío
- Existe un <nav> o <header>
- Existe un <main> con contenido
- No hay "Error" o "500" en el body
- Los datos de seed aparecen renderizados
```

---

## Web Frontend SPA (React, Vue, Angular, Svelte + Vite)

### Verificación básica
```bash
npm run build                    # Exit code 0 — si build pasa, la SPA funciona
ls dist/index.html               # Debe existir
npm run preview &                # Levantar preview server
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:4173  # Esperar 200
```

### Verificación visual
```
WebFetch http://localhost:PREVIEW_PORT y verificar:
- HTML contiene <div id="root"> o <div id="app">
- Script tags están presentes
- No hay errores JavaScript visibles en el HTML
```

### Angular específico
```bash
npx ng build --configuration production  # Debe compilar sin errores
ls dist/                                  # Debe contener archivos
npx ng test --watch=false                 # Tests deben pasar
```

---

## API / Backend

### FastAPI
```bash
uvicorn main:app --reload &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/docs     # 200 (Swagger)
curl -s http://localhost:8000/health                                     # {"status": "ok"}
curl -s http://localhost:8000/api/v1/RECURSO                            # 200 + JSON array
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"invalid": true}' http://localhost:8000/api/v1/RECURSO           # 422 (validation)
```

### NestJS
```bash
npm run start:dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000            # 200
curl -s http://localhost:3000/api/RECURSO                                # 200 + JSON
```

### Hono / Fastify
```bash
npm run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000            # 200
curl -s http://localhost:3000/api/RECURSO                                # 200 + JSON
```

### Spring Boot
```bash
./mvnw spring-boot:run &         # o ./gradlew bootRun &
sleep 15                          # Spring Boot tarda más en arrancar
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health  # 200
curl -s http://localhost:8080/api/RECURSO                                     # 200 + JSON
```

---

## Mobile

### Expo (React Native)
```bash
npx expo export --platform web    # Build web como verificación
echo $?                           # Exit code 0 = éxito
# Verificación visual: el usuario abre Expo Go en su dispositivo
# o ejecuta en simulador/emulador
```

### Flutter
```bash
flutter build web                 # Build web como verificación
echo $?                           # Exit code 0 = éxito
flutter analyze                   # Sin errores de análisis
flutter test                      # Tests pasan
```

### Flet
```bash
python -m py_compile main.py      # Sintaxis correcta
flet run &                        # Abre ventana
# Verificación visual: el usuario confirma que la app abre
```

---

## Desktop

### Tauri
```bash
npm run build                     # Build frontend
cd src-tauri && cargo check       # Verificar Rust compila
npm run tauri dev &               # Abrir app
sleep 10
curl -s -o /dev/null -w "%{http_code}" http://localhost:1420  # Frontend dev
```

### Electron
```bash
npm run build                     # Build
ls dist/                          # Verificar que existe el ejecutable
npm run dev &                     # Abrir app en modo dev
```

---

## IoT / Embebido

### PlatformIO
```bash
pio run                           # Compilar
echo $?                           # Exit code 0 = éxito
# Si hay tests:
pio test                          # Ejecutar tests unitarios
```

### Arduino
```bash
arduino-cli compile --fqbn BOARD_FQBN .
echo $?                           # Exit code 0 = éxito
```

### MicroPython
```bash
python -m py_compile main.py      # Verificar sintaxis
python -m py_compile boot.py      # Verificar sintaxis
# No hay build — el código se sube directamente al micro
```

---

## Documentación

```bash
npm run build                     # Exit code 0
npm run preview &                 # o npm run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:PORT  # 200
# WebFetch para verificar que el contenido renderiza
```

---

## CLI Tools

```bash
node bin/cli.js --help            # Exit code 0, imprime help
node bin/cli.js COMANDO --args    # Ejecuta sin errores
npm test                          # Tests pasan
```

---

## Docker (verificación transversal)

Si el proyecto tiene docker-compose.yml:

```bash
docker-compose up -d              # Levantar todos los servicios
sleep 10                          # Esperar que arranquen
docker-compose ps                 # Todos "Up" o "running"
curl -s -o /dev/null -w "%{http_code}" http://localhost:PORT  # 200
docker-compose logs --tail=20     # Sin errores en logs
docker-compose down               # Limpiar
```

Errores comunes de Docker:
- Puerto ya en uso → matar procesos locales primero
- Volumen sin permisos → ajustar permisos en docker-compose.yml
- Build falla → Dockerfile incorrecto (verificar base image, COPY paths)
- DB no conecta → el servicio DB no levantó → revisar logs del servicio
