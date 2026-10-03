import dotenv from "dotenv";

dotenv.config();

const env = {
    PORT: process.env.PORT || 5010,
    GRPC_PORT: process.env.GRPC_PORT || 50060,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL,
    // Upstream gRPC service addresses
    ACCOUNT_GRPC_ADDRESS: process.env.ACCOUNT_GRPC_ADDRESS || "localhost:50052",
    UPI_GRPC_ADDRESS: process.env.UPI_GRPC_ADDRESS || "localhost:50056",
    PARTICIPANT_GRPC_ADDRESS: process.env.PARTICIPANT_GRPC_ADDRESS || "localhost:50061",
};

export default env;