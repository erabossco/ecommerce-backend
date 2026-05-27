import "dotenv/config";
import { z } from "zod";


// =============================
// ENVIRONMENT SCHEMA VALIDATION
// =============================

const envSchema = z.object({
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
    REDIS_PORT: z.coerce.number(),
    REDIS_PASSWORD: z.string().optional().or(z.literal("")),

    MAIL_HOST: z.string(),
    MAIL_PORT: z.coerce.number(),
    MAIL_USER: z.string(),
    MAIL_PASSWORD: z.string(),
    MAIL_FROM: z.string(),

});


/**
 * When using safeParse, TypeScript automatically infers
 * the full type from the Zod schema.
 * No need to declare or export a separate envSchemaType.
 */

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    const formattedError = z.treeifyError(parsedEnv.error);
    console.error("Invalid environment variables!");
    console.error(formattedError);
    process.exit(1);
}

// ==========================
// ENVIRONMENT CONFIG (TYPED)
// ==========================

export const envConfig = parsedEnv.data;

// ==============================
// EXPORT MOST USED CONFIG VALUES
// ==============================

export const clientUrls =
    envConfig.CLIENT_URL.split(",")
        .map((e) => e.trim()).filter(Boolean);

export const PORT = envConfig.PORT;

export const NODE_ENV = envConfig.NODE_ENV;