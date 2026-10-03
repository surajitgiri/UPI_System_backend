import { Router } from "express";
import upiTransactionController from "../controllers/upiTransaction.controller.js";

const router = Router();

// ── Collection ──────────────────────────────────────
router.get("/", upiTransactionController.getAllTransactions);

// ── Actions (before /:id to avoid param conflict) ───
router.post("/pay", upiTransactionController.initiatePay);
router.post("/refund", upiTransactionController.initiateRefund);

// ── Lookup by RRN & VPA ──────────────────────────────
router.get("/rrn/:rrn", upiTransactionController.getTransactionByRrn);
router.get("/vpa/:vpaId", upiTransactionController.getTransactionsByVpaId);

// ── Single resource ──────────────────────────────────
router.get("/:id", upiTransactionController.getTransactionById);

export default router;
