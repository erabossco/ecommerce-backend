import { AppError } from "./app.error.js";


// Bad request error handling

export class BadRequestError extends AppError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}