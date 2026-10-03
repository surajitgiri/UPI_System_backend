import { loadProto, createGrpcClient, grpcCall } from "../client.js";

import { ACCOUNT_GRPC_ADDRESS } from "../../config/grpc.js";

// Load Account Proto
const accountProto = loadProto("account.proto");

// Create Account gRPC Client
const accountClient = createGrpcClient(
    accountProto.account.AccountService,
    ACCOUNT_GRPC_ADDRESS
);

// Create Account
const createAccount = async (data) => {
    const response = await grpcCall(accountClient, "createAccount", {
        accountNumber: data.accountNumber || "",
        customerId: data.customerId || "",
        branchId: data.branchId || "",
        accountType: data.accountType || "",
        currency: data.currency || "INR",
        availableBalance: data.availableBalance?.toString() || "0",
        holdBalance: data.holdBalance?.toString() || "0",
        minimumBalance: data.minimumBalance?.toString() || "0",
    });

    return response.data;
}

// Get All Accounts
const getAccounts = async () => {
    const response = await grpcCall(accountClient, "getAccounts", {});
    return response.data || [];
};

// Get Account By ID
const getAccountById = async (id) => {
    const response = await grpcCall(accountClient, "getAccountById", { id });

    return response.data;
}

// Get Account By Account Number
const getAccountByAccountNumber = async (accountNumber) => {
    const response = await grpcCall(accountClient, "getAccountByAccountNumber", { accountNumber });

    return response.data;
};

// Update Account
const updateAccount = async (id, data) => {
    const request = { id };

    // Only send fields that were actually provided.
    if (data.accountNumber !== undefined) {
        request.accountNumber = data.accountNumber;
    }
    if (data.customerId !== undefined) {
        request.customerId =
            data.customerId;
    }

    if (data.branchId !== undefined) {
        request.branchId =
            data.branchId;
    }

    if (data.accountType !== undefined) {
        request.accountType =
            data.accountType;
    }

    if (data.status !== undefined) {
        request.status =
            data.status;
    }

    if (data.currency !== undefined) {
        request.currency =
            data.currency;
    }

    if (data.availableBalance !== undefined) {
        request.availableBalance =
            data.availableBalance.toString();
    }

    if (data.holdBalance !== undefined) {
        request.holdBalance =
            data.holdBalance.toString();
    }

    if (data.minimumBalance !== undefined) {
        request.minimumBalance =
            data.minimumBalance.toString();
    }

    const response = await grpcCall(accountClient, "updateAccount", request);

    return response.data;
};

// Freeze Account
const freezeAccount = async (id) => {
    const response = await grpcCall(accountClient, "freezeAccount", { id });

    return response.data;
};

// Activate Account
const activateAccount = async (id) => {
    const response = await grpcCall(accountClient, "activateAccount", { id });

    return response.data;
};

// Close Account
const closeAccount = async (id) => {
    const response = await grpcCall(accountClient, "closeAccount", { id });

    return response.data;
}

// Delete Account
const deleteAccount = async (id) => {
    const response = await grpcCall(accountClient, "deleteAccount", { id })
    return response;
}

// Export
export default {
    createAccount,
    getAccounts,
    getAccountById,
    getAccountByAccountNumber,
    updateAccount,
    freezeAccount,
    activateAccount,
    closeAccount,
    deleteAccount,
};