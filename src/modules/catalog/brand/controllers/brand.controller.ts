import type { Request, Response, NextFunction } from "express";
import { brandService } from "../services/brand.service.js";
import type { CreateBrandDto } from "../types/brand.types.js";
import { BRAND_MESSAGES } from "../constants/brand.constants.js";

class BrandController {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = res.locals.body as CreateBrandDto;
            const brand = await brandService.create(data);
            res.status(201).json({
                success: true,
                message: BRAND_MESSAGES.BRAND_CREATED,
                data: brand,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const brandController = new BrandController();