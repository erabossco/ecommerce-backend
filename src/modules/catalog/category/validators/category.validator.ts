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
        .uuid()
        .nullable()
        .optional(),

    isActive: z
        .boolean()
        .default(true),
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
        .uuid()
        .nullable()
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});