// src/routes/branch.route.js

import { Router } from "express";

import branchController from "../controllers/branch.controller.js";

const router = Router();

/**
 * Create Branch
 * POST /branches
 */
router.post("/", branchController.createBranch);

/**
 * Get All Branches
 * GET /branches
 */
router.get("/", branchController.getAllBranches);

/**
 * Get Branch By ID
 * GET /branches/:id
 */
router.get("/:id", branchController.getBranchById);

/**
 * Update Branch
 * PATCH /branches/:id
 */
router.patch("/:id", branchController.updateBranch);

/**
 * Delete Branch
 * DELETE /branches/:id
 */
router.delete("/:id", branchController.deleteBranch);

export default router;