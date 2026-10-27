import type { ProductImage } from "@prisma/client";
import type { createProductImageSchema, updateProductImageSchema, } from "./product-image.validators.js";
import type { z } from "zod";

// ============================
// PRODUCT IMAGE ENTITY
// ============================

export type ProductImageEntity = ProductImage;

// ============================
// PRODUCT IMAGE DTO TYPES
// ============================

export type CreateProductImageDto = z.infer<typeof createProductImageSchema>;

export type UpdateProductImageDto = z.infer<typeof updateProductImageSchema>;