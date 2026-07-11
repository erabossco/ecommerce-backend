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
    (schema: ZodType) => {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                res.locals.query = schema.parse(req.query) as CategoryQueryDto;
                next();
            } catch (error) {
                next(error);
            }
        };
    };


// Validate category id
export const validateCategoryId = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.params = schema.parse(req.params) as CategoryIdDto
            next();
        } catch (error) {
            next(error)
        }
    }
}