import { Router } from "express";

import accountController from "../controllers/account.controller.js";

import validate from "../middleware/validate.middleware.js";

import accountValidator from "../validators/account.validator.js";

const router = Router();

//  POST /accounts
router.post(
    "/",
    validate(accountValidator.createAccountValidator),
    accountController.createAccount
);

//  GET /accounts
router.get(
    "/",
    accountController.getAccounts
);

// GET /accounts/number/:accountNumber
router.get(
    "/number/:accountNumber",
    validate(accountValidator.accountNumberValidator),
    accountController.getAccountByNumber
);

// GET /accounts/:id
router.get(
    "/:id",
    validate(accountValidator.accountIdValidator),
    accountController.getAccountById
);

// PATCH /accounts/:id/freeze
router.patch(
    "/:id/freeze",
    validate(accountValidator.accountIdValidator),
    accountController.freezeAccount
);

//PATCH /accounts/:id/activate
router.patch(
    "/:id/activate",
    validate(accountValidator.accountIdValidator),
    accountController.activateAccount
);

// PATCH /accounts/:id/close
router.patch(
    "/:id/close",
    validate(accountValidator.accountIdValidator),
    accountController.closeAccount
);

//PATCH /accounts/:id
router.patch(
    "/:id",
    validate(accountValidator.updateAccountValidator),
    accountController.updateAccount
);

// DELETE /accounts/:id
router.delete(
    "/:id",
    validate(accountValidator.accountIdValidator),
    accountController.deleteAccount
);

export default router;