import { Router } from "express";
import {
    initiatePayment,
    getAllTransactions,
    getTransaction,
    getByRrn,
    getByStatus,
} from "../controllers/switch.controller.js";

const router = Router();


router.post("/pay", initiatePayment);
router.get("/transactions", getAllTransactions);
router.get("/transactions/rrn/:rrn", getByRrn);        // before /:id
router.get("/transactions/status/:status", getByStatus); // before /:id
router.get("/transactions/:id", getTransaction);
export default router;
