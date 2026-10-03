import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../proto/account.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);

const accountClient = new proto.account.AccountService(
    process.env.ACCOUNT_GRPC_ADDRESS || "localhost:50052",
    grpc.credentials.createInsecure()
);

// Get account by internal UUID
export const getAccountByIdGrpc = (accountId) => {
    return new Promise((resolve, reject) => {
        accountClient.GetAccountById({ id: accountId }, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

// Get account by account number
export const getAccountByNumberGrpc = (accountNumber) => {
    return new Promise((resolve, reject) => {
        accountClient.GetAccountByNumber({ accountNumber }, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

// Debit an account (reduce availableBalance)
export const debitAccountGrpc = (accountId, amount, transactionReference) => {
    return new Promise((resolve, reject) => {
        accountClient.DebitAccount(
            { accountId, amount: amount.toString(), transactionReference }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
    });
}

// Credit an account (increase availableBalance)
export const creditAccountGrpc = (accountId, amount, transactionReference) => {
    return new Promise((resolve, reject) => {
        accountClient.CreditAccount(
            { accountId, amount: amount.toString(), transactionReference },
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
}

// Validate account is ACTIVE and optionally has sufficient balance
export const validateAccountGrpc = (accountId, amount = "0") => {
    return new Promise((resolve, reject) => {
        accountClient.ValidateAccount(
            { accountId, amount: amount.toString() },
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
}

export default accountClient;