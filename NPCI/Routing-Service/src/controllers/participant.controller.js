import AppError from "../errors/AppError.js";
import { successResponse } from "../utils/response.js";
import participantService from "../services/participant.service.js";

// POST /api/v1/participants
export const createParticipant = async (req, res, next) => {
    try {
        const { bankCode, name, type, ifscPrefix, grpcAddress, callbackUrl } = req.body;

        if (!bankCode || !name) {
            throw new AppError("bankCode and name are required", 400);
        }

        const participant = await participantService.createParticipant({
            bankCode, name, type, ifscPrefix, grpcAddress, callbackUrl,
        });

        return successResponse(res, "Participant created successfully", participant, 201);
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/participants
export const getAllParticipants = async (req, res, next) => {
    try {
        const participants = await participantService.getAllParticipants();
        return successResponse(res, "Participants fetched successfully", participants);
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/participants/:id
export const getParticipantById = async (req, res, next) => {
    try {
        const participant = await participantService.getParticipantById(req.params.id);
        return successResponse(res, "Participant fetched successfully", participant);
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/participants/bank/:bankCode
export const getParticipantByBankCode = async (req, res, next) => {
    try {
        const participant = await participantService.getParticipantByBankCode(req.params.bankCode);
        return successResponse(res, "Participant fetched successfully", participant);
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/participants/status/:status
export const getParticipantsByStatus = async (req, res, next) => {
    try {
        const participants = await participantService.getParticipantsByStatus(req.params.status.toUpperCase());
        return successResponse(res, "Participants fetched successfully", participants);
    } catch (error) {
        next(error);
    }
};

// PUT /api/v1/participants/:id
export const updateParticipant = async (req, res, next) => {
    try {
        const { name, type, ifscPrefix, grpcAddress, callbackUrl } = req.body;
        const participant = await participantService.updateParticipant(req.params.id, {
            name, type, ifscPrefix, grpcAddress, callbackUrl,
        });
        return successResponse(res, "Participant updated successfully", participant);
    } catch (error) {
        next(error);
    }
};

// PATCH /api/v1/participants/:id/status
export const updateParticipantStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!["ACTIVE", "INACTIVE", "SUSPENDED"].includes(status)) {
            throw new AppError("status must be ACTIVE, INACTIVE or SUSPENDED", 400);
        }
        const participant = await participantService.updateStatus(req.params.id, status);
        return successResponse(res, "Participant status updated successfully", participant);
    } catch (error) {
        next(error);
    }
};
