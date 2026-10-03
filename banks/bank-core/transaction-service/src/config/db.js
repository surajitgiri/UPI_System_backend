import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/index.js";


const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

/** @type {import('@prisma/client').PrismaClient} */
const prisma = new PrismaClient({ adapter });

export default prisma;
