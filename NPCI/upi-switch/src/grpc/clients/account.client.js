// upi-switch/src/grpc/clients/account.client.js
// gRPC client for account-service — debit / credit accounts

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path, { resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../../proto/account.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);

const ACCOUNT_GRPC_ADDRESS = process.env.ACCOUNT_GRPC_ADDRESS || "localhost:50052";
const accountClient = new proto.account.AccountService(
    ACCOUNT_GRPC_ADDRESS,
    grpc.credentials.createInsecure()
);

const call = (method, payload) =>
    new Promise((resolve, reject) => {
        accountClient[method](payload, (err, response) => {
            if (err) return reject(err);
            resolve(response);
        });
    });

export const getAccountById = (accountId) =>
    call("GetAccountById", { id: accountId });

export const validateAccount = (accountId, amount = "0") =>
    call("ValidateAccount", { accountId, amount });

export const debitAccount = (accountId, amount, transactionReference) =>
    call("DebitAccount", { accountId, amount, transactionReference });

export const creditAccount = (accountId, amount, transactionReference) =>
    call("CreditAccount", { accountId, amount, transactionReference });

export default accountClient;