import { z } from "zod";

// =============================
// ENVIRONMENT SCHEMA VALIDATION
// =============================

export const envSchema = z.object({

    // App config
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(5000),
    APP_NAME: z.string(),
    API_PREFIX: z.string(),
    CLIENT_URL: z.string().min(1),
    DATABASE_URL: z.url(),

    // JWT auth config
    JWT_ACCESS_SECRET: z.string().min(10),
    JWT_REFRESH_SECRET: z.string().min(10),
    JWT_ACCESS_EXPIRES_IN: z.string().trim().regex(/^\d+[smhd]$/),
    JWT_REFRESH_EXPIRES_IN: z.string().trim().regex(/^\d+[smhd]$/),

    // Bcrypt config
    BCRYPT_SALT_ROUNDS: z.coerce.number().min(10).max(15),

    // Auth config
    RESET_PASSWORD_EXPIRES_IN: z.string().min(1),
    VERIFY_EMAIL_EXPIRES_IN: z.string().min(1),
    MAX_SESSION_PER_USER: z.coerce.number().min(1).max(20),
    SESSION_EXPIRY_DAYS: z.coerce.number().min(1).max(90),

    // Redis cache config
    REDIS_HOST: z.string().min(1),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASSWORD: z.string().optional(),

    // Queue redis config
    QUEUE_REDIS_HOST: z.string(),
    QUEUE_REDIS_PORT: z.coerce.number().default(6379),
    QUEUE_REDIS_PASSWORD: z.string(),
    QUEUE_WORKER_CONCURRENCY: z.coerce.number(),
    QUEUE_MAX_ATTEMPTS: z.coerce.number(),

    // SMTP mail config
    MAIL_HOST: z.string(),
    MAIL_PORT: z.coerce.number(),
    MAIL_USER: z.string(),
    MAIL_PASSWORD: z.string(),
    MAIL_FROM: z.string(),

    // Self-hosted file storage config
    UPLOAD_DIR: z.string().default("uploads"),
    STORAGE_BASE_URL: z.url(),

    // AWS S3 file storage config
    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_BUCKET_NAME: z.string(),

    // Google cloud storage (GCS) config
    GOOGLE_CLOUD_PROJECT_ID: z.string(),
    GOOGLE_CLOUD_CLIENT_EMAIL: z.email(),
    GOOGLE_CLOUD_PRIVATE_KEY: z.string(),
    GOOGLE_CLOUD_STORAGE_BUCKET: z.string(),

    // Payment gateway config
    PAYMENT_PROVIDER: z.enum(["stripe", "sslcommerz", "paypal"]),
    PAYMENT_MODE: z.enum(["sandbox", "live"]),
    PAYMENT_CURRENCY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),

    // Bangladeshi payment gateway config
    SSLCOMMERZ_STORE_ID: z.string(),
    SSLCOMMERZ_STORE_PASSWORD: z.string(),

    // Feature
    FEATURE_SHOP_OPEN: z.coerce.boolean().default(true),
    FEATURE_REGISTRATION: z.coerce.boolean().default(true),
    FEATURE_COUPONS: z.coerce.boolean().default(true),
    FEATURE_PROMOTION: z.coerce.boolean().default(true),
    FEATURE_PRODUCT_CREATION: z.coerce.boolean().default(true),

});

export type EnvSchemaType = z.infer<typeof envSchema>