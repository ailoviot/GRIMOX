# Guía de Migración — Frontend

Referencia detallada para migraciones de frontend. Cada sección incluye los cambios específicos, patrones before/after, pitfalls comunes y verificaciones.

---

## CRA → React + Vite

Create React App está descontinuado desde 2023. Vite es el reemplazo oficial recomendado por el equipo de React.

### Cambios clave

| Aspecto | CRA | Vite |
|---------|-----|------|
| Build tool | Webpack (oculto) | Vite (esbuild + Rollup) |
| Config | No configurable | `vite.config.ts` |
| Env vars | `REACT_APP_*` | `VITE_*` |
| Entry HTML | `public/index.html` | `index.html` (raíz) |
| Scripts | `react-scripts start/build` | `vite` / `vite build` |
| Proxy | `proxy` en package.json | `server.proxy` en vite.config |

### Paquetes a quitar
```
react-scripts, @types/react-scripts
```

### Paquetes a agregar
```
vite, @vitejs/plugin-react
```

### Patrón: vite.config.ts
```javascript
// ANTES: No existía (CRA oculta webpack)

// DESPUÉS: vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});
```

### Patrón: Variables de entorno
```javascript
// ANTES (CRA)
const apiUrl = process.env.REACT_APP_API_URL;

// DESPUÉS (Vite)
const apiUrl = import.meta.env.VITE_API_URL;
```

### Patrón: index.html
```html
<!-- ANTES: public/index.html (CRA lo procesa internamente) -->
<div id="root"></div>

<!-- DESPUÉS: index.html en la raíz del proyecto -->
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

### Pasos de migración
1. Instalar vite + plugin: `npm install vite @vitejs/plugin-react -D`
2. Crear `vite.config.ts` con plugin react
3. Mover `public/index.html` a la raíz, agregar `<script type="module" src="/src/main.tsx">`
4. Renombrar env vars: `REACT_APP_*` → `VITE_*` (en .env Y en código)
5. Actualizar `package.json` scripts: `"dev": "vite"`, `"build": "vite build"`, `"preview": "vite preview"`
6. Quitar `react-scripts`: `npm uninstall react-scripts`
7. Si usa proxy en package.json, mover a `vite.config.ts` → `server.proxy`
8. Si usa `%PUBLIC_URL%` en HTML, reemplazar por rutas relativas

### Pitfalls
- **SVG imports**: CRA permite `import { ReactComponent as Logo } from './logo.svg'`. En Vite necesitas `vite-plugin-svgr` o importar como URL.
- **Global CSS**: CRA importa CSS como side-effect. En Vite funciona igual, pero `@import` dentro de CSS puede necesitar ajuste de paths.
- **process.env**: Vite NO expone `process.env`. Cualquier uso de `process.env.NODE_ENV` debe cambiar a `import.meta.env.MODE`.
- **Tests**: Si usa react-scripts test (Jest), migrar a Vitest: `npm install vitest @testing-library/react -D`.

### Verificación
```bash
npm run dev          # Debe compilar sin errores y abrir en localhost:3000
npm run build        # Debe generar dist/ sin errores
```

---

## CRA → Next.js 15

Incluye todo lo de CRA→Vite más la migración a App Router y server-side rendering.

### Cambios adicionales sobre CRA→Vite

| Aspecto | CRA / Vite SPA | Next.js 15 |
|---------|---------------|------------|
| Routing | React Router (manual) | File-based (app/) |
| Rendering | Client-side only | Server Components por defecto |
| API | Necesita backend separado | API Routes / Server Actions |
| SEO | Requiere SSR externo | Built-in con metadata API |

### Patrón: Routing
```javascript
// ANTES (React Router)
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/users" element={<Users />} />
  <Route path="/users/:id" element={<UserDetail />} />
</Routes>

// DESPUÉS (Next.js App Router)
// app/page.tsx         → Home
// app/users/page.tsx   → Users
// app/users/[id]/page.tsx → UserDetail
```

### Patrón: Data fetching
```javascript
// ANTES (useEffect + fetch)
function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);
  return <UserList users={users} />;
}

// DESPUÉS (Server Component — sin useState, sin useEffect)
async function Users() {
  const users = await fetch('https://api.example.com/users').then(r => r.json());
  return <UserList users={users} />;
}
```

### Patrón: Mutaciones
```javascript
// ANTES (fetch POST manual)
async function createUser(data) {
  await fetch('/api/users', { method: 'POST', body: JSON.stringify(data) });
}

