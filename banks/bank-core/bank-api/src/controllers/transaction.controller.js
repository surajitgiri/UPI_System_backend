import transactionClient from "../grpc/clients/transaction.client.js";

import { successResponse } from "../utils/response.js";

import AppError from "../errors/AppError.js";


class TransactionController {

    //POST /transactions

    async createTransaction(req, res, next) {
        try {
            const transaction =
                await transactionClient.createTransaction(
                    req.body
                );

            return successResponse(
                res,
                "Transaction created successfully",
                transaction,
                201
            );
        } catch (error) {
            next(error);
        }
    }

    //GET /transactions

    async getTransactions(req, res, next) {
        try {
            const transactions =
                await transactionClient.getTransactions();

            return successResponse(
                res,
                "Transactions fetched successfully",
                transactions
            );
        } catch (error) {
            next(error);
        }
    }

    //GET /transactions/count

    async countTransactions(req, res, next) {
        try {
            const { status, type, } = req.query;

            const count =
                await transactionClient.countTransactions({
                    status,
                    type,
                });

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

    //GET /transactions/:id

    async getTransactionById(req, res, next) {
        try {
            const { id } = req.params;

            const transaction =
                await transactionClient.getTransactionById(
                    id
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

    // GET /transactions/reference/:reference

    async getTransactionByReference(req, res, next) {
        try {
            const { reference } = req.params;

            const transaction =
                await transactionClient.getTransactionByReference(
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

    //GET /transactions/account/:accountId

    async getTransactionsByAccountId(req, res, next) {
        try {
            const { accountId } = req.params;

            const transactions =
                await transactionClient.getTransactionsByAccountId(
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

    //GET /transactions/status/:status

    async getTransactionsByStatus(req, res, next) {
        try {
            const { status } = req.params;

            const transactions =
                await transactionClient.getTransactionsByStatus(
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

    //GET /transactions/type/:type

    async getTransactionsByType(req, res, next) {
        try {
            const { type } = req.params;

            const transactions =
                await transactionClient.getTransactionsByType(
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

    //POST /transactions/:id/process-transfer

    async processTransfer(req, res, next) {
        try {
            const { id } = req.params;

            const transaction =
                await transactionClient.processTransfer(
                    id
                );

            if (!transaction) {
                throw new AppError(
                    "Transaction not found",
                    404
                );
            }

            return successResponse(
                res,
                "Transfer processed successfully",
                transaction
            );
        } catch (error) {
            next(error);
        }
    }

    //POST /transactions/:id/process-deposit

    async processDeposit(req, res, next) {
        try {
            const { id } = req.params;

            const transaction =
                await transactionClient.processDeposit(
                    id
                );

            if (!transaction) {
                throw new AppError(
                    "Transaction not found",
                    404
                );
            }

            return successResponse(
                res,
                "Deposit processed successfully",
                transaction
            );
        } catch (error) {
            next(error);
        }
    }

    //POST /transactions/:id/process-withdrawal

    async processWithdrawal(req, res, next) {
        try {
            const { id } = req.params;

            const transaction =
                await transactionClient.processWithdrawal(
                    id
                );

            if (!transaction) {
                throw new AppError(
                    "Transaction not found",
                    404
                );
            }

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
                await transactionClient.reverseTransaction(
                    id
                );

            if (!transaction) {
                throw new AppError(
                    "Transaction not found",
                    404
                );
            }

            return successResponse(
                res,
                "Transaction reversed successfully",
                transaction
            );
        } catch (error) {
            next(error);
        }
    }

    //PATCH /transactions/:id/failed

    async markTransactionFailed(req, res, next) {
        try {
            const { id } = req.params;

            const { failureReason, } = req.body;

            const transaction =
                await transactionClient.markTransactionFailed(
                    id,
                    failureReason
                );

            if (!transaction) {
                throw new AppError(
                    "Transaction not found",
                    404
                );
            }

            return successResponse(
                res,
                "Transaction marked as failed",
                transaction
            );
        } catch (error) {
            next(error);
        }
    }
}


export default new TransactionController();