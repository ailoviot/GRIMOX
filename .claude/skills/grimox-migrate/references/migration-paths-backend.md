# Guía de Migración — Backend

Referencia detallada para migraciones de backend. Cada sección incluye los cambios específicos, patrones before/after, pitfalls comunes y verificaciones.

---

## Express → Hono

Hono es un framework ultraligero que corre en Node.js, Bun, Deno, Cloudflare Workers y más. La API es similar a Express pero moderna (ESM nativo, TypeScript-first).

### Cambios clave

| Aspecto | Express | Hono |
|---------|---------|------|
| Módulos | CommonJS (require) | ESM (import/export) |
| Request/Response | `req.body`, `res.json()` | `c.req.json()`, `c.json()` |
| Middleware | `app.use(fn)` | `app.use(fn)` (similar pero diferente firma) |
| Router | `express.Router()` | `new Hono()` (cada instancia es un router) |
| Error handling | `(err, req, res, next)` | `app.onError((err, c) => ...)` |
| Body parsing | `express.json()` middleware | Built-in (automático) |
| Static files | `express.static()` | `serveStatic()` de `hono/serve-static` |
| Typing | Manual o @types/express | TypeScript-first, tipos generados |

### Patrón: Ruta básica
```javascript
// ANTES (Express)
const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/users', (req, res) => {
  const users = getUsers();
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const user = createUser(req.body);
  res.status(201).json(user);
});

app.listen(3000);

// DESPUÉS (Hono)
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/api/users', (c) => {
  const users = getUsers();
  return c.json(users);
});

app.post('/api/users', async (c) => {
  const body = await c.req.json();
  const user = createUser(body);
  return c.json(user, 201);
});

serve({ fetch: app.fetch, port: 3000 });
```

### Patrón: Middleware
```javascript
// ANTES (Express middleware)
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}
app.use('/api', authMiddleware);

// DESPUÉS (Hono middleware)
import { createMiddleware } from 'hono/factory';

const authMiddleware = createMiddleware(async (c, next) => {
  const token = c.req.header('Authorization')?.split(' ')[1];
  if (!token) return c.json({ error: 'No token' }, 401);
  try {
    c.set('user', verifyToken(token));
    await next();
  } catch {
    return c.json({ error: 'Invalid token' }, 403);
  }
});
app.use('/api/*', authMiddleware);
```

### Patrón: Router modular
```javascript
// ANTES (Express Router)
// routes/users.js
const router = express.Router();
router.get('/', getUsers);
router.post('/', createUser);
module.exports = router;

// app.js
app.use('/api/users', require('./routes/users'));

// DESPUÉS (Hono)
// routes/users.ts
const users = new Hono();
users.get('/', getUsers);
users.post('/', createUser);
export default users;

// app.ts
import users from './routes/users';
app.route('/api/users', users);
```

### Patrón: Error handling
```javascript
// ANTES (Express)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// DESPUÉS (Hono)
app.onError((err, c) => {
  console.error(err.stack);
  return c.json({ error: 'Internal server error' }, 500);
});

app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});
```

### Mapeo de middleware comunes

| Express middleware | Equivalente en Hono |
|-------------------|-------------------|
| `express.json()` | Built-in (no necesario) |
| `cors()` | `import { cors } from 'hono/cors'` |
| `helmet()` | `import { secureHeaders } from 'hono/secure-headers'` |
| `morgan()` | `import { logger } from 'hono/logger'` |
| `compression()` | `import { compress } from 'hono/compress'` |
| `express.static()` | `import { serveStatic } from '@hono/node-server/serve-static'` |
| `express-rate-limit` | `import { rateLimiter } from 'hono-rate-limiter'` |

### Pitfalls
- **CommonJS → ESM**: El cambio más grande. Todos los `require()` deben ser `import`. Todos los `module.exports` deben ser `export`. Actualizar package.json: `"type": "module"`.
- **req.body directo**: En Express con `express.json()`, `req.body` ya está parseado. En Hono, usar `await c.req.json()` (es async).
- **res.send() vs c.text()**: Express usa `res.send()` para texto plano. Hono usa `c.text()` o `c.html()`.
- **next()**: En Hono, `await next()` es obligatorio (async). Olvidar el `await` causa que los middleware downstream no se ejecuten correctamente.

### Verificación
```bash
npm run dev                            # Debe iniciar sin errores
curl http://localhost:3000/api/users   # Debe responder JSON
npm test                               # Tests deben pasar
```

---

## Express → Fastify

Fastify es un framework de alta performance para Node.js con sistema de plugins y validación por schema.

### Cambios clave

| Aspecto | Express | Fastify |
|---------|---------|---------|
| Paradigma | Middleware chain | Plugin system |
| Validation | Manual o express-validator | JSON Schema built-in |
| Hooks | Middleware (before/after) | Lifecycle hooks (onRequest, preHandler, etc.) |
| Response | `res.json()` | `reply.send()` (auto-serialization) |
| Decorators | No existe | `fastify.decorate()` para extender |

