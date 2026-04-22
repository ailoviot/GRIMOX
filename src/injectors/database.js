import { join } from 'node:path';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { writeFileSafe } from '../utils/fs-helpers.js';

/**
 * Inyecta configuración de base de datos.
 *
 * Para Supabase + frameworks modernos con SSR (Next.js 15, SvelteKit, Nuxt 4),
 * genera la integración completa que cada framework espera (cliente browser/server,
 * middleware de sesión, hooks). Para SPAs y APIs puras, usa el cliente plano.
 */
export async function inject(projectPath, config) {
    if (!config.database) return;

    const language = config.isDecoupled
        ? config.backend?.language
        : config.language;

    const stackId = config.isDecoupled
        ? config.frontend?.stackId
        : config.stackId;

    // Supabase tiene paths específicos por framework (SSR moderno)
    if (config.database === 'supabase') {
        if (stackId === 'nextjs-15') {
            await injectNextJsSupabase(projectPath, language);
            return;
        }
        if (stackId === 'sveltekit') {
            await injectSvelteKitSupabase(projectPath);
            return;
        }
        if (stackId === 'nuxt-4') {
            await injectNuxtSupabase(projectPath);
            return;
        }
    }

    // Fallback: generador genérico (SPAs, APIs, otros DBs)
    const dbConfig = getDbConfig(config.database, language);
    if (dbConfig) {
        await writeFileSafe(join(projectPath, dbConfig.path), dbConfig.content);
    }

    if (['JavaScript', 'TypeScript'].includes(language)) {
        addNodeDeps(projectPath, config.database, language);
    } else if (language === 'Python') {
        addPythonDeps(projectPath, config.database);
    }
}

/**
 * Next.js 15 App Router + Supabase SSR.
 * Genera client browser, server (RSC + Server Actions), middleware de sesión,
 * y el src/middleware.ts raíz que Next requiere.
 */
async function injectNextJsSupabase(projectPath, language) {
    const ext = language === 'JavaScript' ? 'js' : 'ts';

    mergeNodeDeps(projectPath, {
        deps: {
            '@supabase/ssr': '^0.5.0',
            '@supabase/supabase-js': '^2.45.0',
        },
    });

    await writeFileSafe(
        join(projectPath, 'src', 'lib', 'supabase', `client.${ext}`),
        `import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
`
    );

    await writeFileSafe(
        join(projectPath, 'src', 'lib', 'supabase', `server.${ext}`),
        `import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet: CookieToSet[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {
                        // setAll llamado desde Server Component — ignorar. El middleware
                        // ya refrescó la sesión antes de llegar aquí.
                    }
                },
            },
        }
    );
}
`
    );

    await writeFileSafe(
        join(projectPath, 'src', 'lib', 'supabase', `middleware.${ext}`),
        `import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Refresca la sesión de Supabase antes de que llegue al Server Component.
 * Protege rutas /dashboard redirigiendo a /login si no hay sesión.
 * Redirige /login a /dashboard si el usuario YA está autenticado.
 */
export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: CookieToSet[]) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
    const isProtected = pathname.startsWith('/dashboard');

    if (!user && isProtected) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (user && isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return response;
}
`
    );

    await writeFileSafe(
        join(projectPath, 'src', `middleware.${ext}`),
        `import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        // Excluir archivos estáticos e imágenes del middleware
        '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
`
    );
}

/**
 * SvelteKit + Supabase SSR.
 * Genera cliente compartido + hooks.server.ts para cookies de sesión.
 */
