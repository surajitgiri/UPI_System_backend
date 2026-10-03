import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

// __dirname for ES Modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Proto Directory

const PROTO_DIR = path.join(__dirname, "proto");

// Load Proto
export const loadProto = (protoFile) => {
    const protoPath = path.join(PROTO_DIR, protoFile);

    const packageDefinition = protoLoader.loadSync(protoPath, {
        keepCase: false,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });

    return grpc.loadPackageDefinition(packageDefinition);
};

// Create gRPC Client
export const createGrpcClient = (Service, address) => {
    if (!Service) {
        throw new Error(
            "gRPC service definition is required"
        );
    }

    if (!address) {
        throw new Error(
            "gRPC service address is required"
        );
    }

    return new Service(
        address,
        grpc.credentials.createInsecure()
    );
}

// Generic gRPC Error Handler
export const grpcErrorHandler = (error) => {
    if (!error) {
        return null;
    }

    const grpcError = new Error(
        error.details || error.message || "gRPC request failed"
    );

    grpcError.code = error.code;
    grpcError.details = error.details;

    return grpcError;
};

// Convert gRPC Callback to Promise
export const grpcCall = (client, method, request = {}) => {
    return new Promise((resolve, reject) => {
        if (!client || typeof client[method] !== "function") {
            return reject(
                new Error(
                    `gRPC method "${method}" not found`
                )
            );
        }

        client[method](request, (error, response) => {
            if (error) {
                return reject(grpcErrorHandler(error));
            }
            resolve(response);
        });
    });
};

// Export gRPC Package
export {
    grpc,
    PROTO_DIR,
};