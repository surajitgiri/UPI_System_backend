import collectRequestRepository from "../repositories/collectRequest.repository.js";
import vpaRepository from "../repositories/vpa.repository.js";
import upiTransactionService from "./upiTransaction.service.js";
import vpaService from "./vpa.service.js";
import AppError from "../errors/AppError.js";

class CollectRequestService {

    // ─────────────────────────────────────────────
    // CREATE COLLECT REQUEST
    // ─────────────────────────────────────────────
    async createCollectRequest(data) {
        const { initiatorVpa, targetVpa, amount, currency, description, remarks, expiresInHours } = data;

        // Resolve VPAs
        const initiator = await vpaRepository.findByVpa(initiatorVpa);
        if (!initiator) {
            throw new AppError(`Initiator VPA '${initiatorVpa}' not found`, 404);
        }

        const target = await vpaRepository.findByVpa(targetVpa);
        if (!target) {
            throw new AppError(`Target VPA '${targetVpa}' not found`, 404);
        }

        if (initiator.status !== "ACTIVE") {
            throw new AppError(`Initiator VPA is ${initiator.status}`, 400);
        }

        if (target.status !== "ACTIVE") {
            throw new AppError(`Target VPA is ${target.status}`, 400);
        }

        const hours = expiresInHours ?? 24;
        const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

        return await collectRequestRepository.create({
            initiatorVpaId: initiator.id,
            targetVpaId: target.id,
            amount,
            currency: currency || "INR",
            description,
            remarks,
            expiresAt,
        });
    }

    // ─────────────────────────────────────────────
    // GET BY ID
    // ─────────────────────────────────────────────
    async getCollectRequestById(id) {
        const request = await collectRequestRepository.findById(id);
        if (!request) {
            throw new AppError("Collect request not found", 404);
        }
        return request;
    }

    // ─────────────────────────────────────────────
    // GET INBOX (pending requests for a target VPA)
    // ─────────────────────────────────────────────
    async getInboxByVpaAddress(vpaAddress) {
        const vpa = await vpaRepository.findByVpa(vpaAddress);
        if (!vpa) {
            throw new AppError(`VPA '${vpaAddress}' not found`, 404);
        }

        // Expire stale requests first
        await collectRequestRepository.expireOldRequests();

        return await collectRequestRepository.findPendingByTargetVpaId(vpa.id);
    }

    // ─────────────────────────────────────────────
    // APPROVE COLLECT REQUEST (target pays)
    // Validates PIN then triggers the payment
    // ─────────────────────────────────────────────
    async approveCollectRequest(id, upiPin, ipAddress, userAgent) {
        const request = await collectRequestRepository.findById(id);
        if (!request) {
            throw new AppError("Collect request not found", 404);
        }

        if (request.status !== "PENDING") {
            throw new AppError(`Collect request is already ${request.status}`, 400);
        }

        if (new Date() > request.expiresAt) {
            await collectRequestRepository.updateStatus(id, "EXPIRED");
            throw new AppError("Collect request has expired", 400);
        }

        // Verify target VPA PIN (the one paying)
        await vpaService.verifyPin(request.targetVpaId, upiPin, ipAddress, userAgent);

        // Get VPA addresses for the transaction
        const targetVpa = await vpaRepository.findById(request.targetVpaId);
        const initiatorVpa = await vpaRepository.findById(request.initiatorVpaId);

        // Initiate the pay — target sends to initiator
        const transaction = await upiTransactionService.initiatePay(
            {
                senderVpa: targetVpa.vpa,
                receiverVpa: initiatorVpa.vpa,
                amount: Number(request.amount),
                currency: request.currency,
                description: request.description || "Collect payment",
                remarks: request.remarks,
                upiPin,                          // already verified above — pass through
            },
            ipAddress,
            userAgent
        );

        // Link collect request to transaction
        await collectRequestRepository.markApproved(id, transaction.id);

        return transaction;
    }

    // ─────────────────────────────────────────────
    // REJECT COLLECT REQUEST
    // ─────────────────────────────────────────────
    async rejectCollectRequest(id, rejectorVpaId) {
        const request = await collectRequestRepository.findById(id);
        if (!request) {
            throw new AppError("Collect request not found", 404);
        }

        if (request.status !== "PENDING") {
            throw new AppError(`Collect request is already ${request.status}`, 400);
        }

        // Only the target can reject
        if (request.targetVpaId !== rejectorVpaId) {
            throw new AppError("Only the target VPA can reject this request", 403);
        }

        return await collectRequestRepository.markRejected(id);
    }

    // ─────────────────────────────────────────────
    // GET SENT REQUESTS (by initiator)
    // ─────────────────────────────────────────────
    async getSentRequests(vpaAddress) {
        const vpa = await vpaRepository.findByVpa(vpaAddress);
        if (!vpa) {
            throw new AppError(`VPA '${vpaAddress}' not found`, 404);
        }
        return await collectRequestRepository.findByInitiatorVpaId(vpa.id);
    }
}

export default new CollectRequestService();
