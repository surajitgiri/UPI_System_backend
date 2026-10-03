class AppError extends Error {
    constructor(message, statuscode = 500, errors = null) {
        super(message);

        this.name = this.constructor.name;
        this.statuscode = statuscode;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;