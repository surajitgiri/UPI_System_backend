import branchService from "../services/branch.service.js";
import AppError from "../errors/AppError.js";

import { successResponse } from "../utils/response.js";
import { createBranchSchema, updateBranchSchema } from "../validators/branch.validator.js";

class BranchController {
    //POST /branches
    async createBranch(req, res, next) {
        try {
            const data = createBranchSchema.parse(req.body);
            const branch = await branchService.createBranch(data);

            return successResponse(
                res,
                "Branch created successfully",
                branch,
                201
            );
        } catch (error) {
            next(error);
        }
    }

    //GET /branches
    async getAllBranches(req, res, next) {
        try {
            const branches = await branchService.getAllBranches();

            return successResponse(
                res,
                "Branches fetched successfully",
                branches,
                201
            );
        } catch (error) {
            next(error);
        }
    }

    /**
 * GET /branches/:id
 */
    async getBranchById(req, res, next) {
        try {
            const { id } = req.params;

            const branch = await branchService.getBranchById(id);

            if (!branch) {
                throw new AppError("Branch not found", 404);
            }

            return successResponse(
                res,
                "Branch fetched successfully",
                branch
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /branches/:id
     */
    async updateBranch(req, res, next) {
        try {
            const { id } = req.params;

            const branch = await branchService.getBranchById(id);

            if (!branch) {
                throw new AppError("Branch not found", 404);
            }

            const data = updateBranchSchema.parse(req.body);
            const updatedBranch = await branchService.updateBranch(
                id,
                data
            );

            return successResponse(
                res,
                "Branch updated successfully",
                updatedBranch
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /branches/:id
     */
    async deleteBranch(req, res, next) {
        try {
            const { id } = req.params;

            const branch = await branchService.getBranchById(id);

            if (!branch) {
                throw new AppError("Branch not found", 404);
            }

            await branchService.deleteBranch(id);

            return successResponse(
                res,
                "Branch deleted successfully"
            );
        } catch (error) {
            next(error);
        }
    }
}

export default new BranchController();