import { AppError } from "./app.error.js";

// Custom conflict-error

export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}