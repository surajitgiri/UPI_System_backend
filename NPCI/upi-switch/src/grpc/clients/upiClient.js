// upi-switch/src/grpc/clients/upiClient.js
// gRPC client for upi-service — record settled transactions

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../../proto/upi.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);

const UPI_GRPC_ADDRESS = process.env.UPI_GRPC_ADDRESS || "localhost:50056";

const upiClient = new proto.upi.UpiService(
    UPI_GRPC_ADDRESS,
    grpc.credentials.createInsecure()
);

const call = (method, payload) =>
    new Promise((resolve, reject) => {
        upiClient[method](payload, (err, response) => {
            if (err) return reject(err);
            resolve(response);
        });
    });

export const recordTransaction = (payload) => call("RecordTransaction", payload);
export const getVpaByAddress = (vpaAddress) => call("GetVpaByAddress", { vpaAddress });
export const validateVpa = (vpaAddress) => call("ValidateVpa", { vpaAddress });

export default upiClient;