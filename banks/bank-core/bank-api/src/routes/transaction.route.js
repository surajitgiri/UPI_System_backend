import { Router } from "express";

import transactionController from "../controllers/transaction.controller.js";

import validate from "../middleware/validate.middleware.js";

import transactionValidator from "../validators/transaction.validator.js";


const router = Router();


/*
|--------------------------------------------------------------------------
| POST /transactions
|--------------------------------------------------------------------------
| Create transaction
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    validate(transactionValidator.createTransactionValidator),
    transactionController.createTransaction
);


/*
|--------------------------------------------------------------------------
| GET /transactions
|--------------------------------------------------------------------------
| Get all transactions
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    transactionController.getTransactions
);


/*
|--------------------------------------------------------------------------
| GET /transactions/count
|--------------------------------------------------------------------------
| Count transactions
|--------------------------------------------------------------------------
| IMPORTANT: Must come before /:id
|--------------------------------------------------------------------------
*/

router.get(
    "/count",
    transactionController.countTransactions
);


/*
|--------------------------------------------------------------------------
| GET /transactions/reference/:reference
|--------------------------------------------------------------------------
| Get transaction by reference
|--------------------------------------------------------------------------
*/

router.get(
    "/reference/:reference",
    transactionController.getTransactionByReference
);


/*
|--------------------------------------------------------------------------
| GET /transactions/account/:accountId
|--------------------------------------------------------------------------
| Get transactions by account
|--------------------------------------------------------------------------
*/

router.get(
    "/account/:accountId",
    transactionController.getTransactionsByAccountId
);


/*
|--------------------------------------------------------------------------
| GET /transactions/status/:status
|--------------------------------------------------------------------------
| Get transactions by status
|--------------------------------------------------------------------------
*/

router.get(
    "/status/:status",
    transactionController.getTransactionsByStatus
);


/*
|--------------------------------------------------------------------------
| GET /transactions/type/:type
|--------------------------------------------------------------------------
| Get transactions by type
|--------------------------------------------------------------------------
*/

router.get(
    "/type/:type",
    transactionController.getTransactionsByType
);


/*
|--------------------------------------------------------------------------
| POST /transactions/:id/process-transfer
|--------------------------------------------------------------------------
*/

router.post(
    "/:id/process-transfer",
    validate(transactionValidator.transactionIdValidator),
    transactionController.processTransfer
);


/*
|--------------------------------------------------------------------------
| POST /transactions/:id/process-deposit
|--------------------------------------------------------------------------
*/

router.post(
    "/:id/process-deposit",
    validate(transactionValidator.transactionIdValidator),
    transactionController.processDeposit
);


/*
|--------------------------------------------------------------------------
| POST /transactions/:id/process-withdrawal
|--------------------------------------------------------------------------
*/

router.post(
    "/:id/process-withdrawal",
    validate(transactionValidator.transactionIdValidator),
    transactionController.processWithdrawal
);


/*
|--------------------------------------------------------------------------
| PATCH /transactions/:id/reverse
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id/reverse",
    validate(transactionValidator.transactionIdValidator),
    transactionController.reverseTransaction
);


/*
|--------------------------------------------------------------------------
| PATCH /transactions/:id/failed
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id/failed",
    validate(transactionValidator.transactionIdValidator),
    transactionController.markTransactionFailed
);


/*
|--------------------------------------------------------------------------
| GET /transactions/:id
|--------------------------------------------------------------------------
| Get transaction by ID
|--------------------------------------------------------------------------
| Keep this LAST because :id is generic.
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    validate(transactionValidator.transactionIdValidator),
    transactionController.getTransactionById
);


export default router;