import { z } from "zod";
import type { Category } from "@prisma/client";

import { categoryQuerySchema, createCategorySchema, updateCategorySchema, } from "../validators/category.validator.js";
import type { PaginationMeta } from "@/shared/types/api-response.types.js";
import type { categoryIdSchema } from "@/shared/validators/common.validator.js";

export type CategoryIdDto = z.infer<typeof categoryIdSchema>

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;

export type CategoryQueryDto = z.infer<typeof categoryQuerySchema>

export interface CategoryList {
    data: Category[],
    meta: PaginationMeta,
}