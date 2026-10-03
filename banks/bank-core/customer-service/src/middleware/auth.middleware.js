import jwt from "jsonwebtoken"
import env from "../config/env.js"

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            })
        }

        const decode = jwt.verify(token, env.JWT_SECRET);

        req.user = decode;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token"
        })
    }
}

export default authMiddleware;