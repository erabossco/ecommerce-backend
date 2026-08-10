import z from "zod";
import type { brandIdSchema, categoryIdSchema, createProductSchema, productQuerySchema, updateProductSchema } from "../validators/product.validator.js";
import type { Product } from "@prisma/client";
import type { PaginationMeta } from "@/shared/types/api-response.types.js";

export type CreateProductDto = z.infer<typeof createProductSchema>;

export type UpdateProductDto = z.infer<typeof updateProductSchema>;

export type ProductQueryDto = z.infer<typeof productQuerySchema>;

export interface ProductList {
    data: Product[];
    meta: PaginationMeta;
};

export type BrandIdDto = z.infer<typeof brandIdSchema>;

export type CategoryIdDto = z.infer<typeof categoryIdSchema>;