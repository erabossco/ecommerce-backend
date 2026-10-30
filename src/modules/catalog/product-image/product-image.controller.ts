import type { Request, Response, NextFunction } from "express";
import { productImageService } from "./product-image.service.js";
import type { CreateProductImageDto, UpdateProductImageDto, } from "./product-image.types.js";
import { SUCCESS_MESSAGES } from "@/shared/constants/success-messages.js";

// ============================
// PRODUCT IMAGE CONTROLLER
// ============================

export const productImageController = {
    // ============================
    // CREATE PRODUCT IMAGE
    // ============================

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, variantId } = res.locals.params;
            const data = res.locals.body;

            const productImage = await productImageService.create(productId, variantId, data);

            res.status(201).json({
                success: true,
                message: SUCCESS_MESSAGES.CREATED,
                data: productImage,
            });
        } catch (error) {
            next(error);
        }
    },

    // ============================
    // GET ALL IMAGES BY VARIANT
    // ============================
    async findByVariant(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, variantId } = res.locals.params;

            const productImages = await productImageService.findByVariant(productId, variantId);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.FETCHED,
                data: productImages,
            });
        } catch (error) {
            next(error);
        }
    },

    // ============================
    // GET IMAGE BY ID
    // ============================

    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, variantId, imageId } = res.locals.params;

            const productImage = await productImageService.findById(productId, variantId, imageId);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.FETCHED,
                data: productImage,
            });
        } catch (error) {
            next(error);
        }
    },

    // ============================
    // UPDATE PRODUCT IMAGE
    // ============================

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, variantId, imageId } = res.locals.params;
            const data = res.locals.body as UpdateProductImageDto;

            const productImage = await productImageService.update(
                productId,
                variantId,
                imageId,
                data
            );

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATED,
                data: productImage,
            });
        } catch (error) {
            next(error);
        }
    },

    // ============================
    // DELETE PRODUCT IMAGE
    // ============================

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, variantId, imageId } = res.locals.params;

            const productImage = await productImageService.delete(productId, variantId, imageId);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.DELETED,
                data: productImage,
            });
        } catch (error) {
            next(error);
        }
    },
};