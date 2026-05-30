import type { EnvSchemaType } from "./env.schema.js";


/**
 * Feature environment configuration
 * 
 * @param env - validated environment variables containing feature flags
 * 
 * @returns feature config object used to enable or disable
 * - registration
 * - coupons
 * - promotional activity
 */

export const createFeatureConfig = (env: EnvSchemaType) => ({
    open: env.FEATURE_SHOP_OPEN,
    registration: env.FEATURE_REGISTRATION,
    coupons: env.FEATURE_COUPONS,
    promotions: env.FEATURE_PROMOTION,
    productCreation: env.FEATURE_PRODUCT_CREATION,
});