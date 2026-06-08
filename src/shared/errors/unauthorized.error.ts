import { AppError } from "./app.error.js";

// Unauthorized error handling 

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}