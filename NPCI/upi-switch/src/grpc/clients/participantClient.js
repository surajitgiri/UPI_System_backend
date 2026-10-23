// upi-switch/src/grpc/clients/participantClient.js
// gRPC client for Routing-Service — resolves VPA → { vpaId, accountId, bankCode }

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../../proto/participant.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);

const PARTICIPANT_GRPC_ADDRESS = process.env.PARTICIPANT_GRPC_ADDRESS || "localhost:50061";

const participantClient = new proto.participant.ParticipantService(
    PARTICIPANT_GRPC_ADDRESS,
    grpc.credentials.createInsecure()
);

export function lookupVpa(vpaAddress) {
    return new Promise((resolve, reject) => {
        participantClient.LookupVpa({ vpaAddress }, (err, response) => {
            if (err) return reject(err);
            resolve(response);
        });
    });
}

export default participantClient;
