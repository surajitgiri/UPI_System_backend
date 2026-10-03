import AppError from "./AppError.js";

class InvalidAccountError extends AppError {
    constructor(message = "Invalid account") {
        super(message, 400);
    }
}

export default InvalidAccountError;