async function injectSvelteKitSupabase(projectPath) {
    mergeNodeDeps(projectPath, {
        deps: {
            '@supabase/ssr': '^0.5.0',
            '@supabase/supabase-js': '^2.45.0',
        },
    });

    await writeFileSafe(
        join(projectPath, 'src', 'lib', 'supabase.ts'),
        `import { createBrowserClient, createServerClient, isBrowser, type CookieOptions } from '@supabase/ssr';
import type { Cookies } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export function createSupabaseClient(cookies?: Cookies) {
    if (isBrowser()) {
        return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
    }

    return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => cookies?.getAll() ?? [],
            setAll: (cookiesToSet: CookieToSet[]) => {
                cookiesToSet.forEach(({ name, value, options }) => {
                    cookies?.set(name, value, { ...options, path: '/' });
                });
            },
        },
    });
}
`
    );

    await writeFileSafe(
        join(projectPath, 'src', 'hooks.server.ts'),
        `import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => event.cookies.getAll(),
            setAll: (cookiesToSet: CookieToSet[]) => {
                cookiesToSet.forEach(({ name, value, options }) => {
                    event.cookies.set(name, value, { ...options, path: '/' });
                });
            },
        },
    });

    event.locals.getSession = async () => {
        const {
            data: { session },
        } = await event.locals.supabase.auth.getSession();
        return session;
    };

    // Protege /dashboard redirigiendo a /login si no hay sesión
    if (event.url.pathname.startsWith('/dashboard')) {
        const session = await event.locals.getSession();
        if (!session) throw redirect(303, '/login');
    }

    return resolve(event, {
        filterSerializedResponseHeaders: (name) => name === 'content-range',
    });
};
`
    );

    await writeFileSafe(
        join(projectPath, 'src', 'app.d.ts'),
        `import type { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
    namespace App {
        interface Locals {
            supabase: SupabaseClient;
            getSession: () => Promise<Session | null>;
        }
    }
}

export {};
`
    );
}

/**
 * Nuxt 4 + Supabase usando @nuxtjs/supabase module.
 * Configura el module en nuxt.config + composables auto-importables.
 */
async function injectNuxtSupabase(projectPath) {
    mergeNodeDeps(projectPath, {
        deps: {
            '@nuxtjs/supabase': '^1.4.0',
        },
    });

    // Nota: el usuario o el LLM debe agregar '@nuxtjs/supabase' a modules[] en
    // nuxt.config.ts. Documentamos en el file generado.

    await writeFileSafe(
        join(projectPath, 'composables', 'useSupabase.ts'),
        `/**
 * Composable que expone el cliente Supabase con tipos.
 *
 * El módulo @nuxtjs/supabase provee useSupabaseClient() auto-importado.
 * Este wrapper solo existe para centralizar tipos custom del proyecto.
 *
 * IMPORTANTE: agrega '@nuxtjs/supabase' a modules[] en nuxt.config.ts
 * y las vars SUPABASE_URL / SUPABASE_KEY a tu .env.
 */
export function useSupabase() {
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    return { client, user };
}
`
    );

    await writeFileSafe(
        join(projectPath, 'middleware', 'auth.ts'),
        `export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser();

    // Rutas bajo /dashboard requieren sesión
    if (to.path.startsWith('/dashboard') && !user.value) {
        return navigateTo('/login');
    }

    // Si ya hay sesión y va a /login, enviar al dashboard
    if (to.path === '/login' && user.value) {
        return navigateTo('/dashboard');
    }
});
`
    );
}

/**
 * Merge deps en package.json sin duplicar ni pisar existentes.
 */
function mergeNodeDeps(projectPath, { deps = {}, devDeps = {} } = {}) {
    const pkgPath = join(projectPath, 'package.json');
    if (!existsSync(pkgPath)) return;

    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    pkg.dependencies = { ...(pkg.dependencies || {}), ...deps };
    if (Object.keys(devDeps).length > 0) {
        pkg.devDependencies = { ...(pkg.devDependencies || {}), ...devDeps };
    }
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + '\n');
}

function addNodeDeps(projectPath, database, language) {
    const pkgPath = join(projectPath, 'package.json');
    if (!existsSync(pkgPath)) return;

    const deps = getNodeDeps(database, language);
    if (Object.keys(deps.dependencies).length === 0 && Object.keys(deps.devDependencies).length === 0) return;

    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    pkg.dependencies = { ...(pkg.dependencies || {}), ...deps.dependencies };
    if (Object.keys(deps.devDependencies).length > 0) {
        pkg.devDependencies = { ...(pkg.devDependencies || {}), ...deps.devDependencies };
    }
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + '\n');
}

