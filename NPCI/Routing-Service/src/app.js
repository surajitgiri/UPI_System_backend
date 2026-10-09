import express from "express";

import routes from "./routes/index.js";

import errorMiddleware from "./middleware/error.middleware.js";
import notFoundMiddleware from "./middleware/notFound.middleware.js";

const app = express();

// Global Middleware

// Parse JSON request body
app.use(express.json());

//Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

//Health Check
app.get("/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Bank API is running",
    });
});

//API Routes
app.use("/api/v1", routes);

//404 Handler
app.use(notFoundMiddleware);

//Global Error Handler
app.use(errorMiddleware);
export default app;