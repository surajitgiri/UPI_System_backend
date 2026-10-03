import jwt from "jsonwebtoken"
import env from "../config/env"

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }

        req.user = jwt.verify(token, env.JWT_SECRET);

        next();
    } catch (error) {
        next(error);
    }
}

export default authMiddleware;