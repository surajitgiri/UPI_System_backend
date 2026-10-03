import { Router } from "express";
import collectRequestController from "../controllers/collectRequest.controller.js";

const router = Router();

// ── Collection ──────────────────────────────────────
router.post("/", collectRequestController.createCollectRequest);

// ── Lookup (before /:id to avoid param conflict) ────
router.get("/inbox/:vpaAddress", collectRequestController.getInbox);
router.get("/sent/:vpaAddress", collectRequestController.getSentRequests);

// ── Single resource ──────────────────────────────────
router.get("/:id", collectRequestController.getCollectRequestById);

// ── Actions ──────────────────────────────────────────
router.post("/:id/approve", collectRequestController.approveCollectRequest);
router.post("/:id/reject", collectRequestController.rejectCollectRequest);

export default router;
