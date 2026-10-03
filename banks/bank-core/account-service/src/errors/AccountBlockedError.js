import AppError from "./AppError.js";

class AccountBlockedError extends AppError {
    constructor(message = "Account is blocked") {
        super(message, 403);
    }
}

export default AccountBlockedError;