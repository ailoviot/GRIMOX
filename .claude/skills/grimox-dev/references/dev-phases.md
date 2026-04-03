# Fases de Desarrollo por Tipo de Proyecto

Template de fases para generar GRIMOX_DEV_PLAN.md. Busca SOLO el tipo de proyecto detectado.

---

## api-backend

### Fase 1: Base de datos y modelos
- [ ] Verificar conexión a DB (leer .env, probar conexión)
- [ ] Crear schema/migraciones (tablas principales)
- [ ] Crear modelos/entities con relaciones
- [ ] Crear DTOs/schemas de validación (Pydantic, class-validator, Zod)
- [ ] Crear datos de seed (datos iniciales para testing)
- [ ] Verificar: ejecutar migraciones, seed sin errores

### Fase 2: Rutas y controladores
- [ ] Crear health endpoint (`GET /health` o `GET /api/health`)
- [ ] Implementar CRUD completo para cada recurso principal
- [ ] Agregar validación de inputs en cada endpoint
- [ ] Agregar manejo de errores estructurado (no stack traces en producción)
- [ ] Verificar: curl cada endpoint, status codes correctos

### Fase 3: Middleware y servicios
- [ ] Configurar CORS (si no está)
- [ ] Agregar logging (morgan, logger, etc.)
- [ ] Implementar lógica de negocio en servicios (separar de controllers)
- [ ] Agregar rate limiting si aplica
- [ ] Verificar: build exitoso, endpoints siguen funcionando

### Fase 4: Autenticación
- [ ] Implementar registro de usuario
- [ ] Implementar login (JWT / session)
- [ ] Proteger rutas que lo requieran
- [ ] Verificar: login retorna token, rutas protegidas rechazan sin token

### Fase 5: Tests
- [ ] Tests unitarios para servicios/lógica de negocio
- [ ] Tests de integración para endpoints (al menos happy path)
- [ ] Verificar: `npm test` / `pytest` pasa

---

## web-fullstack-integrated

### Fase 1: Base de datos y modelos
- [ ] Configurar conexión a DB (Supabase SDK, Prisma, Drizzle)
- [ ] Crear schema de tablas
- [ ] Ejecutar migraciones
- [ ] Crear datos de seed
- [ ] Verificar: conexión exitosa, datos accesibles

### Fase 2: API routes / Server Actions
- [ ] Crear endpoints de API o Server Actions para cada recurso
- [ ] Implementar CRUD completo
- [ ] Agregar validación (Zod, Pydantic)
- [ ] Verificar: curl a cada API route retorna datos

### Fase 3: Layout y navegación
- [ ] Crear layout principal (header, nav, footer, sidebar si aplica)
- [ ] Configurar navegación/routing (links entre páginas)
- [ ] Implementar dark mode toggle (si Tailwind + dark mode configurado)
- [ ] Verificar: build exitoso, layout renderiza sin errores

### Fase 4: Páginas y componentes
- [ ] Implementar cada página definida en los requerimientos
- [ ] Crear componentes reutilizables (cards, tables, forms, modals)
- [ ] Conectar páginas con datos reales (Server Components, useFetch, etc.)
- [ ] Verificar: cada página renderiza con datos, formularios funcionan

### Fase 5: Estado y autenticación
- [ ] Implementar auth (Supabase Auth, NextAuth, etc.)
- [ ] Proteger páginas que lo requieran (middleware, guards)
- [ ] Implementar estado global si es necesario (Zustand, Pinia, etc.)
- [ ] Verificar: login funciona, páginas protegidas redirigen sin auth

### Fase 6: Polish
- [ ] Loading states (skeletons, spinners)
- [ ] Error boundaries / error pages
- [ ] SEO metadata (title, description por página)
- [ ] Responsive design (verificar mobile)
- [ ] Verificar: build production exitoso

---

## web-frontend

### Fase 1: Layout y routing
- [ ] Crear layout principal (header, nav, footer)
- [ ] Configurar router con todas las rutas planeadas
- [ ] Verificar: navegación funciona entre todas las rutas

### Fase 2: Páginas estáticas
- [ ] Crear cada página con contenido estático (placeholder real, no lorem ipsum vacío)
- [ ] Verificar: todas las páginas renderizan sin errores

### Fase 3: Componentes
- [ ] Crear componentes reutilizables (buttons, inputs, cards, modals)
- [ ] Integrar component library (shadcn/ui, PrimeVue, Angular Material)
- [ ] Verificar: componentes renderizan correctamente

