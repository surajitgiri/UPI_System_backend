// account-service/src/grpc/account.handler.js
// gRPC handler implementations - called by the gRPC server

import accountRepository from "../repositories/account/account.repository.js";
import AppError from "../errors/AppError.js";


// ---------------------------------------------
// Helper: map Prisma Account ? gRPC Account message
// ---------------------------------------------
function mapAccount(account) {
    return {
        id: account.id,
        accountNumber: account.accountNumber,
        customerId: account.customerId,
        branchId: account.branchId,
        accountType: account.accountType,
        status: account.status,

        currency: account.currency,
        availableBalance: account.availableBalance?.toString() ?? "0",
        holdBalance: account.holdBalance?.toString() ?? "0",
        minimumBalance: account.minimumBalance?.toString() ?? "0",
        openingDate: account.openingDate?.toISOString() ?? "",
        createdAt: account.createdAt?.toISOString() ?? "",
        updatedAt: account.updatedAt?.toISOString() ?? "",
    };
}

// ---------------------------------------------
// GetAccountById
// ---------------------------------------------
export async function getAccountById(call, callback) {
    try {
        const { id } = call.request;

        if (!id) {
            return callback(null, {
                success: false,
                message: "Account ID is required",
                data: null,
            });
        }

        const account = await accountRepository.findById(id);

        if (!account) {
            return callback(null, {
                success: false,
                message: "Account not found",
                data: null,
            });
        }

        callback(null, {
            success: true,
            message: "Account fetched successfully",
            data: mapAccount(account),
        });
    } catch (error) {
        callback({
            code: 13, // INTERNAL
            message: error.message || "Internal gRPC error",
        });
    }
}

// ---------------------------------------------
// GetAccountByNumber
// ---------------------------------------------
export async function getAccountByNumber(call, callback) {
    try {
        const { accountNumber } = call.request;

        if (!accountNumber) {
            return callback(null, {
                success: false,
                message: "Account number is required",
                data: null,
            });
        }

        const account = await accountRepository.findByAccountNumber(accountNumber);

        if (!account) {
            return callback(null, {
                success: false,
                message: "Account not found",
                data: null,
            });
        }

        callback(null, {
            success: true,
            message: "Account fetched successfully",
            data: mapAccount(account),
        });
    } catch (error) {
        callback({
            code: 13,
            message: error.message || "Internal gRPC error",
        });
    }
}

// ---------------------------------------------
// DebitAccount
// ---------------------------------------------
export async function debitAccount(call, callback) {
    try {
        const { accountId, amount, transactionReference } = call.request;

        if (!accountId || !amount) {
            return callback(null, {
                success: false,
                message: "accountId and amount are required",
                updatedBalance: "0",
            });
        }

        const debitAmount = parseFloat(amount);

        if (isNaN(debitAmount) || debitAmount <= 0) {
            return callback(null, {
                success: false,
                message: "Invalid debit amount",
                updatedBalance: "0",
            });
        }

        const account = await accountRepository.findById(accountId);

        if (!account) {
            return callback(null, {
                success: false,
                message: "Account not found",
                updatedBalance: "0",
            });
        }

        if (account.status !== "ACTIVE") {
            return callback(null, {
                success: false,
                message: `Cannot debit a ${account.status} account`,
                updatedBalance: account.availableBalance?.toString() ?? "0",
            });
        }

        const currentBalance = parseFloat(account.availableBalance.toString());

        if (currentBalance < debitAmount) {
            return callback(null, {
                success: false,
                message: "Insufficient balance",
                updatedBalance: currentBalance.toString(),
            });
        }

        // Atomically decrement via repository (single Prisma client)
        const updated = await accountRepository.debitBalance(accountId, debitAmount);

        callback(null, {
            success: true,
            message: "Account debited successfully",
            updatedBalance: updated.availableBalance?.toString() ?? "0",
        });
    } catch (error) {
        callback({
            code: 13,
            message: error.message || "Internal gRPC error",
        });
    }
}

// ---------------------------------------------
// CreditAccount
// ---------------------------------------------
export async function creditAccount(call, callback) {
    try {
        const { accountId, amount, transactionReference } = call.request;

        if (!accountId || !amount) {
            return callback(null, {
                success: false,
                message: "accountId and amount are required",
                updatedBalance: "0",
            });
        }

        const creditAmount = parseFloat(amount);

        if (isNaN(creditAmount) || creditAmount <= 0) {
            return callback(null, {
                success: false,
                message: "Invalid credit amount",
                updatedBalance: "0",
            });
        }

        const account = await accountRepository.findById(accountId);

        if (!account) {
            return callback(null, {
                success: false,
                message: "Account not found",
                updatedBalance: "0",
            });
        }

        if (account.status !== "ACTIVE") {
            return callback(null, {
                success: false,
                message: `Cannot credit a ${account.status} account`,
                updatedBalance: account.availableBalance?.toString() ?? "0",
            });
        }

        // Atomically increment via repository (single Prisma client)
        const updated = await accountRepository.creditBalance(accountId, creditAmount);

        callback(null, {
            success: true,
            message: "Account credited successfully",
            updatedBalance: updated.availableBalance?.toString() ?? "0",
        });
    } catch (error) {
        callback({
            code: 13,
            message: error.message || "Internal gRPC error",
        });
    }
}

// ---------------------------------------------
// ValidateAccount
// ---------------------------------------------
export async function validateAccount(call, callback) {
    try {
        const { accountId, amount } = call.request;

        if (!accountId) {
            return callback(null, {
                success: false,
                message: "Account ID is required",
                isValid: false,
                hasSufficientBalance: false,
            });
        }

        const account = await accountRepository.findById(accountId);

        if (!account) {
            return callback(null, {
                success: false,
                message: "Account not found",
                isValid: false,
                hasSufficientBalance: false,
            });
        }

        const isValid = account.status === "ACTIVE";

        let hasSufficientBalance = true;
        const checkAmount = parseFloat(amount ?? "0");

        if (checkAmount > 0) {
            const balance = parseFloat(account.availableBalance.toString());
            hasSufficientBalance = balance >= checkAmount;
        }

        callback(null, {
            success: true,
            message: isValid ? "Account is valid" : `Account is ${account.status}`,
            isValid,
            hasSufficientBalance,
        });
    } catch (error) {
        callback({
            code: 13,
            message: error.message || "Internal gRPC error",
        });
    }
}
