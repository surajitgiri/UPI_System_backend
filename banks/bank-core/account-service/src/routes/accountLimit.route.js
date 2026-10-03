import { Router } from "express";

import accountLimitController from "../controllers/accountLimit.controller.js";

const router = Router();

// Create Account Limit
//  * POST /accounts/limits
router.post(
    "/limits",
    accountLimitController.createAccountLimit
);

//  * Get Account Limit by Account ID
//  * GET /accounts/:id/limits
router.get(
    "/:id/limits",
    accountLimitController.getAccountLimitById
);

// * Update Account Limit
//  * PATCH /accounts/:id/limits
router.patch(
    "/:id/limits",
    accountLimitController.updateAccountLimit
);

export default router;