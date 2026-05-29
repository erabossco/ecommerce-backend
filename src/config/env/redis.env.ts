import type { EnvSchemaType } from "./env.schema.js";

// ==================
// REDIS CONFIG
// ==================

/**
 * Creates and returns the centralized Redis configuration object
 * used across the application for:
 *
 * Redis connection setup
 * Cache configuration
 * Session storage settings
 * Retry strategy configuration
 *
 * @param env - validated environment variables object
 *
 * @returns Redis configuration object containing:
 * host
 * port
 * password
 * connection url
 * cache settings
 * session settings
 * retry settings
 */


export const createRedisConfig = (env: EnvSchemaType) => {
    return {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD,
        url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,

        // 5 minutes
        cache: { defaultTTL: 60 * 5, },

        // 7 days
        session: { ttl: 60 * 60 * 24 * 7, },
        retry: { maxRetriesPerRequest: 3, }
    }
}