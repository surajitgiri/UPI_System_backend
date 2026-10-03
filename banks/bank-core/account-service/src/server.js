import app from "./app.js"

import prisma from "./config/db.js"
import redis from "./config/redis.js"
import env from "./config/env.js"
import { startGrpcServer } from "./grpc/server.js"

async function startServer() {
    try {
        //PostgreSQL
        await prisma.$connect();
        console.log("✅ PostgreSQL Connected");

        //redis
        // try {
        //     await redis.connect();
        //     console.log("✅ Redis Connected");

        // } catch (error) {
        //     console.warn("⚠ Redis Not Connected");
        //     console.warn(error.message);
        // }

        // Start gRPC Server (AccountService)
        startGrpcServer(env.GRPC_PORT);

        app.listen(env.PORT, () => {
            console.log(`
==========================================
🏦 Account Service Started Successfully
==========================================
Environment : ${env.NODE_ENV}
HTTP Port   : ${env.PORT}
gRPC Port   : ${env.GRPC_PORT}
==========================================
      `);
        });

        process.on("SIGINT", async () => {
            console.log("\nShutting down...");

            await prisma.$disconnect();

            if (redis.isOpen) {
                await redis.quit();
            }

            process.exit(0);
        })

    } catch (error) {
        console.error("❌ Failed to Start Server");
        console.error(error);

        process.exit(1);
    }
}

startServer();