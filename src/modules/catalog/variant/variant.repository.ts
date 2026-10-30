
import { Prisma } from "@prisma/client";
import type { ProductVariant } from "@prisma/client";

import { prisma } from "@/infrastructure/database/prisma/prisma.client.js";
import { NotFoundError } from "@/shared/errors/not-found.error.js";
import { ConflictError } from "@/shared/errors/conflict.error.js";
import { VARIANT_ERRORS } from "./variant.errors.js";

// ====================
// VARIANT REPOSITORY
// ====================

class VariantRepository {

    // CREATE VARIANT

    async create(data: Prisma.ProductVariantCreateInput): Promise<ProductVariant> {
        return prisma.productVariant.create({
            data,
        });
    }


    // CREATE DEFAULT VARIANT

    async createAsDefault(productId: string, data: Prisma.ProductVariantCreateInput): Promise<ProductVariant> {
        if (data.isActive === false) {
            throw new ConflictError(VARIANT_ERRORS.VARIANT_INACTIVE);
        }

        return prisma.$transaction(async (tx) => {
            await tx.productVariant.updateMany({
                where: {
                    productId,
                    isDefault: true,
                    deletedAt: null,
                },
                data: {
                    isDefault: false,
                },
            });

            return tx.productVariant.create({
                data,
            });
        });
    }


    // FIND VARIANT BY ID

    async findById(variantId: string): Promise<ProductVariant | null> {
        return prisma.productVariant.findFirst({
            where: {
                id: variantId,
                deletedAt: null,
            },
        });
    }


    // FIND VARIANT BY ID AND PRODUCT

    async findByIdAndProduct(productId: string, variantId: string): Promise<ProductVariant | null> {
        return prisma.productVariant.findFirst({
            where: {
                productId,
                id: variantId,
                deletedAt: null,
            },
        });
    }


    // FIND VARIANT BY ID INCLUDING DELETED

    async findByIdIncludingDeleted(variantId: string): Promise<ProductVariant | null> {
        return prisma.productVariant.findUnique({
            where: {
                id: variantId,
            },
        });
    }


    // FIND VARIANT BY ID AND PRODUCT INCLUDING DELETED

    async findByIdAndProductIncludingDeleted(productId: string, variantId: string): Promise<ProductVariant | null> {
        return prisma.productVariant.findFirst({
            where: {
                productId,
                id: variantId,
            },
        });
    }


    // FIND VARIANT BY SKU

    async findBySku(sku: string): Promise<ProductVariant | null> {
        return prisma.productVariant.findFirst({
            where: {
                sku,
                deletedAt: null,
            },
        });
    }


    // FIND VARIANT BY BARCODE

    async findByBarcode(barcode: string): Promise<ProductVariant | null> {
        return prisma.productVariant.findFirst({
            where: {
                barcode,
                deletedAt: null,
            },
        });
    }


    // FIND VARIANT BY PRODUCT AND SKU

    async findByProductAndSku(productId: string, sku: string): Promise<ProductVariant | null> {
        return prisma.productVariant.findFirst({
            where: {
                productId,
                sku,
                deletedAt: null,
            },
        });
    }


    // FIND ALL VARIANTS

    async findAll(): Promise<ProductVariant[]> {
        return prisma.productVariant.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }


    // FIND VARIANTS BY PRODUCT

    async findByProduct(productId: string): Promise<ProductVariant[]> {
        return prisma.productVariant.findMany({
            where: {
                productId,
                deletedAt: null,
            },
            orderBy: [
                { isDefault: "desc" },
                { createdAt: "asc" },
            ],
        });
    }


    // FIND ACTIVE VARIANTS

