import type { Request, Response, NextFunction } from "express";
import { productImageService } from "./product-image.service.js";
import type { CreateProductImageDto, UpdateProductImageDto, } from "./product-image.types.js";

// ============================
// PRODUCT IMAGE CONTROLLER
// ============================

export const productImageController = {
    // ============================
    // CREATE PRODUCT IMAGE
    // ============================

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, variantId } = res.locals.params as { productId: string; variantId: string; };
            const data = res.locals.body as CreateProductImageDto;
            res.locals.data = await productImageService.create(productId, variantId, data);

            next();
        } catch (error) {
            next(error);
        }
    },

    // ============================
    // GET ALL IMAGES BY VARIANT
    // ============================

    async findByVariant(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, variantId } = res.locals.params as { productId: string; variantId: string; };
            res.locals.data = await productImageService.findByVariant(productId, variantId);

            next();
        } catch (error) {
            next(error);
        }
    },

    // ============================
    // GET IMAGE BY ID
    // ============================

    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, variantId, imageId } = res.locals.params as { productId: string; variantId: string; imageId: string; };
            res.locals.data = await productImageService.findById(productId, variantId, imageId);

            next();
        } catch (error) {
            next(error);
        }
    },

    // ============================
    // UPDATE PRODUCT IMAGE
    // ============================

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, variantId, imageId } = res.locals.params as { productId: string; variantId: string; imageId: string; };
            const data = res.locals.body as UpdateProductImageDto;
            res.locals.data = await productImageService.update(productId, variantId, imageId, data);

            next();
        } catch (error) {
            next(error);
        }
    },

    // ============================
    // DELETE PRODUCT IMAGE
    // ============================

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, variantId, imageId } = res.locals.params as { productId: string; variantId: string; imageId: string; };
            res.locals.data = await productImageService.delete(productId, variantId, imageId);

            next();
        } catch (error) {
            next(error);
        }
    },
};