# Plantilla — MIGRATION_PLAN.md

Usa esta plantilla exacta al generar el plan de migración. Reemplaza los placeholders `{{...}}` con datos reales del análisis.

---

```markdown
# Plan de Migración — {{nombre_proyecto}}

> Generado por Grimox Migration Architect
> Fecha: {{fecha}}
> Modelo IA: {{modelo_llm}}

## Resumen

| Aspecto | Valor |
|---------|-------|
| **Estructura** | {{monolítico / desacoplado}} |
| **Stack origen** | {{framework}} {{version}} ({{lenguaje}}) |
| **Stack destino** | {{framework_destino}} |
| **Base de datos** | {{db_origen}} → {{db_destino}} |
| **Complejidad total** | {{baja / media / alta / crítica}} |
| **Archivos a migrar** | {{N}} archivos |
| **Fases** | 10 |

---

## Problemas Detectados

{{Para cada problema encontrado durante el análisis:}}

- ⚠ {{descripción del problema y por qué importa}}

---

## Inventario de Archivos

| Archivo actual | Acción | Complejidad | Archivo destino | Notas |
|---------------|--------|-------------|-----------------|-------|
| {{ruta/archivo.ext}} | {{CONVERTIR / REESCRIBIR / ELIMINAR / MANTENER / ADAPTAR}} | {{1-5}} | {{ruta/destino.ext}} | {{nota breve}} |

Leyenda de acciones:
- **CONVERTIR**: Transformación mecánica con reglas claras (ej: CJS→ESM, rename imports)
- **REESCRIBIR**: Lógica similar pero código nuevo (ej: class component→functional)
- **ELIMINAR**: No necesario en el stack destino (ej: webpack.config al migrar a Vite)
- **MANTENER**: Funciona igual sin cambios (ej: utilidades puras, assets)
- **ADAPTAR**: Cambios menores (ej: ajustar imports, actualizar API calls)

---

## Fase 1: Infraestructura

Configuración base del proyecto. Todo lo demás depende de esto.

### Paso 1.1: {{descripción}}

**Qué hacer:**
{{Explicación clara de la transformación}}

**Comando:**
```bash
{{comando exacto}}
```

**Patrón de transformación:**
```{{lenguaje}}
// ANTES
{{código actual}}

// DESPUÉS
{{código migrado}}
```

**Verificación:**
```bash
{{comando para verificar}}
```

**Rollback:**
{{cómo deshacer si falla}}

**Pitfalls:**
- {{error común y su solución}}

---

## Fase 2: Tipos y Modelos Compartidos

Interfaces, DTOs, schemas que usan múltiples partes del proyecto.

{{Misma estructura de pasos que Fase 1}}

---

## Fase 3: Base de Datos

ORM, schemas, migraciones, connection strings.

{{Pasos detallados}}

### Mapeo de Schema

| Tabla/Colección actual | Tabla/Colección destino | Cambios |
|-----------------------|------------------------|---------|
| {{nombre}} | {{nombre_nuevo}} | {{qué cambia}} |

---

## Fase 4: Lógica de Negocio Core

Servicios, utilidades, helpers que no dependen del framework.

{{Pasos detallados}}

---

## Fase 5: Rutas API / Endpoints

La capa que conecta la lógica con el mundo exterior.

### Mapeo de Endpoints

| Método | Ruta actual | Ruta destino | Cambios |
|--------|------------|-------------|---------|
| {{GET/POST/...}} | {{/api/users}} | {{/api/users}} | {{descripción}} |

{{Pasos detallados}}

---

## Fase 6: Componentes UI

Migrar de hojas a raíz: primero botones/inputs, luego cards/forms, luego páginas.

{{Pasos detallados}}

---

## Fase 7: Estado (State Management)

{{Si aplica: migración de Redux→Zustand, Vuex→Pinia, etc.}}

{{Pasos detallados}}

---

## Fase 8: Autenticación

Guards, middleware, providers de auth.

{{Pasos detallados}}

---

## Fase 9: Testing

Adaptar tests al nuevo stack.

{{Pasos detallados}}

---

## Fase 10: CI/CD, Docker, Variables de Entorno y Limpieza

### Variables de Entorno

| Variable actual | Variable destino | Notas |
|----------------|-----------------|-------|
| {{REACT_APP_API_URL}} | {{VITE_API_URL}} | {{cambio de prefijo}} |

### Docker

{{Pasos para actualizar Dockerfile y docker-compose.yml}}

### CI/CD

{{Pasos para actualizar GitHub Actions u otro CI}}

### Limpieza Final

- [ ] Eliminar archivos del stack anterior que ya no se usan
- [ ] Verificar que `.gitignore` incluye nuevas carpetas (ej: `.next/`, `dist/`)
- [ ] Actualizar README.md con nuevos comandos
- [ ] Eliminar dependencias no usadas: `npm prune` / `pip freeze` check

---

## Breaking Changes

{{Lista específica de breaking changes para esta migración particular, con la solución para cada uno}}

| Breaking Change | Impacto | Solución |
|----------------|---------|----------|
| {{descripción}} | {{qué se rompe}} | {{cómo arreglarlo}} |

---

## Quick-Start

Ejecuta estos comandos para comenzar la migración inmediatamente:

```bash
# 1. {{primer comando}}
# 2. {{segundo comando}}
# 3. {{tercer comando}}
# 4. {{cuarto comando}}
# 5. {{quinto comando}}
```

---

## Checklist de Progreso

- [ ] Fase 1: Infraestructura
- [ ] Fase 2: Tipos y modelos
- [ ] Fase 3: Base de datos
- [ ] Fase 4: Lógica de negocio
- [ ] Fase 5: Rutas API
- [ ] Fase 6: Componentes UI
- [ ] Fase 7: Estado
- [ ] Fase 8: Autenticación
- [ ] Fase 9: Testing
- [ ] Fase 10: CI/CD, Docker, env vars, limpieza

---

## Troubleshooting

{{Los 5-10 errores más comunes para este path de migración}}

### {{Nombre del error}}
**Síntoma:** {{qué se ve}}
**Causa:** {{por qué pasa}}
**Solución:** {{cómo arreglarlo}}

---

> Plan generado por Grimox Migration Architect
> Para aplicar: sigue las fases en orden, verificando cada paso antes de continuar
```
