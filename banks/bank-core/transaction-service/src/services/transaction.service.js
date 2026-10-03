import transactionRepository from "../repositories/transaction.repository.js";
import AppError from "../errors/AppError.js";

import {
    generateTransactionReference,
    isValidAmount,
} from "../utils/transaction.js";

// gRPC connection with Account Service
import {
    creditAccountGrpc,
    debitAccountGrpc,
    getAccountByIdGrpc,
    validateAccountGrpc,
    getAccountByNumberGrpc
} from "../grpc/account.client.js";

// gRPC connection with Ledger Service
import {
    createLedgerEntryGrpc,
    createLedgerEntriesGrpc
} from "../grpc/ledger.client.js";

import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../utils/constants.js"

class TransactionService {

    // CREATE TRANSACTION
    async createTransaction(data) {
        const {
            type,
            sourceAccountId,
            destinationAccountId,
            amount,
            currency,
            description,
        } = data;

        // Validate transaction type
        if (!type) {
            throw new AppError(
                "Transaction type is required",
                400
            );
        }

        if (!Object.values(TRANSACTION_TYPE).includes(type)) {
            throw new AppError(
                "Invalid transaction type",
                400
            );
        }

        // Validate amount
        if (!isValidAmount(amount)) {
            throw new AppError(
                "Transaction amount must be greater than zero",
                400
            );
        }

        // Validate transfer
        if (type === TRANSACTION_TYPE.TRANSFER) {

            if (!sourceAccountId) {
                throw new AppError(
                    "Source account ID is required",
                    400
                );
            }

            if (!destinationAccountId) {
                throw new AppError(
                    "Destination account ID is required",
                    400
                );
            }

            if (sourceAccountId === destinationAccountId) {
                throw new AppError(
                    "Source and destination accounts cannot be the same",
                    400
                );
            }
        }

        // Validate deposit
        if (type === TRANSACTION_TYPE.DEPOSIT) {

            if (!destinationAccountId) {
                throw new AppError(
                    "Destination account ID is required for deposit",
                    400
                );
            }
        }

        // Validate withdrawal
        if (type === TRANSACTION_TYPE.WITHDRAWAL) {

            if (!sourceAccountId) {
                throw new AppError(
                    "Source account ID is required for withdrawal",
                    400
                );
            }
        }

        // ─────────────────────────────────────────────────────────
        // gRPC Account Validation — verify accounts exist & are
        // ACTIVE before writing anything to the database
        // ─────────────────────────────────────────────────────────
        if (sourceAccountId) {
            let sourceAccountResponse;

            try {
                sourceAccountResponse = await getAccountByIdGrpc(sourceAccountId);
            } catch (err) {
                console.error("[gRPC] getAccountByIdGrpc (source) failed:", err.code, err.message);
                throw new AppError(`Account service error: ${err.message}`, 503);
            }

            if (!sourceAccountResponse?.success || !sourceAccountResponse?.data?.id) {
                throw new AppError("Source account not found", 404);
            }

            if (sourceAccountResponse.data.status !== "ACTIVE") {
                throw new AppError(
                    `Source account is ${sourceAccountResponse.data.status} and cannot be used`,
                    400
                );
            }
        }

        if (destinationAccountId) {
            let destAccountResponse;

            try {
                destAccountResponse = await getAccountByIdGrpc(destinationAccountId);
            } catch (err) {
                console.error("[gRPC] getAccountByIdGrpc (destination) failed:", err.code, err.message);
                throw new AppError(`Account service error: ${err.message}`, 503);
            }

            if (!destAccountResponse?.success || !destAccountResponse?.data?.id) {
                throw new AppError("Destination account not found", 404);
            }

            if (destAccountResponse.data.status !== "ACTIVE") {
                throw new AppError(
                    `Destination account is ${destAccountResponse.data.status} and cannot be used`,
                    400
                );
            }
        }

        // Generate unique reference
        let transactionReference = generateTransactionReference();

        //Extremely unlikely collision protection
        while (
            await transactionRepository.referenceExists(
                transactionReference
            )
        ) {
            transactionReference = generateTransactionReference();
        }


        const transaction = await transactionRepository.create({
            transactionReference,
            type,
            status: TRANSACTION_STATUS.PENDING,
            sourceAccountId: sourceAccountId || null,
            destinationAccountId: destinationAccountId || null,
            amount,
            currency: currency || "INR",
            description: description || null,
        });

        return transaction;
    }

