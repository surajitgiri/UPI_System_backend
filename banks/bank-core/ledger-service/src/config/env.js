import dotenv from "dotenv";

dotenv.config();

const env = {
    PORT: process.env.PORT || 5003,

    DATABASE_URL: process.env.DATABASE_URL,

    REDIS_URL: process.env.REDIS_URL,

    NODE_ENV: process.env.NODE_ENV || "development",

    GRPC_PORT: process.env.GRPC_PORT || 50054
};

export default env;
