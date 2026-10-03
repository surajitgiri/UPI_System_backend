import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import ledgerRoutes from "./route/ledger.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import notFoundMiddleware from "./middleware/notFound.middleware.js";

const app = express();

// Security Middleware
app.use(helmet());

// CORS Middleware
app.use(cors());

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use(morgan("dev"));

// Health Check Endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "Ledger Service",
        status: "Running",
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use("/ledger", ledgerRoutes);

// 404 Not Found Middleware
app.use(notFoundMiddleware);

// Global Error Handler Middleware
app.use(errorMiddleware);

export default app;