### Patrón: Ruta con validación
```javascript
// ANTES (Express + express-validator)
app.post('/api/users', [
  body('name').notEmpty(),
  body('email').isEmail()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const user = createUser(req.body);
  res.status(201).json(user);
});

// DESPUÉS (Fastify — schema built-in)
fastify.post('/api/users', {
  schema: {
    body: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' }
      }
    },
    response: {
      201: {
        type: 'object',
        properties: { id: { type: 'string' }, name: { type: 'string' } }
      }
    }
  }
}, async (request, reply) => {
  const user = createUser(request.body);
  reply.status(201).send(user);
});
```

### Patrón: Plugin
```javascript
// ANTES (Express middleware)
function dbMiddleware(req, res, next) {
  req.db = getDbConnection();
  next();
}
app.use(dbMiddleware);

// DESPUÉS (Fastify plugin)
async function dbPlugin(fastify, options) {
  const db = getDbConnection();
  fastify.decorate('db', db);
}
fastify.register(dbPlugin);

// Uso: fastify.db (disponible en todas las rutas del scope)
```

### Pitfalls
- **Encapsulation**: Los plugins de Fastify tienen scope. Un plugin registrado en un sub-context no está disponible en el parent. Esto es intencional pero sorprende a desarrolladores de Express.
- **Async handlers**: Fastify prefiere async functions. Si retornas un valor, Fastify lo envía automáticamente. No necesitas `reply.send()` si retornas.
- **Content-Type**: Fastify auto-detecta el tipo. Si envías un objeto, automáticamente pone `application/json`.

---

## Express → NestJS

NestJS es un framework enterprise con decoradores, inyección de dependencias, y estructura modular inspirada en Angular.

### Cambios clave

| Aspecto | Express | NestJS |
|---------|---------|--------|
| Estructura | Libre | Módulos / Controladores / Servicios |
| DI | Manual | Built-in (@Injectable) |
| Decorators | No usa | @Controller, @Get, @Post, @Body, etc. |
| Validation | Manual | class-validator + ValidationPipe |
| Testing | Manual | Built-in con @nestjs/testing |

### Patrón: Controller + Service
```javascript
// ANTES (Express — todo en un archivo)
app.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const user = await db.query('INSERT INTO users ...', [req.body.name]);
  res.status(201).json(user);
});

// DESPUÉS (NestJS — separación de concerns)
// users.controller.ts
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() { return this.usersService.findAll(); }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

// users.service.ts
@Injectable()
export class UsersService {
  findAll() { return this.db.query('SELECT * FROM users'); }
  create(dto: CreateUserDto) { return this.db.query('INSERT...', [dto.name]); }
}

// users.module.ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

### Pitfalls
- **Curva de aprendizaje**: NestJS tiene mucha abstracción. Si el proyecto Express es simple (10-20 rutas), NestJS puede ser excesivo. Considerar Hono o Fastify.
- **Decoradores**: Requieren `experimentalDecorators: true` en tsconfig.json.
- **Testing**: NestJS tiene su propio sistema de testing con `Test.createTestingModule()`. Los tests de Express no se pueden reutilizar directamente.

---

## Flask → FastAPI

Ambos son Python, pero FastAPI es async-first con validación automática via Pydantic.

### Cambios clave

| Aspecto | Flask | FastAPI |
|---------|-------|---------|
| Async | Sync por defecto | Async por defecto |
| Validation | Manual o Marshmallow | Pydantic v2 (built-in) |
| Docs | Flask no genera | Auto-genera Swagger + ReDoc |
| Type hints | Opcionales | Obligatorios (potencian la validación) |
| Server | Flask dev server / Gunicorn | Uvicorn (ASGI) |

### Patrón: Ruta con validación
```python
# ANTES (Flask + Marshmallow)
from flask import Flask, request, jsonify
from marshmallow import Schema, fields

class UserSchema(Schema):
    name = fields.Str(required=True)
    email = fields.Email(required=True)

@app.route('/api/users', methods=['POST'])
def create_user():
    schema = UserSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400
    user = create_user_in_db(request.json)
    return jsonify(user), 201

# DESPUÉS (FastAPI + Pydantic)
from fastapi import FastAPI
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr

@app.post('/api/users', status_code=201)
async def create_user(user: UserCreate):
    result = await create_user_in_db(user.model_dump())
    return result
```

### Patrón: Dependency Injection
```python
# ANTES (Flask — manual)
@app.route('/api/users')
def get_users():
    db = get_db_connection()
    users = db.execute('SELECT * FROM users')
    return jsonify(users)

# DESPUÉS (FastAPI — Depends)
from fastapi import Depends

async def get_db():
    db = await create_connection()
    try:
        yield db
    finally:
        await db.close()

@app.get('/api/users')
async def get_users(db = Depends(get_db)):
    users = await db.execute('SELECT * FROM users')
    return users
