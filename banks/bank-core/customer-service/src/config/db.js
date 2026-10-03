import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL
});

export default prisma;