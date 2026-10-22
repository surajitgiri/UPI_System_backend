import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// ── Security & Headers ───────────────────────────
app.use(helmet());
app.use(cors());

// ── Body Parsers ─────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request Logger ───────────────────────────────
app.use(morgan("dev"));

// ── Health Check ─────────────────────────────────
app.get("/health", (req, res) => {
    return res.status(200).json({
        success: true,
        service: "Routing Service (NPCI)",
        status: "Running",
        timestamp: new Date().toISOString(),
    });
});

// ── API Routes ───────────────────────────────────
app.use("/api/v1", routes);

// ── 404 Handler ──────────────────────────────────
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});

// ── Global Error Handler ─────────────────────────
app.use(errorMiddleware);

export default app;
