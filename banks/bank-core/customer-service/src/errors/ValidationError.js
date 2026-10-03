import AppError from "./AppError.js";

class ValidationError extends AppError {
    constructor(message = "Validation failed", errors = null) {
        super(message, 400, errors);
    }
}

export default ValidationError;
