import "dotenv/config";

// gRPC Service Configuration
// 
//  These addresses point to the gRPC servers of your microservices.
// 
//  Local development:
// 
//  Customer Service   -> localhost:50051
//  Account Service    -> localhost:50052
//  Transaction Service -> localhost:50053
//  Ledger Service     -> localhost:50054

const grpcConfig = {
    customer: {
        host:
            process.env.CUSTOMER_GRPC_HOST || "localhost",
        port:
            process.env.CUSTOMER_GRPC_PORT || 50051,
    },

    account: {
        host:
            process.env.ACCOUNT_GRPC_HOST || "localhost",
        port:
            process.env.ACCOUNT_GRPC_PORT || 50052,
    },

    transaction: {
        host:
            process.env.TRANSACTION_GRPC_HOST || "localhost",
        port:
            process.env.TRANSACTION_GRPC_PORT || 50053,
    },

    ledger: {
        host:
            process.env.LEDGER_GRPC_HOST || "localhost",
        port:
            process.env.LEDGER_GRPC_PORT || 50054,
    },
};

// Create gRPC Address
export const getgRPCAddress = (service) => {
    if (!service || !service.host || !service.port) {
        throw new Error(
            "Invalid gRPC service configuration"
        );
    }
    return `${service.host}:${service.port}`;
};

// Export Service Addresses
export const CUSTOMER_GRPC_ADDRESS = getgRPCAddress(grpcConfig.customer);

export const ACCOUNT_GRPC_ADDRESS = getgRPCAddress(grpcConfig.account);

export const TRANSACTION_GRPC_ADDRESS = getgRPCAddress(grpcConfig.transaction);

export const LEDGER_GRPC_ADDRESS = getgRPCAddress(grpcConfig.ledger);

export default grpcConfig;