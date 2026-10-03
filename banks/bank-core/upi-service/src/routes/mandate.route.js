import { Router } from "express";
import mandateController from "../controllers/mandate.controller.js";

const router = Router();

// ── Collection ──────────────────────────────────────
router.get("/", mandateController.getMandatesByVpa);
router.post("/", mandateController.createMandate);

// ── Lookup (before /:id to avoid param conflict) ────
router.get("/vpa/:vpaAddress", mandateController.getMandatesByVpa);

// ── Single resource ──────────────────────────────────
router.get("/:id", mandateController.getMandateById);

// ── Status actions ───────────────────────────────────
router.patch("/:id/activate", mandateController.activateMandate);
router.patch("/:id/pause", mandateController.pauseMandate);
router.patch("/:id/revoke", mandateController.revokeMandate);

export default router;
