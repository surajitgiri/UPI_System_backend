import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import {
    createLedgerEntry,
    createLedgerEntries,
    getEntriesByAccountId,
    getEntriesByTransactionId,
    getLedgerEntryById
} from "./ledger.handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../proto/ledger.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    enums: String,
    longs: String,
    defaults: true,
    oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition);

export function startGrpcServer(port) {
    const server = new grpc.Server();

    server.addService(proto.ledger.LedgerService.service, {
        CreateLedgerEntry: createLedgerEntry,
        CreateLedgerEntries: createLedgerEntries,
        GetLedgerEntryById: getLedgerEntryById,
        GetEntriesByTransactionId: getEntriesByTransactionId,
        GetEntriesByAccountId: getEntriesByAccountId,
    });

    server.bindAsync(
        `0.0.0.0:${port}`,
        grpc.ServerCredentials.createInsecure(),
        (error, boundPort) => {
            if (error) {
                console.error("❌ Ledger gRPC Server failed to start:", error);
                return;
            }
            console.log(`✅ Ledger gRPC Server running on port ${boundPort}`);

        }
    );

    return server;
}

