import { Router } from "express";

import customerController from "../controllers/customer.controller.js";
// import authMiddleware from "../middleware/auth.middleware.js";
// import validate from "../middleware/validate.middleware.js";
// import {
//   createCustomerSchema,
//   updateCustomerSchema,
// } from "../validators/customer.validator.js";

const router = Router();

// Health Check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Customer Routes Working",
  });
});

// Create Customer
router.post(
  "/",
  // authMiddleware,
  // validate(createCustomerSchema),
  customerController.createCustomer
);

// Get All Customers
router.get(
  "/",
  // authMiddleware,
  customerController.getAllCustomers
);

// Get Customer By ID
router.get(
  "/:id",
  // authMiddleware,
  customerController.getCustomerById
);

// Get Customer By Customer Number
router.get(
  "/number/:customerNumber",
  // authMiddleware,
  customerController.getCustomerByCustomerNumber
);

// Update Customer
router.patch(
  "/:id",
  // authMiddleware,
  // validate(updateCustomerSchema),
  customerController.updateCustomer
);

// Delete Customer
router.delete(
  "/:id",
  // authMiddleware,
  customerController.deleteCustomer
);

export default router;