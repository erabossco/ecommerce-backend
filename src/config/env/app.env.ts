import type { EnvSchemaType } from "./env.schema.js";

/**
 * Builds the application configuration object
 * from validated environment variables.
 *
 * Centralizes application-level runtime settings,
 * feature flags, request limits, and environment helpers.
 */
export const createAppConfig = (env: EnvSchemaType) => ({
    name: env.APP_NAME,
    env: env.NODE_ENV,
    port: env.PORT,
    apiPrefix: env.API_PREFIX,
    clientUrl: env.CLIENT_URL.split(",").map((e) => e.trim()).filter(Boolean),
    isProduction: env.NODE_ENV === "production",
    isDevelopment: env.NODE_ENV === "development",
    isTest: env.NODE_ENV === "test",
    pagination: {
        defaultPageSize: 20,
        maxPageSize: 100,
    },
    request: {
        bodyLimit: "10kb",
    },
    features: {
        enableSwagger: true,
        enableQueues: true,
    }
});