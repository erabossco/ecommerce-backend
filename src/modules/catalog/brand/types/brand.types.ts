import z from "zod";
import type { brandQuerySchema, createBrandSchema, updateBrandSchema } from "../validators/brand.validator.js";
import type { Brand } from "@prisma/client";
import type { PaginationMeta } from "@/shared/types/api-response.types.js";

export type CreateBrandDto = z.infer<typeof createBrandSchema>;

export type BrandQueryDto = z.infer<typeof brandQuerySchema>;

export interface BrandList {
    data: Brand[];
    meta: PaginationMeta;
}

export type UpdateBrandDto = z.infer<typeof updateBrandSchema>;