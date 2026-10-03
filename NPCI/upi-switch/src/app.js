import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import apiRoutes from "./routes/index.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// ── Security ────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────
app.use(cors());

// ── Body Parsers ─────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logger ───────────────────────────────────────────
app.use(morgan("dev"));

// ── Health Check ──────────────────────────────────────
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "UPI Switch (NPCI)",
        status:  "Running",
        timestamp: new Date().toISOString(),
    });
});

// ── API Routes ────────────────────────────────────────
app.use("/api/v1", apiRoutes);

// ── 404 Handler ───────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});

// ── Global Error Handler ──────────────────────────────
app.use(errorMiddleware);

export default app;
