import ledgerRepository from "../repositories/ledger.repository.js";
import AppError from "../errors/ApiError.js";


class LedgerService {

    //Create Ledger Entry
    async createLedgerEntry(data) {
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
        } = data;

        // Basic business validation
        if (!transactionId) {
            throw new AppError(
                "Transaction ID is required",
                400
            );
        }

        if (!accountId) {
            throw new AppError(
                "Account ID is required",
                400
            );
        }

        if (!entryType) {
            throw new AppError(
                "Entry type is required",
                400
            );
        }

        if (!["DEBIT", "CREDIT"].includes(entryType)) {
            throw new AppError(
                "Entry type must be DEBIT or CREDIT",
                400
            );
        }

        if (amount === undefined || amount === null) {
            throw new AppError(
                "Amount is required",
                400
            );
        }

        if (Number(amount) <= 0) {
            throw new AppError(
                "Amount must be greater than zero",
                400
            );
        }

        if (balanceBefore === undefined || balanceBefore === null) {
            throw new AppError(
                "Balance before is required",
                400
            );
        }

        if (balanceAfter === undefined || balanceAfter === null) {
            throw new AppError(
                "Balance after is required",
                400
            );
        }

        // Prevent duplicate ledger posting for the same
        // transaction/account/type combination.
        const existingEntries = await ledgerRepository.findByTransactionId(
            transactionId
        );

        const duplicateEntry = existingEntries.find(
            (entry) =>
                entry.accountId === accountId &&
                entry.entryType === entryType &&
                entry.status === "POSTED"
        );

        if (duplicateEntry) {
            throw new AppError(
                "Ledger entry already exists for this transaction",
                409
            );
        }

        return await ledgerRepository.create({
            transactionId,
            accountId,
            entryType,
            amount,
            currency: currency || "INR",
            balanceBefore,
            balanceAfter,
            description,
            reference,
        });
    }


    // * Create Multiple Ledger Entries
    //  * Useful for double-entry transactions:
    //  * Account A -> DEBIT
    //  * Account B -> CREDIT
    async createLedgerEntries(entries) {
        if (!Array.isArray(entries) || entries.length === 0) {
            throw new AppError(
                "Ledger entries are required",
                400
            );
        }

        for (const entry of entries) {
            if (!entry.transactionId) {
                throw new AppError(
                    "Transaction ID is required",
                    400
                );
            }

            if (!entry.accountId) {
                throw new AppError(
                    "Account ID is required",
                    400
                );
            }

            if (!["DEBIT", "CREDIT"].includes(entry.entryType)) {
                throw new AppError(
                    "Entry type must be DEBIT or CREDIT",
                    400
                );
            }

            if (
                entry.amount === undefined ||
                entry.amount === null ||
                Number(entry.amount) <= 0
            ) {
                throw new AppError(
                    "Ledger amount must be greater than zero",
                    400
                );
            }
        }

        return await ledgerRepository.createMany(entries);
    }

    //Get Ledger Entry By ID
    async getLedgerEntryById(id) {
        if (!id) {
            throw new AppError(
                "Ledger ID is required",
                400
            );
        }

        const entry = await ledgerRepository.findById(id);

        if (!entry) {
            throw new AppError(
                "Ledger entry not found",
                404
            );
        }
        return entry;
    }

    //Get Ledger Entries By Transaction ID
    async getLedgerByTransactionId(transactionId) {
        if (!transactionId) {
            throw new AppError(
                "Transaction ID is required",
                400
            );
        }

        return await ledgerRepository.findByTransactionId(
            transactionId
        );
    }

    //Get Ledger Entries By Account ID
    async getAccountLedger(accountId) {
        if (!accountId) {
            throw new AppError(
                "Account ID is required",
                400
            );
        }

        return await ledgerRepository.findByAccountId(
            accountId
        );
    }

    // Get Account Ledger With Pagination
    async getAccountLedgerPaginated(
        accountId,
        page = 1,
        limit = 50
    ) {
        if (!accountId) {
            throw new AppError(
                "Account ID is required",
                400
            );
        }

        page = Number(page);
        limit = Number(limit);

        if (page < 1) {
            page = 1;
        }

        if (limit < 1 || limit > 100) {
            limit = 50;
        }

        const skip = (page - 1) * limit;

        const [entries, total] = await Promise.all([
            ledgerRepository.findAccountLedger(
                accountId,
                skip,
                limit
            ),
            ledgerRepository.countByAccountId(accountId),
        ]);

        return {
            entries,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Get Latest Ledger Entry
    async getLatestAccountEntry(accountId) {
        if (!accountId) {
            throw new AppError(
                "Account ID is required",
                400
            );
        }

        return await ledgerRepository.findLatestEntry(
            accountId
        );
    }

    //Get Latest Posted Ledger Entry
    async getLatestPostedAccountEntry(accountId) {
        if (!accountId) {
            throw new AppError(
                "Account ID is required",
                400
            );
        }

        return await ledgerRepository.findLatestPostedEntry(
            accountId
        );
    }

    // Reverse Ledger Entry
    async reverseLedgerEntry(id) {
        if (!id) {
            throw new AppError(
                "Ledger ID is required",
                400
            );
        }

        const entry = await ledgerRepository.findById(id);

        if (!entry) {
            throw new AppError(
                "Ledger entry not found",
                404
            );
        }

        if (entry.status === "REVERSED") {
            throw new AppError(
                "Ledger entry is already reversed",
                409
            );
        }

        if (entry.status !== "POSTED") {
            throw new AppError(
                "Only posted ledger entries can be reversed",
                400
            );
        }

        return await ledgerRepository.reverse(id);
    }


    //Check Ledger Entry Exists
    async ledgerEntryExists(id) {
        return await ledgerRepository.exists(id);
    }

    //Count All Ledger Entries
    async countLedgerEntries() {
        return await ledgerRepository.count();
    }

    //Count Account Ledger Entries
    async countAccountLedgerEntries(accountId) {
        if (!accountId) {
            throw new AppError(
                "Account ID is required",
                400
            );
        }

        return await ledgerRepository.countByAccountId(
            accountId
        );
    }

    // Count Transaction Ledger Entries
    async countTransactionLedgerEntries(transactionId) {
        if (!transactionId) {
            throw new AppError(
                "Transaction ID is required",
                400
            );
        }

        return await ledgerRepository.countByTransactionId(
            transactionId
        );
    }
}

export default new LedgerService();