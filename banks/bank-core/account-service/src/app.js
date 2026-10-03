import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"

import accountRoutes from "./routes/account.routes.js"
import branchRoutes from "./routes/branch.routes.js"

import errorMiddleware from "./middleware/error.middleware.js"

const app = express();

//Security
app.use(helmet());

//CORS
app.use(cors());

//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Logger
app.use(morgan("dev"));

//health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "Account Service",
        status: "Running",
        timestamp: new Date().toISOString()
    });
})

//API Routes
app.use("/accounts", accountRoutes);
app.use("/branches", branchRoutes);

//404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});

//Global Error Handler
app.use(errorMiddleware);
export default app;