import { z } from "zod";
import { PRODUCT_IMAGE_ERRORS } from "./product-image.errors.js";

export const productImageIdSchema = z.object({
    id: z.string().regex(
        /^[a-z][a-z0-9]{23}$/,
        PRODUCT_IMAGE_ERRORS.INVALID_PRODUCT_IMAGE_ID
    ),
});

export const productImageProductIdSchema = z.object({
    productId: z
        .string()
        .regex(
            /^[a-z][a-z0-9]{23}$/,
            PRODUCT_IMAGE_ERRORS.INVALID_PRODUCT_ID
        ),
});

export const createProductImageSchema = z.object({
    productId: z
        .string()
        .regex(
            /^[a-z][a-z0-9]{23}$/,
            PRODUCT_IMAGE_ERRORS.INVALID_PRODUCT_ID
        ),

    imageUrl: z
        .url({ error: PRODUCT_IMAGE_ERRORS.IMAGE_URL_INVALID })
        .trim()
        .min(5, { error: PRODUCT_IMAGE_ERRORS.IMAGE_URL_INVALID, }),

    altText: z
        .string()
        .trim()
        .optional(),

    isPrimary: z
        .boolean()
        .optional(),

    sortOrder: z
        .number({ error: PRODUCT_IMAGE_ERRORS.SORT_ORDER_INVALID })
        .int()
        .nonnegative({
            error: PRODUCT_IMAGE_ERRORS.SORT_ORDER_INVALID,
        })
        .optional(),
});

export const updateProductImageSchema = z.object({
    imageUrl: z
        .url({ error: PRODUCT_IMAGE_ERRORS.IMAGE_URL_REQUIRED, })
        .trim()
        .min(5, { error: PRODUCT_IMAGE_ERRORS.IMAGE_URL_REQUIRED, })
        .optional(),

    altText: z
        .string()
        .trim()
        .optional(),

    isPrimary: z
        .boolean()
        .optional(),

    sortOrder: z
        .number({ error: PRODUCT_IMAGE_ERRORS.SORT_ORDER_INVALID })
        .int()
        .nonnegative({ error: PRODUCT_IMAGE_ERRORS.SORT_ORDER_INVALID, })
        .optional(),
});