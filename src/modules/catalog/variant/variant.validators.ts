import { z } from "zod";

import { ERROR_MESSAGES } from "@/shared/constants/error-messages.js";
import { VARIANT_ERRORS } from "./variant.errors.js";

// =======================
// PRODUCT VARIANT ID
// =======================

export const variantIdSchema = z.object({
    id: z
        .string({
            error: ERROR_MESSAGES.INVALID_VARIANT_ID,
        })
        .trim()
        .regex(/^[a-z][a-z0-9]{23}$/, {
            error: ERROR_MESSAGES.INVALID_VARIANT_ID,
        }),
});

// ============
// PRODUCT ID
// ============

export const variantProductIdSchema = z.object({
    productId: z
        .string({
            error: ERROR_MESSAGES.INVALID_PRODUCT_ID,
        })
        .trim()
        .regex(/^[a-z][a-z0-9]{23}$/, {
            error: ERROR_MESSAGES.INVALID_PRODUCT_ID,
        }),
});

// =================
// VARIANT ID PARAMS
// =================
export const variantIdParamsSchema = variantProductIdSchema.extend({
    id: z
        .string({
            error: ERROR_MESSAGES.INVALID_VARIANT_ID,
        })
        .trim()
        .regex(/^[a-z][a-z0-9]{23}$/, {
            error: ERROR_MESSAGES.INVALID_VARIANT_ID,
        }),
});


// ================
// CREATE VARIANT
// ================
export const createVariantSchema = z.object({
    sku: z
        .string({ error: VARIANT_ERRORS.INVALID_VARIANT_SKU })
        .trim()
        .min(1, { error: VARIANT_ERRORS.INVALID_VARIANT_SKU })
        .max(100, { error: VARIANT_ERRORS.INVALID_VARIANT_SKU }),

    barcode: z
        .string({ error: VARIANT_ERRORS.INVALID_VARIANT_BARCODE })
        .trim()
        .min(1, { error: VARIANT_ERRORS.INVALID_VARIANT_BARCODE })
        .max(100, { error: VARIANT_ERRORS.INVALID_VARIANT_BARCODE })
        .optional(),
    name: z
        .string({ error: VARIANT_ERRORS.INVALID_VARIANT_NAME })
        .trim()
        .min(1, { error: VARIANT_ERRORS.INVALID_VARIANT_NAME })
        .max(100, { error: VARIANT_ERRORS.INVALID_VARIANT_NAME })
        .optional(),

    countryOfOrigin: z
        .string({ error: VARIANT_ERRORS.INVALID_COUNTRY_OF_ORIGIN })
        .trim()
        .min(1, { error: VARIANT_ERRORS.INVALID_COUNTRY_OF_ORIGIN })
        .max(50, { error: VARIANT_ERRORS.INVALID_COUNTRY_OF_ORIGIN })
        .optional(),

    color: z
        .string({ error: VARIANT_ERRORS.INVALID_VARIANT_COLOR })
        .trim()
        .min(1, { error: VARIANT_ERRORS.INVALID_VARIANT_COLOR })
        .max(30, { error: VARIANT_ERRORS.INVALID_VARIANT_COLOR })
        .optional(),

    size: z
        .string({ error: VARIANT_ERRORS.INVALID_VARIANT_SIZE })
        .trim()
        .min(1, { error: VARIANT_ERRORS.INVALID_VARIANT_SIZE })
        .max(30, { error: VARIANT_ERRORS.INVALID_VARIANT_SIZE })
        .optional(),

    weight: z
        .number({ error: VARIANT_ERRORS.INVALID_VARIANT_WEIGHT })
        .positive({ error: VARIANT_ERRORS.INVALID_VARIANT_WEIGHT })
        .optional(),

    length: z
        .number({ error: VARIANT_ERRORS.INVALID_VARIANT_LENGTH })
        .positive({ error: VARIANT_ERRORS.INVALID_VARIANT_LENGTH })
        .optional(),

    width: z
        .number({ error: VARIANT_ERRORS.INVALID_VARIANT_WIDTH })
        .positive({ error: VARIANT_ERRORS.INVALID_VARIANT_WIDTH })
        .optional(),

    height: z
        .number({ error: VARIANT_ERRORS.INVALID_VARIANT_HEIGHT })
        .positive({ error: VARIANT_ERRORS.INVALID_VARIANT_HEIGHT })
        .optional(),

    price: z
        .number({ error: VARIANT_ERRORS.INVALID_VARIANT_PRICE })
        .nonnegative({ error: VARIANT_ERRORS.INVALID_VARIANT_PRICE }),

    costPrice: z
        .number({ error: VARIANT_ERRORS.INVALID_VARIANT_COST_PRICE })
        .nonnegative({ error: VARIANT_ERRORS.INVALID_VARIANT_COST_PRICE })
        .optional(),

    description: z
        .string({ error: VARIANT_ERRORS.INVALID_VARIANT_DESCRIPTION })
        .trim()
        .min(5, { error: VARIANT_ERRORS.INVALID_VARIANT_DESCRIPTION })
        .max(1000, { error: VARIANT_ERRORS.INVALID_VARIANT_DESCRIPTION })
        .optional(),

    isDefault: z
        .boolean({ error: VARIANT_ERRORS.INVALID_VARIANT_DEFAULT })
        .optional(),

    isActive: z
        .boolean({ error: VARIANT_ERRORS.INVALID_VARIANT_ACTIVE })
        .optional(),

    trackInventory: z
        .boolean({ error: VARIANT_ERRORS.INVALID_TRACK_INVENTORY })
        .optional(),
});

// ===============
// UPDATE VARIANT
// ================

export const updateVariantSchema =
    createVariantSchema.partial();

// ============
// SKU
// ============

export const variantSkuSchema = z.object({
    sku: z
        .string({ error: VARIANT_ERRORS.INVALID_VARIANT_SKU })
        .trim()
        .min(1, { error: VARIANT_ERRORS.INVALID_VARIANT_SKU })
        .max(100, { error: VARIANT_ERRORS.INVALID_VARIANT_SKU }),
});

// =============
// BARCODE
// =============

export const variantBarcodeSchema = z.object({
    barcode: z
        .string({ error: VARIANT_ERRORS.INVALID_VARIANT_BARCODE })
        .trim()
        .min(1, { error: VARIANT_ERRORS.INVALID_VARIANT_BARCODE })
        .max(100, { error: VARIANT_ERRORS.INVALID_VARIANT_BARCODE }),
});