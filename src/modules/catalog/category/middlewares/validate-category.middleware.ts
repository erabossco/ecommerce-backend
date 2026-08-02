import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import type { CategoryIdDto, CategoryQueryDto } from "../types/category.types.js";

// ================================
// CATEGORY VALIDATION MIDDLEWARES 
// ================================

// Validate Category Query before running controller
// Used in modules/catalog/category/routes


// Validate category query
export const validateCategoryQuery =
    (schema: ZodType<CategoryQueryDto>) => {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                res.locals.query = schema.parse(req.query);
                next();
            } catch (error) {
                next(error);
            }
        };
    };


// Validate category id
export const validateCategoryId = (schema: ZodType<CategoryIdDto>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.params = schema.parse(req.params);
            next();
        } catch (error) {
            next(error)
        }
    }
}

// Validate request body for category create/update operations
export const validateCategoryBody = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.body = schema.parse(req.body);
            next();
        } catch (error) {
            next(error);
        }
    }
}