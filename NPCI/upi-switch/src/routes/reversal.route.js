import { Router } from "express";
import {
    initiateReversal,
    getAllReversals,
    getReversalById,
    getReversalByTxnId,
    getReversalsByStatus,
} from "../controllers/reversal.controller.js";

const router = Router();

router.post("/", initiateReversal);
router.get("/", getAllReversals);
router.get("/txn/:txnId", getReversalByTxnId);        // before /:id
router.get("/status/:status", getReversalsByStatus);  // before /:id
router.get("/:id", getReversalById);

export default router;
