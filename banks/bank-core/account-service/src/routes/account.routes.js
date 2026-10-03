// src/routes/account.route.js

import { Router } from "express";

import accountController from "../controllers/account.controller.js";
import accountLimitController from "../controllers/accountLimit.controller.js";

const router = Router();

/**
 * Account APIs
 */

// Create Account
// POST /accounts
router.post("/", accountController.createAccount);

// Get All Accounts
// GET /accounts
router.get("/", accountController.getAllAccounts);

// Get Account by Account Number
// GET /accounts/number/:accountNumber
router.get(
    "/number/:accountNumber",
    accountController.getAccountByNumber
);

// Get Account by ID
// GET /accounts/:id
router.get("/:id", accountController.getAccountById);

// Update Account
// PATCH /accounts/:id
router.patch("/:id", accountController.updateAccount);

// Freeze Account
// PATCH /accounts/:id/freeze
router.patch("/:id/freeze", accountController.freezeAccount);

// Activate Account
// PATCH /accounts/:id/activate
router.patch("/:id/activate", accountController.activateAccount);

// Close Account
// PATCH /accounts/:id/close
router.patch("/:id/close", accountController.closeAccount);

// Delete Account
// DELETE /accounts/:id
router.delete("/:id", accountController.deleteAccount);

/**
 * Account Limit APIs
 */
// Create Account Limit
//  * POST /accounts/limits
router.post(
    "/limits",
    accountLimitController.createAccountLimit
);
// Get Account Limits
// GET /accounts/:id/limits
router.get(
    "/:id/limits",
    accountLimitController.getAccountLimitById
);

// Update Account Limits
// PATCH /accounts/:id/limits
router.patch(
    "/:id/limits",
    accountLimitController.updateAccountLimit
);

export default router;