### Fase 4: Estado e integración
- [ ] Configurar state management (si aplica)
- [ ] Conectar con API externa o Supabase/Firebase
- [ ] Implementar formularios con validación
- [ ] Verificar: datos fluyen correctamente, formularios envían

### Fase 5: Auth y polish
- [ ] Implementar auth (si hay DB configurada)
- [ ] Guards de ruta para páginas protegidas
- [ ] Loading states, error handling
- [ ] Verificar: build production exitoso

---

## web-fullstack-decoupled

### Fase 1-4: Backend (seguir template api-backend)
Implementar backend COMPLETO antes de tocar frontend.

### Fase 5-8: Frontend (seguir template web-frontend)
El frontend consume la API del backend — usar las URLs reales, no mocks.

### Fase 9: Integración
- [ ] Verificar que frontend comunica con backend correctamente
- [ ] Verificar proxy config (vite proxy o nginx)
- [ ] docker-compose levanta ambos servicios
- [ ] Verificar: flujo completo end-to-end funciona

---

## mobile

### Fase 1: Navegación
- [ ] Configurar navegación (tabs, stack, drawer)
- [ ] Crear screens vacíos para cada ruta
- [ ] Verificar: build exitoso, navegación funciona

### Fase 2: Screens principales
- [ ] Implementar UI de cada screen con datos estáticos
- [ ] Crear componentes reutilizables (cards, lists, inputs)
- [ ] Verificar: todas las screens renderizan

### Fase 3: Estado y datos
- [ ] Conectar con API/Backend (fetch, Supabase SDK, Firebase)
- [ ] Implementar estado local y global
- [ ] Verificar: datos se cargan y muestran correctamente

### Fase 4: Auth y funcionalidad
- [ ] Implementar login/registro
- [ ] Proteger screens que lo requieran
- [ ] Implementar funcionalidades específicas (cámara, GPS, push, etc.)
- [ ] Verificar: build production exitoso

---

## desktop

### Fase 1: Ventana y UI base
- [ ] Configurar ventana principal (tamaño, título, menú)
- [ ] Crear layout principal
- [ ] Verificar: app abre sin crashes

### Fase 2: Funcionalidad core
- [ ] Implementar UI principal con componentes
- [ ] Implementar comandos del backend (IPC en Tauri/Electron, system en Flet)
- [ ] Verificar: interacciones usuario funcionan

### Fase 3: Integración sistema
- [ ] File system access (si aplica)
- [ ] Database local (si aplica)
- [ ] Verificar: build produce ejecutable funcional

---

## iot-embedded

### Fase 1: Configuración de hardware
- [ ] Definir pines y constantes en config.h
- [ ] Inicializar Serial para debug
- [ ] Verificar: compila sin errores

### Fase 2: Sensores y actuadores
- [ ] Inicializar sensores en setup()
- [ ] Leer sensores en loop()
- [ ] Controlar actuadores (LEDs, relays, motores)
- [ ] Verificar: compila, lectura Serial muestra datos

### Fase 3: Comunicación
- [ ] WiFi connection (si ESP32/ESP8266)
- [ ] Enviar datos a servidor/cloud (HTTP, MQTT)
- [ ] Verificar: compila sin errores

---

## data-ai

### Fase 1: Datos y pipeline
- [ ] Crear estructura de carpetas (data/raw, data/processed, models/)
- [ ] Script de carga de datos
- [ ] Notebook de exploración (EDA)
- [ ] Verificar: datos se cargan correctamente

### Fase 2: API de predicción
- [ ] Endpoints de FastAPI para inferencia
- [ ] Modelo de ML entrenado o placeholder
- [ ] Schemas Pydantic para input/output
- [ ] Verificar: POST a /predict retorna resultado

---

## documentation

### Fase 1: Configuración
- [ ] Configurar sidebar/navegación
- [ ] Configurar tema (colores, logo, footer)
- [ ] Verificar: build exitoso, homepage renderiza

### Fase 2: Contenido
- [ ] Crear páginas de documentación (Getting Started, API, Guides)
- [ ] Agregar code blocks, tablas, diagramas
- [ ] Verificar: todas las páginas accesibles desde nav

---

## cli-tools

### Fase 1: Comandos
- [ ] Definir comandos con Commander.js
- [ ] Implementar handler para cada comando
- [ ] Verificar: `node bin/cli.js --help` muestra todos los comandos

### Fase 2: Lógica
- [ ] Implementar lógica de cada comando
- [ ] Agregar validación de argumentos
- [ ] Agregar output con colores (picocolors)
- [ ] Verificar: cada comando ejecuta correctamente

### Fase 3: Tests
- [ ] Tests para cada comando
- [ ] Verificar: `npm test` pasa
