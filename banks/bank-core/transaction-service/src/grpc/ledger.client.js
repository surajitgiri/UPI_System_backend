// gRPC client stub for LedgerService (ledger-service)
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "../proto/ledger.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition);

const ledgerClient = new proto.ledger.LedgerService(
    process.env.LEDGER_GRPC_ADDRESS || "localhost:50054",
    grpc.credentials.createInsecure()
);

// Create a single ledger entry
export const createLedgerEntryGrpc = (data) => {
    return new Promise((resolve, reject) => {
        ledgerClient.CreateLedgerEntry({
            transactionId: data.transactionId,
            accountId: data.accountId,
            entryType: data.entryType,           // "DEBIT" | "CREDIT"
            amount: data.amount.toString(),
            currency: data.currency || "INR",
            balanceBefore: data.balanceBefore.toString(),
            balanceAfter: data.balanceAfter.toString(),
            description: data.description || "",
            reference: data.reference || "",
        }, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

// Create multiple ledger entries in one call
// (use for double-entry: DEBIT + CREDIT together)
export const createLedgerEntriesGrpc = (entries) => {
    return new Promise((resolve, reject) => {
        const mapped = entries.map((e) => ({
            transactionId: e.transactionId,
            accountId: e.accountId,
            entryType: e.entryType,
            amount: e.amount.toString(),
            currency: e.currency || "INR",
            balanceBefore: e.balanceBefore.toString(),
            balanceAfter: e.balanceAfter.toString(),
            description: e.description || "",
            reference: e.reference || "",
        }));

        ledgerClient.CreateLedgerEntries({ entries: mapped }, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};


// Get all ledger entries for a transaction
export const getLedgerByTransactionGrpc = (transactionId) => {
    return new Promise((resolve, reject) => {
        ledgerClient.GetEntriesByTransactionId({ transactionId }, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

// Get all ledger entries for an account
export const getLedgerByAccountGrpc = (accountId) => {
    return new Promise((resolve, reject) => {
        ledgerClient.GetEntriesByAccountId({ accountId }, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};


export default ledgerClient;
