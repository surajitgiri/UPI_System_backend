// upi-service/src/grpc/server.js
// gRPC server — exposes UpiService to other microservices

import grpc        from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path        from "path";
import { fileURLToPath } from "url";

import {
    getVpaByAddress,
    validateVpa,
    verifyUpiPin,
    recordTransaction,
    getTransaction,
} from "./upi.handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../proto/upi.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs:    String,
    enums:    String,
    defaults: true,
    oneofs:   true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);

// ─────────────────────────────────────────────
// Start gRPC Server
// ─────────────────────────────────────────────
export function startGrpcServer(port) {
    const server = new grpc.Server();

    server.addService(proto.upi.UpiService.service, {
        GetVpaByAddress:   getVpaByAddress,
        ValidateVpa:       validateVpa,
        VerifyUpiPin:      verifyUpiPin,
        RecordTransaction: recordTransaction,
        GetTransaction:    getTransaction,
    });

    server.bindAsync(
        `0.0.0.0:${port}`,
        grpc.ServerCredentials.createInsecure(),
        (error, boundPort) => {
            if (error) {
                console.error("❌ UPI gRPC Server failed to start:", error);
                return;
            }
            console.log(`✅ UPI gRPC Server running on port ${boundPort}`);
        }
    );

    return server;
}
