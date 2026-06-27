import { z } from "zod";

import { createCategorySchema, updateCategorySchema, } from "../validators/category.validator.js";

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;

export interface CategoryQuery {
    page?: number;
    limit?: number;
    search?: string;
    parentId?: string | null;
    isActive?: boolean;
    sortBy?: string;
    order?: "asc" | "desc";
}