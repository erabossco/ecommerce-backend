import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error.js";


// IMPORTANT
// This middleware handles application errors globally and returns a consistent error response.
// Use this middleware in app.ts after all route handlers.
// Without this middleware, errors passed to next(error) (from controller) won't return a response body.

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // If not AppError, return internal server error
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}