import accountLimitService from "../services/accountLimit.service.js";
import AppError from "../errors/AppError.js";

import { successResponse } from "../utils/response.js";

class AccountLimitController {

    // POST /accounts/limits
    async createAccountLimit(req, res, next) {
        try {
            const {
                accountId,
                dailyDebitLimit,
                dailyCreditLimit,
                monthlyTransferLimit,
            } = req.body;

            const AccountLimit = await accountLimitService.createAccountLimit({
                accountId,
                ...(dailyDebitLimit !== undefined && { dailyDebitLimit }),
                ...(dailyCreditLimit !== undefined && { dailyCreditLimit }),
                ...(monthlyTransferLimit !== undefined && { monthlyTransferLimit }),
            });

            return successResponse(
                res,
                "AccountLimit Created Successfully",
                AccountLimit,
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /accounts/:id/limits
    async getAccountLimitById(req, res, next) {
        try {
            const { id } = req.params;

            const AccountLimit = await accountLimitService.getAccountLimitByAccountId(id);

            if (!AccountLimit) {
                throw new AppError("AccountLimit Not Found", 404);
            }

            return successResponse(
                res,
                "AccountLimit Fetched Successfully",
                AccountLimit,
                200
            );
        } catch (error) {
            next(error);
        }
    }

    // PATCH /accounts/:id/limits
    async updateAccountLimit(req, res, next) {
        try {
            const { id } = req.params;

            const AccountLimit = await accountLimitService.getAccountLimitByAccountId(id);

            if (!AccountLimit) {
                throw new AppError("AccountLimit Not Found", 404);
            }

            const {
                dailyDebitLimit,
                dailyCreditLimit,
                monthlyTransferLimit,
            } = req.body;

            const updateData = {
                ...(dailyDebitLimit !== undefined && { dailyDebitLimit }),
                ...(dailyCreditLimit !== undefined && { dailyCreditLimit }),
                ...(monthlyTransferLimit !== undefined && { monthlyTransferLimit }),
            };

            const updateAccountLimit = await accountLimitService.updateAccountLimitByAccountId(id, updateData);

            return successResponse(
                res,
                "AccountLimit updated successfully",
                updateAccountLimit
            );
        } catch (error) {
            next(error);
        }
    }
}

export default new AccountLimitController();