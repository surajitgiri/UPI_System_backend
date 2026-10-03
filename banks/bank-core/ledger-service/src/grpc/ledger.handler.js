// gRPC handler implementations called by the gRPC server
import ledgerRepository from "../repositories/ledger.repository.js";
import ledgerService from "../services/ledger.service.js";

// Helper: map Prisma LedgerEntry → gRPC message
function mapEntry(entry) {
    return {
        id: entry.id,
        transactionId: entry.transactionId,
        accountId: entry.accountId,
        entryType: entry.entryType,
        amount: entry.amount?.toString() ?? "0",
        currency: entry.currency ?? "INR",
        balanceBefore: entry.balanceBefore?.toString() ?? "0",
        balanceAfter: entry.balanceAfter?.toString() ?? "0",
        status: entry.status ?? "POSTED",
        description: entry.description ?? "",
        reference: entry.reference ?? "",
        createdAt: entry.createdAt?.toISOString() ?? "",
        updatedAt: entry.updatedAt?.toISOString() ?? "",
    };
}

// CreateLedgerEntry
export async function createLedgerEntry(call, callback) {
    try {
        const {
            transactionId,
            accountId,
            entryType,
            amount,
            currency,
            balanceBefore,
            balanceAfter,
            description,
            reference,
        } = call.request;

        const entry = await ledgerService.createLedgerEntry({
            transactionId,
            accountId,
            entryType,
            amount: parseFloat(amount),
            currency: currency || "INR",
            balanceBefore: parseFloat(balanceBefore),
            balanceAfter: parseFloat(balanceAfter),
            description,
            reference
        });

        callback(null, {
            success: true,
            message: "Ledger entry created successfully",
            data: mapEntry(entry),
        });
    } catch (error) {
        callback({
            code: 13, // INTERNAL
            message: error.message || "Internal gRPC error",
        });
    }
}

// CreateLedgerEntries (batch — for double-entry)
export async function createLedgerEntries(call, callback) {
    try {
        const { entries } = call.request;

        if (!entries || entries.length === 0) {
            return callback(null, {
                success: false,
                message: "No entries provided",
                data: [],
            });
        }

        const mapped = entries.map((e) => ({
            transactionId: e.transactionId,
            accountId: e.accountId,
            entryType: e.entryType,
            amount: parseFloat(e.amount),
            currency: e.currency || "INR",
            balanceBefore: parseFloat(e.balanceBefore),
            balanceAfter: parseFloat(e.balanceAfter),
            description: e.description,
            reference: e.reference,
        }));

        await ledgerService.createLedgerEntries(mapped);

        callback(null, {
            success: true,
            message: `${mapped.length} ledger entries created successfully`,
            data: [], // createMany does not return rows — fetch separately if needed
        });
    } catch (error) {
        callback({
            code: 13,
            message: error.message || "Internal gRPC error",
        });
    }
}

// GetLedgerEntryById
export async function getLedgerEntryById(call, callback) {
    try {
        const { id } = call.request;

        if (!id) {
            return callback(null, {
                success: false,
                message: "Ledger entry ID is required",
                data: null
            });
        }

        const entry = await ledgerRepository.findById(id);

        if (!entry) {
            return callback(null, {
                success: false,
                message: "Ledger entry not found",
                data: null,
            });
        }

        callback(null, {
            success: true,
            message: "Ledger entry fetched successfully",
            data: mapEntry(entry),
        });
    } catch (error) {
        callback({
            code: 13,
            message: error.message || "Internal gRPC error",
        });
    }
}

// GetEntriesByTransactionId
export async function getEntriesByTransactionId(call, callback) {
    try {
        const { transactionId } = call.request;
        if (!transactionId) {
            return callback(null, {
                success: false,
                message: "Transaction ID is required",
                data: [],
            });
        }
        const entries = await ledgerRepository.findByTransactionId(transactionId);
        callback(null, {
            success: true,
            message: "Ledger entries fetched successfully",
            data: entries.map(mapEntry),
        });
    } catch (error) {
        callback({
            code: 13,
            message: error.message || "Internal gRPC error",
        });
    }
}

// GetEntriesByAccountId
export async function getEntriesByAccountId(call, callback) {
    try {
        const { accountId } = call.request;
        if (!accountId) {
            return callback(null, {
                success: false,
                message: "Account ID is required",
                data: [],
            });
        }
        const entries = await ledgerRepository.findByAccountId(accountId);
        callback(null, {
            success: true,
            message: "Account ledger fetched successfully",
            data: entries.map(mapEntry),
        });
    } catch (error) {
        callback({
            code: 13,
            message: error.message || "Internal gRPC error",
        });
    }
}