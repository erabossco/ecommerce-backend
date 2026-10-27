import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";
import type { Prisma, ProductImage } from "@prisma/client";

// ============================
// PRODUCT IMAGE REPOSITORY
// ============================

export const productImageRepository = {
    // ============================
    // CREATE PRODUCT IMAGE
    // ============================

    async create(data: Prisma.ProductImageCreateInput): Promise<ProductImage> {
        return prisma.productImage.create({
            data,
        });
    },

    // ============================
    // CREATE IMAGE WITH PRIMARY HANDLING
    // ============================

    async createWithPrimaryHandling(variantId: string, data: Omit<Prisma.ProductImageCreateInput, "variant">): Promise<ProductImage> {

        return prisma.$transaction(async (tx) => {
            if (data.isPrimary) {
                await tx.productImage.updateMany({
                    where: {
                        variantId,
                        isPrimary: true,
                    },
                    data: {
                        isPrimary: false,
                    },
                });
            }

            return tx.productImage.create({
                data: {
                    ...data,
                    variant: {
                        connect: { id: variantId },
                    },
                },
            });
        });
    },

    // ============================
    // FIND IMAGE BY ID
    // ============================

    async findById(id: string): Promise<ProductImage | null> {
        return prisma.productImage.findUnique({
            where: { id },
        });
    },

    // ============================
    // FIND IMAGE BY ID AND VARIANT
    // ============================

    async findByIdAndVariant(id: string, variantId: string): Promise<ProductImage | null> {
        return prisma.productImage.findFirst({
            where: {
                id,
                variantId,
            },
        });
    },

    // ============================
    // FIND ALL IMAGES BY VARIANT
    // ============================

    async findByVariant(variantId: string): Promise<ProductImage[]> {
        return prisma.productImage.findMany({
            where: { variantId },
            orderBy: [
                { sortOrder: "asc" },
                { createdAt: "asc" },
            ],
        });
    },

    // ============================
    // FIND VARIANT BY PRODUCT
    // ============================

    async findVariant(productId: string, variantId: string): Promise<{ id: string } | null> {
        return prisma.productVariant.findFirst({
            where: {
                id: variantId,
                productId,
                deletedAt: null,
            },
            select: {
                id: true,
            },
        });
    },

    // ============================
    // FIND PRIMARY IMAGE BY VARIANT
    // ============================

    async findPrimaryByVariant(variantId: string): Promise<ProductImage | null> {
        return prisma.productImage.findFirst({
            where: {
                variantId,
                isPrimary: true,
            },
        });
    },

    // ============================
    // UPDATE PRODUCT IMAGE
    // ============================
    // ============================
    // UPDATE PRODUCT IMAGE
    // ============================

    async update(imageId: string, variantId: string, data: Prisma.ProductImageUpdateInput): Promise<ProductImage> {
        return prisma.$transaction(async (tx) => {
            if (data.isPrimary === true) {
                await tx.productImage.updateMany({
                    where: {
                        variantId,
                        isPrimary: true,
                        id: { not: imageId },
                    },
                    data: { isPrimary: false },
                });
            }

            return tx.productImage.update({
                where: { id: imageId },
                data,
            });
        });
    },

    // ============================
    // DELETE PRODUCT IMAGE
    // ============================

    async delete(imageId: string, variantId: string, isPrimary: boolean): Promise<ProductImage> {
        return prisma.$transaction(async (tx) => {
            const deletedImage = await tx.productImage.delete({
                where: { id: imageId },
            });

            if (isPrimary) {
                const nextImage = await tx.productImage.findFirst({
                    where: { variantId },
                    orderBy: [
                        { sortOrder: "asc" },
                        { createdAt: "asc" },
                        { id: "asc" },
                    ],
                });

                if (nextImage) {
                    await tx.productImage.update({
                        where: { id: nextImage.id },
                        data: { isPrimary: true },
                    });
                }
            }

            return deletedImage;
        });
    },

    // ============================
    // COUNT IMAGES BY VARIANT
    // ============================

    async countByVariant(variantId: string): Promise<number> {
        return prisma.productImage.count({
            where: { variantId },
        });
    },
};