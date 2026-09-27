import { NotFoundError } from "@/shared/errors/index.js";
import { productImageRepository } from "./product-image.repository.js";
import { PRODUCT_IMAGE_ERRORS } from "./product-image.errors.js";
import type { CreateProductImageDto, UpdateProductImageDto } from "./product-image.types.js";
import type { ProductImage } from "@prisma/client";

class ProductImageService {

    //=======================
    // CREATE PRODUCT IMAGE
    //=======================

    async create(data: CreateProductImageDto): Promise<ProductImage> {

        // Replace the existing primary image
        // when a new primary image is provided.
        if (data.isPrimary === true) {
            const existingPrimary = await productImageRepository.findPrimaryByProductId(
                data.productId
            );

            if (existingPrimary) {
                return await productImageRepository.update(
                    existingPrimary.id,
                    {
                        imageUrl: data.imageUrl,
                        ...(data.altText !== undefined && { altText: data.altText, }),
                        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder, }),
                    }
                );
            }
        }

        return await productImageRepository.create({
            product: {
                connect: {
                    id: data.productId,
                },
            },
            imageUrl: data.imageUrl,
            ...(data.altText !== undefined && { altText: data.altText, }),
            isPrimary: data.isPrimary ?? false,
            sortOrder: data.sortOrder ?? 0,
        });
    }


    //================================
    // GET PRODUCT IMAGE BY IMAGE ID
    //================================

    async getById(id: string): Promise<ProductImage> {
        const image = await productImageRepository.findById(id);

        if (!image) {
            throw new NotFoundError(PRODUCT_IMAGE_ERRORS.PRODUCT_IMAGE_NOT_FOUND);
        }

        return image;
    }


    //==================================
    // GET PRODUCT IMAGES BY PRODUCT ID
    //==================================

    async getByProductId(productId: string): Promise<ProductImage[]> {
        return await productImageRepository.findByProductId(
            productId
        );
    }


    //=======================
    // UPDATE PRODUCT IMAGE
    //=======================

    async update(id: string, data: UpdateProductImageDto): Promise<ProductImage> {

        const image = await productImageRepository.findById(id);

        if (!image) {
            throw new NotFoundError(PRODUCT_IMAGE_ERRORS.PRODUCT_IMAGE_NOT_FOUND);
        }

        // Replace the existing primary image
        // when this image is being made primary.

        if (data.isPrimary === true && !image.isPrimary) {

            const existingPrimary = await productImageRepository.findPrimaryByProductId(
                image.productId
            );

            if (existingPrimary) {
                return await productImageRepository.update(
                    existingPrimary.id,
                    {
                        imageUrl: data.imageUrl ?? image.imageUrl,
                        ...(data.altText !== undefined && { altText: data.altText, }),
                        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder, }),
                    }
                );
            }
        }

        return await productImageRepository.update(
            id,
            {
                ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl, }),
                ...(data.altText !== undefined && { altText: data.altText, }),
                ...(data.isPrimary !== undefined && { isPrimary: data.isPrimary, }),
                ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder, }),
            }
        );
    }


    //============================
    // DELETE PRODUCT IMAGE BY ID
    //============================

    async delete(id: string): Promise<ProductImage> {

        const image = await productImageRepository.findById(id);

        if (!image) {
            throw new NotFoundError(PRODUCT_IMAGE_ERRORS.PRODUCT_IMAGE_NOT_FOUND);
        }

        return await productImageRepository.delete(id);
    }
}


export const productImageService =
    new ProductImageService();