function getNodeDeps(database, language) {
    const isTS = language === 'TypeScript';
    const map = {
        supabase: { deps: { '@supabase/supabase-js': '^2.45.0' }, devDeps: {} },
        postgresql: {
            deps: { pg: '^8.12.0' },
            devDeps: isTS ? { '@types/pg': '^8.11.0' } : {},
        },
        firebase: { deps: { firebase: '^10.13.0' }, devDeps: {} },
        mongodb: { deps: { mongoose: '^8.5.0' }, devDeps: {} },
        turso: { deps: { '@libsql/client': '^0.10.0' }, devDeps: {} },
        oracle: { deps: { oracledb: '^6.6.0' }, devDeps: {} },
        insforge: { deps: { insforge: '^0.1.0' }, devDeps: {} },
    };
    const entry = map[database] || { deps: {}, devDeps: {} };
    return { dependencies: entry.deps, devDependencies: entry.devDeps };
}

function addPythonDeps(projectPath, database) {
    const reqPath = join(projectPath, 'requirements.txt');
    if (!existsSync(reqPath)) return;

    const deps = {
        supabase: ['supabase>=2.7.0'],
        postgresql: ['sqlalchemy[asyncio]>=2.0.0', 'asyncpg>=0.29.0'],
        mongodb: ['motor>=3.5.0'],
        oracle: ['oracledb>=2.2.0'],
        firebase: ['firebase-admin>=6.5.0'],
        turso: ['libsql-experimental>=0.0.41'],
    };
    const lines = deps[database] || [];
    if (lines.length === 0) return;

    const current = readFileSync(reqPath, 'utf8');
    const newLines = lines.filter((l) => !current.includes(l.split(/[>=<]/)[0]));
    if (newLines.length === 0) return;

    writeFileSync(reqPath, current.trimEnd() + '\n' + newLines.join('\n') + '\n');
}

function getDbConfig(database, language) {
    if (['JavaScript', 'TypeScript'].includes(language)) {
        return getNodeDbConfig(database, language);
    }

    if (language === 'Python') {
        return getPythonDbConfig(database);
    }

    if (language === 'Java' || language === 'Kotlin') {
        return getJavaDbConfig(database);
    }

    if (language === 'Dart') {
        return getDartDbConfig(database);
    }

    return null;
}

function getNodeDbConfig(database, language) {
    const ext = language === 'TypeScript' ? 'ts' : 'js';

    switch (database) {
        case 'supabase':
            return {
                path: `src/lib/supabase.${ext}`,
                content: `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
`,
            };

        case 'postgresql':
            return {
                path: `src/lib/db.${ext}`,
                content: `import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const query = (text, params) => pool.query(text, params);
export default pool;
`,
            };

        case 'firebase':
            return {
                path: `src/lib/firebase.${ext}`,
                content: `import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
`,
            };

        case 'mongodb':
            return {
                path: `src/lib/mongo.${ext}`,
                content: `import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Missing MONGODB_URI environment variable');
}

export async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(MONGODB_URI);
}

export default mongoose;
`,
            };

        case 'turso':
            return {
                path: `src/lib/turso.${ext}`,
                content: `import { createClient } from '@libsql/client';

export const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});
`,
            };

        case 'oracle':
            return {
                path: `src/lib/oracle.${ext}`,
                content: `import oracledb from 'oracledb';

const pool = await oracledb.createPool({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectionString: process.env.ORACLE_CONNECTION_STRING,
});

export const query = async (sql, params) => {
    const connection = await pool.getConnection();
    try {
        const result = await connection.execute(sql, params);
        return result;
    } finally {
        await connection.close();
    }
};

export default pool;
`,
            };

        case 'insforge':
            return {
                path: `src/lib/insforge.${ext}`,
                content: `import insforge from 'insforge';

export const db = insforge({
    host: process.env.INSFORGE_HOST || 'localhost',
    port: process.env.INSFORGE_PORT || 5432,
    database: process.env.INSFORGE_DATABASE || 'app',
    user: process.env.INSFORGE_USER || 'admin',
    password: process.env.INSFORGE_PASSWORD || '',
});

export default db;
`,
            };

        default:
            return null;
    }
}

