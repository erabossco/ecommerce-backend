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