    // GET TRANSACTION BY ID
    async getTransactionById(id) {
        if (!id) {
            throw new AppError(
                "Transaction ID is required",
                400
            );
        }

        const transaction = await transactionRepository.findById(id);

        if (!transaction) {
            throw new AppError(
                "Transaction not found",
                404
            );
        }

        return transaction;
    }

    // GET TRANSACTION BY REFERENCE
    async getTransactionByReference(reference) {
        if (!reference) {
            throw new AppError(
                "Transaction reference is required",
                400
            );
        }

        const transaction = await transactionRepository.findByReference(reference);

        if (!transaction) {
            throw new AppError(
                "Transaction not found",
                404
            );
        }

        return transaction;
    }

    // GET ALL TRANSACTIONS
    async getAllTransactions() {
        return await transactionRepository.findAll();
    }

    // GET ACCOUNT TRANSACTIONS
    async getAccountTransactions(accountId) {
        if (!accountId) {
            throw new AppError(
                "Account ID is required",
                400
            );
        }
        return await transactionRepository.findByAccount(
            accountId
        );
    }

    // GET TRANSACTIONS BY SOURCE ACCOUNT
    async getSourceAccountTransactions(accountId) {

        if (!accountId) {
            throw new AppError(
                "Account ID is required",
                400
            );
        }

        return await transactionRepository.findBySourceAccount(accountId);
    }

    // GET TRANSACTIONS BY DESTINATION ACCOUNT
    async getDestinationAccountTransactions(accountId) {

        if (!accountId) {
            throw new AppError(
                "Account ID is required",
                400
            );
        }

        return await transactionRepository.findByDestinationAccount(
            accountId
        );
    }

    // GET TRANSACTIONS BY STATUS
    async getTransactionsByStatus(status) {

        if (!status) {
            throw new AppError(
                "Transaction status is required",
                400
            );
        }

        if (!Object.values(TRANSACTION_STATUS).includes(status)) {
            throw new AppError(
                "Invalid transaction status",
                400
            );
        }

        return await transactionRepository.findByStatus(
            status
        );
    }

    // GET TRANSACTIONS BY TYPE
    async getTransactionsByType(type) {
        if (!type) {
            throw new AppError(
                "Transaction type is required",
                400
            );
        }

        if (!Object.values(TRANSACTION_TYPE).includes(type)) {
            throw new AppError(
                "Invalid transaction type",
                400
            );
        }

        return await transactionRepository.findByType(
            type
        );
    }

