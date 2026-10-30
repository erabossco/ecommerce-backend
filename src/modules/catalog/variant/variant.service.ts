
import type { ProductVariant } from "@prisma/client";

import { NotFoundError } from "@/shared/errors/not-found.error.js";
import { ConflictError } from "@/shared/errors/conflict.error.js";
import { productRepository } from "../product/repositories/product.repository.js";
import { variantRepository } from "./variant.repository.js";
import type { CreateVariantDto, UpdateVariantDto } from "./variant.types.js";
import { VARIANT_ERRORS } from "./variant.errors.js";

// ==================
// VARIANT SERVICE
// ==================

class VariantService {

    // CREATE VARIANT

    async create(productId: string, data: Omit<CreateVariantDto, "productId">): Promise<ProductVariant> {

        const product = await productRepository.findById(productId);

        if (!product) {
            throw new NotFoundError(VARIANT_ERRORS.PRODUCT_NOT_FOUND);
        }

        const existingSku = await variantRepository.findBySku(data.sku);

        if (existingSku) {
            throw new ConflictError(VARIANT_ERRORS.SKU_EXISTS);
        }

        const variantData = {
            sku: data.sku,
            price: data.price,
            isDefault: data.isDefault ?? false,
            isActive: data.isActive ?? true,
            trackInventory: data.trackInventory ?? true,

            ...(data.barcode !== undefined && { barcode: data.barcode }),
            ...(data.costPrice !== undefined && { costPrice: data.costPrice }),
            ...(data.weight !== undefined && { weight: data.weight }),
            ...(data.length !== undefined && { length: data.length }),
            ...(data.width !== undefined && { width: data.width }),
            ...(data.height !== undefined && { height: data.height }),

            product: {
                connect: {
                    id: productId,
                },
            },
        };

        if (variantData.isDefault) {
            return variantRepository.createAsDefault(productId, variantData,);
        }

        return variantRepository.create(variantData);
    }


    // GET VARIANT BY ID

    async getById(productId: string, variantId: string): Promise<ProductVariant> {

        const variant = await variantRepository.findByIdAndProduct(productId, variantId,);

        if (!variant) {
            throw new NotFoundError(VARIANT_ERRORS.VARIANT_NOT_FOUND);
        }

        return variant;
    }


    // GET VARIANT BY SKU

    async getBySku(sku: string): Promise<ProductVariant> {

        const variant = await variantRepository.findBySku(sku);

        if (!variant) {
            throw new NotFoundError(VARIANT_ERRORS.VARIANT_NOT_FOUND);
        }

        return variant;
    }


    // GET VARIANT BY BARCODE

    async getByBarcode(barcode: string): Promise<ProductVariant> {

        const variant = await variantRepository.findByBarcode(barcode);

        if (!variant) {
            throw new NotFoundError(VARIANT_ERRORS.VARIANT_NOT_FOUND);
        }

        return variant;
    }


    // GET ALL VARIANTS

    async getAll(): Promise<ProductVariant[]> {
        return variantRepository.findAll();
    }


    // GET VARIANTS BY PRODUCT

    async getByProduct(productId: string): Promise<ProductVariant[]> {

        const product = await productRepository.findById(productId);

        if (!product) {
            throw new NotFoundError(VARIANT_ERRORS.PRODUCT_NOT_FOUND);
        }

        return variantRepository.findByProduct(productId);
    }


    // GET ALL ACTIVE VARIANTS

    async getActive(): Promise<ProductVariant[]> {
        return variantRepository.findAllActive();
    }


    // GET ACTIVE VARIANTS BY PRODUCT

    async getActiveByProduct(productId: string): Promise<ProductVariant[]> {

        const product = await productRepository.findById(productId);

        if (!product) {
            throw new NotFoundError(VARIANT_ERRORS.PRODUCT_NOT_FOUND);
        }

        return variantRepository.findActiveByProduct(productId);
    }


    // GET DEFAULT VARIANT BY PRODUCT

