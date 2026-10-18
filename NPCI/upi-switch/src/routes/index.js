import { Router } from "express";
import switchRoutes from "./switch.route.js";
import reversalRoutes from "./reversal.route.js";

const router = Router();

router.use("/switch", switchRoutes);
router.use("/reversals", reversalRoutes);

export default router;