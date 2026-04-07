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
