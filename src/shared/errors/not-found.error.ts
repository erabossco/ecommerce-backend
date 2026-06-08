import { AppError } from "./app.error.js";

// Custom not-found error

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}