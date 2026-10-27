import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const dbUrl = process.env.DATABASE_URL || "";
const isAccelerate = dbUrl.startsWith("prisma://") || dbUrl.startsWith("prisma+postgres://");

const prisma = isAccelerate
    ? new PrismaClient({ accelerateUrl: dbUrl })
    : new PrismaClient();

export default prisma;