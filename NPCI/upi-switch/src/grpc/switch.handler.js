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