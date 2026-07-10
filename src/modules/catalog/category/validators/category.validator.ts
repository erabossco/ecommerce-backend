import { z } from "zod";

import { CATEGORY } from "../constants/category.constants.js";


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

export const CategoryQuerySchema = z.object({
    page: z
        .coerce
        .number()
        .int()
        .positive()
        .optional(),

    limit: z
        .number()
        .int()
        .positive()
        .optional(),

    search: z
        .string()
        .trim()
        .optional(),

    parentId: z
        .string()
        .trim()
        .nullable()
        .optional(),

    isActive: z
        .boolean()
        .optional(),

    sortBy: z.string().trim().optional(),

    order: z
        .enum(["asc", "desc"])
        .optional()
});