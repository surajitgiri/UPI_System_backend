import { Router } from "express";

import ledgerController from "../controllers/ledger.controller.js";

const router = Router();


/*
|--------------------------------------------------------------------------
| GET /ledger/:id
|--------------------------------------------------------------------------
| Get ledger entry by ID
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    ledgerController.getLedgerById
);


/*
|--------------------------------------------------------------------------
| GET /ledger/account/:accountId
|--------------------------------------------------------------------------
| Get all ledger entries for an account
|--------------------------------------------------------------------------
*/

router.get(
    "/account/:accountId",
    ledgerController.getLedgerByAccountId
);


/*
|--------------------------------------------------------------------------
| GET /ledger/account/:accountId/latest
|--------------------------------------------------------------------------
| Get latest ledger entry for an account
|--------------------------------------------------------------------------
*/

router.get(
    "/account/:accountId/latest",
    ledgerController.getLatestLedgerByAccountId
);


/*
|--------------------------------------------------------------------------
| GET /ledger/account/:accountId/paginated
|--------------------------------------------------------------------------
| Get paginated ledger entries
|--------------------------------------------------------------------------
*/

router.get(
    "/account/:accountId/paginated",
    ledgerController.getLedgerByAccountIdPaginated
);


/*
|--------------------------------------------------------------------------
| GET /ledger/transaction/:transactionId
|--------------------------------------------------------------------------
| Get ledger entry by transaction ID
|--------------------------------------------------------------------------
*/

router.get(
    "/transaction/:transactionId",
    ledgerController.getLedgerByTransactionId
);


export default router;