import { z } from "zod";
import { PRODUCT_IMAGE_ERRORS } from "./product-image.errors.js";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages.js";

// ============================
// PRODUCT IMAGE PARAMS SCHEMAS
// ============================

export const productImageParamsSchema = z.object({
    productId: z
        .string()
        .min(1, PRODUCT_IMAGE_ERRORS.PRODUCT_ID_REQUIRED)
        .regex(/^[a-z][a-z0-9]{23}$/, ERROR_MESSAGES.INVALID_PRODUCT_ID),

    variantId: z
        .string()
        .min(1, PRODUCT_IMAGE_ERRORS.VARIANT_ID_REQUIRED)
        .regex(/^[a-z][a-z0-9]{23}$/, ERROR_MESSAGES.INVALID_VARIANT_ID),
});

export const productImageIdParamsSchema = productImageParamsSchema.extend({
    imageId: z
        .string()
        .min(1, PRODUCT_IMAGE_ERRORS.IMAGE_ID_REQUIRED)
        .regex(/^[a-z][a-z0-9]{23}$/, ERROR_MESSAGES.INVALID_IMAGE_ID),
});

// ============================
// CREATE PRODUCT IMAGE SCHEMA
// ============================

export const createProductImageSchema = z.object({
    imageUrl: z
        .url({ error: PRODUCT_IMAGE_ERRORS.INVALID_IMAGE_URL }),
    altText: z
        .string()
        .trim()
        .max(255, PRODUCT_IMAGE_ERRORS.IMAGE_ALT_TEXT_TOO_LONG)
        .optional(),
    isPrimary: z
        .boolean()
        .optional(),
    sortOrder: z
        .number()
        .int()
        .min(0, PRODUCT_IMAGE_ERRORS.INVALID_SORT_ORDER)
        .optional(),
});

// ============================
// UPDATE PRODUCT IMAGE SCHEMA
// ============================

export const updateProductImageSchema = z
    .object({
        imageUrl: z
            .url({ error: PRODUCT_IMAGE_ERRORS.INVALID_IMAGE_URL })
            .optional(),
        altText: z
            .string()
            .trim()
            .max(255, PRODUCT_IMAGE_ERRORS.IMAGE_ALT_TEXT_TOO_LONG)
            .nullable()
            .optional(),
        isPrimary: z
            .boolean()
            .optional(),
        sortOrder: z
            .number()
            .int()
            .min(0, PRODUCT_IMAGE_ERRORS.INVALID_SORT_ORDER)
            .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        error: PRODUCT_IMAGE_ERRORS.IMAGE_DATA_REQUIRED,
    });

// ============================
// PRODUCT IMAGE ID SCHEMA
// ============================

export const productImageIdSchema = z.object({
    imageId: z
        .string()
        .min(1, PRODUCT_IMAGE_ERRORS.IMAGE_ID_REQUIRED),
});