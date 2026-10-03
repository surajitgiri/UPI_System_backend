import ledgerService from "../services/ledger.service.js";
import AppError from "../errors/ApiError.js";

import { successResponse } from "../utils/response.js";

class LedgerController {

    // POST /ledger
    async createLedgerEntry(req, res, next) {
        try {
            const ledgerEntry = await ledgerService.createLedgerEntry(req.body);

            return successResponse(
                res,
                "Ledger entry created successfully",
                ledgerEntry,
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /ledger/:id
    async getLedgerEntryById(req, res, next) {
        try {
            const { id } = req.params;

            const ledgerEntry = await ledgerService.getLedgerEntryById(id);

            if (!ledgerEntry) {
                throw new AppError(
                    "Ledger entry not found",
                    404
                );
            }

            return successResponse(
                res,
                "Ledger entry fetched successfully",
                ledgerEntry
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /ledger/transaction/:transactionId
    async getLedgerByTransactionId(req, res, next) {
        try {
            const { transactionId } = req.params;

            const ledgerEntries = await ledgerService.getLedgerByTransactionId(
                transactionId
            );

            return successResponse(
                res,
                "Transaction ledger fetched successfully",
                ledgerEntries
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /ledger/transaction/:transactionId
    async getLedgerByTransactionId(req, res, next) {
        try {
            const { transactionId } = req.params;

            const ledgerEntries =
                await ledgerService.getLedgerByTransactionId(
                    transactionId
                );

            return successResponse(
                res,
                "Transaction ledger fetched successfully",
                ledgerEntries
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /ledger/account/:accountId
    async getAccountLedger(req, res, next) {
        try {
            const { accountId } = req.params;

            const ledgerEntries =
                await ledgerService.getAccountLedger(
                    accountId
                );

            return successResponse(
                res,
                "Account ledger fetched successfully",
                ledgerEntries
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /ledger/account/:accountId/latest
    async getLatestAccountEntry(req, res, next) {
        try {
            const { accountId } = req.params;

            const ledgerEntry =
                await ledgerService.getLatestAccountEntry(
                    accountId
                );

            if (!ledgerEntry) {
                throw new AppError(
                    "No ledger entry found for this account",
                    404
                );
            }

            return successResponse(
                res,
                "Latest account ledger entry fetched successfully",
                ledgerEntry
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /ledger/account/:accountId/paginated
    async getAccountLedgerPaginated(req, res, next) {
        try {
            const { accountId } = req.params;

            const {
                page = 1,
                limit = 50,
            } = req.query;

            const result =
                await ledgerService.getAccountLedgerPaginated(
                    accountId,
                    page,
                    limit
                );

            return successResponse(
                res,
                "Account ledger fetched successfully",
                result
            );
        } catch (error) {
            next(error);
        }
    }

    // POST /ledger/:id/reverse
    async reverseLedgerEntry(req, res, next) {
        try {
            const { id } = req.params;

            const ledgerEntry =
                await ledgerService.reverseLedgerEntry(id);

            return successResponse(
                res,
                "Ledger entry reversed successfully",
                ledgerEntry
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /ledger/count
    async countLedgerEntries(req, res, next) {
        try {
            const count =
                await ledgerService.countLedgerEntries();

            return successResponse(
                res,
                "Ledger entry count fetched successfully",
                { count }
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /ledger/account/:accountId/count
    async countAccountLedgerEntries(req, res, next) {
        try {
            const { accountId } = req.params;

            const count =
                await ledgerService.countAccountLedgerEntries(
                    accountId
                );

            return successResponse(
                res,
                "Account ledger count fetched successfully",
                { count }
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /ledger/transaction/:transactionId/count
    async countTransactionLedgerEntries(req, res, next) {
        try {
            const { transactionId } = req.params;

            const count =
                await ledgerService.countTransactionLedgerEntries(
                    transactionId
                );

            return successResponse(
                res,
                "Transaction ledger count fetched successfully",
                { count }
            );
        } catch (error) {
            next(error);
        }
    }
}

export default new LedgerController();