// upi-switch/src/services/reversal.service.js
// Manages manual and system-initiated reversals of settled transactions

import { randomUUID }                  from "crypto";
import AppError                        from "../errors/AppError.js";
import switchTransactionRepository     from "../repositories/switchTransaction.repository.js";
import reversalRequestRepository       from "../repositories/reversalRequest.repositories.js";
import switchLogRepository             from "../repositories/switchLog.repository.js";
import { creditAccount, debitAccount } from "../grpc/clients/account.client.js";

// ─────────────────────────────────────────────
// ReversalService
// ─────────────────────────────────────────────

class ReversalService {

    // ── Initiate a reversal ────────────────────────────────────────────
    async initiateReversal({ txnId, reason, raisedBy = "system", remarks }) {

        // ── 1. Fetch original switch transaction ────────────────────────
        const txn = await switchTransactionRepository.findById(txnId);
        if (!txn) {
            throw new AppError(`Transaction '${txnId}' not found`, 404);
        }

        // ── 2. Only SUCCESS transactions can be reversed ────────────────
        if (txn.status !== "SUCCESS") {
            throw new AppError(
                `Cannot reverse transaction with status '${txn.status}'. Only SUCCESS transactions can be reversed.`,
                400
            );
        }

        // ── 3. Idempotency — no duplicate reversal ──────────────────────
        const alreadyExists = await reversalRequestRepository.exists(txnId);
        if (alreadyExists) {
            throw new AppError(
                `A reversal request for transaction '${txnId}' already exists`,
                409
            );
        }

        // ── 4. Generate reversal RRN ────────────────────────────────────
        const reversalRrn = `REV${Date.now().toString().slice(-9)}`;

        // ── 5. Create reversal request ──────────────────────────────────
        const reversal = await reversalRequestRepository.create({
            txnId,
            reversalRrn,
            reason,
            raisedBy,
            remarks: remarks || null,
            status:  "INITIATED",
        });

        await switchLogRepository.info(txnId, "REVERSAL_INITIATED",
            `Reversal initiated by '${raisedBy}', reason: ${reason}`,
            { reversalId: reversal.id, reversalRrn }
        );

        // ── 6. Mark original txn as REVERSAL_PENDING ───────────────────
        await switchTransactionRepository.updateStatus(txnId, "REVERSAL_PENDING");

        // ── 7. Process the reversal ─────────────────────────────────────
        return await this._processReversal(reversal, txn);
    }

    // ── Get all reversal requests ──────────────────────────────────────
    async getAllReversals() {
        return reversalRequestRepository.findAll();
    }

    // ── Get reversal by ID ─────────────────────────────────────────────
    async getReversalById(id) {
        const reversal = await reversalRequestRepository.findById(id);
        if (!reversal) throw new AppError("Reversal request not found", 404);
        return reversal;
    }

    // ── Get reversal by txnId ──────────────────────────────────────────
    async getReversalByTxnId(txnId) {
        const reversal = await reversalRequestRepository.findByTxnId(txnId);
        if (!reversal) throw new AppError(`No reversal found for transaction '${txnId}'`, 404);
        return reversal;
    }

    // ── Get reversals by status ────────────────────────────────────────
    async getReversalsByStatus(status) {
        return reversalRequestRepository.findByStatus(status);
    }

    // ─────────────────────────────────────────────
    // Private — execute debit/credit reversal
    // ─────────────────────────────────────────────

    async _processReversal(reversal, txn) {
        const { id: reversalId, txnId, reversalRrn } = reversal;
        const { senderAccountId, receiverAccountId, amount } = txn;
        const refTag = `REV-${reversalRrn}`;

        // Mark PROCESSING
        await reversalRequestRepository.updateStatus(reversalId, "PROCESSING");
        await switchLogRepository.info(txnId, "REVERSAL_PROCESSING", "Starting reversal debit/credit");

        // ── Step A: Debit the receiver (undo the original credit) ───────
        try {
            const debitRes = await debitAccount(receiverAccountId, amount.toString(), refTag);
            if (!debitRes.success) {
                await reversalRequestRepository.markFailed(reversalId, `Receiver debit failed: ${debitRes.message}`);
                await switchTransactionRepository.markFailed(txnId, `Reversal failed: ${debitRes.message}`, "REVERSAL_DEBIT_FAILED");
                await switchLogRepository.error(txnId, "REVERSAL_DEBIT_FAILED", debitRes.message, debitRes);
                throw new AppError(`Reversal debit failed: ${debitRes.message}`, 502);
            }
            await switchLogRepository.info(txnId, "REVERSAL_DEBIT_SUCCESS", `₹${amount} debited back from receiver ${receiverAccountId}`);
        } catch (err) {
            if (err instanceof AppError) throw err;
            await reversalRequestRepository.markFailed(reversalId, err.message);
            await switchTransactionRepository.markFailed(txnId, err.message, "REVERSAL_DEBIT_ERROR");
            await switchLogRepository.error(txnId, "REVERSAL_DEBIT_ERROR", err.message);
            throw new AppError(`Reversal debit error: ${err.message}`, 502);
        }

        // ── Step B: Credit the sender (return the original debit) ───────
        try {
            const creditRes = await creditAccount(senderAccountId, amount.toString(), refTag);
            if (!creditRes.success) {
                // Critical — debit done but credit failed. Manual intervention required.
                await reversalRequestRepository.markFailed(reversalId, `Sender credit failed: ${creditRes.message}`);
                await switchLogRepository.error(txnId, "REVERSAL_CREDIT_FAILED",
                    `⚠️ CRITICAL: Receiver debited but sender credit failed! Manual fix required.`,
                    creditRes
                );
                throw new AppError(`Reversal credit failed: ${creditRes.message}. Manual intervention required.`, 502);
            }
            await switchLogRepository.info(txnId, "REVERSAL_CREDIT_SUCCESS", `₹${amount} returned to sender ${senderAccountId}`);
        } catch (err) {
            if (err instanceof AppError) throw err;
            await reversalRequestRepository.markFailed(reversalId, err.message);
            await switchLogRepository.error(txnId, "REVERSAL_CREDIT_ERROR", err.message);
            throw new AppError(`Reversal credit error: ${err.message}`, 502);
        }

        // ── Step C: Mark both as SUCCESS / REVERSED ─────────────────────
        await reversalRequestRepository.markSuccess(reversalId);
        await switchTransactionRepository.markReversed(txnId);
        await switchLogRepository.info(txnId, "REVERSAL_COMPLETE", `Transaction reversed successfully. RRN: ${reversalRrn}`);

        return await reversalRequestRepository.findById(reversalId);
    }
}

export default new ReversalService();
