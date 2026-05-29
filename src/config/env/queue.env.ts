import type { EnvSchemaType } from "./env.schema.js";


/**
 * Creates queue configuration for background job processing
 * 
 * @param env - validated environment variables containing queue and redis settings
 * 
 * @returns queue redis config object with redis connection, worker concurrency and retry attempt setting
 */
export const createQueueConfig = (env: EnvSchemaType) => ({
    redis: {
        host: env.QUEUE_REDIS_HOST,
        port: env.QUEUE_REDIS_PORT,
        password: env.QUEUE_REDIS_PASSWORD,
    },
    worker: {
        concurrency: env.QUEUE_WORKER_CONCURRENCY,
        maxAttempts: env.QUEUE_MAX_ATTEMPTS,
    },
});