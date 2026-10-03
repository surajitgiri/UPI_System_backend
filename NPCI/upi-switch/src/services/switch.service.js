// upi-switch/src/services/switch.service.js
// Core NPCI switch logic:
//   1. Duplicate RRN check
//   2. Limit enforcement
//   3. VPA resolution via participant-routing
//   4. Debit sender via account-service
//   5. Credit receiver via account-service
//   6. Record transaction via upi-service
//   7. Full audit trail via switchLog

import { randomUUID }                 from "crypto";
import AppError                       from "../errors/AppError.js";
import switchTransactionRepository    from "../repositories/switchTransaction.repository.js";
import switchLogRepository            from "../repositories/switchLog.repository.js";
import switchLimitRepository          from "../repositories/switchLimit.repository.js";
import { lookupVpa }                  from "../grpc/clients/participantClient.js";
import { debitAccount, creditAccount } from "../grpc/clients/account.client.js";
import { recordTransaction }          from "../grpc/clients/upiClient.js";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function generateRrn() {
    // 12-digit numeric RRN (NPCI standard)
    return Date.now().toString().slice(-12).padStart(12, "0");
}

function generateNpciTxnId() {
    return `NPCI${Date.now()}${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
}

// ─────────────────────────────────────────────
// SwitchService
// ─────────────────────────────────────────────

class SwitchService {

    // ── Process a new payment (PAY / COLLECT) ─────────────────────────
    async initiatePayment({
        txnRef,
        type = "PAY",
        senderVpa,
        receiverVpa,
        amount,
        currency = "INR",
        description,
        remarks,
        senderPsp,
        receiverPsp,
    }) {
        const rrn = generateRrn();
        let txn   = null;

        // ── Step 1: Duplicate RRN check ─────────────────────────────────
        const ref = txnRef || randomUUID();
        const existingByRef = await switchTransactionRepository.findByTxnRef(ref);
        if (existingByRef) {
            throw new AppError(`Duplicate txnRef '${ref}'`, 409);
        }

        // ── Step 2: Resolve sender VPA via participant-routing ──────────
        const senderInfo = await lookupVpa(senderVpa);
        if (!senderInfo.success || !senderInfo.data) {
            throw new AppError(`Sender VPA '${senderVpa}' not found in NPCI registry`, 404);
        }

        const receiverInfo = await lookupVpa(receiverVpa);
        if (!receiverInfo.success || !receiverInfo.data) {
            throw new AppError(`Receiver VPA '${receiverVpa}' not found in NPCI registry`, 404);
        }

        const { accountId: senderAccountId, bankCode: senderBankCode } = senderInfo.data;
        const { accountId: receiverAccountId, bankCode: receiverBankCode } = receiverInfo.data;

        // ── Step 3: Enforce sender bank limits ─────────────────────────
        await this._enforceLimits(senderBankCode, amount);

        // ── Step 4: Create switch transaction (RECEIVED) ────────────────
        txn = await switchTransactionRepository.create({
            rrn,
            txnRef: ref,
            type,
            status:            "RECEIVED",
            senderVpa,
            senderBankCode,
            senderAccountId,
            receiverVpa,
            receiverBankCode,
            receiverAccountId,
            amount,
            currency,
            description,
            remarks,
            senderPsp:  senderPsp  || null,
            receiverPsp: receiverPsp || null,
        });

        await switchLogRepository.info(txn.id, "TXN_RECEIVED", `Payment received: ${senderVpa} → ${receiverVpa} ₹${amount}`);

        // ── Step 5: Mark ROUTING ────────────────────────────────────────
        await switchTransactionRepository.markRouted(txn.id);
        await switchLogRepository.info(txn.id, "ROUTING_COMPLETE", `Routed: sender=${senderBankCode}, receiver=${receiverBankCode}`);

        // ── Step 6: Debit sender ────────────────────────────────────────
        try {
            const debitRes = await debitAccount(senderAccountId, amount.toString(), ref);
            if (!debitRes.success) {
                await switchTransactionRepository.markFailed(txn.id, debitRes.message, "DEBIT_FAILED");
                await switchLogRepository.error(txn.id, "DEBIT_FAILED", debitRes.message, debitRes);
                throw new AppError(`Debit failed: ${debitRes.message}`, 400);
            }
            await switchTransactionRepository.markDebited(txn.id);
            await switchLogRepository.info(txn.id, "DEBIT_SUCCESS", `₹${amount} debited from ${senderAccountId}`, { balance: debitRes.updatedBalance });
        } catch (err) {
            if (err instanceof AppError) throw err;
            await switchTransactionRepository.markFailed(txn.id, err.message, "DEBIT_ERROR");
            await switchLogRepository.error(txn.id, "DEBIT_ERROR", err.message);
            throw new AppError(`Debit error: ${err.message}`, 502);
        }

        // ── Step 7: Credit receiver ─────────────────────────────────────
        const npciTxnId = generateNpciTxnId();
        try {
            const creditRes = await creditAccount(receiverAccountId, amount.toString(), ref);
            if (!creditRes.success) {
                // Debit succeeded but credit failed → trigger auto-reversal
                await this._triggerAutoReversal(txn.id, senderAccountId, amount, ref, "TECHNICAL_FAILURE");
                throw new AppError(`Credit failed: ${creditRes.message}. Auto-reversal initiated.`, 502);
            }
            await switchTransactionRepository.markSettled(txn.id, npciTxnId);
            await switchLogRepository.info(txn.id, "CREDIT_SUCCESS", `₹${amount} credited to ${receiverAccountId}`, { balance: creditRes.updatedBalance });
        } catch (err) {
            if (err instanceof AppError) throw err;
            await this._triggerAutoReversal(txn.id, senderAccountId, amount, ref, "TECHNICAL_FAILURE");
            throw new AppError(`Credit error: ${err.message}. Auto-reversal initiated.`, 502);
        }

        // ── Step 8: Record in upi-service ───────────────────────────────
        try {
            await recordTransaction({
                rrn,
                txnRef:            ref,
                type,
                senderVpaId:       senderInfo.data.vpaId,
                receiverVpaId:     receiverInfo.data.vpaId,
                senderAccountId,
                receiverAccountId,
                amount:            amount.toString(),
                currency,
                description,
                bankTxnId:         rrn,
                npciTxnId,
            });
            await switchLogRepository.info(txn.id, "UPI_RECORDED", "Transaction recorded in upi-service");
        } catch (err) {
            // Non-fatal — switch record is authoritative
            await switchLogRepository.warn(txn.id, "UPI_RECORD_FAILED", err.message);
        }

        return await switchTransactionRepository.findById(txn.id);
    }

    // ── Get transaction by ID ──────────────────────────────────────────
    async getTransaction(id) {
        const txn = await switchTransactionRepository.findById(id);
        if (!txn) throw new AppError("Switch transaction not found", 404);
        return txn;
    }

    // ── Get all transactions ───────────────────────────────────────────
    async getAllTransactions() {
        return switchTransactionRepository.findAll();
    }

    // ── Get by RRN ─────────────────────────────────────────────────────
    async getByRrn(rrn) {
        const txn = await switchTransactionRepository.findByRrn(rrn);
        if (!txn) throw new AppError(`Transaction with RRN '${rrn}' not found`, 404);
        return txn;
    }

    // ── Get by status ──────────────────────────────────────────────────
    async getByStatus(status) {
        return switchTransactionRepository.findByStatus(status);
    }

    // ─────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────

    async _enforceLimits(bankCode, amount) {
        const limit = await switchLimitRepository.findByBankCode(bankCode);

        if (!limit || !limit.isActive) return; // no limit configured → pass

        // Single transaction limit
        if (parseFloat(amount) > parseFloat(limit.maxSingleTxnAmt)) {
            throw new AppError(
                `Amount ₹${amount} exceeds single transaction limit of ₹${limit.maxSingleTxnAmt} for bank ${bankCode}`,
                400
            );
        }

        // Daily count limit
        const today     = new Date(); today.setHours(0, 0, 0, 0);
        const tomorrow  = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

        const dailyCount = await switchTransactionRepository.countByBankAndDate(bankCode, today, tomorrow);
        if (dailyCount >= limit.maxDailyCount) {
            throw new AppError(
                `Bank ${bankCode} has reached daily transaction limit of ${limit.maxDailyCount}`,
                429
            );
        }

        // Daily amount limit
        const dailySum = await switchTransactionRepository.sumByBankAndDate(bankCode, today, tomorrow);
        const usedAmt  = parseFloat(dailySum._sum.amount || 0);
        if (usedAmt + parseFloat(amount) > parseFloat(limit.maxDailyAmt)) {
            throw new AppError(
                `Bank ${bankCode} daily amount limit of ₹${limit.maxDailyAmt} would be exceeded`,
                429
            );
        }
    }

    async _triggerAutoReversal(txnId, senderAccountId, amount, txnRef, reason) {
        try {
            await switchTransactionRepository.updateStatus(txnId, "REVERSAL_PENDING");
            await switchLogRepository.warn(txnId, "AUTO_REVERSAL_TRIGGERED", `Reversing ₹${amount} to ${senderAccountId}`);

            const creditBack = await creditAccount(senderAccountId, amount.toString(), `REV-${txnRef}`);
            if (creditBack.success) {
                await switchTransactionRepository.markReversed(txnId);
                await switchLogRepository.info(txnId, "AUTO_REVERSAL_SUCCESS", `₹${amount} returned to ${senderAccountId}`);
            } else {
                await switchLogRepository.error(txnId, "AUTO_REVERSAL_FAILED", creditBack.message);
            }
        } catch (err) {
            await switchLogRepository.error(txnId, "AUTO_REVERSAL_ERROR", err.message);
        }
    }
}

export default new SwitchService();
