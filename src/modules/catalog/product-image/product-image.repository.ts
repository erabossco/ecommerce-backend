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

    async update(id: string, data: Prisma.ProductImageUpdateInput): Promise<ProductImage> {
        return prisma.productImage.update({
            where: { id },
            data,
        });
    },

    // ============================
    // DELETE PRODUCT IMAGE
    // ============================

    async delete(id: string): Promise<ProductImage> {
        return prisma.productImage.delete({
            where: { id },
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