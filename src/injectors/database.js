import { join } from 'node:path';
import { writeFileSafe } from '../utils/fs-helpers.js';

/**
 * Inyecta configuración de base de datos
 */
export async function inject(projectPath, config) {
    if (!config.database) return;

    const language = config.isDecoupled
        ? config.backend?.language
        : config.language;

    const dbConfig = getDbConfig(config.database, language);

    if (dbConfig) {
        await writeFileSafe(join(projectPath, dbConfig.path), dbConfig.content);
    }
}

function getDbConfig(database, language) {
    if (['JavaScript', 'TypeScript'].includes(language)) {
        return getNodeDbConfig(database, language);
    }

    if (language === 'Python') {
        return getPythonDbConfig(database);
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

        default:
            return null;
    }
}
