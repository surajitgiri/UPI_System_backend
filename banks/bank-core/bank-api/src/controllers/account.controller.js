import accountClient from "../grpc/clients/account.client.js";

import { successResponse } from "../utils/response.js"

import AppError from "../errors/AppError.js";

class AccountController {

    // POST /accounts
    async createAccount(req, res, next) {
        try {
            const account = await accountClient.createAccount(req.body);

            return successResponse(
                res,
                "Account created successfully",
                account,
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /accounts
    async getAccounts(req, res, next) {
        try {
            const accounts = await accountClient.getAccounts();

            return successResponse(
                res,
                "Accounts fetched successfully",
                accounts
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /accounts/:id
    async getAccountById(req, res, next) {
        try {
            const { id } = req.params;

            const account = await accountClient.getAccountById(id);

            if (!account) {
                throw new AppError(
                    "Account not found",
                    404
                );
            }

            return successResponse(
                res,
                "Account fetched successfully",
                account
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /accounts/number/:accountNumber
    async getAccountByNumber(req, res, next) {
        try {
            const { accountNumber } = req.params;

            const account = await accountClient.getAccountByAccountNumber(accountNumber);

            if (!account) {
                throw new AppError(
                    "Account not found",
                    404
                );
            }

            return successResponse(
                res,
                "Account fetched successfully",
                account
            );
        } catch (error) {
            next(error);
        }
    }

    // PATCH /accounts/:id
    async updateAccount(req, res, next) {
        try {
            const { id } = req.params;

            const account =
                await accountClient.updateAccount(
                    id,
                    req.body
                );

            if (!account) {
                throw new AppError(
                    "Account not found",
                    404
                );
            }

            return successResponse(
                res,
                "Account updated successfully",
                account
            );
        } catch (error) {
            next(error);
        }
    }

    // PATCH /accounts/:id/freeze
    async freezeAccount(req, res, next) {
        try {
            const { id } = req.params;

            const account =
                await accountClient.freezeAccount(id);

            if (!account) {
                throw new AppError(
                    "Account not found",
                    404
                );
            }

            return successResponse(
                res,
                "Account frozen successfully",
                account
            );
        } catch (error) {
            next(error);
        }
    }

    // PATCH /accounts/:id/activate
    async activateAccount(req, res, next) {
        try {
            const { id } = req.params;

            const account = await accountClient.activateAccount(id);

            if (!account) {
                throw new AppError(
                    "Account not found",
                    404
                );
            }

            return successResponse(
                res,
                "Account activated successfully",
                account
            );
        } catch (error) {
            next(error);
        }
    }

    // PATCH /accounts/:id/close
    async closeAccount(req, res, next) {
        try {
            const { id } = req.params;

            const account = await accountClient.closeAccount(id);

            if (!account) {
                throw new AppError(
                    "Account not found",
                    404
                );
            }

            return successResponse(
                res,
                "Account closed successfully",
                account
            );
        } catch (error) {
            next(error);
        }
    }

    // DELETE /accounts/:id
    async deleteAccount(req, res, next) {
        try {
            const { id } = req.params;

            await accountClient.deleteAccount(id);

            return successResponse(
                res,
                "Account deleted successfully",
                null
            );
        } catch (error) {
            next(error);
        }
    }
}

export default new AccountController;