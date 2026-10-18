import AppError from "../errors/AppError.js";
import { successResponse } from "../utils/response.js";
import switchService from "../services/switch.service.js";

// POST /api/switch/pay
export const initiatePayment = async (req, res, next) => {
    try {
        const { txnRef, type, senderVpa, receiverVpa, amount, currency, description, remarks, senderPsp, receiverPsp } = req.body;

        if (!senderVpa || !receiverVpa || amount === undefined) {
            throw new AppError("senderVpa, receiverVpa and amount are required", 400)
        }

        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            throw new AppError("amount must be a positive number", 400);
        }

        if (senderVpa === receiverVpa) {
            throw new AppError("Sender and receiver VPA cannot be the same", 400);
        }

        const txn = await switchService.initiatePayment({
            txnRef, type, senderVpa, receiverVpa, amount,
            currency, description, remarks, senderPsp, receiverPsp
        });

        return successResponse(res, "payment processed successfully", txn, 201);
    } catch (error) {
        next(error);
    }
};

// GET /api/switch/transactions
export const getAllTransactions = async (req, res, next) => {
    try {
        const txns = await switchService.getAllTransactions();
        return successResponse(res, "Transactions fetched successfully", txns);
    } catch (error) {
        next(error);
    }
};


// GET /api/switch/transactions/:id
export const getTransaction = async (req, res, next) => {
    try {
        const txn = await switchService.getTransaction(req.params.id);
        return successResponse(res, "Transaction fetched successfully", txn);
    } catch (error) {
        next(error);
    }
};

// GET /api/switch/transactions/rrn/:rrn
export const getByRrn = async (req, res, next) => {
    try {
        const txn = await switchService.getByRrn(req.params.rrn);
        return successResponse(res, "Transaction fetched successfully", txn);
    } catch (err) {
        next(err);
    }
};

// GET /api/switch/transactions/status/:status
export const getByStatus = async (req, res, next) => {
    try {
        const txns = await switchService.getByStatus(req.params.status.toUpperCase());
        return successResponse(res, "Transactions fetched successfully", txns);
    } catch (err) {
        next(err);
    }
};