    // PROCESS TRANSFER
    async processTransfer(transactionId) {
        const transaction = await this.getTransactionById(
            transactionId
        );

        //Make sure transaction is a transfer
        if (transaction.type !== TRANSACTION_TYPE.TRANSFER) {
            throw new AppError(
                "Transaction is not a transfer",
                400
            );
        }

        //Prevent duplicate processing
        if (transaction.status === TRANSACTION_STATUS.SUCCESS) {
            return transaction;
        }

        if (transaction.status === TRANSACTION_STATUS.REVERSED) {
            throw new AppError(
                "Reversed transaction cannot be processed",
                400
            );
        }

        if (transaction.status === TRANSACTION_STATUS.FAILED) {
            throw new AppError(
                "Failed transaction cannot be processed",
                400
            );
        }

        /*
        * ========================================================
        * IMPORTANT
        *
        * Actual account debit/credit should happen through
        * Account Service gRPC.
        *
        * Example:
        *
        * await accountClient.debitAccount(...)
        * await accountClient.creditAccount(...)
        *
        * Ledger entries should then be created through
        * Ledger Service gRPC.
        * ========================================================
        */

        await transactionRepository.markProcessing(transactionId);

        try {

            /*
             * TODO:
             *
             * 1. Get source account
             * 2. Get destination account
             * 3. Validate both accounts
             * 4. Debit source account
             * 5. Credit destination account
             * 6. Create debit ledger entry
             * 7. Create credit ledger entry
             */

            // ========================================================
            // 1. Fetch and validate source account
            const sourceValidation = await validateAccountGrpc(
                transaction.sourceAccountId,
                transaction.amount.toString()
            );

            if (!sourceValidation.isValid) {
                throw new AppError(`Source account is invalid: ${sourceValidation.message}`, 400);
            }

            if (!sourceValidation.hasSufficientBalance) {
                throw new AppError("Insufficient balance in source account", 400);
            }

            //========================================================

            // 2. Fetch and validate destination account
            const destValidation = await validateAccountGrpc(
                transaction.destinationAccountId, "0"
            );

            if (!destValidation.isValid) {
                throw new AppError(`Destination account is invalid: ${destValidation.message}`, 400);
            }

            // ========================================================
            // 3. Debit source account
            const debitResult = await debitAccountGrpc(
                transaction.sourceAccountId,
                transaction.amount.toString(),
                transaction.transactionReference
            );

            if (!debitResult.success) {
                throw new AppError(`Debit failed: ${debitResult.message}`, 400);
            }

            //========================================================
            // 4. Credit destination account
            const creditResult = await creditAccountGrpc(
                transaction.destinationAccountId,
                transaction.amount.toString(),
                transaction.transactionReference
            );
            if (!creditResult.success) {
                // Compensate: re-credit the source account
                await creditAccountGrpc(
                    transaction.destinationAccountId,
                    transaction.amount.toString(),
                    transaction.transactionReference
                );

                throw new AppError(`Credit failed: ${creditResult.message}`, 400)
            }

            //========================================================
            // 5. Create double-entry ledger entries via gRPC
            // DEBIT  → source account (money left)
            // CREDIT → destination account (money arrived)

            await createLedgerEntriesGrpc([
                {
                    transactionId: transaction.id,
                    accountId: transaction.sourceAccountId,
                    entryType: "DEBIT",
                    amount: transaction.amount.toString(),
                    currency: transaction.currency,
                    balanceBefore: sourceValidation.updatedBalance ?? "0", // before debit
                    balanceAfter: debitResult.updatedBalance,
                    description: transaction.description || "Transfer debit",
                    reference: transaction.transactionReference
                },
                {
                    transactionId: transaction.id,
                    accountId: transaction.destinationAccountId,
                    entryType: "CREDIT",
                    amount: transaction.amount.toString(),
                    currency: transaction.currency,
                    balanceBefore: destValidation.updatedBalance ?? "0", // before debit
                    balanceAfter: creditResult.updatedBalance,
                    description: transaction.description || "Transfer Credit",
                    reference: transaction.transactionReference
                },
            ]);

            const updatedTransaction = await transactionRepository.markSuccess(transactionId);

            return updatedTransaction;
        } catch (error) {
            await transactionRepository.markFailed(
                transactionId,
                error.message
            );

            throw error;
        }

    }

    // PROCESS DEPOSIT
    async processDeposit(transactionId) {
        const transaction = await this.getTransactionById(transactionId);

        if (transaction.type !== TRANSACTION_TYPE.DEPOSIT) {
            throw new AppError(
                "Transaction is not a deposit",
                400
            );
        }

        if (transaction.status === TRANSACTION_STATUS.SUCCESS) {
            return transaction;
        }

        if (transaction.status === TRANSACTION_STATUS.REVERSED) {
            throw new AppError(
                "Reversed transaction cannot be processed",
                400
            );
        }

        await transactionRepository.markProcessing(
            transactionId
        );

        try {
            /*
            * TODO:
            *
            * Account Service:
            *     Credit destination account
            *
            * Ledger Service:
            *     Create CREDIT ledger entry
            */
            const creditResult = await creditAccountGrpc(
                transaction.destinationAccountId,
                transaction.amount.toString(),
                transaction.transactionReference
            );
            if (!creditResult.success) {
                throw new AppError(`credit failed: ${creditResult.message}`, 400)
            }

            // ========================================================
            // Create CREDIT ledger entry via gRPC
            // ========================================================
            await createLedgerEntryGrpc({
                transactionId: transaction.id,
                accountId: transaction.destinationAccountId,
                entryType: "CREDIT",
                amount: transaction.amount.toString(),
                currency: transaction.currency,
                balanceBefore: (parseFloat(creditResult.updatedBalance) - parseFloat(transaction.amount)).toString(),
                balanceAfter: creditResult.updatedBalance,
                description: transaction.description || "Deposit",
                reference: transaction.transactionReference,
            });

            const updatedTransaction = await transactionRepository.markSuccess(transactionId);

            return updatedTransaction;
        } catch (error) {
            await transactionRepository.markFailed(
                transactionId,
                error.message
            );

            throw error;
        }
    }

