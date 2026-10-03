import ledgerClient from "../grpc/clients/ledger.client.js";

import { successResponse } from "../utils/response.js";

import AppError from "../errors/AppError.js";


class LedgerController {

    // GET /ledger/:id

    async getLedgerById(req, res, next) {
        try {
            const { id } = req.params;

            const ledger =
                await ledgerClient.getLedgerById(id);

            if (!ledger) {
                throw new AppError(
                    "Ledger entry not found",
                    404
                );
            }

            return successResponse(
                res,
                "Ledger entry fetched successfully",
                ledger
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /ledger/account/:accountId

    async getLedgerByAccountId(req, res, next) {
        try {
            const { accountId } = req.params;

            const ledger = await ledgerClient.getLedgerByAccountId(accountId);

            return successResponse(
                res,
                "Account ledger fetched successfully",
                ledger
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /ledger/account/:accountId/latest

    async getLatestLedgerByAccountId(req, res, next) {
        try {
            const { accountId } = req.params;

            const ledger =
                await ledgerClient.getLatestLedgerByAccountId(
                    accountId
                );

            if (!ledger) {
                throw new AppError(
                    "Ledger entry not found",
                    404
                );
            }

            return successResponse(
                res,
                "Latest ledger entry fetched successfully",
                ledger
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /ledger/account/:accountId/paginated

    async getLedgerByAccountIdPaginated(req, res, next) {
        try {
            const { accountId } = req.params;

            const page = Number(req.query.page) || 1;

            const limit = Number(req.query.limit) || 20;

            const result =
                await ledgerClient.getLedgerByAccountIdPaginated(
                    accountId,
                    page,
                    limit
                );

            return successResponse(
                res,
                "Ledger entries fetched successfully",
                result
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /ledger/transaction/:transactionId

    async getLedgerByTransactionId(req, res, next) {
        try {
            const { transactionId } = req.params;

            const ledger = await ledgerClient.getLedgerByTransactionId(
                transactionId
            );

            if (!ledger) {
                throw new AppError(
                    "Ledger entry not found",
                    404
                );
            }

            return successResponse(
                res,
                "Ledger entry fetched successfully",
                ledger
            );
        } catch (error) {
            next(error);
        }
    }
}


export default new LedgerController();