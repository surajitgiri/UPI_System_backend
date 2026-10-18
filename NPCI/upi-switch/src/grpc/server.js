// upi-switch/src/grpc/server.js
// gRPC server — exposes SwitchService to bank services

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

import {
    processPayment,
    getTransaction,
    getTransactionByRrn,
    initiateReversal,
    getReversal,
} from "./switch.handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../proto/switch.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);

export function startGrpcServer(Port) {
    const server = new grpc.Server();

    server.addService(proto.switch.SwitchService.service, {
        ProcessPayment: processPayment,
        GetTransaction: getTransaction,
        GetTransactionByRrn: getTransactionByRrn,
        InitiateReversal: initiateReversal,
        GetReversal: getReversal
    });

    server.bindAsync(
        `0.0.0.0:${Port}`,
        grpc.ServerCredentials.createInsecure(),
        (error, boundPort) => {
            if (error) {
                console.error("❌ Switch gRPC Server failed to start:", error);
                return;
            }
            console.log(`✅ Switch gRPC Server running on port ${boundPort}`);

        }
    )

    return server;
};