    // PROCESS WITHDRAWAL
    async processWithdrawal(transactionId) {

        const transaction = await this.getTransactionById(transactionId);
        if (transaction.type !== TRANSACTION_TYPE.WITHDRAWAL) {
            throw new AppError(
                "Transaction is not a withdrawal",
                400
            );
        }

        if (transaction.status === TRANSACTION_STATUS.SUCCESS) {
            return transaction;
        }

        if (transaction.status === TRANSACTION_STATUS.REVERSED) {
            throw new AppError(
                "Reversed transaction cannot be processed",
                400
            );
        }

        await transactionRepository.markProcessing(transactionId);

        try {

            /*
             * TODO:
             *
             * Account Service:
             *     Debit source account
             *
             * Ledger Service:
             *     Create DEBIT ledger entry
             */

            // Validate and debit source account via gRPC
            const validation = await validateAccountGrpc(
                transaction.sourceAccountId,
                transaction.amount.toString()
            );
            if (!validation.isValid) {
                throw new AppError(`Account is invalid: ${validation.message}`, 400);
            }
            if (!validation.hasSufficientBalance) {
                throw new AppError("Insufficient balance", 400);
            }

            const debitResult = await debitAccountGrpc(
                transaction.sourceAccountId,
                transaction.amount.toString(),
                transaction.transactionReference
            );
            if (!debitResult.success) {
                throw new AppError(`Debit failed: ${debitResult.message}`, 400);
            }

            // ========================================================
            // Create DEBIT ledger entry via gRPC
            // ========================================================
            await createLedgerEntryGrpc({
                transactionId: transaction.id,
                accountId: transaction.sourceAccountId,
                entryType: "DEBIT",
                amount: transaction.amount.toString(),
                currency: transaction.currency,
                balanceBefore: (parseFloat(debitResult.updatedBalance) + parseFloat(transaction.amount)).toString(),
                balanceAfter: debitResult.updatedBalance,
                description: transaction.description || "Withdrawal",
                reference: transaction.transactionReference,
            });


            const updatedTransactions = await transactionRepository.markSuccess(transactionId);

            return updatedTransactions;
        } catch (error) {
            await transactionRepository.markFailed(
                transactionId,
                error.message
            );
            throw error;
        }
    }

