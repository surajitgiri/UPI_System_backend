import collectRequestService from "../services/collectRequest.service.js";
import { successResponse } from "../utils/response.js";
import {
    createCollectSchema,
    approveCollectSchema,
} from "../validators/collectRequest.validator.js";

class CollectRequestController {

    // POST /collect
    async createCollectRequest(req, res, next) {
        try {
            const data = createCollectSchema.parse(req.body);
            const request = await collectRequestService.createCollectRequest(data);
            return successResponse(res, "Collect request created successfully", request, 201);
        } catch (error) {
            next(error);
        }
    }

    // GET /collect/:id
    async getCollectRequestById(req, res, next) {
        try {
            const { id } = req.params;
            const request = await collectRequestService.getCollectRequestById(id);
            return successResponse(res, "Collect request fetched successfully", request);
        } catch (error) {
            next(error);
        }
    }

    // GET /collect/inbox/:vpaAddress  — pending requests for a VPA
    async getInbox(req, res, next) {
        try {
            const { vpaAddress } = req.params;
            const requests = await collectRequestService.getInboxByVpaAddress(vpaAddress);
            return successResponse(res, "Inbox fetched successfully", requests);
        } catch (error) {
            next(error);
        }
    }

    // GET /collect/sent/:vpaAddress  — requests initiated by a VPA
    async getSentRequests(req, res, next) {
        try {
            const { vpaAddress } = req.params;
            const requests = await collectRequestService.getSentRequests(vpaAddress);
            return successResponse(res, "Sent requests fetched successfully", requests);
        } catch (error) {
            next(error);
        }
    }

    // POST /collect/:id/approve
    async approveCollectRequest(req, res, next) {
        try {
            const { id } = req.params;
            const { upiPin } = approveCollectSchema.parse(req.body);
            const ipAddress = req.ip || req.headers["x-forwarded-for"];
            const userAgent = req.headers["user-agent"];

            const transaction = await collectRequestService.approveCollectRequest(
                id, upiPin, ipAddress, userAgent
            );
            return successResponse(res, "Collect request approved and payment processed", transaction);
        } catch (error) {
            next(error);
        }
    }

    // POST /collect/:id/reject
    async rejectCollectRequest(req, res, next) {
        try {
            const { id } = req.params;
            // targetVpaId should come from auth middleware in production
            const { targetVpaId } = req.body;
            const result = await collectRequestService.rejectCollectRequest(id, targetVpaId);
            return successResponse(res, "Collect request rejected", result);
        } catch (error) {
            next(error);
        }
    }
}

export default new CollectRequestController();
