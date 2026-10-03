import { Router } from "express";

import accountRoutes from "./account.route.js";
import customerRoutes from "./customer.route.js";
import ledgerRoutes from "./ledger.route.js";
import transactionRoutes from "./transaction.route.js";

const router = Router();

// Account Routes
router.use("/accounts", accountRoutes);

// Customer Routes
router.use("/customers", customerRoutes);

// Ledger Routes
router.use("/ledger", ledgerRoutes);

// Transaction Routes
router.use("/transactions", transactionRoutes);

export default router;