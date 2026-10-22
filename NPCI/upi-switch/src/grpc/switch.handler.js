// upi-switch/src/grpc/switch.handler.js
// gRPC handlers — thin wrappers around switchService / reversalService

import switchService from "../services/switch.service.js";
import reversalService from "../services/reversal.service.js";

const str = (v) => (v === null || v === undefined ? "" : v.toString());
const iso = (d) => (d ? new Date(d).toISOString() : "");

function toTxn(t) {
    if (!t) return null;

    return {
        id: str(t.id),
        rrn: str(t.rrn),
        txnRef: str(t.txnRef),
        npciTxnId: str(t.npciTxnId),
        type: str(t.type),
        status: str(t.status),
        senderVpa: str(t.senderVpa),
        receiverVpa: str(t.receiverVpa),
        senderBankCode: str(t.senderBankCode),
        receiverBankCode: str(t.receiverBankCode),
        senderAccountId: str(t.senderAccountId),
        receiverAccountId: str(t.receiverAccountId),
        amount: str(t.amount),
        currency: str(t.currency),
        description: str(t.description),
        failureReason: str(t.failureReason),
        failureCode: str(t.failureCode),
        createdAt: iso(t.createdAt),
        updatedAt: iso(t.updatedAt),
    };
}


function toReversal(r) {
    if (!r) return null;
    return {
        id: str(r.id),
        txnId: str(r.txnId),
        reversalRrn: str(r.reversalRrn),
        reason: str(r.reason),
        raisedBy: str(r.raisedBy),
        remarks: str(r.remarks),
        status: str(r.status),
        createdAt: iso(r.createdAt),
        updatedAt: iso(r.updatedAt),
    };
}

// Wraps a handler so errors become { success:false, message } instead of gRPC errors
const wrap = (fn) => async (call, callback) => {
    try {
        callback(null, await fn(call.request));
    } catch (error) {
        callback(null, { success: false, message: error.message || "Internal error", data: null });
    }
};

export const processPayment = wrap(async (req) => {
    const txn = await switchService.initiatePayment({
        txnRef: req.txnRef || undefined,
        type: req.type || "PAY",
        senderVpa: req.senderVpa,
        receiverVpa: req.receiverVpa,
        amount: req.amount,
        currency: req.currency || "INR",
        description: req.description || undefined,
        remarks: req.remarks || undefined,
        senderPsp: req.senderPsp || undefined,
        receiverPsp: req.receiverPsp || undefined,
    });
    return { success: true, message: "Payment processed", data: toTxn(txn) };
});

export const getTransaction = wrap(async (req) => {
    const txn = await switchService.getTransaction(req.id);
    return { success: true, message: "Transaction fetched", data: toTxn(txn) };
});

export const getTransactionByRrn = wrap(async (req) => {
    const txn = await switchService.getByRrn(req.rrn);
    return { success: true, message: "Transaction fetched", data: toTxn(txn) };
});

export const initiateReversal = wrap(async (req) => {
    const reversal = await reversalService.initiateReversal({
        txnId: req.txnId,
        reason: req.reason,
        raisedBy: req.raisedBy || "system",
        remarks: req.remarks || undefined,
    });
    return { success: true, message: "Reversal processed", data: toReversal(reversal) };
});

export const getReversal = wrap(async (req) => {
    const reversal = await reversalService.getReversalById(req.id);
    return { success: true, message: "Reversal fetched", data: toReversal(reversal) };
});
