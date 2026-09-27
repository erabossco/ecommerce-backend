import type { ProductImage } from "@prisma/client";

export type ProductImageResponse = ProductImage;

export interface CreateProductImageDto {
    productId: string;
    imageUrl: string;
    altText?: string;
    isPrimary?: boolean;
    sortOrder?: number;
}

export interface UpdateProductImageDto {
    imageUrl?: string;
    altText?: string;
    isPrimary?: boolean;
    sortOrder?: number;
}