    async findAllActive(): Promise<ProductVariant[]> {
        return prisma.productVariant.findMany({
            where: {
                isActive: true,
                deletedAt: null,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }


    // FIND ACTIVE VARIANTS BY PRODUCT

    async findActiveByProduct(productId: string): Promise<ProductVariant[]> {
        return prisma.productVariant.findMany({
            where: {
                productId,
                isActive: true,
                deletedAt: null,
            },
            orderBy: [
                { isDefault: "desc" },
                { createdAt: "asc" },
            ],
        });
    }


    // FIND DEFAULT VARIANT BY PRODUCT

    async findDefaultByProduct(productId: string): Promise<ProductVariant | null> {
        return prisma.productVariant.findFirst({
            where: {
                productId,
                isDefault: true,
                deletedAt: null,
            },
        });
    }


    // UPDATE VARIANT

    async update(productId: string, variantId: string, data: Prisma.ProductVariantUpdateManyMutationInput): Promise<ProductVariant> {
        const result = await prisma.productVariant.updateMany({
            where: {
                productId,
                id: variantId,
                deletedAt: null,
            },
            data,
        });

        if (result.count === 0) {
            throw new NotFoundError(VARIANT_ERRORS.VARIANT_NOT_FOUND);
        }

        return prisma.productVariant.findFirstOrThrow({
            where: {
                productId,
                id: variantId,
                deletedAt: null,
            },
        });
    }


    // UPDATE VARIANT AND SET AS DEFAULT

    async updateAndSetDefault(productId: string, variantId: string, data: Prisma.ProductVariantUpdateManyMutationInput): Promise<ProductVariant> {
        return prisma.$transaction(async (tx) => {
            const variant = await tx.productVariant.findFirst({
                where: {
                    productId,
                    id: variantId,
                    deletedAt: null,
                },
            });

            if (!variant) {
                throw new NotFoundError(VARIANT_ERRORS.VARIANT_NOT_FOUND);
            }

            if (!variant.isActive || data.isActive === false) {
                throw new ConflictError(VARIANT_ERRORS.VARIANT_INACTIVE);
            }

            await tx.productVariant.updateMany({
                where: {
                    productId,
                    id: { not: variantId },
                    isDefault: true,
                    deletedAt: null,
                },
                data: {
                    isDefault: false,
                },
            });

            await tx.productVariant.updateMany({
                where: {
                    productId,
                    id: variantId,
                    deletedAt: null,
                },
                data: {
                    ...data,
                    isDefault: true,
                },
            });

            return tx.productVariant.findFirstOrThrow({
                where: {
                    productId,
                    id: variantId,
                    deletedAt: null,
                },
            });
        });
    }


    // SET DEFAULT VARIANT

    async setDefault(productId: string, variantId: string): Promise<ProductVariant> {
        return prisma.$transaction(async (tx) => {
            const variant = await tx.productVariant.findFirst({
                where: {
                    productId,
                    id: variantId,
                    deletedAt: null,
                },
            });

            if (!variant) {
                throw new NotFoundError(VARIANT_ERRORS.VARIANT_NOT_FOUND);
            }

            if (!variant.isActive) {
                throw new ConflictError(VARIANT_ERRORS.VARIANT_INACTIVE);
            }

            await tx.productVariant.updateMany({
                where: {
                    productId,
                    id: { not: variantId },
                    isDefault: true,
                    deletedAt: null,
                },
                data: {
                    isDefault: false,
                },
            });

            await tx.productVariant.updateMany({
                where: {
                    productId,
                    id: variantId,
                    deletedAt: null,
                },
                data: {
                    isDefault: true,
                },
            });

            return tx.productVariant.findFirstOrThrow({
                where: {
                    productId,
                    id: variantId,
                    deletedAt: null,
                },
            });
        });
    }


    // UNSET DEFAULT VARIANT

    async unsetDefault(productId: string, variantId: string): Promise<ProductVariant> {
        return this.update(productId, variantId, {
            isDefault: false,
        });
    }


    // ACTIVATE VARIANT

    async activate(productId: string, variantId: string): Promise<ProductVariant> {
        return this.update(productId, variantId, {
            isActive: true,
        });
    }


    // DEACTIVATE VARIANT

    async deactivate(productId: string, variantId: string): Promise<ProductVariant> {
        return this.update(
            productId,
            variantId,
            {
                isActive: false,
                isDefault: false,
            }
        );
    }


    // SOFT DELETE VARIANT

    async delete(productId: string, variantId: string): Promise<ProductVariant> {
        const result = await prisma.productVariant.updateMany({
            where: {
                productId,
                id: variantId,
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
                isActive: false,
                isDefault: false,
            },
        });

        if (result.count === 0) {
            throw new NotFoundError(VARIANT_ERRORS.VARIANT_NOT_FOUND);
        }

        return prisma.productVariant.findFirstOrThrow({
            where: {
                productId,
                id: variantId,
            },
        });
    }


    // RESTORE VARIANT

    async restore(productId: string, variantId: string): Promise<ProductVariant> {
        const result = await prisma.productVariant.updateMany({
            where: {
                productId,
                id: variantId,
                deletedAt: { not: null },
            },
            data: {
                deletedAt: null,
                isActive: true,
            },
        });

        if (result.count === 0) {
            throw new NotFoundError(VARIANT_ERRORS.VARIANT_NOT_FOUND);
        }

        return prisma.productVariant.findFirstOrThrow({
            where: {
                productId,
                id: variantId,
                deletedAt: null,
            },
        });
    }


    // COUNT VARIANTS

    async count(): Promise<number> {
        return prisma.productVariant.count({
            where: {
                deletedAt: null,
            },
        });
    }


    // COUNT ACTIVE VARIANTS

    async countActive(): Promise<number> {
        return prisma.productVariant.count({
            where: {
                isActive: true,
                deletedAt: null,
            },
        });
    }


    // COUNT VARIANTS BY PRODUCT

    async countByProduct(productId: string): Promise<number> {
        return prisma.productVariant.count({
            where: {
                productId,
                deletedAt: null,
            },
        });
    }
}

export const variantRepository = new VariantRepository();
