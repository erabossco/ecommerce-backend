import type { EnvSchemaType } from "./env.schema.js";


/**
 * Creates payment configuration
 * 
 * Stripe for international transactions
 * 
 * SSLCommerz for BANGLADESHI payment gateway integration
 * 
 * @param env - validated environment variables containing payment settings
 * 
 * @returns payment config object including provider, mode, currency, stripe and sslcommerz
 */
export const createPaymentConfig = (env: EnvSchemaType) => ({
    provider: env.PAYMENT_PROVIDER,
    mode: env.PAYMENT_MODE,
    currency: env.PAYMENT_CURRENCY,

    stripe: {
        secretKey: env.STRIP_SECRET_KEY,
        webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    },
    sslcommerz: {
        storeId: env.SSLCOMMERZ_STORE_ID,
        storePassword: env.SSLCOMMERZ_STORE_PASSWORD,
    },
});