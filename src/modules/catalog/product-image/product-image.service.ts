import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";
import { productImageRepository } from "./product-image.repository.js";
import { NotFoundError } from "@/shared/errors/not-found.error.js";
import { PRODUCT_IMAGE_ERRORS } from "./product-image.errors.js";
import type { ProductImage } from "@prisma/client";
import type { CreateProductImageDto, UpdateProductImageDto } from "./product-image.types.js";

// ============================
// PRODUCT IMAGE SERVICE
// ============================

export const productImageService = {
    // ============================
    // CREATE PRODUCT IMAGE
    // ============================
    async create(productId: string, variantId: string, data: CreateProductImageDto): Promise<ProductImage> {
        const variant = await productImageRepository.findVariant(productId, variantId);

        if (!variant) {
            throw new NotFoundError(PRODUCT_IMAGE_ERRORS.VARIANT_NOT_FOUND);
        }

        const imageCount = await productImageRepository.countByVariant(variantId);
        const isPrimary = data.isPrimary ?? imageCount === 0;

        return productImageRepository.createWithPrimaryHandling(
            variantId,
            {
                imageUrl: data.imageUrl,
                ...(data.altText !== undefined && { altText: data.altText }),
                isPrimary,
                sortOrder: data.sortOrder ?? 0,
            }
        );
    },

    // ============================
    // GET ALL IMAGES BY VARIANT
    // ============================

    async findByVariant(productId: string, variantId: string): Promise<ProductImage[]> {
        const variant = await prisma.productVariant.findFirst({
            where: {
                id: variantId,
                productId,
                deletedAt: null,
            },
        });

        if (!variant) {
            throw new NotFoundError(PRODUCT_IMAGE_ERRORS.VARIANT_NOT_FOUND);
        }

        return productImageRepository.findByVariant(variantId);
    },

    // ============================
    // GET IMAGE BY ID
    // ============================

    async findById(productId: string, variantId: string, imageId: string): Promise<ProductImage> {
        const variant = await prisma.productVariant.findFirst({
            where: {
                id: variantId,
                productId,
                deletedAt: null,
            },
        });

        if (!variant) {
            throw new NotFoundError(PRODUCT_IMAGE_ERRORS.VARIANT_NOT_FOUND);
        }

        const image = await productImageRepository.findByIdAndVariant(imageId, variantId);

        if (!image) {
            throw new NotFoundError(PRODUCT_IMAGE_ERRORS.IMAGE_NOT_FOUND);
        }

        return image;
    },

    // ============================
    // UPDATE PRODUCT IMAGE
    // ============================

    async update(productId: string, variantId: string, imageId: string, data: UpdateProductImageDto): Promise<ProductImage> {
        await this.findById(productId, variantId, imageId);

        return productImageRepository.update(imageId, variantId, {
            ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl, }),
            ...(data.altText !== undefined && { altText: data.altText, }),
            ...(data.isPrimary !== undefined && { isPrimary: data.isPrimary, }),
            ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder, }),
        });
    },

    // ============================
    // DELETE PRODUCT IMAGE
    // ============================

    async delete(productId: string, variantId: string, imageId: string): Promise<ProductImage> {
        const image = await this.findById(productId, variantId, imageId);

        return productImageRepository.delete(
            imageId,
            variantId,
            image.isPrimary
        );
    },
};