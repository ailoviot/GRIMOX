# Guía de Migración — Otros Paths

Referencia para migraciones menos comunes: jQuery/PHP a frameworks modernos, desktop, mobile e IoT.

---

## jQuery / PHP Legacy → Next.js 15

Esta es una de las migraciones más radicales — cambias de paradigma completo (DOM imperativo → componentes declarativos, server-rendered PHP → React SSR).

### Estrategia general

No intentes convertir jQuery a React línea por línea. En su lugar:

1. **Inventaria las páginas** del sitio PHP — cada archivo .php es una "página"
2. **Mapea cada página** a una ruta en Next.js App Router
3. **Identifica los componentes repetidos** (headers, footers, navbars, cards, forms)
4. **Extrae la lógica de datos** — queries SQL, sesiones, validaciones
5. **Reescribe componente por componente**, empezando por los más simples

### Mapeo de conceptos

| jQuery / PHP | Next.js 15 |
|-------------|------------|
| `index.php` | `app/page.tsx` |
| `usuarios.php` | `app/usuarios/page.tsx` |
| `usuario.php?id=5` | `app/usuarios/[id]/page.tsx` |
| `$_SESSION['user']` | Supabase Auth / NextAuth.js |
| `$_POST['name']` | Server Action con `formData.get('name')` |
| `mysqli_query($conn, $sql)` | Supabase SDK / Prisma / Drizzle |
| `include('header.php')` | `<Header />` component |
| `$.ajax({ url: '/api/data' })` | `fetch()` o Server Action |
| `$('.btn').click(fn)` | `onClick={fn}` en JSX |
| `$('#modal').show()` | Estado con `useState` + render condicional |
| `echo json_encode($data)` | API Route que retorna `NextResponse.json(data)` |

### Patrón: jQuery event handler → React
```javascript
// ANTES (jQuery)
$('#delete-btn').click(function() {
  if (confirm('¿Seguro?')) {
    $.ajax({
      url: '/api/delete.php',
      method: 'POST',
      data: { id: $(this).data('id') },
      success: function() { location.reload(); }
    });
  }
});

// DESPUÉS (React + Server Action)
'use server';
async function deleteItem(formData) {
  const id = formData.get('id');
  await db.items.delete({ where: { id } });
  revalidatePath('/items');
}

// En el componente:
function DeleteButton({ id }) {
  return (
    <form action={deleteItem}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" onClick={(e) => {
        if (!confirm('¿Seguro?')) e.preventDefault();
      }}>Eliminar</button>
    </form>
  );
}
```

### Patrón: PHP template → React component
```php
<!-- ANTES (PHP) -->
<?php foreach ($users as $user): ?>
  <div class="card">
    <h3><?= htmlspecialchars($user['name']) ?></h3>
    <p><?= htmlspecialchars($user['email']) ?></p>
    <?php if ($user['role'] === 'admin'): ?>
      <span class="badge">Admin</span>
    <?php endif; ?>
  </div>
<?php endforeach; ?>
```

```jsx
// DESPUÉS (React/Next.js)
function UserList({ users }) {
  return users.map(user => (
    <div key={user.id} className="card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {user.role === 'admin' && <span className="badge">Admin</span>}
    </div>
  ));
}
```

### Pitfalls
- **Estado global con jQuery**: jQuery manipula el DOM directamente. En React, el DOM es un reflejo del estado. Identifica qué "estado" existía en jQuery (variables globales, data attributes, clases CSS) y conviértelo a useState/useContext.
- **SQL directo**: PHP suele tener queries SQL inline. Nunca migrar SQL crudo a Next.js — usar un ORM (Prisma, Drizzle) o Supabase SDK.
- **Sesiones PHP**: `$_SESSION` no existe en Next.js. Migrar a cookies + JWT o un auth provider.
- **Bootstrap**: Si el sitio PHP usa Bootstrap, puedes mantenerlo temporalmente mientras migras a Tailwind CSS.

---

## Electron → Tauri

Migración de desktop apps de Electron (Chromium + Node.js) a Tauri (webview nativo + Rust backend).

### Cambios clave

| Aspecto | Electron | Tauri |
|---------|----------|-------|
| Backend runtime | Node.js | Rust |
| Webview | Chromium bundled (~100MB) | System webview (~5MB) |
| IPC | `ipcMain` / `ipcRenderer` | `invoke()` + Rust commands |
| File system | Node.js `fs` | Tauri `fs` plugin |
| Auto-update | electron-updater | tauri-plugin-updater |
| Bundle size | 100-200MB | 5-30MB |

