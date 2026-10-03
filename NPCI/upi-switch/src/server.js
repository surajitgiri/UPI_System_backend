import "dotenv/config"; // MUST be first — loads .env before any module reads process.env
import app    from "./app.js";
import prisma from "./config/db.js";
import { startGrpcServer } from "./grpc/server.js";

const PORT      = process.env.PORT      || 5010;
const GRPC_PORT = process.env.GRPC_PORT || 50060;
const NODE_ENV  = process.env.NODE_ENV  || "development";

async function startServer() {
    try {
        // ── Connect to PostgreSQL ──────────────────────
        await prisma.$connect();
        console.log("✅ PostgreSQL Connected");

        // ── Start gRPC server ──────────────────────────
        startGrpcServer(GRPC_PORT);

        // ── Start HTTP server ──────────────────────────
        const server = app.listen(PORT, () => {
            console.log(`
==========================================
🔀 UPI Switch (NPCI) Started
==========================================
Environment : ${NODE_ENV}
HTTP Port   : ${PORT}
gRPC Port   : ${GRPC_PORT}
API         : http://localhost:${PORT}/api/v1
Health      : http://localhost:${PORT}/health
==========================================
            `);
        });

        // ── Graceful Shutdown ──────────────────────────
        const gracefulShutdown = async (signal) => {
            console.log(`\nReceived ${signal}. Shutting down gracefully...`);
            server.close(async () => {
                await prisma.$disconnect();
                console.log("DB disconnected. UPI Switch server closed.");
                process.exit(0);
            });
        };

        process.on("SIGINT",  () => gracefulShutdown("SIGINT"));
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

    } catch (error) {
        console.error("❌ Failed to start UPI Switch");
        console.error(error);
        process.exit(1);
    }
}

startServer();
