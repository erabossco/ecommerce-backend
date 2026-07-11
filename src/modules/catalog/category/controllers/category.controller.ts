import type { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/category.service.js";
import { categoryQuerySchema, createCategorySchema, updateCategorySchema } from "../validators/category.validator.js";
import type { CategoryQueryDto } from "../types/category.types.js";

class CategoryController {

    // ====================
    // CREATE CATEGORY
    // ====================

    async create(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const data = createCategorySchema.parse(req.body);
            const category = await categoryService.create(data);
            res.status(201).json({
                success: true,
                message: "Category created successfully.",
                data: category,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // ====================
    // GET CATEGORY BY ID
    // ====================

    async findById(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const category = await categoryService.findById(req.params.id as string);
            res.status(200).json({
                success: true,
                data: category,
            });
        } catch (error) {
            next(error);
        }
    }

    // ====================
    // GET ALL CATEGORIES
    // ====================

    async findMany(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const query = res.locals.query as CategoryQueryDto;

            const categories = await categoryService.findMany(query);

            res.status(200).json({
                success: true,
                ...categories,
            });
        } catch (error) {
            next(error);
        }
    }

    // ====================
    // UPDATE CATEGORY
    // ====================

    async update(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const data = updateCategorySchema.parse(req.body);
            const category = await categoryService.update(
                req.params.id as string,
                data,
            );

            res.status(200).json({
                success: true,
                message: "Category updated successfully.",
                data: category,
            });
        } catch (error) {
            next(error);
        }
    }

    // ====================
    // DELETE CATEGORY
    // ====================

    async delete(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            await categoryService.delete(req.params.id as string);
            res.status(200).json({
                success: true,
                message: "Category deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    }
}

export const categoryController = new CategoryController();
