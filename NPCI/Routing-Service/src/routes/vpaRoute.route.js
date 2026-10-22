import { Router } from "express";
import {
    registerRoute,
    lookupVpa,
    getAllRoutes,
    getRoutesByBankCode,
    getRoutesByStatus,
    getRoute,
    updateRouteStatus,
    deleteRoute,
} from "../controllers/vpaRoute.controller.js";

const router = Router();

router.post("/", registerRoute);
router.get("/", getAllRoutes);

// Specific param routes before generic /:vpa
router.get("/lookup/:vpa", lookupVpa);
router.get("/bank/:bankCode", getRoutesByBankCode);
router.get("/status/:status", getRoutesByStatus);

router.get("/:vpa", getRoute);
router.patch("/:vpa/status", updateRouteStatus);
router.delete("/:vpa", deleteRoute);

export default router;
