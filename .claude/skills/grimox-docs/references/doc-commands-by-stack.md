# Comandos por Stack

Referencia de comandos install, dev, build, test y deploy para cada stack soportado por Grimox CLI. Buscar por stack ID.

---

## Tabla de contenidos

- [Web Fullstack Integrado](#web-fullstack-integrado)
- [Web Frontend SPA](#web-frontend-spa)
- [API / Backend](#api--backend)
- [Mobile](#mobile)
- [Desktop](#desktop)
- [IoT / Embebido](#iot--embebido)
- [Data / AI](#data--ai)
- [Documentation](#documentation)
- [CLI Tools](#cli-tools)

---

## Web Fullstack Integrado

### nextjs-15

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 |
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Start (prod) | `npm start` |
| Deploy | Vercel: `vercel deploy` / Docker: `docker build -t app . && docker run -p 3000:3000 app` |

### nuxt-4

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 |
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Preview | `npm run preview` |
| Deploy | Vercel/Netlify / Docker / `node .output/server/index.mjs` |

### sveltekit

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 |
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Preview | `npm run preview` |
| Deploy | Vercel/Netlify / adapter-node + Docker |

---

## Web Frontend SPA

### react-vite

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 |
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Preview | `npm run preview` |
| Deploy | `dist/` → Vercel, Netlify, Cloudflare Pages, o cualquier hosting estático |

### vue-vite

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 |
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Preview | `npm run preview` |
| Deploy | `dist/` → hosting estático |

### angular

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18, Angular CLI |
| Instalar | `npm install` |
| Desarrollo | `ng serve` |
| Build | `ng build` |
| Test | `ng test` |
| E2E | `ng e2e` |
| Deploy | `dist/` → hosting estático |

### svelte-vite

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 |
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Preview | `npm run preview` |
| Deploy | `dist/` → hosting estático |

---

## API / Backend

### fastapi

| Acción | Comando |
|--------|---------|
| Requisitos | Python >= 3.10 |
| Instalar | `pip install -r requirements.txt` |
| Desarrollo | `uvicorn main:app --reload` |
| Test | `pytest` |
| Docs (Swagger) | `http://localhost:8000/docs` |
| Docs (ReDoc) | `http://localhost:8000/redoc` |
| Deploy | Docker / Gunicorn: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker` |

### nestjs

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 |
| Instalar | `npm install` |
| Desarrollo | `npm run start:dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Test E2E | `npm run test:e2e` |
| Start (prod) | `npm run start:prod` |
| Deploy | Docker / `node dist/main.js` |

### hono

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 (o Bun, Deno, Cloudflare Workers) |
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Deploy | Cloudflare Workers: `wrangler deploy` / Docker / Node.js |

### fastify

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 |
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` (si TypeScript) |
| Test | `npm test` |
| Start (prod) | `npm start` |
| Deploy | Docker / PM2: `pm2 start src/index.js` |

### springboot

#### Java (Maven)

| Acción | Comando |
|--------|---------|
| Requisitos | Java >= 17, Maven |
| Instalar | `./mvnw clean install` |
| Desarrollo | `./mvnw spring-boot:run` |
| Build | `./mvnw clean package` |
| Test | `./mvnw test` |
| Start (prod) | `java -jar target/app.jar` |
| Deploy | Docker / JAR deploy |

#### Kotlin (Gradle)

| Acción | Comando |
|--------|---------|
| Requisitos | Java >= 17, Kotlin |
| Instalar | `./gradlew build` |
| Desarrollo | `./gradlew bootRun` |
| Build | `./gradlew bootJar` |
| Test | `./gradlew test` |
| Start (prod) | `java -jar build/libs/app.jar` |
| Deploy | Docker / JAR deploy |

---

## Mobile

### expo (React Native)

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18, Expo CLI, iOS Simulator / Android Emulator |
| Instalar | `npm install` |
| Desarrollo | `npx expo start` |
| iOS | `npx expo run:ios` |
| Android | `npx expo run:android` |
| Build (EAS) | `eas build --platform all` |
| Test | `npm test` |
| Deploy | EAS Submit: `eas submit` |

### flutter

| Acción | Comando |
|--------|---------|
| Requisitos | Flutter SDK >= 3.x, Dart |
| Instalar | `flutter pub get` |
| Desarrollo | `flutter run` |
| Build APK | `flutter build apk` |
| Build iOS | `flutter build ios` |
| Build Web | `flutter build web` |
| Test | `flutter test` |
| Analizar | `flutter analyze` |

### flet-mobile

| Acción | Comando |
|--------|---------|
| Requisitos | Python >= 3.10, Flet |
| Instalar | `pip install -r requirements.txt` |
| Desarrollo | `flet run` |
| Build APK | `flet build apk` |
| Build iOS | `flet build ipa` |
| Deploy | Google Play / App Store |

---

## Desktop

### tauri

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18, Rust, sistema de build nativo (ver docs Tauri) |
| Instalar | `npm install` |
| Desarrollo | `npm run tauri dev` |
| Build | `npm run tauri build` |
| Test | `npm test` (frontend) / `cargo test` (Rust) |
| Output | Binarios en `src-tauri/target/release/bundle/` |

### electron

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 |
| Instalar | `npm install` |
| Desarrollo | `npm run dev` o `npm start` |
| Build | `npm run build` / `npm run make` |
| Package | `npm run package` |
| Test | `npm test` |
| Output | Binarios en `out/` o `dist/` |

### flet-desktop

| Acción | Comando |
|--------|---------|
| Requisitos | Python >= 3.10, Flet |
| Instalar | `pip install -r requirements.txt` |
| Desarrollo | `flet run` |
| Build Windows | `flet build windows` |
| Build macOS | `flet build macos` |
| Build Linux | `flet build linux` |

---

## IoT / Embebido

### arduino

| Acción | Comando/Instrucción |
|--------|---------------------|
| Requisitos | Arduino IDE 2.x |
| Abrir | Abrir el archivo `.ino` en Arduino IDE |
| Compilar | Sketch → Verify/Compile (Ctrl+R) |
| Subir | Sketch → Upload (Ctrl+U) |
| Monitor Serial | Tools → Serial Monitor (Ctrl+Shift+M) |
| Seleccionar placa | Tools → Board → seleccionar placa |
| Seleccionar puerto | Tools → Port → seleccionar puerto COM |

### platformio

| Acción | Comando |
|--------|---------|
| Requisitos | PlatformIO Core CLI o VSCode + PlatformIO Extension |
| Instalar dependencias | `pio pkg install` |
| Compilar | `pio run` |
| Subir al dispositivo | `pio run -t upload` |
| Monitor Serial | `pio device monitor` |
| Test | `pio test` |
| Limpiar | `pio run -t clean` |
| Configuración | `platformio.ini` |

### esp-idf

| Acción | Comando |
|--------|---------|
| Requisitos | ESP-IDF >= 5.x |
| Configurar | `idf.py set-target esp32` |
| Menuconfig | `idf.py menuconfig` |
| Compilar | `idf.py build` |
| Flash | `idf.py -p /dev/ttyUSB0 flash` |
| Monitor | `idf.py -p /dev/ttyUSB0 monitor` |
| Flash + Monitor | `idf.py -p /dev/ttyUSB0 flash monitor` |

### micropython

| Acción | Comando/Instrucción |
|--------|---------------------|
| Requisitos | MicroPython firmware en la placa, Thonny o mpremote |
| Instalar firmware | Descargar de micropython.org y flashear con esptool |
| Subir archivos | `mpremote cp main.py :main.py` o arrastar en Thonny |
| REPL | `mpremote connect` o Thonny Shell |
| Ejecutar | `mpremote run script.py` |
| Reset | `mpremote reset` |

---

## Data / AI

### fastapi-ml

| Acción | Comando |
|--------|---------|
| Requisitos | Python >= 3.10 |
| Instalar | `pip install -r requirements.txt` |
| Desarrollo (API) | `uvicorn main:app --reload` |
| Jupyter | `jupyter notebook` o `jupyter lab` |
| Train | `python train.py` (si existe) |
| Test | `pytest` |
| Docs (Swagger) | `http://localhost:8000/docs` |

---

## Documentation

### astro (Starlight)

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 |
| Instalar | `npm install` |
| Desarrollo | `npm run dev` |
| Build | `npm run build` |
| Preview | `npm run preview` |
| Deploy | `dist/` → Vercel, Netlify, Cloudflare Pages |

### docusaurus

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 |
| Instalar | `npm install` |
| Desarrollo | `npm run start` |
| Build | `npm run build` |
| Serve | `npm run serve` |
| Deploy | `build/` → GitHub Pages, Vercel, Netlify |

### vitepress

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 |
| Instalar | `npm install` |
| Desarrollo | `npm run docs:dev` |
| Build | `npm run docs:build` |
| Preview | `npm run docs:preview` |
| Deploy | `.vitepress/dist/` → hosting estático |

---

## CLI Tools

### node-cli

| Acción | Comando |
|--------|---------|
| Requisitos | Node.js >= 18 |
| Instalar | `npm install` |
| Desarrollo | `node bin/{{cli_name}}.js` |
| Link global | `npm link` |
| Test | `npm test` |
| Publicar | `npm publish` |
