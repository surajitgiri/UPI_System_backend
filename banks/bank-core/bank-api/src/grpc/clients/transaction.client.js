import {
    loadProto,
    createGrpcClient,
    grpcCall,
} from "../client.js";

import {
    TRANSACTION_GRPC_ADDRESS,
} from "../../config/grpc.js";


// Load Transaction Proto
const transactionProto = loadProto(
    "transaction.proto"
);


// Create Transaction gRPC Client
const transactionClient = createGrpcClient(
    transactionProto.transaction.TransactionService,
    TRANSACTION_GRPC_ADDRESS
);

// Create Transaction

const createTransaction = async (data) => {
    const response = await grpcCall(
        transactionClient,
        "createTransaction",
        {
            type: data.type || "",
            sourceAccountId: data.sourceAccountId || "",
            destinationAccountId: data.destinationAccountId || "",
            amount: data.amount?.toString() || "0",
            currency: data.currency || "INR",
            description: data.description || "",
        }
    );

    return response.data;
};

// Get All Transactions

const getTransactions = async () => {
    const response = await grpcCall(
        transactionClient,
        "getTransactions",
        {}
    );

    return response.data || [];
};

//Get Transaction By ID

const getTransactionById = async (id) => {
    const response = await grpcCall(
        transactionClient,
        "getTransactionById",
        {
            id,
        }
    );

    return response.data;
};


//Get Transaction By Reference
const getTransactionByReference = async (
    reference
) => {
    const response = await grpcCall(
        transactionClient,
        "getTransactionByReference",
        {
            reference,
        }
    );

    return response.data;
};


// Get Transactions By Account ID
const getTransactionsByAccountId = async (
    accountId
) => {
    const response = await grpcCall(
        transactionClient,
        "getTransactionsByAccountId",
        {
            accountId,
        }
    );

    return response.data || [];
};



//Get Transactions By Status
const getTransactionsByStatus = async (
    status
) => {
    const response = await grpcCall(
        transactionClient,
        "getTransactionsByStatus",
        {
            status,
        }
    );

    return response.data || [];
};

//Get Transactions By Type

const getTransactionsByType = async (
    type
) => {
    const response = await grpcCall(
        transactionClient,
        "getTransactionsByType",
        {
            type,
        }
    );

    return response.data || [];
};


// Count Transactions
const countTransactions = async ({
    status = "",
    type = "",
} = {}) => {
    const response = await grpcCall(
        transactionClient,
        "countTransactions",
        {
            status,
            type,
        }
    );

    return response.count || 0;
};

// Process Transfer

const processTransfer = async (id) => {
    const response = await grpcCall(
        transactionClient,
        "processTransfer",
        {
            id,
        }
    );

    return response.data;
};


// Process Deposit

const processDeposit = async (id) => {
    const response = await grpcCall(
        transactionClient,
        "processDeposit",
        {
            id,
        }
    );

    return response.data;
};


// Process Withdrawal

const processWithdrawal = async (id) => {
    const response = await grpcCall(
        transactionClient,
        "processWithdrawal",
        {
            id,
        }
    );

    return response.data;
};


// Reverse Transaction

const reverseTransaction = async (id) => {
    const response = await grpcCall(
        transactionClient,
        "reverseTransaction",
        {
            id,
        }
    );

    return response.data;
};

//Mark Transaction Failed

const markTransactionFailed = async (
    id,
    failureReason
) => {
    const response = await grpcCall(
        transactionClient,
        "markTransactionFailed",
        {
            id,
            failureReason:
                failureReason || "",
        }
    );

    return response.data;
};

// Export

export default {
    createTransaction,
    getTransactions,
    getTransactionById,
    getTransactionByReference,
    getTransactionsByAccountId,
    getTransactionsByStatus,
    getTransactionsByType,
    countTransactions,
    processTransfer,
    processDeposit,
    processWithdrawal,
    reverseTransaction,
    markTransactionFailed,
};