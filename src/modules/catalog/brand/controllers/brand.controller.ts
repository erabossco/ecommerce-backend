import type { Request, Response, NextFunction } from "express";
import { brandService } from "../services/brand.service.js";
import type { BrandQueryDto, CreateBrandDto } from "../types/brand.types.js";
import { BRAND_MESSAGES } from "../constants/brand.constants.js";

class BrandController {
    // BRAND CREATE
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

    // BRAND FIND BY ID 
    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = res.locals.params;
            const brand = await brandService.findById(id);
            res.status(200).json({
                success: true,
                data: brand,
            });

        } catch (error) {
            next(error);
        }
    }

    // =================
    // FIND BRAND LIST
    // =================

    async findMany(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = res.locals.query as BrandQueryDto;
            const brands = await brandService.findMany(query);

            res.status(200).json({
                success: true,
                ...brands,
            })
        } catch (error) {
            next(error);
        }
    }

}

export const brandController = new BrandController();