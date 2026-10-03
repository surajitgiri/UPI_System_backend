import dotenv from "dotenv";

dotenv.config();

const env = {
    PORT: process.env.PORT || 5001,

    DATABASE_URL: process.env.DATABASE_URL,

    REDIS_URL: process.env.REDIS_URL,

    JWT_SECRET: process.env.JWT_SECRET,

    NODE_ENV: process.env.NODE_ENV || "development",
};

export default env;