function getPythonDbConfig(database) {
    switch (database) {
        case 'supabase':
            return {
                path: 'app/lib/supabase.py',
                content: `import os
from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    raise ValueError("Missing Supabase environment variables")

supabase: Client = create_client(url, key)
`,
            };

        case 'postgresql':
            return {
                path: 'app/lib/database.py',
                content: `import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/app")

engine = create_async_engine(DATABASE_URL, echo=True)
async_session = async_sessionmaker(engine, expire_on_commit=False)


async def get_db():
    async with async_session() as session:
        yield session
`,
            };

        case 'mongodb':
            return {
                path: 'app/lib/database.py',
                content: `import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017/app")

client = AsyncIOMotorClient(MONGODB_URI)
db = client.get_default_database()
`,
            };

        case 'oracle':
            return {
                path: 'app/lib/database.py',
                content: `import os
import oracledb

oracledb.init_oracle_client(lib_dir=os.environ.get("ORACLE_CLIENT_LIB_DIR"))

pool = oracledb.create_pool(
    user=os.environ.get("ORACLE_USER"),
    password=os.environ.get("ORACLE_PASSWORD"),
    dsn=os.environ.get("ORACLE_CONNECTION_STRING"),
    min=1,
    max=5,
    increment=1,
)


def get_connection():
    return pool.acquire()
`,
            };

        case 'firebase':
            return {
                path: 'app/lib/firebase.py',
                content: `import os
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate(os.environ.get("FIREBASE_CREDENTIALS_PATH"))
firebase_admin.initialize_app(cred)

db = firestore.client()
`,
            };

        case 'turso':
            return {
                path: 'app/lib/database.py',
                content: `import os
from libsql_experimental import connect

connection = connect(
    os.environ.get("TURSO_DATABASE_URL"),
    auth_token=os.environ.get("TURSO_AUTH_TOKEN"),
)


def get_connection():
    return connection
`,
            };

        default:
            return null;
    }
}

function getJavaDbConfig(database) {
    switch (database) {
        case 'postgresql':
            return {
                path: 'src/main/resources/application-db.properties',
                content: `# PostgreSQL Configuration
spring.datasource.url=\${DATABASE_URL:jdbc:postgresql://localhost:5432/app}
spring.datasource.username=\${DATABASE_USERNAME:postgres}
spring.datasource.password=\${DATABASE_PASSWORD:postgres}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
`,
            };

        case 'oracle':
            return {
                path: 'src/main/resources/application-db.properties',
                content: `# Oracle Configuration
spring.datasource.url=\${ORACLE_URL:jdbc:oracle:thin:@localhost:1521/XEPDB1}
spring.datasource.username=\${ORACLE_USER:system}
spring.datasource.password=\${ORACLE_PASSWORD:oracle}
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.OracleDialect
`,
            };

        case 'mongodb':
            return {
                path: 'src/main/resources/application-db.properties',
                content: `# MongoDB Configuration
spring.data.mongodb.uri=\${MONGODB_URI:mongodb://localhost:27017/app}
`,
            };

        case 'redis':
            return {
                path: 'src/main/resources/application-db.properties',
                content: `# Redis Configuration
spring.data.redis.host=\${REDIS_HOST:localhost}
spring.data.redis.port=\${REDIS_PORT:6379}
spring.data.redis.password=\${REDIS_PASSWORD:}
`,
            };

        case 'supabase':
            return {
                path: 'src/main/resources/application-supabase.properties',
                content: `# Supabase Configuration
supabase.url=\${SUPABASE_URL}
supabase.key=\${SUPABASE_ANON_KEY}
`,
            };

        case 'firebase':
            return {
                path: 'src/main/resources/application-firebase.properties',
                content: `# Firebase Configuration
firebase.project-id=\${FIREBASE_PROJECT_ID}
firebase.credentials.path=\${FIREBASE_CREDENTIALS_PATH:}
`,
            };

        default:
            return null;
    }
}

function getDartDbConfig(database) {
    switch (database) {
        case 'supabase':
            return {
                path: 'lib/services/supabase_service.dart',
                content: `import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  static Future<void> initialize() async {
    await Supabase.initialize(
      url: const String.fromEnvironment('SUPABASE_URL'),
      anonKey: const String.fromEnvironment('SUPABASE_ANON_KEY'),
    );
  }

  static SupabaseClient get client => Supabase.instance.client;
}
`,
            };

        case 'firebase':
            return {
                path: 'lib/services/firebase_service.dart',
                content: `import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class FirebaseService {
  static Future<void> initialize() async {
    await Firebase.initializeApp();
  }

  static FirebaseFirestore get firestore => FirebaseFirestore.instance;
}
`,
            };

        default:
            return null;
    }
}
