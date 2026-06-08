import { AppError } from "./app.error.js";


// Bad Request error

export class BadRequestError extends AppError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}