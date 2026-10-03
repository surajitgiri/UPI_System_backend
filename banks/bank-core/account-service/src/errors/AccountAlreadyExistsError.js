import AppError from "./AppError.js";

class AccountAlreadyExistsError extends AppError {
    constructor(message = "Account already exists") {
        super(message, 409);
    }
}

export default AccountAlreadyExistsError;