import app from "./app.js";

import prisma from "./config/db.js";
import redis from "./config/redis.js";
import env from "./config/env.js";
import { startGrpcServer } from "./grpc/server.js";

async function startServer() {
    try {
        // Database Connection
        await prisma.$connect();
        console.log("✅ PostgreSQL Connected");

        // Redis Connection
        // try {
        //     await redis.connect();
        //     console.log("✅ Redis Connected");
        // } catch (redisErr) {
        //     console.warn("⚠ Redis Not Connected:", redisErr.message);
        // }

        // Start gRPC Server
        startGrpcServer();

        // Start HTTP Server
        app.listen(env.PORT, () => {
            console.log(`
======================================
🚀 Customer Service Started
🌍 Port : ${env.PORT}
======================================
`);
        });

    } catch (error) {
        console.error("❌ Server Startup Failed");
        console.error(error);

        process.exit(1);
    }
}

startServer();