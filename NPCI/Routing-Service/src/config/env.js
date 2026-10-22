import dotenv from "dotenv";

dotenv.config();

const env = {
    PORT: process.env.PORT || 5020,
    GRPC_PORT: process.env.GRPC_PORT || 50061,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL,
}

export default env;