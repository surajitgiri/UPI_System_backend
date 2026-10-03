import "dotenv/config";

import app from "./app.js";

const PORT = process.env.PORT || 5005;
const HOST = process.env.HOST || "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
    console.log("========================================");
    console.log("        Bank API Server Started");
    console.log("========================================");
    console.log(`Environment : ${process.env.NODE_ENV || "development"}`);
    console.log(`Host        : ${HOST}`);
    console.log(`Port        : ${PORT}`);
    console.log(`URL         : http://localhost:${PORT}`);
    console.log(`Health      : http://localhost:${PORT}/health`);
    console.log(`API         : http://localhost:${PORT}/api/v1`);
    console.log("========================================");
});

// Handle Server Errors
server.on("error", (error) => {
    console.error("Bank API Server Error:", error);

    if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
        process.exit(1);
    }

    process.exit(1);
});


// Graceful Shutdown
const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down server...`);

    server.close((error) => {
        if (error) {
            console.error("Error while shutting down server:", error);
            process.exit(1);
        }

        console.log("Bank API server closed successfully.");
        process.exit(0);
    });
};

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));