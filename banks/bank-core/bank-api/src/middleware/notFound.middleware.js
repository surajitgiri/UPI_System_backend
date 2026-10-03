import AppError from "../errors/AppError.js";

const notFoundMiddleware = (req, res, next) => {
    const error = new AppError(
        `Route not found: ${req.method} ${req.originalUrl}`,
        404
    );

    next(error);
};

export default notFoundMiddleware;