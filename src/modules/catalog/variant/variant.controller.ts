
import type { Request, Response, NextFunction } from "express";

import { variantService } from "./variant.service.js";
import { SUCCESS_MESSAGES } from "@/shared/constants/success-messages.js";
import { success } from "zod";

// =====================
// VARIANT CONTROLLER
// =====================

class VariantController {

    // CREATE VARIANT

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = res.locals.params;
            const data = res.locals.body;

            const variant = await variantService.create(productId, data);

            res.status(201).json({
                success: true,
                message: SUCCESS_MESSAGES.CREATED,
                data: variant,
            });
        } catch (error) {
            next(error);
        }
    }


    // GET VARIANT BY ID

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, id } = res.locals.params;

            const variant = await variantService.getById(productId, id);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.FETCHED,
                data: variant,
            });
        } catch (error) {
            next(error);
        }
    }


    // GET VARIANT BY SKU

    async getBySku(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { sku } = res.locals.params;

            const variant = await variantService.getBySku(sku);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.FETCHED,
                data: variant,
            });
        } catch (error) {
            next(error);
        }
    }


    // GET VARIANT BY BARCODE

    async getByBarcode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { barcode } = res.locals.params;

            const variant = await variantService.getByBarcode(barcode);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.FETCHED,
                data: variant,
            });
        } catch (error) {
            next(error);
        }
    }


    // GET ALL VARIANTS

    async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const variants = await variantService.getAll();

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.FETCHED,
                data: variants,
            });
        } catch (error) {
            next(error);
        }
    }


    // GET VARIANTS BY PRODUCT

    async getByProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = res.locals.params;

            const variants = await variantService.getByProduct(productId);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.FETCHED,
                data: variants,
            });
        } catch (error) {
            next(error);
        }
    }


    // GET ALL ACTIVE VARIANTS

    async getActive(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const variants = await variantService.getActive();

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.FETCHED,
                data: variants,
            });
        } catch (error) {
            next(error);
        }
    }


    // GET ACTIVE VARIANTS BY PRODUCT

    async getActiveByProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = res.locals.params;

            const variants = await variantService.getActiveByProduct(productId);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.FETCHED,
                data: variants,
            });
        } catch (error) {
            next(error);
        }
    }


    // GET DEFAULT VARIANT BY PRODUCT

    async getDefaultByProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = res.locals.params;

            const variant = await variantService.getDefaultByProduct(productId);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.FETCHED,
                data: variant,
            });
        } catch (error) {
            next(error);
        }
    }


    // UPDATE VARIANT

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, id } = res.locals.params;
            const data = res.locals.body;

            const variant = await variantService.update(productId, id, data);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATED,
                data: variant,
            });
        } catch (error) {
            next(error);
        }
    }


    // SET DEFAULT VARIANT

    async setDefault(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, id } = res.locals.params;

            const variant = await variantService.setDefault(productId, id);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATED,
                data: variant,
            });
        } catch (error) {
            next(error);
        }
    }


    // UNSET DEFAULT VARIANT

    async unsetDefault(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, id } = res.locals.params;

            const variant = await variantService.unsetDefault(productId, id);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATED,
                data: variant,
            });
        } catch (error) {
            next(error);
        }
    }


    // ACTIVATE VARIANT

    async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, id } = res.locals.params;

            const variant = await variantService.activate(productId, id);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATED,
                data: variant,
            });
        } catch (error) {
            next(error);
        }
    }


    // DEACTIVATE VARIANT

    async deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, id } = res.locals.params;

            const variant = await variantService.deactivate(productId, id);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATED,
                data: variant,
            });
        } catch (error) {
            next(error);
        }
    }


    // SOFT DELETE VARIANT

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, id } = res.locals.params;

            const variant = await variantService.delete(productId, id);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.DELETED,
                data: variant,
            });
        } catch (error) {
            next(error);
        }
    }


    // RESTORE VARIANT

    async restore(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId, id } = res.locals.params;

            const variant = await variantService.restore(productId, id);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATED,
                data: variant,
            });
        } catch (error) {
            next(error);
        }
    }


    // COUNT ALL VARIANTS

    async count(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const count = await variantService.count();

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.FETCHED,
                data: { count },
            });
        } catch (error) {
            next(error);
        }
    }


    // COUNT ACTIVE VARIANTS

    async countActive(_req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const count = await variantService.countActive();

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.FETCHED,
                data: { count },
            });
        } catch (error) {
            next(error);
        }
    }


    // COUNT VARIANTS BY PRODUCT

    async countByProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = res.locals.params;

            const count = await variantService.countByProduct(productId);

            res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.FETCHED,
                data: { count },
            });
        } catch (error) {
            next(error);
        }
    }
}

export const variantController = new VariantController();
