import AppError from "../errors/AppError.js";

const errorMiddlewares = (err, req, res, next) => {
    console.error("========================================");
    console.error("Error:", err.message);
    console.error("Method:", req.method);
    console.error("URL:", req.originalUrl);

    if (process.env.NODE_ENV === "development") {
        console.error(err.stack);
    }

    console.error("========================================");

    // AppError
    if (err instanceof AppError) {
        return res.status(err.statuscode).json({
            success: false,
            message: err.message,
            errors: err.errors || null,
        });
    }

    //JWT Errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Invalid authentication token",
            errors: null,
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Authentication token has expired",
            errors: null,
        });
    }

    //Validation Errors
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.errors || null,
        });
    }

    //Prisma Errors
    if (err.code === "P2002") {
        return res.status(409).json({
            success: false,
            message: "A record with this value already exists",
            errors: err.meta || null,
        });
    }

    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: "Record not found",
            errors: null,
        });
    }

    // Default Error
    return res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message || "Internal server error",
        errors: process.env.NODE_ENV === "development" ? err.stack : null,
    });
};

export default errorMiddlewares;