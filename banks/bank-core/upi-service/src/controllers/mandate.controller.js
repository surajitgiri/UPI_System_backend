import mandateService from "../services/mandate.service.js";
import { successResponse } from "../utils/response.js";

class MandateController {

    // POST /mandates
    async createMandate(req, res, next) {
        try {
            const mandate = await mandateService.createMandate(req.body);
            return successResponse(res, "Mandate created successfully", mandate, 201);
        } catch (error) {
            next(error);
        }
    }

    // GET /mandates/:id
    async getMandateById(req, res, next) {
        try {
            const { id } = req.params;
            const mandate = await mandateService.getMandateById(id);
            return successResponse(res, "Mandate fetched successfully", mandate);
        } catch (error) {
            next(error);
        }
    }

    // GET /mandates/vpa/:vpaAddress
    async getMandatesByVpa(req, res, next) {
        try {
            const { vpaAddress } = req.params;
            const mandates = await mandateService.getMandatesByVpaAddress(vpaAddress);
            return successResponse(res, "Mandates fetched successfully", mandates);
        } catch (error) {
            next(error);
        }
    }

    // PATCH /mandates/:id/activate
    async activateMandate(req, res, next) {
        try {
            const { id } = req.params;
            const mandate = await mandateService.activateMandate(id);
            return successResponse(res, "Mandate activated successfully", mandate);
        } catch (error) {
            next(error);
        }
    }

    // PATCH /mandates/:id/pause
    async pauseMandate(req, res, next) {
        try {
            const { id } = req.params;
            const mandate = await mandateService.pauseMandate(id);
            return successResponse(res, "Mandate paused successfully", mandate);
        } catch (error) {
            next(error);
        }
    }

    // PATCH /mandates/:id/revoke
    async revokeMandate(req, res, next) {
        try {
            const { id } = req.params;
            const mandate = await mandateService.revokeMandate(id);
            return successResponse(res, "Mandate revoked successfully", mandate);
        } catch (error) {
            next(error);
        }
    }
}

export default new MandateController();
