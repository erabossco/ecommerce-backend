import z from "zod";
import { ERROR_MESSAGES } from "../constants/error-messages.js";
import { BRAND_ERRORS } from "@/modules/catalog/brand/errors/brand-errors.js";
import { CATEGORY_ERRORS } from "@/modules/catalog/category/errors/category-errors.js";

// ======================
// BRAND ID SCHEMA
// ======================

export const brandIdSchema = z.object({
    // z.cuid2() is not working so used regex
    id: z
        .string({ error: ERROR_MESSAGES.INVALID_BRAND_ID })
        .trim()
        .regex(
            /^[a-z][a-z0-9]{23}$/,
            {
                error: ERROR_MESSAGES.INVALID_BRAND_ID,
            }
        )
});

// ======================
// CATEGORY ID SCHEMA
// ======================

export const categoryIdSchema = z.object({
    // z.cuid2() is not working so used regex
    id: z
        .string({ error: ERROR_MESSAGES.INVALID_CATEGORY_ID })
        .trim()
        .regex(
            /^[a-z][a-z0-9]{23}$/,
            {
                error: ERROR_MESSAGES.INVALID_CATEGORY_ID,
            }
        )
});

// ======================
// PRODUCT ID SCHEMA
// ======================

export const productIdSchema = z.object({
    // z.cuid2() is not working so used regex
    id: z
        .string({ error: ERROR_MESSAGES.INVALID_PRODUCT_ID })
        .trim()
        .regex(
            /^[a-z][a-z0-9]{23}$/,
            {
                error: ERROR_MESSAGES.INVALID_PRODUCT_ID,
            }
        )
});