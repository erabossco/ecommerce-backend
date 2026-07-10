import { z } from "zod";

import { CATEGORY } from "../constants/category.constants.js";
import { ERROR_MESSAGES } from "@/shared/constants/error-message.js";


// =============================
// CREATE CATEGORY SCHEMA
// =============================

export const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(CATEGORY.NAME.MIN_LENGTH)
        .max(CATEGORY.NAME.MAX_LENGTH),

    slug: z
        .string()
        .trim()
        .min(CATEGORY.SLUG.MIN_LENGTH)
        .max(CATEGORY.SLUG.MAX_LENGTH)
        .regex(/^[a-z0-9-]+$/),

    description: z
        .string()
        .trim()
        .max(CATEGORY.DESCRIPTION.MAX_LENGTH)
        .optional(),

    imageUrl: z
        .url()
        .max(CATEGORY.IMAGE_URL.MAX_LENGTH)
        .optional(),

    parentId: z
        .cuid2()
        .nullable()
        .optional(),

    isActive: z
        .boolean()
        .default(true),
    sortOrder: z
        .number()
        .int()
        .min(CATEGORY.SORT_ORDER.MIN)
        .default(0),

    metaTitle: z
        .string()
        .trim()
        .max(CATEGORY.META_TITLE.MAX_LENGTH)
        .optional(),

    metaDescription: z
        .string()
        .trim()
        .max(CATEGORY.META_DESCRIPTION.MAX_LENGTH)
        .optional(),
});


// ===============================
// UPDATE CATEGORY SCHEMA
// ===============================

export const updateCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(CATEGORY.NAME.MIN_LENGTH)
        .max(CATEGORY.NAME.MAX_LENGTH)
        .optional(),

    slug: z
        .string()
        .trim()
        .min(CATEGORY.SLUG.MIN_LENGTH)
        .max(CATEGORY.SLUG.MAX_LENGTH)
        .regex(/^[a-z0-9-]+$/)
        .optional(),

    description: z
        .string()
        .trim()
        .max(CATEGORY.DESCRIPTION.MAX_LENGTH)
        .optional(),

    imageUrl: z
        .url()
        .max(CATEGORY.IMAGE_URL.MAX_LENGTH)
        .optional(),

    parentId: z
        .cuid2()
        .nullable()
        .optional(),

    isActive: z
        .boolean()
        .optional(),

    sortOrder: z
        .number()
        .int()
        .min(CATEGORY.SORT_ORDER.MIN)
        .optional(),

    metaTitle: z
        .string()
        .trim()
        .max(CATEGORY.META_TITLE.MAX_LENGTH)
        .optional(),

    metaDescription: z
        .string()
        .trim()
        .max(CATEGORY.META_DESCRIPTION.MAX_LENGTH)
        .optional(),
});

// ========================
// CATEGORY QUERY SCHEMA
// =======================

export const categoryQuerySchema = z.object({
    page: z
        .coerce
        .number({ error: ERROR_MESSAGES.INVALID_PAGE_NUMBER })
        .int({ error: ERROR_MESSAGES.INVALID_PAGE_NUMBER })
        .positive({ error: ERROR_MESSAGES.INVALID_PAGE_NUMBER })
        .optional(),

    limit: z
        .coerce
        .number({ error: ERROR_MESSAGES.INVALID_CATEGORY_LIMIT })
        .int({ error: ERROR_MESSAGES.INVALID_CATEGORY_LIMIT })
        .positive({ error: ERROR_MESSAGES.INVALID_CATEGORY_LIMIT })
        .optional(),

    search: z
        .string({ error: ERROR_MESSAGES.INVALID_CATEGORY_SEARCH })
        .trim()
        .optional(),

    parentId: z
        .string({ error: ERROR_MESSAGES.INVALID_PARENT_ID })
        .trim()
        .regex(
            /^[a-z][a-z0-9]{23}$/,
            {
                error: ERROR_MESSAGES.INVALID_PARENT_ID,
            }
        )
        .optional(),

    isActive: z
        .enum(["true", "false"], { error: ERROR_MESSAGES.INVALID_CATEGORY_ACTIVE_STATUS })
        .transform(val => val === "true")
        .optional(),

    sortBy: z
        .enum(["name", "slug", "createdAt", "sortOrder"], { error: ERROR_MESSAGES.INVALID_CATEGORY_SORTBY })
        .optional(),

    order: z
        .enum(["asc", "desc"], { error: ERROR_MESSAGES.INVALID_CATEGORY_ORDER })
        .optional()
});