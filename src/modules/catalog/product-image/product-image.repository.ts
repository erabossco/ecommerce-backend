// src/modules/catalog/product-image/product-image.repository.ts

import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";
import type { ProductImage, Prisma } from "@prisma/client";

class ProductImageRepository {

    //=======================
    // STORE PRODUCT IMAGE
    //=======================

    async create(data: Prisma.ProductImageCreateInput): Promise<ProductImage> {
        return await prisma.productImage.create({
            data,
        });
    }


    //================================
    // FIND PRODUCT IMAGE BY IMAGE ID
    //================================

    async findById(id: string): Promise<ProductImage | null> {
        return await prisma.productImage.findUnique({
            where: {
                id,
            },
        });
    }


    //==================================
    // FIND PRODUCT IMAGE BY PRODUCT ID
    //==================================

    async findByProductId(productId: string): Promise<ProductImage[]> {
        return await prisma.productImage.findMany({
            where: {
                productId,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });
    }


    //==========================================
    // FIND PRIMARY PRODUCT IMAGE BY PRODUCT ID
    //==========================================

    async findPrimaryByProductId(productId: string): Promise<ProductImage | null> {
        return await prisma.productImage.findFirst({
            where: {
                productId,
                isPrimary: true,
            },
        });
    }


    //=======================
    // UPDATE PRODUCT IMAGE
    //=======================

    async update(id: string, data: Prisma.ProductImageUpdateInput): Promise<ProductImage> {
        return await prisma.productImage.update({
            where: {
                id,
            },
            data,
        });
    }


    //============================
    // DELETE PRODUCT IMAGE BY ID
    //============================

    async delete(id: string): Promise<ProductImage> {
        return await prisma.productImage.delete({
            where: {
                id,
            },
        });
    }
}


export const productImageRepository = new ProductImageRepository();