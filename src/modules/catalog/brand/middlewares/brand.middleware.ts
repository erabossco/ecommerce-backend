import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import type { BrandIdDto, CreateBrandDto } from "../types/brand.types.js";

// VALIDATE BRAND BODY MIDDLEWARE

export const validateBrandBody = (schema: ZodType<CreateBrandDto>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.body = schema.parse(req.body);
            next();
        } catch (error) {
            next(error);
        }
    }
};

// VALIDATE BRAND ID MIDDLEWARE

export const validateBrandId = (schema: ZodType<BrandIdDto>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.params = schema.parse(req.params);
            next();
        } catch (error) {
            next(error);
        }
    }
}