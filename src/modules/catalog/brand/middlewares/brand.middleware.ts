import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validateBrandBody = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.body = schema.parse(req.body);
            next();
        } catch (error) {
            next(error);
        }
    }
};