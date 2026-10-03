import AppError from "./AppError.js";

class validationError extends AppError {
    constructor(message = "Validation Failed", errors = null) {
        super(message, 400, errors)
    }
}

export default validationError;