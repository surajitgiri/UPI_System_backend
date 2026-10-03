import accountService from "../services/account.service.js";
import AppError from "../errors/AppError.js";
import { createAccountSchema, updateAccountSchema } from "../validators/account.validator.js";

import { successResponse } from "../utils/response.js";

class AccountController {

    //POST /accounts
    async createAccount(req, res, next) {
        try {
            const data = createAccountSchema.parse(req.body);
            const account = await accountService.createAccount(data);

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

    //GET /accounts
    async getAllAccounts(req, res, next) {
        try {
            const accounts = await accountService.getAllAccounts();

            return successResponse(
                res,
                "Accounts fetched successfully",
                accounts,
                200
            );
        } catch (error) {
            next(error);
        }
    }

    //GET /accounts/:id
    async getAccountById(req, res, next) {
        try {
            const { id } = req.params;
            const account = await accountService.getAccountById(id);

            if (!account) {
                throw new AppError("Account not found", 404);
            }

            return successResponse(
                res,
                "Account fetched successfully",
                account,
                200
            );
        } catch (error) {
            next(error);
        }
    }

    //GET /accounts/number/:accountNumber
    async getAccountByNumber(req, res, next) {
        try {
            const { accountNumber } = req.params;

            const account = await accountService.getAccountByNumber(accountNumber);

            if (!account) {
                throw new AppError("Account not found", 404);
            }

            return successResponse(
                res,
                "Account fetched successfully",
                account,
                200
            );
        } catch (error) {
            next(error);
        }
    }

    //PATCH /accounts/:id
    async updateAccount(req, res, next) {
        try {
            const { id } = req.params;

            const exists = await accountService.accountExists(id);

            if (!exists) {
                throw new AppError("Account not found", 404);
            }

            const data = updateAccountSchema.parse(req.body);
            const account = await accountService.updateAccount(id, data);

            return successResponse(
                res,
                "Account Updated Successfully",
                account
            );
        } catch (error) {
            next(error);
        }
    }

    //PATCH /accounts/:id/freeze
    async freezeAccount(req, res, next) {
        try {
            const { id } = req.params;

            const exists = await accountService.accountExists(id);

            if (!exists) {
                throw new AppError("Account Not Found", 404);
            }

            const account = await accountService.freezeAccount(id);

            return successResponse(
                res,
                "Account frozen successfully",
                account
            );
        } catch (error) {
            next(error);
        }
    }

    //PATCH /accounts/:id/activate
    async activateAccount(req, res, next) {
        try {
            const { id } = req.params;

            const exists = await accountService.accountExists(id);

            if (!exists) {
                throw new AppError("Account not found", 404);
            }

            const account = await accountService.activateAccount(id);

            return successResponse(
                res,
                "Account activated successfully",
                account
            );

        } catch (error) {
            next(error);
        }
    }

    //PATCH /accounts/:id/close
    async closeAccount(req, res, next) {
        try {
            const { id } = req.params;

            const exists = await accountService.accountExists(id);

            if (!exists) {
                throw new AppError("Account not found", 404);
            }

            const account = await accountService.closeAccount(id);

            return successResponse(
                res,
                "Account closed successfully",
                account
            );
        } catch (error) {
            next(error);
        }
    }

    //DELETE /accounts/:id
    async deleteAccount(req, res, next) {
        try {
            const { id } = req.params;

            const exists = await accountService.accountExists(id);

            if (!exists) {
                throw new AppError("Account not found", 404);
            }

            await accountService.deleteAccount(id);

            return successResponse(
                res,
                "Account deleted successfully"
            );
        } catch (error) {
            next(error);
        }
    }
}

export default new AccountController();