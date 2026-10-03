import upiTransactionService from "../services/upiTransaction.service.js";
import { successResponse } from "../utils/response.js";
import {
    initiatePaySchema,
    initiateRefundSchema,
} from "../validators/upiTransaction.validator.js";

class UpiTransactionController {

    // POST /transactions/pay
    async initiatePay(req, res, next) {
        try {
            const data = initiatePaySchema.parse(req.body);
            const ipAddress = req.ip || req.headers["x-forwarded-for"];
            const userAgent = req.headers["user-agent"];

            const transaction = await upiTransactionService.initiatePay(data, ipAddress, userAgent);
            return successResponse(res, "Payment initiated successfully", transaction, 201);
        } catch (error) {
            next(error);
        }
    }

    // POST /transactions/refund
    async initiateRefund(req, res, next) {
        try {
            const data = initiateRefundSchema.parse(req.body);
            const refund = await upiTransactionService.initiateRefund(data);
            return successResponse(res, "Refund initiated successfully", refund, 201);
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions
    async getAllTransactions(req, res, next) {
        try {
            const transactions = await upiTransactionService.getAllTransactions();
            return successResponse(res, "Transactions fetched successfully", transactions);
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/:id
    async getTransactionById(req, res, next) {
        try {
            const { id } = req.params;
            const transaction = await upiTransactionService.getTransactionById(id);
            return successResponse(res, "Transaction fetched successfully", transaction);
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/rrn/:rrn
    async getTransactionByRrn(req, res, next) {
        try {
            const { rrn } = req.params;
            const transaction = await upiTransactionService.getTransactionByRrn(rrn);
            return successResponse(res, "Transaction fetched successfully", transaction);
        } catch (error) {
            next(error);
        }
    }

    // GET /transactions/vpa/:vpaId
    async getTransactionsByVpaId(req, res, next) {
        try {
            const { vpaId } = req.params;
            const transactions = await upiTransactionService.getTransactionsByVpaId(vpaId);
            return successResponse(res, "Transactions fetched successfully", transactions);
        } catch (error) {
            next(error);
        }
    }
}

export default new UpiTransactionController();
