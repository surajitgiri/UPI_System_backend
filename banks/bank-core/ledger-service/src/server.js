import app from "./app.js";
import prisma from "./config/db.js";
import env from "./config/env.js";
import { startGrpcServer } from "./grpc/server.js";

async function startServer() {
    try {
        // Connect PostgreSQL Database
        await prisma.$connect();
        console.log("✅ PostgreSQL Connected");

        const server = app.listen(env.PORT, () => {
            console.log(`
==========================================
📖 Ledger Service Started Successfully
==========================================
Environment : ${env.NODE_ENV}
Port        : ${env.PORT}
==========================================
            `);
        });

        //grpc server starting
        startGrpcServer(env.GRPC_PORT);

        // Graceful shutdown handling
        const gracefulShutdown = async (signal) => {
            console.log(`\nReceived ${signal}. Shutting down gracefully...`);
            server.close(async () => {
                await prisma.$disconnect();
                console.log("Database disconnected. Server closed.");
                process.exit(0);
            });
        };

        process.on("SIGINT", () => gracefulShutdown("SIGINT"));
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

    } catch (error) {
        console.error("❌ Failed to Start Server");
        console.error(error);
        process.exit(1);
    }
}

startServer();
