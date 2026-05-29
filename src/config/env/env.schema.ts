import { z } from "zod";


// =============================
// ENVIRONMENT SCHEMA VALIDATION
// =============================

export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(5000),
    APP_NAME: z.string(),
    API_PREFIX: z.string(),
    CLIENT_URL: z.string().min(1),
    DATABASE_URL: z.url(),

    JWT_ACCESS_SECRET: z.string().min(10),
    JWT_ACCESS_EXPIRES_IN: z.string(),
    JWT_REFRESH_SECRET: z.string().min(10),
    JWT_REFRESH_EXPIRES_IN: z.string(),

    REDIS_HOST: z.string().min(1),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASSWORD: z.string().optional().or(z.literal("")),

    MAIL_HOST: z.string(),
    MAIL_PORT: z.coerce.number(),
    MAIL_USER: z.string(),
    MAIL_PASSWORD: z.string(),
    MAIL_FROM: z.string(),

});

export type EnvSchemaType = z.infer<typeof envSchema>