// DESPUÉS (Server Action)
'use server';
async function createUser(formData) {
  const name = formData.get('name');
  await db.users.create({ data: { name } });
  revalidatePath('/users');
}
```

### Pitfalls
- **'use client'**: Cualquier componente que use useState, useEffect, onClick necesita `'use client'` al inicio. Olvidarlo causa errores crípticos.
- **React Router**: Next.js NO usa React Router. Toda la navegación es con `<Link>` de `next/link` y `useRouter` de `next/navigation`.
- **Image component**: Reemplazar `<img>` por `<Image>` de `next/image` para optimización automática.
- **Environment variables**: En Next.js las que necesita el browser deben tener prefijo `NEXT_PUBLIC_*`.

---

## React Legacy (< v18) → Next.js 15

Para proyectos React antiguos con class components, React Router v5, y patrones pre-hooks.

### Patrones de transformación

**Class component → Functional:**
```javascript
// ANTES
class UserProfile extends React.Component {
  state = { user: null, loading: true };

  componentDidMount() {
    fetchUser(this.props.id).then(user => this.setState({ user, loading: false }));
  }

  render() {
    if (this.state.loading) return <Spinner />;
    return <div>{this.state.user.name}</div>;
  }
}

// DESPUÉS (Server Component en Next.js — ni useState ni useEffect)
async function UserProfile({ params }) {
  const user = await fetchUser(params.id);
  return <div>{user.name}</div>;
}
```

**Lifecycle → Hooks (cuando sí necesitas client component):**

| Lifecycle (class) | Hook equivalente |
|-------------------|-----------------|
| `componentDidMount` | `useEffect(() => {}, [])` |
| `componentDidUpdate(prevProps)` | `useEffect(() => {}, [dep])` |
| `componentWillUnmount` | `useEffect(() => { return cleanup }, [])` |
| `shouldComponentUpdate` | `React.memo()` |
| `this.state` / `this.setState` | `useState()` |

**React Router v5 → Next.js routing:**

| React Router v5 | Next.js App Router |
|-----------------|-------------------|
| `<Route path="/users" component={Users} />` | `app/users/page.tsx` |
| `<Route path="/users/:id" />` | `app/users/[id]/page.tsx` |
| `<Switch>` | No necesario (file-based) |
| `useHistory().push('/x')` | `useRouter().push('/x')` (from `next/navigation`) |
| `useParams()` | `params` prop en page component |
| `<Redirect to="/login" />` | `redirect('/login')` (from `next/navigation`) |

### Pitfalls
- **Class component state**: Si el state es complejo (setState con callbacks, getDerivedStateFromProps), la conversión a hooks requiere más cuidado. Usa `useReducer` para estados complejos.
- **HOCs**: Si el proyecto usa Higher Order Components extensivamente, convertirlos a custom hooks.
- **PropTypes**: Si usaba PropTypes, migrar a TypeScript interfaces.
- **Redux connect()**: Si usa `connect(mapState, mapDispatch)`, migrar a `useSelector` + `useDispatch`.

---

## Vue 2 → Nuxt 4

Vue 2 a Vue 3 es una de las migraciones más complejas por la cantidad de breaking changes.

### Breaking changes Vue 2 → Vue 3

| Aspecto | Vue 2 | Vue 3 |
|---------|-------|-------|
| API | Options API | Composition API (recomendado) |
| State | Vuex | Pinia |
| v-model | `value` + `input` event | `modelValue` + `update:modelValue` |
| Filters | `{{ price \| currency }}` | Eliminados (usar computed o funciones) |
| $on / $off / $once | Event bus | Eliminados (usar mitt o provide/inject) |
| Vue.set / Vue.delete | Necesarios para reactividad | No necesarios (Proxy-based) |
| Fragments | No soportados (un root) | Soportados (múltiples roots) |
| Teleport | No existe | `<Teleport>` built-in |
| Suspense | No existe | `<Suspense>` built-in |

### Patrón: Options API → Composition API
```javascript
// ANTES (Options API)
export default {
  data() {
    return { count: 0, user: null };
  },
  computed: {
    doubleCount() { return this.count * 2; }
  },
  methods: {
    increment() { this.count++; }
  },
  mounted() {
    this.user = await fetchUser();
  }
}

// DESPUÉS (Composition API con <script setup>)
<script setup>
import { ref, computed, onMounted } from 'vue';

const count = ref(0);
const user = ref(null);
const doubleCount = computed(() => count.value * 2);

function increment() { count.value++; }

