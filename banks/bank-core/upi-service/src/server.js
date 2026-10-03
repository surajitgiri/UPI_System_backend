import "dotenv/config"; // MUST be first — loads .env before any module reads process.env
import app from "./app.js";
import prisma from "./config/db.js";
import env from "./config/env.js";
import { startGrpcServer } from "./grpc/server.js";

async function startServer() {
    try {
        // Connect to PostgreSQL
        await prisma.$connect();
        console.log("✅ PostgreSQL Connected");

        // Start gRPC server
        const grpcPort = process.env.GRPC_PORT || 50056;
        startGrpcServer(grpcPort);

        const server = app.listen(env.PORT, () => {
            console.log(`
==========================================
💳 UPI Service Started Successfully
==========================================
Environment : ${env.NODE_ENV}
HTTP Port   : ${env.PORT}
gRPC Port   : ${grpcPort}
API         : http://localhost:${env.PORT}/api/v1
Health      : http://localhost:${env.PORT}/health
==========================================
            `);
        });

        // ── Graceful Shutdown ──────────────────────────
        const gracefulShutdown = async (signal) => {
            console.log(`\nReceived ${signal}. Shutting down gracefully...`);
            server.close(async () => {
                await prisma.$disconnect();
                console.log("Database disconnected. Server closed.");
                process.exit(0);
            });
        };

        process.on("SIGINT",  () => gracefulShutdown("SIGINT"));
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

    } catch (error) {
        console.error("❌ Failed to Start UPI Service");
        console.error(error);
        process.exit(1);
    }
}

startServer();
