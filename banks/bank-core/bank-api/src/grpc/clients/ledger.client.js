import { loadProto, createGrpcClient, grpcCall } from "../client.js";
import { LEDGER_GRPC_ADDRESS } from "../../config/grpc.js"

// Load Ledger Proto

const ledgerProto = loadProto("ledger.proto");

// Create Ledger gRPC Client
const ledgerClient = createGrpcClient(
    ledgerProto.ledger.LedgerService,
    LEDGER_GRPC_ADDRESS
);

// Get Ledger By ID
const getLedgerById = async (id) => {
    const response = await grpcCall(
        ledgerClient,
        "getLedgerById",
        { id }
    );
    return response.data;
};

// Get Ledger By Account ID
const getLedgerByAccountId = async (accountId) => {
    const response = await grpcCall(
        ledgerClient,
        "getLedgerByAccountId",
        {
            accountId,
        }
    );

    return response.data || [];
};

// Get Latest Ledger By Account ID
const getLatestLedgerByAccountId = async (accountId) => {
    const response = await grpcCall(
        ledgerClient,
        "getLatestLedgerByAccountId",
        {
            accountId,
        }
    );

    return response.data;
};

// Get Paginated Ledger By Account ID
const getLedgerByAccountIdPaginated = async (accountId, page = 1, limit = 20) => {
    const response = await grpcCall(
        ledgerClient,
        "getLedgerByAccountIdPaginated",
        { accountId, page: Number(page), limit: Number(limit) }
    );

    return {
        data: response.data || [],
        pagination: response.pagination || null,
    }
}

//Get Ledger By Transaction ID
const getLedgerByTransactionId = async (
    transactionId
) => {
    const response = await grpcCall(
        ledgerClient,
        "getLedgerByTransactionId",
        {
            transactionId,
        }
    );

    return response.data;
};

// Export
export default {
    getLedgerById,
    getLedgerByAccountId,
    getLatestLedgerByAccountId,
    getLedgerByAccountIdPaginated,
    getLedgerByTransactionId
}