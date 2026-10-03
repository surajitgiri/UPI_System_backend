import jwt from "jsonwebtoken";
import AppError from "../errors/AppError.js";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError(
                "Authorization header is required",
                401
            );
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            throw new AppError(
                "Invalid authorization format. Use Bearer <token>",
                401
            );
        }

        const token = parts[1];

        if (!token) {
            throw new AppError(
                "Authentication token is required",
                401
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        /*
        * Store authenticated user information
        * in request object.
        */
        req.user = decoded;

        next();

    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }

        if (error.name === "TokenExpiredError") {
            return next(
                new AppError(
                    "Authentication token has expired",
                    401
                )
            );
        }

        if (error.name === "JsonWebTokenError") {
            return next(
                new AppError(
                    "Invalid authentication token",
                    401
                )
            );
        }
        return next(error);
    }
};

export default authMiddleware;