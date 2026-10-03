import transactionService from "../services/transaction.service.js";
import AppError from "../errors/AppError.js";

import { successResponse } from "../utils/response.js";

class TransactionController {

    // POST /transactions
    async createTransaction(req, res, next) {
        try {
            const transaction = await transactionService.createTransaction(req.body);

            return successResponse(
                res,
                "Transaction created successfully",
                transaction,
                201
            )
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions
    async getAllTransactions(req, res, next) {
        try {
            const transactions =
                await transactionService.getAllTransactions();

            return successResponse(
                res,
                "Transactions fetched successfully",
                transactions
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/:id
    async getTransactionById(req, res, next) {
        try {
            const { id } = req.params;

            const transaction =
                await transactionService.getTransactionById(id);

            if (!transaction) {
                throw new AppError(
                    "Transaction not found",
                    404
                );
            }

            return successResponse(
                res,
                "Transaction fetched successfully",
                transaction
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/reference/:reference
    async getTransactionByReference(req, res, next) {
        try {
            const { reference } = req.params;

            const transaction =
                await transactionService.getTransactionByReference(
                    reference
                );

            if (!transaction) {
                throw new AppError(
                    "Transaction not found",
                    404
                );
            }

            return successResponse(
                res,
                "Transaction fetched successfully",
                transaction
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/account/:accountId
    async getAccountTransactions(req, res, next) {
        try {
            const { accountId } = req.params;

            const transactions =
                await transactionService.getAccountTransactions(
                    accountId
                );

            return successResponse(
                res,
                "Account transactions fetched successfully",
                transactions
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/account/:accountId/source
    async getSourceAccountTransactions(req, res, next) {
        try {
            const { accountId } = req.params;

            const transactions =
                await transactionService.getSourceAccountTransactions(
                    accountId
                );

            return successResponse(
                res,
                "Source account transactions fetched successfully",
                transactions
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/account/:accountId/destination
    async getDestinationAccountTransactions(req, res, next) {
        try {
            const { accountId } = req.params;

            const transactions =
                await transactionService.getDestinationAccountTransactions(
                    accountId
                );

            return successResponse(
                res,
                "Destination account transactions fetched successfully",
                transactions
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/status/:status
    async getTransactionsByStatus(req, res, next) {
        try {
            const { status } = req.params;

            const transactions =
                await transactionService.getTransactionsByStatus(
                    status
                );

            return successResponse(
                res,
                "Transactions fetched successfully",
                transactions
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/type/:type
    async getTransactionsByType(req, res, next) {
        try {
            const { type } = req.params;

            const transactions =
                await transactionService.getTransactionsByType(
                    type
                );

            return successResponse(
                res,
                "Transactions fetched successfully",
                transactions
            );
        } catch (error) {
            next(error);
        }
    }

    // POST /transactions/:id/process-transfer
    async processTransfer(req, res, next) {
        try {
            const { id } = req.params;

            const transaction =
                await transactionService.processTransfer(id);

            return successResponse(
                res,
                "Transfer processed successfully",
                transaction
            );
        } catch (error) {
            next(error);
        }
    }

    // POST /transactions/:id/process-deposit
    async processDeposit(req, res, next) {
        try {
            const { id } = req.params;

            const transaction =
                await transactionService.processDeposit(id);

            return successResponse(
                res,
                "Deposit processed successfully",
                transaction
            );
        } catch (error) {
            next(error);
        }
    }

    // POST /transactions/:id/process-withdrawal
    async processWithdrawal(req, res, next) {
        try {
            const { id } = req.params;

            const transaction =
                await transactionService.processWithdrawal(id);

            return successResponse(
                res,
                "Withdrawal processed successfully",
                transaction
            );
        } catch (error) {
            next(error);
        }
    }

    // PATCH /transactions/:id/reverse
    async reverseTransaction(req, res, next) {
        try {
            const { id } = req.params;

            const transaction =
                await transactionService.reverseTransaction(id);

            return successResponse(
                res,
                "Transaction reversed successfully",
                transaction
            );
        } catch (error) {
            next(error);
        }
    }

    // PATCH /transactions/:id/failed
    async markTransactionFailed(req, res, next) {
        try {
            const { id } = req.params;

            const { failureReason } = req.body;

            if (!failureReason) {
                throw new AppError(
                    "Failure reason is required",
                    400
                );
            }

            const transaction =
                await transactionService.markTransactionFailed(
                    id,
                    failureReason
                );

            return successResponse(
                res,
                "Transaction marked as failed",
                transaction
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/count
    async countTransactions(req, res, next) {
        try {
            const count =
                await transactionService.countTransactions();

            return successResponse(
                res,
                "Transaction count fetched successfully",
                {
                    count,
                }
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/account/:accountId/count
    async countAccountTransactions(req, res, next) {
        try {
            const { accountId } = req.params;

            const count =
                await transactionService.countAccountTransactions(
                    accountId
                );

            return successResponse(
                res,
                "Account transaction count fetched successfully",
                {
                    count,
                }
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/status/:status/count
    async countTransactionsByStatus(req, res, next) {
        try {
            const { status } = req.params;

            const count =
                await transactionService.countTransactionsByStatus(
                    status
                );

            return successResponse(
                res,
                "Transaction status count fetched successfully",
                {
                    count,
                }
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/type/:type/count
    async countTransactionsByType(req, res, next) {
        try {
            const { type } = req.params;

            const count =
                await transactionService.countTransactionsByType(
                    type
                );

            return successResponse(
                res,
                "Transaction type count fetched successfully",
                {
                    count,
                }
            );
        } catch (error) {
            next(error);
        }
    }

}

export default new TransactionController();
