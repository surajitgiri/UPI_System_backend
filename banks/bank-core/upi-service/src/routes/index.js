import { Router } from "express";
import vpaRouter from "./vpa.route.js";
import upiTransactionRouter from "./upiTransaction.route.js";
import collectRequestRouter from "./collectRequest.route.js";
import mandateRouter from "./mandate.route.js";

const router = Router();

router.use("/vpas", vpaRouter);
router.use("/transactions", upiTransactionRouter);
router.use("/collect", collectRequestRouter);
router.use("/mandates", mandateRouter);

export default router;
