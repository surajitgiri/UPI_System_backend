import { Router } from "express";
import participantRoutes from "./participant.route.js";
import vpaHandleRoutes from "./vpaHandle.route.js";
import vpaRouteRoutes from "./vpaRoute.route.js";

const router = Router();

router.use("/participants", participantRoutes);
router.use("/handles", vpaHandleRoutes);
router.use("/routes", vpaRouteRoutes);

export default router;
