import { Router } from "express";

import transactionController from "../controllers/transaction.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Transaction Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Create Transaction
|--------------------------------------------------------------------------
| POST /transactions
|--------------------------------------------------------------------------
*/
router.post(
    "/",
    transactionController.createTransaction
);


/*
|--------------------------------------------------------------------------
| Get All Transactions
|--------------------------------------------------------------------------
| GET /transactions
|--------------------------------------------------------------------------
*/
router.get(
    "/",
    transactionController.getAllTransactions
);


/*
|--------------------------------------------------------------------------
| Count All Transactions
|--------------------------------------------------------------------------
| GET /transactions/count
|
| IMPORTANT:
| Keep this before /:id
|--------------------------------------------------------------------------
*/
router.get(
    "/count",
    transactionController.countTransactions
);


/*
|--------------------------------------------------------------------------
| Get Transaction By Reference
|--------------------------------------------------------------------------
| GET /transactions/reference/:reference
|
| Must come before /:id
|--------------------------------------------------------------------------
*/
router.get(
    "/reference/:reference",
    transactionController.getTransactionByReference
);


/*
|--------------------------------------------------------------------------
| Account Transactions
|--------------------------------------------------------------------------
*/

/*
| GET /transactions/account/:accountId
*/
router.get(
    "/account/:accountId",
    transactionController.getAccountTransactions
);


/*
| GET /transactions/account/:accountId/source
*/
router.get(
    "/account/:accountId/source",
    transactionController.getSourceAccountTransactions
);


/*
| GET /transactions/account/:accountId/destination
*/
router.get(
    "/account/:accountId/destination",
    transactionController.getDestinationAccountTransactions
);


/*
| GET /transactions/account/:accountId/count
|
| IMPORTANT:
| This must be before /account/:accountId/:something
| if you add more dynamic routes later.
*/
router.get(
    "/account/:accountId/count",
    transactionController.countAccountTransactions
);


/*
|--------------------------------------------------------------------------
| Transaction Status
|--------------------------------------------------------------------------
*/

/*
| GET /transactions/status/:status/count
*/
router.get(
    "/status/:status/count",
    transactionController.countTransactionsByStatus
);


/*
| GET /transactions/status/:status
*/
router.get(
    "/status/:status",
    transactionController.getTransactionsByStatus
);


/*
|--------------------------------------------------------------------------
| Transaction Type
|--------------------------------------------------------------------------
*/

/*
| GET /transactions/type/:type/count
*/
router.get(
    "/type/:type/count",
    transactionController.countTransactionsByType
);


/*
| GET /transactions/type/:type
*/
router.get(
    "/type/:type",
    transactionController.getTransactionsByType
);


/*
|--------------------------------------------------------------------------
| Transaction Processing
|--------------------------------------------------------------------------
*/

/*
| POST /transactions/:id/process-transfer
*/
router.post(
    "/:id/process-transfer",
    transactionController.processTransfer
);


/*
| POST /transactions/:id/process-deposit
*/
router.post(
    "/:id/process-deposit",
    transactionController.processDeposit
);


/*
| POST /transactions/:id/process-withdrawal
*/
router.post(
    "/:id/process-withdrawal",
    transactionController.processWithdrawal
);


/*
|--------------------------------------------------------------------------
| Transaction Reversal
|--------------------------------------------------------------------------
*/

/*
| PATCH /transactions/:id/reverse
*/
router.patch(
    "/:id/reverse",
    transactionController.reverseTransaction
);


/*
|--------------------------------------------------------------------------
| Mark Transaction Failed
|--------------------------------------------------------------------------
*/

/*
| PATCH /transactions/:id/failed
*/
router.patch(
    "/:id/failed",
    transactionController.markTransactionFailed
);


/*
|--------------------------------------------------------------------------
| Get Transaction By ID
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Keep this route at the END because :id
| can match paths such as /count, /reference, etc.
|--------------------------------------------------------------------------
*/
router.get(
    "/:id",
    transactionController.getTransactionById
);


export default router;