```

### Mapeo Flask → FastAPI

| Flask | FastAPI |
|-------|---------|
| `@app.route('/x', methods=['GET'])` | `@app.get('/x')` |
| `request.json` | Parámetro con type hint (`body: UserCreate`) |
| `request.args.get('q')` | `@app.get('/search')` + `def search(q: str)` |
| `jsonify(data)` | Retornar directamente (auto-serializa) |
| `abort(404)` | `raise HTTPException(status_code=404)` |
| `Blueprint` | `APIRouter` |
| `before_request` | Middleware o Depends |
| `Flask-SQLAlchemy` | SQLAlchemy async + Depends |
| `Flask-Login` | Depends + JWT / OAuth2PasswordBearer |

### Pitfalls
- **Sync a async**: El cambio más impactante. Todas las operaciones I/O (DB, HTTP, archivos) deben usar `await`. Si una librería no es async, usar `run_in_executor`.
- **SQLAlchemy**: Flask-SQLAlchemy no es compatible con FastAPI. Usar SQLAlchemy async directamente con `create_async_engine`.
- **Tests**: Flask usa `app.test_client()`. FastAPI usa `httpx.AsyncClient` con `pytest-asyncio`.
- **Templates**: Si Flask renderiza HTML con Jinja2, FastAPI puede hacer lo mismo con `Jinja2Templates`, pero lo ideal es separar en API + SPA frontend.

---

## Django → FastAPI

Migración más compleja — Django es un framework "batteries included" y FastAPI es minimalista.

### Qué conservar vs qué reemplazar

| Componente Django | Reemplazo en FastAPI |
|-------------------|---------------------|
| Django ORM | SQLAlchemy async + Alembic |
| Django Admin | AdminJS, o construir uno custom |
| Django Forms | Pydantic models |
| Django Templates | API REST + SPA frontend (React, Vue) |
| Django Auth | FastAPI Users o JWT manual |
| Django REST Framework | FastAPI (ya es API-first) |
| Django Channels | WebSockets nativos en FastAPI |
| Django Management Commands | Typer o Click |

### Patrón: Model (ORM)
```python
# ANTES (Django ORM)
class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

# DESPUÉS (SQLAlchemy)
from sqlalchemy.orm import Mapped, mapped_column

class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String, unique=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now())
```

### Patrón: Migraciones
```bash
# ANTES (Django)
python manage.py makemigrations
python manage.py migrate

# DESPUÉS (Alembic)
alembic revision --autogenerate -m "create users table"
alembic upgrade head
```

### Pitfalls
- **Django Admin**: No hay equivalente directo en FastAPI. Si el proyecto depende mucho de Django Admin, evaluar si vale la pena migrar o mantener Django solo para admin.
- **Migrations**: Django migrations y Alembic no son compatibles. Necesitas recrear las migraciones desde cero o exportar el schema SQL.
- **Signals**: Django signals (`post_save`, `pre_delete`) no existen en FastAPI. Reemplazar con event handlers explícitos o Background Tasks.

---

## Spring Boot 2.x → Spring Boot 3.x

Upgrade dentro del mismo ecosistema, pero con cambios de namespace significativos.

### Cambios principales

| Aspecto | Spring Boot 2.x | Spring Boot 3.x |
|---------|-----------------|-----------------|
| Java mínimo | Java 8-17 | Java 17+ (recomendado 21) |
| Namespace | `javax.*` | `jakarta.*` |
| Spring Security | `WebSecurityConfigurerAdapter` | SecurityFilterChain (functional) |
| Observability | Micrometer | Micrometer + Observation API |
| Native | Experimental | GraalVM native image soporte completo |

### Patrón: Namespace migration
```java
// ANTES (javax)
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.servlet.http.HttpServletRequest;

// DESPUÉS (jakarta)
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.servlet.http.HttpServletRequest;
```

### Patrón: Security config
```java
// ANTES (Spring Boot 2.x — extends WebSecurityConfigurerAdapter)
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
            .antMatchers("/api/public/**").permitAll()
            .anyRequest().authenticated();
    }
}

// DESPUÉS (Spring Boot 3.x — functional style)
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            ).build();
    }
}
```

### Pasos de migración
1. Actualizar Java a 17+ (idealmente 21)
2. Actualizar Spring Boot parent/BOM a 3.x en pom.xml o build.gradle
3. Buscar y reemplazar `javax.` → `jakarta.` en todo el código
4. Refactorizar Spring Security config (quitar extends, usar beans)
5. Actualizar `antMatchers` → `requestMatchers`
6. Si usa Swagger/SpringFox → migrar a SpringDoc OpenAPI
7. Revisar properties deprecadas en application.yml
8. Actualizar tests

### Pitfalls
- **javax → jakarta**: Herramienta de búsqueda y reemplazo global. Pero cuidado con `javax.annotation.*` que NO migró a Jakarta (algunas quedaron).
- **SpringFox**: No funciona con Spring Boot 3. Usar `springdoc-openapi-starter-webmvc-ui` en su lugar.
- **Properties**: Algunas propiedades de `application.yml` cambiaron de nombre. Revisar el changelog oficial.
- **Tests**: `@RunWith(SpringRunner.class)` → `@ExtendWith(SpringExtension.class)` (JUnit 5).

### Verificación
```bash
./mvnw clean compile    # Debe compilar sin errores
./mvnw test             # Tests deben pasar
./mvnw spring-boot:run  # Debe iniciar correctamente
```
