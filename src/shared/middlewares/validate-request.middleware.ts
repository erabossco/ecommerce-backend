import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";


// VALIDATE BODY
export const validateBody = <T>(schema: ZodType<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.body = schema.parse(req.body);
            next();
        } catch (error) {
            next(error);
        }
    }
}

// VALIDATE PARAMS
export const validateParams = <T>(schema: ZodType<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.params = schema.parse(req.params);
            next();
        } catch (error) {
            next(error);
        }
    }
}

// VALIDATE QUERY

export const validateQuery = <T>(schema: ZodType<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.query = schema.parse(req.query);
            next();
        } catch (error) {
            next(error);
        }
    }
}


// VALIDATE HEADERS
export const validateHeaders = <T>(schema: ZodType<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.headers = schema.parse(req.headers);
            next();
        } catch (error) {
            next(error);
        }
    }
}