### Patrón: IPC
```javascript
// ANTES (Electron)
// main.js
ipcMain.handle('read-file', async (event, path) => {
  return fs.readFileSync(path, 'utf-8');
});

// renderer.js
const content = await ipcRenderer.invoke('read-file', '/path/to/file');

// DESPUÉS (Tauri)
// src-tauri/src/main.rs
#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|e| e.to_string())
}

// frontend (JS)
import { invoke } from '@tauri-apps/api/core';
const content = await invoke('read_file', { path: '/path/to/file' });
```

### Estrategia
1. El frontend (React/Vue/etc.) se mantiene casi igual — solo cambias las llamadas IPC
2. Toda la lógica de Node.js (main process) se reescribe en Rust
3. Si no sabes Rust, muchas operaciones básicas (fs, http, shell) tienen plugins Tauri oficiales

### Pitfalls
- **Rust**: Si el equipo no conoce Rust, evaluar si los plugins de Tauri cubren las necesidades antes de migrar. Para apps simples (webview + filesystem), los plugins bastan.
- **Node.js packages**: Cualquier package de npm que se usaba en el main process (no renderer) necesita equivalente en Rust o plugin.
- **Webview differences**: El system webview varía por OS. Testear en Windows, Mac y Linux.

---

## React Native — Upgrade de Expo SDK

Expo se actualiza frecuentemente. Los upgrades suelen ser seguros pero tienen breaking changes.

### Proceso general

```bash
# 1. Actualizar Expo CLI
npx expo install expo@latest

# 2. Usar la herramienta de upgrade
npx expo install --fix

# 3. Revisar el changelog de la versión
# https://docs.expo.dev/changelog/

# 4. Testear en simulador y dispositivo físico
npx expo start --clear
```

### Cambios comunes entre SDKs

| Cambio | SDK afectado | Solución |
|--------|-------------|----------|
| Expo Router reemplaza React Navigation | SDK 49+ | Migrar screens a file-based routing |
| EAS Build reemplaza `expo build` | SDK 46+ | Configurar eas.json |
| New Architecture (Fabric) | SDK 51+ | Revisar native modules compatibles |

### Pitfalls
- **Native modules**: Si el proyecto usa native modules custom, verificar compatibilidad con el nuevo SDK antes de actualizar.
- **Expo Go limitations**: Expo Go no soporta todos los módulos. Si usas modules que requieren custom dev client, configurar EAS Build.

---

## IoT — Arduino → PlatformIO

PlatformIO ofrece un entorno más profesional que Arduino IDE, con mejor gestión de librerías y testing.

### Cambios clave

| Aspecto | Arduino IDE | PlatformIO |
|---------|------------|------------|
| Estructura | `.ino` en carpeta flat | `src/main.cpp` + `platformio.ini` |
| Librerías | Arduino Library Manager | `lib_deps` en platformio.ini |
| Tests | No hay soporte | Unity framework built-in |
| Config | GUI | `platformio.ini` (text) |
| Multi-board | Un sketch, una placa | Multi-environment |

### Patrón: Migrar sketch
```cpp
// ANTES: lampara-aurora/lampara-aurora.ino
#include <WiFi.h>
#include <FastLED.h>

void setup() {
  Serial.begin(115200);
  // ...
}

void loop() {
  // ...
}

// DESPUÉS: src/main.cpp (exactamente el mismo código)
#include <Arduino.h>   // <-- Agregar este include
#include <WiFi.h>
#include <FastLED.h>

void setup() {
  Serial.begin(115200);
}

void loop() {
  // ...
}
```

### platformio.ini
```ini
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200
lib_deps =
    fastled/FastLED@^3.6.0
```

### Pasos
1. Crear `platformio.ini` con la configuración de la placa
2. Mover `.ino` → `src/main.cpp`
3. Agregar `#include <Arduino.h>` al inicio
4. Mover librerías locales a `lib/`
5. Mover headers a `include/`
6. Agregar `lib_deps` en `platformio.ini` para librerías de terceros

### Pitfalls
- **Multiple .ino files**: Arduino IDE concatena todos los .ino en uno. PlatformIO no — debes incluir headers explícitamente.
- **Arduino.h**: En Arduino IDE es implícito. En PlatformIO debes incluirlo manualmente.
- **Function declarations**: Arduino IDE auto-genera forward declarations. En PlatformIO debes declararlas tú si defines funciones después de usarlas.

---

## MicroPython — Migración entre placas

### ESP8266 → ESP32
- Más memoria, más GPIO, Bluetooth, WiFi mejorado
- La mayoría del código MicroPython es compatible directamente
- Cambios: nombres de pines, módulo `machine` tiene más opciones
- Si usa `esp` module, revisar diferencias ESP8266 vs ESP32

### Raspberry Pi Pico → ESP32
- WiFi no es built-in en Pico W (sí en ESP32)
- Módulo `network` tiene diferencias
- ADC resolution: Pico = 12-bit, ESP32 = 12-bit (pero diferentes rangos)
- Pico usa PIO (Programmable I/O) que no existe en ESP32