    // REVERSE TRANSACTION
    async reverseTransaction(transactionId) {
        const transaction = await this.getTransactionById(transactionId);

        if (transaction.status !== TRANSACTION_STATUS.SUCCESS) {
            throw new AppError(
                "Only successful transactions can be reversed",
                400
            );
        }

        /*
         * TODO:
         *
         * Reversal should NOT simply modify balances.
         *
         * For a transfer:
         *
         * Original:
         *     Account A DEBIT
         *     Account B CREDIT
         *
         * Reversal:
         *     Account A CREDIT
         *     Account B DEBIT
         *
         * Create compensating ledger entries.
         */
        try {
            if (transaction.type === TRANSACTION_TYPE.TRANSFER) {
                // Re-credit source, re-debit destination
                const recreditResult = await creditAccountGrpc(
                    transaction.sourceAccountId,
                    transaction.amount.toString(),
                    transaction.transactionReference
                );

                const redebitResult = await debitAccountGrpc(
                    transaction.destinationAccountId,
                    transaction.amount.toString(),
                    transaction.transactionReference
                );

                // Compensating ledger entries
                await createLedgerEntriesGrpc([
                    {
                        transactionId: transaction.id,
                        accountId: transaction.sourceAccountId,
                        entryType: "CREDIT",                          // reversal
                        amount: transaction.amount.toString(),
                        currency: transaction.currency,
                        balanceBefore: (parseFloat(recreditResult.updatedBalance) - parseFloat(transaction.amount)).toString(),
                        balanceAfter: recreditResult.updatedBalance,
                        description: "Reversal credit",
                        reference: transaction.transactionReference,
                    },
                    {
                        transactionId: transaction.id,
                        accountId: transaction.destinationAccountId,
                        entryType: "DEBIT",                           // reversal
                        amount: transaction.amount.toString(),
                        currency: transaction.currency,
                        balanceBefore: (parseFloat(redebitResult.updatedBalance) + parseFloat(transaction.amount)).toString(),
                        balanceAfter: redebitResult.updatedBalance,
                        description: "Reversal debit",
                        reference: transaction.transactionReference,
                    },
                ]);
            }

            if (transaction.type === TRANSACTION_TYPE.DEPOSIT) {
                // Reverse deposit → debit the destination account back
                const debitResult = await debitAccountGrpc(
                    transaction.destinationAccountId,
                    transaction.amount.toString(),
                    transaction.transactionReference
                );
                await createLedgerEntryGrpc({
                    transactionId: transaction.id,
                    accountId: transaction.destinationAccountId,
                    entryType: "DEBIT",
                    amount: transaction.amount.toString(),
                    currency: transaction.currency,
                    balanceBefore: (parseFloat(debitResult.updatedBalance) + parseFloat(transaction.amount)).toString(),
                    balanceAfter: debitResult.updatedBalance,
                    description: "Reversal debit",
                    reference: transaction.transactionReference,
                });
            }

            if (transaction.type === TRANSACTION_TYPE.WITHDRAWAL) {
                // Reverse withdrawal → credit the source account back
                const creditResult = await creditAccountGrpc(
                    transaction.sourceAccountId,
                    transaction.amount.toString(),
                    transaction.transactionReference
                );
                await createLedgerEntryGrpc({
                    transactionId: transaction.id,
                    accountId: transaction.sourceAccountId,
                    entryType: "CREDIT",
                    amount: transaction.amount.toString(),
                    currency: transaction.currency,
                    balanceBefore: (parseFloat(creditResult.updatedBalance) - parseFloat(transaction.amount)).toString(),
                    balanceAfter: creditResult.updatedBalance,
                    description: "Reversal credit",
                    reference: transaction.transactionReference,
                });
            }


        } catch (error) {
            throw new AppError(`Reversal failed: ${error.message}`, 500);
        }
        return await transactionRepository.markReversed(transactionId);
    }

    // MARK TRANSACTION FAILED
    async markTransactionFailed(transactionId, failureReason) {
        await this.getTransactionById(transactionId);

        await this.getTransactionById(transactionId);

        return await transactionRepository.markFailed(transactionId, failureReason);
    }

    // COUNT TRANSACTIONS
    async countTransactions() {
        return await transactionRepository.count();
    }

    // COUNT ACCOUNT TRANSACTIONS
    async countAccountTransactions(accountId) {

        if (!accountId) {
            throw new AppError(
                "Account ID is required",
                400
            );
        }

        return await transactionRepository.countByAccount(
            accountId
        );
    }

    // COUNT STATUS TRANSACTIONS
    async countTransactionsByStatus(status) {

        if (!Object.values(TRANSACTION_STATUS).includes(status)
        ) {
            throw new AppError(
                "Invalid transaction status",
                400
            );
        }

        return await transactionRepository.countByStatus(
            status
        );
    }

    // COUNT TYPE TRANSACTIONS
    async countTransactionsByType(type) {

        if (!Object.values(TRANSACTION_TYPE).includes(type)) {
            throw new AppError(
                "Invalid transaction type",
                400
            );
        }

        return await transactionRepository.countByType(
            type
        );
    }
}

export default new TransactionService();