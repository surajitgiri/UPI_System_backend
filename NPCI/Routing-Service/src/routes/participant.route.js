import { Router } from "express";
import {
    createParticipant,
    getAllParticipants,
    getParticipantById,
    getParticipantByBankCode,
    getParticipantsByStatus,
    updateParticipant,
    updateParticipantStatus,
} from "../controllers/participant.controller.js";

const router = Router();

router.post("/", createParticipant);
router.get("/", getAllParticipants);

// Specific param routes before /:id
router.get("/bank/:bankCode", getParticipantByBankCode);
router.get("/status/:status", getParticipantsByStatus);

router.get("/:id", getParticipantById);
router.put("/:id", updateParticipant);
router.patch("/:id/status", updateParticipantStatus);

export default router;
