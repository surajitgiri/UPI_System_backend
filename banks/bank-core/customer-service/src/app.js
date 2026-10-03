import express from "express";
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan";

import customerRoutes from "./routes/customer.routes.js";
import kycRoutes from "./routes/kyc.routes.js"

import errorMiddleware from "./middleware/error.middleware.js";


const app = express();

//security 
app.use(helmet());

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Logging
app.use(morgan("dev"));

//health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Customer Service Running 🚀"
    })
})

//Routes
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/kyc", kycRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "404 Not Found"
    })
})

//Error handling middleware
app.use(errorMiddleware);

export default app;