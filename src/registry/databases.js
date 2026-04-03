export const databases = [
    {
        id: 'supabase',
        name: 'Supabase',
        description: 'PostgreSQL + Auth + Storage + Realtime',
        language: 'SQL',
        packages: {
            node: '@supabase/supabase-js',
            python: 'supabase',
            dart: 'supabase_flutter',
        },
    },
    {
        id: 'postgresql',
        name: 'PostgreSQL',
        description: 'Base de datos relacional robusta',
        language: 'SQL',
        packages: {
            node: 'pg',
            python: 'asyncpg',
            java: 'org.postgresql:postgresql',
        },
    },
    {
        id: 'firebase',
        name: 'Firebase',
        description: 'Firestore + Auth + Storage (Google)',
        language: 'NoSQL',
        packages: {
            node: 'firebase',
            python: 'firebase-admin',
            dart: 'firebase_core',
        },
    },
    {
        id: 'mongodb',
        name: 'MongoDB',
        description: 'Base de datos NoSQL orientada a documentos',
        language: 'NoSQL',
        packages: {
            node: 'mongoose',
            python: 'motor',
        },
    },
    {
        id: 'oracle',
        name: 'Oracle SQL',
        description: 'Base de datos empresarial Oracle',
        language: 'SQL',
        packages: {
            node: 'oracledb',
            python: 'oracledb',
            java: 'com.oracle.database.jdbc:ojdbc11',
        },
    },
    {
        id: 'turso',
        name: 'Turso',
        description: 'SQLite distribuido para edge',
        language: 'SQL',
        packages: {
            node: '@libsql/client',
            python: 'libsql-experimental',
        },
    },
    {
        id: 'insforge',
        name: 'Insforge',
        description: 'Base de datos moderna (insforge.dev)',
        language: 'SQL',
        packages: {
            node: 'insforge',
        },
    },
    {
        id: 'redis',
        name: 'Redis',
        description: 'Cache, sessions y mensajería en memoria',
        language: 'Key-Value',
        packages: {
            node: 'ioredis',
            python: 'redis',
            java: 'org.springframework.boot:spring-boot-starter-data-redis',
        },
    },
];

/**
 * Filtra bases de datos compatibles con un stack
 * @param {string[]} compatibleIds
 */
export function getCompatibleDatabases(compatibleIds) {
    if (!compatibleIds || compatibleIds.length === 0) return [];
    return databases.filter((db) => compatibleIds.includes(db.id));
}

/**
 * Busca una base de datos por ID
 * @param {string} dbId
 */
export function findDatabaseById(dbId) {
    return databases.find((db) => db.id === dbId) || null;
}
