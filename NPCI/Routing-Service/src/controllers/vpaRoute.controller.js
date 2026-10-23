import AppError from "../errors/AppError.js";
import { successResponse } from "../utils/response.js";
import vpaRouteService from "../services/vpaRoute.service.js";

// POST /api/v1/routes
export const registerRoute = async (req, res, next) => {
    try {
        const { vpa, vpaId, accountId, bankCode } = req.body;

        if (!vpa || !vpaId || !accountId) {
            throw new AppError("vpa, vpaId and accountId are required", 400);
        }

        const route = await vpaRouteService.registerRoute({ vpa, vpaId, accountId, bankCode });
        return successResponse(res, "VPA route registered successfully", route, 201);
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/routes/lookup/:vpa
export const lookupVpa = async (req, res, next) => {
    try {
        const result = await vpaRouteService.lookupVpa(req.params.vpa, "http");
        const statusCode = result.success ? 200 : 404;
        return successResponse(res, result.message, result.data, statusCode);
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/routes
export const getAllRoutes = async (req, res, next) => {
    try {
        const routes = await vpaRouteService.getAllRoutes();
        return successResponse(res, "Routes fetched successfully", routes);
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/routes/bank/:bankCode
export const getRoutesByBankCode = async (req, res, next) => {
    try {
        const routes = await vpaRouteService.getRoutesByBankCode(req.params.bankCode);
        return successResponse(res, "Routes fetched successfully", routes);
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/routes/status/:status
export const getRoutesByStatus = async (req, res, next) => {
    try {
        const routes = await vpaRouteService.getRoutesByStatus(req.params.status.toUpperCase());
        return successResponse(res, "Routes fetched successfully", routes);
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/routes/:vpa
export const getRoute = async (req, res, next) => {
    try {
        const route = await vpaRouteService.getRoute(req.params.vpa);
        return successResponse(res, "Route fetched successfully", route);
    } catch (error) {
        next(error);
    }
};

// PATCH /api/v1/routes/:vpa/status
export const updateRouteStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!["ACTIVE", "INACTIVE", "BLOCKED"].includes(status)) {
            throw new AppError("status must be ACTIVE, INACTIVE or BLOCKED", 400);
        }
        const route = await vpaRouteService.updateStatus(req.params.vpa, status);
        return successResponse(res, "Route status updated successfully", route);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/v1/routes/:vpa
export const deleteRoute = async (req, res, next) => {
    try {
        await vpaRouteService.deleteRoute(req.params.vpa);
        return successResponse(res, "Route deleted successfully");
    } catch (error) {
        next(error);
    }
};
