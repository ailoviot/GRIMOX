# Comandos de Desarrollo por Stack

Referencia de comandos para cada stack soportado por Grimox. Busca SOLO la sección del stack detectado.

---

## Web Fullstack Integrado

### nextjs-15
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Puerto | 3000 |
| Health | `/` |
| Ready signal | `Ready on` o `✓ Ready` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` |

### nuxt-4
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Puerto | 3000 |
| Health | `/` |
| Ready signal | `Nuxt ready` o `Local:` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` |

### sveltekit
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Puerto | 5173 |
| Health | `/` |
| Ready signal | `Local:` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173` |

---

## Web Frontend (SPA)

### react-vite
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` o `npx vitest run` |
| Puerto | 5173 |
| Health | `/` |
| Ready signal | `Local:` o `ready in` |
| Preview | `npm run preview` (puerto 4173) |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173` |

### vue-vite
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` o `npx vitest run` |
| Puerto | 5173 |
| Health | `/` |
| Ready signal | `Local:` o `ready in` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173` |

### angular
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npx ng serve` o `npm start` |
| Build | `npx ng build` |
| Test | `npx ng test --watch=false` |
| Puerto | 4200 |
| Health | `/` |
| Ready signal | `Compiled successfully` o `Angular Live` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:4200` |

### svelte-vite
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Puerto | 5173 |
| Health | `/` |
| Ready signal | `Local:` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173` |

---

## API / Backend

### fastapi
| Acción | Comando |
|--------|---------|
| Instalar | `pip install -r requirements.txt` |
| Desarrollo | `uvicorn main:app --reload` o `uvicorn app.main:app --reload` |
| Build | N/A (Python interpretado) |
| Test | `pytest` |
| Puerto | 8000 |
| Health | `/docs` (Swagger UI) |
| Ready signal | `Uvicorn running on` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/docs` |

### nestjs
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm run start:dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Puerto | 3000 |
| Health | `/` o `/api` |
| Ready signal | `Nest application successfully started` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` |

### hono
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` (si TypeScript) |
| Test | `npm test` |
| Puerto | 3000 |
| Health | `/` |
| Ready signal | `Listening on` o `Server running` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` |

### fastify
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` (si TypeScript) |
| Test | `npm test` |
| Puerto | 3000 |
| Health | `/` |
| Ready signal | `Server listening` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` |

### springboot
| Acción | Comando |
|--------|---------|
| Instalar (Maven) | `./mvnw dependency:resolve` |
| Instalar (Gradle) | `./gradlew dependencies` |
| Desarrollo (Maven) | `./mvnw spring-boot:run` |
| Desarrollo (Gradle) | `./gradlew bootRun` |
| Build (Maven) | `./mvnw clean package` |
| Build (Gradle) | `./gradlew build` |
| Test (Maven) | `./mvnw test` |
| Test (Gradle) | `./gradlew test` |
| Puerto | 8080 |
| Health | `/actuator/health` o `/swagger-ui` |
| Ready signal | `Started` o `Tomcat started on port` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health` |

---

## Mobile

### expo (React Native)
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npx expo start` |
| Build (web) | `npx expo export --platform web` |
| Build (APK) | `eas build --platform android --profile preview` |
| Test | `npm test` |
| Puerto | 8081 (Metro) |
| Ready signal | `Metro waiting on` |
| Verificar | Build exitoso sin errores |

### flutter
| Acción | Comando |
|--------|---------|
| Instalar | `flutter pub get` |
| Desarrollo | `flutter run` |
| Build (web) | `flutter build web` |
| Build (APK) | `flutter build apk` |
| Test | `flutter test` |
| Ready signal | `Running on` |
| Verificar | Build exitoso sin errores |

### flet-mobile
| Acción | Comando |
|--------|---------|
| Instalar | `pip install -r requirements.txt` |
| Desarrollo | `flet run` |
| Build | `flet build apk` o `flet build ipa` |
| Test | `pytest` |
| Ready signal | `Running on` |
| Verificar | Build exitoso sin errores |

---

## Desktop

### tauri
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm run tauri dev` |
| Build | `npm run tauri build` |
| Test | `npm test` (frontend) + `cargo test` (Rust) |
| Puerto | 1420 (frontend dev) |
| Ready signal | `Running on` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:1420` (frontend) |

### electron
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Ready signal | `Electron app started` |
| Verificar | Build produce ejecutable en `dist/` |

---

## IoT / Embebido

### arduino
| Acción | Comando |
|--------|---------|
| Build | `arduino-cli compile --fqbn esp32:esp32:esp32` |
| Upload | `arduino-cli upload -p COMX --fqbn esp32:esp32:esp32` |
| Verificar | Compilación sin errores |

### platformio
| Acción | Comando |
|--------|---------|
| Instalar | `pio pkg install` |
| Build | `pio run` |
| Upload | `pio run --target upload` |
| Test | `pio test` |
| Verificar | Compilación sin errores |

### esp-idf
| Acción | Comando |
|--------|---------|
| Build | `idf.py build` |
| Flash | `idf.py flash` |
| Monitor | `idf.py monitor` |
| Verificar | Build sin errores |

### micropython
| Acción | Comando |
|--------|---------|
| Verificar sintaxis | `python -m py_compile main.py` |
| Upload | `mpremote cp main.py :main.py` |
| Verificar | Compilación py sin errores |

---

## Data Analytics / IA

### fastapi-ml
| Acción | Comando |
|--------|---------|
| Instalar | `pip install -r requirements.txt` |
| Desarrollo | `uvicorn main:app --reload` |
| Test | `pytest` |
| Jupyter | `jupyter notebook` |
| Puerto | 8000 |
| Health | `/docs` |
| Ready signal | `Uvicorn running on` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/docs` |

---

## Documentación

### astro (Starlight)
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Puerto | 4321 |
| Health | `/` |
| Ready signal | `watching for file changes` o `Local` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321` |

### docusaurus
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm start` |
| Build | `npm run build` |
| Puerto | 3000 |
| Ready signal | `Docusaurus server started` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` |

### vitepress
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Desarrollo | `npm run docs:dev` |
| Build | `npm run docs:build` |
| Puerto | 5173 |
| Ready signal | `Local:` |
| Verificar | `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173` |

---

## Herramienta CLI

### node-cli
| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Test | `npm test` |
| Link | `npm link` |
| Verificar | `node bin/cli.js --help` (exit code 0) |

---

## Proyectos Desacoplados

Para proyectos con `frontend/` + `backend/`:

| Parte | Instalar | Dev | Puerto |
|-------|----------|-----|--------|
| Backend | `cd backend && [install]` | `cd backend && [dev]` | Según stack backend |
| Frontend | `cd frontend && [install]` | `cd frontend && [dev]` | Según stack frontend |

Levantar backend PRIMERO, luego frontend. El frontend necesita que la API esté disponible.
