import { Router } from "express";
import vpaController from "../controllers/vpa.controller.js";

const router = Router();

// ── Collection ──────────────────────────────────────
router.get("/", vpaController.getAllVpas);
router.post("/", vpaController.createVpa);

// ── Lookup (before /:id to avoid param conflict) ────
router.get("/user/:userId", vpaController.getVpasByUserId);
router.get("/address/:vpa", vpaController.getVpaByAddress);

// ── Single resource ──────────────────────────────────
router.get("/:id", vpaController.getVpaById);
router.patch("/:id", vpaController.updateVpa);
router.delete("/:id", vpaController.deleteVpa);

// ── Status actions ───────────────────────────────────
router.patch("/:id/suspend", vpaController.suspendVpa);
router.patch("/:id/activate", vpaController.activateVpa);

// ── PIN management ───────────────────────────────────
router.post("/:id/set-pin", vpaController.setPin);
router.post("/:id/verify-pin", vpaController.verifyPin);

export default router;
