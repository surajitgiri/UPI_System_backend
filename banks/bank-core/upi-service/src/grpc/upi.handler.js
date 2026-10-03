// upi-service/src/grpc/upi.handler.js
// gRPC handler implementations — called by the gRPC server

import vpaRepository           from "../repositories/vpa.repository.js";
import upiTransactionRepository from "../repositories/upiTransaction.repository.js";
import vpaService              from "../services/vpa.service.js";
import { randomUUID }          from "crypto";

// ─────────────────────────────────────────────
// Helper — map Prisma Vpa → gRPC VpaData
// ─────────────────────────────────────────────
function mapVpa(vpa) {
    return {
        id:        vpa.id,
        vpa:       vpa.vpa,
        handle:    vpa.handle,
        userId:    vpa.userId,
        accountId: vpa.accountId,
        bankCode:  vpa.bankCode,
        isPrimary: vpa.isPrimary,
        isDefault: vpa.isDefault,
        status:    vpa.status,
    };
}

// ─────────────────────────────────────────────
// Helper — map Prisma UpiTransaction → gRPC UpiTransactionData
// ─────────────────────────────────────────────
function mapTransaction(txn) {
    return {
        id:                txn.id,
        rrn:               txn.rrn,
        txnRef:            txn.txnRef,
        type:              txn.type,
        status:            txn.status,
        senderVpaId:       txn.senderVpaId,
        receiverVpaId:     txn.receiverVpaId,
        senderAccountId:   txn.senderAccountId,
        receiverAccountId: txn.receiverAccountId,
        amount:            txn.amount?.toString() ?? "0",
        currency:          txn.currency,
        description:       txn.description ?? "",
        failureReason:     txn.failureReason ?? "",
        initiatedAt:       txn.initiatedAt?.toISOString() ?? "",
        completedAt:       txn.completedAt?.toISOString() ?? "",
    };
}

// ─────────────────────────────────────────────
// GetVpaByAddress
// Resolves "suraj@okicici" → VPA record
// ─────────────────────────────────────────────
export async function getVpaByAddress(call, callback) {
    try {
        const { vpaAddress } = call.request;

        if (!vpaAddress) {
            return callback(null, {
                success: false,
                message: "vpaAddress is required",
                data:    null,
            });
        }

        const vpa = await vpaRepository.findByVpa(vpaAddress);

        if (!vpa) {
            return callback(null, {
                success: false,
                message: `VPA '${vpaAddress}' not found`,
                data:    null,
            });
        }

        return callback(null, {
            success: true,
            message: "VPA found",
            data:    mapVpa(vpa),
        });
    } catch (err) {
        console.error("[gRPC] getVpaByAddress error:", err.message);
        return callback(err);
    }
}

// ─────────────────────────────────────────────
// ValidateVpa
// Returns isActive + accountId for routing
// ─────────────────────────────────────────────
export async function validateVpa(call, callback) {
    try {
        const { vpaAddress } = call.request;

        const vpa = await vpaRepository.findByVpa(vpaAddress);

        if (!vpa) {
            return callback(null, {
                success:   false,
                message:   `VPA '${vpaAddress}' not found`,
                isActive:  false,
                accountId: "",
            });
        }

        return callback(null, {
            success:   true,
            message:   `VPA is ${vpa.status}`,
            isActive:  vpa.status === "ACTIVE",
            accountId: vpa.accountId,
        });
    } catch (err) {
        console.error("[gRPC] validateVpa error:", err.message);
        return callback(err);
    }
}

// ─────────────────────────────────────────────
// VerifyUpiPin
// Used by orchestrator before debiting
// ─────────────────────────────────────────────
export async function verifyUpiPin(call, callback) {
    try {
        const { vpaId, pin, ipAddress, userAgent } = call.request;

        try {
            await vpaService.verifyPin(vpaId, pin, ipAddress, userAgent);

            return callback(null, {
                success:  true,
                message:  "PIN verified successfully",
                verified: true,
            });
        } catch (pinErr) {
            // PIN wrong / locked — not a server error, return gracefully
            return callback(null, {
                success:  false,
                message:  pinErr.message,
                verified: false,
            });
        }
    } catch (err) {
        console.error("[gRPC] verifyUpiPin error:", err.message);
        return callback(err);
    }
}

// ─────────────────────────────────────────────
// RecordTransaction
// Called by orchestrator after bank settles
// Idempotent — safe to call multiple times with same RRN
// ─────────────────────────────────────────────
export async function recordTransaction(call, callback) {
    try {
        const {
            rrn, txnRef, type,
            senderVpaId, receiverVpaId,
            senderAccountId, receiverAccountId,
            amount, currency, description,
            bankTxnId, npciTxnId,
        } = call.request;

        // Deduplicate by RRN
        const existing = await upiTransactionRepository.findByRrn(rrn);
        if (existing) {
            return callback(null, {
                success: true,
                message: "Transaction already recorded",
                data:    mapTransaction(existing),
            });
        }

        const txn = await upiTransactionRepository.create({
            rrn,
            txnRef:            txnRef || randomUUID(),
            type:              type   || "PAY",
            status:            "SUCCESS",
            senderVpaId,
            receiverVpaId,
            senderAccountId,
            receiverAccountId,
            amount:            parseFloat(amount),
            currency:          currency    || "INR",
            description:       description || null,
            bankTxnId:         bankTxnId   || null,
            npciTxnId:         npciTxnId   || null,
            completedAt:       new Date(),
        });

        return callback(null, {
            success: true,
            message: "Transaction recorded successfully",
            data:    mapTransaction(txn),
        });
    } catch (err) {
        console.error("[gRPC] recordTransaction error:", err.message);
        return callback(err);
    }
}

// ─────────────────────────────────────────────
// GetTransaction
// ─────────────────────────────────────────────
export async function getTransaction(call, callback) {
    try {
        const { id } = call.request;

        const txn = await upiTransactionRepository.findById(id);

        if (!txn) {
            return callback(null, {
                success: false,
                message: "Transaction not found",
                data:    null,
            });
        }

        return callback(null, {
            success: true,
            message: "Transaction found",
            data:    mapTransaction(txn),
        });
    } catch (err) {
        console.error("[gRPC] getTransaction error:", err.message);
        return callback(err);
    }
}
