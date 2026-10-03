import { Router } from "express";

import kycController from "../controllers/kyc.controller.js";
// import authMiddleware from "../middleware/auth.middleware.js";
// import validate from "../middleware/validate.middleware.js";
// import {
//   createKycSchema,
//   updateKycSchema,
// } from "../validators/kyc.validator.js";

const router = Router();

// Health Check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "KYC Routes Working",
  });
});

// Create KYC
router.post(
  "/:customerId",
  // authMiddleware,
  // validate(createKycSchema),
  kycController.createKyc
);

// Get KYC
router.get(
  "/:customerId",
  // authMiddleware,
  kycController.getKyc
);

// Update KYC
router.patch(
  "/:customerId",
  // authMiddleware,
  // validate(updateKycSchema),
  kycController.updateKyc
);

// Verify KYC
router.patch(
  "/:customerId/verify",
  // authMiddleware,
  kycController.verifyKyc
);

// Reject KYC
router.patch(
  "/:customerId/reject",
  // authMiddleware,
  kycController.rejectKyc
);

// Delete KYC
router.delete(
  "/:customerId",
  // authMiddleware,
  kycController.deleteKyc
);

export default router;