import { z } from "zod";

import { categoryIdSchema, categoryQuerySchema, createCategorySchema, updateCategorySchema, } from "../validators/category.validator.js";

export type CategoryIdDto = z.infer<typeof categoryIdSchema>

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;

export type CategoryQueryDto = z.infer<typeof categoryQuerySchema>


export interface ListResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
        previousPage: number | null;
        nextPage: number | null;
    };
}