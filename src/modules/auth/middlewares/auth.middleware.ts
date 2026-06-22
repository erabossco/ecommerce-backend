import type { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwt.service.js";
import { UnauthorizedError } from "@/shared/errors/index.js";

// Auth middleware
// Used for protected routes

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new UnauthorizedError("Access token missing");
        }

        const payload = jwtService.verifyAccessToken(token);
        req.user = payload;

        next();

    } catch (error) {
        next(error);
    }
};