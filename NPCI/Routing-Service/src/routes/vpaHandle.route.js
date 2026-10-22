import { Router } from "express";
import {
    createHandle,
    getAllHandles,
    getHandlesByBankCode,
    getHandle,
    setHandleActive,
} from "../controllers/vpaHandle.controller.js";

const router = Router();

router.post("/", createHandle);
router.get("/", getAllHandles);

// Specific param routes before /:handle
router.get("/bank/:bankCode", getHandlesByBankCode);

router.get("/:handle", getHandle);
router.patch("/:id/active", setHandleActive);

export default router;