    async getDefaultByProduct(productId: string): Promise<ProductVariant> {

        const product = await productRepository.findById(productId);

        if (!product) {
            throw new NotFoundError(VARIANT_ERRORS.PRODUCT_NOT_FOUND);
        }

        const variant = await variantRepository.findDefaultByProduct(productId);

        if (!variant) {
            throw new NotFoundError(VARIANT_ERRORS.DEFAULT_VARIANT_NOT_FOUND);
        }

        return variant;
    }


    // UPDATE VARIANT

    async update(productId: string, variantId: string, data: UpdateVariantDto): Promise<ProductVariant> {

        const variant = await variantRepository.findByIdAndProduct(productId, variantId,);

        if (!variant) {
            throw new NotFoundError(VARIANT_ERRORS.VARIANT_NOT_FOUND);
        }

        // CHECK SKU UNIQUENESS

        if (data.sku !== undefined && data.sku !== variant.sku) {
            const existingSku = await variantRepository.findBySku(data.sku);

            if (existingSku && existingSku.id !== variantId) {
                throw new ConflictError(VARIANT_ERRORS.SKU_EXISTS);
            }
        }

        // PREPARE UPDATE DATA

        const updateData = {
            ...(data.sku !== undefined && { sku: data.sku }),
            ...(data.barcode !== undefined && { barcode: data.barcode }),
            ...(data.price !== undefined && { price: data.price }),
            ...(data.costPrice !== undefined && { costPrice: data.costPrice }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
            ...(data.trackInventory !== undefined && { trackInventory: data.trackInventory }),
            ...(data.weight !== undefined && { weight: data.weight }),
            ...(data.length !== undefined && { length: data.length }),
            ...(data.width !== undefined && { width: data.width }),
            ...(data.height !== undefined && { height: data.height }),
            ...(data.isDefault !== undefined && { isDefault: data.isDefault }),

            // An inactive variant cannot remain the default.
            ...(data.isActive === false && { isDefault: false, }),
        };

        // UPDATE AND SET AS DEFAULT

        if (data.isDefault === true) {
            return variantRepository.updateAndSetDefault(productId, variantId, updateData);
        }

        // REGULAR UPDATE

        return variantRepository.update(productId, variantId, updateData,);
    }


    // SET DEFAULT VARIANT

    async setDefault(productId: string, variantId: string): Promise<ProductVariant> {

        return variantRepository.setDefault(productId, variantId);
    }


    // UNSET DEFAULT VARIANT

    async unsetDefault(productId: string, variantId: string): Promise<ProductVariant> {

        return variantRepository.unsetDefault(productId, variantId);
    }


    // ACTIVATE VARIANT

    async activate(productId: string, variantId: string): Promise<ProductVariant> {

        return variantRepository.activate(productId, variantId);
    }


    // DEACTIVATE VARIANT

    async deactivate(productId: string, variantId: string): Promise<ProductVariant> {

        return variantRepository.deactivate(productId, variantId);
    }


    // SOFT DELETE VARIANT

    async delete(productId: string, variantId: string): Promise<ProductVariant> {

        return variantRepository.delete(productId, variantId);
    }


    // RESTORE VARIANT

    async restore(productId: string, variantId: string): Promise<ProductVariant> {

        const variant = await variantRepository.findByIdAndProductIncludingDeleted(productId, variantId,);

        if (!variant) {
            throw new NotFoundError(VARIANT_ERRORS.VARIANT_NOT_FOUND);
        }

        if (!variant.deletedAt) {
            throw new ConflictError(VARIANT_ERRORS.VARIANT_NOT_DELETED);
        }

        return variantRepository.restore(productId, variantId);
    }


    // COUNT ALL VARIANTS

    async count(): Promise<number> {
        return variantRepository.count();
    }


    // COUNT ACTIVE VARIANTS

    async countActive(): Promise<number> {
        return variantRepository.countActive();
    }


    // COUNT VARIANTS BY PRODUCT

    async countByProduct(productId: string): Promise<number> {

        const product = await productRepository.findById(productId);

        if (!product) {
            throw new NotFoundError(VARIANT_ERRORS.PRODUCT_NOT_FOUND);
        }

        return variantRepository.countByProduct(productId);
    }
}

export const variantService = new VariantService();