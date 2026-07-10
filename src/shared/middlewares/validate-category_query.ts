import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import type { CategoryQueryDto } from "@/modules/catalog/category/types/category.types.js";

// ===========================
// CATEGORY QUERY MIDDLEWARE 
// ===========================


// Validate Category Query before running controller
// Used for GET / categories (findMany) 
// in modules/catalog/category/routes

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