onMounted(async () => {
  user.value = await fetchUser();
});
</script>
```

### Patrón: Vuex → Pinia
```javascript
// ANTES (Vuex)
const store = new Vuex.Store({
  state: { items: [] },
  mutations: { ADD_ITEM(state, item) { state.items.push(item); } },
  actions: { addItem({ commit }, item) { commit('ADD_ITEM', item); } },
  getters: { itemCount: state => state.items.length }
});

// DESPUÉS (Pinia)
export const useItemStore = defineStore('items', () => {
  const items = ref([]);
  const itemCount = computed(() => items.value.length);
  function addItem(item) { items.value.push(item); }
  return { items, itemCount, addItem };
});
```

### Extras para Nuxt 4
- **Auto-imports**: `ref`, `computed`, `useRoute`, etc. se importan automáticamente
- **File-based routing**: `pages/users/[id].vue` genera ruta `/users/:id`
- **Server routes**: `server/api/users.get.ts` genera endpoint GET /api/users
- **Nitro**: El server engine de Nuxt — reemplaza la necesidad de Express/Fastify para APIs simples

### Pitfalls
- **Reactividad en Composition API**: Olvidar `.value` al leer/escribir refs es el error #1
- **Mixins**: Vue 3 desalienta mixins. Migrar a composables (`use*` functions)
- **$refs**: Cambia de `this.$refs.myInput` a `const myInput = ref(null)` en template `ref="myInput"`
- **Global plugins**: `Vue.use(plugin)` cambia a `app.use(plugin)` en el setup de Nuxt

---

## Angular Legacy (< v17) → Angular 19

Angular tiene un path de upgrade bien definido pero requiere ir versión por versión.

### Estrategia de upgrade

Angular recomienda actualizar de a una versión major a la vez. Usa la herramienta oficial:

```bash
npx @angular/cli@<target-version> update @angular/core@<target-version> @angular/cli@<target-version>
```

### Cambios principales por rango de versiones

**v12-v14 → v15:**
- Standalone components (opcional en v15, estándar en v17+)
- `NgModule` se puede eliminar gradualmente

**v15-v16 → v17:**
- Control flow nuevo: `@if`, `@for`, `@switch` (reemplaza `*ngIf`, `*ngFor`, `*ngSwitch`)
- Deferrable views: `@defer` para lazy loading de componentes
- Signals (reactive primitives)

**v17-v18 → v19:**
- Signals como forma principal de estado
- Standalone por defecto (sin NgModule)
- Zoneless change detection (experimental → estable)
- `inject()` function reemplaza constructor injection

### Patrón: NgModule → Standalone
```typescript
// ANTES (NgModule)
@NgModule({
  declarations: [UserComponent, UserListComponent],
  imports: [CommonModule, FormsModule],
  exports: [UserComponent]
})
export class UserModule {}

// DESPUÉS (Standalone — no necesita NgModule)
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `...`
})
export class UserComponent {}
```

### Patrón: Control flow
```html
<!-- ANTES -->
<div *ngIf="user; else loading">{{ user.name }}</div>
<ng-template #loading><spinner /></ng-template>

<ul>
  <li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>
</ul>

<!-- DESPUÉS (Angular 17+) -->
@if (user) {
  <div>{{ user.name }}</div>
} @else {
  <spinner />
}

@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
}
```

### Patrón: Signals
```typescript
// ANTES (RxJS BehaviorSubject)
private userSubject = new BehaviorSubject<User | null>(null);
user$ = this.userSubject.asObservable();

setUser(user: User) { this.userSubject.next(user); }

// DESPUÉS (Signals)
user = signal<User | null>(null);
userName = computed(() => this.user()?.name ?? 'Anónimo');

setUser(user: User) { this.user.set(user); }
```

### Pitfalls
- **RxJS**: Angular 19 aún usa RxJS en HttpClient y Router. No intentes eliminar RxJS completamente — coexiste con signals.
- **Zone.js**: Si migras a zoneless, todos los cambios de estado deben estar en signals o explícitamente marcados. No hacerlo causa que la UI no se actualice.
- **Lazy loading**: Con standalone components, el lazy loading cambia de `loadChildren: () => import('./module')` a `loadComponent: () => import('./component')`.
- **Testing**: `TestBed.configureTestingModule` sigue siendo necesario pero con `imports: [Component]` en vez de declarar módulos.

### Verificación
```bash
ng build --configuration production   # Debe compilar sin errores ni warnings
ng test                               # Los tests existentes deben pasar
ng serve                              # La app debe funcionar correctamente
```
