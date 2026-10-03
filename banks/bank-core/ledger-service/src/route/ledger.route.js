// src/routes/ledger.route.js

import { Router } from "express";

import ledgerController from "../controllers/ledger.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Ledger Routes
|--------------------------------------------------------------------------
*/

/**
 * Create Ledger Entry
 * POST /ledger
 */
router.post(
    "/",
    ledgerController.createLedgerEntry
);


/**
 * Get Ledger Count
 * GET /ledger/count
 *
 * IMPORTANT:
 * Keep this before /:id
 */
router.get(
    "/count",
    ledgerController.countLedgerEntries
);


/**
 * Get Ledger Entries By Transaction ID
 * GET /ledger/transaction/:transactionId
 */
router.get(
    "/transaction/:transactionId",
    ledgerController.getLedgerByTransactionId
);


/**
 * Get Transaction Ledger Count
 * GET /ledger/transaction/:transactionId/count
 */
router.get(
    "/transaction/:transactionId/count",
    ledgerController.countTransactionLedgerEntries
);


/**
 * Get Account Ledger
 * GET /ledger/account/:accountId
 */
router.get(
    "/account/:accountId",
    ledgerController.getAccountLedger
);


/**
 * Get Latest Account Ledger Entry
 * GET /ledger/account/:accountId/latest
 */
router.get(
    "/account/:accountId/latest",
    ledgerController.getLatestAccountEntry
);


/**
 * Get Paginated Account Ledger
 * GET /ledger/account/:accountId/paginated
 *
 * Query:
 * ?page=1&limit=50
 */
router.get(
    "/account/:accountId/paginated",
    ledgerController.getAccountLedgerPaginated
);


/**
 * Get Account Ledger Count
 * GET /ledger/account/:accountId/count
 */
router.get(
    "/account/:accountId/count",
    ledgerController.countAccountLedgerEntries
);

/**
 * Reverse Ledger Entry
 * POST /ledger/:id/reverse
 */
router.post(
    "/:id/reverse",
    ledgerController.reverseLedgerEntry
);



/**
 * Get Ledger Entry By ID
 * GET /ledger/:id
 *
 * IMPORTANT:
 * Keep this AFTER all specific routes.
 */
router.get(
    "/:id",
    ledgerController.getLedgerEntryById
);




export default router;