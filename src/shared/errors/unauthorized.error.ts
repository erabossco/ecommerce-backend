import { AppError } from "./app.error.js";

// Unauthorized error

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}