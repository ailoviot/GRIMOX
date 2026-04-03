# Plantilla Base: PROJECT_DOCS.md

Usa esta plantilla para generar el archivo `PROJECT_DOCS.md`. Reemplaza los `{{placeholders}}` con datos reales del proyecto. Las secciones marcadas con `<!-- IF ... -->` son condicionales — incluir solo si aplican.

---

```markdown
# {{project_name}}

> {{project_description}}

**Generado con [Grimox CLI](https://github.com/ailoviot/GRIMOX)**

---

## Descripción General

| Campo | Valor |
|-------|-------|
| **Nombre** | {{project_name}} |
| **Tipo** | {{project_type}} |
| **Framework** | {{framework_name}} |
| **Lenguaje** | {{language}} |
| **UI** | {{ui_library}} |
| **Base de datos** | {{database}} |
| **Fecha de creación** | {{creation_date}} |

---

## Arquitectura

{{architecture_narrative}}

<!-- Leer references/doc-architecture-patterns.md para la narrativa específica del stack -->

---

## Tech Stack

| Categoría | Tecnología | Versión/Notas |
|-----------|-----------|---------------|
| Framework | {{framework_name}} | {{framework_notes}} |
| Lenguaje | {{language}} | — |
| UI/Styling | {{ui_library}} | {{ui_notes}} |
| Base de datos | {{database}} | {{db_notes}} |
| ORM/Client | {{orm_client}} | — |
| Testing | {{test_framework}} | — |
| Linting | {{linter}} | — |
| Bundler | {{bundler}} | — |

---

## Estructura del Proyecto

```
{{project_name}}/
├── {{annotated_tree}}
```

<!-- Generar árbol real del proyecto con anotaciones breves por carpeta -->

---

## Getting Started

### Requisitos previos

{{prerequisites}}

### Instalación

```bash
{{install_command}}
```

### Desarrollo

```bash
{{dev_command}}
```

### Build

```bash
{{build_command}}
```

### Tests

```bash
{{test_command}}
```

### Deploy

{{deploy_instructions}}

<!-- Leer references/doc-commands-by-stack.md para los comandos específicos -->

---

## Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| {{env_var_name}} | {{env_var_description}} | {{env_var_default}} |

<!-- Leer .env.example o .env del proyecto. Nunca incluir secretos reales -->

---

<!-- IF feature:docker -->
## Docker

### Desarrollo con Docker

```bash
docker-compose up
```

### Servicios incluidos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| {{service_name}} | {{port}} | {{service_description}} |

### Build de producción

```bash
docker build -t {{project_name}} .
docker run -p {{port}}:{{port}} {{project_name}}
```
<!-- END IF -->

---

<!-- IF feature:cicd -->
## CI/CD

Pipeline configurado en `.github/workflows/ci.yml`.

### Pasos del pipeline

1. {{ci_step_1}}
2. {{ci_step_2}}
3. {{ci_step_3}}

### Triggers

- Push a `main` / `master`
- Pull requests
<!-- END IF -->

---

<!-- IF feature:database -->
## Base de Datos

### Configuración

{{database_setup_instructions}}

### Schema / Modelos

| Modelo/Tabla | Campos clave | Descripción |
|-------------|-------------|-------------|
| {{model_name}} | {{key_fields}} | {{model_description}} |
<!-- END IF -->

---

<!-- IF feature:auth -->
## Autenticación

### Flujo de autenticación

{{auth_flow_description}}

### Proveedor

| Proveedor | Tipo | Descripción |
|-----------|------|-------------|
| {{auth_provider}} | {{auth_type}} | {{auth_description}} |

### Rutas protegidas

| Ruta/Endpoint | Nivel de acceso | Middleware/Guard |
|---------------|----------------|-----------------|
| {{protected_route}} | {{access_level}} | {{auth_middleware}} |

### Middleware de autenticación

{{auth_middleware_description}}
<!-- END IF -->

---

<!-- IF feature:ai-skills -->
## AI Skills (.ai/rules.md)

El archivo `.ai/rules.md` contiene directrices específicas para que cualquier asistente IA siga las mejores prácticas del stack durante el desarrollo. Se replica automáticamente en `.cursorrules` (Cursor, Windsurf, Trae, Antigravity) y `.github/copilot-instructions.md` (GitHub Copilot).

### Reglas principales

{{ai_rules_summary}}

<!-- Leer el archivo .ai/rules.md del proyecto (o .cursorrules si no existe) y resumir las reglas más importantes -->
<!-- END IF -->

---

<!-- IF feature:mcp -->
## MCP (Model Context Protocol)

Servidores MCP configurados para que agentes IA se conecten a los servicios del proyecto desde el día cero.

### Servidores configurados

| Servidor | Servicio | Descripción |
|----------|---------|-------------|
| {{mcp_server_name}} | {{mcp_service}} | {{mcp_description}} |

### Uso

{{mcp_usage_instructions}}
<!-- END IF -->

---

<!-- SECCIONES ESPECÍFICAS POR TIPO DE PROYECTO -->
<!-- Leer references/doc-sections-by-type.md para los snippets de la categoría detectada -->
<!-- Insertar aquí las secciones condicionales del tipo -->

---

## Changelog

### {{creation_date}} — Proyecto creado
- Proyecto generado con Grimox CLI
- Stack: {{framework_name}} ({{language}})
- Features: {{enabled_features_list}}
```

---

## Notas de uso

1. Reemplazar TODOS los `{{placeholders}}` con valores reales del proyecto
2. Eliminar las secciones `<!-- IF ... -->` que no apliquen (eliminar también los comentarios)
3. Las secciones condicionales por tipo de proyecto se toman de `doc-sections-by-type.md`
4. El árbol de directorios debe reflejar la estructura REAL del proyecto, no una genérica
5. Para proyectos desacoplados, incluir la estructura de frontend/ y backend/ por separado
