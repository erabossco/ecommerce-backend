import type { EnvSchemaType } from "./env.schema.js";

/**
 * Creates the database configuration object
 * from validated environment variables.
 *
 * This ensures the database connection string
 * is centralised and type-safe.
 */
export const createDatabaseConfig = (env: EnvSchemaType) => ({
    url: env.DATABASE_URL,
});