import { AppError } from "./app.error.js";

// Forbidden error 

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}