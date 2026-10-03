// account-service/src/grpc/server.js
// gRPC server that exposes AccountService to other microservices

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

import {
    getAccountById,
    getAccountByNumber,
    debitAccount,
    creditAccount,
    validateAccount,
} from "./account.handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../proto/account.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase:  false,
    longs:     String,
    enums:     String,
    defaults:  true,
    oneofs:    true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);

// ---------------------------------------------
// Start gRPC server
// ---------------------------------------------
export function startGrpcServer(port) {
    const server = new grpc.Server();

    server.addService(proto.account.AccountService.service, {
        GetAccountById:    getAccountById,
        GetAccountByNumber: getAccountByNumber,
        DebitAccount:      debitAccount,
        CreditAccount:     creditAccount,
        ValidateAccount:   validateAccount,
    });

    server.bindAsync(
        `0.0.0.0:${port}`,
        grpc.ServerCredentials.createInsecure(),
        (error, boundPort) => {
            if (error) {
                console.error("? gRPC Server failed to start:", error);
                return;
            }
            console.log(`? Account gRPC Server running on port ${boundPort}`);
        }
    );

    return server;
}
