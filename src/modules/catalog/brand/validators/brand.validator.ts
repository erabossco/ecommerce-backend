import z from "zod";
import { BRAND_ERRORS } from "../errors/brand-errors.js";
export const createBrandSchema = z.object({
    name: z
        .string({ error: BRAND_ERRORS.INVALID_BRAND_NAME })
        .trim()
        .min(2, { error: BRAND_ERRORS.INVALID_NAME_LIMIT })
        .max(50, { error: BRAND_ERRORS.INVALID_NAME_LIMIT }),

    slug: z
        .string({ error: BRAND_ERRORS.INVALID_BRAND_SLUG })
        .trim()
        .min(2, { error: BRAND_ERRORS.INVALID_SLUG_LIMIT })
        .max(50, { error: BRAND_ERRORS.INVALID_SLUG_LIMIT }),

    description: z
        .string({ error: BRAND_ERRORS.INVALID_BRAND_DESCRIPTION })
        .trim()
        .optional(),

    logoUrl: z
        .url({ error: BRAND_ERRORS.INVALID_BRAND_LOGO_URL })
        .optional(),

    isActive: z
        .boolean()
        .default(true),

});

// ======================
// BRAND ID SCHEMA
// ======================

export const brandIdSchema = z.object({
    // z.cuid2() is not working so used regex
    id: z
        .string({ error: BRAND_ERRORS.INVALID_BRAND_ID })
        .trim()
        .regex(
            /^[a-z][a-z0-9]{23}$/,
            {
                error: BRAND_ERRORS.INVALID_BRAND_ID,
            }
        )
});

// ========================
// BRAND QUERY SCHEMA
// =======================

export const brandQuerySchema = z.object({
    page: z
        .coerce
        .number({ error: BRAND_ERRORS.INVALID_PAGE_NUMBER })
        .int({ error: BRAND_ERRORS.INVALID_PAGE_NUMBER })
        .positive({ error: BRAND_ERRORS.INVALID_PAGE_NUMBER })
        .optional(),

    limit: z
        .coerce
        .number({ error: BRAND_ERRORS.INVALID_BRAND_LIMIT })
        .int({ error: BRAND_ERRORS.INVALID_BRAND_LIMIT })
        .positive({ error: BRAND_ERRORS.INVALID_BRAND_LIMIT })
        .optional(),

    search: z
        .string({ error: BRAND_ERRORS.INVALID_BRAND_SEARCH })
        .trim()
        .optional(),

    isActive: z
        .enum(["true", "false"], { error: BRAND_ERRORS.INVALID_BRAND_ACTIVE_STATUS })
        .transform(val => val === "true")
        .optional(),

    sortBy: z
        .enum(["name", "slug", "createdAt", "sortOrder"], { error: BRAND_ERRORS.INVALID_BRAND_SORTBY })
        .optional(),

    order: z
        .enum(["asc", "desc"], { error: BRAND_ERRORS.INVALID_BRAND_ORDER })
        .optional()
});