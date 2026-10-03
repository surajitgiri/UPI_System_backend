// upi-service/src/grpc/clients/accountClient.js
// gRPC client for account-service — used to validate accountId before creating a VPA

import grpc        from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path        from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../../proto/account.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs:    String,
    enums:    String,
    defaults: true,
    oneofs:   true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);

const ACCOUNT_GRPC_ADDRESS = process.env.ACCOUNT_GRPC_ADDRESS || "localhost:50052";

const accountClient = new proto.account.AccountService(
    ACCOUNT_GRPC_ADDRESS,
    grpc.credentials.createInsecure()
);

// ─────────────────────────────────────────────
// Promisified helpers
// ─────────────────────────────────────────────

export function getAccountById(accountId) {
    return new Promise((resolve, reject) => {
        accountClient.GetAccountById({ id: accountId }, (err, response) => {
            if (err) return reject(err);
            resolve(response);
        });
    });
}

export function validateAccount(accountId, amount = "0") {
    return new Promise((resolve, reject) => {
        accountClient.ValidateAccount({ accountId, amount }, (err, response) => {
            if (err) return reject(err);
            resolve(response);
        });
    });
}

export default accountClient;
