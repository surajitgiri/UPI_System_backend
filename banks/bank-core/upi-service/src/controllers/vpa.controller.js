import vpaService from "../services/vpa.service.js";
import AppError from "../errors/AppError.js";
import { successResponse } from "../utils/response.js";
import {
    createVpaSChema,
    updateVpaSchema,
    setPinSchema,
    verifyPinSchema,
} from "../validators/vpa.validator.js";

class VpaController {

    // POST /vpas
    async createVpa(req, res, next) {
        try {
            const data = createVpaSChema.parse(req.body);
            const vpa = await vpaService.createVpa(data);

            return successResponse(res, "VPA created successfully", vpa, 201);
        } catch (error) {
            next(error);
        }
    }

    // GET /vpas
    async getAllVpas(req, res, next) {
        try {
            const vpas = await vpaService.getAllVpas();
            return successResponse(res, "VPAs fetched successfully", vpas);
        } catch (error) {
            next(error);
        }
    }

    // GET /vpas/:id
    async getVpaById(req, res, next) {
        try {
            const { id } = req.params;
            const vpa = await vpaService.getVpaById(id);
            return successResponse(res, "VPA fetched successfully", vpa);
        } catch (error) {
            next(error);
        }
    }

    // GET /vpas/address/:vpa  (e.g. /vpas/address/suraj@okicici)
    async getVpaByAddress(req, res, next) {
        try {
            const { vpa } = req.params;
            const record = await vpaService.getVpaByAddress(vpa);
            return successResponse(res, "VPA fetched successfully", record);
        } catch (error) {
            next(error);
        }
    }

    // GET /vpas/user/:userId
    async getVpasByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            const vpas = await vpaService.getVpasByUserId(userId);
            return successResponse(res, "VPAs fetched successfully", vpas);
        } catch (error) {
            next(error);
        }
    }

    // PATCH /vpas/:id
    async updateVpa(req, res, next) {
        try {
            const { id } = req.params;
            const data = updateVpaSchema.parse(req.body);
            const vpa = await vpaService.updateVpa(id, data);
            return successResponse(res, "VPA updated successfully", vpa);
        } catch (error) {
            next(error);
        }
    }

    // PATCH /vpas/:id/suspend
    async suspendVpa(req, res, next) {
        try {
            const { id } = req.params;
            const vpa = await vpaService.suspendVpa(id);
            return successResponse(res, "VPA suspended successfully", vpa);
        } catch (error) {
            next(error);
        }
    }

    // PATCH /vpas/:id/activate
    async activateVpa(req, res, next) {
        try {
            const { id } = req.params;
            const vpa = await vpaService.activateVpa(id);
            return successResponse(res, "VPA activated successfully", vpa);
        } catch (error) {
            next(error);
        }
    }

    // DELETE /vpas/:id
    async deleteVpa(req, res, next) {
        try {
            const { id } = req.params;
            const vpa = await vpaService.deleteVpa(id);
            return successResponse(res, "VPA deleted successfully", vpa);
        } catch (error) {
            next(error);
        }
    }

    // POST /vpas/:id/set-pin
    async setPin(req, res, next) {
        try {
            const { id } = req.params;
            const { pin } = setPinSchema.parse(req.body);
            const result = await vpaService.setPin(id, pin);
            return successResponse(res, result.message, null);
        } catch (error) {
            next(error);
        }
    }

    // POST /vpas/:id/verify-pin
    async verifyPin(req, res, next) {
        try {
            const { id } = req.params;
            const { pin } = verifyPinSchema.parse(req.body);
            const ipAddress = req.ip || req.headers["x-forwarded-for"];
            const userAgent = req.headers["user-agent"];

            const result = await vpaService.verifyPin(id, pin, ipAddress, userAgent);
            return successResponse(res, "PIN verified successfully", result);
        } catch (error) {
            next(error);
        }
    }
}

export default new VpaController();
