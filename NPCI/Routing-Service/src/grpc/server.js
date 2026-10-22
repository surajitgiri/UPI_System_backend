import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import { lookupVpaHandler } from "./participant.handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../proto/participant.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);

export function startGrpcServer(port) {
    const server = new grpc.Server();

    server.addService(proto.participant.ParticipantService.service, {
        LookupVpa: lookupVpaHandler,
    });

    const bindPort = port || 50061;

    server.bindAsync(
        `0.0.0.0:${bindPort}`,
        grpc.ServerCredentials.createInsecure(),
        (error, boundPort) => {
            if (error) {
                console.error("❌ Routing gRPC Server failed to start:", error);
                return;
            }
            console.log(`✅ Routing gRPC Server running on port ${boundPort}`);
        }
    );

    return server;
}
