class AppError extends Error {
    constructor(message, statusCode = 500, error = null) {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.error = error;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;