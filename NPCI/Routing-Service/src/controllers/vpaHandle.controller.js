import AppError from "../errors/AppError.js";
import { successResponse } from "../utils/response.js";
import vpaHandleService from "../services/vpaHandle.service.js";

// POST /api/v1/handles
export const createHandle = async (req, res, next) => {
    try {
        const { handle, bankCode } = req.body;

        if (!handle || !bankCode) {
            throw new AppError("handle and bankCode are required", 400);
        }

        const row = await vpaHandleService.createHandle({ handle, bankCode });
        return successResponse(res, "Handle created successfully", row, 201);
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/handles
export const getAllHandles = async (req, res, next) => {
    try {
        const handles = await vpaHandleService.getAllHandles();
        return successResponse(res, "Handles fetched successfully", handles);
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/handles/bank/:bankCode
export const getHandlesByBankCode = async (req, res, next) => {
    try {
        const handles = await vpaHandleService.getHandlesByBankCode(req.params.bankCode);
        return successResponse(res, "Handles fetched successfully", handles);
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/handles/:handle
export const getHandle = async (req, res, next) => {
    try {
        const row = await vpaHandleService.getHandle(req.params.handle);
        return successResponse(res, "Handle fetched successfully", row);
    } catch (error) {
        next(error);
    }
};

// PATCH /api/v1/handles/:id/active
export const setHandleActive = async (req, res, next) => {
    try {
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") {
            throw new AppError("isActive must be a boolean", 400);
        }
        const row = await vpaHandleService.setActive(req.params.id, isActive);
        return successResponse(res, "Handle updated successfully", row);
    } catch (error) {
        next(error);
    }
};
