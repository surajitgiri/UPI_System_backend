import AppError from "../errors/AppError.js";
import { successResponse } from "../utils/response.js";
import reversalService from "../services/reversal.service.js";


// POST /api/reversals
export const initiateReversal = async (req, res, next) => {
    try {
        const { txnId, reason, raisedBy, remarks } = req.body;
        if (!txnId || !reason) {
            throw new AppError("txnId and reason are required", 400);
        }

        const reversal = await reversalService.initiateReversal({
            txnId, reason, raisedBy, remarks,
        });

        return successResponse(res, "Reversal processed successfully", reversal, 201);

    } catch (error) {
        next(error);
    }
}


// GET /api/reversals
export const getAllReversals = async (req, res, next) => {
    try {
        const reversals = await reversalService.getAllReversals();
        return successResponse(res, "Reversals fetched successfully", reversals)
    } catch (error) {
        next(error);
    }
};


// GET /api/reversals/:id
export const getReversalById = async (req, res, next) => {
    try {
        const reversal = await reversalService.getReversalById(req.params.id);
        return successResponse(res, "Reversal fetched successfully", reversal);
    } catch (err) {
        next(err);
    }
};


// GET /api/reversals/txn/:txnId
export const getReversalByTxnId = async (req, res, next) => {
    try {
        const reversal = await reversalService.getReversalByTxnId(req.params.txnId);
        return successResponse(res, "Reversal fetched successfully", reversal);
    } catch (err) {
        next(err);
    }
};

// GET /api/reversals/status/:status
export const getReversalsByStatus = async (req, res, next) => {
    try {
        const reversals = await reversalService.getReversalsByStatus(req.params.status.toUpperCase());
        return successResponse(res, "Reversals fetched successfully", reversals);
    } catch (err) {
        next(err);
    }
};
